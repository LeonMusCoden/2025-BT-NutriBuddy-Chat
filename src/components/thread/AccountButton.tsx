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
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { UserProfileForm } from "./UserProfileForm";

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
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4">
            <SheetTitle>Your Account</SheetTitle>
          </SheetHeader>
          
          <div className="py-2">
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-muted">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p className="text-base font-medium">{user?.email}</p>
            </div>
            
            <UserProfileForm onClose={() => setIsOpen(false)} />
          </div>
          
          <div className="pt-6 border-t mt-8 text-center">
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
        </SheetContent>
      </Sheet>
    </>
  );
}
