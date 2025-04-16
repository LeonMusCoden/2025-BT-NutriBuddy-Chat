import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/Auth";
import { TooltipIconButton } from "@/components/thread/tooltip-icon-button";
import { UserCircle, LogOut, CheckCircle, XCircle, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileForm } from "./UserProfileForm";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AccountButton() {
  const { user, logout, getCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const refreshUserData = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      if (!userData) {
        toast.error("Error refreshing profile");
        setIsOpen(false); // Close the slideover if authentication failed
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to load profile data");
    }
  }, [getCurrentUser]);

  useEffect(() => {
    if (isOpen) {
      refreshUserData();
    }
  }, [isOpen, refreshUserData]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Helper to determine which loyalty cards are connected
  const getLoyaltyCardStatus = () => {
    const connectedCard = user?.connected_loyalty_card;

    return {
      migros: connectedCard === 'Migros' || connectedCard === 'Both',
      coop: connectedCard === 'Coop' || connectedCard === 'Both'
    };
  };

  const loyaltyStatus = getLoyaltyCardStatus();

  return (
    <>
      <TooltipIconButton
        size="lg"
        className="p-4"
        tooltip="Account"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <UserCircle className="size-5" />
      </TooltipIconButton>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 shrink-0">
              <SheetTitle>Your Account</SheetTitle>
            </SheetHeader>

            {/* Scrollable main content area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-muted">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p className="text-base font-medium">{user?.email}</p>
              </div>

              {/* Loyalty Cards Section */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-muted">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                  <Store className="mr-2 h-4 w-4" />
                  Connected Loyalty Cards
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Migros Cumulus</span>
                    {loyaltyStatus.migros ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Not Connected</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Coop Supercard</span>
                    {loyaltyStatus.coop ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Not Connected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <UserProfileForm onClose={() => setIsOpen(false)} />
            </div>

            <div className="sticky bottom-0 w-full mt-auto bg-background">
              <Separator className="mb-4" />
              <div className="p-6 pt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:border-destructive/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
