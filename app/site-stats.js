(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }

  var api = factory();
  var hostWindow = root && root.window ? root.window : root;
  if (hostWindow) {
    hostWindow.DPRSiteStats = api;
    if (typeof api.autoInit === 'function') {
      api.autoInit(hostWindow);
    }
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
      ? self
      : this,
  function () {
    'use strict';

    var DEFAULTS = {
      supabaseUrl: 'https://lyucdwgefyfbmaiopjbk.supabase.co',
      supabaseKey: 'sb_publishable_lX-oi64Uxyd7SIVv3_w2Uw_MTOojeKq',
      countsDateColumn: 'visit_date',
      githubRepoApi: 'https://api.github.com/repos/ziwenhahaha/daily-paper-reader',
      forkCacheMs: 6 * 60 * 60 * 1000,
      timezone: 'Asia/Shanghai',
      selectors: {
        container: '[data-dpr-site-stats]',
        readers: '[data-dpr-daily-readers]',
        forks: '[data-dpr-fork-count]',
      },
      storageKeys: {
        visitorId: 'dpr-site-stats-visitor-id',
        successDate: 'dpr-site-stats-last-success-date',
        forkCache: 'dpr-site-stats-fork-cache',
      },
    };

    function mergeObjects(base, extra) {
      var merged = {};
      var key;
      base = base || {};
      extra = extra || {};
      for (key in base) {
        if (Object.prototype.hasOwnProperty.call(base, key)) {
          merged[key] = base[key];
        }
      }
      for (key in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, key)) {
          if (
            merged[key] &&
            typeof merged[key] === 'object' &&
            !Array.isArray(merged[key]) &&
            extra[key] &&
            typeof extra[key] === 'object' &&
            !Array.isArray(extra[key])
          ) {
            merged[key] = mergeObjects(merged[key], extra[key]);
          } else {
            merged[key] = extra[key];
          }
        }
      }
      return merged;
    }

    function resolveConfig(win, overrideConfig) {
      var windowConfig = win && win.DPR_SITE_STATS_CONFIG ? win.DPR_SITE_STATS_CONFIG : null;
      return mergeObjects(DEFAULTS, mergeObjects(windowConfig, overrideConfig));
    }

    function resolveTextEncoder() {
      if (typeof TextEncoder !== 'undefined') return TextEncoder;
      try {
        return require('node:util').TextEncoder;
      } catch (_err) {
        return null;
      }
    }

    function resolveNodeCrypto() {
      try {
        return require('node:crypto');
      } catch (_err) {
        return null;
      }
    }

    function getBeijingDateString(input) {
      var date = input instanceof Date ? input : new Date(input || Date.now());
      var formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: DEFAULTS.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      var parts = formatter.formatToParts(date);
      var result = { year: '', month: '', day: '' };
      var i;
      for (i = 0; i < parts.length; i += 1) {
        if (parts[i] && result[parts[i].type] !== undefined) {
          result[parts[i].type] = parts[i].value;
        }
      }
      return result.year + '-' + result.month + '-' + result.day;
    }

    function createUuid(cryptoImpl) {
      if (cryptoImpl && typeof cryptoImpl.randomUUID === 'function') {
        return cryptoImpl.randomUUID();
      }

      var randomBytes = new Uint8Array(16);
      if (cryptoImpl && typeof cryptoImpl.getRandomValues === 'function') {
        cryptoImpl.getRandomValues(randomBytes);
      } else {
        var idx;
        for (idx = 0; idx < randomBytes.length; idx += 1) {
          randomBytes[idx] = Math.floor(Math.random() * 256);
        }
      }

      randomBytes[6] = (randomBytes[6] & 15) | 64;
      randomBytes[8] = (randomBytes[8] & 63) | 128;

      var hex = [];
      var i;
      for (i = 0; i < randomBytes.length; i += 1) {
        hex.push((randomBytes[i] + 256).toString(16).slice(1));
      }
      return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10, 16).join(''),
      ].join('-');
    }

    async function sha256Hex(value, cryptoImpl) {
      var text = String(value == null ? '' : value);
      var Encoder = resolveTextEncoder();
      if (cryptoImpl && cryptoImpl.subtle && typeof cryptoImpl.subtle.digest === 'function' && Encoder) {
        var digest = await cryptoImpl.subtle.digest('SHA-256', new Encoder().encode(text));
        var bytes = new Uint8Array(digest);
        return Array.prototype.map.call(bytes, function (byte) {
          return byte.toString(16).padStart(2, '0');
        }).join('');
      }

      var nodeCrypto = resolveNodeCrypto();
      if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
        return nodeCrypto.createHash('sha256').update(text, 'utf8').digest('hex');
      }

      throw new Error('sha256 unavailable');
    }

    function getLocalStorageValue(storage, key) {
      try {
        return storage && typeof storage.getItem === 'function' ? storage.getItem(key) : null;
      } catch (_err) {
        return null;
      }
    }

    function setLocalStorageValue(storage, key, value) {
      try {
        if (storage && typeof storage.setItem === 'function') {
          storage.setItem(key, value);
        }
      } catch (_err) {
        // ignore
      }
    }

    function resolveGithubToken(win, explicitToken) {
      var token = String(explicitToken || '').trim();
      if (token) return token;

      try {
        var secret = (win && win.decoded_secret_private) || {};
        token = String((secret.github && secret.github.token) || '').trim();
        if (token) return token;
      } catch (_err) {
        // ignore
      }

      try {
        var tokenLoader = win
          && win.SubscriptionsGithubToken
          && typeof win.SubscriptionsGithubToken.loadGithubToken === 'function'
          ? win.SubscriptionsGithubToken.loadGithubToken
          : null;
        var stored = tokenLoader ? tokenLoader.call(win.SubscriptionsGithubToken) : null;
        return String((stored && stored.token) || stored || '').trim();
      } catch (_err) {
        return '';
      }
    }

    function setHidden(element, hidden) {
      if (!element) return;
      element.hidden = !!hidden;
      try {
        if (hidden) {
          element.setAttribute && element.setAttribute('hidden', '');
        } else if (element.removeAttribute) {
          element.removeAttribute('hidden');
        }
      } catch (_err) {
        // ignore
      }
    }

    function toPositiveInteger(value, fallback) {
      var numeric = Number(value);
      if (!Number.isFinite(numeric) || numeric < 0) return fallback;
      return Math.round(numeric);
    }

    function formatCount(value) {
      return toPositiveInteger(value, 0).toLocaleString('zh-CN');
    }

    function readForkCache(storage, storageKey, nowMs, maxAgeMs) {
      var raw = getLocalStorageValue(storage, storageKey);
      if (!raw) return null;
      try {
        var parsed = JSON.parse(raw);
        if (
          parsed &&
          Number.isFinite(parsed.forkCount) &&
          Number.isFinite(parsed.savedAt) &&
          nowMs - parsed.savedAt < maxAgeMs
        ) {
          return {
            forkCount: Math.round(parsed.forkCount),
            savedAt: parsed.savedAt,
          };
        }
      } catch (_err) {
        return null;
      }
      return null;
    }

    function createSiteStats(options) {
      options = options || {};
      var win = options.window || (typeof window !== 'undefined' ? window : null);
      var doc = options.document || (win && win.document) || null;
      var storage = options.localStorage || (win && win.localStorage) || null;
      var fetchImpl = options.fetch || (win && typeof win.fetch === 'function' ? win.fetch.bind(win) : null);
      var cryptoImpl = options.crypto || (win && win.crypto) || (typeof crypto !== 'undefined' ? crypto : null);
      var githubToken = resolveGithubToken(win, options.githubToken);
      var config = resolveConfig(win, options.config);
      var now = typeof options.now === 'function' ? options.now : function () {
        return new Date();
      };
      var state = {
        inFlight: null,
        rerunRequested: false,
      };

      function getToday() {
        return getBeijingDateString(now());
      }

      function getTargets() {
        if (!doc || typeof doc.querySelector !== 'function') {
          return {
            container: null,
            readers: null,
            forks: null,
          };
        }
        return {
          container: doc.querySelector(config.selectors.container),
          readers: doc.querySelector(config.selectors.readers),
          forks: doc.querySelector(config.selectors.forks),
        };
      }

      function hideStats() {
        var targets = getTargets();
        setHidden(targets.container, true);
        return targets;
      }

      function showStats(readerCount, forkCount, targets) {
        targets = targets || getTargets();
        if (targets.readers) {
          targets.readers.textContent = formatCount(readerCount);
        }
        if (targets.forks) {
          targets.forks.textContent = formatCount(forkCount);
        }
        setHidden(targets.container, false);
        return targets;
      }

      function ensureVisitorId() {
        var stored = getLocalStorageValue(storage, config.storageKeys.visitorId);
        if (stored) return stored;
        var created = createUuid(cryptoImpl);
        setLocalStorageValue(storage, config.storageKeys.visitorId, created);
        return created;
      }

      async function ensureDailyEvent(today) {
        var lastSuccess = getLocalStorageValue(storage, config.storageKeys.successDate);
        if (lastSuccess === today) {
          return { ok: true, skipped: true };
        }
        if (!fetchImpl) {
          return { ok: false, error: new Error('fetch unavailable') };
        }

        try {
          var visitorHash = await sha256Hex(ensureVisitorId(), cryptoImpl);
          var response = await fetchImpl(config.supabaseUrl + '/rest/v1/site_daily_reader_events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Prefer: 'return=minimal',
              apikey: config.supabaseKey,
              Authorization: 'Bearer ' + config.supabaseKey,
            },
            body: JSON.stringify({
              visit_date: today,
              visitor_hash: visitorHash,
            }),
          });
          if (!response || (!response.ok && response.status !== 409)) {
            return { ok: false, status: response ? response.status : 0 };
          }
          setLocalStorageValue(storage, config.storageKeys.successDate, today);
          return { ok: true, skipped: false, duplicate: response.status === 409 };
        } catch (error) {
          return { ok: false, error: error };
        }
      }

      async function fetchDailyReaderCount(today) {
        if (!fetchImpl) {
          return { ok: false, error: new Error('fetch unavailable') };
        }

        var url =
          config.supabaseUrl +
          '/rest/v1/site_daily_reader_counts?select=reader_count&' +
          encodeURIComponent(config.countsDateColumn) +
          '=eq.' +
          encodeURIComponent(today) +
          '&limit=1';

        try {
          var response = await fetchImpl(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              apikey: config.supabaseKey,
              Authorization: 'Bearer ' + config.supabaseKey,
            },
          });
          if (!response || !response.ok) {
            return { ok: false, status: response ? response.status : 0 };
          }
          var payload = await response.json();
          var count = 0;
          if (Array.isArray(payload) && payload.length > 0 && payload[0]) {
            count = toPositiveInteger(payload[0].reader_count, 0);
          } else if (payload && typeof payload === 'object' && payload.reader_count != null) {
            count = toPositiveInteger(payload.reader_count, 0);
          }
          return { ok: true, readerCount: count };
        } catch (error) {
          return { ok: false, error: error };
        }
      }

      async function fetchForkCount() {
        var currentTime = now().getTime();
        var cached = readForkCache(storage, config.storageKeys.forkCache, currentTime, config.forkCacheMs);
        if (cached) {
          return { ok: true, forkCount: cached.forkCount, cached: true };
        }
        if (!fetchImpl) {
          return { ok: false, error: new Error('fetch unavailable') };
        }

        try {
          var githubHeaders = {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          };
          if (githubToken) {
            githubHeaders.Authorization = 'Bearer ' + githubToken;
          }
          var response = await fetchImpl(config.githubRepoApi, {
            method: 'GET',
            headers: githubHeaders,
          });
          if (!response || !response.ok) {
            return { ok: false, status: response ? response.status : 0 };
          }
          var payload = await response.json();
          var forkCount = toPositiveInteger(payload && payload.forks_count, 0);
          setLocalStorageValue(
            storage,
            config.storageKeys.forkCache,
            JSON.stringify({
              forkCount: forkCount,
              savedAt: currentTime,
            }),
          );
          return { ok: true, forkCount: forkCount, cached: false };
        } catch (error) {
          return { ok: false, error: error };
        }
      }

      async function runInit() {
        hideStats();

        try {
          var today = getToday();
          var postResult = await ensureDailyEvent(today);
          if (!postResult.ok) {
            return { ok: false, reason: 'post-failed', detail: postResult };
          }

          var targets = getTargets();
          if (!targets.container || !targets.readers || !targets.forks) {
            return {
              ok: true,
              date: today,
              displayed: false,
              postSkipped: !!postResult.skipped,
            };
          }

          var countResult = await fetchDailyReaderCount(today);
          if (!countResult.ok) {
            return { ok: false, reason: 'count-failed', detail: countResult };
          }

          var forkResult = await fetchForkCount();
          if (!forkResult.ok) {
            return { ok: false, reason: 'fork-failed', detail: forkResult };
          }

          targets = getTargets();
          if (!targets.container || !targets.readers || !targets.forks) {
            return {
              ok: true,
              date: today,
              displayed: false,
              readerCount: countResult.readerCount,
              forkCount: forkResult.forkCount,
              postSkipped: !!postResult.skipped,
              forkCached: !!forkResult.cached,
            };
          }

          showStats(countResult.readerCount, forkResult.forkCount, targets);
          return {
            ok: true,
            date: today,
            displayed: true,
            readerCount: countResult.readerCount,
            forkCount: forkResult.forkCount,
            postSkipped: !!postResult.skipped,
            forkCached: !!forkResult.cached,
          };
        } catch (error) {
          return { ok: false, reason: 'unexpected', error: error };
        }
      }

      function init() {
        if (state.inFlight) {
          state.rerunRequested = true;
          return state.inFlight;
        }
        state.inFlight = Promise.resolve(runInit()).finally(function () {
          state.inFlight = null;
          if (state.rerunRequested) {
            state.rerunRequested = false;
            init();
          }
        });
        return state.inFlight;
      }

      function getConfig() {
        return config;
      }

      return {
        init: init,
        getToday: getToday,
        getConfig: getConfig,
        hideStats: hideStats,
        showStats: showStats,
        ensureVisitorId: ensureVisitorId,
        ensureDailyEvent: ensureDailyEvent,
        fetchDailyReaderCount: fetchDailyReaderCount,
        fetchForkCount: fetchForkCount,
      };
    }

    function autoInit(hostWindow) {
      hostWindow = hostWindow || (typeof window !== 'undefined' ? window : null);
      if (!hostWindow || hostWindow.__DPR_SITE_STATS_AUTO_INIT__) {
        return hostWindow && hostWindow.DPRSiteStatsInstance ? hostWindow.DPRSiteStatsInstance : null;
      }

      var doc = hostWindow.document;
      var instance = createSiteStats({
        window: hostWindow,
        document: doc,
        localStorage: hostWindow.localStorage,
        fetch: hostWindow.fetch && hostWindow.fetch.bind ? hostWindow.fetch.bind(hostWindow) : hostWindow.fetch,
        crypto: hostWindow.crypto,
      });

      hostWindow.DPRSiteStatsInstance = instance;
      hostWindow.__DPR_SITE_STATS_AUTO_INIT__ = true;

      function triggerInit() {
        try {
          var result = instance.init();
          if (result && typeof result.catch === 'function') {
            result.catch(function () {
              return null;
            });
          }
        } catch (_err) {
          // ignore
        }
      }

      if (doc && typeof doc.addEventListener === 'function') {
        doc.addEventListener('dpr-docsify-ready', triggerInit);
        if (doc.readyState === 'loading') {
          doc.addEventListener('DOMContentLoaded', triggerInit, { once: true });
        } else {
          triggerInit();
        }
      } else {
        triggerInit();
      }

      return instance;
    }

    return {
      DEFAULTS: DEFAULTS,
      autoInit: autoInit,
      createSiteStats: createSiteStats,
      createUuid: createUuid,
      formatCount: formatCount,
      getBeijingDateString: getBeijingDateString,
      resolveGithubToken: resolveGithubToken,
      sha256Hex: sha256Hex,
    };
  },
);
