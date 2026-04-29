import { BusTable } from '@/components/modules/admin/manage-buses/bus-table';
import busService from '@/services/bus.service';

const ManageBusPage = async () => {
  const busesData = await busService.getAllBuses();
  
  // Handle different data structures if necessary, but following foodie_client pattern:
  const buses = busesData?.data || [];

  return (
    <div className="container mx-auto py-10">
      <BusTable buses={buses} />
    </div>
  );
};

export default ManageBusPage;
