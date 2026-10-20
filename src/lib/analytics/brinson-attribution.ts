export interface BrinsonSector {
  sector: string;
  portfolioWeight: number;
  benchmarkWeight: number;
  portfolioReturn: number;
  benchmarkReturn: number;
}

export interface BrinsonAttributionResult {
  sector: string;
  portfolioWeight: number;
  benchmarkWeight: number;
  allocation: number;
  selection: number;
  interaction: number;
  totalEffect: number;
}
export interface BrinsonAttributionSummary {
  portfolioReturn: number;
  benchmarkReturn: number;
  activeReturn: number;
  totalAllocation: number;
  totalSelection: number;
  totalInteraction: number;
  totalAttribution: number;
  rows: BrinsonAttributionResult[];
}

export function calculateBrinsonAttribution(
  sectors: BrinsonSector[],
): BrinsonAttributionSummary {
  if (sectors.length === 0) {
    throw new Error("At least one sector is required.");
  }

  for (const sector of sectors) {
    const values = [
      sector.portfolioWeight,
      sector.benchmarkWeight,
      sector.portfolioReturn,
      sector.benchmarkReturn,
    ];

    if (values.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid numeric data for ${sector.sector}.`);
    }

    if (sector.portfolioWeight < 0 || sector.benchmarkWeight < 0) {
      throw new Error(`Sector weights cannot be negative: ${sector.sector}.`);
    }
  }

  const portfolioWeightTotal = sectors.reduce(
    (sum, sector) => sum + sector.portfolioWeight,
    0,
  );

  const benchmarkWeightTotal = sectors.reduce(
    (sum, sector) => sum + sector.benchmarkWeight,
    0,
  );

  const tolerance = 1e-9;

  if (Math.abs(portfolioWeightTotal - 1) > tolerance) {
    throw new Error("Portfolio weights must sum to 100%.");
  }

  if (Math.abs(benchmarkWeightTotal - 1) > tolerance) {
    throw new Error("Benchmark weights must sum to 100%.");
  }

  const portfolioReturn = sectors.reduce(
    (sum, sector) =>
      sum + sector.portfolioWeight * sector.portfolioReturn,
    0,
  );

  const benchmarkReturn = sectors.reduce(
    (sum, sector) =>
      sum + sector.benchmarkWeight * sector.benchmarkReturn,
    0,
  );

  const rows = sectors.map((sector) => {
    const allocation =
      (sector.portfolioWeight - sector.benchmarkWeight) *
      (sector.benchmarkReturn - benchmarkReturn);

    const selection =
      sector.benchmarkWeight *
      (sector.portfolioReturn - sector.benchmarkReturn);

    const interaction =
      (sector.portfolioWeight - sector.benchmarkWeight) *
      (sector.portfolioReturn - sector.benchmarkReturn);
   
      return {
        sector: sector.sector,
        portfolioWeight: sector.portfolioWeight,
        benchmarkWeight: sector.benchmarkWeight,
        allocation,
        selection,
        interaction,
        totalEffect: allocation + selection + interaction,
     };
    
  });

  const totalAllocation = rows.reduce(
    (sum, row) => sum + row.allocation,
    0,
  );

  const totalSelection = rows.reduce(
    (sum, row) => sum + row.selection,
    0,
  );

  const totalInteraction = rows.reduce(
    (sum, row) => sum + row.interaction,
    0,
  );

  const activeReturn = portfolioReturn - benchmarkReturn;

  const totalAttribution =
    totalAllocation + totalSelection + totalInteraction;

  return {
    portfolioReturn,
    benchmarkReturn,
    activeReturn,
    totalAllocation,
    totalSelection,
    totalInteraction,
    totalAttribution,
    rows,
  };
}
