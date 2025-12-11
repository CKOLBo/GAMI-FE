import { useState } from 'react';
import ModalWrapper from '@/assets/shared/Modal';
import Button from '@/assets/components/Button/Button';
import Arrow from '../../svg/Arrow';
interface PostModalProps {
  onClose: () => void;
  onReport: () => void;
}

export default function PostModal({ onClose, onReport }: PostModalProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalText, setAdditionalText] = useState('');

  const reportReasons = [
    '광고·홍보·스팸',
    '욕설·비하·혐오 표현',
    '개인정보 노출',
    '음란·불쾌한 내용',
    '게시판 목적과 맞지 않는 내용',
    '기타',
  ];

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setIsDropdownOpen(false);
  };

  return (
    <ModalWrapper className="px-10 py-10">
      <div className="w-[1350px] max-h-200">
        <h2 className="text-[32px] text-gray-1 font-bold mb-13">
          게시글 신고하기
        </h2>
        <p className="mb-7 text-gray-1 text-2xl font-semibold">
          문제가 되는 이유를 선택해 주세요. 허위 신고 시 이용이 제한될 수
          있어요.
        </p>

        <div className="mb-15">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-94 px-6 py-4 border cursor-pointer border-gray-2 text-left font-medium text-xl flex justify-between items-center bg-white
    ${isDropdownOpen ? 'rounded-t-lg border-b-0 pb-4.25' : 'rounded-lg'}
  `}
            >
              <span className={selectedReason ? 'text-gray-1' : 'text-gray-3'}>
                {selectedReason || '신고 사유를 선택해주세요.'}
              </span>
              <div
                className={`w-6 h-6 flex items-center justify-center  ${
                  isDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <Arrow />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-94 mt-0 bg-white border border-gray-2 border-t-0 rounded-b-lg max-h-80  ">
                {reportReasons.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => handleReasonSelect(reason)}
                    className="w-full px-6 py-3 text-left text-base hover:bg-gray-100 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-2xl mb-9 font-semibold text-gray-1">
            추가 설명
          </label>
          <textarea
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)}
            placeholder="이번 정이 문제가 되는지 구체적으로 적어 주세요. (최대 300자)"
            className="w-full h-40 p-5 border placeholder:font-medium border-gray-2 rounded-lg resize-none outline-none focus:border-main-1 text-xl"
            maxLength={300}
          />
          <div className="text-right text-gray-3 text-lg mt-2">
            {additionalText.length}/300자
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-9 py-4 border cursor-pointer border-gray-2 text-2xl font-bold text-gray-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            취소
          </button>

          <Button text="신고하기" onClick={onReport} />
        </div>
      </div>
    </ModalWrapper>
  );
}
