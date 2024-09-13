export type AlbumName =
  | "debut"
  | "fearless"
  | "speak-now"
  | "red"
  | "1989"
  | "reputation"
  | "lover"
  | "folklore"
  | "evermore"
  | "midnights"
  | "ttpd";

export const albumNamesArray: AlbumName[] = [
  "debut",
  "fearless",
  "speak-now",
  "red",
  "1989",
  "reputation",
  "lover",
  "folklore",
  "evermore",
  "midnights",
  "ttpd",
];

export const getAlbumImageUrl = (imageName: AlbumName) => {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  return cdnUrl + "/albums/" + imageName + ".png";
};
