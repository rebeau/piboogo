/* eslint-disable no-undef */
(function (d, g) {
  var f = '3.0.0.1a';
  var c = function () {
    return c.fn.init.apply(c.fn, arguments);
  };
  c.prototype = c.fn = {
    init: function () {
      return this;
    },
    objectFromString: function (m) {
      if (typeof m === 'string' && m.length > 1) {
        var j = m.substr(0, 1);
        var i = m.substr(-1);
        if ((j === '{' && i === '}') || j === '[' || i === ']') {
          try {
            var l = JSON.parse(m);
            for (var h in l) {
              l[h] = c.fn.objectFromString(l[h]);
            }
            return l;
          } catch (k) {
            console.error(k);
            return m;
          }
        }
      }
      return m;
    },
    version: {
      core: f,
    },
  };
  c.Constant = {};
  var e = function () {
    var i = d.navigator.userAgent.toLowerCase();
    var h = d.navigator.platform.toLowerCase();
    return {
      os: function (j) {
        if (j === g) {
          return this.device().os;
        }
        return this.device(j);
      },
      device: function (n, l) {
        var m;
        if (n === g) {
          m = {
            os: 'unknown',
            version: '',
            tablet: false,
            mobile: false,
          };
          if (i.match(/emulator/i)) {
            m.os = 'Emulator';
            l = /Emulator ([\.\_\d]+)/i.exec(i);
            m.version = l ? l[1] : '';
            m.mobile = true;
          } else {
            if (i.match(/android/i)) {
              m.os = 'Android';
              if (!i.match(/mobile/i)) {
                m.tablet = true;
              }
              l = /Android ([\.\_\d]+)/i.exec(i);
              m.version = l ? l[1] : '';
              m.mobile = true;
            } else {
              if (i.match(/blackberry/i)) {
                m.os = 'BlackBerry';
                m.mobile = true;
              } else {
                if (i.match(/iphone|ipad|ipod/i)) {
                  m.os = 'iOS';
                  if (i.match(/ipad/i)) {
                    m.tablet = true;
                  }
                  l = /OS (\d+)_(\d+)_?(\d+)?/i.exec(d.navigator.appVersion);
                  m.version = l[1] + '.' + l[2] + '.' + (l[3] | 0);
                  m.mobile = true;
                } else {
                  if (i.match(/opera mini/i)) {
                    m.os = 'Opera';
                    m.mobile = true;
                  } else {
                    if (i.match(/iemobile|windows/i)) {
                      m.os = 'Windows';
                      m.mobile = true;
                    } else {
                      if (i.match(/Webos/i)) {
                        m.os = 'Webos';
                        m.mobile = true;
                      }
                    }
                  }
                }
              }
            }
          }
          return m;
        }
        m = this.device();
        var k = m.os.match(new RegExp(n, 'i')) ? true : false;
        if (l === g) {
          return k;
        }
        var j = m.version.match(new RegExp(l, 'i')) ? true : false;
        return k && j;
      },
      browser: function (j, o) {
        var m;
        if (j === g) {
          m = {
            name: '',
            version: '',
          };
          m.name = /chrome/gi.test(i)
            ? 'chrome'
            : /safari/gi.test(i)
              ? 'safari'
              : /simulator/gi.test(i)
                ? 'ios simulator'
                : /firefox/gi.test(i)
                  ? 'firefox'
                  : /triden/gi.test(i)
                    ? 'ie'
                    : /presto/gi.test(i)
                      ? 'opera'
                      : 'other';
          var r = i.match(/version\/([0-9.]+)/gi) || '';
          var p = i.match(/chrome\/([0-9.]+)/gi) || '';
          var l = i.match(/firefox\/([0-9.]+)/gi) || '';
          var k = i.match(/MSIE ([0-9.]+)/gi) || '';
          m.version =
            m.name === 'safari'
              ? r.toString().split('/')[1]
              : m.name === 'opera'
                ? r.toString().split('/')[1]
                : m.name === 'chrome'
                  ? p.toString().split('/')[1]
                  : m.name === 'firefox'
                    ? l.toString().split('/')[1]
                    : m.name === 'ie'
                      ? k.toString().split(' ')[1]
                      : '';
          return m;
        }
        m = this.browser();
        var n = m.name.match(new RegExp(j, 'i')) ? true : false;
        if (o === g) {
          return n;
        }
        var q = m.version.match(new RegExp(o, 'i')) ? true : false;
        return n && q;
      },
    };
  };
  c.navigator = c.fn.navigator = new e();
  c.Constant.INTERFACE_TYPE = {
    Unknown: 'Unknown',
    iOS: 'iOS',
    Android: 'Android',
  };
  c.interfaceType = c.fn.interfaceType = (function () {
    var h = c.Constant.INTERFACE_TYPE.Unknown;
    if (c.navigator.device('ios')) {
      h = c.Constant.INTERFACE_TYPE.iOS;
    } else {
      if (c.navigator.device('android')) {
        h = c.Constant.INTERFACE_TYPE.Android;
      }
    }
    return h;
  })();
  var b = function b(i) {
    var k = {
      async: false,
      command: '',
      params: [],
      data: {},
      error: false,
      errorMessage: '',
    };
    if (arguments.length === 0 || i.length === 0) {
      return k;
    }
    i = Array.prototype.slice.call(i, 0);
    var j = i.shift();
    if (typeof j !== 'object' && typeof j !== 'string') {
      return k;
    } else {
      if (
        typeof j === 'object' &&
        (j.command === g || typeof j.command !== 'string')
      ) {
        return k;
      }
    }
    if (typeof j === 'object') {
      var h = j;
      k.command = h.command || '';
      k.params =
        h.params !== g && h.params.length !== g && h.params.length > 0
          ? h.params
          : [];
      k.async = h.async === true ? true : false;
    } else {
      if (typeof j === 'string') {
        k.command = j;
        k.params = i;
      } else {
        return k;
      }
    }
    return k;
  };
  c.fn.execute = function a() {
    var k = new b(arguments);
    /*
    const osInfo = OSInfo();
    if (osInfo.osType == 1 || osInfo.osType == 3) {
      console.log('browsers Not supported');
      return;
    }
    */
    if (!k.command) {
      console.error('command is undefined');
      return;
    }
    var i = function () {
      if (c.interfaceType === c.Constant.INTERFACE_TYPE.iOS) {
        var m, o, l, n;
        m = 'minterface://';
        o = [];
        o.push('method=' + k.command);
        if (k.params.length > 0) {
          for (l = 0; l < k.params.length; l++) {
            n = k.params[l] || '';
            n =
              typeof n === 'object'
                ? JSON.stringify(n)
                : typeof n !== 'string'
                  ? n.toString()
                  : n;
            o.push('param' + (l + 1) + '=' + encodeURIComponent(n));
          }
        }
        m += '?' + o.join('&');
        if (k.async === false) {
          return prompt(m);
        }
        return alert(m);
        /*
              this.M.navigator.device()
              {
                "os": "Windows",
                "version": "",
                "tablet": false,
                "mobile": true
              }
              this.M.navigator.browser()
              {
                  "name": "chrome",
                  "version": "99.0.4844.51"
              }
              */
      } else {
        if (c.interfaceType === c.Constant.INTERFACE_TYPE.Android) {
          if (d.MNativeInterface && MNativeInterface[k.command]) {
            return MNativeInterface[k.command].apply(
              MNativeInterface,
              k.params,
            );
          }
          return;
        }
      }
      return;
    };
    try {
      if (k.async === false) {
        var h = i();
        return typeof h === 'string' ? c.fn.objectFromString(h) : h;
      }
      setTimeout(function () {
        i();
      }, 0);
    } catch (j) {
      console.error(j);
      return;
    }
    return k;
  };
  d.M = new c();
})(window);
