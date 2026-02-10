# Excellence Academy - Setup Guide

## 🎉 Project Complete!

Your school website has been successfully migrated to Next.js 14 with a fully functional admin panel!

---

## 📋 What's Been Built

### ✅ Phase 1: Next.js Migration
- Migrated from Vite + React to Next.js 14 (App Router)
- All 9 pages converted and working
- All components updated for Next.js
- Admin Login button added to Footer

### ✅ Phase 2: Admin Panel
- Complete authentication system with JWT
- PostgreSQL integration with Prisma ORM
- Full CRUD API routes for all content
- 5 Admin management pages
- Database integration on public pages

---

## 🚀 Getting Started

### 1. Set Up PostgreSQL Database with Supabase

You need to set up a PostgreSQL database using Supabase (Free tier available).

#### Supabase Setup (Recommended - Free PostgreSQL Database)

1. **Create Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Choose your organization (or create one)
   - Enter project name: "excellence-academy" (or your preferred name)
   - Create a strong database password (SAVE THIS!)
   - Select a region (closest to you)
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be set up

3. **Get Connection String**
   - Go to "Project Settings" (gear icon in sidebar)
   - Click "Database" in the left menu
   - Scroll down to "Connection String" section
   - Copy the "URI" connection string (not the pooler)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password

---

### 2. Configure Environment Variables

1. Create a `.env` file in your project root (or update the existing one)
2. Add your Supabase connection string:

```env
# Database Connection (from Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret (change this to a random string!)
JWT_SECRET="your-super-secret-random-string-change-this-now"

# Admin Password (default: admin123)
# To change: update in lib/auth.ts
```

**Important:** Replace:
- `[YOUR-PASSWORD]` with your Supabase database password
- `[YOUR-PROJECT-REF]` with your project reference from Supabase
- Change `JWT_SECRET` to a random secure string (use `openssl rand -base64 32` to generate one)

---

### 3. Install Dependencies and Set Up Database

```bash
# Install all dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push the database schema to Supabase
# This creates all the necessary tables in your database
npx prisma db push

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🔐 Admin Panel Access

### Login Credentials
- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Password:** `admin123`

**⚠️ IMPORTANT: Change the admin password before deploying to production!**

### Admin Panel Features

Once logged in, you can:

1. **Dashboard** (`/admin/dashboard`)
   - View statistics
   - Quick actions
   - System overview

2. **Events Management** (`/admin/events`)
   - Create, edit, delete events
   - Add event images and descriptions
   - Categorize events

3. **Notices Management** (`/admin/notices`)
   - Post new notices
   - Set priority levels
   - Manage categories
   - Add attachments

4. **Gallery Management** (`/admin/gallery`)
   - Upload gallery images
   - Organize by category
   - Delete images

5. **Applications** (`/admin/applications`)
   - View all student applications
   - Filter by grade
   - Search by name/email
   - Track application status

6. **Contact Messages** (`/admin/contacts`)
   - View all contact form submissions
   - Mark as read/unread
   - Filter by status
   - Reply to messages

---

## 📁 Project Structure

```
excellence-academy-nextjs/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About page
│   ├── academics/page.tsx       # Academics page
│   ├── admission/page.tsx       # Admission page (with form)
│   ├── events/page.tsx          # Events page (fetches from DB)
│   ├── notices/page.tsx         # Notices page (fetches from DB)
│   ├── contact/page.tsx         # Contact page (with form)
│   ├── facilities/page.tsx      # Facilities page
│   ├── others/page.tsx          # Others page (gallery from DB)
│   ├── admin/                   # Admin panel
│   │   ├── login/page.tsx      # Admin login
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── events/page.tsx     # Events management
│   │   ├── notices/page.tsx    # Notices management
│   │   ├── gallery/page.tsx    # Gallery management
│   │   ├── applications/page.tsx
│   │   └── contacts/page.tsx
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication
│   │   ├── events/             # Events CRUD
│   │   ├── notices/            # Notices CRUD
│   │   ├── gallery/            # Gallery CRUD
│   │   ├── applications/       # Applications
│   │   └── contacts/           # Contacts
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── Header.tsx              # Main navigation
│   ├── TopNavbar.tsx          # Top contact bar
│   └── Footer.tsx             # Footer (with admin login button)
├── lib/                        # Utilities
│   ├── db.ts                  # Prisma Client instance
│   └── auth.ts                # Auth utilities
├── prisma/                     # Prisma schema and migrations
│   └── schema.prisma          # Database schema
├── types/                      # TypeScript types
│   └── index.ts               # Exported Prisma types
├── .env                       # Environment variables
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🗄️ Database Tables

Your PostgreSQL database will have these tables:

1. **events** - School events (managed by admin)
2. **notices** - School notices (managed by admin)
3. **gallery_images** - Gallery photos (managed by admin)
4. **application_forms** - Student admission applications (from public form)
5. **contact_forms** - Contact messages (from public form)

All tables are automatically created when you run `npx prisma db push`.

---

## 🔧 Common Tasks

### Adding Sample Data

To test the admin panel, you can add sample data:

1. Login to admin panel
2. Go to Events, Notices, or Gallery
3. Click "Add New" and fill in the form
4. Save

The data will appear on the public pages immediately!

### Changing Admin Password

To change the admin password:

1. Open `lib/auth.ts`
2. Find the `ADMIN_PASSWORD` constant
3. Change `'admin123'` to your new password
4. Restart the dev server

For production, you should:
- Store hashed password in environment variable
- Use bcrypt to hash the password
- Never commit passwords to git

### Testing Forms

1. Go to [http://localhost:3000/admission](http://localhost:3000/admission)
2. Fill out the admission form
3. Submit
4. Login to admin panel
5. Check [http://localhost:3000/admin/applications](http://localhost:3000/admin/applications)
6. Your submission should appear!

Same works for the contact form.

---

## 🚢 Deploying to Production

### Using Vercel (Recommended)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Deploy!

### Important for Production:
- Change admin password
- Use a strong JWT_SECRET
- Use a secure PostgreSQL connection string with SSL
- Restrict database access to your application's IP
- Set up SSL certificates (Vercel does this automatically)

---

## 📚 API Documentation

### Public Endpoints (No Auth Required)

- `GET /api/events` - Get all events
- `GET /api/notices` - Get all notices
- `GET /api/gallery` - Get all gallery images
- `POST /api/applications` - Submit admission application
- `POST /api/contacts` - Submit contact form

### Admin Endpoints (Auth Required)

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify auth status

**Events:**
- `POST /api/events` - Create event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

**Notices:**
- `POST /api/notices` - Create notice
- `PUT /api/notices/[id]` - Update notice
- `DELETE /api/notices/[id]` - Delete notice

**Gallery:**
- `POST /api/gallery` - Add image
- `DELETE /api/gallery/[id]` - Delete image

**Applications:**
- `GET /api/applications` - Get all applications

**Contacts:**
- `GET /api/contacts` - Get all contact messages

---

## ❓ Troubleshooting

### Can't connect to database
- Check your `DATABASE_URL` in `.env` file
- Verify your Supabase password is correct (replace `[YOUR-PASSWORD]`)
- Ensure your Supabase project is active
- Make sure you ran `npx prisma generate` and `npx prisma db push`
- Check Supabase dashboard for any issues

### Prisma Client errors
- Run `npx prisma generate` to regenerate the Prisma Client
- Check if `DATABASE_URL` is correctly set
- Restart your development server after changing schema

### Admin login not working
- Check default password is `admin123`
- Clear browser cookies
- Check browser console for errors

### Forms not submitting
- Check browser console for errors
- Verify API routes are working
- Check database connection
- Ensure tables were created (`npx prisma db push`)

### Pages showing "Loading..."
- Check database connection
- Verify API routes exist
- Make sure tables are created in Supabase
- Check browser console for errors

### Tables not created in Supabase
- Run `npx prisma db push` to create tables
- Check Supabase dashboard > Table Editor to verify tables exist
- Check your `DATABASE_URL` is correct

---

## 🎓 Next Steps

Now that everything is set up, you can:

1. Add sample events, notices, and gallery images through the admin panel
2. Test the admission and contact forms
3. Customize the content and styling
4. Add more features like:
   - Email notifications
   - File uploads for images
   - Advanced filtering
   - Student portal
   - Teacher dashboard
   - And more!

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal/server logs
3. Review this setup guide
4. Check the PostgreSQL/Prisma connection

---

## 🎉 Congratulations!

You now have a fully functional school website with a complete admin panel!

**Features:**
- ✅ Modern Next.js 14 website
- ✅ PostgreSQL database with Supabase
- ✅ Prisma ORM for type-safe database queries
- ✅ Secure admin authentication
- ✅ Full CRUD operations
- ✅ Responsive design
- ✅ Form submissions
- ✅ Dynamic content management

Enjoy managing your school website! 🏫
