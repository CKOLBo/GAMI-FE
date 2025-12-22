import { useState } from 'react';
import CheckReportModal from '@/assets/components/modal/CheckReportModal';
import { useNavigate } from 'react-router-dom';

const Search = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default function AdminReport() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports] = useState([
    {
      id: 1,
      status: '보류',
      reporter: '문강현',
      reason: '게시판 목적과 맞지 않는 내용',
    },
    { id: 2, status: '제재', reporter: '문강현', reason: '음란·불쾌한 내용' },
    {
      id: 3,
      status: '기각',
      reporter: '문강현',
      reason: '게시판 목적과 맞지 않는 내용',
    },
    { id: 4, status: '보류', reporter: '문강현', reason: '개인정보 노출' },
    {
      id: 5,
      status: '보류',
      reporter: '문강현',
      reason: '게시판 목적과 맞지 않는 내용',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '보류':
        return 'text-[#FFAC0B]';
      case '제재':
        return 'text-main-3';
      case '기각':
        return 'text-[#34C759]';
      default:
        return 'text-gray-400';
    }
  };

  const handleReportClick = () => {
    setIsModalOpen(true);
  };

  const handleReportAction = (action: 'BLOCK' | 'REJECT' | 'HOLD') => {
    console.log(action);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-[1300px]">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[#F9F9F9] mb-8 h-20 rounded-lg px-12 flex items-center gap-4"
          >
            <span className="text-2xl font-bold shrink-0 w-[60px] text-center">
              {report.id}
            </span>

            <div className="shrink-0 w-[140px] pl-22 flex justify-center">
              <button className="flex items-center gap-2 px-10 py-2 rounded-md bg-white whitespace-nowrap">
                <span
                  className={`text-lg font-semibold ${getStatusColor(report.status)}`}
                >
                  {report.status}
                </span>
              </button>
            </div>

            <span className="text-2xl font-semibold text-gray-3 shrink-0 w-[140px] pl-32 text-center whitespace-nowrap">
              {report.reporter}
            </span>

            <span className="text-2xl font-semibold text-gray-3 pl-14 text-center flex-1 truncate whitespace-nowrap">
              {report.reason}
            </span>

            <div className="shrink-0 w-40 pr-28 flex justify-center">
              <button
                onClick={() => handleReportClick()}
                className="flex cursor-pointer items-center gap-2 px-3.5 py-2.5 bg-main-1 text-white rounded-md whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                <span className="text-xl font-semibold">추가설명</span>
              </button>
            </div>

            <div className="shrink-0 w-[120px] flex justify-center">
              <button
                onClick={() => navigate('/post-content')}
                className="text-main-1 font-semibold cursor-pointer text-2xl whitespace-nowrap"
              >
                바로가기
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <CheckReportModal
          onClose={() => setIsModalOpen(false)}
          onAction={handleReportAction}
        />
      )}
    </div>
  );
}
