// src/app.js
import express from 'express'


import shoeRoutes from './routes/shoes/shoeRoutes.js' // shoe route
// import userRoutes from './routes/users/userRoutes.js'
// import errorHandler from './middleware/errorHandler.js'; // optional

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




// shoe Routes
app.use('/api/shoes', shoeRoutes) // shoe route

// user Routes
// app.use('/api/store', userRoutes) // user route

// 404 handler
app.use((req, res,) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler (optional)
// app.use(errorHandler);

export default app
