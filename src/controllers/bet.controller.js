import prisma from "../db.js";

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
    const { marketId, amount } = req.body;

    try {
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