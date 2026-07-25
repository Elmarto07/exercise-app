"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { copy } from "@/lib/copy/es";

type ExitStretchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ExitStretchDialog({
  open,
  onOpenChange,
  onConfirm,
}: ExitStretchDialogProps) {
  const { exitStretch } = copy.dialogs;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{exitStretch.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="secondary" className="min-h-11">
            {exitStretch.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="outline"
            className="min-h-11"
            onClick={(event) => {
              // Keep dialog open until navigation unmounts — closing first
              // can unfreeze auto-advance when remaining === 0 (AC5).
              event.preventDefault();
              onConfirm();
            }}
          >
            {exitStretch.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
