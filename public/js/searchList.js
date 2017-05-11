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

	$(function ($) {
	    $('#form-search').submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        var $button = $form.find('#search-button');
	        $button.prop('disabled', true);
	        API.search($form.serialize())
	            .done((result, textStatus, xhr) => {
	            console.log("成功");
	            console.log(result);
	            let users = result;
	            SetUserList(users);
	        })
	            .always((xhr, textStatus) => {
	            $button.prop('disabled', false);
	        })
	            .fail(() => {
	            console.log("失敗");
	        });
	    });
	});
	function SetUserList(users) {
	    $("#x-user-list").html('');
	    users.forEach(user => {
	        let inner = '<li>' +
	            '<div class = "list-item">' +
	            '<div>' +
	            '<div class = "list-icon" ><img class = "list-icon-img" src="' + user.profile_image_url_https + '" alt="icon"></div>' +
	            '<div class = "list-names">' +
	            '<div class = "list-name">' + user.name + '</div>' +
	            '<div class = "list-screen-name">' + user.screen_name + '</div>' +
	            '</div>' +
	            '<div class = "list-buttons">' +
	            '<button class = "list-to-follower-button" type="button" onclick="location.href=\'App/followerList\'">' + "Follower" + '</button>' +
	            '<button class = "list-follow-button" type="button" onclick="location.href=\'/App/follow\'">' + "Follow" + '</button>' +
	            '</div>' +
	            '</div>' +
	            '<div class = "list-description">' + user.description + '</div>' +
	            '</div>' +
	            '</li>' +
	            '<div class = "list-border"></border>';
	        $("#x-user-list").append(inner);
	    });
	}
	class API {
	    static search(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'getSearch',
	            type: 'GET',
	            data: data,
	            dataType: 'json',
	            timeout: 10000,
	            success: defer.resolve,
	            error: defer.reject
	        });
	        return defer.promise();
	    }
	}
	;


/***/ }
/******/ ]);
//# sourceMappingURL=../map/typeScriptMap/searchList.js.map