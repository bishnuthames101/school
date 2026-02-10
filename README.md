# Excellence Academy - School Management System

A modern, full-stack school management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

### Public Features
- 🏠 Homepage with school information
- 📚 Academic programs and facilities showcase
- 📝 Online admission application form
- 📢 Public notices and announcements
- 📅 Events calendar
- 🖼️ Photo gallery
- 📞 Contact form

### Admin Features
- 🔐 Secure authentication with JWT
- 📊 Dashboard with real-time statistics
- 📝 Event management (CRUD)
- 📢 Notice management with priority levels
- 🖼️ Gallery management
- 📋 Application form review
- 📧 Contact form management

### API Features
- ✅ RESTful API design
- 🔒 JWT authentication
- 📄 Pagination support
- 🔍 Search and filtering
- ⚡ Optimized database queries
- 🛡️ Server-side middleware protection

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase or Local)
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd school
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL (Recommended for Development)**

See [SETUP.md](./SETUP.md#option-1-local-postgresql-recommended-for-development) for detailed instructions.

Quick setup:
```bash
# Install PostgreSQL, then:
createdb school_dev
cp .env.local .env
# Update DATABASE_URL with your password
npx prisma db push
npx prisma generate
```

**Option B: Use Supabase**

```bash
# Already configured in .env
npx prisma db push
npx prisma generate
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Admin Login

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

- Password: `admin123`

---

## Project Structure

```
school/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── events/       # Events CRUD
│   │   ├── notices/      # Notices CRUD
│   │   ├── gallery/      # Gallery CRUD
│   │   ├── applications/ # Application forms
│   │   └── contacts/     # Contact forms
│   ├── admin/            # Admin dashboard
│   └── (public pages)/   # Public pages
├── components/            # React components
├── lib/                  # Utilities
│   ├── auth.ts          # Authentication helpers
│   └── db.ts            # Prisma client
├── prisma/               # Database schema
│   └── schema.prisma
├── middleware.ts         # Route protection
└── .env                  # Environment variables
```

---

## API Documentation

### Authentication

#### POST `/api/auth/login`
Login with admin password
```json
{
  "password": "admin123"
}
```

#### POST `/api/auth/logout`
Logout and clear session

#### GET `/api/auth/verify`
Verify authentication status

---

### Events API

#### GET `/api/events`
List all events with pagination and filtering

Query parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `category` - Filter by category (Academic, Sports, Cultural, Social, Other)
- `search` - Search in title and description

Example:
```
GET /api/events?page=1&limit=10&category=Sports&search=tournament
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### POST `/api/events` 🔒
Create new event (requires auth)

#### GET `/api/events/[id]`
Get single event by ID

#### PUT `/api/events/[id]` 🔒
Update event (requires auth)

#### DELETE `/api/events/[id]` 🔒
Delete event (requires auth)

---

### Notices API

#### GET `/api/notices`
List all notices with pagination and filtering

Query parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `category` - General, Academic, Exam, Event, Holiday, Fee, Important
- `priority` - normal, important, urgent
- `search` - Search in title and description

#### POST `/api/notices` 🔒
Create new notice (requires auth)

#### GET `/api/notices/[id]`
Get single notice by ID

#### PUT `/api/notices/[id]` 🔒
Update notice (requires auth)

#### DELETE `/api/notices/[id]` 🔒
Delete notice (requires auth)

---

### Gallery API

Similar CRUD endpoints with pagination

---

### Applications API

#### GET `/api/applications` 🔒
List applications (requires auth, with pagination)

#### POST `/api/applications`
Submit application (public)

---

### Contacts API

#### GET `/api/contacts` 🔒
List contacts (requires auth, with pagination)

#### POST `/api/contacts`
Submit contact form (public)

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-secret-key"
ADMIN_PASSWORD_HASH="bcrypt-hash"
```

See [SETUP.md](./SETUP.md) for detailed configuration.

---

## Database Schema

Key models:
- `Event` - School events with categories
- `Notice` - Announcements with priorities
- `GalleryImage` - Photo gallery
- `ApplicationForm` - Student applications
- `ContactForm` - Contact submissions

See `prisma/schema.prisma` for full schema.

---

## Development Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma db push   # Apply schema changes
npx prisma generate  # Regenerate Prisma Client

# Linting
npm run lint         # Run ESLint
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure you:
1. Set all environment variables
2. Run `npm run build`
3. Set Node.js version ≥ 18
4. Configure PostgreSQL connection

---

## Security Notes

🔒 **Important Security Practices:**

1. **Change Default Password**
   - Default admin password is `admin123`
   - Generate new hash: `node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('NEW_PASSWORD', 10));"`
   - Update `ADMIN_PASSWORD_HASH` in `.env`

2. **Environment Variables**
   - Never commit `.env` file
   - Use different secrets for production
   - Rotate JWT_SECRET regularly

3. **Database**
   - Use connection pooling in production
   - Set up SSL for database connections
   - Regular backups

4. **HTTPS**
   - Always use HTTPS in production
   - Enable secure cookies

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and questions:
- Create an issue in the repository
- Email: support@excellenceacademy.edu

---

## Changelog

### v1.0.0 (2025-12-02)
- ✅ Initial release
- ✅ Complete CRUD for all resources
- ✅ Pagination and filtering
- ✅ JWT authentication
- ✅ Server-side middleware protection
- ✅ Admin dashboard with real-time stats
- ✅ Secure password hashing
