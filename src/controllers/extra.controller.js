import prisma from "../db.js";

async function onRampController(req, res) {
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

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                balance: Number(user.balance) += Number(amount)
            }
        });

        return res.status(500).json({success: false, message: "Balance udated successfully"});
        
    } catch(e) {

        return res.status(500).json({success: false, message: e.message});
    }
}

async function transactionController(req, res) {}

async function profileController(req, res) {}

export {
    onRampController,
    transactionController,
    profileController
}