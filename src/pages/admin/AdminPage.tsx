import Sidebar from '@/assets/components/Sidebar';
import AdminHead from '@/pages/admin/AdminHead';
import AdminReport from '@/pages/admin/AdminReport';
import { useState } from 'react';

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="ml-25 mt-16 mb-10">
          <h2 className="font-bold text-gray-1 text-[40px]">관리자</h2>
        </div>
        <div className="flex justify-center flex-col items-center">
          <div className="w-full flex justify-center mb-8">
            <AdminHead />
          </div>
          <div className="w-full">
            <AdminReport />
          </div>
          <hr className="max-w-[1300px] w-full" />
          <div className="flex justify-center gap-2 mt-8 pb-6">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-[50px] h-[50px] rounded-2xl font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-gray-4 text-black'
                    : 'bg-white border border-gray-4 text-black hover:bg-[#F9F9F9]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
