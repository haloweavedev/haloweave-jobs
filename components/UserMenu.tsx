'use client';

import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Card, CardContent } from "@/components/ui/card";

export default function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition duration-300"
      >
        <img src={user.profileImageUrl} alt={user.fullName || ''} className="w-8 h-8 rounded-full" />
        <span>{user.fullName}</span>
      </button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64">
          <CardContent className="py-4">
            <p className="text-sm text-gray-600 mb-4">Signed in as {user.primaryEmailAddress?.emailAddress}</p>
            <UserButton afterSignOutUrl="/" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}