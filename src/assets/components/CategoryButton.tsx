interface CategoryButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryButton({
  label,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-[12px] py-[12px] rounded-full text-[14px] font-[500] transition-all duration-200 ${
        isSelected
          ? 'bg-[#BFA9FF] border-[#BFA9FF] border-[2px] text-[#ffffff]'
          : 'bg-[#ffffff] text-[#6D6F79] border-[2px] border-[#B7BCC8] hover:bg-[#BFA9FF]'
      }`}
    >
      {label}
    </button>
  );
}
