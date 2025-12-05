import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}
