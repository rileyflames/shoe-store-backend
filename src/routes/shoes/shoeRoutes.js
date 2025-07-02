import express from 'express';
import getAllShoes from '../../controllers/shoes/getAllShoes.js';
import getShoeById from '../../controllers/shoes/getShoeById.js';
import createShoe from '../../controllers/shoes/createShoe.js';
import updateShoe from '../../controllers/shoes/updateShoe.js';
import softDeleteShoe from '../../controllers/shoes/softDeleteShoe.js';
import deleteShoe from '../../controllers/shoes/deleteShoe.js'
import restoreShoe from '../../controllers/shoes/restoreShoe.js';

import { catchAsync } from '../../utils/catchAsync.js'

const router = express.Router();

router.get('/',catchAsync(getAllShoes));

router.get('/:id',catchAsync(getShoeById));

router.post('/', catchAsync(createShoe));

router.put('/:id',catchAsync(updateShoe));

router.patch('/:id/soft-delete', catchAsync(softDeleteShoe));

router.delete('/:id', catchAsync(deleteShoe));

router.patch('/:id/restore', catchAsync(restoreShoe));

export default router;
