export type BusStatus = 'active' | 'maintenance' | 'inactive';

export interface Bus {
  id: string;
  busNumber: string;
  model: string;
  capacity: number;
  status: BusStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  stops: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  busId: string;
  driverId: string;
  routeId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  bus?: Bus;
  driver?: Driver;
  route?: Route;
  createdAt: string;
  updatedAt: string;
}
