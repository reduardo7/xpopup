/**
 * @param {import('./xpopup').IXPopupInstance} p
 * @returns {import('./xpopup')IXPopupInstance}
 */
function xpopup(p) {
  const d = function (v) {
    return typeof v !== 'undefined' && v !== null;
  };

  const _id = 'xpopup-modal';

  let o = '',
    u = p.url,
    name = p.name,
    w = p.width,
    h = p.height,
    l = p.left,
    t = p.top,
    r = {};

  const ap = function (c, x) {
    if (o !== '') o += ',';
    o += c + '=' + x;
  };

  const pa = function (config, param, def) {
    if (d(param)) {
      if (param === false || param === true) {
        ap(config, param ? '1' : '0');
      } else {
        ap(config, param);
      }
      return param;
    } else if (d(def)) {
      pa(config, def);
      return def;
    }
  };

  // URL
  if (u && d(p.data)) {
    // Add params to URL
    for (const [key, value] of Object.entries(p.data))
      u += `${u.indexOf('?') < 0 ? '?' : '&'}${escape(key)}=${escape(value)}`;
  } else if (!d(u)) {
    u = '';
  }

  if (!d(name)) name = 'popup_' + new Date().getTime();

  pa('toolbar', p.toolbar, false);
  pa('location', p.location, false);
  pa('status', p.status, '');
  pa('menubar', p.menubar, false);
  pa('scrollbars', p.scrollbars, true);
  pa('resizable', p.resizable, true);

  if (!pa('fullscreen', p.fullscreen, false)) {
    if (!d(w)) w = 500;
    if (!d(h)) h = 400;

    if (!(d(t) && d(l))) {
      let sh = screen.height,
        sw = screen.width;
      if (p.center) {
        // Center in screen
        t = parseInt(sh / 2 - h / 2);
        l = parseInt(sw / 2 - w / 2);
      } else if (p.position) {
        // Position in screen
        const c = p.position.toLowerCase().trim().split(/\s+/);
        // Parent
        if (c.indexOf('screen') > -1) {
          sh = window.outerHeight;
          sw = window.outerWidth;
        }
        // Top
        if (c.indexOf('top') > -1) {
          t = 0;
        } else if (c.indexOf('bottom') > -1) {
          t = sh - h - 100;
        } else if (c.indexOf('middle') > -1) {
          t = parseInt(sh / 2 - h / 2);
        }
        // Left
        if (c.indexOf('left') > -1) {
          l = 0;
        } else if (c.indexOf('right') > -1) {
          l = sw - w - 30;
        } else if (c.indexOf('center') > -1) {
          l = parseInt(sw / 2 - w / 2);
        }
      }
    }

    pa('width', p.width, w);
    pa('height', p.height, h);
    pa('left', p.left, l);
    pa('top', p.top, t);
  }

  // Extended methods
  r.center = function () {
    if (r.win) {
      try {
        // Check permission
        if (typeof r.win.moveTo !== 'function') {
          console.debug('xPopUp moveTo is not a function!');
          return false;
        }

        let win = r.win,
          sw = screen.width,
          sh = screen.height,
          ww = win.outerWidth,
          wh = win.outerHeight,
          x = parseInt(sw / 2 - ww / 2),
          y = parseInt(sh / 2 - wh / 2);

        if (x < 0) {
          x = 0;
        }

        if (y < 0) {
          y = 0;
        }

        if (x >= sw - 10) {
          x = sw - ww;
        }

        if (y >= sh - 10) {
          y = sh - wh;
        }

        win.moveTo(x, y);
        return true;
      } catch (err) {
        console.debug('xPopUp error', err);
      }
    }

    return false;
  };

  r.maximize = function () {
    try {
      const win = r.win;
      win.moveTo(0, 0);
      if (document.all) {
        win.resizeTo(screen.availWidth, screen.availHeight);
      } else if (document.layers || document.getElementById) {
        if (
          win.outerHeight < screen.availHeight ||
          win.outerWidth < screen.availWidth
        ) {
          win.outerHeight = screen.availHeight;
          win.outerWidth = screen.availWidth;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  r.focus = function () {
    if (r.win) r.win.focus();
    return r;
  };

  r.closed = function () {
    return r.win ? r.win.closed : null;
  };

  r.close = function () {
    if (r.win) r.win.close();
    return r;
  };

  r.open = function () {
    // Open
    r.win = window.open(u, name, o);

    // On Open
    if (r.win && typeof p.onOpen === 'function') {
      p.onOpen.apply(r);
    }

    // On Error
    if (!r.win && typeof p.onError === 'function') {
      p.onError.apply(r);
    }

    return r;
  };

  // Modal
  if (p.modal) {
    const wf = function (e) {
      if (r.closed()) {
        window.removeEventListener('click', wf);
        document.removeEventListener('focus', wf);
        document.removeEventListener('keydown', wf);
      } else {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        r.center();
        r.focus();
        return false;
      }
    };
    window.addEventListener('click', wf);
    document.addEventListener('focus', wf);
    document.addEventListener('keydown', wf);

    const modalW = document.createElement('div');
    modalW.setAttribute(
      'style',
      [
        'border:0 none',
        'display:block',
        'height:100%',
        'left:0',
        'margin:0',
        'padding:0',
        'position:absolute',
        'top:0',
        'width:100%',
        'z-index:99999',
        'background-color:rgba(0,0,0,0.5)',
      ].join(';')
    );
    modalW.setAttribute('id', _id);
    document.body.appendChild(modalW);
  }

  // On Popup Close
  const xoc = typeof p.onClose === 'function';
  if (xoc || p.modal) {
    const wc = setInterval(function () {
      if (r.closed()) {
        clearInterval(wc);
        const e = document.getElementById(_id);
        if (d(e)) document.body.removeChild(e);
        if (xoc) p.onClose.apply(r);
      }
    }, 50);
  }

  // On Parent Unload
  if (p.closeOnParentUnload) {
    window.addEventListener('unload', r.close, false);
  }

  // Open
  if (p.autoOpen !== false) {
    r.open();
  }

  // Return
  return r;
}

if (typeof module !== 'undefined') {
  module.exports = xpopup;
}
