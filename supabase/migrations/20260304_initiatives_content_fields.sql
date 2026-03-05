-- Migration: Add content and key_objectives columns to initiatives table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.initiatives
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS key_objectives TEXT;

-- Also create the blog-images storage bucket if it doesn't exist
-- (Run in Supabase Dashboard > Storage > Create Bucket: 'blog-images', Public = true)

-- Grant public read access to blog-images bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;
