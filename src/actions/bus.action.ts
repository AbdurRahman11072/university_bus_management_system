'use server';

import { env } from '@/env';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const CreateBusAction = async (busData: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}buses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(busData),
    });

    const data = await res.json();
    if (data.success) {
      updateTag('AllBuses');
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create bus',
    };
  }
};

export const UpdateBusAction = async (busData: any, id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}buses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(busData),
    });

    const data = await res.json();
    if (data.success) {
      updateTag('AllBuses');
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update bus',
    };
  }
};

export const DeleteBusAction = async (id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}buses/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const data = await res.json();
    if (data.success) {
      updateTag('AllBuses');
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete bus',
    };
  }
};
