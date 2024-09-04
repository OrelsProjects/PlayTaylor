import React, { useMemo, useState } from "react";
import { Button } from "./button";
import { Icons } from "./icons";
import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Logger } from "../../logger";
import CustomLink from "../customLink";

interface GameFinishedComponentProps {
  questionsCount?: number;
  correctAnswers?: number;
}

const randomGiphys = [
  "OPwo4A3ld4FyokN9yS",
  "xTiTng24g6V2BCRjDG",
  "x6Ujqd0uB13j7ZGTyb",
  "l0K4c8bZHJzDCmg6Y",
  "vmHRZRaIiMaju",
  "ZvOeWYrju8gGZqRZvZ",
  "3qsyyyljsqMIVDljof",
  "dXKiD8XysOuhFAJB1f",
  "XMmf6i3xuKZiPMvNZe",
  "l4KhPgzb4HXUq6Jzy",
  "piTERt2CEdrLt2WLv0",
  "1DfdCZ4X6eDCw",
  "fQk03IKR2GABFwWb1r",
  "5ymIg7UX6i7F6",
  "uZFBbIwTGksk6dRa0y",
];

const randomMessages = [
  "You did it all too well!",
  "It is over now!",
  "You survived the great war!",
];

const GameFinishedComponent: React.FC<GameFinishedComponentProps> = () => {
  // NEXT_GIPHY_API_KEY
  const gf = new GiphyFetch("fzIYZvIQaGCiUsML9a9LJWSxxZSqf50X");
  const [giphyData, setGiphyData] = useState<any>(null);

  const message = useMemo(() => {
    return randomMessages[Math.floor(Math.random() * randomMessages.length)];
  }, []);

  const giphy = useMemo(() => {
    const randomGiphy =
      randomGiphys[Math.floor(Math.random() * randomGiphys.length)];
    const fetchGiphy = async () => {
      try {
        const { data } = await gf.gif(randomGiphy);
        setGiphyData(data);
      } catch (error) {
        Logger.error("Failed to fetch giphy", { data: { error } });
      }
    };
    fetchGiphy();
  }, []);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1>{message}</h1>
        {giphyData && <Gif gif={giphyData} width={250} />}
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <Button asChild>
          <CustomLink href={`/home`}>Next game</CustomLink>
        </Button>
        <Button variant="outline" asChild>
          <CustomLink href={`/home`} className="flex flex-row gap-2">
            <Icons.Redo className="fill-primary h-4 w-4" />
            <span className="text-primary">Redo</span>
          </CustomLink>
        </Button>
      </div>
    </div>
  );
};

export default GameFinishedComponent;
