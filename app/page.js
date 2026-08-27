import HomePageClient from "@/components/HomePageClient";

export const metadata = {
  title: "LabCodex | New Experiment",
  description:
    "Create and save lab experiment records with code, output, and subject details in one organized dashboard.",
  keywords: [
    "new experiment",
    "lab code entry",
    "experiment tracker",
    "code backup",
    "college lab",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomePageClient />;
}
