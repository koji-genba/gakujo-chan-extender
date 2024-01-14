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
    //通知の表をページから取得
        //通知のテーブルはiframeの中らしいからまずiframeを取得
    var elem = document.getElementById("main-frame-if");
        //レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる
    var table = elem.contentWindow.document.querySelector("table.normal:nth-child(9)");

    return table
}


function MakeButton(){
    //既読用ボタン生成
    var readbutton = document.createElement("button");
    readbutton.id = "readbutton";
    readbutton.textContent = "指定した個数を既読にする";
    readbutton.addEventListener('click',function(){
        Reader_call();
    });

    //既読用ボタン追加
    document.getElementById("tabmenutable").appendChild(readbutton);
}

function MakeInputBox(){
    //既読個数設定用入力欄生成
    var inputbox = document.createElement("input");
    inputbox.id = "readNumInputBox"
    inputbox.type = "number";
    inputbox.defaultValue = "5";
    inputbox.pattern = "\d*";
    inputbox.oninput = "value = value.replace(/[^0-9]+/i,'');";
    inputbox.placeholder = "既読にする数(半角数字)";

    //既読個数設定用入力欄追加
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

    //個数入力欄から数取得
    var InputBox = document.getElementById("readNumInputBox")
    var ReadNum = InputBox.value

    //指定数分だけループ
    for (let i = 1; i <= InputBox.value; i++) {
        //リンクのとこのinnerHTML取得
        var url = table_array[i][1]
        //url切り出し&加工でリンク生成
        url = url.substr(url.indexOf("=")+2)
        url = url.substr(0, url.indexOf('">'))
        while(url.indexOf('amp;')!=-1){
            url = url.replace('amp;', '');
        }
        url = "https://gakujo.iess.niigata-u.ac.jp/campusweb/" + url

        //生成したリンクで別タブ生成させる
        //タブ生成は権限の都合でbackground.jsでやる
        chrome.runtime.sendMessage({url: url});
    }

    //1秒後にページリロード
    setTimeout(function() {
        window.location.reload();
      }, 1000);
}