# Folder Structure 
shoe-store-backend/
|src/
|   |-config
|   |-controllers/
|                |- shoes/
|                       |- createShoe.js
|                       |- getAllShoes.js
|   |- middleware/
|                |- errorHandler.js
|   |- models/
|             |- shoe.model.js
|   |- routes/
|            |- shoes/
|                   |- shoeRoutes
|
|   |- services
|   |- utils/
|           |- catchAsync.js
|
|   |- validation
|   |- app.js
|   |- server.js
|
|tests/
|
|- .env
|- .eslintignore
|- .gitignore
|- .prettierignore
|- .prettierrc
|- eslint.config.js
|- LICENSE
|- package-lock.json
|- package.json
|- README.md



# Package.json
{
  "name": "shoe-store-backend",
  "version": "1.0.0",
  "description": "REST API backend for a shoe store application",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "test": " "
,
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rileyflames/shoe-store-backend.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/rileyflames/shoe-store-backend/issues"
  },
  "homepage": "https://github.com/rileyflames/shoe-store-backend#readme",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "compression": "^1.8.0",
    "cors": "^2.8.5",
    "cross-env": "^7.0.3",
    "dotenv": "^17.0.0",
    "express": "^5.1.0",
    "express-rate-limit": "^7.5.1",
    "express-slow-down": "^2.1.0",
    "express-status-monitor": "^1.3.4",
    "helmet": "^8.1.0",
    "hpp": "^0.2.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.1",
    "morgan": "^1.10.0",
    "nodemon": "^3.1.10",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "winston": "^3.17.0",
    "zod": "^3.25.67"
  },
  "devDependencies": {
    "@eslint/js": "^9.30.0",
    "eslint": "^9.30.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-prettier": "^5.5.1",
    "globals": "^16.2.0",
    "jest": "^30.0.3",
    "prettier": "^3.6.2",
    "supertest": "^7.1.1"
  }

}


# Shoe model 
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

# controller to create a shoe
import { z } from 'zod'
import Shoe from '../../models/shoe.model.js'
import { createShoeSchema } from '../../validation/shoe.schema.js'



const createShoe = async ( req, res )=>{
   // Validate request body

   const parsed = createShoeSchema.safeParse( req.body )

   if(!parsed.success){
    // turn Zod errors into readable message
    const issues = parsed.error.errors.map( e => e.message)
    res.status(400)
    throw new Error(issues.join(', '))
   }

   const validatedData = parsed.data

   const newShoe = await Shoe.create(validatedData)

   res.status(201).json(newShoe)
}

export default createShoe


# controller to get all shoes
import Shoe from "../../models/shoe.model.js"

const getAllShoes = async ( req, res )=>{
   
    const {
        page = 1,
        limit = 12,
        brand,
        category,
        inStock,
        minPrice,
        maxPrice,
        size,
        search,
        sortBy = 'createdAt',
        order = 'desc'
    } =req.query

    //1 Build filters
    const filters = {}

    if(brand) filters.brand = brand
    if(category) filters.category = category
    if(inStock !== undefined) filters.inStock = inStock === 'true'

    //2 Price range
    if(minPrice || maxPrice){
        filters.price = {}
        if( minPrice ) filters.price.$gte = Number(minPrice)
        if( maxPrice ) filters.price.$lte = Number(maxPrice)
    }

    // 3 Size filter
    if (size) {
        filters.sizes = { $in:[Number(size)]} // returns any shoe with that size
    }

    //4 Full-text search on name + description 
    if(search) {
        filters.$or = [
            { name: new RegExp(search, 'i')},
            { description: new RegExp(search, 'i')}
        ]
    }

    // 5 Pagination
    const skip = (Number(page) - 1) * Number(limit)

    //6 Sorting
    const sortOptions = { [sortBy]: order === 'asc' ? 1: -1 }

    //7 Query DB
    const shoes = await Shoe.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))

    const total = await Shoe.countDocuments(filters)

    res.json({
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        results: shoes,
    })
}


export default getAllShoes




# app.js
// src/app.js
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import cors from 'cors'
import morgan from 'morgan'
import statusMonitor from 'express-status-monitor'

import shoeRoutes from './routes/shoes/shoeRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Security Middleware
app.use(helmet())
app.use(hpp())
app.use(cors())

// Monitoring & Logging
app.use(statusMonitor())
app.use(morgan('dev'))

// Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/shoes', shoeRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global Error Handler
app.use(errorHandler)

export default app

# server.js
// src/server.js
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

// Load env variables
dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1) // Exit with failure
  }
}

startServer()
