import Sidebar from '@/assets/components/Sidebar';
import Logo from '@/assets/svg/logo/Logo';
import BellIcon from '@/assets/svg/common/BellIcon';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import RequestItem from '@/assets/components/chat/RequestItem';
import MentorRequestModal from '@/assets/components/modal/MentorRequestModal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ApplyRequest {
  applyId: number;
  mentorId: number;
  name: string;
  applyStatus: string;
  createdAt: string;
}

export default function ChatApplyPage() {
  const [sentRequests, setSentRequests] = useState<ApplyRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMentorRequestModalOpen, setIsMentorRequestModalOpen] =
    useState(false);

  const mentorRequests = [
    { id: 1, name: '양은준' },
    { id: 2, name: '한국' },
    { id: 3, name: '양은준' },
    { id: 4, name: '한국' },
    { id: 5, name: '양은준' },
    { id: 6, name: '한국' },
  ];

  useEffect(() => {
    const mockData: ApplyRequest[] = [
      {
        applyId: 1,
        mentorId: 1,
        name: '양은준',
        applyStatus: 'PENDING',
        createdAt: '2025-12-21T08:45:28.541Z',
      },
      {
        applyId: 2,
        mentorId: 2,
        name: '한국',
        applyStatus: 'PENDING',
        createdAt: '2025-12-21T07:30:15.123Z',
      },
      {
        applyId: 3,
        mentorId: 3,
        name: '문강현',
        applyStatus: 'PENDING',
        createdAt: '2025-12-20T15:20:45.789Z',
      },
      {
        applyId: 4,
        mentorId: 4,
        name: '박하민',
        applyStatus: 'PENDING',
        createdAt: '2025-12-20T14:10:30.456Z',
      },
      {
        applyId: 5,
        mentorId: 5,
        name: '한의준',
        applyStatus: 'PENDING',
        createdAt: '2025-12-19T12:05:20.123Z',
      },
      {
        applyId: 6,
        mentorId: 6,
        name: '김준표',
        applyStatus: 'PENDING',
        createdAt: '2025-12-19T10:30:15.789Z',
      },
    ];

    const fetchSentRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApplyRequest[]>('/api/apply/sent');
        if (Array.isArray(response.data)) {
          setSentRequests(response.data);
        } else {
          setSentRequests(mockData);
        }
      } catch (error) {
        console.error('보낸 요청 목록 로드 실패:', error);
        setSentRequests(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  const handleCancelRequest = async (applyId: number) => {
    try {
      await axios.delete(`/api/apply/${applyId}`);
      setSentRequests((prev) => prev.filter((req) => req.applyId !== applyId));
    } catch (error) {
      console.error('요청 취소 실패:', error);
      alert('요청 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBellClick = () => {
    setIsMentorRequestModalOpen(true);
  };

  const handleAcceptMentor = (id: number) => {
    console.log(`멘토 신청 수락: ${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-45 2xl:ml-55 flex min-h-screen">
        <div className="w-96 2xl:w-[480px] border-r border-gray-2 bg-white flex flex-col min-h-screen">
          <div className="px-6 2xl:px-8 pt-6 2xl:pt-8 pb-4 2xl:pb-5">
            <div className="flex items-center justify-between mb-4 2xl:mb-5">
              <h1 className="flex items-center gap-4 text-[40px] font-bold">
                <Link
                  to="/chat"
                  className="text-[32px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  채팅
                </Link>
                <Divider className="flex-shrink-0" />
                <span className="text-[40px] text-gray-1 font-bold">요청</span>
              </h1>
              <button
                onClick={handleBellClick}
                className="relative p-1 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent"
                type="button"
              >
                <BellIcon className="text-gray-3 pointer-events-none" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="검색"
                className="w-full h-12 2xl:h-14 rounded-full bg-white-1 border border-gray-4 pl-12 2xl:pl-14 pr-4 py-2 text-base 2xl:text-lg text-gray-1 placeholder:text-gray-3 focus:outline-main-1 font-bold"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center pt-4 2xl:pt-5">
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
          requests={mentorRequests}
        />
      )}
    </div>
  );
}
