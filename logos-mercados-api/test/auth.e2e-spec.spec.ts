import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { SystemRole } from '../src/entities/roles.enum';
import { testDbConfig } from './test-db.config';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  // Generate unique test users
  const generateTestUser = (suffix: string = '') => ({
    name: `Test User${suffix}`,
    login: `testuser${suffix}_${Date.now()}`,
    password: 'testpassword123',
    client_id: `test-client${suffix}_123`,
  });

  const testUser = generateTestUser();
  const testUser2 = generateTestUser('2');

  beforeAll(async () => {
    // Create test database module
    moduleFixture = await Test.createTestingModule({
      imports: [testDbConfig, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    const userRepository = moduleFixture.get('UserRepository');
    await userRepository.delete({ login: testUser.login });
    await userRepository.delete({ login: testUser2.login });

    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testUser.name);
          expect(res.body).toHaveProperty('login', testUser.login);
          expect(res.body).toHaveProperty('client_id', testUser.client_id);
          expect(res.body).toHaveProperty('system_role', SystemRole.CLIENT);
          expect(res.body).not.toHaveProperty('password_hash');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should register a user without client_id', () => {
      const userWithoutClientId = {
        name: 'Test User No Client',
        login: `testusernocc_${Date.now()}`,
        password: 'testpassword456',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userWithoutClientId)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', userWithoutClientId.name);
          expect(res.body).toHaveProperty('login', userWithoutClientId.login);
          expect(res.body).toHaveProperty('client_id', null);
          expect(res.body).toHaveProperty('system_role', SystemRole.CLIENT);
        });
    });

    it('should return 409 when trying to register an existing user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'User with this login already exists',
          );
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser.login,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
          expect(res.body.access_token.split('.')).toHaveLength(3); // JWT has 3 parts

          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('login', testUser.login);
          expect(res.body.user).toHaveProperty('name', testUser.name);
          expect(res.body.user).toHaveProperty('client_id', testUser.client_id);
          expect(res.body.user).toHaveProperty(
            'system_role',
            SystemRole.CLIENT,
          );
          expect(res.body.user).not.toHaveProperty('password_hash');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser.login,
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'nonexistentuser',
          password: 'somepassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
  });

  describe('GET /auth/profile', () => {
    let authToken: string;

    beforeAll(async () => {
      // Get auth token for profile tests
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser.login,
          password: testUser.password,
        });

      authToken = loginResponse.body.access_token;
    });

    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('login', testUser.login);
          expect(res.body).toHaveProperty('name', testUser.name);
          expect(res.body).toHaveProperty('client_id', testUser.client_id);
          expect(res.body).not.toHaveProperty('password_hash');
        });
    });

    it('should return 401 without authorization header', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });

    it('should return 401 with malformed authorization header', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });
  });

  describe('POST /auth/validate', () => {
    let authToken: string;

    beforeAll(async () => {
      // Register and login a user for validation tests
      await request(app.getHttpServer()).post('/auth/register').send(testUser2);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: testUser2.login,
          password: testUser2.password,
        });

      authToken = loginResponse.body.access_token;
    });

    it('should validate a valid JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/validate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('valid', true);
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('login', testUser2.login);
          expect(res.body.user).toHaveProperty('name', testUser2.name);
          expect(res.body.user).toHaveProperty(
            'client_id',
            testUser2.client_id,
          );
          expect(res.body.user).not.toHaveProperty('password_hash');
        });
    });

    it('should return 401 for invalid token during validation', () => {
      return request(app.getHttpServer())
        .post('/auth/validate')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });

  describe('Complete Auth Flow', () => {
    it('should complete full auth flow: register -> login -> profile', async () => {
      const uniqueUser = {
        name: 'Flow Test User',
        login: `flowtest_${Date.now()}_${Math.random()}`,
        password: 'flowpassword123',
        client_id: 'flow-client',
      };

      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(uniqueUser)
        .expect(201);

      expect(registerResponse.body.login).toBe(uniqueUser.login);

      // Step 2: Login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: uniqueUser.login,
          password: uniqueUser.password,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('access_token');
      const token = loginResponse.body.access_token;

      // Step 3: Get Profile
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.login).toBe(uniqueUser.login);

      // Step 4: Validate Token
      const validateResponse = await request(app.getHttpServer())
        .post('/auth/validate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(validateResponse.body.valid).toBe(true);

      // Cleanup
      const userRepository = moduleFixture.get('UserRepository');
      await userRepository.delete({ login: uniqueUser.login });
    });
  });
});
