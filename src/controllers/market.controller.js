import prisma from "../db.js";
import { createMarketSchema } from "../validations/schemas/marketSchema.js";
import { validate } from "../validations/validator.js";

async function createMarket(req, res) {
    const result = validate(createMarketSchema, req.body);
    
    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }

    const { title, initialWager, bet } = result.data;
    const { userId } = req;

    try {
        
        // when the market is created, add the initial wager as a transaction in the wallet
        const [finalResult] = await prisma.$transaction([
            prisma.market.create({
                data: {
                    title,
                    initialWager,
                    creator_id: userId,
                    bet
                }
            }),

            prisma.walletEvent.create({
                data: {
                    user_id: userId,
                    transaction_type: "create_market",
                    transaction_amount: initialWager
                }
            })
        ])

        return res.status(201).json({success: true, message: "Market created successfully", marketId: finalResult.id});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function getAllMarkets(req, res) {

    try {
        const markets = await prisma.market.findMany();

        return res.status(201).json({success: true, markets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function getMyMarkets(req, res) {

    const { userId } = req;

    try {
        const markets = await prisma.market.findMany({
            where: {
                creator_id: userId
            }
        });

        return res.status(201).json({success: true, markets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

export {
    createMarket,
    getAllMarkets,
    getMyMarkets
}