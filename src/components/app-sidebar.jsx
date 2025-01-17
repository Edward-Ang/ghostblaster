import { Home, Settings, User, ChevronsUpDown, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { FaInstagram } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import logo from "../assets/logo.png";

// Menu items.
const items = [
  {
    title: "Business Suite",
    url: "/business-suite",
    icon: FaMeta,
  },
  {
    title: "Instagram",
    url: "/instagram",
    icon: FaInstagram,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ setIsAuthenticated }) {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove authentication state
    setIsAuthenticated(false); // Update authentication state in App.js
    navigate("/"); // Redirect to the login page
  };

  return (
    <Sidebar>
      <SidebarHeader className="pl-4 pt-4 pb-6 flex">
        <div className="flex items-center">
          <Avatar className="mr-2 h-9 w-9">
            <AvatarImage src={logo} alt="@shadcn" className="rounded-lg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-black">Ghost Blaster</span>
            <span className="text-xs text-zinc-400">Enterprise</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mb-2">
            <SidebarMenu>
              <SidebarMenuItem
                className={`${
                  location.pathname === "/" ? "bg-gray-200 rounded" : ""
                }`}
              >
                <SidebarMenuButton asChild>
                  <Link to="/home" className="flex items-center space-x-2">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${
                    location.pathname === item.url ? "bg-gray-200 rounded" : ""
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-transparent"
                >
                  <Avatar className="mr-0 h-9 w-9">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                      className="rounded-lg"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>Edward Ang</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}