
import mongoose from "mongoose"
import Shoe from "../../models/shoe.model.js"
import { success } from "zod/v4"


const softDeleteShoe = async ( req, res )=>{
   // get the id first

   const { id } = req.params
    // check if shoe ID is correct
   if(!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error("Invalid shoe ID");
    
   }
   const shoe = await Shoe.findByIdAndUpdate(
    id,
    { $set: { isDeleted : true } },
    { new: true }
   )

   if(!shoe){
    res.status(404)
    throw new Error("Shoe not found");
    
   }

   res.status(200).json({
    success: true,
    message: 'Shoe soft deleted successfully',
    data: shoe
   })
}

export default softDeleteShoe