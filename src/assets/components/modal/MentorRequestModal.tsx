import ModalWrapper from '@/assets/shared/Modal';
import X from '@/assets/svg/X';
import Profile from '@/assets/svg/profile/Profile';

interface MentorRequest {
  applyId: number;
  menteeId?: number;
  name: string;
  applyStatus: string;
}

interface MentorRequestModalProps {
  onClose: () => void;
  onAccept: (applyId: number) => void;
  onReject: (applyId: number) => void;
  requests: MentorRequest[];
}

export default function MentorRequestModal({
  onClose,
  onAccept,
  onReject,
  requests,
}: MentorRequestModalProps) {
  const pendingRequests = requests.filter(
    (request) => request.applyStatus === 'PENDING'
  );

  return (
    <ModalWrapper className="px-10 py-10">
      <div className="relative w-[460px] max-h-[600px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 cursor-pointer bg-transparent border-0 p-0"
          aria-label="닫기"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-gray-1 mb-2">멘토 신청 목록</h2>

        <p className="text-base text-gray-3 mb-6">
          신청 된 멘토를 확인해주세요.
        </p>

        <div className="max-h-[450px] overflow-y-auto">
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.applyId}
                  className="flex items-center justify-between py-4 border-b border-gray-2 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <Profile width={40} height={40} />
                    <span className="text-lg text-gray-1 font-semibold">
                      {request.name}님이 요청을 보냈어요.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(request.applyId)}
                      className="px-6 py-2 bg-white text-gray-1 text-base font-semibold rounded-lg border border-gray-2 hover:bg-gray-4 transition-colors"
                    >
                      거절
                    </button>
                    <button
                      onClick={() => onAccept(request.applyId)}
                      className="px-6 py-2 bg-main-1 text-white text-base font-semibold rounded-lg hover:bg-main-1-hover transition-colors"
                    >
                      수락
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-base text-gray-3">신청된 멘토가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
