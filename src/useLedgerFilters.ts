import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EMPTY_FILTERS } from "./ledger";
import type { LedgerFilters } from "./types";

export function socapClaimedFromParam(value: string | null): string {
  if (value === "true" || value === "false") return value;
  return "";
}

export function useLedgerFilters(defaults: LedgerFilters = EMPTY_FILTERS) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<LedgerFilters>(() => ({
    ...defaults,
    socap_claimed: socapClaimedFromParam(searchParams.get("socap_claimed")),
  }));

  useEffect(() => {
    const fromUrl = socapClaimedFromParam(searchParams.get("socap_claimed"));
    setFilters((prev) =>
      prev.socap_claimed === fromUrl ? prev : { ...prev, socap_claimed: fromUrl },
    );
  }, [searchParams]);

  const onChange = useCallback(
    (next: LedgerFilters) => {
      setFilters(next);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next.socap_claimed === "true" || next.socap_claimed === "false") {
            params.set("socap_claimed", next.socap_claimed);
          } else {
            params.delete("socap_claimed");
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, onChange };
}
