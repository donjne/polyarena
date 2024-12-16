import { MainNav } from '@/components/layout/MainNav';

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#E6E6FA]">
      <MainNav />
      {children}
    </div>
  );
}