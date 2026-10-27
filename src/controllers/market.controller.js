import prisma from "../db.js";
import { marketSchema } from "../validations/schemas/marketSchema.js";
import { validate } from "../validations/validator.js";

async function createMarket(req, res) {
    const result = validate(marketSchema, req.body);
    
    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }

    const { title, initialWager, bet } = result.data;
    const { userId } = req;

    try {
        const finalResult = await prisma.market.create({
            data: {
                title,
                initialWager,
                creator_id: userId,
                bet
            }
        });

        return res.status(201).json({success: true, message: "Market created successfully", marketId: finalResult.id});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function getMarkets(req, res) {

    try {
        const markets = await prisma.market.findMany();

        return res.status(201).json({success: true, markets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

export {
    createMarket,
    getMarkets
}