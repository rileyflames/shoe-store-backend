import express from 'express';
import getAllShoes from '../../controllers/shoes/getAllShoes.js';
import getShoeById from '../../controllers/shoes/getShoeById.js';
import updateShoe from '../../controllers/shoes/updateShoe.js';
import softDeleteShoe from '../../controllers/shoes/softDeleteShoe.js';
import deleteShoe from '../../controllers/shoes/deleteShoe.js';
import restoreShoe from '../../controllers/shoes/restoreShoe.js';
import suggestShoes from '../../controllers/shoes/suggestShoes.js';
import upload from '../../middleware/imageUploadHandler.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = express.Router();

router.get('/', catchAsync(getAllShoes));

router.get('/suggest', catchAsync(suggestShoes));

router.get('/:id', catchAsync(getShoeById));

// Create a shoe with up to 10 images (multipart/form-data)
router.post(
  '/',
  upload.array('images', 10),
  catchAsync(async (req, res) => {
    // Get Cloudinary URLs from uploaded files
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    // Parse fields that may be sent as JSON strings
    const shoeData = {
      ...req.body,
      price: Number(req.body.price),
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
      colors: req.body.colors ? JSON.parse(req.body.colors) : [],
      images: imageUrls,
    };

    const shoe = await Shoe.create(shoeData);
    res.status(201).json({ success: true, data: shoe });
  })
);

router.put('/:id', catchAsync(updateShoe));
router.patch('/:id/soft-delete', catchAsync(softDeleteShoe));
router.delete('/:id', catchAsync(deleteShoe));
router.patch('/:id/restore', catchAsync(restoreShoe));

export default router;
