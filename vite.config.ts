import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function copyLedgerData() {
  return {
    name: "copy-ledger-data",
    closeBundle() {
      const distData = resolve("dist/data");
      mkdirSync(distData, { recursive: true });
      if (existsSync("data")) cpSync("data", distData, { recursive: true });
      if (existsSync("INSIGHT.md")) cpSync("INSIGHT.md", resolve("dist/INSIGHT.md"));
      if (existsSync("APPLY.md")) cpSync("APPLY.md", resolve("dist/APPLY.md"));
      if (existsSync("dist/index.html")) cpSync("dist/index.html", resolve("dist/404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), copyLedgerData()],
  base: process.env.VITE_BASE ?? "/",
});
