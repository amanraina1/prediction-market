import prisma from "../db.js";
import { createBetSchema } from "../validations/schemas/betSchema.js";
import { validate } from "../validations/validator.js";

async function getBets(req, res) {

    const { userId } = req;

    try {
        const bets = await prisma.bet.findMany({
            where: {
                user_id: userId
            }
        });

        return res.status(201).json({success: true, bets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function makeBet(req, res) {

    const { userId } = req;

    const result = validate(createBetSchema, req.body);
    
    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }
    
    const { marketId, amount } = result.data;

    try {

        const market = await prisma.market.findFirst({
            where: {
                id: marketId
            }
        });

        if(!market) {
            return res.status(400).json({success: false, message: "No market exists with this id"});
        }

        // TODO :: if the amount in this req is greater than the initalWager, we need to handle the situation

        const bet = await prisma.bet.create({
            data: {
                user_id: userId,
                market_id: marketId,
                bet_amount: amount
            }
        })

        return res.status(201).json({success: true, betId: bet.id});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

export {
    makeBet,
    getBets
}