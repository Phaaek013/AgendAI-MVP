# AgendAI - Visão de Arquitetura

AgendAI orquestra canais de mensagens, agentes especializados e calendários para agendar compromissos.

## Componentes
- **apps/web** (Next.js): Dashboard com visão de Inbox, Agenda e Settings.
- **apps/api** (Fastify): Gateway HTTP, webhooks dos canais e outbox para envio de mensagens.
- **apps/agent** (FastAPI + LangGraph/LangChain): Orquestrador multiagente (stub) que processa mensagens e chama ferramentas.
- **packages/shared**: Tipos e contratos (CalendarProvider, ChannelProvider, AgentClient) e esquemas de validação.
- **packages/db**: Cliente Postgres e migrations SQL.

## Fluxo Alto Nível
Canais → API Gateway → Agent Orchestrator → Tools → DB

- Webhooks entram em `/webhooks/whatsapp` e são persistidos em `webhook_events`.
- Mensagens de saída são gravadas em `outbox` via `/messages/send` e serão entregues por workers futuros.
- O agente recebe `POST /invoke` com `tenant_id`, `conversation_id` e `incoming_message` e devolve uma resposta stub.

## Banco de Dados
`packages/db/migrations` contém a migração inicial com tabelas multi-tenant: tenants, members, contacts, conversations, messages, appointments, waitlist, webhook_events e outbox.

## Providers
Implemente conectores reais em novos pacotes ou nas aplicações:
- **CalendarProvider**: integrações de agenda (Google, Outlook).
- **ChannelProvider**: canais como WhatsApp/Email/Chat web.
- **AgentClient**: chamadas do Node para o orquestrador em Python.
