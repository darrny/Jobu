import { Button } from "@/components/ui/button";
import { FaGoogle } from 'react-icons/fa';

export default function SignInButton({ isSigningIn, onClick } : { isSigningIn: boolean, onClick: () => void }) {
    return (
        <Button
            size="lg"
            onClick={onClick}
            disabled={isSigningIn}
            className="bg-orange-600 hover:bg-orange-700"
        >
            {isSigningIn ? (
                <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                <FaGoogle className="h-4 w-4" />
                <span>Sign in with Google</span>
                </div>
            )}
        </Button>
    )
}