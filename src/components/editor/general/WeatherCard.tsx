import { useMemo } from "react";
import { useSetupStore } from "../../../store/setupStore";
import { useWeather } from "../../../hooks/useWeather";

export default function WeatherCard(){

    const setup=
    useSetupStore(
        s=>s.currentSetup
    );

    const update=
    useSetupStore(
        s=>s.updateGeneral
    );

    const trackName = setup?.general?.track ?? "";

    useWeather(trackName);

    const weatherSummary = useMemo(() => {

        if (!setup?.general) return null;

        const weather = setup.general.weather;
        const temp = setup.general.airTemperature;
        const humidity = setup.general.humidity;
        const wind = setup.general.wind;

        return [
          weather ? String(weather) : "--",
          temp != null ? `${temp.toFixed(1)}°C` : "--",
          humidity != null ? `${humidity}%` : "--",
          wind ? String(wind) : "--",
        ];

    }, [setup?.general]);

    if(!setup) return null;

    const general=setup.general;

    return(

        <div className="general-column compact-stack">

            <h2>

                CONDITIONS

            </h2>

            <div className="weather-summary">
                {weatherSummary?.map((value, index) => (
                    <div key={`${value}-${index}`} className="weather-pill">
                        <span>{["Weather", "Temp", "Humidity", "Wind"][index]}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>

            <div className="weather-meta-grid">

                <div className="field compact-field">

                    <label>

                        Date

                    </label>

                    <input

                        value={String(general.date ?? "")}

                        readOnly

                    />

                </div>

                <div className="field compact-field">

                    <label>

                        Time

                    </label>

                    <input

                        value={String(general.time ?? "")}

                        readOnly

                    />

                </div>

                <div className="field compact-field weather-track-temp">

                    <label>

                        Track Temp

                    </label>

                    <input

                        type="number"

                        value={general.trackTemperature ?? ""}

                        onChange={e=>

                            update({

                                trackTemperature:

                                Number(e.target.value)

                            })

                        }

                    />

                </div>

            </div>

        </div>

    );

}
