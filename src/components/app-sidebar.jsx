import { useEffect, useState } from "react";
import {
  Home,
  Settings,
  User,
  ChevronsUpDown,
  LogOut,
  ChevronDown,
  ChevronUp,
  LinkIcon,
} from "lucide-react";
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
    url: "/settings", // No sub-items for Settings
  },
];

export function AppSidebar({ setIsAuthenticated }) {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userid = localStorage.getItem("userId"); // Get userid from localStorage
  const [expandedItems, setExpandedItems] = useState({}); // State to track expanded submenus
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [items, setItems] = useState(staticItems); // State to hold menu items

  useEffect(() => {
    // Fetch the current user's record
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
          console.log("Current user fetched successfully:", data.user);

          // Update the UI with the current user's data
          // For example, set the username in the sidebar header
          setUsername(data.user.username); // Assuming you have a state for username
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

    // Fetch all accounts for the specified userid
    const fetchAllAccounts = async () => {
      const userid = localStorage.getItem("userId"); // Get userid from localStorage

      if (!userid) {
        console.error("userid is missing");
        return;
      }

      try {
        const response = await fetch(
          `${backendUrl}/getAllAccounts?userid=${userid}`
        );
        const data = await response.json();

        if (response.ok) {
          console.log("Accounts fetched successfully:", data.result);

          // Update the "Business Suite" sub-items with fetched accounts
          const updatedItems = items.map((item) => {
            if (item.title === "Business Suite") {
              return {
                ...item,
                subItems: [
                  ...data.result.map((account) => ({
                    title: account.email, // Use email as the title
                    url: `/business-suite/${account.accountname}`, // Use account ID in the URL
                  })),
                  {
                    title: "+", // Use "+" as the title
                    url: "/add-account",
                    isAddAccount: true, // Flag to identify the "Add Account" sub-item
                    className: "bg-gray-950 text-white rounded",
                  }, // Add "Add Account" at the end
                ],
              };
            }
            return item;
          });

          setItems(updatedItems); // Update the items state
        } else {
          console.error("Failed to fetch accounts:", data.error);
        }
      } catch (err) {
        console.error("An error occurred while fetching accounts:", err);
      }
    };

    // Call both functions
    fetchCurrentUser();
    fetchAllAccounts();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove authentication state
    setIsAuthenticated(false); // Update authentication state in App.js
    navigate("/"); // Redirect to the login page
  };

  // Toggle submenu expansion
  const toggleSubmenu = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title], // Toggle the expanded state for the specific item
    }));
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
            <span className="text-sm font-medium text-black">
              Ghost Blaster
            </span>
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
                <div key={item.title}>
                  <SidebarMenuItem
                    className={`${
                      location.pathname === item.url
                        ? "bg-gray-200 rounded"
                        : ""
                    }`}
                  >
                    <SidebarMenuButton
                      className="mb-1"
                      asChild={!item.subItems} // Render as Link if no sub-items
                      onClick={() => item.subItems && toggleSubmenu(item.title)} // Toggle submenu if sub-items exist
                    >
                      {item.subItems ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <item.icon />
                            <span className="pl-2">{item.title}</span>
                          </div>
                          {expandedItems[item.title] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.url}
                          className="flex items-center space-x-2"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {item.subItems &&
                    expandedItems[item.title] && ( // Render sub-items if expanded
                      <div className="pl-8">
                        <SidebarMenu>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuItem
                              key={subItem.title}
                              className={`${
                                location.pathname === subItem.url
                                  ? "bg-gray-200 rounded"
                                  : ""
                              } ${subItem.className || ""}`} // Apply custom className
                            >
                              <SidebarMenuButton
                                className={`${
                                  subItem.isAddAccount
                                    ? "hover:bg-gray-700 hover:text-white active:bg-gray-950 active:text-white"
                                    : "hover:bg-gray-200"
                                }`}
                                asChild
                              >
                                <Link
                                  to={subItem.url}
                                  className={`flex items-center space-x-2 ${
                                    subItem.isAddAccount
                                      ? "justify-center text-xl"
                                      : ""
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </div>
                    )}
                </div>
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
                  <span>{username}</span>
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
