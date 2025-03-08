# Authomation Manager

This project is a Nuxt 3 application designed to automate README updates for GitHub repositories. It allows users to connect their GitHub account, select repositories, and then trigger either a manual or automated README update. The automated update feature (premium) will monitor for changes and update the README accordingly (this functionality is not fully implemented in the provided code).
trigger

## Project Structures

The project follows a standard Nuxt 3 directory structure:

- **`./`**: Root directory
  - **`actions`**: Contains the API endpoints
    - `action.js`: Handles the README update logic.
    - `github-repos.js`: Fetches GitHub repositories data.
  - **`components`**: Reusable UI components.
    - `Actions.vue`: Component for selecting update actions (Manual/Auto).
    - `Header.vue`: Header component.
    - `Loading.vue`: Loading indicator component.
    - `RepositoryList.vue`: Component to display and select GitHub repositories.
    - `RepositoryListItem.vue`: Component for a single repository item.
    - `Sidebar.vue`: Sidebar navigation component.
  - **`composables`**: Reusable composables.
    - `useFetchWrapper.js`: Wrapper for simplified API calls with loading and error handling.
    - `useSupabase.js`: Composable for Supabase client access.
  - **`pages`**: Vue components representing application routes.
    - `account`: Authentication related pages.
      - `default.vue`: Handles default login/logout logic.
      - `index.vue`: Basic welcome component
      - `integrations.vue`: Allows connecting/disconnecting GitHub.
    - `github`: Pages for GitHub integration.
      - `index.vue`: GitHub dashboard
  - **`plugins`**: Nuxt plugins
    - `supabase.js`: Plugin to initialize Supabase client.
  - **`server`**: Server-side code
    - `db`: Database operations using Supabase.
    - `utils`: Utility functions for the server.
  - **`store`**: Pinia stores for managing application state.
    - `github.js`: Manages GitHub data.
    - `loading.js`: Loading indicator.
    - `sidebar.js`: Handles sidebar state.
  - **`supabase`**: Supabase configuration and migrations
    - `migrations`: SQL migration files for Supabase
    - `seed.sql`: Seed data for Supabase
    - `README.md`: Instructions for setting up Supabase
  - **`assets`**: CSS and other assets.
    - `main.css`: Contains TailwindCSS styles.
  - **`AuraPreset.js`**: PrimeVue theme configuration file.
  - **`nuxt.config.ts`**: Nuxt configuration file.
  - **`package.json`**: Project dependencies and scripts.
  - **`README.md`**: This file.
  - **`robots.txt`**: Standard robots.txt file.
  - **`.env`**: Environment variables (not included in the provided data)
  - **`.env.production`**: Environment variables for the production environment.
  - **`.gitignore`**: Files and directories to be ignored by Git.
  - **`.prettierrc`**: Empty file (presumably for Prettier config).
  - **`tsconfig.json`**: TypeScript configuration file.
  - **`redirect.global.js`**: Global route middleware for redirects.
  - **`[...].js`**: Next-Auth configuration file.

## Tech Stack & Dependencies

- **Framework:** Nuxt 3
- **UI Library:** PrimeVue
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with Github and Credentials Providers
- **Database:** Supabase (PostgreSQL)
- **Other:** `@element-plus/nuxt`, `@nuxtjs/device`

## Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project_directory>
   ```

3. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. **Set up Supabase:**

   Follow the instructions in `supabase/README.md` to:

   - Create a Supabase project
   - Configure API keys
   - Run migrations
   - Seed the database

5. **Set up environment variables:** Create a `.env` file (or `.env.production` for production) in the root directory and add your environment variables, including:

   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` for GitHub integration
   - `AUTH_SECRET` and `AUTH_ORIGIN` for authentication
   - `WEBHOOK_URL` for README update webhooks
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for Supabase connection

6. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun run dev
   ```

## Usage Guide

1. **Authentication:** The application uses NextAuth.js for authentication. You can log in using the provided Credentials provider (for testing purposes only, should be removed in production) or connect via your GitHub account. Credentials are `"test@gmail.com"` and `"1234"`

2. **GitHub Integration:** Once logged in, navigate to the GitHub section. You can select the repositories you want to manage.

3. **README Update:** Choose between "Manual README Update" and "Auto README Update" (Premium). Manual updates send the selected repository information to the defined `WEBHOOK_URL` for processing. The automated update functionality remains incomplete.

4. **Preview Production Build:**
   ```bash
   npm run preview
   # or
   yarn preview
   # or
   pnpm preview
   # or
   bun run preview
   ```

## Database Migration

This project has been migrated from Prisma ORM to Supabase. The migration involved:

1. Replacing Prisma database models with Supabase tables
2. Converting Prisma queries to Supabase client API calls
3. Adding Row Level Security (RLS) for data protection
4. Setting up database migrations and seed data

If you're updating from a previous version that used Prisma, make sure to:

- Update your environment variables with Supabase credentials
- Run the migration scripts in the Supabase SQL Editor
- Remove any Prisma-specific code or dependencies

## Deployment

Deployment instructions are not explicitly provided, but the project appears to be set up for easy deployment with a platform like Vercel, Netlify, or similar. Consult the Nuxt 3 deployment documentation.

## License

[Specify license here, if applicable]

## Author

[Specify author information here, if applicable]
