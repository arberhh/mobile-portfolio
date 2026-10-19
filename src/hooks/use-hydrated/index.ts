import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// False during static rendering and while hydrating on web, true right
// after (and always true on native, which never uses the server snapshot).
// Lets a component render something client-only without the server HTML
// failing to hydrate.
function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export default useHydrated;
