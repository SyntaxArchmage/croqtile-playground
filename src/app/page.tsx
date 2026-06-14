import { Playground } from "@/components/Playground";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <Playground />
    </ErrorBoundary>
  );
}
