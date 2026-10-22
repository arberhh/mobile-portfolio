import { getContributions, parseContributions } from "./index";

describe("parseContributions", () => {
  it("maps days and uses the last-year total", () => {
    expect(
      parseContributions({
        total: { lastYear: 5 },
        contributions: [
          { date: "2026-10-18", count: 0, level: 0 },
          { date: "2026-10-19", count: 5, level: 9 },
        ],
      }),
    ).toEqual({
      total: 5,
      days: [
        { date: "2026-10-18", count: 0, level: 0 },
        { date: "2026-10-19", count: 5, level: 4 },
      ],
    });
  });

  it("falls back to summing the days when no total is sent", () => {
    expect(
      parseContributions({ contributions: [{ date: "2026-10-19", count: 3, level: 2 }] }).total,
    ).toBe(3);
  });
});

describe("getContributions", () => {
  afterEach(() => jest.restoreAllMocks());

  it("throws when the request fails", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as unknown as typeof fetch;
    await expect(getContributions("arberhh")).rejects.toThrow("Could not load");
  });
});
