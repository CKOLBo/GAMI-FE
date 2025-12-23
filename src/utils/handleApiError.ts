import { toast } from 'react-toastify';
import axios from 'axios';

interface ErrorResponse {
  message?: string;
}

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
  statusMessages: { [key: number]: string } = {}
) => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    const status = error.response?.status;
    const serverMessage = (error.response?.data as ErrorResponse)?.message;
    if (status && statusMessages[status]) {
      toast.error(serverMessage || statusMessages[status]);
    } else {
      toast.error(serverMessage || defaultMessage);
    }
  } else {
    toast.error('알 수 없는 오류가 발생했습니다.');
  }
};

