import React from "react";

import { ShareDialog } from "@/components/share-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ComprehensiveUserData } from "@/lib/user-data-server";

import type { VisibilityType } from "./types";

interface SidebarDialogsProps {
  user: ComprehensiveUserData | null;
  renameTarget: { id: string; title?: string | null } | null;
  renameValue: string;
  setRenameValue: (value: string) => void;
  closeRenameDialog: () => void;
  isRenaming: boolean;
  onRenameSubmit: () => void | Promise<void>;
  shareTarget: { id: string; visibility: VisibilityType } | null;
  shareDialogOpen: boolean;
  setShareDialogOpen: (open: boolean) => void;
  onShareVisibilityChange: (visibility: VisibilityType) => Promise<void>;
  deleteTarget: { id: string; title?: string | null } | null;
  setDeleteTarget: (
    target: { id: string; title?: string | null } | null,
  ) => void;
  isDeleting: boolean;
  onDeleteConfirm: () => void | Promise<void>;
}

export function SidebarDialogs({
  user,
  renameTarget,
  renameValue,
  setRenameValue,
  closeRenameDialog,
  isRenaming,
  onRenameSubmit,
  shareTarget,
  shareDialogOpen,
  setShareDialogOpen,
  onShareVisibilityChange,
  deleteTarget,
  setDeleteTarget,
  isDeleting,
  onDeleteConfirm,
}: SidebarDialogsProps) {
  return (
    <>
      {shareTarget && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          chatId={shareTarget.id}
          selectedVisibilityType={shareTarget.visibility}
          onVisibilityChange={onShareVisibilityChange}
          isOwner
          user={user}
        />
      )}

      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => !open && closeRenameDialog()}
      >
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Edit title</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <Input
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void onRenameSubmit();
                if (event.key === "Escape") closeRenameDialog();
              }}
              placeholder="Enter title..."
              maxLength={100}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRenameDialog}>
              Cancel
            </Button>
            <Button onClick={() => void onRenameSubmit()} disabled={isRenaming}>
              {isRenaming ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              {deleteTarget?.title
                ? ` \"${deleteTarget.title}\"`
                : " this chat"}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void onDeleteConfirm()}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
