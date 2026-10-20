import { describe, expect, it } from "vitest"; 
import { 
  calculateBrinsonAttribution, 
  type BrinsonSector, 
} from "../brinson-attribution"; 
 
const sectors: BrinsonSector[] = [ 
  { 
    sector: "Technology", 
    portfolioWeight: 0.35, 
    benchmarkWeight: 0.30, 
    portfolioReturn: 0.12, 
    benchmarkReturn: 0.09, 
  }, 
  { 
    sector: "Healthcare", 
    portfolioWeight: 0.20, 
    benchmarkWeight: 0.22, 
    portfolioReturn: 0.07, 
    benchmarkReturn: 0.08, 
  }, 
  { 
    sector: "Financials", 
    portfolioWeight: 0.18, 
    benchmarkWeight: 0.20, 
    portfolioReturn: 0.10, 
    benchmarkReturn: 0.06, 
  }, 
  { 
    sector: "Energy", 
    portfolioWeight: 0.12, 
    benchmarkWeight: 0.13, 
    portfolioReturn: -0.02, 
    benchmarkReturn: 0.01, 
  }, 
  { 
    sector: "Consumer & Other", 
    portfolioWeight: 0.15, 
    benchmarkWeight: 0.15, 
    portfolioReturn: 0.06, 
    benchmarkReturn: 0.05, 
  }, 
]; 
 
describe("calculateBrinsonAttribution", () => { 
  it("calculates portfolio and benchmark returns correctly", () => { 
    const result = calculateBrinsonAttribution(sectors); 
 
    expect(result.portfolioReturn).toBeCloseTo(0.0806, 10); 
    expect(result.benchmarkReturn).toBeCloseTo(0.0654, 10); 
    expect(result.activeReturn).toBeCloseTo(0.0152, 10); 
  }); 
 
  it("calculates allocation, selection and interaction effects", () => { 
    const result = calculateBrinsonAttribution(sectors); 
 
    expect(result.totalAllocation).toBeCloseTo(0.0016, 10); 
    expect(result.totalSelection).toBeCloseTo(0.0124, 10); 
    expect(result.totalInteraction).toBeCloseTo(0.0012, 10); 
  }); 
 
  it("reconciles attribution effects with active return", () => { 
    const result = calculateBrinsonAttribution(sectors); 
 
    expect(result.totalAttribution).toBeCloseTo( 
      result.activeReturn, 
      10, 
    ); 
  }); 
 
  it("returns an attribution result for every sector", () => { 
    const result = calculateBrinsonAttribution(sectors); 
 
    expect(result.rows).toHaveLength(5); 
    expect(result.rows[0].sector).toBe("Technology"); 
    expect(result.rows[0].totalEffect).toBeCloseTo( 
      result.rows[0].allocation + 
        result.rows[0].selection + 
        result.rows[0].interaction, 
      10, 
    ); 
  }); 
 
  it("rejects empty sector data", () => { 
    expect(() => calculateBrinsonAttribution([])).toThrow( 
      "At least one sector is required.", 
    ); 
  }); 
 
  it("rejects portfolio weights that do not sum to 100%", () => { 
    const invalidSectors = sectors.map((sector) => ({ 
      ...sector, 
      portfolioWeight: sector.portfolioWeight * 0.9, 
    })); 
 
    expect(() => calculateBrinsonAttribution(invalidSectors)).toThrow( 
      "Portfolio weights must sum to 100%.", 
    ); 
  }); 
 
  it("rejects benchmark weights that do not sum to 100%", () => { 
    const invalidSectors = sectors.map((sector) => ({ 
      ...sector, 
      benchmarkWeight: sector.benchmarkWeight * 0.9, 
    })); 
 
    expect(() => calculateBrinsonAttribution(invalidSectors)).toThrow( 
      "Benchmark weights must sum to 100%.", 
    ); 
  }); 
 
  it("rejects negative sector weights", () => { 
    const invalidSectors = sectors.map((sector, index) => 
      index === 0 ? { ...sector, portfolioWeight: -0.1 } : sector, 
    ); 
 
    expect(() => calculateBrinsonAttribution(invalidSectors)).toThrow( 
      "Sector weights cannot be negative: Technology.", 
    ); 
  }); 
 
  it("rejects non-finite numeric values", () => { 
    const invalidSectors = sectors.map((sector, index) => 
      index === 0 
        ? { ...sector, portfolioReturn: Number.NaN } 
        : sector, 
    ); 
 
    expect(() => calculateBrinsonAttribution(invalidSectors)).toThrow( 
      "Invalid numeric data for Technology.", 
    ); 
  }); 
}); 
