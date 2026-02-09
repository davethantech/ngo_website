export interface Initiative {
  id: string;
  title: string;
  description: string;
  fullContent?: string;
  imageUrl: string;
  impact: string;
  category?: string;
  date?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  tags: string[];
}

export const initiativesData: Initiative[] = [
  {
    id: '1',
    title: 'Education Empowerment',
    description: 'Providing quality education, scholarships, and learning resources to underprivileged children and youth.',
    fullContent: 'Our Education Empowerment initiative focuses on bridging the gap in educational access. We provide full scholarships to talented students from low-income families, distribute textbooks and learning materials to underfunded schools, and organize after-school tutoring programs. We believe that education is the most powerful weapon which you can use to change the world.',
    imageUrl: 'https://images.unsplash.com/photo-1770235621081-030607a06cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBlbXBvd2VybWVudCUyMHlvdW5nJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    impact: '5,000+ students supported',
    category: 'Education'
  },
  {
    id: '2',
    title: 'Healthcare Access',
    description: 'Bringing essential healthcare services, medical supplies, and health education to rural and underserved communities.',
    fullContent: 'Access to basic healthcare is a fundamental human right. Our mobile clinics travel to remote villages to provide check-ups, vaccinations, and maternal care. We also supply local clinics with essential medicines and organize community health workshops on hygiene and disease prevention.',
    imageUrl: 'https://images.unsplash.com/photo-1634710664586-fe890319a9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY29tbXVuaXR5JTIwb3V0cmVhY2glMjBhZnJpY2F8ZW58MXx8fHwxNzcwNjMyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    impact: '15,000+ beneficiaries reached',
    category: 'Health'
  },
  {
    id: '3',
    title: 'Clean Water Projects',
    description: 'Building sustainable water infrastructure and sanitation facilities in communities lacking access to clean water.',
    fullContent: 'Water is life. We construct solar-powered boreholes and rain harvesting systems to ensure communities have reliable access to safe drinking water. We also build VIP latrines and promote sanitation best practices to reduce the incidence of waterborne diseases.',
    imageUrl: 'https://images.unsplash.com/photo-1559079236-2e64f89c7764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwY29tbXVuaXR5JTIwcHJvamVjdHxlbnwxfHx8fDE3NzA2MzI3ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    impact: '25+ wells constructed',
    category: 'Infrastructure'
  },
  {
    id: '4',
    title: 'Community Development',
    description: 'Supporting local entrepreneurs, skill development programs, and community-led initiatives.',
    fullContent: 'We empower communities to drive their own development. Through micro-grants for small businesses, vocational training centers, and leadership workshops, we help build resilient local economies and strong community structures.',
    imageUrl: 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwdm9sdW50ZWVycyUyMGhlbHBpbmclMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcwNjI1MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    impact: '200+ businesses supported',
    category: 'Economic Growth'
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: '1',
    title: 'The Impact of Education on Rural Communities',
    excerpt: 'How scholarships and school supplies are changing lives in remote villages.',
    content: 'Education is the cornerstone of development. In our recent visit to the northern district, we witnessed firsthand how the scholarship program has transformed the lives of 50 young girls. Previously destined for early marriage, these students are now dreaming of becoming doctors and engineers. The ripple effect is palpable—educated children are influencing their families to adopt better health practices and prioritize education for their siblings...',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    author: 'Sarah Johnson',
    date: 'February 15, 2024',
    tags: ['Education', 'Stories', 'Impact']
  },
  {
    id: '2',
    title: 'Water for Life: Completing the New Borehole',
    excerpt: 'Celebrating the inauguration of a new solar-powered water system.',
    content: 'The joy was contagious as clean water gurgled out of the tap for the first time in Oloibiri village. For decades, women and children walked 5 kilometers daily to fetch water from a muddy stream. Today, thanks to our donors, they have safe drinking water right in the village square. This project will drastically reduce typhoid and cholera cases in the area...',
    imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    author: 'David O.',
    date: 'January 28, 2024',
    tags: ['Water', 'Projects', 'Success Story']
  },
  {
    id: '3',
    title: 'Annual Charity Gala 2023 Recap',
    excerpt: 'A night of elegance and generosity raising funds for our 2024 goals.',
    content: 'Our annual gala was a resounding success, raising over $50,000 for our healthcare initiatives. The evening featured moving testimonials from beneficiaries and a keynote speech by our founder. We are incredibly grateful to our sponsors and everyone who attended. These funds will equip 5 rural clinics with solar power and refrigeration for vaccines...',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    author: 'Admin',
    date: 'December 20, 2023',
    tags: ['Events', 'Fundraising']
  }
];
