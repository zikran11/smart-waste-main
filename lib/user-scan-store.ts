import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { WasteAnalysisResult } from './mock-ai-data'

const LOCAL_USER_SCAN_STORAGE_PREFIX = 'smart-waste-user-scans-'

function getLocalStorageKey(userId: string) {
  return `${LOCAL_USER_SCAN_STORAGE_PREFIX}${userId}`
}

function loadLocalUserScans(userId: string): WasteAnalysisResult[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(getLocalStorageKey(userId))
    if (!stored) return []
    return JSON.parse(stored) as WasteAnalysisResult[]
  } catch {
    return []
  }
}

function saveLocalUserScans(userId: string, scans: WasteAnalysisResult[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(scans))
  } catch {
    // ignore storage errors
  }
}

function getDashboardStatsKey(userId: string) {
  return `smart-waste-dashboard-stats-${userId}`
}

function loadCachedDashboardStats(userId: string) {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(getDashboardStatsKey(userId))
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function saveCachedDashboardStats(userId: string, stats: any) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(getDashboardStatsKey(userId), JSON.stringify(stats))
  } catch {
    // ignore storage errors
  }
}

function calculateStatsFromHistory(history: WasteAnalysisResult[]) {
  return {
    totalScans: history.length,
    totalEconomicValue: history.reduce((sum, scan) => sum + scan.pricePerKg, 0),
    totalCo2Reduction: history.reduce((sum, scan) => sum + scan.environmentalImpact.co2Reduction, 0),
    totalEnergySaving: history.reduce((sum, scan) => sum + scan.environmentalImpact.energySaving, 0),
    totalWaterSaving: history.reduce((sum, scan) => sum + scan.environmentalImpact.waterSaving, 0),
    totalTreeEquivalent: history.reduce((sum, scan) => sum + scan.environmentalImpact.treeEquivalent, 0),
  }
}

function createUserScansCollection(userId: string) {
  if (!db) throw new Error('Firestore is not initialized')
  return collection(db, 'users', userId, 'scans')
}

export async function saveUserScanResult(userId: string, scan: WasteAnalysisResult): Promise<void> {
  const normalizedScan = {
    ...scan,
    createdAt: scan.createdAt instanceof Date ? scan.createdAt : new Date(scan.createdAt),
  }

  if (normalizedScan.validationStatus !== 'trash') {
    return
  }

  const localScans = loadLocalUserScans(userId)
  const updatedScans = [normalizedScan, ...localScans]
  saveLocalUserScans(userId, updatedScans)

  // Update cached stats immediately
  const stats = calculateStatsFromHistory(updatedScans)
  saveCachedDashboardStats(userId, stats)

  if (isFirebaseConfigured && db) {
    const scanRef = doc(createUserScansCollection(userId), scan.id)
    await setDoc(scanRef, normalizedScan)
  }
}

export function getCachedUserScanHistory(userId: string): WasteAnalysisResult[] {
  return loadLocalUserScans(userId)
}

export async function getUserScanHistory(userId: string): Promise<WasteAnalysisResult[]> {
  if (isFirebaseConfigured && db) {
    const scansQuery = query(
      createUserScansCollection(userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(scansQuery)

    const remoteScans = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as WasteAnalysisResult & { createdAt: Timestamp }
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      }
    })

    // Update local cache and stats with remote data
    saveLocalUserScans(userId, remoteScans)
    const stats = calculateStatsFromHistory(remoteScans)
    saveCachedDashboardStats(userId, stats)

    return remoteScans
  }

  return loadLocalUserScans(userId)
}

export function getCachedDashboardStats(userId: string) {
  return loadCachedDashboardStats(userId)
}
