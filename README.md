# AgendAI

Monorepo do AgendAI com Web (Next.js), API (Fastify) e Agent Orchestrator (FastAPI + LangGraph/LangChain). O objetivo é oferecer um scaffold simples, multi-tenant e pronto para evoluir.

## Requisitos
- Node.js 18+
- pnpm 9+
- Python 3.11+
- Docker (para Postgres)

## Instalação
```bash
pnpm install
```

### Subir dependências
```bash
docker-compose up -d
```

## Desenvolvimento
Suba todos os serviços Node + agente Python:
```bash
pnpm dev
```

Comandos diretos:
- Web: `pnpm --filter @agendai/web dev` (porta 3000)
- API: `pnpm --filter @agendai/api dev` (porta 8001)
- Agent: `pnpm dev:agent` (porta 8002)

## Endpoints mínimos
- **API**
  - `GET /health` — **liveness probe** (sempre retorna 200 se o servidor está rodando)
  - `GET /ready` — **readiness probe** (200 se DATABASE_URL configurado e DB acessível, 503 caso contrário)
  - `POST /webhooks/whatsapp` → valida payload e salva em `webhook_events`
  - `POST /messages/send` → grava em `outbox` e retorna 202
- **Agent**
  - `GET /health`
  - `POST /invoke` → recebe `{ tenant_id, conversation_id, incoming_message }` e retorna `assistant_message` stub
- **Web**
  - `/dashboard` com links de Inbox, Agenda e Settings

## Banco de Dados
- Postgres via `docker-compose.yml`
- Migração inicial em `packages/db/migrations/0001_init.sql`
- Cliente compartilhado em `packages/db/src/index.ts`

## Contratos compartilhados
Local: `packages/shared/src/index.ts`
- `CalendarProvider`: check_availability, create, reschedule, cancel, list_changes
- `ChannelProvider`: receive_webhook, send_message
- `AgentClient`: invoke()
- Schemas Zod para webhooks, envio de mensagens e invoke do agente

## Providers (onde editar)
- Canais (ex.: WhatsApp): implemente `ChannelProvider` em `packages/shared` e use em `apps/api/src`.
- Calendário: implemente `CalendarProvider` em novos módulos e consuma na API.
- Orquestrador: expanda `apps/agent/main.py` com LangGraph/LangChain e ferramentas externas.

## Variáveis de Ambiente
Exemplos em:
- `apps/web/.env.example`
- `apps/api/.env.example`
- `apps/agent/.env.example`

## Qualidade
- Lint: `pnpm lint`
- Format: `pnpm format`

## Notas
- Não há integração real com WhatsApp/Calendário; apenas stubs.
- Estrutura pensada para evoluir para Supabase + RLS + embeddings futuramente.
