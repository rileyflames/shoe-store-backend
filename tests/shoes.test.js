// tests/shoes.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Shoe from '../src/models/shoe.model.js';
import { setupDB, teardownDB } from './setup.js';

let mongoServer;

const validShoe = {
  name: 'Air Jordan',
  brand: 'Nike',
  description: 'Classic basketball shoe',
  price: 14999,
  sizes: [10, 11],
  category: 'Sneakers',
  colors: ['Red', 'Black'],
  inStock: true,
  images: ['https://example.com/shoe.jpg'],
};

const ultraboostShoe = {
  name: 'Ultraboost',
  brand: 'Adidas',
  description: 'Performance shoe',
  price: 15000,
  sizes: [9],
  category: 'Sneakers',
  colors: ['Black'],
  inStock: false,
};

describe('Shoes API', () => {
  beforeAll(async () => {
    mongoServer = await setupDB();
    await Shoe.collection.createIndex({ name: 1 }, { unique: true });
  });

  afterAll(async () => {
    await teardownDB(mongoServer);
  });

  beforeEach(async () => {
    await Shoe.deleteMany({});
    await Shoe.collection.dropIndexes();
    await Shoe.collection.createIndex({ name: 1 }, { unique: true });
  });

  describe('GET /api/shoes', () => {
    it('should return 200 and an empty array when no shoes exist', async () => {
      const response = await request(app).get('/api/shoes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        page: 1,
        pages: 0,
        results: [],
      });
    });

    it('should return 200 and a list of shoes with default pagination', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?page=1&limit=12');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.results.length).toBe(2);
      expect(response.body.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Air Jordan' }),
          expect.objectContaining({ name: 'Ultraboost' }),
        ])
      );
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBe(1);
    });

    it('should filter shoes by brand', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?brand=Nike');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ brand: 'Nike' });
    });

    it('should filter shoes by category', async () => {
      await Shoe.create([validShoe, { ...ultraboostShoe, category: 'Running' }]);
      const response = await request(app).get('/api/shoes?category=Sneakers');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ category: 'Sneakers' });
    });

    it('should filter shoes by inStock', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?inStock=true');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ inStock: true });
    });

    it('should filter shoes by price range', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?minPrice=14999&maxPrice=14999');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ price: 14999 });
    });

    it('should filter shoes by size', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?size=10');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should filter shoes by search term', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?search=basketball');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should sort shoes by price ascending', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?sortBy=price&order=asc');
      expect(response.status).toBe(200);
      expect(response.body.results[0]).toMatchObject({ price: 14999 });
      expect(response.body.results[1]).toMatchObject({ price: 15000 });
    });

    it('should filter shoes by maxPrice', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?maxPrice=14999');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should sort shoes by name ascending', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?sortBy=name&order=asc');
      expect(response.status).toBe(200);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
      expect(response.body.results[1]).toMatchObject({ name: 'Ultraboost' });
    });

    it('should filter shoes by minPrice and size', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?minPrice=15000&size=9');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Ultraboost' });
    });

    it('should filter shoes by category and inStock', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?category=Sneakers&inStock=true');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should filter shoes by brand and sort by price descending', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?brand=Adidas&sortBy=price&order=desc');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Ultraboost', price: 15000 });
    });

    it('should filter shoes by search term and inStock', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?search=shoe&inStock=true');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should filter shoes by price range and color', async () => {
      await Shoe.create([validShoe, ultraboostShoe]);
      const response = await request(app).get('/api/shoes?minPrice=10000&maxPrice=20000&colors=Red');
      console.log('Response body:', JSON.stringify(response.body, null, 2)); // Debug
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Air Jordan' });
    });

    it('should filter shoes by category, size, and sort by name ascending', async () => {
      await Shoe.create([validShoe, { ...ultraboostShoe, category: 'Running', sizes: [9, 10] }]);
      const response = await request(app).get('/api/shoes?category=Running&size=9&sortBy=name&order=asc');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toMatchObject({ name: 'Ultraboost' });
    });
  });

  describe('POST /api/shoes', () => {
    it('should create a shoe with valid data', async () => {
      const response = await request(app).post('/api/shoes').send(validShoe);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: 'Air Jordan',
        price: 14999,
        sizes: [10, 11],
      });

      const shoeInDb = await Shoe.findOne({ name: 'Air Jordan' });
      expect(shoeInDb).toBeTruthy();
      expect(shoeInDb.brand).toBe('Nike');
    });

    it('should return 400 for invalid data', async () => {
      const invalidShoe = {
        name: '',
        brand: 'Nike',
        description: 'Shoe',
        price: -100,
        sizes: [],
        category: 'Sneakers',
        colors: [],
        inStock: true,
        images: ['not-a-url'],
      };
      const response = await request(app).post('/api/shoes').send(invalidShoe);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Shoe name is required');
      expect(response.body.message).toContain('Price must be a positive integer');
    });

    it('should return 400 for duplicate name error', async () => {
      await Shoe.create(validShoe);
      const response = await request(app).post('/api/shoes').send(validShoe);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Shoe name already exists');
    });
  });

  describe('GET /api/shoes/:id', () => {
    let createdShoe;

    beforeEach(async () => {
      await Shoe.deleteMany({});
      createdShoe = await Shoe.create(validShoe);
    });

    it('should return a shoe for a valid ID', async () => {
      const response = await request(app).get(`/api/shoes/${createdShoe._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: validShoe.name,
        brand: validShoe.brand,
        price: validShoe.price,
      });
    });

    it('should return 404 if shoe does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/shoes/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Shoe not found');
    });

    it('should return 400 for invalid shoe ID', async () => {
      const response = await request(app).get('/api/shoes/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid shoe ID');
    });
  });

  describe('PUT /api/shoes/:id', () => {
    let createdShoe;

    beforeEach(async () => {
      await Shoe.deleteMany({});
      createdShoe = await Shoe.create({ ...validShoe, name: 'UpdateTestShoe' });
    });

    it('should update a shoe with valid data', async () => {
      const response = await request(app)
        .put(`/api/shoes/${createdShoe._id}`)
        .send({ price: 9999, inStock: false });
      expect(response.status).toBe(200);
      expect(response.body.price).toBe(9999);
      expect(response.body.inStock).toBe(false);
    });

    it('should update a shoe with partial data', async () => {
      const response = await request(app)
        .put(`/api/shoes/${createdShoe._id}`)
        .send({ name: 'Updated Name' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should return 400 for invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/shoes/invalid-id')
        .send({ price: 1000 });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid shoe ID');
    });

    it('should return 404 if shoe does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/shoes/${nonExistentId}`)
        .send({ price: 1000 });
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Shoe not found');
    });

    it('should return 400 for invalid data (Zod validation)', async () => {
      const response = await request(app)
        .put(`/api/shoes/${createdShoe._id}`)
        .send({ price: -100, images: ['not-a-url'] });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Price must be a positive integer');
      expect(response.body.message).toContain('must be a valid URL');
    });

    it('should return 400 for duplicate name', async () => {
      // Create another shoe with a different name
      const otherShoe = await Shoe.create({ ...validShoe, name: 'UniqueName' });
      // Try to update createdShoe to have the same name as otherShoe
      const response = await request(app)
        .put(`/api/shoes/${createdShoe._id}`)
        .send({ name: 'UniqueName' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Shoe name already exists');
    });
  });

  describe('PATCH /api/shoes/:id/soft-delete', () => {
    let createdShoe;

    beforeEach(async () => {
      await Shoe.deleteMany({});
      createdShoe = await Shoe.create({ ...validShoe, name: 'SoftDeleteTestShoe' });
    });

    it('should soft delete a shoe successfully', async () => {
      const response = await request(app)
        .patch(`/api/shoes/${createdShoe._id}/soft-delete`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isDeleted).toBe(true);

      // Confirm in DB
      const shoeInDb = await Shoe.findById(createdShoe._id);
      expect(shoeInDb.isDeleted).toBe(true);
    });

    it('should return 400 for invalid shoe ID', async () => {
      const response = await request(app)
        .patch('/api/shoes/invalid-id/soft-delete');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid shoe ID');
    });

    it('should return 404 if shoe does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .patch(`/api/shoes/${nonExistentId}/soft-delete`);
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Shoe not found');
    });

    it('should not return soft-deleted shoes in GET /api/shoes', async () => {
      // Soft delete the shoe
      await request(app).patch(`/api/shoes/${createdShoe._id}/soft-delete`);
      const response = await request(app).get('/api/shoes');
      expect(response.body.results.find(s => s._id === String(createdShoe._id))).toBeUndefined();
    });
  });

  describe('DELETE /api/shoes/:id', () => {
    let createdShoe;

    beforeEach(async () => {
      await Shoe.deleteMany({});
      createdShoe = await Shoe.create({ ...validShoe, name: 'HardDeleteTestShoe' });
    });

    it('should hard delete a shoe successfully', async () => {
      const response = await request(app).delete(`/api/shoes/${createdShoe._id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('permanently deleted');

      // Confirm in DB
      const found = await Shoe.findById(createdShoe._id);
      expect(found).toBeNull();
    });

    it('should return 400 for invalid shoe ID', async () => {
      const response = await request(app).delete('/api/shoes/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid shoe ID');
    });

    it('should return 404 if shoe does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app).delete(`/api/shoes/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Shoe not found');
    });
  });

  describe('PATCH /api/shoes/:id/restore', () => {
    let createdShoe;

    beforeEach(async () => {
      await Shoe.deleteMany({});
      createdShoe = await Shoe.create({ ...validShoe, isDeleted: true, name: 'RestoreTestShoe' });
    });

    it('should restore a soft-deleted shoe', async () => {
      const response = await request(app)
        .patch(`/api/shoes/${createdShoe._id}/restore`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isDeleted).toBe(false);

      // Confirm in DB
      const shoeInDb = await Shoe.findById(createdShoe._id);
      expect(shoeInDb.isDeleted).toBe(false);
    });

    it('should return 400 for invalid shoe ID', async () => {
      const response = await request(app)
        .patch('/api/shoes/invalid-id/restore');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid shoe ID');
    });

    it('should return 404 if shoe does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .patch(`/api/shoes/${nonExistentId}/restore`);
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Shoe not found');
    });
  });
});