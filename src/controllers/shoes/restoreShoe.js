import mongoose from "mongoose";
import Shoe from "../../models/shoe.model.js";
import { success } from "zod/v4";

const restoreShoe = async ( req, res ) => {
    // get id
    const { id } = req.params

    // Validate MongoDB ObjectId
    if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400)
        throw new Error("Invalid shoe ID");
        
    }
    // Restore the shoe (set isDeleted to false)
    const shoe = await Shoe.findByIdAndUpdate(
        id,
        { $set: {isDeleted: false} },
        { new: true }
    )

    if (!shoe) {
        res.status(404)
        throw new Error("Shoe not found");
    }

    res.status(200).json({
        success: true,
        message: "Shoe restored successfully",
        data: shoe
    })
}

export default restoreShoe 