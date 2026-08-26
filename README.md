# 💰 Finance Tracker

A personal finance tracking app built with **Nuxt 4**, **Nuxt UI**, and **Supabase**. Track income, expenses, savings, and investments, view trends over time, and manage everything through a clean, responsive interface.

🔗 **Live demo:** [finance-app-alpha-flax.vercel.app](https://finance-app-alpha-flax.vercel.app/)

---

## ✨ Features

- 🔐 **Passwordless authentication** — sign in via magic link, no passwords to manage
- 💸 **Transaction tracking** — log Income, Expenses, Savings, and Investments
- 🏷️ **Categorized expenses** — tag spending as Food, Housing, Car, Entertainment, and more
- 📊 **Period-based trends** — compare totals against the previous period at a glance
- ✏️ **Full CRUD** — add, edit, and delete transactions with instant UI updates
- 🌓 **Light & dark mode** — powered by Nuxt UI's theming
- 🖼️ **Profile avatars** — synced with Supabase Storage
- 🌱 **Database seeding** — generate realistic sample data for local development

---

## 🛠️ Tech Stack

| Layer          | Technology                                              |
|----------------|----------------------------------------------------------|
| Framework      | [Nuxt 4](https://nuxt.com)                                |
| UI Components  | [Nuxt UI](https://ui.nuxt.com)                             |
| Styling        | [Tailwind CSS 4](https://tailwindcss.com)                  |
| Backend / Auth | [Supabase](https://supabase.com) (`@nuxtjs/supabase`)      |
| Validation     | [Zod](https://zod.dev)                                     |
| Dates          | [date-fns](https://date-fns.org)                            |
| Seed data      | [Faker.js](https://fakerjs.dev)                             |
| Hosting        | [Vercel](https://vercel.com)                                |

---

## 📁 Project Structure

```
finance-app/
├── components/
│   ├── Transaction.vue          # Single transaction row (edit/delete actions)
│   ├── TransactionalModal.vue   # Add/edit transaction form modal
│   ├── DailyTransactionSummary.vue
│   └── Trend.vue                # Income/Expense/Saving/Investment summary cards
├── composables/
│   ├── useFetchTransactions.js  # Fetches + aggregates transactions for a period
│   ├── useSelectedTimePeriod.js # Resolves current/previous period date ranges
│   ├── useCurrency.js           # Reactive currency formatting
│   ├── useAvatarUrl.js          # Loads/refreshes the user's avatar
│   ├── useIsUserLoggedIn.js     # Redirects authenticated users away from auth pages
│   └── useAppToast.js           # Toast notification helper
├── constants/                   # Shared enums (transaction types, categories, view options)
├── pages/
│   ├── index.vue                # Main dashboard — summary, trends, transaction list
│   ├── login.vue                # Magic link sign-in page
│   ├── confirm.vue              # Auth callback landing page
│   └── settings                 # All the Settings 
│       ├── avatar.vue           # Update the avatar
│       ├── profile.vue          # Update Name and Email
│       └── settings.vue         # Change the default view
├── seed.mjs                     # Populates the database with sample transactions
├── nuxt.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <your-repo-url>
cd finance-app
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
NUXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NUXT_PUBLIC_BASE_URL=http://localhost:3000

# Only needed for running the seed script
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

> ⚠️ Never commit `.env` — it's already excluded via `.gitignore`.

### 3. Set up the database

In your Supabase project, create a `transactions` table with (at minimum) these columns:

| Column       | Type        | Notes                                   |
|--------------|-------------|------------------------------------------|
| `id`         | `int8`      | Primary key, auto-increment              |
| `created_at` | `timestamp` | Transaction date                         |
| `amount`     | `numeric`   | Positive number                          |
| `type`       | `text`      | `Income`, `Expense`, `Saving`, `Investment` |
| `category`   | `text`      | Only set when `type = Expense`           |
| `description`| `text`      | Optional                                 |
| `user_id`    | `uuid`      | References `auth.users`                  |

Enable **Row Level Security** and add a policy so users can only read/write their own rows (e.g. `user_id = auth.uid()`).

### 4. (Optional) Seed sample data

```bash
npm run seed
```

This generates ~2 years of realistic sample transactions for every existing user, using Faker.js.

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📜 Available Scripts

| Command           | Description                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Start the local development server             |
| `npm run build`   | Build the app for production                   |
| `npm run generate`| Generate a fully static build                  |
| `npm run preview` | Preview the production build locally           |
| `npm run seed`    | Populate the database with sample transactions |

---

## 🔑 Authentication Flow

This app uses **Supabase magic link (OTP) authentication** — no passwords:

1. A user enters their email on the **Login** page.
2. Supabase emails a one-time sign-in link, valid for 5 minutes.
3. Clicking the link redirects to `/confirm`, which exchanges the token for a session.
4. Once authenticated, the user is redirected into the app.

Configure your redirect URLs in **Supabase Dashboard → Authentication → URL Configuration** so they match your deployed domain(s) — see the [Nuxt Supabase module docs](https://supabase.nuxtjs.org) for details.

---

## ☁️ Deployment

This app deploys cleanly to **Vercel** using Nuxt's built-in Nitro preset — no extra configuration needed. Just make sure to:

1. Set all environment variables from your `.env` file in **Vercel → Project Settings → Environment Variables**.
2. Add your production URL to Supabase's **Redirect URLs** allowlist.
3. Trigger a deploy — Nuxt/Nitro will automatically detect the Vercel environment at build time.

---

## 📄 License

This project is for personal/educational use. Adapt as needed.
