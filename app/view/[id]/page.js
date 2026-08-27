import ViewPageClient from "@/components/ViewPageClient";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Experiment ${id} | LabCodex`,
    description: `View the recorded lab experiment and code output for experiment ${id} in LabCodex.`,
    alternates: {
      canonical: `/view/${id}`,
    },
  };
}

export default function Page() {
  return <ViewPageClient />;
}
