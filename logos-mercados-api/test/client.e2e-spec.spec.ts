import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'src/entities/client.entity';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { SystemRole } from '../src/entities/roles.enum';
import { testDbConfig } from './test-db.config';

describe('ClientController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  // Test data
  const generateTestClient = (suffix: string = '') => ({
    name: `Test Client${suffix}`,
    logo_url: `https://example.com/logo${suffix}.png`,
    theme_color_primary: '#FF0000',
    theme_color_secondary: '#00FF00',
  });

  const testClient = generateTestClient();

  // Auth tokens for different roles
  let adminToken: string;
  let clientToken: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [testDbConfig, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test users and get tokens
    await setupTestUsers();
  });

  afterAll(async () => {
    // Clean up test data
    const clientRepository = moduleFixture.get('ClientRepository');
    const userRepository = moduleFixture.get('UserRepository');

    await clientRepository.delete({ name: testClient.name });

    // Clean up test users created during tests
    // Note: In a real scenario, you might want to store the user logins for precise cleanup
    // For now, we'll clean up clients with test patterns

    await app.close();
  });

  async function setupTestUsers() {
    // Create admin user
    const adminUser = {
      name: 'Admin User',
      login: `admin_${Date.now()}`,
      password: 'adminpassword',
    };

    await request(app.getHttpServer()).post('/auth/register').send(adminUser);

    // Update admin user to have ADMIN role
    const userRepository = moduleFixture.get('UserRepository');
    await userRepository.update(
      { login: adminUser.login },
      { system_role: SystemRole.ADMIN },
    );

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: adminUser.login,
        password: adminUser.password,
      });

    adminToken = adminLogin.body.access_token;

    // Create client user (default CLIENT role)
    const clientUser = {
      name: 'Client User',
      login: `client_${Date.now()}`,
      password: 'clientpassword',
    };

    await request(app.getHttpServer()).post('/auth/register').send(clientUser);

    const clientLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: clientUser.login,
        password: clientUser.password,
      });

    clientToken = clientLogin.body.access_token;
  }

  describe('POST /clients', () => {
    it('should create a client with ADMIN token', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testClient)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', testClient.name);
          expect(res.body).toHaveProperty('logo_url', testClient.logo_url);
          expect(res.body).toHaveProperty(
            'theme_color_primary',
            testClient.theme_color_primary,
          );
          expect(res.body).toHaveProperty(
            'theme_color_secondary',
            testClient.theme_color_secondary,
          );
        });
    });

    it('should return 403 when creating client with CLIENT token', () => {
      const newClient = generateTestClient('forbidden');

      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(newClient)
        .expect(403)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Access denied');
        });
    });

    it('should return 401 when creating client without token', () => {
      const newClient = generateTestClient('unauthorized');

      return request(app.getHttpServer())
        .post('/clients')
        .send(newClient)
        .expect(401);
    });

    it('should return 409 when creating client with duplicate name', () => {
      return request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testClient)
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Client with this name already exists',
          );
        });
    });
  });

  describe('GET /clients', () => {
    it('should get all clients without authentication', () => {
      return request(app.getHttpServer())
        .get('/clients')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /clients/:id', () => {
    let clientId: string;

    beforeAll(async () => {
      const clientRepository = moduleFixture.get('ClientRepository');
      await clientRepository.deleteAll();
      // Create a client to test with
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(generateTestClient('single'));
      clientId = response.body.id;
    });

    it('should get a client by ID without authentication', () => {
      return request(app.getHttpServer())
        .get(`/clients/${clientId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', clientId);
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should return 404 for non-existent client', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .get(`/clients/${fakeId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            `Client with ID ${fakeId} not found`,
          );
        });
    });
  });

  describe('PATCH /clients/:id', () => {
    let clientId: string;

    beforeAll(async () => {
      // Create a client to test with
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(generateTestClient('update'));

      clientId = response.body.id;
    });

    it('should update a client with ADMIN token', () => {
      const updateData = {
        name: 'Updated Client Name',
        logo_url: 'https://example.com/updated-logo.png',
      };

      return request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', clientId);
          expect(res.body).toHaveProperty('name', updateData.name);
          expect(res.body).toHaveProperty('logo_url', updateData.logo_url);
        });
    });

    it('should return 403 when updating client with CLIENT token', () => {
      const updateData = { name: 'Forbidden Update' };

      return request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(updateData)
        .expect(403)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Access denied');
        });
    });

    it('should return 401 when updating client without token', () => {
      const updateData = { name: 'Unauthorized Update' };

      return request(app.getHttpServer())
        .patch(`/clients/${clientId}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('DELETE /clients/:id', () => {
    let clientId: string;

    beforeAll(async () => {
      // Create a client to test with
      const response = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(generateTestClient('delete'));

      clientId = response.body.id;
    });

    it('should delete a client with ADMIN token', () => {
      return request(app.getHttpServer())
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should return 403 when deleting client with CLIENT token', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .delete(`/clients/${fakeId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Access denied');
        });
    });

    it('should return 401 when deleting client without token', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .delete(`/clients/${fakeId}`)
        .expect(401);
    });
  });
});
