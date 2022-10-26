import { useState, useEffect } from "react";

const useMobileView = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      if(window.innerWidth < 900) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return isMobileView;
}

export default useMobileView;