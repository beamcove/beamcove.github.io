import { ChapterHead } from "@/app/components/chapter-head";
import { Scene } from "@/app/components/scene";
import { VALUES } from "@/content/values";

/** The three values on one pinned screen; each takes its turn as you scroll. */
export function Values({ n }: { n?: number }) {
    return (
        <Scene name="values" pin={VALUES.length} id="values" aria-labelledby="values-title">
            <div className="wrap">
                <div className="copy" data-quiet data-reveal>
                    <ChapterHead id="values" n={n} kicker="Values" title="Three rules we keep.">
                        Three, because we can remember three.
                    </ChapterHead>
                </div>
                <ol className="value-list">
                    {VALUES.map((value, i) => (
                        <li key={value.id} id={value.id} className="value" data-quiet>
                            <span className="value-n" aria-hidden="true">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="title-2 value-title">{value.title}</h3>
                            <p className="body-text">{value.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Scene>
    );
}
