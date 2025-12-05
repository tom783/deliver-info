export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 페이지는 부모 레이아웃(AdminSidebar)을 덮어쓰지 못하므로
  // 페이지 자체에서 전체 화면을 차지하도록 처리
  return (
    <div className="fixed inset-0 z-50 bg-gray-50">
      {children}
    </div>
  );
}
