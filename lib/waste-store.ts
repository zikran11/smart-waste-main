import { WasteAnalysisResult } from './mock-ai-data'

// In-memory store for demo purposes (will be replaced with Firestore)
let scanHistory: WasteAnalysisResult[] = []

export function addScanToHistory(scan: WasteAnalysisResult): void {
  // Hanya simpan hasil yang valid sebagai sampah ke history/dashboard
  if (scan.validationStatus === 'trash') {
    scanHistory = [scan, ...scanHistory]
  }
}

export function getScanHistory(): WasteAnalysisResult[] {
  return scanHistory
}

export function clearHistory(): void {
  scanHistory = []
}

export function getTotalStats() {
  const totalScans = scanHistory.length
  const totalEconomicValue = scanHistory.reduce((sum, scan) => sum + scan.pricePerKg, 0)
  const totalCo2Reduction = scanHistory.reduce((sum, scan) => sum + scan.environmentalImpact.co2Reduction, 0)
  const totalEnergySaving = scanHistory.reduce((sum, scan) => sum + scan.environmentalImpact.energySaving, 0)
  const totalWaterSaving = scanHistory.reduce((sum, scan) => sum + scan.environmentalImpact.waterSaving, 0)
  const totalTreeEquivalent = scanHistory.reduce((sum, scan) => sum + scan.environmentalImpact.treeEquivalent, 0)

  return {
    totalScans,
    totalEconomicValue,
    totalCo2Reduction,
    totalEnergySaving,
    totalWaterSaving,
    totalTreeEquivalent
  }
}
