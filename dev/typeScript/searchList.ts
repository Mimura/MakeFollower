
$(function ($) {
    $('#form-search').submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();

        // 操作対象のフォーム要素を取得
        var $form = $(this);

        //ボタンを無効化
        var $button = $form.find('#search-button');
        $button.prop('disabled', true);

        API.search($form.serialize())
        .done(
            (result, textStatus, xhr) => {
                console.log("成功");
                //リスト初期化
                console.log(result);
                let users : User[] = result as User[];

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

function SetUserList(users: User[]){
    //初期化
    $("#x-user-list").html('');

    users.forEach(user => {
        let inner = 
        '<li>'+
            '<div class = "list-item">'+
                '<div>'+
                    '<div class = "list-icon" ><img class = "list-icon-img" src="'+user.profile_image_url_https+'" alt="icon"></div>'+
                    '<div class = "list-names">'+
                        '<div class = "list-name">'+user.name +'</div>'+
                        '<div class = "list-screen-name">@'+user.screen_name +'</div>'+
                    '</div>'+
                    '<div class = "list-buttons" id = "list-buttons">'+
                        '<form class = "form-follower to-inline" >'+
                            '<input class = "list-to-follower-button" name = "list-button" value = "Follower" type="submit" >'+
                            '<input name = "screen-name" value = "'+user.screen_name+'" type="hidden" >'+
                        '</form>'+
                        '<form class = "form-follow to-inline">'+
                            '<input class = "list-follow-button" name = "list-button" value = "Follow" type="submit" >'+
                            '<input name = "screen-name" value = "'+user.screen_name+'" type="hidden" >'+
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

        console.log("リストボタンイベント");
        console.log("formの中身" + $form.serialize());

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

        console.log("リストボタンイベント");
        console.log("formの中身" + $form.serialize());

    });
}


class API{
    static search(data : string) {
        var defer = $.Deferred();
        // 送信
        $.ajax({
            url: 'getSearch',
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
  
interface User {
    description: string;
    id: string;
    name: string;
    profile_image_url_https: string;
	screen_name: string;
}