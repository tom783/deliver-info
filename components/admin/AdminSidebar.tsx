import Link from 'next/link';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">Delivery Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          asChild
        >
          <Link href="/admin">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            대시보드
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          asChild
        >
          <Link href="/admin/delivery">
            <Package className="w-5 h-5 mr-3" />
            배송 관리
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="w-5 h-5 mr-3" />
            설정
          </Link>
        </Button>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};
