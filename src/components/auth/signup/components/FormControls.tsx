import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type FormControlsProps = {
  isLoading: boolean;
  isStepValid: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSkip: () => void;
  onSubmit: () => void;
};

export function FormControls({
  isLoading,
  isStepValid,
  isLastStep,
  isFirstStep,
  onPrevStep,
  onNextStep,
  onSkip,
  onSubmit
}: FormControlsProps) {
  const getButtonText = () => {
    if (isLastStep) return isLoading ? "Creating account..." : "Create account";
    return "Continue";
  };

  const getSkipButtonText = () => {
    return isLastStep ? "Skip & Finish" : "Skip";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevStep}
            className="flex-1"
            disabled={isLoading}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        )}
        
        <Button 
          type="button" 
          size="lg" 
          disabled={isLoading || !isStepValid}
          className={isFirstStep ? "w-full" : "flex-1"}
          onClick={isLastStep ? onSubmit : onNextStep}
        >
          {getButtonText()}
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="size-5 ml-2" />
          )}
        </Button>
      </div>
      
      {!isFirstStep && (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onSkip}
          className="text-muted-foreground"
          disabled={isLoading}
        >
          {getSkipButtonText()}
        </Button>
      )}
    </div>
  );
}
