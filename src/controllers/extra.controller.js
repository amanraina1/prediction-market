import prisma from "../db.js";

async function handleOnRamp(req, res) {
    const { userId } = req;

    const { amount } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user) {
            return res.status(400).json({message: "No user found with this id"})
        }

        const balance = user.balance + amount;

        // update the balance and add the entry in the transactions table
        await prisma.$transaction([

            prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    balance
                }
            }),

            prisma.walletEvent.create({
                data: {
                    user_id: userId,
                    transaction_type: "onramp",
                    transaction_amount: amount
                }
            })
        ]);

        return res.status(200).json({success: false, message: "Balance updated successfully"});

    } catch(e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function handleTransactions(req, res) {

    const { userId } = req;

    try {
        const transactions = await prisma.walletEvent.findMany({
            where: {
                user_id: userId
            }
        });

        return res.status(200).json({success: true, transactions});

    } catch(e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function handleProfile(req, res) {

    const { userId } = req;

    try {

        const [user, transactions] = await prisma.$transaction([

            prisma.user.findFirst({
                where: {
                    id: userId
                },
                omit: {
                    password: true
                }
            }),

            prisma.walletEvent.findMany({
                where: {
                    user_id: userId
                }
            })
        ]);

        return res.status(200).json({success: true, data: {user, transactions}});

    } catch(e) {
        
        return res.status(500).json({success: false, message: e.message});
    }
}

export {
    handleOnRamp,
    handleTransactions,
    handleProfile
}