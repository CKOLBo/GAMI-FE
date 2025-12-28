import { useState, useEffect } from 'react';
import CheckReportModal from '@/assets/components/modal/CheckReportModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { instance } from '@/assets/shared/lib/axios';
import { AxiosError } from 'axios';

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

interface Report {
  id: number;
  reportType: string;
  reportResult: string;
  reporterName: string;
  reportedPostId: number;
}

interface AdminReportProps {
  currentPage: number;
  onTotalPagesChange: (totalPages: number) => void;
}

export default function AdminReport({
  currentPage,
  onTotalPagesChange,
}: AdminReportProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(allReports.length / itemsPerPage);
    onTotalPagesChange(totalPages);
  }, [allReports, onTotalPagesChange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await instance.get<Report[]>('/api/admin/report');
      setAllReports(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.code === 'ECONNREFUSED' ||
          err.message.includes('Network Error')
        ) {
          toast.error(
            '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
          );
        } else if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          toast.error('권한이 없습니다. 다시 로그인해주세요.');
        } else {
          toast.error('신고 목록을 불러오는데 실패했습니다.');
        }
      } else {
        toast.error('오류가 발생했습니다.');
      }
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = allReports.slice(startIndex, endIndex);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '보류';
      case 'APPROVED':
        return '제재';
      case 'REJECTED':
        return '기각';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-[#FFAC0B]';
      case 'APPROVED':
        return 'text-main-3';
      case 'REJECTED':
        return 'text-[#34C759]';
      default:
        return 'text-gray-400';
    }
  };

  const getReasonText = (type: string) => {
    switch (type) {
      case 'SPAM':
        return '광고·홍보·스팸';
      case 'AVERSION':
        return '욕설·비하·혐오 표현';
      case 'EXPOSURE':
        return '개인정보 노출';
      case 'LEWD':
        return '음란·불쾌한 내용';
      case 'INAPPROPRIATE':
        return '게시판 목적과 맞지 않는 내용';
      case 'ETC':
        return '기타';
      default:
        return type;
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleReportAction = (
    action: 'BLOCK' | 'REJECT' | 'HOLD',
    reportId: number
  ) => {
    const reportResultMap = {
      BLOCK: 'APPROVED',
      REJECT: 'REJECTED',
      HOLD: 'PENDING',
    } as const;

    setAllReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, reportResult: reportResultMap[action] }
          : report
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-3">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-[1300px]">
        {allReports.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-2xl font-semibold text-gray-3">
              신고 내역이 없습니다.
            </div>
          </div>
        ) : (
          currentReports.map((report) => (
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
                    className={`text-lg font-semibold ${getStatusColor(report.reportResult)}`}
                  >
                    {getStatusText(report.reportResult)}
                  </span>
                </button>
              </div>

              <span className="text-2xl font-semibold text-gray-3 shrink-0 w-[140px] pl-32 text-center whitespace-nowrap">
                {report.reporterName}
              </span>

              <span className="text-2xl font-semibold text-gray-3 pl-14 text-center flex-1 truncate whitespace-nowrap">
                {getReasonText(report.reportType)}
              </span>

              <div className="shrink-0 w-40 pr-28 flex justify-center">
                <button
                  onClick={() => handleReportClick(report)}
                  className="flex cursor-pointer items-center gap-2 px-3.5 py-2.5 bg-main-1 text-white rounded-md whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-xl font-semibold">추가설명</span>
                </button>
              </div>

              <div className="shrink-0 w-[120px] flex justify-center">
                <button
                  onClick={() =>
                    navigate(`/post-content/${report.reportedPostId}`)
                  }
                  className="text-main-1 font-semibold cursor-pointer text-2xl whitespace-nowrap"
                >
                  바로가기
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {isModalOpen && selectedReport && (
        <CheckReportModal
          reportId={selectedReport.id}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReport(null);
          }}
          onAction={(action) => {
            handleReportAction(action, selectedReport.id);
          }}
        />
      )}
    </div>
  );
}
