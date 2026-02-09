import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export async function seedInitialData() {
  try {
    // Seed blog posts
    const blogPosts = [
      {
        title: 'Empowering Rural Communities Through Education',
        excerpt:
          'Discover how our scholarship program is transforming the lives of children in rural communities, providing them with opportunities they never thought possible.',
        content:
          'Education is the cornerstone of development. Through our comprehensive scholarship program, we are providing access to quality education for children in rural communities who would otherwise be unable to attend school. Our program covers tuition, books, uniforms, and other essential supplies, ensuring that financial barriers do not prevent bright young minds from reaching their full potential.\n\nSince the program began, we have supported over 5,000 students across 30 communities. The results have been remarkable - with a 95% retention rate and many of our scholars going on to pursue higher education and return to serve their communities.\n\nOur approach goes beyond financial support. We provide mentorship, career guidance, and create networks of support that help students navigate their educational journey. We also work with schools to improve infrastructure and teaching quality, ensuring that the entire educational ecosystem benefits from our intervention.',
        author: 'Layeni Ogunmakinwa',
        category: 'Education',
        imageUrl:
          'https://images.unsplash.com/photo-1770235621081-030607a06cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBlbXBvd2VybWVudCUyMHlvdW5nJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['Education', 'Empowerment', 'Youth', 'Scholarships'],
      },
      {
        title: 'Clean Water Initiative: A Year in Review',
        excerpt:
          'Reflecting on a successful year of bringing clean water to 25 communities, reducing waterborne diseases by 80% and improving quality of life.',
        content:
          'Access to clean water is a fundamental human right, yet millions still lack this basic necessity. Over the past year, our Clean Water Initiative has made significant strides in addressing this challenge.\n\nWe have constructed 25 new wells and water systems across underserved communities, providing clean, safe drinking water to over 30,000 people. The impact has been transformative - waterborne diseases have decreased by 80%, school attendance has improved as children no longer need to spend hours fetching water, and women have more time for income-generating activities.\n\nEach water project is developed in close partnership with the community, ensuring sustainability and local ownership. We train community members in maintenance and management, creating local jobs and ensuring long-term functionality. Our approach also includes hygiene education and sanitation improvements, addressing water quality comprehensively.',
        author: 'Michael Adeyemi',
        category: 'Water & Sanitation',
        imageUrl:
          'https://images.unsplash.com/photo-1559079236-2e64f89c7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY29tbXVuaXR5JTIwcHJvamVjdHxlbnwxfHx8fDE3NzA2MzI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['Water', 'Health', 'Impact', 'Infrastructure'],
      },
      {
        title: 'Healthcare Outreach: Reaching the Unreached',
        excerpt:
          'Our mobile health clinics are bringing essential medical services to remote communities, providing care to over 15,000 people annually.',
        content:
          'Healthcare access remains a critical challenge in many rural areas. Our mobile health clinics are bridging this gap, bringing essential medical services directly to communities that would otherwise go without.\n\nOur teams of dedicated healthcare professionals travel to remote areas, providing primary care, maternal health services, immunizations, and health education. In the past year alone, we have conducted over 15,000 consultations, delivered 200 babies safely, and provided immunizations to 3,000 children.\n\nBeyond immediate medical care, we focus on preventive health and community education. We train community health workers who continue to serve their communities between our visits, creating a sustainable health support system. We also identify cases requiring specialist care and facilitate referrals, ensuring comprehensive healthcare support.',
        author: 'Dr. Folake Johnson',
        category: 'Healthcare',
        imageUrl:
          'https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29tbXVuaXR5JTIwb3V0cmVhY2glMjBhZnJpY2F8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tags: ['Healthcare', 'Outreach', 'Community', 'Mobile Clinics'],
      },
    ];

    for (const post of blogPosts) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/blog-posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(post),
        }
      );
    }

    // Seed initiatives
    const initiatives = [
      {
        title: 'Education Empowerment',
        description:
          'Providing quality education, scholarships, and learning resources to underprivileged children and youth, ensuring no one is left behind in their pursuit of knowledge.',
        imageUrl:
          'https://images.unsplash.com/photo-1770235621081-030607a06cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBlbXBvd2VybWVudCUyMHlvdW5nJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        impact: '5,000+ students supported',
      },
      {
        title: 'Healthcare Access',
        description:
          'Bringing essential healthcare services, medical supplies, and health education to rural and underserved communities, improving overall community wellbeing.',
        imageUrl:
          'https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29tbXVuaXR5JTIwb3V0cmVhY2glMjBhZnJpY2F8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        impact: '15,000+ beneficiaries reached',
      },
      {
        title: 'Clean Water Projects',
        description:
          'Building sustainable water infrastructure and sanitation facilities in communities lacking access to clean water, reducing waterborne diseases.',
        imageUrl:
          'https://images.unsplash.com/photo-1559079236-2e64f89c7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY29tbXVuaXR5JTIwcHJvamVjdHxlbnwxfHx8fDE3NzA2MzI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        impact: '25+ wells constructed',
      },
      {
        title: 'Community Development',
        description:
          'Supporting local entrepreneurs, skill development programs, and community-led initiatives that create sustainable economic opportunities.',
        imageUrl:
          'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwdm9sdW50ZWVycyUyMGhlbHBpbmclMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcwNjI1MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        impact: '200+ businesses supported',
      },
    ];

    for (const initiative of initiatives) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/initiatives`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(initiative),
        }
      );
    }

    toast.success('Initial data loaded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    toast.error('Failed to load initial data');
  }
}
