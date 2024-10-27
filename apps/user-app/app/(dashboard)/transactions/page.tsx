import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";

async function p2pTransferDetails() {
    const session = await getServerSession(authOptions);

    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                {
                  fromUserId: Number(session?.user?.id),
                },
                { toUserId: Number(session?.user?.id) },
              ],
        },
        select: {
            timeStamp: true,
            amount: true,
            fromUserId: true,
            toUserId: true,
            toUser: {
                select: {
                    number: true,
                },
            },
        },

    });
    console.log(txns);
    return txns.map((t) => ({
        time: t.timeStamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId: t.toUserId,
        toUserNumber: t.toUser.number,
        transactionType: t.fromUserId == session?.user?.id ? 'Sent' : 'Received',
    }));
}

export default async function () {
    const transactions = await p2pTransferDetails();
    return (
        <div className="w-full ">
            <h3 className="p-4">Transactions</h3>
            <div className="flex items-center mx-32">
                <P2PTransactions transactions={transactions}></P2PTransactions>
            </div>
        </div>

    );
}