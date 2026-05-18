export type VisibilityType = "public" | "private";

export type RecentChat = {
  id: string;
  title?: string | null;
  visibility?: VisibilityType;
  isPinned?: boolean;
  updatedAt?: string | Date;
  createdAt?: string | Date;
};
