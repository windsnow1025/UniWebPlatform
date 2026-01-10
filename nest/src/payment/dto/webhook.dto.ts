/**
 * Creem Webhook Event Types and DTOs
 * Based on Creem API documentation
 */

// Event types
export type CreemEventType = 'checkout.completed';

// Product entity
export interface CreemProduct {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number; // in cents, 1000 = $10.00
  currency: string;
  billing_type: 'onetime';
  status: string;
  tax_mode: 'inclusive' | 'exclusive';
  tax_category: string;
  default_success_url: string;
  created_at: string;
  updated_at: string;
  mode: 'test' | 'prod' | 'sandbox' | 'local';
}

// Checkout completed event object
export interface CreemCheckoutObject {
  id: string;
  object: 'checkout';
  request_id?: string;
  product: CreemProduct;
  status: 'pending' | 'processing' | 'completed' | 'expired';
  metadata?: Record<string, unknown>;
  mode: 'test' | 'prod' | 'sandbox' | 'local';
}

// Generic webhook event wrapper
export interface CreemWebhookEvent<T = unknown> {
  id: string;
  eventType: CreemEventType;
  created_at: number;
  object: T;
}
