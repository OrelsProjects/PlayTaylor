import React, { useMemo } from "react";
import {
  Dialog,
  DialogClose,
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
import { IoClose } from "react-icons/io5";
import { useAppSelector } from "../lib/hooks/redux";

export const InstructionsItem: React.FC<InstructionItem> = ({
  title,
  description,
  index,
}) => {
  return (
    <div className="w-full flex flex-row justify-start gap-4 py-3 px-4">
      <div className="w-10 h-10 flex justify-center items-center flex-shrink-0 rounded-full bg-foreground dark:bg-transparent text-background ">
        <OptimizedImage
          src={`/numbers/flower-${index}.png`}
          fill
          className="!h-10 !w-10 !relative"
          alt={"flower"}
        />
      </div>

      <div className="w-full flex flex-col">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-sm text-primary">{description}</p>
      </div>
    </div>
  );
};

const InstructionsContainer: React.FC = () => {
  const { game } = useAppSelector(state => state.game);

  const instructions = useMemo(() => {
    return instructionItems[game];
  }, [game]);

  const Content = () => (
    <Dialog>
      <DialogTrigger>
        <div className="h-fit w-fit flex flex-col items-end  p-1 rounded-full border-primary border-[1px]">
          <Icons.QuestionMark className="h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent
        closeOnOutsideClick
        className="bg-primary-foreground border-[2px] border-primary text-background p-8 rounded-lg w-10/12"
      >
        <DialogClose
          className="absolute top-4 right-4 z-50 text-primary fill-primary"
          asChild
        >
          <IoClose className="h-6 w-6 text-primary" />
        </DialogClose>
        <DialogTitle>
          <h2>How to play</h2>
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-col">
            {instructions.map(item => (
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
