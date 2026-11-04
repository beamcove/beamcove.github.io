/**
 * One frame loop for everything that runs per frame while scrolling (the
 * fields, pinned screens, the chapter rail). The page is read once, at the
 * start of the frame, and every job then works from that view and only
 * writes. Jobs that each read `scrollY` on their own, between other jobs'
 * style writes, make the browser redo style and layout several times in one
 * frame; at 120 Hz there's no room for that.
 */
export interface FrameView {
    /** The frame's time (the requestAnimationFrame clock). */
    t: number;
    scrollY: number;
    /** The window's size, CSS px. */
    vh: number;
    vw: number;
}

type Job = (view: FrameView) => void;

const jobs = new Set<Job>();
let raf = 0;
const view: FrameView = { t: 0, scrollY: 0, vh: 0, vw: 0 };

function run(t: number) {
    raf = 0;
    view.t = t;
    view.scrollY = window.scrollY;
    view.vh = window.innerHeight;
    view.vw = window.innerWidth;
    const now = [...jobs];
    jobs.clear();
    for (const job of now) job(view);
}

/** Run `job` once on the next frame (asking twice in a frame runs it once). */
export function nextFrame(job: Job) {
    jobs.add(job);
    if (!raf) raf = requestAnimationFrame(run);
}

/** Don't run `job` on the next frame after all. */
export function cancelFrame(job: Job) {
    jobs.delete(job);
}
