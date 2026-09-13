(function() {
  const optionsRuntimeStartedAt = typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
  let optionsStartupStorageBatchPending = false;
  let optionsStartupRefreshCoalescing = true;
  let optionsStartupRefreshDeferred = false;
  let optionsCustomSelectRefreshCount = 0;
  let optionsReadyMarked = false;
  let optionsReadyFallbackTimer = 0;

  function markOptionsPerformance(name) {
    try {
      if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
        performance.mark(name);
      }
    } catch (e) {
      // Performance markers are diagnostics only.
    }
  }

  markOptionsPerformance('lumno-options-runtime-start');
  if (document.documentElement) {
    document.documentElement.setAttribute('data-lumno-options-runtime-started', 'true');
  }

  const NAVIGATION_DISPOSITION = globalThis.LumnoNavigationDisposition || {};
  const COMMUNITY_LINKS = globalThis.LumnoCommunityLinks || {};
  const SETTINGS = globalThis.LumnoSettings || {};
  const SHORTCUT_FAVICON = globalThis.LumnoShortcutFavicon || {};
  const LUMNO_FEEDBACK_SUPPORT_LINKS_FALLBACK = COMMUNITY_LINKS.FALLBACK_LINKS;
  const panel = document.getElementById('_x_extension_settings_panel_2024_unique_');
  const optionsRoot = document.getElementById('_x_extension_options_root_2024_unique_');
  const tabsRow = document.querySelector('._x_extension_settings_tabs_row_2024_unique_');
  const appearanceContent = document.querySelector('._x_extension_settings_content_2024_unique_[data-content="appearance"]');
  const themePicker = appearanceContent
    ? appearanceContent.querySelector('._x_extension_theme_picker_2024_unique_')
    : null;
  const themeButtons = themePicker ? Array.from(themePicker.querySelectorAll('._x_extension_theme_option_2024_unique_')) : [];
  const themeIndicator = themePicker ? themePicker.querySelector('._x_extension_theme_indicator_2024_unique_') : null;
  const tabButtons = Array.from(document.querySelectorAll('._x_extension_settings_tab_button_2024_unique_'));
  const tabContents = Array.from(document.querySelectorAll('._x_extension_settings_content_2024_unique_'));
  const tabsContainer = document.getElementById('_x_extension_settings_tabs_2024_unique_');
  const tabsIndicator = tabsContainer ? tabsContainer.querySelector('._x_extension_tabs_indicator_2024_unique_') : null;
  const settingsVersion = document.getElementById('_x_extension_settings_version_2024_unique_');
  const languageSelect = document.getElementById('_x_extension_language_select_2024_unique_');
  const recentModeSelect = document.getElementById('_x_extension_recent_mode_select_2024_unique_');
  const recentModeTabButtons = Array.from(document.querySelectorAll('button[data-recent-mode]'));
  const recentModeTabsWrap = document.getElementById('_x_extension_recent_mode_tabs_wrap_2024_unique_');
  const recentModeTabsIndicator = recentModeTabsWrap
    ? recentModeTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const recentCountControlHost = document.getElementById('_x_extension_recent_count_control_2026_unique_');
  const newtabWidthSelect = document.getElementById('_x_extension_newtab_width_select_2026_unique_');
  const newtabWidthTabsWrap = document.getElementById('_x_extension_newtab_width_tabs_wrap_2026_unique_');
  const newtabWidthTabButtons = Array.from(document.querySelectorAll('button[data-newtab-width]'));
  const newtabWidthTabsIndicator = newtabWidthTabsWrap
    ? newtabWidthTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const overlaySizeTabButtons = Array.from(document.querySelectorAll('button[data-overlay-size]'));
  const overlaySizeTabsWrap = document.getElementById('_x_extension_overlay_size_tabs_wrap_2026_unique_');
  const overlaySizeTabsIndicator = overlaySizeTabsWrap
    ? overlaySizeTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const overlayEnterAnimationTabButtons = Array.from(document.querySelectorAll('button[data-overlay-enter-animation]'));
  const overlayEnterAnimationTabsWrap = document.getElementById('_x_extension_overlay_enter_animation_tabs_wrap_2026_unique_');
  const overlayEnterAnimationTabsIndicator = overlayEnterAnimationTabsWrap
    ? overlayEnterAnimationTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const bookmarkRowsControlHost = document.getElementById('_x_extension_bookmark_rows_control_2026_unique_');
  const bookmarkColumnsSettingRow = document.getElementById('_x_extension_bookmark_columns_setting_row_2026_unique_');
  const bookmarkColumnsControlHost = document.getElementById('_x_extension_bookmark_columns_control_2026_unique_');
  const searchResultDisplayLimitControlHost = document.getElementById('_x_extension_search_result_display_limit_control_2026_unique_');
  const bookmarkFolderIconsVisibleToggle = document.getElementById('_x_extension_bookmark_folder_icons_visible_toggle_2026_unique_');
  const autoPipToggle = document.getElementById('_x_extension_auto_pip_toggle_2024_unique_');
  const tabSwitcherToggle = document.getElementById('_x_extension_tab_switcher_toggle_2026_unique_');
  const documentPipToggle = document.getElementById('_x_extension_document_pip_toggle_2026_unique_');
  const pinnedTabRecoveryToggle = document.getElementById('_x_extension_pinned_tab_recovery_toggle_2026_unique_');
  const selectionQuickActionsToggle = document.getElementById('_x_extension_selection_quick_actions_toggle_2026_unique_');
  const selectionQuickActionsProviderRow = document.getElementById('_x_extension_selection_quick_actions_provider_row_2026_unique_');
  const selectionQuickActionsProviderSelect = document.getElementById('_x_extension_selection_quick_actions_provider_select_2026_unique_');
  const selectionQuickActionsGroupRow = document.getElementById('_x_extension_selection_quick_actions_group_row_2026_unique_');
  const selectionQuickActionsGroupToggle = document.getElementById('_x_extension_selection_quick_actions_group_toggle_2026_unique_');
  const overlayTabQuickSwitchToggle = document.getElementById('_x_extension_overlay_tab_quick_switch_2024_unique_');
  const newtabTopContentTabsWrap = document.getElementById('_x_extension_newtab_top_content_tabs_wrap_2026_unique_');
  const newtabTopContentTabsIndicator = newtabTopContentTabsWrap
    ? newtabTopContentTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const newtabTimeFontWeightRow = document.getElementById('_x_extension_newtab_time_font_weight_row_2026_unique_');
  const newtabTimeFontWeightControlHost = document.getElementById('_x_extension_newtab_time_font_weight_control_2026_unique_');
  const newtabTimeSecondsRow = document.getElementById('_x_extension_newtab_time_seconds_row_2026_unique_');
  const newtabTimeSecondsToggle = document.getElementById('_x_extension_newtab_time_seconds_toggle_2026_unique_');
  const newtabInputAutoFocusToggle = document.getElementById('_x_extension_newtab_input_auto_focus_toggle_2026_unique_');
  const newtabShortcutsToggle = document.getElementById('_x_extension_newtab_shortcuts_toggle_2026_unique_');
  const newtabShortcutAddRow = document.getElementById('_x_extension_newtab_shortcut_add_row_2026_unique_');
  const newtabShortcutAddToggle = document.getElementById('_x_extension_newtab_shortcut_add_toggle_2026_unique_');
  const newtabShortcutDockMagnificationRow = document.getElementById('_x_extension_newtab_shortcut_dock_magnification_row_2026_unique_');
  const newtabShortcutDockMagnificationToggle = document.getElementById('_x_extension_newtab_shortcut_dock_magnification_toggle_2026_unique_');
  const newtabShortcutWidthRow = document.getElementById('_x_extension_newtab_shortcut_width_setting_row_2026_unique_');
  const newtabShortcutWidthControlHost = document.getElementById('_x_extension_newtab_shortcut_width_control_2026_unique_');
  const newtabFeedbackButtonVisibleToggle = document.getElementById('_x_extension_newtab_feedback_button_visible_toggle_2026_unique_');
  const newtabAppearanceButtonVisibleToggle = document.getElementById('_x_extension_newtab_appearance_button_visible_toggle_2026_unique_');
  const restrictedActionSelect = document.getElementById('_x_extension_restricted_action_select_2024_unique_');
  const searchResultPrioritySelect = document.getElementById('_x_extension_search_result_priority_select_2026_unique_');
  const searchResultSourceTypeGroupHost = document.getElementById('_x_extension_search_result_source_types_2026_unique_');
  const searchResultSourceTypeInputs = Array.from(document.querySelectorAll('input[data-search-result-source-type]'));
  const overlayOpenTabsDefaultVisibleToggle = document.getElementById('_x_extension_overlay_open_tabs_default_visible_toggle_2026_unique_');
  const overlayPageThemeAdaptationRow = document.getElementById('_x_extension_overlay_page_theme_adaptation_row_2026_unique_');
  const overlayPageThemeAdaptationToggle = document.getElementById('_x_extension_overlay_page_theme_adaptation_toggle_2026_unique_');
  const overlayPageThemeAdaptationInfoHost = document.getElementById('_x_extension_overlay_page_theme_adaptation_info_2026_unique_');
  const restrictedActionInfoHost = document.getElementById('_x_extension_restricted_action_info_2026_unique_');
  const bookmarkRowsInfoHost = document.getElementById('_x_extension_bookmark_rows_info_2026_unique_');
  const bookmarkColumnsInfoHost = document.getElementById('_x_extension_bookmark_columns_info_2026_unique_');
  const faviconEnhancedFetchToggle = document.getElementById('_x_extension_favicon_enhanced_fetch_toggle_2026_unique_');
  const faviconBlacklistEditor = document.getElementById('_x_extension_favicon_blacklist_editor_2026_unique_');
  const faviconBlacklistList = document.getElementById('_x_extension_favicon_blacklist_list_2026_unique_');
  const faviconBlacklistForm = document.getElementById('_x_extension_favicon_blacklist_form_2026_unique_');
  const faviconBlacklistClearButton = document.getElementById('_x_extension_favicon_blacklist_clear_2026_unique_');
  const syncStatus = document.getElementById('_x_extension_sync_status_2024_unique_');
  const syncStatusText = document.getElementById('_x_extension_sync_status_text_2024_unique_');
  const syncNowButton = document.getElementById('_x_extension_sync_now_2024_unique_');
  const syncExportButton = document.getElementById('_x_extension_sync_export_2024_unique_');
  const syncImportButton = document.getElementById('_x_extension_sync_import_2024_unique_');
  const syncImportInput = document.getElementById('_x_extension_sync_import_input_2024_unique_');
  const updateNoticeToggle = document.getElementById('_x_extension_update_notice_toggle_2026_unique_');
  const motionEffectsToggle = document.getElementById('_x_extension_motion_effects_toggle_2026_unique_');
  const simpleModeToggle = document.getElementById('_x_extension_simple_mode_toggle_2026_unique_');
  const numberShortcutInstantToggle = document.getElementById('_x_extension_number_shortcut_instant_toggle_2026_unique_');
  const macosCtrlSuggestionNavigationToggle = document.getElementById('_x_extension_macos_ctrl_suggestion_navigation_toggle_2026_unique_');
  const fallbackShortcutInput = document.getElementById('_x_extension_shortcuts_input_2024_unique_');
  const fallbackShortcutTokens = document.getElementById('_x_extension_shortcuts_tokens_2024_unique_');
  const fallbackShortcutWrap = document.querySelector('._x_extension_shortcuts_hotkey_wrap_2024_unique_');
  const restrictedActionSelectWrap = document.getElementById('_x_extension_restricted_action_tabs_wrap_2024_unique_');
  const restrictedActionTabButtons = Array.from(document.querySelectorAll('button[data-restricted-action]'));
  const restrictedActionTabsIndicator = restrictedActionSelectWrap
    ? restrictedActionSelectWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const searchResultPriorityTabsWrap = document.getElementById('_x_extension_search_result_priority_tabs_wrap_2026_unique_');
  const searchResultPriorityTabButtons = Array.from(document.querySelectorAll('button[data-search-result-priority]'));
  const searchResultPriorityTabsIndicator = searchResultPriorityTabsWrap
    ? searchResultPriorityTabsWrap.querySelector('._x_extension_theme_indicator_2024_unique_')
    : null;
  const clearShortcutButton = document.getElementById('_x_extension_clear_shortcut_2024_unique_');
  const resetShortcutButton = document.getElementById('_x_extension_reset_shortcut_2024_unique_');
  const shortcutsStatus = document.getElementById('_x_extension_shortcuts_status_2024_unique_');
  const shortcutReferenceList = document.getElementById('_x_extension_shortcut_reference_list_2026_unique_');
  const openOnboardingPageButton = document.getElementById('_x_extension_open_onboarding_page_2026_unique_');
  const feedbackSupportHost = document.getElementById('_x_extension_feedback_support_2026_unique_');
  const openShortcutsPageButton = document.getElementById('_x_extension_open_shortcuts_page_2026_unique_');
  const siteSearchEngineBuiltinList = document.getElementById('_x_extension_search_engine_builtin_list_2026_unique_');
  const siteSearchCustomList = document.getElementById('_x_extension_site_search_custom_list_2024_unique_');
  const siteSearchBuiltinList = document.getElementById('_x_extension_site_search_builtin_list_2024_unique_');
  const siteSearchAiGroup = document.getElementById('_x_extension_site_search_ai_group_2026_unique_');
  const siteSearchAiBuiltinList = document.getElementById('_x_extension_site_search_ai_builtin_list_2026_unique_');
  const siteSearchKeyInput = document.getElementById('_x_extension_site_search_key_2024_unique_');
  const siteSearchNameInput = document.getElementById('_x_extension_site_search_name_2024_unique_');
  const siteSearchTemplateInput = document.getElementById('_x_extension_site_search_template_2024_unique_');
  const siteSearchInsertQueryButton = document.getElementById('_x_extension_site_search_insert_query_2026_unique_');
  const siteSearchAliasInput = document.getElementById('_x_extension_site_search_alias_2024_unique_');
  const siteSearchCategoryButtons = Array.from(document.querySelectorAll(
    'button[data-site-search-category]'
  ));
  const siteSearchForm = document.querySelector('._x_extension_settings_content_2024_unique_[data-content="shortcuts"] ._x_extension_shortcut_form_2024_unique_');
  const siteSearchFormTrigger = document.getElementById('_x_extension_site_search_expand_2024_unique_');
  const siteSearchAddButton = document.getElementById('_x_extension_site_search_add_2024_unique_');
  const siteSearchCancelButton = document.getElementById('_x_extension_site_search_cancel_2024_unique_');
  const siteSearchError = document.getElementById('_x_extension_site_search_error_2024_unique_');
  const builtinResetButton = document.getElementById('_x_extension_builtin_reset_2024_unique_');
  const customClearButton = document.getElementById('_x_extension_custom_clear_2024_unique_');
  const blacklistList = document.getElementById('_x_extension_blacklist_list_2026_unique_');
  const blacklistForm = document.getElementById('_x_extension_blacklist_form_2026_unique_');
  const blacklistClearButton = document.getElementById('_x_extension_blacklist_clear_2026_unique_');
  const toastElement = document.getElementById('_x_extension_toast_2024_unique_');
  const confirmMask = document.getElementById('_x_extension_confirm_mask_2024_unique_');
  const confirmMessage = document.getElementById('_x_extension_confirm_message_2024_unique_');
  const confirmOk = document.getElementById('_x_extension_confirm_ok_2024_unique_');
  const confirmCancel = document.getElementById('_x_extension_confirm_cancel_2024_unique_');
  const confirmDialog = document.querySelector('._x_extension_confirm_dialog_2024_unique_');
  const optionsBlacklistListApi = globalThis.LumnoOptionsBlacklistList || {};
  const optionsFeedbackSupportApi = globalThis.LumnoOptionsFeedbackSupport || {};
  const optionsInfoButtonApi = globalThis.LumnoOptionsInfoButton || {};
  const optionsToastApi = globalThis.LumnoOptionsToast || {};
  const optionsPopconfirmApi = globalThis.LumnoOptionsPopconfirm || {};
  const optionsSegmentedControlApi = globalThis.LumnoOptionsSegmentedControl || {};
  const optionsSelectControlApi = globalThis.LumnoOptionsSelectControl || {};
  const optionsSettingsControlsApi = globalThis.LumnoOptionsSettingsControls || {};
  const optionsSettingsFormsApi = globalThis.LumnoOptionsSettingsForms || {};
  const optionsSettingsNavigationApi = globalThis.LumnoOptionsSettingsNavigation || {};
  const optionsShortcutReferenceApi = globalThis.LumnoOptionsShortcutReference || {};
  const optionsShortcutHotkeyApi = globalThis.LumnoOptionsShortcutHotkey || {};
  const optionsSiteSearchListApi = globalThis.LumnoOptionsSiteSearchList || {};
  const optionsThemePickerApi = globalThis.LumnoOptionsThemePicker || {};
  const shortcutDisplay = globalThis.LumnoShortcutDisplay || {};
  const toastController = typeof optionsToastApi.createToastController === 'function'
    ? optionsToastApi.createToastController(toastElement, {
        windowObj: window,
        duration: 2200,
        errorBackground: 'rgba(153, 27, 27, 0.92)'
      })
    : null;
  const feedbackSupportController =
    typeof optionsFeedbackSupportApi.createFeedbackSupportController === 'function'
      ? optionsFeedbackSupportApi.createFeedbackSupportController(feedbackSupportHost)
      : null;
  function createOptionsInfoButtonController(host) {
    return typeof optionsInfoButtonApi.createInfoButtonController === 'function'
      ? optionsInfoButtonApi.createInfoButtonController(host)
      : null;
  }
  const restrictedActionInfoController = createOptionsInfoButtonController(restrictedActionInfoHost);
  const bookmarkRowsInfoController = createOptionsInfoButtonController(bookmarkRowsInfoHost);
  const bookmarkColumnsInfoController = createOptionsInfoButtonController(bookmarkColumnsInfoHost);
  const overlayPageThemeAdaptationInfoController = createOptionsInfoButtonController(
    overlayPageThemeAdaptationInfoHost
  );
  const shortcutReferenceController =
    typeof optionsShortcutReferenceApi.createShortcutReferenceController === 'function'
      ? optionsShortcutReferenceApi.createShortcutReferenceController(shortcutReferenceList)
      : null;
  const shortcutHotkeyController =
    typeof optionsShortcutHotkeyApi.createShortcutHotkeyController === 'function'
      ? optionsShortcutHotkeyApi.createShortcutHotkeyController(
          fallbackShortcutTokens,
          { onContentReady: updateFallbackShortcutWrapWidthForContent }
        )
      : null;
  const themePickerController =
    typeof optionsThemePickerApi.createThemePickerController === 'function'
      ? optionsThemePickerApi.createThemePickerController(themePicker, {
          onSelect(mode, button) {
            playThemeOptionClickEffect(button);
            setThemeMode(mode);
          }
        })
      : null;
  function createOptionsSegmentedControlController(host, kind, onSelect) {
    return typeof optionsSegmentedControlApi.createSegmentedControlController === 'function'
      ? optionsSegmentedControlApi.createSegmentedControlController(host, {
          kind,
          onSelect
        })
      : null;
  }
  const recentModeTabsController = createOptionsSegmentedControlController(
    recentModeTabsWrap,
    'recent-mode',
    handleRecentModeSelection
  );
  const newtabWidthTabsController = createOptionsSegmentedControlController(
    newtabWidthTabsWrap,
    'newtab-width',
    handleNewtabWidthSelection
  );
  const overlaySizeTabsController = createOptionsSegmentedControlController(
    overlaySizeTabsWrap,
    'overlay-size',
    handleOverlaySizeSelection
  );
  const overlayEnterAnimationTabsController = createOptionsSegmentedControlController(
    overlayEnterAnimationTabsWrap,
    'overlay-enter-animation',
    handleOverlayEnterAnimationSelection
  );
  const restrictedActionTabsController = createOptionsSegmentedControlController(
    restrictedActionSelectWrap,
    'restricted-action',
    handleRestrictedActionSelection
  );
  const searchResultPriorityTabsController = createOptionsSegmentedControlController(
    searchResultPriorityTabsWrap,
    'search-result-priority',
    handleSearchResultPrioritySelection
  );
  const newtabTopContentTabsController = createOptionsSegmentedControlController(
    newtabTopContentTabsWrap,
    'newtab-top-content',
    handleNewtabTopContentSelection
  );
  const optionsToggleControlRecords = new Map();
  function registerOptionsToggleControl(input, kind) {
    if (!input ||
        typeof optionsSettingsControlsApi.createToggleControlController !== 'function') {
      return null;
    }
    const host = input.closest('._x_extension_switch_2024_unique_');
    if (!host) {
      return null;
    }
    const model = {
      ariaLabel: input.getAttribute('aria-label') || undefined,
      ariaLabelKey: input.getAttribute('data-i18n-aria-label') || undefined,
      checked: Boolean(input.checked),
      disabled: Boolean(input.disabled),
      id: input.id
    };
    const controller = optionsSettingsControlsApi.createToggleControlController(host, {
      kind,
      onChange(next) {
        input.checked = Boolean(next);
        input.dispatchEvent(new Event('change'));
      }
    });
    const record = { controller, model };
    optionsToggleControlRecords.set(input, record);
    controller.render(model);
    return controller;
  }
  function setOptionsToggleState(input, checked, disabled) {
    if (!input) {
      return;
    }
    input.checked = Boolean(checked);
    if (typeof disabled === 'boolean') {
      input.disabled = disabled;
    }
    const record = optionsToggleControlRecords.get(input);
    if (!record) {
      return;
    }
    record.model = Object.assign({}, record.model, {
      checked: Boolean(checked),
      disabled: Boolean(input.disabled)
    });
    record.controller.render(record.model);
  }

  function syncSelectionQuickActionsProviderAvailability() {
    const disabled = Boolean(selectionQuickActionsToggle && !selectionQuickActionsToggle.checked);
    if (selectionQuickActionsProviderSelect) {
      selectionQuickActionsProviderSelect.disabled = disabled;
      renderOptionsSelectControl(selectionQuickActionsProviderSelect);
    }
    if (selectionQuickActionsProviderRow) {
      selectionQuickActionsProviderRow.setAttribute('data-disabled', disabled ? 'true' : 'false');
      selectionQuickActionsProviderRow.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
    if (selectionQuickActionsGroupToggle) {
      setOptionsToggleState(
        selectionQuickActionsGroupToggle,
        selectionQuickActionsGroupToggle.checked,
        disabled
      );
    }
    if (selectionQuickActionsGroupRow) {
      selectionQuickActionsGroupRow.setAttribute('data-disabled', disabled ? 'true' : 'false');
      selectionQuickActionsGroupRow.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
  }
  [
    [updateNoticeToggle, 'update-notice'],
    [motionEffectsToggle, 'motion-effects'],
    [simpleModeToggle, 'simple-mode'],
    [autoPipToggle, 'auto-pip'],
    [overlayOpenTabsDefaultVisibleToggle, 'overlay-open-tabs-default-visible'],
    [bookmarkFolderIconsVisibleToggle, 'bookmark-folder-icons-visible'],
    [overlayTabQuickSwitchToggle, 'overlay-tab-quick-switch'],
    [newtabTimeSecondsToggle, 'newtab-time-seconds'],
    [newtabInputAutoFocusToggle, 'newtab-input-auto-focus'],
    [newtabShortcutsToggle, 'newtab-shortcuts'],
    [newtabShortcutAddToggle, 'newtab-shortcut-add'],
    [newtabShortcutDockMagnificationToggle, 'newtab-shortcut-dock-magnification'],
    [newtabFeedbackButtonVisibleToggle, 'newtab-feedback-button-visible'],
    [newtabAppearanceButtonVisibleToggle, 'newtab-appearance-button-visible'],
    [faviconEnhancedFetchToggle, 'favicon-enhanced-fetch'],
    [tabSwitcherToggle, 'tab-switcher'],
    [documentPipToggle, 'document-pip'],
    [pinnedTabRecoveryToggle, 'pinned-tab-recovery'],
    [selectionQuickActionsToggle, 'selection-quick-actions'],
    [selectionQuickActionsGroupToggle, 'selection-quick-actions-group']
  ].forEach(([input, kind]) => registerOptionsToggleControl(input, kind));

  const searchResultSourceTypeItems = searchResultSourceTypeInputs.map((input) => {
    const label = input.closest('label');
    const text = label ? label.querySelector('span[data-i18n]') : null;
    return {
      checked: Boolean(input.checked),
      id: input.id,
      labelFallback: text ? text.textContent : '',
      labelKey: text ? text.getAttribute('data-i18n') : '',
      value: input.getAttribute('data-search-result-source-type') || ''
    };
  }).filter((item) => item.value);
  const searchResultSourceTypeController =
    typeof optionsSettingsControlsApi.createRequiredCheckboxGroupController === 'function'
      ? optionsSettingsControlsApi.createRequiredCheckboxGroupController(
          searchResultSourceTypeGroupHost,
          {
            kind: 'search-result-sources',
            onChange(values) {
              const selected = new Set(values);
              let changedInput = null;
              searchResultSourceTypeInputs.forEach((input) => {
                const next = selected.has(input.getAttribute('data-search-result-source-type'));
                if (input.checked !== next && !changedInput) {
                  changedInput = input;
                }
                input.checked = next;
              });
              if (changedInput) {
                changedInput.dispatchEvent(new Event('change'));
              }
            }
          }
        )
      : null;
  function renderSearchResultSourceTypeControl(value) {
    if (!searchResultSourceTypeController) {
      return;
    }
    const selected = new Set(normalizeSearchResultSourceTypes(value));
    searchResultSourceTypeController.render({
      items: searchResultSourceTypeItems.map((item) => Object.assign({}, item, {
        checked: selected.has(item.value),
        label: getMessage(item.labelKey, item.labelFallback)
      }))
    });
  }
  const settingsNavigationController =
    typeof optionsSettingsNavigationApi.createSettingsNavigationController === 'function'
      ? optionsSettingsNavigationApi.createSettingsNavigationController(tabsContainer, {
          onSelect: handleSettingsTabSelection
        })
      : null;
  const searchBlacklistListController =
    typeof optionsBlacklistListApi.createBlacklistListController === 'function'
      ? optionsBlacklistListApi.createBlacklistListController(blacklistList, {
          kind: 'search',
          onRemove: handleSearchBlacklistRemove,
          onSave: handleSearchBlacklistSave
        })
      : null;
  const faviconBlacklistListController =
    typeof optionsBlacklistListApi.createBlacklistListController === 'function'
      ? optionsBlacklistListApi.createBlacklistListController(faviconBlacklistList, {
          kind: 'favicon',
          onRemove: handleFaviconBlacklistRemove
        })
      : null;
  function createSiteSearchListController(host, kind) {
    return typeof optionsSiteSearchListApi.createSiteSearchListController === 'function'
      ? optionsSiteSearchListApi.createSiteSearchListController(host, {
          kind,
          onLocateDuplicate: locateBuiltinSiteSearchProvider,
          onRemove: removeSiteSearchItem,
          onSave: handleSiteSearchProviderSave
        })
      : null;
  }
  const siteSearchCustomListController = createSiteSearchListController(
    siteSearchCustomList,
    'custom'
  );
  const siteSearchEngineBuiltinListController = createSiteSearchListController(
    siteSearchEngineBuiltinList,
    'builtin-engine'
  );
  const siteSearchBuiltinListController = createSiteSearchListController(
    siteSearchBuiltinList,
    'builtin-search'
  );
  const siteSearchAiBuiltinListController = createSiteSearchListController(
    siteSearchAiBuiltinList,
    'builtin-ai'
  );
  const siteSearchFormController =
    typeof optionsSettingsFormsApi.createSiteSearchFormController === 'function'
      ? optionsSettingsFormsApi.createSiteSearchFormController(siteSearchForm, {
          onSave: handleReactSiteSearchFormSave
        })
      : null;
  const searchBlacklistFormController =
    typeof optionsSettingsFormsApi.createBlacklistFormController === 'function'
      ? optionsSettingsFormsApi.createBlacklistFormController(blacklistForm, {
          kind: 'search',
          onSave: handleReactSearchBlacklistFormSave
        })
      : null;
  const faviconBlacklistFormController =
    typeof optionsSettingsFormsApi.createBlacklistFormController === 'function'
      ? optionsSettingsFormsApi.createBlacklistFormController(faviconBlacklistForm, {
          kind: 'favicon',
          onSave: handleReactFaviconBlacklistFormSave
        })
      : null;

  // 使用系统字体，避免外链字体依赖。
  if (!panel || themeButtons.length === 0 || tabButtons.length === 0) {
    return;
  }

  const SEARCH_UTILS = globalThis.LumnoSearchUtils || {};
  const providerStorageRuntime = typeof SETTINGS.createProviderStorageRuntime === 'function'
    ? SETTINGS.createProviderStorageRuntime(chrome)
    : null;
  const rawStorageArea = providerStorageRuntime
    ? providerStorageRuntime.area
    : ((chrome && chrome.storage && chrome.storage.sync)
        ? chrome.storage.sync
        : (chrome && chrome.storage ? chrome.storage.local : null));
  const storageAreaName = providerStorageRuntime ? providerStorageRuntime.name : (rawStorageArea
    ? (rawStorageArea === (chrome && chrome.storage ? chrome.storage.sync : null) ? 'sync' : 'local')
    : null);
  const startupStorageReadBatch = rawStorageArea && typeof SETTINGS.createStorageReadBatch === 'function'
    ? SETTINGS.createStorageReadBatch(rawStorageArea)
    : null;
  const storageArea = startupStorageReadBatch ? startupStorageReadBatch.area : rawStorageArea;
  optionsStartupStorageBatchPending = Boolean(startupStorageReadBatch);

  function finishOptionsStartupStorageBatch(metrics) {
    optionsStartupStorageBatchPending = false;
    const root = document.documentElement;
    const values = metrics && typeof metrics === 'object' ? metrics : {};
    if (root) {
      root.setAttribute(
        'data-lumno-options-bootstrap-storage-reads',
        String(Number.isFinite(values.underlyingReadCount) ? values.underlyingReadCount : 0)
      );
      root.setAttribute(
        'data-lumno-options-bootstrap-storage-requests',
        String(Number.isFinite(values.requestCount) ? values.requestCount : 0)
      );
      root.setAttribute(
        'data-lumno-options-bootstrap-storage-keys',
        values.keyCount === null ? 'all' : String(Number.isFinite(values.keyCount) ? values.keyCount : 0)
      );
    }
    if (optionsStartupRefreshDeferred) {
      optionsStartupRefreshDeferred = false;
      refreshCustomSelects({ force: true });
    }
    const scheduleFrame = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (callback) => setTimeout(callback, 0);
    const markOptionsReady = () => {
      if (optionsReadyMarked) {
        return;
      }
      optionsReadyMarked = true;
      optionsStartupRefreshCoalescing = false;
      if (optionsReadyFallbackTimer) {
        clearTimeout(optionsReadyFallbackTimer);
        optionsReadyFallbackTimer = 0;
      }
      if (optionsStartupRefreshDeferred) {
        optionsStartupRefreshDeferred = false;
        refreshCustomSelects({ force: true });
      }
      const readyAt = typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();
      if (root) {
        root.setAttribute('data-lumno-options-ready', 'true');
        root.setAttribute(
          'data-lumno-options-ready-ms',
          Math.max(0, readyAt - optionsRuntimeStartedAt).toFixed(2)
        );
        root.setAttribute(
          'data-lumno-options-ready-navigation-ms',
          Math.max(0, readyAt).toFixed(2)
        );
      }
      markOptionsPerformance('lumno-options-ready');
      try {
        if (typeof performance !== 'undefined' && typeof performance.measure === 'function') {
          performance.measure(
            'lumno-options-startup',
            'lumno-options-runtime-start',
            'lumno-options-ready'
          );
        }
      } catch (e) {
        // Performance measures are diagnostics only.
      }
    };
    optionsReadyFallbackTimer = setTimeout(markOptionsReady, 250);
    scheduleFrame(() => {
      scheduleFrame(markOptionsReady);
    });
  }

  if (startupStorageReadBatch) {
    startupStorageReadBatch.ready.then(finishOptionsStartupStorageBatch);
  } else {
    Promise.resolve().then(() => finishOptionsStartupStorageBatch({
      keyCount: 0,
      requestCount: 0,
      underlyingReadCount: 0
    }));
  }

  function getActivePrimaryAreaName() {
    return providerStorageRuntime
      ? providerStorageRuntime.getActiveAreaName()
      : storageAreaName;
  }
  function isPrimaryStorageAreaName(areaName) {
    return providerStorageRuntime
      ? providerStorageRuntime.isActiveAreaName(areaName)
      : Boolean(storageAreaName) && areaName === storageAreaName;
  }
  function addStorageChangeListener(listener) {
    return SETTINGS.addStorageChangeListener(chrome, listener);
  }

  function getFocusedSettingsPanelAnchor() {
    const activeElement = document.activeElement;
    if (!activeElement || activeElement === document.body || !panel.contains(activeElement) ||
        typeof activeElement.getBoundingClientRect !== 'function') {
      return null;
    }
    const rect = activeElement.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? activeElement : null;
  }

  function setOptionsPanelFocusAnchorReserve(anchor, reserve) {
    const nextReserve = Number.isFinite(reserve) ? Math.max(0, Math.ceil(reserve)) : 0;
    optionsPanelFocusAnchor = nextReserve > 0 ? anchor : null;
    optionsPanelFocusAnchorReserve = nextReserve;
    if (nextReserve > 0) {
      optionsRoot.style.setProperty('--settings-focus-anchor-reserve', `${nextReserve}px`);
      return;
    }
    optionsRoot.style.removeProperty('--settings-focus-anchor-reserve');
  }

  function clearOptionsPanelFocusAnchorReserve() {
    setOptionsPanelFocusAnchorReserve(null, 0);
  }

  function releaseOptionsPanelFocusAnchorReserve(event) {
    const anchor = optionsPanelFocusAnchor;
    const target = event && event.target;
    if (!anchor || !target || target === anchor ||
        (typeof anchor.contains === 'function' && anchor.contains(target))) {
      return;
    }
    clearOptionsPanelFocusAnchorReserve();
  }

  function primeOptionsPanelFocusAnchorReserve(anchor, beforeHeight) {
    if (!anchor) {
      return;
    }
    setOptionsPanelFocusAnchorReserve(
      anchor,
      Math.max(optionsPanelFocusAnchorReserve, Number.isFinite(beforeHeight) ? beforeHeight : 0)
    );
  }

  function stabilizeOptionsPanelFocusAnchor(anchor, focusTop, minimumHeightReduction) {
    if (!anchor || !Number.isFinite(focusTop) || !anchor.isConnected) {
      clearOptionsPanelFocusAnchorReserve();
      return;
    }
    const heightReduction = Number.isFinite(minimumHeightReduction)
      ? Math.max(0, minimumHeightReduction)
      : 0;
    for (let pass = 0; pass < 2; pass += 1) {
      const nextFocusTop = anchor.getBoundingClientRect().top;
      const focusOffset = nextFocusTop - focusTop;
      if (Number.isFinite(focusOffset) && Math.abs(focusOffset) > 0.5) {
        window.scrollBy(0, focusOffset);
      }
      const baseDocumentHeight = Math.max(
        0,
        document.documentElement.scrollHeight - optionsPanelFocusAnchorReserve - heightReduction
      );
      const requiredReserve = Math.max(
        0,
        window.scrollY + window.innerHeight - baseDocumentHeight + 2
      );
      setOptionsPanelFocusAnchorReserve(anchor, requiredReserve);
    }
  }

  function cancelOptionsPanelHeightAnimation() {
    const animation = optionsPanelHeightAnimation;
    optionsPanelHeightAnimation = null;
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }
    panel.style.removeProperty('height');
    panel.removeAttribute('data-height-animating');
    clearOptionsPanelFocusAnchorReserve();
  }

  function shouldAnimateOptionsPanelHeight() {
    if (!document.documentElement ||
        document.documentElement.getAttribute('data-lumno-options-ready') !== 'true' ||
        typeof panel.animate !== 'function') {
      return false;
    }
    if (typeof panel.getClientRects === 'function' && panel.getClientRects().length === 0) {
      return false;
    }
    return !(typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function animateOptionsPanelHeight(mutateLayout) {
    if (typeof mutateLayout !== 'function') {
      return false;
    }
    const animationInProgress = Boolean(optionsPanelHeightAnimation);
    const previousFocusAnchor = optionsPanelFocusAnchor;
    const previousFocusAnchorReserve = optionsPanelFocusAnchorReserve;
    const beforeHeight = panel.getBoundingClientRect().height;
    const focusAnchor = getFocusedSettingsPanelAnchor();
    const focusTop = focusAnchor ? focusAnchor.getBoundingClientRect().top : null;
    primeOptionsPanelFocusAnchorReserve(focusAnchor, beforeHeight);
    panel.setAttribute('data-height-animating', 'true');

    const layoutChanged = mutateLayout() !== false;
    if (!layoutChanged) {
      setOptionsPanelFocusAnchorReserve(previousFocusAnchor, previousFocusAnchorReserve);
      if (!animationInProgress) {
        panel.removeAttribute('data-height-animating');
      }
      return false;
    }

    if (optionsPanelHeightAnimation) {
      const previousAnimation = optionsPanelHeightAnimation;
      optionsPanelHeightAnimation = null;
      previousAnimation.onfinish = null;
      previousAnimation.cancel();
    }
    panel.style.removeProperty('height');
    const afterHeight = panel.getBoundingClientRect().height;
    const canAnimateHeight = shouldAnimateOptionsPanelHeight() &&
      Number.isFinite(beforeHeight) && Number.isFinite(afterHeight) &&
      Math.abs(afterHeight - beforeHeight) >= 0.5;

    stabilizeOptionsPanelFocusAnchor(
      focusAnchor,
      focusTop,
      canAnimateHeight ? Math.max(0, afterHeight - beforeHeight) : 0
    );

    if (!canAnimateHeight) {
      panel.removeAttribute('data-height-animating');
      return true;
    }

    panel.style.height = `${afterHeight}px`;
    const animation = panel.animate(
      [
        { height: `${beforeHeight}px` },
        { height: `${afterHeight}px` }
      ],
      {
        duration: OPTIONS_PANEL_HEIGHT_ANIMATION_DURATION_MS,
        easing: OPTIONS_PANEL_HEIGHT_ANIMATION_EASING,
        fill: 'both'
      }
    );
    optionsPanelHeightAnimation = animation;
    animation.onfinish = () => {
      if (optionsPanelHeightAnimation !== animation) {
        return;
      }
      optionsPanelHeightAnimation = null;
      animation.onfinish = null;
      animation.cancel();
      panel.style.removeProperty('height');
      panel.removeAttribute('data-height-animating');
      stabilizeOptionsPanelFocusAnchor(focusAnchor, focusTop, 0);
    };
    return true;
  }

  function setConditionalSettingsElementVisibility(element, visible, visibleDisplay) {
    if (!element) {
      return false;
    }
    const shouldShow = Boolean(visible);
    const wasVisible = visibleDisplay
      ? element.style.display !== 'none'
      : !element.hidden;
    if (visibleDisplay) {
      element.style.setProperty('display', shouldShow ? visibleDisplay : 'none');
    } else {
      element.hidden = !shouldShow;
    }
    element.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    return wasVisible !== shouldShow;
  }

  document.addEventListener('pointerdown', releaseOptionsPanelFocusAnchorReserve, true);
  document.addEventListener('focusin', releaseOptionsPanelFocusAnchorReserve, true);

  function getRiSvg(id, sizeClass) {
    const size = sizeClass || 'ri-size-12';
    return `<i class="ri-icon ${size} ${id}" aria-hidden="true"></i>`;
  }

  const THEME_STORAGE_KEY = '_x_extension_theme_mode_2024_unique_';
  const OPTIONS_THEME_PRELOAD_STORAGE_KEY = '_x_extension_options_theme_preload_2026_unique_';
  const LANGUAGE_STORAGE_KEY = '_x_extension_language_2024_unique_';
  const RECENT_MODE_STORAGE_KEY = '_x_extension_recent_mode_2024_unique_';
  const RECENT_COUNT_STORAGE_KEY = '_x_extension_recent_count_2024_unique_';
  const NEWTAB_WIDTH_MODE_STORAGE_KEY = '_x_extension_newtab_width_mode_2026_unique_';
  const NEWTAB_SEARCH_WIDTH_STORAGE_KEY = '_x_extension_newtab_search_width_2026_unique_';
  const NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY = SETTINGS.NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY ||
    '_x_extension_newtab_input_auto_focus_enabled_2026_unique_';
  const NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY = SETTINGS.NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY ||
    '_x_extension_newtab_feedback_button_visible_2026_unique_';
  const NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY = SETTINGS.NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY ||
    '_x_extension_newtab_appearance_button_visible_2026_unique_';
  const NEWTAB_THEME_MODE_STORAGE_KEY = '_x_extension_newtab_theme_mode_2026_unique_';
  const NEWTAB_THEME_SCOPE_STORAGE_KEY = '_x_extension_newtab_theme_scope_2026_unique_';
  const NEWTAB_ZEN_MODE_STORAGE_KEY = '_x_extension_newtab_zen_mode_2026_unique_';
  const NEWTAB_WALLPAPER_STORAGE_KEY = '_x_extension_newtab_wallpaper_2026_unique_';
  const NEWTAB_WALLPAPER_OVERLAY_STORAGE_KEY = '_x_extension_newtab_wallpaper_overlay_2026_unique_';
  const NEWTAB_WALLPAPER_EFFECT_STORAGE_KEY = '_x_extension_newtab_wallpaper_effect_2026_unique_';
  const NEWTAB_FAVICON_STORAGE_KEY = '_x_extension_newtab_favicon_2026_unique_';
  const OVERLAY_SIZE_MODE_STORAGE_KEY = '_x_extension_overlay_size_mode_2026_unique_';
  const OVERLAY_ENTER_ANIMATION_STORAGE_KEY = SETTINGS.OVERLAY_ENTER_ANIMATION_STORAGE_KEY ||
    '_x_extension_overlay_enter_animation_2026_unique_';
  const OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY = SETTINGS.OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY ||
    '_x_extension_overlay_page_theme_adaptation_enabled_2026_unique_';
  const BOOKMARK_COUNT_STORAGE_KEY = '_x_extension_bookmark_count_2024_unique_';
  const BOOKMARK_COLUMNS_STORAGE_KEY = '_x_extension_bookmark_columns_2024_unique_';
  const BOOKMARK_VIEW_MODE_STORAGE_KEY = '_x_extension_bookmark_view_mode_2026_unique_';
  const BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY = '_x_extension_bookmark_folder_icons_visible_2026_unique_';
  const PINNED_RECENT_SITES_STORAGE_KEY = '_x_extension_newtab_pinned_recent_sites_2026_unique_';
  const HIDDEN_RECENT_SITES_STORAGE_KEY = '_x_extension_newtab_hidden_recent_sites_2026_unique_';
  const NEWTAB_SHORTCUTS_STORAGE_KEY = '_x_extension_newtab_shortcuts_2026_unique_';
  const NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY = SETTINGS.NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY ||
    '_x_extension_newtab_shortcuts_chunk_2_2026_unique_';
  const NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY = SETTINGS.NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY ||
    '_x_extension_newtab_shortcuts_chunk_3_2026_unique_';
  const NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY = '_x_extension_newtab_shortcuts_visible_2026_unique_';
  const NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY = '_x_extension_newtab_shortcut_add_visible_2026_unique_';
  const NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY = '_x_extension_newtab_shortcut_dock_magnification_enabled_2026_unique_';
  const NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY = SETTINGS.NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY ||
    '_x_extension_newtab_shortcut_width_2026_unique_';
  const NEWTAB_SHORTCUT_WIDTH_MIN = Number(SETTINGS.NEWTAB_SHORTCUT_WIDTH_MIN) || 360;
  const NEWTAB_SHORTCUT_WIDTH_MAX = Number(SETTINGS.NEWTAB_SHORTCUT_WIDTH_MAX) || 1440;
  const NEWTAB_SHORTCUT_WIDTH_DEFAULT = Number(SETTINGS.NEWTAB_SHORTCUT_WIDTH_DEFAULT) || 920;
  const UPDATE_NOTICE_ENABLED_STORAGE_KEY = '_x_extension_update_notice_enabled_2026_unique_';
  const MOTION_EFFECTS_ENABLED_STORAGE_KEY = SETTINGS.MOTION_EFFECTS_ENABLED_STORAGE_KEY ||
    '_x_extension_motion_effects_enabled_2026_unique_';
  const SIMPLE_MODE_ENABLED_STORAGE_KEY = SETTINGS.SIMPLE_MODE_ENABLED_STORAGE_KEY ||
    '_x_extension_simple_mode_enabled_2026_unique_';
  const NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY = SETTINGS.NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY ||
    '_x_extension_number_shortcut_instant_enabled_2026_unique_';
  const MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY =
    SETTINGS.MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY ||
    '_x_extension_macos_ctrl_suggestion_navigation_enabled_2026_unique_';
  const AUTO_PIP_ENABLED_STORAGE_KEY = '_x_extension_auto_pip_enabled_2026_unique_';
  const TAB_SWITCHER_ENABLED_STORAGE_KEY = '_x_extension_tab_switcher_enabled_2026_unique_';
  const DOCUMENT_PIP_ENABLED_STORAGE_KEY = '_x_extension_document_pip_enabled_2026_unique_';
  const PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY = '_x_extension_pinned_tab_recovery_enabled_2026_unique_';
  const SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY = SETTINGS.SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY ||
    '_x_extension_selection_quick_actions_enabled_2026_unique_';
  const SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY = SETTINGS.SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY ||
    '_x_extension_selection_quick_actions_provider_2026_unique_';
  const SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY = SETTINGS.SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY ||
    '_x_extension_selection_quick_actions_group_enabled_2026_unique_';
  const OVERLAY_TAB_PRIORITY_STORAGE_KEY = '_x_extension_overlay_tab_priority_2024_unique_';
  const NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY = SETTINGS.NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY ||
    '_x_extension_newtab_wordmark_visible_2026_unique_';
  const NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY =
    SETTINGS.NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY ||
    '_x_extension_newtab_time_font_weight_2026_unique_';
  const NEWTAB_TIME_FONT_WEIGHT_MIN = Number(SETTINGS.NEWTAB_TIME_FONT_WEIGHT_MIN) || 300;
  const NEWTAB_TIME_FONT_WEIGHT_MAX = Number(SETTINGS.NEWTAB_TIME_FONT_WEIGHT_MAX) || 800;
  const NEWTAB_TIME_FONT_WEIGHT_DEFAULT = Number(SETTINGS.NEWTAB_TIME_FONT_WEIGHT_DEFAULT) || 320;
  const NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY =
    SETTINGS.NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY ||
    '_x_extension_newtab_time_seconds_visible_2026_unique_';
  const RESTRICTED_ACTION_STORAGE_KEY = '_x_extension_restricted_action_2024_unique_';
  const RESTRICTED_ACTION_AUTO_BROWSER_SETTING_DONE_STORAGE_KEY = '_x_extension_restricted_action_auto_browser_setting_done_2026_unique_';
  const SEARCH_RESULT_PRIORITY_STORAGE_KEY = '_x_extension_search_result_priority_2026_unique_';
  const SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY = '_x_extension_search_result_source_types_2026_unique_';
  const SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY = SETTINGS.SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY ||
    '_x_extension_search_result_display_limit_2026_unique_';
  const OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY = '_x_extension_overlay_open_tabs_default_visible_2026_unique_';
  const OVERLAY_TAB_KEYWORD_STORAGE_KEY = SETTINGS.OVERLAY_TAB_KEYWORD_STORAGE_KEY ||
    '_x_extension_overlay_tab_keyword_2026_unique_';
  const OVERLAY_HISTORY_KEYWORD_STORAGE_KEY = SETTINGS.OVERLAY_HISTORY_KEYWORD_STORAGE_KEY ||
    '_x_extension_overlay_history_keyword_2026_unique_';
  const FALLBACK_SHORTCUT_STORAGE_KEY = '_x_extension_fallback_hotkey_2024_unique_';
  const SITE_SEARCH_STORAGE_KEY = '_x_extension_site_search_custom_2024_unique_';
  const SITE_SEARCH_DISABLED_STORAGE_KEY = '_x_extension_site_search_disabled_2024_unique_';
  const SEARCH_BLACKLIST_STORAGE_KEY = '_x_extension_search_blacklist_2026_unique_';
  const FAVICON_REQUEST_BLACKLIST_STORAGE_KEY = '_x_extension_favicon_request_blacklist_2026_unique_';
  const FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY = '_x_extension_favicon_enhanced_fetch_enabled_2026_unique_';
  const BLACKLIST_UTILS = globalThis.LumnoBlacklistUtils || {};
  const OPTIONS_PANEL_HEIGHT_ANIMATION_DURATION_MS = 280;
  const OPTIONS_PANEL_HEIGHT_ANIMATION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
  let optionsPanelHeightAnimation = null;
  let optionsPanelFocusAnchor = null;
  let optionsPanelFocusAnchorReserve = 0;
  let currentMessages = null;
  let currentLanguageMode = 'system';
  if (searchResultSourceTypeController) {
    renderSearchResultSourceTypeControl(
      searchResultSourceTypeItems.filter((item) => item.checked).map((item) => item.value)
    );
  }
  const SECONDARY_BUTTON_CLASS_NAME = '_x_extension_shortcut_submit_2024_unique_ _x_extension_shortcut_secondary_2024_unique_';
  const DEFAULT_SEARCH_ENGINE_STORAGE_KEY = '_x_extension_default_search_engine_2024_unique_';
  const SYNC_META_KEY = '_x_extension_sync_meta_2024_unique_';
  const SYNC_KEYS = [
    THEME_STORAGE_KEY,
    LANGUAGE_STORAGE_KEY,
    RECENT_MODE_STORAGE_KEY,
    RECENT_COUNT_STORAGE_KEY,
    NEWTAB_WIDTH_MODE_STORAGE_KEY,
    NEWTAB_SEARCH_WIDTH_STORAGE_KEY,
    NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY,
    NEWTAB_THEME_MODE_STORAGE_KEY,
    NEWTAB_THEME_SCOPE_STORAGE_KEY,
    NEWTAB_ZEN_MODE_STORAGE_KEY,
    NEWTAB_WALLPAPER_STORAGE_KEY,
    NEWTAB_WALLPAPER_OVERLAY_STORAGE_KEY,
    NEWTAB_WALLPAPER_EFFECT_STORAGE_KEY,
    NEWTAB_FAVICON_STORAGE_KEY,
    OVERLAY_SIZE_MODE_STORAGE_KEY,
    OVERLAY_ENTER_ANIMATION_STORAGE_KEY,
    OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY,
    BOOKMARK_COUNT_STORAGE_KEY,
    BOOKMARK_COLUMNS_STORAGE_KEY,
    BOOKMARK_VIEW_MODE_STORAGE_KEY,
    BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY,
    PINNED_RECENT_SITES_STORAGE_KEY,
    HIDDEN_RECENT_SITES_STORAGE_KEY,
    NEWTAB_SHORTCUTS_STORAGE_KEY,
    NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY,
    NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY,
    NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY,
    NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
    NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY,
    UPDATE_NOTICE_ENABLED_STORAGE_KEY,
    MOTION_EFFECTS_ENABLED_STORAGE_KEY,
    SIMPLE_MODE_ENABLED_STORAGE_KEY,
    NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY,
    MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY,
    AUTO_PIP_ENABLED_STORAGE_KEY,
    TAB_SWITCHER_ENABLED_STORAGE_KEY,
    DOCUMENT_PIP_ENABLED_STORAGE_KEY,
    PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY,
    SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY,
    OVERLAY_TAB_PRIORITY_STORAGE_KEY,
    NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY,
    NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY,
    NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY,
    RESTRICTED_ACTION_STORAGE_KEY,
    SEARCH_RESULT_PRIORITY_STORAGE_KEY,
    SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY,
    SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY,
    OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY,
    FALLBACK_SHORTCUT_STORAGE_KEY,
    SITE_SEARCH_STORAGE_KEY,
    SITE_SEARCH_DISABLED_STORAGE_KEY,
    SEARCH_BLACKLIST_STORAGE_KEY,
    FAVICON_REQUEST_BLACKLIST_STORAGE_KEY,
    FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY,
    DEFAULT_SEARCH_ENGINE_STORAGE_KEY,
    OVERLAY_TAB_KEYWORD_STORAGE_KEY,
    OVERLAY_HISTORY_KEYWORD_STORAGE_KEY
  ];
  const DEBUG_DUPLICATE_CUSTOM_KEY = 'dup';
  const shortcutPlatform = typeof shortcutDisplay.getNavigatorPlatform === 'function'
    ? shortcutDisplay.getNavigatorPlatform(typeof navigator !== 'undefined' ? navigator : null)
    : String((typeof navigator !== 'undefined' && navigator.platform) || '').toLowerCase().includes('mac')
      ? 'mac'
      : 'other';
  const isMacPlatform = shortcutPlatform === 'mac';
  const FORCE_TEXT_KEYCAPS_ON_MAC = false;
  const FORCE_OVERLAY_TAB_QUICK_SWITCH_ENABLED = true;
  const OPTIONS_TARGET_SITE_SEARCH_AI = 'site-search-ai';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let mediaListenerAttached = false;
  let defaultSiteSearchProviders = [];
  let customSiteSearchProviders = [];
  let disabledSiteSearchKeys = new Set();
  let confirmResolver = null;
  let confirmOffset = { x: 0, y: 0 };
  let confirmClosingTimer = null;
  let bodyFixedSnapshot = null;
  let languageApplyRequestId = 0;
  let editingSiteSearchKey = null;
  let siteSearchDraftCategory = 'site';
  let activePopconfirm = null;
  let siteSearchFormExpanded = false;
  let siteSearchRefreshSuppressUntil = 0;
  let siteSearchRefreshTimer = null;
  let pendingOptionsScrollTarget = '';
  let currentShortcutLabel = null;
  let isCapturingFallbackShortcut = false;
  let cancelCaptureOnMouseLeave = false;
  let fallbackCaptureStopTimer = null;
  let fallbackShortcutBaseWidth = 0;
  let isFallbackWidthReady = false;
  let searchBlacklistItems = [];
  let faviconRequestBlacklistItems = [];
  const tooltipController = globalThis.LumnoTooltip &&
      typeof globalThis.LumnoTooltip.createController === 'function'
    ? globalThis.LumnoTooltip.createController({
      documentObj: document,
      windowObj: window,
      id: '_x_extension_options_tooltip_2026_unique_',
      appendTo: document.body,
      maxWidth: 'min(360px, calc(100vw - 24px))'
    })
    : null;
  function renderOptionsInfoButtons() {
    const bookmarkTooltip = getMessage(
      'settings_bookmark_adaptive_count_tooltip',
      '该值为宽度充足时的最大数量，实际显示数量会根据可用空间自适应。'
    );
    [bookmarkRowsInfoController, bookmarkColumnsInfoController].forEach((controller) => {
      if (controller) {
        controller.render({
          tooltip: bookmarkTooltip,
          tooltipKey: 'settings_bookmark_adaptive_count_tooltip'
        });
      }
    });
    if (restrictedActionInfoController) {
      restrictedActionInfoController.render({
        tooltip: getMessage(
          'settings_restricted_tooltip',
          '受限页（如 chrome://、扩展商店、部分 file:// 页面）无法开启聚焦搜索；按下快捷键将按此处规则处理'
        ),
        tooltipKey: 'settings_restricted_tooltip'
      });
    }
    if (overlayPageThemeAdaptationInfoController) {
      overlayPageThemeAdaptationInfoController.render({
        tooltip: getMessage(
          'settings_overlay_page_theme_adaptation_tooltip',
          '仅在“深浅色模式”=“跟随系统”时显示，关闭后将不再基于网页主题色变更深浅模式。'
        ),
        tooltipKey: 'settings_overlay_page_theme_adaptation_tooltip'
      });
    }
  }
  renderOptionsInfoButtons();
  const fallbackSiteSearchProviders = typeof SEARCH_UTILS.getDefaultSiteSearchProviders === 'function'
    ? SEARCH_UTILS.getDefaultSiteSearchProviders()
    : [];

  let feedbackSupportLinks = LUMNO_FEEDBACK_SUPPORT_LINKS_FALLBACK;
  let currentThemeMode = 'system';
  let currentRecentMode = 'most';
  let currentNewtabWidthMode = 'wide';
  let currentOverlaySizeMode = 'standard';
  let currentOverlayEnterAnimation = 'elastic';
  let currentRestrictedAction = 'default';
  let currentSearchResultPriority = 'autocomplete';
  let currentSearchResultDisplayLimit = 10;
  let currentRecentCount = 4;
  let currentBookmarkCount = 8;
  let currentBookmarkColumns = 6;
  let currentNewtabTopContentMode = 'brand';
  let currentNewtabTimeFontWeight = NEWTAB_TIME_FONT_WEIGHT_DEFAULT;
  let currentNewtabShortcutWidth = NEWTAB_SHORTCUT_WIDTH_DEFAULT;
  let currentActiveSettingsTab = 'general';
  const optionsSelectControlRecords = new Map();
  function registerOptionsSelectControl(select, kind) {
    if (!select ||
        typeof optionsSelectControlApi.createSelectControlController !== 'function') {
      return null;
    }
    const host = select.closest('._x_extension_custom_select_2024_unique_');
    if (!host) {
      return null;
    }
    const items = Array.from(select.options).map((option) => {
      const iconPath = option.getAttribute('data-icon-path') || '';
      return {
        fallback: option.textContent || option.value,
        iconUrl: iconPath && chrome && chrome.runtime && typeof chrome.runtime.getURL === 'function'
          ? chrome.runtime.getURL(iconPath)
          : (iconPath ? `../../${iconPath}` : ''),
        labelKey: option.getAttribute('data-i18n') || '',
        value: option.value
      };
    });
    const controller = optionsSelectControlApi.createSelectControlController(host, {
      kind,
      onSelect(next) {
        select.value = next;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    const record = { controller, items, select };
    optionsSelectControlRecords.set(select, record);
    return record;
  }
  function renderOptionsSelectControl(select) {
    const record = optionsSelectControlRecords.get(select);
    if (!record) {
      return;
    }
    record.controller.render({
      disabled: Boolean(select.disabled),
      id: select.id,
      items: record.items.map((item) => ({
        iconUrl: item.iconUrl,
        label: item.labelKey ? getMessage(item.labelKey, item.fallback) : item.fallback,
        labelKey: item.labelKey,
        value: item.value
      })),
      value: select.value
    });
  }
  function setOptionsSelectState(select, value) {
    if (!select) {
      return;
    }
    select.value = String(value);
    renderOptionsSelectControl(select);
  }
  [
    [languageSelect, 'language'],
    [selectionQuickActionsProviderSelect, 'selection-quick-actions-provider']
  ].forEach(([select, kind]) => {
    const record = registerOptionsSelectControl(select, kind);
    if (record) {
      renderOptionsSelectControl(select);
    }
  });
  const newtabTimeFontWeightController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          newtabTimeFontWeightControlHost,
          {
            kind: 'newtab-time-font-weight',
            onInput(value) {
              const nextWeight = normalizeNewtabTimeFontWeight(value);
              currentNewtabTimeFontWeight = nextWeight;
              if (storageArea) {
                storageArea.set({ [NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY]: nextWeight });
              }
            }
          }
        )
      : null;
  function renderNewtabTimeFontWeightControl(value) {
    if (!newtabTimeFontWeightController) {
      return;
    }
    currentNewtabTimeFontWeight = normalizeNewtabTimeFontWeight(value);
    newtabTimeFontWeightController.render({
      ariaLabel: getMessage('newtab_time_font_weight_title', 'Time font weight'),
      id: '_x_extension_newtab_time_font_weight_slider_2026_unique_',
      min: NEWTAB_TIME_FONT_WEIGHT_MIN,
      max: NEWTAB_TIME_FONT_WEIGHT_MAX,
      step: 1,
      ticks: [
        { align: 'start', label: String(NEWTAB_TIME_FONT_WEIGHT_MIN) },
        { label: String(Math.round((NEWTAB_TIME_FONT_WEIGHT_MIN + NEWTAB_TIME_FONT_WEIGHT_MAX) / 2)) },
        { align: 'end', label: String(NEWTAB_TIME_FONT_WEIGHT_MAX) }
      ],
      value: currentNewtabTimeFontWeight
    });
  }
  const newtabShortcutWidthController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          newtabShortcutWidthControlHost,
          {
            kind: 'newtab-shortcut-width',
            onInput(value) {
              const nextWidth = normalizeNewtabShortcutWidth(value);
              currentNewtabShortcutWidth = nextWidth;
              if (storageArea) {
                storageArea.set({ [NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY]: nextWidth });
              }
            }
          }
        )
      : null;
  function renderNewtabShortcutWidthControl(value, disabled) {
    if (!newtabShortcutWidthController) {
      return;
    }
    currentNewtabShortcutWidth = normalizeNewtabShortcutWidth(value);
    newtabShortcutWidthController.render({
      ariaLabel: getMessage('settings_newtab_shortcut_width_title', 'Shortcut width'),
      disabled: Boolean(disabled),
      id: '_x_extension_newtab_shortcut_width_slider_2026_unique_',
      min: NEWTAB_SHORTCUT_WIDTH_MIN,
      max: NEWTAB_SHORTCUT_WIDTH_MAX,
      step: 1,
      ticks: [
        { align: 'start', label: String(NEWTAB_SHORTCUT_WIDTH_MIN) },
        { label: String(Math.round((NEWTAB_SHORTCUT_WIDTH_MIN + NEWTAB_SHORTCUT_WIDTH_MAX) / 2)) },
        { align: 'end', label: String(NEWTAB_SHORTCUT_WIDTH_MAX) }
      ],
      value: currentNewtabShortcutWidth,
      valueSuffix: ' px'
    });
  }
  function syncNewtabShortcutSubcontrolAvailability() {
    const disabled = Boolean(newtabShortcutsToggle && !newtabShortcutsToggle.checked);
    [newtabShortcutAddToggle, newtabShortcutDockMagnificationToggle].forEach((toggle) => {
      if (toggle) {
        setOptionsToggleState(toggle, toggle.checked, disabled);
      }
    });
    [newtabShortcutAddRow, newtabShortcutDockMagnificationRow, newtabShortcutWidthRow]
      .forEach((row) => {
        if (!row) {
          return;
        }
        row.setAttribute('data-disabled', disabled ? 'true' : 'false');
        row.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      });
    renderNewtabShortcutWidthControl(currentNewtabShortcutWidth, disabled);
  }
  const bookmarkRowsController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          bookmarkRowsControlHost,
          {
            kind: 'bookmark-rows',
            onInput(value) {
              const nextCount = normalizeBookmarkCount(Number(value) * 4);
              currentBookmarkCount = nextCount;
              updateBookmarkColumnsSettingVisibility(nextCount);
              if (!storageArea) {
                return;
              }
              storageArea.set({ [BOOKMARK_COUNT_STORAGE_KEY]: nextCount });
              notifyNewtabSectionsRefresh('bookmarks');
            }
          }
        )
      : null;
  function renderBookmarkRowsControl(value) {
    if (!bookmarkRowsController) {
      return;
    }
    currentBookmarkCount = normalizeBookmarkCount(value);
    bookmarkRowsController.render({
      ariaLabel: getMessage('settings_bookmarks_title', 'Bookmark rows'),
      id: '_x_extension_bookmark_rows_slider_2026_unique_',
      min: 0,
      max: 8,
      step: 1,
      ticks: [
        { align: 'start', label: '0' },
        { label: '4' },
        { align: 'end', label: '8' }
      ],
      value: currentBookmarkCount / 4
    });
  }
  const recentCountController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          recentCountControlHost,
          {
            kind: 'recent-count',
            onInput(value) {
              const nextCount = normalizeRecentCount(Math.round(Number(value)) * 4);
              currentRecentCount = nextCount;
              updateRecentModeTabsVisibility(nextCount);
              if (!storageArea) {
                return;
              }
              storageArea.set({ [RECENT_COUNT_STORAGE_KEY]: nextCount });
              notifyNewtabSectionsRefresh('recent');
            }
          }
        )
      : null;
  function renderRecentCountControl(value) {
    if (!recentCountController) {
      return;
    }
    currentRecentCount = normalizeRecentCount(value);
    recentCountController.render({
      ariaLabel: getMessage('settings_recent_sites_title', 'Recent site cards'),
      id: '_x_extension_recent_count_slider_2026_unique_',
      min: 0,
      max: 2,
      step: 1,
      ticks: [
        { align: 'start', label: '0' },
        { label: '1' },
        { align: 'end', label: '2' }
      ],
      value: currentRecentCount / 4
    });
  }
  const bookmarkColumnsController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          bookmarkColumnsControlHost,
          {
            kind: 'bookmark-columns',
            onInput(value) {
              const nextColumns = normalizeBookmarkColumns(value);
              if (!storageArea) {
                return;
              }
              storageArea.set({ [BOOKMARK_COLUMNS_STORAGE_KEY]: nextColumns });
              notifyNewtabSectionsRefresh('bookmarks');
            }
          }
        )
      : null;
  function renderBookmarkColumnsControl(value) {
    if (!bookmarkColumnsController) {
      return;
    }
    currentBookmarkColumns = normalizeBookmarkColumns(value);
    bookmarkColumnsController.render({
      ariaLabel: getMessage('settings_bookmark_columns_title', 'Bookmarks per row'),
      id: '_x_extension_bookmark_columns_slider_2026_unique_',
      min: 4,
      max: 8,
      step: 1,
      ticks: [
        { align: 'start', label: '4' },
        { label: '6' },
        { align: 'end', label: '8' }
      ],
      value: currentBookmarkColumns
    });
  }
  const searchResultDisplayLimitController =
    typeof optionsSettingsControlsApi.createRangeSliderControlController === 'function'
      ? optionsSettingsControlsApi.createRangeSliderControlController(
          searchResultDisplayLimitControlHost,
          {
            kind: 'search-result-display-limit',
            onInput(value) {
              const nextLimit = normalizeSearchResultDisplayLimit(value);
              currentSearchResultDisplayLimit = nextLimit;
              if (storageArea) {
                storageArea.set({ [SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY]: nextLimit });
              }
            }
          }
        )
      : null;
  function renderSearchResultDisplayLimitControl(value) {
    if (!searchResultDisplayLimitController) {
      return;
    }
    currentSearchResultDisplayLimit = normalizeSearchResultDisplayLimit(value);
    searchResultDisplayLimitController.render({
      ariaLabel: getMessage('settings_search_result_display_limit_title', 'Maximum Visible Results'),
      id: '_x_extension_search_result_display_limit_slider_2026_unique_',
      min: 5,
      max: 10,
      step: 1,
      ticks: [
        { align: 'start', label: '5' },
        { align: 'end', label: '10' }
      ],
      value: currentSearchResultDisplayLimit
    });
  }
  renderNewtabTimeFontWeightControl(NEWTAB_TIME_FONT_WEIGHT_DEFAULT);
  renderNewtabShortcutWidthControl(NEWTAB_SHORTCUT_WIDTH_DEFAULT, false);
  syncNewtabShortcutSubcontrolAvailability();
  renderRecentCountControl(4);
  renderBookmarkRowsControl(8);
  renderBookmarkColumnsControl(6);
  renderSearchResultDisplayLimitControl(10);
  syncSelectionQuickActionsProviderAvailability();
  const SETTINGS_TAB_KEYS = Object.freeze([
    'general',
    'account',
    'appearance',
    'shortcuts',
    'blacklist',
    'labs'
  ]);

  function normalizeBlacklistMatchModes(value, fallbackMode) {
    if (BLACKLIST_UTILS.normalizeMatchModes) {
      return BLACKLIST_UTILS.normalizeMatchModes(
        value,
        fallbackMode === undefined ? 'prefix' : fallbackMode
      );
    }
    return fallbackMode ? [fallbackMode] : [];
  }

  function normalizeBlacklistPattern(value, matchModes, fallbackMode) {
    if (BLACKLIST_UTILS.normalizePattern) {
      return BLACKLIST_UTILS.normalizePattern(
        value,
        matchModes,
        fallbackMode === undefined ? 'prefix' : fallbackMode
      );
    }
    return '';
  }

  function normalizeSearchBlacklistItems(items) {
    if (BLACKLIST_UTILS.normalizeItems) {
      return BLACKLIST_UTILS.normalizeItems(items, 'prefix');
    }
    return [];
  }

  function normalizeFaviconRequestBlacklistItems(items) {
    if (BLACKLIST_UTILS.normalizeItems) {
      return BLACKLIST_UTILS.normalizeItems(items, 'prefix');
    }
    return [];
  }

  function buildBlacklistItemKey(item) {
    if (BLACKLIST_UTILS.buildRuleKey) {
      return BLACKLIST_UTILS.buildRuleKey(item, 'prefix');
    }
    return '';
  }

  function migrateStorageIfNeeded(keys) {
    if (!storageArea || !chrome || !chrome.storage || !chrome.storage.local) {
      return;
    }
    if (getActivePrimaryAreaName() === 'local') {
      return;
    }
    chrome.storage.local.get(keys, (localResult) => {
      const hasLocal = keys.some((key) => typeof localResult[key] !== 'undefined');
      if (!hasLocal) {
        return;
      }
      storageArea.get(keys, (syncResult) => {
        const missingSyncValues = {};
        keys.forEach((key) => {
          if (typeof localResult[key] !== 'undefined' && typeof syncResult[key] === 'undefined') {
            missingSyncValues[key] = localResult[key];
          }
        });
        const missingKeys = Object.keys(missingSyncValues);
        if (missingKeys.length === 0) {
          return;
        }
        storageArea.get(missingKeys, (latestSyncResult) => {
          const stillMissingSyncValues = {};
          missingKeys.forEach((key) => {
            if (typeof latestSyncResult[key] === 'undefined') {
              stillMissingSyncValues[key] = missingSyncValues[key];
            }
          });
          if (Object.keys(stillMissingSyncValues).length > 0) {
            storageArea.set(stillMissingSyncValues);
          }
        });
      });
    });
  }

  function getMessage(key, fallback) {
    if (currentMessages && Object.prototype.hasOwnProperty.call(currentMessages, key)) {
      const entry = currentMessages[key];
      if (entry && typeof entry.message === 'string') {
        return entry.message;
      }
    }
    if (currentLanguageMode !== 'system') {
      return fallback || '';
    }
    if (chrome && chrome.i18n && chrome.i18n.getMessage) {
      const message = chrome.i18n.getMessage(key);
      if (message) {
        return message;
      }
    }
    return fallback || '';
  }

  function getFeedbackSupportWebLocale() {
    const locale = currentLanguageMode === 'system'
      ? getSystemLocale()
      : normalizeLocale(currentLanguageMode);
    if (locale === 'zh_CN') {
      return 'zh-CN';
    }
    if (locale === 'zh_TW') {
      return 'zh-TW';
    }
    if (locale === 'ja') {
      return 'ja';
    }
    return 'en';
  }

  function getFeedbackSupportCommunityChannel() {
    return typeof COMMUNITY_LINKS.getCommunityChannel === 'function'
      ? COMMUNITY_LINKS.getCommunityChannel(
          feedbackSupportLinks,
          getFeedbackSupportWebLocale()
        )
      : 'discord';
  }

  function renderFeedbackSupport() {
    if (!feedbackSupportController) {
      return;
    }
    const links = feedbackSupportLinks || LUMNO_FEEDBACK_SUPPORT_LINKS_FALLBACK;
    const channel = getFeedbackSupportCommunityChannel();
    const communityIsWechat = channel === 'wechat';
    feedbackSupportController.render({
      heading: getMessage('settings_feedback_support_section_title', '反馈与支持'),
      headingKey: 'settings_feedback_support_section_title',
      items: [
        {
          href: communityIsWechat ? links.wechatQr : links.discord,
          iconClass: communityIsWechat ? 'ri-wechat-line' : 'ri-discord-fill',
          key: 'community',
          label: communityIsWechat
            ? getMessage('settings_feedback_support_wechat_action', '加入反馈群')
            : getMessage('settings_feedback_support_discord_action', '加入 Discord'),
          labelKey: communityIsWechat
            ? 'settings_feedback_support_wechat_action'
            : 'settings_feedback_support_discord_action'
        },
        {
          href: links.chromeReview,
          iconClass: 'ri-star-line',
          key: 'chrome-review',
          label: getMessage(
            'settings_feedback_support_review_action',
            '为 Lumno 评分'
          ),
          labelKey: 'settings_feedback_support_review_action'
        },
        {
          href: links.githubIssue,
          iconClass: 'ri-github-line',
          key: 'github-issue',
          label: getMessage(
            'settings_feedback_support_github_issue_action',
            '创建 Issue'
          ),
          labelKey: 'settings_feedback_support_github_issue_action'
        },
        {
          href: links.x,
          iconClass: 'ri-twitter-x-line',
          key: 'contact-author',
          label: getMessage(
            'settings_feedback_support_contact_author_action',
            '联系作者'
          ),
          labelKey: 'settings_feedback_support_contact_author_action'
        }
      ]
    });
  }

  function loadFeedbackSupportLinks() {
    if (typeof COMMUNITY_LINKS.load !== 'function') {
      return Promise.resolve(feedbackSupportLinks);
    }
    return COMMUNITY_LINKS.load()
      .then((links) => {
        feedbackSupportLinks = links || LUMNO_FEEDBACK_SUPPORT_LINKS_FALLBACK;
        renderFeedbackSupport();
        return feedbackSupportLinks;
      });
  }

  renderFeedbackSupport();
  loadFeedbackSupportLinks();

  function formatTemplate(text, params) {
    return String(text || '').replace(/\{(\w+)\}/g, (match, key) => {
      if (params && Object.prototype.hasOwnProperty.call(params, key)) {
        return String(params[key]);
      }
      return match;
    });
  }

  function getSiteSearchFormRenderModel() {
    return {
      copy: {
        addLabel: getMessage('shortcuts_add', '添加自定义搜索'),
        aliasLabel: getMessage('shortcuts_label_alias', '别名'),
        aliasPlaceholder: getMessage(
          'shortcuts_placeholder_alias',
          '选填，例如 小破站、油管等'
        ),
        cancelLabel: getMessage('shortcuts_cancel', '取消'),
        categoryLabel: getMessage('shortcuts_label_display_group', '显示位置'),
        keyLabel: getMessage('shortcuts_label_key', '触发词'),
        keyPlaceholder: getMessage(
          'shortcuts_placeholder_required',
          '必填，如有多个用英文逗号分隔，如 jd,bili'
        ),
        nameLabel: getMessage('shortcuts_label_name', '显示名称'),
        namePlaceholder: getMessage(
          'shortcuts_placeholder_optional_default',
          '选填，默认使用触发词'
        ),
        queryInsertLabel: getMessage('shortcuts_insert_query', '插入查询变量'),
        searchEngineCategoryLabel: getMessage(
          'search_scope_group_engines',
          '搜索引擎'
        ),
        siteCategoryLabel: getMessage('search_scope_group_sites', '站内搜索'),
        templateHelp: getMessage(
          'shortcuts_template_help',
          '1.打开你想添加的网站\n2.输入任一搜索词，触发搜索\n3.将搜索结果页面 url 粘贴在此处\n4.将关键词替换为{query}'
        ),
        templateLabel: getMessage('shortcuts_label_template', '搜索模板'),
        templatePlaceholder: getMessage(
          'shortcuts_placeholder_template',
          'https://example.com/search?q={query}'
        )
      }
    };
  }

  function getBlacklistFormRenderModel(addKey, addFallback) {
    const modeCopy = [
      {
        labelFallback: '\u5f53\u524d\u9875\u9762',
        labelKey: 'blacklist_match_exact',
        mode: 'exact',
        tooltipFallback: '\u53ea\u5c4f\u853d\u8fd9\u4e00\u9875',
        tooltipKey: 'blacklist_match_exact_tooltip'
      },
      {
        labelFallback: '\u5f53\u524d\u7ad9\u70b9\u8def\u5f84',
        labelKey: 'blacklist_match_prefix',
        mode: 'prefix',
        tooltipFallback: '\u53ea\u5c4f\u853d\u8fd9\u4e2a\u7ad9\u70b9\u4e0b\u8fd9\u4e00\u8def\u5f84\u7684\u9875\u9762',
        tooltipKey: 'blacklist_match_prefix_tooltip'
      },
      {
        labelFallback: '\u6574\u4e2a\u7f51\u7ad9',
        labelKey: 'blacklist_match_suffix',
        mode: 'suffix',
        tooltipFallback: '\u5c4f\u853d\u8fd9\u4e2a\u7f51\u7ad9\u7684\u6240\u6709\u9875\u9762\uff0c\u4e5f\u5305\u62ec\u5b83\u7684\u5b50\u7f51\u7ad9',
        tooltipKey: 'blacklist_match_suffix_tooltip'
      }
    ];
    return {
      copy: {
        addLabel: getMessage(addKey, addFallback),
        cancelLabel: getMessage('shortcuts_cancel', '取消'),
        matchLabel: getMessage('blacklist_match_label', '匹配方式'),
        modes: modeCopy.map((item) => {
          const presentation = getBlacklistInputConfig([item.mode]);
          return {
            label: getMessage(item.labelKey, item.labelFallback),
            labelKey: item.labelKey,
            mode: item.mode,
            placeholder: getMessage(
              presentation.placeholderKey,
              presentation.placeholderFallback
            ),
            prefix: presentation.prefixText,
            tooltip: getMessage(item.tooltipKey, item.tooltipFallback),
            tooltipKey: item.tooltipKey,
            urlLabel: getMessage(
              presentation.labelKey,
              presentation.labelFallback
            ),
            urlLabelKey: presentation.labelKey
          };
        })
      }
    };
  }

  function renderSettingsForms() {
    if (siteSearchFormController) {
      siteSearchFormController.render(getSiteSearchFormRenderModel());
    }
    if (searchBlacklistFormController) {
      searchBlacklistFormController.render(
        getBlacklistFormRenderModel('blacklist_add', '\u6dfb\u52a0')
      );
    }
    if (faviconBlacklistFormController) {
      faviconBlacklistFormController.render(
        getBlacklistFormRenderModel(
          'favicon_blacklist_add',
          '\u6dfb\u52a0\u6392\u9664\u89c4\u5219'
        )
      );
    }
  }

  async function handleReactSiteSearchFormSave(draft) {
    suspendSiteSearchRefresh(260);
    const key = String(draft && draft.key ? draft.key : '').trim();
    const name = String(draft && draft.name ? draft.name : '').trim();
    const templateRaw = String(draft && draft.template ? draft.template : '').trim();
    const aliases = normalizeAliases(draft && draft.aliases ? draft.aliases : '');
    const category = draft && draft.category === 'searchEngine'
      ? 'searchEngine'
      : 'site';
    if (!key) {
      return { ok: false, error: getMessage('shortcuts_error_key', '请填写触发词') };
    }
    if (/\s/.test(key)) {
      return {
        ok: false,
        error: getMessage('shortcuts_error_key_space', '触发词不能包含空格')
      };
    }
    if (findSiteSearchKeyConflict(key, '')) {
      return {
        ok: false,
        error: getMessage('shortcuts_error_key_duplicate', '该触发词已存在，请更换')
      };
    }
    const template = normalizeSiteSearchTemplate(templateRaw);
    if (!template || !template.includes('{query}')) {
      return {
        ok: false,
        error: getMessage('toast_error_template', '搜索模板必须包含 {query}')
      };
    }
    const normalizedKey = key.toLowerCase();
    const nextItem = normalizeSiteSearchProvider({
      aliases,
      key,
      name: name || key,
      template,
      category
    });
    if (!nextItem) {
      return { ok: false, error: getMessage('toast_error', '操作失败，请重试') };
    }
    const next = [nextItem].concat(
      customSiteSearchProviders.filter(
        (item) => String(item.key || '').toLowerCase() !== normalizedKey
      )
    );
    disabledSiteSearchKeys.delete(normalizedKey);
    try {
      await Promise.all([
        saveCustomSiteSearchProviders(next),
        saveDisabledSiteSearchKeys(disabledSiteSearchKeys)
      ]);
      customSiteSearchProviders = next;
      renderSiteSearchList();
      refreshSiteSearchProviders();
      setTimeout(() => {
        showToast(getMessage('toast_saved', '已保存'), false);
      }, 220);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getMessage('toast_error', '操作失败，请重试') };
    }
  }

  async function handleReactSearchBlacklistFormSave(value, modes) {
    const draft = buildBlacklistRuleDraft(value, modes);
    if (!draft.item) {
      return { ok: false, error: draft.error || '' };
    }
    try {
      await persistBlacklistItems(
        upsertBlacklistItems(draft.item, ''),
        getMessage('toast_saved', '已保存')
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getMessage('toast_error', '操作失败，请重试') };
    }
  }

  async function handleReactFaviconBlacklistFormSave(value, modes) {
    const draft = buildBlacklistRuleDraft(value, modes);
    if (!draft.item) {
      return { ok: false, error: draft.error || '' };
    }
    const nextKey = buildBlacklistItemKey(draft.item);
    const nextItems = [draft.item].concat(
      faviconRequestBlacklistItems.filter(
        (item) => buildBlacklistItemKey(item) !== nextKey
      )
    );
    try {
      faviconRequestBlacklistItems = await saveFaviconRequestBlacklistItems(nextItems);
      renderFaviconRequestBlacklistList();
      showToast(getMessage('toast_saved', '已保存'), false);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getMessage('toast_error', '操作失败，请重试') };
    }
  }

  function normalizeBookmarkCount(value) {
    if (typeof SETTINGS.normalizeBookmarkCount === 'function') {
      return SETTINGS.normalizeBookmarkCount(value);
    }
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 32 && parsed % 4 === 0) {
      return parsed;
    }
    return 8;
  }

  function normalizeRecentCount(value) {
    const parsed = Number.parseInt(value, 10);
    if (parsed === 0 || parsed === 4 || parsed === 8) {
      return parsed;
    }
    return 4;
  }

  function getBlacklistPatternInputValue(item) {
    if (BLACKLIST_UTILS.getPatternInputValue) {
      return BLACKLIST_UTILS.getPatternInputValue(item);
    }
    return '';
  }

  function resetBlacklistForm() {
    searchBlacklistFormController?.reset();
  }

  function resetFaviconBlacklistForm() {
    faviconBlacklistFormController?.reset();
  }

  function setFaviconBlacklistEditorEnabled(enabled) {
    const editable = enabled === true;
    if (!faviconBlacklistEditor) {
      return;
    }
    faviconBlacklistEditor.setAttribute('aria-disabled', editable ? 'false' : 'true');
    faviconBlacklistEditor.inert = !editable;
    if (editable) {
      faviconBlacklistEditor.removeAttribute('inert');
    } else {
      faviconBlacklistEditor.setAttribute('inert', '');
      resetFaviconBlacklistForm();
    }
  }

  function getBlacklistMatchModesSummary(modes) {
    const normalized = normalizeBlacklistMatchModes(modes);
    if (normalized.length === 0) {
      return getMessage('blacklist_match_unset', '未设置匹配方式');
    }
    return normalized.map((mode) => {
      if (mode === 'exact') {
        return getMessage('blacklist_match_exact', '当前页面');
      }
      if (mode === 'suffix') {
        return getMessage('blacklist_match_suffix', '整个网站');
      }
      return getMessage('blacklist_match_prefix', '当前站点路径');
    }).join(' / ');
  }

  function getBlacklistMatchBadgeConfig(modes) {
    const normalized = normalizeBlacklistMatchModes(modes);
    if (normalized.includes('exact')) {
      return {
        tone: 'exact',
        text: getMessage('blacklist_match_exact', '当前页面')
      };
    }
    if (normalized.includes('suffix')) {
      return {
        tone: 'suffix',
        text: getMessage('blacklist_match_suffix', '整个网站')
      };
    }
    return {
      tone: 'prefix',
      text: getMessage('blacklist_match_prefix', '当前站点路径')
    };
  }

  function formatBlacklistPatternForDisplay(item) {
    if (!item || !item.pattern) {
      return '';
    }
    const modes = normalizeBlacklistMatchModes(item.matchModes);
    if (modes.includes('suffix')) {
      return item.pattern;
    }
    return `http(s)://${item.pattern}`;
  }

  function getBlacklistInputConfig(modes) {
    const normalized = normalizeBlacklistMatchModes(modes);
    if (normalized.includes('exact')) {
      return {
        labelKey: 'blacklist_label_url',
        labelFallback: 'URL rule',
        placeholderKey: 'blacklist_placeholder_exact',
        placeholderFallback: 'example.com/path',
        prefixText: 'http(s)://'
      };
    }
    if (normalized.includes('suffix')) {
      return {
        labelKey: 'blacklist_label_url',
        labelFallback: 'URL rule',
        placeholderKey: 'blacklist_placeholder_domain',
        placeholderFallback: 'baidu.com',
        prefixText: ''
      };
    }
    return {
      labelKey: 'blacklist_label_url',
      labelFallback: 'URL rule',
      placeholderKey: 'blacklist_placeholder_prefix',
      placeholderFallback: 'baidu.com or baidu.com/search',
      prefixText: 'http(s)://'
    };
  }

  function buildBlacklistRuleDraft(inputValue, matchModes) {
    if (!Array.isArray(matchModes) || matchModes.length === 0) {
      return {
        error: getMessage('blacklist_error_match_mode', '请选择至少一种匹配方式')
      };
    }
    const pattern = normalizeBlacklistPattern(inputValue, matchModes, null);
    if (!pattern) {
      return {
        error: matchModes.includes('suffix')
          ? getMessage('blacklist_error_domain', '请输入网站域名')
          : getMessage('blacklist_error_url', '请输入站点域名或完整 URL')
      };
    }
    return {
      item: {
        pattern: pattern,
        matchModes: matchModes
      }
    };
  }

  function upsertBlacklistItems(nextItem, replacedRuleKey) {
    const nextKey = buildBlacklistItemKey(nextItem);
    return [{ pattern: nextItem.pattern, matchModes: nextItem.matchModes }].concat(
      searchBlacklistItems.filter((entry) => {
        const entryKey = buildBlacklistItemKey(entry);
        return entryKey !== replacedRuleKey && entryKey !== nextKey;
      })
    );
  }

  function persistBlacklistItems(nextItems, successMessage) {
    return saveSearchBlacklistItems(nextItems).then((savedItems) => {
      searchBlacklistItems = savedItems;
      renderSearchBlacklistList();
      notifyNewtabSectionsRefresh('recent');
      if (successMessage) {
        showToast(successMessage, false);
      }
      return savedItems;
    });
  }

  function normalizeBookmarkColumns(value) {
    if (typeof SETTINGS.normalizeBookmarkColumns === 'function') {
      return SETTINGS.normalizeBookmarkColumns(value);
    }
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 4 && parsed <= 8) {
      return parsed;
    }
    return 6;
  }

  function normalizeNewtabWidthMode(value) {
    return typeof SETTINGS.normalizeNewtabWidthMode === 'function'
      ? SETTINGS.normalizeNewtabWidthMode(value)
      : (value === 'standard' ? 'standard' : 'wide');
  }

  function normalizeOverlaySizeMode(value) {
    return typeof SETTINGS.normalizeOverlaySizeMode === 'function'
      ? SETTINGS.normalizeOverlaySizeMode(value)
      : ((value === 'compact' || value === 'large') ? value : 'standard');
  }

  function normalizeOverlayEnterAnimation(value) {
    return typeof SETTINGS.normalizeOverlayEnterAnimation === 'function'
      ? SETTINGS.normalizeOverlayEnterAnimation(value)
      : (value === 'fade' ? 'fade' : 'elastic');
  }

  function normalizeOverlayPageThemeAdaptationEnabled(value) {
    return typeof SETTINGS.normalizeOverlayPageThemeAdaptationEnabled === 'function'
      ? SETTINGS.normalizeOverlayPageThemeAdaptationEnabled(value)
      : value !== false;
  }

  function updateBookmarkColumnsSettingVisibility(countValue) {
    if (!bookmarkColumnsSettingRow) {
      return;
    }
    const parsed = Number.parseInt(countValue, 10);
    const shouldHide = Number.isFinite(parsed) ? parsed <= 0 : false;
    animateOptionsPanelHeight(() =>
      setConditionalSettingsElementVisibility(bookmarkColumnsSettingRow, !shouldHide)
    );
  }

  function normalizeOverlayTabQuickSwitch(value) {
    if (FORCE_OVERLAY_TAB_QUICK_SWITCH_ENABLED) {
      return true;
    }
    return typeof SETTINGS.normalizeOverlayTabPriorityMode === 'function'
      ? SETTINGS.normalizeOverlayTabPriorityMode(value)
      : value !== 'newtabFirst' && value !== false;
  }

  function normalizeNewtabTopContentMode(value) {
    if (typeof SETTINGS.normalizeNewtabTopContentMode === 'function') {
      return SETTINGS.normalizeNewtabTopContentMode(value);
    }
    if (value === 'time') {
      return 'time';
    }
    return value === 'off' || value === false ? 'off' : 'brand';
  }

  function normalizeNewtabTimeSecondsVisible(value) {
    return typeof SETTINGS.normalizeNewtabTimeSecondsVisible === 'function'
      ? SETTINGS.normalizeNewtabTimeSecondsVisible(value)
      : value === true;
  }

  function normalizeNewtabTimeFontWeight(value) {
    if (typeof SETTINGS.normalizeNewtabTimeFontWeight === 'function') {
      return SETTINGS.normalizeNewtabTimeFontWeight(value);
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return NEWTAB_TIME_FONT_WEIGHT_DEFAULT;
    }
    return Math.min(
      NEWTAB_TIME_FONT_WEIGHT_MAX,
      Math.max(NEWTAB_TIME_FONT_WEIGHT_MIN, Math.round(number))
    );
  }

  function normalizeNewtabInputAutoFocusEnabled(value) {
    return typeof SETTINGS.normalizeNewtabInputAutoFocusEnabled === 'function'
      ? SETTINGS.normalizeNewtabInputAutoFocusEnabled(value)
      : value === true;
  }

  function normalizeNewtabShortcutsVisible(value) {
    return typeof SETTINGS.normalizeNewtabShortcutsVisible === 'function'
      ? SETTINGS.normalizeNewtabShortcutsVisible(value)
      : value !== false;
  }

  function normalizeNewtabShortcutAddVisible(value) {
    return typeof SETTINGS.normalizeNewtabShortcutAddVisible === 'function'
      ? SETTINGS.normalizeNewtabShortcutAddVisible(value)
      : value !== false;
  }

  function normalizeNewtabShortcutDockMagnificationEnabled(value) {
    return typeof SETTINGS.normalizeNewtabShortcutDockMagnificationEnabled === 'function'
      ? SETTINGS.normalizeNewtabShortcutDockMagnificationEnabled(value)
      : value !== false;
  }

  function normalizeNewtabShortcutWidth(value) {
    return typeof SETTINGS.normalizeNewtabShortcutWidth === 'function'
      ? SETTINGS.normalizeNewtabShortcutWidth(value, {
          min: NEWTAB_SHORTCUT_WIDTH_MIN,
          max: NEWTAB_SHORTCUT_WIDTH_MAX,
          fallback: NEWTAB_SHORTCUT_WIDTH_DEFAULT
        })
      : Math.min(
          NEWTAB_SHORTCUT_WIDTH_MAX,
          Math.max(
            NEWTAB_SHORTCUT_WIDTH_MIN,
            Number.isFinite(Number(value))
              ? Math.round(Number(value))
              : NEWTAB_SHORTCUT_WIDTH_DEFAULT
          )
        );
  }

  function normalizeNewtabFeedbackButtonVisible(value) {
    return typeof SETTINGS.normalizeNewtabFeedbackButtonVisible === 'function'
      ? SETTINGS.normalizeNewtabFeedbackButtonVisible(value)
      : value !== false;
  }

  function normalizeNewtabAppearanceButtonVisible(value) {
    return typeof SETTINGS.normalizeNewtabAppearanceButtonVisible === 'function'
      ? SETTINGS.normalizeNewtabAppearanceButtonVisible(value)
      : value !== false;
  }

  function normalizeBookmarkFolderIconsVisible(value) {
    return typeof SETTINGS.normalizeBookmarkFolderIconsVisible === 'function'
      ? SETTINGS.normalizeBookmarkFolderIconsVisible(value)
      : value !== false;
  }

  function normalizeUpdateNoticeEnabled(value) {
    return typeof SETTINGS.normalizeUpdateNoticeEnabled === 'function'
      ? SETTINGS.normalizeUpdateNoticeEnabled(value)
      : value !== false;
  }

  function normalizeMotionEffectsEnabled(value) {
    return typeof SETTINGS.normalizeMotionEffectsEnabled === 'function'
      ? SETTINGS.normalizeMotionEffectsEnabled(value)
      : value !== false;
  }

  function normalizeSimpleModeEnabled(value) {
    return typeof SETTINGS.normalizeSimpleModeEnabled === 'function'
      ? SETTINGS.normalizeSimpleModeEnabled(value)
      : value === true;
  }

  function normalizeNumberShortcutInstantEnabled(value) {
    return typeof SETTINGS.normalizeNumberShortcutInstantEnabled === 'function'
      ? SETTINGS.normalizeNumberShortcutInstantEnabled(value)
      : value === true;
  }

  function normalizeMacosCtrlSuggestionNavigationEnabled(value) {
    return typeof SETTINGS.normalizeMacosCtrlSuggestionNavigationEnabled === 'function'
      ? SETTINGS.normalizeMacosCtrlSuggestionNavigationEnabled(value)
      : value === true;
  }

  function normalizeFaviconEnhancedFetchEnabled(value) {
    return typeof SETTINGS.normalizeFaviconEnhancedFetchEnabled === 'function'
      ? SETTINGS.normalizeFaviconEnhancedFetchEnabled(value)
      : value !== false;
  }

  function normalizeAutoPipEnabled(value) {
    return value !== false;
  }

  function normalizeTabSwitcherEnabled(value) {
    return typeof SETTINGS.normalizeTabSwitcherEnabled === 'function'
      ? SETTINGS.normalizeTabSwitcherEnabled(value)
      : value !== false;
  }

  function normalizeDocumentPipEnabled(value) {
    return value === true;
  }

  function normalizePinnedTabRecoveryEnabled(value) {
    return value === true;
  }

  function normalizeSelectionQuickActionsEnabled(value) {
    return typeof SETTINGS.normalizeSelectionQuickActionsEnabled === 'function'
      ? SETTINGS.normalizeSelectionQuickActionsEnabled(value)
      : value === true;
  }

  function normalizeSelectionQuickActionsProvider(value) {
    if (typeof SETTINGS.normalizeSelectionQuickActionsProvider === 'function') {
      return SETTINGS.normalizeSelectionQuickActionsProvider(value);
    }
    const key = String(value || '').trim().toLowerCase();
    return ['gpt', 'gm', 'dbai', 'qw', 'yb', 'mx', 'ds', 'kimi'].includes(key) ? key : 'gpt';
  }

  function normalizeSelectionQuickActionsGroupEnabled(value) {
    return typeof SETTINGS.normalizeSelectionQuickActionsGroupEnabled === 'function'
      ? SETTINGS.normalizeSelectionQuickActionsGroupEnabled(value)
      : value === true;
  }

  function normalizeSearchResultPriority(value) {
    return typeof SETTINGS.normalizeSearchResultPriority === 'function'
      ? SETTINGS.normalizeSearchResultPriority(value)
      : (value === 'search' ? 'search' : 'autocomplete');
  }

  function normalizeSearchResultDisplayLimit(value) {
    if (typeof SETTINGS.normalizeSearchResultDisplayLimit === 'function') {
      return SETTINGS.normalizeSearchResultDisplayLimit(value);
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 5 && parsed <= 10 ? parsed : 10;
  }

  function normalizeSearchResultSourceTypes(value) {
    if (typeof SETTINGS.normalizeSearchResultSourceTypes === 'function') {
      return SETTINGS.normalizeSearchResultSourceTypes(value);
    }
    const rawItems = Array.isArray(value) ? value : [];
    const selected = [];
    rawItems.forEach((item) => {
      const raw = String(item || '').trim();
      const type = raw === 'topSite' || raw === 'bookmark' || raw === 'history' ? raw : '';
      if (type && !selected.includes(type)) {
        selected.push(type);
      }
    });
    return selected.length > 0 ? selected : ['topSite', 'bookmark', 'history'];
  }

  function normalizeOverlayOpenTabsDefaultVisible(value) {
    return typeof SETTINGS.normalizeOverlayOpenTabsDefaultVisible === 'function'
      ? SETTINGS.normalizeOverlayOpenTabsDefaultVisible(value)
      : value !== false;
  }

  function normalizeOverlayTabKeyword(value) {
    return typeof SETTINGS.normalizeOverlayTabKeyword === 'function'
      ? SETTINGS.normalizeOverlayTabKeyword(value)
      : (String(value || '').trim().toLowerCase() || 'tb');
  }

  function normalizeOverlayHistoryKeyword(value) {
    return typeof SETTINGS.normalizeOverlayHistoryKeyword === 'function'
      ? SETTINGS.normalizeOverlayHistoryKeyword(value)
      : (String(value || '').trim().toLowerCase() || 'hy');
  }

  function collectCheckedSearchResultSourceTypes() {
    const checked = [];
    searchResultSourceTypeInputs.forEach((input) => {
      if (!input || !input.checked) {
        return;
      }
      checked.push(input.getAttribute('data-search-result-source-type'));
    });
    return checked.filter(Boolean);
  }

  function setSearchResultSourceTypeState(value) {
    const normalized = normalizeSearchResultSourceTypes(value);
    const selected = new Set(normalized);
    searchResultSourceTypeInputs.forEach((input) => {
      const type = input.getAttribute('data-search-result-source-type');
      input.checked = selected.has(type);
    });
    renderSearchResultSourceTypeControl(normalized);
  }

  function persistSearchResultSourceTypes(value) {
    const normalized = normalizeSearchResultSourceTypes(value);
    setSearchResultSourceTypeState(normalized);
    if (!storageArea) {
      return;
    }
    storageArea.set({ [SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY]: normalized });
  }

  function measureTabsIndicator(container, indicator, activeButton, inset, containerInset) {
    if (!container || !indicator) {
      return null;
    }
    if (!activeButton) {
      return {
        indicator,
        width: '0px',
        transform: null
      };
    }
    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const offset = Math.round(
      buttonRect.left - containerRect.left + (Number(container.scrollLeft) || 0) -
      (Number(containerInset) || 0) - inset
    );
    return {
      indicator,
      width: `${Math.round(buttonRect.width)}px`,
      transform: `translateX(${offset}px)`
    };
  }

  function applyTabsIndicatorMeasurement(measurement) {
    if (!measurement) {
      return;
    }
    measurement.indicator.style.width = measurement.width;
    if (measurement.transform !== null) {
      measurement.indicator.style.transform = measurement.transform;
    }
  }

  function measureInlineTabsIndicator(wrapper, indicator, activeSelector) {
    if (!wrapper) {
      return null;
    }
    const liveIndicator = wrapper.querySelector('._x_extension_theme_indicator_2024_unique_') || indicator;
    if (!liveIndicator) {
      return null;
    }
    const activeButton = wrapper.querySelector(activeSelector);
    return measureTabsIndicator(wrapper, liveIndicator, activeButton, 3, 0);
  }

  function updateInlineTabsIndicator(wrapper, indicator, activeSelector) {
    applyTabsIndicatorMeasurement(
      measureInlineTabsIndicator(wrapper, indicator, activeSelector)
    );
  }

  function updateRecentModeTabsIndicator() {
    updateInlineTabsIndicator(
      recentModeTabsWrap,
      recentModeTabsIndicator,
      'button[data-recent-mode][data-active="true"]'
    );
  }

  function updateRestrictedActionTabsIndicator() {
    updateInlineTabsIndicator(
      restrictedActionSelectWrap,
      restrictedActionTabsIndicator,
      'button[data-restricted-action][data-active="true"]'
    );
  }

  function updateSearchResultPriorityTabsIndicator() {
    updateInlineTabsIndicator(
      searchResultPriorityTabsWrap,
      searchResultPriorityTabsIndicator,
      'button[data-search-result-priority][data-active="true"]'
    );
  }

  function updateOverlaySizeTabsIndicator() {
    updateInlineTabsIndicator(
      overlaySizeTabsWrap,
      overlaySizeTabsIndicator,
      'button[data-overlay-size][data-active="true"]'
    );
  }

  function updateOverlayEnterAnimationTabsIndicator() {
    updateInlineTabsIndicator(
      overlayEnterAnimationTabsWrap,
      overlayEnterAnimationTabsIndicator,
      'button[data-overlay-enter-animation][data-active="true"]'
    );
  }

  function updateNewtabWidthTabsIndicator() {
    updateInlineTabsIndicator(
      newtabWidthTabsWrap,
      newtabWidthTabsIndicator,
      'button[data-newtab-width][data-active="true"]'
    );
  }

  function updateNewtabTopContentTabsIndicator() {
    updateInlineTabsIndicator(
      newtabTopContentTabsWrap,
      newtabTopContentTabsIndicator,
      'button[data-newtab-top-content][data-active="true"]'
    );
  }

  function refreshAllTabsIndicators() {
    const measurements = [
      measureTabIndicator(),
      measureThemeIndicator(),
      measureInlineTabsIndicator(
        newtabWidthTabsWrap,
        newtabWidthTabsIndicator,
        'button[data-newtab-width][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        recentModeTabsWrap,
        recentModeTabsIndicator,
        'button[data-recent-mode][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        overlaySizeTabsWrap,
        overlaySizeTabsIndicator,
        'button[data-overlay-size][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        overlayEnterAnimationTabsWrap,
        overlayEnterAnimationTabsIndicator,
        'button[data-overlay-enter-animation][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        restrictedActionSelectWrap,
        restrictedActionTabsIndicator,
        'button[data-restricted-action][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        searchResultPriorityTabsWrap,
        searchResultPriorityTabsIndicator,
        'button[data-search-result-priority][data-active="true"]'
      ),
      measureInlineTabsIndicator(
        newtabTopContentTabsWrap,
        newtabTopContentTabsIndicator,
        'button[data-newtab-top-content][data-active="true"]'
      )
    ];
    measurements.forEach(applyTabsIndicatorMeasurement);
  }

  let tabsIndicatorsRefreshFrame = 0;
  let tabsIndicatorsRefreshPasses = 0;
  function scheduleTabsIndicatorsRefresh(framePasses) {
    const passes = Number.isFinite(framePasses) && framePasses > 0 ? Math.floor(framePasses) : 2;
    tabsIndicatorsRefreshPasses = Math.max(tabsIndicatorsRefreshPasses, passes);
    if (tabsIndicatorsRefreshFrame) {
      return;
    }
    const run = () => {
      if (tabsIndicatorsRefreshPasses <= 0) {
        tabsIndicatorsRefreshFrame = 0;
        refreshAllTabsIndicators();
        return;
      }
      tabsIndicatorsRefreshPasses -= 1;
      tabsIndicatorsRefreshFrame = requestAnimationFrame(run);
    };
    tabsIndicatorsRefreshFrame = requestAnimationFrame(run);
  }

  function renderSegmentedControlState(
    controller,
    model
  ) {
    controller.render(model);
  }

  function setRecentModeTabState(mode) {
    const nextMode = mode === 'most' ? 'most' : 'latest';
    currentRecentMode = nextMode;
    renderSegmentedControlState(
      recentModeTabsController,
      {
        activeValue: nextMode,
        dataAttribute: 'data-recent-mode',
        items: [
          {
            value: 'latest',
            labelKey: 'recent_mode_latest',
            label: getMessage('recent_mode_latest', '最近访问')
          },
          {
            value: 'most',
            labelKey: 'recent_mode_most',
            label: getMessage('recent_mode_most', '最常访问')
          }
        ],
        select: {
          id: '_x_extension_recent_mode_select_2024_unique_'
        }
      },
      recentModeTabButtons,
      'data-recent-mode',
      (value) => value === 'most' ? 'most' : 'latest'
    );
    requestAnimationFrame(updateRecentModeTabsIndicator);
  }

  function setOverlaySizeTabState(mode) {
    const nextMode = normalizeOverlaySizeMode(mode);
    currentOverlaySizeMode = nextMode;
    renderSegmentedControlState(
      overlaySizeTabsController,
      {
        activeValue: nextMode,
        dataAttribute: 'data-overlay-size',
        items: [
          {
            value: 'compact',
            labelKey: 'overlay_size_compact',
            label: getMessage('overlay_size_compact', '小')
          },
          {
            value: 'standard',
            labelKey: 'overlay_size_standard',
            label: getMessage('overlay_size_standard', '标准')
          },
          {
            value: 'large',
            labelKey: 'overlay_size_large',
            label: getMessage('overlay_size_large', '大')
          }
        ]
      },
      overlaySizeTabButtons,
      'data-overlay-size',
      normalizeOverlaySizeMode
    );
    requestAnimationFrame(updateOverlaySizeTabsIndicator);
  }

  function setOverlayEnterAnimationTabState(mode) {
    const nextMode = normalizeOverlayEnterAnimation(mode);
    currentOverlayEnterAnimation = nextMode;
    renderSegmentedControlState(
      overlayEnterAnimationTabsController,
      {
        activeValue: nextMode,
        dataAttribute: 'data-overlay-enter-animation',
        items: [
          {
            value: 'elastic',
            labelKey: 'overlay_enter_animation_elastic',
            label: getMessage('overlay_enter_animation_elastic', '弹性')
          },
          {
            value: 'fade',
            labelKey: 'overlay_enter_animation_fade',
            label: getMessage('overlay_enter_animation_fade', '淡入')
          }
        ]
      }
    );
    requestAnimationFrame(updateOverlayEnterAnimationTabsIndicator);
  }

  function setNewtabWidthTabState(mode) {
    const nextMode = normalizeNewtabWidthMode(mode);
    currentNewtabWidthMode = nextMode;
    renderSegmentedControlState(
      newtabWidthTabsController,
      {
        activeValue: nextMode,
        dataAttribute: 'data-newtab-width',
        items: [
          {
            value: 'standard',
            labelKey: 'newtab_width_standard',
            label: getMessage('newtab_width_standard', '标准')
          },
          {
            value: 'wide',
            labelKey: 'newtab_width_wide',
            label: getMessage('newtab_width_wide', '宽屏（推荐）')
          }
        ],
        select: {
          id: '_x_extension_newtab_width_select_2026_unique_'
        }
      },
      newtabWidthTabButtons,
      'data-newtab-width',
      normalizeNewtabWidthMode
    );
    requestAnimationFrame(updateNewtabWidthTabsIndicator);
  }

  function setNewtabTopContentTabState(mode) {
    const nextMode = normalizeNewtabTopContentMode(mode);
    currentNewtabTopContentMode = nextMode;
    renderSegmentedControlState(
      newtabTopContentTabsController,
      {
        activeValue: nextMode,
        dataAttribute: 'data-newtab-top-content',
        items: [
          {
            value: 'brand',
            labelKey: 'newtab_top_content_brand',
            label: getMessage('newtab_top_content_brand', '品牌标识')
          },
          {
            value: 'time',
            labelKey: 'newtab_top_content_time',
            label: getMessage('newtab_top_content_time', '时间')
          },
          {
            value: 'off',
            labelKey: 'newtab_top_content_off',
            label: getMessage('newtab_top_content_off', '隐藏')
          }
        ]
      }
    );
    syncNewtabTimeSecondsVisibility();
    requestAnimationFrame(updateNewtabTopContentTabsIndicator);
  }

  function syncNewtabTimeSecondsVisibility() {
    const visible = currentNewtabTopContentMode === 'time';
    animateOptionsPanelHeight(() => {
      let changed = false;
      [newtabTimeFontWeightRow, newtabTimeSecondsRow].forEach((row) => {
        changed = setConditionalSettingsElementVisibility(row, visible) || changed;
      });
      return changed;
    });
  }

  function updateRecentModeTabsVisibility(countValue) {
    if (!recentModeTabsWrap) {
      return;
    }
    const parsed = Number.parseInt(countValue, 10);
    const shouldHide = Number.isFinite(parsed) ? parsed <= 0 : false;
    animateOptionsPanelHeight(() =>
      setConditionalSettingsElementVisibility(recentModeTabsWrap, !shouldHide, 'flex')
    );
    if (!shouldHide) {
      requestAnimationFrame(() => {
        requestAnimationFrame(updateRecentModeTabsIndicator);
      });
    }
  }

  function setRestrictedActionTabState(action) {
    const nextAction = action === 'none' ? 'none' : 'default';
    currentRestrictedAction = nextAction;
    renderSegmentedControlState(
      restrictedActionTabsController,
      {
        activeValue: nextAction,
        dataAttribute: 'data-restricted-action',
        items: [
          {
            value: 'default',
            labelKey: 'restricted_action_default',
            label: getMessage('restricted_action_default', '前往 Lumno 新标签页'),
            iconClass: 'ri-icon ri-size-14 ri-file-add-line'
          },
          {
            value: 'none',
            labelKey: 'restricted_action_none',
            label: getMessage('restricted_action_none', '遵循浏览器设置')
          }
        ],
        select: {
          id: '_x_extension_restricted_action_select_2024_unique_'
        }
      },
      restrictedActionTabButtons,
      'data-restricted-action',
      (value) => value === 'none' ? 'none' : 'default'
    );
    requestAnimationFrame(updateRestrictedActionTabsIndicator);
  }

  function createRestrictedActionStorageUpdate(action) {
    return {
      [RESTRICTED_ACTION_STORAGE_KEY]: action === 'none' ? 'none' : 'default',
      [RESTRICTED_ACTION_AUTO_BROWSER_SETTING_DONE_STORAGE_KEY]: true
    };
  }

  function setSearchResultPriorityTabState(priority) {
    const nextPriority = normalizeSearchResultPriority(priority);
    currentSearchResultPriority = nextPriority;
    renderSegmentedControlState(
      searchResultPriorityTabsController,
      {
        activeValue: nextPriority,
        dataAttribute: 'data-search-result-priority',
        items: [
          {
            value: 'autocomplete',
            labelKey: 'search_result_priority_autocomplete',
            label: getMessage('search_result_priority_autocomplete', '补全优先')
          },
          {
            value: 'search',
            labelKey: 'search_result_priority_search',
            label: getMessage('search_result_priority_search', '搜索优先')
          }
        ],
        select: {
          id: '_x_extension_search_result_priority_select_2026_unique_'
        }
      },
      searchResultPriorityTabButtons,
      'data-search-result-priority',
      normalizeSearchResultPriority
    );
    requestAnimationFrame(updateSearchResultPriorityTabsIndicator);
  }

  function handleNewtabWidthSelection(value) {
    const nextMode = normalizeNewtabWidthMode(value);
    setNewtabWidthTabState(nextMode);
    if (newtabWidthSelect) {
      newtabWidthSelect.value = nextMode;
    }
    if (!storageArea) {
      return;
    }
    storageArea.set({ [NEWTAB_WIDTH_MODE_STORAGE_KEY]: nextMode });
    notifyNewtabSectionsRefresh('all');
  }

  function handleOverlaySizeSelection(value) {
    const nextMode = normalizeOverlaySizeMode(value);
    setOverlaySizeTabState(nextMode);
    if (!storageArea) {
      return;
    }
    storageArea.set({ [OVERLAY_SIZE_MODE_STORAGE_KEY]: nextMode });
  }

  function handleOverlayEnterAnimationSelection(value) {
    const nextMode = normalizeOverlayEnterAnimation(value);
    setOverlayEnterAnimationTabState(nextMode);
    if (!storageArea) {
      return;
    }
    storageArea.set({ [OVERLAY_ENTER_ANIMATION_STORAGE_KEY]: nextMode });
  }

  function handleSearchResultPrioritySelection(value) {
    const nextPriority = normalizeSearchResultPriority(value);
    setSearchResultPriorityTabState(nextPriority);
    if (searchResultPrioritySelect) {
      searchResultPrioritySelect.value = nextPriority;
    }
    if (!storageArea) {
      return;
    }
    storageArea.set({ [SEARCH_RESULT_PRIORITY_STORAGE_KEY]: nextPriority });
  }

  function handleNewtabTopContentSelection(value) {
    const nextMode = normalizeNewtabTopContentMode(value);
    setNewtabTopContentTabState(nextMode);
    if (!storageArea) {
      return;
    }
    storageArea.set({ [NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY]: nextMode });
  }

  function handleRecentModeSelection(value) {
    const nextMode = value === 'most' ? 'most' : 'latest';
    setRecentModeTabState(nextMode);
    if (recentModeSelect) {
      recentModeSelect.value = nextMode;
    }
    if (!storageArea) {
      return;
    }
    storageArea.set({ [RECENT_MODE_STORAGE_KEY]: nextMode });
    notifyNewtabSectionsRefresh('recent');
  }

  function handleRestrictedActionSelection(value) {
    const nextAction = value === 'none' ? 'none' : 'default';
    setRestrictedActionTabState(nextAction);
    if (restrictedActionSelect) {
      restrictedActionSelect.value = nextAction;
    }
    if (!storageArea) {
      return;
    }
    storageArea.set(createRestrictedActionStorageUpdate(nextAction));
  }

  setNewtabWidthTabState(currentNewtabWidthMode);
  setOverlaySizeTabState(currentOverlaySizeMode);
  setOverlayEnterAnimationTabState(currentOverlayEnterAnimation);
  setSearchResultPriorityTabState(currentSearchResultPriority);
  setRecentModeTabState(currentRecentMode);
  setRestrictedActionTabState(currentRestrictedAction);
  setNewtabTopContentTabState(currentNewtabTopContentMode);

  function storageGet(area, keys) {
    return new Promise((resolve) => {
      if (!area) {
        resolve({});
        return;
      }
      area.get(keys, (result) => resolve(result || {}));
    });
  }

  function storageSet(area, payload) {
    return new Promise((resolve, reject) => {
      if (!area) {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) {
          return;
        }
        settled = true;
        if (chrome.runtime && chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || 'storage set failed'));
          return;
        }
        resolve();
      };
      try {
        const maybePromise = area.set(payload, finish);
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(finish).catch((error) => {
            if (settled) {
              return;
            }
            settled = true;
            reject(error);
          });
        }
      } catch (error) {
        settled = true;
        reject(error);
      }
    });
  }

  function isInvalidatedExtensionContextError(error) {
    return /extension context invalidated/i.test(String(error && error.message ? error.message : error));
  }

  function recoverInvalidatedOptionsContext(error) {
    if (!isInvalidatedExtensionContextError(error)) {
      return false;
    }
    window.location.reload();
    return true;
  }

  function storageRemove(area, key) {
    return new Promise((resolve, reject) => {
      if (!area) {
        resolve();
        return;
      }
      area.remove([key], () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || 'storage remove failed'));
          return;
        }
        resolve();
      });
    });
  }

  function notifyNewtabSectionsRefresh(section) {
    if (!chrome || !chrome.runtime || typeof chrome.runtime.sendMessage !== 'function') {
      return;
    }
    try {
      chrome.runtime.sendMessage(
        { action: 'lumno:newtab-refresh-sections', section: section || 'all' },
        () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            return;
          }
        }
      );
    } catch (error) {
      // Ignore runtime messaging errors.
    }
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (!key) {
        return;
      }
      const fallback = node.textContent || '';
      const rawMessage = getMessage(key, fallback);
      const message = formatTemplate(rawMessage, {
        name: 'Lumno',
        shortcut: formatShortcutForDisplay('Alt+Q') || (isMacPlatform ? '⌥Q' : 'Alt+Q')
      });
      node.textContent = message;
      if (node.tagName === 'OPTION') {
        node.label = message;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (!key) {
        return;
      }
      const fallback = node.getAttribute('placeholder') || '';
      const message = getMessage(key, fallback);
      node.setAttribute('placeholder', message);
    });
    document.querySelectorAll('[data-i18n-tooltip]').forEach((node) => {
      const key = node.getAttribute('data-i18n-tooltip');
      if (!key) {
        return;
      }
      const fallback = node.getAttribute('data-tooltip') || '';
      const message = getMessage(key, fallback);
      node.setAttribute('data-tooltip', message);
      if (node.getAttribute('title')) {
        node.removeAttribute('title');
      }
      if (node.getAttribute('aria-label')) {
        node.setAttribute('aria-label', message);
      }
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
      const key = node.getAttribute('data-i18n-aria-label');
      if (!key) {
        return;
      }
      const fallback = node.getAttribute('aria-label') || '';
      const message = getMessage(key, fallback);
      node.setAttribute('aria-label', message);
    });
    if (fallbackShortcutInput && fallbackShortcutTokens) {
      fallbackShortcutTokens.setAttribute('data-placeholder', fallbackShortcutInput.getAttribute('placeholder') || '');
      renderFallbackShortcutTokens(currentShortcutLabel || '');
    }
  }

  function showTooltipFor(target) {
    if (!tooltipController || !target) {
      return;
    }
    const text = target.getAttribute('data-tooltip');
    if (!text) {
      return;
    }
    tooltipController.show(target, text, {
      maxWidth: 'min(360px, calc(100vw - 24px))',
      spacing: 8
    });
  }

  function hideTooltip() {
    if (!tooltipController) {
      return;
    }
    tooltipController.hide();
  }

  function initTooltips() {
    if (!tooltipController) {
      return;
    }
    const nodes = Array.from(document.querySelectorAll('[data-tooltip]'));
    nodes.forEach((node) => {
      tooltipController.bind(node, () => node.getAttribute('data-tooltip'), {
        maxWidth: 'min(360px, calc(100vw - 24px))',
        spacing: 8
      });
    });
  }

  function refreshCustomSelects(options) {
    const config = options && typeof options === 'object' ? options : {};
    if ((optionsStartupStorageBatchPending || optionsStartupRefreshCoalescing) && !config.force) {
      optionsStartupRefreshDeferred = true;
      return;
    }
    optionsCustomSelectRefreshCount += 1;
    if (document.documentElement) {
      document.documentElement.setAttribute(
        'data-lumno-options-control-refreshes',
        String(optionsCustomSelectRefreshCount)
      );
    }
    renderSettingsForms();
    optionsSelectControlRecords.forEach((record, select) => {
      renderOptionsSelectControl(select);
    });
    syncFallbackShortcutWrapWidth();
  }

  function syncFallbackShortcutWrapWidth() {
    if (!fallbackShortcutWrap || !restrictedActionSelectWrap) {
      return;
    }
    const width = Math.round(restrictedActionSelectWrap.getBoundingClientRect().width);
    if (!Number.isFinite(width) || width <= 0) {
      return;
    }
    fallbackShortcutBaseWidth = width;
    updateFallbackShortcutWrapWidthForContent();
  }

  function updateFallbackShortcutWrapWidthForContent() {
    if (!fallbackShortcutWrap) {
      return;
    }
    const fallbackBase = Math.max(120, Number.isFinite(fallbackShortcutBaseWidth) ? fallbackShortcutBaseWidth : 0);
    let nextWidth = fallbackBase || Math.round(fallbackShortcutWrap.getBoundingClientRect().width) || 180;
    if (fallbackShortcutTokens) {
      const tokenEls = Array.from(fallbackShortcutTokens.children || []);
      if (tokenEls.length > 0) {
        const style = window.getComputedStyle(fallbackShortcutTokens);
        const gap = Number.parseFloat(style.columnGap || style.gap) || 0;
        const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
        const paddingRight = Number.parseFloat(style.paddingRight) || 0;
        const contentWidth = tokenEls.reduce((sum, el) => sum + Math.ceil(el.getBoundingClientRect().width), 0)
          + Math.max(0, tokenEls.length - 1) * gap;
        const requiredWidth = Math.ceil(contentWidth + paddingLeft + paddingRight + 2);
        nextWidth = Math.max(nextWidth, requiredWidth);
      }
    }
    fallbackShortcutWrap.style.width = `${nextWidth}px`;
    if (!isFallbackWidthReady) {
      requestAnimationFrame(() => {
        isFallbackWidthReady = true;
        if (fallbackShortcutWrap) {
          fallbackShortcutWrap.setAttribute('data-width-ready', 'true');
        }
      });
    }
  }

  function updateBuiltinResetTooltip() {
    if (!builtinResetButton) {
      return;
    }
    const text = getMessage('shortcuts_reset_builtin', '重置为初始列表');
    builtinResetButton.removeAttribute('title');
    builtinResetButton.setAttribute('aria-label', text);
    builtinResetButton.setAttribute('data-tooltip', text);
  }

  function updateCustomClearTooltip() {
    if (!customClearButton) {
      return;
    }
    const text = getMessage('shortcuts_clear_custom', '清空自定义');
    customClearButton.removeAttribute('title');
    customClearButton.setAttribute('aria-label', text);
    customClearButton.setAttribute('data-tooltip', text);
  }

  function updateBlacklistClearTooltip() {
    if (!blacklistClearButton) {
      return;
    }
    const text = getMessage('blacklist_clear', '清空黑名单');
    blacklistClearButton.removeAttribute('title');
    blacklistClearButton.setAttribute('aria-label', text);
    blacklistClearButton.setAttribute('data-tooltip', text);
  }

  function showToast(message, isError) {
    toastController.show(message, {
      error: Boolean(isError)
    });
  }

  function setSyncButtonEnabled(button, enabled) {
    if (!button) {
      return;
    }
    const isEnabled = enabled === true;
    button.disabled = !isEnabled;
    button.setAttribute('data-disabled', isEnabled ? 'false' : 'true');
  }


  function formatSyncTime(timestamp) {
    if (!timestamp) {
      return '';
    }
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return '';
    }
  }

  function updateSyncStatusText(statusKey, fallback, params) {
    if (!syncStatus) {
      return;
    }
    let statusStyle = '';
    let tooltipKey = 'sync_status_hint';
    if (statusKey === 'sync_status_ready' || statusKey === 'sync_status_done') {
      statusStyle = 'success';
      tooltipKey = 'sync_status_hint';
    } else if (statusKey === 'sync_status_failed' || statusKey === 'sync_status_failed_reason' || statusKey === 'sync_status_unavailable') {
      statusStyle = 'danger';
      tooltipKey = 'sync_status_unavailable_hint';
    }
    if (statusStyle) {
      syncStatus.setAttribute('data-status', statusStyle);
    } else {
      syncStatus.removeAttribute('data-status');
    }
    if (syncStatus.hasAttribute('data-i18n-tooltip')) {
      syncStatus.setAttribute('data-i18n-tooltip', tooltipKey);
    }
    syncStatus.setAttribute('data-tooltip', getMessage(tooltipKey, syncStatus.getAttribute('data-tooltip') || ''));
    const template = getMessage(statusKey, fallback);
    const target = syncStatusText || syncStatus;
    target.textContent = params ? formatTemplate(template, params) : template;
  }

  function updateSyncNowTooltip(timeText) {
    if (!syncNowButton) {
      return;
    }
    if (!timeText) {
      syncNowButton.setAttribute('data-tooltip', getMessage('sync_tooltip_default', '手动同步'));
      return;
    }
    const template = getMessage('sync_tooltip_last_manual', '最近导入/手动同步 {time}');
    syncNowButton.setAttribute('data-tooltip', formatTemplate(template, { time: timeText }));
    if (syncNowButton.matches(':hover') || syncNowButton.matches(':focus')) {
      showTooltipFor(syncNowButton);
    }
  }

  function refreshSyncStatus() {
    if (!syncStatus) {
      return;
    }
    if (!storageArea) {
      updateSyncStatusText('sync_status_unavailable', '同步不可用');
      setSyncButtonEnabled(syncNowButton, false);
      setSyncButtonEnabled(syncExportButton, false);
      setSyncButtonEnabled(syncImportButton, false);
      return;
    }
    if (getActivePrimaryAreaName() !== 'sync') {
      updateSyncStatusText('sync_status_unavailable', '同步不可用');
      setSyncButtonEnabled(syncNowButton, false);
      setSyncButtonEnabled(syncExportButton, true);
      setSyncButtonEnabled(syncImportButton, true);
      return;
    }
    setSyncButtonEnabled(syncNowButton, true);
    setSyncButtonEnabled(syncExportButton, true);
    setSyncButtonEnabled(syncImportButton, true);
    updateSyncStatusText('sync_status_ready', '同步已开启');
    storageArea.get([SYNC_META_KEY], (result) => {
      const meta = result ? result[SYNC_META_KEY] : null;
      const lastSyncAt = meta && meta.lastSyncAt ? meta.lastSyncAt : '';
      updateSyncNowTooltip(lastSyncAt ? formatSyncTime(lastSyncAt) : '');
    });
  }

  function buildSyncPayload(result) {
    const data = {};
    SYNC_KEYS.forEach((key) => {
      if (typeof result[key] !== 'undefined') {
        data[key] = result[key];
      }
    });
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      data
    };
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /*
  function showConfirm(message, trigger) {
    if (!confirmMask || !confirmMessage || !confirmOk || !confirmCancel || !confirmDialog) {
      return Promise.resolve(false);
    }
    if (confirmClosingTimer) {
      clearTimeout(confirmClosingTimer);
      confirmClosingTimer = null;
    }
    confirmMessage.textContent = message;
    confirmMask.setAttribute('data-show', 'true');
    if (confirmDialog) {
      confirmDialog.style.removeProperty('transform');
      confirmDialog.style.removeProperty('opacity');
    }
    if (!bodyFixedSnapshot) {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      bodyFixedSnapshot = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width
      };
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.dataset._xScrollY = String(scrollY);
    }
    const rect = trigger && trigger.getBoundingClientRect ? trigger.getBoundingClientRect() : null;
    const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const offsetX = centerX - window.innerWidth / 2;
    const offsetY = centerY - window.innerHeight / 2;
    confirmOffset = { x: offsetX, y: offsetY };
    confirmDialog.style.setProperty('transform', `translate(${offsetX}px, ${offsetY}px) scale(0.6)`);
    confirmDialog.style.setProperty('opacity', '0');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        confirmDialog.style.setProperty('transform', 'translate(0, 0) scale(1)');
        confirmDialog.style.setProperty('opacity', '1');
      });
    });
    return new Promise((resolve) => {
      confirmResolver = resolve;
    });
  }

  function closeConfirm(result) {
    if (!confirmMask) {
      return;
    }
    if (confirmDialog) {
      confirmDialog.style.setProperty('transform', `translate(${confirmOffset.x}px, ${confirmOffset.y}px) scale(0.6)`);
      confirmDialog.style.setProperty('opacity', '0');
    }
    confirmClosingTimer = setTimeout(() => {
      confirmMask.setAttribute('data-show', 'false');
      if (confirmDialog) {
        confirmDialog.style.removeProperty('transform');
        confirmDialog.style.removeProperty('opacity');
      }
      if (bodyFixedSnapshot) {
        const restoreY = Number.parseFloat(document.body.dataset._xScrollY || '0') || 0;
        document.body.style.position = bodyFixedSnapshot.position;
        document.body.style.top = bodyFixedSnapshot.top;
        document.body.style.left = bodyFixedSnapshot.left;
        document.body.style.right = bodyFixedSnapshot.right;
        document.body.style.width = bodyFixedSnapshot.width;
        bodyFixedSnapshot = null;
        delete document.body.dataset._xScrollY;
        window.scrollTo(0, restoreY);
      }
      confirmClosingTimer = null;
    }, 340);
    if (confirmResolver) {
      confirmResolver(result);
      confirmResolver = null;
    }
  }
  */

  function closeActivePopconfirm() {
    if (activePopconfirm) {
      const popconfirm = activePopconfirm;
      const closePopconfirm = popconfirm._xOptionsClosePopconfirm;
      if (typeof closePopconfirm === 'function') {
        closePopconfirm();
      } else {
        popconfirm.setAttribute('data-open', 'false');
        activePopconfirm = null;
      }
    }
  }

  function initializePopconfirmWrap(wrap, trigger, messageKey, fallbackMessage, onConfirm) {
    if (!wrap || !trigger) {
      return null;
    }
    const reactApi = typeof optionsPopconfirmApi !== 'undefined'
      ? optionsPopconfirmApi
      : {};
    wrap.className = '_x_extension_popconfirm_wrap_2024_unique_';
    const popconfirm = document.createElement('div');
    popconfirm.className = '_x_extension_popconfirm_2024_unique_';
    popconfirm.setAttribute('data-open', 'false');
    wrap.appendChild(trigger);
    wrap.appendChild(popconfirm);

    let popconfirmController = null;

    function getPopconfirmRenderModel(open) {
      return {
        open: Boolean(open),
        messageKey,
        message: getMessage(messageKey, fallbackMessage),
        cancelLabel: getMessage('confirm_cancel', '取消'),
        confirmLabel: getMessage('confirm_ok', '确认')
      };
    }

    function setPopconfirmOpen(open) {
      popconfirmController.render(getPopconfirmRenderModel(open));
    }

    function closePopconfirm() {
      setPopconfirmOpen(false);
      if (activePopconfirm === popconfirm) {
        activePopconfirm = null;
      }
    }
    popconfirm._xOptionsClosePopconfirm = closePopconfirm;

    popconfirmController = reactApi.createPopconfirmController(popconfirm, {
      onCancel() {
        closePopconfirm();
      },
      onConfirm() {
        closePopconfirm();
        if (typeof onConfirm === 'function') {
          onConfirm();
        }
      }
    });
    popconfirm._xOptionsDestroyPopconfirm = () => {
      closePopconfirm();
      popconfirmController.destroy();
      popconfirmController = null;
    };
    setPopconfirmOpen(false);

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      if (activePopconfirm && activePopconfirm !== popconfirm) {
        closeActivePopconfirm();
      }
      const isOpen = popconfirm.getAttribute('data-open') === 'true';
      if (isOpen) {
        closePopconfirm();
      } else {
        setPopconfirmOpen(true);
        activePopconfirm = popconfirm;
      }
    });
    return wrap;
  }

  function attachPopconfirm(trigger, messageKey, fallbackMessage, onConfirm) {
    if (!trigger || !trigger.parentNode) {
      return;
    }
    const parent = trigger.parentNode;
    const wrap = document.createElement('div');
    parent.insertBefore(wrap, trigger);
    initializePopconfirmWrap(wrap, trigger, messageKey, fallbackMessage, onConfirm);
  }

  function removeSiteSearchItem(key, isBuiltin) {
    if (isBuiltin) {
      disabledSiteSearchKeys.add(key.toLowerCase());
      return saveDisabledSiteSearchKeys(disabledSiteSearchKeys).then(() => {
        refreshSiteSearchProviders();
        if (editingSiteSearchKey === key) {
          resetSiteSearchForm();
        }
        showToast(getMessage('toast_removed', '已移除'), false);
      }).catch(() => {
        showToast(getMessage('toast_error', '操作失败，请重试'), true);
      });
    }
    const removedItem = customSiteSearchProviders.find(
      (item) => String(item.key || '') === key
    );
    const nextCustom = customSiteSearchProviders.filter(
      (item) => String(item.key || '') !== key
    );
    const nextDisabledKeys = new Set(disabledSiteSearchKeys);
    const builtinKey = getSiteSearchBuiltinKey(removedItem);
    if (builtinKey) {
      nextDisabledKeys.delete(builtinKey);
    }
    return Promise.all([
      saveCustomSiteSearchProviders(nextCustom),
      saveDisabledSiteSearchKeys(nextDisabledKeys)
    ]).then(() => {
      customSiteSearchProviders = nextCustom;
      disabledSiteSearchKeys = nextDisabledKeys;
      refreshSiteSearchProviders();
      if (editingSiteSearchKey === key) {
        resetSiteSearchForm();
      }
      showToast(getMessage('toast_removed', '已移除'), false);
    }).catch(() => {
      showToast(getMessage('toast_error', '操作失败，请重试'), true);
    });
  }

  function normalizeLocale(locale) {
    return typeof SETTINGS.normalizeLocale === 'function'
      ? SETTINGS.normalizeLocale(locale)
      : 'en';
  }

  function localeToHtmlLang(locale) {
    return typeof SETTINGS.localeToHtmlLang === 'function'
      ? SETTINGS.localeToHtmlLang(locale)
      : normalizeLocale(locale).replace('_', '-');
  }

  function applyDocumentLanguage(locale) {
    if (!document.documentElement) {
      return;
    }
    document.documentElement.lang = localeToHtmlLang(locale);
  }

  function getSystemLocale() {
    if (chrome && chrome.i18n && chrome.i18n.getUILanguage) {
      return normalizeLocale(chrome.i18n.getUILanguage());
    }
    return normalizeLocale(navigator.language || 'en');
  }

  function normalizeLanguageMode(mode) {
    const raw = String(mode || '').trim();
    if (!raw) {
      return 'system';
    }
    const lower = raw.toLowerCase();
    if (lower === 'system') {
      return 'system';
    }
    if (lower === 'en' || lower.startsWith('en-') || lower.startsWith('en_')) {
      return 'en';
    }
    if (lower === 'ja' || lower.startsWith('ja-') || lower.startsWith('ja_')) {
      return 'ja';
    }
    if (lower === 'zh-hk' || lower === 'zh_hk') {
      return 'zh-TW';
    }
    if (lower === 'zh-tw' || lower === 'zh_tw' || lower === 'zh-mo' || lower === 'zh_mo' || lower.includes('hant')) {
      return 'zh-TW';
    }
    if (lower === 'zh-cn' || lower === 'zh_cn' || lower === 'zh-hans' || lower === 'zh_hans' || lower.startsWith('zh')) {
      return 'zh-CN';
    }
    return 'system';
  }

  function loadLocaleMessages(locale) {
    const normalized = normalizeLocale(locale);
    const localePath = chrome && chrome.runtime && typeof chrome.runtime.getURL === 'function'
      ? chrome.runtime.getURL(`_locales/${normalized}/messages.json`)
      : `../../_locales/${normalized}/messages.json`;
    const fetchFromBackground = () => new Promise((resolve) => {
      if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        resolve({});
        return;
      }
      chrome.runtime.sendMessage({ action: 'getLocaleMessages', locale: normalized }, (response) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          resolve({});
          return;
        }
        resolve(response && response.messages ? response.messages : {});
      });
    });
    return fetch(localePath, { cache: 'no-store' })
      .then((response) => {
        if (!response || !response.ok) {
          throw new Error('locale fetch failed');
        }
        return response.json();
      })
      .catch(() => fetchFromBackground());
  }

  function applyLanguageMode(mode, options) {
    const requestId = ++languageApplyRequestId;
    const normalizedMode = normalizeLanguageMode(mode);
    currentLanguageMode = normalizedMode;
    const targetLocale = normalizedMode === 'system' ? getSystemLocale() : normalizeLocale(normalizedMode);
    applyDocumentLanguage(targetLocale);
    const shouldPersist = Boolean(options && options.persist);
    if (shouldPersist) {
      const payload = {
        [LANGUAGE_STORAGE_KEY]: normalizedMode
      };
      const localArea = chrome && chrome.storage ? chrome.storage.local : null;
      if (localArea) {
        localArea.set(payload);
      }
      if (storageArea) {
        storageArea.set(payload);
      }
    }
    loadLocaleMessages(targetLocale).then((messages) => {
      if (requestId !== languageApplyRequestId) {
        return;
      }
      currentMessages = messages || {};
      if (languageSelect) {
        setOptionsSelectState(languageSelect, normalizedMode);
        if (languageSelect.value !== normalizedMode) {
          setOptionsSelectState(languageSelect, 'system');
        }
      }
      applyI18n();
      renderOptionsInfoButtons();
      renderFeedbackSupport();
      refreshCustomSelects();
      scheduleTabsIndicatorsRefresh(2);
      setEditingState(editingSiteSearchKey);
      updateBuiltinResetTooltip();
      updateCustomClearTooltip();
      updateBlacklistClearTooltip();
      refreshSyncStatus();
      refreshShortcutsStatus();
      renderShortcutReferenceList();
      updateThemeButtons(currentThemeMode);
      setNewtabWidthTabState(currentNewtabWidthMode);
      setOverlaySizeTabState(currentOverlaySizeMode);
      setOverlayEnterAnimationTabState(currentOverlayEnterAnimation);
      setSearchResultPriorityTabState(currentSearchResultPriority);
      setRecentModeTabState(currentRecentMode);
      setRestrictedActionTabState(currentRestrictedAction);
      setNewtabTopContentTabState(currentNewtabTopContentMode);
      renderNewtabTimeFontWeightControl(currentNewtabTimeFontWeight);
      renderNewtabShortcutWidthControl(currentNewtabShortcutWidth);
      syncNewtabShortcutSubcontrolAvailability();
      renderRecentCountControl(currentRecentCount);
      renderBookmarkRowsControl(currentBookmarkCount);
      renderBookmarkColumnsControl(currentBookmarkColumns);
      renderSearchResultDisplayLimitControl(currentSearchResultDisplayLimit);
      renderSettingsNavigation(currentActiveSettingsTab);
      if (confirmCancel) confirmCancel.textContent = getMessage('confirm_cancel', '取消');
      if (confirmOk) confirmOk.textContent = getMessage('confirm_ok', '确认');
      renderSiteSearchList();
      renderSearchBlacklistList();
    });
  }

  function refreshShortcutsStatus() {
    if (!shortcutsStatus) return;
    shortcutsStatus.textContent = currentShortcutLabel
      ? (formatShortcutForDisplay(currentShortcutLabel) || currentShortcutLabel)
      : getMessage('settings_shortcuts_unset', '未设置');
  }

  function getDefaultFallbackShortcut() {
    return isMacPlatform ? 'Command+Shift+K' : 'Ctrl+Shift+K';
  }

  function isReservedBrowserShortcut(shortcut) {
    return false;
  }

  function normalizeShortcutKeyToken(rawKey) {
    const value = String(rawKey || '').trim();
    if (!value) {
      return '';
    }
    const lower = value.toLowerCase();
    const aliasMap = {
      tab: 'Tab',
      enter: 'Enter',
      return: 'Enter',
      esc: 'Escape',
      escape: 'Escape',
      space: 'Space',
      spacebar: 'Space',
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      comma: 'Comma',
      period: 'Period',
      slash: 'Slash',
      semicolon: 'Semicolon',
      quote: 'Quote',
      minus: 'Minus',
      plus: 'Plus',
      backslash: 'Backslash',
      backquote: 'Backquote',
      bracketleft: 'BracketLeft',
      bracketright: 'BracketRight'
    };
    if (aliasMap[lower]) {
      return aliasMap[lower];
    }
    if (/^f\d{1,2}$/.test(lower)) {
      return lower.toUpperCase();
    }
    if (value.length === 1) {
      const charMap = {
        ' ': 'Space',
        ',': 'Comma',
        '<': 'Comma',
        '.': 'Period',
        '>': 'Period',
        '/': 'Slash',
        '?': 'Slash',
        ';': 'Semicolon',
        ':': 'Semicolon',
        '\'': 'Quote',
        '"': 'Quote',
        '-': 'Minus',
        '_': 'Minus',
        '+': 'Plus',
        '\\': 'Backslash',
        '|': 'Backslash',
        '`': 'Backquote',
        '[': 'BracketLeft',
        '{': 'BracketLeft',
        ']': 'BracketRight',
        '}': 'BracketRight'
      };
      if (charMap[value]) {
        return charMap[value];
      }
      if (/^[a-z0-9]$/i.test(value)) {
        return value.toUpperCase();
      }
    }
    return '';
  }

  function getShortcutKeyTokenFromCode(rawCode) {
    const code = String(rawCode || '').trim();
    if (!code) {
      return '';
    }
    if (/^Key[A-Z]$/.test(code)) {
      return code.slice(3);
    }
    if (/^Digit[0-9]$/.test(code)) {
      return code.slice(5);
    }
    const codeMap = {
      Backquote: 'Backquote',
      Minus: 'Minus',
      Equal: 'Plus',
      BracketLeft: 'BracketLeft',
      BracketRight: 'BracketRight',
      Backslash: 'Backslash',
      Semicolon: 'Semicolon',
      Quote: 'Quote',
      Comma: 'Comma',
      Period: 'Period',
      Slash: 'Slash',
      Space: 'Space',
      Tab: 'Tab',
      Enter: 'Enter',
      Escape: 'Escape',
      ArrowUp: 'ArrowUp',
      ArrowDown: 'ArrowDown',
      ArrowLeft: 'ArrowLeft',
      ArrowRight: 'ArrowRight'
    };
    if (codeMap[code]) {
      return codeMap[code];
    }
    if (/^F\d{1,2}$/.test(code)) {
      return code;
    }
    return '';
  }

  function getShortcutKeyTokenFromEvent(event) {
    if (!event) {
      return '';
    }
    return getShortcutKeyTokenFromCode(event.code) || normalizeShortcutKeyToken(event.key);
  }

  function normalizeFallbackShortcut(value) {
    const text = String(value || '').trim();
    if (!text) {
      return '';
    }
    const parts = text
      .split('+')
      .map((token) => String(token || '').trim())
      .filter(Boolean);
    if (parts.length < 2) {
      return '';
    }
    const keyToken = normalizeShortcutKeyToken(parts.pop());
    if (!keyToken) {
      return '';
    }
    const modifierState = {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };
    for (const token of parts) {
      const lower = token.toLowerCase();
      if (lower === 'ctrl' || lower === 'control' || lower === 'macctrl') {
        modifierState.ctrl = true;
      } else if (lower === 'alt' || lower === 'option') {
        modifierState.alt = true;
      } else if (lower === 'shift') {
        modifierState.shift = true;
      } else if (lower === 'command' || lower === 'cmd' || lower === 'meta' || lower === 'super') {
        modifierState.meta = true;
      } else {
        return '';
      }
    }
    const hasModifier = modifierState.ctrl || modifierState.alt || modifierState.shift || modifierState.meta;
    if (!hasModifier) {
      return '';
    }
    const normalized = [];
    if (modifierState.ctrl) normalized.push('Ctrl');
    if (modifierState.alt) normalized.push('Alt');
    if (modifierState.shift) normalized.push('Shift');
    if (modifierState.meta) normalized.push('Command');
    normalized.push(keyToken);
    return normalized.join('+');
  }

  function buildShortcutFromEvent(event) {
    if (!event) {
      return '';
    }
    const key = String(event.key || '');
    if (!key || key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta' || key === 'AltGraph') {
      return '';
    }
    const keyToken = getShortcutKeyTokenFromEvent(event);
    if (!keyToken) {
      return '';
    }
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Command');
    if (modifiers.length === 0) {
      return '';
    }
    modifiers.push(keyToken);
    return modifiers.join('+');
  }

  function formatShortcutForDisplay(shortcut) {
    if (typeof shortcutDisplay.formatShortcutChord === 'function') {
      return shortcutDisplay.formatShortcutChord(shortcut, {
        platform: isMacPlatform ? 'mac' : 'windows'
      });
    }
    const normalized = normalizeFallbackShortcut(shortcut);
    if (!normalized) {
      return '';
    }
    const parts = normalized.split('+').filter(Boolean);
    if (parts.length === 0) {
      return normalized;
    }
    const keyToken = parts.pop();
    const modifierLabels = [];
    parts.forEach((token) => {
      if (!isMacPlatform) {
        modifierLabels.push(token);
      } else if (token === 'Ctrl') modifierLabels.push('⌃');
      else if (token === 'Alt') modifierLabels.push('⌥');
      else if (token === 'Shift') modifierLabels.push('⇧');
      else if (token === 'Command') modifierLabels.push('⌘');
    });
    const keyMap = isMacPlatform ? {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Enter: '↩',
      Escape: '⎋',
      Tab: '⇥',
      Space: 'Space',
      Comma: ',',
      Period: '.',
      Slash: '/',
      Semicolon: ';',
      Quote: '\'',
      Minus: '-',
      Plus: '+',
      Backslash: '\\',
      Backquote: '`',
      BracketLeft: '[',
      BracketRight: ']'
    } : {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→'
    };
    const keyLabel = keyMap[keyToken] || keyToken;
    return isMacPlatform
      ? `${modifierLabels.join('')}${keyLabel}`
      : `${modifierLabels.join('+')}+${keyLabel}`;
  }

  function getShortcutDisplayTokens(shortcut) {
    const normalized = normalizeFallbackShortcut(shortcut);
    if (!normalized) {
      return [];
    }
    const shouldUseMacSymbols = isMacPlatform && !FORCE_TEXT_KEYCAPS_ON_MAC;
    const parts = normalized.split('+').filter(Boolean);
    if (parts.length === 0) {
      return [];
    }
    const keyToken = parts.pop();
    const tokens = [];
    parts.forEach((token) => {
      if (!shouldUseMacSymbols) {
        tokens.push(token === 'Command' ? 'Cmd' : token);
        return;
      }
      if (token === 'Ctrl') tokens.push('⌃');
      else if (token === 'Alt') tokens.push('⌥');
      else if (token === 'Shift') tokens.push('⇧');
      else if (token === 'Command') tokens.push('⌘');
    });
    const keyMapMac = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Enter: '↩',
      Escape: '⎋',
      Tab: '⇥',
      Space: 'Space',
      Comma: ',',
      Period: '.',
      Slash: '/',
      Semicolon: ';',
      Quote: '\'',
      Minus: '-',
      Plus: '+',
      Backslash: '\\',
      Backquote: '`',
      BracketLeft: '[',
      BracketRight: ']'
    };
    const keyMapDefault = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Escape: 'Esc',
      Comma: ',',
      Period: '.',
      Slash: '/',
      Semicolon: ';',
      Quote: '\'',
      Minus: '-',
      Plus: '+',
      Backslash: '\\',
      Backquote: '`',
      BracketLeft: '[',
      BracketRight: ']'
    };
    const keyLabel = shouldUseMacSymbols
      ? (keyMapMac[keyToken] || keyToken)
      : (keyMapDefault[keyToken] || keyToken);
    tokens.push(keyLabel);
    return tokens.map((token) => {
      const text = String(token || '');
      return text.length > 1 ? text.toUpperCase() : text;
    });
  }

  function renderFallbackShortcutTokens(shortcut, animate) {
    if (!shortcutHotkeyController) {
      return;
    }
    const tokens = getShortcutDisplayTokens(shortcut);
    const emptyPlaceholder = isCapturingFallbackShortcut
      ? (fallbackShortcutInput ? (fallbackShortcutInput.getAttribute('placeholder') || '') : '')
      : getMessage('settings_shortcuts_empty_state', '无');
    shortcutHotkeyController.render({
      animate: Boolean(animate),
      placeholder: emptyPlaceholder,
      tokens
    });
  }

  function setFallbackShortcutLabel(value, animate) {
    currentShortcutLabel = value || '';
    if (fallbackShortcutInput) {
      fallbackShortcutInput.value = '';
    }
    renderFallbackShortcutTokens(currentShortcutLabel, animate);
    updateFallbackShortcutResetVisibility();
    refreshShortcutsStatus();
  }

  function updateFallbackShortcutResetVisibility() {
    if (!resetShortcutButton) {
      return;
    }
    const normalizedCurrent = normalizeFallbackShortcut(currentShortcutLabel || '');
    const normalizedDefault = normalizeFallbackShortcut(getDefaultFallbackShortcut());
    const canReset = normalizedCurrent !== normalizedDefault;
    resetShortcutButton.setAttribute('data-can-reset', canReset ? 'true' : 'false');
    if (canReset) {
      resetShortcutButton.removeAttribute('disabled');
    } else {
      resetShortcutButton.setAttribute('disabled', 'disabled');
    }
  }

  function stopFallbackShortcutCapture() {
    if (fallbackCaptureStopTimer) {
      clearTimeout(fallbackCaptureStopTimer);
      fallbackCaptureStopTimer = null;
    }
    isCapturingFallbackShortcut = false;
    cancelCaptureOnMouseLeave = false;
    if (fallbackShortcutWrap) {
      fallbackShortcutWrap.removeAttribute('data-capturing');
    }
    if (fallbackShortcutInput && document.activeElement === fallbackShortcutInput) {
      fallbackShortcutInput.blur();
    }
    if (!currentShortcutLabel) {
      renderFallbackShortcutTokens('');
    }
  }

  function stopFallbackShortcutCaptureDeferred(delayMs) {
    if (fallbackCaptureStopTimer) {
      clearTimeout(fallbackCaptureStopTimer);
      fallbackCaptureStopTimer = null;
    }
    fallbackCaptureStopTimer = setTimeout(() => {
      fallbackCaptureStopTimer = null;
      stopFallbackShortcutCapture();
    }, Math.max(0, Number(delayMs) || 0));
  }

  function persistFallbackShortcut(value, onDone) {
    if (!storageArea) {
      if (typeof onDone === 'function') {
        onDone(true);
      }
      return;
    }
    storageArea.set({ [FALLBACK_SHORTCUT_STORAGE_KEY]: value }, () => {
      const ok = !(chrome.runtime && chrome.runtime.lastError);
      if (typeof onDone === 'function') {
        onDone(ok);
      }
    });
  }


  function loadCurrentShortcut() {
    const defaultShortcut = getDefaultFallbackShortcut();
    if (!chrome || !chrome.commands || typeof chrome.commands.getAll !== 'function') {
      setFallbackShortcutLabel(defaultShortcut);
      return;
    }
    chrome.commands.getAll((commands) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        setFallbackShortcutLabel(defaultShortcut);
        return;
      }
      const items = Array.isArray(commands) ? commands : [];
      const command = items.find((item) => item && item.name === 'show-search');
      const shortcut = command && typeof command.shortcut === 'string'
        ? String(command.shortcut).trim()
        : '';
      const effectiveShortcut = shortcut || defaultShortcut;
      setFallbackShortcutLabel(effectiveShortcut);
    });
  }

  function getShortcutReferencePartLabel(part) {
    const text = String(part || '').trim();
    if (!text) {
      return '';
    }
    if (typeof shortcutDisplay.formatShortcutReferencePart === 'function') {
      return shortcutDisplay.formatShortcutReferencePart(text, {
        platform: isMacPlatform ? 'mac' : 'windows'
      });
    }
    const display = formatShortcutForDisplay(text);
    if (display) {
      return display;
    }
    const keyMap = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Escape: 'Esc',
      'Arrow keys': '↑↓←→',
      'release Alt': isMacPlatform ? '⌥↑' : 'Alt↑'
    };
    return keyMap[text] || text;
  }

  function getShortcutReferenceParts(shortcut) {
    const value = String(shortcut || '').trim();
    if (!value) {
      return [];
    }
    return value
      .split(/\s*\/\s*/)
      .map(getShortcutReferencePartLabel)
      .filter(Boolean);
  }

  function renderShortcutReferenceGroups(groups) {
    if (!shortcutReferenceList) {
      return;
    }
    const visibleGroups = groups.map((group) => ({
      ...group,
      items: (group.items || []).filter((item) => !(item && item.commandName === 'show-search'))
    })).filter((group) => group.items.length > 0);
    shortcutReferenceController.render({
      groups: visibleGroups.map((group) => ({
        id: group && group.id ? String(group.id) : '',
        titleKey: group && group.titleKey ? String(group.titleKey) : '',
        title: getMessage(group.titleKey, group.titleFallback || ''),
        items: group.items.map((item) => {
          const parts = getShortcutReferenceParts(item.shortcut || '');
          const customShortcutLabel = item.shortcutLabelKey
            ? formatTemplate(getMessage(
              item.shortcutLabelKey,
              item.shortcutLabelFallback || ''
            ), {
              modifier: isMacPlatform ? '⌘' : 'Ctrl'
            })
            : '';
          return {
            id: item && item.id ? String(item.id) : '',
            commandName: item && item.commandName ? String(item.commandName) : '',
            editable: Boolean(item && item.editable),
            titleKey: item && item.titleKey ? String(item.titleKey) : '',
            title: getMessage(item.titleKey, item.titleFallback || ''),
            shortcutEmpty: !customShortcutLabel && parts.length === 0,
            shortcutLabel: customShortcutLabel || (parts.length > 0
              ? parts.join(' / ')
              : getMessage('shortcut_reference_unset', '未设置'))
          };
        })
      }))
    });
  }

  function renderShortcutReferenceList() {
    if (!shortcutReferenceList || !globalThis.LumnoShortcutReference) {
      return;
    }
    const shortcutReference = globalThis.LumnoShortcutReference;
    const platform = isMacPlatform ? 'mac' : 'default';
    const renderWithCommands = (commands) => {
      const groups = shortcutReference.getShortcutReferenceGroups({
        commands,
        platform
      });
      renderShortcutReferenceGroups(groups);
    };
    if (!chrome || !chrome.commands || typeof chrome.commands.getAll !== 'function') {
      renderWithCommands(null);
      return;
    }
    chrome.commands.getAll((commands) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        renderWithCommands(null);
        return;
      }
      renderWithCommands(Array.isArray(commands) ? commands : null);
    });
  }

  function getSettingsNavigationItems() {
    return [
      {
        key: 'general',
        labelKey: 'settings_tab_general',
        label: getMessage('settings_tab_general', '常规'),
        iconClass: 'ri-icon ri-command-fill'
      },
      {
        key: 'account',
        labelKey: 'settings_tab_account',
        label: getMessage('settings_tab_account', '账号与同步'),
        iconClass: 'ri-icon ri-user-3-line'
      },
      {
        key: 'appearance',
        labelKey: 'settings_tab_appearance',
        label: getMessage('settings_tab_appearance', '外观'),
        iconClass: 'ri-icon ri-moon-clear-fill'
      },
      {
        key: 'shortcuts',
        labelKey: 'settings_tab_shortcuts',
        label: getMessage('settings_tab_shortcuts', '搜索源'),
        iconClass: 'ri-icon ri-search-line'
      },
      {
        key: 'blacklist',
        labelKey: 'settings_tab_blacklist',
        label: getMessage('settings_tab_blacklist', '黑名单'),
        iconClass: 'ri-icon ri-forbid-2-fill'
      },
      {
        key: 'labs',
        labelKey: 'settings_tab_labs',
        label: getMessage('settings_tab_labs', '实验室功能'),
        iconClass: 'ri-icon ri-test-tube-fill'
      }
    ];
  }

  function renderSettingsNavigation(tabKey) {
    settingsNavigationController.render({
      activeKey: tabKey,
      items: getSettingsNavigationItems()
    });
  }

  function normalizeSettingsTabKey(tabKey) {
    return SETTINGS_TAB_KEYS.includes(tabKey) ? tabKey : 'general';
  }

  function setActiveTab(tabKey) {
    const nextTabKey = normalizeSettingsTabKey(tabKey);
    cancelOptionsPanelHeightAnimation();
    currentActiveSettingsTab = nextTabKey;
    renderSettingsNavigation(nextTabKey);
    tabContents.forEach((content) => {
      const isActive = content.getAttribute('data-content') === nextTabKey;
      content.setAttribute('data-active', isActive ? 'true' : 'false');
    });
    requestAnimationFrame(updateTabIndicator);
    if (nextTabKey === 'appearance') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateThemeIndicator();
          updateRecentModeTabsIndicator();
          updateNewtabWidthTabsIndicator();
          updateOverlaySizeTabsIndicator();
          updateOverlayEnterAnimationTabsIndicator();
          updateNewtabTopContentTabsIndicator();
        });
      });
    }
    if (nextTabKey === 'general') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateRestrictedActionTabsIndicator();
          updateSearchResultPriorityTabsIndicator();
          syncFallbackShortcutWrapWidth();
          updateFallbackShortcutWrapWidthForContent();
        });
      });
    }
    if (nextTabKey) {
      const nextHash = `#${nextTabKey}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', nextHash);
      }
    }
  }

  function handleSettingsTabSelection(value) {
    const tabKey = normalizeSettingsTabKey(value);
    const currentTabKey = currentActiveSettingsTab;
    setActiveTab(tabKey);
    if (tabKey !== currentTabKey) {
      resetPageScrollToDefault();
    }
    if (tabKey === 'shortcuts') {
      refreshSiteSearchProviders();
    }
  }

  function measureTabIndicator() {
    if (!tabsContainer) return null;
    const liveIndicator = tabsContainer.querySelector('._x_extension_tabs_indicator_2024_unique_') || tabsIndicator;
    if (!liveIndicator) return null;
    const activeButton = tabsContainer.querySelector(
      '._x_extension_settings_tab_button_2024_unique_[data-active="true"]'
    );
    return measureTabsIndicator(tabsContainer, liveIndicator, activeButton, 4, tabsContainer.clientLeft);
  }

  function updateTabIndicator() {
    applyTabsIndicatorMeasurement(measureTabIndicator());
  }

  function updateTabsStickyVisualState() {
    if (!tabsRow) return;
    const stickyTop = parseFloat(window.getComputedStyle(tabsRow).top || '0') || 0;
    const isStuck = tabsRow.getBoundingClientRect().top <= stickyTop + 0.5;
    tabsRow.setAttribute('data-stuck', isStuck ? 'true' : 'false');
  }

  let optionsScrollFrame = 0;
  let optionsResizeFrame = 0;
  function scheduleOptionsScrollRefresh() {
    if (optionsScrollFrame) {
      return;
    }
    optionsScrollFrame = window.requestAnimationFrame(() => {
      optionsScrollFrame = 0;
      updateTabsStickyVisualState();
    });
  }

  function scheduleOptionsViewportLayoutRefresh() {
    if (optionsResizeFrame) {
      return;
    }
    optionsResizeFrame = window.requestAnimationFrame(() => {
      optionsResizeFrame = 0;
      updateTabsStickyVisualState();
      refreshAllTabsIndicators();
      syncFallbackShortcutWrapWidth();
    });
  }

  function resetPageScrollToDefault() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    updateTabsStickyVisualState();
  }

  function getOptionsRouteState() {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (!rawHash) {
      return {
        tabKey: '',
        targetKey: ''
      };
    }
    const parts = rawHash.split(':').map((part) => String(part || '').trim()).filter(Boolean);
    return {
      tabKey: parts[0] || '',
      targetKey: parts.slice(1).join(':')
    };
  }

  function getOptionsTargetElement(targetKey) {
    if (targetKey !== OPTIONS_TARGET_SITE_SEARCH_AI) {
      return null;
    }
    return siteSearchAiGroup || (siteSearchAiBuiltinList
      ? siteSearchAiBuiltinList.closest('._x_extension_shortcut_group_2024_unique_')
      : null);
  }

  function scrollToOptionsTarget(targetKey, options) {
    const target = getOptionsTargetElement(targetKey);
    if (!target || typeof target.scrollIntoView !== 'function') {
      return false;
    }
    const behavior = options && options.behavior ? options.behavior : 'smooth';
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior, block: 'start' });
      updateTabsStickyVisualState();
    });
    return true;
  }

  if (settingsVersion && chrome?.runtime?.getManifest) {
    const manifest = chrome.runtime.getManifest();
    if (manifest?.version) {
      settingsVersion.textContent = `v${manifest.version}`;
    }
    function getOpenDisposition(event, fallback) {
      if (typeof NAVIGATION_DISPOSITION.getDisposition === 'function') {
        return NAVIGATION_DISPOSITION.getDisposition(event, fallback);
      }
      return event && (event.metaKey || event.ctrlKey || Number(event.button) === 1)
        ? 'backgroundTab'
        : (fallback || 'newTab');
    }
    function openSettingsVersionRelease(event) {
      event.preventDefault();
      event.stopPropagation();
      if (!chrome?.runtime?.sendMessage) {
        return;
      }
      chrome.runtime.sendMessage({
        action: 'openReleasePage',
        reason: 'options-version',
        disposition: getOpenDisposition(event, 'newTab')
      }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          return;
        }
      });
    }
    settingsVersion.addEventListener('click', openSettingsVersionRelease);
    settingsVersion.addEventListener('auxclick', (event) => {
      if (!event || Number(event.button) !== 1) {
        return;
      }
      openSettingsVersionRelease(event);
    });
  }

  function applyResolvedTheme(resolvedTheme) {
    document.body.setAttribute('data-theme', resolvedTheme);
    panel.setAttribute('data-theme', resolvedTheme);
    document.documentElement.style.colorScheme = resolvedTheme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', resolvedTheme === 'dark' ? '#111111' : '#f1f5f9');
    }
  }

  function resolveTheme(mode) {
    if (mode === 'dark') {
      return 'dark';
    }
    if (mode === 'light') {
      return 'light';
    }
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function getThemeStorageUpdate(mode) {
    if (SETTINGS && typeof SETTINGS.createGlobalThemeModeStorageUpdate === 'function') {
      return SETTINGS.createGlobalThemeModeStorageUpdate(mode);
    }
    const nextMode = mode === 'dark' || mode === 'light' ? mode : 'system';
    return {
      [THEME_STORAGE_KEY]: nextMode
    };
  }

  function updateThemeButtons(mode) {
    const nextMode = mode === 'dark' || mode === 'light' ? mode : 'system';
    currentThemeMode = nextMode;
    updateOverlayPageThemeAdaptationVisibility(nextMode);
    themePickerController.render({
      activeMode: nextMode,
      options: [
        {
          mode: 'system',
          labelKey: 'settings_theme_system',
          label: getMessage('settings_theme_system', '跟随系统'),
          previewSrc: '../../assets/images/system.svg'
        },
        {
          mode: 'light',
          labelKey: 'settings_theme_light',
          label: getMessage('settings_theme_light', '浅色'),
          previewSrc: '../../assets/images/light.svg'
        },
        {
          mode: 'dark',
          labelKey: 'settings_theme_dark',
          label: getMessage('settings_theme_dark', '深色'),
          previewSrc: '../../assets/images/dark.svg'
        }
      ]
    });
    requestAnimationFrame(updateThemeIndicator);
  }

  function updateOverlayPageThemeAdaptationVisibility(mode) {
    const nextMode = mode === 'dark' || mode === 'light' ? mode : 'system';
    const visible = nextMode === 'system';
    if (!overlayPageThemeAdaptationRow) {
      document.documentElement.setAttribute('data-options-theme-mode', nextMode);
      return;
    }
    animateOptionsPanelHeight(() => {
      document.documentElement.setAttribute('data-options-theme-mode', nextMode);
      return setConditionalSettingsElementVisibility(overlayPageThemeAdaptationRow, visible);
    });
  }

  function measureThemeIndicator() {
    if (!themePicker || !themeIndicator) return null;
    const activeButton = themeButtons.find((button) => button.getAttribute('data-active') === 'true');
    return measureTabsIndicator(themePicker, themeIndicator, activeButton, 3, 0);
  }

  function updateThemeIndicator() {
    applyTabsIndicatorMeasurement(measureThemeIndicator());
  }

  function onMediaChange() {
    if (!storageArea) {
      return;
    }
    storageArea.get([THEME_STORAGE_KEY], (result) => {
      const mode = result[THEME_STORAGE_KEY] || 'system';
      if (mode === 'system') {
        applyResolvedTheme(resolveTheme(mode));
      }
    });
  }

  function setThemeMode(mode) {
    if (!storageArea) {
      return;
    }
    const updates = getThemeStorageUpdate(mode);
    const nextMode = updates[THEME_STORAGE_KEY];
    cacheOptionsThemeMode(nextMode);
    storageArea.set(updates, () => {
      updateThemeButtons(nextMode);
      applyResolvedTheme(resolveTheme(nextMode));
      if (nextMode === 'system' && !mediaListenerAttached) {
        mediaQuery.addEventListener('change', onMediaChange);
        mediaListenerAttached = true;
        return;
      }
      if (nextMode !== 'system' && mediaListenerAttached) {
        mediaQuery.removeEventListener('change', onMediaChange);
        mediaListenerAttached = false;
      }
    });
  }

  function getStoredThemeMode() {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve('system');
        return;
      }
      storageArea.get([THEME_STORAGE_KEY], (result) => {
        resolve((result && result[THEME_STORAGE_KEY]) || 'system');
      });
    });
  }

  function cacheOptionsThemeMode(mode) {
    const nextMode = mode === 'dark' || mode === 'light' ? mode : 'system';
    try {
      if (window.localStorage) {
        window.localStorage.setItem(OPTIONS_THEME_PRELOAD_STORAGE_KEY, nextMode);
      }
    } catch (e) {
      // The early theme preloader falls back to the system theme when caching is unavailable.
    }
  }

  async function initTheme() {
    let ready = false;
    const fallbackTimer = setTimeout(() => {
      if (ready) {
        return;
      }
      applyResolvedTheme(resolveTheme('system'));
      document.documentElement.setAttribute('data-theme-ready', 'true');
    }, 800);
    try {
      const storedMode = await getStoredThemeMode();
      cacheOptionsThemeMode(storedMode);
      updateThemeButtons(storedMode);
      applyResolvedTheme(resolveTheme(storedMode));
      if (storedMode === 'system' && !mediaListenerAttached) {
        mediaQuery.addEventListener('change', onMediaChange);
        mediaListenerAttached = true;
      }
      ready = true;
      clearTimeout(fallbackTimer);
      document.documentElement.setAttribute('data-theme-ready', 'true');
    } catch (e) {
      ready = true;
      clearTimeout(fallbackTimer);
      applyResolvedTheme(resolveTheme('system'));
      document.documentElement.setAttribute('data-theme-ready', 'true');
    }
  }

  initTheme();

  function playThemeOptionClickEffect(button) {
    if (!button) {
      return;
    }
    button.classList.remove('x-theme-clicking');
    void button.offsetWidth;
    button.classList.add('x-theme-clicking');
    window.setTimeout(() => {
      button.classList.remove('x-theme-clicking');
    }, 260);
  }

  themeButtons.forEach((button) => {
    button.addEventListener('click', function() {
      playThemeOptionClickEffect(button);
      setThemeMode(button.getAttribute('data-mode'));
    });
  });

  if (!storageArea) {
    applyLanguageMode('system');
  }
  initTooltips();

  function getInitialTabKey() {
    const routeState = getOptionsRouteState();
    const tabKey = routeState.tabKey;
    if (!tabKey) {
      return 'general';
    }
    return SETTINGS_TAB_KEYS.includes(tabKey) ? tabKey : 'general';
  }

  function getInitialOptionsTargetKey() {
    const routeState = getOptionsRouteState();
    return routeState.targetKey || '';
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', function() {
      handleSettingsTabSelection(button.getAttribute('data-tab'));
    });
  });

  const initialTab = getInitialTabKey();
  pendingOptionsScrollTarget = initialTab === 'shortcuts' ? getInitialOptionsTargetKey() : '';
  setActiveTab(initialTab);
  if (initialTab === 'shortcuts') {
    refreshSiteSearchProviders();
  }
  scheduleTabsIndicatorsRefresh(2);
  if (document.fonts && typeof document.fonts.ready === 'object' && typeof document.fonts.ready.then === 'function') {
    document.fonts.ready.then(() => {
      scheduleTabsIndicatorsRefresh(2);
    });
  }
  window.addEventListener('scroll', scheduleOptionsScrollRefresh, { passive: true });
  updateTabsStickyVisualState();
  window.addEventListener('resize', scheduleOptionsViewportLayoutRefresh, { passive: true });
  migrateStorageIfNeeded(SYNC_KEYS);
  refreshSyncStatus();

  function normalizeSiteSearchTemplate(template) {
    if (typeof SEARCH_UTILS.normalizeSiteSearchTemplate === 'function') {
      return SEARCH_UTILS.normalizeSiteSearchTemplate(template);
    }
    return String(template || '')
      .trim()
      .replace(/\{\{\{s\}\}\}/g, '{query}')
      .replace(/\{s\}/g, '{query}')
      .replace(/\{searchTerms\}/g, '{query}');
  }

  function hasOpenAndSubmitSiteSearchAction(item) {
    if (typeof SEARCH_UTILS.hasOpenAndSubmitSiteSearchAction === 'function') {
      return SEARCH_UTILS.hasOpenAndSubmitSiteSearchAction(item);
    }
    return Boolean(
      item &&
      String(item.action || '').trim() === 'openAndSubmit'
    );
  }

  function isAiSiteSearchProvider(item) {
    if (typeof SEARCH_UTILS.isAiSiteSearchProvider === 'function') {
      return SEARCH_UTILS.isAiSiteSearchProvider(item);
    }
    if (!item) {
      return false;
    }
    if (String(item.category || '').trim() === 'aiSearch') {
      return true;
    }
    if (hasOpenAndSubmitSiteSearchAction(item)) {
      return true;
    }
    const template = normalizeSiteSearchTemplate(String(item.template || '').trim());
    return Boolean(template) && !template.includes('{query}');
  }

  function isSearchEngineSiteSearchProvider(item) {
    if (typeof SEARCH_UTILS.isSearchEngineSiteSearchProvider === 'function') {
      return SEARCH_UTILS.isSearchEngineSiteSearchProvider(item);
    }
    return Boolean(item && String(item.category || '').trim() === 'searchEngine');
  }

  function normalizeSiteSearchProvider(item, baseItem) {
    if (typeof SEARCH_UTILS.normalizeSiteSearchProvider === 'function') {
      return SEARCH_UTILS.normalizeSiteSearchProvider(item, baseItem);
    }
    if (!item && !baseItem) {
      return null;
    }
    const key = String((item && item.key) || (baseItem && baseItem.key) || '').trim();
    const template = normalizeSiteSearchTemplate(
      String((item && item.template) || (baseItem && baseItem.template) || '').trim()
    );
    if (!key || !template) {
      return null;
    }
    if (!template.includes('{query}') && !isAiSiteSearchProvider({
      ...(baseItem || {}),
      ...(item || {}),
      key,
      template
    })) {
      return null;
    }
    const aliasSource = Array.isArray(item && item.aliases)
      ? item.aliases
      : (Array.isArray(baseItem && baseItem.aliases) ? baseItem.aliases : []);
    const provider = {
      key,
      aliases: aliasSource.filter(Boolean),
      name: String((item && item.name) || (baseItem && baseItem.name) || key).trim() || key,
      template,
      action: String((item && item.action) || (baseItem && baseItem.action) || '').trim(),
      submitStrategy: String(
        (item && item.submitStrategy) || (baseItem && baseItem.submitStrategy) || ''
      ).trim(),
      category: String(
        (item && item.category) || (baseItem && baseItem.category) || ''
      ).trim(),
      disabled: Boolean(item && item.disabled),
      disabledReason: String((item && item.disabledReason) || '').trim(),
      icon: String((item && item.icon) || (baseItem && baseItem.icon) || '').trim(),
      iconUrl: String((item && item.iconUrl) || (baseItem && baseItem.iconUrl) || '').trim()
    };
    const builtinKey = String(
      (item && item.builtinKey) || (baseItem && baseItem.builtinKey) || ''
    ).trim().toLowerCase();
    if (builtinKey) {
      provider.builtinKey = builtinKey;
    }
    return provider;
  }

  function findSiteSearchKeyConflict(key, allowedKey) {
    const normalizedKey = String(key || '').trim().toLowerCase();
    const normalizedAllowedKey = String(allowedKey || '').trim().toLowerCase();
    if (!normalizedKey || normalizedKey === normalizedAllowedKey) {
      return null;
    }
    const providers = defaultSiteSearchProviders.concat(customSiteSearchProviders);
    if (typeof SEARCH_UTILS.findSiteSearchProviderKeyConflict === 'function') {
      return SEARCH_UTILS.findSiteSearchProviderKeyConflict(
        normalizedKey,
        providers,
        normalizedAllowedKey
      );
    }
    if (typeof SEARCH_UTILS.findSiteSearchProviderByKey === 'function') {
      return SEARCH_UTILS.findSiteSearchProviderByKey(normalizedKey, providers);
    }
    return providers.find(
      (provider) => String(provider && provider.key ? provider.key : '').trim().toLowerCase() === normalizedKey
    ) || null;
  }

  function isDuplicateTemplate(template, defaults) {
    const normalized = normalizeSiteSearchTemplate(String(template || '').trim());
    if (!normalized) {
      return false;
    }
    return (defaults || []).some((item) => normalizeSiteSearchTemplate(String(item.template || '').trim()) === normalized);
  }

  function getSiteSearchBuiltinKey(item) {
    return String(item && item.builtinKey ? item.builtinKey : '').trim().toLowerCase();
  }

  function getActiveBuiltinSiteSearchProviders(defaults, custom, disabledKeys) {
    const customKeys = new Set((custom || []).map((item) => (
      String(item && item.key ? item.key : '').trim().toLowerCase()
    )).filter(Boolean));
    const disabled = disabledKeys instanceof Set
      ? disabledKeys
      : new Set(Array.from(disabledKeys || []).map((key) => String(key || '').toLowerCase()));
    return (defaults || []).filter((item) => {
      const key = String(item && item.key ? item.key : '').trim().toLowerCase();
      return key && !customKeys.has(key) && !disabled.has(key);
    });
  }

  function normalizeAliases(input) {
    if (!input) {
      return [];
    }
    return Array.from(new Set(
      input
        .split(/[,，]/)
        .map((alias) => alias.trim())
        .filter(Boolean)
    ));
  }

  function setSiteSearchError(message) {
    if (!siteSearchError) {
      return;
    }
    if (!message) {
      siteSearchError.textContent = '';
      siteSearchError.style.display = 'none';
      return;
    }
    siteSearchError.textContent = message;
    siteSearchError.style.display = 'block';
  }

  function setLegacySiteSearchDraftCategory(category) {
    siteSearchDraftCategory = category === 'searchEngine' ? 'searchEngine' : 'site';
    siteSearchCategoryButtons.forEach((button) => {
      const active = button.dataset.siteSearchCategory === siteSearchDraftCategory;
      button.dataset.active = active ? 'true' : 'false';
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const indicator = siteSearchCategoryButtons[0]
      ? siteSearchCategoryButtons[0].parentElement?.querySelector(
          '._x_extension_theme_indicator_2024_unique_'
        )
      : null;
    if (indicator) {
      indicator.dataset.category = siteSearchDraftCategory;
    }
  }

  function setSiteSearchFormExpanded(expanded) {
    siteSearchFormExpanded = Boolean(expanded);
    if (siteSearchForm) {
      siteSearchForm.setAttribute('data-expanded', siteSearchFormExpanded ? 'true' : 'false');
    }
    if (siteSearchFormTrigger) {
      siteSearchFormTrigger.setAttribute('aria-expanded', siteSearchFormExpanded ? 'true' : 'false');
    }
    if (siteSearchCancelButton) {
      siteSearchCancelButton.style.display = siteSearchFormExpanded ? 'inline-flex' : 'none';
      if (siteSearchCancelButton.textContent) {
        siteSearchCancelButton.textContent = getMessage('shortcuts_cancel', siteSearchCancelButton.textContent);
      }
    }
    if (siteSearchFormExpanded && siteSearchKeyInput) {
      siteSearchKeyInput.focus();
    }
  }

  function setEditingState(key) {
    editingSiteSearchKey = key;
    if (siteSearchAddButton) {
      siteSearchAddButton.textContent = key
        ? getMessage('shortcuts_save', '保存修改')
        : getMessage('shortcuts_add', '添加自定义搜索');
      siteSearchAddButton.classList.add('_x_extension_shortcut_save_2024_unique_');
    }
  }

  function insertSiteSearchQueryToken() {
    if (!siteSearchTemplateInput) {
      return;
    }
    const token = '{query}';
    const currentValue = String(siteSearchTemplateInput.value || '');
    const existingIndex = currentValue.indexOf(token);
    if (existingIndex >= 0) {
      const nextCursor = existingIndex + token.length;
      siteSearchTemplateInput.focus();
      if (typeof siteSearchTemplateInput.setSelectionRange === 'function') {
        siteSearchTemplateInput.setSelectionRange(nextCursor, nextCursor);
      }
      return;
    }
    const selectionStart = Number.isInteger(siteSearchTemplateInput.selectionStart)
      ? siteSearchTemplateInput.selectionStart
      : currentValue.length;
    const selectionEnd = Number.isInteger(siteSearchTemplateInput.selectionEnd)
      ? siteSearchTemplateInput.selectionEnd
      : selectionStart;
    const safeStart = Math.max(0, Math.min(selectionStart, currentValue.length));
    const safeEnd = Math.max(safeStart, Math.min(selectionEnd, currentValue.length));
    const nextValue = `${currentValue.slice(0, safeStart)}${token}${currentValue.slice(safeEnd)}`;
    const nextCursor = safeStart + token.length;
    siteSearchTemplateInput.value = nextValue;
    siteSearchTemplateInput.focus();
    if (typeof siteSearchTemplateInput.setSelectionRange === 'function') {
      siteSearchTemplateInput.setSelectionRange(nextCursor, nextCursor);
    }
    siteSearchTemplateInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function attachSaveButtonAnimation(button) {
    if (!button) {
      return;
    }
    button.addEventListener('click', () => {
      if (!button.classList.contains('_x_extension_shortcut_save_2024_unique_')) {
        return;
      }
      button.classList.remove('_x_extension_shortcut_save_pulse_2024_unique_');
      void button.offsetWidth;
      button.classList.add('_x_extension_shortcut_save_pulse_2024_unique_');
    });
    button.addEventListener('animationend', () => {
      button.classList.remove('_x_extension_shortcut_save_pulse_2024_unique_');
    });
  }

  function suspendSiteSearchRefresh(durationMs) {
    const now = Date.now();
    siteSearchRefreshSuppressUntil = Math.max(siteSearchRefreshSuppressUntil, now + durationMs);
  }

  if (languageSelect) {
    languageSelect.addEventListener('change', () => {
      const next = languageSelect.value || 'system';
      applyLanguageMode(next, { persist: true });
    });
  }

  if (newtabWidthSelect) {
    newtabWidthSelect.addEventListener('change', () => {
      handleNewtabWidthSelection(newtabWidthSelect.value);
    });
  }
  if (newtabWidthTabButtons.length > 0) {
    newtabWidthTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleNewtabWidthSelection(button.getAttribute('data-newtab-width'));
      });
    });
  }
  if (overlaySizeTabButtons.length > 0) {
    overlaySizeTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleOverlaySizeSelection(button.getAttribute('data-overlay-size'));
      });
    });
  }
  if (overlayEnterAnimationTabButtons.length > 0) {
    overlayEnterAnimationTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleOverlayEnterAnimationSelection(button.getAttribute('data-overlay-enter-animation'));
      });
    });
  }
  if (searchResultPrioritySelect) {
    searchResultPrioritySelect.addEventListener('change', () => {
      handleSearchResultPrioritySelection(searchResultPrioritySelect.value);
    });
  }
  if (searchResultPriorityTabButtons.length > 0) {
    searchResultPriorityTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleSearchResultPrioritySelection(button.getAttribute('data-search-result-priority'));
      });
    });
  }
  if (searchResultSourceTypeInputs.length > 0) {
    searchResultSourceTypeInputs.forEach((input) => {
      input.addEventListener('change', () => {
        persistSearchResultSourceTypes(collectCheckedSearchResultSourceTypes());
      });
    });
  }
  if (overlayOpenTabsDefaultVisibleToggle) {
    overlayOpenTabsDefaultVisibleToggle.addEventListener('change', () => {
      const next = normalizeOverlayOpenTabsDefaultVisible(overlayOpenTabsDefaultVisibleToggle.checked);
      setOptionsToggleState(overlayOpenTabsDefaultVisibleToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY]: next });
    });
  }
  if (overlayPageThemeAdaptationToggle) {
    overlayPageThemeAdaptationToggle.addEventListener('change', () => {
      const next = normalizeOverlayPageThemeAdaptationEnabled(
        overlayPageThemeAdaptationToggle.checked
      );
      setOptionsToggleState(overlayPageThemeAdaptationToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (faviconEnhancedFetchToggle) {
    faviconEnhancedFetchToggle.addEventListener('change', () => {
      const next = normalizeFaviconEnhancedFetchEnabled(faviconEnhancedFetchToggle.checked);
      setOptionsToggleState(faviconEnhancedFetchToggle, next);
      setFaviconBlacklistEditorEnabled(next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (recentModeSelect) {
    recentModeSelect.addEventListener('change', () => {
      handleRecentModeSelection(recentModeSelect.value);
    });
  }
  if (recentModeTabButtons.length > 0) {
    recentModeTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleRecentModeSelection(button.getAttribute('data-recent-mode'));
      });
    });
  }
  if (bookmarkFolderIconsVisibleToggle) {
    bookmarkFolderIconsVisibleToggle.addEventListener('change', () => {
      const next = normalizeBookmarkFolderIconsVisible(bookmarkFolderIconsVisibleToggle.checked);
      setOptionsToggleState(bookmarkFolderIconsVisibleToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY]: next });
    });
  }
  if (overlayTabQuickSwitchToggle) {
    overlayTabQuickSwitchToggle.addEventListener('change', () => {
      const next = Boolean(overlayTabQuickSwitchToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [OVERLAY_TAB_PRIORITY_STORAGE_KEY]: next });
    });
  }
  if (newtabTimeSecondsToggle) {
    newtabTimeSecondsToggle.addEventListener('change', () => {
      const next = normalizeNewtabTimeSecondsVisible(newtabTimeSecondsToggle.checked);
      setOptionsToggleState(newtabTimeSecondsToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY]: next });
    });
  }
  if (newtabInputAutoFocusToggle) {
    newtabInputAutoFocusToggle.addEventListener('change', () => {
      const next = normalizeNewtabInputAutoFocusEnabled(newtabInputAutoFocusToggle.checked);
      setOptionsToggleState(newtabInputAutoFocusToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (newtabShortcutsToggle) {
    newtabShortcutsToggle.addEventListener('change', () => {
      const next = normalizeNewtabShortcutsVisible(newtabShortcutsToggle.checked);
      setOptionsToggleState(newtabShortcutsToggle, next);
      syncNewtabShortcutSubcontrolAvailability();
      if (storageArea) {
        storageArea.set({ [NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY]: next });
      }
    });
  }
  if (newtabShortcutAddToggle) {
    newtabShortcutAddToggle.addEventListener('change', () => {
      const next = normalizeNewtabShortcutAddVisible(newtabShortcutAddToggle.checked);
      setOptionsToggleState(newtabShortcutAddToggle, next);
      if (storageArea) {
        storageArea.set({ [NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY]: next });
      }
    });
  }
  if (newtabShortcutDockMagnificationToggle) {
    newtabShortcutDockMagnificationToggle.addEventListener('change', () => {
      const next = normalizeNewtabShortcutDockMagnificationEnabled(
        newtabShortcutDockMagnificationToggle.checked
      );
      setOptionsToggleState(newtabShortcutDockMagnificationToggle, next);
      if (storageArea) {
        storageArea.set({
          [NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY]: next
        });
      }
    });
  }
  [
    [
      newtabFeedbackButtonVisibleToggle,
      NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
      normalizeNewtabFeedbackButtonVisible
    ],
    [
      newtabAppearanceButtonVisibleToggle,
      NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
      normalizeNewtabAppearanceButtonVisible
    ]
  ].forEach(([toggle, storageKey, normalize]) => {
    if (!toggle) {
      return;
    }
    toggle.addEventListener('change', () => {
      const next = normalize(toggle.checked);
      setOptionsToggleState(toggle, next);
      if (storageArea) {
        storageArea.set({ [storageKey]: next });
      }
    });
  });
  if (updateNoticeToggle) {
    updateNoticeToggle.addEventListener('change', () => {
      const next = normalizeUpdateNoticeEnabled(updateNoticeToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [UPDATE_NOTICE_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (motionEffectsToggle) {
    motionEffectsToggle.addEventListener('change', () => {
      const next = normalizeMotionEffectsEnabled(motionEffectsToggle.checked);
      setOptionsToggleState(motionEffectsToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [MOTION_EFFECTS_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (simpleModeToggle) {
    simpleModeToggle.addEventListener('change', () => {
      const next = normalizeSimpleModeEnabled(simpleModeToggle.checked);
      setOptionsToggleState(simpleModeToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [SIMPLE_MODE_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (numberShortcutInstantToggle) {
    numberShortcutInstantToggle.addEventListener('change', () => {
      const next = normalizeNumberShortcutInstantEnabled(numberShortcutInstantToggle.checked);
      setOptionsToggleState(numberShortcutInstantToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (macosCtrlSuggestionNavigationToggle) {
    macosCtrlSuggestionNavigationToggle.addEventListener('change', () => {
      const next = normalizeMacosCtrlSuggestionNavigationEnabled(
        macosCtrlSuggestionNavigationToggle.checked
      );
      setOptionsToggleState(macosCtrlSuggestionNavigationToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (autoPipToggle) {
    autoPipToggle.addEventListener('change', () => {
      const next = Boolean(autoPipToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [AUTO_PIP_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (tabSwitcherToggle) {
    tabSwitcherToggle.addEventListener('change', () => {
      const next = normalizeTabSwitcherEnabled(tabSwitcherToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [TAB_SWITCHER_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (documentPipToggle) {
    documentPipToggle.addEventListener('change', () => {
      const next = Boolean(documentPipToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [DOCUMENT_PIP_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (pinnedTabRecoveryToggle) {
    pinnedTabRecoveryToggle.addEventListener('change', () => {
      const next = Boolean(pinnedTabRecoveryToggle.checked);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (selectionQuickActionsToggle) {
    selectionQuickActionsToggle.addEventListener('change', () => {
      const next = normalizeSelectionQuickActionsEnabled(selectionQuickActionsToggle.checked);
      setOptionsToggleState(selectionQuickActionsToggle, next);
      syncSelectionQuickActionsProviderAvailability();
      if (!storageArea) {
        return;
      }
      storageArea.set({ [SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY]: next });
    });
  }
  if (selectionQuickActionsProviderSelect) {
    selectionQuickActionsProviderSelect.addEventListener('change', () => {
      const next = normalizeSelectionQuickActionsProvider(selectionQuickActionsProviderSelect.value);
      setOptionsSelectState(selectionQuickActionsProviderSelect, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY]: next });
    });
  }
  if (selectionQuickActionsGroupToggle) {
    selectionQuickActionsGroupToggle.addEventListener('change', () => {
      const next = normalizeSelectionQuickActionsGroupEnabled(selectionQuickActionsGroupToggle.checked);
      setOptionsToggleState(selectionQuickActionsGroupToggle, next);
      if (!storageArea) {
        return;
      }
      storageArea.set({ [SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY]: next });
    });
  }

  if (restrictedActionSelect) {
    restrictedActionSelect.addEventListener('change', () => {
      handleRestrictedActionSelection(restrictedActionSelect.value);
    });
  }
  if (restrictedActionTabButtons.length > 0) {
    restrictedActionTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        handleRestrictedActionSelection(button.getAttribute('data-restricted-action'));
      });
    });
  }

  function openExtensionShortcutsPage() {
    chrome.runtime.sendMessage({ action: 'openExtensionShortcutsPage' }, (response) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        showToast(getMessage('toast_error', '操作失败，请重试'), true);
        return;
      }
      if (!response || response.ok === false) {
        showToast(getMessage('toast_error', '操作失败，请重试'), true);
      }
    });
  }
  if (openShortcutsPageButton) {
    openShortcutsPageButton.addEventListener('click', openExtensionShortcutsPage);
  }
  if (openOnboardingPageButton) {
    openOnboardingPageButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openOnboardingPage' }, (response) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
          return;
        }
        if (!response || response.ok === false) {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        }
      });
    });
  }

  if (fallbackShortcutInput) {
    const handleFallbackShortcutKeydown = (event) => {
      if (!event) {
        return;
      }
      if (event.key === 'Tab') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Escape') {
        fallbackShortcutInput.value = '';
        renderFallbackShortcutTokens(currentShortcutLabel || getDefaultFallbackShortcut());
        stopFallbackShortcutCapture();
        return;
      }
      const nextShortcut = buildShortcutFromEvent(event);
      if (nextShortcut) {
        fallbackShortcutInput.value = '';
        const normalized = normalizeFallbackShortcut(nextShortcut);
        if (!normalized) {
          return;
        }
        if (isReservedBrowserShortcut(normalized)) {
          showToast(getMessage('settings_shortcuts_invalid', '快捷键无效，请按组合键（如 Ctrl+K）'), true);
          renderFallbackShortcutTokens(currentShortcutLabel || '');
          return;
        }
        if (normalized === currentShortcutLabel) {
          renderFallbackShortcutTokens(normalized, true);
          stopFallbackShortcutCaptureDeferred(260);
          return;
        }
        setFallbackShortcutLabel(normalized, true);
        persistFallbackShortcut(normalized, (ok) => {
          if (!ok) {
            showToast(getMessage('toast_error', '操作失败，请重试'), true);
          }
        });
        stopFallbackShortcutCaptureDeferred(260);
      }
    };
    const captureWindowKeydown = (event) => {
      if (!isCapturingFallbackShortcut) {
        return;
      }
      handleFallbackShortcutKeydown(event);
    };
    window.addEventListener('keydown', captureWindowKeydown, true);
    if (fallbackShortcutWrap) {
      fallbackShortcutWrap.addEventListener('pointerdown', (event) => {
        const target = event && event.target;
        if (target && target.closest && target.closest('button')) {
          return;
        }
        event.preventDefault();
        fallbackShortcutInput.focus();
      });
      fallbackShortcutWrap.addEventListener('mouseleave', () => {
        if (!cancelCaptureOnMouseLeave) {
          return;
        }
        cancelCaptureOnMouseLeave = false;
        stopFallbackShortcutCapture();
      });
    }
    fallbackShortcutInput.addEventListener('focus', () => {
      isCapturingFallbackShortcut = true;
      if (fallbackShortcutWrap) {
        fallbackShortcutWrap.setAttribute('data-capturing', 'true');
      }
      fallbackShortcutInput.value = '';
      if (!currentShortcutLabel) {
        renderFallbackShortcutTokens('');
      }
    });
    fallbackShortcutInput.addEventListener('blur', () => {
      stopFallbackShortcutCapture();
    });
    fallbackShortcutInput.addEventListener('input', () => {
      fallbackShortcutInput.value = '';
    });
    fallbackShortcutInput.addEventListener('keydown', handleFallbackShortcutKeydown);
  }

  if (clearShortcutButton) {
    clearShortcutButton.addEventListener('click', () => {
      setFallbackShortcutLabel('');
      persistFallbackShortcut('', (ok) => {
        if (!ok) {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        }
      });
      cancelCaptureOnMouseLeave = true;
      if (fallbackShortcutInput) {
        fallbackShortcutInput.focus();
      }
    });
  }

  if (resetShortcutButton) {
    resetShortcutButton.addEventListener('click', () => {
      const defaultShortcut = getDefaultFallbackShortcut();
      setFallbackShortcutLabel(defaultShortcut, true);
      persistFallbackShortcut(defaultShortcut, (ok) => {
        if (!ok) {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        }
      });
      cancelCaptureOnMouseLeave = true;
      if (fallbackShortcutInput) {
        fallbackShortcutInput.focus();
      }
    });
  }

  loadCurrentShortcut();
  renderShortcutReferenceList();
  requestAnimationFrame(syncFallbackShortcutWrapWidth);
  window.addEventListener('focus', () => {
    loadCurrentShortcut();
    renderShortcutReferenceList();
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      loadCurrentShortcut();
      renderShortcutReferenceList();
    }
  }, true);

  if (syncNowButton) {
    syncNowButton.addEventListener('click', () => {
      if (!storageArea || getActivePrimaryAreaName() !== 'sync') {
        updateSyncStatusText('sync_status_unavailable', '同步不可用');
        return;
      }
      const isRotated = syncNowButton.getAttribute('data-rotated') === 'true';
      syncNowButton.setAttribute('data-rotated', isRotated ? 'false' : 'true');
      storageArea.get(SYNC_KEYS, (result) => {
        const payload = {};
        SYNC_KEYS.forEach((key) => {
          if (typeof result[key] !== 'undefined') {
            payload[key] = result[key];
          }
        });
        payload[SYNC_META_KEY] = {
          lastSyncAt: Date.now(),
          source: 'manual'
        };
        storageArea.set(payload, () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            const reason = chrome.runtime && chrome.runtime.lastError
              ? chrome.runtime.lastError.message
              : '';
            setTimeout(() => {
              showToast(formatTemplate(getMessage('sync_status_failed_reason', '同步失败：{reason}'), {
                reason: reason || getMessage('sync_status_failed', '同步失败')
              }), true);
            }, 360);
            return;
          }
          const toastDelay = 360;
          setTimeout(() => {
            showToast(getMessage('sync_status_done', '同步完成'), false);
          }, toastDelay);
          setTimeout(() => {
            updateSyncNowTooltip(formatSyncTime(Date.now()));
          }, toastDelay + 60);
        });
      });
    });
  }

  if (syncExportButton) {
    syncExportButton.addEventListener('click', () => {
      if (!storageArea) {
        return;
      }
      storageArea.get(SYNC_KEYS, (result) => {
        const payload = buildSyncPayload(result || {});
        downloadJson(`lumno-settings-${Date.now()}.json`, payload);
        showToast(getMessage('sync_export_done', '已导出配置'), false);
      });
    });
  }

  if (syncImportButton && syncImportInput) {
    syncImportButton.addEventListener('click', () => {
      syncImportInput.click();
    });
    syncImportInput.addEventListener('change', (event) => {
      const file = event.target && event.target.files ? event.target.files[0] : null;
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        let parsed = null;
        try {
          parsed = JSON.parse(String(reader.result || ''));
        } catch (e) {
          parsed = null;
        }
        const data = parsed && parsed.data ? parsed.data : parsed;
        if (!data || typeof data !== 'object') {
          showToast(getMessage('sync_import_invalid', '配置文件无效'), true);
          syncImportInput.value = '';
          return;
        }
        const payload = {};
        SYNC_KEYS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            payload[key] = data[key];
          }
        });
        if (Object.prototype.hasOwnProperty.call(data, NEWTAB_SHORTCUTS_STORAGE_KEY)) {
          [
            NEWTAB_SHORTCUTS_CHUNK_2_STORAGE_KEY,
            NEWTAB_SHORTCUTS_CHUNK_3_STORAGE_KEY
          ].forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(data, key)) {
              payload[key] = [];
            }
          });
        }
        if (Object.keys(payload).length === 0) {
          showToast(getMessage('sync_import_invalid', '配置文件无效'), true);
          syncImportInput.value = '';
          return;
        }
        if (storageArea) {
          payload[SYNC_META_KEY] = {
            lastSyncAt: Date.now(),
            source: 'import'
          };
          storageArea.set(payload, () => {
            if (chrome.runtime && chrome.runtime.lastError) {
              const reason = chrome.runtime && chrome.runtime.lastError
                ? chrome.runtime.lastError.message
                : '';
              showToast(formatTemplate(getMessage('sync_status_failed_reason', '同步失败：{reason}'), {
                reason: reason || getMessage('sync_status_failed', '同步失败')
              }), true);
              syncImportInput.value = '';
              return;
            }
            showToast(getMessage('sync_import_done', '导入完成'), false);
            refreshSyncStatus();
          });
        }
        syncImportInput.value = '';
      };
      reader.readAsText(file);
    });
  }


  function retryApplyLanguageFromStorage(delayMs) {
    if (!storageArea) {
      return;
    }
    const wait = Number.isFinite(delayMs) ? delayMs : 180;
    setTimeout(() => {
      storageArea.get([LANGUAGE_STORAGE_KEY], (retryResult) => {
        if (!retryResult || !Object.prototype.hasOwnProperty.call(retryResult, LANGUAGE_STORAGE_KEY)) {
          return;
        }
        const retryMode = normalizeLanguageMode(retryResult[LANGUAGE_STORAGE_KEY]);
        applyLanguageMode(retryMode);
      });
    }, wait);
  }

  if (storageArea) {
    storageArea.get([LANGUAGE_STORAGE_KEY], (result) => {
      const hasStored = Object.prototype.hasOwnProperty.call(result, LANGUAGE_STORAGE_KEY);
      const syncArea = chrome && chrome.storage ? chrome.storage.sync : null;
      const localArea = chrome && chrome.storage ? chrome.storage.local : null;
      if (hasStored) {
        const storedRaw = result[LANGUAGE_STORAGE_KEY];
        const stored = normalizeLanguageMode(storedRaw);
        if (storedRaw !== stored) {
          storageArea.set({ [LANGUAGE_STORAGE_KEY]: stored });
        }
        if (localArea) {
          localArea.set({ [LANGUAGE_STORAGE_KEY]: stored });
        }
        applyLanguageMode(stored);
        return;
      }
      if (getActivePrimaryAreaName() === 'sync' && localArea) {
        localArea.get([LANGUAGE_STORAGE_KEY], (localResult) => {
          const localHasStored = Object.prototype.hasOwnProperty.call(localResult, LANGUAGE_STORAGE_KEY);
          if (localHasStored) {
            const localRaw = localResult[LANGUAGE_STORAGE_KEY];
            const localMode = normalizeLanguageMode(localRaw);
            localArea.set({ [LANGUAGE_STORAGE_KEY]: localMode });
            storageArea.set({ [LANGUAGE_STORAGE_KEY]: localMode });
            applyLanguageMode(localMode);
            return;
          }
          // 避免刷新瞬间把尚未完成写入的语言偏好覆盖为 system。
          applyLanguageMode('system');
          retryApplyLanguageFromStorage(180);
        });
        return;
      }
      // 读不到时只做 UI 回退，不落盘，防止竞态覆盖用户刚设置的值。
      applyLanguageMode('system');
      retryApplyLanguageFromStorage(180);
    });

    storageArea.get([RECENT_COUNT_STORAGE_KEY], (result) => {
      const stored = result[RECENT_COUNT_STORAGE_KEY];
      const count = normalizeRecentCount(stored);
      renderRecentCountControl(count);
      updateRecentModeTabsVisibility(count);
      if (stored !== count) {
        storageArea.set({ [RECENT_COUNT_STORAGE_KEY]: count });
      }
      refreshCustomSelects();
    });
    storageArea.get([NEWTAB_WIDTH_MODE_STORAGE_KEY], (result) => {
      const stored = result[NEWTAB_WIDTH_MODE_STORAGE_KEY];
      const mode = normalizeNewtabWidthMode(stored);
      if (newtabWidthSelect) {
        newtabWidthSelect.value = mode;
      }
      setNewtabWidthTabState(mode);
      if (stored !== mode) {
        storageArea.set({ [NEWTAB_WIDTH_MODE_STORAGE_KEY]: mode });
      }
      refreshCustomSelects();
    });
    storageArea.get([OVERLAY_SIZE_MODE_STORAGE_KEY], (result) => {
      const stored = result[OVERLAY_SIZE_MODE_STORAGE_KEY];
      const mode = normalizeOverlaySizeMode(stored);
      setOverlaySizeTabState(mode);
      if (stored !== mode) {
        storageArea.set({ [OVERLAY_SIZE_MODE_STORAGE_KEY]: mode });
      }
      refreshCustomSelects();
    });
    storageArea.get([OVERLAY_ENTER_ANIMATION_STORAGE_KEY], (result) => {
      const stored = result[OVERLAY_ENTER_ANIMATION_STORAGE_KEY];
      const mode = normalizeOverlayEnterAnimation(stored);
      setOverlayEnterAnimationTabState(mode);
      if (stored !== mode) {
        storageArea.set({ [OVERLAY_ENTER_ANIMATION_STORAGE_KEY]: mode });
      }
    });
    storageArea.get([OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY];
      const stored = normalizeOverlayPageThemeAdaptationEnabled(rawValue);
      if (overlayPageThemeAdaptationToggle) {
        setOptionsToggleState(overlayPageThemeAdaptationToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([SEARCH_RESULT_PRIORITY_STORAGE_KEY], (result) => {
      const stored = result[SEARCH_RESULT_PRIORITY_STORAGE_KEY];
      const priority = normalizeSearchResultPriority(stored);
      if (searchResultPrioritySelect) {
        searchResultPrioritySelect.value = priority;
      }
      setSearchResultPriorityTabState(priority);
      if (stored !== priority) {
        storageArea.set({ [SEARCH_RESULT_PRIORITY_STORAGE_KEY]: priority });
      }
      refreshCustomSelects();
    });
    storageArea.get([SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY], (result) => {
      const stored = result[SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY];
      const sourceTypes = normalizeSearchResultSourceTypes(stored);
      setSearchResultSourceTypeState(sourceTypes);
      if (!Array.isArray(stored) || JSON.stringify(stored) !== JSON.stringify(sourceTypes)) {
        storageArea.set({ [SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY]: sourceTypes });
      }
    });
    storageArea.get([SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY], (result) => {
      const rawValue = result[SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY];
      const displayLimit = normalizeSearchResultDisplayLimit(rawValue);
      renderSearchResultDisplayLimitControl(displayLimit);
      if (rawValue !== displayLimit) {
        storageArea.set({ [SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY]: displayLimit });
      }
    });
    storageArea.get([OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY], (result) => {
      const rawValue = result[OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY];
      const stored = normalizeOverlayOpenTabsDefaultVisible(rawValue);
      if (overlayOpenTabsDefaultVisibleToggle) {
        setOptionsToggleState(overlayOpenTabsDefaultVisibleToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([OVERLAY_TAB_KEYWORD_STORAGE_KEY, OVERLAY_HISTORY_KEYWORD_STORAGE_KEY], (result) => {
      const tabKeywordInput = document.getElementById('_x_extension_overlay_tab_keyword_input_2026_unique_');
      const historyKeywordInput = document.getElementById('_x_extension_overlay_history_keyword_input_2026_unique_');
      if (tabKeywordInput) {
        const rawTabKeyword = result[OVERLAY_TAB_KEYWORD_STORAGE_KEY];
        const normalizedTabKeyword = normalizeOverlayTabKeyword(rawTabKeyword);
        tabKeywordInput.value = normalizedTabKeyword;
        if (rawTabKeyword !== normalizedTabKeyword) {
          storageArea.set({ [OVERLAY_TAB_KEYWORD_STORAGE_KEY]: normalizedTabKeyword });
        }
        tabKeywordInput.addEventListener('change', () => {
          const newValue = normalizeOverlayTabKeyword(tabKeywordInput.value);
          tabKeywordInput.value = newValue;
          storageArea.set({ [OVERLAY_TAB_KEYWORD_STORAGE_KEY]: newValue });
        });
      }
      if (historyKeywordInput) {
        const rawHistoryKeyword = result[OVERLAY_HISTORY_KEYWORD_STORAGE_KEY];
        const normalizedHistoryKeyword = normalizeOverlayHistoryKeyword(rawHistoryKeyword);
        historyKeywordInput.value = normalizedHistoryKeyword;
        if (rawHistoryKeyword !== normalizedHistoryKeyword) {
          storageArea.set({ [OVERLAY_HISTORY_KEYWORD_STORAGE_KEY]: normalizedHistoryKeyword });
        }
        historyKeywordInput.addEventListener('change', () => {
          const newValue = normalizeOverlayHistoryKeyword(historyKeywordInput.value);
          historyKeywordInput.value = newValue;
          storageArea.set({ [OVERLAY_HISTORY_KEYWORD_STORAGE_KEY]: newValue });
        });
      }
    });
    storageArea.get([FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY];
      const stored = normalizeFaviconEnhancedFetchEnabled(rawValue);
      if (faviconEnhancedFetchToggle) {
        setOptionsToggleState(faviconEnhancedFetchToggle, stored);
      }
      setFaviconBlacklistEditorEnabled(stored);
      if (rawValue !== stored) {
        storageArea.set({ [FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([RECENT_MODE_STORAGE_KEY], (result) => {
      const stored = result[RECENT_MODE_STORAGE_KEY];
      const hasStored = stored === 'latest' || stored === 'most';
      const mode = hasStored ? stored : 'most';
      if (recentModeSelect) {
        recentModeSelect.value = mode;
      }
      setRecentModeTabState(mode);
      if (!hasStored) {
        storageArea.set({ [RECENT_MODE_STORAGE_KEY]: mode });
      }
      refreshCustomSelects();
    });
    storageArea.get([BOOKMARK_COUNT_STORAGE_KEY], (result) => {
      const stored = result[BOOKMARK_COUNT_STORAGE_KEY];
      const count = normalizeBookmarkCount(stored);
      renderBookmarkRowsControl(count);
      updateBookmarkColumnsSettingVisibility(count);
      if (stored !== count) {
        storageArea.set({ [BOOKMARK_COUNT_STORAGE_KEY]: count });
      }
    });
    storageArea.get([BOOKMARK_COLUMNS_STORAGE_KEY], (result) => {
      const stored = result[BOOKMARK_COLUMNS_STORAGE_KEY];
      const columns = normalizeBookmarkColumns(stored);
      renderBookmarkColumnsControl(columns);
      if (stored !== columns) {
        storageArea.set({ [BOOKMARK_COLUMNS_STORAGE_KEY]: columns });
      }
      refreshCustomSelects();
    });
    storageArea.get([BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY], (result) => {
      const raw = result[BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY];
      const next = normalizeBookmarkFolderIconsVisible(raw);
      if (bookmarkFolderIconsVisibleToggle) {
        setOptionsToggleState(bookmarkFolderIconsVisibleToggle, next);
      }
      if (raw !== next) {
        storageArea.set({ [BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY]: next });
      }
    });
    storageArea.get([OVERLAY_TAB_PRIORITY_STORAGE_KEY], (result) => {
      const rawValue = result[OVERLAY_TAB_PRIORITY_STORAGE_KEY];
      const stored = normalizeOverlayTabQuickSwitch(rawValue);
      if (overlayTabQuickSwitchToggle) {
        setOptionsToggleState(overlayTabQuickSwitchToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [OVERLAY_TAB_PRIORITY_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY], (result) => {
      const rawValue = result[NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY];
      const stored = normalizeNewtabTopContentMode(rawValue);
      setNewtabTopContentTabState(stored);
      if (rawValue !== stored) {
        storageArea.set({ [NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY], (result) => {
      const rawValue = result[NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY];
      const stored = normalizeNewtabTimeFontWeight(rawValue);
      renderNewtabTimeFontWeightControl(stored);
      if (rawValue !== stored) {
        storageArea.set({ [NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY], (result) => {
      const rawValue = result[NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY];
      const stored = normalizeNewtabTimeSecondsVisible(rawValue);
      if (newtabTimeSecondsToggle) {
        setOptionsToggleState(newtabTimeSecondsToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY];
      const stored = normalizeNewtabInputAutoFocusEnabled(rawValue);
      if (newtabInputAutoFocusToggle) {
        setOptionsToggleState(newtabInputAutoFocusToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY]: stored });
      }
    });
    storageArea.get([
      NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY,
      NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY,
      NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY,
      NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY
    ], (result) => {
      const rawVisible = result[NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY];
      const rawAddVisible = result[NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY];
      const rawDockMagnification =
        result[NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY];
      const rawWidth = result[NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY];
      const visible = normalizeNewtabShortcutsVisible(rawVisible);
      const addVisible = normalizeNewtabShortcutAddVisible(rawAddVisible);
      const dockMagnification = normalizeNewtabShortcutDockMagnificationEnabled(
        rawDockMagnification
      );
      const width = normalizeNewtabShortcutWidth(rawWidth);
      setOptionsToggleState(newtabShortcutsToggle, visible);
      setOptionsToggleState(newtabShortcutAddToggle, addVisible);
      setOptionsToggleState(newtabShortcutDockMagnificationToggle, dockMagnification);
      renderNewtabShortcutWidthControl(width);
      syncNewtabShortcutSubcontrolAvailability();
      const repairs = {};
      if (rawVisible !== visible) {
        repairs[NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY] = visible;
      }
      if (rawAddVisible !== addVisible) {
        repairs[NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY] = addVisible;
      }
      if (rawDockMagnification !== dockMagnification) {
        repairs[NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY] = dockMagnification;
      }
      if (rawWidth !== width) {
        repairs[NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY] = width;
      }
      if (Object.keys(repairs).length > 0) {
        storageArea.set(repairs);
      }
    });
    storageArea.get([
      NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
      NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY
    ], (result) => {
      [
        [
          newtabFeedbackButtonVisibleToggle,
          NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
          normalizeNewtabFeedbackButtonVisible
        ],
        [
          newtabAppearanceButtonVisibleToggle,
          NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
          normalizeNewtabAppearanceButtonVisible
        ]
      ].forEach(([toggle, storageKey, normalize]) => {
        const rawValue = result[storageKey];
        const stored = normalize(rawValue);
        if (toggle) {
          setOptionsToggleState(toggle, stored);
        }
        if (rawValue !== stored) {
          storageArea.set({ [storageKey]: stored });
        }
      });
    });
    storageArea.get([UPDATE_NOTICE_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[UPDATE_NOTICE_ENABLED_STORAGE_KEY];
      const stored = normalizeUpdateNoticeEnabled(rawValue);
      if (updateNoticeToggle) {
        setOptionsToggleState(updateNoticeToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [UPDATE_NOTICE_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([MOTION_EFFECTS_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[MOTION_EFFECTS_ENABLED_STORAGE_KEY];
      const stored = normalizeMotionEffectsEnabled(rawValue);
      if (motionEffectsToggle) {
        setOptionsToggleState(motionEffectsToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [MOTION_EFFECTS_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([SIMPLE_MODE_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[SIMPLE_MODE_ENABLED_STORAGE_KEY];
      const stored = normalizeSimpleModeEnabled(rawValue);
      if (simpleModeToggle) {
        setOptionsToggleState(simpleModeToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [SIMPLE_MODE_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY];
      const stored = normalizeNumberShortcutInstantEnabled(rawValue);
      if (numberShortcutInstantToggle) {
        setOptionsToggleState(numberShortcutInstantToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY];
      const stored = normalizeMacosCtrlSuggestionNavigationEnabled(rawValue);
      if (macosCtrlSuggestionNavigationToggle) {
        setOptionsToggleState(macosCtrlSuggestionNavigationToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([AUTO_PIP_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[AUTO_PIP_ENABLED_STORAGE_KEY];
      const stored = normalizeAutoPipEnabled(rawValue);
      if (autoPipToggle) {
        setOptionsToggleState(autoPipToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [AUTO_PIP_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([TAB_SWITCHER_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[TAB_SWITCHER_ENABLED_STORAGE_KEY];
      const stored = normalizeTabSwitcherEnabled(rawValue);
      if (tabSwitcherToggle) {
        setOptionsToggleState(tabSwitcherToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [TAB_SWITCHER_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([DOCUMENT_PIP_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[DOCUMENT_PIP_ENABLED_STORAGE_KEY];
      const stored = normalizeDocumentPipEnabled(rawValue);
      if (documentPipToggle) {
        setOptionsToggleState(documentPipToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [DOCUMENT_PIP_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY];
      const stored = normalizePinnedTabRecoveryEnabled(rawValue);
      if (pinnedTabRecoveryToggle) {
        setOptionsToggleState(pinnedTabRecoveryToggle, stored);
      }
      if (rawValue !== stored) {
        storageArea.set({ [PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY];
      const stored = normalizeSelectionQuickActionsEnabled(rawValue);
      if (selectionQuickActionsToggle) {
        setOptionsToggleState(selectionQuickActionsToggle, stored);
      }
      syncSelectionQuickActionsProviderAvailability();
      if (rawValue !== stored) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY], (result) => {
      const rawValue = result[SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY];
      const stored = normalizeSelectionQuickActionsProvider(rawValue);
      setOptionsSelectState(selectionQuickActionsProviderSelect, stored);
      if (rawValue !== stored) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY], (result) => {
      const rawValue = result[SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY];
      const stored = normalizeSelectionQuickActionsGroupEnabled(rawValue);
      if (selectionQuickActionsGroupToggle) {
        setOptionsToggleState(selectionQuickActionsGroupToggle, stored);
      }
      syncSelectionQuickActionsProviderAvailability();
      if (rawValue !== stored) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY]: stored });
      }
      refreshCustomSelects();
    });
    storageArea.get([RESTRICTED_ACTION_STORAGE_KEY], (result) => {
      const stored = result[RESTRICTED_ACTION_STORAGE_KEY];
      const normalizedStored = stored === 'lumno' ? 'default' : stored;
      const hasStored = normalizedStored === 'default' || normalizedStored === 'none';
      const nextAction = hasStored ? normalizedStored : 'default';
      if (restrictedActionSelect) {
        restrictedActionSelect.value = nextAction;
      }
      setRestrictedActionTabState(nextAction);
      if (!hasStored || normalizedStored !== stored) {
        storageArea.set({ [RESTRICTED_ACTION_STORAGE_KEY]: nextAction });
      }
      refreshCustomSelects();
    });
  }

  refreshCustomSelects();

  document.addEventListener('click', (event) => {
    if (!activePopconfirm) {
      return;
    }
    const wrap = activePopconfirm.closest('._x_extension_popconfirm_wrap_2024_unique_');
    if (wrap && wrap.contains(event.target)) {
      return;
    }
    closeActivePopconfirm();
  });

  function resetSiteSearchForm() {
    if (siteSearchKeyInput) siteSearchKeyInput.value = '';
    if (siteSearchNameInput) siteSearchNameInput.value = '';
    if (siteSearchTemplateInput) siteSearchTemplateInput.value = '';
    if (siteSearchAliasInput) siteSearchAliasInput.value = '';
    setSiteSearchError('');
    setLegacySiteSearchDraftCategory('site');
    setEditingState(null);
    setSiteSearchFormExpanded(false);
  }

  setSiteSearchFormExpanded(false);

  function getLocalizedBuiltinProviderName(item) {
    if (!item || item._xIsCustom) {
      return item && (item.name || item.key) ? (item.name || item.key) : '';
    }
    const mapping = typeof SEARCH_UTILS.getSiteSearchProviderDisplayNameMessage === 'function'
      ? SEARCH_UTILS.getSiteSearchProviderDisplayNameMessage(item)
      : null;
    if (!mapping) {
      return item.name || item.key;
    }
    return getMessage(mapping.messageKey, mapping.fallback);
  }

  function getSiteSearchItemIconUrl(item) {
    if (!item) {
      return '';
    }
    const localIconAsset = !item._xIsCustom &&
      typeof SHORTCUT_FAVICON.getSiteSearchPinnedIconAssetPath === 'function'
      ? SHORTCUT_FAVICON.getSiteSearchPinnedIconAssetPath(item)
      : '';
    if (localIconAsset) {
      return chrome.runtime.getURL(localIconAsset);
    }
    if (item.icon) {
      return String(item.icon || '').trim();
    }
    if (item.iconUrl) {
      return String(item.iconUrl || '').trim();
    }
    try {
      const template = normalizeSiteSearchTemplate(String(item.template || '').trim());
      const url = template.replace(/\{query\}/g, 'test');
      const hostname = new URL(url).hostname;
      return hostname
        ? `https://t2.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE%2CSIZE%2CURL&url=${encodeURIComponent(`https://${hostname}/`)}&size=64`
        : '';
    } catch (error) {
      return '';
    }
  }

  function getSiteSearchListCopy() {
    return {
      aliasLabel: getMessage('shortcuts_label_alias', '别名'),
      aliasPlaceholder: getMessage('shortcuts_placeholder_alias', '选填，例如 小破站、油管等'),
      cancelLabel: getMessage('shortcuts_cancel', '取消'),
      categoryLabel: getMessage('shortcuts_label_display_group', '显示位置'),
      confirmLabel: getMessage('confirm_ok', '确认'),
      confirmMessage: getMessage('confirm_remove_item', '确认移除该项？'),
      confirmMessageKey: 'confirm_remove_item',
      editLabel: getMessage('shortcuts_edit', '编辑'),
      keyLabel: getMessage('shortcuts_label_key', '触发词'),
      keyPlaceholder: getMessage(
        'shortcuts_placeholder_required',
        '必填，如有多个用英文逗号分隔，如 jd,bili'
      ),
      nameLabel: getMessage('shortcuts_label_name', '显示名称'),
      namePlaceholder: getMessage(
        'shortcuts_placeholder_optional_default',
        '选填，默认使用触发词'
      ),
      removeLabel: getMessage('shortcuts_remove', '移除'),
      saveLabel: getMessage('shortcuts_save', '保存修改'),
      searchEngineCategoryLabel: getMessage(
        'search_scope_group_engines',
        '搜索引擎'
      ),
      siteCategoryLabel: getMessage('search_scope_group_sites', '站内搜索'),
      templateHelp: getMessage(
        'shortcuts_template_help',
        '1.打开你想添加的网站\n2.输入任一搜索词，触发搜索\n3.将搜索结果页面 url 粘贴在此处\n4.将关键词替换为{query}'
      ),
      templateLabel: getMessage('shortcuts_label_template', '搜索模板')
    };
  }

  function getSiteSearchProviderItemModel(item, builtinTemplateSet) {
    const normalizedTemplate = normalizeSiteSearchTemplate(
      String(item && item.template ? item.template : '').trim()
    );
    const isCustom = Boolean(item && item._xIsCustom);
    const isSearchEngine = isSearchEngineSiteSearchProvider(item);
    const duplicate = isCustom && normalizedTemplate && builtinTemplateSet.has(normalizedTemplate);
    return {
      aliasesText: Array.isArray(item.aliases) ? item.aliases.join(',') : '',
      badgeText: isCustom
        ? getMessage('shortcuts_badge_custom', '自定义')
        : isSearchEngine
          ? getMessage('search_scope_group_engines', '搜索引擎')
          : isAiSiteSearchProvider(item)
            ? getMessage('shortcuts_badge_ai', 'AI')
            : getMessage('shortcuts_badge_builtin', '内置'),
      category: isSearchEngine ? 'searchEngine' : 'site',
      duplicateLabel: duplicate
        ? getMessage('shortcuts_duplicate_tag', '与内置重复')
        : '',
      duplicateTemplate: duplicate ? normalizedTemplate : '',
      duplicateTooltip: duplicate
        ? getMessage('shortcuts_duplicate_action', '定位内置项')
        : '',
      iconUrl: getSiteSearchItemIconUrl(item),
      id: `${isCustom ? 'custom' : 'builtin'}:${String(item.key || '')}`,
      isBuiltin: !isCustom,
      key: String(item.key || ''),
      meta: `${item.key || ''} · ${item.template || ''}`,
      name: getLocalizedBuiltinProviderName(item),
      normalizedTemplate,
      secondaryBadgeText: isCustom
        ? (isSearchEngine
            ? getMessage('search_scope_group_engines', '搜索引擎')
            : getMessage('search_scope_group_sites', '站内搜索'))
        : isSearchEngine
          ? getMessage('shortcuts_badge_builtin', '内置')
          : '',
      template: String(item.template || ''),
      templateEditable: isCustom
    };
  }

  function renderSiteSearchListController(
    controller,
    items,
    placeholder,
    builtinTemplateSet
  ) {
    if (!controller || typeof controller.render !== 'function') {
      return false;
    }
    controller.render({
      copy: getSiteSearchListCopy(),
      items: (Array.isArray(items) ? items : []).map(
        (item) => getSiteSearchProviderItemModel(item, builtinTemplateSet)
      ),
      placeholder: placeholder || ''
    });
    return true;
  }

  function locateBuiltinSiteSearchProvider(normalizedTemplate) {
    const targetRow = Array.from(document.querySelectorAll(
      '[data-type="builtin"][data-template]'
    )).find((row) => row.getAttribute('data-template') === normalizedTemplate);
    if (!targetRow) {
      return;
    }
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetRow.removeAttribute('data-flash');
    void targetRow.offsetWidth;
    targetRow.setAttribute('data-flash', 'true');
    const onFlashEnd = () => {
      targetRow.removeAttribute('data-flash');
      targetRow.removeEventListener('animationend', onFlashEnd);
    };
    targetRow.addEventListener('animationend', onFlashEnd);
  }

  function handleSiteSearchProviderSave(key, isBuiltin, draft) {
    suspendSiteSearchRefresh(260);
    const item = isBuiltin
      ? defaultSiteSearchProviders.find((entry) => String(entry.key || '') === key)
      : customSiteSearchProviders.find((entry) => String(entry.key || '') === key);
    if (!item) {
      return Promise.resolve({
        ok: false,
        error: getMessage('toast_error', '操作失败，请重试')
      });
    }
    const nextKeyRaw = String(draft && draft.key ? draft.key : '').trim();
    if (!nextKeyRaw) {
      return Promise.resolve({
        ok: false,
        error: getMessage('shortcuts_error_key', '请填写触发词')
      });
    }
    if (/\s/.test(nextKeyRaw)) {
      return Promise.resolve({
        ok: false,
        error: getMessage('shortcuts_error_key_space', '触发词不能包含空格')
      });
    }
    const previousKey = String(item.key || '').toLowerCase();
    if (findSiteSearchKeyConflict(nextKeyRaw, previousKey)) {
      return Promise.resolve({
        ok: false,
        error: getMessage('shortcuts_error_key_duplicate', '该触发词已存在，请更换')
      });
    }
    const template = normalizeSiteSearchTemplate(
      String(draft && draft.template ? draft.template : '').trim()
    );
    const isBuiltinAiProvider = isBuiltin && isAiSiteSearchProvider(item);
    if (!template || (!isBuiltinAiProvider && !template.includes('{query}'))) {
      return Promise.resolve({
        ok: false,
        error: getMessage('toast_error_template', '搜索模板必须包含 {query}')
      });
    }
    const aliases = normalizeAliases(draft && draft.aliases ? draft.aliases : '');
    const normalizedKey = nextKeyRaw.toLowerCase();
    let next = customSiteSearchProviders.filter(
      (entry) => String(entry.key || '').toLowerCase() !== normalizedKey
    );
    if (previousKey && previousKey !== normalizedKey) {
      next = next.filter(
        (entry) => String(entry.key || '').toLowerCase() !== previousKey
      );
    }
    const builtinKey = isBuiltin ? previousKey : getSiteSearchBuiltinKey(item);
    const nextDisabledKeys = new Set(disabledSiteSearchKeys);
    if (builtinKey) {
      nextDisabledKeys.add(builtinKey);
    } else {
      nextDisabledKeys.delete(normalizedKey);
    }
    const nextItemDraft = {
      ...item,
      key: nextKeyRaw,
      name: String(draft && draft.name ? draft.name : '').trim() || nextKeyRaw,
      template,
      aliases,
      category: isBuiltinAiProvider
        ? 'aiSearch'
        : (draft && draft.category === 'searchEngine' ? 'searchEngine' : 'site')
    };
    if (builtinKey) {
      nextItemDraft.builtinKey = builtinKey;
    }
    const activeBuiltins = getActiveBuiltinSiteSearchProviders(
      defaultSiteSearchProviders,
      [nextItemDraft].concat(next),
      nextDisabledKeys
    );
    const shouldDisable = !builtinKey && isDuplicateTemplate(template, activeBuiltins);
    const nextItem = normalizeSiteSearchProvider({
      ...nextItemDraft,
      disabled: shouldDisable,
      disabledReason: shouldDisable ? 'duplicate' : ''
    });
    if (!nextItem) {
      return Promise.resolve({
        ok: false,
        error: getMessage('toast_error', '操作失败，请重试')
      });
    }
    next.unshift(nextItem);
    return Promise.all([
      saveCustomSiteSearchProviders(next),
      saveDisabledSiteSearchKeys(nextDisabledKeys)
    ]).then(() => {
      customSiteSearchProviders = next;
      disabledSiteSearchKeys = nextDisabledKeys;
      renderSiteSearchList();
      setTimeout(() => {
        showToast(getMessage('toast_saved', '已保存'), false);
      }, 220);
      return { ok: true };
    }).catch(() => {
      const error = getMessage('toast_error', '操作失败，请重试');
      showToast(error, true);
      return { ok: false, error };
    });
  }

  function renderSiteSearchList() {
    if (!siteSearchEngineBuiltinList || !siteSearchCustomList || !siteSearchBuiltinList) {
      return;
    }
    const customKeys = new Set(
      customSiteSearchProviders.map((item) =>
        String(item.key || '').toLowerCase()
      )
    );
    const displayDefaults = defaultSiteSearchProviders.filter((item) => {
      const key = String(item.key || '').toLowerCase();
      return key && !customKeys.has(key) && !disabledSiteSearchKeys.has(key);
    });
    const displayEngineDefaults = displayDefaults.filter(isSearchEngineSiteSearchProvider);
    const displayAiDefaults = displayDefaults.filter(isAiSiteSearchProvider);
    const displaySearchDefaults = displayDefaults.filter(
      (item) => (
        !isSearchEngineSiteSearchProvider(item) && !isAiSiteSearchProvider(item)
      )
    );
    const builtinTemplateSet = new Set(
      getActiveBuiltinSiteSearchProviders(
        defaultSiteSearchProviders,
        customSiteSearchProviders,
        disabledSiteSearchKeys
      )
        .map((item) =>
          normalizeSiteSearchTemplate(String(item.template || '').trim())
        )
        .filter(Boolean)
    );
    const customItems = customSiteSearchProviders.map((item) => ({
      ...item,
      _xIsCustom: true
    }));
    const engineItems = displayEngineDefaults.map((item) => ({
      ...item,
      _xIsCustom: false
    }));
    const searchItems = displaySearchDefaults.map((item) => ({
      ...item,
      _xIsCustom: false
    }));
    const aiItems = displayAiDefaults.map((item) => ({
      ...item,
      _xIsCustom: false
    }));

    renderSiteSearchListController(
      siteSearchEngineBuiltinListController,
      engineItems,
      getMessage('shortcuts_empty_engines', '暂无内置搜索引擎'),
      builtinTemplateSet
    );
    renderSiteSearchListController(
      siteSearchCustomListController,
      customItems,
      '',
      builtinTemplateSet
    );
    renderSiteSearchListController(
      siteSearchBuiltinListController,
      searchItems,
      getMessage('shortcuts_empty_builtin', '暂无内置站内搜索'),
      builtinTemplateSet
    );
    if (siteSearchAiBuiltinList) {
      renderSiteSearchListController(
        siteSearchAiBuiltinListController,
        aiItems,
        getMessage('shortcuts_empty_ai', '暂无内置 AI'),
        builtinTemplateSet
      );
    }
    initTooltips();
    if (
      pendingOptionsScrollTarget &&
      scrollToOptionsTarget(pendingOptionsScrollTarget, { behavior: 'auto' })
    ) {
      pendingOptionsScrollTarget = '';
    }
  }

  function loadDefaultSiteSearchProviders() {
    const localUrl = chrome && chrome.runtime && typeof chrome.runtime.getURL === 'function'
      ? chrome.runtime.getURL('assets/data/site-search.json')
      : '../../assets/data/site-search.json';
    return fetch(localUrl)
      .then((resp) => resp.json())
      .then((data) => {
        const items = data && Array.isArray(data.items) ? data.items : [];
        const source = items.length > 0 ? items : fallbackSiteSearchProviders;
        return source.map((item) => normalizeSiteSearchProvider(item)).filter(Boolean);
      })
      .catch(() => new Promise((resolve) => {
        if (!chrome || !chrome.runtime || typeof chrome.runtime.sendMessage !== 'function') {
          resolve(fallbackSiteSearchProviders.slice());
          return;
        }
        chrome.runtime.sendMessage({ action: 'getSiteSearchProviders' }, (response) => {
          const items = response && Array.isArray(response.items) ? response.items : [];
          const source = items.length > 0 ? items : fallbackSiteSearchProviders;
          resolve(source.map((item) => normalizeSiteSearchProvider(item)).filter(Boolean));
        });
      }));
  }

  function normalizeAliasList(list) {
    const items = Array.isArray(list) ? list : [];
    const cleaned = items
      .map((item) => String(item || '').trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(cleaned)).sort();
  }

  function isSameProviderContent(a, b) {
    if (!a || !b) {
      return false;
    }
    const nameA = String(a.name || a.key || '').trim();
    const nameB = String(b.name || b.key || '').trim();
    const templateA = normalizeSiteSearchTemplate(String(a.template || '').trim());
    const templateB = normalizeSiteSearchTemplate(String(b.template || '').trim());
    if (nameA !== nameB || templateA !== templateB) {
      return false;
    }
    const aliasA = normalizeAliasList(a.aliases);
    const aliasB = normalizeAliasList(b.aliases);
    return JSON.stringify(aliasA) === JSON.stringify(aliasB);
  }

  function filterRedundantCustomProviders(defaults, custom) {
    const map = new Map((defaults || []).map((item) => [String(item.key || '').toLowerCase(), item]));
    return (custom || []).filter((item) => {
      if (getSiteSearchBuiltinKey(item)) {
        return true;
      }
      const key = String(item.key || '').toLowerCase();
      const base = map.get(key);
      if (!base) {
        return true;
      }
      return !isSameProviderContent(item, base);
    });
  }

  function loadCustomSiteSearchProviders(baseItems) {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve([]);
        return;
      }
      storageArea.get([SITE_SEARCH_STORAGE_KEY], (result) => {
        const items = Array.isArray(result[SITE_SEARCH_STORAGE_KEY]) ? result[SITE_SEARCH_STORAGE_KEY] : [];
        const baseMap = new Map((baseItems || []).map((item) => [
          String(item && item.key ? item.key : '').toLowerCase(),
          item
        ]));
        resolve(items.map((item) => {
          const key = String(item && item.key ? item.key : '').toLowerCase();
          const builtinKey = getSiteSearchBuiltinKey(item);
          return normalizeSiteSearchProvider(item, baseMap.get(builtinKey || key));
        }).filter(Boolean));
      });
    });
  }

  function loadDisabledSiteSearchKeys() {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve([]);
        return;
      }
      storageArea.get([SITE_SEARCH_DISABLED_STORAGE_KEY], (result) => {
        const items = Array.isArray(result[SITE_SEARCH_DISABLED_STORAGE_KEY])
          ? result[SITE_SEARCH_DISABLED_STORAGE_KEY]
          : [];
        resolve(items.map((item) => String(item).toLowerCase()).filter(Boolean));
      });
    });
  }

  function saveDisabledSiteSearchKeys(keys) {
    const payload = Array.from(keys || [])
      .map((item) => String(item).toLowerCase())
      .filter(Boolean);
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve();
        return;
      }
      storageArea.set({ [SITE_SEARCH_DISABLED_STORAGE_KEY]: payload }, () => resolve());
    });
  }

  function saveCustomSiteSearchProviders(items) {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve();
        return;
      }
      const payload = (items || []).map((item) => normalizeSiteSearchProvider(item)).filter(Boolean);
      storageArea.set({ [SITE_SEARCH_STORAGE_KEY]: payload }, () => resolve());
    });
  }

  function loadSearchBlacklistItems() {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve([]);
        return;
      }
      storageArea.get([SEARCH_BLACKLIST_STORAGE_KEY], (result) => {
        resolve(normalizeSearchBlacklistItems(result && result[SEARCH_BLACKLIST_STORAGE_KEY]));
      });
    });
  }

  function saveSearchBlacklistItems(items) {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve([]);
        return;
      }
      const normalized = normalizeSearchBlacklistItems(items);
      storageArea.set({ [SEARCH_BLACKLIST_STORAGE_KEY]: normalized }, () => resolve(normalized));
    });
  }

  function loadFaviconRequestBlacklistItems() {
    return new Promise((resolve) => {
      if (!storageArea) {
        resolve([]);
        return;
      }
      storageArea.get([FAVICON_REQUEST_BLACKLIST_STORAGE_KEY], (result) => {
        resolve(normalizeFaviconRequestBlacklistItems(result && result[FAVICON_REQUEST_BLACKLIST_STORAGE_KEY]));
      });
    });
  }

  function saveFaviconRequestBlacklistItems(items) {
    return new Promise((resolve) => {
      const normalized = normalizeFaviconRequestBlacklistItems(items);
      if (!storageArea) {
        resolve(normalized);
        return;
      }
      storageArea.set({ [FAVICON_REQUEST_BLACKLIST_STORAGE_KEY]: normalized }, () => resolve(normalized));
    });
  }

  function getBlacklistListCopy() {
    return {
      cancelLabel: getMessage('shortcuts_cancel', '取消'),
      confirmLabel: getMessage('confirm_ok', '确认'),
      confirmMessage: getMessage('confirm_remove_item', '确认移除该项？'),
      confirmMessageKey: 'confirm_remove_item',
      editLabel: getMessage('shortcuts_edit', '编辑'),
      matchLabel: getMessage('blacklist_match_label', '匹配方式'),
      modeOptions: [
        {
          mode: 'suffix',
          label: getMessage('blacklist_match_suffix', '整个网站'),
          tooltip: getMessage(
            'blacklist_match_suffix_tooltip',
            '屏蔽这个网站的所有页面，也包括它的子网站\n────────\n例如，填 baidu.com 后，baidu.com/search 和 tieba.baidu.com 都不会出现'
          )
        },
        {
          mode: 'exact',
          label: getMessage('blacklist_match_exact', '当前页面'),
          tooltip: getMessage(
            'blacklist_match_exact_tooltip',
            '只屏蔽这一页\n────────\n例如，填 x.com/home 后，只有这一页不会出现，其他页面不受影响'
          )
        },
        {
          mode: 'prefix',
          label: getMessage('blacklist_match_prefix', '当前站点路径'),
          tooltip: getMessage(
            'blacklist_match_prefix_tooltip',
            '只屏蔽这个站点下这一路径的页面\n────────\n例如，填 baidu.com/search 后，baidu.com/search 和 baidu.com/search/1 不会出现，但 baidu.com/news 不受影响'
          )
        }
      ],
      placeholderDomain: getMessage('blacklist_placeholder_domain', 'baidu.com'),
      placeholderExact: getMessage('blacklist_placeholder_exact', 'example.com/path'),
      placeholderPrefix: getMessage(
        'blacklist_placeholder_prefix',
        'baidu.com or baidu.com/search'
      ),
      removeLabel: getMessage('shortcuts_remove', '移除'),
      saveLabel: getMessage('shortcuts_save', '保存修改'),
      urlLabel: getMessage('blacklist_label_url', 'URL rule')
    };
  }

  function getBlacklistListItemModel(item) {
    const badgeConfig = getBlacklistMatchBadgeConfig(item.matchModes);
    return {
      key: buildBlacklistItemKey(item),
      badgeText: badgeConfig.text,
      badgeTone: badgeConfig.tone,
      displayPattern: formatBlacklistPatternForDisplay(item),
      inputValue: getBlacklistPatternInputValue(item),
      matchModes: normalizeBlacklistMatchModes(item.matchModes)
    };
  }

  function renderBlacklistListWithReact(controller, items, editable) {
    if (!controller || typeof controller.render !== 'function') {
      return false;
    }
    controller.render({
      copy: getBlacklistListCopy(),
      editable: Boolean(editable),
      items: (Array.isArray(items) ? items : []).map(getBlacklistListItemModel)
    });
    initTooltips();
    return true;
  }

  function handleFaviconBlacklistRemove(itemKey) {
    const nextItems = faviconRequestBlacklistItems.filter(
      (entry) => buildBlacklistItemKey(entry) !== itemKey
    );
    return saveFaviconRequestBlacklistItems(nextItems).then((savedItems) => {
      faviconRequestBlacklistItems = savedItems;
      renderFaviconRequestBlacklistList();
      showToast(getMessage('favicon_blacklist_removed_toast', '已移除排除规则'), false);
    }).catch(() => {
      showToast(getMessage('toast_error', '操作失败，请重试'), true);
    });
  }

  function handleSearchBlacklistRemove(itemKey) {
    const nextItems = searchBlacklistItems.filter(
      (entry) => buildBlacklistItemKey(entry) !== itemKey
    );
    return saveSearchBlacklistItems(nextItems).then((savedItems) => {
      searchBlacklistItems = savedItems;
      renderSearchBlacklistList();
      notifyNewtabSectionsRefresh('recent');
      showToast(getMessage('blacklist_removed_toast', '已从黑名单移除'), false);
    }).catch(() => {
      showToast(getMessage('toast_error', '操作失败，请重试'), true);
    });
  }

  function handleSearchBlacklistSave(itemKey, inputValue, matchModes) {
    const draft = buildBlacklistRuleDraft(inputValue, matchModes);
    if (!draft.item) {
      return Promise.resolve({
        ok: false,
        error: draft.error || getMessage('toast_error', '操作失败，请重试')
      });
    }
    const nextItems = upsertBlacklistItems(draft.item, itemKey);
    return persistBlacklistItems(
      nextItems,
      getMessage('toast_saved', '已保存')
    ).then(() => ({
      ok: true
    })).catch(() => {
      const error = getMessage('toast_error', '操作失败，请重试');
      showToast(error, true);
      return {
        ok: false,
        error
      };
    });
  }

  function renderFaviconRequestBlacklistList() {
    if (!faviconBlacklistList) {
      return;
    }
    renderBlacklistListWithReact(
      faviconBlacklistListController,
      faviconRequestBlacklistItems,
      false
    );
  }

  function renderSearchBlacklistList() {
    if (!blacklistList) {
      return;
    }
    renderBlacklistListWithReact(
      searchBlacklistListController,
      searchBlacklistItems,
      true
    );
  }

  function refreshSiteSearchProviders() {
    if (!siteSearchEngineBuiltinList || !siteSearchCustomList || !siteSearchBuiltinList) {
      return;
    }
    if (defaultSiteSearchProviders.length === 0) {
      defaultSiteSearchProviders = fallbackSiteSearchProviders.slice();
      renderSiteSearchList();
    }
    loadDefaultSiteSearchProviders().then((defaults) => Promise.all([
      Promise.resolve(defaults),
      loadCustomSiteSearchProviders(defaults),
      loadDisabledSiteSearchKeys()
    ])).then(([defaults, custom, disabled]) => {
      defaultSiteSearchProviders = defaults;
      disabledSiteSearchKeys = new Set(disabled || []);
      const filteredCustom = filterRedundantCustomProviders(defaults, custom);
      const withoutDebug = filteredCustom.filter((item) => String(item.key || '').toLowerCase() !== DEBUG_DUPLICATE_CUSTOM_KEY);
      const didFilter = filteredCustom.length !== (custom || []).length;
      const didRemoveDebug = withoutDebug.length !== filteredCustom.length;
      const activeBuiltins = getActiveBuiltinSiteSearchProviders(
        defaults,
        withoutDebug,
        disabledSiteSearchKeys
      );
      let nextCustom = withoutDebug.map((item) => {
        const shouldDisable = !getSiteSearchBuiltinKey(item) &&
          isDuplicateTemplate(item.template, activeBuiltins);
        return {
          ...item,
          disabled: shouldDisable,
          disabledReason: shouldDisable ? 'duplicate' : ''
        };
      });
      const didUpdateDisabled = nextCustom.some((item, index) => {
        const before = withoutDebug[index] || {};
        return Boolean(before.disabled) !== Boolean(item.disabled) ||
          String(before.disabledReason || '') !== String(item.disabledReason || '');
      });
      customSiteSearchProviders = nextCustom;
      if (didFilter || didUpdateDisabled || didRemoveDebug) {
        saveCustomSiteSearchProviders(nextCustom);
      }
      const filteredBase = defaultSiteSearchProviders.filter((item) => {
        const key = String(item && item.key ? item.key : '').toLowerCase();
        return key && !disabledSiteSearchKeys.has(key);
      });
      if (filteredBase.length === 0 && customSiteSearchProviders.length === 0 && defaultSiteSearchProviders.length > 0) {
        disabledSiteSearchKeys = new Set();
        saveDisabledSiteSearchKeys(disabledSiteSearchKeys);
      }
      renderSiteSearchList();
    });
  }

  if (siteSearchEngineBuiltinList && siteSearchCustomList && siteSearchBuiltinList) {
    refreshSiteSearchProviders();
  }
  if (blacklistList) {
    loadSearchBlacklistItems().then((items) => {
      searchBlacklistItems = items;
      renderSearchBlacklistList();
    });
  }
  if (faviconBlacklistList) {
    loadFaviconRequestBlacklistItems().then((items) => {
      faviconRequestBlacklistItems = items;
      renderFaviconRequestBlacklistList();
    });
  }

  function handleSiteSearchListClick(event) {
      if (event.currentTarget &&
          event.currentTarget.getAttribute('data-react-island') === 'options-site-search-list') {
        return;
      }
      const target = event.target;
      if (!target) {
        return;
      }
      const editTarget = target.closest ? target.closest('button[data-edit-key]') : null;
      if (editTarget) {
        const key = String(editTarget.dataset.editKey || '');
        const isBuiltin = editTarget.dataset.editType === 'builtin';
        const match = isBuiltin
          ? defaultSiteSearchProviders.find((item) => String(item.key || '') === key)
          : customSiteSearchProviders.find((item) => String(item.key || '') === key);
        if (match) {
          const row = editTarget.closest('._x_extension_shortcut_item_2024_unique_');
          if (row) {
            row.setAttribute('data-expanded', row.getAttribute('data-expanded') === 'true' ? 'false' : 'true');
          }
          return;
        }
        return;
      }
      if (target.closest && target.closest('._x_extension_popconfirm_2024_unique_')) {
        return;
      }
    }

  if (siteSearchCustomList) {
    siteSearchCustomList.addEventListener('click', handleSiteSearchListClick);
  }
  if (siteSearchEngineBuiltinList) {
    siteSearchEngineBuiltinList.addEventListener('click', handleSiteSearchListClick);
  }
  if (siteSearchBuiltinList) {
    siteSearchBuiltinList.addEventListener('click', handleSiteSearchListClick);
  }
  if (siteSearchAiBuiltinList) {
    siteSearchAiBuiltinList.addEventListener('click', handleSiteSearchListClick);
  }

  if (siteSearchCancelButton) {
    siteSearchCancelButton.addEventListener('click', function() {
      resetSiteSearchForm();
    });
  }

  if (siteSearchFormTrigger) {
    siteSearchFormTrigger.addEventListener('click', () => {
      setSiteSearchFormExpanded(true);
    });
  }

  if (siteSearchInsertQueryButton) {
    siteSearchInsertQueryButton.addEventListener('click', () => {
      setSiteSearchFormExpanded(true);
      insertSiteSearchQueryToken();
    });
  }

  siteSearchCategoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setLegacySiteSearchDraftCategory(button.dataset.siteSearchCategory);
    });
  });

  if (siteSearchAddButton) {
    attachSaveButtonAnimation(siteSearchAddButton);
    siteSearchAddButton.addEventListener('click', function() {
      if (!siteSearchFormExpanded) {
        setSiteSearchFormExpanded(true);
        return;
      }
      suspendSiteSearchRefresh(260);
      setSiteSearchError('');
      const key = String(siteSearchKeyInput ? siteSearchKeyInput.value : '').trim();
      const name = String(siteSearchNameInput ? siteSearchNameInput.value : '').trim();
      const templateRaw = String(siteSearchTemplateInput ? siteSearchTemplateInput.value : '').trim();
      const aliases = normalizeAliases(siteSearchAliasInput ? siteSearchAliasInput.value : '');
      if (!key) {
        setSiteSearchError(getMessage('shortcuts_error_key', '请填写触发词'));
        return;
      }
      if (/\s/.test(key)) {
        setSiteSearchError(getMessage('shortcuts_error_key_space', '触发词不能包含空格'));
        return;
      }
      if (findSiteSearchKeyConflict(key, editingSiteSearchKey || '')) {
        setSiteSearchError(getMessage('shortcuts_error_key_duplicate', '该触发词已存在，请更换'));
        return;
      }
      const template = normalizeSiteSearchTemplate(templateRaw);
      if (!template || !template.includes('{query}')) {
        setSiteSearchError(getMessage('toast_error_template', '搜索模板必须包含 {query}'));
        return;
      }
      const normalizedKey = key.toLowerCase();
      const editingItem = customSiteSearchProviders.find(
        (item) => String(item.key || '').toLowerCase() === String(editingSiteSearchKey || '').toLowerCase()
      );
      const builtinKey = getSiteSearchBuiltinKey(editingItem);
      let next = customSiteSearchProviders.filter((item) => String(item.key || '').toLowerCase() !== normalizedKey);
      if (editingSiteSearchKey && editingSiteSearchKey.toLowerCase() !== normalizedKey) {
        next = next.filter((item) => String(item.key || '').toLowerCase() !== editingSiteSearchKey.toLowerCase());
      }
      const nextItem = normalizeSiteSearchProvider({
        ...(editingItem || {}),
        key: key,
        name: name || key,
        template: template,
        aliases: aliases,
        category: siteSearchDraftCategory === 'searchEngine' ? 'searchEngine' : 'site',
        ...(builtinKey ? { builtinKey } : {})
      });
      if (!nextItem) {
        setSiteSearchError(getMessage('toast_error', '操作失败，请重试'));
        return;
      }
      next.unshift(nextItem);
      const lowerKey = normalizedKey;
      const nextDisabledKeys = new Set(disabledSiteSearchKeys);
      if (builtinKey) {
        nextDisabledKeys.add(builtinKey);
      } else {
        nextDisabledKeys.delete(lowerKey);
      }
      Promise.all([
        saveCustomSiteSearchProviders(next),
        saveDisabledSiteSearchKeys(nextDisabledKeys)
      ]).then(() => {
        customSiteSearchProviders = next;
        disabledSiteSearchKeys = nextDisabledKeys;
        renderSiteSearchList();
        refreshSiteSearchProviders();
        resetSiteSearchForm();
        setTimeout(() => {
          showToast(getMessage('toast_saved', '已保存'), false);
        }, 220);
      });
    });
  }

  if (builtinResetButton) {
    attachPopconfirm(
      builtinResetButton,
      'confirm_reset_builtin',
      '确认重置内置列表？',
      () => {
        loadDefaultSiteSearchProviders().then((defaults) => Promise.all([
          Promise.resolve(defaults),
          loadCustomSiteSearchProviders(defaults)
        ])).then(([defaults, custom]) => {
          const defaultKeys = new Set((defaults || []).map((item) => String(item.key || '').toLowerCase()));
          const filteredCustom = (custom || []).filter((item) => {
            const key = String(item && item.key ? item.key : '').toLowerCase();
            const builtinKey = getSiteSearchBuiltinKey(item);
            return key && !defaultKeys.has(key) && !defaultKeys.has(builtinKey);
          });
          Promise.all([
            saveCustomSiteSearchProviders(filteredCustom),
            saveDisabledSiteSearchKeys(new Set())
          ]).then(() => {
            customSiteSearchProviders = filteredCustom;
            disabledSiteSearchKeys = new Set();
            renderSiteSearchList();
          }).catch(() => {
            showToast(getMessage('toast_error', '操作失败，请重试'), true);
          });
        }).catch(() => {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        });
      }
    );
  }

  if (customClearButton) {
    attachPopconfirm(
      customClearButton,
      'confirm_clear_custom',
      '确认清空自定义搜索？',
      () => {
        const nextDisabledKeys = new Set(disabledSiteSearchKeys);
        customSiteSearchProviders.forEach((item) => {
          const builtinKey = getSiteSearchBuiltinKey(item);
          if (builtinKey) {
            nextDisabledKeys.delete(builtinKey);
          }
        });
        Promise.all([
          saveCustomSiteSearchProviders([]),
          saveDisabledSiteSearchKeys(nextDisabledKeys)
        ]).then(() => {
          customSiteSearchProviders = [];
          disabledSiteSearchKeys = nextDisabledKeys;
          renderSiteSearchList();
          showToast(getMessage('toast_cleared', '已清空'), false);
        }).catch(() => {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        });
      }
    );
  }

  if (blacklistClearButton) {
    attachPopconfirm(
      blacklistClearButton,
      'confirm_clear_blacklist',
      '确认清空黑名单？',
      () => {
        saveSearchBlacklistItems([]).then((savedItems) => {
          searchBlacklistItems = savedItems;
          renderSearchBlacklistList();
          resetBlacklistForm();
          notifyNewtabSectionsRefresh('recent');
          showToast(getMessage('toast_cleared', '已清空'), false);
        }).catch(() => {
          showToast(getMessage('toast_error', '操作失败，请重试'), true);
        });
      }
    );
  }
  if (faviconBlacklistClearButton) {
    attachPopconfirm(
      faviconBlacklistClearButton,
      'confirm_clear_favicon_blacklist',
      '确认清空排除规则？',
      () => {
        saveFaviconRequestBlacklistItems([]).then((savedItems) => {
          faviconRequestBlacklistItems = savedItems;
          renderFaviconRequestBlacklistList();
          resetFaviconBlacklistForm();
          showToast(getMessage('toast_cleared', '已清空'), false);
        }).catch(() => showToast(getMessage('toast_error', '操作失败，请重试'), true));
      }
    );
  }
  /*
  if (confirmOk) {
    confirmOk.addEventListener('click', () => closeConfirm(true));
  }
  if (confirmCancel) {
    confirmCancel.addEventListener('click', () => closeConfirm(false));
  }
  if (confirmMask) {
    confirmMask.addEventListener('click', (event) => {
      if (event.target === confirmMask) {
        closeConfirm(false));
      }
    });
  }
  */

  addStorageChangeListener((changes, areaName) => {
    const isPrimaryArea = isPrimaryStorageAreaName(areaName);
    if (!isPrimaryArea) {
      return;
    }
    if (changes[SYNC_META_KEY] || SYNC_KEYS.some((key) => changes[key])) {
      refreshSyncStatus();
    }
    if (changes[THEME_STORAGE_KEY]) {
      const nextMode = changes[THEME_STORAGE_KEY].newValue || 'system';
      updateThemeButtons(nextMode);
      applyResolvedTheme(resolveTheme(nextMode));
    }
    if (changes[LANGUAGE_STORAGE_KEY]) {
      applyLanguageMode(changes[LANGUAGE_STORAGE_KEY].newValue || 'system');
    }
    if (changes[RECENT_COUNT_STORAGE_KEY]) {
      const count = normalizeRecentCount(changes[RECENT_COUNT_STORAGE_KEY].newValue);
      renderRecentCountControl(count);
      updateRecentModeTabsVisibility(count);
    }
    if (changes[NEWTAB_WIDTH_MODE_STORAGE_KEY] && newtabWidthSelect) {
      const mode = normalizeNewtabWidthMode(changes[NEWTAB_WIDTH_MODE_STORAGE_KEY].newValue);
      newtabWidthSelect.value = mode;
      setNewtabWidthTabState(mode);
      refreshCustomSelects();
    }
    if (changes[OVERLAY_SIZE_MODE_STORAGE_KEY]) {
      const mode = normalizeOverlaySizeMode(changes[OVERLAY_SIZE_MODE_STORAGE_KEY].newValue);
      setOverlaySizeTabState(mode);
      refreshCustomSelects();
    }
    if (changes[OVERLAY_ENTER_ANIMATION_STORAGE_KEY]) {
      const mode = normalizeOverlayEnterAnimation(
        changes[OVERLAY_ENTER_ANIMATION_STORAGE_KEY].newValue
      );
      setOverlayEnterAnimationTabState(mode);
    }
    if (changes[OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY] &&
        overlayPageThemeAdaptationToggle) {
      const raw = changes[OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeOverlayPageThemeAdaptationEnabled(raw);
      setOptionsToggleState(overlayPageThemeAdaptationToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [OVERLAY_PAGE_THEME_ADAPTATION_ENABLED_STORAGE_KEY]: next });
      }
    }
    if (changes[SEARCH_RESULT_PRIORITY_STORAGE_KEY]) {
      const nextValue = normalizeSearchResultPriority(changes[SEARCH_RESULT_PRIORITY_STORAGE_KEY].newValue);
      if (searchResultPrioritySelect) {
        searchResultPrioritySelect.value = nextValue;
      }
      setSearchResultPriorityTabState(nextValue);
      refreshCustomSelects();
    }
    if (changes[SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY]) {
      setSearchResultSourceTypeState(changes[SEARCH_RESULT_SOURCE_TYPES_STORAGE_KEY].newValue);
    }
    if (changes[SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY]) {
      const raw = changes[SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY].newValue;
      const next = normalizeSearchResultDisplayLimit(raw);
      renderSearchResultDisplayLimitControl(next);
      if (raw !== next && storageArea) {
        storageArea.set({ [SEARCH_RESULT_DISPLAY_LIMIT_STORAGE_KEY]: next });
      }
    }
    if (changes[OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY] && overlayOpenTabsDefaultVisibleToggle) {
      const raw = changes[OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY].newValue;
      const next = normalizeOverlayOpenTabsDefaultVisible(raw);
      setOptionsToggleState(overlayOpenTabsDefaultVisibleToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [OVERLAY_OPEN_TABS_DEFAULT_VISIBLE_STORAGE_KEY]: next });
      }
    }
    if (changes[FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY] && faviconEnhancedFetchToggle) {
      const raw = changes[FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeFaviconEnhancedFetchEnabled(raw);
      setOptionsToggleState(faviconEnhancedFetchToggle, next);
      setFaviconBlacklistEditorEnabled(next);
      if (raw !== next && storageArea) {
        storageArea.set({ [FAVICON_ENHANCED_FETCH_ENABLED_STORAGE_KEY]: next });
      }
    }
    if (changes[RECENT_MODE_STORAGE_KEY] && recentModeSelect) {
      const nextValue = changes[RECENT_MODE_STORAGE_KEY].newValue;
      const mode = nextValue === 'most' ? 'most' : 'latest';
      recentModeSelect.value = mode;
      setRecentModeTabState(mode);
      refreshCustomSelects();
    }
    if (changes[BOOKMARK_COUNT_STORAGE_KEY]) {
      const stored = normalizeBookmarkCount(changes[BOOKMARK_COUNT_STORAGE_KEY].newValue);
      renderBookmarkRowsControl(stored);
      updateBookmarkColumnsSettingVisibility(stored);
    }
    if (changes[BOOKMARK_COLUMNS_STORAGE_KEY]) {
      const stored = normalizeBookmarkColumns(changes[BOOKMARK_COLUMNS_STORAGE_KEY].newValue);
      renderBookmarkColumnsControl(stored);
    }
    if (changes[BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY] && bookmarkFolderIconsVisibleToggle) {
      const raw = changes[BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY].newValue;
      const next = normalizeBookmarkFolderIconsVisible(raw);
      setOptionsToggleState(bookmarkFolderIconsVisibleToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [BOOKMARK_FOLDER_ICONS_VISIBLE_STORAGE_KEY]: next });
      }
    }
    if (changes[OVERLAY_TAB_PRIORITY_STORAGE_KEY] && overlayTabQuickSwitchToggle) {
      const next = normalizeOverlayTabQuickSwitch(changes[OVERLAY_TAB_PRIORITY_STORAGE_KEY].newValue);
      setOptionsToggleState(overlayTabQuickSwitchToggle, next);
      if (changes[OVERLAY_TAB_PRIORITY_STORAGE_KEY].newValue !== next && storageArea) {
        storageArea.set({ [OVERLAY_TAB_PRIORITY_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY]) {
      const raw = changes[NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY].newValue;
      const next = normalizeNewtabTopContentMode(raw);
      setNewtabTopContentTabState(next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_TOP_CONTENT_MODE_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY]) {
      const raw = changes[NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY].newValue;
      const next = normalizeNewtabTimeFontWeight(raw);
      renderNewtabTimeFontWeightControl(next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_TIME_FONT_WEIGHT_STORAGE_KEY]: next });
      }
    }
    if (changes[NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY] && newtabTimeSecondsToggle) {
      const raw = changes[NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY].newValue;
      const next = normalizeNewtabTimeSecondsVisible(raw);
      setOptionsToggleState(newtabTimeSecondsToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_TIME_SECONDS_VISIBLE_STORAGE_KEY]: next });
      }
    }
    if (changes[NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY] && newtabInputAutoFocusToggle) {
      const raw = changes[NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeNewtabInputAutoFocusEnabled(raw);
      setOptionsToggleState(newtabInputAutoFocusToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_INPUT_AUTO_FOCUS_ENABLED_STORAGE_KEY]: next });
      }
    }
    if (changes[NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY] && newtabShortcutsToggle) {
      const raw = changes[NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY].newValue;
      const next = normalizeNewtabShortcutsVisible(raw);
      setOptionsToggleState(newtabShortcutsToggle, next);
      syncNewtabShortcutSubcontrolAvailability();
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_SHORTCUTS_VISIBLE_STORAGE_KEY]: next });
      }
    }
    if (changes[NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY] && newtabShortcutAddToggle) {
      const raw = changes[NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY].newValue;
      const next = normalizeNewtabShortcutAddVisible(raw);
      setOptionsToggleState(newtabShortcutAddToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_SHORTCUT_ADD_VISIBLE_STORAGE_KEY]: next });
      }
    }
    if (changes[NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY] &&
        newtabShortcutDockMagnificationToggle) {
      const raw = changes[NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeNewtabShortcutDockMagnificationEnabled(raw);
      setOptionsToggleState(newtabShortcutDockMagnificationToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({
          [NEWTAB_SHORTCUT_DOCK_MAGNIFICATION_ENABLED_STORAGE_KEY]: next
        });
      }
    }
    if (changes[NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY]) {
      const raw = changes[NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY].newValue;
      const next = normalizeNewtabShortcutWidth(raw);
      renderNewtabShortcutWidthControl(
        next,
        Boolean(newtabShortcutsToggle && !newtabShortcutsToggle.checked)
      );
      if (raw !== next && storageArea) {
        storageArea.set({ [NEWTAB_SHORTCUT_WIDTH_STORAGE_KEY]: next });
      }
    }
    [
      [
        newtabFeedbackButtonVisibleToggle,
        NEWTAB_FEEDBACK_BUTTON_VISIBLE_STORAGE_KEY,
        normalizeNewtabFeedbackButtonVisible
      ],
      [
        newtabAppearanceButtonVisibleToggle,
        NEWTAB_APPEARANCE_BUTTON_VISIBLE_STORAGE_KEY,
        normalizeNewtabAppearanceButtonVisible
      ]
    ].forEach(([toggle, storageKey, normalize]) => {
      if (!changes[storageKey] || !toggle) {
        return;
      }
      const raw = changes[storageKey].newValue;
      const next = normalize(raw);
      setOptionsToggleState(toggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [storageKey]: next });
      }
    });
    if (changes[UPDATE_NOTICE_ENABLED_STORAGE_KEY] && updateNoticeToggle) {
      const raw = changes[UPDATE_NOTICE_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeUpdateNoticeEnabled(raw);
      setOptionsToggleState(updateNoticeToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [UPDATE_NOTICE_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[MOTION_EFFECTS_ENABLED_STORAGE_KEY] && motionEffectsToggle) {
      const raw = changes[MOTION_EFFECTS_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeMotionEffectsEnabled(raw);
      setOptionsToggleState(motionEffectsToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [MOTION_EFFECTS_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[SIMPLE_MODE_ENABLED_STORAGE_KEY] && simpleModeToggle) {
      const raw = changes[SIMPLE_MODE_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeSimpleModeEnabled(raw);
      setOptionsToggleState(simpleModeToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [SIMPLE_MODE_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY] && numberShortcutInstantToggle) {
      const raw = changes[NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeNumberShortcutInstantEnabled(raw);
      setOptionsToggleState(numberShortcutInstantToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [NUMBER_SHORTCUT_INSTANT_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY] &&
        macosCtrlSuggestionNavigationToggle) {
      const raw = changes[MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeMacosCtrlSuggestionNavigationEnabled(raw);
      setOptionsToggleState(macosCtrlSuggestionNavigationToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [MACOS_CTRL_SUGGESTION_NAVIGATION_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[AUTO_PIP_ENABLED_STORAGE_KEY] && autoPipToggle) {
      const raw = changes[AUTO_PIP_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeAutoPipEnabled(raw);
      setOptionsToggleState(autoPipToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [AUTO_PIP_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[TAB_SWITCHER_ENABLED_STORAGE_KEY] && tabSwitcherToggle) {
      const raw = changes[TAB_SWITCHER_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeTabSwitcherEnabled(raw);
      setOptionsToggleState(tabSwitcherToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [TAB_SWITCHER_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[DOCUMENT_PIP_ENABLED_STORAGE_KEY] && documentPipToggle) {
      const raw = changes[DOCUMENT_PIP_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeDocumentPipEnabled(raw);
      setOptionsToggleState(documentPipToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [DOCUMENT_PIP_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY] && pinnedTabRecoveryToggle) {
      const raw = changes[PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY].newValue;
      const next = normalizePinnedTabRecoveryEnabled(raw);
      setOptionsToggleState(pinnedTabRecoveryToggle, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [PINNED_TAB_RECOVERY_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY] && selectionQuickActionsToggle) {
      const raw = changes[SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeSelectionQuickActionsEnabled(raw);
      setOptionsToggleState(selectionQuickActionsToggle, next);
      syncSelectionQuickActionsProviderAvailability();
      if (raw !== next && storageArea) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY] && selectionQuickActionsProviderSelect) {
      const raw = changes[SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY].newValue;
      const next = normalizeSelectionQuickActionsProvider(raw);
      setOptionsSelectState(selectionQuickActionsProviderSelect, next);
      if (raw !== next && storageArea) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_PROVIDER_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY] && selectionQuickActionsGroupToggle) {
      const raw = changes[SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY].newValue;
      const next = normalizeSelectionQuickActionsGroupEnabled(raw);
      setOptionsToggleState(selectionQuickActionsGroupToggle, next);
      syncSelectionQuickActionsProviderAvailability();
      if (raw !== next && storageArea) {
        storageArea.set({ [SELECTION_QUICK_ACTIONS_GROUP_ENABLED_STORAGE_KEY]: next });
      }
      refreshCustomSelects();
    }
    if (changes[RESTRICTED_ACTION_STORAGE_KEY] && restrictedActionSelect) {
      const raw = changes[RESTRICTED_ACTION_STORAGE_KEY].newValue;
      const nextValue = raw === 'none' ? 'none' : 'default';
      restrictedActionSelect.value = nextValue;
      setRestrictedActionTabState(nextValue);
      if (raw !== nextValue && storageArea) {
        storageArea.set({ [RESTRICTED_ACTION_STORAGE_KEY]: nextValue });
      }
      refreshCustomSelects();
    }
    if (changes[FALLBACK_SHORTCUT_STORAGE_KEY]) {
      loadCurrentShortcut();
    }
    if (changes[SEARCH_BLACKLIST_STORAGE_KEY]) {
      searchBlacklistItems = normalizeSearchBlacklistItems(changes[SEARCH_BLACKLIST_STORAGE_KEY].newValue);
      renderSearchBlacklistList();
    }
    if (changes[FAVICON_REQUEST_BLACKLIST_STORAGE_KEY]) {
      faviconRequestBlacklistItems = normalizeFaviconRequestBlacklistItems(
        changes[FAVICON_REQUEST_BLACKLIST_STORAGE_KEY].newValue
      );
      renderFaviconRequestBlacklistList();
    }
    if (!changes[SITE_SEARCH_STORAGE_KEY] && !changes[SITE_SEARCH_DISABLED_STORAGE_KEY]) {
      return;
    }
    const now = Date.now();
    if (siteSearchRefreshSuppressUntil && now < siteSearchRefreshSuppressUntil) {
      if (siteSearchRefreshTimer) {
        clearTimeout(siteSearchRefreshTimer);
      }
      const delay = Math.max(siteSearchRefreshSuppressUntil - now, 0) + 40;
      siteSearchRefreshTimer = setTimeout(() => {
        siteSearchRefreshTimer = null;
        refreshSiteSearchProviders();
      }, delay);
      return;
    }
    refreshSiteSearchProviders();
  });
})();
