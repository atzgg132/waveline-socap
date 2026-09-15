export function SocapBadge({ claimed }: { claimed: boolean }) {
  if (!claimed) return null;
  return (
    <span className="badge socap" title="Public SoCap attribution on this URL">
      SoCap
    </span>
  );
}
