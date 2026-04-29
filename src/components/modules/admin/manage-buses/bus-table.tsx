'use client';

import { useState } from 'react';
import { Bus } from '@/types/bus';
import { BusTableHeader } from './bus-table-header';
import { BusTableBody } from './bus-table-body';
import { AddBusModal } from './add-bus-modal';
import { UpdateBusSheet } from './update-bus-sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteBusAction } from '@/actions/bus.action';

interface BusTableProps {
  buses: Bus[];
}

export function BusTable({ buses }: BusTableProps) {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEdit = (bus: Bus) => {
    setSelectedBus(bus);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      const res = await DeleteBusAction(id);
      if (res.success) {
        toast.success('Bus deleted successfully');
      } else {
        toast.error(res.message || 'Failed to delete bus');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Buses</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Bus
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <BusTableHeader />
          <BusTableBody 
            buses={buses} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </table>
      </div>

      <AddBusModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />

      <UpdateBusSheet 
        bus={selectedBus} 
        open={isEditSheetOpen} 
        onOpenChange={setIsEditSheetOpen} 
      />
    </div>
  );
}
