import { AnalysisHistory } from "@/components/home/analysis-history";

export default function HomePage() {
  // AnalysisHistory component handles its own data fetching with user session
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <AnalysisHistory />
    </main>
  );
}
