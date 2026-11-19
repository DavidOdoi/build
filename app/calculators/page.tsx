export default function CalculatorsPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#f7f7f4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", letterSpacing: "-0.08em", marginBottom: 20 }}>Calculators</h1>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <a href="/calculators/asphalt-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Asphalt Calculator
          </a>
          <a href="/calculators/sand-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Sand Calculator
          </a>
          <a href="/calculators/brick-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Brick Calculator
          </a>
          <a href="/calculators/pea-gravel-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Pea Gravel Calculator
          </a>
          <a href="/calculators/fill-dirt-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Fill Dirt Calculator
          </a>
          <a href="/calculators/landscape-rock-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Landscape Rock Calculator
          </a>
          <a href="/calculators/garden-bed-dirt-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Garden Bed Dirt Calculator
          </a>
          <a href="/calculators/raised-bed-soil-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Raised Bed Soil Calculator
          </a>
          <a href="/calculators/compost-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Compost Calculator
          </a>
          <a href="/calculators/rafter-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Rafter Calculator
          </a>
          <a href="/calculators/stud-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Stud Calculator
          </a>
          <a href="/calculators/linear-foot-calculator" style={{ display: "block", padding: 20, borderRadius: 18, background: "#fff", border: "1px solid rgba(17,17,17,0.08)", fontWeight: 700 }}>
            Linear Foot Calculator
          </a>
        </div>
      </div>
    </main>
  );
}
