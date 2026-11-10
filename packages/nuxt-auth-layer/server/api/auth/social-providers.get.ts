export default defineEventHandler((event) => {
  return getConfiguredSocialProviderIds(useRuntimeConfig(event as never));
});
