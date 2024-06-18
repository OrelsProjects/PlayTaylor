"use client";

import * as React from "react";
import "react-toastify/dist/ReactToastify.css";
import SizeContext from "../../lib/context/sizeContext";
import { ThemeProvider } from "./ThemeProvider";
import * as toast from "react-toastify";
import NavIconContainer from "../../components/navIconContainer";
import { useAppSelector } from "../../lib/hooks/redux";
import { cn } from "../../lib/utils";
import { useTheme } from "next-themes";

interface ContentProviderProps {
  children: React.ReactNode;
}

const BOTTOM_BAR_HEIGHT = 65;

const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { user, state } = useAppSelector(state => state.auth);
  const { theme } = useTheme();
  const sizeContent = React.useContext(SizeContext);
  const bottomBarRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number>(
    sizeContent.height,
  );
  ("use client");

  React.useEffect(() => {
    if (bottomBarRef.current) {
      setContentHeight(sizeContent.height - bottomBarRef.current.clientHeight);
    } else {
      setContentHeight(sizeContent.height - BOTTOM_BAR_HEIGHT);
    }
  }, [sizeContent.height, bottomBarRef, bottomBarRef.current]);

  return (
    <div
      className={cn(
        "h-full w-full lg:max-w-[65rem] mx-auto lg:flex p-4 py-5 pb-8 relative",
      )}
    >
      <ThemeProvider>
        <div className="relative z-[51]">
          <toast.ToastContainer
            stacked
            newestOnTop
            theme={theme === "system" ? "light" : theme}
            autoClose={2500}
            draggablePercent={60}
            className="!mb-16 z-[51]"
            transition={toast.Flip}
            position="bottom-center"
            pauseOnHover={false}
          />
        </div>
        <div className="w-full h-full flex flex-col gap-4 relative z-10 overflow-visible scrollbar-hide md:scrollbar-visible md:px-4">
          <NavIconContainer />
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default ContentProvider;
