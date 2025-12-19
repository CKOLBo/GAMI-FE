interface BellIconProps {
  className?: string;
}

export default function BellIcon({ className }: BellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M10 2.5C7.23858 2.5 5 4.73858 5 7.5V11.25L3.75 12.5V13.75H16.25V12.5L15 11.25V7.5C15 4.73858 12.7614 2.5 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13.75V15C7.5 16.3807 8.61929 17.5 10 17.5C11.3807 17.5 12.5 16.3807 12.5 15V13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

