import { Event, User } from "../types";

interface UserInteraction {
  userId: number;
  eventId: number;
  interactionType: 'view' | 'booking' | 'favorite';
  timestamp: Date;
}

// Mock interactions history (would be stored in DB in a real implementation)
let userInteractions: UserInteraction[] = [];

/**
 * Record a user interaction with an event to improve recommendations
 */
export const recordInteraction = (userId: number, eventId: number, interactionType: 'view' | 'booking' | 'favorite') => {
  userInteractions.push({
    userId,
    eventId,
    interactionType,
    timestamp: new Date()
  });
};

/**
 * Get recommended events for a user based on their preferences and interactions
 * In a real implementation, this would call a more sophisticated AI service
 */
export const getRecommendedEvents = async (userId: number): Promise<Event[]> => {
  try {
    const response = await fetch(`/api/recommendations/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

/**
 * Calculate similarity between two users based on their interactions
 * Used for collaborative filtering (would be more sophisticated in a real implementation)
 */
const calculateUserSimilarity = (userIdA: number, userIdB: number): number => {
  const userAInteractions = userInteractions.filter(i => i.userId === userIdA);
  const userBInteractions = userInteractions.filter(i => i.userId === userIdB);
  
  const userAEventIds = new Set(userAInteractions.map(i => i.eventId));
  const userBEventIds = new Set(userBInteractions.map(i => i.eventId));
  
  // Count common events
  let commonEvents = 0;
  userAEventIds.forEach(eventId => {
    if (userBEventIds.has(eventId)) {
      commonEvents++;
    }
  });
  
  // Jaccard similarity
  const totalUniqueEvents = new Set([...userAEventIds, ...userBEventIds]).size;
  return totalUniqueEvents > 0 ? commonEvents / totalUniqueEvents : 0;
};

/**
 * Process user preferences to improve recommendations
 * In a real implementation, this would involve AI models for content-based filtering
 */
export const processUserPreferences = (preferences: string[], events: Event[]): Event[] => {
  // Simple filtering based on categories
  if (!preferences || preferences.length === 0) {
    return events;
  }
  
  // Filter events by user preferred categories and sort by remaining tickets (higher demand first)
  return events
    .filter(event => preferences.includes(event.category))
    .sort((a, b) => (a.capacity - a.remainingTickets) / a.capacity - (b.capacity - b.remainingTickets) / b.capacity);
};
