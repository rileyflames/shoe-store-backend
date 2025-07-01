import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals'; // For mocking
import app from '../src/app.js'; // Your Express app
import Shoe from '../src/models/shoe.model.js';
import { createShoe } from '../src/controllers/shoes/createShoe.js';
import { getAllShoes } from '../src/controllers/shoes/getAllShoes.js';

// Mock request/response for unit tests
const mockRequest = (body = {}, query = {}) => ({
  body,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Sample shoe data for tests
const validShoe = {
  name: 'Air Jordan',
  brand: 'Nike',
  description: 'Classic basketball shoe',
  price: 14999, // $149.99
  sizes: [10, 11],
  category: 'Sneakers',
  colors: ['Red', 'Black'],
  inStock: true,
  images: ['https://example.com/shoe.jpg'],
};

describe('Shoes API', () => {
  beforeEach(async () => {
    await Shoe.deleteMany({}); // Clear database before each test
  });

  // Unit Tests
  describe('Unit Tests: createShoe Controller', () => {
    it('should create a shoe with valid data', async () => {
      const req = mockRequest(validShoe);
      const res = mockResponse();

      // Mock Shoe.create
      const mockShoe = { ...validShoe, _id: 'mockId', createdAt: new Date(), updatedAt: new Date() };
      jest.spyOn(Shoe, 'create').mockResolvedValue(mockShoe);

      await createShoe(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockShoe);
      expect(Shoe.create).toHaveBeenCalledWith(validShoe);
    });

    it('should throw 400 for invalid data', async () => {
      const invalidShoe = {
        name: '', // Invalid: empty
        brand: 'Nike',
        description: 'Shoe',
        price: -100, // Invalid: negative
        sizes: [], // Invalid: empty
        category: 'Sneakers',
        colors: [], // Invalid: empty
        inStock: true,
        images: ['not-a-url'], // Invalid: not a URL
      };
      const req = mockRequest(invalidShoe);
      const res = mockResponse();

      await expect(createShoe(req, res)).rejects.toThrow(
        'Shoe name is required, Price must be a positive integer, At least one valid size is required, At least one color is required, images[0] must be a valid URL'
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Unit Tests: getAllShoes Controller', () => {
    it('should return paginated shoes with default query', async () => {
      const req = mockRequest({}, { page: '1', limit: '12' });
      const res = mockResponse();

      const mockShoes = [validShoe];
      jest.spyOn(Shoe, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockShoes),
          }),
        }),
      });
      jest.spyOn(Shoe, 'countDocuments').mockResolvedValue(1);

      await getAllShoes(req, res);

      expect(res.json).toHaveBeenCalledWith({
        total: 1,
        page: 1,
        pages: 1,
        results: mockShoes,
      });
      expect(Shoe.find).toHaveBeenCalledWith({});
      expect(Shoe.countDocuments).toHaveBeenCalledWith({});
    });

    it('should filter shoes by brand', async () => {
      const req = mockRequest({}, { brand: 'Nike' });
      const res = mockResponse();

      const mockShoes = [validShoe];
      jest.spyOn(Shoe, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockShoes),
          }),
        }),
      });
      jest.spyOn(Shoe, 'countDocuments').mockResolvedValue(1);

      await getAllShoes(req, res);

      expect(Shoe.find).toHaveBeenCalledWith({ brand: 'Nike' });
    });
  });

  // Integration Tests
  describe('Integration Tests: GET /api/shoes', () => {
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
      await Shoe.create([
        validShoe,
        {
          name: 'Ultraboost',
          brand: 'Adidas',
          description: 'Performance shoe',
          price: 15000,
          sizes: [9],
          category: 'Sneakers',
          colors: ['Black'],
          inStock: true,
        },
      ]);

      const response = await request(app).get('/api/shoes?page=1&limit=12');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.results.length).toBe(2);
      expect(response.body.results[0]).toHaveProperty('name', 'Air Jordan');
      expect(response.body.results[1]).toHaveProperty('name', 'Ultraboost');
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBe(1);
    });

    it('should filter shoes by brand', async () => {
      await Shoe.create([
        validShoe,
        {
          name: 'Ultraboost',
          brand: 'Adidas',
          description: 'Performance shoe',
          price: 15000,
          sizes: [9],
          category: 'Sneakers',
          colors: ['Black'],
          inStock: true,
        },
      ]);

      const response = await request(app).get('/api/shoes?brand=Nike');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results.length).toBe(1);
      expect(response.body.results[0]).toHaveProperty('brand', 'Nike');
    });

    it('should filter shoes by search term in description', async () => {
      await Shoe.create([validShoe]);

      const response = await request(app).get('/api/shoes?search=basketball');
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.results[0]).toHaveProperty('name', 'Air Jordan');
    });

    it('should sort shoes by price ascending', async () => {
      await Shoe.create([
        { ...validShoe, price: 14999 },
        { ...validShoe, name: 'Ultraboost', brand: 'Adidas', price: 12000 },
      ]);

      const response = await request(app).get('/api/shoes?sortBy=price&order=asc');
      expect(response.status).toBe(200);
      expect(response.body.results[0]).toHaveProperty('price', 12000);
      expect(response.body.results[1]).toHaveProperty('price', 14999);
    });
  });

  describe('Integration Tests: POST /api/shoes', () => {
    it('should create a shoe with valid data', async () => {
      const response = await request(app).post('/api/shoes').send(validShoe);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Air Jordan');
      expect(response.body).toHaveProperty('price', 14999);
      expect(response.body.sizes).toEqual([10, 11]);
      expect(response.body.images).toEqual(['https://example.com/shoe.jpg']);

      const shoeInDb = await Shoe.findOne({ name: 'Air Jordan' });
      expect(shoeInDb).toBeTruthy();
      expect(shoeInDb.brand).toBe('Nike');
    });

    it('should return 400 for invalid data', async () => {
      const invalidShoe = {
        name: '', // Invalid
        brand: 'Nike',
        description: 'Shoe',
        price: -100, // Invalid
        sizes: [], // Invalid
        category: 'Sneakers',
        colors: [], // Invalid
        inStock: true,
        images: ['not-a-url'], // Invalid
      };

      const response = await request(app).post('/api/shoes').send(invalidShoe);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Shoe name is required');
      expect(response.body.message).toContain('Price must be a positive integer');
      expect(response.body.message).toContain('At least one valid size is required');
      expect(response.body.message).toContain('At least one color is required');
      expect(response.body.message).toContain('images[0] must be a valid URL');
    });
  });
});