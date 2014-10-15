/**
* Open a PopUp Window.
* Copyright (c) 2013 XPOPUP | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
*
* By: Edueado Daniel Cuomo.
*
* Project: https://github.com/reduardo7/xpopup
*
* @param p {Object} Options:
*  url {String} URL to load in PopUp.
*  data {Object} URL params. If "url" is not used, this option is not used.
*  name {Stirng} Window name.
*  fullscreen {Boolean} DEFAULT: false. Open PopUp as full screen.
*  toolbar {Boolean} DEFAULT: false. Show toolbar in PopUp?
*  location {Boolean} Default: false. Lock location bar?
*  status {String} Default: "". Text in status bar.
*  menubar {Boolean} Default: false. Show menu bar?
*  scrollbars {Boolean} Default: true. Show scroll bars?
*  resizable {Boolean} Default: true. Allow resize window?
*  width {Integer} Default: 500. Window width.
*  height {Integer} Default: 400. Window height.
*  left {Integer} Window left position. Overwrites "center" option.
*  top {Integer} Window top position. Overwrites "center" option.
*  center {Boolean} Default: true. Center window in screen?
*  position {string} Default: "". Set PopUp position.
*      Parent: screen|window (Default: window).
*      Postitions: top, left, bottom, right, middle (Y), center (X).
*  onClose {Function} Callback function on close window event.
*  onOpen {Function} Callback function on open.
*  onError {Function} Callback function on error (Popup's blocked).
*  closeOnParentUnload {Boolean} Default: false.
*  modal {Boolean} Default: false. Auto set focus and block UI?
*  autoOpen {Boolean} Default: true. Auto open Popup?
* @return Object.
*  win: Opened PopUp window object.
*  close(): Close PopUp.
*  center(): Center PopUp on the screen. Returns false on error.
*  maximize(): Maximize PopUp. Returns false on error.
*  focus(): Focus on PopUp window.
*  closed(): Returns TRUE if PopUp window is closed.
*/
function xpopup(p) {
	var d = function (v) {
		return (typeof v !== 'undefined') && (v !== null);
	};

	var o = "",
		u = p.url,
		name = p.name,
		w = p.width,
		h = p.height,
		l = p.left,
		t = p.top,
		r = {};

	var ap = function (c, x) {
		if (o !== "") o += ",";
		o += c + "=" + x;
	};

	var pa = function (config, param, def) {
		if (d(param)) {
			if ((param === false) || (param === true)) {
				ap(config, param ? "1" : "0");
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
		for (var g in p.data) if (p.data.hasOwnProperty(g)) {
			u += ((u.indexOf('?') < 0) ? '?' : '&') + escape(g) + '=' + escape(p.data[g]);
		}
	} else if (!d(u)) {
		u = '';
	}

	if (!d(name)) name = 'popup_' + (new Date()).getTime();

	pa("toolbar", p.toolbar, false);
	pa("location", p.location, false);
	pa("status", p.status, '');
	pa("menubar", p.menubar, false);
	pa("scrollbars", p.scrollbars, true);
	pa("resizable", p.resizable, true);
	if (!pa("fullscreen", p.fullscreen, false)) {
		if (!d(w)) w = 500;
		if (!d(h)) h = 400;

		if (!(d(t) && d(l))) {
			var sh = screen.height,
				sw = screen.width;
			if (p.center) {
				// Center in screen
				t = parseInt((sh / 2) - (h / 2));
				l = parseInt((sw / 2) - (w / 2));
			} else if (p.position) {
				// Position in screen
				var c = p.position.toLowerCase().trim().split(/\s+/);
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
					t = parseInt((sh / 2) - (h / 2));
				}
				// Left
				if (c.indexOf('left') > -1) {
					l = 0;
				} else if (c.indexOf('right') > -1) {
					l = sw - w - 30;
				} else if (c.indexOf('center') > -1) {
					l = parseInt((sw / 2) - (w / 2));
				}
			}
		}

		pa("width", p.width, w);
		pa("height", p.height, h);
		pa("left", p.left, l);
		pa("top", p.top, t);
	}

	// Extended methods
	r.center = function () {
		if (r.win) {
			try {
				r.win.moveTo; // Check permission
				var w = r.win,
					sw = screen.width,
					sh = screen.height,
					ww = w.outerWidth,
					wh = w.outerHeight,
					x = parseInt((sw / 2) - (ww / 2)),
					y = parseInt((sh / 2) - (wh / 2));
				if (x < 0) x = 0;
				if (y < 0) y = 0;
				if (x >= sw - 10) x = sw - ww;
				if (y >= sh - 10) y = sh - wh;
				w.moveTo(x, y);
				return true;
			} catch (e) { }
		}

		return false;
	};

	r.maximize = function () {
		try {
			var w = r.win;
			w.moveTo(0, 0);
			if (document.all) {
				w.resizeTo(screen.availWidth, screen.availHeight);
			} else if (document.layers || document.getElementById) {
				if (w.outerHeight < screen.availHeight || w.outerWidth < screen.availWidth) {
					w.outerHeight = screen.availHeight;
					w.outerWidth = screen.availWidth;
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
		if (r.win && (typeof p.onOpen === 'function')) {
			p.onOpen.apply(r);
		}

		// On Error
		if (!r.win && (typeof p.onError === 'function')) {
			p.onError.apply(r);
		}

		return r;
	};

	// Modal
	if (p.modal) {
		var wf = function (e) {
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

		var modalw = document.createElement('div');
		modalw.setAttribute("style", "border:0 none;display:block;height:100%;left:0;margin:0;padding:0;position:absolute;top:0;width:100%;z-index:99999;background-color:rgba(0,0,0,0.5);");
		modalw.setAttribute("id", "xpopup-modal");
		document.body.appendChild(modalw);
	}

	// On Popup Close
	var xoc = typeof p.onClose === 'function';
	if (xoc || p.modal) {
		var wc = setInterval(function () {
			if (r.closed()) {
				clearInterval(wc);
				var e = document.getElementById("xpopup-modal");
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
};
