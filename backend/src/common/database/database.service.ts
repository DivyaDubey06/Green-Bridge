import { Injectable, OnModuleInit } from '@nestjs/common';
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
    events: [],
    donations: [],
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
      return this.mockDb.users.find((u) => u.id === id) || null;
    }
    return this.prisma.user.findUnique({ where: { id } });
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
      const userIdx = this.mockDb.users.findIndex((u) => u.id === id);
      if (userIdx !== -1) {
        this.mockDb.users[userIdx] = { ...this.mockDb.users[userIdx], ...updates };
        this.saveMockDb();
        return this.mockDb.users[userIdx];
      }
      return null;
    }
    return this.prisma.user.update({ where: { id }, data: updates });
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
      return this.mockDb.organizations.find((o) => o.id === id) || null;
    }
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async findOrgByOwnerId(ownerId: string) {
    if (this.useMock) {
      return this.mockDb.organizations.find((o) => o.ownerId === ownerId) || null;
    }
    return this.prisma.organization.findFirst({ where: { ownerId } });
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

  async createApp(userId: string, oppId: string, notes: string) {
    if (this.useMock) {
      const newApp = {
        id: `app-${Math.random().toString(36).substr(2, 9)}`,
        opportunityId: oppId,
        userId,
        status: 'PENDING',
        notes,
        createdAt: new Date().toISOString(),
      };
      this.mockDb.applications.push(newApp);
      this.saveMockDb();
      return newApp;
    }
    return this.prisma.application.create({
      data: {
        notes,
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

  async registerUserForEvent(userId: string, eventId: string) {
    if (this.useMock) {
      const evtIdx = this.mockDb.events.findIndex((e) => e.id === eventId);
      if (evtIdx !== -1) {
        const evt = this.mockDb.events[evtIdx];
        if (!evt.registeredUsers.includes(userId)) {
          evt.registeredUsers.push(userId);
          
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
        }
        return evt;
      }
      return null;
    }
    
    // Live update
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return null;

    if (!event.registeredUsers.includes(userId)) {
      const updatedRegs = [...event.registeredUsers, userId];
      await this.prisma.event.update({
        where: { id: eventId },
        data: { registeredUsers: updatedRegs },
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
    }
    return event;
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
}
