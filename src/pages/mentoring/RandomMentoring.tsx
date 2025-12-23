import Sidebar from '@/assets/components/Sidebar';
import Divider from '@/assets/svg/Divider';
import { Link } from 'react-router-dom';
import Mentor from '@/assets/svg/mentor/Mentor.png';

export default function RandomMentoring() {
  const handleRandomSearch = () => {
    console.log('랜덤 검색 시작');
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
              onClick={handleRandomSearch}
              className="w-[376px] h-13 2xl:h-15 bg-main-1 text-white text-[24px] rounded-[10px] 2xl:rounded-[12px] transition-all duration-300 font-bold hover:bg-main-1-hover border-0 cursor-pointer"
            >
              랜덤 검색
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
