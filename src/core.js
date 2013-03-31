var
// A central reference to the root jQuery(document)
rootjQuery,

// The deferred used on DOM ready
readyList,

// Support: IE9
// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
core_strundefined = typeof undefined,

// Use the correct document accordingly with window argument (sandbox)
location = window.location,
document = window.document,
docElem = document.documentElement,

// Map over jQuery in case of overwrite
_jQuery = window.jQuery,

// Map over the $ in case of overwrite
_$ = window.$,

// [[Class]] -> type pairs
class2type = {},

// List of deleted data cache ids, so we can reuse them
core_deletedIds = [],

core_version = "@VERSION",

// Save a reference to some core methods
core_concat = core_deletedIds.concat,
core_push = core_deletedIds.push,
core_slice = core_deletedIds.slice,
core_indexOf = core_deletedIds.indexOf,
core_toString = class2type.toString,
core_hasOwn = class2type.hasOwnProperty,
core_trim = core_version.trim,

// Define a local copy of jQuery
jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
},

// Used for matching numbers
core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

// Used for splitting on whitespace
core_rnotwhite = /\S+/g,

// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

// Match a standalone tag
rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

// Matches dashed string for camelizing
rmsPrefix = /^-ms-/,
rdashAlpha = /-([\da-z])/gi,

// Used by jQuery.camelCase as callback to replace()
fcamelCase = function( all, letter ) {
    return letter.toUpperCase();
},

// The ready event handler and self cleanup method
completed = function() {
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    jQuery.ready();
};

jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: core_version,

    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
	var match, elem;

	// HANDLE: $(""), $(null), $(undefined), $(false)
	if ( !selector ) {
	    return this;
	}

	// Handle HTML strings
	if ( typeof selector === "string" ) {
	    if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
		// Assume that strings that start and end with <> are HTML and skip the regex check
		match = [ null, selector, null ];

	    } else {
		match = rquickExpr.exec( selector );
	    }

	    // Match html or make sure no context is specified for #id
	    // htmlタグかつ引数1個
	    if ( match && (match[1] || !context) ) {

		// HANDLE: $(html) -> $(array)
		if ( match[1] ) {
		    context = context instanceof jQuery ? context[0] : context;

		    // scripts is true for back-compat
		    jQuery.merge( this, jQuery.parseHTML(
			match[1],
			context && context.nodeType ? context.ownerDocument || context : document,
			true
		    ) );

		    // HANDLE: $(html, props)
		    if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
			for ( match in context ) {
			    // Properties of context are called as methods if possible
			    if ( jQuery.isFunction( this[ match ] ) ) {
				this[ match ]( context[ match ] );

				// ...and otherwise set as attributes
			    } else {
				this.attr( match, context[ match ] );
			    }
			}
		    }

		    return this;

		    // HANDLE: $(#id)
		} else {
		    elem = document.getElementById( match[2] );

		    // Check parentNode to catch when Blackberry 4.6 returns
		    // nodes that are no longer in the document #6963
		    if ( elem && elem.parentNode ) {
			// Handle the case where IE and Opera return items
			// by name instead of ID
			if ( elem.id !== match[2] ) {
			    return rootjQuery.find( selector );
			}

			// Otherwise, we inject the element directly into the jQuery object
			this.length = 1;
			this[0] = elem;
		    }

		    this.context = document;
		    this.selector = selector;
		    return this;
		}

		// HANDLE: $(expr, $(...))
	    } else if ( !context || context.jquery ) {
		return ( context || rootjQuery ).find( selector );

		// HANDLE: $(expr, context)
		// (which is just equivalent to: $(context).find(expr)
	    } else {
		return this.constructor( context ).find( selector );
	    }

	    // HANDLE: $(DOMElement)
	} else if ( selector.nodeType ) {
	    this.context = this[0] = selector;
	    this.length = 1;
	    return this;

	    // HANDLE: $(function)
	    // Shortcut for document ready
	} else if ( jQuery.isFunction( selector ) ) {
	    return rootjQuery.ready( selector );
	}

	if ( selector.selector !== undefined ) {
	    this.selector = selector.selector;
	    this.context = selector.context;
	}

	return jQuery.makeArray( selector, this );
    },

    // Start with an empty selector
    selector: "",

    // The default length of a jQuery object is 0
    length: 0,

    // The number of elements contained in the matched element set
    size: function() {
	return this.length;
    },

    // 1.4からっぽい
    toArray: function() {
	return core_slice.call( this );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
	// undefined == null でtrueになる
	return num == null ?
	    
	// Return a 'clean' array
	// 古いコードかも
	this.toArray() :

	// Return just the object
	( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    // メソッドチェーンの履歴を残す
    pushStack: function( elems ) {

	// Build a new jQuery matched element set
	var ret = jQuery.merge( this.constructor(), elems );

	// Add the old object onto the stack (as a reference)
	ret.prevObject = this;
	ret.context = this.context;

	// Return the newly-formed element set
	return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function( callback, args ) {
	return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
	// Add the callback
	// 辛い
	// Deferredとかを読まなきゃいけない
	jQuery.ready.promise().done( fn );

	return this;
    },

    slice: function() {
	return this.pushStack( core_slice.apply( this, arguments ) );
    },

    first: function() {
	return this.eq( 0 );
    },

    last: function() {
	return this.eq( -1 );
    },

    // SQL builder?っぽい何かのライブラリの影響
    eq: function( i ) {
	var len = this.length,
	j = +i + ( i < 0 ? len : 0 );
	return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
    },

    map: function( callback ) {
	return this.pushStack( jQuery.map(this, function( elem, i ) {
	    return callback.call( elem, i, elem );
	}));
    },

    // メソッドチェーン出来て、別のものが返る時にendとかaddSelfを呼べるというのが作法っぽい
    end: function() {
	return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    // こんな事できる
    // $('div').push($('span')); ???
    // セレクターの結果からだけで手続きを書き連ねるだけなのがjQueryっぽい？
    push: core_push,
    sort: [].sort,
    splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
	deep = target;
	target = arguments[1] || {};
	// skip the boolean and the target
	i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
	target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
	target = this;
	--i;
    }
    // ゆるふわ引数を許容するjQuery

    for ( ; i < length; i++ ) {
	// Only deal with non-null/undefined values
	if ( (options = arguments[ i ]) != null ) {
	    // Extend the base object
	    for ( name in options ) {
		src = target[ name ];
		copy = options[ name ];

		// Prevent never-ending loop
		if ( target === copy ) {
		    continue;
		}

		// Recurse if we'''re merging plain objects or arrays
		if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
		    if ( copyIsArray ) {
			copyIsArray = false;
			clone = src && jQuery.isArray(src) ? src : [];

		    } else {
			clone = src && jQuery.isPlainObject(src) ? src : {};
		    }

		    // Never move original objects, clone them
		    target[ name ] = jQuery.extend( deep, clone, copy );

		    // Don't bring in undefined values
		    // 存在するundefinedをコピーしないためのチェック
		} else if ( copy !== undefined ) {
		    target[ name ] = copy;
		}
	    }
	}
    }

    // Return the modified object
    return target;
};

jQuery.extend({
    // Unique for each copy of jQuery on the page
    // jQueryにユニークな識別子
    expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

    noConflict: function( deep ) {
	if ( window.$ === jQuery ) {
	    window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
	    window.jQuery = _jQuery;
	}

	return jQuery;
    },

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
	if ( hold ) {
	    jQuery.readyWait++;
	} else {
	    jQuery.ready( true );
	}
    },

    // Handle when the DOM is ready
    // 処理がよくわからないので読み飛ばす。
    // ↑で呼ばれている
    // イベント事に呼ばれてカウンタ操作をする
    // 初期化操作が終わるまでのカウンタ？
    ready: function( wait ) {

	// Abort if there are pending holds or we're already ready
	if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
	    return;
	}

	// Remember that the DOM is ready
	jQuery.isReady = true;

	// If a normal DOM Ready event fired, decrement, and wait if need be
	if ( wait !== true && --jQuery.readyWait > 0 ) {
	    return;
	}

	// If there are functions bound, to execute
	readyList.resolveWith( document, [ jQuery ] );

	// Trigger any bound ready events
	// 初期化が終わってれば onload 的な物をdispatchしてreadyをoffで消す
	if ( jQuery.fn.trigger ) {
	    jQuery( document ).trigger("ready").off("ready");
	}
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function( obj ) {
	return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray,

    isWindow: function( obj ) {
	return obj != null && obj == obj.window;
    },

    // isNaNは、typeof objでnumberが返ってくるNaNを弾くための処理
    isNumeric: function( obj ) {
	// Finiteは有限な数
	return !isNaN( parseFloat(obj) ) && isFinite( obj );
    },

    type: function( obj ) {
	if ( obj == null ) {
	    return String( obj );
	}
	// Support: Safari <=5.1 (functionish RegExp)
	return (typeof obj === "object" || typeof obj === "function" )?
	    (class2type[ core_toString.call(obj) ] || "object" ):
	    typeof obj;
    },

    isPlainObject: function( obj ) {
	// Not plain objects:
	// - Any object or value whose internal [[Class]] property is not "[object Object]"
	// - DOM nodes
	// - window
	if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
	    return false;
	}

	// Support: Firefox >16
	// The try/catch suppresses exceptions thrown when attempting to access
	// the "constructor" property of certain host objects, ie. |window.location|
	try {
	    if ( obj.constructor &&
		 !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
		return false;
	    }
	} catch ( e ) {
	    return false;
	}

	// If the function hasn't returned already, we're confident that
	// |obj| is a plain object, created by {} or constructed with new Object
	return true;
    },

    isEmptyObject: function( obj ) {
	var name;
	for ( name in obj ) {
	    return false;
	}
	return true;
    },

    error: function( msg ) {
	throw new Error( msg );
    },

    // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    parseHTML: function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
	    return null;
	}
	if ( typeof context === "boolean" ) {
	    keepScripts = context;
	    context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
	    return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts ) {
	    jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
    },

    parseJSON: JSON.parse,

    // Cross-browser xml parsing
    parseXML: function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
	    // null を返すのは値がないのを明示的に返すため
	    // undefinedは返り値がないのを表す
	    return null;
	}

	// Support: IE9
	// 正確には、IE8以下を切るということ
	try {
	    tmp = new DOMParser();
	    xml = tmp.parseFromString( data , "text/xml" );
	} catch ( e ) {
	    xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
	    jQuery.error( "Invalid XML: " + data );
	}
	return xml;
    },

    // 何もしない関数を使いたいときに参照
    noop: function() {},

    // Evaluates a script in a global context
    globalEval: function( data ) {
	// ECMAScript5では、evalを直接呼び出すと、ローカルの関数スコープ
	// 間接的に呼び出すと、グローバルスコープになる
	var indirect = eval;
	if ( jQuery.trim( data ) ) {
	    // 優しさ
	    indirect( data + ";" );
	}
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
	// -ms-hoge-fuga →ms-hoge-fuga
	// rmsPrefixの処理を分けて実装したい
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    // nodeNameがブラウザによって大文字かどうかバラ付き合って、比較したいときに使う
    nodeName: function( elem, name ) {
	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    // args is for internal usage only
    each: function( obj, callback, args ) {
	var value,
	i = 0,
	length = obj.length,
	isArray = isArraylike( obj );

	if ( args ) {
	    if ( isArray ) {
		for ( ; i < length; i++ ) {
		    value = callback.apply( obj[ i ], args );

		    if ( value === false ) {
			break;
		    }
		}
	    } else {
		for ( i in obj ) {
		    value = callback.apply( obj[ i ], args );

		    if ( value === false ) {
			break;
		    }
		}
	    }

	    // A special, fast, case for the most common use of each
	} else {
	    if ( isArray ) {
		for ( ; i < length; i++ ) {
		    value = callback.call( obj[ i ], i, obj[ i ] );

		    if ( value === false ) {
			break;
		    }
		}
	    } else {
		for ( i in obj ) {
		    value = callback.call( obj[ i ], i, obj[ i ] );

		    if ( value === false ) {
			break;
		    }
		}
	    }
	}

	return obj;
    },

    trim: function( text ) {
	return text == null ? "" : core_trim.call( text );
    },

    // results is for internal usage only
    makeArray: function( arr, results ) {
	var ret = results || [];

	if ( arr != null ) {
	    if ( isArraylike( Object(arr) ) ) {
		jQuery.merge( ret,
			      // 文字列はArray
			      typeof arr === "string" ?
			      [ arr ] : arr
			    );
	    } else {
		core_push.call( ret, arr );
	    }
	}

	return ret;
    },

    inArray: function( elem, arr, i ) {
	return arr == null ? -1 : core_indexOf.call( arr, elem, i );
    },

    merge: function( first, second ) {
	var l = second.length,
	i = first.length,
	j = 0;

	// first =[1,2,3]
	// sencond =[4,5]
	// [1,2,3,4,5]
	if ( typeof l === "number" ) {
	    for ( ; j < l; j++ ) {
		first[ i++ ] = second[ j ];
	    }
	} else {
	    while ( second[j] !== undefined ) {
		first[ i++ ] = second[ j++ ];
	    }
	}

	first.length = i;

	return first;
    },

    grep: function( elems, callback, inv ) {
	var retVal,
	ret = [],
	i = 0,
	length = elems.length;
	inv = !!inv;

	// Go through the array, only saving the items
	// that pass the validator function
	for ( ; i < length; i++ ) {
	    retVal = !!callback( elems[ i ], i );
	    if ( inv !== retVal ) {
		ret.push( elems[ i ] );
	    }
	}

	return ret;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
	var value,
	i = 0,
	length = elems.length,
	isArray = isArraylike( elems ),
	ret = [];

	// Go through the array, translating each of the items to their
	if ( isArray ) {
	    for ( ; i < length; i++ ) {
		value = callback( elems[ i ], i, arg );

		if ( value != null ) {
		    ret[ ret.length ] = value;
		}
	    }

	    // Go through every key on the object,
	} else {
	    for ( i in elems ) {
		value = callback( elems[ i ], i, arg );

		if ( value != null ) {
		    ret[ ret.length ] = value;
		}
	    }
	}

	// Flatten any nested arrays
	return core_concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
	    tmp = fn[ context ];
	    context = fn;
	    fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	// 謎仕様. jQueryで統一感をもたせるため？？？
	if ( !jQuery.isFunction( fn ) ) {
	    return undefined;
	}

	// Simulated bind
	args = core_slice.call( arguments, 2 );
	proxy = function() {
	    return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	// proxyしたものをproxyをすると、guidは変わらない。
	// jQueryの中で識別するために使う
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
    },

    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
	length = elems.length,
	bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
	    chainable = true;
	    for ( i in key ) {
		jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
	    }

	    // Sets one value
	} else if ( value !== undefined ) {
	    chainable = true;

	    if ( !jQuery.isFunction( value ) ) {
		raw = true;
	    }

	    if ( bulk ) {
		// Bulk operations run against the entire set
		if ( raw ) {
		    fn.call( elems, value );
		    fn = null;

		    // ...except when executing function values
		} else {
		    bulk = fn;
		    fn = function( elem, key, value ) {
			return bulk.call( jQuery( elem ), value );
		    };
		}
	    }

	    if ( fn ) {
		for ( ; i < length; i++ ) {
		    fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
		}
	    }
	}

	// jQueryオブジェクト以外を返すのがnot chainable
	return chainable ?
	    elems :

	// Gets
	bulk ? 
	    fn.call( elems ) : (length ? fn( elems[0], key ) : emptyGet)
	;
	    
    },

    now: Date.now
});

jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

	readyList = jQuery.Deferred();

	// Catch cases where $(document).ready() is called after the browser event has already occurred.
	// we once tried to use readyState "interactive" here, but it caused issues like the one
	// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15

	// DOMの状態が
	if ( document.readyState === "complete" ) {
	    // Handle it asynchronously to allow scripts the opportunity to delay ready
	    setTimeout( jQuery.ready );

	} else {

	    // Use the handy event callback
	    document.addEventListener( "DOMContentLoaded", completed, false );

	    // A fallback to window.onload, that will always work
	    window.addEventListener( "load", completed, false );
	}
    }
    return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
    var length = obj.length,
    type = jQuery.type( obj );

    if ( jQuery.isWindow( obj ) ) {
	return false;
    }

    // Node.ELEMENT_NODE == 1
    if ( obj.nodeType === 1 && length ) {
	return true;
    }

    // lengthが0か、数字かつ0以上勝つ、配列の最後の要素を持っているかどうかをチェック
    return type === "array" || type !== "function" &&
	( length === 0 ||
	  typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
