//const browserify = require("browserify");

window.addEventListener("load", main, false);

function main() {
    /*通知一覧が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000); //1秒まってから起動
    function Loaded() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("table.normal:nth-child(9)") != null) {
            clearInterval(Timer);
        }

    }
    //既読用ボタン作成
    MakeButton()
}

function LoadTable(){
    //成績の表をページから取得
        //成績のテーブルはiframeの中らしいからまずiframeを取得
    var elem = document.getElementById("main-frame-if");
    console.log(elem)
        //レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる
    var table = elem.contentWindow.document.querySelector("table.normal:nth-child(9)");
    console.log(table)

    return table
}


function MakeButton(){
    //ソート用ボタン生成1
    var readbutton = document.createElement("button");
    readbutton.id = "readbutton";
    readbutton.textContent = "No.でソート";
    readbutton.addEventListener('click',function(){
        Reader_call();
    });

    //ソート用ボタン追加
    document.getElementById("tabmenutable").appendChild(readbutton);
}

function Reader_call(){

    //表取得
    var table = LoadTable()
    var table_array = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        table_array[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            table_array[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    var url = table_array[1][1]
    url = url.substr(url.indexOf("=")+2)
    url = url.substr(0, url.indexOf('">'))
    url = url.replace('amp;', '');
    console.log(url)
    url = "https://gakujo.iess.niigata-u.ac.jp/campusweb/" + url

    console.log(table_array[1][1])
    console.log(url)


    browser.runtime.sendMessage({url: url});
}

//function sleep(waitSec, callbackFunc) {
//
//    var spanedSec = 0;
//
//    var waitFunc = function () {
//
//        spanedSec++;
//
//        if (spanedSec >= waitSec) {
//            if (callbackFunc) callbackFunc();
//            return;
//        }
//
//        clearTimeout(id);
//        id = setTimeout(waitFunc, 1000);
//
//    };
//
//    var id = setTimeout(waitFunc, 1000);
//
//  }
//
//  sleep(5, function() {
//    console.log('5秒経過しました！');
//  });