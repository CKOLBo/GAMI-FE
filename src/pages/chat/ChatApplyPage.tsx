import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import BellIcon from '@/assets/svg/common/BellIcon';
import Divider from '@/assets/svg/Divider';
import RequestItem from '@/assets/components/chat/RequestItem';
import MentorRequestModal from '@/assets/components/modal/MentorRequestModal';
import { useState, useEffect, useCallback, useRef } from 'react';
import { instance } from '@/assets/shared/lib/axios';
import { API_PATHS } from '@/constants/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ApplyRequest {
  applyId: number;
  mentorId?: number;
  menteeId?: number;
  name: string;
  applyStatus: string;
  createdAt: string;
}

export default function ChatApplyPage() {
  const [sentRequests, setSentRequests] = useState<ApplyRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ApplyRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMentorRequestModalOpen, setIsMentorRequestModalOpen] =
    useState(false);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const previousReceivedCountRef = useRef<number>(0);

  const fetchReceivedRequests = useCallback(async () => {
    try {
      const response = await instance.get<ApplyRequest[]>(
        API_PATHS.MENTORING_APPLY_RECEIVED
      );
      if (Array.isArray(response.data)) {
        const newCount = response.data.filter(
          (req) => req.applyStatus === 'PENDING'
        ).length;

        // 새로운 요청이 들어온 경우 알림
        if (newCount > previousReceivedCountRef.current) {
          const newRequests = response.data.filter(
            (req) => req.applyStatus === 'PENDING'
          );
          const addedCount = newCount - previousReceivedCountRef.current;
          if (addedCount === 1 && newRequests.length > 0) {
            toast.info(`${newRequests[0].name}님한테 요청이 왔어요`);
          } else if (addedCount > 1) {
            toast.info(`${addedCount}개의 새로운 요청이 왔어요`);
          }
        }

        previousReceivedCountRef.current = newCount;
        setReceivedRequests(response.data);
      }
    } catch (error) {
      console.error('받은 요청 목록 로드 실패:', error);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instance.get<ApplyRequest[]>(
        API_PATHS.MENTORING_APPLY_SENT
      );
      if (Array.isArray(response.data)) {
        setSentRequests(response.data);
      }
    } catch (error) {
      console.error('보낸 요청 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentRequests();
    fetchReceivedRequests();

    // 10초마다 받은 요청 확인
    const pollInterval = setInterval(() => {
      fetchReceivedRequests();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchReceivedRequests, fetchSentRequests]);

  useEffect(() => {
    if (isMentorRequestModalOpen) {
      fetchReceivedRequests();
    }
  }, [fetchReceivedRequests, isMentorRequestModalOpen]);

  const handleCancelRequest = async (applyId: number) => {
    try {
      setRemovingIds((prev) => new Set(prev).add(applyId));

      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'REJECTED',
      });

      setTimeout(() => {
        setSentRequests((prev) =>
          prev.filter((req) => req.applyId !== applyId)
        );
        setRemovingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(applyId);
          return newSet;
        });
      }, 300);
    } catch (error) {
      console.error('요청 취소 실패:', error);
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applyId);
        return newSet;
      });
      toast.error('요청 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBellClick = () => {
    setIsMentorRequestModalOpen(true);
  };

  const handleAcceptMentor = async (applyId: number) => {
    try {
      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'ACCEPTED',
      });
      await fetchReceivedRequests();
      toast.success('멘토링 신청을 수락했습니다.');
    } catch (error) {
      console.error('멘토 신청 수락 실패:', error);
      toast.error('멘토 신청 수락에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleRejectMentor = async (applyId: number) => {
    try {
      await instance.patch(API_PATHS.MENTORING_APPLY_UPDATE(applyId), {
        applyStatus: 'REJECTED',
      });
      await fetchReceivedRequests();
      toast.success('멘토링 신청을 거절했습니다.');
    } catch (error) {
      console.error('멘토 신청 거절 실패:', error);
      toast.error('멘토 신청 거절에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex min-h-screen">
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col h-screen">
          <div className="px-7 2xl:px-15 pt-7 2xl:pt-15 pb-4 2xl:pb-5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-4 text-[40px] font-bold">
                <Link
                  to="/chat"
                  className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  채팅
                </Link>
                <Divider className="flex-shrink-0" />
                <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">
                  요청
                </span>
              </h1>
              <button
                onClick={handleBellClick}
                className="relative p-1 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
                type="button"
              >
                <BellIcon className="text-gray-3 pointer-events-none" />
                {receivedRequests.filter((req) => req.applyStatus === 'PENDING')
                  .length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">로딩 중...</p>
              </div>
            ) : Array.isArray(sentRequests) && sentRequests.length > 0 ? (
              sentRequests.map((request) => (
                <RequestItem
                  key={request.applyId}
                  name={request.name}
                  onCancel={() => handleCancelRequest(request.applyId)}
                  isRemoving={removingIds.has(request.applyId)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-base 2xl:text-lg text-gray-3">
                  보낸 요청이 없습니다
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="mb-8 2xl:mb-12 flex justify-center">
              <Logo size="lg" />
            </div>
            <p className="text-2xl 2xl:text-3xl font-bold text-gray-3">
              <span className="text-main-2">멘토</span>와{' '}
              <span className="text-main-1">멘티</span>를 바로 연결하는
              <br />
              맞춤형 멘토링 서비스
            </p>
          </div>
        </div>
      </div>
      {isMentorRequestModalOpen && (
        <MentorRequestModal
          onClose={() => setIsMentorRequestModalOpen(false)}
          onAccept={handleAcceptMentor}
          onReject={handleRejectMentor}
          requests={receivedRequests}
        />
      )}
    </div>
  );
}
