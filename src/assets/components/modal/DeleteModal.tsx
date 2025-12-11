import ModalWrapper from '@/assets/shared/Modal';

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteModal({ onClose, onDelete }: DeleteModalProps) {
  return (
    <ModalWrapper className="w-[450px]">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-1 mb-4">게시글 삭제하기</h2>
        <p className="text-lg text-gray-3 mb-8 text-center">
          정말 삭제하시겠습니까?
          <br />
          삭제되면 복구되지 않아요.
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-2 text-gray-1 font-bold text-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-6 py-3 rounded-lg bg-main-1 text-white font-bold text-lg hover:bg-main-2"
          >
            삭제하기
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
