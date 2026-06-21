import type { Verdict } from "@/data/trends";

export const VERDICT_META: Record<
  Verdict,
  { label: string; color: string; glowClass: string; dotClass: string; badgeClass: string }
> = {
  backed: {
    label: "Backed",
    color: "#1f7a4d",
    glowClass: "",
    dotClass: "bg-[#1f7a4d]",
    badgeClass: "bg-[#1f7a4d]/10 text-[#1f7a4d] border border-[#1f7a4d]/30",
  },
  mixed: {
    label: "Mixed",
    color: "#b8851f",
    glowClass: "",
    dotClass: "bg-[#b8851f]",
    badgeClass: "bg-[#b8851f]/10 text-[#b8851f] border border-[#b8851f]/30",
  },
  debunked: {
    label: "Debunked",
    color: "#c0432b",
    glowClass: "",
    dotClass: "bg-[#c0432b]",
    badgeClass: "bg-[#c0432b]/10 text-[#c0432b] border border-[#c0432b]/30",
  },
  unmapped: {
    label: "Unmapped",
    color: "#2f5d8a",
    glowClass: "",
    dotClass: "bg-[#2f5d8a]",
    badgeClass: "bg-[#2f5d8a]/10 text-[#2f5d8a] border border-[#2f5d8a]/30",
  },
};

export const VERDICT_FILTERS: { value: "all" | Verdict; label: string }[] = [
  { value: "all", label: "All" },
  { value: "backed", label: "Backed" },
  { value: "mixed", label: "Mixed" },
  { value: "debunked", label: "Debunked" },
  { value: "unmapped", label: "Unmapped" },
];
