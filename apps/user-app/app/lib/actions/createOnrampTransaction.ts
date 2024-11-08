"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from '@repo/db/client'
import jwt from 'jsonwebtoken'

export async function createOnRampTransaction(provider: string, amount: number) {

    // for now just imagine we sent req to hdfc that client want to add 200 amount, and hdfc send back a token and ask to redirect user to our website along with token
    const session = await getServerSession(authOptions);

    if(!session?.user && !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }

    // this token will be sent from hdfc - for now just hardcoding it
    const payload = {
        userId: session.user.id,
        amount: amount*100
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || "");

    await db.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            amount: amount*100,
            token,
            startTime: new Date(),
            userId: Number(session?.user?.id),
        }
    });
    
    return {
        message: "Done",
        token: token
    }
}

