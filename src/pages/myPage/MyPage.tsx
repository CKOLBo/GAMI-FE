import { useState } from 'react';
import Sidebar from '@/assets/components/Sidebar';
import CategoryButton from '@/assets/components/Button/CategoryButton';
import EditPassword from '@/assets/components/modal/EditPassword';
import ProfileIcon from '@/assets/svg/profile/Profile';
import ProfileInfoItem from '@/assets/components/Profile/ProfileInfoItem';
import Line from '@/assets/svg/profile/Line';
import { interestList } from '@/assets/shared/ListData';

export default function MyPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['FE']);
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>(['FE']);

  const userInfo = {
    generation: '9기',
    studentId: '1206',
    name: '문강현',
    gender: '남성',
  };

  const toggleInterest = (id: string) => {
    if (!isEditingCategory) {
      setIsEditingCategory(true);
      setTempSelectedInterests(selectedInterests);
    }
    setTempSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategoryCancel = () => {
    setTempSelectedInterests(selectedInterests);
    setIsEditingCategory(false);
  };

  const handleCategorySave = () => {
    setSelectedInterests(tempSelectedInterests);
    setIsEditingCategory(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center mt-10">
        <div className="flex flex-col items-center mb-8 w-full max-w-2xl">
          <div className="mb-6 2xl:mb-8">
            <ProfileIcon />
          </div>

          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              className="text-lg font-medium text-main-1 cursor-pointer border-0 bg-transparent"
            >
              프로필 변경
            </button>
            <Line />
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
            <ProfileInfoItem label="기수" value={userInfo.generation} />
            <ProfileInfoItem label="학번" value={userInfo.studentId} />
            <ProfileInfoItem label="이름" value={userInfo.name} />
            <ProfileInfoItem label="성별" value={userInfo.gender} />
          </div>
        </div>

        <div className="max-w-[368px] mt-12 2xl:mt-6">
          <div className="flex flex-wrap justify-center gap-2.5 2xl:gap-3 mb-7">
            {interestList.map((interest) => (
              <CategoryButton
                key={interest.id}
                label={interest.label}
                isSelected={
                  isEditingCategory
                    ? tempSelectedInterests.includes(interest.id)
                    : selectedInterests.includes(interest.id)
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
                className="p-[10px] w-20 h-15 border cursor-pointer border-gray-2 text-xl text-main-3 rounded-xl hover:bg-gray-50 transition-colors bg-white"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCategorySave}
                className="p-[10px] w-20 h-15 bg-main-2 text-white text-xl rounded-xl hover:bg-main-2-hover transition-colors cursor-pointer"
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
