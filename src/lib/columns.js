"use client";

import React from 'react';
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("username", {
    header: "Account",
  }),
  columnHelper.accessor("count", {
    header: "Blast Count",
  }),
  columnHelper.accessor("updated_at", {
    header: "Last Blast",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("actions", {
    header: 'Actions',
  })
];