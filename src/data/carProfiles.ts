import type { WorkspaceModule } from "../context/workspace";

export type HeaderTab = {
  label: string;
  path: string;
};

export type SensorSpec = {
  key: string;
  label: string;
  helper?: string;
};

export type SensorGroup = {
  title: string;
  description: string;
  sensors: SensorSpec[];
};

export type CarProfile = {
  id: string;
  displayName: string;
  subtitle: string;
  setupRoute: string;
  headerTabs: HeaderTab[];
  workspaceModules: WorkspaceModule[];
  workspaceSummary: string;
  setupLayout: "standard" | "gt4";
  sensorGroups: SensorGroup[];
};

const DEFAULT_HEADER_TABS: HeaderTab[] = [
  { label: "Control", path: "/" },
  { label: "Setup", path: "/workspace" },
  { label: "Runs", path: "/runs" },
  { label: "Database", path: "/database" },
  { label: "Compare", path: "/compare" },
  { label: "Performance", path: "/dashboard" },
];

const STANDARD_SENSOR_GROUPS: SensorGroup[] = [
  {
    title: "Core Sensors",
    description: "Standard telemetry inputs for setup work.",
    sensors: [
      { key: "steeringAngleSensor", label: "Steering Angle" },
      { key: "throttlePositionSensor", label: "Throttle Position" },
      { key: "brakePressureSensor", label: "Brake Pressure" },
      { key: "wheelSpeedSensor", label: "Wheel Speed" },
      { key: "gpsSensor", label: "GPS" },
    ],
  },
];

const GT4_SENSOR_GROUPS: SensorGroup[] = [
  {
    title: "Chassis Sensors",
    description: "Mustang GT4 chassis channels and corner monitoring.",
    sensors: [
      { key: "steeringAngleSensor", label: "Steering Angle" },
      { key: "wheelSpeedSensor", label: "Wheel Speed" },
      { key: "brakePressureSensor", label: "Brake Pressure" },
      { key: "frontBrakeTempSensor", label: "Front Brake Temps" },
      { key: "rearBrakeTempSensor", label: "Rear Brake Temps" },
      { key: "damperPotSensor", label: "Damper Pots" },
      { key: "rideHeightSensor", label: "Ride Height" },
      { key: "yawSensor", label: "Yaw Sensor" },
    ],
  },
  {
    title: "Powertrain Sensors",
    description: "Endurance-relevant engine and drivetrain monitoring.",
    sensors: [
      { key: "throttlePositionSensor", label: "Throttle Position" },
      { key: "oilTempSensor", label: "Oil Temp" },
      { key: "fuelPressureSensor", label: "Fuel Pressure" },
      { key: "coolantPressureSensor", label: "Coolant Pressure" },
      { key: "gpsSensor", label: "GPS" },
    ],
  },
  {
    title: "Custom Endurance Channels",
    description: "Extra channels that do not live in the base DAQ schema.",
    sensors: [
      { key: "lapBeacon", label: "Lap Beacon" },
      { key: "pitSpeedLimiter", label: "Pit Speed Limiter" },
      { key: "brakeCooling", label: "Brake Cooling" },
      { key: "tireTempProbes", label: "Tire Temp Probes" },
    ],
  },
];

const DEFAULT_PROFILE: CarProfile = {
  id: "default",
  displayName: "Helios",
  subtitle: "Race engineering workstation",
  setupRoute: "/workspace",
  headerTabs: DEFAULT_HEADER_TABS,
  workspaceModules: ["General", "Suspension", "Diff", "Engine", "DAQ", "Aero"],
  workspaceSummary: "Full setup workspace",
  setupLayout: "standard",
  sensorGroups: STANDARD_SENSOR_GROUPS,
};

const CAR_PROFILES: Record<string, CarProfile> = {
  sdm26: {
    id: "sdm26",
    displayName: "SDM26",
    subtitle: "Autocross package",
    setupRoute: "/workspace",
    headerTabs: DEFAULT_HEADER_TABS,
    workspaceModules: ["General", "Suspension", "Diff", "Engine", "DAQ", "Aero"],
    workspaceSummary: "Autocross-focused workspace",
    setupLayout: "standard",
    sensorGroups: STANDARD_SENSOR_GROUPS,
  },
  sdm27: {
    id: "sdm27",
    displayName: "SDM27",
    subtitle: "Endurance package",
    setupRoute: "/workspace",
    headerTabs: [
      { label: "Control", path: "/" },
      { label: "Setup", path: "/workspace" },
      { label: "Runs", path: "/runs" },
      { label: "Endurance", path: "/endurance" },
      { label: "Database", path: "/database" },
      { label: "Compare", path: "/compare" },
      { label: "Performance", path: "/dashboard" },
    ],
    workspaceModules: ["General", "Suspension", "Diff", "Engine", "DAQ", "Aero"],
    workspaceSummary: "Long-run endurance workspace",
    setupLayout: "standard",
    sensorGroups: STANDARD_SENSOR_GROUPS,
  },
  mustang: {
    id: "mustang",
    displayName: "Mustang GT4",
    subtitle: "Endurance race car",
    setupRoute: "/workspace",
    headerTabs: [
      { label: "Control", path: "/" },
      { label: "Setup", path: "/workspace" },
      { label: "Runs", path: "/runs" },
      { label: "Endurance", path: "/endurance" },
      { label: "Database", path: "/database" },
      { label: "Compare", path: "/compare" },
      { label: "Performance", path: "/dashboard" },
    ],
    workspaceModules: ["General", "Suspension", "Diff", "DAQ", "Aero"],
    workspaceSummary: "Trimmed GT4 endurance workspace",
    setupLayout: "gt4",
    sensorGroups: GT4_SENSOR_GROUPS,
  },
};

export function getCarProfile(carId?: string | null): CarProfile {
  if (!carId) return DEFAULT_PROFILE;
  return CAR_PROFILES[carId] ?? DEFAULT_PROFILE;
}

export function getSupportedCarIds() {
  return Object.keys(CAR_PROFILES);
}
