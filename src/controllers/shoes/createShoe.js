import { z } from 'zod'
import { createShoeSchema } from '../../validation/shoe.schema.js';
import Shoe from '../../models/shoe.model.js';



const createShoe = async ( req, res )=>{
   // Validate request body

   const parsed = createShoeSchema.safeParse( req.body )

   if(!parsed.success){
    // turn Zod errors into readable message
    const issues = parsed.error.errors.map( e => e.message);
    return res.status(400).json({ message: issues.join(', ') });
   }

   const validatedData = parsed.data

   const newShoe = await Shoe.create(validatedData)

   res.status(201).json(newShoe)
}

export default createShoe