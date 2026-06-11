/* Beamcove landing — app root.
   Assembles the sections and keeps lucide icons + scroll reveals in sync. */

import { useEffect } from "react";

import { Newsletter } from "@/app/components/newsletter";
import { Crew, Fleet, Footer, Hero, Nav, Values, What } from "@/app/components/sections";
import { refreshIcons } from "@/app/utils/icons";

const INK_PRESET = "shore";

export default function App() {
    // re-stamp lucide icons whenever the rendered tree changes
    useEffect(() => {
        refreshIcons();
    });

    // scroll reveals
    useEffect(() => {
        const reveal = (el: Element) => el.classList.add("in");
        const els = document.querySelectorAll(".lp-reveal:not(.in)");
        if (!("IntersectionObserver" in window)) {
            els.forEach(reveal);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        reveal(e.target);
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        // reveal anything already in view on mount (IO may not fire for these)
        els.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
            else io.observe(el);
        });
        // safety net: never leave content stuck hidden if IO never fires
        const fallback = setTimeout(() => {
            document.querySelectorAll(".lp-reveal:not(.in)").forEach(reveal);
        }, 1400);
        return () => {
            io.disconnect();
            clearTimeout(fallback);
        };
    });

    return (
        <>
            <Nav />
            <main>
                <Hero
                    inkPreset={INK_PRESET}
                    eyebrow="A fleet of creative ventures"
                    headline="Charting new horizons in the digital sea."
                    subhead="Beamcove is home to a fleet of creative digital ventures — apps, tools, and other bounties, each built with craft and a little seafaring fun."
                />
                <What />
                <Fleet />
                <Values />
                <Crew />
                <Newsletter inkPreset={INK_PRESET} />
            </main>
            <Footer />
        </>
    );
}
