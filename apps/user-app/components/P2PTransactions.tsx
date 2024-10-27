import prisma from "@repo/db/client"
import { Card } from "@repo/ui/card"
import { useState } from "react"

export const P2PTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        fromUserId: number,
        toUserId: number,
        toUserNumber: string,
        transactionType: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    return <Card title="P2P Transactions">
        <div className="pt-2 divider-line">
            {transactions.map(t => <div className="py-3 flex justify-between">
                <div className="flex-1"> {/* Allow left item to grow */}
                    <div className="text-sm">
                        {t.transactionType}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.transactionType === "Sent" ? "to" : "from"}: {t.toUserNumber}
                    </div>
                </div>
                <div className="text-slate-600 text-xs">
                    {t.time.toDateString()}
                </div>
                <div className="flex-1">
                    <div className="flex flex-col items-end justify-center">
                        {t.transactionType == "Sent" ? "-" : "+"} Rs {t.amount / 100}
                    </div>
                </div>
            </div>)}
        </div>
    </Card>
}