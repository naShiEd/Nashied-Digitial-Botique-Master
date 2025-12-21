import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        // 🚀 Lenis Smooth Scroll Initialization
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        const scrollFn = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(scrollFn);
        };

        requestAnimationFrame(scrollFn);

        // Sync ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // GSAP ScrollTrigger Progress Bar Sync (More Robust)
        gsap.to("#scroll-progress", {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            }
        });

        // 🎭 GSAP REVEAL ANIMATIONS
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [location.pathname]);

    return (
        <div ref={scrollRef} className="relative">
            {/* 📏 Simple Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
                <div
                    id="scroll-progress"
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-0 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                />
            </div>

            {children}
        </div>
    );
};
