export type SidebarModule =
  | "General"
  | "Suspension"
  | "Tires"
  | "Brakes"
  | "Engine"
  | "DAQ"
  | "Aero"
  | "Performance";

export interface SidebarSection {

  title: string;

  rows: {

    label: string;

    value: string;

  }[];

}

export function getSidebarSections(
  module: SidebarModule
): SidebarSection[] {

  switch (module) {

    case "General":

      return [

        {

          title: "SESSION",

          rows: [

            {
              label: "Driver",
              value: "--",
            },

            {
              label: "Track",
              value: "--",
            },

            {
              label: "Weather",
              value: "--",
            },

          ],

        },

      ];

    case "Suspension":

      return [

        {

          title: "SUSPENSION KPIs",

          rows: [

            {
              label: "Cross Weight",
              value: "--",
            },

            {
              label: "Front %",
              value: "--",
            },

            {
              label: "Ride Height Δ",
              value: "--",
            },

          ],

        },

      ];

    case "Tires":

      return [

        {

          title: "TIRE KPIs",

          rows: [

            {
              label: "Pressure Gain",
              value: "--",
            },

            {
              label: "Average Temp",
              value: "--",
            },

            {
              label: "Temp Spread",
              value: "--",
            },

          ],

        },

      ];

    case "Brakes":

      return [

        {

          title: "BRAKE KPIs",

          rows: [

            {
              label: "Rotor Δ",
              value: "--",
            },

            {
              label: "Front Bias",
              value: "--",
            },

            {
              label: "Rear Bias",
              value: "--",
            },

          ],

        },

      ];

    case "Engine":

      return [

        {

          title: "ENGINE",

          rows: [

            {
              label: "Map",
              value: "--",
            },

            {
              label: "Rev Limit",
              value: "--",
            },

          ],

        },

      ];

    case "DAQ":

      return [

        {

          title: "DAQ",

          rows: [

            {
              label: "Telemetry",
              value: "--",
            },

            {
              label: "Sensors",
              value: "--",
            },

          ],

        },

      ];

    case "Aero":

      return [

        {

          title: "AERO",

          rows: [

            {
              label: "Wing Split",
              value: "--",
            },

            {
              label: "RH Delta",
              value: "--",
            },

          ],

        },

      ];

    case "Performance":

      return [

        {

          title: "PERFORMANCE",

          rows: [

            {
              label: "Driver Rating",
              value: "--",
            },

            {
              label: "Best Lap",
              value: "--",
            },

            {
              label: "Recommendation",
              value: "Waiting",
            },

          ],

        },

      ];

  }

}
