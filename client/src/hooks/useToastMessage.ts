import { useState, useEffect, useCallback } from "react";

type ToastStatus = "success" | "failure" | "";

export interface Toast {
  status: ToastStatus;
  message: string;
}

export interface UseToastMessageReturn {
  toast: Toast;
  triggerSuccessToast: (message: string) => void;
  triggerFailureToast: (message: string) => void;
  toastDetailsSet: () => boolean;
}

export const useToastMessage = (autoClearMs: number = 5000): UseToastMessageReturn => {
  const [toast, setToast] = useState<Toast>({ status: "", message: "" });

  useEffect(() => {
    if (!toast.message) return;

    const timeoutId = setTimeout(() => {
      setToast({ status: "", message: "" });
    }, autoClearMs);

    return () => clearTimeout(timeoutId);
  }, [toast, autoClearMs]);

  const triggerToast = useCallback((toastData: Toast) => {
    setToast(toastData);
  }, []);

  const triggerSuccessToast = useCallback(
    (message: string) => {
      triggerToast({ status: "success", message });
    },
    [triggerToast]
  );

  const triggerFailureToast = useCallback(
    (message: string) => {
      triggerToast({ status: "failure", message });
    },
    [triggerToast]
  );

  const toastDetailsSet = (): boolean => {
    return Object.values(toast).every((v) => !!v);
  };

  return {
    toast,
    triggerSuccessToast,
    triggerFailureToast,
    toastDetailsSet,
  };
};
