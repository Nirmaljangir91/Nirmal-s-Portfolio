import { lazy, PropsWithChildren, Suspense, useEffect, useRef, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import ContactForm from "./ContactForm";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [shouldLoadTechStack, setShouldLoadTechStack] = useState(false);
  const techStackTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId = 0;

    const syncLayout = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };

    const resizeHandler = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncLayout);
    };

    syncLayout();
    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (!isDesktopView || shouldLoadTechStack) return;

    const trigger = techStackTriggerRef.current;
    if (!trigger || !("IntersectionObserver" in window)) {
      setShouldLoadTechStack(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setShouldLoadTechStack(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [isDesktopView, shouldLoadTechStack]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <div ref={techStackTriggerRef}>
                {shouldLoadTechStack ? (
                  <Suspense fallback={<div>Loading....</div>}>
                    <TechStack />
                  </Suspense>
                ) : (
                  <div style={{ minHeight: "60vh" }} />
                )}
              </div>
            )}
            <ContactForm />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
