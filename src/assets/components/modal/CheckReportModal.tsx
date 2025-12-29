import ModalWrapper from '@/assets/shared/Modal';
import Button from '@/assets/components/Button/Button';
import { useEffect, useState } from 'react';
import { instance } from '@/assets/shared/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ReportModalProps {
  reportId: number;
  onClose: () => void;
  onAction: (action: 'BLOCK' | 'REJECT' | 'HOLD') => void;
}

interface ReportDetail {
  id: number;
  reportType: string;
  targetId: number;
  reason: string;
  reportAction: string;
  memberRole: string;
  processedAt: string;
}

export default function CheckReportModal({
  reportId,
  onClose,
  onAction,
}: ReportModalProps) {
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchReportDetail = async () => {
      try {
        setLoading(true);
        const response = await instance.get<ReportDetail>(
          `/api/admin/report/${reportId}`
        );
        if (!mounted) return;
        setReportDetail(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 403) {
            toast.error('관리자 권한이 없습니다.');
          } else if (err.response?.status === 404) {
            toast.error('신고를 찾을 수 없습니다.');
          } else {
            toast.error('신고 상세 정보를 불러오는데 실패했습니다.');
          }
        } else {
          toast.error('오류가 발생했습니다.');
        }
        onClose();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReportDetail();
    return () => {
      mounted = false;
    };
  }, [reportId, onClose]);

  const handleReportAction = async (action: 'BLOCK' | 'REJECT' | 'HOLD') => {
    if (!reportDetail || processing) return;

    const reportResultMap = {
      BLOCK: 'APPROVED',
      REJECT: 'REJECTED',
      HOLD: 'PENDING',
    } as const;

    try {
      setProcessing(true);
      await instance.post(`/api/admin/report/${reportId}`, {
        reportResult: reportResultMap[action],
        reportAction: 'NONE',
      });

      onAction(action);
      onClose();
      toast.success('처리가 완료되었습니다.');
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          toast.error('관리자 권한이 없습니다.');
        } else if (err.response?.status === 404) {
          toast.error('신고를 찾을 수 없습니다.');
        } else {
          toast.error('신고 처리 중 오류가 발생했습니다.');
        }
      } else {
        toast.error('오류가 발생했습니다.');
      }
    } finally {
      setProcessing(false);
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

  if (loading) {
    return (
      <ModalWrapper className="px-10 py-10">
        <div className="w-[1350px] flex items-center justify-center">
          <div className="text-2xl font-semibold text-gray-3">로딩 중...</div>
        </div>
      </ModalWrapper>
    );
  }

  if (!reportDetail) return null;

  return (
    <ModalWrapper className="px-10 py-10">
      <div className="w-[1270px]">
        <h2 className="text-[32px] font-bold text-gray-1 mb-13">게시글 신고</h2>

        <p className="mb-7 text-2xl font-semibold text-gray-1">
          문제가 되는 이유를 확인하고 처리해 주세요.
        </p>

        <div className="mb-15">
          <div className="w-94 px-6 py-4 border border-gray-2 rounded-lg text-xl">
            {getReasonText(reportDetail.reportType)}
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-2xl mb-9 font-semibold">추가 설명</label>
          <div className="w-full h-40 p-6 border border-gray-2 rounded-lg text-xl whitespace-pre-wrap overflow-y-auto">
            {reportDetail.reason || '추가 설명이 없습니다.'}
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-9 py-4 border border-gray-2 text-2xl font-bold rounded-xl disabled:opacity-50"
          >
            취소
          </button>

          <Button
            width="w-[114px]"
            text="제재"
            color="bg-main-3"
            disabled={processing}
            onClick={() => handleReportAction('BLOCK')}
          />

          <Button
            width="w-[114px]"
            text="기각"
            color="bg-[#34C759]"
            disabled={processing}
            onClick={() => handleReportAction('REJECT')}
          />

          <Button
            width="w-[114px]"
            text="보류"
            color="bg-[#FFAC0B]"
            disabled={processing}
            onClick={() => handleReportAction('HOLD')}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
