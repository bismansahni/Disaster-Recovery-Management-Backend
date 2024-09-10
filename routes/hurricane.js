import { Router } from 'express';
import { getHurricane } from '../controllers/hurricane.js';

const router = Router();

// router.get('/tracking', (req, res) => {
//     res.send('Hurricane route');
// });

router.post('/tracking', getHurricane);

export default router;