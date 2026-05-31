import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { INITIAL_BET_DETAILS } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { BetDetailsWithTempId } from "../../types";

import BetDetailsForm from "./BetDetailsForm";

vi.mock("../../hooks", () => ({
  useBetFormDraft: vi.fn(),
}));

const mockedUseBetFormDraft = vi.mocked(useBetFormDraft);

function renderForm(
  draft: BetDetailsWithTempId,
  overrides?: {
    betDetails?: BetDetailsWithTempId[];
  },
) {
  const setBetDetails = vi.fn();
  const setDraft = vi.fn();
  const setFieldErrors = vi.fn();

  mockedUseBetFormDraft.mockReturnValue({
    draft,
    setDraft,
    fieldErrors: {},
    setFieldErrors,
    handleChange: vi.fn(),
    handleCheckboxChange: vi.fn(),
  });

  render(
    <BetDetailsForm
      betDetails={overrides?.betDetails ?? []}
      setBetDetails={setBetDetails}
    />,
  );

  return {
    setBetDetails,
    setDraft,
    setFieldErrors,
  };
}

describe("BETDETAILSFORM", () => {
  let randomUUIDSpy: ReturnType<typeof vi.spyOn> | undefined;
  let consoleLogSpy: ReturnType<typeof vi.spyOn> | undefined;

  beforeEach(() => {
    mockedUseBetFormDraft.mockReset();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    randomUUIDSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "temp-id-123",
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy?.mockRestore();
    randomUUIDSpy?.mockRestore();
  });

  it("renders the form", () => {
    renderForm({
      ...INITIAL_BET_DETAILS,
      selection: "Lakers -4.5",
      odds: 1.91,
    });

    expect(
      screen.getByRole("heading", { name: /bet details/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add selection/i }),
    ).toBeInTheDocument();
  });

  it("adds a valid bet detail to parlay", () => {
    const { setBetDetails, setDraft, setFieldErrors } = renderForm({
      ...INITIAL_BET_DETAILS,
      selection: "Lakers -4.5",
      odds: 1.91,
      betType: "betbuilder",
      freeBet: true,
      liveBet: false,
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      date: "2026-05-31",
    });

    fireEvent.click(screen.getByRole("button", { name: /add selection/i }));

    expect(setFieldErrors).toHaveBeenCalledWith({});
    expect(setDraft).toHaveBeenCalledWith(INITIAL_BET_DETAILS);

    expect(setBetDetails).toHaveBeenCalledTimes(1);
    const updater = vi.mocked(setBetDetails).mock.calls[0]?.[0];

    expect(typeof updater).toBe("function");
    expect(
      updater?.([
        {
          ...INITIAL_BET_DETAILS,
          temp_id: "existing-id",
        },
      ]),
    ).toEqual([
      {
        ...INITIAL_BET_DETAILS,
        temp_id: "existing-id",
      },
      {
        ...INITIAL_BET_DETAILS,
        selection: "Lakers -4.5",
        odds: 1.91,
        betType: "betbuilder",
        freeBet: true,
        liveBet: false,
        homeTeam: "Lakers",
        awayTeam: "Celtics",
        date: "2026-05-31",
        temp_id: "temp-id-123",
      },
    ]);
  });

  it("surfaces validation errors for an invalid draft", () => {
    const { setBetDetails, setDraft, setFieldErrors } = renderForm(
      INITIAL_BET_DETAILS,
    );

    fireEvent.click(screen.getByRole("button", { name: /add selection/i }));

    expect(setFieldErrors).toHaveBeenCalledWith({
      selection: ["Selection is required"],
      odds: ["Can't be empty"],
    });
    expect(setBetDetails).not.toHaveBeenCalled();
    expect(setDraft).not.toHaveBeenCalled();
  });
});
