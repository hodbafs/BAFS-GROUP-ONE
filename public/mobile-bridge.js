/**
 * BAFS GROUP ONE — Capacitor Native Bridge
 * Handles Status Bar, Splash Screen, Push Notifications, Safe Area, and Mobile Navigation.
 */
(function() {
  if (typeof window === 'undefined') return;

  const isNative = () => {
    return Boolean(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  };

  // Mobile Bottom Navigation Tabs Definition
  const NAV_TABS = [
    {
      id: 'tab-home',
      label: 'หน้าหลัก',
      hash: '#home',
      match: ['#home', '#welcome', '#checkin', ''],
      icon: '<svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"/></svg>'
    },
    {
      id: 'tab-play',
      label: 'เล่น/GROUP',
      hash: '#play',
      match: ['#play', '#journey', '#values', '#arena'],
      icon: '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
    },
    {
      id: 'tab-community',
      label: 'ชุมชน',
      hash: '#community',
      match: ['#community', '#thanks', '#voice', '#change', '#talk'],
      icon: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    },
    {
      id: 'tab-my',
      label: 'ของฉัน',
      hash: '#my',
      match: ['#my', '#hpe', '#terms'],
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>'
    }
  ];

  // Render & Mount Bottom Navigation Bar
  function mountBottomNav() {
    if (document.getElementById('mobile-bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'แถบเมนูหลักสำหรับมือถือ');

    nav.innerHTML = NAV_TABS.map(tab => `
      <a href="${tab.hash}" class="mobile-nav-item" id="${tab.id}" onclick="window.onMobileTabClick && window.onMobileTabClick('${tab.id}', event)">
        <span class="nav-icon" aria-hidden="true">${tab.icon}</span>
        <span>${tab.label}</span>
      </a>
    `).join('');

    document.body.appendChild(nav);
    updateActiveTab();
  }

  // Update active state based on window.location.hash
  function updateActiveTab() {
    const hash = window.location.hash || '#home';
    const cleanHash = hash.split('?')[0];

    // Hide bottom nav on login or signup screens
    const isAuth = ['#login', '#signup', '#pending'].includes(cleanHash);
    document.body.classList.toggle('auth-mode-active', isAuth);

    NAV_TABS.forEach(tab => {
      const el = document.getElementById(tab.id);
      if (!el) return;
      const isActive = tab.match.some(m => m === cleanHash || (m && cleanHash.startsWith(m)));
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  // Optional tab click vibration/sound
  window.onMobileTabClick = function(id, evt) {
    if (typeof window.sound === 'function') {
      try { window.sound(); } catch (_) {}
    }
  };

  // Initialize Native Features via Capacitor Plugins
  async function initCapacitor() {
    if (!isNative()) {
      return;
    }

    document.body.classList.add('is-native-app');
    const { Plugins } = window.Capacitor;

    // 1. Status Bar Setup
    if (window.Capacitor.isPluginAvailable('StatusBar')) {
      try {
        const { StatusBar, Style } = window.Capacitor.Plugins;
        await StatusBar.setStyle({ style: Style?.Dark || 'DARK' });
        await StatusBar.setBackgroundColor({ color: '#111d2b' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (e) {
        console.warn('[MobileBridge] StatusBar init note:', e);
      }
    }

    // 2. Hide Splash Screen smoothly once content is loaded
    if (window.Capacitor.isPluginAvailable('SplashScreen')) {
      try {
        const { SplashScreen } = window.Capacitor.Plugins;
        setTimeout(() => {
          SplashScreen.hide({ fadeOutDuration: 300 });
        }, 1200);
      } catch (e) {
        console.warn('[MobileBridge] SplashScreen init note:', e);
      }
    }

    // 3. Android Hardware Back Button
    if (window.Capacitor.isPluginAvailable('App')) {
      try {
        const { App } = window.Capacitor.Plugins;
        App.addListener('backButton', ({ canGoBack }) => {
          // If modal dialog is open, close it
          const openDialog = document.querySelector('dialog[open]');
          if (openDialog) {
            if (openDialog.id === 'arena' && typeof window.leaveGame === 'function') {
              window.leaveGame();
            } else if (typeof window.closeModal === 'function') {
              window.closeModal();
            } else {
              openDialog.close();
            }
            return;
          }

          // If on sub-page, navigate back or home
          const hash = window.location.hash;
          if (hash && hash !== '#home' && hash !== '') {
            window.location.hash = '#home';
          } else if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
      } catch (e) {
        console.warn('[MobileBridge] App backButton init note:', e);
      }
    }

    // 4. Push Notifications Setup
    if (window.Capacitor.isPluginAvailable('PushNotifications')) {
      try {
        const { PushNotifications } = window.Capacitor.Plugins;
        const permStatus = await PushNotifications.requestPermissions();
        if (permStatus.receive === 'granted') {
          await PushNotifications.register();
        }

        PushNotifications.addListener('registration', token => {
          console.log('[PushNotifications] Device Token:', token.value);
          window.ONE_DEVICE_PUSH_TOKEN = token.value;
        });

        PushNotifications.addListener('registrationError', err => {
          console.warn('[PushNotifications] Registration error:', err);
        });

        PushNotifications.addListener('pushNotificationReceived', notification => {
          console.log('[PushNotifications] Received in foreground:', notification);
          if (typeof window.toast === 'function') {
            window.toast((notification.title ? `🔔 ${notification.title}: ` : '') + (notification.body || 'มีการแจ้งเตือนใหม่'));
          }
        });

        PushNotifications.addListener('pushNotificationActionPerformed', action => {
          const data = action.notification.data;
          if (data && data.route) {
            window.location.hash = data.route;
          } else if (data && data.kind === 'thanks') {
            window.location.hash = '#thanks';
          } else if (data && data.kind === 'voice') {
            window.location.hash = '#voice';
          }
        });
      } catch (e) {
        console.warn('[MobileBridge] PushNotifications init note:', e);
      }
    }
  }

  // Hook into DOM lifecycle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountBottomNav();
      initCapacitor();
    });
  } else {
    mountBottomNav();
    initCapacitor();
  }

  window.addEventListener('hashchange', updateActiveTab);
  window.addEventListener('popstate', updateActiveTab);

  // Expose global bridge
  window.ONE_MOBILE = {
    isNative,
    updateActiveTab,
    initCapacitor
  };
})();
