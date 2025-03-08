# Supabase Setup Instructions

This project uses Supabase as its database provider. Follow these steps to set up your Supabase instance and connect it to the application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose your region and set a secure database password
4. Wait for your project to be initialized (this might take a few minutes)

## 2. Get Your Supabase API Keys

Once your project is ready:

1. In your Supabase dashboard, go to Project Settings > API
2. Copy the following values:
   - `URL`: The project URL
   - `anon` key: The public API key for anonymous access
   - `service_role` key: The private API key for administrative tasks

## 3. Set Up Environment Variables

Update your `.env` file with the following variables:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Run the Database Migrations

The database schema migrations are located in the `supabase/migrations` folder. You can apply them using the Supabase CLI or by manually executing the SQL in the Supabase SQL Editor.

### Using Supabase CLI

1. Install the Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Link your project:

   ```bash
   supabase link --project-ref your_project_reference_id --password your_database_password
   ```

3. Run the migrations:
   ```bash
   supabase db push
   ```

### Using the SQL Editor

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/20240308_initial_schema.sql`
3. Run the SQL script

## 5. Seed Initial Data

To populate your database with initial data:

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/seed.sql`
3. Run the SQL script

## 6. Verify Setup

To verify everything is working:

1. Start your application with `npm run dev`
2. Check that the application can connect to Supabase and perform operations
3. View the Tables in your Supabase dashboard to ensure they were created correctly

## Additional Configuration

### Row Level Security (RLS)

The migration scripts already set up basic Row Level Security policies. You can check and adjust these in the Supabase dashboard under Auth > Policies.

### Authentication

Supabase provides multiple authentication methods. This application uses GitHub OAuth, but you can add other providers in the Supabase dashboard under Auth > Providers.
