import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock, ListChecks, Plug, Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { helpArticles, helpCategoryLabels } from "@/lib/help/articles";
import { onboardingHref, onboardingProgress, onboardingSteps } from "@/lib/help/onboarding";
import { cn } from "@/lib/utils";
import { otaCatalog } from "@/lib/ota/catalog";
import { channelConnections, properties, ratePlans, roomTypes, rooms, users } from "@/lib/data/queries";
import type { HelpCategory } from "@/lib/types";

export const metadata: Metadata = { title: "Help & Tutorials" };

const order: HelpCategory[] = [
  "getting_started",
  "rates",
  "reservations",
  "channels",
  "pricing",
  "users",
  "billing",
];

export default async function HelpPage() {
  const snapshot = {
    properties: properties.length,
    roomTypes: roomTypes.length,
    rooms: rooms.length,
    ratePlans: ratePlans.length,
    ratedDates: roomTypes.length > 0 && ratePlans.length > 0 ? 1 : 0,
    channels: channelConnections.length,
    reservations: 0,
    users: users.length,
  };
  const { done, total } = onboardingProgress(snapshot);

  return (
    <>
      <PageHeader
        title="Help & Tutorials"
        description="Short guides for the parts of a PMS that are easy to get subtly wrong. Everything here is indexed by search, so a typed question finds the answer rather than only the page."
      />

      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-4" />
            Setup progress
          </CardTitle>
          <CardDescription className="text-pretty">
            Each step ticks itself once the workspace contains the thing it describes. The
            same list is behind the Setup button in the header, wherever you are.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground tabular shrink-0 text-xs">
              {done} of {total}
            </span>
          </div>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {onboardingSteps.map((step, index) => {
              const stepDone = step.done(snapshot);
              return (
                <li key={step.id}>
                  <Link
                    href={onboardingHref(step)}
                    className="hover:bg-muted/60 flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors"
                  >
                    <span
                      className={cn(
                        "tabular flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                        stepDone ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {stepDone ? <Check className="size-3" /> : index + 1}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardContent className="flex flex-wrap items-center gap-3 px-4">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <p className="text-muted-foreground min-w-0 flex-1 text-sm text-pretty">
            Press{" "}
            <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[11px] font-medium">
              Ctrl+K
            </kbd>{" "}
            anywhere — ⌘K on a Mac — and type a question: &ldquo;how do I block a room&rdquo;,
            &ldquo;connect Agoda&rdquo;, or a reservation reference.
          </p>
        </CardContent>
      </Card>

      {order.map((category) => {
        const articles = helpArticles.filter((article) => article.category === category);
        if (articles.length === 0) return null;
        return (
          <section key={category} className="space-y-3">
            <h3 className="text-sm font-semibold tracking-tight">
              {helpCategoryLabels[category]}
            </h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.slug} className="gap-2 py-4 transition-shadow hover:shadow-sm">
                  <CardHeader className="px-4">
                    <CardTitle className="text-base text-balance">
                      <Link href={`/help/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-pretty">{article.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 px-4">
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <Clock className="size-3" />
                      {article.minutes} min
                    </Badge>
                    <Button variant="ghost" size="sm" className="ml-auto gap-1" asChild>
                      <Link href={`/help/${article.slug}`}>
                        Read
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Plug className="size-4" />
          Per-channel setup guides
        </h3>
        <Card className="gap-3 py-4">
          <CardHeader className="px-4">
            <CardDescription className="text-pretty">
              Every OTA follows the same shape — request connectivity in its extranet, nominate
              Channex, then map — but each names things differently and fails in its own way.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 px-4">
            {otaCatalog.map((ota) => (
              <Button key={ota.slug} variant="outline" size="sm" asChild>
                <Link href={`/channels/connect/${ota.slug}`}>
                  <BookOpen className="size-3.5" />
                  {ota.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
