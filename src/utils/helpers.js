import jwt from "jsonwebtoken";

export function getSecret() {
    return process.env.JWT_SECRET || "123random";
}

export function signToken(userId) {
    return jwt.sign({userId}, getSecret());
}

export function verify(token) {
    return jwt.verify(token, getSecret());
}