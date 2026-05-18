import Link from "next/link";
import {
  Globe,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Share2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { RecentChat, VisibilityType } from "./types";

type GroupedChats = {
  label: string;
  chats: RecentChat[];
};

interface RecentChatRowProps {
  chat: RecentChat;
  isCurrentChat: boolean;
  isMenuOpen: boolean;
  closeMobileSidebar: () => void;
  setOpenMenuChatId: (chatId: string | null) => void;
  onTogglePinned: (chatId: string) => void;
  onRename: (chat: RecentChat) => void;
  onShare: (chat: RecentChat, visibility: VisibilityType) => void;
  onDelete: (chat: RecentChat) => void;
}

interface RecentChatsSectionProps {
  recentChats: RecentChat[];
  isChatsLoading: boolean;
  pathname: string | null;
  openMenuChatId: string | null;
  setOpenMenuChatId: (chatId: string | null) => void;
  closeMobileSidebar: () => void;
  onTogglePinned: (chatId: string) => void;
  onRename: (chat: RecentChat) => void;
  onShare: (chat: RecentChat, visibility: VisibilityType) => void;
  onDelete: (chat: RecentChat) => void;
}

function groupChatsByDate(chats: RecentChat[]): GroupedChats[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: GroupedChats[] = [];
  const todayChats: RecentChat[] = [];
  const yesterdayChats: RecentChat[] = [];
  const thisWeekChats: RecentChat[] = [];
  const olderChats: RecentChat[] = [];

  chats.forEach((chat) => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt || 0);
    const chatDay = new Date(
      chatDate.getFullYear(),
      chatDate.getMonth(),
      chatDate.getDate(),
    );

    if (chatDay.getTime() === today.getTime()) {
      todayChats.push(chat);
      return;
    }

    if (chatDay.getTime() === yesterday.getTime()) {
      yesterdayChats.push(chat);
      return;
    }

    if (chatDay > weekAgo) {
      thisWeekChats.push(chat);
      return;
    }

    olderChats.push(chat);
  });

  if (todayChats.length) groups.push({ label: "Today", chats: todayChats });
  if (yesterdayChats.length) {
    groups.push({ label: "Yesterday", chats: yesterdayChats });
  }
  if (thisWeekChats.length) {
    groups.push({ label: "This Week", chats: thisWeekChats });
  }
  if (olderChats.length) groups.push({ label: "Older", chats: olderChats });

  return groups;
}

function RecentChatRow({
  chat,
  isCurrentChat,
  isMenuOpen,
  closeMobileSidebar,
  setOpenMenuChatId,
  onTogglePinned,
  onRename,
  onShare,
  onDelete,
}: RecentChatRowProps) {
  const isPublic = chat.visibility === "public";
  const normalizedVisibility: VisibilityType = isPublic ? "public" : "private";
  const isPinned = Boolean(chat.isPinned);

  return (
    <SidebarMenuItem>
      <DropdownMenu
        open={isMenuOpen}
        onOpenChange={(open) => setOpenMenuChatId(open ? chat.id : null)}
      >
        <div
          className={cn(
            "group flex w-full items-center rounded-md transition-all duration-200",
            isCurrentChat || isMenuOpen
              ? "bg-primary/15"
              : "hover:bg-primary/8",
          )}
        >
          <Link
            prefetch
            href={`/search/${chat.id}`}
            onClick={closeMobileSidebar}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5",
              isCurrentChat && "font-medium",
            )}
          >
            {isPublic && <Globe className="h-3.5 w-3.5 shrink-0 opacity-60" />}
            <span className="flex-1 truncate text-sm">
              {chat.title || "Untitled Chat"}
            </span>
          </Link>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-7 w-7 shrink-0 text-muted-foreground opacity-60 transition-opacity duration-150 hover:text-foreground hover:opacity-100 data-[state=open]:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open chat actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" sideOffset={20}>
            <DropdownMenuItem onClick={() => onTogglePinned(chat.id)}>
              {isPinned ? (
                <PinOff className="mr-2 h-4 w-4" />
              ) : (
                <Pin className="mr-2 h-4 w-4" />
              )}
              {isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename(chat)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit title
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onShare(chat, normalizedVisibility)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(chat)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

export function RecentChatsSection({
  recentChats,
  isChatsLoading,
  pathname,
  openMenuChatId,
  setOpenMenuChatId,
  closeMobileSidebar,
  onTogglePinned,
  onRename,
  onShare,
  onDelete,
}: RecentChatsSectionProps) {
  const pinnedRecentChats = recentChats.filter((chat) => chat.isPinned);
  const groupedChats = groupChatsByDate(
    recentChats.filter((chat) => !chat.isPinned),
  );

  if (isChatsLoading && !recentChats.length) {
    return Array.from({ length: 5 }).map((_, index) => (
      <SidebarMenuItem key={`chat-skeleton-${index}`}>
        <div
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Skeleton className="h-4 flex-1 rounded bg-primary/10" />
        </div>
      </SidebarMenuItem>
    ));
  }

  if (!recentChats.length) {
    return (
      <SidebarMenuItem>
        <div className="px-2 py-1.5">
          <span className="text-sm text-sidebar-foreground/50">
            No chats yet
          </span>
        </div>
      </SidebarMenuItem>
    );
  }

  return (
    <>
      {pinnedRecentChats.length > 0 && (
        <div className="mb-2">
          <div className="px-2 py-1">
            <span className="font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground/50">
              Pinned
            </span>
          </div>
          {pinnedRecentChats.map((chat) => (
            <RecentChatRow
              key={chat.id}
              chat={chat}
              isCurrentChat={Boolean(pathname?.includes(chat.id))}
              isMenuOpen={openMenuChatId === chat.id}
              closeMobileSidebar={closeMobileSidebar}
              setOpenMenuChatId={setOpenMenuChatId}
              onTogglePinned={onTogglePinned}
              onRename={onRename}
              onShare={onShare}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      {groupedChats.map((group) => (
        <div key={group.label} className="mb-2">
          <div className="px-2 py-1">
            <span className="font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground/50">
              {group.label}
            </span>
          </div>
          {group.chats.map((chat) => (
            <RecentChatRow
              key={chat.id}
              chat={chat}
              isCurrentChat={Boolean(pathname?.includes(chat.id))}
              isMenuOpen={openMenuChatId === chat.id}
              closeMobileSidebar={closeMobileSidebar}
              setOpenMenuChatId={setOpenMenuChatId}
              onTogglePinned={onTogglePinned}
              onRename={onRename}
              onShare={onShare}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </>
  );
}
