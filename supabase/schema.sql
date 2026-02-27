-- NGO Website Database Schema
-- Davethan GrowthSuite Standards

-- 1. Initiatives Table
CREATE TYPE initiative_status AS ENUM ('Ongoing', 'Past', 'Upcoming');

CREATE TABLE IF NOT EXISTS initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    status initiative_status DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Impact Metrics Table
CREATE TABLE IF NOT EXISTS impact_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    icon_name TEXT, -- Lucide icon name
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security: Row Level Security (RLS)

-- Initiatives RLS
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to initiatives" ON initiatives FOR SELECT USING (true);

-- Blog Posts RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to blog_posts" ON blog_posts FOR SELECT USING (true);

-- Impact Metrics RLS
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to impact_metrics" ON impact_metrics FOR SELECT USING (true);

-- Contact Inquiries RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert access to contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Restrict read access to contact_inquiries" ON contact_inquiries FOR SELECT TO authenticated USING (true);

-- Seed Initial Data for Impact Metrics
INSERT INTO impact_metrics (label, value, icon_name) VALUES
('Students Educated', '38+', 'GraduationCap'),
('Widows Supported', '33+', 'Heart'),
('Lives Impacted', '1,000+', 'Users'),
('Medical Outreach', 'Success', 'Stethoscope'),
('Youth Empowered', '100+', 'Briefcase'),
('Community Action', 'Ongoing', 'CheckCircle')
ON CONFLICT (label) DO UPDATE SET value = EXCLUDED.value;

-- Seed Initial Data for Initiatives
INSERT INTO initiatives (title, description, content, image_url, status, category) VALUES
('Scholarship Award Scheme', 'Providing full scholarships and learning resources to underprivileged children and youth.', 'Our Scholarship Award Scheme focuses on bridging the gap in educational access. We believe that education is the most powerful weapon to alleviate poverty and ensure success in life.', 'https://images.unsplash.com/photo-1770235621081-030607a06cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Ongoing', 'Education'),
('Widows’ Welfare Program', 'Bringing essential healthcare services, medical supplies, and social support to widows.', 'Access to basic healthcare and social welfare is a fundamental human right. Our program provides widows with medical check-ups, food items, and emotional support.', 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Ongoing', 'Social Welfare'),
('Enterprise Rendezvous', 'Weekly radio broadcast fostering accountability and productivity in the public sector.', 'Enterprise Rendezvous is our flagship media initiative—a weekly radio program designed to educate the public on governance, accountability, and productivity.', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Ongoing', 'Governance');
