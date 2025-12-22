interface GenderButtonProps {
  gender: 'male' | 'female';
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function GenderButton({
  label,
  isSelected,
  onClick,
}: GenderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border rounded-xl font-medium p-4 w-[49%] cursor-pointer transition-all duration-300 outline-none ${
        isSelected
          ? 'bg-main-2 text-white border-main-2'
          : 'bg-white border-gray-2 text-gray-3 hover:border-main-2 hover:text-main-2'
      }`}
    >
      {label}
    </button>
  );
}
