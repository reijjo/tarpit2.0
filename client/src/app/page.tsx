export default function Home() {
  return (
    <main className="">
      <h1>MAAIIN PAGEE</h1>
      <button
        style={{ padding: "1rem 2rem", backgroundColor: "var(--secondary)" }}
      >
        Secondary
      </button>
      <button
        style={{
          padding: "1rem 2rem",
          backgroundColor: "var(--accent)",
        }}
      >
        Accent
      </button>
    </main>
  );
}
