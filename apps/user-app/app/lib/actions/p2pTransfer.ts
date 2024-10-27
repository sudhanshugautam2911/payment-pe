"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from '@repo/db/client'

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
        return {
            status: 401,
            message: "Error while sending"
        }
    }

    const toUser = await db.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            status: 404,
            message: "User not found"
        }
    }
    try {
        await db.$transaction(async (tx) => {
            // TODO: multiple req at the same time can cause inconsistency - Use row locking in db 
            const fromBalance = await db.balance.findUnique({
                where: {
                    userId: Number(from)
                }
            });
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            await tx.balance.update({
                where: {
                    userId: Number(from)
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            })

            await tx.balance.update({
                where: {
                    userId: toUser.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            })

            await tx.p2pTransfer.create({
                data: {
                    amount,
                    timeStamp: new Date(),
                    fromUserId: Number(from),
                    toUserId: toUser.id
                }
            })

        })
        console.log("sucess")
        return { status: 200, message: "Transfer successful!" };
    } catch (error:any) {
        return {
            status: 500, // Internal Server Error
            message: error.message || "Error during transfer"
        };
    }

}
