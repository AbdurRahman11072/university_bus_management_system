'use server';

import { env } from '@/env';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const CreateDriverAction = async (driverData: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(driverData),
    });

    const data = await res.json();
    if (data.success) {
      updateTag('AllDrivers');
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create driver',
    };
  }
};

export const UpdateDriverAction = async (driverData: any, id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(driverData),
    });

    const data = await res.json();
    if (data.success) {
      updateTag('AllDrivers');
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update driver',
    };
  }
};
