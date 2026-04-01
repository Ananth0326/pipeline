-- 1. Create the status enum
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('applied', 'selected', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Migration for new statuses:
DO $$ BEGIN
    ALTER TYPE application_status ADD VALUE 'interview';
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TYPE application_status ADD VALUE 'offer';
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TYPE application_status ADD VALUE 'assessment';
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create the companies table
CREATE TABLE IF NOT EXISTS companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    role_title text NOT NULL,
    location text,
    jd_text text,
    resume_url text,
    date_applied date DEFAULT CURRENT_DATE,
    status application_status DEFAULT 'applied',
    notes text,
    assessment_done boolean DEFAULT false,
    assessment_response text,
    qualified boolean,
    interview_date date,
    application_platform text,
    next_action text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

DO $$ BEGIN
    ALTER TABLE companies ADD COLUMN application_platform text;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE companies ADD COLUMN next_action text;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE companies ADD COLUMN status_text text DEFAULT 'Applied';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE companies ADD COLUMN status_color text DEFAULT 'yellow';
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 4. Create a policy for all access
DO $$ BEGIN
    CREATE POLICY "Allow all access for public anon key" ON companies
        FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 5. Create a function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_companies_updated_at
        BEFORE UPDATE ON companies
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. Create application_logs table for activity timeline
CREATE TABLE IF NOT EXISTS application_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
    action text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 7. Enable RLS for application_logs
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- 8. Create policy for application_logs
DO $$ BEGIN
    CREATE POLICY "Allow all access for application_logs" ON application_logs
        FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 9. Storage Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ BEGIN
    CREATE POLICY "Allow public upload" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'resumes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public view" ON storage.objects
        FOR SELECT USING (bucket_id = 'resumes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 10. Saved roles table (separate from applied tracker)
CREATE TABLE IF NOT EXISTS saved_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name text NOT NULL,
    job_link text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE saved_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow all access for saved_roles" ON saved_roles
        FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_saved_roles_updated_at
        BEFORE UPDATE ON saved_roles
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
