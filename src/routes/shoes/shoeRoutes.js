import express from 'express';
import getAllShoes from '../../controllers/shoes/getAllShoes.js';
import getShoeById from '../../controllers/shoes/getShoeById.js';
import updateShoe from '../../controllers/shoes/updateShoe.js';
import softDeleteShoe from '../../controllers/shoes/softDeleteShoe.js';
import deleteShoe from '../../controllers/shoes/deleteShoe.js';
import restoreShoe from '../../controllers/shoes/restoreShoe.js';
import suggestShoes from '../../controllers/shoes/suggestShoes.js';
import multer from 'multer';
import upload from '../../middleware/imageUploadHandler.js';
import { catchAsync } from '../../utils/catchAsync.js';
import createShoe from '../../controllers/shoes/createShoe.js';

const router = express.Router();

router.get('/', catchAsync(getAllShoes));

router.get('/suggest', catchAsync(suggestShoes));

router.get('/:id', catchAsync(getShoeById));

// Create a shoe with up to 10 images (multipart/form-data)
router.post(
  '/',
  (req, res, next) => {
    if (req.is('multipart/form-data')) {
      upload.array('images', 10)(req, res, function (err) {
        if (err) return next(err);
        // Attach image URLs to req.body for the controller
        if (Array.isArray(req.files) && req.files.length > 0) {
          req.body.images = req.files.map(file => file.path);
        }
        return createShoe(req, res, next);
      });
    } else {
      return createShoe(req, res, next);
    }
  }
);

router.put('/:id', catchAsync(updateShoe));
router.patch('/:id/soft-delete', catchAsync(softDeleteShoe));
router.delete('/:id', catchAsync(deleteShoe));
router.patch('/:id/restore', catchAsync(restoreShoe));

export default router;
