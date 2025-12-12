import Fastify from "fastify";
import { agentInvokeSchema, sendMessageSchema, webhookEventSchema } from "@agendai/shared";
import { enqueueOutboundMessage, insertWebhookEvent, pool } from "@agendai/db";

const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { translateTime: "SYS:standard", colorize: true },
    },
  },
});

server.get("/health", async () => {
  try {
    await pool.query("select 1");
    return { status: "ok" };
  } catch (error) {
    server.log.error({ error }, "db health failed");
    return { status: "degraded" };
  }
});

server.post("/webhooks/whatsapp", async (request, reply) => {
  const validation = webhookEventSchema.safeParse(request.body);
  if (!validation.success) {
    reply.status(400);
    return { error: "invalid_payload", details: validation.error.flatten() };
  }

  const { tenant_id, event, payload } = validation.data;

  const result = await insertWebhookEvent({
    tenantId: tenant_id,
    event,
    payload: payload ?? null,
  });

  return { id: result.id };
});

server.post("/messages/send", async (request, reply) => {
  const validation = sendMessageSchema.safeParse(request.body);
  if (!validation.success) {
    reply.status(400);
    return { error: "invalid_payload", details: validation.error.flatten() };
  }

  const { tenant_id, conversation_id, ...rest } = validation.data;

  const outboxEntry = await enqueueOutboundMessage({
    tenantId: tenant_id,
    conversationId: conversation_id,
    payload: rest,
  });

  reply.status(202);
  return { id: outboxEntry.id, status: "queued" };
});

server.post("/agent/invoke", async (request, reply) => {
  const validation = agentInvokeSchema.safeParse(request.body);
  if (!validation.success) {
    reply.status(400);
    return { error: "invalid_payload", details: validation.error.flatten() };
  }

  const { tenant_id, conversation_id, incoming_message } = validation.data;
  server.log.info({ tenant_id, conversation_id }, "agent invoke stub");
  return { assistant_message: `Echo from orchestrator: ${incoming_message}` };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 8001);
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`API running on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
