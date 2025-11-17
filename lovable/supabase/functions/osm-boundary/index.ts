// Deno Edge Function: osm-boundary
// Fetches precise boundary geometry from OpenStreetMap (Nominatim)
// Input JSON: { q: string, type?: 'municipality' | 'district' | 'street' | 'address' }
// Output: { feature: GeoJSON Feature } or 400

import { serve } from "https://deno.land/std@0.223.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Overpass helpers for better Swedish municipality coverage
async function overpassMunicipalitySearch(name: string, limit = 10) {
  const base = name.replace(/\s*kommun\s*$/i, "").trim();
  const baseEscapedForRegex = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = `^(${baseEscapedForRegex}|${baseEscapedForRegex}\\s+kommun)$`;
  const query = `
[out:json][timeout:25];
area["ISO3166-1"="SE"]->.se;
rel(area.se)["boundary"="administrative"]["admin_level"="8"][~"^(name|name:sv|official_name|official_name:sv|alt_name|alt_name:sv)$"~"${pattern}", i](limit:${limit});
out ids center tags;
`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return [];
  const json = (await res.json().catch(() => null)) as any;
  const elements = json?.elements || [];
  return elements
    .filter((e: any) => e.type === "relation")
    .map((e: any) => ({
      osm_id: e.id,
      osm_type: "relation",
      class: "boundary",
      type: "administrative",
      name: e.tags?.name || base,
      display_name: e.tags?.official_name || e.tags?.name || base,
      extratags: { ...(e.tags || {}), admin_level: "8" },
      tags: e.tags || {},
      lat: e.center?.lat,
      lon: e.center?.lon,
    }));
}

async function overpassDistrictSearch(name: string, limit = 10) {
  const base = name.replace(/\s*(stadsdel|område)\s*$/i, "").trim();
  const escaped = base.replace(/"/g, '\\"');
  const query = `
[out:json][timeout:25];
area["ISO3166-1"="SE"]->.se;
rel(area.se)["boundary"="administrative"]["admin_level"~"9|10"]["name"~"${escaped}", i](limit:${limit});
out ids center tags;
`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return [];
  const json = (await res.json().catch(() => null)) as any;
  const elements = json?.elements || [];
  return elements
    .filter((e: any) => e.type === "relation")
    .map((e: any) => ({
      osm_id: e.id,
      osm_type: "relation",
      class: "boundary",
      type: "administrative",
      name: e.tags?.name || base,
      display_name: e.tags?.name || base,
      extratags: { admin_level: e.tags?.admin_level || "10" },
      lat: e.center?.lat,
      lon: e.center?.lon,
    }));
}

async function nominatimLookup(osmType: "R" | "W" | "N", id: number) {
  const url = `https://nominatim.openstreetmap.org/lookup?format=jsonv2&polygon_geojson=1&extratags=1&osm_ids=${osmType}${id}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Framtidsboet/1.0 (kontakt@framtidsboet.se)",
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  const arr = (await res.json().catch(() => [])) as any[];
  return arr?.[0] || null;
}

// Fallback: Build polygon GeoJSON from OSM relation via polygons.openstreetmap.fr
async function fetchOSMFranceGeoJSONForRelation(relationId: number) {
  try {
    const url = `https://polygons.openstreetmap.fr/get_geojson.py?id=${relationId}&params=0`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const geo = await res.json().catch(() => null);
    // Expect a GeoJSON geometry or Feature/FeatureCollection
    if (!geo) return null;
    if (geo.type === "Feature" || geo.type === "FeatureCollection") return geo;
    if (geo.type === "Polygon" || geo.type === "MultiPolygon") return geo;
    return null;
  } catch (_) {
    return null;
  }
}

// --- Geometry utilities ---
function extractGeometry(geo: any): any | null {
  if (!geo) return null;
  if (geo.type === "Feature") return geo.geometry || null;
  if (geo.type === "FeatureCollection")
    return geo.features?.[0]?.geometry || null;
  return geo;
}

function ringArea(coords: number[][]): number {
  let area = 0;
  for (let i = 0, len = coords.length; i < len - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

function geometryArea(geometry: any): number {
  if (!geometry) return 0;
  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates || [];
    return rings.reduce(
      (sum: number, ring: number[][]) => sum + ringArea(ring),
      0,
    );
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.reduce(
      (sum: number, poly: number[][][]) =>
        sum + poly.reduce((s, ring) => s + ringArea(ring), 0),
      0,
    );
  }
  return 0;
}

async function getPolygonForRelation(relationId: number): Promise<any | null> {
  // Try Nominatim first
  try {
    const looked = await nominatimLookup("R", relationId);
    const g = extractGeometry(looked?.geojson);
    if (g && (g.type === "Polygon" || g.type === "MultiPolygon")) return g;
  } catch (_) {}
  // Fallback: OSM France polygons service
  try {
    const fr = await fetchOSMFranceGeoJSONForRelation(relationId);
    const g = extractGeometry(fr);
    if (g && (g.type === "Polygon" || g.type === "MultiPolygon")) return g;
  } catch (_) {}
  return null;
}

async function resolveMunicipalityFeature(query: string): Promise<any | null> {
  const base = query.replace(/\s*kommun\s*$/i, "").trim();
  const candidates = await overpassMunicipalitySearch(base, 5);
  if (!candidates || candidates.length === 0) return null;

  let best: { item: any; geometry: any; area: number; score: number } | null =
    null;
  const baseLower = base.toLowerCase();
  for (const c of candidates) {
    const geom = await getPolygonForRelation(Number(c.osm_id));
    if (!geom) continue;
    const a = geometryArea(geom);

    const t = c.tags || {};
    const names = [
      t.official_name,
      t["official_name:sv"],
      t.name,
      t["name:sv"],
      c.display_name,
      c.name,
    ]
      .filter(Boolean)
      .map((v: string) => v.toLowerCase());
    const exactKommun = names.includes(`${baseLower} kommun`);
    const exactBase = names.includes(baseLower);

    const score = (exactKommun ? 1000000 : 0) + (exactBase ? 10000 : 0) + a;

    if (!best || score > best.score) {
      best = { item: c, geometry: geom, area: a, score };
    }
  }
  if (!best) return null;

  const display = (() => {
    const t = best?.item.tags || {};
    const names = [
      t.official_name,
      t["official_name:sv"],
      t.name,
      t["name:sv"],
    ].filter(Boolean) as string[];
    const exact = names.find((n) => n.toLowerCase() === `${baseLower} kommun`);
    if (exact) return exact;
    return best?.item.display_name || best?.item.name || `${base} kommun`;
  })();

  const props = {
    name: display,
    class: "boundary",
    type: "administrative",
    admin_level: "8",
  };
  return { type: "Feature", properties: props, geometry: best.geometry };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    const body = await req.json().catch(() => ({}));
    const { q, type, list: listInBody } = body as any;
    const isList =
      url.searchParams.get("list") === "true" || listInBody === true;

    if (!q || typeof q !== "string") {
      return new Response(JSON.stringify({ error: "Missing q" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For municipalities, try multiple search strategies
    const searchQueries = [q];
    if (type === "municipality" || q.toLowerCase().includes("kommun")) {
      const baseQuery = q.replace(/\s*kommun\s*$/i, "").trim();
      if (baseQuery !== q) {
        // If query had "kommun", also try without it
        searchQueries.unshift(baseQuery);
      } else {
        // If query didn't have "kommun", also try with it
        searchQueries.push(`${baseQuery} kommun`);
      }
    }

    const allItems: any[] = [];

    // Try each search query
    for (const searchQuery of searchQueries) {
      const params = new URLSearchParams({
        q: searchQuery,
        format: "jsonv2",
        addressdetails: "1",
        polygon_geojson: "1",
        countrycodes: "se",
        limit: isList ? "10" : "5",
        extratags: "1",
      });

      // For municipalities, also specify that we want administrative boundaries
      if (
        type === "municipality" ||
        searchQuery.toLowerCase().includes("kommun")
      ) {
        params.append("class", "boundary");
        params.append("type", "administrative");
      }

      const nominatimUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

      const res = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "Framtidsboet/1.0 (kontakt@framtidsboet.se)",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const items = await res.json();
        if (items && items.length > 0) {
          allItems.push(...items);
        }
      }

      // If we found good results on the first query, don't need to try more
      if (
        allItems.length > 0 &&
        allItems.some(
          (item: any) =>
            item.class === "boundary" &&
            item.type === "administrative" &&
            (item.extratags?.admin_level === "8" ||
              item.extratags?.admin_level === 8),
        )
      ) {
        break;
      }
    }

    // Remove duplicates based on osm_id
    const uniqueItems = allItems.filter(
      (item, index, arr) =>
        arr.findIndex(
          (i) => i.osm_id === item.osm_id && i.osm_type === item.osm_type,
        ) === index,
    );

    let items = uniqueItems;

    // Fallback/augment with Overpass for Swedish municipalities when needed
    if (
      isList &&
      (type === "municipality" || q.toLowerCase().includes("kommun"))
    ) {
      try {
        const extra = await overpassMunicipalitySearch(q, 10);
        if (extra?.length) {
          items = [...items, ...extra].filter(
            (item, index, arr) =>
              arr.findIndex(
                (i) => i.osm_id === item.osm_id && i.osm_type === item.osm_type,
              ) === index,
          );
        }
      } catch (_) {}
    }
    // Fallback/augment for districts as well
    if (isList && type === "district") {
      try {
        const extra = await overpassDistrictSearch(q, 10);
        if (extra?.length) {
          items = [...items, ...extra].filter(
            (item, index, arr) =>
              arr.findIndex(
                (i) => i.osm_id === item.osm_id && i.osm_type === item.osm_type,
              ) === index,
          );
        }
      } catch (_) {}
    }
    if (!items || items.length === 0) {
      console.log(`[osm-boundary] No results found for query: "${q}"`);
      return new Response(JSON.stringify({ error: "No results", query: q }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If list mode is requested, return multiple suggestions for autocomplete
    if (isList) {
      // Normalize + classify + deduplicate
      const out: any[] = [];
      const seen = new Set<string>();
      const toKey = (s: any) => {
        if (s.type === "municipality") {
          const base = String(s.name || "")
            .replace(/\s*kommun\s*$/i, "")
            .trim()
            .toLowerCase();
          return `muni|${base}`;
        }
        if (s.type === "district") {
          return `dist|${String(s.name || "").toLowerCase()}|${String(s.municipality || "").toLowerCase()}`;
        }
        return `addr|${String(s.name || "").toLowerCase()}|${String(s.municipality || "").toLowerCase()}`;
      };

      for (const i of items) {
        const adminRaw =
          i?.extratags?.admin_level ??
          i?.tags?.admin_level ??
          i?.admin_level ??
          i?.address?.admin_level;
        const adminLevel =
          typeof adminRaw === "string" ? adminRaw : String(adminRaw ?? "");
        const addresstype = (i?.addresstype || "").toLowerCase();
        const cls = i?.class;
        const typ = i?.type;
        const nameStr = i?.name || i?.address?.name || "";
        const disp = i?.display_name || "";
        const endsKommun =
          /\bkommun\b/i.test(nameStr) || /\bkommun\b/i.test(disp);

        // Determine normalized type with robust heuristics
        let normType: "municipality" | "district" | "address" = "address";

        // Extract location details first
        const muni =
          i?.address?.municipality ||
          i?.address?.city ||
          i?.address?.town ||
          i?.address?.county ||
          undefined;

        // Check for actual Swedish municipality (admin_level 8 is definitive)
        const isAdminLevel8 =
          cls === "boundary" && typ === "administrative" && adminLevel === "8";
        const isExplicitMunicipality =
          addresstype === "municipality" || typ === "municipality";

        // For municipality classification, require strong evidence
        if (isAdminLevel8 || isExplicitMunicipality) {
          normType = "municipality";
        } else if (endsKommun && (cls === "boundary" || cls === "place")) {
          // Only classify as municipality if it ends with kommun AND has boundary/place class
          // AND doesn't have conflicting municipality info (i.e., it's not a place within another municipality)
          const hasConflictingMuni =
            muni &&
            !muni.toLowerCase().includes(
              nameStr
                .replace(/\s*kommun\s*$/i, "")
                .trim()
                .toLowerCase(),
            );
          if (!hasConflictingMuni) {
            normType = "municipality";
          }
        } else if (
          (cls === "boundary" &&
            typ === "administrative" &&
            (adminLevel === "9" || adminLevel === "10")) ||
          (cls === "place" &&
            [
              "suburb",
              "neighbourhood",
              "borough",
              "quarter",
              "city_district",
            ].includes(String(typ)))
        ) {
          normType = "district";
        } else {
          normType = "address";
        }

        let name = i?.name || i?.address?.road || muni || i?.display_name || "";
        let fullName = i?.display_name || name;

        if (normType === "municipality") {
          const base = i?.name || muni || name;
          const pretty = `${(base || "")
            .toString()
            .replace(/\s*kommun\s*$/i, "")
            .trim()} kommun`;
          name = pretty;
          fullName = pretty;
        } else if (normType === "district") {
          const district =
            i?.name ||
            i?.address?.suburb ||
            i?.address?.neighbourhood ||
            i?.address?.quarter ||
            i?.address?.borough ||
            name;
          name = district;
          fullName = muni ? `${district}, ${muni}` : district;
        } else {
          const road = i?.address?.road || i?.name || name || i?.type;
          name = road;
          fullName = muni ? `${road}, ${muni}` : road;
        }

        const suggestion = {
          id: `${i?.osm_type || "osm"}-${i?.osm_id || i?.place_id}`,
          name,
          type: normType,
          fullName,
          municipality: muni,
          center_lat: i?.lat ? Number(i.lat) : undefined,
          center_lng: i?.lon ? Number(i.lon) : undefined,
        };

        const key = toKey(suggestion);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(suggestion);
        }
      }

      // Sort: municipalities first, then districts, then addresses; keep input order within groups
      const order = { municipality: 0, district: 1, address: 2 } as const;
      out.sort(
        (a: { type: keyof typeof order }, b: { type: keyof typeof order }) =>
          order[a.type] - order[b.type],
      );

      // Basic telemetry for debugging
      try {
        const muniCount = out.filter((s) => s.type === "municipality").length;
        const distCount = out.filter((s) => s.type === "district").length;
        const addrCount = out.filter((s) => s.type === "address").length;
        console.log("[osm-boundary] list", {
          q,
          type,
          total_in: items.length,
          out_total: out.length,
          muniCount,
          distCount,
          addrCount,
        });
      } catch {}

      return new Response(JSON.stringify({ suggestions: out.slice(0, 15) }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Single boundary mode - return the best boundary feature for map display

    // Municipality: prefer Overpass -> full polygon resolution first
    if (type === "municipality" || q.toLowerCase().includes("kommun")) {
      try {
        const resolved = await resolveMunicipalityFeature(q);
        if (resolved?.geometry) {
          return new Response(JSON.stringify({ feature: resolved }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (_) {}
    }

    const pick = (arr: any[], typeHint?: string) => {
      // Municipality: admin boundary level 8 (Swedish municipalities)
      if (typeHint === "municipality" || q.toLowerCase().includes("kommun")) {
        const m = arr.find(
          (i) =>
            i.class === "boundary" &&
            i.type === "administrative" &&
            (i.extratags?.admin_level === "8" ||
              i.extratags?.admin_level === 8),
        );
        if (m) return m;
        // Fallback: any administrative boundary for municipalities
        const admin = arr.find(
          (i) => i.class === "boundary" && i.type === "administrative",
        );
        if (admin) return admin;
      }
      // District: admin boundary level 9-10 or place=suburb/neighbourhood
      if (typeHint === "district") {
        const d = arr.find(
          (i) =>
            (i.class === "boundary" &&
              i.type === "administrative" &&
              (i.extratags?.admin_level === "10" ||
                i.extratags?.admin_level === "9")) ||
            (i.class === "place" &&
              (i.type === "suburb" || i.type === "neighbourhood")),
        );
        if (d) return d;
      }
      // Street/address: highway or building with addr
      if (typeHint === "street" || typeHint === "address") {
        const s = arr.find(
          (i) =>
            i.class === "highway" || i.class === "building" || i.address?.road,
        );
        if (s) return s;
      }
      // General priority: administrative boundaries first, then any with polygon
      const admin = arr.find(
        (i) =>
          i.class === "boundary" &&
          i.type === "administrative" &&
          i.geojson &&
          (i.geojson.type === "Polygon" || i.geojson.type === "MultiPolygon"),
      );
      if (admin) return admin;
      // Any with polygon
      const poly = arr.find(
        (i) =>
          i.geojson &&
          (i.geojson.type === "Polygon" || i.geojson.type === "MultiPolygon"),
      );
      if (poly) return poly;
      // Fall back to first
      return arr[0];
    };

    const choice = pick(items, type);
    let finalChoice = choice;

    // Municipality fallback via Overpass + Nominatim lookup if needed
    if (type === "municipality" || q.toLowerCase().includes("kommun")) {
      const hasPolygon =
        finalChoice?.geojson &&
        (finalChoice.geojson.type === "Polygon" ||
          finalChoice.geojson.type === "MultiPolygon" ||
          finalChoice.geojson.type === "Feature" ||
          finalChoice.geojson.type === "FeatureCollection");
      const isMunicipality =
        finalChoice?.class === "boundary" &&
        finalChoice?.type === "administrative" &&
        (finalChoice?.extratags?.admin_level === "8" ||
          finalChoice?.extratags?.admin_level === 8);
      if (!hasPolygon || !isMunicipality) {
        try {
          const over = await overpassMunicipalitySearch(q, 1);
          const first = over?.[0];
          if (first?.osm_id) {
            const looked = await nominatimLookup("R", Number(first.osm_id));
            if (looked?.geojson) {
              finalChoice = looked;
            }
          }
        } catch (_) {}
      }
    }

    // District fallback via Overpass + Nominatim lookup if needed
    if (type === "district") {
      const hasPolygon =
        finalChoice?.geojson &&
        (finalChoice.geojson.type === "Polygon" ||
          finalChoice.geojson.type === "MultiPolygon" ||
          finalChoice.geojson.type === "Feature" ||
          finalChoice.geojson.type === "FeatureCollection");
      const isDistrict =
        finalChoice?.class === "boundary" &&
        finalChoice?.type === "administrative" &&
        (finalChoice?.extratags?.admin_level === "9" ||
          finalChoice?.extratags?.admin_level === 9 ||
          finalChoice?.extratags?.admin_level === "10" ||
          finalChoice?.extratags?.admin_level === 10);
      if (!hasPolygon || !isDistrict) {
        try {
          const over = await overpassDistrictSearch(q, 1);
          const first = over?.[0];
          if (first?.osm_id) {
            const looked = await nominatimLookup("R", Number(first.osm_id));
            if (looked?.geojson) {
              finalChoice = looked;
            }
          }
        } catch (_) {}
      }
    }

    // Ensure we have a polygon geometry: try direct lookup by osm_id/osm_type if present
    let ensured = finalChoice;
    const hasPolyGeom =
      ensured?.geojson &&
      (ensured.geojson.type === "Polygon" ||
        ensured.geojson.type === "MultiPolygon" ||
        ensured.geojson.type === "Feature" ||
        ensured.geojson.type === "FeatureCollection");
    if (!hasPolyGeom && ensured?.osm_id) {
      const osmTypeRaw = ensured.osm_type;
      const letter: "R" | "W" | "N" =
        osmTypeRaw === "relation" || osmTypeRaw === "R"
          ? "R"
          : osmTypeRaw === "way" || osmTypeRaw === "W"
            ? "W"
            : "N";
      try {
        const looked = await nominatimLookup(letter, Number(ensured.osm_id));
        if (looked?.geojson) ensured = looked;
      } catch (_) {}
    }

    // As a last resort for municipalities, try Overpass -> polygons.openstreetmap.fr
    if (type === "municipality" || q.toLowerCase().includes("kommun")) {
      const g = ensured?.geojson;
      const stillNoPolygon =
        !g ||
        g.type === "Point" ||
        g.type === "LineString" ||
        g.type === "MultiLineString";
      if (stillNoPolygon) {
        try {
          const over = await overpassMunicipalitySearch(q, 1);
          const first = over?.[0];
          if (first?.osm_id) {
            const fr = await fetchOSMFranceGeoJSONForRelation(
              Number(first.osm_id),
            );
            if (fr) {
              ensured = {
                ...ensured,
                geojson: fr,
                class: "boundary",
                type: "administrative",
                extratags: { admin_level: "8" },
                display_name: ensured?.display_name || q,
              };
            }
          }
        } catch (_) {}
      }
    }

    finalChoice = ensured;

    // Normalize geometry to a pure GeoJSON geometry object
    const g = finalChoice?.geojson;
    let geometry: any = null;
    if (g) {
      if (g.type === "Feature") geometry = g.geometry;
      else if (g.type === "FeatureCollection")
        geometry = g.features?.[0]?.geometry || null;
      else geometry = g;
    }

    // Fallback to bounding box as polygon
    if (!geometry && finalChoice?.boundingbox) {
      geometry = {
        type: "Polygon",
        coordinates: [
          [
            [
              Number(finalChoice.boundingbox[2]),
              Number(finalChoice.boundingbox[0]),
            ],
            [
              Number(finalChoice.boundingbox[3]),
              Number(finalChoice.boundingbox[0]),
            ],
            [
              Number(finalChoice.boundingbox[3]),
              Number(finalChoice.boundingbox[1]),
            ],
            [
              Number(finalChoice.boundingbox[2]),
              Number(finalChoice.boundingbox[1]),
            ],
            [
              Number(finalChoice.boundingbox[2]),
              Number(finalChoice.boundingbox[0]),
            ],
          ],
        ],
      };
    }

    // Fallback to small circle around center if absolutely nothing else
    if (!geometry && finalChoice?.lat && finalChoice?.lon) {
      const minX = Number(finalChoice.lon) - 0.01;
      const maxX = Number(finalChoice.lon) + 0.01;
      const minY = Number(finalChoice.lat) - 0.01;
      const maxY = Number(finalChoice.lat) + 0.01;
      geometry = {
        type: "Polygon",
        coordinates: [
          [
            [minX, minY],
            [maxX, minY],
            [maxX, maxY],
            [minX, maxY],
            [minX, minY],
          ],
        ],
      };
    }

    const feature = {
      type: "Feature",
      properties: {
        name: finalChoice?.display_name || finalChoice?.name || q,
        class: finalChoice?.class,
        type: finalChoice?.type,
        admin_level: finalChoice?.extratags?.admin_level,
      },
      geometry,
    } as any;

    return new Response(JSON.stringify({ feature }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
