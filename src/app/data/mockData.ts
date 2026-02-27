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
    title: 'Scholarship Award Scheme',
    description: 'Providing full scholarships and learning resources to underprivileged children and youth.',
    fullContent: 'Our Scholarship Award Scheme focuses on bridging the gap in educational access. We believe that education is the most powerful weapon to alleviate poverty and ensure success in life. We provide comprehensive support to talented students, ensuring their dreams are not cut short by lack of funds.',
    imageUrl: 'https://images.unsplash.com/photo-1770235621081-030607a06cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: '38+ Students Educated',
    category: 'Education'
  },
  {
    id: '2',
    title: 'Widows’ Welfare Program',
    description: 'Bringing essential healthcare services, medical supplies, and social support to widows.',
    fullContent: 'Access to basic healthcare and social welfare is a fundamental human right. Our program provides widows with medical check-ups, food items, and emotional support to ensure they live a dignified life after the loss of their spouses.',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: '33+ Widows Supported',
    category: 'Social Welfare'
  },
  {
    id: '3',
    title: 'Enterprise Rendezvous',
    description: 'Weekly radio broadcast fostering accountability and productivity in the public sector.',
    fullContent: 'Enterprise Rendezvous is our flagship media initiative—a weekly radio program designed to educate the public on governance, accountability, and productivity. We believe in building a society where transparency is the norm.',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: 'Weekly Broadcast Reaching Millions',
    category: 'Governance'
  },
  {
    id: '4',
    title: 'Skill Acquisition Center',
    description: 'Empowering youth and adults with vocational skills for self-reliance and economic growth.',
    fullContent: 'We provide hands-on training in various vocations, from tailoring and catering to tech skills. Our goal is to empower individuals to become job creators rather than job seekers.',
    imageUrl: 'https://images.unsplash.com/photo-1544650030-3c9baf62427a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: '100+ Youth Empowered',
    category: 'Economic Growth'
  },
  {
    id: '5',
    title: 'Medical Outreach',
    description: 'Building sustainable health awareness and providing free medical check-ups in rural areas.',
    fullContent: 'We organize periodic medical outreaches in rural communities, providing free consultations, drugs, and health education to those who lack access to quality healthcare centers.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-217359991f48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: '1000+ Reached in Akure & Ile-Oluji',
    category: 'Health'
  },
  {
    id: '6',
    title: 'Micro-Credit Grants',
    description: 'Supporting small business owners with interest-free loans and business training.',
    fullContent: 'We provide petty traders and small-scale farmers with micro-grants and interest-free loans to expand their businesses and improve their household income.',
    imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    impact: '50+ Small Businesses Funded',
    category: 'Finance'
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: '1',
    title: 'The Impact of Education on Rural Communities',
    excerpt: 'How scholarships and school supplies are changing lives in remote villages.',
    content: 'Education is the cornerstone of development. In our recent visit, we witnessed firsthand how the scholarship program has transformed the lives of young students. Previously destined for lack of opportunity, these students are now dreaming big. We believe that educated children are the key to a better future for Nigeria.',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    author: 'LOF Team',
    date: 'February 15, 2024',
    tags: ['Education', 'Impact']
  },
  {
    id: '2',
    title: 'Supporting Widows: A Journey of Hope',
    excerpt: 'Providing dignity and care to widows in Akure and Ile-Oluji.',
    content: 'Our Widows’ Welfare Program is more than just material support; it is about restoring hope. This month, we reached 33 widows with medical supplies and food items. The smiles on their faces remind us why we do what we do.',
    imageUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80',
    author: 'LOF Team',
    date: 'January 28, 2024',
    tags: ['Social Welfare', 'Widows']
  }
];
