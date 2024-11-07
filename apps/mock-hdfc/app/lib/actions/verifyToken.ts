"use server";
import jwt from 'jsonwebtoken';


export async function verifyToken(token: any) {

    if (!token) {
        return {
            status: 400,
            message: 'Token is required',
        };
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string; amount: number };

        return {
            status: 200,
            data: decodedData,
        };
    } catch (error) {
        console.log("Token verification error:", error);

        return {
            status: 401,
            message: "Invalid or expired token",
        };
    }
}
