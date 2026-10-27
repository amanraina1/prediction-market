import { verify } from "../utils/helpers.js";

export function veriyAuth(req, res, next) {
    if(!req.headers.token) {
        return res.status(400).json({message: "No token found in the headers"});
    }

    const token = req.headers.token;

    try {
        const payload = verify(token);
        req.userId = payload.userId;
        next();
    } catch (e) {
        res.status(400).json({message: "Unauthorized"})
    }
}