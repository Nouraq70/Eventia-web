import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  profilePicture: text("profile_picture"),
  preferences: json("preferences").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  price: integer("price").notNull(),
  capacity: integer("capacity").notNull(),
  remainingTickets: integer("remaining_tickets").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  organizer: text("organizer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  featured: boolean("featured").default(false),
  trending: boolean("trending").default(false),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Tickets Table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull(),
  paymentMethod: text("payment_method").notNull(),
  bookingReference: text("booking_reference").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
