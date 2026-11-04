import { cancelFrame, nextFrame } from "@/design-system/components/frame-loop";

describe("the frame loop", () => {
    let frames: FrameRequestCallback[] = [];
    let reads = 0;
    beforeEach(() => {
        frames = [];
        reads = 0;
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            frames.push(cb);
            return frames.length;
        });
        vi.spyOn(window, "scrollY", "get").mockImplementation(() => {
            reads++;
            return 480;
        });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });
    const runFrame = (t: number) => {
        const now = frames;
        frames = [];
        for (const cb of now) cb(t);
    };

    it("reads the page once per frame, however many jobs run", () => {
        const seen: number[] = [];
        for (let i = 0; i < 12; i++) nextFrame((view) => seen.push(view.scrollY));
        expect(frames).toHaveLength(1);
        runFrame(16);
        expect(seen).toEqual(Array(12).fill(480));
        expect(reads).toBe(1);
    });

    it("runs a job once per frame, even if asked twice, and not after it's cancelled", () => {
        const a = vi.fn();
        const b = vi.fn();
        nextFrame(a);
        nextFrame(a);
        nextFrame(b);
        cancelFrame(b);
        runFrame(16);
        expect(a).toHaveBeenCalledOnce();
        expect(a.mock.calls[0]![0]).toMatchObject({ t: 16, scrollY: 480 });
        expect(b).not.toHaveBeenCalled();
    });

    it("lets a job ask for the next frame from inside this one", () => {
        let n = 0;
        const tick = () => {
            if (++n < 3) nextFrame(tick);
        };
        nextFrame(tick);
        runFrame(16);
        runFrame(24);
        runFrame(32);
        expect(n).toBe(3);
    });
});
