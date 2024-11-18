"use client"
import React from 'react'
import { Button } from '../ui/button';
import { Home, Bookmark, Twitter, CirclePlus, CircleUserRound, Search} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Footer: React.FC = () => {
  const router = useRouter()
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
  
  const getUserProfile = () => {
    if (!currentUserData) {
      router.push('/login')
    } else {
      router.push(`/user/${currentUserData.username}`)
    }
  }

  return (
    <footer className="lg:max-w-7xl lg:mx-auto fixed bottom-0 w-full z-50 p-1 flex justify-between items-center bg-gray-100 bg-opacity-60 backdrop-blur-md rounded-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.01),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
      <Button
        variant="ghost"
        size="icon"
        aria-label='Search Menu'
        onClick={() => router.push('/')}
      >
        <Home
          color='blue'
          style={{ height: '24px', width: '24px' }}
          className='h-5 w-5'
        />
        <span className='sr-only'>Search Menu</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label='Search Menu'
        onClick={() => router.push('/tweet')}
      >
        <Twitter
          color='blue'
          style={{ height: '24px', width: '24px' }}
          className='h-5 w-5'
        />
        <span className='sr-only'>Search Menu</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label='Search Menu'
      >
        <CirclePlus
          color='blue'
          style={{ height: '24px', width: '24px' }}
          className='h-5 w-5'
        />
        <span className='sr-only'>Search Menu</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label='Search Menu'
        onClick={() => router.push('/search')}
      >
        <Search
          color='blue'
          style={{ height: '24px', width: '24px' }}
          className='h-5 w-5'
        />
        <span className='sr-only'>Search Menu</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label='Search Menu'
        onClick={() => getUserProfile()}
      >
        <CircleUserRound
          color='blue'
          style={{ height: '24px', width: '24px' }}
          className='h-5 w-5'
        />
        <span className='sr-only'>Search Menu</span>
      </Button>

    </footer>
  );
}

export default Footer;
