import { renderHook, waitFor } from "@testing-library/react-native";
import { useAsync } from "./index";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useAsync", () => {
  it("starts loading with the initial value and no error", () => {
    const fetcher = jest.fn(() => new Promise<string>(() => {}));

    const { result } = renderHook(() => useAsync(fetcher, "initial"));

    expect(result.current).toEqual({
      data: "initial",
      loading: true,
      error: "",
    });
  });

  it("resolves into data with loading turned off", async () => {
    const fetcher = jest.fn(() => Promise.resolve("fetched"));

    const { result } = renderHook(() => useAsync(fetcher, "initial"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe("fetched");
    expect(result.current.error).toBe("");
  });

  it("captures a rejection's message, keeps the initial data, and logs it", async () => {
    const fetcher = jest.fn(() => Promise.reject(new Error("boom")));

    const { result } = renderHook(() => useAsync(fetcher, "initial"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe("initial");
    expect(result.current.error).toBe("boom");
    expect(console.error).toHaveBeenCalled();
  });

  it("starts settled when given snapshot data", () => {
    const fetcher = jest.fn(() => new Promise<string>(() => {}));

    const { result } = renderHook(() => useAsync(fetcher, "snapshot", true));

    expect(result.current).toEqual({ data: "snapshot", loading: false, error: "" });
  });

  it("keeps snapshot data without an error when the refresh fails", async () => {
    const fetcher = jest.fn(() => Promise.reject(new Error("boom")));

    const { result } = renderHook(() => useAsync(fetcher, "snapshot", true));

    await waitFor(() => expect(fetcher).toHaveBeenCalled());
    await waitFor(() => expect(console.error).toHaveBeenCalled());

    expect(result.current).toEqual({ data: "snapshot", loading: false, error: "" });
  });

  it("re-fetches when the fetcher reference changes", async () => {
    const fetcher = jest.fn(() => Promise.resolve("first"));

    const { result, rerender } = renderHook(
      ({ fn }: { fn: () => Promise<string> }) => useAsync(fn, "initial"),
      { initialProps: { fn: fetcher } },
    );

    await waitFor(() => expect(result.current.data).toBe("first"));

    const nextFetcher = jest.fn(() => Promise.resolve("second"));
    rerender({ fn: nextFetcher });

    await waitFor(() => expect(result.current.data).toBe("second"));
    expect(nextFetcher).toHaveBeenCalledTimes(1);
  });
});
