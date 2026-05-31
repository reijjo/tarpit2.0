import { BET_TYPE_LABELS } from "@/features/bets/constants";
import { BetType } from "@/features/bets/schemas";

import { MatchCard } from "./MatchCard";
import { BetTypeCard } from "./BetTypeCard";
import { DateCard } from "./DateCard";
import { FreeLiveCard } from "./FreeLiveCard";
import { OddsCard } from "./OddsCard";
import { SelectionCard } from "./SelectionCard";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";

function MatchCardWrapper() {
  const [draft, setDraft] = useState<{
    homeTeam?: string;
    awayTeam?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <MatchCard draft={draft} fieldErrors={{}} handleChange={handleChange} />
  );
}

function BetTypeCardWrapper() {
  const [draft, setDraft] = useState<{
    betType: BetType;
  }>({
    betType: "single",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return <BetTypeCard draft={draft} handleChange={handleChange} />;
}

function FreeLiveCardWrapper() {
  const [draft, setDraft] = useState({
    freeBet: false,
    liveBet: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <FreeLiveCard
      draft={draft}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
}

function SelectionCardWrapper() {
  const [draft, setDraft] = useState<{
    selection: string;
    betType: BetType;
  }>({
    selection: "",
    betType: "betbuilder",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <SelectionCard
      draft={draft}
      fieldErrors={{}}
      handleChange={handleChange}
    />
  );
}

function OddsCardWrapper() {
  const [draft, setDraft] = useState<{
    odds: number;
  }>({
    odds: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <OddsCard draft={draft} fieldErrors={{}} handleChange={handleChange} />
  );
}

function DateCardWrapper() {
  const [draft, setDraft] = useState<{
    date?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DateCard
      draft={draft as { date: string }}
      fieldErrors={{}}
      handleChange={handleChange}
    />
  );
}

describe("BETDETAILSFORMCARDS", () => {
  const user = userEvent.setup();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("MATCH CARD", () => {
    beforeEach(() => {
      render(<MatchCardWrapper />);
    });

    it("renders matchcard", () => {
      expect(screen.getByLabelText(/home team/i)).toHaveValue("");
      expect(screen.getByLabelText(/away team/i)).toHaveValue("");
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });

    it("adds home/away team", async () => {
      const homeInput = screen.getByLabelText(/home team/i);
      const awayInput = screen.getByLabelText(/away team/i);

      await user.type(homeInput, "Lakers");
      await user.type(awayInput, "Celtics");

      expect(homeInput).toHaveValue("Lakers");
      expect(awayInput).toHaveValue("Celtics");
      expect(awayInput).not.toHaveValue("Lakers");
    });
  });

  describe("BET TYPE CARD", () => {
    beforeEach(() => {
      render(<BetTypeCardWrapper />);
    });

    it("renders bet type options and updates selection", async () => {
      const select = screen.getByLabelText(/bet type/i);

      expect(select).toHaveValue("single");
      expect(screen.getByRole("option", { name: BET_TYPE_LABELS.single })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: BET_TYPE_LABELS.betbuilder })).toBeInTheDocument();

      await user.selectOptions(select, "betbuilder");

      expect(select).toHaveValue("betbuilder");
    });
  });

  describe("FREE/LIVE CARD", () => {
    beforeEach(() => {
      render(<FreeLiveCardWrapper />);
    });

    it("renders checkboxes and toggles them", async () => {
      const freeBet = screen.getByLabelText(/free bet/i);
      const liveBet = screen.getByLabelText(/live bet/i);

      expect(freeBet).not.toBeChecked();
      expect(liveBet).not.toBeChecked();

      await user.click(freeBet);
      await user.click(liveBet);

      expect(freeBet).toBeChecked();
      expect(liveBet).toBeChecked();
    });
  });

  describe("SELECTION CARD", () => {
    beforeEach(() => {
      render(<SelectionCardWrapper />);
    });

    it("renders empty selection and updates the pill", async () => {
      const selectionInput = screen.getByLabelText(/selection/i);

      expect(selectionInput).toHaveValue("");
      expect(screen.queryByText(/betbuilder/i)).not.toBeInTheDocument();

      await user.type(selectionInput, "Lakers -4.5");

      expect(selectionInput).toHaveValue("Lakers -4.5");
      expect(screen.getByText("Lakers -4.5")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("ODDS CARD", () => {
    beforeEach(() => {
      render(<OddsCardWrapper />);
    });

    it("renders empty odds and updates the value", async () => {
      const oddsInput = screen.getByLabelText(/odds/i);

      expect(oddsInput).toHaveValue("");

      fireEvent.change(oddsInput, { target: { value: "1.91" } });

      expect(oddsInput).toHaveValue("1.91");
    });
  });

  describe("DATE CARD", () => {
    beforeEach(() => {
      render(<DateCardWrapper />);
    });

    it("defaults to today's date and updates the value", async () => {
      const today = new Date().toISOString().split("T")[0];
      const dateInput = screen.getByLabelText(/date/i);

      expect(dateInput).toHaveValue(today);

      await user.clear(dateInput);
      await user.type(dateInput, "2026-06-01");

      expect(dateInput).toHaveValue("2026-06-01");
    });
  });
});
