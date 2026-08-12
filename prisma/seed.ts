import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database...');
  await prisma.review.deleteMany();
  await prisma.cVClassificationLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.match.deleteMany();
  await prisma.wasteRequest.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.wasteCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Waste Categories...');
  const catOrganik = await prisma.wasteCategory.create({
    data: {
      name: 'Organik',
      description: 'Limbah organik seperti sisa makanan, buah, sayuran, dan sisa dapur kompostabel.',
    },
  });

  const catAnorganik = await prisma.wasteCategory.create({
    data: {
      name: 'Anorganik',
      description: 'Limbah anorganik seperti plastik PET, kardus kemasan, kertas bekas, dan botol kaca.',
    },
  });

  const catLogam = await prisma.wasteCategory.create({
    data: {
      name: 'Logam',
      description: 'Limbah logam seperti kaleng alumunium, besi tua, seng, dan komponen kuningan/tembaga.',
    },
  });

  const catAmpasKopi = await prisma.wasteCategory.create({
    data: {
      name: 'Ampas Kopi',
      description: 'Ampas kopi basah & kering hasil ekstraksi espresso dari kedai kopi & rumah tangga (Kategori Spesial DaurNusa).',
    },
  });

  console.log('Seeding Users...');
  const userAhmad = await prisma.user.create({
    data: {
      fullName: 'Ahmad Syahfruddin',
      email: 'ahmad@daurnusa.id',
      phone: '081234567890',
      address: 'Jl. Tembalang Raya No. 12, Semarang',
      latitude: -7.0505,
      longitude: 110.4371,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isAdmin: false,
    },
  });

  const userBudi = await prisma.user.create({
    data: {
      fullName: 'Budi Santoso (Pengepul)',
      email: 'budi.pengepul@gmail.com',
      phone: '082198765432',
      address: 'Jl. Genuk Krajan No. 45, Semarang',
      latitude: -7.0421,
      longitude: 110.4412,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isAdmin: false,
    },
  });

  const userPakTani = await prisma.user.create({
    data: {
      fullName: 'Pak Tani Ungaran',
      email: 'paktani.ungaran@gmail.com',
      phone: '085611223344',
      address: 'Jl. Raya Ungaran No. 88, Semarang',
      latitude: -7.1201,
      longitude: 110.4022,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isAdmin: false,
    },
  });

  const userMurniCafe = await prisma.user.create({
    data: {
      fullName: 'Murni Cafe',
      email: 'murni.cafe@gmail.com',
      phone: '081900112233',
      address: 'Jl. Siranda No. 5, Semarang',
      latitude: -7.0490,
      longitude: 110.4350,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isAdmin: false,
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      fullName: 'Admin DaurNusa',
      email: 'admin@daurnusa.id',
      phone: '081100998877',
      address: 'HQ DaurNusa Semarang Central',
      latitude: -7.0500,
      longitude: 110.4300,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      isAdmin: true,
    },
  });

  console.log('Seeding Listings...');
  const listingAmpasKopi = await prisma.listing.create({
    data: {
      sellerId: userMurniCafe.id,
      categoryId: catAmpasKopi.id,
      title: 'Ampas Kopi Basah Espresso 25kg',
      photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600',
      estimatedWeightKg: 25.0,
      quantity: 25,
      unit: 'kg',
      condition: 'Segar harian',
      description: 'Ampas kopi murni 100% Arabika dari mesin espresso Murni Cafe. Sangat cocok untuk pupuk kompos, media tanam jamur, atau briket energi.',
      estimatedPrice: 1500.0,
      address: 'Jl. Siranda No. 5, Semarang',
      latitude: -7.0490,
      longitude: 110.4350,
      status: 'aktif',
      cvPredictedCategoryId: catAmpasKopi.id,
      cvConfidence: 94.5,
      isCvCorrected: false,
    },
  });

  const listingKardus = await prisma.listing.create({
    data: {
      sellerId: userAhmad.id,
      categoryId: catAnorganik.id,
      title: 'Kardus Bekas Pack Tebal 50kg',
      photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600',
      estimatedWeightKg: 50.0,
      quantity: 50,
      unit: 'kg',
      condition: 'Kering & Bersih',
      description: 'Kardus bekas pakan dan barang elektronik tebal double-wall. Kondisi sangat kering, diikat rapi per 10kg.',
      estimatedPrice: 2000.0,
      address: 'Jl. Tembalang Raya No. 12, Semarang',
      latitude: -7.0505,
      longitude: 110.4371,
      status: 'aktif',
      cvPredictedCategoryId: catAnorganik.id,
      cvConfidence: 91.2,
      isCvCorrected: false,
    },
  });

  const listingBotolPET = await prisma.listing.create({
    data: {
      sellerId: userAhmad.id,
      categoryId: catAnorganik.id,
      title: 'Botol Plastik PET Bening 10kg',
      photoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600',
      estimatedWeightKg: 10.0,
      quantity: 10,
      unit: 'kg',
      condition: 'Terpres & Tanpa Tutup',
      description: 'Botol plastik bekas air mineral 600ml & 1.5L sudah dibersihkan dan dipres pipih rapi.',
      estimatedPrice: 3500.0,
      address: 'Jl. Tembalang Raya No. 12, Semarang',
      latitude: -7.0505,
      longitude: 110.4371,
      status: 'terjual',
      cvPredictedCategoryId: catAnorganik.id,
      cvConfidence: 98.0,
      isCvCorrected: false,
    },
  });

  const listingJelantah = await prisma.listing.create({
    data: {
      sellerId: userMurniCafe.id,
      categoryId: catOrganik.id,
      title: 'Minyak Jelantah Restoran 15L',
      photoUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
      estimatedWeightKg: 15.0,
      quantity: 15,
      unit: 'L',
      condition: 'Disaring 1x',
      description: 'Minyak goreng bekas penggorengan dapur cafe. Sudah disaring halus dari sisa tepung kasar, cocok untuk bahan biodiesel.',
      estimatedPrice: 6500.0,
      address: 'Jl. Siranda No. 5, Semarang',
      latitude: -7.0490,
      longitude: 110.4350,
      status: 'aktif',
      cvPredictedCategoryId: catOrganik.id,
      cvConfidence: 87.4,
      isCvCorrected: true,
    },
  });

  const listingAlumunium = await prisma.listing.create({
    data: {
      sellerId: userAhmad.id,
      categoryId: catLogam.id,
      title: 'Kaleng Alumunium Minuman 5kg',
      photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      estimatedWeightKg: 5.0,
      quantity: 5,
      unit: 'kg',
      condition: 'Gepeng/Terpres',
      description: 'Kaleng minuman soda & larutan alumunium murni tanpa besi magnetic. Sudah dipres pipih.',
      estimatedPrice: 12000.0,
      address: 'Jl. Tembalang Raya No. 12, Semarang',
      latitude: -7.0505,
      longitude: 110.4371,
      status: 'terjual',
      cvPredictedCategoryId: catLogam.id,
      cvConfidence: 96.1,
      isCvCorrected: false,
    },
  });

  const listingSampahBuah = await prisma.listing.create({
    data: {
      sellerId: userAhmad.id,
      categoryId: catOrganik.id,
      title: 'Sampah Buah & Sayur Organik 30kg',
      photoUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600',
      estimatedWeightKg: 30.0,
      quantity: 30,
      unit: 'kg',
      condition: 'Basah Segar',
      description: 'Sisa kulit buah pisang, nanas, dan potongan sayuran segar pasar. Sangat disukai pakan maggot BSF & pupuk cair bioaktivator.',
      estimatedPrice: 800.0,
      address: 'Jl. Tembalang Raya No. 12, Semarang',
      latitude: -7.0505,
      longitude: 110.4371,
      status: 'aktif',
      cvPredictedCategoryId: catOrganik.id,
      cvConfidence: 93.8,
      isCvCorrected: false,
    },
  });

  console.log('Seeding Waste Requests...');
  const reqAmpasKopi = await prisma.wasteRequest.create({
    data: {
      buyerId: userPakTani.id,
      categoryId: catAmpasKopi.id,
      title: 'Butuh Ampas Kopi Rutin untuk Pupuk Organik',
      description: 'Mencari ampas kopi basah/kering rutin mingguan 50-100kg untuk pembuatan kompos organik pertanian perkebunan Ungaran.',
      quantityWanted: 100,
      unit: 'kg',
      offeredPrice: 2000.0,
      address: 'Jl. Raya Ungaran No. 88, Semarang',
      latitude: -7.1201,
      longitude: 110.4022,
      status: 'aktif',
    },
  });

  const reqKardus = await prisma.wasteRequest.create({
    data: {
      buyerId: userBudi.id,
      categoryId: catAnorganik.id,
      title: 'Dibutuhkan Kardus Bekas Segala Ukuran',
      description: 'Tampung kardus bekas skala kecil & besar. Kondisi kering diutamakan.',
      quantityWanted: 200,
      unit: 'kg',
      offeredPrice: 1500.0,
      address: 'Jl. Genuk Krajan No. 45, Semarang',
      latitude: -7.0421,
      longitude: 110.4412,
      status: 'aktif',
    },
  });

  const reqLogam = await prisma.wasteRequest.create({
    data: {
      buyerId: userBudi.id,
      categoryId: catLogam.id,
      title: 'Terima Botol Plastik PET & Kaleng Alumunium',
      description: 'Menerima kaleng alumunium & tembaga harga bersaing jemput lokasi untuk area Tembalang & Banyumanik.',
      quantityWanted: 50,
      unit: 'kg',
      offeredPrice: 11000.0,
      address: 'Jl. Genuk Krajan No. 45, Semarang',
      latitude: -7.0421,
      longitude: 110.4412,
      status: 'aktif',
    },
  });

  const reqOrganik = await prisma.wasteRequest.create({
    data: {
      buyerId: userPakTani.id,
      categoryId: catOrganik.id,
      title: 'Cari Limbah Organik Sayur/Buah untuk Budidaya Maggot',
      description: 'Membutuhkan limbah sisa buah/sayuran basah harian untuk pakan ternak maggot BSF.',
      quantityWanted: 50,
      unit: 'kg',
      offeredPrice: 1000.0,
      address: 'Jl. Raya Ungaran No. 88, Semarang',
      latitude: -7.1201,
      longitude: 110.4022,
      status: 'aktif',
    },
  });

  console.log('Seeding Matches...');
  const match1 = await prisma.match.create({
    data: {
      listingId: listingAmpasKopi.id,
      requestId: reqAmpasKopi.id,
      distanceKm: 0.8,
      status: 'disarankan',
    },
  });

  const match2 = await prisma.match.create({
    data: {
      listingId: listingKardus.id,
      requestId: reqKardus.id,
      distanceKm: 2.4,
      status: 'dilihat',
    },
  });

  const match3 = await prisma.match.create({
    data: {
      listingId: listingAlumunium.id,
      requestId: reqLogam.id,
      distanceKm: 5.1,
      status: 'dilihat',
    },
  });

  console.log('Seeding Conversations & Messages...');
  const conv1 = await prisma.conversation.create({
    data: {
      matchId: match1.id,
      sellerId: userMurniCafe.id,
      buyerId: userPakTani.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: userPakTani.id,
        content: 'Halo Murni Cafe, saya berminat ambil ampas kopi 25kg ini untuk campuran pupuk kompos di Ungaran.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 24),
      },
      {
        conversationId: conv1.id,
        senderId: userMurniCafe.id,
        content: 'Halo Pak Tani! Boleh sekali, ampas kopinya masih segar baru diambil dari mesin espresso hari ini.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 22),
      },
      {
        conversationId: conv1.id,
        senderId: userPakTani.id,
        content: 'Bisa nego di harga Rp 1.800 per kg? Nanti saya ambil langsung ke lokasi cafe sore ini jam 4.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 20),
      },
      {
        conversationId: conv1.id,
        senderId: userMurniCafe.id,
        content: 'Deal Pak, Rp 1.800/kg x 25kg = Rp 45.000 ya. Ditunggu kedatangannya di Jl. Siranda No. 5.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 18),
      },
    ],
  });

  const conv2 = await prisma.conversation.create({
    data: {
      matchId: match3.id,
      sellerId: userAhmad.id,
      buyerId: userBudi.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        senderId: userBudi.id,
        content: 'Pak Ahmad, kaleng alumuniumnya 5kg masih ready? Saya tawar Rp 11.500/kg.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 12),
      },
      {
        conversationId: conv2.id,
        senderId: userAhmad.id,
        content: 'Ready Pak Budi! Boleh Rp 11.500/kg, total Rp 57.500.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 10),
      },
      {
        conversationId: conv2.id,
        senderId: userBudi.id,
        content: 'Siap Pak, saya lunasi tunai saat COD ya.',
        isRead: true,
        sentAt: new Date(Date.now() - 3600000 * 8),
      },
    ],
  });

  console.log('Seeding Transactions & Reviews...');
  const trx1 = await prisma.transaction.create({
    data: {
      conversationId: conv1.id,
      listingId: listingAmpasKopi.id,
      sellerId: userMurniCafe.id,
      buyerId: userPakTani.id,
      categoryId: catAmpasKopi.id,
      finalPrice: 45000.0,
      finalQuantity: 25,
      unit: 'kg',
      status: 'selesai',
      completedAt: new Date(Date.now() - 3600000 * 16),
    },
  });

  await prisma.review.create({
    data: {
      transactionId: trx1.id,
      reviewerId: userPakTani.id,
      revieweeId: userMurniCafe.id,
      rating: 5,
      comment: 'Ampas kopi sangat bersih, tidak tercampur sampah plastik. Seller sangat ramah dan responsif!',
    },
  });

  await prisma.review.create({
    data: {
      transactionId: trx1.id,
      reviewerId: userMurniCafe.id,
      revieweeId: userPakTani.id,
      rating: 5,
      comment: 'Pembeli sangat tepat waktu dan pembayaran COD lancar. Terima kasih banyak!',
    },
  });

  const trx2 = await prisma.transaction.create({
    data: {
      conversationId: conv2.id,
      listingId: listingAlumunium.id,
      sellerId: userAhmad.id,
      buyerId: userBudi.id,
      categoryId: catLogam.id,
      finalPrice: 57500.0,
      finalQuantity: 5,
      unit: 'kg',
      status: 'selesai',
      completedAt: new Date(Date.now() - 3600000 * 6),
    },
  });

  await prisma.review.create({
    data: {
      transactionId: trx2.id,
      reviewerId: userBudi.id,
      revieweeId: userAhmad.id,
      rating: 5,
      comment: 'Kaleng alumunium sudah terpres rapi dan ditimbang akurat. Mantap!',
    },
  });

  const trx3 = await prisma.transaction.create({
    data: {
      listingId: listingKardus.id,
      sellerId: userAhmad.id,
      buyerId: userBudi.id,
      categoryId: catAnorganik.id,
      finalPrice: 85000.0,
      finalQuantity: 50,
      unit: 'kg',
      status: 'menunggu_konfirmasi',
    },
  });

  console.log('Seeding CV Classification Logs...');
  await prisma.cVClassificationLog.create({
    data: {
      listingId: listingAmpasKopi.id,
      photoUrl: listingAmpasKopi.photoUrl,
      predictedCategoryId: catAmpasKopi.id,
      confidence: 94.5,
      modelProvider: 'roboflow',
    },
  });

  await prisma.cVClassificationLog.create({
    data: {
      listingId: listingKardus.id,
      photoUrl: listingKardus.photoUrl,
      predictedCategoryId: catAnorganik.id,
      confidence: 91.2,
      modelProvider: 'teachable_machine',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
