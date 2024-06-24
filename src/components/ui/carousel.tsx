"use client";

import React from "react";
import { cn } from "../../lib/utils";
import OptimizedImage from "./optimizedImage";

export interface CarouselItem {
  title: string;
  value: string;
  image: string;
}

interface CarouselProps {
  items: CarouselItem[];
  onItemSelected: (item: CarouselItem) => void;
  defaultSelected?: number;
  selected?: number;
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
      onClick={onClick}
      className={cn("w-full h-[205px] z-20 relative min-w-14 hover:cursor-pointer", {
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
          {item.title}
        </h3>
      )}
    </div>
  );
};

const Carousel: React.FC<CarouselProps> = ({
  items,
  onItemSelected,
  defaultSelected,
  selected,
}) => {
  const [currentItem, setCurrentItem] = React.useState(defaultSelected || 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative flex flex-row gap-2 h-[205px]">
      {items.map((item, index) => (
        <CarouselItemComponent
          key={item.title}
          item={item}
          selected={selected ? index === selected : index === currentItem}
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
