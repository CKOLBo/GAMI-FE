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
        <div className="ml-25 mt-25 mb-15">
          <h2 className="font-bold text-gray-1 text-[40px]">관리자</h2>
        </div>
        <div className="flex justify-center flex-col items-center">
          <div className="w-full flex justify-center mb-10">
            <AdminHead />
          </div>
          <div className='w-full'>
            <AdminReport />
          </div>
          <hr className="max-w-[1300px] w-full" />
          <div className="flex justify-center gap-2 mt-8 pb-8">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
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
