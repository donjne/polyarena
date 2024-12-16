// app/clan/layout.tsx
import { MainNav } from '@/components/layout/MainNav';

export default function ClanLayout({
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