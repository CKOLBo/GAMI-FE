import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { instance, TokenRefreshError } from '@/assets/shared/lib/axios';
import Sidebar from '@/assets/components/Sidebar';
import CategoryButton from '@/assets/components/Button/CategoryButton';
import EditPassword from '@/assets/components/modal/EditPassword';
import ProfileIcon from '@/assets/svg/profile/Profile';
import ProfileInfoItem from '@/assets/components/Profile/ProfileInfoItem';
import { interestList } from '@/assets/shared/ListData';

interface MemberProfile {
  memberId: number;
  name: string;
  gender: 'MALE' | 'FEMALE';
  generation: number;
  major: 'FRONTEND' | 'BACKEND' | 'ANDROID' | 'IOS' | 'DESIGN';
}

const majorToInterestMap: Record<string, string> = {
  FRONTEND: 'FE',
  BACKEND: 'BE',
  ANDROID: 'AOS',
  IOS: 'iOS',
  DESIGN: 'Design',
};

export default function MyPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [memberData, setMemberData] = useState<MemberProfile | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [tempSelectedInterest, setTempSelectedInterest] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await instance.get<MemberProfile>('/api/member');
        const data = response.data;

        setMemberData(data);

        const interestId = majorToInterestMap[data.major];
        if (interestId) {
          setSelectedInterest(interestId);
          setTempSelectedInterest(interestId);
        } else {
          const DEFAULT_INTEREST = 'FE';
          console.warn(
            `'${data.major}'에 해당하는 전공을 찾을 수 없어 기본값 '${DEFAULT_INTEREST}'로 설정합니다.`
          );
          setSelectedInterest(DEFAULT_INTEREST);
          setTempSelectedInterest(DEFAULT_INTEREST);
        }
      } catch (err) {
        if (err instanceof TokenRefreshError) {
          toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          toast.error('프로필 조회에 실패했습니다.');
        }
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleInterest = (id: string) => {
    if (!isEditingCategory) {
      setIsEditingCategory(true);
      setTempSelectedInterest(selectedInterest);
    }
    setTempSelectedInterest((prev) => (prev === id ? '' : id));
  };

  const handleCategoryCancel = () => {
    setTempSelectedInterest(selectedInterest);
    setIsEditingCategory(false);
  };

  const handleCategorySave = async () => {
    try {
      const majorKey = Object.keys(majorToInterestMap).find(
        (key) => majorToInterestMap[key] === tempSelectedInterest
      );

      if (majorKey) {
        await instance.patch('/api/member/major', { major: majorKey });
        setSelectedInterest(tempSelectedInterest);
        toast.success('전공이 수정되었습니다.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('전공 수정에 실패했습니다.');
    } finally {
      setIsEditingCategory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-45 xl:ml-55 min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-400">프로필 로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!memberData) return null;

  const genderText = memberData.gender === 'MALE' ? '남성' : '여성';

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-45 xl:ml-55 min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-8 w-full max-w-2xl">
          <div className="mb-6 2xl:mb-8">
            <ProfileIcon className="w-40 h-40" />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-lg font-medium text-main-1 cursor-pointer border-0 bg-transparent"
            >
              비밀번호 변경
            </button>
          </div>
        </div>

        <div className="flex flex-row justify-center w-full max-w-2xl">
          <div className="flex flex-col w-[492px] gap-4 2xl:gap-5">
            <ProfileInfoItem
              label="기수"
              value={`${memberData.generation}기`}
            />
            <ProfileInfoItem label="이름" value={memberData.name} />
            <ProfileInfoItem label="성별" value={genderText} />
          </div>
        </div>

        <div className="max-w-[376px] mt-12 2xl:mt-6">
          <div className="flex flex-wrap justify-center gap-2.5 2xl:gap-3 mb-7">
            {interestList.map((interest) => (
              <CategoryButton
                key={interest.id}
                label={interest.label}
                isSelected={
                  isEditingCategory
                    ? tempSelectedInterest === interest.id
                    : selectedInterest === interest.id
                }
                onClick={() => toggleInterest(interest.id)}
              />
            ))}
          </div>

          {isEditingCategory && (
            <div className="flex gap-6 justify-center">
              <button
                type="button"
                onClick={handleCategoryCancel}
                className="p-2.5 w-20 h-15 border cursor-pointer border-gray-2 text-xl text-main-3 rounded-xl hover:bg-gray-50 transition-colors bg-white"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCategorySave}
                className="p-2.5 w-20 h-15 bg-main-2 text-white text-xl rounded-xl hover:bg-main-2-hover transition-colors cursor-pointer"
              >
                수정
              </button>
            </div>
          )}
        </div>

        {isPasswordModalOpen && (
          <EditPassword onClose={() => setIsPasswordModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
