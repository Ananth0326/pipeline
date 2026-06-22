# 🛠️ Pipeline Mastery | Job Tracking & Workflow Dashboard

A stunning, motion-rich, glassmorphism job application tracker and pipeline dashboard. Built with **Next.js 16 (Turbopack)**, **React 19**, **Supabase**, and **TailwindCSS**, this application provides job hunters with an automated, visual workflow for managing applications from initial save to final offer.

---

## 🌟 Key Features

* **🎨 High-Aesthetics UI**: Custom-tailored dark and light elements, rich glassmorphism controls, responsive cards, and dynamic visual presets (Sunset / Ocean themes).
* **📋 Kanban & Table Views**: Track application status (Applied, Interview, Offer, Rejected) using a drag-and-drop Kanban Board (powered by `@dnd-kit`) or a condensed, scanner-friendly data table.
* **🤖 AI-Powered Job Extractor**: Add application details by simply pasting a job listing link. The application fetches the page, cleans the HTML using `Cheerio`, and extracts structured fields (`company_name`, `role_title`, `location`, `jd_text`) using LLaMA-3.3 on `Groq`.
* **⏰ Stagnant Saved Roles Nudger**: Features periodic audio-visual terminal reminders (starting daily at 15:05/3:05 PM and repeating every 3 hours) encouraging you to convert saved job listings into active applications.
* **📁 Resume & Activity Logging**: Upload PDF resumes directly to a Supabase storage bucket and track key changes on an audit timeline.

---

## ⚙️ Tech Stack

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack compilation.
* **Frontend Library:** [React 19](https://react.dev/)
* **Styles & Animations:** [TailwindCSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
* **Database & Storage:** [Supabase](https://supabase.com/) (Postgres DB, RLS Policies, trigger functions, and PDF File Storage)
* **AI Integration:** [Groq SDK](https://github.com/groq/groq-sdk-node) (`llama-3.3-70b-versatile` model)
* **Web Scraping:** [Cheerio](https://cheerio.js.org/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd pipeline
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# AI API Key (Groq)
GROQ_API_KEY=gsk_...
```

### 3. Setup Database Schema
Execute the SQL commands in [supabase_setup.sql](file:///c:/Users/anant/Desktop/Projects/Pipeline/supabase_setup.sql) inside your Supabase project SQL Editor. This script:
1. Creates the custom enum type `application_status`
2. Creates the `companies`, `application_logs`, and `saved_roles` tables
3. Sets up RLS (Row Level Security) policies allowing public anonymous access
4. Installs the `resumes` storage bucket for storing PDFs
5. Binds a custom postgres trigger `update_companies_updated_at` to handle `updated_at` fields automatically

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app running.

---

## 📊 Database Schema

### Tables

#### `companies`
Stores active job applications.
* `id` (`uuid`, Primary Key)
* `company_name` (`text`, Required)
* `role_title` (`text`, Required)
* `location` (`text`)
* `jd_text` (`text`)
* `resume_url` (`text`)
* `status` (`application_status` enum: `applied`, `selected`, `rejected`, `interview`, `offer`, `assessment`)
* `notes` (`text`)
* `assessment_done` (`boolean`)
* `assessment_response` (`text`)
* `qualified` (`boolean`)
* `interview_date` (`date`)
* `application_platform` (`text`)
* `next_action` (`text`)
* `status_text` (`text`, Default: `'Applied'`)
* `status_color` (`text`, Default: `'yellow'`)

#### `application_logs`
Stores events shown on the company detail activity timeline.
* `id` (`uuid`, Primary Key)
* `company_id` (`uuid`, Foreign Key references `companies.id` ON DELETE CASCADE)
* `action` (`text`)
* `created_at` (`timestamp`)

#### `saved_roles`
Tracks bookmarked links/roles that have not yet been applied to.
* `id` (`uuid`, Primary Key)
* `company_name` (`text`)
* `role_title` (`text`)
* `job_link` (`text`)
* `is_converted` (`boolean`, Default: `false`)

---

## 🛣️ API Endpoints

### 1. `POST /api/extract-job`
Scrapes HTML contents of a job listing URL and parses structure.
* **Payload:**
  ```json
  { "url": "https://example.com/careers/job-listing-id" }
  ```
* **Response:**
  ```json
  {
    "data": {
      "company_name": "Example Corp",
      "role_title": "Software Engineer",
      "location": "Remote",
      "jd_text": "...Full Job Description..."
    }
  }
  ```

### 2. `GET /api/saved-roles/stagnant`
Fetches the single oldest unconverted saved role from the database to trigger the notifier nudge.
* **Response:**
  ```json
  {
    "role": {
      "id": "uuid-string",
      "company_name": "Example Corp",
      "role_title": "Software Engineer",
      "job_link": "https://example.com/job"
    }
  }
  ```

---

## 🛠️ Connection Troubleshooting (ENOTFOUND)

If the dashboard displays a **"Connection Problem"** error banner:

> **"Supabase did not respond in time, or the project is paused/deleted. Please check your Supabase Dashboard to ensure the project is active, verify NEXT_PUBLIC_SUPABASE_URL and your network, and try again."**

This is typically caused by Supabase **auto-pausing** free-tier projects due to inactivity.

### Step-by-Step Restoration
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Find your project in the project lists.
3. If it displays a **Paused** status icon, click the **Restore** button.
4. Allow 1-2 minutes for Supabase to allocate compute resources and reactivate your database.
5. Reload your local development page or production application—the DNS will resolve successfully and connection will be restored.
