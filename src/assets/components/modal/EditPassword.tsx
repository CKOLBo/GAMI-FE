import { useState } from 'react';
import { toast } from 'react-toastify';
import { instance, TokenRefreshError } from '@/assets/shared/lib/axios';
import ModalWrapper from '@/assets/shared/Modal';
import X from '@/assets/svg/X';
import InputPassword from '../Input/InputPassword';

interface EditPasswordProps {
  onClose: () => void;
}

export default function EditPassword({ onClose }: EditPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('모든 필드를 입력해주세요.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않아요.');
      return false;
    }
    if (newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);

      await instance.patch('/api/member/password', {
        password: currentPassword,
        newPassword,
      });

      toast.success('비밀번호가 변경되었습니다.');
      onClose();
    } catch (err: unknown) {
      if (err instanceof TokenRefreshError) {
        return;
      }
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (error.response?.status === 401) {
          toast.error('현재 비밀번호가 올바르지 않습니다.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('비밀번호 변경에 실패했습니다.');
        }
      } else {
        toast.error('비밀번호 변경에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper className="px-10 py-10">
      <div className="w-[376px] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 bg-transparent border-0 cursor-pointer"
          aria-label="닫기"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-gray-1 mb-2">
          비밀번호 변경하기
        </h2>

        <p className="text-sm text-gray-3 mb-15">
          현재 비밀번호와 새 비밀번호를 입력 해주세요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputPassword
            placeholder="기존 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <InputPassword
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <InputPassword
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 mt-5 bg-main-2 text-white text-xl rounded-xl font-bold disabled:opacity-50"
          >
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}
