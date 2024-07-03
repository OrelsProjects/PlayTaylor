"use client";

import React, { useMemo } from "react";
import { InstructionItem, instructionItems } from "./_consts";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useAppSelector } from "../../../lib/hooks/redux";

const InstructionsItem: React.FC<InstructionItem> = ({
  title,
  description,
  index: itemNumber,
}) => {
  return (
    <div className="w-full flex flex-row justify-start gap-4 py-3 px-4">
      <div className="w-10 h-10 flex justify-center items-center flex-shrink-0 rounded-full border-[1px] border-primary dark:border-none bg-background dark:bg-foreground text-primary dark:text-background">
        {itemNumber}
      </div>
      <div className="w-full flex flex-col">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-sm text-primary">{description}</p>
      </div>
    </div>
  );
};

const InstructionsPage: React.FC = () => {
  const { game } = useAppSelector(state => state.game);

  const instructions = useMemo(() => {
    return instructionItems[game];
  }, [game]);

  return (
    <div className="h-full w-full flex flex-col gap-16">
      <div className="w-full flex flex-col gap-9">
        <h1 className="w-full text-center text-primary dark:text-foreground">
          How to play
        </h1>
        <div className="flex flex-col">
          {instructions.map(item => (
            <InstructionsItem key={item.title} {...item} />
          ))}
        </div>
      </div>
      <Button asChild className="w-fit self-center mt-auto">
        <Link href={"/games" + "/" + game}>I am ready for it!</Link>
      </Button>
    </div>
  );
};

export default InstructionsPage;
