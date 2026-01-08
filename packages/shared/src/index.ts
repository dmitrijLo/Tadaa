// Shared types and utilities for Tadaa

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Gift {
  id: string;
  name: string;
  description?: string;
  url?: string;
}

export interface GiftExchange {
  id: string;
  name: string;
  participants: string[];
  date: Date;
}
