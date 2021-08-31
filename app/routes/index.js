import express from 'express';
const router = express.Router();

import UserRoutes from './user.route.js';

router.use("/users", UserRoutes)

export default router;