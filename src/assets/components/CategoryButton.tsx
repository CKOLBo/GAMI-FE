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
      type="button"
      onClick={onClick}
      className={`px-[12px] py-[12px] rounded-full text-[14px] font-[500] transition-all duration-200 ${
        isSelected
          ? 'bg-[#BFA9FF] border-[#BFA9FF] border-[1px] text-[#ffffff]'
          : 'bg-[#ffffff] text-[#6D6F79] border-[1px] border-[#B7BCC8] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
      }`}
    >
      {label}
    </button>
  );
}
