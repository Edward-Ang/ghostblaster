import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCcwIcon,
  MoreVerticalIcon,
  TrashIcon,
  CheckCircle2,
  StopCircleIcon,
  InfoIcon,
} from "lucide-react";
import { MdElectricBolt } from "react-icons/md";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { IoMdAdd } from "react-icons/io";
import { GrPowerReset, GrView } from "react-icons/gr";
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
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useTheme } from "@/contexts/ThemeContext";

function Instagram() {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [userId, setUserId] = useState("");
  const fileInputRef = useRef();
  const contentRef = useRef();
  const limitRef = useRef(null);
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [runningAssetIds, setRunningAssetIds] = useState({});
  const [stoppingAssetIds, setStoppingAssetIds] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [accountToView, setAccountToView] = useState(null);
  const [accountToViewStatus, setAccountToViewStatus] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId); // Set the state with the value from localStorage
    }

    const fetchData = async () => {
      await getAllPage(userId); // Wait for getAllPage to finish
      await refreshStatus(); // Execute refreshStatus after getAllPage
    };

    fetchData();
  }, []);

  const filteredData = data
    .filter((item) =>
      item.username.toLowerCase().includes(filterValue.toLowerCase())
    )
    .sort((a, b) => {
      // First sort by status
      if (b.status !== a.status) {
        return b.status - a.status;
      }
      // If status is equal, maintain original order or add secondary sort criterion
      return 0;
    });

  const column = [...columns].map((col) => {
    if (col.accessorKey === "username") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Account</div>,
        cell: (info) => <div className="text-left m-2">{info.getValue()}</div>,
      };
    }
    if (col.accessorKey === "count") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Blast Count</div>,
        cell: (info) => (
          <div className="text-left m-2 ml-4">{info.getValue()}</div>
        ),
      };
    }
    if (col.accessorKey === "updatedAt") {
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
        cell: (info) => {
          const username = info.row.original.username;
          const isBlasting = runningAssetIds[username] !== undefined;
          const isThisRowStopping = stoppingAssetIds.has(username);

          // Override status to "Blasting" if the username is in runningAssetIds
          const status = isBlasting ? "6" : info.getValue();

          return (
            <div className="text-left m-2">
              {(() => {
                switch (status) {
                  case 1:
                    return (
                      <Badge
                        variant="success"
                        className={`bg-green-100 ${
                          theme === "dark"
                            ? "bg-green-800 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Completed
                      </Badge>
                    );
                  case 2:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-gray-100 ${
                          theme === "dark"
                            ? "bg-gray-700 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Not Started
                      </Badge>
                    );
                  case 3:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-red-200 ${
                          theme === "dark"
                            ? "bg-red-800 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Failed
                      </Badge>
                    );
                  case 4:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-yellow-100 ${
                          theme === "dark"
                            ? "bg-yellow-700 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Stopped
                      </Badge>
                    );
                  case 5:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-blue-100 ${
                          theme === "dark"
                            ? "bg-blue-800 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        New
                      </Badge>
                    );
                  case 6:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-purple-200 ${
                          theme === "dark"
                            ? "bg-purple-800 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        {isThisRowStopping ? "Stopping" : "Blasting"}
                      </Badge>
                    );
                  default:
                    return (
                      <Badge
                        variant="warning"
                        className={`bg-red-200 ${
                          theme === "dark"
                            ? "bg-red-800 border-[var(--border-dark-card)]"
                            : ""
                        }`}
                      >
                        Error
                      </Badge>
                    );
                }
              })()}
            </div>
          );
        },
      };
    }
    if (col.accessorKey === "actions") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Actions</div>,
        cell: (info) => {
          const username = info.row.original.username;
          const isThisRowRunning = runningAssetIds[username];
          const isThisRowStopping = stoppingAssetIds.has(username);
          const currentStatus = info.row.original.status;
          const shouldShowRunning = isThisRowRunning || currentStatus == "6";
          // if (username === "edward.ang1211") {
          //   console.log("current status: ", currentStatus);
          //   console.log(username, "running: ", isThisRowRunning);
          //   console.log("should running: ", shouldShowRunning);
          // }

          return (
            <div className="flex justify-between items-center gap-2 mx-2">
              {shouldShowRunning ? (
                <>
                  <Button
                    disabled
                    className="h-9 focus:none focus:ring-0 bg-blue-600 hover:bg-blue-700"
                  >
                    {/* <Loader2 className="animate-spin" /> */}
                    <MdElectricBolt />
                    Blast
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStopBlast(username)}
                    disabled={isThisRowStopping}
                    className="h-9 w-9 focus:none focus:ring-0"
                  >
                    <StopCircleIcon />
                  </Button>
                </>
              ) : (
                <>
                  {/* <Dialog
                    open={openBlast}
                    onOpenChange={(isOpen) => setOpenBlast(isOpen)}
                  >
                    <DialogTitle>
                      <VisuallyHidden>Start Blast Dialog</VisuallyHidden>
                    </DialogTitle>
                    <DialogTrigger asChild>
                      <Button className="h-9 focus:none focus:ring-0 bg-blue-600 hover:bg-blue-700">
                        <MdElectricBolt />
                        Blast
                      </Button>
                    </DialogTrigger>
                    <DialogOverlay className="bg-black/20" />
                    <DialogContent
                      className="sm:max-w-[500px]"
                      onPointerDownOutside={(e) => e.preventDefault()}
                    >
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">
                            Start to Blast
                          </CardTitle>
                          <DialogDescription>
                            <strong>@{username}</strong>
                          </DialogDescription>
                        </CardHeader>
                        <CardContent>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleBlast(username);
                            }}
                            className="flex flex-col gap-4"
                          >
                            <div className="flex flex-col gap-2">
                              <Label
                                htmlFor="pageType"
                                className="text-left ml-1"
                              >
                                Page Type
                                <span
                                  aria-hidden="true"
                                  className="text-red-500"
                                >
                                  {" "}
                                  *
                                </span>
                              </Label>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="image" className="text-left ml-1">
                                Image
                              </Label>
                              <Input
                                ref={fileInputRef}
                                id="image"
                                type="file"
                                accept="image/*"
                                className="w-full text-gray-500 cursor-pointer"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label
                                htmlFor="content"
                                className="text-left ml-1"
                              >
                                Content
                                <span
                                  aria-hidden="true"
                                  className="text-red-500"
                                >
                                  {" "}
                                  *
                                </span>
                              </Label>
                              <Textarea
                                ref={contentRef}
                                id="content"
                                placeholder="Enter your blast content"
                                className="min-h-[200px] max-h-[500px]"
                                required
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="limit" className="text-left ml-1">
                                Limit
                                <span
                                  aria-hidden="true"
                                  className="text-red-500"
                                >
                                  {" "}
                                  *
                                </span>
                              </Label>
                              <Input
                                ref={limitRef}
                                id="limit"
                                type="number"
                                placeholder="Max: 50"
                                className="w-full"
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (value < 1 || value > 50)
                                    e.target.value = "";
                                }}
                                required
                              />
                            </div>

                            <div className="flex">
                              <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                Blast
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </DialogContent>
                  </Dialog> */}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={`h-9 focus:none focus:ring-0 bg-blue-600 hover:bg-blue-700 ${
                          theme === "dark" ? "text-white" : ""
                        }`}
                      >
                        <MdElectricBolt />
                        Blast
                      </Button>
                    </DialogTrigger>
                    <DialogOverlay className="bg-black/40" />
                    <DialogContent
                      className="sm:max-w-[500px] min-h-[400px]"
                      onPointerDownOutside={(e) => e.preventDefault()} // Prevents accidental closing
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault(); // Prevents form from submitting normally
                          handleBlast(username); // Call the blast function
                        }}
                        className="flex flex-col gap-4 py-4"
                      >
                        <DialogHeader>
                          <DialogTitle>Start to blast</DialogTitle>
                          <DialogDescription>
                            <strong>@{username}</strong>
                          </DialogDescription>
                        </DialogHeader>

                        {/* <div className="flex flex-col gap-2">
                          <Label htmlFor="image" className="text-left ml-1">
                            Page Type
                          </Label>
                          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg border bg-muted">
                            <button
                              type=""
                              onClick={(e) => {
                                handleSelect(e, "general");
                              }}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                selected === "general"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:bg-background/50"
                              }`}
                            >
                              General
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                handleSelect(e, "primary");
                              }}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                selected === "primary"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:bg-background/50"
                              }`}
                            >
                              Primary
                            </button>
                          </div>
                        </div> */}

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="image" className="text-left ml-1">
                            Image
                          </Label>
                          <Input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/*"
                            className={`w-full text-center placeholder:text-center text-gray-500 cursor-pointer ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
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
                            className={`min-h-[200px] max-h-[500px] ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="limit" className="text-left ml-1">
                            Limit{" "}
                            <span aria-hidden="true" className="text-red-500">
                              *
                            </span>
                          </Label>
                          <Input
                            ref={limitRef} // Using ref instead of state
                            id="limit"
                            type="number"
                            placeholder="Max: 50"
                            className={`w-full ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value < 1 || value > 50) {
                                e.target.value = ""; // Reset input if out of range
                              }
                            }}
                            required
                          />
                        </div>

                        <DialogFooter>
                          <Button
                            type="submit"
                            className={`bg-blue-600 hover:bg-blue-700 ${
                              theme === "dark" ? "text-white" : ""
                            }`}
                          >
                            Blast
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <div className="flex gap-4">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => handleView(username, currentStatus)}
                            className={`h-9 w-9 focus:none focus:ring-0 hover:bg-green-600 hover:text-white ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          >
                            <GrView />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Screenshot</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => handleDelete(username)}
                            className={`h-9 w-9 focus:none focus:ring-0 hover:bg-red-500 hover:text-white ${
                              theme === "dark"
                                ? "border-[var(--border-dark-card)]"
                                : ""
                            }`}
                          >
                            <TrashIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
          const [username] = entry;
          const correspondingItem = data.find(
            (item) =>
              item.username === username &&
              (item.status === "6" || item.status === null) // Add logic to keep running states
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
      const response = await fetch(
        `${backendUrl}/instagram/getAllAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId
        }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedData = data.data;
        console.log("Data from API:", fetchedData);
        setData(fetchedData);

        setRunningAssetIds((prev) => {
          const newRunningIds = { ...prev };
          fetchedData.forEach((item) => {
            if (["1", "4"].includes(item.status)) {
              delete newRunningIds[item.username];
              setStoppingAssetIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(item.username);
                return newSet;
              });
            }
          });
          return newRunningIds;
        });
      } else {
        const errorData = await response.json();
        console.error("Error from API:", errorData.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const resetStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/instagram/resetStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId
        })
      });

      if (response.ok) {
        await getAllPage(userId);
        toast({
          variant: "success",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Status reset successfully!
            </div>
          ),
        });
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
    const limit = limitRef.current.value;

    if (!content || content.trim() === "" || !limit) {
      return;
    }

    setRunningAssetIds((prev) => ({
      ...prev,
      [username]: username,
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", content);
    formData.append("limit", limit);
    formData.append("username", username);
    formData.append("userid", userId);
    formData.append("process_id", crypto.randomUUID());

    try {
      const response = await fetch(`${backendUrl}/blastIG`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result.success) {
          console.log("Success:", result);
          toast({
            variant: "success",
            description: (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <strong>{username}</strong> blast{" "}
                <strong>{result.result.count}</strong> users successfully!
              </div>
            ),
          });
        } else {
          console.log("Error: ", result);
          console.log("result.stop: ", result.result.stop);
          if (result.result.stop) {
            toast({
              variant: "warning",
              description: (
                <div className="flex items-center">
                  <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
                  Blasting stopped unexpectedly! Please try again.
                </div>
              ),
            });
          } else {
            toast({
              variant: "warning",
              description: (
                <div className="flex items-center">
                  <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
                  Blasting failed unexpectedly! Please try again.
                </div>
              ),
            });
          }
        }
        await getAllPage(userId);
      } else {
        console.error("Failed to blast:", response.statusText);
        toast({
          variant: "error",
          description: (
            <div className="flex items-center">
              <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
              Blasting failed unexpectedly! Please try again.
            </div>
          ),
        });
        await getAllPage(userId);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        description: (
          <div className="flex items-center">
            <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
            Blasting failed unexpectedly! Please try again.
          </div>
        ),
      });
      await getAllPage(userId);
    } finally {
      console.log(runningAssetIds);
      console.log(username);
      setRunningAssetIds((prev) => {
        const newState = { ...prev };
        delete newState[username];
        return newState;
      });
    }
  };

  const handleStopBlast = async (username) => {
    // Immediately mark as stopping
    setStoppingAssetIds((prev) => new Set([...prev, username]));

    try {
      const response = await fetch(`${backendUrl}/cancelIG`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          userid: userId,
        }),
      });

      if (response.ok) {
        toast({
          variant: "success",
          description: (
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              Blasting successfully stopped!
            </div>
          ),
        });

        await getAllPage(userId);
      } else {
        const errorData = await response.json();
        console.log("here", errorData.error);
        toast({
          variant: "error",
          description: (
            <div className="flex items-center">
              <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
              {errorData.error}
            </div>
          ),
        });
        await getAllPage(userId);
      }
    } catch (error) {
      console.log("Stop blast: ", error.message);
      toast({
        variant: "error",
        description: (
          <div className="flex items-center">
            <InfoIcon className="mr-2 h-4 w-4 text-red-500" />
            {error.message}
          </div>
        ),
      });
    } finally {
      setRunningAssetIds((prev) => {
        const newState = { ...prev };
        delete newState[username];
        return newState;
      });
      // Remove from stopping state
      setStoppingAssetIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
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
      const response = await fetch(`${backendUrl}/instagram/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          secret: secret,
          userId: userId,
        }),
      });

      const data = await response.json();
      console.log("data: ", data);

      if (data.status) {
        getAllPage(userId);
        setOpen(!open);
        resetFields();
        toast({
          variant: "success",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              <span>{data.message}</span>
            </div>
          ),
        });
      } else {
        toast({
          description: data.message,
          variant: "error",
        });
      }
    } catch (err) {
      toast({
        description: "An error occurred please try again!",
        variant: "error",
      });
    }
  };

  const handleDelete = async (username) => {
    setAccountToDelete(username);
    setDeleteDialogOpen(true);
  };

  const handleView = async (username, status) => {
    setViewDialogOpen(true);
    setAccountToView(username);
    if (status === "1") {
      setAccountToViewStatus("success");
    } else if (status === "3" || status === "4") {
      setAccountToViewStatus("failed");
    } else {
      setAccountToViewStatus("other");
    }
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await fetch(`${backendUrl}/instagram/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: accountToDelete, userId }),
      });

      const result =  await response.json();
      if (result.status) {
        toast({
          variant: "success",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 h-5 w-5" />
              <span>{result.message}</span>
            </div>
          ),
        });
        // Remove the deleted account from the UI
        setData((prevData) =>
          prevData.filter((item) => item.username !== accountToDelete)
        );
      } else {
        toast({
          description: result.message,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        description: result.message,
        variant: "error",
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
              className={`h-9 max-w-sm ${
                theme === "dark" ? "border-[var(--border-dark-card)]" : ""
              }`}
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
                    <DialogTitle>
                      <VisuallyHidden>Your Hidden Title Here</VisuallyHidden>
                    </DialogTitle>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                          className={`h-9 w-9 ${
                            theme === "dark"
                              ? "border-[var(--border-dark-card)]"
                              : ""
                          }`}
                        >
                          <IoMdAdd />
                          <span className="sr-only">Add new account</span>
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <DialogOverlay className="bg-black/60" />
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
                                className={`${
                                  theme === "dark"
                                    ? "border-[var(--border-dark-card)]"
                                    : ""
                                }`}
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
                                className={`${
                                  theme === "dark"
                                    ? "border-[var(--border-dark-card)]"
                                    : ""
                                }`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="secret">Secret</Label>
                              <Input
                                id="secret"
                                value={secret}
                                onChange={(e) =>
                                  setSecret(e.target.value.replace(/\s/g, ""))
                                }
                                autoComplete="off"
                                required
                                className={`${
                                  theme === "dark"
                                    ? "border-[var(--border-dark-card)]"
                                    : ""
                                }`}
                              />
                            </div>
                            <div className="flex">
                              <Button
                                type="submit"
                                className={`w-full bg-blue-600 hover:bg-blue-700 ${
                                  theme === "dark" ? "text-white" : ""
                                }`}
                              >
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
                  <Button
                    variant="outline"
                    className={`h-9 w-9 ${
                      theme === "dark" ? "border-[var(--border-dark-card)]" : ""
                    }`}
                    onClick={resetStatus}
                  >
                    <GrPowerReset />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset status</p>
                </TooltipContent>
              </Tooltip>
              {/* <DropdownMenu>
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
              </DropdownMenu> */}
            </div>
          </div>
          <DataTable columns={column} data={filteredData} />
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogOverlay className="bg-black/60" />
        <DialogContent className="sm:max-w-[425px] border-[var(--border-dark-card)]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account{" "}
              <strong>@{accountToDelete}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className={`${
                theme === "dark" ? "border-[var(--border-dark-card)]" : ""
              }`}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className={`${
                theme === "dark"
                  ? "border-[var(--border-dark-card)] text-white"
                  : ""
              }`}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Confirmation Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogOverlay className="bg-black/60" />
        <DialogContent
          className="sm:max-w-[825px] border-[var(--border-dark-card)]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>View Screenshot</DialogTitle>
            <DialogDescription>
              Screenshot of the last blast action of{" "}
              <strong>@{accountToView}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center">
            <div className="relative w-fit h-fit max-w-[750px] mx-auto">
              {accountToView ? (
                <img
                  src={`${backendUrl}/screenshots/${accountToView}_${accountToViewStatus}.png`}
                  alt="Screenshot"
                  className={`w-full h-full object-contain ${
                    theme === "dark"
                      ? "border border-[var(--border-dark-card)]"
                      : "border"
                  }`}
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div class="flex items-center justify-center w-[750px] h-[50vh] min-h-[300px] max-h-[600px] border-[var(--border-dark-card)] bg-gray-50">
                        <p class="text-gray-500">No screenshot available</p>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full border-[var(--border-dark-card)] bg-gray-50">
                  <p className="text-gray-500">No screenshot available</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className={`${
                theme === "dark" ? "border-[var(--border-dark-card)]" : ""
              }`}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Instagram;
