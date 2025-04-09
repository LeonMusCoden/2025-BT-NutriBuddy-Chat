type SignupProgressProps = {
  steps: number;
  currentStep: number;
};

export function SignupProgress({ steps, currentStep }: SignupProgressProps) {
  return (
    <div className="flex justify-center gap-2 mb-2">
      {Array.from({ length: steps }).map((_, index) => (
        <div 
          key={index}
          className={`h-2 rounded-full transition-all ${
            index === currentStep ? 'w-8 bg-[#2F6868]' : 'w-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
