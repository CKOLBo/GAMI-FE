import { useState } from 'react';
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
  const [error, setError] = useState('');

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return '모든 필드를 입력해주세요.';
    }
    if (newPassword !== confirmPassword) {
      return '비밀번호가 일치하지 않아요.';
    }
    if (newPassword.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMessage = validate();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError('');
    onClose();
  };

  return (
    <ModalWrapper className="px-10 py-10">
      <div className="w-[376px] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 cursor-pointer bg-transparent border-0 p-0"
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

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <InputPassword
              placeholder="기존 비밀번호"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="mb-5">
            <InputPassword
              placeholder="새 비밀번호"
              name="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="mb-2">
            <InputPassword
              placeholder="비밀번호 확인"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="h-6 mb-[18px]">
            {error && <p className="text-sm text-main-3 text-left">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full h-13 2xl:h-15 bg-main-2 text-white text-xl rounded-[10px] font-bold hover:bg-main-2-hover transition-all"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}
