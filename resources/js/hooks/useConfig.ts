import { SharedProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function useConfig() {
  return usePage<SharedProps>().props.app;
}
