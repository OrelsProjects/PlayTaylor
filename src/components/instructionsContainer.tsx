import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  InstructionItem,
  instructionItems,
} from "../app/(content)/instructions/_consts";
import { Icons } from "./ui/icons";
import OptimizedImage from "./ui/optimizedImage";

export const InstructionsItem: React.FC<InstructionItem> = ({
  title,
  description,
  index,
}) => {
  return (
    <div className="w-full flex flex-row justify-start gap-4 py-3 px-4">
      <div className="w-10 h-10 flex justify-center items-center flex-shrink-0 rounded-full bg-foreground text-background ">
        <OptimizedImage
          src={`/numbers/flower-${index}.png`}
          fill
          className="!h-10 !w-10 !relative"
          alt={"flower"}
        />
      </div>

      <div className="w-full flex flex-col">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

const InstructionsContainer: React.FC = () => {
  const Content = () => (
    <Dialog>
      <DialogTrigger>
        <div className="h-fit w-fit flex flex-col items-end  p-1 rounded-full border-primary border-[1px]">
          <Icons.QuestionMark className="h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent
        closeOnOutsideClick
        className="bg-foreground text-background p-8 rounded-lg w-10/12"
      >
        <DialogTitle>
          <h2>How to play</h2>
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-col">
            {instructionItems.map(item => (
              <InstructionsItem key={item.title} {...item} />
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );

  return <Content />;
};

export default InstructionsContainer;
