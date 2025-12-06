import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeViewProps {
  name: string;
  phoneLast4: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  name,
  phoneLast4,
  onNameChange,
  onPhoneChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src="/logo.svg"
              alt="정직한 식품코너 로고"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-lg font-semibold text-gray-800">정직한 식품코너</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            배송 조회
          </CardTitle>
          <p className="text-gray-500 text-sm">
            주문자 이름과 휴대폰 번호 뒷 4자리를 입력해주세요.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                이름
              </label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={onNameChange}
                className="h-12 text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
                휴대폰 번호 뒷 4자리
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234"
                maxLength={4}
                value={phoneLast4}
                onChange={onPhoneChange}
                className="h-12 text-lg"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-[#FEE500] hover:bg-[#FDD835] text-[#191919]"
              disabled={isLoading}
            >
              {isLoading ? '조회 중...' : '조회하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
