import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Images, imageTitles, imagesToUrl } from "./consts";
import OptimizedImage from "../ui/optimizedImage";

interface ImagesDropdownProps {
  onImageSelect: (image: Images, url?: string) => void;
  defaultImage?: Images;
}

const DropdownItem = ({ image }: { image: Images }) => {
  return (
    <div className="flex flex-row justify-start items-center gap-2" key={image}>
      <OptimizedImage
        src={imagesToUrl[image] || ""}
        alt={image}
        fill
        className="!w-6 !h-6 rounded-md"
      />
      <span className="text-primary">{image}</span>
    </div>
  );
};

const ImagesDropdown: React.FC<ImagesDropdownProps> = ({
  onImageSelect,
  defaultImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<Images>(
    defaultImage || "Debut",
  );

  useEffect(() => {
    setSelectedImage(defaultImage || "Debut");
  }, [defaultImage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          className="w-full rounded-md text-start justify-start px-3 hover:bg-transparent"
        >
          <DropdownItem image={selectedImage} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background w-full">
        {imageTitles.map((title: Images) => (
          <DropdownMenuItem
            className="bg-background w-full hover:bg-primary/30"
            key={title}
            onSelect={() => {
              setSelectedImage(title);
              onImageSelect(title, imagesToUrl[title]);
            }}
          >
            <DropdownItem image={title} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImagesDropdown;
