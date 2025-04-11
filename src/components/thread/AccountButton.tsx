import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/Auth";
import { TooltipIconButton } from "@/components/thread/tooltip-icon-button";
import { UserCircle, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileForm } from "./UserProfileForm";
import { Separator } from "@/components/ui/separator";

export function AccountButton() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

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
