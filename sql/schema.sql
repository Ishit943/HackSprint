-- ============================================================================
-- MONSTER MATCH: DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    college TEXT DEFAULT '',
    branch TEXT DEFAULT '',
    year TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '',
    show_phone BOOLEAN DEFAULT FALSE,
    show_whatsapp BOOLEAN DEFAULT FALSE,
    availability_hours INT DEFAULT 10,
    availability_notes TEXT DEFAULT 'Weekends & Evenings',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'busy', 'teamed')),
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL -- 'Frontend', 'Backend', 'AI/ML', 'Mobile', 'Design', 'Cloud/DevOps', 'Cybersecurity', 'Web3'
);

-- 3. USER SKILLS
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    level TEXT NOT NULL DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    UNIQUE(user_id, skill_id)
);

-- 4. INTERESTS
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

-- 5. USER INTERESTS
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
    UNIQUE(user_id, interest_id)
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Hackathon',
    hackathon_name TEXT DEFAULT '',
    deadline DATE,
    mode TEXT DEFAULT 'online' CHECK (mode IN ('online', 'offline', 'hybrid')),
    team_size INT DEFAULT 4,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'filled', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROJECT ROLES
CREATE TABLE IF NOT EXISTS public.project_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL,
    slots INT DEFAULT 1,
    description TEXT DEFAULT ''
);

-- 8. PROJECT ROLE SKILLS
CREATE TABLE IF NOT EXISTS public.project_role_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES public.project_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    UNIQUE(role_id, skill_id)
);

-- 9. CONNECTION REQUESTS
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    message TEXT DEFAULT 'Hey! I would love to connect and team up on a project.',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    UNIQUE(sender_id, receiver_id, project_id)
);

-- 10. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 12. MESSAGES (In-app real-time messaging)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    sent_via TEXT DEFAULT 'app' CHECK (sent_via IN ('app', 'whatsapp')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WHATSAPP LOGS (Phase 8 Cloud API)
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    status TEXT NOT NULL,
    wa_message_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'connection_request', 'request_accepted', 'project_invite', etc.
    payload JSONB DEFAULT '{}'::jsonb,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SAVED FILTERS
CREATE TABLE IF NOT EXISTS public.saved_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filter_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ENDORSEMENTS
CREATE TABLE IF NOT EXISTS public.endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endorser_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(endorser_id, user_id, skill_id)
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_college ON public.users(college);
CREATE INDEX IF NOT EXISTS idx_users_branch ON public.users(branch);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON public.connection_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON public.connection_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_status_deadline ON public.projects(status, deadline);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);

-- ============================================================================
-- AUTOMATED USER CREATION ON AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute upon auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;

-- 1. Users policies
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- 2. Skills & Interests (Read for all, Insert for authenticated)
CREATE POLICY "Skills readable by all authenticated"
    ON public.skills FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Interests readable by all authenticated"
    ON public.interests FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "User skills viewable by authenticated"
    ON public.user_skills FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users manage their own skills"
    ON public.user_skills FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "User interests viewable by authenticated"
    ON public.user_interests FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users manage their own interests"
    ON public.user_interests FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. Projects policies
CREATE POLICY "Projects readable by all authenticated"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Project owners can manage projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "Project roles viewable by authenticated"
    ON public.project_roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Project role skills viewable by authenticated"
    ON public.project_role_skills FOR SELECT
    TO authenticated
    USING (true);

-- 4. Connection Requests policies
CREATE POLICY "Users view connection requests they sent or received"
    ON public.connection_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests"
    ON public.connection_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers and senders can update request status"
    ON public.connection_requests FOR UPDATE
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 5. Notifications
CREATE POLICY "Users can view and update their own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- 6. Messages
CREATE POLICY "Users view messages they sent or received"
    ON public.messages FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users send messages as sender"
    ON public.messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

-- 7. WhatsApp Logs policies
CREATE POLICY "Users view their own whatsapp logs"
    ON public.whatsapp_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================================================
-- SEED DATA: POPULAR TECH STACKS & SKILLS
-- ============================================================================
INSERT INTO public.skills (name, category) VALUES
    ('React', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Next.js', 'Frontend'),
    ('HTML5/CSS3', 'Frontend'),
    ('Tailwind CSS', 'Frontend'),
    ('TypeScript', 'Frontend'),
    ('Node.js', 'Backend'),
    ('Express.js', 'Backend'),
    ('Python', 'Backend'),
    ('Django', 'Backend'),
    ('FastAPI', 'Backend'),
    ('Java / Spring Boot', 'Backend'),
    ('Go (Golang)', 'Backend'),
    ('PostgreSQL', 'Backend'),
    ('MongoDB', 'Backend'),
    ('Supabase', 'Backend'),
    ('Machine Learning', 'AI/ML'),
    ('Deep Learning', 'AI/ML'),
    ('PyTorch', 'AI/ML'),
    ('TensorFlow', 'AI/ML'),
    ('NLP / LLMs', 'AI/ML'),
    ('Computer Vision', 'AI/ML'),
    ('Flutter', 'Mobile'),
    ('React Native', 'Mobile'),
    ('Swift / iOS', 'Mobile'),
    ('Kotlin / Android', 'Mobile'),
    ('UI/UX Design', 'Design'),
    ('Figma', 'Design'),
    ('Docker', 'Cloud/DevOps'),
    ('AWS', 'Cloud/DevOps'),
    ('Solidity / Web3', 'Web3')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.interests (name) VALUES
    ('AI & Generative Agents'),
    ('Fintech & Payments'),
    ('HealthTech & Bio'),
    ('EdTech & Learning'),
    ('Social Impact & Sustainability'),
    ('Cybersecurity & Privacy'),
    ('Web3 & DeFi'),
    ('Gaming & AR/VR'),
    ('IoT & Hardware Hack')
ON CONFLICT (name) DO NOTHING;
