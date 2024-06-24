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
