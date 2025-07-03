import * as React from "react"

// Define the breakpoint for mobile devices. 768px is a common threshold to differentiate
// between phones and tablets/desktops. Devices with a width of 767px or less will be
// considered mobile.
const MOBILE_BREAKPOINT = 768

/**
 * A custom React hook that returns `true` if the current viewport width is
 * considered mobile.
 *
 * @returns {boolean} `true` if the viewport is mobile-sized, otherwise `false`.
 */
export function useIsMobile() {
  // Initialize state with a default value of `false`. This assumes a desktop-first
  // approach and ensures the hook always returns a boolean, avoiding an
  // `undefined` state on the initial server render or hydration.
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // The `window` object is only available in the browser. This check prevents
    // errors when the code is executed in a server-side rendering (SSR) environment.
    if (typeof window === "undefined") {
      return
    }

    // Create a MediaQueryList object that listens for changes in the viewport width.
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // This handler function is called whenever the viewport width crosses the breakpoint.
    // We use the `matches` property from the event object itself, which is the
    // most reliable way to get the current state of the media query.
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Set the initial value when the component mounts. `mediaQuery.matches`
    // gives the current state of the query immediately.
    setIsMobile(mediaQuery.matches)

    // Add the event listener to respond to future changes (e.g., rotating the device
    // or resizing the browser window).
    mediaQuery.addEventListener("change", handleResize)

    // The cleanup function returned from useEffect. It's crucial to remove the
    // event listener when the component unmounts to prevent memory leaks.
    return () => {
      mediaQuery.removeEventListener("change", handleResize)
    }
  }, []) // The empty dependency array `[]` ensures this effect runs only once when the component mounts.

  return isMobile
}
