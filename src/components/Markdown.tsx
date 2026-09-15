import { Children, type ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.split(/\n\n+/);
  return (
    <div className="md">
      {blocks.map((block, i) => {
        const line = block.trim();
        if (!line) return null;
        if (line.startsWith("# ")) {
          return <h2 key={i}>{line.slice(2)}</h2>;
        }
        if (line.startsWith("**") && line.includes(":**")) {
          return <p key={i}>{inline(line)}</p>;
        }
        return <p key={i}>{Children.toArray(inline(line.replace(/\n/g, " ")))}</p>;
      })}
    </div>
  );
}
