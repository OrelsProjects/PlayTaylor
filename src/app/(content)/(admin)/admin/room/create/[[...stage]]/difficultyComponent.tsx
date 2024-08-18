import React from "react";
import { Difficulty } from "@/models/question";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DifficultyComponentProps {
  value: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const tabTriggerClassName=""

export default function DifficultyComponent({
  value,
  onDifficultyChange,
}: DifficultyComponentProps) {
  return (
    <div className="w-full flex items-center space-x-2">
      <Tabs defaultValue={value} className="w-full">
        <TabsList className="bg-background w-full">
          <TabsTrigger
            value="debut"
            onClick={() => onDifficultyChange("debut")}
          >
            Debut
          </TabsTrigger>
          <TabsTrigger value="1989" onClick={() => onDifficultyChange("1989")}>
            1989
          </TabsTrigger>

          <TabsTrigger
            value="folklore"
            onClick={() => onDifficultyChange("folklore")}
          >
            folklore
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
