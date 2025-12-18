import Profile from '@/assets/svg/profile/Profile';

interface MentorProps {
  name: string;
  generation: number;
  major: string;
  onApply?: () => void;
}

export default function Mentor({
  name,
  generation,
  major,
  onApply,
}: MentorProps) {
  return (
    <div
      className="relative w-[468px] h-[228px] rounded-[18px] bg-white p-3 shadow-GMAI"
    >
      <div className="flex items-start gap-5 h-full">
        <div className="flex-shrink-0 mt-4 ml-4">
          <Profile />
        </div>

        <div className="flex flex-col justify-start pt-8">
          <p className="font-bold text-gray-1 text-[24px] mb-3">{name}</p>

          <div className="flex gap-2">
            <span className="rounded-md px-3 py-0.3 text-white text-[20px] font-semibold bg-main-1">
              {generation}기
            </span>
            <span className="rounded-md px-3 py-0.3 text-white text-[20px] font-semibold bg-main-2">
              {major}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onApply}
        className="absolute bottom-4 right-4 rounded-[10px] bg-white-1 px-8 py-4 text-[24px] text-gray-1 font-bold transition-colors"
      >
        멘토 신청
      </button>
    </div>
  );
}
