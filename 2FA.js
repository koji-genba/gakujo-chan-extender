
//=====
//2fa自動入力部分
const DIGIT = 6;
const TIME_STEP = 30;

function totp(key){
    const counter = Math.floor(Date.now() / 1000 / TIME_STEP);

    return hotp(key, counter);
}

function hotp(key, counter){
    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(Math.floor(counter/2**32), 0);
    buf.writeUInt32BE(counter, 4);

    const val = trunc(hmacsha1(key, buf));
    return val.toString().padStart(DIGIT, '0');
}

const crypto = require('crypto');
function hmacsha1(key, message) {
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(message);
    return hmac.digest();
}

function trunc(data) {
    const offset = data[data.length-1] & 0x0f;
    const code = data.readUInt32BE(offset) & 0x7fffffff;

    return code % 10**DIGIT;
}

const base32_charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32_decode(str){
    str = str.toUpperCase(str)
    str = str.replace("0", '');
    str = str.replace("1", '');
    need = (Math.floor(str.length/8)+1) * 8 - str.length;
    str = str.padEnd(need+str.length, "A");

    var nums = ""
    for(let i = 0 ; i < str.length; i++){
        nums += base32_charlist.indexOf(str.charAt(i)).toString(2).padStart(5,"0")
    }

    var bit = new Uint8Array(nums.length/8)
    for(let i = 0; i < bit.length; i++){
        var bits = nums.substring(i*8, i*8+8);
        bit[i] = parseInt(bits,2);
    }

    return bit
}

function key_save(){
    var str = document.getElementById("key_setform").value;
    browser.storage.local.set({"key": str});
}

setTimeout(main,1500);
function main() {
    //2fa鍵保存部分
    document.getElementsByName("form")[0].appendChild(document.createElement("br"))
    const p1 = document.createElement("p");
    const text1 = document.createTextNode("以下は学情拡張機能によって追加された部分です");
    p1.appendChild(text);
    document.getElementsByName("form")[0].appendChild(p1);

    document.getElementsByName("form")[0].appendChild(document.createElement("br"))
    const p2 = document.createElement("p");
    const text2 = document.createTextNode("拡張機能2FA鍵保存フォーム");
    p2.appendChild(text2);
    document.getElementsByName("form")[0].appendChild(p2);

    const key_setform = document.createElement("input");
    key_setform.id = "key_setform";
    key_setform.setAttribute("type", "text");
    key_setform.setAttribute("size", "30");
    document.getElementsByName("form")[0].appendChild(key_setform);
    console.log("created");

    const savebutton = document.createElement("button");
    savebutton.id = "savebutton";
    savebutton.textContent = "save";
    savebutton.addEventListener('click',function(){
        key_save();
    });
    document.getElementsByName("form")[0].appendChild(savebutton);

    const github_link = document.createElement("a");
    github_link.href = "https://github.com/koji-genba/gakujo-chan-extender"
    a1.target = "_blank";
    a1.innerText = "二段階認証自動入力機能の使い方説明はこちら";

    //自動入力部分
    browser.storage.local.get("key").then(item => {
        if(item.key){
            document.getElementsByName("ninshoCode")[0].value=totp(item.key);
        }
    })
}