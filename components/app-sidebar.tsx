"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookIcon,
  BugIcon,
  CrownIcon,
  FileTextIcon,
  GithubLogoIcon,
  InfoIcon,
  PlusIcon,
  ShieldIcon,
} from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";

import { updateChatVisibility } from "@/actions";
import {
  deleteChat,
  getRecentChats,
  updateChatPinned,
  updateChatTitle,
} from "@/actions";
import { RecentChatsSection } from "@/components/app-sidebar/recent-chats-section";
import { SidebarDialogs } from "@/components/app-sidebar/sidebar-dialogs";
import type {
  RecentChat,
  VisibilityType,
} from "@/components/app-sidebar/types";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComprehensiveUserData } from "@/lib/user-data-server";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  user: ComprehensiveUserData | null;
  isProUser?: boolean;
}

type SidebarLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon: React.ComponentType<any>;
};

const SIGNED_OUT_LINKS: SidebarLink[] = [
  { id: "about", label: "About", href: "/about", icon: InfoIcon },
  { id: "blog", label: "Blog", href: "/blog", icon: BookIcon },
  { id: "terms", label: "Terms", href: "/terms", icon: FileTextIcon },
  {
    id: "privacy",
    label: "Privacy",
    href: "/privacy-policy",
    icon: ShieldIcon,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://git.new/scira",
    icon: GithubLogoIcon,
    external: true,
  },
  {
    id: "feedback",
    label: "Feedback",
    href: "https://scira.userjot.com",
    icon: BugIcon,
    external: true,
  },
];

function BrandMark() {
  return (
    <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-semibold uppercase text-background">
      s
    </div>
  );
}

export const AppSidebar = memo(({ user, isProUser }: AppSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { state, isMobile, setOpenMobile } = useSidebar();

  const [isRecentCollapsed, setIsRecentCollapsed] = React.useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      try {
        return JSON.parse(
          window.localStorage.getItem("scira-recent-collapsed") || "false",
        );
      } catch {
        return false;
      }
    },
  );
  const [renameTarget, setRenameTarget] = React.useState<{
    id: string;
    title?: string | null;
  } | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [shareTarget, setShareTarget] = React.useState<{
    id: string;
    visibility: VisibilityType;
  } | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string;
    title?: string | null;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openMenuChatId, setOpenMenuChatId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        "scira-recent-collapsed",
        JSON.stringify(isRecentCollapsed),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [isRecentCollapsed]);

  const closeMobileSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  const { data: chatsData, isLoading: isChatsLoading } = useQuery({
    queryKey: ["recent-chats", user?.id],
    enabled: Boolean(user?.id),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
    queryFn: async () => {
      if (!user?.id) return { chats: [], hasMore: false };
      return getRecentChats(user.id, 8);
    },
  });

  const recentChats: RecentChat[] = chatsData?.chats || [];

  const invalidateRecentChats = React.useCallback(() => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ["recent-chats", user.id] });
    }
  }, [queryClient, user?.id]);

  const closeRenameDialog = React.useCallback(() => {
    setRenameTarget(null);
    setRenameValue("");
  }, []);

  const openRenameDialog = React.useCallback((chat: RecentChat) => {
    setRenameTarget({ id: chat.id, title: chat.title });
    setRenameValue(chat.title || "Untitled Chat");
  }, []);

  const openShareDialog = React.useCallback(
    (chat: RecentChat, visibility: VisibilityType) => {
      setShareTarget({ id: chat.id, visibility });
      setShareDialogOpen(true);
    },
    [],
  );

  const openDeleteDialog = React.useCallback((chat: RecentChat) => {
    setDeleteTarget({ id: chat.id, title: chat.title });
  }, []);

  const togglePinnedChat = React.useCallback(
    async (chatId: string) => {
      const selectedChat = recentChats.find((chat) => chat.id === chatId);
      if (!selectedChat) return;

      try {
        const nextPinned = !selectedChat.isPinned;
        const updatedChat = await updateChatPinned(chatId, nextPinned);
        if (!updatedChat) {
          sileo.error({ title: "Failed to update pinned state" });
          return;
        }

        queryClient.setQueryData(["recent-chats", user?.id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            chats: oldData.chats.map((chat: RecentChat) =>
              chat.id === chatId ? { ...chat, isPinned: nextPinned } : chat,
            ),
          };
        });
      } catch (error) {
        console.error("Failed to update pinned state:", error);
        sileo.error({ title: "Failed to update pinned state" });
      } finally {
        invalidateRecentChats();
      }
    },
    [invalidateRecentChats, queryClient, recentChats, user?.id],
  );

  const handleRenameSubmit = React.useCallback(async () => {
    if (!renameTarget) return;

    const nextTitle = renameValue.trim();
    if (!nextTitle) {
      sileo.error({ title: "Title cannot be empty" });
      return;
    }

    try {
      setIsRenaming(true);
      const updatedChat = await updateChatTitle(renameTarget.id, nextTitle);
      if (!updatedChat) {
        sileo.error({ title: "Failed to update title" });
        return;
      }

      closeRenameDialog();
      invalidateRecentChats();
      sileo.success({ title: "Title updated" });
    } catch (error) {
      console.error("Failed to update title:", error);
      sileo.error({ title: "Failed to update title" });
    } finally {
      setIsRenaming(false);
    }
  }, [closeRenameDialog, invalidateRecentChats, renameTarget, renameValue]);

  const handleShareVisibilityChange = React.useCallback(
    async (visibility: VisibilityType) => {
      if (!shareTarget) return;

      try {
        const result = await updateChatVisibility(shareTarget.id, visibility);
        if (!result?.success) {
          throw new Error("Failed to update chat visibility");
        }

        setShareTarget((current) =>
          current ? { ...current, visibility } : current,
        );
        invalidateRecentChats();
      } catch (error) {
        console.error("Failed to update chat visibility:", error);
        throw error;
      }
    },
    [invalidateRecentChats, shareTarget],
  );

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteChat(deleteTarget.id);
      setDeleteTarget(null);
      invalidateRecentChats();
      sileo.success({ title: "Chat deleted" });

      if (pathname?.includes(deleteTarget.id)) {
        router.push("/new");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      sileo.error({ title: "Failed to delete chat" });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, invalidateRecentChats, pathname, router]);

  return (
    <Sidebar
      collapsible="icon"
      className="shadow-none! border-none! **:data-[slot=sidebar-inner]:light:bg-primary/10 **:data-[slot=sidebar-inner]:dark:bg-primary/4 **:data-[slot=sidebar-inner]:colourful:bg-primary/10 **:data-[slot=sidebar-inner]:text-sidebar-foreground **:data-[slot=sidebar-gap]:bg-transparent"
    >
      <SidebarHeader className="p-0!">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative flex h-12 w-full items-center overflow-visible px-2">
              <Button
                variant="ghost"
                className="h-auto w-fit justify-start px-2 py-1 hover:bg-primary/10! group-data-[collapsible=icon]:p-0"
              >
                <Link
                  href="/new"
                  prefetch
                  onClick={closeMobileSidebar}
                  aria-label="New chat"
                  className="inline-flex w-fit items-center gap-2 group-data-[collapsible=icon]:mx-auto"
                >
                  <BrandMark />
                  <div className="flex flex-row items-center gap-2 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-be-vietnam-pro text-xl font-light tracking-tighter">
                      scira
                    </span>
                    {user && isProUser && (
                      <span className="animate-shimmer inline-flex h-4 min-w-6 items-center justify-center rounded-md bg-linear-to-br from-secondary/30 via-primary/25 to-accent/30 px-1.5 pb-0.5 pt-0 text-xs font-baumans text-foreground shadow-sm ring-1 ring-primary/25 ring-offset-1 ring-offset-background dark:from-primary dark:via-secondary dark:to-primary dark:ring-primary/40">
                        {user.isMaxUser ? "max" : "pro"}
                      </span>
                    )}
                  </div>
                </Link>
              </Button>

              <div className="absolute right-2 top-2 group-data-[collapsible=icon]:hidden">
                <Tooltip>
                  <TooltipTrigger>
                    <SidebarTrigger className="size-8" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    hidden={state !== "expanded" || isMobile}
                  >
                    Close Sidebar{" "}
                    <span className="pl-0.5 text-xs text-secondary">⌘B</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-data-[collapsible=icon]:group-hover:pointer-events-auto group-data-[collapsible=icon]:group-hover:opacity-100">
                <Tooltip>
                  <TooltipTrigger>
                    <SidebarTrigger className="size-8 opacity-0 transition-opacity duration-200 group-data-[collapsible=icon]:group-hover:opacity-100" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    hidden={state !== "collapsed" || isMobile}
                  >
                    Open Sidebar{" "}
                    <span className="pl-1 text-xs text-secondary">⌘B</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarGroup className="shrink-0 gap-0 p-2 pb-0">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Chat"
              className="bg-primary/10 font-medium text-sidebar-accent-foreground transition-all duration-200 active:scale-[0.98] hover:bg-primary/20"
            >
              <Link
                prefetch
                href="/new"
                onClick={closeMobileSidebar}
                className="flex items-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
              >
                <PlusIcon size={18} weight="bold" />
                <span className="group-data-[collapsible=icon]:hidden">
                  New Search
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {!user &&
            SIGNED_OUT_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    tooltip={link.label}
                    className="hover:bg-primary/10"
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMobileSidebar}
                        className="flex w-full items-center gap-2"
                      >
                        <Icon size={18} weight="regular" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {link.label}
                        </span>
                      </a>
                    ) : (
                      <Link
                        prefetch
                        href={link.href}
                        onClick={closeMobileSidebar}
                        className="flex items-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                      >
                        <Icon size={18} weight="regular" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>

        {user && (
          <button
            type="button"
            onClick={() => setIsRecentCollapsed((current) => !current)}
            className="flex w-full items-center justify-between px-2 pb-1 pt-2 text-left text-muted-foreground/80 transition-colors hover:text-foreground group-data-[collapsible=icon]:hidden"
            aria-expanded={!isRecentCollapsed}
          >
            <span className="font-pixel text-[11px] uppercase tracking-[0.12em]">
              Recent
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-150",
                isRecentCollapsed ? "-rotate-90" : "rotate-0",
              )}
            />
          </button>
        )}
      </SidebarGroup>

      <SidebarContent className="p-2 pt-0">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          {user && !isRecentCollapsed && (
            <div className="group-data-[collapsible=icon]:hidden">
              <RecentChatsSection
                recentChats={recentChats}
                isChatsLoading={isChatsLoading}
                pathname={pathname}
                openMenuChatId={openMenuChatId}
                setOpenMenuChatId={setOpenMenuChatId}
                closeMobileSidebar={closeMobileSidebar}
                onTogglePinned={togglePinnedChat}
                onRename={openRenameDialog}
                onShare={openShareDialog}
                onDelete={openDeleteDialog}
              />
            </div>
          )}
        </SidebarMenu>

        {user && !isProUser && (
          <SidebarGroup className="mt-auto p-0">
            <SidebarGroupContent>
              <div className="group-data-[collapsible=icon]:hidden">
                <Link
                  prefetch
                  href="/pricing"
                  onClick={closeMobileSidebar}
                  className="group/upgrade relative flex flex-col gap-1.5 overflow-hidden rounded-2xl bg-muted p-4 pb-3 transition-colors hover:bg-muted/80"
                >
                  <span className="text-base font-medium">Upgrade to Pro</span>
                  <span className="pr-12 text-xs text-muted-foreground">
                    Unlimited searches, 100+ apps, voice & more
                  </span>
                  <div className="absolute -bottom-2 -right-2 flex size-14 items-center justify-center rounded-full bg-background transition-transform duration-300 group-hover/upgrade:scale-110">
                    <CrownIcon size={22} className="text-foreground" />
                  </div>
                </Link>
              </div>

              <div className="hidden group-data-[collapsible=icon]:block">
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      prefetch
                      href="/pricing"
                      onClick={closeMobileSidebar}
                      className="mx-auto flex size-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
                    >
                      <CrownIcon size={16} className="text-foreground" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    Upgrade to Pro
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarDialogs
        user={user}
        renameTarget={renameTarget}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
        closeRenameDialog={closeRenameDialog}
        isRenaming={isRenaming}
        onRenameSubmit={handleRenameSubmit}
        shareTarget={shareTarget}
        shareDialogOpen={shareDialogOpen}
        setShareDialogOpen={setShareDialogOpen}
        onShareVisibilityChange={handleShareVisibilityChange}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        isDeleting={isDeleting}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";
