
import express from 'express';
import getAllShoes from '../../controllers/shoes/getAllShoes.js';
import getShoeById from '../../controllers/shoes/getShoeById.js';
import createShoe from '../../controllers/shoes/createShoe.js';
import updateShoe from '../../controllers/shoes/updateShoe.js';
import deleteShoe from '../../controllers/shoes/deleteShoe.js';

import { catchAsync } from '../../utils/catchAsync.js'

const router = express.Router();

router.get('/',catchAsync(getAllShoes));

router.get('/:id', getShoeById);

router.post('/', catchAsync(createShoe));

router.put('/:id', updateShoe);

router.delete('/:id', deleteShoe);

export default router;
