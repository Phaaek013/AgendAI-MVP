create extension if not exists "pgcrypto";

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  email text not null,
  role text default 'member',
  created_at timestamptz default now()
);

create index if not exists members_tenant_created_idx on members (tenant_id, created_at);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  name text,
  channel_identifier text,
  created_at timestamptz default now()
);

create index if not exists contacts_tenant_created_idx on contacts (tenant_id, created_at);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  contact_id uuid references contacts(id),
  topic text,
  status text default 'open',
  created_at timestamptz default now()
);

create index if not exists conversations_tenant_created_idx on conversations (tenant_id, created_at);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  conversation_id uuid references conversations(id) not null,
  sender text not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists messages_tenant_created_idx on messages (tenant_id, created_at);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  contact_id uuid references contacts(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  title text,
  status text default 'scheduled',
  created_at timestamptz default now()
);

create index if not exists appointments_tenant_created_idx on appointments (tenant_id, created_at);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  contact_id uuid references contacts(id),
  desired_time timestamptz,
  notes text,
  created_at timestamptz default now()
);

create index if not exists waitlist_tenant_created_idx on waitlist (tenant_id, created_at);

create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  event text not null,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists webhook_events_tenant_created_idx on webhook_events (tenant_id, created_at);

create table if not exists outbox (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) not null,
  conversation_id uuid references conversations(id),
  payload jsonb not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create index if not exists outbox_tenant_created_idx on outbox (tenant_id, created_at);
