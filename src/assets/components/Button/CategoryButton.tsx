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
      className={`px-3.5 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-[#BFA9FF] border-[#BFA9FF] border text-white'
          : 'bg-white text-[#6D6F79] border border-[#B7BCC8] hover:border-[#BFA9FF] hover:text-[#BFA9FF]'
      }`}
    >
      {label}
    </button>
  );
}
