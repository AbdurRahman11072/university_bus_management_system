import ScheduleDetails from "@/components/scheduleDetails";
import axiosInstance from "@/hooks/axiosInstance";
import React from "react";

const ScheduleDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const response = await fetch(`http://localhost:5000/api/v1/bus/${slug}`);

  const data = await response.json();
  const busData = data.data;
  console.log(busData);

  return <ScheduleDetails busData={busData} slug={slug} />;
};

export default ScheduleDetailsPage;
