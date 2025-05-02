import { clsx, type ClassValue } from 'clsx';
import { Platform, ToastAndroid } from 'react-native';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showToast(message: string) {
  if(Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

export function resetFields(fields: { [key: string]: { reset: () => void }}) {
  Object.values(fields).forEach(field => field.reset());
}