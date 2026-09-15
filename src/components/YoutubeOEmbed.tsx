import { useEffect, useState } from "react";
import { isYoutubeUrl } from "../ledger";

type OEmbed = {
  title?: string;
  author_name?: string;
  html?: string;
  thumbnail_url?: string;
};

export function YoutubeOEmbed({ url }: { url: string }) {
  const [state, setState] = useState<"skip" | "loading" | "ok" | "fail">(() =>
    isYoutubeUrl(url) ? "loading" : "skip",
  );
  const [embed, setEmbed] = useState<OEmbed | null>(null);

  useEffect(() => {
    if (!isYoutubeUrl(url)) {
      setState("skip");
      return;
    }
    const ctrl = new AbortController();
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    fetch(endpoint, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<OEmbed>;
      })
      .then((data) => {
        setEmbed(data);
        setState("ok");
      })
      .catch(() => setState("fail"));
    return () => ctrl.abort();
  }, [url]);

  if (state === "skip") return null;
  if (state === "loading") return <div className="oembed">YouTube oEmbed: loading</div>;
  if (state === "fail") return <div className="oembed">YouTube oEmbed unavailable. Source URL still linked.</div>;
  return (
    <div className="oembed">
      <div>
        {embed?.title} {embed?.author_name ? `— ${embed.author_name}` : ""}
      </div>
      {embed?.html ? <div dangerouslySetInnerHTML={{ __html: embed.html }} /> : null}
    </div>
  );
}
