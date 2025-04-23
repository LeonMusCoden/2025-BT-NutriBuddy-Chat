import { useState, useEffect } from "react";
import { useAuth } from "@/providers/Auth";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if this is a newly registered user
    const isNewSignup = sessionStorage.getItem("newUserSignup") === "true";

    if (isNewSignup && user) {
      setIsOpen(true);
      // Clear the flag after showing the popup
      sessionStorage.removeItem("newUserSignup");
    }
  }, [user]);

  if (!isOpen) return null;

  const hasConnectedLoyaltyCard = user?.connected_loyalty_card &&
    user.connected_loyalty_card !== "null";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Welcome to NutriBuddy!</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Your personal nutrition assistant is ready to help
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You can ask me questions about nutrition, get personalized recommendations,
            and explore healthier food choices based on your preferences.
          </p>

          {hasConnectedLoyaltyCard && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> We're importing your shopping data from your connected
                loyalty card(s). This may take a few minutes before it's available for
                personalized recommendations. You can start chatting right away!
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="font-medium">Quick tips:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Type your nutrition questions in the chat box below</li>
              <li>Ask about foods, recipes, or dietary recommendations</li>
              <li>Get personalized meal plans based on your preferences</li>
              <li>Access your account settings from the icon in the top-right</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#2F6868] hover:bg-[#2F6868]/90" onClick={() => setIsOpen(false)}>
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
