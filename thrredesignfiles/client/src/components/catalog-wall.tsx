import { useState, useMemo } from "react";
import { Play } from "lucide-react";
import type { Release } from "@/types/content";

interface CatalogWallProps {
  releases: Release[];
}

export function CatalogWall({ releases }: CatalogWallProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const genres = useMemo(() => {
    const set = new Set<string>();
    releases.forEach((r) => {
      if (r.musicStyle) set.add(r.musicStyle);
    });
    return Array.from(set);
  }, [releases]);

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return releases;
    return releases.filter((r) => r.musicStyle === activeFilter);
  }, [releases, activeFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="wall__filters" style={{ marginBottom: "34px" }}>
        <button
          className={`filt${activeFilter === "ALL" ? " on" : ""}`}
          onClick={() => setActiveFilter("ALL")}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            className={`filt${activeFilter === g ? " on" : ""}`}
            onClick={() => setActiveFilter(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="thr-grid">
        {filtered.map((release) => (
          <div
            key={release.id}
            className="rel"
            onClick={() => {
              if (release.beatportSaleUrl) {
                window.open(release.beatportSaleUrl, "_blank");
              }
            }}
          >
            <div className="rel__art">
              <img
                src={release.coverImageUrl || release.imgUrl || "/images/artwork/placeholder.webp"}
                alt={release.title}
                loading="lazy"
              />
              <div className="rel__cat">{release.internalReference}</div>
              <div className="rel__play">
                <Play size={16} fill="currentColor" />
              </div>
              {release.musicStyle && (
                <div className="rel__genre">
                  <span className="chip chip--ac" style={{ fontSize: "9px" }}>
                    {release.musicStyle}
                  </span>
                </div>
              )}
            </div>
            <div className="rel__foot">
              <div className="rel__title">{release.title}</div>
              <div className="rel__by">
                by <b>{release.artist}</b>
              </div>
              <div className="rel__row">
                <span className="tag">{release.bundleType}</span>
                {release.trackCount && (
                  <span className="tag">{release.trackCount} {release.trackCount === 1 ? "track" : "tracks"}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="wall__more">
        <a
          href="https://www.beatport.com/label/tinnie-house-records/50650"
          target="_blank"
          rel="noopener noreferrer"
          className="hud hud--ghost"
        >
          <span className="hud__in">View Complete Discography</span>
        </a>
      </div>
    </div>
  );
}
