import Profile from '@/assets/svg/profile/Profile';

interface RequestItemProps {
  name: string;
  onCancel: () => void;
  isRemoving?: boolean;
}

export default function RequestItem({
  name,
  onCancel,
  isRemoving = false,
}: RequestItemProps) {
  return (
    <div
      className={`mb-3 mx-4 2xl:mx-6 px-2 2xl:px-3 py-2 2xl:py-3 rounded-lg bg-white-1 flex items-center gap-1 2xl:gap-2 transition-all duration-300 ease-in-out ${
        isRemoving
          ? 'opacity-0 translate-y-2 max-h-0 mb-0 py-0 overflow-hidden'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex-shrink-0">
        <div className="w-12 2xl:w-14 h-10 2xl:h-12 rounded-full flex items-center justify-center">
          <Profile width={40} height={40} className="text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm 2xl:text-lg font-semibold text-gray-1 truncate">
          {name}님한테 요청을 보냈어요.
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-lg bg-white text-gray-1 text-sm 2xl:text-base font-semibold hover:bg-gray-5 transition-colors whitespace-nowrap flex-shrink-0"
      >
        취소
      </button>
    </div>
  );
}
