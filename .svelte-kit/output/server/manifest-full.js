export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "gbp-rating-tool/_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.ClDxYSwB.js",app:"_app/immutable/entry/app.DcIbEipM.js",imports:["_app/immutable/entry/start.ClDxYSwB.js","_app/immutable/chunks/D10FJ1n4.js","_app/immutable/chunks/r3sb4fzG.js","_app/immutable/chunks/Bo0XT3TE.js","_app/immutable/entry/app.DcIbEipM.js","_app/immutable/chunks/r3sb4fzG.js","_app/immutable/chunks/CIgllM7I.js","_app/immutable/chunks/Doc5R4-m.js","_app/immutable/chunks/Bo0XT3TE.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
