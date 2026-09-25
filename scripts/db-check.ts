import { prisma } from '@/lib/db';

async function main() {
  const count = await prisma.config.count();
  console.log('config records:', count);
  const rows = await prisma.config.findMany();
  console.log(JSON.stringify(rows, null, 2));

  const sessionCount = await prisma.adminSession.count();
  console.log('admin sessions:', sessionCount);
  const merchantCount = await prisma.merchant.count();
  console.log('merchants:', merchantCount);
  const payTypeCount = await prisma.payType.count();
  console.log('pay types:', payTypeCount);
  const channelCount = await prisma.channel.count();
  console.log('channels:', channelCount);
}

main()
  .catch((err) => {
    console.error('DB check failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
