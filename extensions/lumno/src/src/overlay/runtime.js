(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.LumnoOverlayRuntime = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const STORAGE_KEYS = Object.freeze({
    themeMode: '_x_extension_theme_mode_2024_unique_',
    language: '_x_extension_language_2024_unique_',
    defaultSearchEngine: '_x_extension_default_search_engine_2024_unique_',
    siteSearchCustom: '_x_extension_site_search_custom_2024_unique_',
    siteSearchDisabled: '_x_extension_site_search_disabled_2024_unique_',
    siteSearchIconCache: '_x_extension_site_search_icon_cache_canonical_2026_unique_',
    documentPipEnabled: '_x_extension_document_pip_enabled_2026_unique_',
    searchResultPriority: '_x_extension_search_result_priority_2026_unique_',
    searchResultSourceTypes: '_x_extension_search_result_source_types_2026_unique_',
    searchResultDisplayLimit: '_x_extension_search_result_display_limit_2026_unique_',
    searchBlacklist: '_x_extension_search_blacklist_2026_unique_',
    faviconRequestBlacklist: '_x_extension_favicon_request_blacklist_2026_unique_',
    faviconEnhancedFetchEnabled: '_x_extension_favicon_enhanced_fetch_enabled_2026_unique_',
    overlayOpenTabsDefaultVisible: '_x_extension_overlay_open_tabs_default_visible_2026_unique_',
    overlayTabTriggers: '_x_extension_overlay_tab_triggers_2026_unique_',
    overlayTabKeyword: '_x_extension_overlay_tab_keyword_2026_unique_',
    overlayHistoryKeyword: '_x_extension_overlay_history_keyword_2026_unique_',
    overlaySizeMode: '_x_extension_overlay_size_mode_2026_unique_',
    overlayEnterAnimation: '_x_extension_overlay_enter_animation_2026_unique_',
    overlayPageThemeAdaptationEnabled: '_x_extension_overlay_page_theme_adaptation_enabled_2026_unique_',
    motionEffectsEnabled: '_x_extension_motion_effects_enabled_2026_unique_',
    simpleModeEnabled: '_x_extension_simple_mode_enabled_2026_unique_',
    numberShortcutInstantEnabled: '_x_extension_number_shortcut_instant_enabled_2026_unique_',
    macosCtrlSuggestionNavigationEnabled: '_x_extension_macos_ctrl_suggestion_navigation_enabled_2026_unique_',
    overlayTabPriority: '_x_extension_overlay_tab_priority_2024_unique_',
    tabRankScoreDebug: '_x_extension_tab_rank_score_debug_2026_unique_'
  });

  function getRuntimeUrl(chromeApi, path) {
    return chromeApi && chromeApi.runtime && typeof chromeApi.runtime.getURL === 'function'
      ? chromeApi.runtime.getURL(path)
      : path;
  }

  function getStorageArea(chromeApi) {
    const settingsApi = typeof globalThis !== 'undefined' ? globalThis.LumnoSettings : null;
    if (settingsApi && typeof settingsApi.createProviderStorageRuntime === 'function') {
      return settingsApi.createProviderStorageRuntime(chromeApi);
    }
    const storage = chromeApi && chromeApi.storage ? chromeApi.storage : null;
    const area = storage && storage.sync
      ? storage.sync
      : (storage && storage.local ? storage.local : null);
    const name = area
      ? (storage && area === storage.sync ? 'sync' : 'local')
      : null;
    return Object.freeze({
      area,
      name
    });
  }

  function getStorageValues(storageArea, keys) {
    return new Promise((resolve) => {
      if (!storageArea || typeof storageArea.get !== 'function') {
        resolve({});
        return;
      }
      let settled = false;
      const finish = (result) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(result || {});
      };
      try {
        const maybePromise = storageArea.get(keys, finish);
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(finish).catch(() => finish({}));
        }
      } catch (error) {
        finish({});
      }
    });
  }

  function isInjectedBrowserExtensionProtocol(protocol) {
    const normalized = String(protocol || '').toLowerCase();
    return normalized === 'chrome-extension:' ||
      normalized === 'moz-extension:' ||
      normalized === 'ms-browser-extension:';
  }

  function isInvalidExtensionResourceUrl(url) {
    if (!url) {
      return true;
    }
    try {
      const parsed = new URL(url);
      return isInjectedBrowserExtensionProtocol(parsed.protocol) &&
        String(parsed.hostname || '').toLowerCase() === 'invalid';
    } catch (error) {
      return false;
    }
  }

  function loadLocaleMessages(options) {
    const settings = options && typeof options === 'object' ? options : {};
    const chromeApi = settings.chromeApi;
    const locale = typeof settings.normalizeLocale === 'function'
      ? settings.normalizeLocale(settings.locale)
      : String(settings.locale || 'en');
    if (!chromeApi || !chromeApi.runtime || typeof chromeApi.runtime.getURL !== 'function') {
      return Promise.resolve({});
    }
    const loadViaMessage = () => new Promise((resolve) => {
      if (!chromeApi.runtime || typeof chromeApi.runtime.sendMessage !== 'function') {
        resolve({});
        return;
      }
      try {
        chromeApi.runtime.sendMessage({ action: 'getLocaleMessages', locale }, (response) => {
          resolve((response && response.messages) || {});
        });
      } catch (error) {
        resolve({});
      }
    });
    const localePath = getRuntimeUrl(chromeApi, `_locales/${locale}/messages.json`);
    if (isInvalidExtensionResourceUrl(localePath)) {
      return loadViaMessage();
    }
    return fetch(localePath, { cache: 'no-store' })
      .then((response) => response.json())
      .catch(loadViaMessage);
  }

  return Object.freeze({
    STORAGE_KEYS,
    getRuntimeUrl,
    getStorageArea,
    getStorageValues,
    isInjectedBrowserExtensionProtocol,
    loadLocaleMessages
  });
});
