import prisma from "../db.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/helpers.js";
import { validate } from "../validations/validator.js";
import { authSchema } from "../validations/schemas/authSchema.js";

async function signin(req, res) {
    const result = validate(authSchema, req.body);

    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }

    const { username, password } = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(!user) {
            return res.status(400).json({message: "No user found"});
        }

        const finalResult = await bcrypt.compare(password, user.password);

        if(!finalResult) {
            return res.status(400).json({message: "Password doesn't match"});
        }

        return res.status(200).json({message: "Sign in successful", token: signToken(user.id)});
    } catch (e) {
        return res.status(500).json({message: "Something went wrong", error: e.message});
    }
}

async function signup(req, res) {
    const result = validate(authSchema, req.body);

    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }

    const { username, password } = result.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if(user) {
            return res.status(400).json({message: "This user already exists. Please sign in"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const finalResult = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            },
            omit: {
                password
            }
        });

        return res.status(201).json({success: true, message: "User created successfully", user: finalResult});
    } catch (e) {
        return res.status(500).json({message: "Something went wrong", error: e.message});
    }
}

export {
    signin,
    signup
}



// Read about liteLLM attack
// What are all different places where we can put "Caching" as an application