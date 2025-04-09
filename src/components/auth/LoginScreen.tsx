import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { LangGraphLogoSVG } from "@/components/icons/langgraph";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      toast.success("Successfully logged in");
      navigate("/"); // Redirect to main app
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in", {
        description: "Please check your credentials and try again",
        richColors: true,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="animate-in fade-in-0 zoom-in-95 flex flex-col border bg-background shadow-lg rounded-lg max-w-md w-full">
        <div className="flex flex-col gap-2 mt-14 p-6 border-b">
          <div className="flex items-start flex-col gap-2">
            <LangGraphLogoSVG className="h-7" />
            <h1 className="text-xl font-semibold tracking-tight">
              NutriBuddy
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome to NutriBuddy! Sign in to your account to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 bg-muted/50">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="bg-background"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              className="bg-background"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
              <ArrowRight className="size-5 ml-2" />
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
