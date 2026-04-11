# Catch My Love - Backend API

Backend API for the "Catch My Love" arcade game.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js + TypeScript
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Get your Supabase connection string from:
**Supabase Dashboard → Settings → Database → Connection string**

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
# Run the SQL in prisma/seed.sql via Supabase SQL Editor
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

### Game Configuration

```
GET    /api/config          Get all game settings
PUT    /api/config/:key     Update a config value
```

### Messages

```
GET /api/messages                          Get random message
GET /api/messages?category=FLIRTY          Get random message by category
GET /api/messages/category/:category       Get all messages in category
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Environment configuration
│   ├── middleware/      # Express middleware (error handling)
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.sql         # Seed data
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma database GUI
```

## Frontend Integration

The frontend is already configured to hit this API. Set the environment variable in your frontend:

```env
VITE_API_BASE=http://localhost:3001
```

## Deployment

The backend can be deployed to:
- Railway
- Render
- VPS/Cloud server (AWS, DigitalOcean, etc.)

Make sure to set the `DATABASE_URL` environment variable to your Supabase connection string.
