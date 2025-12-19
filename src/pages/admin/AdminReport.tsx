import { useState } from 'react';

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function AdminReport() {
    const [reports] = useState([
      { id: 1, status: '보류', reporter: '문강현', reason: '게시판 목적과 맞지 않는 내용' },
      { id: 2, status: '보류', reporter: '문강현', reason: '음란·불쾌한 내용' },
      { id: 3, status: '보류', reporter: '문강현', reason: '게시판 목적과 맞지 않는 내용' },
      { id: 4, status: '보류', reporter: '문강현', reason: '개인정보 노출' },
      { id: 5, status: '보류', reporter: '문강현', reason: '게시판 목적과 맞지 않는 내용' },
    ]);
  
    return (
      <div className="flex flex-col items-center px-4">
        <div className="w-full max-w-[1300px]">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-[#F9F9F9] mb-8 h-[80px] rounded-lg px-12 flex items-center gap-4"
            >
              <span className="text-2xl font-bold shrink-0 w-[60px] text-center">
                {report.id}
              </span>

              <div className="shrink-0 w-[140px] pl-22 flex justify-center">
                <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-white whitespace-nowrap">
                  <span className="text-sm font-medium text-[#FFAC0B]">
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

              <div className="shrink-0 w-[160px] pr-28 flex justify-center">
                <button className="flex items-center gap-2 px-[14px] py-[10px] bg-main-1 text-white rounded-md whitespace-nowrap">
                  <Search className="w-4 h-4" />
                  <span className="text-xl font-semibold">추가설명</span>
                </button>
              </div>

              <div className="shrink-0 w-[120px] flex justify-center">
                <button className="text-main-1 font-semibold text-2xl whitespace-nowrap">
                  바로가기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  