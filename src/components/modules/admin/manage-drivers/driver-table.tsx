'use client';

import { useState } from 'react';
import { Driver } from '@/types/bus';
import { DriverTableHeader } from './driver-table-header';
import { DriverTableBody } from './driver-table-body';
import { AddDriverModal } from './add-driver-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DriverTableProps {
  drivers: Driver[];
}

export function DriverTable({ drivers }: DriverTableProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    // You could implement an UpdateDriverSheet similar to UpdateBusSheet
    toast.info('Update driver functionality can be implemented here');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      // Assuming a DeleteDriverAction exists or will be added
      toast.error('Delete functionality for drivers not yet implemented');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Drivers</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <DriverTableHeader />
          <DriverTableBody 
            drivers={drivers} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </table>
      </div>

      <AddDriverModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
