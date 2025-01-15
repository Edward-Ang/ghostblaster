import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCcwIcon,
  MoreVerticalIcon,
  CheckCircle2,
  InfoIcon,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { columns } from "@/lib/columns";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";

function Instagram() {
  const fileInputRef = useRef();
  const contentRef = useRef();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleBlast = async () => {
    const file = fileInputRef.current.files[0];
    const content = contentRef.current.value;
    // console.log(content);
    // console.log(file);

    if (!content || content.trim() === "") {
      return;
    }

    // Create FormData to send file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("content", content);
    // formData.append("asset_id", pageId || " ");
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

      // Rest of your existing handling logic...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <header
        className="text-black bg-white p-4 shadow-md sticky top-0"
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold">Instagram</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="flex justify-start p-6 py-4 gap-2">
          <Dialog className="bg-blue-100">
            <DialogTrigger asChild>
              <Button>
                <MdElectricBolt />
                Blast
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] min-h-[400px]">
              <DialogHeader>
                <DialogTitle>Start to blast</DialogTitle>
                <DialogDescription>
                  Provide the blast title to initiate the blasting process.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    className="col-span-5 text-center placeholder:text-center cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <div className="h-full flex justify-end pt-2">
                    <Label htmlFor="content" className="text-right">
                      Content{" "}
                      <span aria-hidden="true" className="text-red-500">
                        *
                      </span>
                    </Label>
                  </div>
                  <Textarea
                    ref={contentRef}
                    id="content"
                    placeholder="Enter your blast content"
                    className="col-span-5 min-h-[200px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleBlast}>
                  Blast
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-800 text-white text-center p-4">
          &copy; {new Date().getFullYear()} Business Suite. All rights reserved.
        </footer> */}
    </div>
  );
}

export default Instagram;
