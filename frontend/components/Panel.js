export default function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <div className="panelBody">{children}</div>
    </section>
  );
}
