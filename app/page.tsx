import styles from "./page.module.css";

const categories = [
  { name: "Concrete & Masonry", count: 4, icon: "▦", href: "/calculators/asphalt-calculator" },
  { name: "Roofing", count: 2, icon: "◭", href: "/calculators" },
  { name: "Flooring", count: 2, icon: "▤", href: "/calculators" },
  { name: "Landscaping", count: 2, icon: "❦", href: "/calculators/sand-calculator" },
  { name: "Painting", count: 1, icon: "◐", href: "/calculators" },
  { name: "Lumber", count: 2, icon: "▥", href: "/calculators" },
  { name: "Plumbing", count: 1, icon: "◎", href: "/calculators" },
  { name: "Electrical", count: 2, icon: "ϟ", href: "/calculators" },
  { name: "Construction Costs", count: 2, icon: "$", href: "/calculators" },
];

const popularCalculators = [
  { name: "Concrete Calculator", description: "Cubic yards, bags and cost for slabs, footings and columns.", tag: "Concrete", status: "Live", href: "/calculators/asphalt-calculator" },
  { name: "Sand Calculator", description: "Cubic yards, tons, and cost for patios, flooring bases, and landscaping fill.", tag: "Landscaping", status: "Live", href: "/calculators/sand-calculator" },
  { name: "Concrete Block Calculator", description: "CMU blocks and mortar for any wall.", tag: "Concrete", status: "Coming soon", href: "#" },
  { name: "Roofing Calculator", description: "Roof area, squares and shingle bundles.", tag: "Roofing", status: "Coming soon", href: "#" },
  { name: "Flooring Calculator", description: "Square footage and boxes with waste.", tag: "Flooring", status: "Coming soon", href: "#" },
  { name: "Mulch Calculator", description: "Cubic yards and bags of mulch.", tag: "Landscaping", status: "Coming soon", href: "#" },
  { name: "Gravel Calculator", description: "Tons and yards of gravel.", tag: "Landscaping", status: "Coming soon", href: "#" },
  { name: "Paint Calculator", description: "Gallons of paint for any room.", tag: "Painting", status: "Coming soon", href: "#" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand} aria-label="BuildCalc home">
          <span className={styles.brandBadge}>B</span>
          <span className={styles.brandText}>BuildCalc</span>
          <span className={styles.brandDot}>.</span>
        </div>

        <a href="/calculators" className={styles.headerButton}>
          All calculators
        </a>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.pill}>MEASURE TWICE. CALCULATE ONCE.</div>

          <h1>
            Construction calculators you can
            <span> build on.</span>
          </h1>

          <p>
            Exact material quantities and cost estimates for homeowners,
            contractors and DIYers — free, fast, no sign-up.
          </p>

          <div className={styles.searchBox}>
            <input
              type="text"
              aria-label="Search calculators"
              placeholder='Search calculators — try “concrete”, “mulch” or “paint”'
            />
            <button type="button">Search</button>
          </div>
        </section>

        <section className={styles.categoriesSection} aria-label="Browse by category">
          <h2>Browse by category</h2>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <a href={category.href} key={category.name} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <div>
                  <span>{category.name}</span>
                  <small>{category.count} calculators</small>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.popularSection} aria-label="Popular calculators">
          <h2>Popular calculators</h2>
          <div className={styles.popularGrid}>
            {popularCalculators.map((item) => (
              <a href={item.href} key={item.name} className={styles.popularCard}>
                <div className={styles.popularMeta}>
                  <span>{item.tag}</span>
                  <span className={styles.status}>{item.status}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>BuildCalc.</span>
            <p>
              Free, accurate construction and DIY calculators for US homeowners,
              contractors and builders.
            </p>
          </div>

          <nav className={styles.footerNav} aria-label="Categories">
            {categories.map((category) => (
              <a href="#" key={category.name}>{category.name}</a>
            ))}
          </nav>
        </div>

        <div className={styles.footerBottom}>
          © 2026 BuildCalc. Estimates are for planning only — confirm quantities
          with your supplier.
        </div>
      </footer>

      <button type="button" className={styles.editButton}>
        Edit with <span>Lovable</span>
        <span className={styles.closeIcon}>×</span>
      </button>
    </div>
  );
}
