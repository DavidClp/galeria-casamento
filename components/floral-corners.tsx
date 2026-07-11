/* Decorative botanical accents anchored to the page corners. */
export function FloralCorners() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src="/images/floral-corner.png"
        alt=""
        className="absolute -left-8 -top-8 w-40 opacity-40 md:w-64 md:opacity-50 dark:opacity-20"
      />
      <img
        src="/images/floral-corner.png"
        alt=""
        className="absolute -right-8 -top-8 w-40 -scale-x-100 opacity-40 md:w-64 md:opacity-50 dark:opacity-20"
      />
      <img
        src="/images/floral-corner.png"
        alt=""
        className="absolute -bottom-8 -left-8 w-40 -scale-y-100 opacity-40 md:w-64 md:opacity-50 dark:opacity-20"
      />
      <img
        src="/images/floral-corner.png"
        alt=""
        className="absolute -bottom-8 -right-8 w-40 -scale-100 opacity-40 md:w-64 md:opacity-50 dark:opacity-20"
      />
    </div>
  )
}
