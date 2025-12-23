interface XProps {
  color?: string;
}

export default function X({ color = '#6D6F79' }: XProps) {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.75 6.04175L7.25 20.5417M7.25 6.04175L21.75 20.5417"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
