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

	jQuery(function ($) {
	    $('#main-form').submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        var $button = $form.find('#search-button');
	        $.ajax({
	            url: 'getSearch',
	            type: 'GET',
	            data: $form.serialize(),
	            dataType: 'json',
	            timeout: 10000,
	            beforeSend: function (xhr, settings) {
	                $button.prop('disabled', true);
	            },
	            complete: function (xhr, textStatus) {
	                $button.prop('disabled', false);
	            },
	            success: function (result, textStatus, xhr) {
	                console.log(result);
	                let users = result;
	                SetUserList(users);
	            }
	        });
	    });
	});
	function SetUserList(users) {
	    $("#x-user-list").html('');
	    users.forEach(user => {
	        let inner = '<li>' +
	            '<img class = "list-icon" src="' + user.profile_image_url_https + '" alt="icon">' +
	            '<div class = "list-name">' + user.name + '<div>' +
	            '<div class = "list-description">' + user.description + '<div>' +
	            '<button class = "list-to-follower-button" type="button" onclick="location.href=\'App/followerList\'">' + "フォロワー" + '</button>' +
	            '<button class = "list-follow-button" type="button" onclick="location.href=\'/App/follow\'">' + "フォロー" + '</button>' +
	            '</li>';
	        $("#x-user-list").append(inner);
	    });
	}


/***/ }
/******/ ]);
//# sourceMappingURL=../map/typeScriptMap/searchList.js.map