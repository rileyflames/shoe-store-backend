import mongoose from "mongoose";
import Shoe from "../../models/shoe.model.js";

const softDeleteShoe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid shoe ID");
  }

  const shoe = await Shoe.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true, deletedAt: new Date(), restoredAt: null } },
    { new: true }
  );

  if (!shoe) {
    res.status(404);
    throw new Error("Shoe not found");
  }

  res.status(200).json({
    success: true,
    message: 'Shoe soft deleted successfully',
    data: shoe
  });
};

export default softDeleteShoe;