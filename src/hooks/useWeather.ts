import { useEffect } from "react";

import { tracks } from "../data/tracks";
import { getWeather } from "../services/weatherService";

import { useSetupStore } from "../store/setupStore";

const SKY_HARBOR_ALIASES = [
  "sky harbor",
  "skyharbor",
  "phoenix sky harbor",
  "phoenix sky harbor airport",
  "kphx",
  "phx",
];

function resolveTrack(trackName: string) {
  const normalized = trackName.trim().toLowerCase();

  if (!normalized) return null;

  const direct = tracks.find((t) => t.name.toLowerCase() === normalized);
  if (direct) return direct;

  const aliasMatch = SKY_HARBOR_ALIASES.some((alias) => normalized.includes(alias));
  if (aliasMatch) {
    return {
      id: "skyharbor",
      name: "Sky Harbor",
      latitude: 33.4343,
      longitude: -112.0116,
    };
  }

  return null;
}

export function useWeather(trackName: string) {

  const update = useSetupStore(
    (state) => state.updateGeneral
  );

  useEffect(() => {

    if (!trackName) return;

    const track = resolveTrack(trackName);

    if (!track) return;

    getWeather(track)
      .then((weather) => {

        update({

          weather: weather.weather,

          airTemperature:
            weather.temperature,

          humidity:
            weather.humidity,

          wind:
            `${weather.wind} mph`,

          date:
            new Date().toLocaleDateString(),

          time:
            new Date().toLocaleTimeString(),

        });

      })
      .catch(console.error);

  }, [trackName, update]);

}
