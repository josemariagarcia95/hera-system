module.exports = {
	"extends": "google",
	"parserOptions": {
		"ecmaVersion": 2017
	},
	"env": {
		"es6": true
	},
	"rules": {
		"object-curly-spacing": 0,
		"new-cap": [ 0, {
			"capIsNew": 0
		} ],
		"no-unused-vars": 1,
		"linebreak-style": 0,
		"indent": [ "error", "tab", {
			"SwitchCase": 1
		} ],
		"no-tabs": 0,
		"spaced-comment": 0,
		"comma-dangle": [ "error", "never" ],
		"space-before-function-paren": 0,
		"array-bracket-spacing": 0,
		"computed-property-spacing": 0,
		"guard-for-in": 0,
		"max-len": [ "error", {
			"code": 130,
			"ignoreComments": true
		} ],
		"prefer-spread": 0
	}
};
