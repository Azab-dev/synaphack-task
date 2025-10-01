# Hackathon Platform (Next.js + MongoDB)

A simple fullstack app to list hackathons, view details, register participants, and manage events via a basic admin page.

## Tech
- Next.js App Router
- MongoDB with Mongoose
- Tailwind CSS
- Zod for validation
- JWT for simple admin auth

## Getting Started

1) Create environment file:

Create `.env.local` in the root with:

```
MONGODB_URI=mongodb://localhost:27017/hackathon_platform
JWT_SECRET=change_me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2) Install and run:

```
npm install
npm run dev
```

App will be available at `http://localhost:3000`.

## Admin Login
- Go to `/admin`
- Use the credentials from `.env.local`
- After login, a token is stored in localStorage and used for CRUD operations

## API Overview
- `GET /api/events` → list events
- `POST /api/events` → create event (admin, Bearer token)
- `GET /api/events/:id` → event details
- `PUT /api/events/:id` → update (admin)
- `DELETE /api/events/:id` → delete (admin)
- `POST /api/registrations` → register for an event
- `POST /api/auth/login` → returns JWT for admin

## Database Collections
- Events
- Users
- Teams
- Registrations (unique per event+user)

## Notes
- UI is intentionally simple and responsive.
- Basic error handling and input validation are in place.
- For production, add stronger auth and validations.


