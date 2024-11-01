"use client"
import { Button } from '../ui/button';
import { Menu, Sun, Moon, LucideAtom } from 'lucide-react';
import { useTheme } from "next-themes"
const Header: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <header className="left-0 right-0 lg:max-w-7xl lg:mx-auto fixed top-0 w-full lg:w-90 z-50 py-1 flex justify-between items-center bg-gray-100 bg-opacity-60 backdrop-blur-md rounded-md shadow-sm">
      <Button className="flex gap-2">
        <LucideAtom
          className='h-6 w-6 text-blue-700'
          style={{ height: '24px', width: '24px' }}
        />
        <div className='font-bold text-xl tracking-wider text-blue-700'>FUZION</div>
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
            color='blue'
            style={{ height: '24px', width: '24px' }}
            className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
          />
          <Moon
            color='blue'
            style={{ height: '24px', width: '24px' }}
            className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
          />
          <span className='sr-only'>Toggle Theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label='Search Menu'
        >
          <Menu
            color='blue'
            style={{ height: '24px', width: '24px' }}
            className='h-5 w-5 mr-2'
          />
          <span className='sr-only'>Search Menu</span>
        </Button>
      </div>
    </header>
  )
}

export default Header;
