# Development Setup Guide

## Option 1: Local PostgreSQL (Recommended for Development) ⭐

### Step 1: Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer and follow wizard
3. Remember the password you set for postgres user
4. Default port: 5432

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL (Windows: use pgAdmin or psql from Start Menu)
psql -U postgres

# Inside psql:
CREATE DATABASE school_dev;
\q
```

### Step 3: Configure Environment

Copy `.env.local` to `.env`:
```bash
cp .env.local .env
```

Update the connection string with your postgres password:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/school_dev"
```

### Step 4: Run Migrations

```bash
npx prisma db push
npx prisma generate
```

### Step 5: Start Development Server

```bash
npm run dev
```

---

## Option 2: Continue with Supabase (Easiest)

### Step 1: Use Existing Configuration

Your `.env` file already has Supabase connection:
```bash
# Just copy the current .env
# Already configured!
```

### Step 2: Run Migrations

```bash
npx prisma db push
npx prisma generate
```

### Step 3: Start Development Server

```bash
npm run dev
```

---

## Switching Between Environments

### Development (Local):
```bash
cp .env.local .env
npm run dev
```

### Production (Supabase):
```bash
cp .env.production .env
npm run build
npm start
```

---

## Database Management Commands

```bash
# Apply schema changes
npx prisma db push

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data!)
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate
```

---

## Seeding Sample Data (Optional)

Create seed script to populate database with sample data for testing.

---

## Troubleshooting

### Local PostgreSQL Connection Issues:

**Error: "password authentication failed"**
- Check password in DATABASE_URL matches your postgres password
- Try connecting with pgAdmin first to verify credentials

**Error: "database does not exist"**
- Run: `CREATE DATABASE school_dev;` in psql

**Error: "could not connect to server"**
- Ensure PostgreSQL service is running
- Windows: Check Services app
- Mac/Linux: `brew services list` or `systemctl status postgresql`

### Supabase Connection Issues:

**Error: "too many connections"**
- Using connection pooler? Add `?pgbouncer=true`
- Free tier limit: Check Supabase dashboard

**Error: "unauthorized"**
- Verify DATABASE_URL is correct
- Check if you have access to the Supabase project

---

## Recommended Workflow

1. **Development**: Use local PostgreSQL
   - Fast, offline, unlimited queries
   - Each developer has own database

2. **Staging**: Use Supabase (separate project)
   - Test in cloud environment
   - Team can test together

3. **Production**: Use Supabase
   - Automatic backups
   - Managed service
   - Scalable

---

## Admin Login

Default credentials:
- Password: `admin123`

**IMPORTANT:** Change this in production by updating `ADMIN_PASSWORD_HASH` in `.env`

To generate new hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10));"
```
