import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

// Route to verify server is working
app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

// This route will hit by hdfc to tell if transaction was successfull
app.post("/hdfcWebhook", async (req, res) => {
    // TODO: Add zod validation here?
    // TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    // TODO: Only if it is processing we should proceed
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string;
        paymentStatus: string;
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
        paymentStatus: req.body.paymentStatus
    };

    try {
        if (paymentInformation.paymentStatus == 'success') {
            await db.$transaction([
                db.balance.updateMany({
                    where: {
                        userId: Number(paymentInformation.userId)
                    },
                    data: {
                        amount: {
                            increment: Number(paymentInformation.amount)
                        }
                    }
                }),
                db.onRampTransaction.updateMany({
                    where: {
                        token: paymentInformation.token
                    },
                    data: {
                        status: "Success",
                    }
                })
            ]);
        } else {
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Failure",
                }
            })
        }

        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})



app.listen(3003);