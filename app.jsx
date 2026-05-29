/* Beamcove landing — app entry.
   Assembles the sections, wires the Tweaks panel (ink preset, hero copy,
   section visibility), and keeps lucide icons + scroll reveals in sync. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "inkPreset": "shore",
  "heroEyebrow": "A fleet of creative ventures",
  "heroHeadline": "Charting new horizons in the digital sea.",
  "heroSubhead": "Beamcove is home to a fleet of creative digital ventures — apps, tools, and other bounties, each built with craft and a little seafaring fun.",
  "showWhat": true,
  "showFleet": true,
  "showValues": true,
  "showCrew": true
}/*EDITMODE-END*/;

const INK_PRESETS = [
  { value: "shore", label: "Shore" },
  { value: "reef", label: "Reef" },
  { value: "dusk", label: "Dusk" },
  { value: "calm", label: "Calm" },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // re-stamp lucide icons whenever the rendered tree changes
  React.useEffect(() => { refreshIcons(); });

  // scroll reveals
  React.useEffect(() => {
    const reveal = (el) => el.classList.add("in");
    const els = document.querySelectorAll(".lp-reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    // reveal anything already in view on mount (IO may not fire for these)
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      else io.observe(el);
    });
    // safety net: never leave content stuck hidden if IO never fires
    const fallback = setTimeout(() => {
      document.querySelectorAll(".lp-reveal:not(.in)").forEach(reveal);
    }, 1400);
    return () => { io.disconnect(); clearTimeout(fallback); };
  });

  return (
    <>
      <Nav />
      <main>
        <Hero
          inkPreset={t.inkPreset}
          eyebrow={t.heroEyebrow}
          headline={t.heroHeadline}
          subhead={t.heroSubhead}
        />
        {t.showWhat && <What />}
        {t.showFleet && <Fleet />}
        {t.showValues && <Values />}
        {t.showCrew && <Crew />}
        <Newsletter inkPreset={t.inkPreset} />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Ink background" />
        <TweakSelect label="Preset" value={t.inkPreset} options={INK_PRESETS}
                     onChange={(v) => setTweak("inkPreset", v)} />

        <TweakSection label="Hero copy" />
        <TweakText label="Eyebrow" value={t.heroEyebrow}
                   onChange={(v) => setTweak("heroEyebrow", v)} />
        <TweakText label="Headline" value={t.heroHeadline}
                   onChange={(v) => setTweak("heroHeadline", v)} />
        <TweakText label="Subhead" value={t.heroSubhead}
                   onChange={(v) => setTweak("heroSubhead", v)} />

        <TweakSection label="Sections" />
        <TweakToggle label="What we do" value={t.showWhat}
                     onChange={(v) => setTweak("showWhat", v)} />
        <TweakToggle label="The fleet" value={t.showFleet}
                     onChange={(v) => setTweak("showFleet", v)} />
        <TweakToggle label="Values" value={t.showValues}
                     onChange={(v) => setTweak("showValues", v)} />
        <TweakToggle label="The crew" value={t.showCrew}
                     onChange={(v) => setTweak("showCrew", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
