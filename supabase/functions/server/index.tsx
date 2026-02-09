import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize storage bucket on startup
const bucketName = 'make-8813977d-ngo-uploads';
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created bucket: ${bucketName}`);
  }
})();

// ===== BLOG POST ROUTES =====

// Get all blog posts
app.get('/make-server-8813977d/blog-posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('blog_post_');
    const sortedPosts = posts.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, posts: sortedPosts });
  } catch (error) {
    console.log(`Error fetching blog posts: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single blog post
app.get('/make-server-8813977d/blog-posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const post = await kv.get(`blog_post_${id}`);
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    return c.json({ success: true, post });
  } catch (error) {
    console.log(`Error fetching blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create blog post
app.post('/make-server-8813977d/blog-posts', async (c) => {
  try {
    const body = await c.req.json();
    const { title, content, excerpt, author, category, imageUrl, tags } = body;
    
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const post = {
      id,
      title,
      content,
      excerpt,
      author,
      category,
      imageUrl,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`blog_post_${id}`, post);
    return c.json({ success: true, post });
  } catch (error) {
    console.log(`Error creating blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update blog post
app.put('/make-server-8813977d/blog-posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingPost = await kv.get(`blog_post_${id}`);
    if (!existingPost) {
      return c.json({ success: false, error: 'Post not found' }, 404);
    }
    
    const updatedPost = {
      ...existingPost,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`blog_post_${id}`, updatedPost);
    return c.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log(`Error updating blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete blog post
app.delete('/make-server-8813977d/blog-posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`blog_post_${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting blog post: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== INITIATIVES ROUTES =====

// Get all initiatives
app.get('/make-server-8813977d/initiatives', async (c) => {
  try {
    const initiatives = await kv.getByPrefix('initiative_');
    return c.json({ success: true, initiatives });
  } catch (error) {
    console.log(`Error fetching initiatives: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create initiative
app.post('/make-server-8813977d/initiatives', async (c) => {
  try {
    const body = await c.req.json();
    const { title, description, imageUrl, impact } = body;
    
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const initiative = {
      id,
      title,
      description,
      imageUrl,
      impact,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`initiative_${id}`, initiative);
    return c.json({ success: true, initiative });
  } catch (error) {
    console.log(`Error creating initiative: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update initiative
app.put('/make-server-8813977d/initiatives/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingInitiative = await kv.get(`initiative_${id}`);
    if (!existingInitiative) {
      return c.json({ success: false, error: 'Initiative not found' }, 404);
    }
    
    const updatedInitiative = {
      ...existingInitiative,
      ...body,
    };
    
    await kv.set(`initiative_${id}`, updatedInitiative);
    return c.json({ success: true, initiative: updatedInitiative });
  } catch (error) {
    console.log(`Error updating initiative: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete initiative
app.delete('/make-server-8813977d/initiatives/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`initiative_${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting initiative: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== IMAGE UPLOAD ROUTE =====

app.post('/make-server-8813977d/upload-image', async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, fileName } = body;
    
    // Decode base64 image
    const base64Data = imageData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const uniqueFileName = `${Date.now()}_${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, binaryData, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    
    if (error) {
      console.log(`Error uploading image: ${error}`);
      return c.json({ success: false, error: String(error) }, 500);
    }
    
    // Get signed URL
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(uniqueFileName, 365 * 24 * 60 * 60); // 1 year
    
    return c.json({ 
      success: true, 
      imageUrl: signedUrlData?.signedUrl || '',
      path: uniqueFileName
    });
  } catch (error) {
    console.log(`Error in image upload: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===== SETTINGS ROUTES =====

// Get site settings
app.get('/make-server-8813977d/settings', async (c) => {
  try {
    let settings = await kv.get('site_settings');
    if (!settings) {
      // Default settings
      settings = {
        siteName: 'Layeni Ogunmakinwa Foundation',
        tagline: 'Empowering Communities, Transforming Lives',
        email: 'lof.us.ng@gmail.com',
        mission: 'To create sustainable change through education, healthcare, and community development.',
        impactStats: [
          { label: 'Lives Touched', value: '10,000+' },
          { label: 'Communities Served', value: '50+' },
          { label: 'Projects Completed', value: '100+' },
        ],
      };
      await kv.set('site_settings', settings);
    }
    return c.json({ success: true, settings });
  } catch (error) {
    console.log(`Error fetching settings: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update site settings
app.put('/make-server-8813977d/settings', async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('site_settings', body);
    return c.json({ success: true, settings: body });
  } catch (error) {
    console.log(`Error updating settings: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
