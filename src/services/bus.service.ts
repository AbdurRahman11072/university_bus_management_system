import { env } from '@/env';

const busService = {
  getAllBuses: async () => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}buses`, {
        cache: 'no-store',
        next: { tags: ['AllBuses'] },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch buses:', error);
      return { success: false, message: 'Something went wrong', data: [] };
    }
  },

  getBusById: async (id: string) => {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}buses/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch bus ${id}:`, error);
      return { success: false, message: 'Something went wrong', data: null };
    }
  },
};

export default busService;
