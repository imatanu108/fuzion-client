"use client"
import { Button } from '../ui/button';
import { Menu, Sun, Moon, LucideAtom } from 'lucide-react';
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
const Header: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [openSidebar, setOpenSidebar] = useState(false)
  const hideSidebar = () => {
    setOpenSidebar(false)
  }
  
  return (
    <>
      <div className="fixed top-0 w-full lg:w-[65.9%] lg:px-4 z-40 flex justify-between items-center bg-gray-100 dark:bg-[#183446] bg-opacity-40 dark:bg-opacity-60 backdrop-blur-lg dark:backdrop-blur-lg rounded-md shadow-sm">
        <Button
          className="flex gap-2 px-2"
          onClick={() => router.push('/')}
        >
          <LucideAtom
            className='text-blue-600 dark:text-blue-400'
            style={{ height: '24px', width: '24px' }}
          />
          <div className='font-bold text-xl tracking-wider text-blue-600 dark:text-blue-400'>FUZION</div>
        </Button>

        <div className="flex items-center gap-6">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            aria-label='Search Menu'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun
              style={{ height: '24px', width: '24px' }}
              className='text-blue-600 dark:text-blue-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
            />
            <Moon
              style={{ height: '24px', width: '24px' }}
              className='text-blue-600 dark:text-blue-400 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
            />
            <span className='sr-only'>Toggle Theme</span>
          </Button>

          <Button
            className='lg:hidden'
            variant="ghost"
            size="icon"
            aria-label='Search Menu'
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <Menu
              style={{ height: '24px', width: '24px' }}
              className='text-blue-600 dark:text-blue-400 mr-1'
            />
            <span className='sr-only'>Search Menu</span>
          </Button>
        </div>
      </div>
      {openSidebar && (
        <div 
        className="lg:hidden fixed inset-0 z-50 backdrop-blur-sm bg-[#435e66] bg-opacity-30"
        onClick={() => setOpenSidebar(false)}
        >
          <div 
          className="bg-slate-100 dark:bg-[#102532] h-[100%] w-[60%] md:w-[50%] shadow-2xl text-[#0b3644] border-r-2 border-[#354e57ae]"
          onClick={(e) => e.stopPropagation()}
          >
            <Sidebar hideSidebar={hideSidebar}/>
          </div>
        </div>
      )}
    </>
  )
}

export default Header;
