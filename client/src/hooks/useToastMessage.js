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

  const triggerSuccessToast = useCallback(
    (message) => {
      triggerToast({ status: "success", message });
    },
    [triggerToast],
  );

  const triggerFailureToast = useCallback(
    (message) => {
      triggerToast({ status: "failure", message });
    },
    [triggerToast],
  );

  const toastDetailsSet = () => {
    return Object.values(toast).every((v) => !!v);
  };

  return {
    toast,
    triggerSuccessToast,
    triggerFailureToast,
    toastDetailsSet,
  };
};
