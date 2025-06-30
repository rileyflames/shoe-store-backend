// src/app.js
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

import shoeRoutes from './routes/shoe.routes.js' // Example route
// import errorHandler from './middleware/errorHandler.js'; // optional

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(compression())
app.use(morgan('dev'))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
})
app.use('/api', limiter)

// Routes
app.use('/api/shoes', shoeRoutes) // Example

// 404 handler
app.use((req, res,) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler (optional)
// app.use(errorHandler);

export default app
