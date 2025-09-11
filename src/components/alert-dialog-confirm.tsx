"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, ButtonLoading } from "./ui/button";

interface Props {
  open?: boolean;
  setOpen?: (val: boolean) => void;
  trigger?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  onOk?: () => void;
  loading?: boolean;
}

const AlertDialogConfirm = (props: Props) => {
  const { open, setOpen, trigger, title, description, onOk, loading } = props;
  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      {trigger ? (
        <AlertDialogTrigger asChild>
          {trigger || <Button variant="outline">Show Dialog</Button>}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild={!!description}>
            {description ||
              `This action cannot be undone. This will permanently delete your
            data and remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <ButtonLoading loading={loading} onClick={onOk}>
            Continue
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogConfirm;
