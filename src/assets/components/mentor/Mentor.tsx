import Profile from '@/assets/svg/profile/Profile';

interface MentorProps {
  name: string;
  generation: number;
  major: string;
  onApply?: () => void;
  isApplied?: boolean;
}

export default function Mentor({
  name,
  generation,
  major,
  onApply,
  isApplied = false,
}: MentorProps) {
  const isEmpty = !name && generation === 0 && !major;

  return (
    <div className="relative 2xl:w-[468px] 2xl:h-[228px] w-[360px] h-[180px] 2xl:rounded-[18px] rounded-[16px] bg-white p-3 shadow-GAMI">
      <div className="flex items-start gap-3 2xl:gap-5 h-full">
        <div className="flex-shrink-0 mt-2 2xl:mt-4 ml-2 2xl:ml-4">
          {isEmpty ? (
            <div className="opacity-30">
              <Profile
                width={100}
                height={100}
                className="2xl:w-[100px] 2xl:h-[100px] w-[70px] h-[70px]"
              />
            </div>
          ) : (
            <Profile
              width={100}
              height={100}
              className="2xl:w-[100px] 2xl:h-[100px] w-[70px] h-[70px]"
            />
          )}
        </div>

        <div className="flex flex-col justify-start pt-4.5 2xl:pt-8">
          {isEmpty ? (
            <div className="h-[24px] 2xl:h-[28px] w-32 bg-gray-4 rounded mb-1 2xl:mb-3 animate-pulse"></div>
          ) : (
            <p className="font-bold text-gray-1 2xl:text-[24px] text-[18px] mb-1 2xl:mb-3">
              {name}
            </p>
          )}

          <div className="flex gap-2">
            {isEmpty ? (
              <>
                <div className="rounded-[3px] px-2 2xl:px-3 py-0.2 2xl:py-0.3 bg-gray-4 h-[28px] w-16 animate-pulse"></div>
                <div className="rounded-[3px] px-2 2xl:px-3 py-0.2 2xl:py-0.3 bg-gray-4 h-[28px] w-24 animate-pulse"></div>
              </>
            ) : (
              <>
                <span className="rounded-[3px] px-2 2xl:px-3 py-0.2 2xl:py-0.3 text-white 2xl:text-[20px] text-[14px] font-semibold bg-main-1">
                  {generation}기
                </span>
                <span className="rounded-[3px] px-2 2xl:px-3 py-0.2 2xl:py-0.3 text-white 2xl:text-[20px] text-[14px] font-semibold bg-main-2">
                  {major}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="absolute bottom-4 right-4 rounded-[10px] bg-gray-4 px-8 py-4 h-[48px] w-[120px] animate-pulse"></div>
      ) : isApplied ? (
        <button
          disabled
          className="absolute bottom-3 2xl:bottom-4 right-3 2xl:right-4 rounded-[7px] 2xl:rounded-[10px] bg-gray-4 px-5 2xl:px-8 py-2.5 2xl:py-4 text-[18px] 2xl:text-[24px] text-gray-3 font-bold cursor-not-allowed"
        >
          신청 완료
        </button>
      ) : (
        <button
          onClick={onApply}
          className="absolute bottom-3 2xl:bottom-4 right-3 2xl:right-4 rounded-[7px] 2xl:rounded-[10px] bg-white-1 px-5 2xl:px-8 py-2.5 2xl:py-4 text-[18px] 2xl:text-[24px] text-gray-1 font-bold transition-colors hover:bg-gray-4"
        >
          멘토 신청
        </button>
      )}
    </div>
  );
}
