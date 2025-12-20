import ModalWrapper from '@/assets/shared/Modal';
import Button from '@/assets/components/Button/Button';

interface ReportModalProps {
  onClose: () => void;
  onAction: (action: 'BLOCK' | 'REJECT' | 'HOLD') => void;
}

const mockReportDetail = {
  id: 1,
  reportType: 'SPAM',
  reason: '광고·홍보·스팸',
  additionalReason:
    '문제제목제목제목설명설명설명 o o;라;ㅣ oㅁ;라 ㅏㅏㄴㅁㄴ; H oㄷrㅐ oㅁzㅣrㅏ H o;ㄷrㅐ o;ㄷr; ㅁ;ㄴㅎ;ㄱㅜㅏ oㅁ;ㄴㅈㅣ',
};

export default function CheckReportModal({
  onClose,
  onAction,
}: ReportModalProps) {
  return (
    <ModalWrapper className="px-10 py-10">
      <div className="w-[1350px]">
        <h2 className="text-[32px] text-gray-1 font-bold mb-6">게시글 신고</h2>
        <p className="mb-10 text-gray-1 text-2xl font-semibold">
          문제가 되는 이유를 확인하고 처리해 주세요.
        </p>
        <div className="mb-10">
          <label className="block text-2xl mb-4 font-semibold text-gray-1">
            신고 사유
          </label>
          <div className="w-94 px-6 py-4 border border-gray-2 rounded-lg bg-gray-50 text-xl text-gray-1">
            {mockReportDetail.reason}
          </div>
        </div>
        <div className="mb-14">
          <label className="block text-2xl mb-4 font-semibold text-gray-1">
            추가 설명
          </label>
          <div className="w-full min-h-40 p-6 border border-gray-2 rounded-lg bg-gray-50 text-xl text-gray-1 whitespace-pre-wrap">
            {mockReportDetail.additionalReason}
          </div>
        </div>
        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-9 py-4 border border-gray-2 text-2xl font-bold text-gray-1 rounded-xl"
          >
            취소
          </button>
          <button
            onClick={() => onAction('BLOCK')}
            className="px-9 py-4 bg-red-400 text-white text-2xl font-bold rounded-xl"
          >
            제재
          </button>
          <button
            onClick={() => onAction('REJECT')}
            className="px-9 py-4 bg-green-400 text-white text-2xl font-bold rounded-xl"
          >
            기각
          </button>
          <button
            onClick={() => onAction('HOLD')}
            className="px-9 py-4 bg-yellow-400 text-white text-2xl font-bold rounded-xl"
          >
            보류
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
