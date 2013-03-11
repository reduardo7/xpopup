/**
 * Open a PopUp Window.
 *
 * @param p {Object} Options:
 *  url {String} OPTIONAL. URL to load in PopUp.
 *  data {Object} OPTIONAL. URL params. If "url" is not used, this option is not used.
 *  name {Stirng} OPTIONAL. Window name.
 *  fullscreen {Boolean} OPTIONAL. DEFAULT: false. Open PopUp as full screen.
 *  toolbar {Boolean} OPTIONAL. DEFAULT: false. Show toolbar in PopUp?
 *  location {Boolean} OPTIONAL. Default: false. Lock location bar?
 *  status {String} OPTIONAL. Default: "". Text in status bar.
 *  menubar {Boolean} OPTIONAL. Default: false. Show menu bar?
 *  scrollbars {Boolean} OPTIONAL. Default: true. Show scroll bars?
 *  resizable {Boolean} OPTIONAL. Default: true. Allow resize window?
 *  width {Integer} OPTIONAL. Default: 500. Window width.
 *  height {Integer} OPTIONAL. Default: 400. Window height.
 *  left {Integer} OPTIONAL. Window left position. Overwrites "center" option.
 *  top {Integer} OPTIONAL. Window top position. Overwrites "center" option.
 *  center {Boolean} OPTIONAL. Default: true. Center window in screen?
 *  close {Function} OPTIONAL. Callback function on close window event.
 *  modal {Boolean} OPTIONAL. Default: false. Auto set focus and block UI?
 * @return Object.
 *  win: Opened PopUp window object.
 *  center(): Center PopUp on the screen. Returns false on error.
 *  maximize(): Maximize PopUp. Returns false on error.
 *  focus(): Focus on PopUp window.
 *  closed(): Returns TRUE if PopUp window is closed.
 */
var xpopup = function(p) {
  var d = function(v) {
		return (typeof(v) != 'undefined') && (v != null);
	};
	
	var o = "",
		u = p.url,
		name = p.name,
		prms = p,
		w = p.width,
		h = p.height,
		l = p.left,
		t = p.top,
		r = {};
	
	var ap = function(c, x) {
		if (o != "") o += ",";
		o += c + "=" + x;
	};
	
	var pa = function(config, param, def) {
		if (d(param)) {
			if ((param === false) || (param === true)) {
				ap(config, param ? "1" : "0");
			} else {
				ap(config, param);
			}
			return param;
		} else if(d(def)) {
			pa(config, def);
			return def;
		}
	};
	
	// URL
	if (d(u) && (u != '') && d(p.data)) {
		// Add params to URL
		for (var g in p.data) u += ((u.indexOf('?') < 0) ? '?' : '&') + escape(g) + '=' + escape(p.data[g]);
	}  else if (!d(u)) {
        u = '';
    }
	
	if (!d(name)) name = 'popup_' + (new Date()).getTime();
	
	pa("toolbar", prms.toolbar, false);
	pa("location", prms.location, false);
	pa("status", prms.status, '');
	pa("menubar", prms.menubar, false);
	pa("scrollbars", prms.scrollbars, true);
	pa("resizable", prms.resizable, true);
	if (!pa("fullscreen", prms.fullscreen, false)) {
		if (!d(w)) w = 500;
		if (!d(h)) h = 400;
		
		if (!(d(t) && d(l)) || p.center) {
			// Center in screen
			t = parseInt((screen.height / 2) - (h / 2));
			l = parseInt((screen.width / 2) - (w / 2)); 
		}
		
		pa("width", prms.width, w);
		pa("height", prms.height, h);
		pa("left", prms.left, l);
		pa("top", prms.top, t);
	}
	
	// Open
	r.win = window.open(u, name, o);
	
	// Extended methods
	r.center = function(){
		try {
			this.win.moveTo; // Check permission
			var w = this.win,
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
		} catch (e) {
			return false;
		}
	};
	
	r.maximize = function(){
		try {
			var w = this.win;
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
	
	r.focus = function(){
		this.win.focus();
	};
	
	r.closed = function(){
		return this.win.closed;
	};
	
	// Modal
	if (p.modal === true) {
		var wf = function(e) {
			if (r.closed()) {
				window.removeEventListener('click', wf);
			} else {
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				r.center();
				r.focus();
			}
		};
		window.addEventListener('click', wf);
		
        var modalw = document.createElement('div');
        modalw.setAttribute("style", "border:0 none;display:block;height:100%;left:0;margin:0;padding:0;position:absolute;top:0;width:100%;z-index:99999;");
        modalw.setAttribute("id", "xpopup-modal");
        document.body.appendChild(modalw);
	}
	
	// On close
	if (d(p.close) || (p.modal === true)) {
		var cboc = p.close;
		var wc = setInterval(function(){
			if (r.closed()) {
				clearInterval(wc);
				var e = document.getElementById("xpopup-modal");
				if (d(e))                 document.body.removeChild(e);
				if (d(cboc)) cboc();
			}
		}, 100);
	}
	
	// Return
	return r;
};
