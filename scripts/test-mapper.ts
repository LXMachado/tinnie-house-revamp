import { mapSupabaseReleases } from "../shared/data-mapper.ts";

const SUPABASE_URL = "https://owfzhzdcughglvllnhei.supabase.co/rest/v1";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZnpoemRjdWdoZ2x2bGxuaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODI2NzksImV4cCI6MjA3NzU1ODY3OX0.CHHeWMRw6KwphbnyOexbtLs38e9o8c0cuMqUqxqByzE";

async function main() {
  const res = await fetch(`${SUPABASE_URL}/releases?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  const raw = await res.json();
  const mapped = mapSupabaseReleases(raw);

  console.log(
    mapped.map((release) => ({
      title: release.title,
      artist: release.artist,
      audioFilePath: release.audioFilePath,
      internalReference: release.internalReference,
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
