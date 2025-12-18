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
      className={`px-3.5 py-3 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-main-2 border-main-2 border text-white'
          : 'bg-white text-gray-3 border border-gray-2 hover:border-main-2 hover:text-main-2'
      }`}
    >
      {label}
    </button>
  );
}
