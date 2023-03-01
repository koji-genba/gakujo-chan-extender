
//=====
//2fa自動入力部分
const DIGIT = 6;
const TIME_STEP = 30;

function totp(key, date){
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
    console.log(str.length)
    console.log(need)
    console.log(str)

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


setTimeout(main,1500);
function main() {
    document.getElementsByName("ninshoCode");
    const key = base32_decode("KEY");
    console.log(totp(key));
    document.getElementsByName("ninshoCode")[0].value=totp(key);
}

