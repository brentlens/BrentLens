export interface BrentPrice {
  date: string;
  price: number;
}

export interface ForecastPoint {
  date: string;
  forecast: number;
  lower: number;
  upper: number;
}

/**
 * Damped Holt Exponential Smoothing for Weekly Aggregates
 */
function holtDampedForecast(
  values: number[],
  horizon: number,
  alpha = 0.65,
  beta = 0.15,
  phi = 0.85
): number[] {
  if (!values.length) return [];
  if (values.length === 1) return Array(horizon).fill(values[0]);

  let level = values[0];
  let trend = values[1] - values[0];

  for (let i = 1; i < values.length; i++) {
    const previousLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + phi * trend);
    trend = beta * (level - previousLevel) + (1 - beta) * phi * trend;
  }

  const predictions: number[] = [];
  for (let h = 1; h <= horizon; h++) {
    let dampedTrend = 0;
    for (let j = 1; j <= h; j++) {
      dampedTrend += Math.pow(phi, j);
    }
    predictions.push(level + dampedTrend * trend);
  }

  return predictions;
}

/**
 * Calculates EWMA volatility for weekly trend residuals
 */
function calculateWeeklyVolatility(
  values: number[],
  lambda = 0.94
): number {
  if (values.length < 3) {
    return Math.max(values[0] * 0.02, 1);
  }

  const residuals: number[] = [];
  let level = values[0];
  let trend = values[1] - values[0];

  const alpha = 0.65;
  const beta = 0.15;
  const phi = 0.85;

  for (let i = 1; i < values.length; i++) {
    const prediction = level + phi * trend;
    residuals.push(values[i] - prediction);

    const previousLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + phi * trend);
    trend = beta * (level - previousLevel) + (1 - beta) * phi * trend;
  }

  let weightedVariance = 0;
  let weightSum = 0;

  for (let i = 0; i < residuals.length; i++) {
    const weight = Math.pow(lambda, residuals.length - 1 - i);
    weightedVariance += Math.pow(residuals[i], 2) * weight;
    weightSum += weight;
  }

  const ewmaStdDev = Math.sqrt(weightedVariance / (weightSum || 1));
  return Math.max(ewmaStdDev, values[values.length - 1] * 0.015);
}

/**
 * Deterministic pseudo-random noise generator
 */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate Brent Weekly Forecast with Perfectly Centered "Today" Line (50/50 Split)
 *
 * @param data Historical Brent prices
 * @param weeks Horizon length in weeks (default: 12 weeks)
 */
export function generateBrentForecast(
  data: BrentPrice[],
  weeks = 12
) {
  if (!data.length) {
    return { historical: [], forecast: [] };
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const cleaned = sorted.filter(
    item => Number.isFinite(item.price) && item.price > 0
  );

  if (!cleaned.length) {
    return { historical: [], forecast: [] };
  }

  const values = cleaned.map(item => item.price);
  const predictions = holtDampedForecast(values, weeks);
  const volatility = calculateWeeklyVolatility(values);

  const lastDateObj = new Date(cleaned[cleaned.length - 1].date);
  const lastPrice = cleaned[cleaned.length - 1].price;

  const forecast: ForecastPoint[] = [];

  for (let i = 0; i < weeks; i++) {
    const date = new Date(lastDateObj);
    date.setDate(lastDateObj.getDate() + (i + 1) * 7);

    // Base damped trend prediction
    const basePrediction = predictions[i];

    // Smooth wavy trajectory components matching reference UI
    const waveFrequency = 0.45; 
    const waveCycle = Math.sin((i + 1) * waveFrequency);
    
    const noiseSeed = lastPrice + i * 137.5;
    const noise = (pseudoRandom(noiseSeed) - 0.5) * volatility * 0.5;

    const transitionWeight = Math.min((i + 1) / 2, 1);
    const wavyDelta = (waveCycle * volatility * 0.75 + noise) * transitionWeight;

    const wavyForecast = Math.max(basePrediction + wavyDelta, 0.01);
    const uncertainty = volatility * 1.96 * Math.sqrt(i + 1);

    forecast.push({
      date: date.toISOString(),
      forecast: Number(wavyForecast.toFixed(2)),
      lower: Number(Math.max(wavyForecast - uncertainty, 0).toFixed(2)),
      upper: Number((wavyForecast + uncertainty).toFixed(2)),
    });
  }

  // --------------------------------------------------------------------------
  // EXACT 50/50 TIME-BASED BALANCING LOGIC
  // --------------------------------------------------------------------------
  const forecastStartMs = lastDateObj.getTime();
  const forecastEndMs = new Date(forecast[forecast.length - 1].date).getTime();
  const forecastTimeSpanMs = forecastEndMs - forecastStartMs; // Total duration of forecast

  // Set historical start date to be exactly the same duration behind "Today"
  const historicalCutoffMs = forecastStartMs - forecastTimeSpanMs;

  const balancedHistorical = cleaned.filter(
    item => new Date(item.date).getTime() >= historicalCutoffMs
  );

  return {
    historical: balancedHistorical,
    forecast,
  };
}