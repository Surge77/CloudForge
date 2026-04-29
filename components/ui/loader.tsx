import { ForgeLoader } from "@/components/ui/forge-loader";

interface LoadingStepProps {
  currentStep: number;
  step: number;
  label: string;
}
const LoadingStep: React.FC<LoadingStepProps> = ({
  currentStep,
  step,
  label,
}) => (
  <div className="mb-3 flex items-center justify-center gap-2">
    <div
      className={`rounded-full p-1 ${
        currentStep === step
          ? "bg-primary/15"
          : currentStep > step
          ? "bg-emerald-500/15"
          : "bg-muted"
      }`}
    >
      {currentStep > step ? (
        <svg
          className="h-4 w-4 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : currentStep === step ? (
        <ForgeLoader size="sm" />
      ) : (
        <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
      )}
    </div>
    <span
      className={`text-sm ${
        currentStep === step
          ? "text-primary font-medium"
          : currentStep > step
          ? "text-emerald-500"
          : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
  </div>
);

export default LoadingStep;
