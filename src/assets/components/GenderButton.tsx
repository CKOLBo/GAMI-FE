interface GenderButtonProps {
  gender: 'male' | 'female';
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function GenderButton({
  gender,
  label,
  isSelected,
  onClick,
}: GenderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-[1px] border-[solid] rounded-[6px] text-[14px] font-[500] p-[16px] w-[49%] cursor-pointer transition-all duration-[300ms] outline-none ${
        isSelected
          ? 'bg-[#BFA9FF] text-white border-[#BFA9FF]'
          : 'bg-[white] border-[#B7BCC8] text-[#6D6F79] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
      }`}
    >
      {label}
    </button>
  );
}
