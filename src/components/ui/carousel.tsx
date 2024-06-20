"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import OptimizedImage from "./optimizedImage";

export interface CarouselItem {
  value: string;
  image: string;
}

interface CarouselProps {
  items: CarouselItem[];
  onItemSelected: (item: CarouselItem) => void;
}

const CarouselItemComponent = ({
  item,
  selected,
  onClick,
}: {
  item: CarouselItem;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      //   layout
      //   transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={onClick}
      className={cn("w-full h-[205px] z-20 relative min-w-14", {
        "animate-full-image": selected,
        "animate-full-image-back": !selected,
      })}
    >
      <OptimizedImage
        src={item.image}
        alt="carousel item"
        layout="fill"
        objectFit="cover"
        className={cn("!relative rounded-full ", {
          "rounded-[28px]": selected,
        })}
      />
      {selected && (
        <h3 className="w-full h-full absolute inset-0 flex justify-center items-center font-bold text-foreground">
          {item.value}
        </h3>
      )}
    </div>
  );
};

const Carousel: React.FC<CarouselProps> = ({ items, onItemSelected }) => {
  const [currentItem, setCurrentItem] = React.useState(0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative flex flex-row gap-2 h-[205px]">
      {items.map((item, index) => (
        <CarouselItemComponent
          key={item.value}
          item={item}
          selected={index === currentItem}
          onClick={() => {
            setCurrentItem(index);
            onItemSelected(item);
          }}
        />
      ))}
    </div>
  );
};

export default Carousel;
