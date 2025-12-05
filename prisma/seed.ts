import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed carriers
  const carriers = [
    {
      name: 'CJ대한통운',
      baseUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking?gnrlInvoiceNum=',
    },
    {
      name: '우체국택배',
      baseUrl: 'https://service.epost.go.kr/trace.RetrieveDomRgiTraceList.comm?sid1=',
    },
    {
      name: '한진택배',
      baseUrl: 'https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mession_open=Y&wblnumText2=',
    },
    {
      name: '롯데택배',
      baseUrl: 'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=',
    },
    {
      name: '로젠택배',
      baseUrl: 'https://www.ilogen.com/web/personal/trace/',
    },
  ];

  for (const carrier of carriers) {
    await prisma.carrier.upsert({
      where: { name: carrier.name },
      update: { baseUrl: carrier.baseUrl },
      create: carrier,
    });
  }

  console.log('Carriers seeded successfully');

  // Note: Master admin user should be created manually via Supabase Auth
  // After creating the user in Supabase Auth, create the AdminUser record:
  //
  // await prisma.adminUser.create({
  //   data: {
  //     authId: 'supabase-auth-user-id',
  //     email: 'admin@example.com',
  //     name: '최고관리자',
  //     role: 'MASTER',
  //   },
  // });

  console.log('Database seeding completed');
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
