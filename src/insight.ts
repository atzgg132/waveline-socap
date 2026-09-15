import insightMd from "../INSIGHT.md?raw";

export const INSIGHT_MD = insightMd.trim();

export const INSIGHT_TITLE =
  "SoCap’s scarce resource is draft capacity / taste QA, not the follower graph.";

export const SOCAP_SOURCES = [
  { label: "Home", href: "https://www.sociallcapital.com/" },
  { label: "About", href: "https://www.sociallcapital.com/about" },
  { label: "Work / Wispr Flow", href: "https://www.sociallcapital.com/work/wispr-flow" },
  { label: "Careers", href: "https://www.sociallcapital.com/careers" },
] as const;

export const EVIDENCE_LINKS = [
  { label: "Tanay hero (X)", href: "https://x.com/tankots/status/2025981424470479008" },
  { label: "@socapinc claim QT", href: "https://x.com/socapinc/status/2026268845347164322" },
  { label: "Vedika Thinker-Writer", href: "https://x.com/VedikaBhaia/status/2026983856705081830" },
  { label: "WisprFlow cutdown", href: "https://x.com/WisprFlow/status/2026341353140138183" },
] as const;
