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
