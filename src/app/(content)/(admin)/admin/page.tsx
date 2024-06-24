"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import useGame from "../../../../lib/hooks/useGame";

export default function AdminPage() {
  const { allQuestions } = useGame();

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <Button asChild>
        <Link href="/admin/question">Add question</Link>
      </Button>
      <DataTable columns={columns} data={allQuestions || []} />
    </div>
  );
}
