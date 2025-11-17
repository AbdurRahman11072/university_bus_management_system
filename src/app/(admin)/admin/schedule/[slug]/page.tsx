import ScheduleDetails from "@/components/scheduleDetails";
import { API_BASE } from "@/lib/config";

const ScheduleDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const response = await fetch(`${API_BASE}/bus/${slug}`);

  const data = await response.json();
  const busData = data.data;
  console.log(busData);

  return <ScheduleDetails busData={busData} slug={slug} />;
};

export default ScheduleDetailsPage;
