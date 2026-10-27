import prisma from "../db.js";
import { resolveSchema } from "../validations/schemas/resolveSchema.js";
import { validate } from "../validations/validator.js";

async function resolve(req, res) {

    /* what needs to be done for resolving a market
        How to resolve a market?
        1.⁠ get the market_id from the payload and check if this market exists or not
        2.⁠ ⁠Now check who won: creator or others
        3. resolve the market
        4.⁠ ⁠If creator won do this:
        5.⁠ ⁠First calculate the bet amount, then multiply it by 2 and add it to the users balance and deduct the bet amount from the users
        6.⁠ ⁠But if creator loses, deduct the total bet amount from users balance and add double the users balance
    */
    const validationResult = validate(resolveSchema, req.body);

    if(!validationResult.success) {
        return res.status(400).json({success: false, errors: validationResult.errors});
    }

    const { marketId, result } = validationResult.data;

    // check if market exists or not
    const market = await prisma.market.findFirst({
        where: {
            id: marketId,
            resolution: "pending"
        }
    })

    if(!market) {
        return res.status(400).json({success: false, message: "Market doesn't exist"});
    }

    const betAmount = await prisma.bet.aggregate({
        where: {
            market_id: market.id
        },
        _sum: {
            bet_amount: true
        }
    });

    betAmount = betAmount._sum.bet_amount ?? 0;

    // now check who won
    if(market.bet === result) {
        // creator won
        const totalWon = 2 * betAmount;

        await prisma.user.update({
            where: {
                id: market.creator_id
            },
            data: {
                balance: {
                    increment: totalWon
                }
            }
        });
    } else {
        // creator lost
        const bets = await prisma.bet.findMany({
            where: {
                market_id: market.id
            }
        });

        for(let bet of bets) {
            const payout = bet.bet_amount * 2;

            await prisma.user.update({
                where: {
                    id: bet.user_id
                },
                data: {
                    balance: {
                        increment: payout
                    }
                }
            });
        }
    }

    // resolve the market first and distribute the payment
    await prisma.market.update({
        where: {
            id: marketId
        },
        data: {
            resolution: "resolved"
        }
    });
};

export {
    resolve
}