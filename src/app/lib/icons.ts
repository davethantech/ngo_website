/**
 * Curated icon map to replace `import * as LucideIcons` wildcard imports.
 * This allows tree-shaking to eliminate unused icons (saves ~650 kB in bundle).
 *
 * Add new icon names here if Supabase data uses them (icon_name field).
 */
import {
  // Navigation & UI
  HelpCircle,
  Search,
  SearchX,
  Target,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  // Impact / metrics
  Users,
  Heart,
  TrendingUp,
  BarChart3,
  Award,
  Star,
  Globe,
  // Education
  GraduationCap,
  BookOpen,
  School,
  // Health
  Stethoscope,
  Hospital,
  Activity,
  // Water / Environment
  Droplets,
  Leaf,
  Sun,
  // Community
  Home,
  Building,
  HandHeart,
  // Social
  MapPin,
  Phone,
  Mail,
  type LucideIcon,
} from 'lucide-react';

// Map of icon name strings (as stored in DB) to icon components
const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  Search,
  SearchX,
  Target,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
  Heart,
  TrendingUp,
  BarChart3,
  Award,
  Star,
  Globe,
  GraduationCap,
  BookOpen,
  School,
  Stethoscope,
  Hospital,
  Activity,
  Droplets,
  Leaf,
  Sun,
  Home,
  Building,
  HandHeart,
  MapPin,
  Phone,
  Mail,
};

/**
 * Returns the Lucide icon component for a given icon name string.
 * Falls back to HelpCircle if the icon is not in the curated map.
 */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle;
}

// Also export all individual icons for direct imports
export {
  HelpCircle,
  Search,
  SearchX,
  Target,
  Users,
  Heart,
  TrendingUp,
  BarChart3,
  Award,
  Star,
  Globe,
  GraduationCap,
  BookOpen,
  School,
  Stethoscope,
  Hospital,
  Activity,
  Droplets,
  Leaf,
  Sun,
  Home,
  Building,
  HandHeart,
  MapPin,
  Phone,
  Mail,
};
