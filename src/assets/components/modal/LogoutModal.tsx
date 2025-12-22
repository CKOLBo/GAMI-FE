import ModalWrapper from '@/assets/shared/Modal';
import Button from '../Button/Button';

interface LogoutModalProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({ onClose, onLogout }: LogoutModalProps) {
  return (
    <ModalWrapper className="w-[542px] pb-7 pr-7 pl-10 pt-10">
      <div className="flex flex-col">
        <h2 className="text-[24px] font-bold text-gray-1 mb-20">
          로그아웃 하기
        </h2>
        <p className="text-2xl text-gray-1 mb-14 font-semibold">
          로그아웃 하시겠어요?
          <br />
          언제든지 다시 로그인하실 수 있어요.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-9 py-3 cursor-pointer text-2xl font-bold text-gray-1 rounded-[10px] hover:bg-[#f5f5f5] transition-colors bg-white-1"
          >
            취소
          </button>
          <Button text="로그아웃" onClick={onLogout} />
        </div>
      </div>
    </ModalWrapper>
  );
}
