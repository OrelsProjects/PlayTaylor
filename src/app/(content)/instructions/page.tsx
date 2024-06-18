import React from "react";
import { InstructionItem, instructionItems } from "./_consts";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const InstructionsItem: React.FC<InstructionItem> = ({
  title,
  description,
  itemNumber,
}) => {
  return (
    <div className="w-full flex flex-row justify-start gap-4 py-3 px-4">
      <div className="w-10 h-10 flex justify-center items-center flex-shrink-0 rounded-full bg-foreground text-background ">
        {itemNumber}
      </div>
      <div className="w-full flex flex-col">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

const InstructionsPage: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col gap-16">
      <div className="w-full flex flex-col gap-9">
        <h1 className="w-full text-center">How to play</h1>
        <div className="flex flex-col">
          {instructionItems.map(item => (
            <InstructionsItem key={item.title} {...item} />
          ))}
        </div>
      </div>
      <h2 className="w-full text-center">Difficulty level</h2>
      <Button asChild className="w-fit self-center mt-auto">
        <Link href="/games">I am ready for it!</Link>
      </Button>
    </div>
  );
};

export default InstructionsPage;
