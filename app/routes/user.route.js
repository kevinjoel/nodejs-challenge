import express from 'express';
import { body, check, param } from 'express-validator';

import {
    UserController
} from '../controllers/index.js';

import * as validator from '../middlewares/validator.js';

const router = express.Router();


// body("email", "El ID del usuario es requerido.").notEmpty(),
// body("first_name", "El ID del usuario es requerido.").notEmpty(),
// body("last_name", "El ID del usuario es requerido.").notEmpty(),
// body("company", "El ID del usuario es requerido.").notEmpty(),
// body("url", "El ID del usuario es requerido.").notEmpty(),
// body("text", "El ID del usuario es requerido.").notEmpty()

router
    .route("/:id")
    .put(
        [
            param("id")
                .notEmpty().withMessage("El ID del usuario es requerido.")
                .isNumeric().withMessage("El ID del usuario debe ser un número.")
        ],
        validator.checkRequest,
        UserController.create
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