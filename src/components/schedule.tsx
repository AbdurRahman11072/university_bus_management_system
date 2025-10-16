import Link from "next/link";
import React from "react";

interface ScheduleCards {
  route: 1;
  destination: string[];
  departure: string;
  arrivel: string;
  status: "On time" | "Late" | "In jame";
}
const SchduleData = [
  {
    route: 1,
    destination: ["Central Station", "Maple Avenue"],
    departure: "08:00 AM",
    arrivel: "08:45 AM",
    status: "On time",
  },
  {
    route: 2,
    destination: ["Downtown Plaza", "Riverfront Park", "Hillside Mall"],
    departure: "09:15 AM",
    arrivel: "10:30 AM",
    status: "Late",
  },
  {
    route: 3,
    destination: [
      "North Terminal",
      "Business District",
      "Central Station",
      "Airport Zone",
    ],
    departure: "11:00 AM",
    arrivel: "12:45 PM",
    status: "In jame",
  },
  {
    route: 4,
    destination: ["Eastgate", "Westview"],
    departure: "01:20 PM",
    arrivel: "02:10 PM",
    status: "On time",
  },
  {
    route: 5,
    destination: ["Central Station", "University Campus", "Research Park"],
    departure: "03:30 PM",
    arrivel: "04:25 PM",
    status: "Late",
  },
  {
    route: 6,
    destination: [
      "South Station",
      "Shopping Mall",
      "Entertainment District",
      "Waterfront",
    ],
    departure: "05:45 PM",
    arrivel: "07:15 PM",
    status: "In jame",
  },
];

const Schdule = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {SchduleData.map((route) => (
        <Link key={route.route} href={`/schedule/${route.route}`}>
          <div className="bg-white/80 rounded-xl p-4">
            <div className="flex gap-2 h-8">
              <span className="w-1 h-full bg-accent"></span>
              <h1 className="text-2xl font-extrabold font-mono">
                Route {route.route}
              </h1>
            </div>
            <p className="pl-3">
              <span className="text-lg font-bold">Destination :</span>{" "}
              {route.destination.join(" → ")}.
            </p>
            <p className="pl-3">
              <span className="text-lg font-bold">Arrivel :</span>{" "}
              {route.arrivel}
            </p>{" "}
            <p className="pl-3 flex gap-1 ">
              <span className="text-lg font-bold">Status :</span>
              <span
                className={`${
                  route.status === "On time"
                    ? "text-accent"
                    : route.status === "Late"
                    ? "text-yellow-500"
                    : "text-red-500"
                } font-bold text-lg`}
              >
                {route.status}
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Schdule;
