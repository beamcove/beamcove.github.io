import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dispatches, ROSTER_URL } from "@/app/components/dispatches";

describe("Dispatches", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks for an email when the field is empty", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        render(<Dispatches />);
        await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Email address")).toHaveAttribute("aria-invalid", "true");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects an address that doesn't look like an email", async () => {
        vi.stubGlobal("fetch", vi.fn());
        render(<Dispatches />);
        await userEvent.type(screen.getByLabelText("Email address"), "not-an-email");
        await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(screen.getByText(/doesn’t look right/i)).toBeInTheDocument();
    });

    it("posts to the roster and confirms", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal("fetch", fetchMock);
        render(<Dispatches />);
        await userEvent.type(screen.getByLabelText("Email address"), " sailor@example.com ");
        await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(await screen.findByText("You’re aboard.")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(
            ROSTER_URL,
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ email: "sailor@example.com" }),
            }),
        );
    });

    it("says what to do when the roster fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
        render(<Dispatches />);
        await userEvent.type(screen.getByLabelText("Email address"), "sailor@example.com");
        await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
        expect(await screen.findByText(/try again in a minute/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
    });
});
