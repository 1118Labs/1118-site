const appStoreUrl =
  "https://apps.apple.com/us/app/etchr-portraits/id6785615752";

const products = [
  {
    name: "Etchr",
    status: "Live",
    tone: "live",
    description:
      "Editorial portrait software for web and iPhone. Available now.",
    links: [
      { label: "etchr.ai", href: "https://etchr.ai" },
      { label: "App Store", href: appStoreUrl },
    ],
  },
  {
    name: "Founder OS",
    status: "Internal operating system",
    tone: "internal",
    description:
      "The private system 1118 uses to direct, review, and operate product work.",
    links: [],
  },
  {
    name: "Reviews Engine",
    status: "In development",
    tone: "progress",
    description:
      "Software for collecting, moderating, and publishing customer reviews.",
    links: [],
  },
  {
    name: "HostDirect",
    status: "Studio project",
    tone: "studio",
    description:
      "A direct digital experience for independent property operators.",
    links: [],
  },
  {
    name: "Additional studio work",
    status: "Not yet publicly announced",
    tone: "private",
    description:
      "Other 1118 products remain private until they are ready to be named.",
    links: [],
  },
];

export function ProductPortfolio() {
  return (
    <div className="portfolio-list">
      {products.map((product, index) => (
        <article className="portfolio-row" key={product.name}>
          <p className="portfolio-index">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className="portfolio-name">
            <h3>{product.name}</h3>
            <p className={`status status-${product.tone}`}>
              <span aria-hidden="true" />
              {product.status}
            </p>
          </div>
          <p className="portfolio-description">{product.description}</p>
          <div className="portfolio-links">
            {product.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
