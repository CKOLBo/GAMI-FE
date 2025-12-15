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
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-6">
      <div className="flex items-center gap-4">
        <Profile />

        <div>
          <p className="font-semibold text-gray-900">{name}</p>

          <div className="mt-1 flex gap-2">
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
              {generation}기
            </span>
            <span className="rounded bg-indigo-200 px-2 py-0.5 text-xs text-indigo-700">
              {major}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onApply}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-100 transition"
      >
        멘토 신청
      </button>
    </div>
  );
}
