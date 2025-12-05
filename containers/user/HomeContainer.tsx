'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeView } from '@/views/user/HomeView';

export const HomeContainer = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneLast4(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phoneLast4.length < 4) {
      alert('이름과 휴대폰 번호 뒷 4자리를 정확히 입력해주세요.');
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Navigate to result page with query params
    const query = new URLSearchParams({
      name,
      phone: phoneLast4,
    }).toString();
    
    router.push(`/result?${query}`);
    setIsLoading(false);
  };

  return (
    <HomeView
      name={name}
      phoneLast4={phoneLast4}
      onNameChange={handleNameChange}
      onPhoneChange={handlePhoneChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
