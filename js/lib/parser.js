/**
 * capability parser functions
 *
 * Copyright (c) 2013 commenthol
 * Released under the MIT License
 */

"use strict";

/**
 * Module dependencies
 */
var jsSelect = require('js-select');
var extend   = require('./util/extend').extend;
var merge    = require('./util/extend').merge;
var select   = require('./util/select').select;

var M = module.exports;

/**
 * prepare parser with a parsed user-agent-string from ua-parser
 *
 * @param {Object} tree
 * @return parser methods
 */
M.parser = function (tree) {

	var applyDefaultCaps = true;
	var recursion = {};
	var F = {};
	var self = {};

	self.cap = {};
	self.uaparsed = {};

	/**
	 * print capabilities tree
	 */
	F.printTree = function () {
		console.log(JSON.stringify(tree, null, ' '));
	};

	/**
	 * get capabilities tree
	 */
	F.getTree = function () {
		return tree;
	};

	/**
	 * initialization
	 */
	var init = function (uaparsed) {
		recursion = { cnt: 0, max: 100, ok: true };
		if (uaparsed) {
			applyDefaultCaps = true;
			self.cap = {};
			self.uaparsed = extend({ string: '', os: {}, ua: {}, device: {}}, self.uaparsed, uaparsed);
		}
	};

	/**
	 * apply default capabilities if exists
	 */
	var defaultCaps = function () {
		if (applyDefaultCaps) {
			getCap(tree.default);
			applyDefaultCaps = false; // apply default capabilities only once
		}
	};

	/**
	 * get a single capability per item
	 *
	 * @param {Object} item : item found after search
	 * @param {String} type : item type ("os"|"ua"|"device")
	 * @param {Object} string : string for regex test (defaults to uaparsed.string)
	 */
	var getCap = function (item, type, string) {
		var i,
			j,
			k,
			tmp,
			arr;

		string = string || self.uaparsed.string;

		//~ console.log('>>item:', item);
		if (item) {
			if (item.capabilities) {
				self.cap = merge(self.cap, item.capabilities || {});
				//~ console.log('>>cap:', self.cap);
			}
			if (item.regexes) {
				for (i = 0; i < item.regexes.length; i += 1) {
					for (j = 0; j < item.regexes[i].length; j += 1) {
						tmp = item.regexes[i][j];

						if (tmp.capabilities &&
							((tmp.regex    &&   tmp.regex.test(string)) ||
								(tmp.regex_not && ! tmp.regex_not.test(string)))
						){
							self.cap = merge(self.cap, tmp.capabilities);

							// dive into regexes chain
							if (type === 'device') {
								arr = ['model'];
							}
							else {
								arr = ['major', 'minor'];
							}
							for (k = 0; k < arr.length; k += 1) {
								if (tmp[arr[k]]) {
									getCap(tmp[arr[k]], type, self.uaparsed[type][arr[k]]);
								}
							}

							break;
						}
					}
				}
			}
		}
	};

	/**
	 * flatten all extends before merging
	 *
	 * @param {Object} item : item containing `extends`
	 */
	F.flattenExtend = function (item) {
		var i, j, k,
			tmp, arr;

		init();
		self.cap = {};

		//~ console.log('>>item:', item);
		if (item) {
			if (item.extends && recursion.ok) {
				for (i=0; i < item.extends.length; i+=1) {
					tmp = item.extends[i];
					//~ console.log('>>tmp:', recursion.cnt, tmp);
					recursion.cnt += 1;
					if (recursion.cnt > recursion.max) {
						console.log("max recursion depth " + recursion.max + " reached");
						recursion.ok = false;
						break;
					}
					else {
						if (tmp.device) {
							deviceCaps(tmp.device);
						}
						else if (tmp.os) {
							osuaCaps(tmp.os, 'os');
						}
						else if (tmp.ua) {
							osuaCaps(tmp.ua, 'ua');
						}
						recursion.cnt -= 1;
					}
				}
				//~ console.log('>>cap:', self.cap);
				item.capabilities = merge(self.cap, item.capabilities || {});
				delete (item.extends);
			}
			return item;
		}
		return;
	};

	/**
	 * collect information of missing leaves in the caps tree(s)
	 * 
	 * @param {Object} item - item selected
	 * @param {string} type - (os|ua|device)
	 * @param {string} mode - (family|major|minor|brand|model)
	 * @param {string} name - name of object which is missing 
	 */
	var notFound = function(item, type, mode, name) {
		if (item === null) {
			if (!self.cap._notFound) {
				self.cap._notFound = {};
			}
			if (!self.cap._notFound[type]) {
				self.cap._notFound[type] = {};
			}
			self.cap._notFound[type][mode] = name;
		}
	}

	/**
	 * get capabilty per os or ua family
	 * stores the result in `self.cap`
	 *
	 * @param {Object} obj : object to seach in tree
	 * @param {String} type : ("os"|"ua") search either for os or ua (defaults to "os")
	 * @param {Object} selector : selector to start search from
	 */
	var osuaCaps = function (obj, type, selector) {
		var 
			i,
			mode, item, sel,
			modes = [ 'family', 'major', 'minor' ];

		type = type || 'os';
		selector = selector || tree;
		sel = select(selector, [ type ]);

		//~ console.log('>>obj', obj);
		for (i=0; i<modes.length; i++) {
			mode = modes[i];
			if (sel && obj && obj[mode]) {
				item = select(sel, [ mode ]);
				getCap(item, type, obj[mode]);
				item = select(item, [ obj[mode] ]);
				notFound(item, type, mode, obj[mode]);
				getCap(item, type);
				uaOverwrite(item);
				sel = item;
			}
			else {
				break;
			}
		}
	};

	/**
	 * get capabilty per device
	 * stores the result in `self.cap`
	 *
	 * @param {Object} obj : object to seach in tree
	 * @param {Object} selector : selector to start search from
	 */
	var deviceCaps = function (obj, selector) {
		var
			family,
			brand,
			model,
			type = "device";

		selector = selector || tree;

		//~ console.log('>>obj', obj);
		if (obj && obj.family) {
			family = select(selector, [ "device" , "family" ]);
			getCap(family, type, obj.family);
			family = selectNormalizedDevice(family, obj.family);
			getCap(family, type);
			deviceOverwrite(family);
		}
		if (obj && obj.brand) {
			brand = select(selector, [ "device", "brand" ]);
			getCap(brand, type, obj.brand);
			brand = selectNormalizedDevice(brand, obj.brand);
			notFound(brand, 'device', 'brand', obj.brand);
			getCap(brand, type);
			deviceOverwrite(brand);
			if (obj.model) {
				model = select(brand, [ "model" ]);
				getCap(model, type, obj.model);
				model = selectNormalizedDevice(model, obj.model);
				notFound(model, 'device', 'model', obj.model);
				getCap(model, type);
				deviceOverwrite(model);
			}
		}
	};

	/**
	 * overwrite ua capabilities by os or device
	 *
	 * @param {Object} selector : selector to start search from
	 */
	var uaOverwrite = function (selector) {
		var i,
			sel;
		if (selector && selector.overwrites && selector.overwrites.length) {
			sel = selector.overwrites;
			for (i=0; i<sel.length; i++) {
				if (sel[i].os) {
					osuaCaps(self.uaparsed.os, 'os', sel[i]);
				}
				if (sel[i].device) {
					deviceCaps(self.uaparsed.device, sel[i]);
				}
			}
		}
	};

	/**
	 * overwrite device capabilities by ua or os
	 *
	 * @param {Object} selector : selector to start search from
	 */
	var deviceOverwrite = function (selector) {
		var i,
			sel;
		if (selector && selector.overwrites && selector.overwrites.length) {
			sel = selector.overwrites;
			for (i=0; i<sel.length; i++) {
				if (sel[i].os) {
					osuaCaps(self.uaparsed.os, 'os', sel[i]);
				}
				if (sel[i].ua) {
					osuaCaps(self.uaparsed.ua, 'ua', sel[i]);
				}
			}
		}
	};

	/**
	 * parse capabilities on "os" only
	 * 
	 * @param {Object} uaparsed : ua-parser parsed user-agent string
	 */
	var parseOs = F.parseOs = function (uaparsed) {
		init(uaparsed);
		defaultCaps();
		osuaCaps(self.uaparsed.os, 'os');
	};

	/**
	 * parse capabilities on "ua" only
	 * 
	 * @param {Object} uaparsed : ua-parser parsed user-agent string
	 */
	var parseUa = F.parseUa = function (uaparsed) {
		init(uaparsed);
		defaultCaps();
		osuaCaps(self.uaparsed.ua, 'ua');
	};

	/**
	 * parse capabilities on "device" only
	 * 
	 * @param {Object} uaparsed : ua-parser parsed user-agent string
	 */
	var parseDevice = F.parseDevice = function (uaparsed) {
		init(uaparsed);
		defaultCaps();
		deviceCaps(self.uaparsed.device);
	};

	/**
	 * parse capabilities for "os", "ua", "device"
	 * 
	 * @param {Object} uaparsed : ua-parser parsed user-agent string
	 */
	F.parse = function (uaparsed) {
		init(uaparsed);
		parseOs();
		parseUa();
		parseDevice();
		return self.cap;
	};

	return F;
};

/**
 * normalize brand model names
 * put to lowercase and replace special chars by "-"
 *
 * @param {String} str
 *
 * @return {String} normalized string
 */
var normalizeDevice = M.normalizeDevice = function (str) {

	if (str) {
		str = str.toLowerCase();
		str = str.replace(/[ _]/g, " ");
	}

	return str;
};

/**
 * utility function to select a device family, brand or model
 * If device is not found try again using a normalized form
 *
 * @param {Object} selector
 * @param {String} attr : attribute
 *
 * @return {Object} found object
 */
function selectNormalizedDevice (selector, attr) {
	var obj;

	obj = select(selector, [ attr ]);
	if (obj === null) {
		obj = select(selector, [ normalizeDevice(attr) ]);
	}

	return obj;
}
