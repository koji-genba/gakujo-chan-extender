//const chromeify = require("chromeify");

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
    //個数入力枠作成
    MakeInputBox()
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
    readbutton.textContent = "指定した個数を既読にする";
    readbutton.addEventListener('click',function(){
        Reader_call();
    });

    //ソート用ボタン追加
    document.getElementById("tabmenutable").appendChild(readbutton);
}

function MakeInputBox(){
    var inputbox = document.createElement("input");
    inputbox.id = "readNumInputBox"
    inputbox.type = "number";
    inputbox.defaultValue = "5";
    inputbox.pattern = "\d*";
    inputbox.oninput = "value = value.replace(/[^0-9]+/i,'');";
    inputbox.placeholder = "既読にする数(半角数字)";
    document.getElementById("tabmenutable").appendChild(inputbox);
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

    var InputBox = document.getElementById("readNumInputBox")
    var ReadNum = InputBox.value
    console.log(ReadNum)

    for (let i = 1; i <= InputBox.value; i++) {
        var url = table_array[i][1]
        url = url.substr(url.indexOf("=")+2)
        url = url.substr(0, url.indexOf('">'))
        while(url.indexOf('amp;')!=-1){
            url = url.replace('amp;', '');
        }
        console.log(url)
        url = "https://gakujo.iess.niigata-u.ac.jp/campusweb/" + url

        console.log(table_array[1][1])
        console.log(url)


        chrome.runtime.sendMessage({url: url});
    }
    setTimeout(function() {
        window.location.reload();
      }, 1000);
}