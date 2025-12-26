import ModalWrapper from '@/assets/shared/Modal';
import Button from '../Button/Button';

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteModal({ onClose, onDelete }: DeleteModalProps) {
  return (
    <ModalWrapper className="w-[542px] px-10 py-10">
      <div className="flex flex-col ">
        <h2 className="text-2xl font-bold text-gray-1 mb-20">
          게시글 삭제하기
        </h2>
        <p className="text-2xl text-gray-1 mb-14 font-semibold">
          정말 삭제하시겠습니까?
          <br />
          삭제되면 복구되지 않아요.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-9 py-4 border cursor-pointer border-gray-2 text-2xl font-bold text-gray-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <Button text="삭제하기" color="bg-main-3" onClick={onDelete} />
        </div>
      </div>
    </ModalWrapper>
  );
}
