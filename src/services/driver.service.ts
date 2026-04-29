import { env } from '@/env';

const driverService = {
  getAllDrivers: async () => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}drivers`, {
        cache: 'no-store',
        next: { tags: ['AllDrivers'] },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      return { success: false, message: 'Something went wrong', data: [] };
    }
  },

  getDriverById: async (id: string) => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}drivers/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch driver ${id}:`, error);
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};

export default driverService;
