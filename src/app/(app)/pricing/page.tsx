import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { PricingWorkbench } from "@/components/pricing/pricing-workbench";
import { Button } from "@/components/ui/button";
import {
  TODAY,
  activeProperty,
  getPricingInputs,
  pricingGuardrails,
  pricingRules,
  roomTypes,
} from "@/lib/data/queries";

export const metadata: Metadata = { title: "Dynamic Pricing" };

const tabs = ["rules", "preview", "guardrails"] as const;

export default async function PricingPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const tab = tabs.find((value) => value === searchParams.tab) ?? "rules";
  const { inputs } = getPricingInputs(30);

  return (
    <>
      <PageHeader
        title="Dynamic Pricing"
        description="Rules compound in priority order against the running rate, then per-room-type guardrails clamp the result. Nothing moves until you apply it — and once applied, it pushes to the channels like any other edit."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/help/dynamic-pricing-rules">How this works</Link>
          </Button>
        }
      />

      <PricingWorkbench
        inputs={inputs}
        initialRules={pricingRules}
        initialGuardrails={pricingGuardrails}
        roomTypes={roomTypes
          .filter((rt) => rt.propertyId === activeProperty.id)
          .map((rt) => ({ id: rt.id, title: rt.title }))}
        today={TODAY}
        initialTab={tab}
      />
    </>
  );
}
