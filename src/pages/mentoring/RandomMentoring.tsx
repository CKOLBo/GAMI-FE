import Sidebar from '@/assets/components/Sidebar';
import Divider from '@/assets/svg/Divider';
import { Link } from 'react-router-dom';
import Mentor from '@/assets/svg/mentor/Mentor.png';
import { useState, useRef } from 'react';
import { instance } from '@/assets/shared/lib/axios';
import ModalWrapper from '@/assets/shared/Modal';
import { toast } from 'react-toastify';
import Profile from '@/assets/svg/profile/Profile';
import X from '@/assets/svg/X';

interface RandomMentorResponse {
  memberId: number;
  name: string;
  gender: 'MALE' | 'FEMALE';
  generation: number;
  major: string;
}

export default function RandomMentoring() {
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchedMentor, setMatchedMentor] =
    useState<RandomMentorResponse | null>(null);
  const [recommendedMentorIds, setRecommendedMentorIds] = useState<number[]>(
    []
  );
  const isCancelledRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const handleRandomSearch = async (isRetry = false) => {
    if (!isRetry) {
      setIsMatchingModalOpen(true);
      isCancelledRef.current = false;
      retryCountRef.current = 0;
    }

    try {
      const response = await instance.get<RandomMentorResponse>(
        '/api/mentoring/random',
        {
          params: {
            _t: Date.now(),
          },
        }
      );

      if (isCancelledRef.current) {
        return;
      }

      const mentorId = response.data.memberId;

      if (recommendedMentorIds.includes(mentorId)) {
        retryCountRef.current += 1;

        if (retryCountRef.current > 10) {
          setRecommendedMentorIds([]);
          retryCountRef.current = 0;
        }

        if (isCancelledRef.current) {
          return;
        }

        retryTimeoutRef.current = setTimeout(() => {
          if (!isCancelledRef.current) {
            handleRandomSearch(true);
          }
        }, 500);
        return;
      }

      if (isCancelledRef.current) {
        return;
      }

      setRecommendedMentorIds((prev) => [...prev, mentorId]);
      setIsMatchingModalOpen(false);
      setMatchedMentor(response.data);
    } catch (err: any) {
      if (isCancelledRef.current) {
        return;
      }
      setIsMatchingModalOpen(false);
      if (err.response?.status === 401) {
        toast.error('인증이 필요합니다.');
      } else {
        toast.error('멘토를 찾는데 실패했습니다.');
      }
    }
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setIsMatchingModalOpen(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  const handleCloseSuccessModal = () => {
    setMatchedMentor(null);
  };

  const handleRetry = () => {
    if (matchedMentor) {
      setRecommendedMentorIds((prev) =>
        prev.filter((id) => id !== matchedMentor.memberId)
      );
    }
    setMatchedMentor(null);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    isCancelledRef.current = false;
    retryCountRef.current = 0;
    handleRandomSearch(false);
  };

  const handleMentorApply = async () => {
    if (!matchedMentor) return;

    const appliedMentors = JSON.parse(
      localStorage.getItem('appliedMentors') || '[]'
    );

    const recentApplication = appliedMentors.find(
      (applied: { mentorId: number; timestamp: number }) => {
        const timeDiff = Date.now() - applied.timestamp;
        const fiveMinutes = 5 * 60 * 1000;
        return (
          applied.mentorId === matchedMentor.memberId && timeDiff < fiveMinutes
        );
      }
    );

    if (recentApplication) {
      toast.error('이미 신청했어요');
      return;
    }

    try {
      await instance.post(`/api/mentoring/apply/${matchedMentor.memberId}`);
      toast.success('신청을 했어요');

      const updatedAppliedMentors = appliedMentors.filter(
        (applied: { mentorId: number; timestamp: number }) => {
          const timeDiff = Date.now() - applied.timestamp;
          const fiveMinutes = 5 * 60 * 1000;
          return (
            applied.mentorId !== matchedMentor.memberId ||
            timeDiff >= fiveMinutes
          );
        }
      );

      updatedAppliedMentors.push({
        mentorId: matchedMentor.memberId,
        timestamp: Date.now(),
      });

      localStorage.setItem(
        'appliedMentors',
        JSON.stringify(updatedAppliedMentors)
      );
      setMatchedMentor(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error('멘토를 찾을 수 없습니다.');
      } else {
        toast.error('신청에 실패했습니다.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 ml-45 2xl:ml-55">
        <div className="fixed top-0 left-45 2xl:left-55 right-0 z-40">
          <div className="px-7 2xl:px-15 pt-7 2xl:pt-15 bg-white">
            <div className="flex items-center">
              <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1">
                <Link
                  to="/mentoring"
                  className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  멘토링
                </Link>
                <Divider className="flex-shrink-0" />
                <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">
                  랜덤 검색
                </span>
              </h1>
            </div>
          </div>
          <div className="h-16 bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0)_100%)]"></div>
        </div>

        <div className="pt-[220px] pb-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] mt-[20px]">
            <div className="mb-12 flex items-center justify-center">
              <div className="w-64 h-64 2xl:w-80 2xl:h-80 flex items-center justify-center overflow-hidden">
                <img
                  src={Mentor}
                  alt="멘토 일러스트"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <p className="text-[16px] 2xl:text-[20px] font-bold text-gray-1 text-center mb-16">
              당신에게 맞는 <span className="text-main-1">멘토</span>를
              추천해드릴게요.
              <br />
              아래 버튼을 눌러 시작해보세요.
            </p>

            <button
              onClick={() => handleRandomSearch(false)}
              className="w-[376px] h-13 2xl:h-15 bg-main-1 text-white text-[24px] rounded-[10px] 2xl:rounded-[12px] transition-all duration-300 font-bold hover:bg-main-1-hover border-0 cursor-pointer"
            >
              랜덤 검색
            </button>
          </div>
        </div>
      </main>

      {isMatchingModalOpen && (
        <ModalWrapper className="w-[542px] px-10 py-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-1 mb-6">매칭중...</h2>
            <p className="text-2xl text-gray-1 mb-14 font-semibold">
              당신과 잘 맞는 멘토를 찾는 중이에요.
              <br />
              잠시만 기다려 주세요.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="px-9 py-4 bg-main-1 text-white text-2xl font-bold rounded-xl hover:bg-main-1-hover transition-colors cursor-pointer"
              >
                취소
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {matchedMentor && (
        <ModalWrapper className="w-[542px] px-10 py-10">
          <div className="flex flex-col relative">
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className="absolute top-0 right-0 bg-transparent border-0 cursor-pointer"
              aria-label="닫기"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-gray-1 mb-8">매칭 성공</h2>

            <div className="flex flex-col items-center mb-10">
              <div className="mb-6">
                <Profile width={100} height={100} />
              </div>
              <p className="font-bold text-gray-1 text-[24px] mb-4">
                {matchedMentor.name}
              </p>
              <div className="flex gap-2 flex-nowrap">
                <span className="rounded-md px-3 py-0.3 text-white text-[20px] font-semibold bg-main-1 whitespace-nowrap">
                  {matchedMentor.generation}기
                </span>
                <span className="rounded-md px-3 py-0.3 text-white text-[20px] font-semibold bg-main-2 whitespace-nowrap">
                  {matchedMentor.major}
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleRetry}
                className="px-9 py-4 border cursor-pointer border-gray-2 text-2xl font-bold text-gray-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                다시 돌리기
              </button>
              <button
                onClick={handleMentorApply}
                className="px-9 py-4 bg-main-1 text-white text-2xl font-bold rounded-xl hover:bg-main-1-hover transition-colors cursor-pointer"
              >
                멘토 신청
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
