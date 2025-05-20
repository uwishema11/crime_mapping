import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ListTodo,
  Bell,
  Map,
  FolderTree,
} from "lucide-react";

export const UserMenuData = [
  {
    name: "Dashboard",
    link: "/user-dashboard",
    icons: <LayoutDashboard size={16} />,
  },
  {
    name: "My Reports",
    link: "/user-dashboard/reports",
    icons: <FileText size={16} />,
  },
  {
    name: "Submit Report",
    link: "/user-dashboard/submit-report",
    icons: <PlusCircle size={16} />,
  },
  {
    name: "Categories",
    link: "/user-dashboard/categories",
    icons: <FolderTree size={16} />,
  },
  {
    name: "Crime Map",
    link: "/user-dashboard/crime-map",
    icons: <Map size={16} />,
  },
  {
    name: "Notifications",
    link: "/user-dashboard/notifications",
    icons: <Bell size={16} />,
  },
]; 