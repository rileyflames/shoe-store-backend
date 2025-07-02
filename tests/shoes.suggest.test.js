import request from 'supertest';
import Shoe from '../src/models/shoe.model.js';
import app from '../src/app.js';
import { setupDB, teardownDB } from './setup.js';

let mongoServer;

describe('GET /api/shoes/suggest', () => {
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
    await Shoe.create([
      { name: 'Nike Air Max', brand: 'Nike', description: '...', price: 100, sizes: [9], category: 'Sneakers', colors: ['Black'], inStock: true, images: [], isDeleted: false },
      { name: 'Adidas Ultraboost', brand: 'Adidas', description: '...', price: 120, sizes: [10], category: 'Running', colors: ['White'], inStock: true, images: [], isDeleted: false },
      { name: 'Puma RS-X', brand: 'Puma', description: '...', price: 90, sizes: [8], category: 'Casual', colors: ['Blue'], inStock: true, images: [], isDeleted: false },
      { name: 'Old Deleted Shoe', brand: 'Nike', description: '...', price: 80, sizes: [7], category: 'Sneakers', colors: ['Red'], inStock: true, images: [], isDeleted: true }
    ]);
  });

  it('should return suggestions matching the query (name)', async () => {
    const res = await request(app).get('/api/shoes/suggest?q=air');
    expect(res.status).toBe(200);
    expect(res.body.some(s => s.name === 'Nike Air Max')).toBe(true);
  });

  it('should return suggestions matching the query (brand)', async () => {
    const res = await request(app).get('/api/shoes/suggest?q=adidas');
    expect(res.status).toBe(200);
    expect(res.body.some(s => s.brand === 'Adidas')).toBe(true);
  });

  it('should not return soft-deleted shoes', async () => {
    const res = await request(app).get('/api/shoes/suggest?q=old');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('should return an empty array if no query is provided', async () => {
    const res = await request(app).get('/api/shoes/suggest');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should limit the number of suggestions', async () => {
    // Add more shoes to exceed the limit
    for (let i = 0; i < 10; i++) {
      await Shoe.create({ name: `Nike Extra ${i}`, brand: 'Nike', description: '...', price: 100, sizes: [9], category: 'Sneakers', colors: ['Black'], inStock: true, images: [], isDeleted: false });
    }
    const res = await request(app).get('/api/shoes/suggest?q=nike');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(7);
  });
});