-- Migration: Create Impact Stories table
-- Impact stories are used for testimonials and success highlights.

CREATE TABLE IF NOT EXISTS public.impact_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Security
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON public.impact_stories FOR SELECT USING (true);
CREATE POLICY "Admin All Access" ON public.impact_stories FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data (Optional)
INSERT INTO public.impact_stories (quote, author, role, image_url, display_order)
VALUES 
('The LOF scholarship program changed my life. I am now pursuing my dream of becoming a doctor.', 'Amina K.', 'Scholarship Recipient', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80', 1),
('Thanks to the clean water project, our community no longer suffers from waterborne diseases.', 'Chief Okonkwo', 'Community Leader', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 2);
