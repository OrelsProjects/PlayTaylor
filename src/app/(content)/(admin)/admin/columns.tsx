"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { MdEdit, MdDelete } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import useGame from "../../../../lib/hooks/useGame";
import OptimizedImage from "../../../../components/ui/optimizedImage";
import { Question } from "../../../../models/question";

export const columns: ColumnDef<Omit<Question, "isDeleted">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <OptimizedImage
          src={row.original.image}
          alt="Question image"
          fill
          className="!w-10 !h-10 rounded-md"
        />
      );
    },
  },
  {
    header: "Content",
    accessorKey: "content",
  },
  {
    header: "Answer",
    accessorKey: "answer",
  },
  {
    header: "Difficulty",
    accessorKey: "difficulty",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "type",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { removeQuestion } = useGame();
      const question = row.original;

      return (
        <div className="flex flex-row gap-4">
          <Link
            href={`/admin/question/${question.id}`}
            className="flex justify-center items-center"
          >
            <MdEdit className="w-5 h-5" />
          </Link>
          <div
            className="cursor-pointer"
            onClick={() => {
              // yes no dialog
              const shouldDelete = confirm(
                "Are you sure you want to delete this question?",
              );
              if (shouldDelete) {
                removeQuestion(question.id);
              }
            }}
          >
            <MdDelete className="w-5 h-5" />
          </div>
        </div>
      );
    },
  },
];
