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
      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-purple-400 text-white'
          : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-[#AA8EFF]'
      }`}
    >
      {label}
    </button>
  );
}
