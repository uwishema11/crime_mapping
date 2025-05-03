import React, { useState } from "react";
import { Link } from "react-router-dom";

import { CircleUser, Menu, Settings, LogOut } from "lucide-react";
import { LeftSideMenuData } from "./MenuData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

function HeaderDashboard() {
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const handleOpenChangePasswordForm = () => {
    setShowChangePasswordForm(true);
  };

  const signOut = () => {
    console.log("Logout clicked!");
  };

  return (
    <div>
      <header className="flex bg-white mx-5 mt-2 rounded-lg items-center gap-4 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
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
        <div className="w-full flex gap-2 flex-1 pl-2"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full ">
              <CircleUser />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[295px] bg-white border border-gray-200 shadow-lg"
          >
            <DropdownMenuLabel className="flex flex-col items-center text-center">
              <div className="text-sm">Guest</div>
              <div className="mt-2">
                <Avatar>
                  <AvatarFallback>GU</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-sm font-semibold mt-2">
                guest@example.com
              </div>
              <div className="text-sm font-semibold mt-2">Guest User</div>
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
                  <DropdownMenuItem className="hover:bg-blue-50 " asChild>
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
                <LogOut />
                <span>Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}

export default HeaderDashboard;
