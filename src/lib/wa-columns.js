"use client";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const waColumns = [
  columnHelper.accessor("username", {
    header: "Account",
  }),
  columnHelper.accessor("mobile_number", {
    header: "Mobile Number",
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