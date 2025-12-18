interface ProfileInfoItemProps {
  label: string;
  value: string;
}

export default function ProfileInfoItem({
  label,
  value,
}: ProfileInfoItemProps) {
  return (
    <div className="w-full max-w-[492px] max-h-[60px] bg-white rounded-lg border border-gray-2 px-6 2xl:px-7 py-4 2xl:py-5 flex items-center justify-between">
      <span className="text-sm 2xl:text-base font-medium text-gray-3">
        {label}
      </span>
      <span className="text-base 2xl:text-lg font-semibold text-gray-1">
        {value}
      </span>
    </div>
  );
}
