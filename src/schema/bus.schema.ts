import { z } from 'zod';

export const BusSchema = z.object({
  busNumber: z.string().min(1, 'Bus number is required'),
  model: z.string().min(1, 'Model is required'),
  capacity: z.number().positive('Capacity must be a positive number'),
  status: z.enum(['active', 'maintenance', 'inactive']),
});

export const DriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is too short'),
  licenseNumber: z.string().min(1, 'License number is required'),
  status: z.enum(['active', 'inactive']),
});

export const RouteSchema = z.object({
  routeName: z.string().min(1, 'Route name is required'),
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().min(1, 'End location is required'),
  stops: z.array(z.string()).optional(),
});

export const ScheduleSchema = z.object({
  busId: z.string().min(1, 'Bus is required'),
  driverId: z.string().min(1, 'Driver is required'),
  routeId: z.string().min(1, 'Route is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']),
});

export type BusFormValues = z.infer<typeof BusSchema>;
export type DriverFormValues = z.infer<typeof DriverSchema>;
export type RouteFormValues = z.infer<typeof RouteSchema>;
export type ScheduleFormValues = z.infer<typeof ScheduleSchema>;
