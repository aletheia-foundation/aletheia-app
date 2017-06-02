/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var YAMLException = __webpack_require__(3);

var TYPE_CONSTRUCTOR_OPTIONS = ['kind', 'resolve', 'construct', 'instanceOf', 'predicate', 'represent', 'defaultStyle', 'styleAliases'];

var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag = tag;
  this.kind = options['kind'] || null;
  this.resolve = options['resolve'] || function () {
    return true;
  };
  this.construct = options['construct'] || function (data) {
    return data;
  };
  this.instanceOf = options['instanceOf'] || null;
  this.predicate = options['predicate'] || null;
  this.represent = options['represent'] || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isNothing(subject) {
  return typeof subject === 'undefined' || subject === null;
}

function isObject(subject) {
  return (typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) === 'object' && subject !== null;
}

function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;else if (isNothing(sequence)) return [];

  return [sequence];
}

function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}

function repeat(string, count) {
  var result = '',
      cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}

function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}

module.exports.isNothing = isNothing;
module.exports.isObject = isObject;
module.exports.toArray = toArray;
module.exports.repeat = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend = extend;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable max-len*/

var common = __webpack_require__(1);
var YAMLException = __webpack_require__(3);
var Type = __webpack_require__(0);

function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return exclude.indexOf(index) === -1;
  });
}

function compileMap() /* lists... */{
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {}
  },
      index,
      length;

  function collectType(type) {
    result[type.kind][type.tag] = result['fallback'][type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}

function Schema(definition) {
  this.include = definition.include || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
}

Schema.DEFAULT = null;

Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
    case 1:
      schemas = Schema.DEFAULT;
      types = arguments[0];
      break;

    case 2:
      schemas = arguments[0];
      types = arguments[1];
      break;

    default:
      throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) {
    return schema instanceof Schema;
  })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) {
    return type instanceof Type;
  })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};

module.exports = Schema;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// YAML error class. http://stackoverflow.com/questions/8458984
//


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = new Error().stack || '';
  }

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
}

// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;

YAMLException.prototype.toString = function toString(compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};

module.exports = YAMLException;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)




var Schema = __webpack_require__(2);

module.exports = new Schema({
  include: [__webpack_require__(14)],
  implicit: [__webpack_require__(46), __webpack_require__(39)],
  explicit: [__webpack_require__(31), __webpack_require__(41), __webpack_require__(42), __webpack_require__(44)]
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.




var Schema = __webpack_require__(2);

module.exports = Schema.DEFAULT = new Schema({
  include: [__webpack_require__(4)],
  explicit: [__webpack_require__(37), __webpack_require__(36), __webpack_require__(35)]
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function splitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function () {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function (path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function (p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function (path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function () {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function (p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};

// path.relative(from, to)
// posix version
exports.relative = function (from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};

exports.basename = function (path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  return splitPath(path)[3];
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
  return str.substr(start, len);
} : function (str, start, len) {
  if (start < 0) start = str.length + start;
  return str.substr(start, len);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
var path = __webpack_require__(7);

var pathFile = path.join(__dirname, 'path.txt');

if (fs.existsSync(pathFile)) {
  module.exports = path.join(__dirname, fs.readFileSync(pathFile, 'utf-8'));
} else {
  throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
}
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346




var Schema = __webpack_require__(2);

module.exports = new Schema({
  explicit: [__webpack_require__(45), __webpack_require__(43), __webpack_require__(38)]
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 11;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(22);
var ieee754 = __webpack_require__(24);
var isArray = __webpack_require__(25);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport

/*
 * Export kMaxLength after typed array support is determined.
 */
();exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints // avoid extra slice()
    );
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, ''
  // Node converts strings with length < 2 to ''
  );if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i

    // is surrogate component
    );if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Create a deferredConfig prototype so that we can check for it when reviewing the configs later.
function DeferredConfig() {}
DeferredConfig.prototype.resolve = function (config, original) {};

// Accept a function that we'll use to resolve this value later and return a 'deferred' configuration value to resolve it later.
function deferConfig(func) {
  var obj = Object.create(DeferredConfig.prototype);
  obj.resolve = func;
  return obj;
}

module.exports.deferConfig = deferConfig;
module.exports.DeferredConfig = DeferredConfig;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.




var Schema = __webpack_require__(2);

module.exports = new Schema({
  include: [__webpack_require__(15)]
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.




var Schema = __webpack_require__(2);

module.exports = new Schema({
  include: [__webpack_require__(9)],
  implicit: [__webpack_require__(40), __webpack_require__(32), __webpack_require__(34), __webpack_require__(33)]
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// json5.js
// Modern JSON. See README.md for details.
//
// This file is based directly off of Douglas Crockford's json_parse.js:
// https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

var JSON5 = ( false ? "undefined" : _typeof(exports)) === 'object' ? exports : {};

JSON5.parse = function () {
    "use strict";

    // This is a function that can parse a JSON5 text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON5 parser in other languages.

    // We are defining the function inside of another function to avoid creating
    // global variables.

    var at,
        // The index of the current character
    ch,
        // The current character
    escapee = {
        "'": "'",
        '"': '"',
        '\\': '\\',
        '/': '/',
        '\n': '', // Replace escaped newlines in strings w/ empty string
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t'
    },
        ws = [' ', '\t', '\r', '\n', '\v', '\f', '\xA0', "\uFEFF"],
        text,
        error = function error(m) {

        // Call error when something is wrong.

        var error = new SyntaxError();
        error.message = m;
        error.at = at;
        error.text = text;
        throw error;
    },
        next = function next(c) {

        // If a c parameter is provided, verify that it matches the current character.

        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }

        // Get the next character. When there are no more characters,
        // return the empty string.

        ch = text.charAt(at);
        at += 1;
        return ch;
    },
        peek = function peek() {

        // Get the next character without consuming it or
        // assigning it to the ch varaible.

        return text.charAt(at);
    },
        identifier = function identifier() {

        // Parse an identifier. Normally, reserved words are disallowed here, but we
        // only use this for unquoted object keys, where reserved words are allowed,
        // so we don't check for those here. References:
        // - http://es5.github.com/#x7.6
        // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
        // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
        // TODO Identifiers can have Unicode "letters" in them; add support for those.

        var key = ch;

        // Identifiers must start with a letter, _ or $.
        if (ch !== '_' && ch !== '$' && (ch < 'a' || ch > 'z') && (ch < 'A' || ch > 'Z')) {
            error("Bad identifier");
        }

        // Subsequent characters can contain digits.
        while (next() && (ch === '_' || ch === '$' || ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch >= '0' && ch <= '9')) {
            key += ch;
        }

        return key;
    },
        number = function number() {

        // Parse a number value.

        var number,
            sign = '',
            string = '',
            base = 10;

        if (ch === '-' || ch === '+') {
            sign = ch;
            next(ch);
        }

        // support for Infinity (could tweak to allow other words):
        if (ch === 'I') {
            number = word();
            if (typeof number !== 'number' || isNaN(number)) {
                error('Unexpected word for number');
            }
            return sign === '-' ? -number : number;
        }

        // support for NaN
        if (ch === 'N') {
            number = word();
            if (!isNaN(number)) {
                error('expected word to be NaN');
            }
            // ignore sign as -NaN also is NaN
            return number;
        }

        if (ch === '0') {
            string += ch;
            next();
            if (ch === 'x' || ch === 'X') {
                string += ch;
                next();
                base = 16;
            } else if (ch >= '0' && ch <= '9') {
                error('Octal literal');
            }
        }

        switch (base) {
            case 10:
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
                if (ch === '.') {
                    string += '.';
                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }
                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();
                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }
                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }
                break;
            case 16:
                while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
                    string += ch;
                    next();
                }
                break;
        }

        if (sign === '-') {
            number = -string;
        } else {
            number = +string;
        }

        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
        string = function string() {

        // Parse a string value.

        var hex,
            i,
            string = '',
            delim,
            // double quote or single quote
        uffff;

        // When parsing for string values, we must look for ' or " and \ characters.

        if (ch === '"' || ch === "'") {
            delim = ch;
            while (next()) {
                if (ch === delim) {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (ch === '\r') {
                        if (peek() === '\n') {
                            next();
                        }
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else if (ch === '\n') {
                    // unescaped newlines are invalid; see:
                    // https://github.com/aseemk/json5/issues/24
                    // TODO this feels special-cased; are there other
                    // invalid unescaped chars?
                    break;
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },
        inlineComment = function inlineComment() {

        // Skip an inline comment, assuming this is one. The current character should
        // be the second / character in the // pair that begins this inline comment.
        // To finish the inline comment, we look for a newline or the end of the text.

        if (ch !== '/') {
            error("Not an inline comment");
        }

        do {
            next();
            if (ch === '\n' || ch === '\r') {
                next();
                return;
            }
        } while (ch);
    },
        blockComment = function blockComment() {

        // Skip a block comment, assuming this is one. The current character should be
        // the * character in the /* pair that begins this block comment.
        // To finish the block comment, we look for an ending */ pair of characters,
        // but we also watch for the end of text before the comment is terminated.

        if (ch !== '*') {
            error("Not a block comment");
        }

        do {
            next();
            while (ch === '*') {
                next('*');
                if (ch === '/') {
                    next('/');
                    return;
                }
            }
        } while (ch);

        error("Unterminated block comment");
    },
        comment = function comment() {

        // Skip a comment, whether inline or block-level, assuming this is one.
        // Comments always begin with a / character.

        if (ch !== '/') {
            error("Not a comment");
        }

        next('/');

        if (ch === '/') {
            inlineComment();
        } else if (ch === '*') {
            blockComment();
        } else {
            error("Unrecognized comment");
        }
    },
        white = function white() {

        // Skip whitespace and comments.
        // Note that we're detecting comments by only a single / character.
        // This works since regular expressions are not valid JSON(5), but this will
        // break if there are other valid values that begin with a / character!

        while (ch) {
            if (ch === '/') {
                comment();
            } else if (ws.indexOf(ch) >= 0) {
                next();
            } else {
                return;
            }
        }
    },
        word = function word() {

        // true, false, or null.

        switch (ch) {
            case 't':
                next('t');
                next('r');
                next('u');
                next('e');
                return true;
            case 'f':
                next('f');
                next('a');
                next('l');
                next('s');
                next('e');
                return false;
            case 'n':
                next('n');
                next('u');
                next('l');
                next('l');
                return null;
            case 'I':
                next('I');
                next('n');
                next('f');
                next('i');
                next('n');
                next('i');
                next('t');
                next('y');
                return Infinity;
            case 'N':
                next('N');
                next('a');
                next('N');
                return NaN;
        }
        error("Unexpected '" + ch + "'");
    },
        value,
        // Place holder for the value function.

    array = function array() {

        // Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            while (ch) {
                if (ch === ']') {
                    next(']');
                    return array; // Potentially empty array
                }
                // ES5 allows omitting elements in arrays, e.g. [,] and
                // [,null]. We don't allow this in JSON5.
                if (ch === ',') {
                    error("Missing array element");
                } else {
                    array.push(value());
                }
                white();
                // If there's no comma after this value, this needs to
                // be the end of the array.
                if (ch !== ',') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },
        object = function object() {

        // Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            while (ch) {
                if (ch === '}') {
                    next('}');
                    return object; // Potentially empty object
                }

                // Keys can be unquoted. If they are, they need to be
                // valid JS identifiers.
                if (ch === '"' || ch === "'") {
                    key = string();
                } else {
                    key = identifier();
                }

                white();
                next(':');
                object[key] = value();
                white();
                // If there's no comma after this pair, this needs to be
                // the end of the object.
                if (ch !== ',') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

    value = function value() {

        // Parse a JSON value. It could be an object, an array, a string, a number,
        // or a word.

        white();
        switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
            case "'":
                return string();
            case '-':
            case '+':
            case '.':
                return number();
            default:
                return ch >= '0' && ch <= '9' ? number() : word();
        }
    };

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.

    return function (source, reviver) {
        var result;

        text = String(source);
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

        // If there is a reviver function, we recursively walk the new structure,
        // passing each name/value pair to the reviver function for possible
        // transformation, starting with a temporary root object that holds the result
        // in an empty key. If there is not a reviver function, we simply return the
        // result.

        return typeof reviver === 'function' ? function walk(holder, key) {
            var k,
                v,
                value = holder[key];
            if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({ '': result }, '') : result;
    };
}();

// JSON5 stringify will not quote keys where appropriate
JSON5.stringify = function (obj, replacer, space) {
    if (replacer && typeof replacer !== "function" && !isArray(replacer)) {
        throw new Error('Replacer must be a function or an array');
    }
    var getReplacedValueOrUndefined = function getReplacedValueOrUndefined(holder, key, isTopLevel) {
        var value = holder[key];

        // Replace the value with its toJSON value first, if possible
        if (value && value.toJSON && typeof value.toJSON === "function") {
            value = value.toJSON();
        }

        // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
        // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
        if (typeof replacer === "function") {
            return replacer.call(holder, key, value);
        } else if (replacer) {
            if (isTopLevel || isArray(holder) || replacer.indexOf(key) >= 0) {
                return value;
            } else {
                return undefined;
            }
        } else {
            return value;
        }
    };

    function isWordChar(char) {
        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char >= '0' && char <= '9' || char === '_' || char === '$';
    }

    function isWordStart(char) {
        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_' || char === '$';
    }

    function isWord(key) {
        if (typeof key !== 'string') {
            return false;
        }
        if (!isWordStart(key[0])) {
            return false;
        }
        var i = 1,
            length = key.length;
        while (i < length) {
            if (!isWordChar(key[i])) {
                return false;
            }
            i++;
        }
        return true;
    }

    // export for use in tests
    JSON5.isWord = isWord;

    // polyfills
    function isArray(obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    }

    function isDate(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    isNaN = isNaN || function (val) {
        return typeof val === 'number' && val !== val;
    };

    var objStack = [];
    function checkForCircular(obj) {
        for (var i = 0; i < objStack.length; i++) {
            if (objStack[i] === obj) {
                throw new TypeError("Converting circular structure to JSON");
            }
        }
    }

    function makeIndent(str, num, noNewLine) {
        if (!str) {
            return "";
        }
        // indentation no more than 10 chars
        if (str.length > 10) {
            str = str.substring(0, 10);
        }

        var indent = noNewLine ? "" : "\n";
        for (var i = 0; i < num; i++) {
            indent += str;
        }

        return indent;
    }

    var indentStr;
    if (space) {
        if (typeof space === "string") {
            indentStr = space;
        } else if (typeof space === "number" && space >= 0) {
            indentStr = makeIndent(" ", space, true);
        } else {
            // ignore space parameter
        }
    }

    // Copied from Crokford's implementation of JSON
    // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
    // Begin
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = { // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    function escapeString(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : "\\u" + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    // End

    function internalStringify(holder, key, isTopLevel) {
        var buffer, res;

        // Replace the value, if necessary
        var obj_part = getReplacedValueOrUndefined(holder, key, isTopLevel);

        if (obj_part && !isDate(obj_part)) {
            // unbox objects
            // don't unbox dates, since will turn it into number
            obj_part = obj_part.valueOf();
        }
        switch (typeof obj_part === "undefined" ? "undefined" : _typeof(obj_part)) {
            case "boolean":
                return obj_part.toString();

            case "number":
                if (isNaN(obj_part) || !isFinite(obj_part)) {
                    return "null";
                }
                return obj_part.toString();

            case "string":
                return escapeString(obj_part.toString());

            case "object":
                if (obj_part === null) {
                    return "null";
                } else if (isArray(obj_part)) {
                    checkForCircular(obj_part);
                    buffer = "[";
                    objStack.push(obj_part);

                    for (var i = 0; i < obj_part.length; i++) {
                        res = internalStringify(obj_part, i, false);
                        buffer += makeIndent(indentStr, objStack.length);
                        if (res === null || typeof res === "undefined") {
                            buffer += "null";
                        } else {
                            buffer += res;
                        }
                        if (i < obj_part.length - 1) {
                            buffer += ",";
                        } else if (indentStr) {
                            buffer += "\n";
                        }
                    }
                    objStack.pop();
                    buffer += makeIndent(indentStr, objStack.length, true) + "]";
                } else {
                    checkForCircular(obj_part);
                    buffer = "{";
                    var nonEmpty = false;
                    objStack.push(obj_part);
                    for (var prop in obj_part) {
                        if (obj_part.hasOwnProperty(prop)) {
                            var value = internalStringify(obj_part, prop, false);
                            isTopLevel = false;
                            if (typeof value !== "undefined" && value !== null) {
                                buffer += makeIndent(indentStr, objStack.length);
                                nonEmpty = true;
                                var key = isWord(prop) ? prop : escapeString(prop);
                                buffer += key + ":" + (indentStr ? ' ' : '') + value + ",";
                            }
                        }
                    }
                    objStack.pop();
                    if (nonEmpty) {
                        buffer = buffer.substring(0, buffer.length - 1) + makeIndent(indentStr, objStack.length) + "}";
                    } else {
                        buffer = '{}';
                    }
                }
                return buffer;
            default:
                // functions and undefined should be ignored
                return undefined;
        }
    }

    // special case...when undefined is used inside of
    // a compound object/array, return null.
    // but when top-level, return undefined
    var topLevelHolder = { "": obj };
    if (obj === undefined) {
        return getReplacedValueOrUndefined(topLevelHolder, '', true);
    }
    return internalStringify(topLevelHolder, '', true);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, Buffer) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// config.js (c) 2010-2015 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://lorenwest.github.com/node-config

// Dependencies
var Yaml = null,
    // External libraries are lazy-loaded
VisionmediaYaml = null,
    // only if these file types exist.
Coffee = null,
    Iced = null,
    CSON = null,
    PPARSER = null,
    JSON5 = null,
    TOML = null,
    HJSON = null,
    XML = null,
    deferConfig = __webpack_require__(13).deferConfig,
    DeferredConfig = __webpack_require__(13).DeferredConfig,
    RawConfig = __webpack_require__(23).RawConfig,
    Utils = __webpack_require__(56),
    Path = __webpack_require__(7),
    FileSystem = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

// Static members
var DEFAULT_CLONE_DEPTH = 20,
    NODE_CONFIG,
    CONFIG_DIR,
    RUNTIME_JSON_FILENAME,
    NODE_ENV,
    APP_INSTANCE,
    HOST,
    HOSTNAME,
    ALLOW_CONFIG_MUTATIONS,
    CONFIG_SKIP_GITCRYPT,
    env = {},
    privateUtil = {},
    deprecationWarnings = {},
    configSources = [],
    // Configuration sources - array of {name, original, parsed}
checkMutability = true,
    // Check for mutability/immutability on first get
gitCryptTestRegex = /^.GITCRYPT/; // regular expression to test for gitcrypt files.

/**
 * <p>Application Configurations</p>
 *
 * <p>
 * The config module exports a singleton object representing all
 * configurations for this application deployment.
 * </p>
 *
 * <p>
 * Application configurations are stored in files within the config directory
 * of your application.  The default configuration file is loaded, followed
 * by files specific to the deployment type (development, testing, staging,
 * production, etc.).
 * </p>
 *
 * <p>
 * For example, with the following config/default.yaml file:
 * </p>
 *
 * <pre>
 *   ...
 *   customer:
 *     &nbsp;&nbsp;initialCredit: 500
 *     &nbsp;&nbsp;db:
 *       &nbsp;&nbsp;&nbsp;&nbsp;name: customer
 *       &nbsp;&nbsp;&nbsp;&nbsp;port: 5984
 *   ...
 * </pre>
 *
 * <p>
 * The following code loads the customer section into the CONFIG variable:
 * <p>
 *
 * <pre>
 *   var CONFIG = require('config').customer;
 *   ...
 *   newCustomer.creditLimit = CONFIG.initialCredit;
 *   database.open(CONFIG.db.name, CONFIG.db.port);
 *   ...
 * </pre>
 *
 * @module config
 * @class Config
 */

/**
 * <p>Get the configuration object.</p>
 *
 * <p>
 * The configuration object is a shared singleton object within the application,
 * attained by calling require('config').
 * </p>
 *
 * <p>
 * Usually you'll specify a CONFIG variable at the top of your .js file
 * for file/module scope. If you want the root of the object, you can do this:
 * </p>
 * <pre>
 * var CONFIG = require('config');
 * </pre>
 *
 * <p>
 * Sometimes you only care about a specific sub-object within the CONFIG
 * object.  In that case you could do this at the top of your file:
 * </p>
 * <pre>
 * var CONFIG = require('config').customer;
 * or
 * var CUSTOMER_CONFIG = require('config').customer;
 * </pre>
 *
 * <script type="text/javascript">
 *   document.getElementById("showProtected").style.display = "block";
 * </script>
 *
 * @method constructor
 * @return CONFIG {object} - The top level configuration object
 */
var Config = function Config() {
  var t = this;

  // Bind all utility functions to this
  for (var fnName in util) {
    util[fnName] = util[fnName].bind(t);
  }

  // Merge configurations into this
  util.extendDeep(t, util.loadFileConfigs());
  util.attachProtoDeep(t);

  // Perform strictness checks and possibly throw an exception.
  util.runStrictnessChecks(t);
};

/**
 * Utilities are under the util namespace vs. at the top level
 */
var util = Config.prototype.util = {};

/**
 * Underlying get mechanism
 *
 * @private
 * @method getImpl
 * @param object {object} - Object to get the property for
 * @param property {string | array[string]} - The property name to get (as an array or '.' delimited string)
 * @return value {*} - Property value, including undefined if not defined.
 */
var getImpl = function getImpl(object, property) {
  var t = this,
      elems = Array.isArray(property) ? property : property.split('.'),
      name = elems[0],
      value = object[name];
  if (elems.length <= 1) {
    return value;
  }
  // Note that typeof null === 'object'
  if (value === null || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    return undefined;
  }
  return getImpl(value, elems.slice(1));
};

/**
 * <p>Get a configuration value</p>
 *
 * <p>
 * This will return the specified property value, throwing an exception if the
 * configuration isn't defined.  It is used to assure configurations are defined
 * before being used, and to prevent typos.
 * </p>
 *
 * @method get
 * @param property {string} - The configuration property to get. Can include '.' sub-properties.
 * @return value {*} - The property value
 */
Config.prototype.get = function (property) {
  if (property === null || property === undefined) {
    throw new Error("Calling config.get with null or undefined argument");
  }
  var t = this,
      value = getImpl(t, property);

  // Produce an exception if the property doesn't exist
  if (value === undefined) {
    throw new Error('Configuration property "' + property + '" is not defined');
  }

  // Make configurations immutable after first get (unless disabled)
  if (checkMutability) {
    if (!util.initParam('ALLOW_CONFIG_MUTATIONS', false)) {
      util.makeImmutable(config);
    }
    checkMutability = false;
  }

  if (value instanceof RawConfig) {
    value = value.resolve();
  }

  // Return the value
  return value;
};

/**
 * Test that a configuration parameter exists
 *
 * <pre>
 *    var config = require('config');
 *    if (config.has('customer.dbName')) {
 *      console.log('Customer database name: ' + config.customer.dbName);
 *    }
 * </pre>
 *
 * @method has
 * @param property {string} - The configuration property to test. Can include '.' sub-properties.
 * @return isPresent {boolean} - True if the property is defined, false if not defined.
 */
Config.prototype.has = function (property) {
  // While get() throws an exception for undefined input, has() is designed to test validity, so false is appropriate
  if (property === null || property === undefined) {
    return false;
  }
  var t = this;
  return getImpl(t, property) !== undefined;
};

/**
 * <p>Monitor a javascript property for runtime changes.</p>
 *
 * <p>
 * This method was built for an earlier version of node-config that allowed
 * configuration value mutations.  Since version 1.0.0, node-config no longer
 * allows configuration mutations, and is no longer used in node-config.
 * </p>
 *
 * <p>
 * It is deprecated, and will be removed in the next semver incompatible release 2.0.0.
 * </p>
 *
 * @method watch
 * @deprecated
 * @param object {object} - The object to watch.
 * @param property {string} - The property name to watch.  Watch all object properties if null.
 * @param handler {function(object, propertyName, priorValue, newValue)} - Handler called when a property change is detected.
 *   The handler is run along with other handlers registered for notification.
 *   If your handler changes the value of the property, that change is applied after all handlers have finished processing the current change.
 *   Then all handlers (including this one) will be called again with the newly changed value.
 * @param depth {integer} (optional) - If watching all object properties or if the specified property is an object, this specifies the depth of the object graph to watch for changes.  Default 6.
 * @return object {object} - The original object is returned - for chaining.
 */
util.watch = function (object, property, handler, depth) {

  // Initialize
  var t = this,
      o = object;
  var allProperties = property ? [property] : Object.keys(o);

  // Deprecation warning
  if (!deprecationWarnings.watch) {
    console.error('WARNING: config.' + fnName + '() is deprecated, and will not be supported in release 2.0.');
    console.error('WARNING: See https://github.com/lorenwest/node-config/wiki/Future-Compatibility#upcoming-incompatibilities');
    deprecationWarnings.watch = true;
  }

  // Depth detection
  depth = depth === null ? DEFAULT_CLONE_DEPTH : depth;
  if (depth < 0) {
    return;
  }

  // Create hidden properties on the object
  if (!o.__watchers) util.makeHidden(o, '__watchers', {});
  if (!o.__propertyValues) util.makeHidden(o, '__propertyValues', {});

  // Attach watchers to all requested properties
  allProperties.forEach(function (prop) {

    // Setup the property for watching (first time only)
    if (typeof o.__propertyValues[prop] === 'undefined') {

      // Don't error re-defining the property if immutable
      var descriptor = Object.getOwnPropertyDescriptor(o, prop);
      if (descriptor && descriptor.writable === false) return;

      // Copy the value to the hidden field, and add the property to watchers
      o.__propertyValues[prop] = [o[prop]];
      o.__watchers[prop] = [];

      // Attach the property watcher
      Object.defineProperty(o, prop, {
        enumerable: true,

        get: function get() {
          // If more than 1 item is in the values array,
          // then we're currently processing watchers.
          if (o.__propertyValues[prop].length === 1)
            // Current value
            return o.__propertyValues[prop][0];else
            // [0] is prior value, [1] is new value being processed
            return o.__propertyValues[prop][1];
        },

        set: function set(newValue) {

          // Return early if no change
          var origValue = o[prop];
          if (util.equalsDeep(origValue, newValue)) return;

          // Remember the new value, and return if we're in another setter
          o.__propertyValues[prop].push(newValue);
          if (o.__propertyValues[prop].length > 2) return;

          // Call all watchers for each change requested
          var numIterations = 0;
          while (o.__propertyValues[prop].length > 1) {

            // Detect recursion
            if (++numIterations > 20) {
              o.__propertyValues[prop] = [origValue];
              throw new Error('Recursion detected while setting [' + prop + ']');
            }

            // Call each watcher for the current values
            var oldValue = o.__propertyValues[prop][0];
            newValue = o.__propertyValues[prop][1];
            o.__watchers[prop].forEach(function (watcher) {
              try {
                watcher(o, prop, oldValue, newValue);
              } catch (e) {
                // Log an error and continue with subsequent watchers
                console.error("Exception in object watcher for " + prop, e);
              }
            });

            // Done processing this value
            o.__propertyValues[prop].splice(0, 1);
          }
        }
      });
    } // Done setting up the property for watching (first time)

    // Add the watcher to the property
    o.__watchers[prop].push(handler);

    // Recurs if this is an object...
    if (o[prop] && _typeof(o[prop]) === 'object') {
      util.watch(o[prop], null, handler, depth - 1);
    }
  }); // Done processing each property

  // Return the original object - for chaining
  return o;
};

/**
 * <p>
 * Set default configurations for a node.js module.
 * </p>
 *
 * <p>
 * This allows module developers to attach their configurations onto the
 * default configuration object so they can be configured by the consumers
 * of the module.
 * </p>
 *
 * <p>Using the function within your module:</p>
 * <pre>
 *   var CONFIG = require("config");
 *   CONFIG.util.setModuleDefaults("MyModule", {
 *   &nbsp;&nbsp;templateName: "t-50",
 *   &nbsp;&nbsp;colorScheme: "green"
 *   });
 * <br>
 *   // Template name may be overridden by application config files
 *   console.log("Template: " + CONFIG.MyModule.templateName);
 * </pre>
 *
 * <p>
 * The above example results in a "MyModule" element of the configuration
 * object, containing an object with the specified default values.
 * </p>
 *
 * @method setModuleDefaults
 * @param moduleName {string} - Name of your module.
 * @param defaultProperties {object} - The default module configuration.
 * @return moduleConfig {object} - The module level configuration object.
 */
util.setModuleDefaults = function (moduleName, defaultProperties) {

  // Copy the properties into a new object
  var t = this,
      moduleConfig = util.cloneDeep(defaultProperties);

  // Set module defaults into the first sources element
  if (configSources.length === 0 || configSources[0].name !== 'Module Defaults') {
    configSources.splice(0, 0, {
      name: 'Module Defaults',
      parsed: {}
    });
  }
  configSources[0].parsed[moduleName] = {};
  util.extendDeep(configSources[0].parsed[moduleName], defaultProperties);

  // Create a top level config for this module if it doesn't exist
  t[moduleName] = t[moduleName] || {};

  // Extend local configurations into the module config
  util.extendDeep(moduleConfig, t[moduleName]);

  // Merge the extended configs without replacing the original
  util.extendDeep(t[moduleName], moduleConfig);

  // reset the mutability check for "config.get" method.
  // we are not making t[moduleName] immutable immediately,
  // since there might be more modifications before the first config.get
  if (!util.initParam('ALLOW_CONFIG_MUTATIONS', false)) {
    checkMutability = true;
  }

  // Attach handlers & watchers onto the module config object
  return util.attachProtoDeep(t[moduleName]);
};

/**
 * <p>Make a configuration property hidden so it doesn't appear when enumerating
 * elements of the object.</p>
 *
 * <p>
 * The property still exists and can be read from and written to, but it won't
 * show up in for ... in loops, Object.keys(), or JSON.stringify() type methods.
 * </p>
 *
 * <p>
 * If the property already exists, it will be made hidden.  Otherwise it will
 * be created as a hidden property with the specified value.
 * </p>
 *
 * <p><i>
 * This method was built for hiding configuration values, but it can be applied
 * to <u>any</u> javascript object.
 * </i></p>
 *
 * <p>Example:</p>
 * <pre>
 *   var CONFIG = require('config');
 *   ...
 *
 *   // Hide the Amazon S3 credentials
 *   CONFIG.util.makeHidden(CONFIG.amazonS3, 'access_id');
 *   CONFIG.util.makeHidden(CONFIG.amazonS3, 'secret_key');
 * </pre>
 *
 * @method makeHidden
 * @param object {object} - The object to make a hidden property into.
 * @param property {string} - The name of the property to make hidden.
 * @param value {*} - (optional) Set the property value to this (otherwise leave alone)
 * @return object {object} - The original object is returned - for chaining.
 */
util.makeHidden = function (object, property, value) {

  // If the new value isn't specified, just mark the property as hidden
  if (typeof value === 'undefined') {
    Object.defineProperty(object, property, {
      enumerable: false
    });
  }
  // Otherwise set the value and mark it as hidden
  else {
      Object.defineProperty(object, property, {
        value: value,
        enumerable: false
      });
    }

  return object;
};

/**
 * <p>Make a javascript object property immutable (assuring it cannot be changed
 * from the current value).</p>
 * <p>
 * If the specified property is an object, all attributes of that object are
 * made immutable, including properties of contained objects, recursively.
 * If a property name isn't supplied, all properties of the object are made
 * immutable.
 * </p>
 * <p>
 *
 * </p>
 * <p>
 * New properties can be added to the object and those properties will not be
 * immutable unless this method is called on those new properties.
 * </p>
 * <p>
 * This operation cannot be undone.
 * </p>
 *
 * <p>Example:</p>
 * <pre>
 *   var config = require('config');
 *   var myObject = {hello:'world'};
 *   config.util.makeImmutable(myObject);
 * </pre>
 *
 * @method makeImmutable
 * @param object {object} - The object to specify immutable properties for
 * @param [property] {string | [string]} - The name of the property (or array of names) to make immutable.
 *        If not provided, all owned properties of the object are made immutable.
 * @param [value] {* | [*]} - Property value (or array of values) to set
 *        the property to before making immutable. Only used when setting a single
 *        property. Retained for backward compatibility.
 * @return object {object} - The original object is returned - for chaining.
 */
util.makeImmutable = function (object, property, value) {
  var properties = null;

  // Backwards compatibility mode where property/value can be specified
  if (typeof property === 'string') {
    return Object.defineProperty(object, property, {
      value: typeof value === 'undefined' ? object[property] : value,
      writable: false,
      configurable: false
    });
  }

  // Get the list of properties to work with
  if (Array.isArray(property)) {
    properties = property;
  } else {
    properties = Object.keys(object);
  }

  // Process each property
  for (var i = 0; i < properties.length; i++) {
    var propertyName = properties[i],
        value = object[propertyName];

    if (!(value instanceof RawConfig)) {
      Object.defineProperty(object, propertyName, {
        value: value,
        writable: false,
        configurable: false
      });

      // Call recursively if an object.
      if (util.isObject(value)) {
        util.makeImmutable(value);
      }
    }
  }

  return object;
};

/**
 * Return the sources for the configurations
 *
 * <p>
 * All sources for configurations are stored in an array of objects containing
 * the source name (usually the filename), the original source (as a string),
 * and the parsed source as an object.
 * </p>
 *
 * @method getConfigSources
 * @return configSources {Array[Object]} - An array of objects containing
 *    name, original, and parsed elements
 */
util.getConfigSources = function () {
  var t = this;
  return configSources.slice(0);
};

/**
 * Load the individual file configurations.
 *
 * <p>
 * This method builds a map of filename to the configuration object defined
 * by the file.  The search order is:
 * </p>
 *
 * <pre>
 *   default.EXT
 *   (deployment).EXT
 *   (hostname).EXT
 *   (hostname)-(deployment).EXT
 *   local.EXT
 *   local-(deployment).EXT
 *   runtime.json
 * </pre>
 *
 * <p>
 * EXT can be yml, yaml, coffee, iced, json, cson or js signifying the file type.
 * yaml (and yml) is in YAML format, coffee is a coffee-script, iced is iced-coffee-script,
 * json is in JSON format, cson is in CSON format, properties is in .properties format
 * (http://en.wikipedia.org/wiki/.properties), and js is a javascript executable file that is
 * require()'d with module.exports being the config object.
 * </p>
 *
 * <p>
 * hostname is the $HOST environment variable (or --HOST command line parameter)
 * if set, otherwise the $HOSTNAME environment variable (or --HOSTNAME command
 * line parameter) if set, otherwise the hostname found from
 * require('os').hostname().
 * </p>
 *
 * <p>
 * Once a hostname is found, everything from the first period ('.') onwards
 * is removed. For example, abc.example.com becomes abc
 * </p>
 *
 * <p>
 * (deployment) is the deployment type, found in the $NODE_ENV environment
 * variable or --NODE_ENV command line parameter.  Defaults to 'development'.
 * </p>
 *
 * <p>
 * The runtime.json file contains configuration changes made at runtime either
 * manually, or by the application setting a configuration value.
 * </p>
 *
 * <p>
 * If the $NODE_APP_INSTANCE environment variable (or --NODE_APP_INSTANCE
 * command line parameter) is set, then files with this appendage will be loaded.
 * See the Multiple Application Instances section of the main documentaion page
 * for more information.
 * </p>
 *
 * @protected
 * @method loadFileConfigs
 * @return config {Object} The configuration object
 */
util.loadFileConfigs = function (configDir) {

  // Initialize
  var t = this,
      config = {};

  // Initialize parameters from command line, environment, or default
  NODE_ENV = util.initParam('NODE_ENV', 'development');
  CONFIG_DIR = configDir || util.initParam('NODE_CONFIG_DIR', Path.join(process.cwd(), 'config'));
  if (CONFIG_DIR.indexOf('.') === 0) {
    CONFIG_DIR = Path.join(process.cwd(), CONFIG_DIR);
  }
  APP_INSTANCE = util.initParam('NODE_APP_INSTANCE');
  HOST = util.initParam('HOST');
  HOSTNAME = util.initParam('HOSTNAME');
  CONFIG_SKIP_GITCRYPT = util.initParam('CONFIG_SKIP_GITCRYPT');

  // This is for backward compatibility
  RUNTIME_JSON_FILENAME = util.initParam('NODE_CONFIG_RUNTIME_JSON', Path.join(CONFIG_DIR, 'runtime.json'));

  // Determine the host name from the OS module, $HOST, or $HOSTNAME
  // Remove any . appendages, and default to null if not set
  try {
    var hostName = HOST || HOSTNAME;

    // Store the hostname that won.
    env.HOSTNAME = hostName;

    if (!hostName) {
      var OS = __webpack_require__(48);
      hostName = OS.hostname();
    }
  } catch (e) {
    hostName = '';
  }

  // Read each file in turn
  var baseNames = ['default', NODE_ENV];

  // #236: Also add full hostname when they are different.
  if (hostName) {
    var firstDomain = hostName.split('.')[0];

    // Backward compatibility
    baseNames.push(firstDomain, firstDomain + '-' + NODE_ENV);

    // Add full hostname when it is not the same
    if (hostName != firstDomain) {
      baseNames.push(hostName, hostName + '-' + NODE_ENV);
    }
  }

  baseNames.push('local', 'local-' + NODE_ENV);

  var extNames = ['js', 'ts', 'json', 'json5', 'hjson', 'toml', 'coffee', 'iced', 'yaml', 'yml', 'cson', 'properties', 'xml'];
  baseNames.forEach(function (baseName) {
    extNames.forEach(function (extName) {

      // Try merging the config object into this object
      var fullFilename = Path.join(CONFIG_DIR, baseName + '.' + extName);
      var configObj = util.parseFile(fullFilename);
      if (configObj) {
        util.extendDeep(config, configObj);
      }

      // See if the application instance file is available
      if (APP_INSTANCE) {
        fullFilename = Path.join(CONFIG_DIR, baseName + '-' + APP_INSTANCE + '.' + extName);
        configObj = util.parseFile(fullFilename);
        if (configObj) {
          util.extendDeep(config, configObj);
        }
      }
    });
  });

  // Override configurations from the $NODE_CONFIG environment variable
  // NODE_CONFIG only applies to the base config
  if (!configDir) {
    var envConfig = {};
    if (process.env.NODE_CONFIG) {
      try {
        envConfig = JSON.parse(process.env.NODE_CONFIG);
      } catch (e) {
        console.error('The $NODE_CONFIG environment variable is malformed JSON');
      }
      util.extendDeep(config, envConfig);
      configSources.push({
        name: "$NODE_CONFIG",
        parsed: envConfig
      });
    }

    // Override configurations from the --NODE_CONFIG command line
    var cmdLineConfig = util.getCmdLineArg('NODE_CONFIG');
    if (cmdLineConfig) {
      try {
        cmdLineConfig = JSON.parse(cmdLineConfig);
      } catch (e) {
        console.error('The --NODE_CONFIG={json} command line argument is malformed JSON');
      }
      util.extendDeep(config, cmdLineConfig);
      configSources.push({
        name: "--NODE_CONFIG argument",
        parsed: cmdLineConfig
      });
    }

    // Place the mixed NODE_CONFIG into the environment
    env['NODE_CONFIG'] = JSON.stringify(util.extendDeep(envConfig, cmdLineConfig, {}));
  }

  // Override with environment variables if there is a custom-environment-variables.EXT mapping file
  var customEnvVars = util.getCustomEnvVars(CONFIG_DIR, extNames);
  util.extendDeep(config, customEnvVars);

  // Extend the original config with the contents of runtime.json (backwards compatibility)
  var runtimeJson = util.parseFile(RUNTIME_JSON_FILENAME) || {};
  util.extendDeep(config, runtimeJson);

  util.resolveDeferredConfigs(config);

  // Return the configuration object
  return config;
};

// Using basic recursion pattern, find all the deferred values and resolve them.
util.resolveDeferredConfigs = function (config) {
  var completeConfig = config;

  function _iterate(prop) {

    // We put the properties we are going to look it in an array to keep the order predictable
    var propsToSort = [];

    // First step is to put the properties of interest in an array
    for (var property in prop) {
      if (prop.hasOwnProperty(property) && prop[property] != null) {
        propsToSort.push(property);
      }
    }

    // Second step is to iterate of the elements in a predictable (sorted) order
    propsToSort.sort().forEach(function (property) {
      if (prop[property].constructor == Object) {
        _iterate(prop[property]);
      } else if (prop[property].constructor == Array) {
        for (var i = 0; i < prop[property].length; i++) {
          _iterate(prop[property][i]);
        }
      } else {
        if (prop[property] instanceof DeferredConfig) {
          prop[property] = prop[property].resolve.call(completeConfig, completeConfig, prop[property]._original);
        } else {
          // Nothing to do. Keep the property how it is.
        }
      }
    });
  }

  _iterate(config);
};

/**
 * Parse and return the specified configuration file.
 *
 * If the file exists in the application config directory, it will
 * parse and return it as a JavaScript object.
 *
 * The file extension determines the parser to use.
 *
 * .js = File to run that has a module.exports containing the config object
 * .coffee = File to run that has a module.exports with coffee-script containing the config object
 * .iced = File to run that has a module.exports with iced-coffee-script containing the config object
 * All other supported file types (yaml, toml, json, cson, hjson, json5, properties, xml)
 * are parsed with util.parseString.
 *
 * If the file doesn't exist, a null will be returned.  If the file can't be
 * parsed, an exception will be thrown.
 *
 * This method performs synchronous file operations, and should not be called
 * after synchronous module loading.
 *
 * @protected
 * @method parseFile
 * @param fullFilename {string} The full file path and name
 * @return {configObject} The configuration object parsed from the file
 */
util.parseFile = function (fullFilename) {

  // Initialize
  var t = this,
      extension = fullFilename.substr(fullFilename.lastIndexOf('.') + 1),
      configObject = null,
      fileContent = null,
      stat = null;

  // Return null if the file doesn't exist.
  // Note that all methods here are the Sync versions.  This is appropriate during
  // module loading (which is a synchronous operation), but not thereafter.
  try {
    stat = FileSystem.statSync(fullFilename);
    if (!stat || stat.size < 1) {
      return null;
    }
  } catch (e1) {
    return null;
  }

  // Try loading the file.
  try {
    fileContent = FileSystem.readFileSync(fullFilename, 'UTF-8');
    fileContent = fileContent.replace(/^\uFEFF/, '');
  } catch (e2) {
    throw new Error('Config file ' + fullFilename + ' cannot be read');
  }

  // Parse the file based on extension
  try {

    // skip if it's a gitcrypt file and CONFIG_SKIP_GITCRYPT is true
    if (CONFIG_SKIP_GITCRYPT) {
      if (gitCryptTestRegex.test(fileContent)) {
        console.error('WARNING: ' + fullFilename + ' is a git-crypt file and CONFIG_SKIP_GITCRYPT is set. skipping.');
        return null;
      }
    }

    if (extension === 'js') {
      // Use the built-in parser for .js files
      configObject = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    } else if (extension === 'ts') {
      __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"ts-node\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).register({
        lazy: true,
        compilerOptions: {
          allowJs: true
        }
      });

      // Because of ES6 modules usage, `default` is treated as named export (like any other)
      // Therefore config is a value of `default` key.
      configObject = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()).default;
    } else if (extension === 'coffee') {
      // .coffee files can be loaded with either coffee-script or iced-coffee-script.
      // Prefer iced-coffee-script, if it exists.
      // Lazy load the appropriate extension
      if (!Coffee) {
        Coffee = {};

        // The following enables iced-coffee-script on .coffee files, if iced-coffee-script is available.
        // This is commented as per a decision on a pull request.
        //try {
        //  Coffee = require("iced-coffee-script");
        //}
        //catch (e) {
        //  Coffee = require("coffee-script");
        //}

        Coffee = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"coffee-script\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

        // coffee-script >= 1.7.0 requires explicit registration for require() to work
        if (Coffee.register) {
          Coffee.register();
        }
      }
      // Use the built-in parser for .coffee files with coffee-script
      configObject = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    } else if (extension === 'iced') {
      Iced = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"iced-coffee-script\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

      // coffee-script >= 1.7.0 requires explicit registration for require() to work
      if (Iced.register) {
        Iced.register();
      }
    } else {
      configObject = util.parseString(fileContent, extension);
    }
  } catch (e3) {
    if (gitCryptTestRegex.test(fileContent)) {
      console.error('ERROR: ' + fullFilename + ' is a git-crypt file and CONFIG_SKIP_GITCRYPT is not set.');
    }
    throw new Error("Cannot parse config file: '" + fullFilename + "': " + e3);
  }

  // Keep track of this configuration sources, including empty ones
  if ((typeof configObject === 'undefined' ? 'undefined' : _typeof(configObject)) === 'object') {
    configSources.push({
      name: fullFilename,
      original: fileContent,
      parsed: configObject
    });
  }

  return configObject;
};

/**
 * Parse and return the specied string with the specified format.
 *
 * The format determines the parser to use.
 *
 * json = File is parsed using JSON.parse()
 * yaml (or yml) = Parsed with a YAML parser
 * toml = Parsed with a TOML parser
 * cson = Parsed with a CSON parser
 * hjson = Parsed with a HJSON parser
 * json5 = Parsed with a JSON5 parser
 * properties = Parsed with the 'properties' node package
 * xml = Parsed with a XML parser
 *
 * If the file doesn't exist, a null will be returned.  If the file can't be
 * parsed, an exception will be thrown.
 *
 * This method performs synchronous file operations, and should not be called
 * after synchronous module loading.
 *
 * @protected
 * @method parseString
 * @param content {string} The full content
 * @param format {string} The format to be parsed
 * @return {configObject} The configuration object parsed from the string
 */
util.parseString = function (content, format) {
  // Initialize
  var configObject = null;

  // Parse the file based on extension
  if (format === 'yaml' || format === 'yml') {
    if (!Yaml && !VisionmediaYaml) {
      // Lazy loading
      try {
        // Try to load the better js-yaml module
        Yaml = __webpack_require__(26);
      } catch (e) {
        try {
          // If it doesn't exist, load the fallback visionmedia yaml module.
          VisionmediaYaml = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"yaml\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        } catch (e) {}
      }
    }

    if (Yaml) {
      configObject = Yaml.load(content);
    } else if (VisionmediaYaml) {
      // The yaml library doesn't like strings that have newlines but don't
      // end in a newline: https://github.com/visionmedia/js-yaml/issues/issue/13
      content += '\n';
      configObject = VisionmediaYaml.eval(util.stripYamlComments(content));
    } else {
      console.error("No YAML parser loaded.  Suggest adding js-yaml dependency to your package.json file.");
    }
  } else if (format === 'json') {
    try {
      configObject = JSON.parse(content);
    } catch (e) {
      // All JS Style comments will begin with /, so all JSON parse errors that
      // encountered a syntax error will complain about this character.
      if (e.name !== 'SyntaxError' || e.message.indexOf('Unexpected token /') !== 0) {
        throw e;
      }

      if (!JSON5) {
        JSON5 = __webpack_require__(16);
      }

      configObject = JSON5.parse(content);
    }
  } else if (format === 'json5') {

    if (!JSON5) {
      JSON5 = __webpack_require__(16);
    }

    configObject = JSON5.parse(content);
  } else if (format === 'hjson') {

    if (!HJSON) {
      HJSON = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"hjson\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }

    configObject = HJSON.parse(content);
  } else if (format === 'toml') {

    if (!TOML) {
      TOML = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"toml\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }

    configObject = TOML.parse(content);
  } else if (format === 'cson') {
    if (!CSON) {
      CSON = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"cson\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }
    // Allow comments in CSON files
    if (typeof CSON.parseSync === 'function') {
      configObject = CSON.parseSync(util.stripComments(content));
    } else {
      configObject = CSON.parse(util.stripComments(content));
    }
  } else if (format === 'properties') {
    if (!PPARSER) {
      PPARSER = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"properties\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }
    configObject = PPARSER.parse(content, { namespaces: true, variables: true, sections: true });
  } else if (format === 'xml') {

    if (!XML) {
      XML = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"x2js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    }

    var x2js = new XML();
    configObject = x2js.xml2js(content);
    var rootKeys = Object.keys(configObject);
    if (rootKeys.length == 1) {
      configObject = configObject[rootKeys[0]];
    }
  }

  return configObject;
};

/**
 * Attach the Config class prototype to all config objects recursively.
 *
 * <p>
 * This allows you to do anything with CONFIG sub-objects as you can do with
 * the top-level CONFIG object.  It's so you can do this:
 * </p>
 *
 * <pre>
 *   var CUST_CONFIG = require('config').Customer;
 *   CUST_CONFIG.get(...)
 * </pre>
 *
 * @protected
 * @method attachProtoDeep
 * @param toObject
 * @param depth
 * @return toObject
 */
util.attachProtoDeep = function (toObject, depth) {
  if (toObject instanceof RawConfig) {
    return toObject;
  }

  // Recursion detection
  var t = this;
  depth = depth === null ? DEFAULT_CLONE_DEPTH : depth;
  if (depth < 0) {
    return toObject;
  }

  // Adding Config.prototype methods directly to toObject as hidden properties
  // because adding to toObject.__proto__ exposes the function in toObject
  for (var fnName in Config.prototype) {
    if (!toObject[fnName]) {
      util.makeHidden(toObject, fnName, Config.prototype[fnName]);
    }
  }

  // Add prototypes to sub-objects
  for (var prop in toObject) {
    if (util.isObject(toObject[prop])) {
      util.attachProtoDeep(toObject[prop], depth - 1);
    }
  }

  // Return the original object
  return toObject;
};

/**
 * Return a deep copy of the specified object.
 *
 * This returns a new object with all elements copied from the specified
 * object.  Deep copies are made of objects and arrays so you can do anything
 * with the returned object without affecting the input object.
 *
 * @protected
 * @method cloneDeep
 * @param parent {object} The original object to copy from
 * @param [depth=20] {Integer} Maximum depth (default 20)
 * @return {object} A new object with the elements copied from the copyFrom object
 *
 * This method is copied from https://github.com/pvorb/node-clone/blob/17eea36140d61d97a9954c53417d0e04a00525d9/clone.js
 *
 * Copyright © 2011-2014 Paul Vorbach and contributors.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions: The above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the Software.
 */
util.cloneDeep = function cloneDeep(parent, depth, circular, prototype) {
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular === 'undefined') circular = true;

  if (typeof depth === 'undefined') depth = 20;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null) return null;

    if (depth === 0) return parent;

    var child;
    if ((typeof parent === 'undefined' ? 'undefined' : _typeof(parent)) != 'object') {
      return parent;
    }

    if (Utils.isArray(parent)) {
      child = [];
    } else if (Utils.isRegExp(parent)) {
      child = new RegExp(parent.source, util.getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (Utils.isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype === 'undefined') child = Object.create(Object.getPrototypeOf(parent));else child = Object.create(prototype);
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var propDescriptor = Object.getOwnPropertyDescriptor(parent, i);
      var hasGetter = propDescriptor !== undefined && propDescriptor.get !== undefined;

      if (hasGetter) {
        Object.defineProperty(child, i, propDescriptor);
      } else {
        child[i] = _clone(parent[i], depth - 1);
      }
    }

    return child;
  }

  return _clone(parent, depth);
};

/**
 * Set objects given a path as a string list
 *
 * @protected
 * @method setPath
 * @param object {object} - Object to set the property on
 * @param path {array[string]} - Array path to the property
 * @param value {*} - value to set, ignoring null
 */
util.setPath = function (object, path, value) {
  var nextKey = null;
  if (value === null || path.length === 0) {
    return;
  } else if (path.length === 1) {
    // no more keys to make, so set the value
    object[path.shift()] = value;
  } else {
    nextKey = path.shift();
    if (!object.hasOwnProperty(nextKey)) {
      object[nextKey] = {};
    }
    util.setPath(object[nextKey], path, value);
  }
};

/**
 * Create a new object patterned after substitutionMap, where:
 * 1. Terminal string values in substitutionMap are used as keys
 * 2. To look up values in a key-value store, variables
 * 3. And parent keys are created as necessary to retain the structure of substitutionMap.
 *
 * @protected
 * @method substituteDeep
 * @param substitionMap {object} - an object whose terminal (non-subobject) values are strings
 * @param variables {object[string:value]} - usually process.env, a flat object used to transform
 *      terminal values in a copy of substititionMap.
 * @returns {object} - deep copy of substitutionMap with only those paths whose terminal values
 *      corresponded to a key in `variables`
 */
util.substituteDeep = function (substitutionMap, variables) {
  var result = {};

  function _substituteVars(map, vars, pathTo) {
    for (var prop in map) {
      var value = map[prop];
      if (typeof value === 'string') {
        // We found a leaf variable name
        if (vars[value]) {
          // if the vars provide a value set the value in the result map
          util.setPath(result, pathTo.concat(prop), vars[value]);
        }
      } else if (util.isObject(value)) {
        // work on the subtree, giving it a clone of the pathTo
        if ('__name' in value && '__format' in value && vars[value.__name]) {
          var parsedValue = util.parseString(vars[value.__name], value.__format);
          util.setPath(result, pathTo.concat(prop), parsedValue);
        } else {
          _substituteVars(value, vars, pathTo.concat(prop));
        }
      } else {
        msg = "Illegal key type for substitution map at " + pathTo.join('.') + ': ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value));
        throw Error(msg);
      }
    }
  }

  _substituteVars(substitutionMap, variables, []);
  return result;
};

/* Map environment variables into the configuration if a mapping file,
 * `custom-environment-variables.EXT` exists.
 *
 * @protected
 * @method getCustomEnvVars
 * @param CONFIG_DIR {string} - the passsed configuration directory
 * @param extNames {Array[string]} - acceptable configuration file extension names.
 * @returns {object} - mapped environment variables or {} if there are none
 */
util.getCustomEnvVars = function (CONFIG_DIR, extNames) {
  var result = {};
  extNames.forEach(function (extName) {
    var fullFilename = Path.join(CONFIG_DIR, 'custom-environment-variables' + '.' + extName);
    var configObj = util.parseFile(fullFilename);
    if (configObj) {
      var environmentSubstitutions = util.substituteDeep(configObj, process.env);
      util.extendDeep(result, environmentSubstitutions);
    }
  });
  return result;
};

/**
 * Return true if two objects have equal contents.
 *
 * @protected
 * @method equalsDeep
 * @param object1 {object} The object to compare from
 * @param object2 {object} The object to compare with
 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
 * @return {boolean} True if both objects have equivalent contents
 */
util.equalsDeep = function (object1, object2, depth) {

  // Recursion detection
  var t = this;
  depth = depth === null ? DEFAULT_CLONE_DEPTH : depth;
  if (depth < 0) {
    return {};
  }

  // Fast comparisons
  if (!object1 || !object2) {
    return false;
  }
  if (object1 === object2) {
    return true;
  }
  if ((typeof object1 === 'undefined' ? 'undefined' : _typeof(object1)) != 'object' || (typeof object2 === 'undefined' ? 'undefined' : _typeof(object2)) != 'object') {
    return false;
  }

  // They must have the same keys.  If their length isn't the same
  // then they're not equal.  If the keys aren't the same, the value
  // comparisons will fail.
  if (Object.keys(object1).length != Object.keys(object2).length) {
    return false;
  }

  // Compare the values
  for (var prop in object1) {

    // Call recursively if an object or array
    if (object1[prop] && _typeof(object1[prop]) === 'object') {
      if (!util.equalsDeep(object1[prop], object2[prop], depth - 1)) {
        return false;
      }
    } else {
      if (object1[prop] !== object2[prop]) {
        return false;
      }
    }
  }

  // Test passed.
  return true;
};

/**
 * Returns an object containing all elements that differ between two objects.
 * <p>
 * This method was designed to be used to create the runtime.json file
 * contents, but can be used to get the diffs between any two Javascript objects.
 * </p>
 * <p>
 * It works best when object2 originated by deep copying object1, then
 * changes were made to object2, and you want an object that would give you
 * the changes made to object1 which resulted in object2.
 * </p>
 *
 * @protected
 * @method diffDeep
 * @param object1 {object} The base object to compare to
 * @param object2 {object} The object to compare with
 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
 * @return {object} A differential object, which if extended onto object1 would
 *                  result in object2.
 */
util.diffDeep = function (object1, object2, depth) {

  // Recursion detection
  var t = this,
      diff = {};
  depth = depth === null ? DEFAULT_CLONE_DEPTH : depth;
  if (depth < 0) {
    return {};
  }

  // Process each element from object2, adding any element that's different
  // from object 1.
  for (var parm in object2) {
    var value1 = object1[parm];
    var value2 = object2[parm];
    if (value1 && value2 && util.isObject(value2)) {
      if (!util.equalsDeep(value1, value2)) {
        diff[parm] = util.diffDeep(value1, value2, depth - 1);
      }
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      if (!util.equalsDeep(value1, value2)) {
        diff[parm] = value2;
      }
    } else if (value1 !== value2) {
      diff[parm] = value2;
    }
  }

  // Return the diff object
  return diff;
};

/**
 * Extend an object, and any object it contains.
 *
 * This does not replace deep objects, but dives into them
 * replacing individual elements instead.
 *
 * @protected
 * @method extendDeep
 * @param mergeInto {object} The object to merge into
 * @param mergeFrom... {object...} - Any number of objects to merge from
 * @param depth {integer} An optional depth to prevent recursion.  Default: 20.
 * @return {object} The altered mergeInto object is returned
 */
util.extendDeep = function (mergeInto) {

  // Initialize
  var t = this;
  var vargs = Array.prototype.slice.call(arguments, 1);
  var depth = vargs.pop();
  if (typeof depth != 'number') {
    vargs.push(depth);
    depth = DEFAULT_CLONE_DEPTH;
  }

  // Recursion detection
  if (depth < 0) {
    return mergeInto;
  }

  // Cycle through each object to extend
  vargs.forEach(function (mergeFrom) {

    // Cycle through each element of the object to merge from
    for (var prop in mergeFrom) {

      // save original value in deferred elements
      var fromIsDeferredFunc = mergeFrom[prop] instanceof DeferredConfig;
      var isDeferredFunc = mergeInto[prop] instanceof DeferredConfig;

      if (fromIsDeferredFunc && mergeInto.hasOwnProperty(prop)) {
        mergeFrom[prop]._original = isDeferredFunc ? mergeInto[prop]._original : mergeInto[prop];
      }
      // Extend recursively if both elements are objects and target is not really a deferred function
      if (mergeFrom[prop] instanceof Date) {
        mergeInto[prop] = mergeFrom[prop];
      }if (mergeFrom[prop] instanceof RegExp) {
        mergeInto[prop] = mergeFrom[prop];
      } else if (util.isObject(mergeInto[prop]) && util.isObject(mergeFrom[prop]) && !isDeferredFunc) {
        util.extendDeep(mergeInto[prop], mergeFrom[prop], depth - 1);
      }

      // Copy recursively if the mergeFrom element is an object (or array or fn)
      else if (mergeFrom[prop] && _typeof(mergeFrom[prop]) === 'object') {
          mergeInto[prop] = util.cloneDeep(mergeFrom[prop], depth - 1);
        }

        // Copy property descriptor otherwise, preserving accessors
        else if (Object.getOwnPropertyDescriptor(Object(mergeFrom), prop)) {
            Object.defineProperty(mergeInto, prop, Object.getOwnPropertyDescriptor(Object(mergeFrom), prop));
          } else {
            mergeInto[prop] = mergeFrom[prop];
          }
    }
  });

  // Chain
  return mergeInto;
};

/**
 * Strip YAML comments from the string
 *
 * The 2.0 yaml parser doesn't allow comment-only or blank lines.  Strip them.
 *
 * @protected
 * @method stripYamlComments
 * @param fileString {string} The string to strip comments from
 * @return {string} The string with comments stripped.
 */
util.stripYamlComments = function (fileStr) {
  // First replace removes comment-only lines
  // Second replace removes blank lines
  return fileStr.replace(/^\s*#.*/mg, '').replace(/^\s*[\n|\r]+/mg, '');
};

/**
 * Strip all Javascript type comments from the string.
 *
 * The string is usually a file loaded from the O/S, containing
 * newlines and javascript type comments.
 *
 * Thanks to James Padolsey, and all who contributed to this implementation.
 * http://james.padolsey.com/javascript/javascript-comment-removal-revisted/
 *
 * @protected
 * @method stripComments
 * @param fileString {string} The string to strip comments from
 * @param stringRegex {RegExp} Optional regular expression to match strings that
 *   make up the config file
 * @return {string} The string with comments stripped.
 */
util.stripComments = function (fileStr, stringRegex) {
  stringRegex = stringRegex || /(['"])(\\\1|.)+?\1/g;

  var uid = '_' + +new Date(),
      primitives = [],
      primIndex = 0;

  return fileStr

  /* Remove strings */
  .replace(stringRegex, function (match) {
    primitives[primIndex] = match;
    return uid + '' + primIndex++;
  }

  /* Remove Regexes */
  ).replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function (match, $1, $2) {
    primitives[primIndex] = $2;
    return $1 + (uid + '') + primIndex++;
  }

  /*
  - Remove single-line comments that contain would-be multi-line delimiters
      E.g. // Comment /* <--
  - Remove multi-line comments that contain would be single-line delimiters
      E.g. /* // <--
  */
  ).replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, ''

  /*
  Remove single and multi-line comments,
  no consideration of inner-contents
  */
  ).replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, ''

  /*
  Remove multi-line comments that have a replaced ending (string/regex)
  Greedy, so no inner strings/regexes will stop it.
  */
  ).replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), ''

  /* Bring back strings & regexes */
  ).replace(RegExp(uid + '(\\d+)', 'g'), function (match, n) {
    return primitives[n];
  });
};

/**
 * Is the specified argument a regular javascript object?
 *
 * The argument is an object if it's a JS object, but not an array.
 *
 * @protected
 * @method isObject
 * @param arg {*} An argument of any type.
 * @return {boolean} TRUE if the arg is an object, FALSE if not
 */
util.isObject = function (obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj);
};

/**
 * <p>Initialize a parameter from the command line or process environment</p>
 *
 * <p>
 * This method looks for the parameter from the command line in the format
 * --PARAMETER=VALUE, then from the process environment, then from the
 * default specified as an argument.
 * </p>
 *
 * @method initParam
 * @param paramName {String} Name of the parameter
 * @param [defaultValue] {Any} Default value of the parameter
 * @return {Any} The found value, or default value
 */
util.initParam = function (paramName, defaultValue) {
  var t = this;

  // Record and return the value
  var value = util.getCmdLineArg(paramName) || process.env[paramName] || defaultValue;
  env[paramName] = value;
  return value;
};

/**
 * <p>Get Command Line Arguments</p>
 *
 * <p>
 * This method allows you to retrieve the value of the specified command line argument.
 * </p>
 *
 * <p>
 * The argument is case sensitive, and must be of the form '--ARG_NAME=value'
 * </p>
 *
 * @method getCmdLineArg
 * @param searchFor {String} The argument name to search for
 * @return {*} false if the argument was not found, the argument value if found
 */
util.getCmdLineArg = function (searchFor) {
  var cmdLineArgs = process.argv.slice(2, process.argv.length),
      argName = '--' + searchFor + '=';

  for (var argvIt = 0; argvIt < cmdLineArgs.length; argvIt++) {
    if (cmdLineArgs[argvIt].indexOf(argName) === 0) {
      return cmdLineArgs[argvIt].substr(argName.length);
    }
  }

  return false;
};

/**
 * <p>Get a Config Environment Variable Value</p>
 *
 * <p>
 * This method returns the value of the specified config environment variable,
 * including any defaults or overrides.
 * </p>
 *
 * @method getEnv
 * @param varName {String} The environment variable name
 * @return {String} The value of the environment variable
 */
util.getEnv = function (varName) {
  return env[varName];
};

/**
 * Returns a string of flags for regular expression `re`.
 *
 * @param {RegExp} re Regular expression
 * @returns {string} Flags
 */
util.getRegExpFlags = function (re) {
  var flags = '';
  re.global && (flags += 'g');
  re.ignoreCase && (flags += 'i');
  re.multiline && (flags += 'm');
  return flags;
};

// Run strictness checks on NODE_ENV and NODE_APP_INSTANCE and throw an error if there's a problem.
util.runStrictnessChecks = function (config) {
  var sources = config.util.getConfigSources();

  var sourceFilenames = sources.map(function (src) {
    return Path.basename(src.name);
  });

  // Throw an exception if there's no explicit config file for NODE_ENV
  var anyFilesMatchEnv = sourceFilenames.some(function (filename) {
    return filename.match(NODE_ENV);
  });
  // development is special-cased because it's the default value
  if (NODE_ENV && NODE_ENV !== 'development' && !anyFilesMatchEnv) {
    _warnOrThrow("NODE_ENV value of '" + NODE_ENV + "' did not match any deployment config file names.");
  }

  // Throw an exception if there's no explict config file for NODE_APP_INSTANCE
  var anyFilesMatchInstance = sourceFilenames.some(function (filename) {
    return filename.match(APP_INSTANCE);
  });
  if (APP_INSTANCE && !anyFilesMatchInstance) {
    _warnOrThrow("NODE_APP_INSTANCE value of '" + APP_INSTANCE + "' did not match any instance config file names.");
  }

  // Throw if NODE_ENV matches' default' or 'local'
  if (NODE_ENV === 'default' || NODE_ENV === 'local') {
    _warnOrThrow("NODE_ENV value of '" + NODE_ENV + "' is ambiguous.");
  }

  function _warnOrThrow(msg) {
    var beStrict = process.env.NODE_CONFIG_STRICT_MODE;
    var prefix = beStrict ? 'FATAL: ' : 'WARNING: ';
    var seeURL = 'See https://github.com/lorenwest/node-config/wiki/Strict-Mode';

    console.error(prefix + msg);
    console.error(prefix + seeURL);

    // Accept 1 and true as truthy values. When set via process.env, Node.js casts them to strings.
    if (["true", "1"].indexOf(beStrict) >= 0) {
      throw new Error(prefix + msg + ' ' + seeURL);
    }
  }
};

// Process pre-1.0 utility names
var utilWarnings = {};
['watch', 'setModuleDefaults', 'makeHidden', 'makeImmutable', 'getConfigSources', '_loadFileConfigs', '_parseFile', '_attachProtoDeep', '_cloneDeep', '_equalsDeep', '_diffDeep', '_extendDeep', '_stripYamlComments', '_stripComments', '_isObject', '_initParam', '_getCmdLineArg'].forEach(function (oldName) {

  // Config.util names don't have underscores
  var newName = oldName;
  if (oldName.indexOf('_') === 0) {
    newName = oldName.substr(1);
  }

  // Build the wrapper with warning
  Config.prototype[oldName] = function () {

    // Produce the warning
    if (!utilWarnings[oldName]) {
      console.error('WARNING: config.' + oldName + '() is deprecated.  Use config.util.' + newName + '() instead.');
      console.error('WARNING: See https://github.com/lorenwest/node-config/wiki/Future-Compatibility#upcoming-incompatibilities');
      utilWarnings[oldName] = true;
    }

    // Forward the call
    return util[newName].apply(this, arguments);
  };
});

// Instantiate and export the configuration
var config = module.exports = new Config();

// Produce warnings if the configuration is empty
var showWarnings = !util.initParam('SUPPRESS_NO_CONFIG_WARNING');
if (showWarnings && Object.keys(config).length === 0) {
  console.error('WARNING: No configurations found in configuration directory:' + CONFIG_DIR);
  console.error('WARNING: To disable this warning set SUPPRESS_NO_CONFIG_WARNING in the environment.');
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(12).Buffer))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var punycode = __webpack_require__(49);
var util = __webpack_require__(53);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,


// Special case for a simple path URL
simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,


// RFC 2396: characters reserved for delimiting URLs.
// We actually just auto-escape these.
delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],


// RFC 2396: characters not allowed for various reasons.
unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),


// Allowed by RFCs, but cause of XSS attacks.  Always escape these.
autoEscape = ['\''].concat(unwise),

// Characters that are never ever allowed in a hostname.
// Note that any invalid chars are also handled, but these
// are the ones that are *expected* to be seen, so we fast-path
// them.
nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,

// protocols that can allow "unsafe" and "unwise" chars.
unsafeProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that never have a hostname.
hostlessProtocol = {
  'javascript': true,
  'javascript:': true
},

// protocols that always contain a // bit.
slashedProtocol = {
  'http': true,
  'https': true,
  'ftp': true,
  'gopher': true,
  'file': true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
},
    querystring = __webpack_require__(52);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + (typeof url === 'undefined' ? 'undefined' : _typeof(url)));
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || query && '?' + query || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function (relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
      isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
      mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || result.host && srcPath.length;

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname, process) {

var electron = __webpack_require__(8
// Module to control application life.
);var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;

var _require = __webpack_require__(8),
    dialog = _require.dialog;

var path = __webpack_require__(7);
var url = __webpack_require__(20);
var config = __webpack_require__(19

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
);var mainWindow = void 0;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/app/submit-paper/submit-paper.html'),
    protocol: 'file:',
    slashes: true
  })

  // Open the DevTools.
  );mainWindow.webContents.openDevTools

  // Emitted when the window is closed.
  ();mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow

// Quit when all windows are closed.
);app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
);
/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(5)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is meant to wrap configuration objects that should be left as is,
 * meaning that the object or its protoype will not be modified in any way
 */
function RawConfig() {}

function raw(rawObj) {
  var obj = Object.create(RawConfig.prototype);
  obj.resolve = function () {
    return rawObj;
  };
  return obj;
}

module.exports.RawConfig = RawConfig;
module.exports.raw = raw;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var yaml = __webpack_require__(27);

module.exports = yaml;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var loader = __webpack_require__(29);
var dumper = __webpack_require__(28);

function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}

module.exports.Type = __webpack_require__(0);
module.exports.Schema = __webpack_require__(2);
module.exports.FAILSAFE_SCHEMA = __webpack_require__(9);
module.exports.JSON_SCHEMA = __webpack_require__(15);
module.exports.CORE_SCHEMA = __webpack_require__(14);
module.exports.DEFAULT_SAFE_SCHEMA = __webpack_require__(4);
module.exports.DEFAULT_FULL_SCHEMA = __webpack_require__(6);
module.exports.load = loader.load;
module.exports.loadAll = loader.loadAll;
module.exports.safeLoad = loader.safeLoad;
module.exports.safeLoadAll = loader.safeLoadAll;
module.exports.dump = dumper.dump;
module.exports.safeDump = dumper.safeDump;
module.exports.YAMLException = __webpack_require__(3);

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = __webpack_require__(9);
module.exports.SAFE_SCHEMA = __webpack_require__(4);
module.exports.DEFAULT_SCHEMA = __webpack_require__(6);

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan = deprecated('scan');
module.exports.parse = deprecated('parse');
module.exports.compose = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable no-use-before-define*/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var common = __webpack_require__(1);
var YAMLException = __webpack_require__(3);
var DEFAULT_FULL_SCHEMA = __webpack_require__(6);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(4);

var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_TAB = 0x09; /* Tab */
var CHAR_LINE_FEED = 0x0A; /* LF */
var CHAR_SPACE = 0x20; /* Space */
var CHAR_EXCLAMATION = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE = 0x22; /* " */
var CHAR_SHARP = 0x23; /* # */
var CHAR_PERCENT = 0x25; /* % */
var CHAR_AMPERSAND = 0x26; /* & */
var CHAR_SINGLE_QUOTE = 0x27; /* ' */
var CHAR_ASTERISK = 0x2A; /* * */
var CHAR_COMMA = 0x2C; /* , */
var CHAR_MINUS = 0x2D; /* - */
var CHAR_COLON = 0x3A; /* : */
var CHAR_GREATER_THAN = 0x3E; /* > */
var CHAR_QUESTION = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET = 0x7B; /* { */
var CHAR_VERTICAL_LINE = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00] = '\\0';
ESCAPE_SEQUENCES[0x07] = '\\a';
ESCAPE_SEQUENCES[0x08] = '\\b';
ESCAPE_SEQUENCES[0x09] = '\\t';
ESCAPE_SEQUENCES[0x0A] = '\\n';
ESCAPE_SEQUENCES[0x0B] = '\\v';
ESCAPE_SEQUENCES[0x0C] = '\\f';
ESCAPE_SEQUENCES[0x0D] = '\\r';
ESCAPE_SEQUENCES[0x1B] = '\\e';
ESCAPE_SEQUENCES[0x22] = '\\"';
ESCAPE_SEQUENCES[0x5C] = '\\\\';
ESCAPE_SEQUENCES[0x85] = '\\N';
ESCAPE_SEQUENCES[0xA0] = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = ['y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON', 'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'];

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}

function State(options) {
  this.schema = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent = Math.max(1, options['indent'] || 2);
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel = common.isNothing(options['flowLevel']) ? -1 : options['flowLevel'];
  this.styleMap = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys = options['sortKeys'] || false;
  this.lineWidth = options['lineWidth'] || 80;
  this.noRefs = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return 0x00020 <= c && c <= 0x00007E || 0x000A1 <= c && c <= 0x00D7FF && c !== 0x2028 && c !== 0x2029 || 0x0E000 <= c && c <= 0x00FFFD && c !== 0xFEFF /* BOM */ || 0x10000 <= c && c <= 0x10FFFF;
}

// Simplified test for values allowed after the first character in plain style.
function isPlainSafe(c) {
  // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
  // where nb-char ::= c-printable - b-char - c-byte-order-mark.
  return isPrintable(c) && c !== 0xFEFF
  // - c-flow-indicator
  && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
  // - ":" - "#"
  && c !== CHAR_COLON && c !== CHAR_SHARP;
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  return isPrintable(c) && c !== 0xFEFF && !isWhitespace(c // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  ) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET
  // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
  && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE
  // | “%” | “@” | “`”)
  && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}

var STYLE_PLAIN = 1,
    STYLE_SINGLE = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED = 4,
    STYLE_DOUBLE = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
  var i;
  var char;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));

  if (singleLineOnly) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
          // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== ' ';
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (string[0] === ' ' && indentPerLevel > 9) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey) {
  state.dump = function () {
    if (string.length === 0) {
      return "''";
    }
    if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
      return "'" + string + "'";
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
    // No block styles in flow mode.
    || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }();
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = string[0] === ' ' ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip = string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : clip ? '' : '-';

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1],
        line = match[2];
    moreIndented = line[0] === ' ';
    result += prefix + (!prevMoreIndented && !moreIndented && line !== '' ? '\n' : '') + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0,
      end,
      curr = 0,
      next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while (match = breakRe.exec(line)) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = curr > start ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1; // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char;
  var escapeSeq;

  for (var i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (index !== 0) _result += ', ';
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || index !== 0) {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result = '',
      _tag = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (index !== 0) pairBuffer += ', ';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + ': ';

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result = '',
      _tag = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || index !== 0) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = state.tag !== null && state.tag !== '?' || state.dump && state.dump.length > 1024;

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf || type.predicate) && (!type.instanceOf || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if (state.tag !== null && state.tag !== '?' || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && state.dump.length !== 0) {
        writeBlockSequence(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      state.dump = '!<' + state.tag + '> ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;

  if (object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

  return '';
}

function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.dump = dump;
module.exports.safeDump = safeDump;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable max-len,no-use-before-define*/

var common = __webpack_require__(1);
var YAMLException = __webpack_require__(3);
var Mark = __webpack_require__(30);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(4);
var DEFAULT_FULL_SCHEMA = __webpack_require__(6);

var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;

var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;

var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;

function is_EOL(c) {
  return c === 0x0A /* LF */ || c === 0x0D /* CR */;
}

function is_WHITE_SPACE(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */;
}

function is_WS_OR_EOL(c) {
  return c === 0x09 /* Tab */ || c === 0x20 /* Space */ || c === 0x0A /* LF */ || c === 0x0D /* CR */;
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C /* , */ || c === 0x5B /* [ */ || c === 0x5D /* ] */ || c === 0x7B /* { */ || c === 0x7D /* } */;
}

function fromHexCode(c) {
  var lc;

  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if (0x61 /* a */ <= lc && lc <= 0x66 /* f */) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78 /* x */) {
      return 2;
    }
  if (c === 0x75 /* u */) {
      return 4;
    }
  if (c === 0x55 /* U */) {
      return 8;
    }
  return 0;
}

function fromDecimalCode(c) {
  if (0x30 /* 0 */ <= c && c <= 0x39 /* 9 */) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  return c === 0x30 /* 0 */ ? '\x00' : c === 0x61 /* a */ ? '\x07' : c === 0x62 /* b */ ? '\x08' : c === 0x74 /* t */ ? '\x09' : c === 0x09 /* Tab */ ? '\x09' : c === 0x6E /* n */ ? '\x0A' : c === 0x76 /* v */ ? '\x0B' : c === 0x66 /* f */ ? '\x0C' : c === 0x72 /* r */ ? '\x0D' : c === 0x65 /* e */ ? '\x1B' : c === 0x20 /* Space */ ? ' ' : c === 0x22 /* " */ ? '\x22' : c === 0x2F /* / */ ? '/' : c === 0x5C /* \ */ ? '\x5C' : c === 0x4E /* N */ ? '\x85' : c === 0x5F /* _ */ ? '\xA0' : c === 0x4C /* L */ ? '\u2028' : c === 0x50 /* P */ ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode((c - 0x010000 >> 10) + 0xD800, (c - 0x010000 & 0x03FF) + 0xDC00);
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}

function State(input, options) {
  this.input = input;

  this.filename = options['filename'] || null;
  this.schema = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy = options['legacy'] || false;
  this.json = options['json'] || false;
  this.listener = options['listener'] || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;

  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/
}

function generateError(state, message) {
  return new YAMLException(message, new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}

var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = minor < 2;

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    state.tagMap[handle] = prefix;
  }
};

function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 || 0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
  var index, quantity;

  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A /* LF */) {
      state.position++;
    } else if (ch === 0x0D /* CR */) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 0x0A /* LF */) {
          state.position++;
        }
    } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23 /* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0x0A /* LF */ && ch !== 0x0D /* CR */ && ch !== 0);
      }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20 /* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D /* - */ || ch === 0x2E /* . */) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}

function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 0x23 /* # */ || ch === 0x26 /* & */ || ch === 0x2A /* * */ || ch === 0x21 /* ! */ || ch === 0x7C /* | */ || ch === 0x3E /* > */ || ch === 0x27 /* ' */ || ch === 0x22 /* " */ || ch === 0x25 /* % */ || ch === 0x40 /* @ */ || ch === 0x60 /* ` */) {
      return false;
    }

  if (ch === 0x3F /* ? */ || ch === 0x2D /* - */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A /* : */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 0x23 /* # */) {
        preceding = state.input.charCodeAt(state.position - 1);

        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27 /* ' */) {
      return false;
    }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27 /* ' */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (ch === 0x27 /* ' */) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
          return true;
        }
      } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22 /* " */) {
      return false;
    }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22 /* " */) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 0x5C /* \ */) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);

        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);

          // TODO: rework to inline fn with no type cast?
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;

          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);

            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, 'expected hexadecimal character');
            }
          }

          state.result += charFromCodepoint(hexResult);

          state.position++;
        } else {
          throwError(state, 'unknown escape sequence');
        }

        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag = state.tag,
      _result,
      _anchor = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = {},
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B /* [ */) {
      terminator = 0x5D; /* ] */
      isMapping = false;
      _result = [];
    } else if (ch === 0x7B /* { */) {
      terminator = 0x7D; /* } */
      isMapping = true;
      _result = {};
    } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F /* ? */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A /* : */) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C /* , */) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent = nodeIndent,
      emptyLines = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C /* | */) {
      folding = false;
    } else if (ch === 0x3E /* > */) {
      folding = true;
    } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B /* + */ || ch === 0x2D /* - */) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 0x2B /* + */ ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, 'repeat of a chomping mode identifier');
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }
    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));

    if (ch === 0x23 /* # */) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20 /* Space */) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

        // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

        // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) {
          // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

        // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

      // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag = state.tag,
      _anchor = state.anchor,
      _result = [],
      following,
      detected = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {

    if (ch !== 0x2D /* - */) {
        break;
      }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _pos,
      _tag = state.tag,
      _anchor = state.anchor,
      _result = {},
      overridableKeys = {},
      keyTag = null,
      keyNode = null,
      valueNode = null,
      atExplicitKey = false,
      detected = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.
    _pos = state.position;

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F /* ? */ || ch === 0x3A /* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F /* ? */) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
      }

      state.position += 1;
      ch = following;

      //
      // Implicit notation case. Flow-style node as the key first, then ":", and the value.
      //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A /* : */) {
            ch = state.input.charCodeAt(++state.position);

            if (!is_WS_OR_EOL(ch)) {
              throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
            }

            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }

            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }
      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    } else {
        break; // Reading is done. Go to the epilogue.
      }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && ch !== 0) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21 /* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C /* < */) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 0x21 /* ! */) {
      isNamed = true;
      tagHandle = '!!';
      ch = state.input.charCodeAt(++state.position);
    } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 0x3E /* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21 /* ! */) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);

            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, 'named tag handle cannot contain such characters');
            }

            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, 'tag suffix cannot contain exclamation marks');
          }
        }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;
  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position, ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26 /* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias, ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A /* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1,
      // 1: this>parent, 0: this=parent, -1: this<parent
  atNewLine = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag !== null && state.tag !== '!') {
    if (state.tag === '?') {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) {
          // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];

      if (state.result !== null && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) {
        // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25 /* % */) {
        break;
      }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23 /* # */) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 0x2D /* - */ && state.input.charCodeAt(state.position + 1) === 0x2D /* - */ && state.input.charCodeAt(state.position + 2) === 0x2D /* - */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E /* . */) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
    return;
  }

  if (state.position < state.length - 1) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}

function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A /* LF */ && input.charCodeAt(input.length - 1) !== 0x0D /* CR */) {
        input += '\n';
      }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20 /* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < state.length - 1) {
    readDocument(state);
  }

  return state.documents;
}

function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options),
      index,
      length;

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}

function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}

function safeLoadAll(input, output, options) {
  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.loadAll = loadAll;
module.exports.load = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad = safeLoad;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var common = __webpack_require__(1);

function Mark(name, buffer, position, line, column) {
  this.name = name;
  this.buffer = buffer;
  this.position = position;
  this.line = line;
  this.column = column;
}

Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) return null;

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
    start -= 1;
    if (this.position - start > maxLength / 2 - 1) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
    end += 1;
    if (end - this.position > maxLength / 2 - 1) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' + common.repeat(' ', indent + this.position - start + head.length) + '^';
};

Mark.prototype.toString = function toString(compact) {
  var snippet,
      where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};

module.exports = Mark;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var require;

/*eslint-disable no-bitwise*/

var NodeBuffer;

try {
  // A trick for browserified version, to not include `Buffer` shim
  var _require = require;
  NodeBuffer = __webpack_require__(12).Buffer;
} catch (__) {}

var Type = __webpack_require__(0);

// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';

function resolveYamlBinary(data) {
  if (data === null) return false;

  var code,
      idx,
      bitlen = 0,
      max = data.length,
      map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return bitlen % 8 === 0;
}

function constructYamlBinary(data) {
  var idx,
      tailbits,
      input = data.replace(/[\r\n=]/g, ''),
      // remove CR/LF & padding to simplify scan
  max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 0xFF);
      result.push(bits >> 8 & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = bits << 6 | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = max % 4 * 6;

  if (tailbits === 0) {
    result.push(bits >> 16 & 0xFF);
    result.push(bits >> 8 & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 0xFF);
    result.push(bits >> 2 & 0xFF);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 0xFF);
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) {
    // Support node 6.+ Buffer API when available
    return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
  }

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '',
      bits = 0,
      idx,
      tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map[bits >> 18 & 0x3F];
      result += map[bits >> 12 & 0x3F];
      result += map[bits >> 6 & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[bits >> 18 & 0x3F];
    result += map[bits >> 12 & 0x3F];
    result += map[bits >> 6 & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[bits >> 10 & 0x3F];
    result += map[bits >> 4 & 0x3F];
    result += map[bits << 2 & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[bits >> 2 & 0x3F];
    result += map[bits << 4 & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return max === 4 && (data === 'true' || data === 'True' || data === 'TRUE') || max === 5 && (data === 'false' || data === 'False' || data === 'FALSE');
}

function constructYamlBoolean(data) {
  return data === 'true' || data === 'True' || data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function lowercase(object) {
      return object ? 'true' : 'false';
    },
    uppercase: function uppercase(object) {
      return object ? 'TRUE' : 'FALSE';
    },
    camelcase: function camelcase(object) {
      return object ? 'True' : 'False';
    }
  },
  defaultStyle: 'lowercase'
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var common = __webpack_require__(1);
var Type = __webpack_require__(0);

var YAML_FLOAT_PATTERN = new RegExp(
// 2.5e4, 2.5 and integers
'^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
// .2e4, .2
// special case, seems not from spec
'|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
// 20:59
'|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
// .inf
'|[-+]?\\.(?:inf|Inf|INF)' +
// .nan
'|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
  // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value = data.replace(/_/g, '').toLowerCase();
  sign = value[0] === '-' ? -1 : 1;
  digits = [];

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === '.nan') {
    return NaN;
  } else if (value.indexOf(':') >= 0) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;
  }
  return sign * parseFloat(value, 10);
}

var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase':
        return '.nan';
      case 'uppercase':
        return '.NAN';
      case 'camelcase':
        return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '.inf';
      case 'uppercase':
        return '.INF';
      case 'camelcase':
        return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase':
        return '-.inf';
      case 'uppercase':
        return '-.INF';
      case 'camelcase':
        return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var common = __webpack_require__(1);
var Type = __webpack_require__(0);

function isHexCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */ || 0x41 /* A */ <= c && c <= 0x46 /* F */ || 0x61 /* a */ <= c && c <= 0x66 /* f */;
}

function isOctCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x37 /* 7 */;
}

function isDecCode(c) {
  return 0x30 /* 0 */ <= c && c <= 0x39 /* 9 */;
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }

    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') continue;
      if (!isOctCode(data.charCodeAt(index))) return false;
      hasDigits = true;
    }
    return hasDigits && ch !== '_';
  }

  // base 10 (except 0) or base 60

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (ch === ':') break;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  // if !base60 - done;
  if (ch !== ':') return true;

  // base60 almost not used, no needs to optimize
  return (/^(:[0-5]?[0-9])+$/.test(data.slice(index))
  );
}

function constructYamlInteger(data) {
  var value = data,
      sign = 1,
      ch,
      base,
      digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return Object.prototype.toString.call(object) === '[object Number]' && object % 1 === 0 && !common.isNegativeZero(object);
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function binary(object) {
      return '0b' + object.toString(2);
    },
    octal: function octal(object) {
      return '0' + object.toString(8);
    },
    decimal: function decimal(object) {
      return object.toString(10);
    },
    hexadecimal: function hexadecimal(object) {
      return '0x' + object.toString(16).toUpperCase();
    }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary: [2, 'bin'],
    octal: [8, 'oct'],
    decimal: [10, 'dec'],
    hexadecimal: [16, 'hex']
  }
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var require;

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  // workaround to exclude package from browserify list.
  var _require = require;
  esprima = __webpack_require__(47);
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') esprima = window.esprima;
}

var Type = __webpack_require__(0);

function resolveJavascriptFunction(data) {
  if (data === null) return false;

  try {
    var source = '(' + data + ')',
        ast = esprima.parse(source, { range: true });

    if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'FunctionExpression') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast = esprima.parse(source, { range: true }),
      params = [],
      body;

  if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement' || ast.body[0].expression.type !== 'FunctionExpression') {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  /*eslint-disable no-new-func*/
  return new Function(params, source.slice(body[0] + 1, body[1] - 1));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return Object.prototype.toString.call(object) === '[object Function]';
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

function resolveJavascriptRegExp(data) {
  if (data === null) return false;
  if (data.length === 0) return false;

  var regexp = data,
      tail = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];

    if (modifiers.length > 3) return false;
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
  }

  return true;
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) result += 'g';
  if (object.multiline) result += 'm';
  if (object.ignoreCase) result += 'i';

  return result;
}

function isRegExp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return typeof object === 'undefined';
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function construct(data) {
    return data !== null ? data : {};
  }
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return max === 1 && data === '~' || max === 4 && (data === 'null' || data === 'Null' || data === 'NULL');
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function canonical() {
      return '~';
    },
    lowercase: function lowercase() {
      return 'null';
    },
    uppercase: function uppercase() {
      return 'NULL';
    },
    camelcase: function camelcase() {
      return 'Null';
    }
  },
  defaultStyle: 'lowercase'
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [],
      index,
      length,
      pair,
      pairKey,
      pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index,
      length,
      pair,
      keys,
      result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [keys[0], pair[keys[0]]];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index,
      length,
      pair,
      keys,
      result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [keys[0], pair[keys[0]]];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function construct(data) {
    return data !== null ? data : [];
  }
});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key,
      object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function construct(data) {
    return data !== null ? data : '';
  }
});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(0);

var YAML_DATE_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + // [1] year
'-([0-9][0-9])' + // [2] month
'-([0-9][0-9])$'); // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp('^([0-9][0-9][0-9][0-9])' + // [1] year
'-([0-9][0-9]?)' + // [2] month
'-([0-9][0-9]?)' + // [3] day
'(?:[Tt]|[ \\t]+)' + // ...
'([0-9][0-9]?)' + // [4] hour
':([0-9][0-9])' + // [5] minute
':([0-9][0-9])' + // [6] second
'(?:\\.([0-9]*))?' + // [7] fraction
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
'(?::([0-9][0-9]))?))?$'); // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match,
      year,
      month,
      day,
      hour,
      minute,
      second,
      fraction = 0,
      delta = null,
      tz_hour,
      tz_minute,
      date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +match[1];
  month = +match[2] - 1; // JS month starts with 0
  day = +match[3];

  if (!match[4]) {
    // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +match[4];
  minute = +match[5];
  second = +match[6];

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
	/* istanbul ignore next */
	if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* istanbul ignore next */
	else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["esprima"] = factory();else root["esprima"] = factory();
})(undefined, function () {
	return (/******/function (modules) {
			// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};

			/******/ // The require function
			/******/function __webpack_require__(moduleId) {

				/******/ // Check if module is in cache
				/* istanbul ignore if */
				/******/if (installedModules[moduleId])
					/******/return installedModules[moduleId].exports;

				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/exports: {},
					/******/id: moduleId,
					/******/loaded: false
					/******/ };

				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

				/******/ // Flag the module as loaded
				/******/module.loaded = true;

				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/
			}

			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;

			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;

			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";

			/******/ // Load entry module and return exports
			/******/return __webpack_require__(0);
			/******/
		}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports, __webpack_require__) {

			/*
     Copyright JS Foundation and other contributors, https://js.foundation/
   	  Redistribution and use in source and binary forms, with or without
     modification, are permitted provided that the following conditions are met:
   	    * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
   	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
     DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
     ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
			"use strict";

			var comment_handler_1 = __webpack_require__(1);
			var parser_1 = __webpack_require__(3);
			var jsx_parser_1 = __webpack_require__(11);
			var tokenizer_1 = __webpack_require__(15);
			function parse(code, options, delegate) {
				var commentHandler = null;
				var proxyDelegate = function proxyDelegate(node, metadata) {
					if (delegate) {
						delegate(node, metadata);
					}
					if (commentHandler) {
						commentHandler.visit(node, metadata);
					}
				};
				var parserDelegate = typeof delegate === 'function' ? proxyDelegate : null;
				var collectComment = false;
				if (options) {
					collectComment = typeof options.comment === 'boolean' && options.comment;
					var attachComment = typeof options.attachComment === 'boolean' && options.attachComment;
					if (collectComment || attachComment) {
						commentHandler = new comment_handler_1.CommentHandler();
						commentHandler.attach = attachComment;
						options.comment = true;
						parserDelegate = proxyDelegate;
					}
				}
				var parser;
				if (options && typeof options.jsx === 'boolean' && options.jsx) {
					parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
				} else {
					parser = new parser_1.Parser(code, options, parserDelegate);
				}
				var ast = parser.parseProgram();
				if (collectComment) {
					ast.comments = commentHandler.comments;
				}
				if (parser.config.tokens) {
					ast.tokens = parser.tokens;
				}
				if (parser.config.tolerant) {
					ast.errors = parser.errorHandler.errors;
				}
				return ast;
			}
			exports.parse = parse;
			function tokenize(code, options, delegate) {
				var tokenizer = new tokenizer_1.Tokenizer(code, options);
				var tokens;
				tokens = [];
				try {
					while (true) {
						var token = tokenizer.getNextToken();
						if (!token) {
							break;
						}
						if (delegate) {
							token = delegate(token);
						}
						tokens.push(token);
					}
				} catch (e) {
					tokenizer.errorHandler.tolerate(e);
				}
				if (tokenizer.errorHandler.tolerant) {
					tokens.errors = tokenizer.errors();
				}
				return tokens;
			}
			exports.tokenize = tokenize;
			var syntax_1 = __webpack_require__(2);
			exports.Syntax = syntax_1.Syntax;
			// Sync with *.json manifests.
			exports.version = '3.1.3';

			/***/
		},
		/* 1 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var syntax_1 = __webpack_require__(2);
			var CommentHandler = function () {
				function CommentHandler() {
					this.attach = false;
					this.comments = [];
					this.stack = [];
					this.leading = [];
					this.trailing = [];
				}
				CommentHandler.prototype.insertInnerComments = function (node, metadata) {
					//  innnerComments for properties empty block
					//  `function a() {/** comments **\/}`
					if (node.type === syntax_1.Syntax.BlockStatement && node.body.length === 0) {
						var innerComments = [];
						for (var i = this.leading.length - 1; i >= 0; --i) {
							var entry = this.leading[i];
							if (metadata.end.offset >= entry.start) {
								innerComments.unshift(entry.comment);
								this.leading.splice(i, 1);
								this.trailing.splice(i, 1);
							}
						}
						if (innerComments.length) {
							node.innerComments = innerComments;
						}
					}
				};
				CommentHandler.prototype.findTrailingComments = function (node, metadata) {
					var trailingComments = [];
					if (this.trailing.length > 0) {
						for (var i = this.trailing.length - 1; i >= 0; --i) {
							var entry_1 = this.trailing[i];
							if (entry_1.start >= metadata.end.offset) {
								trailingComments.unshift(entry_1.comment);
							}
						}
						this.trailing.length = 0;
						return trailingComments;
					}
					var entry = this.stack[this.stack.length - 1];
					if (entry && entry.node.trailingComments) {
						var firstComment = entry.node.trailingComments[0];
						if (firstComment && firstComment.range[0] >= metadata.end.offset) {
							trailingComments = entry.node.trailingComments;
							delete entry.node.trailingComments;
						}
					}
					return trailingComments;
				};
				CommentHandler.prototype.findLeadingComments = function (node, metadata) {
					var leadingComments = [];
					var target;
					while (this.stack.length > 0) {
						var entry = this.stack[this.stack.length - 1];
						if (entry && entry.start >= metadata.start.offset) {
							target = this.stack.pop().node;
						} else {
							break;
						}
					}
					if (target) {
						var count = target.leadingComments ? target.leadingComments.length : 0;
						for (var i = count - 1; i >= 0; --i) {
							var comment = target.leadingComments[i];
							if (comment.range[1] <= metadata.start.offset) {
								leadingComments.unshift(comment);
								target.leadingComments.splice(i, 1);
							}
						}
						if (target.leadingComments && target.leadingComments.length === 0) {
							delete target.leadingComments;
						}
						return leadingComments;
					}
					for (var i = this.leading.length - 1; i >= 0; --i) {
						var entry = this.leading[i];
						if (entry.start <= metadata.start.offset) {
							leadingComments.unshift(entry.comment);
							this.leading.splice(i, 1);
						}
					}
					return leadingComments;
				};
				CommentHandler.prototype.visitNode = function (node, metadata) {
					if (node.type === syntax_1.Syntax.Program && node.body.length > 0) {
						return;
					}
					this.insertInnerComments(node, metadata);
					var trailingComments = this.findTrailingComments(node, metadata);
					var leadingComments = this.findLeadingComments(node, metadata);
					if (leadingComments.length > 0) {
						node.leadingComments = leadingComments;
					}
					if (trailingComments.length > 0) {
						node.trailingComments = trailingComments;
					}
					this.stack.push({
						node: node,
						start: metadata.start.offset
					});
				};
				CommentHandler.prototype.visitComment = function (node, metadata) {
					var type = node.type[0] === 'L' ? 'Line' : 'Block';
					var comment = {
						type: type,
						value: node.value
					};
					if (node.range) {
						comment.range = node.range;
					}
					if (node.loc) {
						comment.loc = node.loc;
					}
					this.comments.push(comment);
					if (this.attach) {
						var entry = {
							comment: {
								type: type,
								value: node.value,
								range: [metadata.start.offset, metadata.end.offset]
							},
							start: metadata.start.offset
						};
						if (node.loc) {
							entry.comment.loc = node.loc;
						}
						node.type = type;
						this.leading.push(entry);
						this.trailing.push(entry);
					}
				};
				CommentHandler.prototype.visit = function (node, metadata) {
					if (node.type === 'LineComment') {
						this.visitComment(node, metadata);
					} else if (node.type === 'BlockComment') {
						this.visitComment(node, metadata);
					} else if (this.attach) {
						this.visitNode(node, metadata);
					}
				};
				return CommentHandler;
			}();
			exports.CommentHandler = CommentHandler;

			/***/
		},
		/* 2 */
		/***/function (module, exports) {

			"use strict";

			exports.Syntax = {
				AssignmentExpression: 'AssignmentExpression',
				AssignmentPattern: 'AssignmentPattern',
				ArrayExpression: 'ArrayExpression',
				ArrayPattern: 'ArrayPattern',
				ArrowFunctionExpression: 'ArrowFunctionExpression',
				BlockStatement: 'BlockStatement',
				BinaryExpression: 'BinaryExpression',
				BreakStatement: 'BreakStatement',
				CallExpression: 'CallExpression',
				CatchClause: 'CatchClause',
				ClassBody: 'ClassBody',
				ClassDeclaration: 'ClassDeclaration',
				ClassExpression: 'ClassExpression',
				ConditionalExpression: 'ConditionalExpression',
				ContinueStatement: 'ContinueStatement',
				DoWhileStatement: 'DoWhileStatement',
				DebuggerStatement: 'DebuggerStatement',
				EmptyStatement: 'EmptyStatement',
				ExportAllDeclaration: 'ExportAllDeclaration',
				ExportDefaultDeclaration: 'ExportDefaultDeclaration',
				ExportNamedDeclaration: 'ExportNamedDeclaration',
				ExportSpecifier: 'ExportSpecifier',
				ExpressionStatement: 'ExpressionStatement',
				ForStatement: 'ForStatement',
				ForOfStatement: 'ForOfStatement',
				ForInStatement: 'ForInStatement',
				FunctionDeclaration: 'FunctionDeclaration',
				FunctionExpression: 'FunctionExpression',
				Identifier: 'Identifier',
				IfStatement: 'IfStatement',
				ImportDeclaration: 'ImportDeclaration',
				ImportDefaultSpecifier: 'ImportDefaultSpecifier',
				ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
				ImportSpecifier: 'ImportSpecifier',
				Literal: 'Literal',
				LabeledStatement: 'LabeledStatement',
				LogicalExpression: 'LogicalExpression',
				MemberExpression: 'MemberExpression',
				MetaProperty: 'MetaProperty',
				MethodDefinition: 'MethodDefinition',
				NewExpression: 'NewExpression',
				ObjectExpression: 'ObjectExpression',
				ObjectPattern: 'ObjectPattern',
				Program: 'Program',
				Property: 'Property',
				RestElement: 'RestElement',
				ReturnStatement: 'ReturnStatement',
				SequenceExpression: 'SequenceExpression',
				SpreadElement: 'SpreadElement',
				Super: 'Super',
				SwitchCase: 'SwitchCase',
				SwitchStatement: 'SwitchStatement',
				TaggedTemplateExpression: 'TaggedTemplateExpression',
				TemplateElement: 'TemplateElement',
				TemplateLiteral: 'TemplateLiteral',
				ThisExpression: 'ThisExpression',
				ThrowStatement: 'ThrowStatement',
				TryStatement: 'TryStatement',
				UnaryExpression: 'UnaryExpression',
				UpdateExpression: 'UpdateExpression',
				VariableDeclaration: 'VariableDeclaration',
				VariableDeclarator: 'VariableDeclarator',
				WhileStatement: 'WhileStatement',
				WithStatement: 'WithStatement',
				YieldExpression: 'YieldExpression'
			};

			/***/
		},
		/* 3 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var assert_1 = __webpack_require__(4);
			var messages_1 = __webpack_require__(5);
			var error_handler_1 = __webpack_require__(6);
			var token_1 = __webpack_require__(7);
			var scanner_1 = __webpack_require__(8);
			var syntax_1 = __webpack_require__(2);
			var Node = __webpack_require__(10);
			var ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
			var Parser = function () {
				function Parser(code, options, delegate) {
					if (options === void 0) {
						options = {};
					}
					this.config = {
						range: typeof options.range === 'boolean' && options.range,
						loc: typeof options.loc === 'boolean' && options.loc,
						source: null,
						tokens: typeof options.tokens === 'boolean' && options.tokens,
						comment: typeof options.comment === 'boolean' && options.comment,
						tolerant: typeof options.tolerant === 'boolean' && options.tolerant
					};
					if (this.config.loc && options.source && options.source !== null) {
						this.config.source = String(options.source);
					}
					this.delegate = delegate;
					this.errorHandler = new error_handler_1.ErrorHandler();
					this.errorHandler.tolerant = this.config.tolerant;
					this.scanner = new scanner_1.Scanner(code, this.errorHandler);
					this.scanner.trackComment = this.config.comment;
					this.operatorPrecedence = {
						')': 0,
						';': 0,
						',': 0,
						'=': 0,
						']': 0,
						'||': 1,
						'&&': 2,
						'|': 3,
						'^': 4,
						'&': 5,
						'==': 6,
						'!=': 6,
						'===': 6,
						'!==': 6,
						'<': 7,
						'>': 7,
						'<=': 7,
						'>=': 7,
						'<<': 8,
						'>>': 8,
						'>>>': 8,
						'+': 9,
						'-': 9,
						'*': 11,
						'/': 11,
						'%': 11
					};
					this.sourceType = options && options.sourceType === 'module' ? 'module' : 'script';
					this.lookahead = null;
					this.hasLineTerminator = false;
					this.context = {
						allowIn: true,
						allowYield: true,
						firstCoverInitializedNameError: null,
						isAssignmentTarget: false,
						isBindingElement: false,
						inFunctionBody: false,
						inIteration: false,
						inSwitch: false,
						labelSet: {},
						strict: this.sourceType === 'module'
					};
					this.tokens = [];
					this.startMarker = {
						index: 0,
						lineNumber: this.scanner.lineNumber,
						lineStart: 0
					};
					this.lastMarker = {
						index: 0,
						lineNumber: this.scanner.lineNumber,
						lineStart: 0
					};
					this.nextToken();
					this.lastMarker = {
						index: this.scanner.index,
						lineNumber: this.scanner.lineNumber,
						lineStart: this.scanner.lineStart
					};
				}
				Parser.prototype.throwError = function (messageFormat) {
					var values = [];
					for (var _i = 1; _i < arguments.length; _i++) {
						values[_i - 1] = arguments[_i];
					}
					var args = Array.prototype.slice.call(arguments, 1);
					var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
						assert_1.assert(idx < args.length, 'Message reference must be in range');
						return args[idx];
					});
					var index = this.lastMarker.index;
					var line = this.lastMarker.lineNumber;
					var column = this.lastMarker.index - this.lastMarker.lineStart + 1;
					throw this.errorHandler.createError(index, line, column, msg);
				};
				Parser.prototype.tolerateError = function (messageFormat) {
					var values = [];
					for (var _i = 1; _i < arguments.length; _i++) {
						values[_i - 1] = arguments[_i];
					}
					var args = Array.prototype.slice.call(arguments, 1);
					var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
						assert_1.assert(idx < args.length, 'Message reference must be in range');
						return args[idx];
					});
					var index = this.lastMarker.index;
					var line = this.scanner.lineNumber;
					var column = this.lastMarker.index - this.lastMarker.lineStart + 1;
					this.errorHandler.tolerateError(index, line, column, msg);
				};
				// Throw an exception because of the token.
				Parser.prototype.unexpectedTokenError = function (token, message) {
					var msg = message || messages_1.Messages.UnexpectedToken;
					var value;
					if (token) {
						if (!message) {
							msg = token.type === token_1.Token.EOF ? messages_1.Messages.UnexpectedEOS : token.type === token_1.Token.Identifier ? messages_1.Messages.UnexpectedIdentifier : token.type === token_1.Token.NumericLiteral ? messages_1.Messages.UnexpectedNumber : token.type === token_1.Token.StringLiteral ? messages_1.Messages.UnexpectedString : token.type === token_1.Token.Template ? messages_1.Messages.UnexpectedTemplate : messages_1.Messages.UnexpectedToken;
							if (token.type === token_1.Token.Keyword) {
								if (this.scanner.isFutureReservedWord(token.value)) {
									msg = messages_1.Messages.UnexpectedReserved;
								} else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
									msg = messages_1.Messages.StrictReservedWord;
								}
							}
						}
						value = token.type === token_1.Token.Template ? token.value.raw : token.value;
					} else {
						value = 'ILLEGAL';
					}
					msg = msg.replace('%0', value);
					if (token && typeof token.lineNumber === 'number') {
						var index = token.start;
						var line = token.lineNumber;
						var column = token.start - this.lastMarker.lineStart + 1;
						return this.errorHandler.createError(index, line, column, msg);
					} else {
						var index = this.lastMarker.index;
						var line = this.lastMarker.lineNumber;
						var column = index - this.lastMarker.lineStart + 1;
						return this.errorHandler.createError(index, line, column, msg);
					}
				};
				Parser.prototype.throwUnexpectedToken = function (token, message) {
					throw this.unexpectedTokenError(token, message);
				};
				Parser.prototype.tolerateUnexpectedToken = function (token, message) {
					this.errorHandler.tolerate(this.unexpectedTokenError(token, message));
				};
				Parser.prototype.collectComments = function () {
					if (!this.config.comment) {
						this.scanner.scanComments();
					} else {
						var comments = this.scanner.scanComments();
						if (comments.length > 0 && this.delegate) {
							for (var i = 0; i < comments.length; ++i) {
								var e = comments[i];
								var node = void 0;
								node = {
									type: e.multiLine ? 'BlockComment' : 'LineComment',
									value: this.scanner.source.slice(e.slice[0], e.slice[1])
								};
								if (this.config.range) {
									node.range = e.range;
								}
								if (this.config.loc) {
									node.loc = e.loc;
								}
								var metadata = {
									start: {
										line: e.loc.start.line,
										column: e.loc.start.column,
										offset: e.range[0]
									},
									end: {
										line: e.loc.end.line,
										column: e.loc.end.column,
										offset: e.range[1]
									}
								};
								this.delegate(node, metadata);
							}
						}
					}
				};
				// From internal representation to an external structure
				Parser.prototype.getTokenRaw = function (token) {
					return this.scanner.source.slice(token.start, token.end);
				};
				Parser.prototype.convertToken = function (token) {
					var t;
					t = {
						type: token_1.TokenName[token.type],
						value: this.getTokenRaw(token)
					};
					if (this.config.range) {
						t.range = [token.start, token.end];
					}
					if (this.config.loc) {
						t.loc = {
							start: {
								line: this.startMarker.lineNumber,
								column: this.startMarker.index - this.startMarker.lineStart
							},
							end: {
								line: this.scanner.lineNumber,
								column: this.scanner.index - this.scanner.lineStart
							}
						};
					}
					if (token.regex) {
						t.regex = token.regex;
					}
					return t;
				};
				Parser.prototype.nextToken = function () {
					var token = this.lookahead;
					this.lastMarker.index = this.scanner.index;
					this.lastMarker.lineNumber = this.scanner.lineNumber;
					this.lastMarker.lineStart = this.scanner.lineStart;
					this.collectComments();
					this.startMarker.index = this.scanner.index;
					this.startMarker.lineNumber = this.scanner.lineNumber;
					this.startMarker.lineStart = this.scanner.lineStart;
					var next;
					next = this.scanner.lex();
					this.hasLineTerminator = token && next ? token.lineNumber !== next.lineNumber : false;
					if (next && this.context.strict && next.type === token_1.Token.Identifier) {
						if (this.scanner.isStrictModeReservedWord(next.value)) {
							next.type = token_1.Token.Keyword;
						}
					}
					this.lookahead = next;
					if (this.config.tokens && next.type !== token_1.Token.EOF) {
						this.tokens.push(this.convertToken(next));
					}
					return token;
				};
				Parser.prototype.nextRegexToken = function () {
					this.collectComments();
					var token = this.scanner.scanRegExp();
					if (this.config.tokens) {
						// Pop the previous token, '/' or '/='
						// This is added from the lookahead token.
						this.tokens.pop();
						this.tokens.push(this.convertToken(token));
					}
					// Prime the next lookahead.
					this.lookahead = token;
					this.nextToken();
					return token;
				};
				Parser.prototype.createNode = function () {
					return {
						index: this.startMarker.index,
						line: this.startMarker.lineNumber,
						column: this.startMarker.index - this.startMarker.lineStart
					};
				};
				Parser.prototype.startNode = function (token) {
					return {
						index: token.start,
						line: token.lineNumber,
						column: token.start - token.lineStart
					};
				};
				Parser.prototype.finalize = function (meta, node) {
					if (this.config.range) {
						node.range = [meta.index, this.lastMarker.index];
					}
					if (this.config.loc) {
						node.loc = {
							start: {
								line: meta.line,
								column: meta.column
							},
							end: {
								line: this.lastMarker.lineNumber,
								column: this.lastMarker.index - this.lastMarker.lineStart
							}
						};
						if (this.config.source) {
							node.loc.source = this.config.source;
						}
					}
					if (this.delegate) {
						var metadata = {
							start: {
								line: meta.line,
								column: meta.column,
								offset: meta.index
							},
							end: {
								line: this.lastMarker.lineNumber,
								column: this.lastMarker.index - this.lastMarker.lineStart,
								offset: this.lastMarker.index
							}
						};
						this.delegate(node, metadata);
					}
					return node;
				};
				// Expect the next token to match the specified punctuator.
				// If not, an exception will be thrown.
				Parser.prototype.expect = function (value) {
					var token = this.nextToken();
					if (token.type !== token_1.Token.Punctuator || token.value !== value) {
						this.throwUnexpectedToken(token);
					}
				};
				// Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
				Parser.prototype.expectCommaSeparator = function () {
					if (this.config.tolerant) {
						var token = this.lookahead;
						if (token.type === token_1.Token.Punctuator && token.value === ',') {
							this.nextToken();
						} else if (token.type === token_1.Token.Punctuator && token.value === ';') {
							this.nextToken();
							this.tolerateUnexpectedToken(token);
						} else {
							this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
						}
					} else {
						this.expect(',');
					}
				};
				// Expect the next token to match the specified keyword.
				// If not, an exception will be thrown.
				Parser.prototype.expectKeyword = function (keyword) {
					var token = this.nextToken();
					if (token.type !== token_1.Token.Keyword || token.value !== keyword) {
						this.throwUnexpectedToken(token);
					}
				};
				// Return true if the next token matches the specified punctuator.
				Parser.prototype.match = function (value) {
					return this.lookahead.type === token_1.Token.Punctuator && this.lookahead.value === value;
				};
				// Return true if the next token matches the specified keyword
				Parser.prototype.matchKeyword = function (keyword) {
					return this.lookahead.type === token_1.Token.Keyword && this.lookahead.value === keyword;
				};
				// Return true if the next token matches the specified contextual keyword
				// (where an identifier is sometimes a keyword depending on the context)
				Parser.prototype.matchContextualKeyword = function (keyword) {
					return this.lookahead.type === token_1.Token.Identifier && this.lookahead.value === keyword;
				};
				// Return true if the next token is an assignment operator
				Parser.prototype.matchAssign = function () {
					if (this.lookahead.type !== token_1.Token.Punctuator) {
						return false;
					}
					var op = this.lookahead.value;
					return op === '=' || op === '*=' || op === '**=' || op === '/=' || op === '%=' || op === '+=' || op === '-=' || op === '<<=' || op === '>>=' || op === '>>>=' || op === '&=' || op === '^=' || op === '|=';
				};
				// Cover grammar support.
				//
				// When an assignment expression position starts with an left parenthesis, the determination of the type
				// of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
				// or the first comma. This situation also defers the determination of all the expressions nested in the pair.
				//
				// There are three productions that can be parsed in a parentheses pair that needs to be determined
				// after the outermost pair is closed. They are:
				//
				//   1. AssignmentExpression
				//   2. BindingElements
				//   3. AssignmentTargets
				//
				// In order to avoid exponential backtracking, we use two flags to denote if the production can be
				// binding element or assignment target.
				//
				// The three productions have the relationship:
				//
				//   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
				//
				// with a single exception that CoverInitializedName when used directly in an Expression, generates
				// an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
				// first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
				//
				// isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
				// effect the current flags. This means the production the parser parses is only used as an expression. Therefore
				// the CoverInitializedName check is conducted.
				//
				// inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
				// the flags outside of the parser. This means the production the parser parses is used as a part of a potential
				// pattern. The CoverInitializedName check is deferred.
				Parser.prototype.isolateCoverGrammar = function (parseFunction) {
					var previousIsBindingElement = this.context.isBindingElement;
					var previousIsAssignmentTarget = this.context.isAssignmentTarget;
					var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
					this.context.isBindingElement = true;
					this.context.isAssignmentTarget = true;
					this.context.firstCoverInitializedNameError = null;
					var result = parseFunction.call(this);
					if (this.context.firstCoverInitializedNameError !== null) {
						this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
					}
					this.context.isBindingElement = previousIsBindingElement;
					this.context.isAssignmentTarget = previousIsAssignmentTarget;
					this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError;
					return result;
				};
				Parser.prototype.inheritCoverGrammar = function (parseFunction) {
					var previousIsBindingElement = this.context.isBindingElement;
					var previousIsAssignmentTarget = this.context.isAssignmentTarget;
					var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
					this.context.isBindingElement = true;
					this.context.isAssignmentTarget = true;
					this.context.firstCoverInitializedNameError = null;
					var result = parseFunction.call(this);
					this.context.isBindingElement = this.context.isBindingElement && previousIsBindingElement;
					this.context.isAssignmentTarget = this.context.isAssignmentTarget && previousIsAssignmentTarget;
					this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.context.firstCoverInitializedNameError;
					return result;
				};
				Parser.prototype.consumeSemicolon = function () {
					if (this.match(';')) {
						this.nextToken();
					} else if (!this.hasLineTerminator) {
						if (this.lookahead.type !== token_1.Token.EOF && !this.match('}')) {
							this.throwUnexpectedToken(this.lookahead);
						}
						this.lastMarker.index = this.startMarker.index;
						this.lastMarker.lineNumber = this.startMarker.lineNumber;
						this.lastMarker.lineStart = this.startMarker.lineStart;
					}
				};
				// ECMA-262 12.2 Primary Expressions
				Parser.prototype.parsePrimaryExpression = function () {
					var node = this.createNode();
					var expr;
					var value, token, raw;
					switch (this.lookahead.type) {
						case token_1.Token.Identifier:
							if (this.sourceType === 'module' && this.lookahead.value === 'await') {
								this.tolerateUnexpectedToken(this.lookahead);
							}
							expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
							break;
						case token_1.Token.NumericLiteral:
						case token_1.Token.StringLiteral:
							if (this.context.strict && this.lookahead.octal) {
								this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.StrictOctalLiteral);
							}
							this.context.isAssignmentTarget = false;
							this.context.isBindingElement = false;
							token = this.nextToken();
							raw = this.getTokenRaw(token);
							expr = this.finalize(node, new Node.Literal(token.value, raw));
							break;
						case token_1.Token.BooleanLiteral:
							this.context.isAssignmentTarget = false;
							this.context.isBindingElement = false;
							token = this.nextToken();
							token.value = token.value === 'true';
							raw = this.getTokenRaw(token);
							expr = this.finalize(node, new Node.Literal(token.value, raw));
							break;
						case token_1.Token.NullLiteral:
							this.context.isAssignmentTarget = false;
							this.context.isBindingElement = false;
							token = this.nextToken();
							token.value = null;
							raw = this.getTokenRaw(token);
							expr = this.finalize(node, new Node.Literal(token.value, raw));
							break;
						case token_1.Token.Template:
							expr = this.parseTemplateLiteral();
							break;
						case token_1.Token.Punctuator:
							value = this.lookahead.value;
							switch (value) {
								case '(':
									this.context.isBindingElement = false;
									expr = this.inheritCoverGrammar(this.parseGroupExpression);
									break;
								case '[':
									expr = this.inheritCoverGrammar(this.parseArrayInitializer);
									break;
								case '{':
									expr = this.inheritCoverGrammar(this.parseObjectInitializer);
									break;
								case '/':
								case '/=':
									this.context.isAssignmentTarget = false;
									this.context.isBindingElement = false;
									this.scanner.index = this.startMarker.index;
									token = this.nextRegexToken();
									raw = this.getTokenRaw(token);
									expr = this.finalize(node, new Node.RegexLiteral(token.value, raw, token.regex));
									break;
								default:
									this.throwUnexpectedToken(this.nextToken());
							}
							break;
						case token_1.Token.Keyword:
							if (!this.context.strict && this.context.allowYield && this.matchKeyword('yield')) {
								expr = this.parseIdentifierName();
							} else if (!this.context.strict && this.matchKeyword('let')) {
								expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
							} else {
								this.context.isAssignmentTarget = false;
								this.context.isBindingElement = false;
								if (this.matchKeyword('function')) {
									expr = this.parseFunctionExpression();
								} else if (this.matchKeyword('this')) {
									this.nextToken();
									expr = this.finalize(node, new Node.ThisExpression());
								} else if (this.matchKeyword('class')) {
									expr = this.parseClassExpression();
								} else {
									this.throwUnexpectedToken(this.nextToken());
								}
							}
							break;
						default:
							this.throwUnexpectedToken(this.nextToken());
					}
					return expr;
				};
				// ECMA-262 12.2.5 Array Initializer
				Parser.prototype.parseSpreadElement = function () {
					var node = this.createNode();
					this.expect('...');
					var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
					return this.finalize(node, new Node.SpreadElement(arg));
				};
				Parser.prototype.parseArrayInitializer = function () {
					var node = this.createNode();
					var elements = [];
					this.expect('[');
					while (!this.match(']')) {
						if (this.match(',')) {
							this.nextToken();
							elements.push(null);
						} else if (this.match('...')) {
							var element = this.parseSpreadElement();
							if (!this.match(']')) {
								this.context.isAssignmentTarget = false;
								this.context.isBindingElement = false;
								this.expect(',');
							}
							elements.push(element);
						} else {
							elements.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
							if (!this.match(']')) {
								this.expect(',');
							}
						}
					}
					this.expect(']');
					return this.finalize(node, new Node.ArrayExpression(elements));
				};
				// ECMA-262 12.2.6 Object Initializer
				Parser.prototype.parsePropertyMethod = function (params) {
					this.context.isAssignmentTarget = false;
					this.context.isBindingElement = false;
					var previousStrict = this.context.strict;
					var body = this.isolateCoverGrammar(this.parseFunctionSourceElements);
					if (this.context.strict && params.firstRestricted) {
						this.tolerateUnexpectedToken(params.firstRestricted, params.message);
					}
					if (this.context.strict && params.stricted) {
						this.tolerateUnexpectedToken(params.stricted, params.message);
					}
					this.context.strict = previousStrict;
					return body;
				};
				Parser.prototype.parsePropertyMethodFunction = function () {
					var isGenerator = false;
					var node = this.createNode();
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = false;
					var params = this.parseFormalParameters();
					var method = this.parsePropertyMethod(params);
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
				};
				Parser.prototype.parseObjectPropertyKey = function () {
					var node = this.createNode();
					var token = this.nextToken();
					var key = null;
					switch (token.type) {
						case token_1.Token.StringLiteral:
						case token_1.Token.NumericLiteral:
							if (this.context.strict && token.octal) {
								this.tolerateUnexpectedToken(token, messages_1.Messages.StrictOctalLiteral);
							}
							var raw = this.getTokenRaw(token);
							key = this.finalize(node, new Node.Literal(token.value, raw));
							break;
						case token_1.Token.Identifier:
						case token_1.Token.BooleanLiteral:
						case token_1.Token.NullLiteral:
						case token_1.Token.Keyword:
							key = this.finalize(node, new Node.Identifier(token.value));
							break;
						case token_1.Token.Punctuator:
							if (token.value === '[') {
								key = this.isolateCoverGrammar(this.parseAssignmentExpression);
								this.expect(']');
							} else {
								this.throwUnexpectedToken(token);
							}
							break;
						default:
							this.throwUnexpectedToken(token);
					}
					return key;
				};
				Parser.prototype.isPropertyKey = function (key, value) {
					return key.type === syntax_1.Syntax.Identifier && key.name === value || key.type === syntax_1.Syntax.Literal && key.value === value;
				};
				Parser.prototype.parseObjectProperty = function (hasProto) {
					var node = this.createNode();
					var token = this.lookahead;
					var kind;
					var key;
					var value;
					var computed = false;
					var method = false;
					var shorthand = false;
					if (token.type === token_1.Token.Identifier) {
						this.nextToken();
						key = this.finalize(node, new Node.Identifier(token.value));
					} else if (this.match('*')) {
						this.nextToken();
					} else {
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
					}
					var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
					if (token.type === token_1.Token.Identifier && token.value === 'get' && lookaheadPropertyKey) {
						kind = 'get';
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						this.context.allowYield = false;
						value = this.parseGetterMethod();
					} else if (token.type === token_1.Token.Identifier && token.value === 'set' && lookaheadPropertyKey) {
						kind = 'set';
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						value = this.parseSetterMethod();
					} else if (token.type === token_1.Token.Punctuator && token.value === '*' && lookaheadPropertyKey) {
						kind = 'init';
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						value = this.parseGeneratorMethod();
						method = true;
					} else {
						if (!key) {
							this.throwUnexpectedToken(this.lookahead);
						}
						kind = 'init';
						if (this.match(':')) {
							if (!computed && this.isPropertyKey(key, '__proto__')) {
								if (hasProto.value) {
									this.tolerateError(messages_1.Messages.DuplicateProtoProperty);
								}
								hasProto.value = true;
							}
							this.nextToken();
							value = this.inheritCoverGrammar(this.parseAssignmentExpression);
						} else if (this.match('(')) {
							value = this.parsePropertyMethodFunction();
							method = true;
						} else if (token.type === token_1.Token.Identifier) {
							var id = this.finalize(node, new Node.Identifier(token.value));
							if (this.match('=')) {
								this.context.firstCoverInitializedNameError = this.lookahead;
								this.nextToken();
								shorthand = true;
								var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
								value = this.finalize(node, new Node.AssignmentPattern(id, init));
							} else {
								shorthand = true;
								value = id;
							}
						} else {
							this.throwUnexpectedToken(this.nextToken());
						}
					}
					return this.finalize(node, new Node.Property(kind, key, computed, value, method, shorthand));
				};
				Parser.prototype.parseObjectInitializer = function () {
					var node = this.createNode();
					this.expect('{');
					var properties = [];
					var hasProto = { value: false };
					while (!this.match('}')) {
						properties.push(this.parseObjectProperty(hasProto));
						if (!this.match('}')) {
							this.expectCommaSeparator();
						}
					}
					this.expect('}');
					return this.finalize(node, new Node.ObjectExpression(properties));
				};
				// ECMA-262 12.2.9 Template Literals
				Parser.prototype.parseTemplateHead = function () {
					assert_1.assert(this.lookahead.head, 'Template literal must start with a template head');
					var node = this.createNode();
					var token = this.nextToken();
					var value = {
						raw: token.value.raw,
						cooked: token.value.cooked
					};
					return this.finalize(node, new Node.TemplateElement(value, token.tail));
				};
				Parser.prototype.parseTemplateElement = function () {
					if (this.lookahead.type !== token_1.Token.Template) {
						this.throwUnexpectedToken();
					}
					var node = this.createNode();
					var token = this.nextToken();
					var value = {
						raw: token.value.raw,
						cooked: token.value.cooked
					};
					return this.finalize(node, new Node.TemplateElement(value, token.tail));
				};
				Parser.prototype.parseTemplateLiteral = function () {
					var node = this.createNode();
					var expressions = [];
					var quasis = [];
					var quasi = this.parseTemplateHead();
					quasis.push(quasi);
					while (!quasi.tail) {
						expressions.push(this.parseExpression());
						quasi = this.parseTemplateElement();
						quasis.push(quasi);
					}
					return this.finalize(node, new Node.TemplateLiteral(quasis, expressions));
				};
				// ECMA-262 12.2.10 The Grouping Operator
				Parser.prototype.reinterpretExpressionAsPattern = function (expr) {
					switch (expr.type) {
						case syntax_1.Syntax.Identifier:
						case syntax_1.Syntax.MemberExpression:
						case syntax_1.Syntax.RestElement:
						case syntax_1.Syntax.AssignmentPattern:
							break;
						case syntax_1.Syntax.SpreadElement:
							expr.type = syntax_1.Syntax.RestElement;
							this.reinterpretExpressionAsPattern(expr.argument);
							break;
						case syntax_1.Syntax.ArrayExpression:
							expr.type = syntax_1.Syntax.ArrayPattern;
							for (var i = 0; i < expr.elements.length; i++) {
								if (expr.elements[i] !== null) {
									this.reinterpretExpressionAsPattern(expr.elements[i]);
								}
							}
							break;
						case syntax_1.Syntax.ObjectExpression:
							expr.type = syntax_1.Syntax.ObjectPattern;
							for (var i = 0; i < expr.properties.length; i++) {
								this.reinterpretExpressionAsPattern(expr.properties[i].value);
							}
							break;
						case syntax_1.Syntax.AssignmentExpression:
							expr.type = syntax_1.Syntax.AssignmentPattern;
							delete expr.operator;
							this.reinterpretExpressionAsPattern(expr.left);
							break;
						default:
							// Allow other node type for tolerant parsing.
							break;
					}
				};
				Parser.prototype.parseGroupExpression = function () {
					var expr;
					this.expect('(');
					if (this.match(')')) {
						this.nextToken();
						if (!this.match('=>')) {
							this.expect('=>');
						}
						expr = {
							type: ArrowParameterPlaceHolder,
							params: []
						};
					} else {
						var startToken = this.lookahead;
						var params = [];
						if (this.match('...')) {
							expr = this.parseRestElement(params);
							this.expect(')');
							if (!this.match('=>')) {
								this.expect('=>');
							}
							expr = {
								type: ArrowParameterPlaceHolder,
								params: [expr]
							};
						} else {
							var arrow = false;
							this.context.isBindingElement = true;
							expr = this.inheritCoverGrammar(this.parseAssignmentExpression);
							if (this.match(',')) {
								var expressions = [];
								this.context.isAssignmentTarget = false;
								expressions.push(expr);
								while (this.startMarker.index < this.scanner.length) {
									if (!this.match(',')) {
										break;
									}
									this.nextToken();
									if (this.match('...')) {
										if (!this.context.isBindingElement) {
											this.throwUnexpectedToken(this.lookahead);
										}
										expressions.push(this.parseRestElement(params));
										this.expect(')');
										if (!this.match('=>')) {
											this.expect('=>');
										}
										this.context.isBindingElement = false;
										for (var i = 0; i < expressions.length; i++) {
											this.reinterpretExpressionAsPattern(expressions[i]);
										}
										arrow = true;
										expr = {
											type: ArrowParameterPlaceHolder,
											params: expressions
										};
									} else {
										expressions.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
									}
									if (arrow) {
										break;
									}
								}
								if (!arrow) {
									expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
								}
							}
							if (!arrow) {
								this.expect(')');
								if (this.match('=>')) {
									if (expr.type === syntax_1.Syntax.Identifier && expr.name === 'yield') {
										arrow = true;
										expr = {
											type: ArrowParameterPlaceHolder,
											params: [expr]
										};
									}
									if (!arrow) {
										if (!this.context.isBindingElement) {
											this.throwUnexpectedToken(this.lookahead);
										}
										if (expr.type === syntax_1.Syntax.SequenceExpression) {
											for (var i = 0; i < expr.expressions.length; i++) {
												this.reinterpretExpressionAsPattern(expr.expressions[i]);
											}
										} else {
											this.reinterpretExpressionAsPattern(expr);
										}
										var params_1 = expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr];
										expr = {
											type: ArrowParameterPlaceHolder,
											params: params_1
										};
									}
								}
								this.context.isBindingElement = false;
							}
						}
					}
					return expr;
				};
				// ECMA-262 12.3 Left-Hand-Side Expressions
				Parser.prototype.parseArguments = function () {
					this.expect('(');
					var args = [];
					if (!this.match(')')) {
						while (true) {
							var expr = this.match('...') ? this.parseSpreadElement() : this.isolateCoverGrammar(this.parseAssignmentExpression);
							args.push(expr);
							if (this.match(')')) {
								break;
							}
							this.expectCommaSeparator();
						}
					}
					this.expect(')');
					return args;
				};
				Parser.prototype.isIdentifierName = function (token) {
					return token.type === token_1.Token.Identifier || token.type === token_1.Token.Keyword || token.type === token_1.Token.BooleanLiteral || token.type === token_1.Token.NullLiteral;
				};
				Parser.prototype.parseIdentifierName = function () {
					var node = this.createNode();
					var token = this.nextToken();
					if (!this.isIdentifierName(token)) {
						this.throwUnexpectedToken(token);
					}
					return this.finalize(node, new Node.Identifier(token.value));
				};
				Parser.prototype.parseNewExpression = function () {
					var node = this.createNode();
					var id = this.parseIdentifierName();
					assert_1.assert(id.name === 'new', 'New expression must start with `new`');
					var expr;
					if (this.match('.')) {
						this.nextToken();
						if (this.lookahead.type === token_1.Token.Identifier && this.context.inFunctionBody && this.lookahead.value === 'target') {
							var property = this.parseIdentifierName();
							expr = new Node.MetaProperty(id, property);
						} else {
							this.throwUnexpectedToken(this.lookahead);
						}
					} else {
						var callee = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
						var args = this.match('(') ? this.parseArguments() : [];
						expr = new Node.NewExpression(callee, args);
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
					}
					return this.finalize(node, expr);
				};
				Parser.prototype.parseLeftHandSideExpressionAllowCall = function () {
					var startToken = this.lookahead;
					var previousAllowIn = this.context.allowIn;
					this.context.allowIn = true;
					var expr;
					if (this.matchKeyword('super') && this.context.inFunctionBody) {
						expr = this.createNode();
						this.nextToken();
						expr = this.finalize(expr, new Node.Super());
						if (!this.match('(') && !this.match('.') && !this.match('[')) {
							this.throwUnexpectedToken(this.lookahead);
						}
					} else {
						expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
					}
					while (true) {
						if (this.match('.')) {
							this.context.isBindingElement = false;
							this.context.isAssignmentTarget = true;
							this.expect('.');
							var property = this.parseIdentifierName();
							expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
						} else if (this.match('(')) {
							this.context.isBindingElement = false;
							this.context.isAssignmentTarget = false;
							var args = this.parseArguments();
							expr = this.finalize(this.startNode(startToken), new Node.CallExpression(expr, args));
						} else if (this.match('[')) {
							this.context.isBindingElement = false;
							this.context.isAssignmentTarget = true;
							this.expect('[');
							var property = this.isolateCoverGrammar(this.parseExpression);
							this.expect(']');
							expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
						} else if (this.lookahead.type === token_1.Token.Template && this.lookahead.head) {
							var quasi = this.parseTemplateLiteral();
							expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
						} else {
							break;
						}
					}
					this.context.allowIn = previousAllowIn;
					return expr;
				};
				Parser.prototype.parseSuper = function () {
					var node = this.createNode();
					this.expectKeyword('super');
					if (!this.match('[') && !this.match('.')) {
						this.throwUnexpectedToken(this.lookahead);
					}
					return this.finalize(node, new Node.Super());
				};
				Parser.prototype.parseLeftHandSideExpression = function () {
					assert_1.assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
					var node = this.startNode(this.lookahead);
					var expr = this.matchKeyword('super') && this.context.inFunctionBody ? this.parseSuper() : this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
					while (true) {
						if (this.match('[')) {
							this.context.isBindingElement = false;
							this.context.isAssignmentTarget = true;
							this.expect('[');
							var property = this.isolateCoverGrammar(this.parseExpression);
							this.expect(']');
							expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
						} else if (this.match('.')) {
							this.context.isBindingElement = false;
							this.context.isAssignmentTarget = true;
							this.expect('.');
							var property = this.parseIdentifierName();
							expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
						} else if (this.lookahead.type === token_1.Token.Template && this.lookahead.head) {
							var quasi = this.parseTemplateLiteral();
							expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
						} else {
							break;
						}
					}
					return expr;
				};
				// ECMA-262 12.4 Update Expressions
				Parser.prototype.parseUpdateExpression = function () {
					var expr;
					var startToken = this.lookahead;
					if (this.match('++') || this.match('--')) {
						var node = this.startNode(startToken);
						var token = this.nextToken();
						expr = this.inheritCoverGrammar(this.parseUnaryExpression);
						if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
							this.tolerateError(messages_1.Messages.StrictLHSPrefix);
						}
						if (!this.context.isAssignmentTarget) {
							this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
						}
						var prefix = true;
						expr = this.finalize(node, new Node.UpdateExpression(token.value, expr, prefix));
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
					} else {
						expr = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
						if (!this.hasLineTerminator && this.lookahead.type === token_1.Token.Punctuator) {
							if (this.match('++') || this.match('--')) {
								if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
									this.tolerateError(messages_1.Messages.StrictLHSPostfix);
								}
								if (!this.context.isAssignmentTarget) {
									this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
								}
								this.context.isAssignmentTarget = false;
								this.context.isBindingElement = false;
								var operator = this.nextToken().value;
								var prefix = false;
								expr = this.finalize(this.startNode(startToken), new Node.UpdateExpression(operator, expr, prefix));
							}
						}
					}
					return expr;
				};
				// ECMA-262 12.5 Unary Operators
				Parser.prototype.parseUnaryExpression = function () {
					var expr;
					if (this.match('+') || this.match('-') || this.match('~') || this.match('!') || this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
						var node = this.startNode(this.lookahead);
						var token = this.nextToken();
						expr = this.inheritCoverGrammar(this.parseUnaryExpression);
						expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
						if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
							this.tolerateError(messages_1.Messages.StrictDelete);
						}
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
					} else {
						expr = this.parseUpdateExpression();
					}
					return expr;
				};
				Parser.prototype.parseExponentiationExpression = function () {
					var startToken = this.lookahead;
					var expr = this.inheritCoverGrammar(this.parseUnaryExpression);
					if (expr.type !== syntax_1.Syntax.UnaryExpression && this.match('**')) {
						this.nextToken();
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
						var left = expr;
						var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
						expr = this.finalize(this.startNode(startToken), new Node.BinaryExpression('**', left, right));
					}
					return expr;
				};
				// ECMA-262 12.6 Exponentiation Operators
				// ECMA-262 12.7 Multiplicative Operators
				// ECMA-262 12.8 Additive Operators
				// ECMA-262 12.9 Bitwise Shift Operators
				// ECMA-262 12.10 Relational Operators
				// ECMA-262 12.11 Equality Operators
				// ECMA-262 12.12 Binary Bitwise Operators
				// ECMA-262 12.13 Binary Logical Operators
				Parser.prototype.binaryPrecedence = function (token) {
					var op = token.value;
					var precedence;
					if (token.type === token_1.Token.Punctuator) {
						precedence = this.operatorPrecedence[op] || 0;
					} else if (token.type === token_1.Token.Keyword) {
						precedence = op === 'instanceof' || this.context.allowIn && op === 'in' ? 7 : 0;
					} else {
						precedence = 0;
					}
					return precedence;
				};
				Parser.prototype.parseBinaryExpression = function () {
					var startToken = this.lookahead;
					var expr = this.inheritCoverGrammar(this.parseExponentiationExpression);
					var token = this.lookahead;
					var prec = this.binaryPrecedence(token);
					if (prec > 0) {
						this.nextToken();
						token.prec = prec;
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
						var markers = [startToken, this.lookahead];
						var left = expr;
						var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
						var stack = [left, token, right];
						while (true) {
							prec = this.binaryPrecedence(this.lookahead);
							if (prec <= 0) {
								break;
							}
							// Reduce: make a binary expression from the three topmost entries.
							while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
								right = stack.pop();
								var operator = stack.pop().value;
								left = stack.pop();
								markers.pop();
								var node = this.startNode(markers[markers.length - 1]);
								stack.push(this.finalize(node, new Node.BinaryExpression(operator, left, right)));
							}
							// Shift.
							token = this.nextToken();
							token.prec = prec;
							stack.push(token);
							markers.push(this.lookahead);
							stack.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
						}
						// Final reduce to clean-up the stack.
						var i = stack.length - 1;
						expr = stack[i];
						markers.pop();
						while (i > 1) {
							var node = this.startNode(markers.pop());
							expr = this.finalize(node, new Node.BinaryExpression(stack[i - 1].value, stack[i - 2], expr));
							i -= 2;
						}
					}
					return expr;
				};
				// ECMA-262 12.14 Conditional Operator
				Parser.prototype.parseConditionalExpression = function () {
					var startToken = this.lookahead;
					var expr = this.inheritCoverGrammar(this.parseBinaryExpression);
					if (this.match('?')) {
						this.nextToken();
						var previousAllowIn = this.context.allowIn;
						this.context.allowIn = true;
						var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
						this.context.allowIn = previousAllowIn;
						this.expect(':');
						var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
						expr = this.finalize(this.startNode(startToken), new Node.ConditionalExpression(expr, consequent, alternate));
						this.context.isAssignmentTarget = false;
						this.context.isBindingElement = false;
					}
					return expr;
				};
				// ECMA-262 12.15 Assignment Operators
				Parser.prototype.checkPatternParam = function (options, param) {
					switch (param.type) {
						case syntax_1.Syntax.Identifier:
							this.validateParam(options, param, param.name);
							break;
						case syntax_1.Syntax.RestElement:
							this.checkPatternParam(options, param.argument);
							break;
						case syntax_1.Syntax.AssignmentPattern:
							this.checkPatternParam(options, param.left);
							break;
						case syntax_1.Syntax.ArrayPattern:
							for (var i = 0; i < param.elements.length; i++) {
								if (param.elements[i] !== null) {
									this.checkPatternParam(options, param.elements[i]);
								}
							}
							break;
						case syntax_1.Syntax.YieldExpression:
							break;
						default:
							assert_1.assert(param.type === syntax_1.Syntax.ObjectPattern, 'Invalid type');
							for (var i = 0; i < param.properties.length; i++) {
								this.checkPatternParam(options, param.properties[i].value);
							}
							break;
					}
				};
				Parser.prototype.reinterpretAsCoverFormalsList = function (expr) {
					var params = [expr];
					var options;
					switch (expr.type) {
						case syntax_1.Syntax.Identifier:
							break;
						case ArrowParameterPlaceHolder:
							params = expr.params;
							break;
						default:
							return null;
					}
					options = {
						paramSet: {}
					};
					for (var i = 0; i < params.length; ++i) {
						var param = params[i];
						if (param.type === syntax_1.Syntax.AssignmentPattern) {
							if (param.right.type === syntax_1.Syntax.YieldExpression) {
								if (param.right.argument) {
									this.throwUnexpectedToken(this.lookahead);
								}
								param.right.type = syntax_1.Syntax.Identifier;
								param.right.name = 'yield';
								delete param.right.argument;
								delete param.right.delegate;
							}
						}
						this.checkPatternParam(options, param);
						params[i] = param;
					}
					if (this.context.strict || !this.context.allowYield) {
						for (var i = 0; i < params.length; ++i) {
							var param = params[i];
							if (param.type === syntax_1.Syntax.YieldExpression) {
								this.throwUnexpectedToken(this.lookahead);
							}
						}
					}
					if (options.message === messages_1.Messages.StrictParamDupe) {
						var token = this.context.strict ? options.stricted : options.firstRestricted;
						this.throwUnexpectedToken(token, options.message);
					}
					return {
						params: params,
						stricted: options.stricted,
						firstRestricted: options.firstRestricted,
						message: options.message
					};
				};
				Parser.prototype.parseAssignmentExpression = function () {
					var expr;
					if (!this.context.allowYield && this.matchKeyword('yield')) {
						expr = this.parseYieldExpression();
					} else {
						var startToken = this.lookahead;
						var token = startToken;
						expr = this.parseConditionalExpression();
						if (expr.type === ArrowParameterPlaceHolder || this.match('=>')) {
							// ECMA-262 14.2 Arrow Function Definitions
							this.context.isAssignmentTarget = false;
							this.context.isBindingElement = false;
							var list = this.reinterpretAsCoverFormalsList(expr);
							if (list) {
								if (this.hasLineTerminator) {
									this.tolerateUnexpectedToken(this.lookahead);
								}
								this.context.firstCoverInitializedNameError = null;
								var previousStrict = this.context.strict;
								var previousAllowYield = this.context.allowYield;
								this.context.allowYield = true;
								var node = this.startNode(startToken);
								this.expect('=>');
								var body = this.match('{') ? this.parseFunctionSourceElements() : this.isolateCoverGrammar(this.parseAssignmentExpression);
								var expression = body.type !== syntax_1.Syntax.BlockStatement;
								if (this.context.strict && list.firstRestricted) {
									this.throwUnexpectedToken(list.firstRestricted, list.message);
								}
								if (this.context.strict && list.stricted) {
									this.tolerateUnexpectedToken(list.stricted, list.message);
								}
								expr = this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
								this.context.strict = previousStrict;
								this.context.allowYield = previousAllowYield;
							}
						} else {
							if (this.matchAssign()) {
								if (!this.context.isAssignmentTarget) {
									this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
								}
								if (this.context.strict && expr.type === syntax_1.Syntax.Identifier) {
									var id = expr;
									if (this.scanner.isRestrictedWord(id.name)) {
										this.tolerateUnexpectedToken(token, messages_1.Messages.StrictLHSAssignment);
									}
									if (this.scanner.isStrictModeReservedWord(id.name)) {
										this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
									}
								}
								if (!this.match('=')) {
									this.context.isAssignmentTarget = false;
									this.context.isBindingElement = false;
								} else {
									this.reinterpretExpressionAsPattern(expr);
								}
								token = this.nextToken();
								var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
								expr = this.finalize(this.startNode(startToken), new Node.AssignmentExpression(token.value, expr, right));
								this.context.firstCoverInitializedNameError = null;
							}
						}
					}
					return expr;
				};
				// ECMA-262 12.16 Comma Operator
				Parser.prototype.parseExpression = function () {
					var startToken = this.lookahead;
					var expr = this.isolateCoverGrammar(this.parseAssignmentExpression);
					if (this.match(',')) {
						var expressions = [];
						expressions.push(expr);
						while (this.startMarker.index < this.scanner.length) {
							if (!this.match(',')) {
								break;
							}
							this.nextToken();
							expressions.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
						}
						expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
					}
					return expr;
				};
				// ECMA-262 13.2 Block
				Parser.prototype.parseStatementListItem = function () {
					var statement = null;
					this.context.isAssignmentTarget = true;
					this.context.isBindingElement = true;
					if (this.lookahead.type === token_1.Token.Keyword) {
						switch (this.lookahead.value) {
							case 'export':
								if (this.sourceType !== 'module') {
									this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalExportDeclaration);
								}
								statement = this.parseExportDeclaration();
								break;
							case 'import':
								if (this.sourceType !== 'module') {
									this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalImportDeclaration);
								}
								statement = this.parseImportDeclaration();
								break;
							case 'const':
								statement = this.parseLexicalDeclaration({ inFor: false });
								break;
							case 'function':
								statement = this.parseFunctionDeclaration();
								break;
							case 'class':
								statement = this.parseClassDeclaration();
								break;
							case 'let':
								statement = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({ inFor: false }) : this.parseStatement();
								break;
							default:
								statement = this.parseStatement();
								break;
						}
					} else {
						statement = this.parseStatement();
					}
					return statement;
				};
				Parser.prototype.parseBlock = function () {
					var node = this.createNode();
					this.expect('{');
					var block = [];
					while (true) {
						if (this.match('}')) {
							break;
						}
						block.push(this.parseStatementListItem());
					}
					this.expect('}');
					return this.finalize(node, new Node.BlockStatement(block));
				};
				// ECMA-262 13.3.1 Let and Const Declarations
				Parser.prototype.parseLexicalBinding = function (kind, options) {
					var node = this.createNode();
					var params = [];
					var id = this.parsePattern(params, kind);
					// ECMA-262 12.2.1
					if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
						if (this.scanner.isRestrictedWord(id.name)) {
							this.tolerateError(messages_1.Messages.StrictVarName);
						}
					}
					var init = null;
					if (kind === 'const') {
						if (!this.matchKeyword('in') && !this.matchContextualKeyword('of')) {
							this.expect('=');
							init = this.isolateCoverGrammar(this.parseAssignmentExpression);
						}
					} else if (!options.inFor && id.type !== syntax_1.Syntax.Identifier || this.match('=')) {
						this.expect('=');
						init = this.isolateCoverGrammar(this.parseAssignmentExpression);
					}
					return this.finalize(node, new Node.VariableDeclarator(id, init));
				};
				Parser.prototype.parseBindingList = function (kind, options) {
					var list = [this.parseLexicalBinding(kind, options)];
					while (this.match(',')) {
						this.nextToken();
						list.push(this.parseLexicalBinding(kind, options));
					}
					return list;
				};
				Parser.prototype.isLexicalDeclaration = function () {
					var previousIndex = this.scanner.index;
					var previousLineNumber = this.scanner.lineNumber;
					var previousLineStart = this.scanner.lineStart;
					this.collectComments();
					var next = this.scanner.lex();
					this.scanner.index = previousIndex;
					this.scanner.lineNumber = previousLineNumber;
					this.scanner.lineStart = previousLineStart;
					return next.type === token_1.Token.Identifier || next.type === token_1.Token.Punctuator && next.value === '[' || next.type === token_1.Token.Punctuator && next.value === '{' || next.type === token_1.Token.Keyword && next.value === 'let' || next.type === token_1.Token.Keyword && next.value === 'yield';
				};
				Parser.prototype.parseLexicalDeclaration = function (options) {
					var node = this.createNode();
					var kind = this.nextToken().value;
					assert_1.assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');
					var declarations = this.parseBindingList(kind, options);
					this.consumeSemicolon();
					return this.finalize(node, new Node.VariableDeclaration(declarations, kind));
				};
				// ECMA-262 13.3.3 Destructuring Binding Patterns
				Parser.prototype.parseBindingRestElement = function (params, kind) {
					var node = this.createNode();
					this.expect('...');
					var arg = this.parsePattern(params, kind);
					return this.finalize(node, new Node.RestElement(arg));
				};
				Parser.prototype.parseArrayPattern = function (params, kind) {
					var node = this.createNode();
					this.expect('[');
					var elements = [];
					while (!this.match(']')) {
						if (this.match(',')) {
							this.nextToken();
							elements.push(null);
						} else {
							if (this.match('...')) {
								elements.push(this.parseBindingRestElement(params, kind));
								break;
							} else {
								elements.push(this.parsePatternWithDefault(params, kind));
							}
							if (!this.match(']')) {
								this.expect(',');
							}
						}
					}
					this.expect(']');
					return this.finalize(node, new Node.ArrayPattern(elements));
				};
				Parser.prototype.parsePropertyPattern = function (params, kind) {
					var node = this.createNode();
					var computed = false;
					var shorthand = false;
					var method = false;
					var key;
					var value;
					if (this.lookahead.type === token_1.Token.Identifier) {
						var keyToken = this.lookahead;
						key = this.parseVariableIdentifier();
						var init = this.finalize(node, new Node.Identifier(keyToken.value));
						if (this.match('=')) {
							params.push(keyToken);
							shorthand = true;
							this.nextToken();
							var expr = this.parseAssignmentExpression();
							value = this.finalize(this.startNode(keyToken), new Node.AssignmentPattern(init, expr));
						} else if (!this.match(':')) {
							params.push(keyToken);
							shorthand = true;
							value = init;
						} else {
							this.expect(':');
							value = this.parsePatternWithDefault(params, kind);
						}
					} else {
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						this.expect(':');
						value = this.parsePatternWithDefault(params, kind);
					}
					return this.finalize(node, new Node.Property('init', key, computed, value, method, shorthand));
				};
				Parser.prototype.parseObjectPattern = function (params, kind) {
					var node = this.createNode();
					var properties = [];
					this.expect('{');
					while (!this.match('}')) {
						properties.push(this.parsePropertyPattern(params, kind));
						if (!this.match('}')) {
							this.expect(',');
						}
					}
					this.expect('}');
					return this.finalize(node, new Node.ObjectPattern(properties));
				};
				Parser.prototype.parsePattern = function (params, kind) {
					var pattern;
					if (this.match('[')) {
						pattern = this.parseArrayPattern(params, kind);
					} else if (this.match('{')) {
						pattern = this.parseObjectPattern(params, kind);
					} else {
						if (this.matchKeyword('let') && (kind === 'const' || kind === 'let')) {
							this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.UnexpectedToken);
						}
						params.push(this.lookahead);
						pattern = this.parseVariableIdentifier(kind);
					}
					return pattern;
				};
				Parser.prototype.parsePatternWithDefault = function (params, kind) {
					var startToken = this.lookahead;
					var pattern = this.parsePattern(params, kind);
					if (this.match('=')) {
						this.nextToken();
						var previousAllowYield = this.context.allowYield;
						this.context.allowYield = true;
						var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
						this.context.allowYield = previousAllowYield;
						pattern = this.finalize(this.startNode(startToken), new Node.AssignmentPattern(pattern, right));
					}
					return pattern;
				};
				// ECMA-262 13.3.2 Variable Statement
				Parser.prototype.parseVariableIdentifier = function (kind) {
					var node = this.createNode();
					var token = this.nextToken();
					if (token.type === token_1.Token.Keyword && token.value === 'yield') {
						if (this.context.strict) {
							this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
						}
						if (!this.context.allowYield) {
							this.throwUnexpectedToken(token);
						}
					} else if (token.type !== token_1.Token.Identifier) {
						if (this.context.strict && token.type === token_1.Token.Keyword && this.scanner.isStrictModeReservedWord(token.value)) {
							this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
						} else {
							if (this.context.strict || token.value !== 'let' || kind !== 'var') {
								this.throwUnexpectedToken(token);
							}
						}
					} else if (this.sourceType === 'module' && token.type === token_1.Token.Identifier && token.value === 'await') {
						this.tolerateUnexpectedToken(token);
					}
					return this.finalize(node, new Node.Identifier(token.value));
				};
				Parser.prototype.parseVariableDeclaration = function (options) {
					var node = this.createNode();
					var params = [];
					var id = this.parsePattern(params, 'var');
					// ECMA-262 12.2.1
					if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
						if (this.scanner.isRestrictedWord(id.name)) {
							this.tolerateError(messages_1.Messages.StrictVarName);
						}
					}
					var init = null;
					if (this.match('=')) {
						this.nextToken();
						init = this.isolateCoverGrammar(this.parseAssignmentExpression);
					} else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
						this.expect('=');
					}
					return this.finalize(node, new Node.VariableDeclarator(id, init));
				};
				Parser.prototype.parseVariableDeclarationList = function (options) {
					var opt = { inFor: options.inFor };
					var list = [];
					list.push(this.parseVariableDeclaration(opt));
					while (this.match(',')) {
						this.nextToken();
						list.push(this.parseVariableDeclaration(opt));
					}
					return list;
				};
				Parser.prototype.parseVariableStatement = function () {
					var node = this.createNode();
					this.expectKeyword('var');
					var declarations = this.parseVariableDeclarationList({ inFor: false });
					this.consumeSemicolon();
					return this.finalize(node, new Node.VariableDeclaration(declarations, 'var'));
				};
				// ECMA-262 13.4 Empty Statement
				Parser.prototype.parseEmptyStatement = function () {
					var node = this.createNode();
					this.expect(';');
					return this.finalize(node, new Node.EmptyStatement());
				};
				// ECMA-262 13.5 Expression Statement
				Parser.prototype.parseExpressionStatement = function () {
					var node = this.createNode();
					var expr = this.parseExpression();
					this.consumeSemicolon();
					return this.finalize(node, new Node.ExpressionStatement(expr));
				};
				// ECMA-262 13.6 If statement
				Parser.prototype.parseIfStatement = function () {
					var node = this.createNode();
					var consequent;
					var alternate = null;
					this.expectKeyword('if');
					this.expect('(');
					var test = this.parseExpression();
					if (!this.match(')') && this.config.tolerant) {
						this.tolerateUnexpectedToken(this.nextToken());
						consequent = this.finalize(this.createNode(), new Node.EmptyStatement());
					} else {
						this.expect(')');
						consequent = this.parseStatement();
						if (this.matchKeyword('else')) {
							this.nextToken();
							alternate = this.parseStatement();
						}
					}
					return this.finalize(node, new Node.IfStatement(test, consequent, alternate));
				};
				// ECMA-262 13.7.2 The do-while Statement
				Parser.prototype.parseDoWhileStatement = function () {
					var node = this.createNode();
					this.expectKeyword('do');
					var previousInIteration = this.context.inIteration;
					this.context.inIteration = true;
					var body = this.parseStatement();
					this.context.inIteration = previousInIteration;
					this.expectKeyword('while');
					this.expect('(');
					var test = this.parseExpression();
					this.expect(')');
					if (this.match(';')) {
						this.nextToken();
					}
					return this.finalize(node, new Node.DoWhileStatement(body, test));
				};
				// ECMA-262 13.7.3 The while Statement
				Parser.prototype.parseWhileStatement = function () {
					var node = this.createNode();
					var body;
					this.expectKeyword('while');
					this.expect('(');
					var test = this.parseExpression();
					if (!this.match(')') && this.config.tolerant) {
						this.tolerateUnexpectedToken(this.nextToken());
						body = this.finalize(this.createNode(), new Node.EmptyStatement());
					} else {
						this.expect(')');
						var previousInIteration = this.context.inIteration;
						this.context.inIteration = true;
						body = this.parseStatement();
						this.context.inIteration = previousInIteration;
					}
					return this.finalize(node, new Node.WhileStatement(test, body));
				};
				// ECMA-262 13.7.4 The for Statement
				// ECMA-262 13.7.5 The for-in and for-of Statements
				Parser.prototype.parseForStatement = function () {
					var init = null;
					var test = null;
					var update = null;
					var forIn = true;
					var left, right;
					var node = this.createNode();
					this.expectKeyword('for');
					this.expect('(');
					if (this.match(';')) {
						this.nextToken();
					} else {
						if (this.matchKeyword('var')) {
							init = this.createNode();
							this.nextToken();
							var previousAllowIn = this.context.allowIn;
							this.context.allowIn = false;
							var declarations = this.parseVariableDeclarationList({ inFor: true });
							this.context.allowIn = previousAllowIn;
							if (declarations.length === 1 && this.matchKeyword('in')) {
								var decl = declarations[0];
								if (decl.init && (decl.id.type === syntax_1.Syntax.ArrayPattern || decl.id.type === syntax_1.Syntax.ObjectPattern || this.context.strict)) {
									this.tolerateError(messages_1.Messages.ForInOfLoopInitializer, 'for-in');
								}
								init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
								this.nextToken();
								left = init;
								right = this.parseExpression();
								init = null;
							} else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
								init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
								this.nextToken();
								left = init;
								right = this.parseAssignmentExpression();
								init = null;
								forIn = false;
							} else {
								init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
								this.expect(';');
							}
						} else if (this.matchKeyword('const') || this.matchKeyword('let')) {
							init = this.createNode();
							var kind = this.nextToken().value;
							if (!this.context.strict && this.lookahead.value === 'in') {
								init = this.finalize(init, new Node.Identifier(kind));
								this.nextToken();
								left = init;
								right = this.parseExpression();
								init = null;
							} else {
								var previousAllowIn = this.context.allowIn;
								this.context.allowIn = false;
								var declarations = this.parseBindingList(kind, { inFor: true });
								this.context.allowIn = previousAllowIn;
								if (declarations.length === 1 && declarations[0].init === null && this.matchKeyword('in')) {
									init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
									this.nextToken();
									left = init;
									right = this.parseExpression();
									init = null;
								} else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
									init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
									this.nextToken();
									left = init;
									right = this.parseAssignmentExpression();
									init = null;
									forIn = false;
								} else {
									this.consumeSemicolon();
									init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
								}
							}
						} else {
							var initStartToken = this.lookahead;
							var previousAllowIn = this.context.allowIn;
							this.context.allowIn = false;
							init = this.inheritCoverGrammar(this.parseAssignmentExpression);
							this.context.allowIn = previousAllowIn;
							if (this.matchKeyword('in')) {
								if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
									this.tolerateError(messages_1.Messages.InvalidLHSInForIn);
								}
								this.nextToken();
								this.reinterpretExpressionAsPattern(init);
								left = init;
								right = this.parseExpression();
								init = null;
							} else if (this.matchContextualKeyword('of')) {
								if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
									this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
								}
								this.nextToken();
								this.reinterpretExpressionAsPattern(init);
								left = init;
								right = this.parseAssignmentExpression();
								init = null;
								forIn = false;
							} else {
								if (this.match(',')) {
									var initSeq = [init];
									while (this.match(',')) {
										this.nextToken();
										initSeq.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
									}
									init = this.finalize(this.startNode(initStartToken), new Node.SequenceExpression(initSeq));
								}
								this.expect(';');
							}
						}
					}
					if (typeof left === 'undefined') {
						if (!this.match(';')) {
							test = this.parseExpression();
						}
						this.expect(';');
						if (!this.match(')')) {
							update = this.parseExpression();
						}
					}
					var body;
					if (!this.match(')') && this.config.tolerant) {
						this.tolerateUnexpectedToken(this.nextToken());
						body = this.finalize(this.createNode(), new Node.EmptyStatement());
					} else {
						this.expect(')');
						var previousInIteration = this.context.inIteration;
						this.context.inIteration = true;
						body = this.isolateCoverGrammar(this.parseStatement);
						this.context.inIteration = previousInIteration;
					}
					return typeof left === 'undefined' ? this.finalize(node, new Node.ForStatement(init, test, update, body)) : forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) : this.finalize(node, new Node.ForOfStatement(left, right, body));
				};
				// ECMA-262 13.8 The continue statement
				Parser.prototype.parseContinueStatement = function () {
					var node = this.createNode();
					this.expectKeyword('continue');
					var label = null;
					if (this.lookahead.type === token_1.Token.Identifier && !this.hasLineTerminator) {
						label = this.parseVariableIdentifier();
						var key = '$' + label.name;
						if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
							this.throwError(messages_1.Messages.UnknownLabel, label.name);
						}
					}
					this.consumeSemicolon();
					if (label === null && !this.context.inIteration) {
						this.throwError(messages_1.Messages.IllegalContinue);
					}
					return this.finalize(node, new Node.ContinueStatement(label));
				};
				// ECMA-262 13.9 The break statement
				Parser.prototype.parseBreakStatement = function () {
					var node = this.createNode();
					this.expectKeyword('break');
					var label = null;
					if (this.lookahead.type === token_1.Token.Identifier && !this.hasLineTerminator) {
						label = this.parseVariableIdentifier();
						var key = '$' + label.name;
						if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
							this.throwError(messages_1.Messages.UnknownLabel, label.name);
						}
					}
					this.consumeSemicolon();
					if (label === null && !this.context.inIteration && !this.context.inSwitch) {
						this.throwError(messages_1.Messages.IllegalBreak);
					}
					return this.finalize(node, new Node.BreakStatement(label));
				};
				// ECMA-262 13.10 The return statement
				Parser.prototype.parseReturnStatement = function () {
					if (!this.context.inFunctionBody) {
						this.tolerateError(messages_1.Messages.IllegalReturn);
					}
					var node = this.createNode();
					this.expectKeyword('return');
					var hasArgument = !this.match(';') && !this.match('}') && !this.hasLineTerminator && this.lookahead.type !== token_1.Token.EOF;
					var argument = hasArgument ? this.parseExpression() : null;
					this.consumeSemicolon();
					return this.finalize(node, new Node.ReturnStatement(argument));
				};
				// ECMA-262 13.11 The with statement
				Parser.prototype.parseWithStatement = function () {
					if (this.context.strict) {
						this.tolerateError(messages_1.Messages.StrictModeWith);
					}
					var node = this.createNode();
					this.expectKeyword('with');
					this.expect('(');
					var object = this.parseExpression();
					this.expect(')');
					var body = this.parseStatement();
					return this.finalize(node, new Node.WithStatement(object, body));
				};
				// ECMA-262 13.12 The switch statement
				Parser.prototype.parseSwitchCase = function () {
					var node = this.createNode();
					var test;
					if (this.matchKeyword('default')) {
						this.nextToken();
						test = null;
					} else {
						this.expectKeyword('case');
						test = this.parseExpression();
					}
					this.expect(':');
					var consequent = [];
					while (true) {
						if (this.match('}') || this.matchKeyword('default') || this.matchKeyword('case')) {
							break;
						}
						consequent.push(this.parseStatementListItem());
					}
					return this.finalize(node, new Node.SwitchCase(test, consequent));
				};
				Parser.prototype.parseSwitchStatement = function () {
					var node = this.createNode();
					this.expectKeyword('switch');
					this.expect('(');
					var discriminant = this.parseExpression();
					this.expect(')');
					var previousInSwitch = this.context.inSwitch;
					this.context.inSwitch = true;
					var cases = [];
					var defaultFound = false;
					this.expect('{');
					while (true) {
						if (this.match('}')) {
							break;
						}
						var clause = this.parseSwitchCase();
						if (clause.test === null) {
							if (defaultFound) {
								this.throwError(messages_1.Messages.MultipleDefaultsInSwitch);
							}
							defaultFound = true;
						}
						cases.push(clause);
					}
					this.expect('}');
					this.context.inSwitch = previousInSwitch;
					return this.finalize(node, new Node.SwitchStatement(discriminant, cases));
				};
				// ECMA-262 13.13 Labelled Statements
				Parser.prototype.parseLabelledStatement = function () {
					var node = this.createNode();
					var expr = this.parseExpression();
					var statement;
					if (expr.type === syntax_1.Syntax.Identifier && this.match(':')) {
						this.nextToken();
						var id = expr;
						var key = '$' + id.name;
						if (Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
							this.throwError(messages_1.Messages.Redeclaration, 'Label', id.name);
						}
						this.context.labelSet[key] = true;
						var labeledBody = this.parseStatement();
						delete this.context.labelSet[key];
						statement = new Node.LabeledStatement(id, labeledBody);
					} else {
						this.consumeSemicolon();
						statement = new Node.ExpressionStatement(expr);
					}
					return this.finalize(node, statement);
				};
				// ECMA-262 13.14 The throw statement
				Parser.prototype.parseThrowStatement = function () {
					var node = this.createNode();
					this.expectKeyword('throw');
					if (this.hasLineTerminator) {
						this.throwError(messages_1.Messages.NewlineAfterThrow);
					}
					var argument = this.parseExpression();
					this.consumeSemicolon();
					return this.finalize(node, new Node.ThrowStatement(argument));
				};
				// ECMA-262 13.15 The try statement
				Parser.prototype.parseCatchClause = function () {
					var node = this.createNode();
					this.expectKeyword('catch');
					this.expect('(');
					if (this.match(')')) {
						this.throwUnexpectedToken(this.lookahead);
					}
					var params = [];
					var param = this.parsePattern(params);
					var paramMap = {};
					for (var i = 0; i < params.length; i++) {
						var key = '$' + params[i].value;
						if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
							this.tolerateError(messages_1.Messages.DuplicateBinding, params[i].value);
						}
						paramMap[key] = true;
					}
					if (this.context.strict && param.type === syntax_1.Syntax.Identifier) {
						if (this.scanner.isRestrictedWord(param.name)) {
							this.tolerateError(messages_1.Messages.StrictCatchVariable);
						}
					}
					this.expect(')');
					var body = this.parseBlock();
					return this.finalize(node, new Node.CatchClause(param, body));
				};
				Parser.prototype.parseFinallyClause = function () {
					this.expectKeyword('finally');
					return this.parseBlock();
				};
				Parser.prototype.parseTryStatement = function () {
					var node = this.createNode();
					this.expectKeyword('try');
					var block = this.parseBlock();
					var handler = this.matchKeyword('catch') ? this.parseCatchClause() : null;
					var finalizer = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
					if (!handler && !finalizer) {
						this.throwError(messages_1.Messages.NoCatchOrFinally);
					}
					return this.finalize(node, new Node.TryStatement(block, handler, finalizer));
				};
				// ECMA-262 13.16 The debugger statement
				Parser.prototype.parseDebuggerStatement = function () {
					var node = this.createNode();
					this.expectKeyword('debugger');
					this.consumeSemicolon();
					return this.finalize(node, new Node.DebuggerStatement());
				};
				// ECMA-262 13 Statements
				Parser.prototype.parseStatement = function () {
					var statement = null;
					switch (this.lookahead.type) {
						case token_1.Token.BooleanLiteral:
						case token_1.Token.NullLiteral:
						case token_1.Token.NumericLiteral:
						case token_1.Token.StringLiteral:
						case token_1.Token.Template:
						case token_1.Token.RegularExpression:
							statement = this.parseExpressionStatement();
							break;
						case token_1.Token.Punctuator:
							var value = this.lookahead.value;
							if (value === '{') {
								statement = this.parseBlock();
							} else if (value === '(') {
								statement = this.parseExpressionStatement();
							} else if (value === ';') {
								statement = this.parseEmptyStatement();
							} else {
								statement = this.parseExpressionStatement();
							}
							break;
						case token_1.Token.Identifier:
							statement = this.parseLabelledStatement();
							break;
						case token_1.Token.Keyword:
							switch (this.lookahead.value) {
								case 'break':
									statement = this.parseBreakStatement();
									break;
								case 'continue':
									statement = this.parseContinueStatement();
									break;
								case 'debugger':
									statement = this.parseDebuggerStatement();
									break;
								case 'do':
									statement = this.parseDoWhileStatement();
									break;
								case 'for':
									statement = this.parseForStatement();
									break;
								case 'function':
									statement = this.parseFunctionDeclaration();
									break;
								case 'if':
									statement = this.parseIfStatement();
									break;
								case 'return':
									statement = this.parseReturnStatement();
									break;
								case 'switch':
									statement = this.parseSwitchStatement();
									break;
								case 'throw':
									statement = this.parseThrowStatement();
									break;
								case 'try':
									statement = this.parseTryStatement();
									break;
								case 'var':
									statement = this.parseVariableStatement();
									break;
								case 'while':
									statement = this.parseWhileStatement();
									break;
								case 'with':
									statement = this.parseWithStatement();
									break;
								default:
									statement = this.parseExpressionStatement();
									break;
							}
							break;
						default:
							this.throwUnexpectedToken(this.lookahead);
					}
					return statement;
				};
				// ECMA-262 14.1 Function Definition
				Parser.prototype.parseFunctionSourceElements = function () {
					var node = this.createNode();
					this.expect('{');
					var body = this.parseDirectivePrologues();
					var previousLabelSet = this.context.labelSet;
					var previousInIteration = this.context.inIteration;
					var previousInSwitch = this.context.inSwitch;
					var previousInFunctionBody = this.context.inFunctionBody;
					this.context.labelSet = {};
					this.context.inIteration = false;
					this.context.inSwitch = false;
					this.context.inFunctionBody = true;
					while (this.startMarker.index < this.scanner.length) {
						if (this.match('}')) {
							break;
						}
						body.push(this.parseStatementListItem());
					}
					this.expect('}');
					this.context.labelSet = previousLabelSet;
					this.context.inIteration = previousInIteration;
					this.context.inSwitch = previousInSwitch;
					this.context.inFunctionBody = previousInFunctionBody;
					return this.finalize(node, new Node.BlockStatement(body));
				};
				Parser.prototype.validateParam = function (options, param, name) {
					var key = '$' + name;
					if (this.context.strict) {
						if (this.scanner.isRestrictedWord(name)) {
							options.stricted = param;
							options.message = messages_1.Messages.StrictParamName;
						}
						if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
							options.stricted = param;
							options.message = messages_1.Messages.StrictParamDupe;
						}
					} else if (!options.firstRestricted) {
						if (this.scanner.isRestrictedWord(name)) {
							options.firstRestricted = param;
							options.message = messages_1.Messages.StrictParamName;
						} else if (this.scanner.isStrictModeReservedWord(name)) {
							options.firstRestricted = param;
							options.message = messages_1.Messages.StrictReservedWord;
						} else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
							options.stricted = param;
							options.message = messages_1.Messages.StrictParamDupe;
						}
					}
					/* istanbul ignore next */
					if (typeof Object.defineProperty === 'function') {
						Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
					} else {
						options.paramSet[key] = true;
					}
				};
				Parser.prototype.parseRestElement = function (params) {
					var node = this.createNode();
					this.expect('...');
					var arg = this.parsePattern(params);
					if (this.match('=')) {
						this.throwError(messages_1.Messages.DefaultRestParameter);
					}
					if (!this.match(')')) {
						this.throwError(messages_1.Messages.ParameterAfterRestParameter);
					}
					return this.finalize(node, new Node.RestElement(arg));
				};
				Parser.prototype.parseFormalParameter = function (options) {
					var params = [];
					var param = this.match('...') ? this.parseRestElement(params) : this.parsePatternWithDefault(params);
					for (var i = 0; i < params.length; i++) {
						this.validateParam(options, params[i], params[i].value);
					}
					options.params.push(param);
					return !this.match(')');
				};
				Parser.prototype.parseFormalParameters = function (firstRestricted) {
					var options;
					options = {
						params: [],
						firstRestricted: firstRestricted
					};
					this.expect('(');
					if (!this.match(')')) {
						options.paramSet = {};
						while (this.startMarker.index < this.scanner.length) {
							if (!this.parseFormalParameter(options)) {
								break;
							}
							this.expect(',');
						}
					}
					this.expect(')');
					return {
						params: options.params,
						stricted: options.stricted,
						firstRestricted: options.firstRestricted,
						message: options.message
					};
				};
				Parser.prototype.parseFunctionDeclaration = function (identifierIsOptional) {
					var node = this.createNode();
					this.expectKeyword('function');
					var isGenerator = this.match('*');
					if (isGenerator) {
						this.nextToken();
					}
					var message;
					var id = null;
					var firstRestricted = null;
					if (!identifierIsOptional || !this.match('(')) {
						var token = this.lookahead;
						id = this.parseVariableIdentifier();
						if (this.context.strict) {
							if (this.scanner.isRestrictedWord(token.value)) {
								this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
							}
						} else {
							if (this.scanner.isRestrictedWord(token.value)) {
								firstRestricted = token;
								message = messages_1.Messages.StrictFunctionName;
							} else if (this.scanner.isStrictModeReservedWord(token.value)) {
								firstRestricted = token;
								message = messages_1.Messages.StrictReservedWord;
							}
						}
					}
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = !isGenerator;
					var formalParameters = this.parseFormalParameters(firstRestricted);
					var params = formalParameters.params;
					var stricted = formalParameters.stricted;
					firstRestricted = formalParameters.firstRestricted;
					if (formalParameters.message) {
						message = formalParameters.message;
					}
					var previousStrict = this.context.strict;
					var body = this.parseFunctionSourceElements();
					if (this.context.strict && firstRestricted) {
						this.throwUnexpectedToken(firstRestricted, message);
					}
					if (this.context.strict && stricted) {
						this.tolerateUnexpectedToken(stricted, message);
					}
					this.context.strict = previousStrict;
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
				};
				Parser.prototype.parseFunctionExpression = function () {
					var node = this.createNode();
					this.expectKeyword('function');
					var isGenerator = this.match('*');
					if (isGenerator) {
						this.nextToken();
					}
					var message;
					var id = null;
					var firstRestricted;
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = !isGenerator;
					if (!this.match('(')) {
						var token = this.lookahead;
						id = !this.context.strict && !isGenerator && this.matchKeyword('yield') ? this.parseIdentifierName() : this.parseVariableIdentifier();
						if (this.context.strict) {
							if (this.scanner.isRestrictedWord(token.value)) {
								this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
							}
						} else {
							if (this.scanner.isRestrictedWord(token.value)) {
								firstRestricted = token;
								message = messages_1.Messages.StrictFunctionName;
							} else if (this.scanner.isStrictModeReservedWord(token.value)) {
								firstRestricted = token;
								message = messages_1.Messages.StrictReservedWord;
							}
						}
					}
					var formalParameters = this.parseFormalParameters(firstRestricted);
					var params = formalParameters.params;
					var stricted = formalParameters.stricted;
					firstRestricted = formalParameters.firstRestricted;
					if (formalParameters.message) {
						message = formalParameters.message;
					}
					var previousStrict = this.context.strict;
					var body = this.parseFunctionSourceElements();
					if (this.context.strict && firstRestricted) {
						this.throwUnexpectedToken(firstRestricted, message);
					}
					if (this.context.strict && stricted) {
						this.tolerateUnexpectedToken(stricted, message);
					}
					this.context.strict = previousStrict;
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
				};
				// ECMA-262 14.1.1 Directive Prologues
				Parser.prototype.parseDirective = function () {
					var token = this.lookahead;
					var directive = null;
					var node = this.createNode();
					var expr = this.parseExpression();
					if (expr.type === syntax_1.Syntax.Literal) {
						directive = this.getTokenRaw(token).slice(1, -1);
					}
					this.consumeSemicolon();
					return this.finalize(node, directive ? new Node.Directive(expr, directive) : new Node.ExpressionStatement(expr));
				};
				Parser.prototype.parseDirectivePrologues = function () {
					var firstRestricted = null;
					var body = [];
					while (true) {
						var token = this.lookahead;
						if (token.type !== token_1.Token.StringLiteral) {
							break;
						}
						var statement = this.parseDirective();
						body.push(statement);
						var directive = statement.directive;
						if (typeof directive !== 'string') {
							break;
						}
						if (directive === 'use strict') {
							this.context.strict = true;
							if (firstRestricted) {
								this.tolerateUnexpectedToken(firstRestricted, messages_1.Messages.StrictOctalLiteral);
							}
						} else {
							if (!firstRestricted && token.octal) {
								firstRestricted = token;
							}
						}
					}
					return body;
				};
				// ECMA-262 14.3 Method Definitions
				Parser.prototype.qualifiedPropertyName = function (token) {
					switch (token.type) {
						case token_1.Token.Identifier:
						case token_1.Token.StringLiteral:
						case token_1.Token.BooleanLiteral:
						case token_1.Token.NullLiteral:
						case token_1.Token.NumericLiteral:
						case token_1.Token.Keyword:
							return true;
						case token_1.Token.Punctuator:
							return token.value === '[';
					}
					return false;
				};
				Parser.prototype.parseGetterMethod = function () {
					var node = this.createNode();
					this.expect('(');
					this.expect(')');
					var isGenerator = false;
					var params = {
						params: [],
						stricted: null,
						firstRestricted: null,
						message: null
					};
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = false;
					var method = this.parsePropertyMethod(params);
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
				};
				Parser.prototype.parseSetterMethod = function () {
					var node = this.createNode();
					var options = {
						params: [],
						firstRestricted: null,
						paramSet: {}
					};
					var isGenerator = false;
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = false;
					this.expect('(');
					if (this.match(')')) {
						this.tolerateUnexpectedToken(this.lookahead);
					} else {
						this.parseFormalParameter(options);
					}
					this.expect(')');
					var method = this.parsePropertyMethod(options);
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionExpression(null, options.params, method, isGenerator));
				};
				Parser.prototype.parseGeneratorMethod = function () {
					var node = this.createNode();
					var isGenerator = true;
					var previousAllowYield = this.context.allowYield;
					this.context.allowYield = true;
					var params = this.parseFormalParameters();
					this.context.allowYield = false;
					var method = this.parsePropertyMethod(params);
					this.context.allowYield = previousAllowYield;
					return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
				};
				// ECMA-262 14.4 Generator Function Definitions
				Parser.prototype.isStartOfExpression = function () {
					var start = true;
					var value = this.lookahead.value;
					switch (this.lookahead.type) {
						case token_1.Token.Punctuator:
							start = value === '[' || value === '(' || value === '{' || value === '+' || value === '-' || value === '!' || value === '~' || value === '++' || value === '--' || value === '/' || value === '/='; // regular expression literal
							break;
						case token_1.Token.Keyword:
							start = value === 'class' || value === 'delete' || value === 'function' || value === 'let' || value === 'new' || value === 'super' || value === 'this' || value === 'typeof' || value === 'void' || value === 'yield';
							break;
						default:
							break;
					}
					return start;
				};
				Parser.prototype.parseYieldExpression = function () {
					var node = this.createNode();
					this.expectKeyword('yield');
					var argument = null;
					var delegate = false;
					if (!this.hasLineTerminator) {
						var previousAllowYield = this.context.allowYield;
						this.context.allowYield = false;
						delegate = this.match('*');
						if (delegate) {
							this.nextToken();
							argument = this.parseAssignmentExpression();
						} else if (this.isStartOfExpression()) {
							argument = this.parseAssignmentExpression();
						}
						this.context.allowYield = previousAllowYield;
					}
					return this.finalize(node, new Node.YieldExpression(argument, delegate));
				};
				// ECMA-262 14.5 Class Definitions
				Parser.prototype.parseClassElement = function (hasConstructor) {
					var token = this.lookahead;
					var node = this.createNode();
					var kind;
					var key;
					var value;
					var computed = false;
					var method = false;
					var isStatic = false;
					if (this.match('*')) {
						this.nextToken();
					} else {
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						var id = key;
						if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
							token = this.lookahead;
							isStatic = true;
							computed = this.match('[');
							if (this.match('*')) {
								this.nextToken();
							} else {
								key = this.parseObjectPropertyKey();
							}
						}
					}
					var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
					if (token.type === token_1.Token.Identifier) {
						if (token.value === 'get' && lookaheadPropertyKey) {
							kind = 'get';
							computed = this.match('[');
							key = this.parseObjectPropertyKey();
							this.context.allowYield = false;
							value = this.parseGetterMethod();
						} else if (token.value === 'set' && lookaheadPropertyKey) {
							kind = 'set';
							computed = this.match('[');
							key = this.parseObjectPropertyKey();
							value = this.parseSetterMethod();
						}
					} else if (token.type === token_1.Token.Punctuator && token.value === '*' && lookaheadPropertyKey) {
						kind = 'init';
						computed = this.match('[');
						key = this.parseObjectPropertyKey();
						value = this.parseGeneratorMethod();
						method = true;
					}
					if (!kind && key && this.match('(')) {
						kind = 'init';
						value = this.parsePropertyMethodFunction();
						method = true;
					}
					if (!kind) {
						this.throwUnexpectedToken(this.lookahead);
					}
					if (kind === 'init') {
						kind = 'method';
					}
					if (!computed) {
						if (isStatic && this.isPropertyKey(key, 'prototype')) {
							this.throwUnexpectedToken(token, messages_1.Messages.StaticPrototype);
						}
						if (!isStatic && this.isPropertyKey(key, 'constructor')) {
							if (kind !== 'method' || !method || value.generator) {
								this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
							}
							if (hasConstructor.value) {
								this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
							} else {
								hasConstructor.value = true;
							}
							kind = 'constructor';
						}
					}
					return this.finalize(node, new Node.MethodDefinition(key, computed, value, kind, isStatic));
				};
				Parser.prototype.parseClassElementList = function () {
					var body = [];
					var hasConstructor = { value: false };
					this.expect('{');
					while (!this.match('}')) {
						if (this.match(';')) {
							this.nextToken();
						} else {
							body.push(this.parseClassElement(hasConstructor));
						}
					}
					this.expect('}');
					return body;
				};
				Parser.prototype.parseClassBody = function () {
					var node = this.createNode();
					var elementList = this.parseClassElementList();
					return this.finalize(node, new Node.ClassBody(elementList));
				};
				Parser.prototype.parseClassDeclaration = function (identifierIsOptional) {
					var node = this.createNode();
					var previousStrict = this.context.strict;
					this.context.strict = true;
					this.expectKeyword('class');
					var id = identifierIsOptional && this.lookahead.type !== token_1.Token.Identifier ? null : this.parseVariableIdentifier();
					var superClass = null;
					if (this.matchKeyword('extends')) {
						this.nextToken();
						superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
					}
					var classBody = this.parseClassBody();
					this.context.strict = previousStrict;
					return this.finalize(node, new Node.ClassDeclaration(id, superClass, classBody));
				};
				Parser.prototype.parseClassExpression = function () {
					var node = this.createNode();
					var previousStrict = this.context.strict;
					this.context.strict = true;
					this.expectKeyword('class');
					var id = this.lookahead.type === token_1.Token.Identifier ? this.parseVariableIdentifier() : null;
					var superClass = null;
					if (this.matchKeyword('extends')) {
						this.nextToken();
						superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
					}
					var classBody = this.parseClassBody();
					this.context.strict = previousStrict;
					return this.finalize(node, new Node.ClassExpression(id, superClass, classBody));
				};
				// ECMA-262 15.1 Scripts
				// ECMA-262 15.2 Modules
				Parser.prototype.parseProgram = function () {
					var node = this.createNode();
					var body = this.parseDirectivePrologues();
					while (this.startMarker.index < this.scanner.length) {
						body.push(this.parseStatementListItem());
					}
					return this.finalize(node, new Node.Program(body, this.sourceType));
				};
				// ECMA-262 15.2.2 Imports
				Parser.prototype.parseModuleSpecifier = function () {
					var node = this.createNode();
					if (this.lookahead.type !== token_1.Token.StringLiteral) {
						this.throwError(messages_1.Messages.InvalidModuleSpecifier);
					}
					var token = this.nextToken();
					var raw = this.getTokenRaw(token);
					return this.finalize(node, new Node.Literal(token.value, raw));
				};
				// import {<foo as bar>} ...;
				Parser.prototype.parseImportSpecifier = function () {
					var node = this.createNode();
					var imported;
					var local;
					if (this.lookahead.type === token_1.Token.Identifier) {
						imported = this.parseVariableIdentifier();
						local = imported;
						if (this.matchContextualKeyword('as')) {
							this.nextToken();
							local = this.parseVariableIdentifier();
						}
					} else {
						imported = this.parseIdentifierName();
						local = imported;
						if (this.matchContextualKeyword('as')) {
							this.nextToken();
							local = this.parseVariableIdentifier();
						} else {
							this.throwUnexpectedToken(this.nextToken());
						}
					}
					return this.finalize(node, new Node.ImportSpecifier(local, imported));
				};
				// {foo, bar as bas}
				Parser.prototype.parseNamedImports = function () {
					this.expect('{');
					var specifiers = [];
					while (!this.match('}')) {
						specifiers.push(this.parseImportSpecifier());
						if (!this.match('}')) {
							this.expect(',');
						}
					}
					this.expect('}');
					return specifiers;
				};
				// import <foo> ...;
				Parser.prototype.parseImportDefaultSpecifier = function () {
					var node = this.createNode();
					var local = this.parseIdentifierName();
					return this.finalize(node, new Node.ImportDefaultSpecifier(local));
				};
				// import <* as foo> ...;
				Parser.prototype.parseImportNamespaceSpecifier = function () {
					var node = this.createNode();
					this.expect('*');
					if (!this.matchContextualKeyword('as')) {
						this.throwError(messages_1.Messages.NoAsAfterImportNamespace);
					}
					this.nextToken();
					var local = this.parseIdentifierName();
					return this.finalize(node, new Node.ImportNamespaceSpecifier(local));
				};
				Parser.prototype.parseImportDeclaration = function () {
					if (this.context.inFunctionBody) {
						this.throwError(messages_1.Messages.IllegalImportDeclaration);
					}
					var node = this.createNode();
					this.expectKeyword('import');
					var src;
					var specifiers = [];
					if (this.lookahead.type === token_1.Token.StringLiteral) {
						// import 'foo';
						src = this.parseModuleSpecifier();
					} else {
						if (this.match('{')) {
							// import {bar}
							specifiers = specifiers.concat(this.parseNamedImports());
						} else if (this.match('*')) {
							// import * as foo
							specifiers.push(this.parseImportNamespaceSpecifier());
						} else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
							// import foo
							specifiers.push(this.parseImportDefaultSpecifier());
							if (this.match(',')) {
								this.nextToken();
								if (this.match('*')) {
									// import foo, * as foo
									specifiers.push(this.parseImportNamespaceSpecifier());
								} else if (this.match('{')) {
									// import foo, {bar}
									specifiers = specifiers.concat(this.parseNamedImports());
								} else {
									this.throwUnexpectedToken(this.lookahead);
								}
							}
						} else {
							this.throwUnexpectedToken(this.nextToken());
						}
						if (!this.matchContextualKeyword('from')) {
							var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
							this.throwError(message, this.lookahead.value);
						}
						this.nextToken();
						src = this.parseModuleSpecifier();
					}
					this.consumeSemicolon();
					return this.finalize(node, new Node.ImportDeclaration(specifiers, src));
				};
				// ECMA-262 15.2.3 Exports
				Parser.prototype.parseExportSpecifier = function () {
					var node = this.createNode();
					var local = this.parseIdentifierName();
					var exported = local;
					if (this.matchContextualKeyword('as')) {
						this.nextToken();
						exported = this.parseIdentifierName();
					}
					return this.finalize(node, new Node.ExportSpecifier(local, exported));
				};
				Parser.prototype.parseExportDeclaration = function () {
					if (this.context.inFunctionBody) {
						this.throwError(messages_1.Messages.IllegalExportDeclaration);
					}
					var node = this.createNode();
					this.expectKeyword('export');
					var exportDeclaration;
					if (this.matchKeyword('default')) {
						// export default ...
						this.nextToken();
						if (this.matchKeyword('function')) {
							// export default function foo () {}
							// export default function () {}
							var declaration = this.parseFunctionDeclaration(true);
							exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
						} else if (this.matchKeyword('class')) {
							// export default class foo {}
							var declaration = this.parseClassDeclaration(true);
							exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
						} else {
							if (this.matchContextualKeyword('from')) {
								this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
							}
							// export default {};
							// export default [];
							// export default (1 + 2);
							var declaration = this.match('{') ? this.parseObjectInitializer() : this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
							this.consumeSemicolon();
							exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
						}
					} else if (this.match('*')) {
						// export * from 'foo';
						this.nextToken();
						if (!this.matchContextualKeyword('from')) {
							var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
							this.throwError(message, this.lookahead.value);
						}
						this.nextToken();
						var src = this.parseModuleSpecifier();
						this.consumeSemicolon();
						exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
					} else if (this.lookahead.type === token_1.Token.Keyword) {
						// export var f = 1;
						var declaration = void 0;
						switch (this.lookahead.value) {
							case 'let':
							case 'const':
								declaration = this.parseLexicalDeclaration({ inFor: false });
								break;
							case 'var':
							case 'class':
							case 'function':
								declaration = this.parseStatementListItem();
								break;
							default:
								this.throwUnexpectedToken(this.lookahead);
						}
						exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
					} else {
						var specifiers = [];
						var source = null;
						var isExportFromIdentifier = false;
						this.expect('{');
						while (!this.match('}')) {
							isExportFromIdentifier = isExportFromIdentifier || this.matchKeyword('default');
							specifiers.push(this.parseExportSpecifier());
							if (!this.match('}')) {
								this.expect(',');
							}
						}
						this.expect('}');
						if (this.matchContextualKeyword('from')) {
							// export {default} from 'foo';
							// export {foo} from 'foo';
							this.nextToken();
							source = this.parseModuleSpecifier();
							this.consumeSemicolon();
						} else if (isExportFromIdentifier) {
							// export {default}; // missing fromClause
							var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
							this.throwError(message, this.lookahead.value);
						} else {
							// export {foo};
							this.consumeSemicolon();
						}
						exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
					}
					return exportDeclaration;
				};
				return Parser;
			}();
			exports.Parser = Parser;

			/***/
		},
		/* 4 */
		/***/function (module, exports) {

			// Ensure the condition is true, otherwise throw an error.
			// This is only to have a better contract semantic, i.e. another safety net
			// to catch a logic error. The condition shall be fulfilled in normal case.
			// Do NOT use this to enforce a certain condition on any user input.
			"use strict";

			function assert(condition, message) {
				/* istanbul ignore if */
				if (!condition) {
					throw new Error('ASSERT: ' + message);
				}
			}
			exports.assert = assert;

			/***/
		},
		/* 5 */
		/***/function (module, exports) {

			"use strict";
			// Error messages should be identical to V8.

			exports.Messages = {
				UnexpectedToken: 'Unexpected token %0',
				UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
				UnexpectedNumber: 'Unexpected number',
				UnexpectedString: 'Unexpected string',
				UnexpectedIdentifier: 'Unexpected identifier',
				UnexpectedReserved: 'Unexpected reserved word',
				UnexpectedTemplate: 'Unexpected quasi %0',
				UnexpectedEOS: 'Unexpected end of input',
				NewlineAfterThrow: 'Illegal newline after throw',
				InvalidRegExp: 'Invalid regular expression',
				UnterminatedRegExp: 'Invalid regular expression: missing /',
				InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
				InvalidLHSInForIn: 'Invalid left-hand side in for-in',
				InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
				MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
				NoCatchOrFinally: 'Missing catch or finally after try',
				UnknownLabel: 'Undefined label \'%0\'',
				Redeclaration: '%0 \'%1\' has already been declared',
				IllegalContinue: 'Illegal continue statement',
				IllegalBreak: 'Illegal break statement',
				IllegalReturn: 'Illegal return statement',
				StrictModeWith: 'Strict mode code may not include a with statement',
				StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
				StrictVarName: 'Variable name may not be eval or arguments in strict mode',
				StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
				StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
				StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
				StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
				StrictDelete: 'Delete of an unqualified identifier in strict mode.',
				StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
				StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
				StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
				StrictReservedWord: 'Use of future reserved word in strict mode',
				TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
				ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
				DefaultRestParameter: 'Unexpected token =',
				DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
				ConstructorSpecialMethod: 'Class constructor may not be an accessor',
				DuplicateConstructor: 'A class may only have one constructor',
				StaticPrototype: 'Classes may not have static property named prototype',
				MissingFromClause: 'Unexpected token',
				NoAsAfterImportNamespace: 'Unexpected token',
				InvalidModuleSpecifier: 'Unexpected token',
				IllegalImportDeclaration: 'Unexpected token',
				IllegalExportDeclaration: 'Unexpected token',
				DuplicateBinding: 'Duplicate binding %0',
				ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer'
			};

			/***/
		},
		/* 6 */
		/***/function (module, exports) {

			"use strict";

			var ErrorHandler = function () {
				function ErrorHandler() {
					this.errors = [];
					this.tolerant = false;
				}
				;
				ErrorHandler.prototype.recordError = function (error) {
					this.errors.push(error);
				};
				;
				ErrorHandler.prototype.tolerate = function (error) {
					if (this.tolerant) {
						this.recordError(error);
					} else {
						throw error;
					}
				};
				;
				ErrorHandler.prototype.constructError = function (msg, column) {
					var error = new Error(msg);
					try {
						throw error;
					} catch (base) {
						/* istanbul ignore else */
						if (Object.create && Object.defineProperty) {
							error = Object.create(base);
							Object.defineProperty(error, 'column', { value: column });
						}
					} finally {
						return error;
					}
				};
				;
				ErrorHandler.prototype.createError = function (index, line, col, description) {
					var msg = 'Line ' + line + ': ' + description;
					var error = this.constructError(msg, col);
					error.index = index;
					error.lineNumber = line;
					error.description = description;
					return error;
				};
				;
				ErrorHandler.prototype.throwError = function (index, line, col, description) {
					throw this.createError(index, line, col, description);
				};
				;
				ErrorHandler.prototype.tolerateError = function (index, line, col, description) {
					var error = this.createError(index, line, col, description);
					if (this.tolerant) {
						this.recordError(error);
					} else {
						throw error;
					}
				};
				;
				return ErrorHandler;
			}();
			exports.ErrorHandler = ErrorHandler;

			/***/
		},
		/* 7 */
		/***/function (module, exports) {

			"use strict";

			(function (Token) {
				Token[Token["BooleanLiteral"] = 1] = "BooleanLiteral";
				Token[Token["EOF"] = 2] = "EOF";
				Token[Token["Identifier"] = 3] = "Identifier";
				Token[Token["Keyword"] = 4] = "Keyword";
				Token[Token["NullLiteral"] = 5] = "NullLiteral";
				Token[Token["NumericLiteral"] = 6] = "NumericLiteral";
				Token[Token["Punctuator"] = 7] = "Punctuator";
				Token[Token["StringLiteral"] = 8] = "StringLiteral";
				Token[Token["RegularExpression"] = 9] = "RegularExpression";
				Token[Token["Template"] = 10] = "Template";
			})(exports.Token || (exports.Token = {}));
			var Token = exports.Token;
			;
			exports.TokenName = {};
			exports.TokenName[Token.BooleanLiteral] = 'Boolean';
			exports.TokenName[Token.EOF] = '<end>';
			exports.TokenName[Token.Identifier] = 'Identifier';
			exports.TokenName[Token.Keyword] = 'Keyword';
			exports.TokenName[Token.NullLiteral] = 'Null';
			exports.TokenName[Token.NumericLiteral] = 'Numeric';
			exports.TokenName[Token.Punctuator] = 'Punctuator';
			exports.TokenName[Token.StringLiteral] = 'String';
			exports.TokenName[Token.RegularExpression] = 'RegularExpression';
			exports.TokenName[Token.Template] = 'Template';

			/***/
		},
		/* 8 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var assert_1 = __webpack_require__(4);
			var messages_1 = __webpack_require__(5);
			var character_1 = __webpack_require__(9);
			var token_1 = __webpack_require__(7);
			function hexValue(ch) {
				return '0123456789abcdef'.indexOf(ch.toLowerCase());
			}
			function octalValue(ch) {
				return '01234567'.indexOf(ch);
			}
			var Scanner = function () {
				function Scanner(code, handler) {
					this.source = code;
					this.errorHandler = handler;
					this.trackComment = false;
					this.length = code.length;
					this.index = 0;
					this.lineNumber = code.length > 0 ? 1 : 0;
					this.lineStart = 0;
					this.curlyStack = [];
				}
				;
				Scanner.prototype.eof = function () {
					return this.index >= this.length;
				};
				;
				Scanner.prototype.throwUnexpectedToken = function (message) {
					if (message === void 0) {
						message = messages_1.Messages.UnexpectedTokenIllegal;
					}
					this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
				};
				;
				Scanner.prototype.tolerateUnexpectedToken = function () {
					this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, messages_1.Messages.UnexpectedTokenIllegal);
				};
				;
				// ECMA-262 11.4 Comments
				Scanner.prototype.skipSingleLineComment = function (offset) {
					var comments;
					var start, loc;
					if (this.trackComment) {
						comments = [];
						start = this.index - offset;
						loc = {
							start: {
								line: this.lineNumber,
								column: this.index - this.lineStart - offset
							},
							end: {}
						};
					}
					while (!this.eof()) {
						var ch = this.source.charCodeAt(this.index);
						++this.index;
						if (character_1.Character.isLineTerminator(ch)) {
							if (this.trackComment) {
								loc.end = {
									line: this.lineNumber,
									column: this.index - this.lineStart - 1
								};
								var entry = {
									multiLine: false,
									slice: [start + offset, this.index - 1],
									range: [start, this.index - 1],
									loc: loc
								};
								comments.push(entry);
							}
							if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
								++this.index;
							}
							++this.lineNumber;
							this.lineStart = this.index;
							return comments;
						}
					}
					if (this.trackComment) {
						loc.end = {
							line: this.lineNumber,
							column: this.index - this.lineStart
						};
						var entry = {
							multiLine: false,
							slice: [start + offset, this.index],
							range: [start, this.index],
							loc: loc
						};
						comments.push(entry);
					}
					return comments;
				};
				;
				Scanner.prototype.skipMultiLineComment = function () {
					var comments;
					var start, loc;
					if (this.trackComment) {
						comments = [];
						start = this.index - 2;
						loc = {
							start: {
								line: this.lineNumber,
								column: this.index - this.lineStart - 2
							},
							end: {}
						};
					}
					while (!this.eof()) {
						var ch = this.source.charCodeAt(this.index);
						if (character_1.Character.isLineTerminator(ch)) {
							if (ch === 0x0D && this.source.charCodeAt(this.index + 1) === 0x0A) {
								++this.index;
							}
							++this.lineNumber;
							++this.index;
							this.lineStart = this.index;
						} else if (ch === 0x2A) {
							// Block comment ends with '*/'.
							if (this.source.charCodeAt(this.index + 1) === 0x2F) {
								this.index += 2;
								if (this.trackComment) {
									loc.end = {
										line: this.lineNumber,
										column: this.index - this.lineStart
									};
									var entry = {
										multiLine: true,
										slice: [start + 2, this.index - 2],
										range: [start, this.index],
										loc: loc
									};
									comments.push(entry);
								}
								return comments;
							}
							++this.index;
						} else {
							++this.index;
						}
					}
					// Ran off the end of the file - the whole thing is a comment
					if (this.trackComment) {
						loc.end = {
							line: this.lineNumber,
							column: this.index - this.lineStart
						};
						var entry = {
							multiLine: true,
							slice: [start + 2, this.index],
							range: [start, this.index],
							loc: loc
						};
						comments.push(entry);
					}
					this.tolerateUnexpectedToken();
					return comments;
				};
				;
				Scanner.prototype.scanComments = function () {
					var comments;
					if (this.trackComment) {
						comments = [];
					}
					var start = this.index === 0;
					while (!this.eof()) {
						var ch = this.source.charCodeAt(this.index);
						if (character_1.Character.isWhiteSpace(ch)) {
							++this.index;
						} else if (character_1.Character.isLineTerminator(ch)) {
							++this.index;
							if (ch === 0x0D && this.source.charCodeAt(this.index) === 0x0A) {
								++this.index;
							}
							++this.lineNumber;
							this.lineStart = this.index;
							start = true;
						} else if (ch === 0x2F) {
							ch = this.source.charCodeAt(this.index + 1);
							if (ch === 0x2F) {
								this.index += 2;
								var comment = this.skipSingleLineComment(2);
								if (this.trackComment) {
									comments = comments.concat(comment);
								}
								start = true;
							} else if (ch === 0x2A) {
								this.index += 2;
								var comment = this.skipMultiLineComment();
								if (this.trackComment) {
									comments = comments.concat(comment);
								}
							} else {
								break;
							}
						} else if (start && ch === 0x2D) {
							// U+003E is '>'
							if (this.source.charCodeAt(this.index + 1) === 0x2D && this.source.charCodeAt(this.index + 2) === 0x3E) {
								// '-->' is a single-line comment
								this.index += 3;
								var comment = this.skipSingleLineComment(3);
								if (this.trackComment) {
									comments = comments.concat(comment);
								}
							} else {
								break;
							}
						} else if (ch === 0x3C) {
							if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
								this.index += 4; // `<!--`
								var comment = this.skipSingleLineComment(4);
								if (this.trackComment) {
									comments = comments.concat(comment);
								}
							} else {
								break;
							}
						} else {
							break;
						}
					}
					return comments;
				};
				;
				// ECMA-262 11.6.2.2 Future Reserved Words
				Scanner.prototype.isFutureReservedWord = function (id) {
					switch (id) {
						case 'enum':
						case 'export':
						case 'import':
						case 'super':
							return true;
						default:
							return false;
					}
				};
				;
				Scanner.prototype.isStrictModeReservedWord = function (id) {
					switch (id) {
						case 'implements':
						case 'interface':
						case 'package':
						case 'private':
						case 'protected':
						case 'public':
						case 'static':
						case 'yield':
						case 'let':
							return true;
						default:
							return false;
					}
				};
				;
				Scanner.prototype.isRestrictedWord = function (id) {
					return id === 'eval' || id === 'arguments';
				};
				;
				// ECMA-262 11.6.2.1 Keywords
				Scanner.prototype.isKeyword = function (id) {
					switch (id.length) {
						case 2:
							return id === 'if' || id === 'in' || id === 'do';
						case 3:
							return id === 'var' || id === 'for' || id === 'new' || id === 'try' || id === 'let';
						case 4:
							return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
						case 5:
							return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
						case 6:
							return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
						case 7:
							return id === 'default' || id === 'finally' || id === 'extends';
						case 8:
							return id === 'function' || id === 'continue' || id === 'debugger';
						case 10:
							return id === 'instanceof';
						default:
							return false;
					}
				};
				;
				Scanner.prototype.codePointAt = function (i) {
					var cp = this.source.charCodeAt(i);
					if (cp >= 0xD800 && cp <= 0xDBFF) {
						var second = this.source.charCodeAt(i + 1);
						if (second >= 0xDC00 && second <= 0xDFFF) {
							var first = cp;
							cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
						}
					}
					return cp;
				};
				;
				Scanner.prototype.scanHexEscape = function (prefix) {
					var len = prefix === 'u' ? 4 : 2;
					var code = 0;
					for (var i = 0; i < len; ++i) {
						if (!this.eof() && character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
							code = code * 16 + hexValue(this.source[this.index++]);
						} else {
							return '';
						}
					}
					return String.fromCharCode(code);
				};
				;
				Scanner.prototype.scanUnicodeCodePointEscape = function () {
					var ch = this.source[this.index];
					var code = 0;
					// At least, one hex digit is required.
					if (ch === '}') {
						this.throwUnexpectedToken();
					}
					while (!this.eof()) {
						ch = this.source[this.index++];
						if (!character_1.Character.isHexDigit(ch.charCodeAt(0))) {
							break;
						}
						code = code * 16 + hexValue(ch);
					}
					if (code > 0x10FFFF || ch !== '}') {
						this.throwUnexpectedToken();
					}
					return character_1.Character.fromCodePoint(code);
				};
				;
				Scanner.prototype.getIdentifier = function () {
					var start = this.index++;
					while (!this.eof()) {
						var ch = this.source.charCodeAt(this.index);
						if (ch === 0x5C) {
							// Blackslash (U+005C) marks Unicode escape sequence.
							this.index = start;
							return this.getComplexIdentifier();
						} else if (ch >= 0xD800 && ch < 0xDFFF) {
							// Need to handle surrogate pairs.
							this.index = start;
							return this.getComplexIdentifier();
						}
						if (character_1.Character.isIdentifierPart(ch)) {
							++this.index;
						} else {
							break;
						}
					}
					return this.source.slice(start, this.index);
				};
				;
				Scanner.prototype.getComplexIdentifier = function () {
					var cp = this.codePointAt(this.index);
					var id = character_1.Character.fromCodePoint(cp);
					this.index += id.length;
					// '\u' (U+005C, U+0075) denotes an escaped character.
					var ch;
					if (cp === 0x5C) {
						if (this.source.charCodeAt(this.index) !== 0x75) {
							this.throwUnexpectedToken();
						}
						++this.index;
						if (this.source[this.index] === '{') {
							++this.index;
							ch = this.scanUnicodeCodePointEscape();
						} else {
							ch = this.scanHexEscape('u');
							cp = ch.charCodeAt(0);
							if (!ch || ch === '\\' || !character_1.Character.isIdentifierStart(cp)) {
								this.throwUnexpectedToken();
							}
						}
						id = ch;
					}
					while (!this.eof()) {
						cp = this.codePointAt(this.index);
						if (!character_1.Character.isIdentifierPart(cp)) {
							break;
						}
						ch = character_1.Character.fromCodePoint(cp);
						id += ch;
						this.index += ch.length;
						// '\u' (U+005C, U+0075) denotes an escaped character.
						if (cp === 0x5C) {
							id = id.substr(0, id.length - 1);
							if (this.source.charCodeAt(this.index) !== 0x75) {
								this.throwUnexpectedToken();
							}
							++this.index;
							if (this.source[this.index] === '{') {
								++this.index;
								ch = this.scanUnicodeCodePointEscape();
							} else {
								ch = this.scanHexEscape('u');
								cp = ch.charCodeAt(0);
								if (!ch || ch === '\\' || !character_1.Character.isIdentifierPart(cp)) {
									this.throwUnexpectedToken();
								}
							}
							id += ch;
						}
					}
					return id;
				};
				;
				Scanner.prototype.octalToDecimal = function (ch) {
					// \0 is not octal escape sequence
					var octal = ch !== '0';
					var code = octalValue(ch);
					if (!this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
						octal = true;
						code = code * 8 + octalValue(this.source[this.index++]);
						// 3 digits are only allowed when string starts
						// with 0, 1, 2, 3
						if ('0123'.indexOf(ch) >= 0 && !this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
							code = code * 8 + octalValue(this.source[this.index++]);
						}
					}
					return {
						code: code,
						octal: octal
					};
				};
				;
				// ECMA-262 11.6 Names and Keywords
				Scanner.prototype.scanIdentifier = function () {
					var type;
					var start = this.index;
					// Backslash (U+005C) starts an escaped character.
					var id = this.source.charCodeAt(start) === 0x5C ? this.getComplexIdentifier() : this.getIdentifier();
					// There is no keyword or literal with only one character.
					// Thus, it must be an identifier.
					if (id.length === 1) {
						type = token_1.Token.Identifier;
					} else if (this.isKeyword(id)) {
						type = token_1.Token.Keyword;
					} else if (id === 'null') {
						type = token_1.Token.NullLiteral;
					} else if (id === 'true' || id === 'false') {
						type = token_1.Token.BooleanLiteral;
					} else {
						type = token_1.Token.Identifier;
					}
					return {
						type: type,
						value: id,
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				// ECMA-262 11.7 Punctuators
				Scanner.prototype.scanPunctuator = function () {
					var token = {
						type: token_1.Token.Punctuator,
						value: '',
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: this.index,
						end: this.index
					};
					// Check for most common single-character punctuators.
					var str = this.source[this.index];
					switch (str) {
						case '(':
						case '{':
							if (str === '{') {
								this.curlyStack.push('{');
							}
							++this.index;
							break;
						case '.':
							++this.index;
							if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
								// Spread operator: ...
								this.index += 2;
								str = '...';
							}
							break;
						case '}':
							++this.index;
							this.curlyStack.pop();
							break;
						case ')':
						case ';':
						case ',':
						case '[':
						case ']':
						case ':':
						case '?':
						case '~':
							++this.index;
							break;
						default:
							// 4-character punctuator.
							str = this.source.substr(this.index, 4);
							if (str === '>>>=') {
								this.index += 4;
							} else {
								// 3-character punctuators.
								str = str.substr(0, 3);
								if (str === '===' || str === '!==' || str === '>>>' || str === '<<=' || str === '>>=' || str === '**=') {
									this.index += 3;
								} else {
									// 2-character punctuators.
									str = str.substr(0, 2);
									if (str === '&&' || str === '||' || str === '==' || str === '!=' || str === '+=' || str === '-=' || str === '*=' || str === '/=' || str === '++' || str === '--' || str === '<<' || str === '>>' || str === '&=' || str === '|=' || str === '^=' || str === '%=' || str === '<=' || str === '>=' || str === '=>' || str === '**') {
										this.index += 2;
									} else {
										// 1-character punctuators.
										str = this.source[this.index];
										if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
											++this.index;
										}
									}
								}
							}
					}
					if (this.index === token.start) {
						this.throwUnexpectedToken();
					}
					token.end = this.index;
					token.value = str;
					return token;
				};
				;
				// ECMA-262 11.8.3 Numeric Literals
				Scanner.prototype.scanHexLiteral = function (start) {
					var number = '';
					while (!this.eof()) {
						if (!character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
							break;
						}
						number += this.source[this.index++];
					}
					if (number.length === 0) {
						this.throwUnexpectedToken();
					}
					if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
						this.throwUnexpectedToken();
					}
					return {
						type: token_1.Token.NumericLiteral,
						value: parseInt('0x' + number, 16),
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				Scanner.prototype.scanBinaryLiteral = function (start) {
					var number = '';
					var ch;
					while (!this.eof()) {
						ch = this.source[this.index];
						if (ch !== '0' && ch !== '1') {
							break;
						}
						number += this.source[this.index++];
					}
					if (number.length === 0) {
						// only 0b or 0B
						this.throwUnexpectedToken();
					}
					if (!this.eof()) {
						ch = this.source.charCodeAt(this.index);
						/* istanbul ignore else */
						if (character_1.Character.isIdentifierStart(ch) || character_1.Character.isDecimalDigit(ch)) {
							this.throwUnexpectedToken();
						}
					}
					return {
						type: token_1.Token.NumericLiteral,
						value: parseInt(number, 2),
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				Scanner.prototype.scanOctalLiteral = function (prefix, start) {
					var number = '';
					var octal = false;
					if (character_1.Character.isOctalDigit(prefix.charCodeAt(0))) {
						octal = true;
						number = '0' + this.source[this.index++];
					} else {
						++this.index;
					}
					while (!this.eof()) {
						if (!character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
							break;
						}
						number += this.source[this.index++];
					}
					if (!octal && number.length === 0) {
						// only 0o or 0O
						this.throwUnexpectedToken();
					}
					if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index)) || character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
						this.throwUnexpectedToken();
					}
					return {
						type: token_1.Token.NumericLiteral,
						value: parseInt(number, 8),
						octal: octal,
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				Scanner.prototype.isImplicitOctalLiteral = function () {
					// Implicit octal, unless there is a non-octal digit.
					// (Annex B.1.1 on Numeric Literals)
					for (var i = this.index + 1; i < this.length; ++i) {
						var ch = this.source[i];
						if (ch === '8' || ch === '9') {
							return false;
						}
						if (!character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
							return true;
						}
					}
					return true;
				};
				;
				Scanner.prototype.scanNumericLiteral = function () {
					var start = this.index;
					var ch = this.source[start];
					assert_1.assert(character_1.Character.isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');
					var number = '';
					if (ch !== '.') {
						number = this.source[this.index++];
						ch = this.source[this.index];
						// Hex number starts with '0x'.
						// Octal number starts with '0'.
						// Octal number in ES6 starts with '0o'.
						// Binary number in ES6 starts with '0b'.
						if (number === '0') {
							if (ch === 'x' || ch === 'X') {
								++this.index;
								return this.scanHexLiteral(start);
							}
							if (ch === 'b' || ch === 'B') {
								++this.index;
								return this.scanBinaryLiteral(start);
							}
							if (ch === 'o' || ch === 'O') {
								return this.scanOctalLiteral(ch, start);
							}
							if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
								if (this.isImplicitOctalLiteral()) {
									return this.scanOctalLiteral(ch, start);
								}
							}
						}
						while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
							number += this.source[this.index++];
						}
						ch = this.source[this.index];
					}
					if (ch === '.') {
						number += this.source[this.index++];
						while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
							number += this.source[this.index++];
						}
						ch = this.source[this.index];
					}
					if (ch === 'e' || ch === 'E') {
						number += this.source[this.index++];
						ch = this.source[this.index];
						if (ch === '+' || ch === '-') {
							number += this.source[this.index++];
						}
						if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
							while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
								number += this.source[this.index++];
							}
						} else {
							this.throwUnexpectedToken();
						}
					}
					if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
						this.throwUnexpectedToken();
					}
					return {
						type: token_1.Token.NumericLiteral,
						value: parseFloat(number),
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				// ECMA-262 11.8.4 String Literals
				Scanner.prototype.scanStringLiteral = function () {
					var start = this.index;
					var quote = this.source[start];
					assert_1.assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');
					++this.index;
					var octal = false;
					var str = '';
					while (!this.eof()) {
						var ch = this.source[this.index++];
						if (ch === quote) {
							quote = '';
							break;
						} else if (ch === '\\') {
							ch = this.source[this.index++];
							if (!ch || !character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
								switch (ch) {
									case 'u':
									case 'x':
										if (this.source[this.index] === '{') {
											++this.index;
											str += this.scanUnicodeCodePointEscape();
										} else {
											var unescaped = this.scanHexEscape(ch);
											if (!unescaped) {
												this.throwUnexpectedToken();
											}
											str += unescaped;
										}
										break;
									case 'n':
										str += '\n';
										break;
									case 'r':
										str += '\r';
										break;
									case 't':
										str += '\t';
										break;
									case 'b':
										str += '\b';
										break;
									case 'f':
										str += '\f';
										break;
									case 'v':
										str += '\x0B';
										break;
									case '8':
									case '9':
										str += ch;
										this.tolerateUnexpectedToken();
										break;
									default:
										if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
											var octToDec = this.octalToDecimal(ch);
											octal = octToDec.octal || octal;
											str += String.fromCharCode(octToDec.code);
										} else {
											str += ch;
										}
										break;
								}
							} else {
								++this.lineNumber;
								if (ch === '\r' && this.source[this.index] === '\n') {
									++this.index;
								}
								this.lineStart = this.index;
							}
						} else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
							break;
						} else {
							str += ch;
						}
					}
					if (quote !== '') {
						this.index = start;
						this.throwUnexpectedToken();
					}
					return {
						type: token_1.Token.StringLiteral,
						value: str,
						octal: octal,
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				// ECMA-262 11.8.6 Template Literal Lexical Components
				Scanner.prototype.scanTemplate = function () {
					var cooked = '';
					var terminated = false;
					var start = this.index;
					var head = this.source[start] === '`';
					var tail = false;
					var rawOffset = 2;
					++this.index;
					while (!this.eof()) {
						var ch = this.source[this.index++];
						if (ch === '`') {
							rawOffset = 1;
							tail = true;
							terminated = true;
							break;
						} else if (ch === '$') {
							if (this.source[this.index] === '{') {
								this.curlyStack.push('${');
								++this.index;
								terminated = true;
								break;
							}
							cooked += ch;
						} else if (ch === '\\') {
							ch = this.source[this.index++];
							if (!character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
								switch (ch) {
									case 'n':
										cooked += '\n';
										break;
									case 'r':
										cooked += '\r';
										break;
									case 't':
										cooked += '\t';
										break;
									case 'u':
									case 'x':
										if (this.source[this.index] === '{') {
											++this.index;
											cooked += this.scanUnicodeCodePointEscape();
										} else {
											var restore = this.index;
											var unescaped = this.scanHexEscape(ch);
											if (unescaped) {
												cooked += unescaped;
											} else {
												this.index = restore;
												cooked += ch;
											}
										}
										break;
									case 'b':
										cooked += '\b';
										break;
									case 'f':
										cooked += '\f';
										break;
									case 'v':
										cooked += '\v';
										break;
									default:
										if (ch === '0') {
											if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
												// Illegal: \01 \02 and so on
												this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
											}
											cooked += '\0';
										} else if (character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
											// Illegal: \1 \2
											this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
										} else {
											cooked += ch;
										}
										break;
								}
							} else {
								++this.lineNumber;
								if (ch === '\r' && this.source[this.index] === '\n') {
									++this.index;
								}
								this.lineStart = this.index;
							}
						} else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
							++this.lineNumber;
							if (ch === '\r' && this.source[this.index] === '\n') {
								++this.index;
							}
							this.lineStart = this.index;
							cooked += '\n';
						} else {
							cooked += ch;
						}
					}
					if (!terminated) {
						this.throwUnexpectedToken();
					}
					if (!head) {
						this.curlyStack.pop();
					}
					return {
						type: token_1.Token.Template,
						value: {
							cooked: cooked,
							raw: this.source.slice(start + 1, this.index - rawOffset)
						},
						head: head,
						tail: tail,
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				// ECMA-262 11.8.5 Regular Expression Literals
				Scanner.prototype.testRegExp = function (pattern, flags) {
					// The BMP character to use as a replacement for astral symbols when
					// translating an ES6 "u"-flagged pattern to an ES5-compatible
					// approximation.
					// Note: replacing with '\uFFFF' enables false positives in unlikely
					// scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
					// pattern that would not be detected by this substitution.
					var astralSubstitute = '\uFFFF';
					var tmp = pattern;
					var self = this;
					if (flags.indexOf('u') >= 0) {
						tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
							var codePoint = parseInt($1 || $2, 16);
							if (codePoint > 0x10FFFF) {
								self.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
							}
							if (codePoint <= 0xFFFF) {
								return String.fromCharCode(codePoint);
							}
							return astralSubstitute;
						}).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
					}
					// First, detect invalid regular expressions.
					try {
						RegExp(tmp);
					} catch (e) {
						this.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
					}
					// Return a regular expression object for this pattern-flag pair, or
					// `null` in case the current environment doesn't support the flags it
					// uses.
					try {
						return new RegExp(pattern, flags);
					} catch (exception) {
						/* istanbul ignore next */
						return null;
					}
				};
				;
				Scanner.prototype.scanRegExpBody = function () {
					var ch = this.source[this.index];
					assert_1.assert(ch === '/', 'Regular expression literal must start with a slash');
					var str = this.source[this.index++];
					var classMarker = false;
					var terminated = false;
					while (!this.eof()) {
						ch = this.source[this.index++];
						str += ch;
						if (ch === '\\') {
							ch = this.source[this.index++];
							// ECMA-262 7.8.5
							if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
								this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
							}
							str += ch;
						} else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
							this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
						} else if (classMarker) {
							if (ch === ']') {
								classMarker = false;
							}
						} else {
							if (ch === '/') {
								terminated = true;
								break;
							} else if (ch === '[') {
								classMarker = true;
							}
						}
					}
					if (!terminated) {
						this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
					}
					// Exclude leading and trailing slash.
					var body = str.substr(1, str.length - 2);
					return {
						value: body,
						literal: str
					};
				};
				;
				Scanner.prototype.scanRegExpFlags = function () {
					var str = '';
					var flags = '';
					while (!this.eof()) {
						var ch = this.source[this.index];
						if (!character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
							break;
						}
						++this.index;
						if (ch === '\\' && !this.eof()) {
							ch = this.source[this.index];
							if (ch === 'u') {
								++this.index;
								var restore = this.index;
								ch = this.scanHexEscape('u');
								if (ch) {
									flags += ch;
									for (str += '\\u'; restore < this.index; ++restore) {
										str += this.source[restore];
									}
								} else {
									this.index = restore;
									flags += 'u';
									str += '\\u';
								}
								this.tolerateUnexpectedToken();
							} else {
								str += '\\';
								this.tolerateUnexpectedToken();
							}
						} else {
							flags += ch;
							str += ch;
						}
					}
					return {
						value: flags,
						literal: str
					};
				};
				;
				Scanner.prototype.scanRegExp = function () {
					var start = this.index;
					var body = this.scanRegExpBody();
					var flags = this.scanRegExpFlags();
					var value = this.testRegExp(body.value, flags.value);
					return {
						type: token_1.Token.RegularExpression,
						value: value,
						literal: body.literal + flags.literal,
						regex: {
							pattern: body.value,
							flags: flags.value
						},
						lineNumber: this.lineNumber,
						lineStart: this.lineStart,
						start: start,
						end: this.index
					};
				};
				;
				Scanner.prototype.lex = function () {
					if (this.eof()) {
						return {
							type: token_1.Token.EOF,
							lineNumber: this.lineNumber,
							lineStart: this.lineStart,
							start: this.index,
							end: this.index
						};
					}
					var cp = this.source.charCodeAt(this.index);
					if (character_1.Character.isIdentifierStart(cp)) {
						return this.scanIdentifier();
					}
					// Very common: ( and ) and ;
					if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
						return this.scanPunctuator();
					}
					// String literal starts with single quote (U+0027) or double quote (U+0022).
					if (cp === 0x27 || cp === 0x22) {
						return this.scanStringLiteral();
					}
					// Dot (.) U+002E can also start a floating-point number, hence the need
					// to check the next character.
					if (cp === 0x2E) {
						if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
							return this.scanNumericLiteral();
						}
						return this.scanPunctuator();
					}
					if (character_1.Character.isDecimalDigit(cp)) {
						return this.scanNumericLiteral();
					}
					// Template literals start with ` (U+0060) for template head
					// or } (U+007D) for template middle or template tail.
					if (cp === 0x60 || cp === 0x7D && this.curlyStack[this.curlyStack.length - 1] === '${') {
						return this.scanTemplate();
					}
					// Possible identifier start in a surrogate pair.
					if (cp >= 0xD800 && cp < 0xDFFF) {
						if (character_1.Character.isIdentifierStart(this.codePointAt(this.index))) {
							return this.scanIdentifier();
						}
					}
					return this.scanPunctuator();
				};
				;
				return Scanner;
			}();
			exports.Scanner = Scanner;

			/***/
		},
		/* 9 */
		/***/function (module, exports) {

			"use strict";
			// See also tools/generate-unicode-regex.js.

			var Regex = {
				// Unicode v8.0.0 NonAsciiIdentifierStart:
				NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
				// Unicode v8.0.0 NonAsciiIdentifierPart:
				NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
			};
			exports.Character = {
				fromCodePoint: function fromCodePoint(cp) {
					return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
				},
				// ECMA-262 11.2 White Space
				isWhiteSpace: function isWhiteSpace(cp) {
					return cp === 0x20 || cp === 0x09 || cp === 0x0B || cp === 0x0C || cp === 0xA0 || cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0;
				},
				// ECMA-262 11.3 Line Terminators
				isLineTerminator: function isLineTerminator(cp) {
					return cp === 0x0A || cp === 0x0D || cp === 0x2028 || cp === 0x2029;
				},
				// ECMA-262 11.6 Identifier Names and Identifiers
				isIdentifierStart: function isIdentifierStart(cp) {
					return cp === 0x24 || cp === 0x5F || cp >= 0x41 && cp <= 0x5A || cp >= 0x61 && cp <= 0x7A || cp === 0x5C || cp >= 0x80 && Regex.NonAsciiIdentifierStart.test(exports.Character.fromCodePoint(cp));
				},
				isIdentifierPart: function isIdentifierPart(cp) {
					return cp === 0x24 || cp === 0x5F || cp >= 0x41 && cp <= 0x5A || cp >= 0x61 && cp <= 0x7A || cp >= 0x30 && cp <= 0x39 || cp === 0x5C || cp >= 0x80 && Regex.NonAsciiIdentifierPart.test(exports.Character.fromCodePoint(cp));
				},
				// ECMA-262 11.8.3 Numeric Literals
				isDecimalDigit: function isDecimalDigit(cp) {
					return cp >= 0x30 && cp <= 0x39; // 0..9
				},
				isHexDigit: function isHexDigit(cp) {
					return cp >= 0x30 && cp <= 0x39 || cp >= 0x41 && cp <= 0x46 || cp >= 0x61 && cp <= 0x66; // a..f
				},
				isOctalDigit: function isOctalDigit(cp) {
					return cp >= 0x30 && cp <= 0x37; // 0..7
				}
			};

			/***/
		},
		/* 10 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var syntax_1 = __webpack_require__(2);
			var ArrayExpression = function () {
				function ArrayExpression(elements) {
					this.type = syntax_1.Syntax.ArrayExpression;
					this.elements = elements;
				}
				return ArrayExpression;
			}();
			exports.ArrayExpression = ArrayExpression;
			var ArrayPattern = function () {
				function ArrayPattern(elements) {
					this.type = syntax_1.Syntax.ArrayPattern;
					this.elements = elements;
				}
				return ArrayPattern;
			}();
			exports.ArrayPattern = ArrayPattern;
			var ArrowFunctionExpression = function () {
				function ArrowFunctionExpression(params, body, expression) {
					this.type = syntax_1.Syntax.ArrowFunctionExpression;
					this.id = null;
					this.params = params;
					this.body = body;
					this.generator = false;
					this.expression = expression;
				}
				return ArrowFunctionExpression;
			}();
			exports.ArrowFunctionExpression = ArrowFunctionExpression;
			var AssignmentExpression = function () {
				function AssignmentExpression(operator, left, right) {
					this.type = syntax_1.Syntax.AssignmentExpression;
					this.operator = operator;
					this.left = left;
					this.right = right;
				}
				return AssignmentExpression;
			}();
			exports.AssignmentExpression = AssignmentExpression;
			var AssignmentPattern = function () {
				function AssignmentPattern(left, right) {
					this.type = syntax_1.Syntax.AssignmentPattern;
					this.left = left;
					this.right = right;
				}
				return AssignmentPattern;
			}();
			exports.AssignmentPattern = AssignmentPattern;
			var BinaryExpression = function () {
				function BinaryExpression(operator, left, right) {
					var logical = operator === '||' || operator === '&&';
					this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
					this.operator = operator;
					this.left = left;
					this.right = right;
				}
				return BinaryExpression;
			}();
			exports.BinaryExpression = BinaryExpression;
			var BlockStatement = function () {
				function BlockStatement(body) {
					this.type = syntax_1.Syntax.BlockStatement;
					this.body = body;
				}
				return BlockStatement;
			}();
			exports.BlockStatement = BlockStatement;
			var BreakStatement = function () {
				function BreakStatement(label) {
					this.type = syntax_1.Syntax.BreakStatement;
					this.label = label;
				}
				return BreakStatement;
			}();
			exports.BreakStatement = BreakStatement;
			var CallExpression = function () {
				function CallExpression(callee, args) {
					this.type = syntax_1.Syntax.CallExpression;
					this.callee = callee;
					this.arguments = args;
				}
				return CallExpression;
			}();
			exports.CallExpression = CallExpression;
			var CatchClause = function () {
				function CatchClause(param, body) {
					this.type = syntax_1.Syntax.CatchClause;
					this.param = param;
					this.body = body;
				}
				return CatchClause;
			}();
			exports.CatchClause = CatchClause;
			var ClassBody = function () {
				function ClassBody(body) {
					this.type = syntax_1.Syntax.ClassBody;
					this.body = body;
				}
				return ClassBody;
			}();
			exports.ClassBody = ClassBody;
			var ClassDeclaration = function () {
				function ClassDeclaration(id, superClass, body) {
					this.type = syntax_1.Syntax.ClassDeclaration;
					this.id = id;
					this.superClass = superClass;
					this.body = body;
				}
				return ClassDeclaration;
			}();
			exports.ClassDeclaration = ClassDeclaration;
			var ClassExpression = function () {
				function ClassExpression(id, superClass, body) {
					this.type = syntax_1.Syntax.ClassExpression;
					this.id = id;
					this.superClass = superClass;
					this.body = body;
				}
				return ClassExpression;
			}();
			exports.ClassExpression = ClassExpression;
			var ComputedMemberExpression = function () {
				function ComputedMemberExpression(object, property) {
					this.type = syntax_1.Syntax.MemberExpression;
					this.computed = true;
					this.object = object;
					this.property = property;
				}
				return ComputedMemberExpression;
			}();
			exports.ComputedMemberExpression = ComputedMemberExpression;
			var ConditionalExpression = function () {
				function ConditionalExpression(test, consequent, alternate) {
					this.type = syntax_1.Syntax.ConditionalExpression;
					this.test = test;
					this.consequent = consequent;
					this.alternate = alternate;
				}
				return ConditionalExpression;
			}();
			exports.ConditionalExpression = ConditionalExpression;
			var ContinueStatement = function () {
				function ContinueStatement(label) {
					this.type = syntax_1.Syntax.ContinueStatement;
					this.label = label;
				}
				return ContinueStatement;
			}();
			exports.ContinueStatement = ContinueStatement;
			var DebuggerStatement = function () {
				function DebuggerStatement() {
					this.type = syntax_1.Syntax.DebuggerStatement;
				}
				return DebuggerStatement;
			}();
			exports.DebuggerStatement = DebuggerStatement;
			var Directive = function () {
				function Directive(expression, directive) {
					this.type = syntax_1.Syntax.ExpressionStatement;
					this.expression = expression;
					this.directive = directive;
				}
				return Directive;
			}();
			exports.Directive = Directive;
			var DoWhileStatement = function () {
				function DoWhileStatement(body, test) {
					this.type = syntax_1.Syntax.DoWhileStatement;
					this.body = body;
					this.test = test;
				}
				return DoWhileStatement;
			}();
			exports.DoWhileStatement = DoWhileStatement;
			var EmptyStatement = function () {
				function EmptyStatement() {
					this.type = syntax_1.Syntax.EmptyStatement;
				}
				return EmptyStatement;
			}();
			exports.EmptyStatement = EmptyStatement;
			var ExportAllDeclaration = function () {
				function ExportAllDeclaration(source) {
					this.type = syntax_1.Syntax.ExportAllDeclaration;
					this.source = source;
				}
				return ExportAllDeclaration;
			}();
			exports.ExportAllDeclaration = ExportAllDeclaration;
			var ExportDefaultDeclaration = function () {
				function ExportDefaultDeclaration(declaration) {
					this.type = syntax_1.Syntax.ExportDefaultDeclaration;
					this.declaration = declaration;
				}
				return ExportDefaultDeclaration;
			}();
			exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
			var ExportNamedDeclaration = function () {
				function ExportNamedDeclaration(declaration, specifiers, source) {
					this.type = syntax_1.Syntax.ExportNamedDeclaration;
					this.declaration = declaration;
					this.specifiers = specifiers;
					this.source = source;
				}
				return ExportNamedDeclaration;
			}();
			exports.ExportNamedDeclaration = ExportNamedDeclaration;
			var ExportSpecifier = function () {
				function ExportSpecifier(local, exported) {
					this.type = syntax_1.Syntax.ExportSpecifier;
					this.exported = exported;
					this.local = local;
				}
				return ExportSpecifier;
			}();
			exports.ExportSpecifier = ExportSpecifier;
			var ExpressionStatement = function () {
				function ExpressionStatement(expression) {
					this.type = syntax_1.Syntax.ExpressionStatement;
					this.expression = expression;
				}
				return ExpressionStatement;
			}();
			exports.ExpressionStatement = ExpressionStatement;
			var ForInStatement = function () {
				function ForInStatement(left, right, body) {
					this.type = syntax_1.Syntax.ForInStatement;
					this.left = left;
					this.right = right;
					this.body = body;
					this.each = false;
				}
				return ForInStatement;
			}();
			exports.ForInStatement = ForInStatement;
			var ForOfStatement = function () {
				function ForOfStatement(left, right, body) {
					this.type = syntax_1.Syntax.ForOfStatement;
					this.left = left;
					this.right = right;
					this.body = body;
				}
				return ForOfStatement;
			}();
			exports.ForOfStatement = ForOfStatement;
			var ForStatement = function () {
				function ForStatement(init, test, update, body) {
					this.type = syntax_1.Syntax.ForStatement;
					this.init = init;
					this.test = test;
					this.update = update;
					this.body = body;
				}
				return ForStatement;
			}();
			exports.ForStatement = ForStatement;
			var FunctionDeclaration = function () {
				function FunctionDeclaration(id, params, body, generator) {
					this.type = syntax_1.Syntax.FunctionDeclaration;
					this.id = id;
					this.params = params;
					this.body = body;
					this.generator = generator;
					this.expression = false;
				}
				return FunctionDeclaration;
			}();
			exports.FunctionDeclaration = FunctionDeclaration;
			var FunctionExpression = function () {
				function FunctionExpression(id, params, body, generator) {
					this.type = syntax_1.Syntax.FunctionExpression;
					this.id = id;
					this.params = params;
					this.body = body;
					this.generator = generator;
					this.expression = false;
				}
				return FunctionExpression;
			}();
			exports.FunctionExpression = FunctionExpression;
			var Identifier = function () {
				function Identifier(name) {
					this.type = syntax_1.Syntax.Identifier;
					this.name = name;
				}
				return Identifier;
			}();
			exports.Identifier = Identifier;
			var IfStatement = function () {
				function IfStatement(test, consequent, alternate) {
					this.type = syntax_1.Syntax.IfStatement;
					this.test = test;
					this.consequent = consequent;
					this.alternate = alternate;
				}
				return IfStatement;
			}();
			exports.IfStatement = IfStatement;
			var ImportDeclaration = function () {
				function ImportDeclaration(specifiers, source) {
					this.type = syntax_1.Syntax.ImportDeclaration;
					this.specifiers = specifiers;
					this.source = source;
				}
				return ImportDeclaration;
			}();
			exports.ImportDeclaration = ImportDeclaration;
			var ImportDefaultSpecifier = function () {
				function ImportDefaultSpecifier(local) {
					this.type = syntax_1.Syntax.ImportDefaultSpecifier;
					this.local = local;
				}
				return ImportDefaultSpecifier;
			}();
			exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
			var ImportNamespaceSpecifier = function () {
				function ImportNamespaceSpecifier(local) {
					this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
					this.local = local;
				}
				return ImportNamespaceSpecifier;
			}();
			exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
			var ImportSpecifier = function () {
				function ImportSpecifier(local, imported) {
					this.type = syntax_1.Syntax.ImportSpecifier;
					this.local = local;
					this.imported = imported;
				}
				return ImportSpecifier;
			}();
			exports.ImportSpecifier = ImportSpecifier;
			var LabeledStatement = function () {
				function LabeledStatement(label, body) {
					this.type = syntax_1.Syntax.LabeledStatement;
					this.label = label;
					this.body = body;
				}
				return LabeledStatement;
			}();
			exports.LabeledStatement = LabeledStatement;
			var Literal = function () {
				function Literal(value, raw) {
					this.type = syntax_1.Syntax.Literal;
					this.value = value;
					this.raw = raw;
				}
				return Literal;
			}();
			exports.Literal = Literal;
			var MetaProperty = function () {
				function MetaProperty(meta, property) {
					this.type = syntax_1.Syntax.MetaProperty;
					this.meta = meta;
					this.property = property;
				}
				return MetaProperty;
			}();
			exports.MetaProperty = MetaProperty;
			var MethodDefinition = function () {
				function MethodDefinition(key, computed, value, kind, isStatic) {
					this.type = syntax_1.Syntax.MethodDefinition;
					this.key = key;
					this.computed = computed;
					this.value = value;
					this.kind = kind;
					this.static = isStatic;
				}
				return MethodDefinition;
			}();
			exports.MethodDefinition = MethodDefinition;
			var NewExpression = function () {
				function NewExpression(callee, args) {
					this.type = syntax_1.Syntax.NewExpression;
					this.callee = callee;
					this.arguments = args;
				}
				return NewExpression;
			}();
			exports.NewExpression = NewExpression;
			var ObjectExpression = function () {
				function ObjectExpression(properties) {
					this.type = syntax_1.Syntax.ObjectExpression;
					this.properties = properties;
				}
				return ObjectExpression;
			}();
			exports.ObjectExpression = ObjectExpression;
			var ObjectPattern = function () {
				function ObjectPattern(properties) {
					this.type = syntax_1.Syntax.ObjectPattern;
					this.properties = properties;
				}
				return ObjectPattern;
			}();
			exports.ObjectPattern = ObjectPattern;
			var Program = function () {
				function Program(body, sourceType) {
					this.type = syntax_1.Syntax.Program;
					this.body = body;
					this.sourceType = sourceType;
				}
				return Program;
			}();
			exports.Program = Program;
			var Property = function () {
				function Property(kind, key, computed, value, method, shorthand) {
					this.type = syntax_1.Syntax.Property;
					this.key = key;
					this.computed = computed;
					this.value = value;
					this.kind = kind;
					this.method = method;
					this.shorthand = shorthand;
				}
				return Property;
			}();
			exports.Property = Property;
			var RegexLiteral = function () {
				function RegexLiteral(value, raw, regex) {
					this.type = syntax_1.Syntax.Literal;
					this.value = value;
					this.raw = raw;
					this.regex = regex;
				}
				return RegexLiteral;
			}();
			exports.RegexLiteral = RegexLiteral;
			var RestElement = function () {
				function RestElement(argument) {
					this.type = syntax_1.Syntax.RestElement;
					this.argument = argument;
				}
				return RestElement;
			}();
			exports.RestElement = RestElement;
			var ReturnStatement = function () {
				function ReturnStatement(argument) {
					this.type = syntax_1.Syntax.ReturnStatement;
					this.argument = argument;
				}
				return ReturnStatement;
			}();
			exports.ReturnStatement = ReturnStatement;
			var SequenceExpression = function () {
				function SequenceExpression(expressions) {
					this.type = syntax_1.Syntax.SequenceExpression;
					this.expressions = expressions;
				}
				return SequenceExpression;
			}();
			exports.SequenceExpression = SequenceExpression;
			var SpreadElement = function () {
				function SpreadElement(argument) {
					this.type = syntax_1.Syntax.SpreadElement;
					this.argument = argument;
				}
				return SpreadElement;
			}();
			exports.SpreadElement = SpreadElement;
			var StaticMemberExpression = function () {
				function StaticMemberExpression(object, property) {
					this.type = syntax_1.Syntax.MemberExpression;
					this.computed = false;
					this.object = object;
					this.property = property;
				}
				return StaticMemberExpression;
			}();
			exports.StaticMemberExpression = StaticMemberExpression;
			var Super = function () {
				function Super() {
					this.type = syntax_1.Syntax.Super;
				}
				return Super;
			}();
			exports.Super = Super;
			var SwitchCase = function () {
				function SwitchCase(test, consequent) {
					this.type = syntax_1.Syntax.SwitchCase;
					this.test = test;
					this.consequent = consequent;
				}
				return SwitchCase;
			}();
			exports.SwitchCase = SwitchCase;
			var SwitchStatement = function () {
				function SwitchStatement(discriminant, cases) {
					this.type = syntax_1.Syntax.SwitchStatement;
					this.discriminant = discriminant;
					this.cases = cases;
				}
				return SwitchStatement;
			}();
			exports.SwitchStatement = SwitchStatement;
			var TaggedTemplateExpression = function () {
				function TaggedTemplateExpression(tag, quasi) {
					this.type = syntax_1.Syntax.TaggedTemplateExpression;
					this.tag = tag;
					this.quasi = quasi;
				}
				return TaggedTemplateExpression;
			}();
			exports.TaggedTemplateExpression = TaggedTemplateExpression;
			var TemplateElement = function () {
				function TemplateElement(value, tail) {
					this.type = syntax_1.Syntax.TemplateElement;
					this.value = value;
					this.tail = tail;
				}
				return TemplateElement;
			}();
			exports.TemplateElement = TemplateElement;
			var TemplateLiteral = function () {
				function TemplateLiteral(quasis, expressions) {
					this.type = syntax_1.Syntax.TemplateLiteral;
					this.quasis = quasis;
					this.expressions = expressions;
				}
				return TemplateLiteral;
			}();
			exports.TemplateLiteral = TemplateLiteral;
			var ThisExpression = function () {
				function ThisExpression() {
					this.type = syntax_1.Syntax.ThisExpression;
				}
				return ThisExpression;
			}();
			exports.ThisExpression = ThisExpression;
			var ThrowStatement = function () {
				function ThrowStatement(argument) {
					this.type = syntax_1.Syntax.ThrowStatement;
					this.argument = argument;
				}
				return ThrowStatement;
			}();
			exports.ThrowStatement = ThrowStatement;
			var TryStatement = function () {
				function TryStatement(block, handler, finalizer) {
					this.type = syntax_1.Syntax.TryStatement;
					this.block = block;
					this.handler = handler;
					this.finalizer = finalizer;
				}
				return TryStatement;
			}();
			exports.TryStatement = TryStatement;
			var UnaryExpression = function () {
				function UnaryExpression(operator, argument) {
					this.type = syntax_1.Syntax.UnaryExpression;
					this.operator = operator;
					this.argument = argument;
					this.prefix = true;
				}
				return UnaryExpression;
			}();
			exports.UnaryExpression = UnaryExpression;
			var UpdateExpression = function () {
				function UpdateExpression(operator, argument, prefix) {
					this.type = syntax_1.Syntax.UpdateExpression;
					this.operator = operator;
					this.argument = argument;
					this.prefix = prefix;
				}
				return UpdateExpression;
			}();
			exports.UpdateExpression = UpdateExpression;
			var VariableDeclaration = function () {
				function VariableDeclaration(declarations, kind) {
					this.type = syntax_1.Syntax.VariableDeclaration;
					this.declarations = declarations;
					this.kind = kind;
				}
				return VariableDeclaration;
			}();
			exports.VariableDeclaration = VariableDeclaration;
			var VariableDeclarator = function () {
				function VariableDeclarator(id, init) {
					this.type = syntax_1.Syntax.VariableDeclarator;
					this.id = id;
					this.init = init;
				}
				return VariableDeclarator;
			}();
			exports.VariableDeclarator = VariableDeclarator;
			var WhileStatement = function () {
				function WhileStatement(test, body) {
					this.type = syntax_1.Syntax.WhileStatement;
					this.test = test;
					this.body = body;
				}
				return WhileStatement;
			}();
			exports.WhileStatement = WhileStatement;
			var WithStatement = function () {
				function WithStatement(object, body) {
					this.type = syntax_1.Syntax.WithStatement;
					this.object = object;
					this.body = body;
				}
				return WithStatement;
			}();
			exports.WithStatement = WithStatement;
			var YieldExpression = function () {
				function YieldExpression(argument, delegate) {
					this.type = syntax_1.Syntax.YieldExpression;
					this.argument = argument;
					this.delegate = delegate;
				}
				return YieldExpression;
			}();
			exports.YieldExpression = YieldExpression;

			/***/
		},
		/* 11 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";
			/* istanbul ignore next */

			var __extends = this && this.__extends || function (d, b) {
				for (var p in b) {
					if (b.hasOwnProperty(p)) d[p] = b[p];
				}function __() {
					this.constructor = d;
				}
				d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
			};
			var character_1 = __webpack_require__(9);
			var token_1 = __webpack_require__(7);
			var parser_1 = __webpack_require__(3);
			var xhtml_entities_1 = __webpack_require__(12);
			var jsx_syntax_1 = __webpack_require__(13);
			var Node = __webpack_require__(10);
			var JSXNode = __webpack_require__(14);
			var JSXToken;
			(function (JSXToken) {
				JSXToken[JSXToken["Identifier"] = 100] = "Identifier";
				JSXToken[JSXToken["Text"] = 101] = "Text";
			})(JSXToken || (JSXToken = {}));
			token_1.TokenName[JSXToken.Identifier] = 'JSXIdentifier';
			token_1.TokenName[JSXToken.Text] = 'JSXText';
			// Fully qualified element name, e.g. <svg:path> returns "svg:path"
			function getQualifiedElementName(elementName) {
				var qualifiedName;
				switch (elementName.type) {
					case jsx_syntax_1.JSXSyntax.JSXIdentifier:
						var id = elementName;
						qualifiedName = id.name;
						break;
					case jsx_syntax_1.JSXSyntax.JSXNamespacedName:
						var ns = elementName;
						qualifiedName = getQualifiedElementName(ns.namespace) + ':' + getQualifiedElementName(ns.name);
						break;
					case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
						var expr = elementName;
						qualifiedName = getQualifiedElementName(expr.object) + '.' + getQualifiedElementName(expr.property);
						break;
				}
				return qualifiedName;
			}
			var JSXParser = function (_super) {
				__extends(JSXParser, _super);
				function JSXParser(code, options, delegate) {
					_super.call(this, code, options, delegate);
				}
				JSXParser.prototype.parsePrimaryExpression = function () {
					return this.match('<') ? this.parseJSXRoot() : _super.prototype.parsePrimaryExpression.call(this);
				};
				JSXParser.prototype.startJSX = function () {
					// Unwind the scanner before the lookahead token.
					this.scanner.index = this.startMarker.index;
					this.scanner.lineNumber = this.startMarker.lineNumber;
					this.scanner.lineStart = this.startMarker.lineStart;
				};
				JSXParser.prototype.finishJSX = function () {
					// Prime the next lookahead.
					this.nextToken();
				};
				JSXParser.prototype.reenterJSX = function () {
					this.startJSX();
					this.expectJSX('}');
					// Pop the closing '}' added from the lookahead.
					if (this.config.tokens) {
						this.tokens.pop();
					}
				};
				JSXParser.prototype.createJSXNode = function () {
					this.collectComments();
					return {
						index: this.scanner.index,
						line: this.scanner.lineNumber,
						column: this.scanner.index - this.scanner.lineStart
					};
				};
				JSXParser.prototype.createJSXChildNode = function () {
					return {
						index: this.scanner.index,
						line: this.scanner.lineNumber,
						column: this.scanner.index - this.scanner.lineStart
					};
				};
				JSXParser.prototype.scanXHTMLEntity = function (quote) {
					var result = '&';
					var valid = true;
					var terminated = false;
					var numeric = false;
					var hex = false;
					while (!this.scanner.eof() && valid && !terminated) {
						var ch = this.scanner.source[this.scanner.index];
						if (ch === quote) {
							break;
						}
						terminated = ch === ';';
						result += ch;
						++this.scanner.index;
						if (!terminated) {
							switch (result.length) {
								case 2:
									// e.g. '&#123;'
									numeric = ch === '#';
									break;
								case 3:
									if (numeric) {
										// e.g. '&#x41;'
										hex = ch === 'x';
										valid = hex || character_1.Character.isDecimalDigit(ch.charCodeAt(0));
										numeric = numeric && !hex;
									}
									break;
								default:
									valid = valid && !(numeric && !character_1.Character.isDecimalDigit(ch.charCodeAt(0)));
									valid = valid && !(hex && !character_1.Character.isHexDigit(ch.charCodeAt(0)));
									break;
							}
						}
					}
					if (valid && terminated && result.length > 2) {
						// e.g. '&#x41;' becomes just '#x41'
						var str = result.substr(1, result.length - 2);
						if (numeric && str.length > 1) {
							result = String.fromCharCode(parseInt(str.substr(1), 10));
						} else if (hex && str.length > 2) {
							result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
						} else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
							result = xhtml_entities_1.XHTMLEntities[str];
						}
					}
					return result;
				};
				// Scan the next JSX token. This replaces Scanner#lex when in JSX mode.
				JSXParser.prototype.lexJSX = function () {
					var cp = this.scanner.source.charCodeAt(this.scanner.index);
					// < > / : = { }
					if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
						var value = this.scanner.source[this.scanner.index++];
						return {
							type: token_1.Token.Punctuator,
							value: value,
							lineNumber: this.scanner.lineNumber,
							lineStart: this.scanner.lineStart,
							start: this.scanner.index - 1,
							end: this.scanner.index
						};
					}
					// " '
					if (cp === 34 || cp === 39) {
						var start = this.scanner.index;
						var quote = this.scanner.source[this.scanner.index++];
						var str = '';
						while (!this.scanner.eof()) {
							var ch = this.scanner.source[this.scanner.index++];
							if (ch === quote) {
								break;
							} else if (ch === '&') {
								str += this.scanXHTMLEntity(quote);
							} else {
								str += ch;
							}
						}
						return {
							type: token_1.Token.StringLiteral,
							value: str,
							lineNumber: this.scanner.lineNumber,
							lineStart: this.scanner.lineStart,
							start: start,
							end: this.scanner.index
						};
					}
					// ... or .
					if (cp === 46) {
						var n1 = this.scanner.source.charCodeAt(this.scanner.index + 1);
						var n2 = this.scanner.source.charCodeAt(this.scanner.index + 2);
						var value = n1 === 46 && n2 === 46 ? '...' : '.';
						var start = this.scanner.index;
						this.scanner.index += value.length;
						return {
							type: token_1.Token.Punctuator,
							value: value,
							lineNumber: this.scanner.lineNumber,
							lineStart: this.scanner.lineStart,
							start: start,
							end: this.scanner.index
						};
					}
					// `
					if (cp === 96) {
						// Only placeholder, since it will be rescanned as a real assignment expression.
						return {
							type: token_1.Token.Template,
							lineNumber: this.scanner.lineNumber,
							lineStart: this.scanner.lineStart,
							start: this.scanner.index,
							end: this.scanner.index
						};
					}
					// Identifer can not contain backslash (char code 92).
					if (character_1.Character.isIdentifierStart(cp) && cp !== 92) {
						var start = this.scanner.index;
						++this.scanner.index;
						while (!this.scanner.eof()) {
							var ch = this.scanner.source.charCodeAt(this.scanner.index);
							if (character_1.Character.isIdentifierPart(ch) && ch !== 92) {
								++this.scanner.index;
							} else if (ch === 45) {
								// Hyphen (char code 45) can be part of an identifier.
								++this.scanner.index;
							} else {
								break;
							}
						}
						var id = this.scanner.source.slice(start, this.scanner.index);
						return {
							type: JSXToken.Identifier,
							value: id,
							lineNumber: this.scanner.lineNumber,
							lineStart: this.scanner.lineStart,
							start: start,
							end: this.scanner.index
						};
					}
					this.scanner.throwUnexpectedToken();
				};
				JSXParser.prototype.nextJSXToken = function () {
					this.collectComments();
					this.startMarker.index = this.scanner.index;
					this.startMarker.lineNumber = this.scanner.lineNumber;
					this.startMarker.lineStart = this.scanner.lineStart;
					var token = this.lexJSX();
					this.lastMarker.index = this.scanner.index;
					this.lastMarker.lineNumber = this.scanner.lineNumber;
					this.lastMarker.lineStart = this.scanner.lineStart;
					if (this.config.tokens) {
						this.tokens.push(this.convertToken(token));
					}
					return token;
				};
				JSXParser.prototype.nextJSXText = function () {
					this.startMarker.index = this.scanner.index;
					this.startMarker.lineNumber = this.scanner.lineNumber;
					this.startMarker.lineStart = this.scanner.lineStart;
					var start = this.scanner.index;
					var text = '';
					while (!this.scanner.eof()) {
						var ch = this.scanner.source[this.scanner.index];
						if (ch === '{' || ch === '<') {
							break;
						}
						++this.scanner.index;
						text += ch;
						if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
							++this.scanner.lineNumber;
							if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
								++this.scanner.index;
							}
							this.scanner.lineStart = this.scanner.index;
						}
					}
					this.lastMarker.index = this.scanner.index;
					this.lastMarker.lineNumber = this.scanner.lineNumber;
					this.lastMarker.lineStart = this.scanner.lineStart;
					var token = {
						type: JSXToken.Text,
						value: text,
						lineNumber: this.scanner.lineNumber,
						lineStart: this.scanner.lineStart,
						start: start,
						end: this.scanner.index
					};
					if (text.length > 0 && this.config.tokens) {
						this.tokens.push(this.convertToken(token));
					}
					return token;
				};
				JSXParser.prototype.peekJSXToken = function () {
					var previousIndex = this.scanner.index;
					var previousLineNumber = this.scanner.lineNumber;
					var previousLineStart = this.scanner.lineStart;
					this.scanner.scanComments();
					var next = this.lexJSX();
					this.scanner.index = previousIndex;
					this.scanner.lineNumber = previousLineNumber;
					this.scanner.lineStart = previousLineStart;
					return next;
				};
				// Expect the next JSX token to match the specified punctuator.
				// If not, an exception will be thrown.
				JSXParser.prototype.expectJSX = function (value) {
					var token = this.nextJSXToken();
					if (token.type !== token_1.Token.Punctuator || token.value !== value) {
						this.throwUnexpectedToken(token);
					}
				};
				// Return true if the next JSX token matches the specified punctuator.
				JSXParser.prototype.matchJSX = function (value) {
					var next = this.peekJSXToken();
					return next.type === token_1.Token.Punctuator && next.value === value;
				};
				JSXParser.prototype.parseJSXIdentifier = function () {
					var node = this.createJSXNode();
					var token = this.nextJSXToken();
					if (token.type !== JSXToken.Identifier) {
						this.throwUnexpectedToken(token);
					}
					return this.finalize(node, new JSXNode.JSXIdentifier(token.value));
				};
				JSXParser.prototype.parseJSXElementName = function () {
					var node = this.createJSXNode();
					var elementName = this.parseJSXIdentifier();
					if (this.matchJSX(':')) {
						var namespace = elementName;
						this.expectJSX(':');
						var name_1 = this.parseJSXIdentifier();
						elementName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_1));
					} else if (this.matchJSX('.')) {
						while (this.matchJSX('.')) {
							var object = elementName;
							this.expectJSX('.');
							var property = this.parseJSXIdentifier();
							elementName = this.finalize(node, new JSXNode.JSXMemberExpression(object, property));
						}
					}
					return elementName;
				};
				JSXParser.prototype.parseJSXAttributeName = function () {
					var node = this.createJSXNode();
					var attributeName;
					var identifier = this.parseJSXIdentifier();
					if (this.matchJSX(':')) {
						var namespace = identifier;
						this.expectJSX(':');
						var name_2 = this.parseJSXIdentifier();
						attributeName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_2));
					} else {
						attributeName = identifier;
					}
					return attributeName;
				};
				JSXParser.prototype.parseJSXStringLiteralAttribute = function () {
					var node = this.createJSXNode();
					var token = this.nextJSXToken();
					if (token.type !== token_1.Token.StringLiteral) {
						this.throwUnexpectedToken(token);
					}
					var raw = this.getTokenRaw(token);
					return this.finalize(node, new Node.Literal(token.value, raw));
				};
				JSXParser.prototype.parseJSXExpressionAttribute = function () {
					var node = this.createJSXNode();
					this.expectJSX('{');
					this.finishJSX();
					if (this.match('}')) {
						this.tolerateError('JSX attributes must only be assigned a non-empty expression');
					}
					var expression = this.parseAssignmentExpression();
					this.reenterJSX();
					return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
				};
				JSXParser.prototype.parseJSXAttributeValue = function () {
					return this.matchJSX('{') ? this.parseJSXExpressionAttribute() : this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
				};
				JSXParser.prototype.parseJSXNameValueAttribute = function () {
					var node = this.createJSXNode();
					var name = this.parseJSXAttributeName();
					var value = null;
					if (this.matchJSX('=')) {
						this.expectJSX('=');
						value = this.parseJSXAttributeValue();
					}
					return this.finalize(node, new JSXNode.JSXAttribute(name, value));
				};
				JSXParser.prototype.parseJSXSpreadAttribute = function () {
					var node = this.createJSXNode();
					this.expectJSX('{');
					this.expectJSX('...');
					this.finishJSX();
					var argument = this.parseAssignmentExpression();
					this.reenterJSX();
					return this.finalize(node, new JSXNode.JSXSpreadAttribute(argument));
				};
				JSXParser.prototype.parseJSXAttributes = function () {
					var attributes = [];
					while (!this.matchJSX('/') && !this.matchJSX('>')) {
						var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() : this.parseJSXNameValueAttribute();
						attributes.push(attribute);
					}
					return attributes;
				};
				JSXParser.prototype.parseJSXOpeningElement = function () {
					var node = this.createJSXNode();
					this.expectJSX('<');
					var name = this.parseJSXElementName();
					var attributes = this.parseJSXAttributes();
					var selfClosing = this.matchJSX('/');
					if (selfClosing) {
						this.expectJSX('/');
					}
					this.expectJSX('>');
					return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
				};
				JSXParser.prototype.parseJSXBoundaryElement = function () {
					var node = this.createJSXNode();
					this.expectJSX('<');
					if (this.matchJSX('/')) {
						this.expectJSX('/');
						var name_3 = this.parseJSXElementName();
						this.expectJSX('>');
						return this.finalize(node, new JSXNode.JSXClosingElement(name_3));
					}
					var name = this.parseJSXElementName();
					var attributes = this.parseJSXAttributes();
					var selfClosing = this.matchJSX('/');
					if (selfClosing) {
						this.expectJSX('/');
					}
					this.expectJSX('>');
					return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
				};
				JSXParser.prototype.parseJSXEmptyExpression = function () {
					var node = this.createJSXChildNode();
					this.collectComments();
					this.lastMarker.index = this.scanner.index;
					this.lastMarker.lineNumber = this.scanner.lineNumber;
					this.lastMarker.lineStart = this.scanner.lineStart;
					return this.finalize(node, new JSXNode.JSXEmptyExpression());
				};
				JSXParser.prototype.parseJSXExpressionContainer = function () {
					var node = this.createJSXNode();
					this.expectJSX('{');
					var expression;
					if (this.matchJSX('}')) {
						expression = this.parseJSXEmptyExpression();
						this.expectJSX('}');
					} else {
						this.finishJSX();
						expression = this.parseAssignmentExpression();
						this.reenterJSX();
					}
					return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
				};
				JSXParser.prototype.parseJSXChildren = function () {
					var children = [];
					while (!this.scanner.eof()) {
						var node = this.createJSXChildNode();
						var token = this.nextJSXText();
						if (token.start < token.end) {
							var raw = this.getTokenRaw(token);
							var child = this.finalize(node, new JSXNode.JSXText(token.value, raw));
							children.push(child);
						}
						if (this.scanner.source[this.scanner.index] === '{') {
							var container = this.parseJSXExpressionContainer();
							children.push(container);
						} else {
							break;
						}
					}
					return children;
				};
				JSXParser.prototype.parseComplexJSXElement = function (el) {
					var stack = [];
					while (!this.scanner.eof()) {
						el.children = el.children.concat(this.parseJSXChildren());
						var node = this.createJSXChildNode();
						var element = this.parseJSXBoundaryElement();
						if (element.type === jsx_syntax_1.JSXSyntax.JSXOpeningElement) {
							var opening = element;
							if (opening.selfClosing) {
								var child = this.finalize(node, new JSXNode.JSXElement(opening, [], null));
								el.children.push(child);
							} else {
								stack.push(el);
								el = { node: node, opening: opening, closing: null, children: [] };
							}
						}
						if (element.type === jsx_syntax_1.JSXSyntax.JSXClosingElement) {
							el.closing = element;
							var open_1 = getQualifiedElementName(el.opening.name);
							var close_1 = getQualifiedElementName(el.closing.name);
							if (open_1 !== close_1) {
								this.tolerateError('Expected corresponding JSX closing tag for %0', open_1);
							}
							if (stack.length > 0) {
								var child = this.finalize(el.node, new JSXNode.JSXElement(el.opening, el.children, el.closing));
								el = stack.pop();
								el.children.push(child);
							} else {
								break;
							}
						}
					}
					return el;
				};
				JSXParser.prototype.parseJSXElement = function () {
					var node = this.createJSXNode();
					var opening = this.parseJSXOpeningElement();
					var children = [];
					var closing = null;
					if (!opening.selfClosing) {
						var el = this.parseComplexJSXElement({ node: node, opening: opening, closing: closing, children: children });
						children = el.children;
						closing = el.closing;
					}
					return this.finalize(node, new JSXNode.JSXElement(opening, children, closing));
				};
				JSXParser.prototype.parseJSXRoot = function () {
					// Pop the opening '<' added from the lookahead.
					if (this.config.tokens) {
						this.tokens.pop();
					}
					this.startJSX();
					var element = this.parseJSXElement();
					this.finishJSX();
					return element;
				};
				return JSXParser;
			}(parser_1.Parser);
			exports.JSXParser = JSXParser;

			/***/
		},
		/* 12 */
		/***/function (module, exports) {

			// Generated by generate-xhtml-entities.js. DO NOT MODIFY!
			"use strict";

			exports.XHTMLEntities = {
				quot: '"',
				amp: '&',
				apos: '\'',
				gt: '>',
				nbsp: '\xA0',
				iexcl: '\xA1',
				cent: '\xA2',
				pound: '\xA3',
				curren: '\xA4',
				yen: '\xA5',
				brvbar: '\xA6',
				sect: '\xA7',
				uml: '\xA8',
				copy: '\xA9',
				ordf: '\xAA',
				laquo: '\xAB',
				not: '\xAC',
				shy: '\xAD',
				reg: '\xAE',
				macr: '\xAF',
				deg: '\xB0',
				plusmn: '\xB1',
				sup2: '\xB2',
				sup3: '\xB3',
				acute: '\xB4',
				micro: '\xB5',
				para: '\xB6',
				middot: '\xB7',
				cedil: '\xB8',
				sup1: '\xB9',
				ordm: '\xBA',
				raquo: '\xBB',
				frac14: '\xBC',
				frac12: '\xBD',
				frac34: '\xBE',
				iquest: '\xBF',
				Agrave: '\xC0',
				Aacute: '\xC1',
				Acirc: '\xC2',
				Atilde: '\xC3',
				Auml: '\xC4',
				Aring: '\xC5',
				AElig: '\xC6',
				Ccedil: '\xC7',
				Egrave: '\xC8',
				Eacute: '\xC9',
				Ecirc: '\xCA',
				Euml: '\xCB',
				Igrave: '\xCC',
				Iacute: '\xCD',
				Icirc: '\xCE',
				Iuml: '\xCF',
				ETH: '\xD0',
				Ntilde: '\xD1',
				Ograve: '\xD2',
				Oacute: '\xD3',
				Ocirc: '\xD4',
				Otilde: '\xD5',
				Ouml: '\xD6',
				times: '\xD7',
				Oslash: '\xD8',
				Ugrave: '\xD9',
				Uacute: '\xDA',
				Ucirc: '\xDB',
				Uuml: '\xDC',
				Yacute: '\xDD',
				THORN: '\xDE',
				szlig: '\xDF',
				agrave: '\xE0',
				aacute: '\xE1',
				acirc: '\xE2',
				atilde: '\xE3',
				auml: '\xE4',
				aring: '\xE5',
				aelig: '\xE6',
				ccedil: '\xE7',
				egrave: '\xE8',
				eacute: '\xE9',
				ecirc: '\xEA',
				euml: '\xEB',
				igrave: '\xEC',
				iacute: '\xED',
				icirc: '\xEE',
				iuml: '\xEF',
				eth: '\xF0',
				ntilde: '\xF1',
				ograve: '\xF2',
				oacute: '\xF3',
				ocirc: '\xF4',
				otilde: '\xF5',
				ouml: '\xF6',
				divide: '\xF7',
				oslash: '\xF8',
				ugrave: '\xF9',
				uacute: '\xFA',
				ucirc: '\xFB',
				uuml: '\xFC',
				yacute: '\xFD',
				thorn: '\xFE',
				yuml: '\xFF',
				OElig: '\u0152',
				oelig: '\u0153',
				Scaron: '\u0160',
				scaron: '\u0161',
				Yuml: '\u0178',
				fnof: '\u0192',
				circ: '\u02C6',
				tilde: '\u02DC',
				Alpha: '\u0391',
				Beta: '\u0392',
				Gamma: '\u0393',
				Delta: '\u0394',
				Epsilon: '\u0395',
				Zeta: '\u0396',
				Eta: '\u0397',
				Theta: '\u0398',
				Iota: '\u0399',
				Kappa: '\u039A',
				Lambda: '\u039B',
				Mu: '\u039C',
				Nu: '\u039D',
				Xi: '\u039E',
				Omicron: '\u039F',
				Pi: '\u03A0',
				Rho: '\u03A1',
				Sigma: '\u03A3',
				Tau: '\u03A4',
				Upsilon: '\u03A5',
				Phi: '\u03A6',
				Chi: '\u03A7',
				Psi: '\u03A8',
				Omega: '\u03A9',
				alpha: '\u03B1',
				beta: '\u03B2',
				gamma: '\u03B3',
				delta: '\u03B4',
				epsilon: '\u03B5',
				zeta: '\u03B6',
				eta: '\u03B7',
				theta: '\u03B8',
				iota: '\u03B9',
				kappa: '\u03BA',
				lambda: '\u03BB',
				mu: '\u03BC',
				nu: '\u03BD',
				xi: '\u03BE',
				omicron: '\u03BF',
				pi: '\u03C0',
				rho: '\u03C1',
				sigmaf: '\u03C2',
				sigma: '\u03C3',
				tau: '\u03C4',
				upsilon: '\u03C5',
				phi: '\u03C6',
				chi: '\u03C7',
				psi: '\u03C8',
				omega: '\u03C9',
				thetasym: '\u03D1',
				upsih: '\u03D2',
				piv: '\u03D6',
				ensp: '\u2002',
				emsp: '\u2003',
				thinsp: '\u2009',
				zwnj: '\u200C',
				zwj: '\u200D',
				lrm: '\u200E',
				rlm: '\u200F',
				ndash: '\u2013',
				mdash: '\u2014',
				lsquo: '\u2018',
				rsquo: '\u2019',
				sbquo: '\u201A',
				ldquo: '\u201C',
				rdquo: '\u201D',
				bdquo: '\u201E',
				dagger: '\u2020',
				Dagger: '\u2021',
				bull: '\u2022',
				hellip: '\u2026',
				permil: '\u2030',
				prime: '\u2032',
				Prime: '\u2033',
				lsaquo: '\u2039',
				rsaquo: '\u203A',
				oline: '\u203E',
				frasl: '\u2044',
				euro: '\u20AC',
				image: '\u2111',
				weierp: '\u2118',
				real: '\u211C',
				trade: '\u2122',
				alefsym: '\u2135',
				larr: '\u2190',
				uarr: '\u2191',
				rarr: '\u2192',
				darr: '\u2193',
				harr: '\u2194',
				crarr: '\u21B5',
				lArr: '\u21D0',
				uArr: '\u21D1',
				rArr: '\u21D2',
				dArr: '\u21D3',
				hArr: '\u21D4',
				forall: '\u2200',
				part: '\u2202',
				exist: '\u2203',
				empty: '\u2205',
				nabla: '\u2207',
				isin: '\u2208',
				notin: '\u2209',
				ni: '\u220B',
				prod: '\u220F',
				sum: '\u2211',
				minus: '\u2212',
				lowast: '\u2217',
				radic: '\u221A',
				prop: '\u221D',
				infin: '\u221E',
				ang: '\u2220',
				and: '\u2227',
				or: '\u2228',
				cap: '\u2229',
				cup: '\u222A',
				int: '\u222B',
				there4: '\u2234',
				sim: '\u223C',
				cong: '\u2245',
				asymp: '\u2248',
				ne: '\u2260',
				equiv: '\u2261',
				le: '\u2264',
				ge: '\u2265',
				sub: '\u2282',
				sup: '\u2283',
				nsub: '\u2284',
				sube: '\u2286',
				supe: '\u2287',
				oplus: '\u2295',
				otimes: '\u2297',
				perp: '\u22A5',
				sdot: '\u22C5',
				lceil: '\u2308',
				rceil: '\u2309',
				lfloor: '\u230A',
				rfloor: '\u230B',
				loz: '\u25CA',
				spades: '\u2660',
				clubs: '\u2663',
				hearts: '\u2665',
				diams: '\u2666',
				lang: '\u27E8',
				rang: '\u27E9'
			};

			/***/
		},
		/* 13 */
		/***/function (module, exports) {

			"use strict";

			exports.JSXSyntax = {
				JSXAttribute: 'JSXAttribute',
				JSXClosingElement: 'JSXClosingElement',
				JSXElement: 'JSXElement',
				JSXEmptyExpression: 'JSXEmptyExpression',
				JSXExpressionContainer: 'JSXExpressionContainer',
				JSXIdentifier: 'JSXIdentifier',
				JSXMemberExpression: 'JSXMemberExpression',
				JSXNamespacedName: 'JSXNamespacedName',
				JSXOpeningElement: 'JSXOpeningElement',
				JSXSpreadAttribute: 'JSXSpreadAttribute',
				JSXText: 'JSXText'
			};

			/***/
		},
		/* 14 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var jsx_syntax_1 = __webpack_require__(13);
			var JSXClosingElement = function () {
				function JSXClosingElement(name) {
					this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
					this.name = name;
				}
				return JSXClosingElement;
			}();
			exports.JSXClosingElement = JSXClosingElement;
			var JSXElement = function () {
				function JSXElement(openingElement, children, closingElement) {
					this.type = jsx_syntax_1.JSXSyntax.JSXElement;
					this.openingElement = openingElement;
					this.children = children;
					this.closingElement = closingElement;
				}
				return JSXElement;
			}();
			exports.JSXElement = JSXElement;
			var JSXEmptyExpression = function () {
				function JSXEmptyExpression() {
					this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
				}
				return JSXEmptyExpression;
			}();
			exports.JSXEmptyExpression = JSXEmptyExpression;
			var JSXExpressionContainer = function () {
				function JSXExpressionContainer(expression) {
					this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
					this.expression = expression;
				}
				return JSXExpressionContainer;
			}();
			exports.JSXExpressionContainer = JSXExpressionContainer;
			var JSXIdentifier = function () {
				function JSXIdentifier(name) {
					this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
					this.name = name;
				}
				return JSXIdentifier;
			}();
			exports.JSXIdentifier = JSXIdentifier;
			var JSXMemberExpression = function () {
				function JSXMemberExpression(object, property) {
					this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
					this.object = object;
					this.property = property;
				}
				return JSXMemberExpression;
			}();
			exports.JSXMemberExpression = JSXMemberExpression;
			var JSXAttribute = function () {
				function JSXAttribute(name, value) {
					this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
					this.name = name;
					this.value = value;
				}
				return JSXAttribute;
			}();
			exports.JSXAttribute = JSXAttribute;
			var JSXNamespacedName = function () {
				function JSXNamespacedName(namespace, name) {
					this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
					this.namespace = namespace;
					this.name = name;
				}
				return JSXNamespacedName;
			}();
			exports.JSXNamespacedName = JSXNamespacedName;
			var JSXOpeningElement = function () {
				function JSXOpeningElement(name, selfClosing, attributes) {
					this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
					this.name = name;
					this.selfClosing = selfClosing;
					this.attributes = attributes;
				}
				return JSXOpeningElement;
			}();
			exports.JSXOpeningElement = JSXOpeningElement;
			var JSXSpreadAttribute = function () {
				function JSXSpreadAttribute(argument) {
					this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
					this.argument = argument;
				}
				return JSXSpreadAttribute;
			}();
			exports.JSXSpreadAttribute = JSXSpreadAttribute;
			var JSXText = function () {
				function JSXText(value, raw) {
					this.type = jsx_syntax_1.JSXSyntax.JSXText;
					this.value = value;
					this.raw = raw;
				}
				return JSXText;
			}();
			exports.JSXText = JSXText;

			/***/
		},
		/* 15 */
		/***/function (module, exports, __webpack_require__) {

			"use strict";

			var scanner_1 = __webpack_require__(8);
			var error_handler_1 = __webpack_require__(6);
			var token_1 = __webpack_require__(7);
			var Reader = function () {
				function Reader() {
					this.values = [];
					this.curly = this.paren = -1;
				}
				;
				// A function following one of those tokens is an expression.
				Reader.prototype.beforeFunctionExpression = function (t) {
					return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new', 'return', 'case', 'delete', 'throw', 'void',
					// assignment operators
					'=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', ',',
					// binary/unary operators
					'+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&', '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=', '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
				};
				;
				// Determine if forward slash (/) is an operator or part of a regular expression
				// https://github.com/mozilla/sweet.js/wiki/design
				Reader.prototype.isRegexStart = function () {
					var previous = this.values[this.values.length - 1];
					var regex = previous !== null;
					switch (previous) {
						case 'this':
						case ']':
							regex = false;
							break;
						case ')':
							var check = this.values[this.paren - 1];
							regex = check === 'if' || check === 'while' || check === 'for' || check === 'with';
							break;
						case '}':
							// Dividing a function by anything makes little sense,
							// but we have to check for that.
							regex = false;
							if (this.values[this.curly - 3] === 'function') {
								// Anonymous function, e.g. function(){} /42
								var check_1 = this.values[this.curly - 4];
								regex = check_1 ? !this.beforeFunctionExpression(check_1) : false;
							} else if (this.values[this.curly - 4] === 'function') {
								// Named function, e.g. function f(){} /42/
								var check_2 = this.values[this.curly - 5];
								regex = check_2 ? !this.beforeFunctionExpression(check_2) : true;
							}
					}
					return regex;
				};
				;
				Reader.prototype.push = function (token) {
					if (token.type === token_1.Token.Punctuator || token.type === token_1.Token.Keyword) {
						if (token.value === '{') {
							this.curly = this.values.length;
						} else if (token.value === '(') {
							this.paren = this.values.length;
						}
						this.values.push(token.value);
					} else {
						this.values.push(null);
					}
				};
				;
				return Reader;
			}();
			var Tokenizer = function () {
				function Tokenizer(code, config) {
					this.errorHandler = new error_handler_1.ErrorHandler();
					this.errorHandler.tolerant = config ? typeof config.tolerant === 'boolean' && config.tolerant : false;
					this.scanner = new scanner_1.Scanner(code, this.errorHandler);
					this.scanner.trackComment = config ? typeof config.comment === 'boolean' && config.comment : false;
					this.trackRange = config ? typeof config.range === 'boolean' && config.range : false;
					this.trackLoc = config ? typeof config.loc === 'boolean' && config.loc : false;
					this.buffer = [];
					this.reader = new Reader();
				}
				;
				Tokenizer.prototype.errors = function () {
					return this.errorHandler.errors;
				};
				;
				Tokenizer.prototype.getNextToken = function () {
					if (this.buffer.length === 0) {
						var comments = this.scanner.scanComments();
						if (this.scanner.trackComment) {
							for (var i = 0; i < comments.length; ++i) {
								var e = comments[i];
								var comment = void 0;
								var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
								comment = {
									type: e.multiLine ? 'BlockComment' : 'LineComment',
									value: value
								};
								if (this.trackRange) {
									comment.range = e.range;
								}
								if (this.trackLoc) {
									comment.loc = e.loc;
								}
								this.buffer.push(comment);
							}
						}
						if (!this.scanner.eof()) {
							var loc = void 0;
							if (this.trackLoc) {
								loc = {
									start: {
										line: this.scanner.lineNumber,
										column: this.scanner.index - this.scanner.lineStart
									},
									end: {}
								};
							}
							var token = void 0;
							if (this.scanner.source[this.scanner.index] === '/') {
								token = this.reader.isRegexStart() ? this.scanner.scanRegExp() : this.scanner.scanPunctuator();
							} else {
								token = this.scanner.lex();
							}
							this.reader.push(token);
							var entry = void 0;
							entry = {
								type: token_1.TokenName[token.type],
								value: this.scanner.source.slice(token.start, token.end)
							};
							if (this.trackRange) {
								entry.range = [token.start, token.end];
							}
							if (this.trackLoc) {
								loc.end = {
									line: this.scanner.lineNumber,
									column: this.scanner.index - this.scanner.lineStart
								};
								entry.loc = loc;
							}
							if (token.regex) {
								entry.regex = token.regex;
							}
							this.buffer.push(entry);
						}
					}
					return this.buffer.shift();
				};
				;
				return Tokenizer;
			}();
			exports.Tokenizer = Tokenizer;

			/***/
		}
		/******/])
	);
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)(module)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.endianness = function () {
    return 'LE';
};

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname;
    } else return '';
};

exports.loadavg = function () {
    return [];
};

exports.uptime = function () {
    return 0;
};

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () {
    return [];
};

exports.type = function () {
    return 'Browser';
};

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces = exports.getNetworkInterfaces = function () {
    return {};
};

exports.arch = function () {
    return 'javascript';
};

exports.platform = function () {
    return 'browser';
};

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function (root) {

	/** Detect free variables */
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
		root = freeGlobal;
	}

	/**
  * The `punycode` object.
  * @name punycode
  * @type Object
  */
	var punycode,


	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647,
	    // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	    tMin = 1,
	    tMax = 26,
	    skew = 38,
	    damp = 700,
	    initialBias = 72,
	    initialN = 128,
	    // 0x80
	delimiter = '-',
	    // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	    regexNonASCII = /[^\x20-\x7E]/,
	    // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
	    // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},


	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	    floor = Math.floor,
	    stringFromCharCode = String.fromCharCode,


	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
  * A generic error utility function.
  * @private
  * @param {String} type The error type.
  * @returns {Error} Throws a `RangeError` with the applicable error message.
  */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
  * A generic `Array#map` utility function.
  * @private
  * @param {Array} array The array to iterate over.
  * @param {Function} callback The function that gets called for every array
  * item.
  * @returns {Array} A new array of values returned by the callback function.
  */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
  * A simple `Array#map`-like wrapper to work with domain name strings or email
  * addresses.
  * @private
  * @param {String} domain The domain name or email address.
  * @param {Function} callback The function that gets called for every
  * character.
  * @returns {Array} A new string of characters returned by the callback
  * function.
  */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
  * Creates a string based on an array of numeric code points.
  * @see `punycode.ucs2.decode`
  * @memberOf punycode.ucs2
  * @name encode
  * @param {Array} codePoints The array of numeric code points.
  * @returns {String} The new Unicode string (UCS-2).
  */
	function ucs2encode(array) {
		return map(array, function (value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
  * Converts a basic code point into a digit/integer.
  * @see `digitToBasic()`
  * @private
  * @param {Number} codePoint The basic numeric code point value.
  * @returns {Number} The numeric value of a basic code point (for use in
  * representing integers) in the range `0` to `base - 1`, or `base` if
  * the code point does not represent a value.
  */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
  * Converts a digit/integer into a basic code point.
  * @see `basicToDigit()`
  * @private
  * @param {Number} digit The numeric value of a basic code point.
  * @returns {Number} The basic code point whose value (when used for
  * representing integers) is `digit`, which needs to be in the range
  * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  * used; else, the lowercase form is used. The behavior is undefined
  * if `flag` is non-zero and `digit` has no uppercase form.
  */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
  * Bias adaptation function as per section 3.4 of RFC 3492.
  * https://tools.ietf.org/html/rfc3492#section-3.4
  * @private
  */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
  * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  * symbols.
  * @memberOf punycode
  * @param {String} input The Punycode string of ASCII-only symbols.
  * @returns {String} The resulting string of Unicode symbols.
  */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,

		/** Cached calculation results */
		baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base;; /* no condition */k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;
			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);
		}

		return ucs2encode(output);
	}

	/**
  * Converts a string of Unicode symbols (e.g. a domain name label) to a
  * Punycode string of ASCII-only symbols.
  * @memberOf punycode
  * @param {String} input The string of Unicode symbols.
  * @returns {String} The resulting Punycode string of ASCII-only symbols.
  */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],

		/** `inputLength` will hold the number of code points in `input`. */
		inputLength,

		/** Cached calculation results */
		handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base;; /* no condition */k += base) {
						t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;
		}
		return output.join('');
	}

	/**
  * Converts a Punycode string representing a domain name or an email address
  * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  * it doesn't matter if you call it on a string that has already been
  * converted to Unicode.
  * @memberOf punycode
  * @param {String} input The Punycoded domain name or email address to
  * convert to Unicode.
  * @returns {String} The Unicode representation of the given Punycode
  * string.
  */
	function toUnicode(input) {
		return mapDomain(input, function (string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	}

	/**
  * Converts a Unicode string representing a domain name or an email address to
  * Punycode. Only the non-ASCII parts of the domain name will be converted,
  * i.e. it doesn't matter if you call it with a domain that's already in
  * ASCII.
  * @memberOf punycode
  * @param {String} input The domain name or email address to convert, as a
  * Unicode string.
  * @returns {String} The Punycode representation of the given domain name or
  * email address.
  */
	function toASCII(input) {
		return mapDomain(input, function (string) {
			return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
		'version': '1.4.1',
		/**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(18)) == 'object' && __webpack_require__(18)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)(module), __webpack_require__(10)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(50);
exports.encode = exports.stringify = __webpack_require__(51);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  isString: function isString(arg) {
    return typeof arg === 'string';
  },
  isObject: function isObject(arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
  },
  isNull: function isNull(arg) {
    return arg === null;
  },
  isNullOrUndefined: function isNullOrUndefined(arg) {
    return arg == null;
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function TempCtor() {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isBuffer(arg) {
  return arg && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;
exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }
  return debugs[set];
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\x1B[' + inspect.colors[style][0] + 'm' + str + '\x1B[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) &&
  // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect &&
  // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(55);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(54);

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(5)))

/***/ })
/******/ ]);