import Sidebar from '@/assets/components/Sidebar';
import Mentor from '@/assets/components/mentor/Mentor';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotFoundImage from '@/assets/svg/mentor/NotFound.png';
import { toast } from 'react-toastify';
import { instance } from '@/assets/shared/lib/axios';

interface MentorData {
  memberId: number;
  name: string;
  gender: 'MALE' | 'FEMALE';
  generation: number;
  major: string;
}

interface MentorListResponse {
  content: MentorData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface MemberInfo {
  memberId: number;
  name: string;
  gender: 'MALE' | 'FEMALE';
  generation: number;
  major: string;
}

export default function MentoringPage() {
  const [allMentors, setAllMentors] = useState<MentorData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mentorsResponse, memberResponse] = await Promise.all([
          instance.get<MentorListResponse>('/api/mentoring/mentor/all', {
            params: {
              page: 0,
              size: 100,
            },
          }),
          instance.get<MemberInfo>('/api/member'),
        ]);

        setAllMentors(mentorsResponse.data.content);
        setCurrentMemberId(memberResponse.data.memberId);
      } catch (err) {
        console.error('데이터 조회 실패:', err);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mentors = useMemo(() => {
    let filteredMentors = allMentors;

    if (currentMemberId !== null) {
      filteredMentors = filteredMentors.filter(
        (mentor) => mentor.memberId !== currentMemberId
      );
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      return filteredMentors;
    }
    return filteredMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(trimmedQuery) ||
        mentor.major.toLowerCase().includes(trimmedQuery)
    );
  }, [searchQuery, allMentors, currentMemberId]);

  const handleMentorApply = async (mentor: MentorData) => {
    const appliedMentors = JSON.parse(
      localStorage.getItem('appliedMentors') || '[]'
    );

    const recentApplication = appliedMentors.find(
      (applied: { mentorId: number; timestamp: number }) => {
        const timeDiff = Date.now() - applied.timestamp;
        const fiveMinutes = 5 * 60 * 1000;
        return applied.mentorId === mentor.memberId && timeDiff < fiveMinutes;
      }
    );

    if (recentApplication) {
      toast.error('이미 신청했어요');
      return;
    }

    try {
      await instance.post(`/api/mentoring/apply/${mentor.memberId}`);
      toast.success('신청을 했어요');

      const updatedAppliedMentors = appliedMentors.filter(
        (applied: { mentorId: number; timestamp: number }) => {
          const timeDiff = Date.now() - applied.timestamp;
          const fiveMinutes = 5 * 60 * 1000;
          return (
            applied.mentorId !== mentor.memberId || timeDiff >= fiveMinutes
          );
        }
      );

      updatedAppliedMentors.push({
        mentorId: mentor.memberId,
        timestamp: Date.now(),
      });

      localStorage.setItem(
        'appliedMentors',
        JSON.stringify(updatedAppliedMentors)
      );
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'status' in err.response &&
        err.response.status === 404
      ) {
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
            <div className="flex items-start gap-4 2xl:gap-6">
              <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1 flex-shrink-0">
                <span className="text-3xl 2xl:text-[40px] text-gray-1 font-bold">
                  멘토링
                </span>
                <Divider className="flex-shrink-0" />
                <Link
                  to="/mentoring-random"
                  className="text-3xl 2xl:text-[40px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  랜덤 검색
                </Link>
              </h1>

              <div className="relative flex-1 min-w-0 max-w-[600px] 2xl:max-w-[800px] self-center">
                <div className="absolute left-3 2xl:left-5 top-1/2 -translate-y-1/2 z-10">
                  <SearchIcon className="w-5 h-5 2xl:w-6 2xl:h-6" />
                </div>
                <input
                  type="text"
                  placeholder="전공 또는 멘토의 이름을 입력해주세요."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="2xl:w-full w-100 h-11 2xl:h-14 rounded-full bg-white-1 border border-gray-4 pl-10 2xl:pl-14 pr-4 py-1 text-base 2xl:text-[24px] text-gray-1 placeholder:text-gray-3 focus:outline-main-1 font-bold"
                />
              </div>
            </div>
          </div>
          <div className="h-16 bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0)_100%)]"></div>
        </div>

        <div className="px-7 2xl:px-12 pt-[120px] 2xl:pt-[220px] pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
              {Array.from({ length: 9 }).map((_, index) => (
                <Mentor
                  key={`loading-${index}`}
                  name=""
                  generation={0}
                  major=""
                  onApply={undefined}
                />
              ))}
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
              {mentors.map((mentor) => (
                <Mentor
                  key={mentor.memberId}
                  name={mentor.name}
                  generation={mentor.generation}
                  major={mentor.major}
                  onApply={() => handleMentorApply(mentor)}
                />
              ))}
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] mt-[20px]">
              <div className="mb-12 flex items-center justify-center">
                <div className="w-64 h-64 2xl:w-80 2xl:h-80 flex items-center justify-center overflow-hidden">
                  <img
                    src={NotFoundImage}
                    alt="멘토 일러스트"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <p className="text-[16px] 2xl:text-[20px] font-bold text-gray-1 text-center mb-16">
                일치하는 멘토를 찾지 못했어요.
                <br />
                랜덤 멘토링을 해볼까요?
              </p>

              <button
                onClick={() => navigate('/mentoring-random')}
                className="w-[152px] h-[64px] bg-main-1 text-white text-[24px] rounded-[10px] 2xl:rounded-[12px] transition-all duration-300 font-bold hover:bg-main-1-hover border-0 cursor-pointer"
              >
                랜덤 멘토링
              </button>
            </div>
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-[32px] text-gray-3 font-bold">
                등록된 멘토가 없습니다.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
