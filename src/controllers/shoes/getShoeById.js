
// src/controllers/shoes/getShoeById.js
import mongoose from 'mongoose'
import Shoe from '../../models/shoe.model.js'


const getShoeById = async (req, res) => {
  const { id } = req.params

  
  // ✅ Check if it's a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400)
      throw new Error ('Invalid shoe ID')
    }
    
    const shoe = await Shoe.findById(id)
  if (!shoe){
    res.status(404)
    throw new Error('Shoe not found')
  }

  res.status(200).json(shoe)
}

export default getShoeById
