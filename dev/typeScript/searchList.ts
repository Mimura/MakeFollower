
jQuery(function ($) {
    $('#main-form').submit(function (event) {
        // HTMLでの送信をキャンセル
        event.preventDefault();

        // 操作対象のフォーム要素を取得
        var $form = $(this);

        // 送信ボタンを取得
        // （後で使う: 二重送信を防止する。）
        var $button = $form.find('#search-button');

        // 送信
        $.ajax({
            url: 'getSearch',
            type: 'GET',
            data: $form.serialize(),
            dataType: 'json',
            timeout: 10000,  // 単位はミリ秒

            // 送信前
            beforeSend: function (xhr, settings) {
                // ボタンを無効化し、二重送信を防止
                $button.prop('disabled', true);
            },
            // 応答後
            complete: function (xhr, textStatus) {
                // ボタンを有効化し、再送信を許可
                $button.prop('disabled', false);
            },

            // 通信成功時の処理
            success: function (result, textStatus, xhr) {
                //リスト初期化
                console.log(result);
                let users : User[] = result as User[];

                SetUserList(users);
            }
        });
    });

})

function SetUserList(users: User[]){
    //初期化
    $("#x-user-list").html('');

    users.forEach(user => {
        let inner = 
        '<li>'+
            '<img class = "list-icon" src="'+user.profile_image_url_https+'" alt="icon">'+
            '<div class = "list-name">'+user.name +'<div>'+
            '<div class = "list-description">'+user.description+'<div>'+
            '<button class = "list-to-follower-button" type="button" onclick="location.href=\'App/followerList\'">'+"フォロワー"+'</button>'+
            '<button class = "list-follow-button" type="button" onclick="location.href=\'/App/follow\'">'+"フォロー"+'</button>'+
        '</li>';

        $("#x-user-list").append(inner);
    });

}

interface User {
    description: string;
    id: string;
    name: string;
    profile_image_url_https: string;
	screen_name: string;
}