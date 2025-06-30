
import express from 'express';
import getAllShoes from '../../controllers/shoes/getAllShoes.js';
import getShoeById from '../../controllers/shoes/getShoeById.js';
import createShoe from '../../controllers/shoes/createShoe.js';
import updateShoe from '../../controllers/shoes/updateShoe.js';
import deleteShoe from '../../controllers/shoes/deleteShoe.js';

const router = express.Router();

router.get('/', getAllShoes);
router.get('/:id', getShoeById);
router.post('/', createShoe);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoe);

export default router;
