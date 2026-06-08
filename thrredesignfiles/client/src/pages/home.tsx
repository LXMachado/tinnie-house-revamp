import { useMemo, useState, useEffect, useRef } from "react";
import { Play, Pause, Share, Calendar, ChevronRight, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MusicPlayer } from "@/components/music-player";
import { Visualizer } from "@/components/visualizer";
import { CatalogWall } from "@/components/catalog-wall";
import type { Artist, Release } from "@/types/content";
import { dbFallback } from "@/lib/database-fallback";

/* ------------------------------------------------------------------ */
/* Reveal hook — adds .in class when element enters viewport           */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ------------------------------------------------------------------ */
/* Marquee section                                                       */
/* ------------------------------------------------------------------ */
function MarqueeStrip({ release }: { release: Release | undefined }) {
  if (!release) return null;
  const now = new Date();
  const releaseDate = release.digitalReleaseDate ? new Date(release.digitalReleaseDate) : null;
  const isOut = releaseDate ? now >= releaseDate : false;
  const label = isOut ? "OUT NOW" : "UPCOMING";

  const item = (
    <span className="tick">
      <span className={`tick__tag fill`}>
        <span className="tick__live" />
        {label}
      </span>
      <span className="tick__main">{release.title}</span>
      <span className="tick__meta">{release.artist}</span>
      {release.internalReference && (
        <>
          <span className="dot">◆</span>
          <span className="tick__meta">{release.internalReference}</span>
        </>
      )}
      {releaseDate && (
        <>
          <span className="dot">◆</span>
          <span className="tick__meta">
            {releaseDate.toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </>
      )}
    </span>
  );

  // Duplicate enough times to fill the track
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 38 }}>
      {item}
      <span style={{ color: "var(--ac)", fontSize: 9, margin: "0 4px" }}>◆◆</span>
    </span>
  ));

  return (
    <div className="marq">
      <div className="marq__track">{items}{items}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home page                                                             */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [email, setEmail] = useState("");

  useReveal();

  useEffect(() => {
    async function fetchData() {
      const { STATIC_ARTISTS, STATIC_RELEASES } = await import("@/static-content");
      setArtists(STATIC_ARTISTS);
      setReleases(STATIC_RELEASES);

      try {
        const [artistsData, releasesData] = await Promise.all([
          dbFallback.getArtists(),
          dbFallback.getReleases(),
        ]);
        setArtists(artistsData);
        setReleases(releasesData);
        setUsingDatabase(true);
      } catch (error) {
        console.log("Continuing with static data (database unavailable):", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sortedReleases = useMemo(
    () =>
      [...releases].sort((a, b) => {
        const dateA = new Date(a.digitalReleaseDate ?? 0).getTime();
        const dateB = new Date(b.digitalReleaseDate ?? 0).getTime();
        return dateB - dateA;
      }),
    [releases]
  );

  const stormdrifterRelease = sortedReleases.find((r) => r.isLatest) ?? sortedReleases[0];

  const handleBuyClick = () => {
    if (!stormdrifterRelease?.purchaseLink) {
      setShowUpcomingModal(true);
      return;
    }
    window.open(stormdrifterRelease.purchaseLink, "_blank");
  };

  const handleShareClick = async () => {
    if (!stormdrifterRelease?.shareLink) {
      setShowUpcomingModal(true);
      return;
    }
    const shareData = {
      title: `${stormdrifterRelease.title} by ${stormdrifterRelease.artist}`,
      text: `Check out this release from Tinnie House Records`,
      url: stormdrifterRelease.shareLink,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareData.url ?? "");
      } catch {
        console.error("Failed to share or copy to clipboard");
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleListenClick = () => {
    if (stormdrifterRelease?.audioFilePath) {
      setShowMusicPlayer(!showMusicPlayer);
    } else {
      scrollToSection("releases");
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                             */
  /* ---------------------------------------------------------------- */
  return (
    <>
      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section className="hero" style={{ background: "var(--bg-0)" }}>
        {/* Animated visualizer background */}
        <div className="hero__viz">
          <Visualizer />
        </div>

        {/* Overlays */}
        <div className="hero__fade" />
        <div className="hero__grid" />

        {/* Watermark logo */}
        <img
          src="/logo.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: "min(60vw, 540px)",
            height: "min(60vw, 540px)",
            objectFit: "contain",
            opacity: 0.035,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div className="hero__in">
          <div className="wrap">
            <div className="hero__cat rv in">
              <span className="chip chip--ac">
                <span className="chip-dot" />
                EST. 2020 · GOLD COAST AU
              </span>
            </div>

            <h1 className="rv in d1">
              <span className="ln">PUSHING THE</span>
              <span className="ln">BOUNDARIES OF</span>
              <span className="ln ac">UNDERGROUND</span>
              <span className="ln">ELECTRONIC MUSIC</span>
            </h1>

            <p className="hero__sub rv in d2">
              Tinnie House Records is an independent label dedicated to showcasing innovative techno,
              melodic techno, and progressive house from Australia and beyond.
            </p>

            <div className="hero__cta rv in d3">
              <button className="hud hud--solid" onClick={handleListenClick}>
                {showMusicPlayer ? (
                  <Pause size={15} />
                ) : (
                  <Play size={15} fill="currentColor" />
                )}
                {showMusicPlayer ? "Pause" : "Listen Now"}
              </button>

              <button
                className="hud hud--ghost"
                onClick={() => scrollToSection("releases")}
              >
                <span className="hud__in">
                  Explore Releases <ChevronRight size={13} />
                </span>
              </button>
            </div>

            {/* Inline player */}
            {showMusicPlayer && stormdrifterRelease?.audioFilePath && (
              <div
                style={{
                  marginTop: 32,
                  maxWidth: 420,
                  background: "rgba(7,11,18,0.7)",
                  border: "1px solid var(--line)",
                  padding: "20px 24px",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontFamily: "var(--f-disp)",
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                    }}
                  >
                    {stormdrifterRelease.title}
                  </div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ac-ink)", marginTop: 2 }}>
                    {stormdrifterRelease.artist}
                  </div>
                </div>
                <MusicPlayer
                  audioPath={stormdrifterRelease.audioFilePath}
                  title={stormdrifterRelease.title}
                  artist={stormdrifterRelease.artist}
                  compact={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom meta bar */}
        <div className="hero__meta">
          <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
            <div className="hero__stat">
              <b>019</b>
              <span>Catalog Releases</span>
            </div>
            <div className="hero__stat">
              <b>08</b>
              <span>Resident Artists</span>
            </div>
            <div className="hero__stat">
              <b>∞</b>
              <span>BPM / Energy</span>
            </div>
          </div>
          <div className="hero__scroll">SCROLL</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ MARQUEE */}
      <MarqueeStrip release={stormdrifterRelease} />

      {/* ═════════════════════════════════════════════════ SPOTLIGHT */}
      <section id="spotlight" className="spot sec-pad">
        <div className="wrap">
          <div className="eyebrow rv">
            {stormdrifterRelease?.upcoming ? "UPCOMING RELEASE" : "LATEST RELEASE"}
          </div>

          {stormdrifterRelease && (
            <div className="spot__grid rv in d1">
              {/* Artwork */}
              <div className="spot__art">
                <img
                  src={stormdrifterRelease.coverImageUrl || stormdrifterRelease.imgUrl || ""}
                  alt={stormdrifterRelease.title}
                  loading="lazy"
                />
                <div className="corner tl" />
                <div className="corner br" />
                <div className="play">
                  <button onClick={handleListenClick} aria-label="Play preview">
                    {showMusicPlayer ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                  </button>
                </div>
                <div className="ovl">
                  <span className="spot__cat-tag">{stormdrifterRelease.internalReference}</span>
                  {stormdrifterRelease.digitalReleaseDate && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                      {new Date(stormdrifterRelease.digitalReleaseDate).toLocaleDateString("en-AU", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="spot__info">
                <div className="eyebrow">SPOTLIGHT</div>
                <h3>{stormdrifterRelease.title}</h3>
                <div className="spot__artist">{stormdrifterRelease.artist}</div>

                <div className="spot__tags">
                  {stormdrifterRelease.musicStyle && (
                    <span className="chip chip--ac">
                      <span className="chip-dot" />
                      {stormdrifterRelease.musicStyle}
                    </span>
                  )}
                  {stormdrifterRelease.bundleType && (
                    <span className="chip">{stormdrifterRelease.bundleType}</span>
                  )}
                  {stormdrifterRelease.upcoming && (
                    <span className="chip chip--ac">Upcoming</span>
                  )}
                </div>

                {stormdrifterRelease.description && (
                  <p className="spot__desc">{stormdrifterRelease.description}</p>
                )}

                <div className="spot__cta">
                  {stormdrifterRelease.audioFilePath && (
                    <button className="hud hud--solid" onClick={handleListenClick}>
                      {showMusicPlayer ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
                      {showMusicPlayer ? "Pause" : "Preview"}
                    </button>
                  )}
                  {stormdrifterRelease.purchaseLink ? (
                    <a
                      href={stormdrifterRelease.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hud hud--ghost"
                    >
                      <span className="hud__in">Buy on Beatport</span>
                    </a>
                  ) : (
                    <button className="hud hud--ghost" onClick={handleShareClick}>
                      <span className="hud__in">
                        <Share size={13} /> Share
                      </span>
                    </button>
                  )}
                </div>

                <div className="spot__meta">
                  <div>
                    <span>Release Date</span>
                    <b>
                      {stormdrifterRelease.digitalReleaseDate
                        ? new Date(stormdrifterRelease.digitalReleaseDate).toLocaleDateString("en-AU", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBA"}
                    </b>
                  </div>
                  <div>
                    <span>Catalog</span>
                    <b>{stormdrifterRelease.internalReference || "—"}</b>
                  </div>
                  <div>
                    <span>Tracks</span>
                    <b>{stormdrifterRelease.trackCount ?? "—"}</b>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ CATALOG WALL */}
      <section id="releases" className="wall sec-pad">
        <div className="wrap">
          <div className="wall__head rv">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>DISCOGRAPHY</div>
              <h2 className="h-sec">Catalog Releases</h2>
            </div>
          </div>

          <div className="rv in d1">
            <CatalogWall releases={sortedReleases} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ ARTISTS */}
      <section id="artists" className="artists sec-pad">
        <div className="wrap">
          <div className="rv" style={{ marginBottom: 42 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>ROSTER</div>
            <h2 className="h-sec">Artists</h2>
          </div>

          {artists.length === 0 ? (
            <p style={{ color: "var(--ink-3)", fontFamily: "var(--f-mono)" }}>
              No artists available at this time.
            </p>
          ) : (
            <div className="art-grid rv in">
              {artists.slice(0, 4).map((artist, idx) => {
                const soundcloudLink = artist.socialLinks?.soundcloud;
                return (
                  <div
                    key={artist.id}
                    className={`artist rv in d${Math.min(idx + 1, 3)}`}
                    onClick={() => soundcloudLink && window.open(soundcloudLink, "_blank")}
                    style={{ cursor: soundcloudLink ? "pointer" : "default" }}
                  >
                    <div className="artist__n">0{idx + 1}</div>
                    <div className="artist__art">
                      <img
                        src={
                          artist.imageUrl ||
                          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
                        }
                        alt={artist.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="artist__body">
                      <div className="artist__name">{artist.name}</div>
                      <div className="artist__role">{artist.genre || "Electronic"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ ABOUT */}
      <section id="about" className="about sec-pad">
        <div className="wrap">
          <div className="about__grid rv in">
            {/* Left */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>ABOUT THE LABEL</div>
              <h2 className="about__big">
                Underground sounds that define{" "}
                <em>tomorrow's dancefloors</em>
              </h2>
              <p>
                Tinnie House Records is a cutting-edge electronic music label rooted in Australia's vibrant
                Gold Coast scene, championing the underground sounds that define tomorrow's dancefloors.
              </p>
              <p style={{ marginTop: 16 }}>
                While we celebrate Australia's rich electronic heritage, we champion artists from every corner
                of the globe. Our passion spans techno, melodic techno, and progressive house, always seeking
                groundbreaking sounds that transcend borders and move both body and soul.
              </p>
              <div style={{ marginTop: 32 }}>
                <button
                  className="hud hud--ghost"
                  onClick={() => scrollToSection("contact")}
                >
                  <span className="hud__in">Our Story</span>
                </button>
              </div>
            </div>

            {/* Right: stats */}
            <div className="about__stats">
              <div className="about__stat">
                <b>
                  19<span className="u">+</span>
                </b>
                <span>Catalog Releases</span>
              </div>
              <div className="about__stat">
                <b>
                  8<span className="u">+</span>
                </b>
                <span>Resident Artists</span>
              </div>
              <div className="about__stat">
                <b>
                  12<span className="u">+</span>
                </b>
                <span>Countries Reached</span>
              </div>
              <div className="about__stat">
                <b>2020</b>
                <span>Founded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════ DEMOS */}
      <section id="contact" className="demo sec-pad">
        <div className="wrap">
          <div className="rv" style={{ textAlign: "center", marginBottom: 42 }}>
            <div className="eyebrow center" style={{ marginBottom: 14 }}>GET INVOLVED</div>
            <h2 className="h-sec">Send Us Your Sound</h2>
          </div>

          <div className="demo__grid rv in">
            {/* Demo submissions panel */}
            <div className="panel">
              <h4>Demo Submissions</h4>
              <ul className="demo__list">
                <li>
                  <span className="n">01</span>
                  <span>Submit 2–3 of your best unreleased tracks via SoundCloud links</span>
                </li>
                <li>
                  <span className="n">02</span>
                  <span>Include a brief artist bio and your social media links</span>
                </li>
                <li>
                  <span className="n">03</span>
                  <span>
                    If your tracks catch our attention, we'll reach out for WAV files — no attachments
                    in the initial submission
                  </span>
                </li>
                <li>
                  <span className="n">04</span>
                  <span>We accept all genres of electronic music with a focus on Techno, Melodic Techno and Progressive House</span>
                </li>
              </ul>
              <div style={{ marginTop: 28 }}>
                <a
                  href="mailto:contact@tinniehouserecords.com"
                  className="hud hud--solid"
                  style={{ display: "inline-flex" }}
                >
                  <Mail size={14} />
                  Submit Your Demo
                </a>
              </div>
            </div>

            {/* Join / community panel */}
            <div className="panel">
              <h4>Join the Frequency</h4>
              <p style={{ color: "var(--ink-2)", marginTop: 16, fontSize: 14.5 }}>
                Sign up for exclusive updates on releases, events, and special announcements from Tinnie
                House Records.
              </p>
              <div className="demo__sub" style={{ marginTop: 24 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="inp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="hud hud--solid" style={{ whiteSpace: "nowrap" }}>
                  Subscribe
                </button>
              </div>

              {/* Channels */}
              <div className="demo__chans">
                <a
                  href="https://bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chan"
                  style={{ textDecoration: "none" }}
                >
                  <span>Bandcamp</span>
                  <b>Follow</b>
                </a>
                <a
                  href="https://soundcloud.com/tinniehouserecords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chan"
                  style={{ textDecoration: "none" }}
                >
                  <span>SoundCloud</span>
                  <b>Follow</b>
                </a>
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chan"
                  style={{ textDecoration: "none" }}
                >
                  <span>Spotify</span>
                  <b>Follow</b>
                </a>
                <a
                  href="https://www.instagram.com/tinnie_house_records/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chan"
                  style={{ textDecoration: "none" }}
                >
                  <span>Instagram</span>
                  <b>Follow</b>
                </a>
                <a
                  href="https://www.youtube.com/@tinniehouserecords3141"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chan"
                  style={{ textDecoration: "none" }}
                >
                  <span>YouTube</span>
                  <b>Subscribe</b>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ UPCOMING MODAL */}
      <Dialog open={showUpcomingModal} onOpenChange={setShowUpcomingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Coming Soon
            </DialogTitle>
            <DialogDescription>
              This release is not yet available for purchase or sharing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {stormdrifterRelease && (
              <>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{stormdrifterRelease.title}</h3>
                  <p className="text-sm text-muted-foreground">by {stormdrifterRelease.artist}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">This release will be available soon</p>
                </div>
                <div className="flex justify-center">
                  <button
                    className="hud hud--solid"
                    onClick={() => setShowUpcomingModal(false)}
                  >
                    Got it
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
