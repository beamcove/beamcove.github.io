import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { KINDS } from "@/content/fleet";
import { ROUTES } from "@/content/site";

/** The home page's what we do: an intro screen, then one screen per kind of work. */
export function WhatWeDo({ n }: { n?: number }) {
    return (
        <section id="what-we-do" aria-labelledby="what-we-do-title">
            <Scene name="intro" as="div">
                <div className="wrap">
                    <div className="copy copy-wide" data-quiet data-reveal>
                        <ChapterHead
                            id="what-we-do"
                            n={n}
                            kicker="What we do"
                            title="Three directions."
                            size="lg"
                        >
                            Different problems, same care. Here’s where our work points.
                        </ChapterHead>
                    </div>
                </div>
            </Scene>
            {KINDS.map((kind, i) => (
                <Scene key={kind.title} name={kind.art} as="div" className="kind">
                    <div className="wrap">
                        <div className="copy" data-quiet data-reveal>
                            <p className="count">
                                {String(i + 1).padStart(2, "0")}{" "}
                                <span>/ {String(KINDS.length).padStart(2, "0")}</span>
                            </p>
                            <h3 className="title-1 kind-title">{kind.title}</h3>
                            <p className="lead">{kind.body}</p>
                            {i === KINDS.length - 1 && (
                                <a className="bc-more more" href={ROUTES.projects}>
                                    See our projects <Icon node={ArrowRight} />
                                </a>
                            )}
                        </div>
                    </div>
                </Scene>
            ))}
        </section>
    );
}
