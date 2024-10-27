"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState(""); 
    const [amount, setAmount] = useState("");  
    const [error, setError] = useState("");   
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendMoney = async () => {
        setError(""); 
        setSuccess("");
        setLoading(true);

        try {
            const response = await p2pTransfer(number, Number(amount) * 100); 
            if (response.status !== 200) {
                setError(response.message);
            } else {
                setSuccess(response.message);
            }
        } catch (error) {
            setError("Unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[90vh]">
            <Center>
                <Card title="Send">
                    <div className="min-w-72 pt-2">
                        <TextInput
                            placeholder={"Number"}
                            label="Number"
                            onChange={(value) => setNumber(value)}
                        />
                        <TextInput
                            placeholder={"Amount"}
                            label="Amount"
                            onChange={(value) => setAmount(value)}
                        />
                        <div className="pt-4 flex justify-center">
                            <Button onClick={handleSendMoney} disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </div>

                        {/* Display message */}
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                    </div>
                </Card>
            </Center>
        </div>
    );
}
