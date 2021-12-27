setInterval(autoExtender,60000) //10分ごとに起動
window.alert("autoExtender") //動作確認用

function autoExtender(){
    if(document.getElementById("timeout-timer").textContent < 10){ //残り10分切ってたら
        document.getElementById("portaltimerimg").click(); //時計アイコンの画像をクリックする動作
    }
}