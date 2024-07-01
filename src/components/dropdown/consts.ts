export type Images =
  | "Debut"
  | "Fearless"
  | "Speak Now"
  | "Red"
  | "1989"
  | "Reputation"
  | "Lover"
  | "Folklore"
  | "Evermore"
  | "Midnights"
  | "TTPD";

export const imageTitles: Images[] = [
  "Debut",
  "Fearless",
  "Speak Now",
  "Red",
  "1989",
  "Reputation",
  "Lover",
  "Folklore",
  "Evermore",
  "Midnights",
  "TTPD",
];

export type ImagesToUrl = Record<Images, string | undefined>;

export const imagesToUrl: ImagesToUrl = {
  Debut: process.env.NEXT_PUBLIC_IMAGE_LOW_DEBUT,
  Fearless: process.env.NEXT_PUBLIC_IMAGE_LOW_FEARLESS,
  "Speak Now": process.env.NEXT_PUBLIC_IMAGE_LOW_SPEAK_NOW,
  Red: process.env.NEXT_PUBLIC_IMAGE_LOW_RED,
  "1989": process.env.NEXT_PUBLIC_IMAGE_LOW_1989,
  Reputation: process.env.NEXT_PUBLIC_IMAGE_LOW_REPUTATION,
  Lover: process.env.NEXT_PUBLIC_IMAGE_LOW_LOVER,
  Folklore: process.env.NEXT_PUBLIC_IMAGE_LOW_FOLKLORE,
  Evermore: process.env.NEXT_PUBLIC_IMAGE_LOW_EVERMORE,
  Midnights: process.env.NEXT_PUBLIC_IMAGE_LOW_MIDNIGHTS,
  TTPD: process.env.NEXT_PUBLIC_IMAGE_LOW_TTPD,
};

export const urlToImages: Record<string, Images> = {
  [process.env.NEXT_PUBLIC_IMAGE_LOW_DEBUT as string]: "Debut",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_FEARLESS as string]: "Fearless",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_SPEAK_NOW as string]: "Speak Now",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_RED as string]: "Red",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_1989 as string]: "1989",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_REPUTATION as string]: "Reputation",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_LOVER as string]: "Lover",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_FOLKLORE as string]: "Folklore",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_EVERMORE as string]: "Evermore",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_MIDNIGHTS as string]: "Midnights",
  [process.env.NEXT_PUBLIC_IMAGE_LOW_TTPD as string]: "TTPD",
};
