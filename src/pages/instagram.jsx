import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCcwIcon,
  MoreVerticalIcon,
  TrashIcon,
  Check,
  CheckCircle2,
  InfoIcon,
} from "lucide-react";
import { MdElectricBolt } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { columns } from "@/lib/columns";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import BsHeader from "@/components/bs-header";
import IgHeader from "@/components/ig-header";

function Instagram() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [userid, setUserid] = useState("");
  const fileInputRef = useRef();
  const contentRef = useRef();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [runningAssetIds, setRunningAssetIds] = useState({});
  const [stoppingAssetIds, setStoppingAssetIds] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserid(userId); // Set the state with the value from localStorage
    }

    const fetchData = async () => {
      await getAllPage(userId); // Wait for getAllPage to finish
      await refreshStatus(); // Execute refreshStatus after getAllPage
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(filterValue.toLowerCase())
  );

  const column = [...columns].map((col) => {
    if (col.accessorKey === "username") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Account</div>,
        cell: (info) => <div className="text-left m-2">{info.getValue()}</div>,
      };
    }
    if (col.accessorKey === "updated_at") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Last Blast</div>,
        cell: (info) => {
          const value = info.getValue();
          const date = value ? new Date(value) : null;
          const localDate = date
            ? date
                .toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(",", "")
            : "";
          return <div className="text-left m-2">{localDate}</div>;
        },
      };
    }
    if (col.accessorKey === "status") {
      return {
        ...col,
        header: () => <div className="font-bold m-2 ml-4">Status</div>,
        cell: (info) => (
          <div className="text-left m-2">
            {(() => {
              switch (info.getValue()) {
                case "1":
                  return (
                    <Badge variant="success" className="bg-green-100">
                      Completed
                    </Badge>
                  );
                case "2":
                  return (
                    <Badge variant="warning" className="bg-yellow-100">
                      Stopped
                    </Badge>
                  );
                case "3":
                  return <Badge variant="secondary">Not Started</Badge>;
                case "4":
                  return (
                    <Badge variant="secondary" className="bg-blue-100">
                      New
                    </Badge>
                  );
                case "5":
                  return (
                    <Badge variant="secondary" className="bg-purple-100">
                      Blasting
                    </Badge>
                  );
                default:
                  return (
                    <Badge variant="warning" className="bg-red-200">
                      Failed
                    </Badge>
                  );
              }
            })()}
          </div>
        ),
      };
    }
    if (col.accessorKey === "actions") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Actions</div>,
        cell: (info) => {
          const rowAssetId = info.row.original.asset_id;
          const username = info.row.original.username;
          const isThisRowRunning = runningAssetIds[rowAssetId];
          const isThisRowStopping = stoppingAssetIds.has(rowAssetId);
          const currentStatus = info.row.original.status;

          const shouldShowRunning =
            (isThisRowRunning && !isThisRowStopping) || currentStatus == "5";

          return (
            <div className="flex justify-between items-center gap-2 mx-2">
              {shouldShowRunning ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleStopBlast(rowAssetId)}
                    disabled={isThisRowStopping}
                  >
                    {isThisRowStopping ? "Stopping..." : "Stop"}
                  </Button>
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Blasting
                  </Button>
                </>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-9 focus:none focus:ring-0">
                        <MdElectricBolt />
                        Blast
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-[525px] min-h-[400px]"
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle>Start to blast</DialogTitle>
                        <DialogDescription>
                          Provide the blast content to initiate the blasting
                          process.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        {/* Image Section */}
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="image" className="text-left ml-1">
                            Image
                          </Label>
                          <Input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/*"
                            className="w-full text-center placeholder:text-center text-gray-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="content" className="text-left ml-1">
                            Content{" "}
                            <span aria-hidden="true" className="text-red-500">
                              *
                            </span>
                          </Label>
                          <Textarea
                            ref={contentRef}
                            id="content"
                            placeholder="Enter your blast content"
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={() => handleBlast(username)}
                        >
                          Blast
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(username)}
                    className="h-9 w-9 focus:none focus:ring-0"
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
            </div>
          );
        },
      };
    }
    return col;
  });

  const refreshStatus = async () => {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data or result is not an array:", data);
      return;
    }

    setRunningAssetIds((prev) => {
      // Keep running states for items that are still processing
      const newState = Object.fromEntries(
        Object.entries(prev).filter((entry) => {
          const [assetId, processId] = entry;
          const correspondingItem = data.find(
            (item) =>
              item.asset_id === assetId &&
              (item.status === "5" || item.status === null) // Add logic to keep running states
          );
          return correspondingItem !== undefined;
        })
      );

      return newState;
    });
  };

  // Update getAllPage to also handle running states
  const getAllPage = async (userId) => {
    try {
      const response = await fetch(`${backendUrl}/getAllPage?platform=ig`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Debugging logs
        console.log("UserId from localStorage:", userId);
        console.log("Data from API:", data.result);

        // Filter the data based on userId
        const filteredData = data.result.filter(
          (item) => item.userid.toString() === userId.toString()
        );

        // Debugging log for filtered data
        console.log("Filtered Data:", filteredData);

        // Set the filtered data
        setData(filteredData);

        // Update running states based on status
        setRunningAssetIds((prev) => {
          const newRunningIds = { ...prev };
          filteredData.forEach((item) => {
            // Only remove from running if truly completed or stopped
            if (["1", "2"].includes(item.status)) {
              delete newRunningIds[item.asset_id];
              setStoppingAssetIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(item.asset_id);
                return newSet;
              });
            }
          });
          return newRunningIds;
        });
      } else {
        const errorData = await response.json();
        console.log("Error from API:", errorData.error);
      }
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  const resetStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/resetStatus`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        getAllPage();
        console.log(`Successfully reset ${data.updatedRows} statuses.`);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleBlast = async (username) => {
    const file = fileInputRef.current.files[0];
    const content = contentRef.current.value;

    if (!content || content.trim() === "") {
      return;
    }

    // Create FormData to send file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", content);
    formData.append("username", username);
    formData.append("userid", userid);
    formData.append("process_id", crypto.randomUUID());

    // Log FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch(`${backendUrl}/blastIG`, {
        method: "POST",
        body: formData, // Use formData instead of JSON
      });

      // Handle the response
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
      } else {
        console.error("Failed to blast:", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !secret) {
      // setError("Please fill in all fields");
      return;
    }

    // Simulate a login request
    try {
      const response = await fetch(`${backendUrl}/addIgAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          secret: secret,
          userid: userid,
        }),
      });

      const data = await response.json();
      console.log("data: ", data);

      if (data.status) {
        getAllPage(userid);
        setOpen(!open);
        resetFields();
        toast({
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              <span>Account added successfully!</span>
            </div>
          ),
        });
      } else {
        toast({
          description: "Invalid username or password!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        description: "An error occurred please try again!",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (username) => {
    setAccountToDelete(username);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await fetch(`${backendUrl}/deleteIgAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: accountToDelete, userid }),
      });

      if (response.ok) {
        toast({
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              <span>Account deleted successfully!</span>
            </div>
          ),
        });
        // Remove the deleted account from the UI
        setData((prevData) =>
          prevData.filter((item) => item.username !== accountToDelete)
        );
      } else {
        toast({
          description: "Failed to delete account!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        description: "An error occurred while deleting.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const resetFields = () => {
    setUsername("");
    setPassword("");
    setSecret("");
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <IgHeader />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="px-4 pb-6">
          <div className="flex justify-between items-center gap-4 my-4">
            <Input
              placeholder="Filter by account name..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="h-9 max-w-sm" // Responsive width
            />
            <div className="flex justify-end gap-2">
              <TooltipProvider>
                <Tooltip open={showTooltip && !open}>
                  <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen);
                      if (!isOpen) resetFields(); // Clear inputs when dialog closes
                    }}
                  >
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        >
                          <IoMdAdd />
                          <span className="sr-only">Add new account</span>
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>

                    <DialogContent
                      onPointerDownOutside={(e) => e.preventDefault()}
                      className="sm:max-w-[425px]"
                    >
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">
                            Add Instagram Account
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secret">Secret</Label>
                              <Input
                                id="secret"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                autoComplete="off"
                                required
                              />
                            </div>
                            <div className="flex">
                              <Button type="submit" className="w-full">
                                Add
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </DialogContent>
                  </Dialog>
                  <TooltipContent>
                    <p>Add new account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="h-9 w-9">
                    <GrPowerReset />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset status</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-9 focus:none focus:ring-0"
                  >
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-6">
                  <DropdownMenuLabel>Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick="">
                    <RefreshCcwIcon />
                    Fetch new page
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DataTable columns={column} data={filteredData} />
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account {accountToDelete}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Instagram;
