import { useSignup } from '@/context/SignupContext';
import { SignupProgress } from './components/SignupProgress';
import { FormControls } from './components/FormControls';
import { AccountStep } from './steps/AccountStep';
import { LoyaltyCardsStep } from './steps/LoyaltyCardsStep';
import { ProfileStep } from './steps/ProfileStep';
import { STEPS } from './types';

export function SignupForm() {
  const { 
    currentStep,
    isStepValid, 
    isFirstStep, 
    isLastStep,
    goToPreviousStep,
    goToNextStep,
    skipCurrentStep,
    isSubmitting,
    handleSubmit
  } = useSignup();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (isSubmitting) {
        return;
      }
      
      if (isStepValid) {
        if (isLastStep) {
          handleSubmit();
        } else {
          goToNextStep();
        }
      }
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-6"
    >
      {/* Display the appropriate step based on current step index */}
      {currentStep === 0 && <AccountStep />}
      {currentStep === 1 && <LoyaltyCardsStep />}
      {currentStep === 2 && <ProfileStep />}

      <div className="flex flex-col gap-4 mt-2">
        <SignupProgress
          steps={STEPS.length}
          currentStep={currentStep}
        />

        <FormControls
          isLoading={isSubmitting}
          isStepValid={isStepValid}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevStep={goToPreviousStep}
          onNextStep={goToNextStep}
          onSkip={skipCurrentStep}
          onSubmit={handleSubmit}
        />
      </div>
    </form>
  );
}
