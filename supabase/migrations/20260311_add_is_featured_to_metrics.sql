-- Migration: Add is_featured column to impact_metrics table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.impact_metrics 
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing metrics to be featured to maintain current look initially
UPDATE public.impact_metrics 
SET is_featured = true 
WHERE display_order <= 3;
