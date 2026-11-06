export default function Field({ label, id, error, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} className={error ? "invalid" : ""} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
