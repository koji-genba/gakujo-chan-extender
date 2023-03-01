const DIGIT = 6;
const TIME_STEP = 30;

async function totp(secret_key){
	const count = Math.floor(Date.now() / 1000 / TIME_STEP);

    return await hotp(secret_key, count);
}

async function hotp(secret_key, count){

    
}


//===========================================


const base32_charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32_decode(str){
    //大文字にする
    str = str.toUpperCase(str)
    //存在してはならない0と1を削除
    str = str.replace("0", '');
    str = str.replace("1", '');
    //8の倍数長さになるように0(=A)パディング
    need = (Math.floor(str.length/8)+1) * 8 - str.length;
    str = str.padEnd(need+str.length, "A");
    console.log(str.length)
    console.log(need)
    console.log(str)

    //リスト使って0-31にマッピングして5桁の二進数に変換
    var nums = ""
    for(let i = 0 ; i < str.length; i++){
        nums += base32_charlist.indexOf(str.charAt(i)).toString(2).padStart(5,"0")
    }
    //8ビットずつ区切って10進数に変換
    var bit = new Uint8Array(nums.length/8)
    for(let i = 0; i < bit.length; i++){
        var bits = nums.substring(i*8, i*8+8);
        bit[i] = parseInt(bits,2);
    }

    return bit
}




//===========================================


setTimeout(main(),1000);

function main(){
    console.log("main loaded");
    document.getElementsByName("ninshoCode");
    const key = "MED5OAG33SP766QP4PBSL3LQLVOLM4CE";
    console.log(totp(key))
    setInterval(()=>{
        totp(key).then( code => {
            document.getElementsByName("ninshoCode")[0].value = code;

        })
    },1000)
}