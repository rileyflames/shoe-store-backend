import mongoose from 'mongoose';
import Shoe from '../../models/shoe.model.js';

const deleteShoe = async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid shoe ID');
  }

  // Permanently delete the shoe
  const shoe = await Shoe.findByIdAndDelete(id);

  if (!shoe) {
    res.status(404);
    throw new Error('Shoe not found');
  }

  res.status(200).json({
    success: true,
    message: 'Shoe permanently deleted',
  });
};

export default deleteShoe;