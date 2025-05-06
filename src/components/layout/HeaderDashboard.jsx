import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Menu, Settings, LogOut } from 'lucide-react';
import { LeftSideMenuData } from './MenuData';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function HeaderDashboard() {
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const navigate = useNavigate();
  const userCookie = Cookies.get('user');

  const parsedUser = JSON.parse(userCookie || '{}');
  const firstNameInitial =
    parsedUser?.user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleOpenChangePasswordForm = () => {
    setShowChangePasswordForm(true);
  };

  const signOut = () => {
    Cookies.remove('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <header className="flex bg-white mx-2 mt-1 rounded-[4px] items-center gap-4 px-2 lg:h-[60px] lg:px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col bg-[#004B93] text-white"
        >
          <nav className="grid gap-2 text-lg font-medium mt-10">
            {LeftSideMenuData.map((el) => (
              <Link
                key={el.name}
                to={el.link}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#003366] transition-colors"
              >
                {el.icons}
                {el.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <h2 className="font-bold text-blue-600">DASHBOARD</h2>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 rounded-full cursor-pointer bg-gray-200 text-blue-600 font-semibold flex items-center justify-center">
              <AvatarImage
                src={parsedUser.user?.image_url}
                alt={parsedUser.user?.name}
                className="object-cover h-10 w-10 rounded-full"
              />
              <AvatarFallback className="h-10 w-10 rounded-full flex items-center justify-center">
                {firstNameInitial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[300px] bg-white border border-gray-200 shadow-lg"
          >
            <DropdownMenuLabel className="flex flex-col items-center text-center px-2 py-2">
              <Avatar className="h-10 w-10 rounded-full bg-gray-200 text-blue-600 font-semibold flex items-center justify-center">
                <AvatarImage
                  src={parsedUser.user?.image_url}
                  alt={parsedUser.user?.name}
                  className="object-cover h-10 w-10 rounded-full"
                />
                <AvatarFallback className="h-10 w-10 rounded-full flex items-center justify-center">
                  {firstNameInitial}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-semibold mt-1">
                {parsedUser.user?.email}
              </div>
              <div className="text-sm font-semibold">
                {parsedUser.user?.role}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="border-t border-gray-300" />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="settings">
                <AccordionTrigger className="px-2 py-1.5">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-5">
                  <DropdownMenuItem className="hover:bg-blue-50" asChild>
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleOpenChangePasswordForm}
                    className="hover:bg-blue-50"
                  >
                    Change Password
                  </DropdownMenuItem>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={signOut}
              className="hover:bg-blue-50 text-blue-600"
            >
              <div className="flex w-full items-center justify-start gap-2">
                <LogOut className="text-blue-600" />
                <span>Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default HeaderDashboard;
