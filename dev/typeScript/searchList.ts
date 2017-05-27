
//検索条件ワードの保存
var searchWord :string = "";
var searchPage :number = 0;

$(function ($) {
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
        
        console.log("シリアライズしたやつ　" + $form.serialize());
        searchPage = 1
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
                            '<input name = "userId" value = "'+user.id+'" type="hidden" >'+
                        '</form>'+
                        '<form class = "form-follow to-inline">'+
                            '<input class = "list-follow-button" name = "list-button" value = "Follow" type="submit" >'+
                            '<input name = "userId" value = "'+user.id+'" type="hidden" >'+
                        '</form>'+
                    '</div>'+
                '</div>'+
                '<div class = "list-description">'+user.description+'</div>'+
            '</div>'+
        '</li>'+
        '<div class = "list-border"></border>'
        ;

        $("#x-user-list").append(inner);
    });

    SetFollowerButtonEvent();
    SetFollowButtonEvent();

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

        //ボタンを無効化
        var $button = $form.find('.list-follow-button');
        $button.prop('disabled', true);

        API.sendFollow($form.serialize())
        .done(
            (result, textStatus, xhr) => {
                console.log("フォロー成功？");
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

        console.log("リストボタンイベント");
        console.log("formの中身" + $form.serialize());

    });
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
};
  
interface receivedData  {
	userDataArray:User[];
	nextPage:number;
}
interface User {
    description: string;
    id: string;
    name: string;
    profile_image_url_https: string;
	screen_name: string;
}