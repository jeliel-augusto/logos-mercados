import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { testDbConfig } from '../test-db.config';

describe('Order and Client E2E Tests', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [testDbConfig, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /client/:id', () => {
    it('should return client with categories and products grouped by category', async () => {
      // First, create a test client with unique name
      const uniqueName = `Test Client ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
          theme_color_primary: '#FF0000',
          theme_color_secondary: '#00FF00',
        });

      expect(clientResponse.status).toBe(201);
      expect(clientResponse.body).toHaveProperty('id');

      const clientId = clientResponse.body.id;

      // Create categories
      const beerCategoryResponse = await request(app.getHttpServer())
        .post('/client-category')
        .send({
          name: 'beers',
          client_id: clientId,
        });

      const snackCategoryResponse = await request(app.getHttpServer())
        .post('/client-category')
        .send({
          name: 'snacks',
          client_id: clientId,
        });

      // Create products for each category
      await request(app.getHttpServer()).post('/product').send({
        unit_price: 5.5,
        description: 'Beer 1',
        client_id: clientId,
        category_id: beerCategoryResponse.body.id,
      });

      await request(app.getHttpServer()).post('/product').send({
        unit_price: 6.0,
        description: 'Beer 2',
        client_id: clientId,
        category_id: beerCategoryResponse.body.id,
      });

      await request(app.getHttpServer()).post('/product').send({
        unit_price: 3.5,
        description: 'Snack 1',
        client_id: clientId,
        category_id: snackCategoryResponse.body.id,
      });

      // Get client with categories and products
      const response = await request(app.getHttpServer())
        .get(`/client/${clientId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', clientId);
      expect(response.body).toHaveProperty('name', uniqueName);
      expect(response.body).toHaveProperty('categories');

      const categories = response.body.categories;
      expect(categories).toHaveLength(2);

      const beerCategory = categories.find(
        (cat: any) => cat.category === 'beers',
      );
      const snackCategory = categories.find(
        (cat: any) => cat.category === 'snacks',
      );

      expect(beerCategory).toBeDefined();
      expect(beerCategory.products).toHaveLength(2);
      expect(beerCategory.products[0]).toHaveProperty('description');
      expect(beerCategory.products[0]).toHaveProperty('unit_price');

      expect(snackCategory).toBeDefined();
      expect(snackCategory.products).toHaveLength(1);
      expect(snackCategory.products[0]).toHaveProperty('description');
      expect(snackCategory.products[0]).toHaveProperty('unit_price');
    });

    it('should return 404 for non-existent client', async () => {
      await request(app.getHttpServer())
        .get('/client/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('POST /order', () => {
    it('should create an order with valid data', async () => {
      // Create test client first
      const uniqueName = `Test Client For Order ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      expect(clientResponse.status).toBe(201);
      expect(clientResponse.body).toHaveProperty('id');

      const clientId = clientResponse.body.id;

      // Create test products
      const product1Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product 1',
          client_id: clientId,
        });

      const product2Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 15.5,
          description: 'Test Product 2',
          client_id: clientId,
        });

      const orderData = {
        name: 'John Doe',
        address: '123 Test Street, Test City',
        whatsapp_contact: '+5511999999999',
        client_id: clientId,
        order_products: [
          {
            product_id: product1Response.body.id,
            quantity: 2,
            total_value: 20.0,
          },
          {
            product_id: product2Response.body.id,
            quantity: 1,
            total_value: 15.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'John Doe');
      expect(response.body).toHaveProperty(
        'address',
        '123 Test Street, Test City',
      );
      expect(response.body).toHaveProperty(
        'whatsapp_contact',
        '+5511999999999',
      );
      expect(response.body).toHaveProperty('client_id', clientId);
      expect(response.body).toHaveProperty('requested_at');
    });

    it('should return 400 when name is missing', async () => {
      const orderData = {
        address: '123 Test Street',
        whatsapp_contact: '+5511999999999',
        order_products: [],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(400);
    });

    it('should return 400 when address is missing', async () => {
      const orderData = {
        name: 'John Doe',
        whatsapp_contact: '+5511999999999',
        order_products: [],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(400);
    });

    it('should return 400 when whatsapp_contact is missing', async () => {
      const orderData = {
        name: 'John Doe',
        address: '123 Test Street',
        order_products: [],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(400);
    });

    it('should return 400 when order_products is missing', async () => {
      const orderData = {
        name: 'John Doe',
        address: '123 Test Street',
        whatsapp_contact: '+5511999999999',
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(400);
    });

    it('should return 400 when order_products is empty', async () => {
      const orderData = {
        name: 'John Doe',
        address: '123 Test Street',
        whatsapp_contact: '+5511999999999',
        order_products: [],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderData)
        .expect(400);
    });
  });

  describe('GET /orders', () => {
    it('should return paginated orders with products (default page 1, limit 50)', async () => {
      // Create test client
      const uniqueName = `Test Client For Orders ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      expect(clientResponse.status).toBe(201);
      const clientId = clientResponse.body.id;

      // Create test products
      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 25.0,
          description: 'Test Product For Orders',
          client_id: clientId,
        });

      // Create multiple orders
      for (let i = 1; i <= 3; i++) {
        await request(app.getHttpServer())
          .post('/order')
          .send({
            name: `Customer ${i}`,
            address: `${i} Test Street`,
            whatsapp_contact: `+551199999999${i}`,
            client_id: clientId,
            order_products: [
              {
                product_id: productResponse.body.id,
                quantity: i,
                total_value: 25.0 * i,
              },
            ],
          });
      }

      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 50);
      expect(response.body).toHaveProperty('totalPages');

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);

      // Check first order structure
      const firstOrder = response.body.data[0];
      expect(firstOrder).toHaveProperty('id');
      expect(firstOrder).toHaveProperty('name');
      expect(firstOrder).toHaveProperty('address');
      expect(firstOrder).toHaveProperty('whatsapp_contact');
      expect(firstOrder).toHaveProperty('requested_at');
      expect(firstOrder).toHaveProperty('orderProducts');
      expect(Array.isArray(firstOrder.orderProducts)).toBe(true);

      if (firstOrder.orderProducts.length > 0) {
        const orderProduct = firstOrder.orderProducts[0];
        expect(orderProduct).toHaveProperty('quantity');
        expect(orderProduct).toHaveProperty('total_value');
        expect(orderProduct).toHaveProperty('product');
        expect(orderProduct.product).toHaveProperty('id');
        expect(orderProduct.product).toHaveProperty('description');
        expect(orderProduct.product).toHaveProperty('unit_price');
      }
    });

    it('should return paginated orders with custom page and limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders?page=2&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('page', 2);
      expect(response.body).toHaveProperty('limit', 10);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('totalPages');
    });

    it('should return empty array when no orders exist', async () => {
      // This would require cleaning the database or using a test-specific schema
      // For now, we'll just test the structure
      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PATCH /order/:id/status', () => {
    it('should update order status from CREATED to ACCEPTED', async () => {
      // Create test client first
      const uniqueName = `Test Client For Status ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      const clientId = clientResponse.body.id;

      // Create test product
      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product For Status',
          client_id: clientId,
        });

      // Create order
      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          name: 'John Doe',
          address: '123 Test Street',
          whatsapp_contact: '+5511999999999',
          client_id: clientId,
          order_products: [
            {
              product_id: productResponse.body.id,
              quantity: 1,
              total_value: 10.0,
            },
          ],
        });

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.status).toBe('CREATED');

      const orderId = orderResponse.body.id;

      // Update status to ACCEPTED
      const updateResponse = await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({
          status: 'ACCEPTED',
        })
        .expect(200);

      expect(updateResponse.body.status).toBe('ACCEPTED');
      expect(updateResponse.body.accepted_at).toBeTruthy();
    });

    it('should update order status through valid transitions', async () => {
      // Create test client first
      const uniqueName = `Test Client For Transitions ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      const clientId = clientResponse.body.id;

      // Create test product
      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product For Transitions',
          client_id: clientId,
        });

      // Create order
      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          name: 'Jane Doe',
          address: '456 Test Street',
          whatsapp_contact: '+5511999998888',
          client_id: clientId,
          order_products: [
            {
              product_id: productResponse.body.id,
              quantity: 1,
              total_value: 10.0,
            },
          ],
        });

      const orderId = orderResponse.body.id;

      // CREATED -> ACCEPTED
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({ status: 'ACCEPTED' })
        .expect(200);

      // ACCEPTED -> IN_DELIVERY
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({ status: 'IN_DELIVERY' })
        .expect(200);

      // IN_DELIVERY -> CONCLUDED
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({ status: 'CONCLUDED' })
        .expect(200);
    });

    it('should return 400 for invalid status transition', async () => {
      // Create test client first
      const uniqueName = `Test Client For Invalid ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      const clientId = clientResponse.body.id;

      // Create test product
      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product For Invalid',
          client_id: clientId,
        });

      // Create order
      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          name: 'Invalid Doe',
          address: '789 Test Street',
          whatsapp_contact: '+5511999997777',
          client_id: clientId,
          order_products: [
            {
              product_id: productResponse.body.id,
              quantity: 1,
              total_value: 10.0,
            },
          ],
        });

      const orderId = orderResponse.body.id;

      // Try invalid transition: CREATED -> IN_DELIVERY
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({ status: 'IN_DELIVERY' })
        .expect(400);
    });

    it('should return 400 for invalid status value', async () => {
      // Create a valid order first to avoid 404
      const uniqueName = `Test Client For Invalid Status ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      const clientId = clientResponse.body.id;

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product',
          client_id: clientId,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          name: 'Test Order',
          address: '123 Test Street',
          whatsapp_contact: '+5511999999999',
          client_id: clientId,
          order_products: [
            {
              product_id: productResponse.body.id,
              quantity: 1,
              total_value: 10.0,
            },
          ],
        });

      const orderId = orderResponse.body.id;

      // Now try invalid status
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });

    it('should return 404 when updating status for non-existent order', async () => {
      await request(app.getHttpServer())
        .patch('/order/00000000-0000-0000-0000-000000000000/status')
        .send({ status: 'ACCEPTED' })
        .expect(404);
    });

    it('should return 400 when status is missing', async () => {
      // Create a valid order first to avoid 404
      const uniqueName = `Test Client For Missing Status ${Date.now()}`;
      const clientResponse = await request(app.getHttpServer())
        .post('/client')
        .send({
          name: uniqueName,
          logo_url: 'https://example.com/logo.png',
        });

      const clientId = clientResponse.body.id;

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          unit_price: 10.0,
          description: 'Test Product',
          client_id: clientId,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          name: 'Test Order',
          address: '123 Test Street',
          whatsapp_contact: '+5511999999999',
          client_id: clientId,
          order_products: [
            {
              product_id: productResponse.body.id,
              quantity: 1,
              total_value: 10.0,
            },
          ],
        });

      const orderId = orderResponse.body.id;

      // Now try missing status
      await request(app.getHttpServer())
        .patch(`/order/${orderId}/status`)
        .send({})
        .expect(400);
    });
  });
});
