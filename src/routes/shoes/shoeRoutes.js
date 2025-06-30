// src/routes/shoes/shoe.routes.js
import express from 'express';
import { getAllShoes } from '../../controllers/shoes/getAllShoes.js';

const router = express.Router();

router.get('/', getAllShoes);
// router.get('/:id', getShoeById);
// router.post('/', createShoe);
// router.put('/:id', updateShoe);
// router.delete('/:id', deleteShoe);

export default router;
