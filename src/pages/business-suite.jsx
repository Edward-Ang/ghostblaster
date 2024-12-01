import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcwIcon, MoreVerticalIcon } from "lucide-react";
import { MdElectricBolt } from "react-icons/md";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { columns } from "@/lib/columns";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";

function BusinessSuite() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const titleRef = useRef();
  const userRef = useRef();
  const [runningAssetIds, setRunningAssetIds] = useState({});
  const [stoppingAssetIds, setStoppingAssetIds] = useState(new Set());
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      await getAllPage(); // Wait for getAllPage to finish
      await refreshStatus(); // Execute refreshStatus after getAllPage
    };

    fetchData();
  }, []);

  const column = [...columns].map((col) => {
    if (col.accessorKey === "page_name") {
      return {
        ...col,
        header: () => <div className="font-bold m-2">Page Name</div>,
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
          const localDate = date ? format(date, "yyyy-MM-dd HH:mm:ss") : ""; // Format only if date is valid
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
          const isThisRowRunning = runningAssetIds[rowAssetId];
          const isThisRowStopping = stoppingAssetIds.has(rowAssetId);
          const currentStatus = info.row.original.status;

          // Don't show running state if status is completed, failed, or stopped
          const shouldShowRunning =
            (isThisRowRunning && !isThisRowStopping) || currentStatus == "5";

          return (
            <div className="flex justify-start items-center gap-2 mx-2">
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
                <Dialog className="bg-blue-100">
                  <DialogTrigger asChild>
                    <Button>
                      <MdElectricBolt />
                      Blast
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Start to blast</DialogTitle>
                      <DialogDescription>
                        Provide the blast title to initiate the blasting
                        process.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title{" "}
                          <span aria-hidden="true" className="text-red-500">
                            *
                          </span>
                        </Label>
                        <Input
                          id="title"
                          ref={titleRef}
                          placeholder="Blast Title"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Stop at
                        </Label>
                        <Input
                          id="user"
                          ref={userRef}
                          placeholder="User Name"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={() =>
                          handleBlast(
                            rowAssetId,
                            titleRef.current.value,
                            userRef.current.value
                          )
                        }
                      >
                        Blast
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
  const getAllPage = async () => {
    try {
      const response = await fetch(`${backendUrl}/getAllPage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.result);

        // Update running states based on status
        setRunningAssetIds((prev) => {
          const newRunningIds = { ...prev };
          data.result.forEach((item) => {
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
        toast({
          description: errorData.error,
        });
      }
    } catch (error) {
      toast({
        description: `Error: ${error.message}`,
      });
    }
  };

  const fetchNewPage = async () => {
    try {
      const response = await fetch(`${backendUrl}/fetchNewPage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          description: "Fetch new page successfully!",
        });
        getAllPage();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        toast({
          description: `${errorData.error}`,
        });
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
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
        console.log("Successfully reset all statuses.");
        getAllPage();
        toast({
          description: `Successfully reset ${data.updatedRows} statuses.`,
          status: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);

        toast({
          description: errorData.error || "Failed to reset statuses.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Fetch failed:", error);

      toast({
        description: `Fetch error: ${error.message}`,
        status: "error",
      });
    }
  };

  const handleBlast = async (asset_id, title, username) => {
    if (!title || title.trim() === "") {
      return;
    }
    const processId = crypto.randomUUID();
    setRunningAssetIds((prev) => ({
      ...prev,
      [asset_id]: processId,
    }));
    console.log("Blasting: ", asset_id);
    console.log("ProcessId: ", processId);

    try {
      const response = await fetch(`${backendUrl}/blast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: asset_id,
          title: title,
          stop_at: username,
          process_id: processId,
        }),
      });

      if (response.ok) {
        toast({
          description: "Blast successfully!",
        });
        getAllPage();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        toast({
          description: `${errorData.error}`,
        });
        getAllPage();
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleStopBlast = async (asset_id) => {
    // const processId = runningAssetIds[asset_id];

    // Immediately mark as stopping
    setStoppingAssetIds((prev) => new Set([...prev, asset_id]));

    try {
      const response = await fetch(`${backendUrl}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_id: asset_id,
        }),
      });

      if (response.ok) {
        toast({
          description: "Blasting is successfully stopped!",
        });

        // Remove from running processes immediately
        setRunningAssetIds((prev) => {
          const newState = { ...prev };
          delete newState[asset_id];
          return newState;
        });

        // Wait for backend to update and refresh
        await new Promise((resolve) => setTimeout(resolve, 500));
        await getAllPage();
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.error || "Unknown error.",
        });
      }
    } catch (error) {
      toast({
        description: `Error: ${error.message}`,
      });
    } finally {
      // Remove from stopping state
      setStoppingAssetIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(asset_id);
        return newSet;
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <header
        className="text-black bg-white p-4 shadow-md sticky top-0"
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold">Business Suite</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="flex justify-end p-6 py-4 gap-2">
          <Button className="h-10" onClick={resetStatus}>
            <GrPowerReset />
            Reset status
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 focus:none focus:ring-0"
              >
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-6">
              <DropdownMenuLabel>Tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={fetchNewPage}>
                <RefreshCcwIcon />
                Fetch new page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="px-6 pb-6">
          <DataTable columns={column} data={data} />
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white text-center p-4">
        &copy; {new Date().getFullYear()} Business Suite. All rights reserved.
      </footer> */}
    </div>
  );
}

export default BusinessSuite;
