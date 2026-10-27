async function getAllBets(req, res) {

    try {
        const bets = await prisma.bets.findMany({
            
        });

        return res.status(201).json({success: true, bets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function getMyBets(req, res) {

    const { userId } = req;

    try {
        const bets = await prisma.bets.findMany({
            where: {
                creator_id: userId
            }
        });

        return res.status(201).json({success: true, bets});

    } catch (e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function makeBet(req, res) {}

export {
    makeBet,
    getMyBets,
    getAllBets
}