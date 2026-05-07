/* Tweaks for Beamcove landing page */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "seaglass",
  "hero": "map",
  "fleet": "cards",
  "motion": true,
  "grain": true
}/*EDITMODE-END*/;

function BeamcoveTweaks() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    try { localStorage.setItem("beamcove-palette", t.palette); } catch(e){}
  }, [t.palette]);

  React.useEffect(() => { document.body.setAttribute("data-hero", t.hero); }, [t.hero]);
  React.useEffect(() => { document.body.setAttribute("data-fleet", t.fleet); }, [t.fleet]);
  React.useEffect(() => { document.body.setAttribute("data-motion", t.motion ? "on" : "off"); }, [t.motion]);
  React.useEffect(() => { document.body.setAttribute("data-grain", t.grain ? "on" : "off"); }, [t.grain]);

  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSelect } = window;

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakSelect
        label="Color scheme"
        value={t.palette}
        onChange={(v) => setTweak("palette", v)}
        options={[
          { value: "seaglass",  label: "Sea Glass (light)" },
          { value: "inkwell",   label: "Inkwell (dark)" },
          { value: "parchment", label: "Parchment" },
        ]}
      />

      <TweakSection label="Hero" />
      <TweakRadio
        label="Variant"
        value={t.hero}
        onChange={(v) => setTweak("hero", v)}
        options={[
          { value: "map",         label: "Map" },
          { value: "logbook",     label: "Logbook" },
          { value: "typographic", label: "Type" },
        ]}
      />

      <TweakSection label="Fleet" />
      <TweakRadio
        label="Layout"
        value={t.fleet}
        onChange={(v) => setTweak("fleet", v)}
        options={[
          { value: "cards", label: "Cards" },
          { value: "list",  label: "List" },
        ]}
      />

      <TweakSection label="Texture" />
      <TweakToggle
        label="Compass + wave motion"
        value={t.motion}
        onChange={(v) => setTweak("motion", v)}
      />
      <TweakToggle
        label="Paper grain"
        value={t.grain}
        onChange={(v) => setTweak("grain", v)}
      />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById("tweaks-root"));
root.render(<BeamcoveTweaks />);
