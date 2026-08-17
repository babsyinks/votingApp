import { useIsMobile } from "features/dashboard/hooks/use-mobile";
import * as React from "react";

import {
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from "./constants";
import { SidebarContext } from "./context";

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  children,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value);
      _setOpen(value);
      // eslint-disable-next-line max-len
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((v) => !v) : setOpen(!open);
  }, [isMobile, open, setOpen]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
