"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Home, Twitter, CirclePlus, CircleUserRound, Search, Video, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Footer: React.FC = () => {
  const router = useRouter()
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
  const [showUploadModal, setShowUploadModal] = useState(false)

  const getUserProfile = () => {
    if (!currentUserData) {
      router.push('/login')
    } else {
      router.push(`/user/${currentUserData.username}`)
    }
  }

  return (
    <>
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
          onClick={() => setShowUploadModal(true)}
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
      {showUploadModal && (
        <>
          <div
            className="fixed z-50 inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30"
          >
            <div
              className="bg-slate-50 dark:bg-[#225a6d] flex flex-col justify-center m-4 w-[80%] md:w-[50%] p-6 rounded-xl shadow-md text-[#0b3644] dark:text-slate-100"
            >

              <div className="flex flex-col gap-4 justify-center items-center">

                <Button
                  variant="outline"
                  className="w-full rounded-full text-base border-blue-600 dark:border-blue-400 "
                  onClick={() => {
                    setShowUploadModal(false)
                    router.push('/video/upload')
                  }}
                >
                  <Video
                    className='text-blue-600 dark:text-blue-400'
                    style={{ height: '24px', width: '24px' }}
                  />
                  <span>Upload a video</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full text-base border-blue-600 dark:border-blue-400"
                  onClick={() => {
                    setShowUploadModal(false)
                    router.push('/tweet/upload')
                  }}
                >
                  <Twitter
                    className='text-blue-600 dark:text-blue-400'
                    style={{ height: '24px', width: '24px' }}
                  />
                  <span>Upload a tweet</span>
                </Button>

                <Button
                variant="default"
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-base border-blue-600 dark:border-blue-400 text-slate-100 "
                onClick={() => setShowUploadModal(false)}
                >
                  <X
                    style={{ height: '24px', width: '24px' }}
                  />
                  <span>Cancel upload</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Footer;
