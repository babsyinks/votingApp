import { useState, useEffect, useCallback } from "react";

export const useToastMessage = (autoClearMs = 5000) => {
  const [toast, setToast] = useState({ status: "", message: "" });

  useEffect(() => {
    if (!toast.message) return;

    const timeoutId = setTimeout(() => {
      setToast({ status: "", message: "" });
    }, autoClearMs);

    return () => clearTimeout(timeoutId);
  }, [toast, autoClearMs]);

  const triggerToast = useCallback(({ status, message }) => {
    setToast({ status, message });
  }, []);

  const toastDetailsSet = () => {
    return Object.values(toast).every((v) => !!v);
  };

  return { toast, triggerToast, toastDetailsSet };
};
