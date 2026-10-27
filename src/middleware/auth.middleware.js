import { verify } from "../utils/helpers.js";

function veriyAuth(req, res, next) {
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

function verifyAdmin(req, res, next) {
    // if(!req.headers.adminToken) {
    //     return res.status(400).json({message: "This is an admin route"});
    // }
    // TODO :: add logic in this middleware

    next();
}

export {
    veriyAuth,
    verifyAdmin
}