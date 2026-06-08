import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import type { Release } from "@/types/content";

interface CatalogWallProps {
  onPlayRelease?: (release: Release) => void;
  releases: Release[];
}

export function CatalogWall({ onPlayRelease, releases }: CatalogWallProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const openRelease = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const genres = useMemo(() => {
    const values = new Set<string>();
    releases.forEach((release) => {
      if (release.musicStyle) values.add(release.musicStyle);
    });
    return Array.from(values);
  }, [releases]);

  const filteredReleases = useMemo(() => {
    if (activeFilter === "ALL") return releases;
    return releases.filter((release) => release.musicStyle === activeFilter);
  }, [activeFilter, releases]);

  return (
    <div>
      <div className="wall__filters" style={{ marginBottom: "34px" }}>
        <button
          className={`filt${activeFilter === "ALL" ? " on" : ""}`}
          onClick={() => setActiveFilter("ALL")}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`filt${activeFilter === genre ? " on" : ""}`}
            onClick={() => setActiveFilter(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="thr-grid">
        {filteredReleases.map((release) => (
          <div
            key={release.id}
            className="rel"
            onClick={() => {
              if (release.beatportSaleUrl) {
                openRelease(release.beatportSaleUrl);
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
              <button
                className="rel__play"
                onClick={(event) => {
                  event.stopPropagation();
                  if (release.audioFilePath) {
                    onPlayRelease?.(release);
                  }
                }}
                title={release.audioFilePath ? `Play ${release.title}` : `${release.title} preview unavailable`}
                type="button"
              >
                <Play size={16} fill="currentColor" />
              </button>
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
                  <span className="tag">
                    {release.trackCount} {release.trackCount === 1 ? "track" : "tracks"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
