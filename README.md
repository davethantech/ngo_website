# Layeni Ogunmakinwa Foundation Website

A premium NGO website with full CMS capabilities for managing blog posts and initiatives.

## Features

### Public Website
- **Hero Section**: Eye-catching hero with impact statistics
- **About Section**: Foundation mission, vision, and values
- **Initiatives**: Showcase of key programs (Education, Healthcare, Water, Community Development)
- **Impact Section**: Comprehensive statistics and testimonials
- **Blog**: Latest news and stories with featured posts
- **Contact**: Contact form and information

### Admin Portal
The website includes a secure, formal [Management Console](file:///c:/Users/Lannister/Desktop/NGO_Website/src/app/pages/LoginPage.tsx) for managing content.

#### Accessing the Admin Panel
1. Navigate to `/admin` or `/login`.
2. Authenticate using your Foundation administrator credentials.
3. Once logged in, you can manage all dynamic content, update security settings, and view user submissions.

#### Admin Panel Features
1. **Blog Posts Management**
   - Professional CRUD operations with rich-text support.
   - Categories, tags, and featured author metadata.
   - Secure image integration.

2. **Initiatives & Programs**
   - Manage foundation programs and real-time impact metrics.
   - High-quality image support for program showcases.

3. **Global Settings**
   - Built-in credentials management (Password update module).
   - Secure session termination (Log out).

## Technology Stack & Security

- **Frontend**: React 18 with TypeScript.
- **Security**: Supabase Authentication with protected `AuthGuard` routing.
- **Database**: Supabase PostgreSQL with strict Row Level Security (RLS).
- **SEO**: Comprehensive Meta tags, OpenGraph, and dynamic page titles for social sharing.
- **Animations**: Motion (Framer Motion) for a premium, high-end feel.

## Running Locally

To run this project on your local machine:

1.  **Clone the repository**.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
4.  **Access**: Visit `http://localhost:5173`. Navigate to `/login` to access the CMS.

## Contact Information

- **Organization**: Layeni Ogunmakinwa Foundation
- **Email**: lof.us.ng@gmail.com

---

Built with ❤️ for communities worldwide
