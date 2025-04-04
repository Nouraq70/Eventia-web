import { users, events, tickets, type User, type InsertUser, type Event, type InsertEvent, type Ticket, type InsertTicket } from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";
import session from "express-session";
import memorystore from "memorystore";
import { saudiEvents, trendingVideos } from "./event-data";

const MemoryStore = memorystore(session);

export interface IStorage {
  // User Methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event Methods
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByCategory(category: string): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  getTrendingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Ticket Methods
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  
  // Recommendation Methods
  getRecommendedEvents(userId: number): Promise<Event[]>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed the database if it's empty
    this.initializeDatabase();
  }
  
  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure preferences and profilePicture are properly typed
    const userValues = {
      ...insertUser,
      preferences: insertUser.preferences && insertUser.preferences.length ? 
        (typeof insertUser.preferences === 'string' ? [insertUser.preferences] : 
          Array.isArray(insertUser.preferences) ? 
            [...insertUser.preferences.map((p: any) => String(p))] : null) : null,
      profilePicture: insertUser.profilePicture || null
    };
    
    const result = await db.insert(users).values(userValues).returning();
    return result[0];
  }

  // Event Methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.category, category));
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.featured, true));
  }

  async getTrendingEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.trending, true));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    // Ensure endDate and other optional fields are properly typed
    const eventValues = {
      ...insertEvent,
      endDate: insertEvent.endDate || null,
      trending: insertEvent.trending || null,
      featured: insertEvent.featured || null,
      videoUrl: insertEvent.videoUrl || null
    };
    
    const result = await db.insert(events).values(eventValues).returning();
    return result[0];
  }

  // Ticket Methods
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    // Start a transaction to update the event's remaining tickets
    const ticket = await db.transaction(async (tx) => {
      // Get the event to check available tickets
      const event = await tx.select().from(events).where(eq(events.id, insertTicket.eventId)).limit(1);
      
      if (!event[0] || event[0].remainingTickets < insertTicket.quantity) {
        throw new Error('Not enough tickets available');
      }
      
      // Update remaining tickets
      await tx.update(events)
        .set({ remainingTickets: event[0].remainingTickets - insertTicket.quantity })
        .where(eq(events.id, insertTicket.eventId));
      
      // Create ticket
      const result = await tx.insert(tickets).values(insertTicket).returning();
      return result[0];
    });
    
    return ticket;
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.userId, userId));
  }

  // Recommendation Methods
  async getRecommendedEvents(userId: number): Promise<Event[]> {
    const user = await this.getUser(userId);
    
    if (!user || !user.preferences || user.preferences.length === 0) {
      return this.getFeaturedEvents();
    }
    
    // Get events that match user preferences
    return await db.select().from(events).where(inArray(events.category, user.preferences));
  }
  
  // Initialize database with seed data if needed
  private async initializeDatabase() {
    // Check if events table is empty
    const existingEvents = await db.select().from(events).limit(1);
    
    if (existingEvents.length === 0) {
      console.log("Seeding database with initial events...");
      await this.seedEvents();
    }
  }
  
  // Seed data for the database
  private async seedEvents() {
    // استخدام قائمة الفعاليات السعودية من ملف event-data
    const eventData: InsertEvent[] = saudiEvents;

    // Insert all events
    try {
      await db.transaction(async (tx) => {
        for (const event of eventData) {
          await tx.insert(events).values(event);
        }
      });
      console.log("Database seeded successfully with events");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
}

// Keep the MemStorage implementation for backup/reference
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private tickets: Map<number, Ticket>;
  private userIdCounter: number = 1;
  private eventIdCounter: number = 1;
  private ticketIdCounter: number = 1;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.tickets = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.seedEvents();
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      preferences: insertUser.preferences && insertUser.preferences.length ? 
        (typeof insertUser.preferences === 'string' ? [insertUser.preferences] : 
          Array.isArray(insertUser.preferences) ? 
            [...insertUser.preferences.map((p: any) => String(p))] : null) : null,
      profilePicture: insertUser.profilePicture || null 
    };
    this.users.set(id, user);
    return user;
  }

  // Event Methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.category === category
    );
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.featured
    );
  }

  async getTrendingEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.trending
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const createdAt = new Date();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt,
      endDate: insertEvent.endDate || null,
      trending: insertEvent.trending || null,
      featured: insertEvent.featured || null,
      videoUrl: insertEvent.videoUrl || null
    };
    this.events.set(id, event);
    return event;
  }

  // Ticket Methods
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const createdAt = new Date();
    const ticket: Ticket = { ...insertTicket, id, createdAt };
    this.tickets.set(id, ticket);
    
    // Update remaining tickets for the event
    const event = this.events.get(insertTicket.eventId);
    if (event) {
      event.remainingTickets -= insertTicket.quantity;
      this.events.set(event.id, event);
    }
    
    return ticket;
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.userId === userId
    );
  }

  // Recommendation Methods
  async getRecommendedEvents(userId: number): Promise<Event[]> {
    const user = await this.getUser(userId);
    if (!user || !user.preferences) {
      return this.getFeaturedEvents();
    }
    
    // Simple recommendation: return events matching user preferences
    return Array.from(this.events.values()).filter(event => 
      user.preferences && user.preferences.includes(event.category)
    );
  }

  // Seed data for development
  private seedEvents() {
    // استخدام قائمة الفعاليات السعودية من ملف event-data
    for (const event of saudiEvents) {
      this.createEvent(event);
    }
  }
}

// Use the database storage
export const storage = new DatabaseStorage();
