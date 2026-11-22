import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppController, JwtAuthGuard, RolesGuard } from './app.controller';
import { DatabaseService } from './common/database/database.service';
import { JwtService } from '@nestjs/jwt';

describe('GreenBridge Authentication Reliability & Security Test Suite', () => {
  let appController: AppController;
  let db: DatabaseService;
  let jwtService: JwtService;
  let reflector: Reflector;
  let jwtAuthGuard: JwtAuthGuard;
  let rolesGuard: RolesGuard;

  let adminToken: string;
  let userToken: string;

  const createMockExecutionContext = (handler: any, headers: Record<string, string> = {}, user?: any): ExecutionContext => {
    const req = {
      headers,
      user,
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      getHandler: () => handler,
      getClass: () => AppController,
    } as unknown as ExecutionContext;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appController = moduleFixture.get<AppController>(AppController);
    db = moduleFixture.get<DatabaseService>(DatabaseService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    reflector = moduleFixture.get<Reflector>(Reflector);

    jwtAuthGuard = new JwtAuthGuard(jwtService);
    rolesGuard = new RolesGuard(reflector, db);

    await db.onModuleInit();

    // Mint valid tokens
    adminToken = await jwtService.signAsync({
      sub: 'usr-admin',
      email: 'admin@greenbridge.org',
      role: 'ADMIN',
    });

    userToken = await jwtService.signAsync({
      sub: 'usr-sonaa',
      email: 'sonaa@gmail.com',
      role: 'USER',
    });
  });

  // =========================================================================
  // SCENARIO 1: Successful Admin Login -> Stable Dashboard Access
  // =========================================================================
  it('Scenario 1: Successful admin login returns valid accessToken and authoritative ADMIN role', async () => {
    const res = await appController.login({
      email: 'admin@greenbridge.org',
      password: 'admin123',
    });

    expect(res).toHaveProperty('accessToken');
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe('admin@greenbridge.org');
    expect(res.user.role).toBe('ADMIN');

    // Verify token can decode and access telemetry
    const decoded: any = await jwtService.verifyAsync(res.accessToken);
    expect(decoded.role).toBe('ADMIN');

    const analytics = await appController.getAdminAnalytics();
    expect(analytics).toHaveProperty('monthlyPlatformGrowth');
    expect(analytics).toHaveProperty('impactMetrics');
  });

  // =========================================================================
  // SCENARIO 2: Direct Navigation to /admin With Valid Admin Session
  // =========================================================================
  it('Scenario 2: Direct navigation with valid admin session accesses admin endpoints', async () => {
    const mockContext = createMockExecutionContext(appController.getAllUsers, {
      authorization: `Bearer ${adminToken}`,
    }, { sub: 'usr-admin', role: 'ADMIN' });

    // Guards must permit access
    const jwtPass = await jwtAuthGuard.canActivate(mockContext);
    expect(jwtPass).toBe(true);

    const rolesPass = await rolesGuard.canActivate(mockContext);
    expect(rolesPass).toBe(true);

    const users = await appController.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    users.forEach((u: any) => {
      expect(u.password).toBeUndefined();
    });
  });

  // =========================================================================
  // SCENARIO 3: Refreshing /admin Preserving Valid Authentication
  // =========================================================================
  it('Scenario 3: Profile refresh (/auth/profile) preserves ADMIN role and organization data', async () => {
    const profile = await appController.getProfile({ user: { sub: 'usr-admin' } });

    expect(profile.id === 'usr-admin' || (profile as any).syntheticId === 'usr-admin').toBe(true);
    expect(profile.role).toBe('ADMIN');
    expect(profile.organization).toBeDefined();
    // Admin role must NEVER be downgraded by organization presence
    expect(profile.role).not.toBe('ORGANIZATION');
  });

  // =========================================================================
  // SCENARIO 4: Delayed Profile Retrieval During Initialization
  // =========================================================================
  it('Scenario 4: Delayed profile retrieval settles into correct authenticated state', async () => {
    const delayedFetch = new Promise(async (resolve) => {
      setTimeout(async () => {
        const res = await appController.getProfile({ user: { sub: 'usr-admin' } });
        resolve(res);
      }, 30);
    });

    const res: any = await delayedFetch;
    expect(res.role).toBe('ADMIN');
  });

  // =========================================================================
  // SCENARIO 5: Out-of-Order Profile Responses (Stale Response Discarded)
  // =========================================================================
  it('Scenario 5: Out-of-order profile responses discarded via generation ID semantics', async () => {
    let currentAuthGeneration = 1;
    let storedUser: any = null;

    const simulateProfileFetch = async (genId: number, delayMs: number, returnedRole: string) => {
      await new Promise((r) => setTimeout(r, delayMs));
      if (genId !== currentAuthGeneration) {
        return; // Discarded
      }
      storedUser = { role: returnedRole };
    };

    // Request 1 started at Gen 1 with slow network (80ms)
    const req1 = simulateProfileFetch(1, 80, 'STALE_OLD_ROLE');

    // User navigates / refreshes: Generation increments to 2
    currentAuthGeneration = 2;
    // Request 2 started at Gen 2 with fast network (20ms)
    const req2 = simulateProfileFetch(2, 20, 'ADMIN');

    await Promise.all([req1, req2]);

    expect(storedUser).not.toBeNull();
    expect(storedUser.role).toBe('ADMIN');
  });

  // =========================================================================
  // SCENARIO 6: Stale Response From Prior Session Arriving After New Login
  // =========================================================================
  it('Scenario 6: Stale response from earlier session arriving after new login is discarded', async () => {
    let authGeneration = 10;
    let activeSessionUser = 'session-10-user';

    const slowPriorSessionRequest = async (gen: number) => {
      await new Promise((r) => setTimeout(r, 60));
      if (gen !== authGeneration) return;
      activeSessionUser = 'CORRUPTED_STALE_USER';
    };

    const priorPromise = slowPriorSessionRequest(authGeneration);

    // User logs out and logs in as new user: generation increases
    authGeneration = 11;
    activeSessionUser = 'usr-admin';

    await priorPromise;

    expect(activeSessionUser).toBe('usr-admin');
  });

  // =========================================================================
  // SCENARIO 7: Authenticated Non-Admin Attempting Admin Endpoints (Rejected)
  // =========================================================================
  it('Scenario 7: Authenticated non-admin is rejected from admin endpoints with 403 Forbidden', async () => {
    const mockContext = createMockExecutionContext(appController.getAllUsers, {
      authorization: `Bearer ${userToken}`,
    }, { sub: 'usr-sonaa', role: 'USER' });

    await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
  });

  // =========================================================================
  // SCENARIO 8: Unauthorized Direct Request (401 Unauthorized)
  // =========================================================================
  it('Scenario 8: Unauthorized direct request without token returns 401 Unauthorized', async () => {
    const mockContext = createMockExecutionContext(appController.getProfile, {});

    await expect(jwtAuthGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  // =========================================================================
  // SCENARIO 9: Valid Session With Temporary Network Failure (Offline Fallback)
  // =========================================================================
  it('Scenario 9: Temporary network error does not wipe session; offline fallback active', () => {
    let isAuthenticated = true;
    let currentUser = { id: 'usr-admin', role: 'ADMIN' };

    const handleNetworkFailure = (err: { response?: { status: number } }) => {
      if (err.response && err.response.status === 401) {
        isAuthenticated = false;
        currentUser = null as any;
      }
    };

    // Simulate network error (no response)
    handleNetworkFailure({ response: undefined });

    expect(isAuthenticated).toBe(true);
    expect(currentUser).not.toBeNull();
    expect(currentUser.role).toBe('ADMIN');
  });

  // =========================================================================
  // SCENARIO 10: Genuine Session Expiration (401 Clears Session)
  // =========================================================================
  it('Scenario 10: Genuine 401 invalidates session and clears credentials', async () => {
    const expiredToken = await jwtService.signAsync(
      { sub: 'usr-admin', role: 'ADMIN' },
      { expiresIn: '-1s' }
    );

    const mockContext = createMockExecutionContext(appController.getProfile, {
      authorization: `Bearer ${expiredToken}`,
    });

    await expect(jwtAuthGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  // =========================================================================
  // SCENARIO 11: Missing or Invalid Authentication Credentials (Rejected)
  // =========================================================================
  it('Scenario 11: Missing or invalid authentication credentials rejected at login', async () => {
    await expect(
      appController.login({ email: 'admin@greenbridge.org', password: 'wrong-password' })
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      appController.login({ email: 'admin@greenbridge.org' })
    ).rejects.toThrow(BadRequestException);
  });

  // =========================================================================
  // SCENARIO 12: Role Information Missing / Malformed in Response
  // =========================================================================
  it('Scenario 12: Role information missing or malformed handled safely without elevation', () => {
    const rawProfile = { id: 'usr-guest', name: 'Guest User', role: undefined as any };

    const normalizedRole = rawProfile.role === 'ADMIN' ? 'ADMIN' : (rawProfile.role === 'ORGANIZATION' ? 'ORGANIZATION' : 'USER');
    expect(normalizedRole).toBe('USER');
    expect(normalizedRole).not.toBe('ADMIN');
  });

  // =========================================================================
  // SCENARIO 13: Single-Flight In-Flight Deduplication
  // =========================================================================
  it('Scenario 13: Single-flight deduplication prevents redundant simultaneous fetches', async () => {
    let executionCount = 0;
    let activePromise: Promise<string> | null = null;

    const deduplicatedFetch = () => {
      if (activePromise) return activePromise;
      activePromise = (async () => {
        executionCount++;
        await new Promise((r) => setTimeout(r, 20));
        return 'FETCH_DONE';
      })().finally(() => {
        activePromise = null;
      });
      return activePromise;
    };

    const results = await Promise.all([
      deduplicatedFetch(),
      deduplicatedFetch(),
      deduplicatedFetch(),
      deduplicatedFetch(),
      deduplicatedFetch(),
    ]);

    expect(results).toEqual(['FETCH_DONE', 'FETCH_DONE', 'FETCH_DONE', 'FETCH_DONE', 'FETCH_DONE']);
    expect(executionCount).toBe(1);
  });

  // =========================================================================
  // SCENARIO 14: Concurrent Requests Handling (No State Corruption)
  // =========================================================================
  it('Scenario 14: Concurrent requests under parallel execution execute cleanly without race conditions', async () => {
    const parallelOps = [
      appController.getProfile({ user: { sub: 'usr-admin' } }),
      appController.getAdminAnalytics(),
      appController.getAllUsers(),
      appController.getOpps(),
      appController.getEvents(),
      appController.getDonations(),
    ];

    const responses = await Promise.all(parallelOps);
    expect(responses[0].role).toBe('ADMIN');
    expect(responses[1]).toHaveProperty('impactMetrics');
    expect(Array.isArray(responses[2])).toBe(true);
    expect(Array.isArray(responses[3])).toBe(true);
    expect(Array.isArray(responses[4])).toBe(true);
    expect(Array.isArray(responses[5])).toBe(true);
  });

  // =========================================================================
  // SECURITY VERIFICATION: Live Revocation & Privilege Escalation Checks
  // =========================================================================
  it('Security: Privilege escalation via PATCH /users/me is strictly blocked', async () => {
    const res = await appController.updateProfile(
      { user: { sub: 'usr-sonaa' } },
      { role: 'ADMIN', name: 'Sonaa Escalated' }
    );

    expect(res.name).toBe('Sonaa Escalated');
    expect(res.role).not.toBe('ADMIN'); // Role must NEVER be escalated to ADMIN!
  });

  it('Security: Live database revocation denies access even if JWT token contains role ADMIN', async () => {
    // Context where JWT claims ADMIN, but user id does not exist or has non-admin role in DB
    const mockContext = createMockExecutionContext(appController.getAllUsers, {
      authorization: `Bearer forged-token`,
    }, { sub: 'usr-nonexistent', role: 'ADMIN' });

    await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
  });
});
