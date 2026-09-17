(function(){
  var THEME_KEY = 'offlist_theme';

  function getStoredTheme(){
    try { return localStorage.getItem(THEME_KEY); } catch(e){ return null; }
  }
  function storeTheme(v){
    try { localStorage.setItem(THEME_KEY, v); } catch(e){ /* unavailable, theme still applies for this session */ }
  }
  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(function(b){
      b.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // Apply theme as early as possible to avoid a flash of the wrong theme.
  var stored = getStoredTheme();
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  // Event delegation: works regardless of exactly when this script runs
  // relative to DOM parsing, and covers buttons even if the DOM shifts.
  document.addEventListener('click', function(e){
    var toggleBtn = e.target.closest && e.target.closest('.theme-toggle');
    if (toggleBtn){
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
      return;
    }

    var hamburger = e.target.closest && e.target.closest('#hamburgerBtn');
    var closeBtn = e.target.closest && e.target.closest('#sideNavClose');
    var overlay = e.target.closest && e.target.closest('#sideNavOverlay');
    var navLink = e.target.closest && e.target.closest('#sideNav a');
    var sideNav = document.getElementById('sideNav');
    var sideNavOverlay = document.getElementById('sideNavOverlay');
    if (!sideNav || !sideNavOverlay) return;

    if (hamburger){ sideNav.classList.add('open'); sideNavOverlay.classList.add('open'); }
    if (closeBtn || overlay || navLink){ sideNav.classList.remove('open'); sideNavOverlay.classList.remove('open'); }
  });

  // Re-apply on load too, in case something else touched the attribute first.
  document.addEventListener('DOMContentLoaded', function(){
    applyTheme(currentTheme());
  });
})();
