'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusSchema, BusFormValues } from '@/schema/bus.schema';
import { UpdateBusAction } from '@/actions/bus.action';
import { Bus } from '@/types/bus';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UpdateBusSheetProps {
  bus: Bus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateBusSheet({ bus, open, onOpenChange }: UpdateBusSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusFormValues>({
    resolver: zodResolver(BusSchema),
    defaultValues: {
      busNumber: '',
      model: '',
      capacity: 0,
      status: 'active',
    },
  });

  useEffect(() => {
    if (bus) {
      form.reset({
        busNumber: bus.busNumber,
        model: bus.model,
        capacity: bus.capacity,
        status: bus.status,
      });
    }
  }, [bus, form]);

  const onSubmit = async (values: BusFormValues) => {
    if (!bus) return;
    setIsSubmitting(true);
    try {
      const res = await UpdateBusAction(values, bus.id);
      if (res.success) {
        toast.success('Bus updated successfully');
        onOpenChange(false);
      } else {
        toast.error(res.message || 'Failed to update bus');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Update Bus Details</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="busNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Number</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. DHAKA-METRO-123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Hino 1J" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Bus'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
