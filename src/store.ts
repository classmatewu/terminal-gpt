import { defineStore } from 'pinia'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { CONFIG_DIR, CONFIG_FILE, PROVIDER_PRESETS } from './config'

export interface ProviderConfig {
  apiKey: string
  baseUrl: string
  model: string
}

export interface FullConfig {
  /** Index into PROVIDER_PRESETS */
  providerIndex: number
  /** Per-provider apiKey, keyed by provider name */
  providerKeys: Record<string, string>
  /** Per-provider overrides (baseUrl, model), keyed by provider name */
  providerOverrides: Record<string, Partial<Omit<ProviderConfig, 'apiKey'>>>
}

const DEFAULT_PROVIDER_INDEX = 0

export const useSettingStore = defineStore('setting', () => {
  const providerIndex = ref(DEFAULT_PROVIDER_INDEX)
  const providerKeys = ref<Record<string, string>>({})
  const providerOverrides = ref<Record<string, Partial<Omit<ProviderConfig, 'apiKey'>>>>({})
  const loaded = ref(false)

  // ─── Derived: current provider preset ───
  const currentPreset = computed(() => PROVIDER_PRESETS[providerIndex.value])
  const currentName = computed(() => currentPreset.value.name)

  // ─── Derived: effective config for the active provider ───
  const apiKey = computed({
    get: () => providerKeys.value[currentName.value] ?? '',
    set: (v: string) => { providerKeys.value[currentName.value] = v },
  })

  const baseUrl = computed({
    get: () => providerOverrides.value[currentName.value]?.baseUrl ?? currentPreset.value.baseUrl,
    set: (v: string) => {
      if (!providerOverrides.value[currentName.value]) providerOverrides.value[currentName.value] = {}
      providerOverrides.value[currentName.value].baseUrl = v
    },
  })

  const model = computed({
    get: () => providerOverrides.value[currentName.value]?.model ?? currentPreset.value.defaultModel,
    set: (v: string) => {
      if (!providerOverrides.value[currentName.value]) providerOverrides.value[currentName.value] = {}
      providerOverrides.value[currentName.value].model = v
    },
  })

  // ─── Switch provider ───
  function cycleProvider() {
    providerIndex.value = (providerIndex.value + 1) % PROVIDER_PRESETS.length
  }

  function setProvider(index: number) {
    providerIndex.value = index % PROVIDER_PRESETS.length
  }

  // ─── Persistence ───
  async function loadConfig() {
    try {
      const data = await readFile(CONFIG_FILE, 'utf-8')
      const config = JSON.parse(data) as Partial<FullConfig> & Partial<{ apiKey: string; baseUrl: string; model: string }>

      // New format
      if (config.providerIndex != null) providerIndex.value = config.providerIndex
      if (config.providerKeys) providerKeys.value = config.providerKeys
      if (config.providerOverrides) providerOverrides.value = config.providerOverrides

      // ── Migrate old single-key format ──
      // Old config had flat { apiKey, baseUrl, model }
      if (!config.providerKeys && config.apiKey) {
        const oldBase = (config.baseUrl ?? '').replace(/\/+$/, '')
        // Exact match on baseUrl (strip trailing slashes for comparison)
        const matched = PROVIDER_PRESETS.find(p =>
          p.baseUrl && p.baseUrl.replace(/\/+$/, '') === oldBase
        )
        const name = matched?.name ?? PROVIDER_PRESETS[0].name
        providerKeys.value[name] = config.apiKey
        if (config.baseUrl) {
          if (!providerOverrides.value[name]) providerOverrides.value[name] = {}
          providerOverrides.value[name].baseUrl = config.baseUrl
        }
        if (config.model) {
          if (!providerOverrides.value[name]) providerOverrides.value[name] = {}
          providerOverrides.value[name].model = config.model
        }
        // Set active provider to the migrated one
        const idx = PROVIDER_PRESETS.findIndex(p => p.name === name)
        if (idx >= 0) providerIndex.value = idx
      }
    } catch {
      // No config file yet, use defaults
    }
    loaded.value = true
  }

  async function saveConfig() {
    try {
      await mkdir(CONFIG_DIR, { recursive: true })
      await writeFile(CONFIG_FILE, JSON.stringify({
        providerIndex: providerIndex.value,
        providerKeys: providerKeys.value,
        providerOverrides: providerOverrides.value,
      } satisfies FullConfig, null, 2))
    } catch {
      // Silently fail
    }
  }

  return {
    // State
    providerIndex,
    providerKeys,
    providerOverrides,
    loaded,
    // Derived (reactive, per-provider)
    currentPreset,
    currentName,
    apiKey,
    baseUrl,
    model,
    // Actions
    cycleProvider,
    setProvider,
    loadConfig,
    saveConfig,
  }
})
