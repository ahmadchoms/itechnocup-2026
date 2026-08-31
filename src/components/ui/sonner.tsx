"use client";

import * as React from "react";
import { toast as baseToast, Toaster as BaseToaster } from "@/components/ui/toast";

export const toast = {
  success: (title: string, options?: { description?: string }) => {
    baseToast.add({
      title,
      description: options?.description,
      type: "success",
    });
  },
  error: (title: string, options?: { description?: string }) => {
    baseToast.add({
      title,
      description: options?.description,
      type: "error",
    });
  },
  info: (title: string, options?: { description?: string }) => {
    baseToast.add({
      title,
      description: options?.description,
      type: "info",
    });
  },
  warning: (title: string, options?: { description?: string }) => {
    baseToast.add({
      title,
      description: options?.description,
      type: "warning",
    });
  },
};

export function Toaster(props: React.ComponentProps<typeof BaseToaster>) {
  return <BaseToaster {...props} />;
}
