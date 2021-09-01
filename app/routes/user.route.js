import express from 'express';
import { param } from 'express-validator';

import {
    UserController
} from '../controllers/index.js';

import * as validator from '../middlewares/validator.js';

const router = express.Router();
const userController = new UserController();

router
    .route("/:id")
    .put(
        [
            param("id")
                .notEmpty().withMessage("El ID del usuario es requerido.")
                .isNumeric().withMessage("El ID del usuario debe ser un número.")
        ],
        validator.checkRequest,
        userController.updateUser
    )

router
    .route("/:ids")
    .get(
        [
            param("ids").notEmpty().withMessage("El ID del usuario/s es requerido.")
        ],
        validator.checkRequest,
        userController.findUser
    )

router
    .route("/:id")
    .delete(
        [
            param("id").notEmpty().withMessage("El ID del usuario es requerido.")
        ],
        validator.checkRequest,
        userController.deleteUser
    )

export default router;