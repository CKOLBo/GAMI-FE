import { toast } from 'react-toastify';
import { instance } from '@/assets/shared/lib/axios';
import axios from 'axios';

const APPLIED_MENTORS_STORAGE_KEY = 'appliedMentors';
const MENTOR_APPLY_COOLDOWN_MS = 5 * 60 * 1000;

interface MentorData {
  memberId: number;
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  generation?: number;
  major?: string;
}

interface UseMentorApplyReturn {
  apply: (mentor: MentorData, onSuccess?: () => void) => Promise<void>;
}

export function useMentorApply(): UseMentorApplyReturn {
  const apply = async (
    mentor: MentorData,
    onSuccess?: () => void
  ): Promise<void> => {
    const appliedMentors = JSON.parse(
      localStorage.getItem(APPLIED_MENTORS_STORAGE_KEY) || '[]'
    );

    const recentApplication = appliedMentors.find(
      (applied: { mentorId: number; timestamp: number }) => {
        const timeDiff = Date.now() - applied.timestamp;
        return (
          applied.mentorId === mentor.memberId &&
          timeDiff < MENTOR_APPLY_COOLDOWN_MS
        );
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
          return (
            applied.mentorId !== mentor.memberId ||
            timeDiff >= MENTOR_APPLY_COOLDOWN_MS
          );
        }
      );

      updatedAppliedMentors.push({
        mentorId: mentor.memberId,
        timestamp: Date.now(),
      });

      localStorage.setItem(
        APPLIED_MENTORS_STORAGE_KEY,
        JSON.stringify(updatedAppliedMentors)
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          toast.error('인증이 필요합니다.');
        } else if (status === 404) {
          toast.error('멘토를 찾을 수 없습니다.');
        } else if (status === 409) {
          toast.error('이미 신청한 멘토링입니다.');
        } else if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
          toast.error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        } else if (status === 500) {
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else if (!err.response) {
          toast.error('네트워크 연결을 확인해주세요.');
        } else {
          toast.error('신청에 실패했습니다.');
        }
      } else {
        toast.error('신청에 실패했습니다.');
      }
    }
  };

  return { apply };
}
