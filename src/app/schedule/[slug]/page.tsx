import ScheduleDetails from "@/components/scheduleDetails";
import React from "react";

const ScheduleDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  console.log(slug);

  return (
    <div className="space-y-5 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bus On Route:{slug}
        </h1>
        <p className="text-muted-foreground mt-1">
          View all available buses on route {slug}
        </p>
      </div>
      <ScheduleDetails />
    </div>
  );
};

export default ScheduleDetailsPage;
