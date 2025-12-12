interface ModalWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModalWrapper({
  children,
  className = '',
}: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div
        className={`relative z-10 rounded-[20px] bg-white px-10 py-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
