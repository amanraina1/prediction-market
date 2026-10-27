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

    // validation
    const result = validate(createBetSchema, req.body);
    
    if(!result.success) {
        return res.status(400).json({success: false, errors: result.errors});
    }
    
    const { marketId, amount } = result.data;

    try {
        // before making a bet to this market, first check if this market exists or not
        const market = await prisma.market.findFirst({
            where: {
                id: marketId
            }
        });

        // if doesn't exist, then early return
        if(!market) {
            return res.status(400).json({success: false, message: "No market exists with this id"});
        }

        // now before making any new bet, first check, that the already added amount + this amount should not exceed the initialWager

        //already added amount
        const totalBets = await prisma.bet.aggregate({
            where: {
                market_id: market.id
            },
            _sum: {
                bet_amount: true
            }
        });

        const totalAmount = totalBets + amount;

        if(totalAmount > market.initialWager) {
            return res.status(400).json({message: "Cannot place bet, the amount exceeds the total bet amount"});
        }

        const [bet] = prisma.$transaction([
            prisma.bet.create({
                data: {
                    user_id: userId,
                    market_id: marketId,
                    bet_amount: amount
                }
            }),

            prisma.walletEvent.create({
                data: {
                    user_id: userId,
                    transaction_type: "added_bet",
                    transaction_amount: amount
                }
            })
        ]);

        return res.status(201).json({success: true, betId: bet.id});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

export {
    makeBet,
    getBets
}