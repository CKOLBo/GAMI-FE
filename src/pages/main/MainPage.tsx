import Sidebar from '@/components/Sidebar';

export default function MainPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1"></div>
    </div>
  );
}
