import { useEffect, useState } from "react";
import {
  Home,
  Settings,
  User,
  ChevronsUpDown,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import { FiSidebar } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { FaInstagram } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.png";

// Static menu items
const staticItems = [
  {
    title: "Business Suite",
    icon: FaMeta,
  },
  {
    title: "Instagram",
    icon: FaInstagram,
    url: "/instagram",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function AppSidebar({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userid = localStorage.getItem("userId");
  const [expandedItems, setExpandedItems] = useState({});
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [items, setItems] = useState(staticItems);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!userid) {
        console.error("userid is missing");
        return;
      }

      try {
        const response = await fetch(
          `${backendUrl}/getCurrentUser?userid=${userid}`
        );
        const data = await response.json();

        if (response.ok) {
          setUsername(data.user.username);
          setUserEmail(data.user.email);
        } else {
          console.error("Failed to fetch current user:", data.error);
        }
      } catch (err) {
        console.error(
          "An error occurred while fetching the current user:",
          err
        );
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  const toggleSubmenu = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col h-screen border-r bg-background",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-12 top-2 w-10 h-10 z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FiSidebar className="h-4 w-4" />
        </Button>
        <div className="flex h-16 items-center px-4">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center w-full" : "gap-2"
            )}
          >
            <Avatar className="h-9 w-9 rounded-lg">
              <AvatarImage src={logo} alt="Logo" className="rounded-lg" />
              <AvatarFallback>GB</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col text-sm text-left">
                <span className="font-semibold">Ghost Blaster</span>
                <span className="text-xs text-muted-foreground">
                  Enterprise
                </span>
              </div>
            )}
          </div>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-2 flex flex-col items-center">
            <Button
              variant={location.pathname === "/home" ? "secondary" : "ghost"}
              className={cn(
                isCollapsed
                  ? "w-10 h-10 px-0 flex items-center justify-center"
                  : "w-full justify-start"
              )}
              asChild
            >
              <Link to="/home">
                <Home className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Home"}
              </Link>
            </Button>

            <div className="py-2">
              <h4
                className={cn(
                  "mb-1 px-2 text-xs font-semibold text-left text-gray-500",
                  isCollapsed && "sr-only"
                )}
              >
                Platform
              </h4>
              {items.map((item) => (
                <div key={item.title} className="my-2">
                  {item.url ? (
                    <Button
                      variant={
                        location.pathname === item.url ? "secondary" : "ghost"
                      }
                      className={cn(
                        isCollapsed
                          ? "w-10 h-10 px-0 flex items-center justify-center"
                          : "w-full justify-start"
                      )}
                      asChild
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={cn("h-4 w-4", !isCollapsed && "mr-2")}
                        />
                        {!isCollapsed && item.title}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        isCollapsed
                          ? "w-10 h-10 px-0 flex items-center justify-center"
                          : "w-full justify-start"
                      )}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <item.icon
                        className={cn("h-4 w-4", !isCollapsed && "mr-2")}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {expandedItems[item.title] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="flex h-16 items-center px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full h-full p-0">
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center justify-start h-fit hover:bg-transparent",
                  isCollapsed ? "justify-center w-full" : "gap-2"
                )}
              >
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Avatar"
                    className="rounded-lg object-cover"
                  />
                  <AvatarFallback className="bg-gray-200">SC</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <div className="flex flex-col text-sm text-left">
                      <span className="font-semibold">{username}</span>
                      <span className="text-xs text-muted-foreground">
                        Test
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[175px] mb-3">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
