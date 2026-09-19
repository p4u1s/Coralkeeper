// Icons der Bottom-Navigation, aus Coralkeeper.dc.html (Block „BOTTOM NAVIGATION")
// Nur Deko neben dem Textlabel, daher aria-hidden (NFR-1.4)

export function BestandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function BeckenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect
        x="2.5"
        y="3.5"
        width="15"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="2.5"
        y="9"
        width="15"
        height="7.5"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

export function DiaryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect
        x="3.5"
        y="2.5"
        width="13"
        height="15"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect x="6" y="6" width="8" height="1.8" fill="currentColor" />
      <rect x="6" y="10" width="8" height="1.8" fill="currentColor" />
    </svg>
  );
}

export function ProfilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.5" fill="currentColor" />
      <rect x="3" y="12" width="14" height="6" rx="3" fill="currentColor" />
    </svg>
  );
}
