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
      className={`border border-solid rounded-md text-sm font-medium p-4 w-[49%] cursor-pointer transition-all duration-300 outline-none ${
        isSelected
          ? 'bg-[#BFA9FF] text-white border-[#BFA9FF]'
          : 'bg-white border-[#B7BCC8] text-[#6D6F79] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
      }`}
    >
      {label}
    </button>
  );
}
