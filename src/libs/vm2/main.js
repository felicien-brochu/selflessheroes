/* eslint-disable global-require, no-use-before-define */

'use strict';

const sandboxModule = `(function (vm, host, Contextify, Decontextify, Buffer, options) {
	/* eslint-disable no-shadow, no-invalid-this */
	/* global vm, host, Contextify, Decontextify, VMError, options */

	'use strict';

	const {Script} = host.require('vm');
	const fs = host.require('fs');
	const pa = host.require('path');

	const BUILTIN_MODULES = host.process.binding('natives');
	const parseJSON = JSON.parse;

	/**
	 * @param {Object} host Hosts's internal objects.
	 */

	return ((vm, host) => {
		'use strict';

		const global = this;

		const TIMERS = new host.WeakMap(); // Contains map of timers created inside sandbox
		const BUILTINS = {__proto__: null};
		const CACHE = {__proto__: null};
		const EXTENSIONS = {
			__proto__: null,
			['.json'](module, filename) {
				try {
					const code = fs.readFileSync(filename, 'utf8');
					module.exports = parseJSON(code);
				} catch (e) {
					throw Contextify.value(e);
				}
			},
			['.node'](module, filename) {
				if (vm.options.require.context === 'sandbox') throw new VMError('Native modules can be required only with context set to \\'host\\'.');

				try {
					module.exports = Contextify.readonly(host.require(filename));
				} catch (e) {
					throw Contextify.value(e);
				}
			}
		};

		for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
			const ext = vm.options.sourceExtensions[i];

			EXTENSIONS['.' + ext] = (module, filename, dirname) => {
				if (vm.options.require.context !== 'sandbox') {
					try {
						module.exports = Contextify.readonly(host.require(filename));
					} catch (e) {
						throw Contextify.value(e);
					}
				} else {
					let script;

					try {
						// Load module
						let contents = fs.readFileSync(filename, 'utf8');
						contents = vm._compiler(contents, filename);

						const code = \`(function (exports, require, module, __filename, __dirname) { 'use strict'; \${contents} \\n});\`;

						// Precompile script
						script = new Script(code, {
							__proto__: null,
							filename: filename || 'vm.js',
							displayErrors: false
						});

					} catch (ex) {
						throw Contextify.value(ex);
					}

					const closure = script.runInContext(global, {
						__proto__: null,
						filename: filename || 'vm.js',
						displayErrors: false
					});

					// run the script
					closure(module.exports, module.require, module, filename, dirname);
				}
			};
		}

		const _parseExternalOptions = (options) => {
			if (host.Array.isArray(options)) {
				return {
					__proto__: null,
					external: options,
					transitive: false
				};
			}

			return {
				__proto__: null,
				external: options.modules,
				transitive: options.transitive
			};
		};

		/**
		 * Resolve filename.
		 */

		const _resolveFilename = (path) => {
			if (!path) return null;
			let hasPackageJson;
			try {
				path = pa.resolve(path);

				const exists = fs.existsSync(path);
				const isdir = exists ? fs.statSync(path).isDirectory() : false;

				// direct file match
				if (exists && !isdir) return path;

				// load as file

				for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
					const ext = vm.options.sourceExtensions[i];
					if (fs.existsSync(\`\${path}.\${ext}\`)) return \`\${path}.\${ext}\`;
				}
				if (fs.existsSync(\`\${path}.json\`)) return \`\${path}.json\`;
				if (fs.existsSync(\`\${path}.node\`)) return \`\${path}.node\`;

				// load as module

				hasPackageJson = fs.existsSync(\`\${path}/package.json\`);
			} catch (e) {
				throw Contextify.value(e);
			}

			if (hasPackageJson) {
				let pkg;
				try {
					pkg = fs.readFileSync(\`\${path}/package.json\`, 'utf8');
				} catch (e) {
					throw Contextify.value(e);
				}
				try {
					pkg = parseJSON(pkg);
				} catch (ex) {
					throw new VMError(\`Module '\${path}' has invalid package.json\`, 'EMODULEINVALID');
				}

				let main;
				if (pkg && pkg.main) {
					main = _resolveFilename(\`\${path}/\${pkg.main}\`);
					if (!main) main = _resolveFilename(\`\${path}/index\`);
				} else {
					main = _resolveFilename(\`\${path}/index\`);
				}

				return main;
			}

			// load as directory

			try {
				for (let i = 0; i < vm.options.sourceExtensions.length; i++) {
					const ext = vm.options.sourceExtensions[i];
					if (fs.existsSync(\`\${path}/index.\${ext}\`)) return \`\${path}/index.\${ext}\`;
				}

				if (fs.existsSync(\`\${path}/index.json\`)) return \`\${path}/index.json\`;
				if (fs.existsSync(\`\${path}/index.node\`)) return \`\${path}/index.node\`;
			} catch (e) {
				throw Contextify.value(e);
			}

			return null;
		};

		/**
		 * Builtin require.
		 */

		const _requireBuiltin = (moduleName) => {
			if (moduleName === 'buffer') return ({Buffer});
			if (BUILTINS[moduleName]) return BUILTINS[moduleName].exports; // Only compiled builtins are stored here

			if (moduleName === 'util') {
				return Contextify.readonly(host.require(moduleName), {
					// Allows VM context to use util.inherits
					__proto__: null,
					inherits: (ctor, superCtor) => {
						ctor.super_ = superCtor;
						Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
					}
				});
			}

			if (moduleName === 'events' || moduleName === 'internal/errors') {
				let script;
				try {
					script = new Script(\`(function (exports, require, module, process, internalBinding) {
							'use strict';
							const primordials = global;
							\${BUILTIN_MODULES[moduleName]}
							\\n
						});\`, {
						filename: \`\${moduleName}.vm.js\`
					});

				} catch (e) {
					throw Contextify.value(e);
				}

				// setup module scope
				const module = BUILTINS[moduleName] = {
					exports: {},
					require: _requireBuiltin
				};

				// run script
				try {
					// FIXME binding should be contextified
					script.runInContext(global)(module.exports, module.require, module, host.process, host.process.binding);
				} catch (e) {
					// e could be from inside or outside of sandbox
					throw new VMError(\`Error loading '\${moduleName}'\`);
				}
				return module.exports;
			}

			return Contextify.readonly(host.require(moduleName));
		};

		/**
		 * Prepare require.
		 */

		const _prepareRequire = (currentDirname, parentAllowsTransitive = false) => {
			const _require = moduleName => {
				let requireObj;
				try {
					const optionsObj = vm.options;
					if (optionsObj.nesting && moduleName === 'vm2') return {VM: Contextify.readonly(host.VM), NodeVM: Contextify.readonly(host.NodeVM)};
					requireObj = optionsObj.require;
				} catch (e) {
					throw Contextify.value(e);
				}

				if (!requireObj) throw new VMError(\`Access denied to require '\${moduleName}'\`, 'EDENIED');
				if (moduleName == null) throw new VMError("Module '' not found.", 'ENOTFOUND');
				if (typeof moduleName !== 'string') throw new VMError(\`Invalid module name '\${moduleName}'\`, 'EINVALIDNAME');

				let filename;
				let allowRequireTransitive = false;

				// Mock?

				try {
					const {mock} = requireObj;
					if (mock) {
						const mockModule = mock[moduleName];
						if (mockModule) {
							return Contextify.readonly(mockModule);
						}
					}
				} catch (e) {
					throw Contextify.value(e);
				}

				// Builtin?

				if (BUILTIN_MODULES[moduleName]) {
					let allowed;
					try {
						const builtinObj = requireObj.builtin;
						if (host.Array.isArray(builtinObj)) {
							if (builtinObj.indexOf('*') >= 0) {
								allowed = builtinObj.indexOf(\`-\${moduleName}\`) === -1;
							} else {
								allowed = builtinObj.indexOf(moduleName) >= 0;
							}
						} else if (builtinObj) {
							allowed = builtinObj[moduleName];
						} else {
							allowed = false;
						}
					} catch (e) {
						throw Contextify.value(e);
					}
					if (!allowed) throw new VMError(\`Access denied to require '\${moduleName}'\`, 'EDENIED');

					return _requireBuiltin(moduleName);
				}

				// External?

				let externalObj;
				try {
					externalObj = requireObj.external;
				} catch (e) {
					throw Contextify.value(e);
				}

				if (!externalObj) throw new VMError(\`Access denied to require '\${moduleName}'\`, 'EDENIED');

				if (/^(\\.|\\.\\/|\\.\\.\\/)/.exec(moduleName)) {
					// Module is relative file, e.g. ./script.js or ../script.js

					if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

					filename = _resolveFilename(\`\${currentDirname}/\${moduleName}\`);
				} else if (/^(\\/|\\\\|[a-zA-Z]:\\\\)/.exec(moduleName)) {
					// Module is absolute file, e.g. /script.js or //server/script.js or C:\\script.js

					filename = _resolveFilename(moduleName);
				} else {
					// Check node_modules in path

					if (!currentDirname) throw new VMError('You must specify script path to load relative modules.', 'ENOPATH');

					if (typeof externalObj === 'object') {
						let isWhitelisted;
						try {
							const { external, transitive } = _parseExternalOptions(externalObj);

							isWhitelisted = external.some(ext => host.helpers.match(ext, moduleName)) || (transitive && parentAllowsTransitive);
						} catch (e) {
							throw Contextify.value(e);
						}
						if (!isWhitelisted) {
							throw new VMError(\`The module '\${moduleName}' is not whitelisted in VM.\`, 'EDENIED');
						}

						allowRequireTransitive = true;
					}

					// FIXME the paths array has side effects
					const paths = currentDirname.split(pa.sep);

					while (paths.length) {
						const path = paths.join(pa.sep);

						// console.log moduleName, "#{path}#{pa.sep}node_modules#{pa.sep}#{moduleName}"

						filename = _resolveFilename(\`\${path}\${pa.sep}node_modules\${pa.sep}\${moduleName}\`);
						if (filename) break;

						paths.pop();
					}
				}

				if (!filename) {
					let resolveFunc;
					try {
						resolveFunc = requireObj.resolve;
					} catch (e) {
						throw Contextify.value(e);
					}
					if (resolveFunc) {
						let resolved;
						try {
							resolved = requireObj.resolve(moduleName, currentDirname);
						} catch (e) {
							throw Contextify.value(e);
						}
						filename = _resolveFilename(resolved);
					}
				}
				if (!filename) throw new VMError(\`Cannot find module '\${moduleName}'\`, 'ENOTFOUND');

				// return cache whenever possible
				if (CACHE[filename]) return CACHE[filename].exports;

				const dirname = pa.dirname(filename);
				const extname = pa.extname(filename);

				let allowedModule = true;
				try {
					const rootObj = requireObj.root;
					if (rootObj) {
						const rootPaths = host.Array.isArray(rootObj) ? rootObj : host.Array.of(rootObj);
						allowedModule = rootPaths.some(path => host.String.prototype.startsWith.call(dirname, pa.resolve(path)));
					}
				} catch (e) {
					throw Contextify.value(e);
				}

				if (!allowedModule) {
					throw new VMError(\`Module '\${moduleName}' is not allowed to be required. The path is outside the border!\`, 'EDENIED');
				}

				const module = CACHE[filename] = {
					filename,
					exports: {},
					require: _prepareRequire(dirname, allowRequireTransitive)
				};

				// lookup extensions
				if (EXTENSIONS[extname]) {
					EXTENSIONS[extname](module, filename, dirname);
					return module.exports;
				}

				throw new VMError(\`Failed to load '\${moduleName}': Unknown type.\`, 'ELOADFAIL');
			};

			return _require;
		};

		/**
		 * Prepare sandbox.
		 */

		// This is a function and not an arrow function, since the original is also a function
		global.setTimeout = function setTimeout(callback, delay, ...args) {
			if (typeof callback !== 'function') throw new TypeError('"callback" argument must be a function');
			let tmr;
			try {
				tmr = host.setTimeout(Decontextify.value(() => {
					// FIXME ...args has side effects
					callback(...args);
				}), Decontextify.value(delay));
			} catch (e) {
				throw Contextify.value(e);
			}
			const local = Contextify.value(tmr);

			TIMERS.set(local, tmr);
			return local;
		};

		global.setInterval = function setInterval(callback, interval, ...args) {
			if (typeof callback !== 'function') throw new TypeError('"callback" argument must be a function');
			let tmr;
			try {
				tmr = host.setInterval(Decontextify.value(() => {
					// FIXME ...args has side effects
					callback(...args);
				}), Decontextify.value(interval));
			} catch (e) {
				throw Contextify.value(e);
			}

			const local = Contextify.value(tmr);

			TIMERS.set(local, tmr);
			return local;
		};

		global.setImmediate = function setImmediate(callback, ...args) {
			if (typeof callback !== 'function') throw new TypeError('"callback" argument must be a function');
			let tmr;
			try {
				tmr = host.setImmediate(Decontextify.value(() => {
					// FIXME ...args has side effects
					callback(...args);
				}));
			} catch (e) {
				throw Contextify.value(e);
			}

			const local = Contextify.value(tmr);

			TIMERS.set(local, tmr);
			return local;
		};

		global.clearTimeout = function clearTimeout(local) {
			try {
				host.clearTimeout(TIMERS.get(local));
			} catch (e) {
				throw Contextify.value(e);
			}
		};

		global.clearInterval = function clearInterval(local) {
			try {
				host.clearInterval(TIMERS.get(local));
			} catch (e) {
				throw Contextify.value(e);
			}
		};

		global.clearImmediate = function clearImmediate(local) {
			try {
				host.clearImmediate(TIMERS.get(local));
			} catch (e) {
				throw Contextify.value(e);
			}
		};

		function addListener(name, handler) {
			if (name !== 'beforeExit' && name !== 'exit') {
				throw new Error(\`Access denied to listen for '\${name}' event.\`);
			}

			try {
				host.process.on(name, Decontextify.value(handler));
			} catch (e) {
				throw Contextify.value(e);
			}

			return this;
		}

		const {argv: optionArgv, env: optionsEnv} = options;

		// FIXME wrong class structure
		global.process = {
			argv: optionArgv !== undefined ? Contextify.value(optionArgv) : [],
			title: host.process.title,
			version: host.process.version,
			versions: Contextify.readonly(host.process.versions),
			arch: host.process.arch,
			platform: host.process.platform,
			env: optionsEnv !== undefined ? Contextify.value(optionsEnv) : {},
			pid: host.process.pid,
			features: Contextify.readonly(host.process.features),
			nextTick: function nextTick(callback, ...args) {
				if (typeof callback !== 'function') {
					throw new Error('Callback must be a function.');
				}

				try {
					host.process.nextTick(Decontextify.value(() => {
						// FIXME ...args has side effects
						callback(...args);
					}));
				} catch (e) {
					throw Contextify.value(e);
				}
			},
			hrtime: function hrtime(time) {
				try {
					return Contextify.value(host.process.hrtime(Decontextify.value(time)));
				} catch (e) {
					throw Contextify.value(e);
				}
			},
			cwd: function cwd() {
				try {
					return Contextify.value(host.process.cwd());
				} catch (e) {
					throw Contextify.value(e);
				}
			},
			addListener,
			on: addListener,

			once: function once(name, handler) {
				if (name !== 'beforeExit' && name !== 'exit') {
					throw new Error(\`Access denied to listen for '\${name}' event.\`);
				}

				try {
					host.process.once(name, Decontextify.value(handler));
				} catch (e) {
					throw Contextify.value(e);
				}

				return this;
			},

			listeners: function listeners(name) {
				if (name !== 'beforeExit' && name !== 'exit') {
					// Maybe add ({__proto__:null})[name] to throw when name fails in https://tc39.es/ecma262/#sec-topropertykey.
					return [];
				}

				// Filter out listeners, which were not created in this sandbox
				try {
					return Contextify.value(host.process.listeners(name).filter(listener => Contextify.isVMProxy(listener)));
				} catch (e) {
					throw Contextify.value(e);
				}
			},

			removeListener: function removeListener(name, handler) {
				if (name !== 'beforeExit' && name !== 'exit') {
					return this;
				}

				try {
					host.process.removeListener(name, Decontextify.value(handler));
				} catch (e) {
					throw Contextify.value(e);
				}

				return this;
			},

			umask: function umask() {
				if (arguments.length) {
					throw new Error('Access denied to set umask.');
				}

				try {
					return Contextify.value(host.process.umask());
				} catch (e) {
					throw Contextify.value(e);
				}
			}
		};

		if (vm.options.console === 'inherit') {
			global.console = Contextify.readonly(host.console);
		} else if (vm.options.console === 'redirect') {
			global.console = {
				debug(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.debug', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				log(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.log', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				info(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.info', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				warn(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.warn', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				error(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.error', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				dir(...args) {
					try {
						vm.emit('console.dir', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				},
				time() {},
				timeEnd() {},
				trace(...args) {
					try {
						// FIXME ...args has side effects
						vm.emit('console.trace', ...Decontextify.arguments(args));
					} catch (e) {
						throw Contextify.value(e);
					}
				}
			};
		}

		/*
		Return contextized require.
		*/

		return _prepareRequire;
	})(vm, host);
})`

const contextifyModule = `(function(require, host) {
	/* global host */
	/* eslint-disable block-spacing, no-multi-spaces, brace-style, no-array-constructor, new-cap, no-use-before-define */

	'use strict';

	// eslint-disable-next-line no-invalid-this, no-shadow
	const global = this;

	const local = host.Object.create(null);
	local.Object = Object;
	local.Array = Array;
	local.Reflect = host.Object.create(null);
	local.Reflect.ownKeys = Reflect.ownKeys;
	local.Reflect.enumerable = Reflect.enumerate;
	local.Reflect.getPrototypeOf = Reflect.getPrototypeOf;
	local.Reflect.construct = Reflect.construct;
	local.Reflect.apply = Reflect.apply;
	local.Reflect.set = Reflect.set;
	local.Reflect.deleteProperty = Reflect.deleteProperty;
	local.Reflect.has = Reflect.has;
	local.Reflect.defineProperty = Reflect.defineProperty;
	local.Reflect.setPrototypeOf = Reflect.setPrototypeOf;
	local.Reflect.isExtensible = Reflect.isExtensible;
	local.Reflect.preventExtensions = Reflect.preventExtensions;
	local.Reflect.getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

	// global is originally prototype of host.Object so it can be used to climb up from the sandbox.
	Object.setPrototypeOf(global, Object.prototype);

	Object.defineProperties(global, {
		global: {value: global},
		GLOBAL: {value: global},
		root: {value: global},
		isVM: {value: true}
	});

	const DEBUG = false;
	const OPNA = 'Operation not allowed on contextified object.';
	const captureStackTrace = Error.captureStackTrace;

	const FROZEN_TRAPS = host.Object.create(null);
	FROZEN_TRAPS.set = (target, key) => false;
	FROZEN_TRAPS.setPrototypeOf = (target, key) => false;
	FROZEN_TRAPS.defineProperty = (target, key) => false;
	FROZEN_TRAPS.deleteProperty = (target, key) => false;
	FROZEN_TRAPS.isExtensible = (target, key) => false;
	FROZEN_TRAPS.preventExtensions = (target) => false;

	// Map of contextified objects to original objects
	const Contextified = new host.WeakMap();
	const Decontextified = new host.WeakMap();

	// We can't use host's hasInstance method
	const hasInstance = local.Object[Symbol.hasInstance];
	function instanceOf(value, construct) {
		try {
			return host.Reflect.apply(hasInstance, construct, [value]);
		} catch (ex) {
			// Never pass the handled exception through!
			throw new VMError('Unable to perform instanceOf check.');
			// This exception actually never get to the user. It only instructs the caller to return null because we wasn't able to perform instanceOf check.
		}
	}

	const SHARED_OBJECT = {__proto__: null};

	function createBaseObject(obj) {
		let base;
		if (typeof obj === 'function') {
			try {
				// eslint-disable-next-line no-new
				new new host.Proxy(obj, {
					__proto__: null,
					construct() {
						return this;
					}
				})();
				// eslint-disable-next-line func-names
				base = function() {};
				base.prototype = null;
			} catch (e) {
				base = () => {};
			}
		} else if (host.Array.isArray(obj)) {
			base = [];
		} else {
			return {__proto__: null};
		}
		if (!local.Reflect.setPrototypeOf(base, null)) {
			// Should not happen
			return null;
		}
		return base;
	}

	/**
	 * VMError definition.
	 */

	class VMError extends Error {
		constructor(message, code) {
			super(message);

			this.name = 'VMError';
			this.code = code;

			captureStackTrace(this, this.constructor);
		}
	}

	global.VMError = VMError;

	/*
	 * This function will throw a TypeError for accessing properties
	 * on a strict mode function
	 */
	function throwCallerCalleeArgumentsAccess(key) {
		'use strict';
		throwCallerCalleeArgumentsAccess[key];
		return new VMError('Unreachable');
	}

	function unexpected() {
		throw new VMError('Should not happen');
	}

	function doPreventExtensions(target, object, doProxy) {
		const keys = local.Reflect.ownKeys(object);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let desc = local.Reflect.getOwnPropertyDescriptor(object, key);
			if (!desc) continue;
			if (!local.Reflect.setPrototypeOf(desc, null)) unexpected();
			if (!desc.configurable) {
				const current = local.Reflect.getOwnPropertyDescriptor(target, key);
				if (current && !current.configurable) continue;
				if (desc.get || desc.set) {
					desc.get = doProxy(desc.get);
					desc.set = doProxy(desc.set);
				} else {
					desc.value = doProxy(desc.value);
				}
			} else {
				if (desc.get || desc.set) {
					desc = {
						__proto__: null,
						configurable: true,
						enumberable: desc.enumberable,
						writeable: true,
						value: null
					};
				} else {
					desc.value = null;
				}
			}
			if (!local.Reflect.defineProperty(target, key, desc)) unexpected();
		}
		if (!local.Reflect.preventExtensions(target)) unexpected();
	}

	/**
	 * Decontextify.
	 */

	const Decontextify = host.Object.create(null);
	Decontextify.proxies = new host.WeakMap();

	Decontextify.arguments = args => {
		if (!host.Array.isArray(args)) return new host.Array();

		try {
			const arr = new host.Array();
			for (let i = 0, l = args.length; i < l; i++) arr[i] = Decontextify.value(args[i]);
			return arr;
		} catch (e) {
			// Never pass the handled expcetion through!
			return new host.Array();
		}
	};
	Decontextify.instance = (instance, klass, deepTraps, flags, toStringTag) => {
		if (typeof instance === 'function') return Decontextify.function(instance);

		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);

		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return instance;
				if (key === 'isVMProxy') return true;
				if (key === 'constructor') return klass;
				if (key === '__proto__') return klass.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return host.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return host.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return host.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return host.Object.prototype.__lookupSetter__;
			if (key === host.Symbol.toStringTag && toStringTag) return toStringTag;

			try {
				return Decontextify.value(instance[key], null, deepTraps, flags);
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return klass && klass.prototype;
		};

		return Decontextify.object(instance, base, deepTraps, flags);
	};
	Decontextify.function = (fnc, traps, deepTraps, flags, mock) => {
		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);
		// eslint-disable-next-line prefer-const
		let proxy;

		base.apply = (target, context, args) => {
			context = Contextify.value(context);

			// Set context of all arguments to vm's context.
			args = Contextify.arguments(args);

			try {
				return Decontextify.value(fnc.apply(context, args));
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.construct = (target, args, newTarget) => {
			args = Contextify.arguments(args);

			try {
				return Decontextify.instance(new fnc(...args), proxy, deepTraps, flags);
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return fnc;
				if (key === 'isVMProxy') return true;
				if (mock && host.Object.prototype.hasOwnProperty.call(mock, key)) return mock[key];
				if (key === 'constructor') return host.Function;
				if (key === '__proto__') return host.Function.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return host.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return host.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return host.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return host.Object.prototype.__lookupSetter__;

			try {
				return Decontextify.value(fnc[key], null, deepTraps, flags);
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return host.Function.prototype;
		};

		proxy = Decontextify.object(fnc, host.Object.assign(base, traps), deepTraps);
		return proxy;
	};
	Decontextify.object = (object, traps, deepTraps, flags, mock) => {
		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);

		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return object;
				if (key === 'isVMProxy') return true;
				if (mock && host.Object.prototype.hasOwnProperty.call(mock, key)) return mock[key];
				if (key === 'constructor') return host.Object;
				if (key === '__proto__') return host.Object.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return host.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return host.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return host.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return host.Object.prototype.__lookupSetter__;

			try {
				return Decontextify.value(object[key], null, deepTraps, flags);
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.set = (target, key, value, receiver) => {
			value = Contextify.value(value);

			try {
				return local.Reflect.set(object, key, value);
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.getOwnPropertyDescriptor = (target, prop) => {
			let def;

			try {
				def = host.Object.getOwnPropertyDescriptor(object, prop);
			} catch (e) {
				throw Decontextify.value(e);
			}

			// Following code prevents V8 to throw
			// TypeError: 'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property '<prop>'
			// which is either non-existant or configurable in the proxy target

			let desc;
			if (!def) {
				return undefined;
			} else if (def.get || def.set) {
				desc = {
					__proto__: null,
					get: Decontextify.value(def.get) || undefined,
					set: Decontextify.value(def.set) || undefined,
					enumerable: def.enumerable === true,
					configurable: def.configurable === true
				};
			} else {
				desc = {
					__proto__: null,
					value: Decontextify.value(def.value),
					writable: def.writable === true,
					enumerable: def.enumerable === true,
					configurable: def.configurable === true
				};
			}
			if (!desc.configurable) {
				try {
					def = host.Object.getOwnPropertyDescriptor(target, prop);
					if (!def || def.configurable) {
						local.Reflect.defineProperty(target, prop, desc);
					}
				} catch (e) {
					// Should not happen.
				}
			}
			return desc;
		};
		base.defineProperty = (target, key, descriptor) => {
			let success = false;
			try {
				success = local.Reflect.setPrototypeOf(descriptor, null);
			} catch (e) {
				// Should not happen
			}
			if (!success) return false;
			// There's a chance accessing a property throws an error so we must not access them
			// in try catch to prevent contextyfing local objects.

			const propertyDescriptor = host.Object.create(null);
			if (descriptor.get || descriptor.set) {
				propertyDescriptor.get = Contextify.value(descriptor.get, null, deepTraps, flags) || undefined;
				propertyDescriptor.set = Contextify.value(descriptor.set, null, deepTraps, flags) || undefined;
				propertyDescriptor.enumerable = descriptor.enumerable === true;
				propertyDescriptor.configurable = descriptor.configurable === true;
			} else {
				propertyDescriptor.value = Contextify.value(descriptor.value, null, deepTraps, flags);
				propertyDescriptor.writable = descriptor.writable === true;
				propertyDescriptor.enumerable = descriptor.enumerable === true;
				propertyDescriptor.configurable = descriptor.configurable === true;
			}

			try {
				success = local.Reflect.defineProperty(object, key, propertyDescriptor);
			} catch (e) {
				throw Decontextify.value(e);
			}
			if (success && descriptor.configurable) {
				try {
					local.Reflect.defineProperty(target, key, descriptor);
				} catch (e) {
					// This should not happen.
					return false;
				}
			}
			return success;
		};
		base.deleteProperty = (target, prop) => {
			try {
				return Decontextify.value(local.Reflect.deleteProperty(object, prop));
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return host.Object.prototype;
		};
		base.setPrototypeOf = (target) => {
			throw new host.Error(OPNA);
		};
		base.has = (target, key) => {
			try {
				return Decontextify.value(local.Reflect.has(object, key));
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.isExtensible = target => {
			let result;
			try {
				result = local.Reflect.isExtensible(object);
			} catch (e) {
				throw Decontextify.value(e);
			}
			if (!result) {
				try {
					if (local.Reflect.isExtensible(target)) {
						doPreventExtensions(target, object, obj => Contextify.value(obj, null, deepTraps, flags));
					}
				} catch (e) {
					// Should not happen
				}
			}
			return result;
		};
		base.ownKeys = target => {
			try {
				return Decontextify.value(local.Reflect.ownKeys(object));
			} catch (e) {
				throw Decontextify.value(e);
			}
		};
		base.preventExtensions = target => {
			let success;
			try {
				success = local.Reflect.preventExtensions(object);
			} catch (e) {
				throw Decontextify.value(e);
			}
			if (success) {
				try {
					if (local.Reflect.isExtensible(target)) {
						doPreventExtensions(target, object, obj => Contextify.value(obj, null, deepTraps, flags));
					}
				} catch (e) {
					// Should not happen
				}
			}
			return success;
		};
		base.enumerate = target => {
			try {
				return Decontextify.value(local.Reflect.enumerate(object));
			} catch (e) {
				throw Decontextify.value(e);
			}
		};

		host.Object.assign(base, traps, deepTraps);

		let shallow;
		if (host.Array.isArray(object)) {
			const origGet = base.get;
			shallow = {
				__proto__: null,
				ownKeys: base.ownKeys,
				// TODO this get will call getOwnPropertyDescriptor of target all the time.
				get: origGet
			};
			base.ownKeys = target => {
				try {
					const keys = local.Reflect.ownKeys(object);
					// Do this hack so that console.log(decontextify([1,2,3])) doesn't write the properties twice
					// a la [1,2,3,'0':1,'1':2,'2':3]
					return Decontextify.value(keys.filter(key=>typeof key!=='string' || !key.match(/^\\d+$/)));
				} catch (e) {
					throw Decontextify.value(e);
				}
			};
			base.get = (target, key, receiver) => {
				if (key === host.Symbol.toStringTag) return;
				return origGet(target, key, receiver);
			};
		} else {
			shallow = SHARED_OBJECT;
		}

		const proxy = new host.Proxy(createBaseObject(object), base);
		Decontextified.set(proxy, object);
		// We need two proxies since nodes inspect just removes one.
		const proxy2 = new host.Proxy(proxy, shallow);
		Decontextify.proxies.set(object, proxy2);
		Decontextified.set(proxy2, object);
		return proxy2;
	};
	Decontextify.value = (value, traps, deepTraps, flags, mock) => {
		try {
			if (Contextified.has(value)) {
				// Contextified object has returned back from vm
				return Contextified.get(value);
			} else if (Decontextify.proxies.has(value)) {
				// Decontextified proxy already exists, reuse
				return Decontextify.proxies.get(value);
			}

			switch (typeof value) {
				case 'object':
					if (value === null) {
						return null;
					} else if (instanceOf(value, Number))         { return Decontextify.instance(value, host.Number, deepTraps, flags, 'Number');
					} else if (instanceOf(value, String))         { return Decontextify.instance(value, host.String, deepTraps, flags, 'String');
					} else if (instanceOf(value, Boolean))        { return Decontextify.instance(value, host.Boolean, deepTraps, flags, 'Boolean');
					} else if (instanceOf(value, Date))           { return Decontextify.instance(value, host.Date, deepTraps, flags, 'Date');
					} else if (instanceOf(value, RangeError))     { return Decontextify.instance(value, host.RangeError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, ReferenceError)) { return Decontextify.instance(value, host.ReferenceError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, SyntaxError))    { return Decontextify.instance(value, host.SyntaxError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, TypeError))      { return Decontextify.instance(value, host.TypeError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, VMError))        { return Decontextify.instance(value, host.VMError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, EvalError))      { return Decontextify.instance(value, host.EvalError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, URIError))       { return Decontextify.instance(value, host.URIError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, Error))          { return Decontextify.instance(value, host.Error, deepTraps, flags, 'Error');
					} else if (instanceOf(value, Array))          { return Decontextify.instance(value, host.Array, deepTraps, flags, 'Array');
					} else if (instanceOf(value, RegExp))         { return Decontextify.instance(value, host.RegExp, deepTraps, flags, 'RegExp');
					} else if (instanceOf(value, Map))            { return Decontextify.instance(value, host.Map, deepTraps, flags, 'Map');
					} else if (instanceOf(value, WeakMap))        { return Decontextify.instance(value, host.WeakMap, deepTraps, flags, 'WeakMap');
					} else if (instanceOf(value, Set))            { return Decontextify.instance(value, host.Set, deepTraps, flags, 'Set');
					} else if (instanceOf(value, WeakSet))        { return Decontextify.instance(value, host.WeakSet, deepTraps, flags, 'WeakSet');
					} else if (Promise && instanceOf(value, Promise)) { return Decontextify.instance(value, host.Promise, deepTraps, flags, 'Promise');
					} else if (local.Reflect.getPrototypeOf(value) === null) {
						return Decontextify.instance(value, null, deepTraps, flags);
					} else {
						return Decontextify.object(value, traps, deepTraps, flags, mock);
					}
				case 'function':
					return Decontextify.function(value, traps, deepTraps, flags, mock);

				case 'undefined':
					return undefined;

				default: // string, number, boolean, symbol
					return value;
			}
		} catch (ex) {
			// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
			return null;
		}
	};

	/**
	 * Contextify.
	 */

	const Contextify = host.Object.create(null);
	Contextify.proxies = new host.WeakMap();

	Contextify.arguments = args => {
		if (!host.Array.isArray(args)) return new local.Array();

		try {
			const arr = new local.Array();
			for (let i = 0, l = args.length; i < l; i++) arr[i] = Contextify.value(args[i]);
			return arr;
		} catch (e) {
			// Never pass the handled expcetion through!
			return new local.Array();
		}
	};
	Contextify.instance = (instance, klass, deepTraps, flags, toStringTag) => {
		if (typeof instance === 'function') return Contextify.function(instance);

		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);

		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return instance;
				if (key === 'isVMProxy') return true;
				if (key === 'constructor') return klass;
				if (key === '__proto__') return klass.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return local.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return local.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return local.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return local.Object.prototype.__lookupSetter__;
			if (key === host.Symbol.toStringTag && toStringTag) return toStringTag;

			try {
				return Contextify.value(host.Reflect.get(instance, key), null, deepTraps, flags);
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return klass && klass.prototype;
		};

		return Contextify.object(instance, base, deepTraps, flags);
	};
	Contextify.function = (fnc, traps, deepTraps, flags, mock) => {
		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);
		// eslint-disable-next-line prefer-const
		let proxy;

		base.apply = (target, context, args) => {
			context = Decontextify.value(context);

			// Set context of all arguments to host's context.
			args = Decontextify.arguments(args);

			try {
				return Contextify.value(fnc.apply(context, args));
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.construct = (target, args, newTarget) => {
			// Fixes buffer unsafe allocation for node v6/7
			if (host.version < 8 && fnc === host.Buffer && 'number' === typeof args[0]) {
				args[0] = new Array(args[0]).fill(0);
			}

			args = Decontextify.arguments(args);

			try {
				return Contextify.instance(new fnc(...args), proxy, deepTraps, flags);
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return fnc;
				if (key === 'isVMProxy') return true;
				if (mock && host.Object.prototype.hasOwnProperty.call(mock, key)) return mock[key];
				if (key === 'constructor') return Function;
				if (key === '__proto__') return Function.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return local.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return local.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return local.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return local.Object.prototype.__lookupSetter__;

			if (key === 'caller' || key === 'callee' || key === 'arguments') throw throwCallerCalleeArgumentsAccess(key);

			try {
				return Contextify.value(host.Reflect.get(fnc, key), null, deepTraps, flags);
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return Function.prototype;
		};

		proxy = Contextify.object(fnc, host.Object.assign(base, traps), deepTraps);
		return proxy;
	};
	Contextify.object = (object, traps, deepTraps, flags, mock) => {
		// We must not use normal object because there's a chance object already contains malicious code in the prototype
		const base = host.Object.create(null);

		base.get = (target, key, receiver) => {
			try {
				if (key === 'vmProxyTarget' && DEBUG) return object;
				if (key === 'isVMProxy') return true;
				if (mock && host.Object.prototype.hasOwnProperty.call(mock, key)) return mock[key];
				if (key === 'constructor') return Object;
				if (key === '__proto__') return Object.prototype;
			} catch (e) {
				// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
				return null;
			}

			if (key === '__defineGetter__') return local.Object.prototype.__defineGetter__;
			if (key === '__defineSetter__') return local.Object.prototype.__defineSetter__;
			if (key === '__lookupGetter__') return local.Object.prototype.__lookupGetter__;
			if (key === '__lookupSetter__') return local.Object.prototype.__lookupSetter__;

			try {
				return Contextify.value(host.Reflect.get(object, key), null, deepTraps, flags);
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.set = (target, key, value, receiver) => {
			if (key === '__proto__') return false;
			if (flags && flags.protected && typeof value === 'function') return false;

			value = Decontextify.value(value);

			try {
				return host.Reflect.set(object, key, value);
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.getOwnPropertyDescriptor = (target, prop) => {
			let def;

			try {
				def = host.Object.getOwnPropertyDescriptor(object, prop);
			} catch (e) {
				throw Contextify.value(e);
			}

			// Following code prevents V8 to throw
			// TypeError: 'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property '<prop>'
			// which is either non-existant or configurable in the proxy target

			let desc;
			if (!def) {
				return undefined;
			} else if (def.get || def.set) {
				desc = {
					__proto__: null,
					get: Contextify.value(def.get, null, deepTraps, flags) || undefined,
					set: Contextify.value(def.set, null, deepTraps, flags) || undefined,
					enumerable: def.enumerable === true,
					configurable: def.configurable === true
				};
			} else {
				desc = {
					__proto__: null,
					value: Contextify.value(def.value, null, deepTraps, flags),
					writable: def.writable === true,
					enumerable: def.enumerable === true,
					configurable: def.configurable === true
				};
			}
			if (!desc.configurable) {
				try {
					def = host.Object.getOwnPropertyDescriptor(target, prop);
					if (!def || def.configurable) {
						local.Reflect.defineProperty(target, prop, desc);
					}
				} catch (e) {
					// Should not happen.
				}
			}
			return desc;
		};
		base.defineProperty = (target, key, descriptor) => {
			let success = false;
			try {
				success = local.Reflect.setPrototypeOf(descriptor, null);
			} catch (e) {
				// Should not happen
			}
			if (!success) return false;
			// There's a chance accessing a property throws an error so we must not access them
			// in try catch to prevent contextyfing local objects.

			const descGet = descriptor.get;
			const descSet = descriptor.set;
			const descValue = descriptor.value;

			if (flags && flags.protected) {
				if (descGet || descSet || typeof descValue === 'function') return false;
			}

			const propertyDescriptor = host.Object.create(null);
			if (descGet || descSet) {
				propertyDescriptor.get = Decontextify.value(descGet, null, deepTraps, flags) || undefined;
				propertyDescriptor.set = Decontextify.value(descSet, null, deepTraps, flags) || undefined;
				propertyDescriptor.enumerable = descriptor.enumerable === true;
				propertyDescriptor.configurable = descriptor.configurable === true;
			} else {
				propertyDescriptor.value = Decontextify.value(descValue, null, deepTraps, flags);
				propertyDescriptor.writable = descriptor.writable === true;
				propertyDescriptor.enumerable = descriptor.enumerable === true;
				propertyDescriptor.configurable = descriptor.configurable === true;
			}

			try {
				success = host.Reflect.defineProperty(object, key, propertyDescriptor);
			} catch (e) {
				throw Contextify.value(e);
			}
			if (success && descriptor.configurable) {
				try {
					local.Reflect.defineProperty(target, key, descriptor);
				} catch (e) {
					// This should not happen.
					return false;
				}
			}
			return success;
		};
		base.deleteProperty = (target, prop) => {
			try {
				return Contextify.value(host.Reflect.deleteProperty(object, prop));
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.getPrototypeOf = (target) => {
			return local.Object.prototype;
		};
		base.setPrototypeOf = (target) => {
			throw new VMError(OPNA);
		};
		base.has = (target, key) => {
			try {
				return Contextify.value(host.Reflect.has(object, key));
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.isExtensible = target => {
			let result;
			try {
				result = host.Reflect.isExtensible(object);
			} catch (e) {
				throw Contextify.value(e);
			}
			if (!result) {
				try {
					if (local.Reflect.isExtensible(target)) {
						doPreventExtensions(target, object, obj => Decontextify.value(obj, null, deepTraps, flags));
					}
				} catch (e) {
					// Should not happen
				}
			}
			return result;
		};
		base.ownKeys = target => {
			try {
				return Contextify.value(host.Reflect.ownKeys(object));
			} catch (e) {
				throw Contextify.value(e);
			}
		};
		base.preventExtensions = target => {
			let success;
			try {
				success = local.Reflect.preventExtensions(object);
			} catch (e) {
				throw Contextify.value(e);
			}
			if (success) {
				try {
					if (local.Reflect.isExtensible(target)) {
						doPreventExtensions(target, object, obj => Decontextify.value(obj, null, deepTraps, flags));
					}
				} catch (e) {
					// Should not happen
				}
			}
			return success;
		};
		base.enumerate = target => {
			try {
				return Contextify.value(host.Reflect.enumerate(object));
			} catch (e) {
				throw Contextify.value(e);
			}
		};

		const proxy = new host.Proxy(createBaseObject(object), host.Object.assign(base, traps, deepTraps));
		Contextify.proxies.set(object, proxy);
		Contextified.set(proxy, object);
		return proxy;
	};
	Contextify.value = (value, traps, deepTraps, flags, mock) => {
		try {
			if (Decontextified.has(value)) {
				// Decontextified object has returned back to vm
				return Decontextified.get(value);
			} else if (Contextify.proxies.has(value)) {
				// Contextified proxy already exists, reuse
				return Contextify.proxies.get(value);
			}

			switch (typeof value) {
				case 'object':
					if (value === null) {
						return null;
					} else if (instanceOf(value, host.Number))         { return Contextify.instance(value, Number, deepTraps, flags, 'Number');
					} else if (instanceOf(value, host.String))         { return Contextify.instance(value, String, deepTraps, flags, 'String');
					} else if (instanceOf(value, host.Boolean))        { return Contextify.instance(value, Boolean, deepTraps, flags, 'Boolean');
					} else if (instanceOf(value, host.Date))           { return Contextify.instance(value, Date, deepTraps, flags, 'Date');
					} else if (instanceOf(value, host.RangeError))     { return Contextify.instance(value, RangeError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.ReferenceError)) { return Contextify.instance(value, ReferenceError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.SyntaxError))    { return Contextify.instance(value, SyntaxError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.TypeError))      { return Contextify.instance(value, TypeError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.VMError))        { return Contextify.instance(value, VMError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.EvalError))      { return Contextify.instance(value, EvalError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.URIError))       { return Contextify.instance(value, URIError, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.Error))          { return Contextify.instance(value, Error, deepTraps, flags, 'Error');
					} else if (instanceOf(value, host.Array))          { return Contextify.instance(value, Array, deepTraps, flags, 'Array');
					} else if (instanceOf(value, host.RegExp))         { return Contextify.instance(value, RegExp, deepTraps, flags, 'RegExp');
					} else if (instanceOf(value, host.Map))            { return Contextify.instance(value, Map, deepTraps, flags, 'Map');
					} else if (instanceOf(value, host.WeakMap))        { return Contextify.instance(value, WeakMap, deepTraps, flags, 'WeakMap');
					} else if (instanceOf(value, host.Set))            { return Contextify.instance(value, Set, deepTraps, flags, 'Set');
					} else if (instanceOf(value, host.WeakSet))        { return Contextify.instance(value, WeakSet, deepTraps, flags, 'WeakSet');
					} else if (instanceOf(value, host.Promise))        { return Contextify.instance(value, Promise, deepTraps, flags, 'Promise');
					} else if (instanceOf(value, host.Buffer))         { return Contextify.instance(value, LocalBuffer, deepTraps, flags, 'Uint8Array');
					} else if (host.Reflect.getPrototypeOf(value) === null) {
						return Contextify.instance(value, null, deepTraps, flags);
					} else {
						return Contextify.object(value, traps, deepTraps, flags, mock);
					}
				case 'function':
					return Contextify.function(value, traps, deepTraps, flags, mock);

				case 'undefined':
					return undefined;

				default: // string, number, boolean, symbol
					return value;
			}
		} catch (ex) {
			// Never pass the handled expcetion through! This block can't throw an exception under normal conditions.
			return null;
		}
	};
	Contextify.setGlobal = (name, value) => {
		const prop = Contextify.value(name);
		try {
			global[prop] = Contextify.value(value);
		} catch (e) {
			throw Decontextify.value(e);
		}
	};
	Contextify.getGlobal = (name) => {
		const prop = Contextify.value(name);
		try {
			return Decontextify.value(global[prop]);
		} catch (e) {
			throw Decontextify.value(e);
		}
	};
	Contextify.readonly = (value, mock) => {
		return Contextify.value(value, null, FROZEN_TRAPS, null, mock);
	};
	Contextify.protected = (value, mock) => {
		return Contextify.value(value, null, null, {protected: true}, mock);
	};
	Contextify.connect = (outer, inner) => {
		Decontextified.set(outer, inner);
		Contextified.set(inner, outer);
	};
	Contextify.makeModule = ()=>({exports: {}});
	Contextify.isVMProxy = (obj) => Decontextified.has(obj);

	const BufferMock = host.Object.create(null);
	BufferMock.allocUnsafe = function allocUnsafe(size) {
		return this.alloc(size);
	};
	BufferMock.allocUnsafeSlow = function allocUnsafeSlow(size) {
		return this.alloc(size);
	};
	const BufferOverride = host.Object.create(null);
	BufferOverride.inspect = function inspect(recurseTimes, ctx) {
		// Mimic old behavior, could throw but didn't pass a test.
		const max = host.INSPECT_MAX_BYTES;
		const actualMax = Math.min(max, this.length);
		const remaining = this.length - max;
		let str = this.hexSlice(0, actualMax).replace(/(.{2})/g, '$1 ').trim();
		if (remaining > 0) str += \` ... \${remaining} more byte\${remaining > 1 ? 's' : ''}\`;
		return \`<\${this.constructor.name} \${str}>\`;
	};
	const LocalBuffer = global.Buffer = Contextify.readonly(host.Buffer, BufferMock);
	Contextify.connect(host.Buffer.prototype.inspect, BufferOverride.inspect);


	const exportsMap = host.Object.create(null);
	exportsMap.Contextify = Contextify;
	exportsMap.Decontextify = Decontextify;
	exportsMap.Buffer = LocalBuffer;
	exportsMap.sandbox = Decontextify.value(global);
	exportsMap.Function = Function;

	return exportsMap;

})`

const fixasyncModule = `(function() {
	'use strict';

	// eslint-disable-next-line no-invalid-this, no-shadow
	const {GeneratorFunction, AsyncFunction, AsyncGeneratorFunction, global, internal, host, hook} = this;
	const {Contextify, Decontextify} = internal;
	// eslint-disable-next-line no-shadow
	const {Function, eval: eval_, Promise, Object, Reflect} = global;
	const {getOwnPropertyDescriptor, defineProperty, assign} = Object;
	const {apply: rApply, construct: rConstruct} = Reflect;

	const FunctionHandler = {
		__proto__: null,
		apply(target, thiz, args) {
			const type = this.type;
			args = Decontextify.arguments(args);
			try {
				args = Contextify.value(hook(type, args));
			} catch (e) {
				throw Contextify.value(e);
			}
			return rApply(target, thiz, args);
		},
		construct(target, args, newTarget) {
			const type = this.type;
			args = Decontextify.arguments(args);
			try {
				args = Contextify.value(hook(type, args));
			} catch (e) {
				throw Contextify.value(e);
			}
			return rConstruct(target, args, newTarget);
		}
	};

	function makeCheckFunction(type) {
		return assign({
			__proto__: null,
			type
		}, FunctionHandler);
	}

	function override(obj, prop, value) {
		const desc = getOwnPropertyDescriptor(obj, prop);
		desc.value = value;
		defineProperty(obj, prop, desc);
	}

	const proxiedFunction = new host.Proxy(Function, makeCheckFunction('function'));
	override(Function.prototype, 'constructor', proxiedFunction);
	if (GeneratorFunction) {
		Object.setPrototypeOf(GeneratorFunction, proxiedFunction);
		override(GeneratorFunction.prototype, 'constructor', new host.Proxy(GeneratorFunction, makeCheckFunction('generator_function')));
	}
	if (AsyncFunction) {
		Object.setPrototypeOf(AsyncFunction, proxiedFunction);
		override(AsyncFunction.prototype, 'constructor', new host.Proxy(AsyncFunction, makeCheckFunction('async_function')));
	}
	if (AsyncGeneratorFunction) {
		Object.setPrototypeOf(AsyncGeneratorFunction, proxiedFunction);
		override(AsyncGeneratorFunction.prototype, 'constructor', new host.Proxy(AsyncGeneratorFunction, makeCheckFunction('async_generator_function')));
	}

	global.Function = proxiedFunction;
	global.eval = new host.Proxy(eval_, makeCheckFunction('eval'));

	if (Promise) {

		Promise.prototype.then = new host.Proxy(Promise.prototype.then, makeCheckFunction('promise_then'));
		Contextify.connect(host.Promise.prototype.then, Promise.prototype.then);

		if (Promise.prototype.finally) {
			Promise.prototype.finally = new host.Proxy(Promise.prototype.finally, makeCheckFunction('promise_finally'));
			Contextify.connect(host.Promise.prototype.finally, Promise.prototype.finally);
		}
		if (Promise.prototype.catch) {
			Promise.prototype.catch = new host.Proxy(Promise.prototype.catch, makeCheckFunction('promise_catch'));
			Contextify.connect(host.Promise.prototype.catch, Promise.prototype.catch);
		}

	}
})`

/**
 * This callback will be called to transform a script to JavaScript.
 *
 * @callback compileCallback
 * @param {string} code - Script code to transform to JavaScript.
 * @param {string} filename - Filename of this script.
 * @return {string} JavaScript code that represents the script code.
 */

/**
 * This callback will be called to resolve a module if it couldn't be found.
 *
 * @callback resolveCallback
 * @param {string} moduleName - Name of the module to resolve.
 * @param {string} dirname - Name of the current directory.
 * @return {(string|undefined)} The file or directory to use to load the requested module.
 */

const fs = require('fs');
const vm = require('vm');
const pa = require('path');
const {
  EventEmitter
} = require('events');
const {
  INSPECT_MAX_BYTES
} = require('buffer');
const helpers = require('./helpers.js');

/**
 * Cache where we can cache some things
 *
 * @private
 * @property {?compileCallback} coffeeScriptCompiler - The coffee script compiler or null if not yet used.
 * @property {?Object} timeoutContext - The context used for the timeout functionality of null if not yet used.
 * @property {?vm.Script} timeoutScript - The compiled script used for the timeout functionality of null if not yet used.
 * @property {vm.Script} contextifyScript - The compiled script used to setup a sandbox.
 * @property {?vm.Script} sandboxScript - The compiled script used to setup the NodeVM require mechanism of null if not yet used.
 * @property {?vm.Script} hookScript - The compiled script used to setup the async hooking functionality.
 * @property {?vm.Script} getGlobalScript - The compiled script used to get the global sandbox object.
 * @property {?vm.Script} getGeneratorFunctionScript - The compiled script used to get the generator function constructor.
 * @property {?vm.Script} getAsyncFunctionScript - The compiled script used to get the async function constructor.
 * @property {?vm.Script} getAsyncGeneratorFunctionScript - The compiled script used to get the async generator function constructor.
 */
const CACHE = {
  coffeeScriptCompiler: null,
  timeoutContext: null,
  timeoutScript: null,
  contextifyScript: new vm.Script(contextifyModule, {
    filename: './contextify.js',
    displayErrors: false
  }),
  sandboxScript: null,
  hookScript: null,
  getGlobalScript: null,
  getGeneratorFunctionScript: null,
  getAsyncFunctionScript: null,
  getAsyncGeneratorFunctionScript: null,
};

/**
 * Default run options for vm.Script.runInContext
 *
 * @private
 */
const DEFAULT_RUN_OPTIONS = {
  displayErrors: false
};

/**
 * The JavaScript compiler, just a identity function.
 *
 * @private
 * @type {compileCallback}
 * @param {string} code - The JavaScript code.
 * @param {string} filename - Filename of this script.
 * @return {string} The code.
 */
function jsCompiler(code, filename) {
  return code;
}

/**
 * Look up the compiler for a specific name.
 *
 * @private
 * @param {(string|compileCallback)} compiler - A compile callback or the name of the compiler.
 * @return {compileCallback} The resolved compiler.
 * @throws {VMError} If the compiler is unknown or the coffee script module was needed and couldn't be found.
 */
function lookupCompiler(compiler) {
  if ('function' === typeof compiler) return compiler;
  switch (compiler) {
    case 'javascript':
    case 'java-script':
    case 'js':
    case 'text/javascript':
      return jsCompiler;
    default:
      throw new VMError(`Unsupported compiler '${compiler}'.`);
  }
}

/**
 * Class Script
 *
 * @public
 */
class VMScript {

  /**
   * The script code with wrapping. If set will invalidate the cache.<br>
   * Writable only for backwards compatibility.
   *
   * @public
   * @readonly
   * @member {string} code
   * @memberOf VMScript#
   */

  /**
   * The filename used for this script.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {string} filename
   * @memberOf VMScript#
   */

  /**
   * The line offset use for stack traces.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {number} lineOffset
   * @memberOf VMScript#
   */

  /**
   * The column offset use for stack traces.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {number} columnOffset
   * @memberOf VMScript#
   */

  /**
   * The compiler to use to get the JavaScript code.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {(string|compileCallback)} compiler
   * @memberOf VMScript#
   */

  /**
   * The prefix for the script.
   *
   * @private
   * @member {string} _prefix
   * @memberOf VMScript#
   */

  /**
   * The suffix for the script.
   *
   * @private
   * @member {string} _suffix
   * @memberOf VMScript#
   */

  /**
   * The compiled vm.Script for the VM or if not compiled <code>null</code>.
   *
   * @private
   * @member {?vm.Script} _compiledVM
   * @memberOf VMScript#
   */

  /**
   * The compiled vm.Script for the NodeVM or if not compiled <code>null</code>.
   *
   * @private
   * @member {?vm.Script} _compiledNodeVM
   * @memberOf VMScript#
   */

  /**
   * The resolved compiler to use to get the JavaScript code.
   *
   * @private
   * @readonly
   * @member {compileCallback} _compiler
   * @memberOf VMScript#
   */

  /**
   * The script to run without wrapping.
   *
   * @private
   * @member {string} _code
   * @memberOf VMScript#
   */

  /**
   * Create VMScript instance.
   *
   * @public
   * @param {string} code - Code to run.
   * @param {(string|Object)} [options] - Options map or filename.
   * @param {string} [options.filename="vm.js"] - Filename that shows up in any stack traces produced from this script.
   * @param {number} [options.lineOffset=0] - Passed to vm.Script options.
   * @param {number} [options.columnOffset=0] - Passed to vm.Script options.
   * @param {(string|compileCallback)} [options.compiler="javascript"] - The compiler to use.
   * @throws {VMError} If the compiler is unknown or if coffee-script was requested but the module not found.
   */
  constructor(code, options) {
    const sCode = `${code}`;
    let useFileName;
    let useOptions;
    if (arguments.length === 2) {
      if (typeof options === 'object' && options.toString === Object.prototype.toString) {
        useOptions = options || {};
        useFileName = useOptions.filename;
      } else {
        useOptions = {};
        useFileName = options;
      }
    } else if (arguments.length > 2) {
      // We do it this way so that there are no more arguments in the function.
      // eslint-disable-next-line prefer-rest-params
      useOptions = arguments[2] || {};
      useFileName = options || useOptions.filename;
    } else {
      useOptions = {};
    }

    const {
      compiler = 'javascript',
        lineOffset = 0,
        columnOffset = 0
    } = useOptions;

    // Throw if the compiler is unknown.
    const resolvedCompiler = lookupCompiler(compiler);

    Object.defineProperties(this, {
      code: {
        // Put this here so that it is enumerable, and looks like a property.
        get() {
          return this._prefix + this._code + this._suffix;
        },
        set(value) {
          const strNewCode = String(value);
          if (strNewCode === this._code && this._prefix === '' && this._suffix === '') return;
          this._code = strNewCode;
          this._prefix = '';
          this._suffix = '';
          this._compiledVM = null;
          this._compiledNodeVM = null;
        },
        enumerable: true
      },
      filename: {
        value: useFileName || 'vm.js',
        enumerable: true
      },
      lineOffset: {
        value: lineOffset,
        enumerable: true
      },
      columnOffset: {
        value: columnOffset,
        enumerable: true
      },
      compiler: {
        value: compiler,
        enumerable: true
      },
      _code: {
        value: sCode,
        writable: true
      },
      _prefix: {
        value: '',
        writable: true
      },
      _suffix: {
        value: '',
        writable: true
      },
      _compiledVM: {
        value: null,
        writable: true
      },
      _compiledNodeVM: {
        value: null,
        writable: true
      },
      _compiler: {
        value: resolvedCompiler
      }
    });
  }

  /**
   * Wraps the code.<br>
   * This will replace the old wrapping.<br>
   * Will invalidate the code cache.
   *
   * @public
   * @deprecated Since v3.9.0. Wrap your code before passing it into the VMScript object.
   * @param {string} prefix - String that will be appended before the script code.
   * @param {script} suffix - String that will be appended behind the script code.
   * @return {this} This for chaining.
   * @throws {TypeError} If prefix or suffix is a Symbol.
   */
  wrap(prefix, suffix) {
    const strPrefix = `${prefix}`;
    const strSuffix = `${suffix}`;
    if (this._prefix === strPrefix && this._suffix === strSuffix) return this;
    this._prefix = strPrefix;
    this._suffix = strSuffix;
    this._compiledVM = null;
    this._compiledNodeVM = null;
    return this;
  }

  /**
   * Compile this script. <br>
   * This is useful to detect syntax errors in the script.
   *
   * @public
   * @return {this} This for chaining.
   * @throws {SyntaxError} If there is a syntax error in the script.
   */
  compile() {
    this._compileVM();
    return this;
  }

  /**
   * Compiles this script to a vm.Script.
   *
   * @private
   * @param {string} prefix - JavaScript code that will be used as prefix.
   * @param {string} suffix - JavaScript code that will be used as suffix.
   * @return {vm.Script} The compiled vm.Script.
   * @throws {SyntaxError} If there is a syntax error in the script.
   */
  _compile(prefix, suffix) {
    return new vm.Script(prefix + this._compiler(this._prefix + this._code + this._suffix, this.filename) + suffix, {
      filename: this.filename,
      displayErrors: false,
      lineOffset: this.lineOffset,
      columnOffset: this.columnOffset
    });
  }

  /**
   * Will return the cached version of the script intended for VM or compile it.
   *
   * @private
   * @return {vm.Script} The compiled script
   * @throws {SyntaxError} If there is a syntax error in the script.
   */
  _compileVM() {
    let script = this._compiledVM;
    if (!script) {
      this._compiledVM = script = this._compile('', '');
    }
    return script;
  }

  /**
   * Will return the cached version of the script intended for NodeVM or compile it.
   *
   * @private
   * @return {vm.Script} The compiled script
   * @throws {SyntaxError} If there is a syntax error in the script.
   */
  _compileNodeVM() {
    let script = this._compiledNodeVM;
    if (!script) {
      this._compiledNodeVM = script = this._compile('(function (exports, require, module, __filename, __dirname) { ', '\n})');
    }
    return script;
  }

}

/**
 *
 * This callback will be called and has a specific time to finish.<br>
 * No parameters will be supplied.<br>
 * If parameters are required, use a closure.
 *
 * @private
 * @callback runWithTimeout
 * @return {*}
 *
 */

/**
 * Run a function with a specific timeout.
 *
 * @private
 * @param {runWithTimeout} fn - Function to run with the specific timeout.
 * @param {number} timeout - The amount of time to give the function to finish.
 * @return {*} The value returned by the function.
 * @throws {Error} If the function took to long.
 */
function doWithTimeout(fn, timeout) {
  let ctx = CACHE.timeoutContext;
  let script = CACHE.timeoutScript;
  if (!ctx) {
    CACHE.timeoutContext = ctx = vm.createContext();
    CACHE.timeoutScript = script = new vm.Script('fn()', {
      filename: 'timeout_bridge.js',
      displayErrors: false
    });
  }
  ctx.fn = fn;
  try {
    return script.runInContext(ctx, {
      displayErrors: false,
      timeout
    });
  } finally {
    ctx.fn = null;
  }
}

/**
 * Creates the hook to check for the use of async.
 *
 * @private
 * @param {*} internal - The interal vm object.
 * @return {*} The hook function
 */
function makeCheckAsync(internal) {
  return (hook, args) => {
    if (hook === 'function' || hook === 'generator_function' || hook === 'eval' || hook === 'run') {
      const funcConstructor = internal.Function;
      if (hook === 'eval') {
        const script = args[0];
        args = [script];
        if (typeof(script) !== 'string') return args;
      } else {
        // Next line throws on Symbol, this is the same behavior as function constructor calls
        args = args.map(arg => `${arg}`);
      }
      if (args.findIndex(arg => /\basync\b/.test(arg)) === -1) return args;
      const asyncMapped = args.map(arg => arg.replace(/async/g, 'a\\u0073ync'));
      try {
        // Note: funcConstructor is a Sandbox object, however, asyncMapped are only strings.
        funcConstructor(...asyncMapped);
      } catch (u) {
        // u is a sandbox object
        // Some random syntax error or error because of async.

        // First report real syntax errors
        try {
          // Note: funcConstructor is a Sandbox object, however, args are only strings.
          funcConstructor(...args);
        } catch (e) {
          throw internal.Decontextify.value(e);
        }
        // Then async error
        throw new VMError('Async not available');
      }
      return args;
    }
    throw new VMError('Async not available');
  };
}

/**
 * Class VM.
 *
 * @public
 */
class VM extends EventEmitter {

  /**
   * The timeout for {@link VM#run} calls.
   *
   * @public
   * @since v3.9.0
   * @member {number} timeout
   * @memberOf VM#
   */

  /**
   * Get the global sandbox object.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {Object} sandbox
   * @memberOf VM#
   */

  /**
   * The compiler to use to get the JavaScript code.
   *
   * @public
   * @readonly
   * @since v3.9.0
   * @member {(string|compileCallback)} compiler
   * @memberOf VM#
   */

  /**
   * The context for this sandbox.
   *
   * @private
   * @readonly
   * @member {Object} _context
   * @memberOf VM#
   */

  /**
   * The internal methods for this sandbox.
   *
   * @private
   * @readonly
   * @member {{Contextify: Object, Decontextify: Object, Buffer: Object, sandbox:Object}} _internal
   * @memberOf VM#
   */

  /**
   * The resolved compiler to use to get the JavaScript code.
   *
   * @private
   * @readonly
   * @member {compileCallback} _compiler
   * @memberOf VM#
   */

  /**
   * The hook called when some events occurs.
   *
   * @private
   * @readonly
   * @since v3.9.2
   * @member {Function} _hook
   * @memberOf VM#
   */

  /**
   * Create a new VM instance.
   *
   * @public
   * @param {Object} [options] - VM options.
   * @param {number} [options.timeout] - The amount of time until a call to {@link VM#run} will timeout.
   * @param {Object} [options.sandbox] - Objects that will be copied into the global object of the sandbox.
   * @param {(string|compileCallback)} [options.compiler="javascript"] - The compiler to use.
   * @param {boolean} [options.eval=true] - Allow the dynamic evaluation of code via eval(code) or Function(code)().<br>
   * Only available for node v10+.
   * @param {boolean} [options.wasm=true] - Allow to run wasm code.<br>
   * Only available for node v10+.
   * @param {boolean} [options.fixAsync=false] - Filters for async functions.
   * @throws {VMError} If the compiler is unknown.
   */
  constructor(options = {}) {
    super();

    // Read all options
    const {
      timeout,
      sandbox,
      compiler = 'javascript'
    } = options;
    const allowEval = options.eval !== false;
    const allowWasm = options.wasm !== false;
    const fixAsync = !!options.fixAsync;

    // Early error if sandbox is not an object.
    if (sandbox && 'object' !== typeof sandbox) {
      throw new VMError('Sandbox must be object.');
    }

    // Early error if compiler can't be found.
    const resolvedCompiler = lookupCompiler(compiler);

    // Create a new context for this vm.
    const _context = vm.createContext(undefined, {
      codeGeneration: {
        strings: allowEval,
        wasm: allowWasm
      }
    });

    // Create the bridge between the host and the sandbox.
    const _internal = CACHE.contextifyScript.runInContext(_context, DEFAULT_RUN_OPTIONS).call(_context, eval('require'), HOST);

    const hook = fixAsync ? makeCheckAsync(_internal) : null;

    // Define the properties of this object.
    // Use Object.defineProperties here to be able to
    // hide and set properties write only.
    Object.defineProperties(this, {
      timeout: {
        value: timeout,
        writable: true,
        enumerable: true
      },
      compiler: {
        value: compiler,
        enumerable: true
      },
      sandbox: {
        value: _internal.sandbox,
        enumerable: true
      },
      _context: {
        value: _context
      },
      _internal: {
        value: _internal
      },
      _compiler: {
        value: resolvedCompiler
      },
      _hook: {
        value: hook
      }
    });

    if (hook) {
      if (!CACHE.hookScript) {
        CACHE.hookScript = vm.Script(fixasyncModue, {
          filename: 'fixasync.js',
          displayErrors: false
        });
        CACHE.getGlobalScript = new vm.Script('this', {
          filename: 'get_global.js',
          displayErrors: false
        });
        try {
          CACHE.getGeneratorFunctionScript = new vm.Script('(function*(){}).constructor', {
            filename: 'get_generator_function.js',
            displayErrors: false
          });
        } catch (ex) {}
        try {
          CACHE.getAsyncFunctionScript = new vm.Script('(async function(){}).constructor', {
            filename: 'get_async_function.js',
            displayErrors: false
          });
        } catch (ex) {}
        try {
          CACHE.getAsyncGeneratorFunctionScript = new vm.Script('(async function*(){}).constructor', {
            filename: 'get_async_generator_function.js',
            displayErrors: false
          });
        } catch (ex) {}
      }
      const internal = {
        __proto__: null,
        global: CACHE.getGlobalScript.runInContext(_context, DEFAULT_RUN_OPTIONS),
        internal: _internal,
        host: HOST,
        hook
      };
      if (CACHE.getGeneratorFunctionScript) {
        try {
          internal.GeneratorFunction = CACHE.getGeneratorFunctionScript.runInContext(_context, DEFAULT_RUN_OPTIONS);
        } catch (ex) {}
      }
      if (CACHE.getAsyncFunctionScript) {
        try {
          internal.AsyncFunction = CACHE.getAsyncFunctionScript.runInContext(_context, DEFAULT_RUN_OPTIONS);
        } catch (ex) {}
      }
      if (CACHE.getAsyncGeneratorFunctionScript) {
        try {
          internal.AsyncGeneratorFunction = CACHE.getAsyncGeneratorFunctionScript.runInContext(_context, DEFAULT_RUN_OPTIONS);
        } catch (ex) {}
      }
      CACHE.hookScript.runInContext(_context, DEFAULT_RUN_OPTIONS).call(internal);
    }

    // prepare global sandbox
    if (sandbox) {
      this.setGlobals(sandbox);
    }
  }

  /**
   * Adds all the values to the globals.
   *
   * @public
   * @since v3.9.0
   * @param {Object} values - All values that will be added to the globals.
   * @return {this} This for chaining.
   * @throws {*} If the setter of a global throws an exception it is propagated. And the remaining globals will not be written.
   */
  setGlobals(values) {
    for (const name in values) {
      if (Object.prototype.hasOwnProperty.call(values, name)) {
        this._internal.Contextify.setGlobal(name, values[name]);
      }
    }
    return this;
  }

  /**
   * Set a global value.
   *
   * @public
   * @since v3.9.0
   * @param {string} name - The name of the global.
   * @param {*} value - The value of the global.
   * @return {this} This for chaining.
   * @throws {*} If the setter of the global throws an exception it is propagated.
   */
  setGlobal(name, value) {
    this._internal.Contextify.setGlobal(name, value);
    return this;
  }

  /**
   * Get a global value.
   *
   * @public
   * @since v3.9.0
   * @param {string} name - The name of the global.
   * @return {*} The value of the global.
   * @throws {*} If the getter of the global throws an exception it is propagated.
   */
  getGlobal(name) {
    return this._internal.Contextify.getGlobal(name);
  }

  /**
   * Freezes the object inside VM making it read-only. Not available for primitive values.
   *
   * @public
   * @param {*} value - Object to freeze.
   * @param {string} [globalName] - Whether to add the object to global.
   * @return {*} Object to freeze.
   * @throws {*} If the setter of the global throws an exception it is propagated.
   */
  freeze(value, globalName) {
    this._internal.Contextify.readonly(value);
    if (globalName) this._internal.Contextify.setGlobal(globalName, value);
    return value;
  }

  /**
   * Protects the object inside VM making impossible to set functions as it's properties. Not available for primitive values.
   *
   * @public
   * @param {*} value - Object to protect.
   * @param {string} [globalName] - Whether to add the object to global.
   * @return {*} Object to protect.
   * @throws {*} If the setter of the global throws an exception it is propagated.
   */
  protect(value, globalName) {
    this._internal.Contextify.protected(value);
    if (globalName) this._internal.Contextify.setGlobal(globalName, value);
    return value;
  }

  /**
   * Run the code in VM.
   *
   * @public
   * @param {(string|VMScript)} code - Code to run.
   * @param {string} [filename="vm.js"] - Filename that shows up in any stack traces produced from this script.<br>
   * This is only used if code is a String.
   * @return {*} Result of executed code.
   * @throws {SyntaxError} If there is a syntax error in the script.
   * @throws {Error} An error is thrown when the script took to long and there is a timeout.
   * @throws {*} If the script execution terminated with an exception it is propagated.
   */
  run(code, filename) {
    let script;
    if (code instanceof VMScript) {
      if (this._hook) {
        const scriptCode = code.code;
        const changed = this._hook('run', [scriptCode])[0];
        if (changed === scriptCode) {
          script = code._compileVM();
        } else {
          script = new vm.Script(changed, {
            filename: code.filename,
            displayErrors: false
          });
        }
      } else {
        script = code._compileVM();
      }
    } else {
      const useFileName = filename || 'vm.js';
      let scriptCode = this._compiler(code, useFileName);
      if (this._hook) {
        scriptCode = this._hook('run', [scriptCode])[0];
      }
      // Compile the script here so that we don't need to create a instance of VMScript.
      script = new vm.Script(scriptCode, {
        filename: useFileName,
        displayErrors: false
      });
    }

    if (!this.timeout) {
      // If no timeout is given, directly run the script.
      try {
        return this._internal.Decontextify.value(script.runInContext(this._context, DEFAULT_RUN_OPTIONS));
      } catch (e) {
        throw this._internal.Decontextify.value(e);
      }
    }

    return doWithTimeout(() => {
      try {
        return this._internal.Decontextify.value(script.runInContext(this._context, DEFAULT_RUN_OPTIONS));
      } catch (e) {
        throw this._internal.Decontextify.value(e);
      }
    }, this.timeout);
  }

  /**
   * Run the code in VM.
   *
   * @public
   * @since v3.9.0
   * @param {string} filename - Filename of file to load and execute in a NodeVM.
   * @return {*} Result of executed code.
   * @throws {Error} If filename is not a valid filename.
   * @throws {SyntaxError} If there is a syntax error in the script.
   * @throws {Error} An error is thrown when the script took to long and there is a timeout.
   * @throws {*} If the script execution terminated with an exception it is propagated.
   */
  runFile(filename) {
    const resolvedFilename = pa.resolve(filename);

    if (!fs.existsSync(resolvedFilename)) {
      throw new VMError(`Script '${filename}' not found.`);
    }

    if (fs.statSync(resolvedFilename).isDirectory()) {
      throw new VMError('Script must be file, got directory.');
    }

    return this.run(fs.readFileSync(resolvedFilename, 'utf8'), resolvedFilename);
  }

}

/**
 * Event caused by a <code>console.debug</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.debug"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.log</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.log"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.info</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.info"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.warn</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.warn"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.error</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.error"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.dir</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.dir"
 * @type {...*}
 */

/**
 * Event caused by a <code>console.trace</code> call if <code>options.console="redirect"</code> is specified.
 *
 * @public
 * @event NodeVM."console.trace"
 * @type {...*}
 */

/**
 * Class NodeVM.
 *
 * @public
 * @extends {VM}
 * @extends {EventEmitter}
 */
class NodeVM extends VM {

  /**
   * Create a new NodeVM instance.<br>
   *
   * Unlike VM, NodeVM lets you use require same way like in regular node.<br>
   *
   * However, it does not use the timeout.
   *
   * @public
   * @param {Object} [options] - VM options.
   * @param {Object} [options.sandbox] - Objects that will be copied into the global object of the sandbox.
   * @param {(string|compileCallback)} [options.compiler="javascript"] - The compiler to use.
   * @param {boolean} [options.eval=true] - Allow the dynamic evaluation of code via eval(code) or Function(code)().<br>
   * Only available for node v10+.
   * @param {boolean} [options.wasm=true] - Allow to run wasm code.<br>
   * Only available for node v10+.
   * @param {("inherit"|"redirect"|"off")} [options.console="inherit"] - Sets the behavior of the console in the sandbox.
   * <code>inherit</code> to enable console, <code>redirect</code> to redirect to events, <code>off</code> to disable console.
   * @param {Object|boolean} [options.require=false] - Allow require inside the sandbox.
   * @param {(boolean|string[]|Object)} [options.require.external=false] - true, an array of allowed external modules or an object.
   * @param {(string[])} [options.require.external.modules] - Array of allowed external modules. Also supports wildcards, so specifying ['@scope/*-ver-??],
   * for instance, will allow using all modules having a name of the form @scope/something-ver-aa, @scope/other-ver-11, etc.
   * @param {boolean} [options.require.external.transitive=false] - Boolean which indicates if transitive dependencies of external modules are allowed.
   * @param {string[]} [options.require.builtin=[]] - Array of allowed builtin modules, accepts ["*"] for all.
   * @param {(string|string[])} [options.require.root] - Restricted path(s) where local modules can be required. If omitted every path is allowed.
   * @param {Object} [options.require.mock] - Collection of mock modules (both external or builtin).
   * @param {("host"|"sandbox")} [options.require.context="host"] - <code>host</code> to require modules in host and proxy them to sandbox.
   * <code>sandbox</code> to load, compile and require modules in sandbox.
   * Builtin modules except <code>events</code> always required in host and proxied to sandbox.
   * @param {string[]} [options.require.import] - Array of modules to be loaded into NodeVM on start.
   * @param {resolveCallback} [options.require.resolve] - An additional lookup function in case a module wasn't
   * found in one of the traditional node lookup paths.
   * @param {boolean} [options.nesting=false] - Allow nesting of VMs.
   * @param {("commonjs"|"none")} [options.wrapper="commonjs"] - <code>commonjs</code> to wrap script into CommonJS wrapper,
   * <code>none</code> to retrieve value returned by the script.
   * @param {string[]} [options.sourceExtensions=["js"]] - Array of file extensions to treat as source code.
   * @param {string[]} [options.argv=[]] - Array of arguments passed to <code>process.argv</code>.
   * This object will not be copied and the script can change this object.
   * @param {Object} [options.env={}] - Environment map passed to <code>process.env</code>.
   * This object will not be copied and the script can change this object.
   * @throws {VMError} If the compiler is unknown.
   */
  constructor(options = {}) {
    const sandbox = options.sandbox;

    // Throw this early
    if (sandbox && 'object' !== typeof sandbox) {
      throw new VMError('Sandbox must be object.');
    }

    super({
      compiler: options.compiler,
      eval: options.eval,
      wasm: options.wasm
    });

    // defaults
    Object.defineProperty(this, 'options', {
      value: {
        console: options.console || 'inherit',
        require: options.require || false,
        nesting: options.nesting || false,
        wrapper: options.wrapper || 'commonjs',
        sourceExtensions: options.sourceExtensions || ['js']
      }
    });

    let sandboxScript = CACHE.sandboxScript;
    if (!sandboxScript) {
      CACHE.sandboxScript = sandboxScript = new vm.Script(sandboxModule, {
        filename: './sandbox.js',
        displayErrors: false
      });
    }

    const closure = sandboxScript.runInContext(this._context, DEFAULT_RUN_OPTIONS);

    Object.defineProperty(this, '_prepareRequire', {
      value: closure.call(this._context, this, HOST, this._internal.Contextify, this._internal.Decontextify, this._internal.Buffer, options)
    });

    // prepare global sandbox
    if (sandbox) {
      this.setGlobals(sandbox);
    }

    if (this.options.require && this.options.require.import) {
      if (Array.isArray(this.options.require.import)) {
        for (let i = 0, l = this.options.require.import.length; i < l; i++) {
          this.require(this.options.require.import[i]);
        }
      } else {
        this.require(this.options.require.import);
      }
    }
  }

  /**
   * @ignore
   * @deprecated Just call the method yourself like <code>method(args);</code>
   * @param {function} method - Function to invoke.
   * @param {...*} args - Arguments to pass to the function.
   * @return {*} Return value of the function.
   * @todo Can we remove this function? It even had a bug that would use args as this parameter.
   * @throws {*} Rethrows anything the method throws.
   * @throws {VMError} If method is not a function.
   * @throws {Error} If method is a class.
   */
  call(method, ...args) {
    if ('function' === typeof method) {
      return method(...args);
    } else {
      throw new VMError('Unrecognized method type.');
    }
  }

  /**
   * Require a module in VM and return it's exports.
   *
   * @public
   * @param {string} module - Module name.
   * @return {*} Exported module.
   * @throws {*} If the module couldn't be found or loading it threw an error.
   */
  require(module) {
    return this.run(`module.exports = require('${module}');`, 'vm.js');
  }

  /**
   * Run the code in NodeVM.
   *
   * First time you run this method, code is executed same way like in node's regular `require` - it's executed with
   * `module`, `require`, `exports`, `__dirname`, `__filename` variables and expect result in `module.exports'.
   *
   * @param {(string|VMScript)} code - Code to run.
   * @param {string} [filename] - Filename that shows up in any stack traces produced from this script.<br>
   * This is only used if code is a String.
   * @return {*} Result of executed code.
   * @throws {SyntaxError} If there is a syntax error in the script.
   * @throws {*} If the script execution terminated with an exception it is propagated.
   * @fires NodeVM."console.debug"
   * @fires NodeVM."console.log"
   * @fires NodeVM."console.info"
   * @fires NodeVM."console.warn"
   * @fires NodeVM."console.error"
   * @fires NodeVM."console.dir"
   * @fires NodeVM."console.trace"
   */
  run(code, filename) {
    let dirname;
    let resolvedFilename;
    let script;

    if (code instanceof VMScript) {
      script = code._compileNodeVM();
      resolvedFilename = pa.resolve(code.filename);
      dirname = pa.dirname(resolvedFilename);
    } else {
      const unresolvedFilename = filename || 'vm.js';
      if (filename) {
        resolvedFilename = pa.resolve(filename);
        dirname = pa.dirname(resolvedFilename);
      } else {
        resolvedFilename = null;
        dirname = null;
      }
      script = new vm.Script('(function (exports, require, module, __filename, __dirname) { ' +
        this._compiler(code, unresolvedFilename) + '\n})', {
          filename: unresolvedFilename,
          displayErrors: false
        });
    }

    const wrapper = this.options.wrapper;
    const module = this._internal.Contextify.makeModule();

    try {
      const closure = script.runInContext(this._context, DEFAULT_RUN_OPTIONS);

      const returned = closure.call(this._context, module.exports, this._prepareRequire(dirname), module, resolvedFilename, dirname);

      return this._internal.Decontextify.value(wrapper === 'commonjs' ? module.exports : returned);
    } catch (e) {
      throw this._internal.Decontextify.value(e);
    }

  }

  /**
   * Create NodeVM and run code inside it.
   *
   * @public
   * @static
   * @param {string} script - Code to execute.
   * @param {string} [filename] - File name (used in stack traces only).
   * @param {Object} [options] - VM options.
   * @param {string} [options.filename] - File name (used in stack traces only). Used if <code>filename</code> is omitted.
   * @return {*} Result of executed code.
   * @see {@link NodeVM} for the options.
   * @throws {SyntaxError} If there is a syntax error in the script.
   * @throws {*} If the script execution terminated with an exception it is propagated.
   */
  static code(script, filename, options) {
    let unresolvedFilename;
    if (filename != null) {
      if ('object' === typeof filename) {
        options = filename;
        unresolvedFilename = options.filename;
      } else if ('string' === typeof filename) {
        unresolvedFilename = filename;
      } else {
        throw new VMError('Invalid arguments.');
      }
    } else if ('object' === typeof options) {
      unresolvedFilename = options.filename;
    }

    if (arguments.length > 3) {
      throw new VMError('Invalid number of arguments.');
    }

    const resolvedFilename = typeof unresolvedFilename === 'string' ? pa.resolve(unresolvedFilename) : undefined;

    return new NodeVM(options).run(script, resolvedFilename);
  }

  /**
   * Create NodeVM and run script from file inside it.
   *
   * @public
   * @static
   * @param {string} filename - Filename of file to load and execute in a NodeVM.
   * @param {Object} [options] - NodeVM options.
   * @return {*} Result of executed code.
   * @see {@link NodeVM} for the options.
   * @throws {Error} If filename is not a valid filename.
   * @throws {SyntaxError} If there is a syntax error in the script.
   * @throws {*} If the script execution terminated with an exception it is propagated.
   */
  static file(filename, options) {
    const resolvedFilename = pa.resolve(filename);

    if (!fs.existsSync(resolvedFilename)) {
      throw new VMError(`Script '${filename}' not found.`);
    }

    if (fs.statSync(resolvedFilename).isDirectory()) {
      throw new VMError('Script must be file, got directory.');
    }

    return new NodeVM(options).run(fs.readFileSync(resolvedFilename, 'utf8'), resolvedFilename);
  }
}

/**
 * VMError.
 *
 * @public
 * @extends {Error}
 */
class VMError extends Error {

  /**
   * Create VMError instance.
   *
   * @public
   * @param {string} message - Error message.
   */
  constructor(message) {
    super(message);

    this.name = 'VMError';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Host objects
 *
 * @private
 */
const HOST = {
  version: parseInt(process.versions.node.split('.')[0]),
  require: eval('require'),
  process,
  console,
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate,
  String,
  Number,
  Buffer,
  Boolean,
  Array,
  Date,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  RegExp,
  Function,
  Object,
  VMError,
  Proxy,
  Reflect,
  Map,
  WeakMap,
  Set,
  WeakSet,
  Promise,
  Symbol,
  INSPECT_MAX_BYTES,
  VM,
  NodeVM,
  helpers
};

exports.VMError = VMError;
exports.NodeVM = NodeVM;
exports.VM = VM;
exports.VMScript = VMScript;