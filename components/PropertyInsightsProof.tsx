import Image from "next/image";

export function PropertyInsightsProof() {
  return (
    <div className="property-proof">
      <Image
        src="/work/property-insights-synthetic-dashboard.png"
        alt="Property Insights synthetic request review showing aerial context, verified home facts, and quote readiness"
        fill
        sizes="(max-width: 800px) 100vw, 72vw"
      />
    </div>
  );
}
