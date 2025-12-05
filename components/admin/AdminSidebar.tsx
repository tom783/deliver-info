'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export const AdminSidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch admin user info from API
        try {
          const response = await fetch('/api/admin/me');
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium truncate max-w-[120px]">
                    {user?.name || '로딩 중...'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'master' ? '최고관리자' : '부관리자'}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
