import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertTicketSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { generateRecommendations, getCollaborativeRecommendations } from "./ai-recommendations";
import { setupAuth } from "./auth";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Specific endpoints with fixed paths must come before variable paths
  // Get featured events
  app.get("/api/events/featured", async (req, res) => {
    try {
      const events = await storage.getFeaturedEvents();
      res.json(events);
    } catch (error) {
      // If there's an error, just return an empty array to prevent 404
      res.json([]);
    }
  });

  // Get trending events
  app.get("/api/events/trending", async (req, res) => {
    try {
      const events = await storage.getTrendingEvents();
      res.json(events);
    } catch (error) {
      // If there's an error, just return an empty array to prevent 404
      res.json([]);
    }
  });

  // Get events by category
  app.get("/api/events/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const events = await storage.getEventsByCategory(category);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by category" });
    }
  });

  // Get event by ID (this must come after the specific paths above)
  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Create a new event
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Get recommended events (basic recommendations from storage)
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getRecommendedEvents(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommended events" });
    }
  });
  
  // Get AI-powered recommendations using OpenAI
  app.get("/api/ai-recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await generateRecommendations(userId);
      res.json(events);
    } catch (error) {
      console.error("Error in AI recommendations:", error);
      res.status(500).json({ message: "Failed to fetch AI recommendations" });
    }
  });
  
  // Get collaborative recommendations based on similar users
  app.get("/api/collaborative-recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await getCollaborativeRecommendations(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborative recommendations" });
    }
  });

  // User routes are now handled by auth.ts

  // Create Stripe PaymentIntent for checkout process
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Payment service unavailable" });
      }

      const { eventId, quantity } = req.body;
      const userId = req.user!.id;

      // Validate input
      if (!eventId || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Get event to calculate price
      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if enough tickets are available
      if (event.remainingTickets < quantity) {
        return res
          .status(400)
          .json({ message: "Not enough tickets available" });
      }

      // Calculate price in Saudi Riyals
      const totalPrice = event.price * quantity;
      // Convert to cents/piasters for Stripe (smallest currency unit)
      const amount = Math.round(totalPrice * 100);

      try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "sar", // Saudi Arabian Riyal
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            eventId: eventId.toString(),
            userId: userId.toString(),
            quantity: quantity.toString(),
            eventName: event.title,
          },
        });

        res.json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (stripeError: any) {
        console.error(`Stripe error: ${stripeError.message}`);
        res.status(400).json({ message: stripeError.message });
      }
    } catch (error: any) {
      console.error(`Error creating payment intent: ${error.message}`);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Webhook for Stripe events
  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).end();
    }

    const payload = req.body;
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Only verify the signature if we have an endpoint secret
    let event;
    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      event = payload;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Extract metadata
        const { eventId, userId, quantity } = paymentIntent.metadata;
        
        if (eventId && userId && quantity) {
          // Generate booking reference
          const bookingReference = `EV-${Date.now().toString().slice(-6)}-${Math.floor(
            Math.random() * 1000
          )}`;
          
          try {
            // Create ticket with confirmed status
            await storage.createTicket({
              userId: parseInt(userId),
              eventId: parseInt(eventId),
              quantity: parseInt(quantity),
              totalPrice: paymentIntent.amount / 100, // Convert back from cents
              status: "confirmed",
              paymentMethod: "credit_card", // Default to credit card for Stripe
              bookingReference,
            });
            
            console.log(`Payment succeeded and ticket created: ${bookingReference}`);
          } catch (err: any) {
            console.error(`Error creating ticket after payment: ${err.message}`);
          }
        }
        break;
        
      case 'payment_intent.payment_failed':
        console.error(`❌ Payment failed: ${event.data.object.last_payment_error?.message}`);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({received: true});
  });

  // Book tickets
  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      
      // Verify event exists and has enough tickets
      const event = await storage.getEventById(ticketData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.remainingTickets < ticketData.quantity) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      // Create ticket
      const ticket = await storage.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to book tickets" });
    }
  });

  // Get user tickets
  app.get("/api/users/:userId/tickets", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tickets = await storage.getTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tickets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
