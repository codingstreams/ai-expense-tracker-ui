interface StepperProps {
  step: number;
  totalSteps: number;
}

export const Stepper = ({ step, totalSteps }: StepperProps) => (
  <div className="w-full max-w-md mb-12 flex items-center justify-between relative">
    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
    <div
      className="absolute top-1/2 left-0 h-0.5 bg-purple-600 -translate-y-1/2 transition-all duration-500 z-0"
      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
    />
    {[1, 2, 3].map((i) => (
      <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 ${step >= i ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
        }`}>
        {i}
      </div>
    ))}
  </div>
);