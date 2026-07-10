import type { Metadata } from "next";
import { StaticPageView } from "@/components/static-page-view";
import { STATIC_PAGES } from "@/content/pages";

export const metadata: Metadata = {
  title: STATIC_PAGES["bandi"].title,
  description: STATIC_PAGES["bandi"].description,
};

export default function Page() {
  return <StaticPageView slug="bandi" />;
}
