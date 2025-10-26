"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2 } from "lucide-react";
import EditBusDialog from "./editBusDialog";

export interface BusData {
  _id: string; // Add this line
  busId: string;
  busName: string;
  busRoute: string;
  busImg: string;
  busDestination: string[];
  busDriverId: string;
  busDepartureTime: string;
  busArrivalTime: string;
  busDepartureTime2: string;
  busArrivalTime2: string;
  busStatus: "On Time" | "Late" | "In Jame" | "Maintenance";
}

interface BusTableProps {
  buses: BusData[];
  onDelete: (_id: string) => void;
  onEdit: (bus: BusData) => void;
}

export default function BusTable({ buses, onDelete, onEdit }: BusTableProps) {
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (bus: BusData) => {
    setSelectedBus(bus);
    setIsDialogOpen(true);
  };

  const handleEditSave = (updatedBus: BusData) => {
    onEdit(updatedBus);
    setIsDialogOpen(false);
    setSelectedBus(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-red-100 text-red-800";
      case "In Jame":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">Bus ID</TableHead>
                <TableHead className="font-semibold">Bus Name</TableHead>
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">Destinations</TableHead>
                <TableHead className="font-semibold">Departure 1</TableHead>
                <TableHead className="font-semibold">Arrival 1</TableHead>
                <TableHead className="font-semibold">Departure 2</TableHead>
                <TableHead className="font-semibold">Arrival 2</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus._id} className="hover:bg-muted/50">
                  {" "}
                  {/* Use _id as key */}
                  <TableCell className="font-medium">{bus.busId}</TableCell>
                  <TableCell>{bus.busName}</TableCell>
                  <TableCell>{bus.busRoute}</TableCell>
                  <TableCell className="text-sm">
                    {bus.busDestination.join(", ")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {bus.busDepartureTime}
                  </TableCell>
                  <TableCell className="text-sm">
                    {bus.busArrivalTime}
                  </TableCell>
                  <TableCell className="text-sm">
                    {bus.busDepartureTime2}
                  </TableCell>
                  <TableCell className="text-sm">
                    {bus.busArrivalTime2}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        bus.busStatus
                      )}`}
                    >
                      {bus.busStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(bus)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(bus._id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedBus && (
        <EditBusDialog
          bus={selectedBus}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleEditSave}
        />
      )}
    </>
  );
}
