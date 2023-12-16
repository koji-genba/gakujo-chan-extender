var counter = 0;
var timerId = setInterval(function(){
    if(document.getElementById("timeout-timer").textContent <= 11){ //残り11分切ってたら
        document.getElementById("portaltimerimg").click(); //時計アイコンの画像をクリックする動作
        counter++;
    }
    if(counter > 10){
        clearInterval(timerId);
    }
}
, 60000)