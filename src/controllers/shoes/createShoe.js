// src/controllers/shoes/createShoe.js
import { z } from 'zod';
import { createShoeSchema } from '../../validation/shoe.schema.js';
import Shoe from '../../models/shoe.model.js';
import { catchAsync } from '../../utils/catchAsync.js';

const createShoe = catchAsync(async (req, res) => {
  // Validate request body
  const parsed = createShoeSchema.safeParse(req.body);
  if (!parsed.success) {
    const issues = parsed.error.errors.map((e) => e.message);
    res.statusCode = 400; // Set status for errorHandler
    throw new Error(issues.join(', '));
  }

  const validatedData = parsed.data;

  try {
    const newShoe = await Shoe.create(validatedData);
    res.status(201).json(newShoe);
  } catch (err) {
    if (err.code === 11000) {
      res.statusCode = 400; // Set status for errorHandler
      throw new Error('Shoe name already exists');
    }
    throw err;
  }
});

export default createShoe;