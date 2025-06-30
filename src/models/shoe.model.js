// src/models/shoe.model.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ShoeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Stored in cents (e.g. 14999 = $149.99)
      required: true,
      min: 0,
    },
    sizes: {
  type: [Number],
  required: true,
  validate: [
    {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'At least one size must be specified.',
    },
    {
      validator: function (arr) {
        return arr.every((size) => size > 0 && size < 20);
      },
      message: 'Sizes must be greater than 0 and less than 20.',
    },
  ],
},
 category: {
      type: String,
      required: true,
      trim: true,
    },
    colors: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one color must be specified.',
      },
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

const Shoe = model('Shoe', ShoeSchema);

export default Shoe;
