export function CountryFlag({
  isoCode,
  size = 16,
}: {
  isoCode: string;
  size?: number;
}) {
  return (
    <span
      className={`fi fi-${isoCode.toLowerCase()}`}
      style={{ width: size, height: size * 0.75, display: "inline-block", borderRadius: 1 }}
      aria-label={isoCode}
    />
  );
}
