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

type UnmarkWorkoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function UnmarkWorkoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: UnmarkWorkoutDialogProps) {
  const { unmarkWorkout } = copy.dialogs;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-describedby={undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{unmarkWorkout.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="secondary" className="min-h-11">
            {unmarkWorkout.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="outline"
            className="min-h-11 border-destructive text-destructive hover:bg-destructive/10"
            onClick={onConfirm}
          >
            {unmarkWorkout.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
