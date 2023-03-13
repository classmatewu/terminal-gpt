import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', () => {
  const openaiApiKey = ref("");
  const cosSecretId = ref("");
  const cosSecretKey = ref("");
  const cosBucket = ref("");
  const cosRegion = ref("");

  watch(openaiApiKey, () => {

  });

  return {
    openaiApiKey,
    cosSecretId,
    cosSecretKey,
    cosBucket,
    cosRegion
  };
});