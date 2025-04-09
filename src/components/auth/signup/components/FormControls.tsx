import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type FormControlsProps = {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  canProceed: boolean;
  prevStep: () => void;
  nextStep: () => void;
  skipStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export function FormControls({
  currentStep,
  totalSteps,
  isLoading,
  canProceed,
  prevStep,
  nextStep,
  skipStep,
  handleSubmit
}: FormControlsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const getButtonText = () => {
    if (isFirstStep) return "Continue";
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
            onClick={prevStep}
            className="flex-1"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        )}
        
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading || !canProceed}
          className={isFirstStep ? "w-full" : "flex-1"}
          onClick={(e) => {
            e.preventDefault();
            if (isLastStep) {
              void handleSubmit(e);
            } else {
              nextStep();
            }
          }}
        >
          {getButtonText()}
          {!isLoading && <ArrowRight className="size-5 ml-2" />}
        </Button>
      </div>
      
      {!isFirstStep && (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={skipStep}
          className="text-muted-foreground"
        >
          {getSkipButtonText()}
        </Button>
      )}
    </div>
  );
}
