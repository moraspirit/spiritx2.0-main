export default function LightFooterScene() {
  return (
    <div className="footer-light-scene" aria-hidden="true">
      <div className="footer-light-grid" />
      <div className="footer-light-orb footer-light-orb-one" />
      <div className="footer-light-orb footer-light-orb-two" />
      <svg viewBox="0 0 1600 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="footer-route-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#74cedd" stopOpacity="0" />
            <stop offset="0.46" stopColor="#0b8fc2" />
            <stop offset="0.72" stopColor="#00558f" />
            <stop offset="1" stopColor="#00558f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="footer-route-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#e7ad4a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#f5c86a" />
            <stop offset="1" stopColor="#e7ad4a" stopOpacity="0" />
          </linearGradient>
          <filter id="footer-route-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="footer-route-bases" fill="none">
          <path d="M-100 625 C230 405 455 755 785 485 S1325 330 1700 520" />
          <path d="M-80 475 C300 292 485 625 825 390 S1320 220 1690 355" />
          <path d="M-70 740 C290 550 525 805 900 560 S1410 435 1690 650" />
        </g>
        <g className="footer-routes footer-routes-blue" fill="none" filter="url(#footer-route-glow)">
          <path d="M-100 625 C230 405 455 755 785 485 S1325 330 1700 520" />
          <path d="M-80 475 C300 292 485 625 825 390 S1320 220 1690 355" />
        </g>
        <g className="footer-routes footer-routes-gold" fill="none">
          <path d="M-70 740 C290 550 525 805 900 560 S1410 435 1690 650" />
        </g>
        <g className="footer-route-nodes">
          <circle cx="324" cy="529" r="7" />
          <circle cx="785" cy="485" r="9" />
          <circle cx="1234" cy="360" r="6" />
          <circle cx="900" cy="560" r="6" />
        </g>
      </svg>
    </div>
  );
}
