import { Injectable, OnModuleInit, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private useMock: boolean;
  private dbPath: string;
  private mockDb: any = {
    users: [],
    organizations: [],
    opportunities: [],
    applications: [],
    eventRegistrations: [],
    events: [],
    donations: [],
    ecoProducts: [],
    orders: [],
    orderItems: [],
    monetaryDonations: [],
    certificates: [],
    notifications: [],
    badges: [],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.useMock = this.config.get('USE_MOCK_DATABASE') !== 'false';
    this.dbPath = path.join(process.cwd(), 'db.json');
  }

  async onModuleInit() {
    if (this.useMock) {
      console.log('Running NestJS server on File-backed Mock Database: db.json');
      await this.loadOrCreateMockDb();
    } else {
      console.log('Running NestJS server on Live MongoDB Atlas.');
    }
  }

  // Load or initialize local JSON mock database
  private async loadOrCreateMockDb() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf8');
        this.mockDb = JSON.parse(fileContent);
      } else {
        // Seed default database values
        const passwordHash = await bcrypt.hash('password', 10);
        const sonaaHash = await bcrypt.hash('sonaa123', 10);
        const adminHash = await bcrypt.hash('admin123', 10);

        this.mockDb = {
          users: [
            {
              id: 'usr-admin',
              name: 'Admin Moderator',
              email: 'admin@greenbridge.org',
              password: adminHash,
              city: 'Dehradun',
              state: 'Uttarakhand',
              avatar: { hair: 'style-2', eyes: 'neutral', skin: '#FAD7A0', clothing: '#1B4332', accessory: 'tshirt-badge' },
              level: 10,
              xp: 9999,
              badges: ['1', '2', '3', '4', '5', '6'],
              interests: ['Environment', 'Education'],
              availability: 'Flexible',
              role: 'ADMIN',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'usr-sonaa',
              name: 'Sonaa Dobriyal',
              email: 'sonaa@gmail.com',
              password: sonaaHash,
              city: 'Dehradun',
              state: 'Uttarakhand',
              avatar: { hair: 'style-1', eyes: 'happy', skin: '#F5CBA7', clothing: '#2E7D32', accessory: 'plant-leaf' },
              level: 2,
              xp: 320,
              badges: ['1', '3'],
              interests: ['Environment', 'Education'],
              availability: 'Weekends',
              role: 'USER',
              createdAt: new Date().toISOString(),
            }
          ],
          organizations: [
            {
              id: 'org-hope',
              ownerId: 'usr-admin',
              organizationName: 'Hope Foundation',
              description: 'Providing quality education and resources to underprivileged children in Dehradun.',
              mission: 'To eliminate literacy gaps in remote communities.',
              category: 'Education',
              website: 'https://hopefoundation.org',
              phone: '+91 9876543210',
              logo: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=150&auto=format&fit=crop&q=60',
              verificationStatus: 'APPROVED',
              registrationCertificate: 'hope_cert.pdf',
              createdAt: new Date().toISOString()
            },
            {
              id: 'org-eco',
              ownerId: 'usr-sonaa',
              organizationName: 'Eco Warriors Dehradun',
              description: 'A community club focused on afforestation, clean rivers, and zero waste management in Uttarakhand.',
              mission: 'Re-greening the valley one tree at a time.',
              category: 'Environment',
              website: 'https://ecowarriorsddn.org',
              phone: '+91 9876501234',
              logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60',
              verificationStatus: 'PENDING',
              registrationCertificate: 'eco_warriors_cert.pdf',
              createdAt: new Date().toISOString()
            }
          ],
          opportunities: [
            {
              id: 'opp-1',
              organizationId: 'org-eco',
              title: 'Mussorie Road Tree Plantation Drive',
              description: 'Join us this Saturday for planting 100 native saplings along the Mussorie Road to prevent soil erosion and expand green cover. Equipment, gloves, and refreshments will be provided. Wear comfortable outdoor clothes.',
              category: 'Environment',
              location: 'Mussoorie Diversion, Dehradun',
              date: '2026-07-12',
              time: '08:00 AM',
              duration: '4 Hours',
              skillsRequired: ['Physical Stamina', 'Teamwork'],
              volunteerLimit: 30,
              coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60',
              status: 'OPEN',
              createdAt: new Date().toISOString()
            },
            {
              id: 'opp-2',
              organizationId: 'org-hope',
              title: 'Weekend Math Tutor for Kids',
              description: 'We are seeking passionate individuals to help children (grades 5-8) clear their math concepts. Classes are conducted at our community library in Karanpur on Saturday afternoons.',
              category: 'Education',
              location: 'Karanpur Community Center, Dehradun',
              date: '2026-07-18',
              time: '02:00 PM',
              duration: '3 Hours',
              skillsRequired: ['Mathematics Teaching', 'Patience', 'Communication'],
              volunteerLimit: 8,
              coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=60',
              status: 'OPEN',
              createdAt: new Date().toISOString()
            }
          ],
          applications: [],
          eventRegistrations: [],
          events: [
            {
              id: 'evt-1',
              organizationId: 'org-eco',
              title: 'Robbers Cave Clean-up Camp',
              description: 'A clean-up drive inside Guchhupani (Robbers Cave) to clear plastic waste left by tourists. Let’s clean the water streams together!',
              banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60',
              date: '2026-07-15',
              time: '07:30 AM',
              location: 'Robbers Cave Entrance, Dehradun',
              capacity: 50,
              registeredUsers: ['usr-sonaa'],
              category: 'Environment',
              createdAt: new Date().toISOString()
            }
          ],
          donations: [
            {
              id: 'don-1',
              ownerId: 'usr-sonaa',
              title: 'Grade 10 ICSE Science Books',
              description: 'Set of physics, chemistry, and biology textbooks in excellent condition. Perfect for self-studying students.',
              images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=60'],
              category: 'Books',
              condition: 'Like New',
              location: 'Dalanwala, Dehradun',
              status: 'AVAILABLE',
              createdAt: new Date().toISOString()
            }
          ],
          certificates: [],
          notifications: [],
          badges: [],
        };
        this.saveMockDb();
      }
    } catch (err) {
      console.error('Failed to initialize mock database file.', err);
    }
  }

  private saveMockDb() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.mockDb, null, 2), 'utf8');
  }

  // --- USERS ---
  async findUserByEmail(email: string) {
    if (this.useMock) {
      return this.mockDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    if (this.useMock) {
      return this.mockDb.users.find((u) => u.id === id || u.syntheticId === id) || null;
    }
    return (
      (await this.prisma.user.findUnique({ where: { id } }).catch(() => null)) ||
      (await this.prisma.user.findFirst({ where: { syntheticId: id } }).catch(() => null))
    );
  }

  async createUser(data: any) {
    if (this.useMock) {
      const newUser = {
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        level: 1,
        xp: 0,
        badges: [],
        interests: data.interests || [],
        availability: data.availability || 'Flexible',
        role: 'USER',
        createdAt: new Date().toISOString(),
        ...data,
      };
      this.mockDb.users.push(newUser);
      this.saveMockDb();
      return newUser;
    }
    return this.prisma.user.create({ data });
  }

  async updateUser(id: string, updates: any) {
    if (this.useMock) {
      const userIdx = this.mockDb.users.findIndex((u) => u.id === id || u.syntheticId === id);
      if (userIdx !== -1) {
        this.mockDb.users[userIdx] = { ...this.mockDb.users[userIdx], ...updates };
        this.saveMockDb();
        return this.mockDb.users[userIdx];
      }
      return null;
    }
    const existing = await this.findUserById(id);
    if (!existing) return null;
    return this.prisma.user.update({ where: { id: existing.id }, data: updates });
  }

  async findAllUsers() {
    if (this.useMock) {
      return this.mockDb.users;
    }
    return this.prisma.user.findMany();
  }

  // --- ORGANIZATIONS ---
  async findOrgById(id: string) {
    if (this.useMock) {
      return this.mockDb.organizations.find((o) => o.id === id || (o as any).syntheticId === id) || null;
    }
    return (
      (await this.prisma.organization.findUnique({ where: { id } }).catch(() => null)) ||
      (await this.prisma.organization.findFirst({ where: { syntheticId: id } }).catch(() => null))
    );
  }

  async findOrgByOwnerId(ownerId: string) {
    if (this.useMock) {
      const user = this.mockDb.users.find((u) => u.id === ownerId || u.syntheticId === ownerId);
      const targetOwnerId = user ? user.id : ownerId;
      return this.mockDb.organizations.find((o) => o.ownerId === targetOwnerId || o.ownerId === ownerId) || null;
    }
    return this.prisma.organization.findFirst({
      where: {
        OR: [
          { ownerId },
          { owner: { syntheticId: ownerId } }
        ]
      }
    });
  }

  async findAllOrgs() {
    if (this.useMock) {
      return this.mockDb.organizations;
    }
    return this.prisma.organization.findMany();
  }

  async createOrg(ownerId: string, data: any) {
    if (this.useMock) {
      const newOrg = {
        id: `org-${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        verificationStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        ...data,
      };
      this.mockDb.organizations.push(newOrg);
      this.saveMockDb();
      return newOrg;
    }
    return this.prisma.organization.create({
      data: {
        ...data,
        owner: { connect: { id: ownerId } },
      },
    });
  }

  async updateOrgStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    if (this.useMock) {
      const orgIdx = this.mockDb.organizations.findIndex((o) => o.id === id);
      if (orgIdx !== -1) {
        const org = this.mockDb.organizations[orgIdx];
        org.verificationStatus = status;
        
        if (status === 'APPROVED') {
          // Update owner user role to ORGANIZATION
          const userIdx = this.mockDb.users.findIndex((u) => u.id === org.ownerId);
          if (userIdx !== -1) {
            this.mockDb.users[userIdx].role = 'ORGANIZATION';
          }
        }
        this.saveMockDb();
        return org;
      }
      return null;
    }
    
    const org = await this.prisma.organization.update({
      where: { id },
      data: { verificationStatus: status },
    });

    if (status === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: org.ownerId },
        data: { role: 'ORGANIZATION' },
      });
    }
    return org;
  }

  // --- OPPORTUNITIES ---
  async findAllOpps() {
    if (this.useMock) {
      // Map organizationName to matching object
      return this.mockDb.opportunities.map((opp) => {
        const org = this.mockDb.organizations.find((o) => o.id === opp.organizationId);
        return {
          ...opp,
          organizationName: org ? org.organizationName : 'Hope Foundation',
          organizationLogo: org ? org.logo : '',
          applicantsCount: this.mockDb.applications.filter((a) => a.opportunityId === opp.id).length,
        };
      });
    }
    return this.prisma.opportunity.findMany({
      include: { organization: true, _count: { select: { applications: true } } },
    });
  }

  async findOppById(id: string) {
    if (this.useMock) {
      const opp = this.mockDb.opportunities.find((o) => o.id === id);
      if (opp) {
        const org = this.mockDb.organizations.find((o) => o.id === opp.organizationId);
        return {
          ...opp,
          organizationName: org ? org.organizationName : 'Hope Foundation',
          organizationLogo: org ? org.logo : '',
        };
      }
      return null;
    }
    return this.prisma.opportunity.findUnique({ where: { id }, include: { organization: true } });
  }

  async createOpp(orgId: string, data: any) {
    if (this.useMock) {
      const newOpp = {
        id: `opp-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: orgId,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        ...data,
      };
      this.mockDb.opportunities.push(newOpp);
      this.saveMockDb();
      return newOpp;
    }
    return this.prisma.opportunity.create({
      data: {
        ...data,
        organization: { connect: { id: orgId } },
      },
    });
  }

  async updateOpp(id: string, orgId: string, data: any) {
    if (this.useMock) {
      const oppIdx = this.mockDb.opportunities.findIndex((o) => o.id === id);
      if (oppIdx === -1) throw new NotFoundException('Opportunity not found.');
      const opp = this.mockDb.opportunities[oppIdx];
      if (opp.organizationId !== orgId) throw new ForbiddenException('You do not own this opportunity.');
      this.mockDb.opportunities[oppIdx] = { ...opp, ...data };
      this.saveMockDb();
      return this.mockDb.opportunities[oppIdx];
    }
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found.');
    if (opp.organizationId !== orgId) throw new ForbiddenException('You do not own this opportunity.');
    return this.prisma.opportunity.update({ where: { id }, data });
  }

  async deleteOpp(id: string, orgId: string) {
    if (this.useMock) {
      const oppIdx = this.mockDb.opportunities.findIndex((o) => o.id === id);
      if (oppIdx === -1) throw new NotFoundException('Opportunity not found.');
      const opp = this.mockDb.opportunities[oppIdx];
      if (opp.organizationId !== orgId) throw new ForbiddenException('You do not own this opportunity.');
      this.mockDb.opportunities = this.mockDb.opportunities.filter((o) => o.id !== id);
      this.mockDb.applications = this.mockDb.applications.filter((a) => a.opportunityId !== id);
      this.saveMockDb();
      return true;
    }
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundException('Opportunity not found.');
    if (opp.organizationId !== orgId) throw new ForbiddenException('You do not own this opportunity.');
    await this.prisma.application.deleteMany({ where: { opportunityId: id } });
    await this.prisma.opportunity.delete({ where: { id } });
    return true;
  }

  // --- APPLICATIONS ---
  async findAppsForUser(userId: string) {
    if (this.useMock) {
      return this.mockDb.applications.filter((a) => a.userId === userId);
    }
    return this.prisma.application.findMany({ where: { userId }, include: { opportunity: true } });
  }

  async findAppsForOrg(orgId: string) {
    if (this.useMock) {
      const orgOpps = this.mockDb.opportunities.filter((o) => o.organizationId === orgId).map((o) => o.id);
      return this.mockDb.applications.filter((a) => orgOpps.includes(a.opportunityId));
    }
    return this.prisma.application.findMany({
      where: { opportunity: { organizationId: orgId } },
      include: { user: true, opportunity: true },
    });
  }

  async createApp(userId: string, oppId: string, notes: string, formData?: string) {
    if (this.useMock) {
      const exists = this.mockDb.applications.some((a) => a.opportunityId === oppId && a.userId === userId);
      if (exists) throw new BadRequestException('You have already applied for this opportunity.');

      const newApp = {
        id: `app-${Math.random().toString(36).substr(2, 9)}`,
        opportunityId: oppId,
        userId,
        status: 'PENDING',
        notes,
        formData,
        createdAt: new Date().toISOString(),
      };
      this.mockDb.applications.push(newApp);
      this.saveMockDb();
      return newApp;
    }
    const exists = await this.prisma.application.findFirst({
      where: { opportunityId: oppId, userId },
    });
    if (exists) throw new BadRequestException('You have already applied for this opportunity.');

    return this.prisma.application.create({
      data: {
        notes,
        formData,
        user: { connect: { id: userId } },
        opportunity: { connect: { id: oppId } },
      },
    });
  }

  async updateAppStatus(id: string, status: 'ACCEPTED' | 'REJECTED') {
    if (this.useMock) {
      const appIdx = this.mockDb.applications.findIndex((a) => a.id === id);
      if (appIdx !== -1) {
        const app = this.mockDb.applications[appIdx];
        app.status = status;

        if (status === 'ACCEPTED') {
          // Award XP to the user
          const userIdx = this.mockDb.users.findIndex((u) => u.id === app.userId);
          if (userIdx !== -1) {
            const user = this.mockDb.users[userIdx];
            user.xp += 150; // volunteering completion
            const xpNeeded = user.level * 500;
            if (user.xp >= xpNeeded) {
              user.level += 1;
              user.xp = user.xp - xpNeeded;
            }
          }
          // Issue a certificate mock
          const opp = this.mockDb.opportunities.find((o) => o.id === app.opportunityId);
          const newCert = {
            id: `cert-${Math.random().toString(36).substr(2, 9)}`,
            userId: app.userId,
            organizationId: opp ? opp.organizationId : 'org-hope',
            title: `Certificate of Service - ${opp ? opp.title : 'Volunteer Campaign'}`,
            pdfUrl: '#',
            issueDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          };
          this.mockDb.certificates.push(newCert);
        }
        this.saveMockDb();
        return app;
      }
      return null;
    }
    
    const app = await this.prisma.application.update({
      where: { id },
      data: { status },
      include: { opportunity: true },
    });

    if (status === 'ACCEPTED') {
      // Award XP
      const user = await this.prisma.user.findUnique({ where: { id: app.userId } });
      if (user) {
        let newXp = user.xp + 150;
        let newLvl = user.level;
        if (newXp >= user.level * 500) {
          newLvl += 1;
          newXp -= user.level * 500;
        }
        await this.prisma.user.update({
          where: { id: user.id },
          data: { xp: newXp, level: newLvl },
        });
      }

      // Create Certificate
      await this.prisma.certificate.create({
        data: {
          title: `Certificate of Service - ${app.opportunity.title}`,
          pdfUrl: '#',
          issueDate: new Date().toISOString().split('T')[0],
          user: { connect: { id: app.userId } },
          organization: { connect: { id: app.opportunity.organizationId } },
        },
      });
    }

    return app;
  }

  // --- EVENTS ---
  async findAllEvents() {
    if (this.useMock) {
      return this.mockDb.events.map((evt) => {
        const org = this.mockDb.organizations.find((o) => o.id === evt.organizationId);
        return {
          ...evt,
          organizationName: org ? org.organizationName : 'Eco Warriors Dehradun',
        };
      });
    }
    return this.prisma.event.findMany({ include: { organization: true } });
  }

  async createEvent(orgId: string, data: any) {
    if (this.useMock) {
      const newEvent = {
        id: `evt-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: orgId,
        registeredUsers: [],
        createdAt: new Date().toISOString(),
        ...data,
      };
      this.mockDb.events.push(newEvent);
      this.saveMockDb();
      return newEvent;
    }
    return this.prisma.event.create({
      data: {
        ...data,
        organization: { connect: { id: orgId } },
      },
    });
  }

  async updateEvent(id: string, orgId: string, data: any) {
    if (this.useMock) {
      const evtIdx = this.mockDb.events.findIndex((e) => e.id === id);
      if (evtIdx === -1) throw new NotFoundException('Event not found.');
      const evt = this.mockDb.events[evtIdx];
      if (evt.organizationId !== orgId) throw new ForbiddenException('You do not own this event.');
      this.mockDb.events[evtIdx] = { ...evt, ...data };
      this.saveMockDb();
      return this.mockDb.events[evtIdx];
    }
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found.');
    if (event.organizationId !== orgId) throw new ForbiddenException('You do not own this event.');
    return this.prisma.event.update({ where: { id }, data });
  }

  async deleteEvent(id: string, orgId: string) {
    if (this.useMock) {
      const evtIdx = this.mockDb.events.findIndex((e) => e.id === id);
      if (evtIdx === -1) throw new NotFoundException('Event not found.');
      const evt = this.mockDb.events[evtIdx];
      if (evt.organizationId !== orgId) throw new ForbiddenException('You do not own this event.');
      this.mockDb.events = this.mockDb.events.filter((e) => e.id !== id);
      this.saveMockDb();
      return true;
    }
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found.');
    if (event.organizationId !== orgId) throw new ForbiddenException('You do not own this event.');
    await this.prisma.event.delete({ where: { id } });
    return true;
  }

  async registerUserForEvent(userId: string, eventId: string, formData?: string) {
    if (this.useMock) {
      const evtIdx = this.mockDb.events.findIndex((e) => e.id === eventId);
      if (evtIdx === -1) throw new NotFoundException('Event not found.');
      const evt = this.mockDb.events[evtIdx];
      if (evt.registeredUsers.includes(userId)) {
        throw new BadRequestException('You are already registered for this event.');
      }
      
      evt.registeredUsers.push(userId);
      this.mockDb.eventRegistrations = this.mockDb.eventRegistrations || [];
      this.mockDb.eventRegistrations.push({
        id: `evtr-${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        userId,
        formData,
        createdAt: new Date().toISOString()
      });
      
      // Award +100 XP to user
      const userIdx = this.mockDb.users.findIndex((u) => u.id === userId);
      if (userIdx !== -1) {
        const user = this.mockDb.users[userIdx];
        user.xp += 100;
        const xpNeeded = user.level * 500;
        if (user.xp >= xpNeeded) {
          user.level += 1;
          user.xp -= xpNeeded;
        }
      }
      this.saveMockDb();
      return evt;
    }
    
    // Live update
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found.');

    if (event.registeredUsers.includes(userId)) {
      throw new BadRequestException('You are already registered for this event.');
    }

    const updatedRegs = [...event.registeredUsers, userId];
    await this.prisma.event.update({
      where: { id: eventId },
      data: { registeredUsers: updatedRegs },
    });

    await this.prisma.eventRegistration.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
        formData
      }
    });

    // Award XP
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      let newXp = user.xp + 100;
      let newLvl = user.level;
      if (newXp >= user.level * 500) {
        newLvl += 1;
        newXp -= user.level * 500;
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLvl },
      });
    }
    return event;
  }

  async unregisterUserFromEvent(userId: string, eventId: string) {
    if (this.useMock) {
      const evtIdx = this.mockDb.events.findIndex((e) => e.id === eventId);
      if (evtIdx === -1) throw new NotFoundException('Event not found.');
      const evt = this.mockDb.events[evtIdx];
      if (!evt.registeredUsers.includes(userId)) {
        throw new BadRequestException('You are not registered for this event.');
      }
      evt.registeredUsers = evt.registeredUsers.filter((uid) => uid !== userId);
      this.saveMockDb();
      return evt;
    }
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found.');
    if (!event.registeredUsers.includes(userId)) {
      throw new BadRequestException('You are not registered for this event.');
    }
    const updatedRegs = event.registeredUsers.filter((uid) => uid !== userId);
    return this.prisma.event.update({
      where: { id: eventId },
      data: { registeredUsers: updatedRegs },
    });
  }

  // --- DONATIONS ---
  async findAllDonations() {
    if (this.useMock) {
      return this.mockDb.donations.map((don) => {
        const owner = this.mockDb.users.find((u) => u.id === don.ownerId);
        return {
          ...don,
          ownerName: owner ? owner.name : 'Citizen',
        };
      });
    }
    return this.prisma.donation.findMany({ include: { owner: true } });
  }

  async findDonationById(id: string) {
    if (this.useMock) {
      const don = this.mockDb.donations.find((d) => d.id === id);
      if (don) {
        const owner = this.mockDb.users.find((u) => u.id === don.ownerId);
        return {
          ...don,
          ownerName: owner ? owner.name : 'Citizen',
        };
      }
      return null;
    }
    return this.prisma.donation.findUnique({ where: { id }, include: { owner: true } });
  }

  async createDonation(userId: string, data: any) {
    if (this.useMock) {
      const newDon = {
        id: `don-${Math.random().toString(36).substr(2, 9)}`,
        ownerId: userId,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        ...data,
      };
      this.mockDb.donations.push(newDon);
      
      // Award +75 XP for donating
      const userIdx = this.mockDb.users.findIndex((u) => u.id === userId);
      if (userIdx !== -1) {
        const user = this.mockDb.users[userIdx];
        user.xp += 75;
        const xpNeeded = user.level * 500;
        if (user.xp >= xpNeeded) {
          user.level += 1;
          user.xp -= xpNeeded;
        }
      }
      
      this.saveMockDb();
      return newDon;
    }
    
    const don = await this.prisma.donation.create({
      data: {
        ...data,
        owner: { connect: { id: userId } },
      },
    });

    // Award XP
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      let newXp = user.xp + 75;
      let newLvl = user.level;
      if (newXp >= user.level * 500) {
        newLvl += 1;
        newXp -= user.level * 500;
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLvl },
      });
    }
    return don;
  }

  async requestDonation(userId: string, donationId: string) {
    if (this.useMock) {
      const donIdx = this.mockDb.donations.findIndex((d) => d.id === donationId);
      if (donIdx !== -1) {
        const don = this.mockDb.donations[donIdx];
        don.status = 'REQUESTED';
        don.requesterId = userId;
        this.saveMockDb();
        return don;
      }
      return null;
    }
    return this.prisma.donation.update({
      where: { id: donationId },
      data: { status: 'REQUESTED', requesterId: userId },
    });
  }

  async deleteDonation(id: string) {
    if (this.useMock) {
      this.mockDb.donations = this.mockDb.donations.filter((d) => d.id !== id);
      this.saveMockDb();
      return true;
    }
    await this.prisma.donation.delete({ where: { id } });
    return true;
  }

  // --- CERTIFICATES ---
  async findCertsForUser(userId: string) {
    if (this.useMock) {
      return this.mockDb.certificates.filter((c) => c.userId === userId).map((cert) => {
        const org = this.mockDb.organizations.find((o) => o.id === cert.organizationId);
        return {
          ...cert,
          organizationName: org ? org.organizationName : 'Hope Foundation',
        };
      });
    }
    return this.prisma.certificate.findMany({ where: { userId }, include: { organization: true } });
  }

  // --- NOTIFICATIONS ---
  async findNotificationsForUser(userId: string) {
    if (this.useMock) {
      return this.mockDb.notifications.filter((n) => n.userId === userId);
    }
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createNotification(userId: string, title: string, message: string, type = 'info') {
    if (this.useMock) {
      const newNotif = {
        id: `not-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      };
      this.mockDb.notifications.unshift(newNotif);
      this.saveMockDb();
      return newNotif;
    }
    return this.prisma.notification.create({
      data: {
        title,
        message,
        type,
        user: { connect: { id: userId } },
      },
    });
  }

  async markAllNotificationsRead(userId: string) {
    if (this.useMock) {
      this.mockDb.notifications = this.mockDb.notifications.map((n) => 
        n.userId === userId ? { ...n, read: true } : n
      );
      this.saveMockDb();
      return true;
    }
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return true;
  }

  // --- ECOCART SUSTAINABLE PRODUCTS ---
  async findAllProducts(category?: string, search?: string) {
    if (this.useMock) {
      let prods = this.mockDb.ecoProducts || this.mockDb.products || [];
      if (category && category !== 'All') {
        prods = prods.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        prods = prods.filter((p: any) => 
          p.title?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.sellerName?.toLowerCase().includes(q)
        );
      }
      return prods;
    }
    const where: any = {};
    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sellerName: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.ecoProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findProductById(id: string) {
    if (this.useMock) {
      const prods = this.mockDb.ecoProducts || this.mockDb.products || [];
      return prods.find((p: any) => p.id === id || p.syntheticId === id) || null;
    }
    return this.prisma.ecoProduct.findUnique({ where: { id } });
  }

  async createProduct(data: any) {
    if (this.useMock) {
      const newProd = {
        id: `prod-${Date.now()}`,
        title: data.title,
        description: data.description || '',
        price: Number(data.price),
        category: data.category || 'General',
        sellerName: data.sellerName || data.vendorName || data.businessName || 'GreenBridge Partner',
        sellerLocality: data.sellerLocality || 'Dehradun',
        city: data.city || 'Dehradun',
        stockQuantity: data.stockQuantity || 10,
        inStock: data.inStock !== false,
        material: data.material || 'Eco Material',
        ecoClaim: data.ecoClaim || 'Sustainable',
        images: data.images || ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60'],
        whatsapp: data.whatsapp || '919876500000',
        isSynthetic: false,
        createdAt: new Date().toISOString(),
      };
      if (!this.mockDb.ecoProducts) this.mockDb.ecoProducts = [];
      this.mockDb.ecoProducts.unshift(newProd);
      this.saveMockDb();
      return newProd;
    }
    return this.prisma.ecoProduct.create({
      data: {
        title: data.title,
        description: data.description || '',
        price: Number(data.price),
        category: data.category || 'General',
        sellerName: data.sellerName || data.vendorName || data.businessName || 'GreenBridge Partner',
        sellerLocality: data.sellerLocality || 'Dehradun',
        city: data.city || 'Dehradun',
        stockQuantity: data.stockQuantity || 10,
        inStock: data.inStock !== false,
        material: data.material,
        ecoClaim: data.ecoClaim,
        images: data.images || [],
        whatsapp: data.whatsapp,
      },
    });
  }

  async updateProduct(id: string, updates: any) {
    if (this.useMock) {
      const prods = this.mockDb.ecoProducts || this.mockDb.products || [];
      const idx = prods.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], ...updates };
        this.saveMockDb();
        return prods[idx];
      }
      return null;
    }
    return this.prisma.ecoProduct.update({
      where: { id },
      data: updates,
    });
  }

  async deleteProduct(id: string) {
    if (this.useMock) {
      if (this.mockDb.ecoProducts) {
        this.mockDb.ecoProducts = this.mockDb.ecoProducts.filter((p: any) => p.id !== id);
      }
      if (this.mockDb.products) {
        this.mockDb.products = this.mockDb.products.filter((p: any) => p.id !== id);
      }
      this.saveMockDb();
      return true;
    }
    await this.prisma.ecoProduct.delete({ where: { id } });
    return true;
  }

  // --- ECOCART ORDERS ---
  async createOrder(userId: string, data: any) {
    const subtotal = (data.items || []).reduce((acc: number, it: any) => acc + (it.price || it.unitPrice || 0) * (it.quantity || 1), 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    if (this.useMock) {
      const orderId = `ord-${Date.now()}`;
      const newOrder = {
        id: orderId,
        userId,
        orderStatus: 'Confirmed',
        subtotal,
        deliveryFee,
        total,
        paymentStatus: 'Paid',
        paymentMode: data.paymentMode || 'UPI',
        deliveryCity: data.deliveryCity || 'Dehradun',
        deliveryLocality: data.deliveryLocality || 'Patel Nagar',
        isSynthetic: false,
        createdAt: new Date().toISOString(),
        items: (data.items || []).map((it: any) => ({
          id: `item-${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          productId: it.productId || it.id,
          quantity: it.quantity || 1,
          unitPrice: it.price || it.unitPrice || 0,
          lineTotal: (it.price || it.unitPrice || 0) * (it.quantity || 1),
          product: it.product || it,
        })),
      };
      if (!this.mockDb.orders) this.mockDb.orders = [];
      this.mockDb.orders.unshift(newOrder);
      this.saveMockDb();
      return newOrder;
    }

    return this.prisma.order.create({
      data: {
        userId,
        orderStatus: 'Confirmed',
        subtotal,
        deliveryFee,
        total,
        paymentStatus: 'Paid',
        paymentMode: data.paymentMode || 'UPI',
        deliveryCity: data.deliveryCity || 'Dehradun',
        deliveryLocality: data.deliveryLocality || 'Patel Nagar',
        items: {
          create: (data.items || []).map((it: any) => ({
            productId: it.productId || it.id,
            quantity: it.quantity || 1,
            unitPrice: it.price || it.unitPrice || 0,
            lineTotal: (it.price || it.unitPrice || 0) * (it.quantity || 1),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOrdersByUser(userId: string) {
    if (this.useMock) {
      return (this.mockDb.orders || []).filter((o: any) => o.userId === userId);
    }
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllOrders() {
    if (this.useMock) {
      return this.mockDb.orders || [];
    }
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- RECOMMENDATION ENGINE (Data Science Formulation: 0.35S + 0.30I + 0.20A + 0.15L) ---
  async getRecommendations(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) return [];

    const allOpps = await this.findAllOpps();
    const userApps = await this.findAppsForUser(userId);
    const appliedOppIds = new Set(userApps.map((a: any) => a.opportunityId));

    // 1. Eligibility Filtering: status must be OPEN, not already applied
    const eligibleOpps = allOpps.filter((opp: any) => {
      if (opp.status !== 'OPEN') return false;
      if (appliedOppIds.has(opp.id)) return false;
      return true;
    });

    const userSkills: string[] = (user.skills || user.interests || []).map((s: string) => s.toLowerCase());
    const userInterests: string[] = (user.interests || []).map((i: string) => i.toLowerCase());
    const userAvailability: string = user.availability || 'Flexible';
    const userCity: string = (user.city || '').toLowerCase().trim();
    const userState: string = (user.state || '').toLowerCase().trim();

    const scored = eligibleOpps.map((opp: any) => {
      const oppCategory = (opp.category || '').toLowerCase();
      const oppLocation = (opp.location || '').toLowerCase();
      const oppSkills: string[] = (opp.skillsRequired || []).map((s: string) => s.toLowerCase());

      // Component 1: Skills Match (0.35 weight) - Jaccard / Overlap Ratio
      let skillsScore = 1.0;
      const matchedSkills: string[] = [];
      if (oppSkills.length > 0) {
        oppSkills.forEach((os) => {
          if (userSkills.some((us) => us.includes(os) || os.includes(us))) {
            matchedSkills.push(os);
          }
        });
        skillsScore = Math.min(1.0, matchedSkills.length / Math.max(1, oppSkills.length));
      } else {
        skillsScore = 0.85; // Welcoming to all skills
      }

      // Component 2: Interests / Domain Match (0.30 weight)
      let interestsScore = 0.15;
      const categoryMatched = userInterests.some((ui) => 
        oppCategory.includes(ui) || ui.includes(oppCategory)
      );
      if (categoryMatched) {
        interestsScore = 1.0;
      } else if (
        userInterests.some((ui) => 
          (opp.title || '').toLowerCase().includes(ui) || 
          (opp.description || '').toLowerCase().includes(ui)
        )
      ) {
        interestsScore = 0.65;
      }

      // Component 3: Availability Match (0.20 weight)
      let availabilityScore = 0.5;
      if (userAvailability === 'Flexible') {
        availabilityScore = 1.0;
      } else if (userAvailability === 'Weekends') {
        const isWeekendEvent = 
          opp.date && (new Date(opp.date).getDay() === 0 || new Date(opp.date).getDay() === 6);
        const textMentionsWeekend = 
          (opp.time || '').toLowerCase().includes('weekend') || 
          (opp.duration || '').toLowerCase().includes('saturday') || 
          (opp.duration || '').toLowerCase().includes('sunday');
        availabilityScore = (isWeekendEvent || textMentionsWeekend) ? 1.0 : 0.4;
      } else if (userAvailability === 'Weekdays') {
        const isWeekdayEvent = 
          opp.date && new Date(opp.date).getDay() >= 1 && new Date(opp.date).getDay() <= 5;
        availabilityScore = isWeekdayEvent ? 1.0 : 0.4;
      }

      // Component 4: Location Match (0.15 weight)
      let locationScore = 0.25;
      if (oppLocation.includes('remote') || oppLocation.includes('online')) {
        locationScore = 1.0;
      } else if (userCity && oppLocation.includes(userCity)) {
        locationScore = 1.0;
      } else if (userState && oppLocation.includes(userState)) {
        locationScore = 0.7;
      }

      // Composite Deterministic Score: 0.35S + 0.30I + 0.20A + 0.15L
      const compositeRaw = (0.35 * skillsScore) + (0.30 * interestsScore) + (0.20 * availabilityScore) + (0.15 * locationScore);
      const matchScore = Math.min(100, Math.max(10, Math.round(compositeRaw * 100)));

      // Explainability: generate human-readable contextual rationales
      const reasons: string[] = [];
      if (interestsScore >= 0.65) {
        reasons.push(`Matches your interest in ${opp.category || 'community initiatives'}`);
      }
      if (matchedSkills.length > 0) {
        reasons.push(`Direct skills alignment with: ${matchedSkills.slice(0, 2).join(', ')}`);
      } else if (oppSkills.length === 0) {
        reasons.push('Open to all volunteers regardless of specialized experience');
      }
      if (availabilityScore >= 0.8) {
        reasons.push(`Fits your ${userAvailability.toLowerCase()} availability`);
      }
      if (locationScore >= 0.8) {
        reasons.push(oppLocation.includes('remote') ? 'Fully remote / online participation' : `Conveniently in ${user.city || 'your area'}`);
      }
      if (reasons.length === 0) {
        reasons.push('High-impact verified community drive near you');
      }

      return {
        opportunity: opp,
        matchScore,
        scoreBreakdown: {
          skillsScore: Math.round(skillsScore * 100),
          interestsScore: Math.round(interestsScore * 100),
          availabilityScore: Math.round(availabilityScore * 100),
          locationScore: Math.round(locationScore * 100),
        },
        reasons,
      };
    });

    // Rank in descending order of matchScore
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  }

  // --- VOLUNTEER IMPACT ANALYTICS ---
  async getVolunteerAnalytics(userId: string) {
    const user = await this.findUserById(userId);
    const userApps = await this.findAppsForUser(userId);
    const allOpps = await this.findAllOpps();
    const oppMap = new Map(allOpps.map((o: any) => [o.id, o]));

    const totalApplications = userApps.length;
    const acceptedApps = userApps.filter((a: any) => a.status === 'ACCEPTED');
    const pendingApplications = userApps.filter((a: any) => a.status === 'PENDING').length;
    const rejectedApplications = userApps.filter((a: any) => a.status === 'REJECTED').length;

    // Estimate volunteer hours: 4 hours per accepted opportunity
    const totalVolunteerHours = Math.max(acceptedApps.length * 4, user?.xp ? Math.round(user.xp / 40) : 0);

    // Category distribution
    const categoryCounts: { [cat: string]: { count: number; hours: number } } = {};
    userApps.forEach((app: any) => {
      const opp = oppMap.get(app.opportunityId) as any;
      const cat = opp?.category || 'Community';
      if (!categoryCounts[cat]) categoryCounts[cat] = { count: 0, hours: 0 };
      categoryCounts[cat].count += 1;
      if (app.status === 'ACCEPTED') categoryCounts[cat].hours += 4;
    });

    const categoryDistribution = Object.keys(categoryCounts).map((category) => ({
      category,
      count: categoryCounts[category].count,
      hours: categoryCounts[category].hours,
    }));

    if (categoryDistribution.length === 0) {
      categoryDistribution.push(
        { category: 'Environment', count: 2, hours: 8 },
        { category: 'Education', count: 1, hours: 4 },
      );
    }

    // Past 6 months activity timeline
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const monthlyActivity = months.map((m, idx) => {
      const baseHours = idx === 5 ? (totalVolunteerHours > 0 ? totalVolunteerHours : 6) : Math.max(2, (idx + 1) * 2);
      return {
        month: m,
        hours: baseHours,
        drives: Math.max(1, Math.round(baseHours / 3)),
      };
    });

    const level = user?.level || 1;
    const xp = user?.xp || 0;
    const nextLevelXp = level * 500;

    return {
      totalApplications: Math.max(totalApplications, 2),
      acceptedApplications: Math.max(acceptedApps.length, 1),
      pendingApplications,
      rejectedApplications,
      totalVolunteerHours: Math.max(totalVolunteerHours, 8),
      upcomingActivitiesCount: Math.max(acceptedApps.length, 1),
      categoryDistribution,
      monthlyActivity,
      xpProgression: { currentXp: xp, level, nextLevelXp },
    };
  }

  // --- ORGANIZATION ANALYTICS ---
  async getOrgAnalytics(ownerId: string) {
    const org = await this.findOrgByOwnerId(ownerId);
    if (!org) {
      return {
        activeOpportunities: 0,
        totalEvents: 0,
        totalApplicationsReceived: 0,
        acceptedVolunteersCount: 0,
        pendingApplicationsCount: 0,
        acceptanceRate: 0,
        opportunityApplicantBreakdown: [],
        monthlyApplicantTrends: [],
      };
    }

    const orgOpps = this.useMock 
      ? this.mockDb.opportunities.filter((o: any) => o.organizationId === org.id)
      : await this.prisma.opportunity.findMany({ where: { organizationId: org.id } });

    const orgEvents = this.useMock
      ? this.mockDb.events.filter((e: any) => e.organizationId === org.id)
      : await this.prisma.event.findMany({ where: { organizationId: org.id } });

    const apps = await this.findAppsForOrg(org.id);
    const totalApps = apps.length;
    const acceptedCount = apps.filter((a: any) => a.status === 'ACCEPTED').length;
    const pendingCount = apps.filter((a: any) => a.status === 'PENDING').length;
    const acceptanceRate = totalApps > 0 ? Math.round((acceptedCount / totalApps) * 100) : 75;

    const oppBreakdown = orgOpps.map((opp: any) => {
      const oppApps = apps.filter((a: any) => a.opportunityId === opp.id);
      return {
        title: opp.title,
        applicants: Math.max(oppApps.length, opp.applicantsCount || 0),
        accepted: oppApps.filter((a: any) => a.status === 'ACCEPTED').length,
      };
    });

    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const monthlyApplicantTrends = months.map((m, idx) => ({
      month: m,
      applicants: Math.max(2, (idx + 1) * 3 + (totalApps % 4)),
    }));

    return {
      activeOpportunities: orgOpps.length || 2,
      totalEvents: orgEvents.length || 1,
      totalApplicationsReceived: Math.max(totalApps, 14),
      acceptedVolunteersCount: Math.max(acceptedCount, 10),
      pendingApplicationsCount: Math.max(pendingCount, 4),
      acceptanceRate,
      opportunityApplicantBreakdown: oppBreakdown.length > 0 ? oppBreakdown : [
        { title: 'Tree Plantation Drive', applicants: 14, accepted: 10 },
        { title: 'Weekend Math Tutor', applicants: 3, accepted: 2 },
      ],
      monthlyApplicantTrends,
    };
  }

  // --- ADMIN PLATFORM ANALYTICS ---
  async getAdminAnalytics() {
    const users = await this.findAllUsers();
    const orgs = await this.findAllOrgs();
    const opps = await this.findAllOpps();
    const donations = await this.findAllDonations();

    const usersByRole = [
      { role: 'Volunteer / Citizen', count: users.filter((u: any) => u.role === 'USER' || u.role === 'VOLUNTEER').length },
      { role: 'Organization', count: users.filter((u: any) => u.role === 'ORGANIZATION').length },
      { role: 'Administrator', count: users.filter((u: any) => u.role === 'ADMIN').length },
    ];

    const orgsByStatus = [
      { status: 'Approved', count: orgs.filter((o: any) => o.verificationStatus === 'APPROVED').length },
      { status: 'Pending Review', count: orgs.filter((o: any) => o.verificationStatus === 'PENDING').length },
      { status: 'Rejected', count: orgs.filter((o: any) => o.verificationStatus === 'REJECTED').length },
    ];

    const totalApps = this.useMock 
      ? (this.mockDb.applications || []).length 
      : await this.prisma.application.count();

    const totalEvents = this.useMock
      ? (this.mockDb.events || []).length
      : await this.prisma.event.count();

    const totalEventRegs = this.useMock
      ? (this.mockDb.eventRegistrations || []).length
      : await this.prisma.eventRegistration.count();

    const totalEcoProducts = this.useMock
      ? (this.mockDb.ecoProducts || []).length
      : await this.prisma.ecoProduct.count();

    const totalOrders = this.useMock
      ? (this.mockDb.orders || []).length
      : await this.prisma.order.count();

    const syntheticCount = this.useMock
      ? (this.mockDb.users?.filter((u: any) => u.isSynthetic).length || 0) +
        (this.mockDb.organizations?.filter((o: any) => o.isSynthetic).length || 0) +
        (this.mockDb.opportunities?.filter((o: any) => o.isSynthetic).length || 0) +
        (this.mockDb.applications?.filter((a: any) => a.isSynthetic).length || 0) +
        (this.mockDb.events?.filter((e: any) => e.isSynthetic).length || 0) +
        (this.mockDb.ecoProducts?.filter((p: any) => p.isSynthetic).length || 0) +
        (this.mockDb.orders?.filter((o: any) => o.isSynthetic).length || 0)
      : await this.prisma.user.count({ where: { isSynthetic: true } });

    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const monthlyPlatformGrowth = months.map((m, idx) => ({
      month: m,
      users: (idx + 1) * 12 + 15,
      opportunities: (idx + 1) * 3 + 2,
    }));

    return {
      totalUsers: users.length,
      usersByRole,
      totalOrganizations: orgs.length,
      pendingOrganizations: orgs.filter((o: any) => o.verificationStatus === 'PENDING').length,
      approvedOrganizations: orgs.filter((o: any) => o.verificationStatus === 'APPROVED').length,
      orgsByStatus,
      totalOpportunities: opps.length,
      totalApplications: totalApps,
      totalEvents,
      totalEventRegistrations: totalEventRegs,
      totalDonations: donations.length,
      totalEcoProducts,
      totalOrders,
      syntheticRecordsCount: syntheticCount,
      totalVendors: Math.max(3, Math.round(totalEcoProducts / 10)),
      impactMetrics: {
        estimatedVolunteerHours: 420 + totalApps * 3,
        treesPlanted: 185 + Math.round(opps.length * 1.5),
        itemsDonated: donations.length + 12,
        activeCities: 6,
      },
      monthlyPlatformGrowth,
    };
  }
}

