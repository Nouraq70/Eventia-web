// Event Types
export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  date: string | Date;
  endDate?: string | Date;
  price: number;
  capacity: number;
  remainingTickets: number;
  category: EventCategory;
  imageUrl: string;
  videoUrl?: string;
  organizer: string;
  featured: boolean;
  trending: boolean;
  createdAt: string | Date;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  preferences?: string[];
  createdAt: string | Date;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  preferences?: string[];
}

// Ticket Types
export interface Ticket {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalPrice: number;
  status: TicketStatus;
  paymentMethod: PaymentMethod;
  bookingReference: string;
  createdAt: string | Date;
}

export interface BookingRequest {
  userId: number;
  eventId: number;
  quantity: number;
  paymentMethod: PaymentMethod;
}

// Enum Types
export type EventCategory = "ثقافي" | "رياضي" | "موسيقي" | "تعليمي" | "ترفيهي" | "عائلي" | "أعمال";

export type TicketStatus = "confirmed" | "pending" | "cancelled";

export type PaymentMethod = "apple_pay" | "stc_pay" | "mada" | "credit_card";

export type Language = "ar" | "en" | "fr" | "es" | "zh" | "ur" | "hi" | "tl";

export interface VideoPreviewProps {
  url?: string;
  thumbnailUrl: string;
  onPlay?: () => void;
}
