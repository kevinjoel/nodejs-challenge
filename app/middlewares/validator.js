import { validationResult } from "express-validator";

export function checkRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                ok: false,
                code: -2,
                errors: errors.array(),
                code: "invalid_request_params"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            code: -1,
            message: "Internal Server Error"
        })
    }
}