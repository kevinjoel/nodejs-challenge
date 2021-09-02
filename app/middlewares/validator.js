import { validationResult } from "express-validator";

export function checkRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({
                code: "invalid_request_params"
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}