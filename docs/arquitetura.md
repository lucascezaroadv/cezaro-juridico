# Arquitetura — Cezaro Jurídico

## Stack
| Camada | Tecnologia |
|---|---|
| Frontend + API | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| ORM | Prisma 7 |
| Banco | PostgreSQL |
| Auth (interno) | Clerk |
| Auth (portal cliente) | Credenciais próprias (bcrypt) |
| IA | OpenAI API (gpt-4o) |
| Hospedagem | Vercel + Neon/Supabase |
| Armazenamento | Vercel Blob ou S3 |

---

## Estrutura de Rotas

### Público (site institucional)
```
/                         → Home
/sobre                    → Sobre o escritório
/areas-de-atuacao         → Lista de áreas
/areas-de-atuacao/[slug]  → Área específica
/blog                     → Listagem de artigos
/blog/[slug]              → Artigo
/contato                  → Formulário de contato
```

### Autenticação (Clerk)
```
/login                    → Sign in
/cadastro                 → Sign up
```

### Portal do Cliente
```
/portal                   → Login do cliente
/portal/dashboard         → Painel do cliente
/portal/processos         → Processos do cliente
/portal/processos/[id]    → Detalhes do processo
/portal/documentos        → Documentos
/portal/mensagens         → Mensagens com o escritório
/portal/propostas/[id]    → Visualizar proposta
```

### Área Interna (requer Clerk auth)
```
/dashboard                → Dashboard principal
/processos                → Lista de processos
/processos/novo           → Cadastrar processo
/processos/[id]           → Detalhes do processo
/processos/[id]/editar    → Editar processo
/clientes                 → Lista de clientes
/clientes/novo            → Cadastrar cliente
/clientes/[id]            → Perfil do cliente
/intimacoes               → Central de intimações
/intimacoes/[id]          → Detalhes da intimação
/agenda                   → Calendário
/crm                      → Funil comercial (Kanban)
/crm/leads/[id]           → Detalhes do lead
/crm/propostas/novo       → Nova proposta
/crm/propostas/[id]       → Detalhes da proposta
/execucao                 → Dashboard de execuções
/execucao/[processoId]    → Detalhes da execução
/financeiro               → Dashboard financeiro
/documentos               → Gestão documental
/configuracoes            → Configurações do sistema
```

---

## Rotas de API

### Processos
```
GET    /api/v1/processos
POST   /api/v1/processos
GET    /api/v1/processos/[id]
PUT    /api/v1/processos/[id]
DELETE /api/v1/processos/[id]
GET    /api/v1/processos/[id]/movimentacoes
POST   /api/v1/processos/[id]/movimentacoes
GET    /api/v1/processos/[id]/intimacoes
GET    /api/v1/processos/[id]/prazos
GET    /api/v1/processos/[id]/diligencias
POST   /api/v1/processos/[id]/diligencias
```

### Clientes
```
GET    /api/v1/clientes
POST   /api/v1/clientes
GET    /api/v1/clientes/[id]
PUT    /api/v1/clientes/[id]
GET    /api/v1/clientes/[id]/processos
GET    /api/v1/clientes/[id]/documentos
```

### CRM
```
GET    /api/v1/leads
POST   /api/v1/leads
GET    /api/v1/leads/[id]
PUT    /api/v1/leads/[id]
PATCH  /api/v1/leads/[id]/etapa
POST   /api/v1/leads/[id]/comentarios
GET    /api/v1/propostas
POST   /api/v1/propostas
GET    /api/v1/propostas/[id]
PUT    /api/v1/propostas/[id]
PATCH  /api/v1/propostas/[id]/status
```

### Intimações
```
GET    /api/v1/intimacoes
POST   /api/v1/intimacoes
GET    /api/v1/intimacoes/[id]
PATCH  /api/v1/intimacoes/[id]/lida
POST   /api/v1/intimacoes/[id]/resumo-ia
```

### Agenda / Prazos
```
GET    /api/v1/prazos
POST   /api/v1/prazos
GET    /api/v1/audiencias
POST   /api/v1/audiencias
```

### Financeiro
```
GET    /api/v1/financeiro/lancamentos
POST   /api/v1/financeiro/lancamentos
GET    /api/v1/financeiro/dashboard
```

### Documentos
```
POST   /api/v1/documentos/upload
GET    /api/v1/documentos/[id]
DELETE /api/v1/documentos/[id]
```

### Portal do Cliente
```
POST   /api/portal/auth/login
POST   /api/portal/auth/logout
GET    /api/portal/processos
GET    /api/portal/processos/[id]
GET    /api/portal/documentos
POST   /api/portal/mensagens
GET    /api/portal/mensagens
GET    /api/portal/propostas/[linkPublico]
```

### IA
```
POST   /api/ia/resumir-intimacao
POST   /api/ia/sugerir-providencias
POST   /api/ia/gerar-artigo
POST   /api/ia/traduzir-movimentacao
POST   /api/ia/sugerir-diligencias
POST   /api/ia/personalizar-proposta
```

### Webhooks
```
POST   /api/webhook/clerk
POST   /api/webhook/whatsapp
```

---

## Diagrama de Módulos

```
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS APP                          │
├──────────────────┬──────────────────┬───────────────────┤
│   SITE PÚBLICO   │  PORTAL CLIENTE  │   ERP INTERNO     │
│  (marketing)     │  (auth própria)  │   (Clerk auth)    │
└──────────────────┴──────────────────┴───────────────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │        API ROUTES          │
              │    /api/v1 + /api/portal   │
              └─────────────┬─────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐       ┌─────▼─────┐      ┌────▼─────┐
    │ MÓDULOS │       │  PRISMA   │      │    IA    │
    │ Domain  │──────▶│ PostgreSQL│      │  OpenAI  │
    └─────────┘       └───────────┘      └──────────┘
```

---

## Decisões de Arquitetura

### Auth dual
- **Advogados/equipe**: Clerk (OAuth, MFA, sessões gerenciadas)
- **Clientes**: auth própria no banco (`portalLogin` + `portalSenha` com bcrypt), JWT simples via cookie httpOnly

### Upload de documentos
- Vercel Blob para simplicidade no MVP
- Migração para S3 na expansão SaaS

### IA
- OpenAI `gpt-4o-mini` para tarefas simples (resumos, traduções de movimentações)
- OpenAI `gpt-4o` para tarefas complexas (sugestões estratégicas, geração de peças)
- Streaming para respostas longas

### Background jobs (Fase 2+)
- Vercel Cron para alertas de prazo diários
- pg-boss ou BullMQ para processamento de intimações e notificações

### SEO do site
- `generateMetadata` por rota (Next.js)
- Sitemap dinâmico via `app/sitemap.ts`
- Blog com ISR (revalidação a cada 1h)
