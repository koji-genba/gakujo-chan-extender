//=====
//chromeify 2FA.js -o 2FA-bundle.js -t [ babelify --presets [@babel/preset-env] ]

import { authenticator } from 'otplib';
//2fa自動入力部分
function totp(key){
    return authenticator.generate(key);
}
//2fa鍵保存部分
function key_save(){
    var str = document.getElementById("key_setform").value;
    chrome.storage.local.set({"key": str});
}
//起動
setTimeout(main_call,1500);
function main_call(){
    if (!document.getElementById("portaltimerimg")){
        main();
    }
}
function main() {
    //2fa鍵保存部分
    document.getElementsByName("form")[0].appendChild(document.createElement("br"))
    const p1 = document.createElement("p");
    const text1 = document.createTextNode("以下は学情拡張機能によって追加された部分です");
    p1.appendChild(text1);
    document.getElementsByName("form")[0].appendChild(p1);

    document.getElementsByName("form")[0].appendChild(document.createElement("br"))
    const p2 = document.createElement("p");
    const text2 = document.createTextNode("拡張機能2FA鍵保存フォーム");
    p2.appendChild(text2);
    document.getElementsByName("form")[0].appendChild(p2);

    const key_setform = document.createElement("input");
    key_setform.id = "key_setform";
    key_setform.setAttribute("type", "text");
    key_setform.setAttribute("size", "50");
    document.getElementsByName("form")[0].appendChild(key_setform);

    const savebutton = document.createElement("button");
    savebutton.id = "savebutton";
    savebutton.textContent = "save";
    savebutton.addEventListener('click',function(){
        key_save();
    });
    document.getElementsByName("form")[0].appendChild(savebutton);

    const github_link = document.createElement("a");
    github_link.href = "https://github.com/koji-genba/gakujo-chan-extender";
    github_link.target = "_blank";
    github_link.innerText = "二段階認証自動入力機能の使い方説明はこちら";
    document.getElementsByName("form")[0].appendChild(github_link);

    //自動入力部分
    browser.storage.local.get("key").then(item => {
        if(item.key){
            document.getElementsByName("ninshoCode")[0].value=totp(item.key);
            console.log(totp(item.key));
        }
    })
}