const cityTimezones = require("city-timezones");
const countriesAndTimezones = require("countries-and-timezones");

function countries() {
  return Object.values(countriesAndTimezones.getAllCountries())
    .map(({ id, name }) => ({ code: id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function cities(countryCode, query = "") {
  const normalizedQuery = String(query).trim().toLowerCase();
  return cityTimezones.cityMapping
    .filter((item) => !countryCode || item.iso2 === countryCode)
    .filter((item) => {
      if (!normalizedQuery) return true;
      return `${item.city} ${item.city_ascii || ""} ${item.province || ""}`.toLowerCase().includes(normalizedQuery);
    })
    .sort((a, b) => (b.pop || 0) - (a.pop || 0))
    .slice(0, 10)
    .map((item) => ({
      city: item.city,
      province: item.province || null,
      country: item.country,
      countryCode: item.iso2,
      latitude: item.lat,
      longitude: item.lng,
      timeZone: item.timezone
    }));
}

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const mode = String(req.query?.mode || "cities");
  if (mode === "countries") {
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.status(200).json({ ok: true, countries: countries() });
    return;
  }

  const countryCode = String(req.query?.country || "").toUpperCase();
  const query = String(req.query?.q || "");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.status(200).json({ ok: true, cities: cities(countryCode, query) });
};

module.exports.countries = countries;
module.exports.cities = cities;
