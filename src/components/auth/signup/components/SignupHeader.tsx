import { LangGraphLogoSVG } from "@/components/icons/langgraph";
import { StepConfig } from "../types";

type SignupHeaderProps = {
  stepConfig: StepConfig;
};

export function SignupHeader({ stepConfig }: SignupHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mt-14 p-6 border-b">
      <div className="flex items-start flex-col gap-2">
        <LangGraphLogoSVG className="h-7" />
        <h1 className="text-xl font-semibold tracking-tight">
          {stepConfig.title}
        </h1>
      </div>
      <p className="text-muted-foreground">
        {stepConfig.description}
      </p>
    </div>
  );
}
