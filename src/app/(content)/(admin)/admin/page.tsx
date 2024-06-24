"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import useGame from "../../../../lib/hooks/useGame";
import { useAppSelector } from "../../../../lib/hooks/redux";
import Loading from "../../../../components/ui/loading";

export default function AdminPage() {
  const { allQuestions } = useGame();
  const { questionsStatus } = useAppSelector(state => state.game);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <Button asChild>
        <Link href="/admin/question">Add question</Link>
      </Button>
      {questionsStatus === "loading" ? (
        <Loading spinnerClassName="h-12 w-12" />
      ) : (
        <DataTable columns={columns} data={allQuestions || []} />
      )}
    </div>
  );
}
