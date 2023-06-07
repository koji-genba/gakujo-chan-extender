//=====
//browserify 2FA.js -o 2FA-bundle.js -t [ babelify --presets [@babel/preset-env] ]

import { authenticator } from 'otplib';
//2fa自動入力部分
function totp(key){
    //引数:二段階認証秘密鍵
    //返す:6桁数字(二段階認証のやつ)
    //依存:authenicator関数(from:otplib(外部ライブラリ))
    //その他作用:なし
    return authenticator.generate(key);
}
//2fa鍵保存部分
function key_save(){
    //引数:なし
    //返す:なし
    //依存:main関数(key_setform生成がmain関数内)
    //その他作用:mainで生成した鍵保存フォームの内容をストレージに保存
    var str = document.getElementById("key_setform").value; //
    chrome.storage.local.set({"key": str});
}
//起動
    //引数:なし
    //返す:なし
    //依存:なし
    //その他作用:ちょっとまってからmain関数を起動する
setTimeout(main_call,1500); //1.5秒してから起動する
function main_call(){
    if (!document.getElementById("portaltimerimg")){ //入力枠が存在していたらmain関数起動
        main();
    }
}
function main() {
    //引数:なし
    //返す:なし
    //依存:totp関数(二段階認証数字生成のため)
    //その他作用:画面に秘密鍵保存フォーム作る

    //2fa鍵保存部分のために画面にオブジェクト作る奴ら
        //文字追加1
    document.getElementsByName("form")[0].appendChild(document.createElement("br"));
    const p1 = document.createElement("p");
    const text1 = document.createTextNode("以下は学情拡張機能によって追加された部分です");
    p1.appendChild(text1);
    document.getElementsByName("form")[0].appendChild(p1);
        //文字追加2
    document.getElementsByName("form")[0].appendChild(document.createElement("br"));
    const p2 = document.createElement("p");
    const text2 = document.createTextNode("拡張機能2FA鍵保存フォーム");
    p2.appendChild(text2);
    document.getElementsByName("form")[0].appendChild(p2);

        //秘密鍵入力フォーム
    const key_setform = document.createElement("input");
    key_setform.id = "key_setform";
    key_setform.setAttribute("type", "text");
    key_setform.setAttribute("size", "50");
    document.getElementsByName("form")[0].appendChild(key_setform);

        //秘密鍵保存ボタン
    const savebutton = document.createElement("button");
    savebutton.id = "savebutton";
    savebutton.textContent = "save";
    savebutton.addEventListener('click',function(){
        key_save();
    });
    document.getElementsByName("form")[0].appendChild(savebutton);

        //説明githubリンク
    const github_link = document.createElement("a");
    github_link.href = "https://github.com/koji-genba/gakujo-chan-extender#2%E6%AE%B5%E9%9A%8E%E8%AA%8D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E6%96%B9%E6%B3%95";
    github_link.target = "_blank";
    github_link.innerText = "二段階認証自動入力機能の使い方説明はこちら";
    document.getElementsByName("form")[0].appendChild(github_link);

    //自動入力するやつ
    chrome.storage.local.get("key", item => { //ストレージから鍵取得
        if(item.key){ //ちゃんと鍵取得できたら
            document.getElementsByName("ninshoCode")[0].value=totp(item.key); //totp関数に秘密鍵渡して二段階認証の6桁コード生成して枠に入力
            console.log(totp(item.key)); //生成した6桁コードをコンソールに吐いておく(不具合確認のため)
        }
    })
}