import mongoose from "mongoose"
import Shoe from "../../models/shoe.model.js"
import { createShoeSchema } from '../../validation/shoe.schema.js'

const updateShoe = async ( req, res )=>{
    // get shoe by id 
    const { id } = req.params

    // Validate MongoDB ObjectID
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400)
        throw new Error('Invalid shoe ID')
    }

    // Validate request body with Zod (Allow partial update)
    const partialSchema = createShoeSchema.partial()
    const parsed = partialSchema.safeParse(req.body)

    if (!parsed.success){
        const issues = parsed.error.errors.map((e) => e.message)
        res.status(400) // <-- Add this line
        throw new Error(issues.join(', '))
    }

    try {
        // Find and update the shoe
        const updatedShoe = await Shoe.findByIdAndUpdate(
            id,
            {$set: parsed.data},
            {new: true, runValidators: true}
        )

        if(!updatedShoe){
            res.status(404)
            throw new Error ('Shoe not found')
        }

        res.status(200).json(updatedShoe)
    } catch (err) {
        // Handle duplicate key error (E11000)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
            res.status(400); // <-- Add this line
            throw new Error('Shoe name already exists');
        }
        throw err;
    }

    // parse the request body
    // check if the information is the correct type using zod
    // if valid update the fields in question else throw an error 
    // then later on implement authentication and authorization 
}

export default updateShoe