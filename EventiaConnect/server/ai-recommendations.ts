import OpenAI from "openai";
import { Event, User } from "@shared/schema";
import { storage } from "./storage";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate event recommendations for a user based on their preferences and past interactions
 */
export async function generateRecommendations(userId: number): Promise<Event[]> {
  try {
    // Get user data with preferences
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get all available events
    const allEvents = await storage.getEvents();
    
    // If user has no preferences or there are few events, return trending or featured events
    if (!user.preferences || user.preferences.length === 0 || allEvents.length < 5) {
      return await storage.getTrendingEvents();
    }

    // Get user's tickets to analyze past behavior
    const userTickets = await storage.getTicketsByUserId(userId);
    const attendedEventIds = userTickets.map(ticket => ticket.eventId);
    const attendedEvents = allEvents.filter(event => attendedEventIds.includes(event.id));

    // Create a prompt for GPT-4o to generate recommendations
    const prompt = createRecommendationPrompt(user, attendedEvents, allEvents);

    // Call OpenAI API for recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an AI event recommendation specialist. Your task is to recommend events to users based on their preferences and past event attendance."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response to get event IDs
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate recommendations");
    }

    const result = JSON.parse(content);
    const recommendedEventIds = result.recommendedEvents || [];

    // Get the recommended events from the database
    const recommendedEvents = allEvents.filter(event => 
      recommendedEventIds.includes(event.id) && !attendedEventIds.includes(event.id)
    );

    // If we don't have enough recommendations, add some trending events
    if (recommendedEvents.length < 5) {
      const trendingEvents = await storage.getTrendingEvents();
      const additionalEvents = trendingEvents.filter(event => 
        !recommendedEvents.some(rec => rec.id === event.id) && 
        !attendedEventIds.includes(event.id)
      );
      
      return [...recommendedEvents, ...additionalEvents].slice(0, 8);
    }

    return recommendedEvents.slice(0, 8);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    // Fallback to trending events in case of error
    return await storage.getTrendingEvents();
  }
}

/**
 * Create a prompt for the OpenAI API based on user data and events
 */
function createRecommendationPrompt(user: User, attendedEvents: Event[], allEvents: Event[]): string {
  const eventData = allEvents.map(event => ({
    id: event.id,
    title: event.title,
    category: event.category,
    description: event.description.slice(0, 100) + (event.description.length > 100 ? '...' : ''),
    city: event.city,
    trending: event.trending,
    featured: event.featured
  }));

  const userAttendedEvents = attendedEvents.map(event => ({
    id: event.id,
    title: event.title,
    category: event.category
  }));

  return `
Please analyze the following data and recommend events for the user.

USER PROFILE:
Username: ${user.username}
Preferences: ${user.preferences?.join(', ') || 'None specified'}

PAST ATTENDED EVENTS:
${JSON.stringify(userAttendedEvents, null, 2)}

AVAILABLE EVENTS:
${JSON.stringify(eventData, null, 2)}

Based on the user's preferences and past attended events, recommend up to 8 events that this user might be interested in.
Consider category preferences, location, and trending/featured status.
Do not recommend events the user has already attended.

Provide your response in JSON format with an array of event IDs:
{
  "recommendedEvents": [1, 2, 3, 4]
}
`;
}

/**
 * Get collaborative filtering recommendations based on similar users
 */
export async function getCollaborativeRecommendations(userId: number): Promise<Event[]> {
  try {
    // This is a simplified implementation of collaborative filtering
    // In a real system, this would use a more sophisticated algorithm
    
    // Get current user's tickets
    const userTickets = await storage.getTicketsByUserId(userId);
    if (userTickets.length === 0) {
      return await storage.getFeaturedEvents();
    }
    
    // Get all events and all users
    const allEvents = await storage.getEvents();
    
    // Get events the user has already booked
    const userEventIds = new Set(userTickets.map(ticket => ticket.eventId));
    
    // Find events in same categories as the user's booked events
    const userEvents = allEvents.filter(event => userEventIds.has(event.id));
    const userCategories = new Set(userEvents.map(event => event.category));
    
    // Find events in the same categories that the user hasn't booked yet
    const recommendedEvents = allEvents.filter(event => 
      userCategories.has(event.category) && !userEventIds.has(event.id)
    );
    
    return recommendedEvents.slice(0, 5);
  } catch (error) {
    console.error("Error generating collaborative recommendations:", error);
    return await storage.getFeaturedEvents();
  }
}