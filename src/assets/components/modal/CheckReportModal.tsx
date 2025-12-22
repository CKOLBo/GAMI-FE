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
      <div className="w-[1350px] max-h-200">
        <h2 className="text-[32px] text-gray-1 font-bold mb-13">게시글 신고</h2>
        <p className="mb-7 text-gray-1 text-2xl font-semibold">
          문제가 되는 이유를 확인하고 처리해 주세요.
        </p>
        <div className="mb-15">
          <div className="w-94 px-6 py-4 border border-gray-2 rounded-lg text-xl text-gray-1">
            {mockReportDetail.reason}
          </div>
        </div>
        <div className="mb-10">
          <label className="block text-2xl mb-9 font-semibold text-gray-1">
            추가 설명
          </label>
          <div className="w-full h-[296px] p-6 border border-gray-2 rounded-lg text-xl text-gray-1 whitespace-pre-wrap">
            {mockReportDetail.additionalReason}
          </div>
        </div>
        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-9 py-4 border border-gray-2 cursor-pointer text-2xl font-bold text-gray-1 rounded-xl"
          >
            취소
          </button>
          <Button
            width="w-[114px]"
            text="제재"
            color="bg-[#FFAC0B]"
            onClick={() => onAction('BLOCK')}
          />
          <Button
            width="w-[114px]"
            text="기각"
            color="bg-main-3"
            onClick={() => onAction('REJECT')}
          />
          <Button
            width="w-[114px]"
            text="보류"
            color="bg-[#34C759]"
            onClick={() => onAction('HOLD')}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
