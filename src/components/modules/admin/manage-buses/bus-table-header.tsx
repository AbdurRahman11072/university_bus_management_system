import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function BusTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Bus Number</TableHead>
        <TableHead>Model</TableHead>
        <TableHead>Capacity</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
