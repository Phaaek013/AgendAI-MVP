import { z } from "zod";

export interface CalendarProvider {
  check_availability(input: {
    tenantId: string;
    start: Date;
    end: Date;
    attendeeEmail?: string;
  }): Promise<{ available: boolean }>;
  create(input: {
    tenantId: string;
    title: string;
    start: Date;
    end: Date;
    attendeeEmail?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ appointmentId: string }>;
  reschedule(input: {
    tenantId: string;
    appointmentId: string;
    start: Date;
    end: Date;
  }): Promise<void>;
  cancel(input: { tenantId: string; appointmentId: string }): Promise<void>;
  list_changes(input: {
    tenantId: string;
    since: Date;
  }): Promise<{ changes: Array<{ id: string; status: string; updatedAt: Date }> }>;
}

export interface ChannelProvider {
  receive_webhook(payload: unknown): Promise<{ tenantId: string; event: string }>;
  send_message(input: {
    tenantId: string;
    conversationId: string;
    to: string;
    message: string;
  }): Promise<{ messageId: string }>;
}

export interface AgentClient {
  invoke(input: {
    tenant_id: string;
    conversation_id: string;
    incoming_message: string;
  }): Promise<{ assistant_message: string }>;
}

export const webhookEventSchema = z.object({
  tenant_id: z.string(),
  event: z.string(),
  payload: z.record(z.any()).optional(),
});

export const sendMessageSchema = z.object({
  tenant_id: z.string(),
  conversation_id: z.string(),
  to: z.string(),
  message: z.string(),
});

export const agentInvokeSchema = z.object({
  tenant_id: z.string(),
  conversation_id: z.string(),
  incoming_message: z.string(),
});

export type WebhookEventInput = z.infer<typeof webhookEventSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type AgentInvokeInput = z.infer<typeof agentInvokeSchema>;
