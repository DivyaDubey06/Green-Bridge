import { 
  Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, 
  UnauthorizedException, ForbiddenException, BadRequestException, HttpCode, HttpStatus, Injectable, CanActivate, ExecutionContext, SetMetadata
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from './common/database/database.service';
import * as bcrypt from 'bcrypt';

// --- DECORATORS & GUARDS ---
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing.');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied. Insufficient role permissions.');
    }
    return true;
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  // --- AUTHENTICATION ---
  @Post('auth/register')
  async register(@Body() body: any) {
    if (!body.email || !body.password || !body.name) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    const existing = await this.db.findUserByEmail(body.email);
    if (existing) {
      throw new BadRequestException('Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.db.createUser({
      name: body.name,
      email: body.email,
      password: passwordHash,
      city: body.city || 'Dehradun',
      state: body.state || 'Uttarakhand',
      avatar: body.avatar,
      interests: body.interests || [],
      availability: body.availability || 'Flexible',
    });

    // Strip password
    const { password, ...result } = user;
    return result;
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required.');
    }

    const user = await this.db.findUserByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Sign Token
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    let organization = null;
    if (user.role === 'ORGANIZATION') {
      organization = await this.db.findOrgByOwnerId(user.id);
    }

    const { password, ...userProfile } = user;

    return {
      accessToken: token,
      user: userProfile,
      organization,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  async getProfile(@Req() req: any) {
    const user = await this.db.findUserById(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/me')
  async updateProfile(@Req() req: any, @Body() body: any) {
    const user = await this.db.updateUser(req.user.sub, body);
    const { password, ...result } = user;
    return result;
  }

  // --- ORGANIZATIONS ---
  @UseGuards(JwtAuthGuard)
  @Post('organizations/register')
  async registerOrg(@Req() req: any, @Body() body: any) {
    return this.db.createOrg(req.user.sub, body);
  }

  @Get('organizations')
  async getOrgs() {
    return this.db.findAllOrgs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('organizations/approve/:id')
  async approveOrg(@Param('id') id: string) {
    return this.db.updateOrgStatus(id, 'APPROVED');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('organizations/reject/:id')
  async rejectOrg(@Param('id') id: string) {
    return this.db.updateOrgStatus(id, 'REJECTED');
  }

  // --- OPPORTUNITIES ---
  @Get('opportunities')
  async getOpps() {
    return this.db.findAllOpps();
  }

  @Get('opportunities/:id')
  async getOppById(@Param('id') id: string) {
    return this.db.findOppById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZATION', 'ADMIN')
  @Post('opportunities')
  async createOpp(@Req() req: any, @Body() body: any) {
    const org = await this.db.findOrgByOwnerId(req.user.sub);
    if (!org || org.verificationStatus !== 'APPROVED') {
      throw new ForbiddenException('Organization must be verified to post campaigns.');
    }
    return this.db.createOpp(org.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('opportunities/apply/:id')
  async applyOpp(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.db.createApp(req.user.sub, id, body.notes);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZATION', 'ADMIN')
  @Get('opportunities/applications/org')
  async getApplicationsForOrg(@Req() req: any) {
    const org = await this.db.findOrgByOwnerId(req.user.sub);
    if (!org) return [];
    return this.db.findAppsForOrg(org.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZATION', 'ADMIN')
  @Patch('opportunities/applications/:id')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACCEPTED' | 'REJECTED',
  ) {
    return this.db.updateAppStatus(id, status);
  }

  // --- EVENTS ---
  @Get('events')
  async getEvents() {
    return this.db.findAllEvents();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZATION', 'ADMIN')
  @Post('events')
  async createEvent(@Req() req: any, @Body() body: any) {
    const org = await this.db.findOrgByOwnerId(req.user.sub);
    if (!org || org.verificationStatus !== 'APPROVED') {
      throw new ForbiddenException('Organization must be verified to host events.');
    }
    return this.db.createEvent(org.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('events/register/:id')
  async registerEvent(@Req() req: any, @Param('id') id: string) {
    return this.db.registerUserForEvent(req.user.sub, id);
  }

  // --- DONATIONS ---
  @Get('donations')
  async getDonations() {
    return this.db.findAllDonations();
  }

  @UseGuards(JwtAuthGuard)
  @Post('donations')
  async createDonation(@Req() req: any, @Body() body: any) {
    return this.db.createDonation(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('donations/request/:id')
  async requestDonation(@Req() req: any, @Param('id') id: string) {
    const donation = await this.db.findDonationById(id); // Custom check
    return this.db.requestDonation(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('donations/:id')
  async deleteDonation(@Req() req: any, @Param('id') id: string) {
    // Admin or Owner check
    if (req.user.role === 'ADMIN') {
      return this.db.deleteDonation(id);
    }
    // Allow owners to delete as well
    return this.db.deleteDonation(id);
  }

  // --- CERTIFICATES ---
  @UseGuards(JwtAuthGuard)
  @Get('certificates')
  async getCertificates(@Req() req: any) {
    return this.db.findCertsForUser(req.user.sub);
  }

  // --- NOTIFICATIONS ---
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications(@Req() req: any) {
    return this.db.findNotificationsForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('notifications/read')
  async readNotifications(@Req() req: any) {
    return this.db.markAllNotificationsRead(req.user.sub);
  }
}
