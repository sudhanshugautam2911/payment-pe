"use server";
import axios from 'axios';
import jwt from 'jsonwebtoken';


export async function cancelPayment(token: any) {
    // Imagine Logic here: Reduce users balance from hdfc bank and tell to update balance on payment-pe website

    if (!token) {
        return {
            status: 400,
            message: 'Token is required',
        };
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string; amount: number };
        const payload = {
            token: token,
            user_identifier: decodedData.userId,
            amount: decodedData.amount,
            status: 'failure'
        }
        // console.log(payload);
        
        await axios.post(process.env.BANK_WEBHOOK || '', payload)
        
        return {
            status: 200,
            message: 'Success',
        };
    } catch (error) {
        console.log("Token verification error:", error);

        return {
            status: 401,
            message: "Invalid or expired token",
        };
    }
}
