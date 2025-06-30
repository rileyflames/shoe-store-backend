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