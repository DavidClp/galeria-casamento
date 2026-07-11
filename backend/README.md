# Backend — Galeria Nathalia & David

API Express que recebe fotos/vídeos, sobe no Cloudflare R2 e lista no formato `MediaItem` do frontend.

## Pré-requisitos

1. Bucket R2 na Cloudflare
2. API Token / Access Key com permissão de leitura e escrita no bucket
3. Acesso público ao bucket (Custom Domain ou URL `r2.dev`) → `R2_PUBLIC_URL`
4. CORS no bucket R2 liberando o origin do frontend (para download via `fetch` no browser)

Exemplo de CORS no R2:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

## Setup

```bash
cd backend
cp .env.example .env
# edite .env com as credenciais R2
npm install
npm run dev
```

API em `http://localhost:4000`.

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da API (default `4000`) |
| `R2_ACCOUNT_ID` | Account ID da Cloudflare |
| `R2_ACCESS_KEY_ID` | Access Key do R2 |
| `R2_SECRET_ACCESS_KEY` | Secret do R2 |
| `R2_BUCKET` | Nome do bucket |
| `R2_PUBLIC_URL` | Base pública dos objetos (sem barra no final) |
| `CORS_ORIGIN` | Origin do frontend (ex. `http://localhost:3000`) |

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Healthcheck |
| `GET` | `/api/media` | Lista `{ items: MediaItem[] }` |
| `POST` | `/api/media` | Upload multipart: campo `files` (1..N) + `guest` |

## Rodar com o frontend

No frontend (raiz do projeto):

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

pnpm dev
```

Em outro terminal:

```bash
cd backend && npm run dev
```

Objetos ficam em `gallery/media/{uuid}.{ext}`; o índice em `gallery/index.json`.
