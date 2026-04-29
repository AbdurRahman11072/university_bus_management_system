import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Bus } from "@/types/bus";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusTableBodyProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onDelete: (id: string) => void;
}

export function BusTableBody({ buses, onEdit, onDelete }: BusTableBodyProps) {
  return (
    <TableBody>
      {buses.map((bus) => (
        <TableRow key={bus.id}>
          <TableCell className="font-medium">{bus.busNumber}</TableCell>
          <TableCell>{bus.model}</TableCell>
          <TableCell>{bus.capacity}</TableCell>
          <TableCell>
            <Badge variant={bus.status === 'active' ? 'default' : 'secondary'}>
              {bus.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(bus)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(bus.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
      {buses.length === 0 && (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
            No buses found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
