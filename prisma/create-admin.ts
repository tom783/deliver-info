import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(process.cwd(), '.env.local'), override: true });
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx tsx prisma/create-admin.ts <email>');
    process.exit(1);
  }

  // Supabase Admin Client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Get user from Supabase Auth
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  const authUser = users.find(u => u.email === email);

  if (!authUser) {
    console.error(`User with email "${email}" not found in Supabase Auth`);
    process.exit(1);
  }

  // Check if already exists in admin_users
  const existing = await prisma.adminUser.findUnique({
    where: { authId: authUser.id },
  });

  if (existing) {
    console.log('Admin user already exists:', existing);
    return;
  }

  // Create admin user
  const adminUser = await prisma.adminUser.create({
    data: {
      authId: authUser.id,
      email: email,
      name: '관리자',
      role: 'MASTER',
    },
  });

  console.log('Created admin user:', adminUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
