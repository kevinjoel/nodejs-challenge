import express from 'express';
import { param } from 'express-validator';

import {
    UserController
} from '../controllers/index.js';

import * as validator from '../middlewares/validator.js';

const router = express.Router();

router
    .route("/:id")
    .put(
        [
            param("id")
                .notEmpty().withMessage("El ID del usuario es requerido.")
                .isNumeric().withMessage("El ID del usuario debe ser un número.")
        ],
        validator.checkRequest,
        UserController.update
    )


router
    .route("/:ids")
    .get(
        [
            param("ids").notEmpty().withMessage("El ID del usuario/s es requerido.")
        ],
        validator.checkRequest,
        UserController.findUsers
    )

export default router;