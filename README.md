# This project contains the following technologies

Authentication and User Management:
- Clerk (Authentication and User Management)

Core Technologies:
- React 19
- TypeScript
- Next 15 (framework)

Data Fetching and State Management:
- React Query (TanStack Query) (data fetching and state management)

Database Management:
- Drizzle ORM (database management)
- NeonDatabase (serverless database)
- pg (postgres client)

Form and Validation:
- Drizzle Zod (form validation)
- React Hook Form (working with forms)
- Zod (first schema validation)

Image and Video handling and Optimization:
- MUX (optimize videos)
- Sharp (image optimizer)

Middleware and Server Utilities:
- Concurrently (all projects are running in tandem)
- Ngrok (local tunneling)
- Superjson (data serialization)
- tRPC (end-to-end type safe APIs)
- UploadThing (uploading files)
- Upstash Ratelimit (rate limiting)
- Upstash Redis (serverless Redis database)
- Upstash Workflow (serverless workflows)

Styling and UI Frameworks:
- Lucide React (stylization)
- shadcn/ui (stylization)
- Tailwind CSS (stylization)
- Sonner (stylization)

Utilities and Libraries:
- Date-fns (date/time manipulation)
- dotenv (environment variables)
- Knip (code analyzer and declutter)
- React error boundary (error handling)

Webhooks:
- Svix (sending webhooks)



# To run the client and server via concurrently:
terminal powershell -> `npm i` (install dependencies)
terminal powershell -> `npm run all`
terminal powershell -> `npm run lint` (loading ESLint checker)
terminal powershell -> `npm run knip`

# Drizzle commands:
terminal powershell -> `npx drizzle-kit generate`
terminal powershell -> `npx drizzle-kit push`
terminal powershell -> `npx drizzle-kit migrate`
terminal powershell -> `npx drizzle-kit migrate reset`
terminal powershell -> `npx tsx scripts/seed-categories.ts` (seed Categories)

# GitHub commands:
terminal powershell -> `git pull origin master` (get latest changes)

terminal powershell -> `git add .` (add all changes)
terminal powershell -> `git commit -m "commit message"` (commit changes)
terminal powershell -> `git checkout -b <branch-name>` (create new branch)

terminal powershell -> `git push origin master` (push changes to master)
terminal powershell -> `git push origin <branch-name>` (push changes to branch)

# To run the ngrok tunnel:
terminal CommandPrompt -> `ngrok config add-authtoken <NGROK_AUTHTOKEN>`
terminal CommandPrompt -> `ngrok http --url=<NGROK_DOMAIN> 3000`

# To run the stripe webhook:
terminal CommandPrompt -> `stripe login`
terminal CommandPrompt -> `stripe listen --forward-to localhost:3000/api/webhook`
