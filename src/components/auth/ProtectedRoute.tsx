import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/Auth";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading skeleton while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return <>{children}</>;
}
