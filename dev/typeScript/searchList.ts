
//検索条件ワードの保存
var searchWord :string = "";
var searchPage :number = 0;
//フォロー済み隠すかどうか
var isHideFollowed :boolean = true;
var userItemList: IDJequery;

$(function ($) {

    SetAllButtonEvent();
    SetSearchButtonEvent();

})


let prevContentBottom = -10;
$(window).scroll(function(){
    let contentBottom = $('#x-user-list').offset().top + $('#x-user-list').height();
    let displayBottom = $(window).scrollTop() + $(window).height();

    if (contentBottom - displayBottom < 100){
        if(contentBottom == prevContentBottom){
            return;
        }
        prevContentBottom = contentBottom;

        console.log("ページ : " + searchPage);
        API.search('searchWord='+searchWord+'&page='+searchPage)
        .done(
            (result, textStatus, xhr) => {
                let users : User[] = OnGetSearchedList(result);

                SetUserList(users);
            }
        )
        .always(
            (xhr, textStatus) => {

            },
        )
        .fail(
            () =>{
                //エラー処理
                console.log("失敗");
            }
        )
    }
});

function OnGetSearchedList(result : {}): User[]
{
    let received : receivedData = result as receivedData;
    let users : User[] = received.userDataArray;
    searchPage = received.nextPage;
    return users;
}

function SetUserList(users: User[]){
    users.forEach(user => {
        let inner = 
        '<li>'+
            '<div class = "list-item">'+
                '<div>'+
                    '<div class = "list-icon" ><img class = "list-icon-img" src="'+user.profile_image_url_https+'" alt="icon"></div>'+
                    '<div class = "list-names">'+
                        '<a class = "list-name" href = "https://twitter.com/'+ user.screen_name +'" >'+user.name +'</a>'+
                        '<div class = "list-screen-name">@'+user.screen_name +'</div>'+
                    '</div>'+
                    '<div class = "list-buttons" id = "list-buttons">'+
                        '<form class = "form-follower to-inline" >'+
                            '<input class = "list-to-follower-button" name = "list-button" value = "Follower" type="submit" >'+
                            '<input name = "userId" class = "hidden-user-id" value = "'+user.id+'" type="hidden" >'+
                        '</form>'+
                        '<form class = "form-follow to-inline">'+
                            '<input class = "list-follow-button" name = "list-button" value = "Follow" type="submit" >'+
                            '<input name = "userId" class = "hidden-user-id" value = "'+user.id+'" type="hidden" >'+
                        '</form>'+
                        '<form class = "form-unfollow to-inline">'+
                            '<input class = "list-unfollow-button" name = "list-button" value = "Unfollow" type="submit" style="display:none" >'+
                            '<input name = "userId" class = "hidden-user-id" value = "'+user.id+'" type="hidden" >'+
                        '</form>'+
                    '</div>'+
                '</div>'+
                '<div class = "list-description">'+user.description+'</div>'+
            '</div>'+
            '<div class = "list-border"></div>'
        '</li>'
        ;

        let $self =$(inner) 
        $("#x-user-list").append($self);

        UpdateButtonVisible($self,user);

        if(isHideFollowed){
            UpdateItemVisible($self,user.is_followed);
        }

        userItemList[user.id] = new userItemData($self,user);
        console.log(userItemList[user.id].data.name);
        console.log("id : " +user.id);
        console.log("フォローしているかどうか" + user.is_followed);
    });

    SetFollowerButtonEvent();
    SetFollowButtonEvent();
    SetUnFollowButtonEvent();

}

function SetFollowerButtonEvent()
{
    let forms = $('.form-follower');
    //既に登録されているものを消す
    forms.off('submit');
    forms.submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();

        // 操作対象のフォーム要素を取得
        var $form = $(this);

    });
}

function SetFollowButtonEvent()
{
    let forms = $('.form-follow');
    //既に登録されているものを消す
    forms.off('submit');
    forms.submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();
        // 操作対象のフォーム要素を取得
        var $form = $(this);
        var userId = $form.find('.hidden-user-id').val();
        Follow($form,userId);
    });
}

function SetUnFollowButtonEvent()
{
    let forms = $('.form-unfollow');
    //既に登録されているものを消す
    forms.off('submit');
    forms.submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();
        // 操作対象のフォーム要素を取得
        var $form = $(this);
        var userId = $form.find('.hidden-user-id').val();
        UnFollow($form,userId);
    });
}

function UnFollow($form:JQuery,userId : string){
    //ボタンを無効化
    var $button = $form.find('.list-unfollow-button');
    $button.prop('disabled', true);

    API.sendUnFollow($form.serialize())
    .done(
        (result, textStatus, xhr) => {
            userItemList[userId].data.is_followed = false;
            console.log("アンフォロー成功");
            UpdateButtonVisible(userItemList[userId].$element,userItemList[userId].data);
        }
    )
    .always(
        (xhr, textStatus) => {
            $button.prop('disabled', false);
        },
    )
    .fail(
        () =>{
            //エラー処理
            console.log("失敗");
        }
    )

}

function Follow($form:JQuery,userId : string){

    //ボタンを無効化
    var $button = $form.find('.list-follow-button');
    $button.prop('disabled', true);

    API.sendFollow($form.serialize())
    .done(
        (result, textStatus, xhr) => {
            console.log("フォロー成功");
            userItemList[userId].data.is_followed = true;
            if(isHideFollowed){
                UpdateItemVisible(userItemList[userId].$element,userItemList[userId].data.is_followed);
            }
            UpdateButtonVisible(userItemList[userId].$element,userItemList[userId].data);
        }
    )
    .always(
        (xhr, textStatus) => {
            $button.prop('disabled', false);
        },
    )
    .fail(
        () =>{
            //エラー処理
            console.log("失敗");
        }
    )
}

function SetSearchButtonEvent()
{
    $('#form-search').submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();

        // 操作対象のフォーム要素を取得
        var $form = $(this);

        searchWord = $('#search-word').val();

        //ボタンを無効化
        var $button = $form.find('#search-button');
        $button.prop('disabled', true);

        //初期化
        $("#x-user-list").html('');
        userItemList = {};
        searchPage = 1;
        
        console.log("シリアライズしたやつ　" + $form.serialize());
        API.search($form.serialize()+'&page='+searchPage)
        .done(
            (result, textStatus, xhr) => {
                console.log("成功");
                //リスト初期化
                console.log(result);

                let users : User[] = OnGetSearchedList(result);

                SetUserList(users);
            }
        )
        .always(
            (xhr, textStatus) => {
                // ボタンを有効化し、再送信を許可
                $button.prop('disabled', false);
            },
        )
        .fail(
            () =>{
                //エラー処理
                console.log("失敗");
            }
        )
    });
}

function SetAllButtonEvent()
{
    let allButton = $('#all-button');
    allButton.click(function (event) {
        isHideFollowed = !isHideFollowed;
        UpdateListVisible(isHideFollowed);
    });
}

function UpdateListVisible(isHideFollowed : boolean)
{
   for(var key in userItemList){
       var userData = userItemList[key];

       //隠さない設定なら全部出す
        if(!isHideFollowed){
            userData.$element.show();
            continue;
        }

        UpdateItemVisible(userData.$element,userData.data.is_followed);
   }
}

function UpdateItemVisible($element:JQuery,isFollowed:boolean)
{
    if(isFollowed){
        $element.hide();
    }else{
        $element.show();
    }
}

function UpdateButtonVisible($item : JQuery,userData :User)
{
    let $followButton = $item.find(".list-follow-button");
    let $unFollowButton = $item.find(".list-unfollow-button");
    if(userData.is_followed){
        $followButton.hide();
        $unFollowButton.show();
    }else{
        $followButton.show();
        $unFollowButton.hide();
    }


}


class API{
    static search(data : string) {
        var defer = $.Deferred();
        // 送信
        $.ajax({
            url: 'GetSearch',
            type: 'GET',
            data: data,
            dataType: 'json',
            timeout: 10000,  // 単位はミリ秒
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    }

    static sendFollow(data : string) {
        var defer = $.Deferred();
        // 送信
        $.ajax({
            url: 'SendFollow',
            type: 'GET',
            data: data,
            dataType: 'json',
            timeout: 10000,  // 単位はミリ秒
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    }

    static sendUnFollow(data : string) {
        var defer = $.Deferred();
        // 送信
        $.ajax({
            url: 'SendUnFollow',
            type: 'GET',
            data: data,
            dataType: 'json',
            timeout: 10000,  // 単位はミリ秒
            success: defer.resolve,
            error: defer.reject
        });
        return defer.promise();
    }
};

class IDJequery {
  [id: string]: userItemData;
}

class userItemData{
    constructor(public $element:JQuery,public data:User){
    }
}
  
class receivedData  {
	userDataArray:User[];
	nextPage:number;
}
class User {
    description: string;
    id: string;
    name: string;
    profile_image_url_https: string;
	screen_name: string;
	is_followed: boolean;
}