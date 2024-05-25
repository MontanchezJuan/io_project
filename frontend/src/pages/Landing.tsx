import { StepbyStep } from "../components/stepbystep/StepbyStep";

export const Landing = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p>Para solucionar el problema primero llene una lista de pasos</p>

      <StepbyStep />
    </div>
  );
};
