export function viewPortChecker(): "mobile" | "pc" {
  if (typeof window === "undefined") {
    return "pc";
  }

  return window.innerWidth < 640 ? "mobile" : "pc";
}
