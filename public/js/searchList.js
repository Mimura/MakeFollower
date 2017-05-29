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

	var searchWord = "";
	var searchPage = 0;
	var isHideFollowed = true;
	var userItemList;
	$(function ($) {
	    SetAllButtonEvent();
	    SetSearchButtonEvent();
	});
	let prevContentBottom = -10;
	$(window).scroll(function () {
	    let contentBottom = $('#x-user-list').offset().top + $('#x-user-list').height();
	    let displayBottom = $(window).scrollTop() + $(window).height();
	    if (contentBottom - displayBottom < 100) {
	        if (contentBottom == prevContentBottom) {
	            return;
	        }
	        prevContentBottom = contentBottom;
	        console.log("ページ : " + searchPage);
	        API.search('searchWord=' + searchWord + '&page=' + searchPage)
	            .done((result, textStatus, xhr) => {
	            let users = OnGetSearchedList(result);
	            SetUserList(users);
	        })
	            .always((xhr, textStatus) => {
	        })
	            .fail(() => {
	            console.log("失敗");
	        });
	    }
	});
	function OnGetSearchedList(result) {
	    let received = result;
	    let users = received.userDataArray;
	    searchPage = received.nextPage;
	    return users;
	}
	function SetUserList(users) {
	    users.forEach(user => {
	        let inner = '<li>' +
	            '<div class = "list-item">' +
	            '<div>' +
	            '<div class = "list-icon" ><img class = "list-icon-img" src="' + user.profile_image_url_https + '" alt="icon"></div>' +
	            '<div class = "list-names">' +
	            '<a class = "list-name" href = "https://twitter.com/' + user.screen_name + '" >' + user.name + '</a>' +
	            '<div class = "list-screen-name">@' + user.screen_name + '</div>' +
	            '</div>' +
	            '<div class = "list-buttons" id = "list-buttons">' +
	            '<form class = "form-follower to-inline" >' +
	            '<input class = "list-to-follower-button" name = "list-button" value = "Follower" type="submit" >' +
	            '<input name = "userId" class = "hidden-user-id" value = "' + user.id + '" type="hidden" >' +
	            '</form>' +
	            '<form class = "form-follow to-inline">' +
	            '<input class = "list-follow-button" name = "list-button" value = "Follow" type="submit" >' +
	            '<input name = "userId" class = "hidden-user-id" value = "' + user.id + '" type="hidden" >' +
	            '</form>' +
	            '<form class = "form-unfollow to-inline">' +
	            '<input class = "list-unfollow-button" name = "list-button" value = "Unfollow" type="submit" style="display:none" >' +
	            '<input name = "userId" class = "hidden-user-id" value = "' + user.id + '" type="hidden" >' +
	            '</form>' +
	            '</div>' +
	            '</div>' +
	            '<div class = "list-description">' + user.description + '</div>' +
	            '</div>' +
	            '<div class = "list-border"></div>';
	        '</li>';
	        let $self = $(inner);
	        $("#x-user-list").append($self);
	        UpdateButtonVisible($self, user);
	        if (isHideFollowed) {
	            UpdateItemVisible($self, user.is_followed);
	        }
	        userItemList[user.id] = new userItemData($self, user);
	        console.log(userItemList[user.id].data.name);
	        console.log("id : " + user.id);
	        console.log("フォローしているかどうか" + user.is_followed);
	    });
	    SetFollowerButtonEvent();
	    SetFollowButtonEvent();
	    SetUnFollowButtonEvent();
	}
	function SetFollowerButtonEvent() {
	    let forms = $('.form-follower');
	    forms.off('submit');
	    forms.submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	    });
	}
	function SetFollowButtonEvent() {
	    let forms = $('.form-follow');
	    forms.off('submit');
	    forms.submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        var userId = $form.find('.hidden-user-id').val();
	        Follow($form, userId);
	    });
	}
	function SetUnFollowButtonEvent() {
	    let forms = $('.form-unfollow');
	    forms.off('submit');
	    forms.submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        var userId = $form.find('.hidden-user-id').val();
	        UnFollow($form, userId);
	    });
	}
	function UnFollow($form, userId) {
	    var $button = $form.find('.list-unfollow-button');
	    $button.prop('disabled', true);
	    API.sendUnFollow($form.serialize())
	        .done((result, textStatus, xhr) => {
	        userItemList[userId].data.is_followed = false;
	        console.log("アンフォロー成功");
	        UpdateButtonVisible(userItemList[userId].$element, userItemList[userId].data);
	    })
	        .always((xhr, textStatus) => {
	        $button.prop('disabled', false);
	    })
	        .fail(() => {
	        console.log("失敗");
	    });
	}
	function Follow($form, userId) {
	    var $button = $form.find('.list-follow-button');
	    $button.prop('disabled', true);
	    API.sendFollow($form.serialize())
	        .done((result, textStatus, xhr) => {
	        console.log("フォロー成功");
	        userItemList[userId].data.is_followed = true;
	        if (isHideFollowed) {
	            UpdateItemVisible(userItemList[userId].$element, userItemList[userId].data.is_followed);
	        }
	        UpdateButtonVisible(userItemList[userId].$element, userItemList[userId].data);
	    })
	        .always((xhr, textStatus) => {
	        $button.prop('disabled', false);
	    })
	        .fail(() => {
	        console.log("失敗");
	    });
	}
	function SetSearchButtonEvent() {
	    $('#form-search').submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        searchWord = $('#search-word').val();
	        var $button = $form.find('#search-button');
	        $button.prop('disabled', true);
	        $("#x-user-list").html('');
	        userItemList = {};
	        searchPage = 1;
	        console.log("シリアライズしたやつ　" + $form.serialize());
	        API.search($form.serialize() + '&page=' + searchPage)
	            .done((result, textStatus, xhr) => {
	            console.log("成功");
	            console.log(result);
	            let users = OnGetSearchedList(result);
	            SetUserList(users);
	        })
	            .always((xhr, textStatus) => {
	            $button.prop('disabled', false);
	        })
	            .fail(() => {
	            console.log("失敗");
	        });
	    });
	}
	function SetAllButtonEvent() {
	    let allButton = $('#all-button');
	    allButton.click(function (event) {
	        isHideFollowed = !isHideFollowed;
	        UpdateListVisible(isHideFollowed);
	    });
	}
	function UpdateListVisible(isHideFollowed) {
	    for (var key in userItemList) {
	        var userData = userItemList[key];
	        if (!isHideFollowed) {
	            userData.$element.show();
	            continue;
	        }
	        UpdateItemVisible(userData.$element, userData.data.is_followed);
	    }
	}
	function UpdateItemVisible($element, isFollowed) {
	    if (isFollowed) {
	        $element.hide();
	    }
	    else {
	        $element.show();
	    }
	}
	function UpdateButtonVisible($item, userData) {
	    let $followButton = $item.find(".list-follow-button");
	    let $unFollowButton = $item.find(".list-unfollow-button");
	    if (userData.is_followed) {
	        $followButton.hide();
	        $unFollowButton.show();
	    }
	    else {
	        $followButton.show();
	        $unFollowButton.hide();
	    }
	}
	class API {
	    static search(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'GetSearch',
	            type: 'GET',
	            data: data,
	            dataType: 'json',
	            timeout: 10000,
	            success: defer.resolve,
	            error: defer.reject
	        });
	        return defer.promise();
	    }
	    static sendFollow(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'SendFollow',
	            type: 'GET',
	            data: data,
	            dataType: 'json',
	            timeout: 10000,
	            success: defer.resolve,
	            error: defer.reject
	        });
	        return defer.promise();
	    }
	    static sendUnFollow(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'SendUnFollow',
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
	class IDJequery {
	}
	class userItemData {
	    constructor($element, data) {
	        this.$element = $element;
	        this.data = data;
	    }
	}
	class receivedData {
	}
	class User {
	}


/***/ }
/******/ ]);
//# sourceMappingURL=../map/typeScriptMap/searchList.js.map