import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { on } from "events";

export default function WarningDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose} modal>
            <DialogContent className="sm:max-w-[500px]">
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    Welcome to Jobu! 🌐
                </DialogTitle>
                <DialogDescription className="py-4 space-y-4">
                    <p>
                    For the best experience, please note:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                    <li>
                        Open jobu-jat.netlify.app directly in your browser (Chrome, Safari, Firefox, etc.)
                    </li>
                    <li>
                        Avoid using in-app browsers from: LinkedIn, Telegram, etc...
                    </li>
                    <li>
                        This ensures proper functionality with Google sign-in
                    </li>
                    </ul>
                </DialogDescription>
                <DialogFooter>
                    <Button
                    onClick={onClose}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                    Got it, Thanks!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}