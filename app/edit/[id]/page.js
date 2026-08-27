import EditPageClient from "@/components/EditPageClient";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Edit Experiment ${id} | LabCodex`,
    description: `Update and refine the experiment record for ${id} in LabCodex.`,
    alternates: {
      canonical: `/edit/${id}`,
    },
  };
}

export default function Page() {
  return <EditPageClient />;
}
