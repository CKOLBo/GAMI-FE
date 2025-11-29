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
          ? 'bg-[#BFA9FF] border-[#BFA9FF] text-[#ffffff]'
          : 'bg-[#ffffff] text-[#6D6F79] border-2 border-[#B7BCC8] hover:bg-[#AA8EFF]'
      }`}
    >
      {label}
    </button>
  );
}
