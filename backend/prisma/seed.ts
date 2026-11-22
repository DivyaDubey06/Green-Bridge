import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to generate a deterministic 24-character hex MongoDB ObjectId from a synthetic ID
export function toObjectId(prefix: string, syntheticId: string): string {
  const hash = crypto.createHash('md5').update(`${prefix}:${syntheticId}`).digest('hex');
  return hash.slice(0, 24);
}

// Dataset directory
const DATASET_DIR = path.join(__dirname, '..', 'dataset', 'GreenBridge_Dehradun_Synthetic_Dataset');

async function seed() {
  console.log('=====================================================');
  console.log('🌱 GreenBridge Safe Database Seeding Engine');
  console.log('=====================================================');
  console.log(`Loading dataset from: ${DATASET_DIR}`);

  if (!fs.existsSync(DATASET_DIR)) {
    throw new Error(`Dataset directory not found at ${DATASET_DIR}. Please extract dataset first.`);
  }

  // Load JSON collections
  const rawUsers = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'users.json'), 'utf8'));
  const rawNgos = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'ngos.json'), 'utf8'));
  const rawOpps = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'opportunities.json'), 'utf8'));
  const rawApps = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'applications.json'), 'utf8'));
  const rawEvents = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'events.json'), 'utf8'));
  const rawEventRegs = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'event_registrations.json'), 'utf8'));
  const rawEcoProducts = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'eco_products.json'), 'utf8'));
  const rawOrders = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'orders.json'), 'utf8'));
  const rawOrderItems = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'order_items.json'), 'utf8'));
  const rawDonations = JSON.parse(fs.readFileSync(path.join(DATASET_DIR, 'donations.json'), 'utf8'));

  console.log(`Loaded dataset records:`);
  console.log(` - Users: ${rawUsers.length}`);
  console.log(` - NGOs: ${rawNgos.length}`);
  console.log(` - Opportunities: ${rawOpps.length}`);
  console.log(` - Applications: ${rawApps.length}`);
  console.log(` - Events: ${rawEvents.length}`);
  console.log(` - Event Registrations: ${rawEventRegs.length}`);
  console.log(` - EcoCart Products: ${rawEcoProducts.length}`);
  console.log(` - Orders: ${rawOrders.length}`);
  console.log(` - Order Items: ${rawOrderItems.length}`);
  console.log(` - Monetary Donations: ${rawDonations.length}`);
  console.log(` Total Synthetic Records: ${rawUsers.length + rawNgos.length + rawOpps.length + rawApps.length + rawEvents.length + rawEventRegs.length + rawEcoProducts.length + rawOrders.length + rawOrderItems.length + rawDonations.length}`);

  // Test database connection
  let isMongoConnected = false;
  try {
    await prisma.$connect();
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas via Prisma Client.');
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MongoDB Atlas (network or credentials not yet configured):', err.message);
    console.log('Will populate file-backed mock database (db.json) for seamless local execution.');
  }

  // Common demo password hashes
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const sonaaPasswordHash = await bcrypt.hash('sonaa123', 10);
  const demoPasswordHash = await bcrypt.hash('password123', 10);

  // In-memory collections for local db.json
  const memoryDb: any = {
    users: [],
    organizations: [],
    opportunities: [],
    applications: [],
    events: [],
    eventRegistrations: [],
    donations: [],
    ecoProducts: [],
    orders: [],
    orderItems: [],
    monetaryDonations: [],
    certificates: [],
    notifications: [],
    badges: [],
  };

  // ---------------------------------------------------------
  // 1. Core Platform Users (Authoritative seed)
  // ---------------------------------------------------------
  const coreUsers = [
    {
      id: toObjectId('user', 'usr-admin'),
      syntheticId: 'usr-admin',
      name: 'Admin Moderator',
      email: 'admin@greenbridge.org',
      password: adminPasswordHash,
      city: 'Dehradun',
      state: 'Uttarakhand',
      locality: 'Rajpur Road',
      avatar: { hair: 'style-2', eyes: 'neutral', skin: '#FAD7A0', clothing: '#1B4332', accessory: 'tshirt-badge' },
      level: 10,
      xp: 9999,
      badges: ['1', '2', '3', '4', '5', '6'],
      interests: ['Environment', 'Education', 'Health'],
      availability: 'Flexible',
      role: 'ADMIN' as const,
      isSynthetic: false,
      createdAt: new Date('2026-01-01'),
    },
    {
      id: toObjectId('user', 'usr-sonaa'),
      syntheticId: 'usr-sonaa',
      name: 'Sonaa Dobriyal',
      email: 'sonaa@gmail.com',
      password: sonaaPasswordHash,
      city: 'Dehradun',
      state: 'Uttarakhand',
      locality: 'Karanpur',
      avatar: { hair: 'style-1', eyes: 'happy', skin: '#F5CBA7', clothing: '#2E7D32', accessory: 'plant-leaf' },
      level: 2,
      xp: 320,
      badges: ['1', '3'],
      interests: ['Environment', 'Education'],
      availability: 'Weekends',
      role: 'USER' as const,
      isSynthetic: false,
      createdAt: new Date('2026-02-01'),
    },
  ];

  for (const cu of coreUsers) {
    memoryDb.users.push(cu);
    if (isMongoConnected) {
      await prisma.user.upsert({
        where: { email: cu.email },
        create: cu,
        update: { role: cu.role, name: cu.name },
      });
    }
  }

  // ---------------------------------------------------------
  // 2. Import Synthetic Users (400 records)
  // ---------------------------------------------------------
  console.log('Importing Users...');
  let importedUsers = 0;
  for (const u of rawUsers) {
    const userId = toObjectId('users.json', u.user_id);
    const userRole = u.role === 'NGO Admin' ? 'ORGANIZATION' : (u.email.includes('admin') ? 'ADMIN' : 'USER');
    const userDoc = {
      id: userId,
      syntheticId: u.user_id,
      name: u.full_name,
      email: u.email,
      password: demoPasswordHash,
      city: u.city || 'Dehradun',
      state: 'Uttarakhand',
      locality: u.locality || 'Dehradun',
      avatar: {
        hair: 'style-1',
        eyes: 'neutral',
        skin: '#F5CBA7',
        clothing: '#2E7D32',
        accessory: 'none',
      },
      level: Math.max(1, Math.floor((u.points || 0) / 100)),
      xp: u.points || 0,
      badges: [],
      interests: u.interests || [],
      availability: u.availability || 'Flexible',
      role: userRole as any,
      isSynthetic: true,
      createdAt: new Date(u.joined_on || '2026-01-01'),
    };

    memoryDb.users.push(userDoc);
    if (isMongoConnected) {
      await prisma.user.upsert({
        where: { email: u.email },
        create: userDoc,
        update: {},
      });
    }
    importedUsers++;
  }

  // ---------------------------------------------------------
  // 3. Import NGOs / Organizations (80 records)
  // ---------------------------------------------------------
  console.log('Importing Organizations / NGOs...');
  let importedNgos = 0;
  for (const n of rawNgos) {
    const orgId = toObjectId('ngos.json', n.ngo_id);
    const contactUserId = toObjectId('ngo-owner', n.ngo_id);

    // Ensure NGO contact person has a User account as owner
    const ownerUser = {
      id: contactUserId,
      syntheticId: `USR-OWNER-${n.ngo_id}`,
      name: n.contact_person,
      email: n.contact_email,
      password: demoPasswordHash,
      city: n.city || 'Dehradun',
      state: 'Uttarakhand',
      locality: n.locality || 'Dehradun',
      avatar: {
        hair: 'style-2',
        eyes: 'happy',
        skin: '#FAD7A0',
        clothing: '#105666',
        accessory: 'none',
      },
      level: 3,
      xp: 500,
      badges: [],
      interests: [n.focus_area],
      availability: 'Flexible',
      role: 'ORGANIZATION' as const,
      isSynthetic: true,
      createdAt: new Date(n.submitted_on || '2026-01-01'),
    };

    memoryDb.users.push(ownerUser);
    if (isMongoConnected) {
      await prisma.user.upsert({
        where: { email: n.contact_email },
        create: ownerUser,
        update: {},
      });
    }

    const orgDoc = {
      id: orgId,
      syntheticId: n.ngo_id,
      ownerId: contactUserId,
      organizationName: n.ngo_name,
      description: `Synthetic demonstration NGO active in ${n.locality}, Dehradun focused on ${n.focus_area}.`,
      mission: `Empowering communities and advancing ${n.focus_area} in Uttarakhand.`,
      category: n.focus_area,
      focusArea: n.focus_area,
      registrationType: n.registration_type,
      city: n.city,
      locality: n.locality,
      website: `https://${n.ngo_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.org`,
      phone: '+91 98765' + Math.floor(10000 + Math.random() * 90000),
      logo: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=150&auto=format&fit=crop&q=60',
      verificationStatus: (n.verification_status === 'Approved' ? 'APPROVED' : (n.verification_status === 'Rejected' ? 'REJECTED' : 'PENDING')) as any,
      registrationCertificate: n.registration_number,
      isSynthetic: true,
      createdAt: new Date(n.submitted_on || '2026-01-01'),
    };

    memoryDb.organizations.push(orgDoc);
    if (isMongoConnected) {
      await prisma.organization.upsert({
        where: { syntheticId: n.ngo_id },
        create: orgDoc,
        update: {},
      });
    }
    importedNgos++;
  }

  // ---------------------------------------------------------
  // 4. Import Opportunities (240 records)
  // ---------------------------------------------------------
  console.log('Importing Opportunities...');
  let importedOpps = 0;
  for (const o of rawOpps) {
    const oppId = toObjectId('opportunities.json', o.opportunity_id);
    const orgId = toObjectId('ngos.json', o.ngo_id);

    const oppDoc = {
      id: oppId,
      syntheticId: o.opportunity_id,
      organizationId: orgId,
      title: o.title,
      description: o.description,
      category: o.category,
      location: `${o.locality}, ${o.city}`,
      city: o.city,
      locality: o.locality,
      date: o.start_date,
      endDate: o.end_date,
      time: o.time_slot || '09:00 AM - 12:00 PM',
      timeSlot: o.time_slot,
      duration: '3 Hours',
      skillsRequired: o.required_skills || [],
      volunteerLimit: o.slots_total || 20,
      slotsFilled: o.slots_filled || 0,
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60',
      status: (o.status === 'Open' ? 'OPEN' : 'CLOSED') as any,
      isSynthetic: true,
      createdAt: new Date(o.created_at || o.start_date || '2026-01-01'),
    };

    memoryDb.opportunities.push(oppDoc);
    if (isMongoConnected) {
      await prisma.opportunity.upsert({
        where: { syntheticId: o.opportunity_id },
        create: oppDoc,
        update: {},
      });
    }
    importedOpps++;
  }

  // ---------------------------------------------------------
  // 5. Import Applications (500 records)
  // ---------------------------------------------------------
  console.log('Importing Applications...');
  let importedApps = 0;
  for (const a of rawApps) {
    const appId = toObjectId('applications.json', a.application_id);
    const oppId = toObjectId('opportunities.json', a.opportunity_id);
    const userId = toObjectId('users.json', a.user_id);

    const appDoc = {
      id: appId,
      syntheticId: a.application_id,
      opportunityId: oppId,
      userId: userId,
      status: (a.status === 'Accepted' || a.status === 'Shortlisted' ? 'ACCEPTED' : (a.status === 'Rejected' ? 'REJECTED' : 'PENDING')) as any,
      notes: a.volunteer_note || 'Interested in contributing to this social initiative.',
      hoursContributed: a.hours_contributed || 0,
      volunteerNote: a.volunteer_note,
      isSynthetic: true,
      createdAt: new Date(a.applied_on || '2026-01-01'),
    };

    memoryDb.applications.push(appDoc);
    if (isMongoConnected) {
      await prisma.application.upsert({
        where: { syntheticId: a.application_id },
        create: appDoc,
        update: {},
      });
    }
    importedApps++;
  }

  // ---------------------------------------------------------
  // 6. Import Events (150 records)
  // ---------------------------------------------------------
  console.log('Importing Events...');
  let importedEvents = 0;
  for (const e of rawEvents) {
    const eventId = toObjectId('events.json', e.event_id);
    const orgId = toObjectId('ngos.json', e.ngo_id);

    const eventDoc = {
      id: eventId,
      syntheticId: e.event_id,
      organizationId: orgId,
      title: e.event_name,
      theme: e.theme,
      description: e.description,
      banner: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=60',
      date: e.event_date,
      time: `${e.start_time || '09:00'} - ${e.end_time || '17:00'}`,
      startTime: e.start_time,
      endTime: e.end_time,
      location: `${e.venue_locality}, ${e.city}`,
      venueLocality: e.venue_locality,
      city: e.city,
      capacity: e.capacity || 50,
      registeredUsers: [],
      category: e.theme || 'Community',
      status: e.status || 'Scheduled',
      isSynthetic: true,
      createdAt: new Date(e.event_date || '2026-01-01'),
    };

    memoryDb.events.push(eventDoc);
    if (isMongoConnected) {
      await prisma.event.upsert({
        where: { syntheticId: e.event_id },
        create: eventDoc,
        update: {},
      });
    }
    importedEvents++;
  }

  // ---------------------------------------------------------
  // 7. Import Event Registrations (250 records)
  // ---------------------------------------------------------
  console.log('Importing Event Registrations...');
  let importedRegs = 0;
  for (const r of rawEventRegs) {
    const regId = toObjectId('event_registrations.json', r.event_registration_id);
    const eventId = toObjectId('events.json', r.event_id);
    const userId = toObjectId('users.json', r.user_id);

    const regDoc = {
      id: regId,
      syntheticId: r.event_registration_id,
      eventId: eventId,
      userId: userId,
      attendanceStatus: r.attendance_status || 'Registered',
      isSynthetic: true,
      createdAt: new Date(r.registered_on || '2026-01-01'),
    };

    memoryDb.eventRegistrations.push(regDoc);
    if (isMongoConnected) {
      await prisma.eventRegistration.upsert({
        where: { syntheticId: r.event_registration_id },
        create: regDoc,
        update: {},
      });
    }
    importedRegs++;
  }

  // ---------------------------------------------------------
  // 8. Import EcoCart Products (120 records)
  // ---------------------------------------------------------
  console.log('Importing EcoCart Products...');
  let importedProducts = 0;
  for (const p of rawEcoProducts) {
    const prodId = toObjectId('eco_products.json', p.product_id);

    const productDoc = {
      id: prodId,
      syntheticId: p.product_id,
      title: p.product_name,
      description: `${p.product_name} hand-crafted from ${p.material || 'sustainable resources'}. ${p.eco_claim || 'Eco-friendly and biodegradable.'}`,
      price: p.price_inr,
      category: p.category,
      sellerName: p.seller_name,
      sellerLocality: p.seller_locality,
      city: p.city || 'Dehradun',
      stockQuantity: p.stock_quantity || 0,
      inStock: p.product_status !== 'Out of Stock' && (p.stock_quantity || 0) > 0,
      material: p.material,
      ecoClaim: p.eco_claim,
      images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60'],
      whatsapp: '9198765' + Math.floor(10000 + Math.random() * 90000),
      isSynthetic: true,
      createdAt: new Date('2026-01-01'),
    };

    memoryDb.ecoProducts.push(productDoc);
    if (isMongoConnected) {
      await prisma.ecoProduct.upsert({
        where: { syntheticId: p.product_id },
        create: productDoc,
        update: {},
      });
    }
    importedProducts++;
  }

  // ---------------------------------------------------------
  // 9. Import Orders (180 records)
  // ---------------------------------------------------------
  console.log('Importing Orders...');
  let importedOrders = 0;
  for (const o of rawOrders) {
    const orderId = toObjectId('orders.json', o.order_id);
    const userId = toObjectId('users.json', o.user_id);

    const orderDoc = {
      id: orderId,
      syntheticId: o.order_id,
      userId: userId,
      orderStatus: o.order_status,
      subtotal: o.subtotal_inr,
      deliveryFee: o.delivery_fee_inr || 0,
      total: (o.subtotal_inr || 0) + (o.delivery_fee_inr || 0),
      paymentStatus: o.payment_status,
      paymentMode: 'UPI',
      deliveryCity: o.delivery_city || 'Dehradun',
      deliveryLocality: o.delivery_locality,
      isSynthetic: true,
      createdAt: new Date(o.order_date || '2026-01-01'),
    };

    memoryDb.orders.push(orderDoc);
    if (isMongoConnected) {
      await prisma.order.upsert({
        where: { syntheticId: o.order_id },
        create: orderDoc,
        update: {},
      });
    }
    importedOrders++;
  }

  // ---------------------------------------------------------
  // 10. Import Order Items (363 records)
  // ---------------------------------------------------------
  console.log('Importing Order Items...');
  let importedItems = 0;
  for (const it of rawOrderItems) {
    const itemId = toObjectId('order_items.json', it.order_item_id);
    const orderId = toObjectId('orders.json', it.order_id);
    const prodId = toObjectId('eco_products.json', it.product_id);

    const itemDoc = {
      id: itemId,
      syntheticId: it.order_item_id,
      orderId: orderId,
      productId: prodId,
      quantity: it.quantity,
      unitPrice: it.unit_price_inr,
      lineTotal: it.line_total_inr,
      isSynthetic: true,
      createdAt: new Date('2026-01-01'),
    };

    memoryDb.orderItems.push(itemDoc);
    if (isMongoConnected) {
      await prisma.orderItem.upsert({
        where: { syntheticId: it.order_item_id },
        create: itemDoc,
        update: {},
      });
    }
    importedItems++;
  }

  // ---------------------------------------------------------
  // 11. Import Monetary Donations (400 records)
  // ---------------------------------------------------------
  console.log('Importing Monetary Donations...');
  let importedDonations = 0;
  for (const d of rawDonations) {
    const donId = toObjectId('donations.json', d.donation_id);
    const donorUserId = toObjectId('users.json', d.donor_user_id);
    const orgId = toObjectId('ngos.json', d.ngo_id);

    const donationDoc = {
      id: donId,
      syntheticId: d.donation_id,
      donorUserId: donorUserId,
      organizationId: orgId,
      campaignName: d.campaign_name,
      amount: d.amount_inr,
      donationDate: d.donation_date,
      paymentStatus: d.payment_status,
      paymentMode: d.payment_mode,
      transactionReference: d.transaction_reference,
      isRecurring: d.is_recurring || false,
      isSynthetic: true,
      createdAt: new Date(d.donation_date || '2026-01-01'),
    };

    memoryDb.monetaryDonations.push(donationDoc);
    if (isMongoConnected) {
      await prisma.monetaryDonation.upsert({
        where: { syntheticId: d.donation_id },
        create: donationDoc,
        update: {},
      });
    }
    importedDonations++;
  }

  // ---------------------------------------------------------
  // 12. Seed Physical Item Donations (for Donations Marketplace)
  // ---------------------------------------------------------
  console.log('Seeding Physical Item Donations...');
  const physicalDonations = [
    {
      id: toObjectId('item-don', 'don-1'),
      ownerId: toObjectId('user', 'usr-sonaa'),
      title: 'NCERT Grade 10 Science & Math Textbooks',
      description: 'Complete set of CBSE Class 10 books in clean condition. All chapters intact with minimal pencil notes.',
      images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60'],
      category: 'Books & Education',
      condition: 'Gently Used',
      location: 'Karanpur, Dehradun',
      status: 'AVAILABLE' as const,
      contactInfo: '+91 9876501234',
      isSynthetic: false,
      createdAt: new Date('2026-05-01'),
    },
    {
      id: toObjectId('item-don', 'don-2'),
      ownerId: toObjectId('user', 'usr-admin'),
      title: 'Warm Fleece Winter Jackets (Age 8-12)',
      description: 'Three warm winter jackets for children living in higher hills of Mussoorie / Dehradun. Cleaned and washed.',
      images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=60'],
      category: 'Clothes & Woolens',
      condition: 'Like New',
      location: 'Rajpur Road, Dehradun',
      status: 'AVAILABLE' as const,
      contactInfo: '+91 9876543210',
      isSynthetic: false,
      createdAt: new Date('2026-05-10'),
    },
    {
      id: toObjectId('item-don', 'don-3'),
      ownerId: toObjectId('user', 'usr-sonaa'),
      title: 'Lightweight Folding Wheelchair',
      description: 'Manual folding wheelchair in excellent condition with functional brakes and footrests. Ideal for senior citizens.',
      images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60'],
      category: 'Medical Aid',
      condition: 'Excellent',
      location: 'Chakrata Road, Dehradun',
      status: 'AVAILABLE' as const,
      contactInfo: '+91 9876501234',
      isSynthetic: false,
      createdAt: new Date('2026-06-01'),
    },
    {
      id: toObjectId('item-don', 'don-4'),
      ownerId: toObjectId('user', 'usr-admin'),
      title: 'Drawing Pads & Acrylic Color Sets',
      description: 'Art supplies for community children workshops. 5 drawing pads and 3 boxes of acrylic color tubes.',
      images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60'],
      category: 'Art & Stationery',
      condition: 'Brand New',
      location: 'Dalanwala, Dehradun',
      status: 'AVAILABLE' as const,
      contactInfo: '+91 9876543210',
      isSynthetic: false,
      createdAt: new Date('2026-06-15'),
    },
  ];

  for (const pd of physicalDonations) {
    memoryDb.donations.push(pd);
    if (isMongoConnected) {
      await prisma.donation.upsert({
        where: { id: pd.id },
        create: pd,
        update: {},
      });
    }
  }

  // ---------------------------------------------------------
  // 13. Synchronize with file-backed mock database (db.json)
  // ---------------------------------------------------------
  const dbJsonPath = path.join(__dirname, '..', 'db.json');
  fs.writeFileSync(dbJsonPath, JSON.stringify(memoryDb, null, 2), 'utf8');
  console.log(`✅ Synchronized file-backed mock database: ${dbJsonPath}`);

  // Summary Report
  console.log('=====================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY');
  console.log('=====================================================');
  console.log(`Target Mode: ${isMongoConnected ? 'Live MongoDB Atlas (greenbridgecluster)' : 'Local File-Backed db.json'}`);
  console.log(`Records Processed:`);
  console.log(` - Users:                ${importedUsers + coreUsers.length + rawNgos.length} (400 synthetic + 80 NGO owners + 2 core)`);
  console.log(` - Organizations:        ${importedNgos} synthetic NGOs`);
  console.log(` - Opportunities:        ${importedOpps} synthetic opportunities`);
  console.log(` - Applications:         ${importedApps} synthetic volunteer applications`);
  console.log(` - Events:               ${importedEvents} synthetic events`);
  console.log(` - Event Registrations:  ${importedRegs} synthetic event registrations`);
  console.log(` - EcoCart Products:     ${importedProducts} synthetic sustainable products`);
  console.log(` - Orders:               ${importedOrders} synthetic orders`);
  console.log(` - Order Items:          ${importedItems} synthetic order items`);
  console.log(` - Monetary Donations:   ${importedDonations} synthetic campaign donations`);
  console.log(` - Physical Donations:   ${physicalDonations.length} physical item donations`);
  console.log(`Total Database Records:  ${importedUsers + coreUsers.length + rawNgos.length + importedNgos + importedOpps + importedApps + importedEvents + importedRegs + importedProducts + importedOrders + importedItems + importedDonations + physicalDonations.length}`);
  console.log('Notice: All synthetic records are tagged with isSynthetic: true and deterministic ObjectIds.');
  console.log('=====================================================');

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
