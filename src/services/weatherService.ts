import { Track } from "../data/tracks";

export interface WeatherResult {

  temperature:number;

  humidity:number;

  wind:number;

  weather:string;

}

export async function getWeather(
  track:Track
):Promise<WeatherResult>{

  const url=

`https://api.open-meteo.com/v1/forecast?latitude=${track.latitude}&longitude=${track.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  const response=await fetch(url);

  const json=await response.json();

  return{

    temperature:json.current.temperature_2m,

    humidity:json.current.relative_humidity_2m,

    wind:json.current.wind_speed_10m,

    weather:String(json.current.weather_code)

  };

}
