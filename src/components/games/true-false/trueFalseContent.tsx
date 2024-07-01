import React from "react";
import Image from "next/image";
import { Question } from "../../../models/question.js";
import OptimizedImage from "../../ui/optimizedImage";
import { Icons } from "../../ui/icons";

interface TrueFalseContentProps {
  question: Question;
}

const SwipeItem = ({
  Icon,
  text,
  className,
}: {
  Icon: React.FC<{ className?: string }>;
  text: string;
  className?: string;
}) => (
  <div className="flex flex-col gap-0 items-center text-primary">
    <Icon className={className} />
    <p className="text-sm font-extrabold text-center">{text}</p>
  </div>
);

const TrueFalseContent: React.FC<TrueFalseContentProps> = ({ question }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4 gap-24">
      <OptimizedImage
        src={question.image}
        alt={"Question image"}
        width={40}
        height={40}
        className="rounded-full"
      />
      <h3 className="text-center">{question.content}</h3>
      <div className="w-full flex flex-row justify-between">
        <SwipeItem
          Icon={Icons.SwipeLeft}
          text={"False god"}
          className="-rotate-[15deg]"
        />
        <SwipeItem
          Icon={Icons.SwipeRight}
          text={"True love"}
          className="rotate-[15deg]"
        />
      </div>
    </div>
  );
};

export default TrueFalseContent;
