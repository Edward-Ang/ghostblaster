"use client";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("username", {
    header: "Account",
  }),
  columnHelper.accessor("count", {
    header: "Blast Count",
  }),
  columnHelper.accessor("updatedAt", {
    header: "Last Blast",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("actions", {
    header: 'Actions',
  })
];