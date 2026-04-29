import { DriverTable } from '@/components/modules/admin/manage-drivers/driver-table';
import driverService from '@/services/driver.service';

const ManageDriversPage = async () => {
  const driversData = await driverService.getAllDrivers();
  const drivers = driversData?.data || [];

  return (
    <div className="container mx-auto py-10">
      <DriverTable drivers={drivers} />
    </div>
  );
};

export default ManageDriversPage;
