import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Driver } from "@/types/bus";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DriverTableBodyProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export function DriverTableBody({ drivers, onEdit, onDelete }: DriverTableBodyProps) {
  return (
    <TableBody>
      {drivers.map((driver) => (
        <TableRow key={driver.id}>
          <TableCell className="font-medium">{driver.name}</TableCell>
          <TableCell>{driver.email}</TableCell>
          <TableCell>{driver.phone}</TableCell>
          <TableCell>{driver.licenseNumber}</TableCell>
          <TableCell>
            <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
              {driver.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(driver)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(driver.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
      {drivers.length === 0 && (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
            No drivers found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
