import Sidebar from '@/assets/components/Sidebar';
import Mentor from '@/assets/components/mentor/Mentor';
import SearchIcon from '@/assets/svg/main/SearchIcon';
import Divider from '@/assets/svg/Divider';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface MentorData {
  id: number;
  name: string;
  gender: string;
  generation: number;
  major: string;
}

export default function MentoringPage() {
  const [allMentors, setAllMentors] = useState<MentorData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get('/data/mockMentors.json')
      .then((res) => {
        setAllMentors(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const mentors = useMemo(() => {
    if (searchQuery.trim() === '') {
      return allMentors;
    }
    return allMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.major.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allMentors]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 ml-45 2xl:ml-55">
        <div className="fixed top-0 left-45 2xl:left-55 right-0 z-40">
          <div className="px-25 pt-25 bg-white">
            <div className="flex items-center">
              <h1 className="flex items-center gap-4 text-[40px] font-bold text-gray-1">
                <span className="text-[40px] text-gray-1 font-bold">
                  멘토링
                </span>
                <Divider className="flex-shrink-0" />
                <Link
                  to="/mentoring-random"
                  className="text-[32px] text-gray-2 font-bold hover:text-gray-1 transition-colors cursor-pointer"
                >
                  랜덤 멘토링
                </Link>
              </h1>

              <div className="ml-25 relative w-150">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="전공 또는 멘토의 이름을 입력해주세요."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 rounded-full bg-white-1 border border-gray-4 pl-16 pr-4 py-2 text-[24px] text-gray-1 placeholder:text-gray-3 focus:outline-main-1 font-bold"
                />
              </div>
            </div>
          </div>
          <div className="h-16 bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0)_100%)]"></div>
        </div>

        <div className="px-25 pt-[220px] pb-25">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {mentors.length > 0 ? (
              mentors.map((mentor) => (
                <Mentor
                  key={mentor.id}
                  name={mentor.name}
                  generation={mentor.generation}
                  major={mentor.major}
                  onApply={() => {
                    console.log(`${mentor.name} 멘토 신청`);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-[32px] text-gray-3 font-bold">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
