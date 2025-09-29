// Database setup and migration utilities
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not found. Using mock data.')
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Database schema definitions
export const TABLES = {
  NEWS: 'news',
  EVENTS: 'events',
  RESULTS: 'results',
  GENERAL_BODY: 'general_body',
  HERO_IMAGES: 'hero_images',
  QUICK_LINKS: 'quick_links',
  STATS: 'stats',
  USERS: 'users',
  ADMIN_USERS: 'admin_users'
}

// Table schemas
export const SCHEMAS = {
  [TABLES.NEWS]: {
    id: 'uuid primary key default gen_random_uuid()',
    title: 'text not null',
    description: 'text',
    content: 'text',
    featured_image: 'text',
    author: 'text',
    published: 'boolean default false',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.EVENTS]: {
    id: 'uuid primary key default gen_random_uuid()',
    title: 'text not null',
    description: 'text',
    content: 'text',
    event_date: 'date',
    event_time: 'time',
    location: 'text',
    address: 'text',
    registration_required: 'boolean default false',
    registration_deadline: 'date',
    max_participants: 'integer',
    current_participants: 'integer default 0',
    photos: 'text[]',
    status: 'text default "upcoming"',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.RESULTS]: {
    id: 'uuid primary key default gen_random_uuid()',
    title: 'text not null',
    description: 'text',
    event_id: 'uuid references events(id)',
    document_url: 'text',
    results_data: 'jsonb',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.GENERAL_BODY]: {
    id: 'uuid primary key default gen_random_uuid()',
    district: 'text not null',
    position: 'text not null',
    name: 'text not null',
    contact: 'text',
    email: 'text',
    photo: 'text',
    bio: 'text',
    order_index: 'integer default 0',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.HERO_IMAGES]: {
    id: 'uuid primary key default gen_random_uuid()',
    image_url: 'text not null',
    alt_text: 'text',
    caption: 'text',
    is_active: 'boolean default true',
    order_index: 'integer default 0',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.QUICK_LINKS]: {
    id: 'uuid primary key default gen_random_uuid()',
    title: 'text not null',
    url: 'text not null',
    description: 'text',
    icon: 'text',
    category: 'text',
    is_external: 'boolean default false',
    is_active: 'boolean default true',
    order_index: 'integer default 0',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  },
  [TABLES.STATS]: {
    id: 'uuid primary key default gen_random_uuid()',
    category: 'text not null',
    value: 'text not null',
    label: 'text not null',
    icon: 'text',
    color: 'text',
    bg_color: 'text',
    order_index: 'integer default 0',
    is_active: 'boolean default true',
    created_at: 'timestamp with time zone default now()',
    updated_at: 'timestamp with time zone default now()'
  }
}

// Create tables if they don't exist
export async function createTables() {
  if (!supabase) {
    console.log('Supabase not configured. Skipping table creation.')
    return
  }

  try {
    for (const [tableName, schema] of Object.entries(SCHEMAS)) {
      const columns = Object.entries(schema)
        .map(([name, definition]) => `${name} ${definition}`)
        .join(', ')
      
      const { error } = await supabase.rpc('create_table_if_not_exists', {
        table_name: tableName,
        columns: columns
      })
      
      if (error) {
        console.error(`Error creating table ${tableName}:`, error)
      } else {
        console.log(`Table ${tableName} created successfully`)
      }
    }
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

// Seed initial data
export async function seedInitialData() {
  if (!supabase) {
    console.log('Supabase not configured. Skipping data seeding.')
    return
  }

  try {
    // Seed quick links
    const quickLinks = [
      {
        title: 'MYAS Compliance',
        url: '/myas-compliance',
        description: 'Ministry compliance information',
        icon: 'Shield',
        category: 'Compliance',
        is_external: false,
        order_index: 1
      },
      {
        title: 'Anti-Doping Guidelines',
        url: '/anti-dop-guidelines',
        description: 'Anti-doping policies and procedures',
        icon: 'AlertTriangle',
        category: 'Compliance',
        is_external: false,
        order_index: 2
      },
      {
        title: 'Rules & Regulations',
        url: '/events/rules-regulations',
        description: 'Official rules and regulations',
        icon: 'BookOpen',
        category: 'Rules',
        is_external: false,
        order_index: 3
      },
      {
        title: 'Contact Us',
        url: '/contact',
        description: 'Get in touch with us',
        icon: 'Mail',
        category: 'Contact',
        is_external: false,
        order_index: 4
      }
    ]

    for (const link of quickLinks) {
      const { error } = await supabase
        .from(TABLES.QUICK_LINKS)
        .upsert(link, { onConflict: 'title' })
      
      if (error) {
        console.error('Error seeding quick links:', error)
      }
    }

    // Seed stats
    const stats = [
      {
        category: 'events',
        value: '12',
        label: 'Events',
        icon: 'Calendar',
        color: 'text-blue-600',
        bg_color: 'bg-blue-100',
        order_index: 1
      },
      {
        category: 'members',
        value: '48',
        label: 'Members',
        icon: 'Users',
        color: 'text-emerald-600',
        bg_color: 'bg-emerald-100',
        order_index: 2
      },
      {
        category: 'news',
        value: '23',
        label: 'News Articles',
        icon: 'Newspaper',
        color: 'text-violet-600',
        bg_color: 'bg-violet-100',
        order_index: 3
      },
      {
        category: 'results',
        value: '7',
        label: 'Results',
        icon: 'Trophy',
        color: 'text-orange-600',
        bg_color: 'bg-orange-100',
        order_index: 4
      }
    ]

    for (const stat of stats) {
      const { error } = await supabase
        .from(TABLES.STATS)
        .upsert(stat, { onConflict: 'category' })
      
      if (error) {
        console.error('Error seeding stats:', error)
      }
    }

    console.log('Initial data seeded successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

// Database health check
export async function checkDatabaseHealth() {
  if (!supabase) {
    return { status: 'mock', message: 'Using mock data' }
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.NEWS)
      .select('count')
      .limit(1)
    
    if (error) {
      return { status: 'error', message: error.message }
    }
    
    return { status: 'connected', message: 'Database connection successful' }
  } catch (error) {
    return { status: 'error', message: error.message }
  }
}

// Migration utilities
export async function runMigrations() {
  if (!supabase) {
    console.log('Supabase not configured. Skipping migrations.')
    return
  }

  try {
    await createTables()
    await seedInitialData()
    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}
