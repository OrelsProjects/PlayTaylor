export type NotificationType = "play-taylor";

export type NotificationData = {
  title: string;
  type: NotificationType;
  body?: string;
  image?: string;
  onClick?: () => void;
};
