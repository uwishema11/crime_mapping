import {
  Contact,
  LayoutDashboard,
  CheckCheck,
  ArrowLeftRight,
  ListTodo,
  Flame,
  LayoutList,
} from "lucide-react";
export const LeftSideMenuData = [
  {
    name: "Dashboard",
    link: "/",
    icons: <LayoutDashboard size={16} />,
    type: ["admin", "manager", "member"],
  },

  {
    name: "Users",
    link: "/users",
    icons: <Contact size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "Categories",
    link: "/categories",
    icons: <Flame size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "Crime Insights",
    link: "/crimes-insights",
    icons: <LayoutList size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "Crimes",
    link: "/crimes",
    icons: <ArrowLeftRight size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "analytics",
    link: "/analytics",
    icons: <CheckCheck size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "Reports",
    link: "/reports",
    icons: <ListTodo size={16} />,
    type: ["admin", "manager"],
  },
  {
    name: "Notifications",
    link: "/notifications",
    icons: <CheckCheck size={16} />,
    type: ["admin", "manager"],
  },
];
