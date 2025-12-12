import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database client will be inactive.");
}

export const pool = new Pool({
  connectionString,
});

export async function healthcheck() {
  const result = await pool.query("select 1 as ok");
  return result.rows[0];
}

export async function insertWebhookEvent(input: {
  id?: string;
  tenantId: string;
  event: string;
  payload: Record<string, unknown> | null;
}) {
  const result = await pool.query(
    `insert into webhook_events (tenant_id, event, payload) values ($1, $2, $3) returning id`,
    [input.tenantId, input.event, input.payload]
  );
  return { id: result.rows[0].id as string };
}

export async function enqueueOutboundMessage(input: {
  tenantId: string;
  conversationId: string;
  payload: Record<string, unknown>;
}) {
  const result = await pool.query(
    `insert into outbox (tenant_id, conversation_id, payload, status) values ($1, $2, $3, 'pending') returning id`,
    [input.tenantId, input.conversationId, input.payload]
  );
  return { id: result.rows[0].id as string };
}
