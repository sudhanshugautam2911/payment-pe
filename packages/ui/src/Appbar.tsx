import { Button } from "./button";

interface AppbarProps {
    user?: {
        email?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    const upiNumber = user?.email?.split(" ").join("");
    return <div className="flex justify-between items-center border-b px-4 border-slate-300">
        <div className="text-lg flex flex-col justify-center">
            Payment Pe
        </div>
        <div>
            UPI: {upiNumber}
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
        </div>
    </div>
}