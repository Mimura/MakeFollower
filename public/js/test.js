/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	function AnimationTop() {
	    let camome = new Vivus('x-svg-camome', { start: "autostart", file: '/public/img/camome.svg', type: 'oneByOne', duration: 800 });
	}
	function TweenButton(delay = 0) {
	    TweenMax.from('#x-top-button', 1, { y: 200, autoAlpha: 0, delay: delay });
	}
	function TweenTheme(delay = 0, callBack = null) {
	    TweenMax.from('#x-theme-wrapper', 1, { y: -400, autoAlpha: 0, delay: delay, onComplete: callBack });
	}
	$(window).load(function () {
	    TweenTheme(0.1, () => AnimationTop());
	    TweenButton(7.5);
	});


/***/ }
/******/ ]);
//# sourceMappingURL=../map/typeScriptMap/test.js.map