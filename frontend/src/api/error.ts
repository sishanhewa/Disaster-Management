import axios from 'axios';

export function extractApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (typeof data?.message === 'string' && data.message.trim().length > 0) {
      return data.message;
    }
    if (typeof data?.error === 'string' && data.error.trim().length > 0) {
      return data.error;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
}
