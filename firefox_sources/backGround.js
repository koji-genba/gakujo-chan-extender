//message_readerから指示受けてページリロードするやつ
browser.runtime.onMessage.addListener(function(message, sender, callback) {
    //一応リンクを受け取っていることをそれとなく確認
    if ( message.url.indexOf('campusweb/')>0 ) {
        //受けたリンクを別タブで開く
        browser.tabs.create({
            'url': message.url , //アドレス指定
            'active': false ,    //タブ開いても画面は切り替えない
            },function(tab){
                //1秒たったらタブ閉じる
                setTimeout(function(){browser.tabs.remove(tab.id);}, 1000);
            });
    }
})