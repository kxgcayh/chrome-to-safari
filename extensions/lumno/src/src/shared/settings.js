(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.LumnoSettings = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const THEME_STORAGE_KEY = '_x_extension_theme_mode_2024_unique_';
  const NEWTAB_THEME_MODE_STORAGE_KEY = '_x_extension_newtab_theme_mode_2026_unique_';
  const NEWTAB_THEME_SCOPE_STORAGE_KEY = '_x_extension_newtab_theme_scope_2026_unique_';
  const NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY = '_x_extension_newtab_shortcuts_visible_2026_unique_';
  const NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY = '_x_extension_newtab_shortcuts_chunk_2_2026_unique_';
  const NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY = '_x_extension_newtab_shortcuts_chunk_3_2026_unique_';
  const NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY = '_x_extension_newtab_shortcut_add_visible_2026_unique_';
  const NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY = '_x_extension_newtab_shortcut_dock_magnification_enabled_2026_unique_';
  const NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY = '_x_extension_newtab_feedback_button_visible_2026_unique_';
  const NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY = '_x_extension_newtab_appearance_button_visible_2026_unique_';
  const NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY = '_x_extension_newtab_shortcut_width_2026_unique_';
  const NEWTAB_SHORTCUT_WIDTH_MIN = 360;
  const NEWTAB_SHORTCUT_WIDTH_MAX = 1440;
  const NEWTAB_SHORTCUT_WIDTH_DEFAULT = 920;
  const NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY = '_x_extension_newtab_input_auto_focus_enabled_2026_unique_';
  const BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY = '_x_extension_bookmark_folder_icons_visible_2026_unique_';
  const UPDATE_NOTICE_ENABLED_STORAGE_KEY = '_x_extension_update_notice_enabled_2026_unique_';
  const MOTION_EFFECTS_ENABLED_STORAGE_KEY = '_x_extension_motion_effects_enabled_2026_unique_';
  const SIMPLE_MODE_ENABLED_STORAGE_KEY = '_x_extension_simple_mode_enabled_2026_unique_';
  const NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY = '_x_extension_number_shortcut_instant_enabled_2026_unique_';
  const MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY =
    '_x_extension_macos_ctrl_suggestion_navigation_enabled_2026_unique_';
  const FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY = '_x_extension_favicon_enhanced_fetch_enabled_2026_unique_';
  const SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY = '_x_extension_search_result_display_limit_2026_unique_';
  const OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY = '_x_extension_overlay_open_tabs_default_visible_2026_unique_';
  const OVERLAY_TAB_KEYWORD_STORAGE_KEY = '_x_extension_overlay_tab_keyword_2026_unique_';
  const OVERLAY_HISTORY_KEYWORD_STORAGE_KEY = '_x_extension_overlay_history_keyword_2026_unique_';
  const OVERLAY_TAB_KEYWORD_DEFAULT = 'tb';
  const OVERLAY_HISTORY_KEYWORD_DEFAULT = 'hy';
  const OVERLAY_ENTER_ANIMATION_STORAGE_KEY = '_x_extension_overlay_enter_animation_2026_unique_';
  const OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY = '_x_extension_overlay_page_theme_adaptation_enabled_2026_unique_';
  const SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY = '_x_extension_selection_quick_actions_enabled_2026_unique_';
  const SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY = '_x_extension_selection_quick_actions_provider_2026_unique_';
  const SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY = '_x_extension_selection_quick_actions_group_enabled_2026_unique_';
  // Device-specific appearance. Never import these values from Chrome Sync.
  const BOOKMARK_TOPBAR_LOCAL_STORAGE_KEYS = Object.freeze([
    '_x_extension_bookmark_topbar_surface_mode_2026_unique_',
    '_x_extension_bookmark_topbar_surface_color_light_2026_unique_',
    '_x_extension_bookmark_topbar_surface_color_dark_2026_unique_',
    '_x_extension_bookmark_topbar_surface_color_2026_unique_'
  ]);
  // User-controlled preferences that are safe to store in chrome.storage.sync.
  // Keep generated caches, device state, and custom wallpaper media out of this list.
  const CHROME_SYNC_STORAGE_KEYS = Object.freeze([
    '_x_extension_theme_mode_2024_unique_',
    '_x_extension_language_2024_unique_',
    '_x_extension_recent_mode_2024_unique_',
    '_x_extension_recent_count_2024_unique_',
    '_x_extension_newtab_width_mode_2026_unique_',
    '_x_extension_newtab_search_width_2026_unique_',
    '_x_extension_newtab_input_auto_focus_enabled_2026_unique_',
    '_x_extension_newtab_theme_mode_2026_unique_',
    '_x_extension_newtab_theme_scope_2026_unique_',
    '_x_extension_newtab_zen_mode_2026_unique_',
    '_x_extension_newtab_wallpaper_2026_unique_',
    '_x_extension_newtab_wallpaper_overlay_2026_unique_',
    '_x_extension_newtab_wallpaper_effect_2026_unique_',
    '_x_extension_newtab_favicon_2026_unique_',
    '_x_extension_overlay_size_mode_2026_unique_',
    '_x_extension_overlay_enter_animation_2026_unique_',
    '_x_extension_overlay_page_theme_adaptation_enabled_2026_unique_',
    '_x_extension_bookmark_count_2024_unique_',
    '_x_extension_bookmark_columns_2024_unique_',
    '_x_extension_bookmark_view_mode_2026_unique_',
    '_x_extension_bookmark_folder_icons_visible_2026_unique_',
    '_x_extension_newtab_pinned_recent_sites_2026_unique_',
    '_x_extension_newtab_hidden_recent_sites_2026_unique_',
    '_x_extension_newtab_shortcuts_2026_unique_',
    NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY,
    NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY,
    '_x_extension_newtab_shortcuts_visible_2026_unique_',
    '_x_extension_newtab_shortcut_add_visible_2026_unique_',
    '_x_extension_newtab_shortcut_dock_magnification_enabled_2026_unique_',
    NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY,
    '_x_extension_update_notice_enabled_2026_unique_',
    '_x_extension_motion_effects_enabled_2026_unique_',
    '_x_extension_simple_mode_enabled_2026_unique_',
    '_x_extension_number_shortcut_instant_enabled_2026_unique_',
    '_x_extension_macos_ctrl_suggestion_navigation_enabled_2026_unique_',
    '_x_extension_auto_pip_enabled_2026_unique_',
    '_x_extension_tab_switcher_enabled_2026_unique_',
    '_x_extension_document_pip_enabled_2026_unique_',
    '_x_extension_pinned_tab_recovery_enabled_2026_unique_',
    '_x_extension_selection_quick_actions_enabled_2026_unique_',
    '_x_extension_selection_quick_actions_provider_2026_unique_',
    '_x_extension_selection_quick_actions_group_enabled_2026_unique_',
    '_x_extension_overlay_tab_priority_2024_unique_',
    '_x_extension_newtab_wordmark_visible_2026_unique_',
    '_x_extension_newtab_time_font_weight_2026_unique_',
    '_x_extension_newtab_time_seconds_visible_2026_unique_',
    '_x_extension_restricted_action_2024_unique_',
    '_x_extension_search_result_priority_2026_unique_',
    '_x_extension_search_result_source_types_2026_unique_',
    '_x_extension_search_result_display_limit_2026_unique_',
    '_x_extension_overlay_open_tabs_default_visible_2026_unique_',
    '_x_extension_fallback_hotkey_2024_unique_',
    '_x_extension_site_search_custom_2024_unique_',
    '_x_extension_site_search_disabled_2024_unique_',
    '_x_extension_search_blacklist_2026_unique_',
    '_x_extension_favicon_request_blacklist_2026_unique_',
    '_x_extension_favicon_enhanced_fetch_enabled_2026_unique_',
    '_x_extension_default_search_engine_2024_unique_',
    '_x_extension_overlay_tab_keyword_2026_unique_',
    '_x_extension_overlay_history_keyword_2026_unique_'
  ]);
  const SELECTION_QUICK_ACTIONS_PROVIDER_KEYS = Object.freeze([
    'gpt',
    'gm',
    'dbai',
    'qw',
    'yb',
    'mx',
    'ds',
    'kimi'
  ]);
  // Keep the original key value so existing installations migrate from boolean to mode in place.
  const NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY = '_x_extension_newtab_wordmark_visible_2026_unique_';
  const NEWTAB_TOP_CONTENT_BRAND = 'brand';
  const NEWTAB_TOP_CONTENT_TIME = 'time';
  const NEWTAB_TOP_CONTENT_OFF = 'off';
  const NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY =
    '_x_extension_newtab_time_font_weight_2026_unique_';
  const NEWTAB_TIME_FONT_WEIGHT_MIN = 300;
  const NEWTAB_TIME_FONT_WEIGHT_MAX = 800;
  const NEWTAB_TIME_FONT_WEIGHT_DEFAULT = 320;
  const NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY =
    '_x_extension_newtab_time_seconds_visible_2026_unique_';

  function normalizeLocale(locale) {
    const raw = String(locale || '').trim();
    if (!raw) {
      return 'en';
    }
    const lower = raw.toLowerCase();
    if (lower.startsWith('zh')) {
      if (lower.includes('tw') || lower.includes('hk') || lower.includes('mo') || lower.includes('hant')) {
        return 'zh_TW';
      }
      return 'zh_CN';
    }
    if (lower === 'ja' || lower.startsWith('ja-') || lower.startsWith('ja_')) {
      return 'ja';
    }
    return 'en';
  }

  function localeToHtmlLang(locale) {
    const normalized = normalizeLocale(locale);
    if (normalized === 'zh_CN') {
      return 'zh-CN';
    }
    if (normalized === 'zh_TW') {
      return 'zh-TW';
    }
    if (normalized === 'ja') {
      return 'ja';
    }
    return 'en';
  }

  function normalizeNewtabWidthMode(value) {
    return value === 'standard' ? 'standard' : 'wide';
  }

  function normalizeNewtabSearchWidth(value, options) {
    const config = options || {};
    const allowNull = Boolean(config.allowNull);
    const min = Number.isFinite(Number(config.min)) ? Number(config.min) : 720;
    const max = Number.isFinite(Number(config.max)) ? Number(config.max) : 1040;
    const fallback = Number.isFinite(Number(config.fallback)) ? Number(config.fallback) : 920;
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return allowNull ? null : fallback;
    }
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function normalizeNewtabTopContentMode(value) {
    if (value === NEWTAB_TOP_CONTENT_TIME) {
      return NEWTAB_TOP_CONTENT_TIME;
    }
    if (value === NEWTAB_TOP_CONTENT_OFF || value === false) {
      return NEWTAB_TOP_CONTENT_OFF;
    }
    return NEWTAB_TOP_CONTENT_BRAND;
  }

  function normalizeNewtabWordmarkVisible(value) {
    return normalizeNewtabTopContentMode(value) !== NEWTAB_TOP_CONTENT_OFF;
  }

  function normalizeNewtabTimeSecondsVisible(value) {
    return value === true;
  }

  function normalizeNewtabTimeFontWeight(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return NEWTAB_TIME_FONT_WEIGHT_DEFAULT;
    }
    return Math.min(
      NEWTAB_TIME_FONT_WEIGHT_MAX,
      Math.max(NEWTAB_TIME_FONT_WEIGHT_MIN, Math.round(number))
    );
  }

  function normalizeNewtabShortcutsVisible(value) {
    return value !== false;
  }

  function normalizeNewtabShortcutAddVisible(value) {
    return value !== false;
  }

  function normalizeNewtabShortcutDockMagnificationEnabled(value) {
    return value !== false;
  }

  function normalizeNewtabFeedbackButtonVisible(value) {
    return value !== false;
  }

  function normalizeNewtabAppearanceButtonVisible(value) {
    return value !== false;
  }

  function normalizeNewtabShortcutWidth(value, options) {
    const config = options || {};
    const min = Number.isFinite(Number(config.min)) ? Number(config.min) : NEWTAB_SHORTCUT_WIDTH_MIN;
    const max = Number.isFinite(Number(config.max)) ? Number(config.max) : NEWTAB_SHORTCUT_WIDTH_MAX;
    const fallback = Number.isFinite(Number(config.fallback))
      ? Number(config.fallback)
      : NEWTAB_SHORTCUT_WIDTH_DEFAULT;
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return Math.min(max, Math.max(min, Math.round(fallback)));
    }
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function normalizeNewtabInputAutoFocusEnabled(value) {
    return value === true;
  }

  function normalizeBookmarkFolderIconsVisible(value) {
    return value !== false;
  }

  function normalizeBookmarkCount(value) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 32 && parsed % 4 === 0) {
      return parsed;
    }
    return 8;
  }

  function normalizeBookmarkColumns(value) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 4 && parsed <= 8) {
      return parsed;
    }
    return 6;
  }

  function normalizeUpdateNoticeEnabled(value) {
    return value !== false;
  }

  function normalizeMotionEffectsEnabled(value) {
    return value !== false;
  }

  function normalizeSimpleModeEnabled(value) {
    return value === true;
  }

  function normalizeNumberShortcutInstantEnabled(value) {
    return value === true;
  }

  function normalizeMacosCtrlSuggestionNavigationEnabled(value) {
    return value === true;
  }

  function shouldSkipEntryMotion(windowRef, motionEffectsEnabled) {
    if (!normalizeMotionEffectsEnabled(motionEffectsEnabled)) {
      return true;
    }
    return Boolean(
      windowRef &&
      typeof windowRef.matchMedia === 'function' &&
      windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function normalizeFaviconEnhancedFetchEnabled(value) {
    return value !== false;
  }

  function normalizeOverlayOpenTabsDefaultVisible(value) {
    return value !== false;
  }

  function normalizeOverlayTabKeyword(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) {
      return OVERLAY_TAB_KEYWORD_DEFAULT;
    }
    // Allow alphanumeric characters only, max 10 chars
    const cleaned = raw.replace(/[^a-z0-9]/g, '').slice(0, 10);
    return cleaned || OVERLAY_TAB_KEYWORD_DEFAULT;
  }

  function normalizeOverlayHistoryKeyword(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) {
      return OVERLAY_HISTORY_KEYWORD_DEFAULT;
    }
    // Allow alphanumeric characters only, max 10 chars
    const cleaned = raw.replace(/[^a-z0-9]/g, '').slice(0, 10);
    return cleaned || OVERLAY_HISTORY_KEYWORD_DEFAULT;
  }

  function normalizeOverlayPageThemeAdaptationEnabled(value) {
    return value !== false;
  }

  function normalizeOverlaySizeMode(value) {
    if (value === 'compact' || value === 'large') {
      return value;
    }
    return 'standard';
  }

  function normalizeOverlayEnterAnimation(value) {
    return value === 'fade' ? 'fade' : 'elastic';
  }

  function normalizeOverlayTabPriorityMode(value) {
    if (value === 'switchTabFirst') {
      return true;
    }
    if (value === 'newtabFirst') {
      return false;
    }
    if (value === false) {
      return false;
    }
    return true;
  }

  function normalizeSearchResultPriority(value) {
    return value === 'search' ? 'search' : 'autocomplete';
  }

  function normalizeSearchResultDisplayLimit(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 5 && parsed <= 10 ? parsed : 10;
  }

  const SEARCH_RESULT_SOURCE_TYPES = Object.freeze(['topSite', 'bookmark', 'history']);

  function normalizeSearchResultSourceType(value) {
    const raw = String(value || '').trim();
    if (raw === 'topSite' || raw === 'topSites' || raw === 'frequent' || raw === 'common') {
      return 'topSite';
    }
    if (raw === 'bookmark' || raw === 'bookmarks') {
      return 'bookmark';
    }
    if (raw === 'history') {
      return 'history';
    }
    return '';
  }

  function normalizeSearchResultSourceTypes(value) {
    const rawItems = Array.isArray(value)
      ? value
      : (typeof value === 'string' ? value.split(/[\s,]+/) : []);
    const selected = [];
    rawItems.forEach((item) => {
      const type = normalizeSearchResultSourceType(item);
      if (!type || selected.includes(type)) {
        return;
      }
      selected.push(type);
    });
    return selected.length > 0 ? selected : SEARCH_RESULT_SOURCE_TYPES.slice();
  }

  function normalizeTabRankScoreDebugMode(value) {
    return value === true;
  }

  function normalizeTabSwitcherEnabled(value) {
    return value !== false;
  }

  function normalizeSelectionQuickActionsEnabled(value) {
    return value === true;
  }

  function normalizeSelectionQuickActionsProvider(value) {
    const key = String(value || '').trim().toLowerCase();
    return SELECTION_QUICK_ACTIONS_PROVIDER_KEYS.includes(key) ? key : 'gpt';
  }

  function normalizeSelectionQuickActionsGroupEnabled(value) {
    return value === true;
  }

  function normalizeThemePreference(value) {
    if (value === 'dark') {
      return 'dark';
    }
    if (value === 'light') {
      return 'light';
    }
    return '';
  }

  function normalizeThemeMode(value) {
    if (value === 'dark' || value === 'light') {
      return value;
    }
    return 'system';
  }

  function createGlobalThemeModeStorageUpdate(mode) {
    return {
      [THEME_STORAGE_KEY]: normalizeThemeMode(mode)
    };
  }

  function createStorageReadBatch(area) {
    if (!area || typeof area.get !== 'function') {
      return null;
    }
    let acceptingReads = true;
    let flushScheduled = false;
    let includesAllKeys = false;
    let requests = [];
    const requestedKeys = new Set();
    let resolveReady = null;
    const ready = new Promise((resolve) => {
      resolveReady = resolve;
    });

    function collectRequestKeys(keys) {
      if (keys === null || typeof keys === 'undefined') {
        includesAllKeys = true;
        return;
      }
      if (typeof keys === 'string') {
        requestedKeys.add(keys);
        return;
      }
      if (Array.isArray(keys)) {
        keys.forEach((key) => requestedKeys.add(String(key)));
        return;
      }
      if (typeof keys === 'object') {
        Object.keys(keys).forEach((key) => requestedKeys.add(key));
      }
    }

    function selectRequestResult(source, keys) {
      const values = source && typeof source === 'object' ? source : {};
      if (keys === null || typeof keys === 'undefined') {
        return values;
      }
      if (typeof keys === 'object' && !Array.isArray(keys)) {
        const result = { ...keys };
        Object.keys(keys).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(values, key)) {
            result[key] = values[key];
          }
        });
        return result;
      }
      const list = Array.isArray(keys) ? keys : [keys];
      const result = {};
      list.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          result[key] = values[key];
        }
      });
      return result;
    }

    function flush() {
      if (!acceptingReads) {
        return;
      }
      acceptingReads = false;
      flushScheduled = false;
      const pending = requests;
      requests = [];
      const keys = includesAllKeys ? null : Array.from(requestedKeys);
      let settled = false;
      const finish = (rawResult) => {
        if (settled) {
          return;
        }
        settled = true;
        const result = rawResult && typeof rawResult === 'object' ? rawResult : {};
        const callbackErrors = [];
        pending.forEach((request) => {
          const selected = selectRequestResult(result, request.keys);
          try {
            if (request.callback) {
              request.callback(selected);
            } else if (request.resolve) {
              request.resolve(selected);
            }
          } catch (error) {
            callbackErrors.push(error);
          }
        });
        resolveReady(Object.freeze({
          keyCount: keys === null ? null : keys.length,
          requestCount: pending.length,
          underlyingReadCount: 1
        }));
        callbackErrors.forEach((error) => {
          Promise.resolve().then(() => {
            throw error;
          });
        });
      };
      try {
        const maybePromise = area.get(keys, finish);
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(finish).catch(() => finish({}));
        }
      } catch (error) {
        finish({});
      }
    }

    function get(keys, callback) {
      if (typeof keys === 'function' && typeof callback === 'undefined') {
        callback = keys;
        keys = null;
      }
      if (!acceptingReads) {
        return area.get(keys, callback);
      }
      let resolveRequest = null;
      const promise = typeof callback === 'function'
        ? undefined
        : new Promise((resolve) => {
            resolveRequest = resolve;
          });
      requests.push({
        callback: typeof callback === 'function' ? callback : null,
        keys,
        resolve: resolveRequest
      });
      collectRequestKeys(keys);
      if (!flushScheduled) {
        flushScheduled = true;
        Promise.resolve().then(flush);
      }
      return promise;
    }

    function invoke(method, args) {
      if (typeof area[method] !== 'function') {
        return undefined;
      }
      return area[method](...args);
    }

    return Object.freeze({
      area: Object.freeze({
        clear(...args) { return invoke('clear', args); },
        get,
        remove(...args) { return invoke('remove', args); },
        set(...args) { return invoke('set', args); }
      }),
      flush,
      ready
    });
  }

  function createProviderStorageRuntime(chromeApi) {
    const storage = chromeApi && chromeApi.storage ? chromeApi.storage : null;
    const syncArea = storage && storage.sync ? storage.sync : null;
    const localArea = storage && storage.local ? storage.local : syncArea;
    const activeAreaName = syncArea ? 'sync' : (localArea ? 'local' : '');
    const modeReady = Promise.resolve(activeAreaName);

    function getActiveArea() {
      return syncArea || localArea;
    }

    function invoke(method, args) {
      const values = Array.from(args || []);
      const callback = typeof values[values.length - 1] === 'function' ? values.pop() : null;
      return modeReady.then(() => new Promise((resolve, reject) => {
        const area = getActiveArea();
        if (!area || typeof area[method] !== 'function') {
          if (callback) callback(method === 'get' ? {} : undefined);
          resolve(method === 'get' ? {} : undefined);
          return;
        }
        let settled = false;
        const finish = (result) => {
          if (settled) return;
          settled = true;
          if (callback) callback(result);
          resolve(result);
        };
        try {
          const maybePromise = area[method](...values, finish);
          if (maybePromise && typeof maybePromise.then === 'function') {
            maybePromise.then(finish).catch(reject);
          }
        } catch (error) {
          reject(error);
        }
      }));
    }

    const area = Object.freeze({
      get(...args) { return invoke('get', args); },
      set(...args) { return invoke('set', args); },
      remove(...args) { return invoke('remove', args); },
      clear(...args) { return invoke('clear', args); }
    });

    return Object.freeze({
      area,
      name: activeAreaName,
      ready: modeReady,
      getActiveAreaName() { return activeAreaName; },
      isActiveAreaName(areaName) { return String(areaName || '') === activeAreaName; }
    });
  }

  function addStorageChangeListener(chromeApi, listener) {
    const onChanged = chromeApi && chromeApi.storage && chromeApi.storage.onChanged;
    if (!onChanged || typeof onChanged.addListener !== 'function' ||
        typeof listener !== 'function') {
      return false;
    }
    onChanged.addListener(listener);
    return true;
  }

  return Object.freeze({
    THEME_STORAGE_KEY,
    NEWTAB_THEME_MODE_STORAGE_KEY,
    NEWTAB_THEME_SCOPE_STORAGE_KEY,
    NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY,
    NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY,
    NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY,
    NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY,
    NEWTAB_SHORTCUT_WIDTH_MIN,
    NEWTAB_SHORTCUT_WIDTH_MAX,
    NEWTAB_SHORTCUT_WIDTH_DEFAULT,
    NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY,
    BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY,
    UPDATE_NOTICE_ENABLED_STORAGE_KEY,
    MOTION_EFFECTS_ENABLED_STORAGE_KEY,
    SIMPLE_MODE_ENABLED_STORAGE_KEY,
    NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY,
    MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY,
    FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY,
    SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY,
    OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY,
    OVERLAY_TAB_KEYWORD_STORAGE_KEY,
    OVERLAY_HISTORY_KEYWORD_STORAGE_KEY,
    OVERLAY_TAB_KEYWORD_DEFAULT,
    OVERLAY_HISTORY_KEYWORD_DEFAULT,
    OVERLAY_ENTER_ANIMATION_STORAGE_KEY,
    OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY,
    BOOKMARK_TOPBAR_LOCAL_STORAGE_KEYS,
    CHROME_SYNC_STORAGE_KEYS,
    SELECTION_QUICK_ACTIONS_PROVIDER_KEYS,
    NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY,
    NEWTAB_TOP_CONTENT_BRAND,
    NEWTAB_TOP_CONTENT_TIME,
    NEWTAB_TOP_CONTENT_OFF,
    NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY,
    NEWTAB_TIME_FONT_WEIGHT_MIN,
    NEWTAB_TIME_FONT_WEIGHT_MAX,
    NEWTAB_TIME_FONT_WEIGHT_DEFAULT,
    NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY,
    normalizeLocale,
    localeToHtmlLang,
    normalizeNewtabWidthMode,
    normalizeNewtabSearchWidth,
    normalizeNewtabTopContentMode,
    normalizeNewtabWordmarkVisible,
    normalizeNewtabTimeFontWeight,
    normalizeNewtabTimeSecondsVisible,
    normalizeNewtabShortcutsVisible,
    normalizeNewtabShortcutAddVisible,
    normalizeNewtabShortcutDockMagnificationEnabled,
    normalizeNewtabFeedbackButtonVisible,
    normalizeNewtabAppearanceButtonVisible,
    normalizeNewtabShortcutWidth,
    normalizeNewtabInputAutoFocusEnabled,
    normalizeBookmarkCount,
    normalizeBookmarkColumns,
    normalizeBookmarkFolderIconsVisible,
    normalizeUpdateNoticeEnabled,
    normalizeMotionEffectsEnabled,
    normalizeSimpleModeEnabled,
    normalizeNumberShortcutInstantEnabled,
    normalizeMacosCtrlSuggestionNavigationEnabled,
    shouldSkipEntryMotion,
    normalizeFaviconEnhancedFetchEnabled,
    normalizeOverlayOpenTabsDefaultVisible,
    normalizeOverlayTabKeyword,
    normalizeOverlayHistoryKeyword,
    normalizeOverlayPageThemeAdaptationEnabled,
    normalizeOverlaySizeMode,
    normalizeOverlayEnterAnimation,
    normalizeOverlayTabPriorityMode,
    normalizeSearchResultPriority,
    normalizeSearchResultDisplayLimit,
    normalizeSearchResultSourceTypes,
    normalizeTabRankScoreDebugMode,
    normalizeTabSwitcherEnabled,
    normalizeSelectionQuickActionsEnabled,
    normalizeSelectionQuickActionsProvider,
    normalizeSelectionQuickActionsGroupEnabled,
    normalizeThemePreference,
    normalizeThemeMode,
    createGlobalThemeModeStorageUpdate,
    createStorageReadBatch,
    createProviderStorageRuntime,
    addStorageChangeListener
  });
});
