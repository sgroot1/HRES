export interface Track {

  id: string;

  name: string;

  latitude: number;

  longitude: number;

}

export const tracks: Track[] = [

  {

    id: "amp",

    name: "Arizona Motorsports Park",

    latitude: 33.0696,

    longitude: -112.4007,

  },

  {

    id: "whp",

    name: "Wild Horse Pass",

    latitude: 33.2717,

    longitude: -111.9736,

  },

  {

    id: "inde",

    name: "Inde Motorsports Ranch",

    latitude: 31.6669,

    longitude: -110.0133,

  },

  {

    id: "podium",

    name: "Podium Club",

    latitude: 33.1515,

    longitude: -111.8114,

  }

];
