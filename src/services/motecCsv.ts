import { MotecAnalysisSummary } from "../types/motec";

export interface MotecCsvImportResult {
  bestLap: number | null;
  averageLap: number | null;
  lapCount: number;
  driver: string | null;
  track: string | null;
  analysis: MotecAnalysisSummary;
}

function parseCsvRow(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const next = line[index + 1];
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function detectDelimiter(lines: string[]): string {
  const candidates = [",", ";", "\t"];

  const counts = candidates.map((delimiter) => {
    const total = lines.slice(0, 20).reduce((sum, line) => {
      const matches = line.match(new RegExp(`\\${delimiter}`, "g"));
      return sum + (matches?.length ?? 0);
    }, 0);

    return { delimiter, total };
  });

  counts.sort((a, b) => b.total - a.total);
  return counts[0]?.total ? counts[0].delimiter : ",";
}

function parseLapValue(value: string): number | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const cleaned = trimmed
    .replace(/\s+/g, "")
    .replace(/s$/i, "")
    .replace(",", ".");

  const hourMinuteSecondMatch = cleaned.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/);
  if (hourMinuteSecondMatch) {
    const hours = Number(hourMinuteSecondMatch[1]);
    const minutes = Number(hourMinuteSecondMatch[2]);
    const seconds = Number(hourMinuteSecondMatch[3]);

    if (Number.isFinite(hours) && Number.isFinite(minutes) && Number.isFinite(seconds)) {
      return hours * 3600 + minutes * 60 + seconds;
    }
  }

  const minuteSecondMatch = cleaned.match(/^(\d+):(\d+(?:\.\d+)?)$/);
  if (minuteSecondMatch) {
    const minutes = Number(minuteSecondMatch[1]);
    const seconds = Number(minuteSecondMatch[2]);
    if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
      return minutes * 60 + seconds;
    }
  }

  const numeric = Number(cleaned);
  if (!Number.isFinite(numeric)) return null;
  if (numeric <= 0) return null;

  return numeric;
}

function findColumnIndex(columns: string[], patterns: RegExp[]): number {
  return columns.findIndex((column) => {
    const normalized = column.trim().toLowerCase();
    return patterns.some((pattern) => pattern.test(normalized));
  });
}

function findFirstColumnIndex(columns: string[], patternGroups: RegExp[][]): number {
  for (const patterns of patternGroups) {
    const index = findColumnIndex(columns, patterns);
    if (index >= 0) return index;
  }
  return -1;
}

function getNumericValues(rows: string[][], columnIndex: number): number[] {
  if (columnIndex < 0) return [];

  return rows
    .map((row) => row[columnIndex])
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function getAverage(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getMax(values: number[]): number | null {
  if (!values.length) return null;
  return Math.max(...values);
}

function getPeakAbsolute(values: number[]): number | null {
  if (!values.length) return null;
  return Math.max(...values.map((value) => Math.abs(value)));
}

function normalizePercent(values: number[]): number[] {
  if (!values.length) return values;
  const max = Math.max(...values);
  if (max <= 1.5) {
    return values.map((value) => value * 100);
  }
  return values;
}

function normalizeSpeedToKph(values: number[]): number[] {
  if (!values.length) return values;
  const max = Math.max(...values);

  if (max <= 120) {
    return values.map((value) => value * 3.6);
  }

  return values;
}

function downsampleSeries(values: number[], maxPoints = 320): number[] {
  if (values.length <= maxPoints) return values;

  const step = values.length / maxPoints;
  const sampled: number[] = [];

  for (let index = 0; index < maxPoints; index += 1) {
    const sourceIndex = Math.min(values.length - 1, Math.floor(index * step));
    sampled.push(values[sourceIndex]);
  }

  return sampled;
}

function alignSeriesToLength(values: number[], length: number): number[] {
  if (!length) return [];
  if (!values.length) return new Array(length).fill(0);
  if (values.length === length) return values;

  const result: number[] = [];
  const step = values.length / length;

  for (let index = 0; index < length; index += 1) {
    const sourceIndex = Math.min(values.length - 1, Math.floor(index * step));
    result.push(values[sourceIndex]);
  }

  return result;
}

function deriveLapTimesFromTestNo(tsValues: number[], testNoValues: number[]): number[] {
  if (tsValues.length < 2 || tsValues.length !== testNoValues.length) return [];

  const laps: number[] = [];
  let segmentStart = tsValues[0];
  let previous = testNoValues[0];

  for (let index = 1; index < testNoValues.length; index += 1) {
    const current = testNoValues[index];
    const currentTs = tsValues[index];
    if (!Number.isFinite(current) || !Number.isFinite(currentTs)) continue;

    if (current !== previous) {
      const lapDuration = currentTs - segmentStart;
      if (lapDuration > 5) laps.push(lapDuration);
      segmentStart = currentTs;
      previous = current;
    }
  }

  const finalDuration = tsValues[tsValues.length - 1] - segmentStart;
  if (finalDuration > 5) laps.push(finalDuration);

  return laps;
}

function buildFallbackAnalysis(): MotecAnalysisSummary {
  return {
    sampleCount: 0,
    durationSeconds: null,
    channelCount: 0,
    channelsDetected: [],
    maxSpeedKph: null,
    avgSpeedKph: null,
    maxEngineRpm: null,
    avgThrottlePct: null,
    avgBrakePct: null,
    maxBrakeFront: null,
    maxBrakeRear: null,
    peakLateralG: null,
    peakLongitudinalG: null,
    lapTimesSeconds: [],
    timeTraceSeconds: [],
    speedTraceKph: [],
    throttleTracePct: [],
    brakeTracePct: [],
    rpmTrace: [],
    gpsLatTrace: [],
    gpsLonTrace: [],
  };
}

export function parseMotecCsv(content: string): MotecCsvImportResult {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.replace(/^\uFEFF/, "").trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  if (lines.length < 2) {
    return {
      bestLap: null,
      averageLap: null,
      lapCount: 0,
      driver: null,
      track: null,
      analysis: buildFallbackAnalysis(),
    };
  }

  const delimiter = detectDelimiter(lines);
  const rows = lines.map((line) => parseCsvRow(line, delimiter));

  const headerRowIndex = rows.findIndex((row) => row.length >= 4);

  if (headerRowIndex < 0 || headerRowIndex >= rows.length - 1) {
    return {
      bestLap: null,
      averageLap: null,
      lapCount: 0,
      driver: null,
      track: null,
      analysis: buildFallbackAnalysis(),
    };
  }

  const header = rows[headerRowIndex].map((column) => column.trim().toLowerCase());
  const dataRows = rows.slice(headerRowIndex + 1);

  const lapColumnPatterns = [
    /lap\s*time/,
    /^time$/,
    /lap_time/,
    /laptime/,
    /lap\s*sec/,
    /time\s*\/\s*lap/,
    /best\s*lap/,
  ];

  const lapTimeIndex = findColumnIndex(header, lapColumnPatterns);

  const driverIndex = findColumnIndex(header, [/driver/]);
  const trackIndex = findColumnIndex(header, [/track/, /venue/, /circuit/]);

  const lapValues = dataRows
    .map((row) => {
      if (lapTimeIndex < 0 || lapTimeIndex >= row.length) return null;
      return parseLapValue(row[lapTimeIndex]);
    })
    .filter((value): value is number => value != null);

  const bestLap = lapValues.length ? Math.min(...lapValues) : null;
  const averageLap = lapValues.length
    ? lapValues.reduce((sum, value) => sum + value, 0) / lapValues.length
    : null;

  const tsIndex = findColumnIndex(header, [/^ts$/, /timestamp/, /time\s*stamp/]);
  const gpsSpeedIndex = findFirstColumnIndex(header, [
    [/gps_spd/, /gps\s*speed/],
    [/^gp_speed$/],
    [/speed/],
  ]);
  const engineRpmIndex = findColumnIndex(header, [/engine_speed/, /rpm/]);
  const throttleIndex = findFirstColumnIndex(header, [
    [/throttle_load/],
    [/^tps$/],
    [/throttle/],
  ]);
  const brakeLoadIndex = findColumnIndex(header, [/brake_load/, /brake\s*load/]);
  const brakeFrontIndex = findColumnIndex(header, [/f_brakepressure/, /front.*brake.*pressure/]);
  const brakeRearIndex = findColumnIndex(header, [/r_brakepressure/, /rear.*brake.*pressure/]);
  const latGIndex = findColumnIndex(header, [/imu_y_accel/, /lat/]);
  const longGIndex = findColumnIndex(header, [/imu_x_accel/, /long/]);
  const testNoIndex = findColumnIndex(header, [/^testno$/, /lap\s*no/, /lap\s*number/]);
  const gpsLatIndex = findColumnIndex(header, [/gps_lat/, /latitude/]);
  const gpsLonIndex = findColumnIndex(header, [/gps_lon/, /longitude/]);

  const tsValues = getNumericValues(dataRows, tsIndex);
  const speedValuesRaw = getNumericValues(dataRows, gpsSpeedIndex);
  const speedValues = normalizeSpeedToKph(speedValuesRaw);
  const rpmValues = getNumericValues(dataRows, engineRpmIndex);
  const throttleValuesRaw = getNumericValues(dataRows, throttleIndex);
  const brakeFrontValues = getNumericValues(dataRows, brakeFrontIndex);
  const brakeRearValues = getNumericValues(dataRows, brakeRearIndex);
  const brakeLoadValuesRaw = getNumericValues(dataRows, brakeLoadIndex);
  const latGValues = getNumericValues(dataRows, latGIndex);
  const longGValues = getNumericValues(dataRows, longGIndex);
  const testNoValues = getNumericValues(dataRows, testNoIndex);
  const gpsLatValues = getNumericValues(dataRows, gpsLatIndex);
  const gpsLonValues = getNumericValues(dataRows, gpsLonIndex);

  const throttleValues = normalizePercent(throttleValuesRaw);

  const pressureMax = Math.max(
    getMax(brakeFrontValues) ?? 0,
    getMax(brakeRearValues) ?? 0,
  );

  const derivedBrakeLoadValues = pressureMax > 0
    ? dataRows.map((row) => {
        const front = Number(row[brakeFrontIndex]);
        const rear = Number(row[brakeRearIndex]);
        const frontSafe = Number.isFinite(front) ? front : 0;
        const rearSafe = Number.isFinite(rear) ? rear : 0;
        return ((frontSafe + rearSafe) * 0.5 / pressureMax) * 100;
      })
    : [];

  const brakeLoadValues = brakeLoadValuesRaw.length
    ? normalizePercent(brakeLoadValuesRaw)
    : derivedBrakeLoadValues;

  const derivedLapTimes = deriveLapTimesFromTestNo(tsValues, testNoValues);
  const lapTrend = lapValues.length ? lapValues : derivedLapTimes;

  const bestLapFinal = lapTrend.length ? Math.min(...lapTrend) : bestLap;
  const averageLapFinal = lapTrend.length
    ? lapTrend.reduce((sum, value) => sum + value, 0) / lapTrend.length
    : averageLap;

  const knownChannels = [
    "TS",
    "GPS_SPD/GP_SPEED",
    "ENGINE_SPEED",
    "TPS/THROTTLE_LOAD",
    "BRAKE_LOAD",
    "F_BRAKEPRESSURE",
    "R_BRAKEPRESSURE",
    "IMU_Y_ACCEL",
    "IMU_X_ACCEL",
  ].filter((_, index) => {
    const present = [
      tsIndex >= 0,
      gpsSpeedIndex >= 0,
      engineRpmIndex >= 0,
      throttleIndex >= 0,
      brakeLoadIndex >= 0 || derivedBrakeLoadValues.length > 0,
      brakeFrontIndex >= 0,
      brakeRearIndex >= 0,
      latGIndex >= 0,
      longGIndex >= 0,
    ];
    return present[index];
  });

  const durationSeconds = tsValues.length >= 2
    ? Math.max(0, tsValues[tsValues.length - 1] - tsValues[0])
    : null;

  const rawTimeTrace = tsValues.length
    ? tsValues.map((value) => value - tsValues[0])
    : dataRows.map((_, index) => index);

  const sampledTimeTrace = downsampleSeries(rawTimeTrace);
  const sampledSpeedTrace = alignSeriesToLength(downsampleSeries(speedValues), sampledTimeTrace.length);
  const sampledThrottleTrace = alignSeriesToLength(downsampleSeries(throttleValues), sampledTimeTrace.length);
  const sampledBrakeTrace = alignSeriesToLength(downsampleSeries(brakeLoadValues), sampledTimeTrace.length);
  const sampledRpmTrace = alignSeriesToLength(downsampleSeries(rpmValues), sampledTimeTrace.length);
  const sampledGpsLatTrace = alignSeriesToLength(downsampleSeries(gpsLatValues), sampledTimeTrace.length);
  const sampledGpsLonTrace = alignSeriesToLength(downsampleSeries(gpsLonValues), sampledTimeTrace.length);

  const firstData = dataRows[0] ?? [];

  return {
    bestLap: bestLapFinal,
    averageLap: averageLapFinal,
    lapCount: lapTrend.length,
    driver: driverIndex >= 0 && driverIndex < firstData.length ? firstData[driverIndex] || null : null,
    track: trackIndex >= 0 && trackIndex < firstData.length ? firstData[trackIndex] || null : null,
    analysis: {
      sampleCount: dataRows.length,
      durationSeconds,
      channelCount: header.length,
      channelsDetected: knownChannels,
      maxSpeedKph: getMax(speedValues),
      avgSpeedKph: getAverage(speedValues),
      maxEngineRpm: getMax(rpmValues),
      avgThrottlePct: getAverage(throttleValues),
      avgBrakePct: getAverage(brakeLoadValues),
      maxBrakeFront: getMax(brakeFrontValues),
      maxBrakeRear: getMax(brakeRearValues),
      peakLateralG: getPeakAbsolute(latGValues),
      peakLongitudinalG: getPeakAbsolute(longGValues),
      lapTimesSeconds: lapTrend,
      timeTraceSeconds: sampledTimeTrace,
      speedTraceKph: sampledSpeedTrace,
      throttleTracePct: sampledThrottleTrace,
      brakeTracePct: sampledBrakeTrace,
      rpmTrace: sampledRpmTrace,
      gpsLatTrace: sampledGpsLatTrace,
      gpsLonTrace: sampledGpsLonTrace,
    },
  };
}
