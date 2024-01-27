window.addEventListener("load", main, false);

function main() {
    //通知一覧が表示されてから処理を開始するためのやつ
    const Timer = setInterval(Loaded, 1000); //1秒ごとに起動
    function Loaded() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("table.normal:nth-child(9)") != null) {
            clearInterval(Timer);
            
                //既読用ボタン作成
                makeButton();
                //個数入力枠作成
                makeinputBox();
        }
    }
}

function loadTable(){

    return document.getElementById("main-frame-if").contentWindow.document.querySelector("table.normal:nth-child(9)");
}


function makeButton(){
    //既読用ボタン生成
    var readButton = document.createElement("button");
    readButton.id = "readButton";
    readButton.textContent = "指定した個数を既読にする";
    readButton.addEventListener('click',function(){
        readerCall();
    });

    //既読用ボタン追加
    document.getElementById("tabmenutable").appendChild(readButton);
}

function makeinputBox(){
    //既読個数設定用入力欄生成
    var inputBox = document.createElement("input");
    inputBox.id = "readNumInputBox"
    inputBox.type = "number";
    inputBox.defaultValue = "5";
    inputBox.pattern = "\d*";
    inputBox.oninput = "value = value.replace(/[^0-9]+/i,'');";
    inputBox.placeholder = "既読にする数(半角数字)";

    //既読個数設定用入力欄追加
    document.getElementById("tabmenutable").appendChild(inputBox);
}

function readerCall(){

    //表取得
    var table = loadTable()
    var tableArray = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        tableArray[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            tableArray[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    //個数入力欄から数取得
    var inputBox = document.getElementById("readNumInputBox")
    var readNum = inputBox.value

    //数じゃないのが入力されていた時の処理
    if(isNaN(readNum)){
        readNum = 0
    }

    //指定数分だけループ
    for (let i = 1; i <= readNum; i++) {
        //リンクのとこのinnerHTML取得
        var url = tableArray[i][1]
        //url切り出し&加工でリンク生成
        url = url.substr(url.indexOf("=")+2)
        url = url.substr(0, url.indexOf('">'))
        while(url.indexOf('amp;')!=-1){
            url = url.replace('amp;', '');
        }
        url = "https://gakujo.iess.niigata-u.ac.jp/campusweb/" + url

        //生成したリンクで別タブ生成させる
        //タブ生成は権限の都合でbackground.jsでやる
        browser.runtime.sendMessage({url: url});
    }

    //1秒後にページリロード
    setTimeout(function() {
        window.location.reload();
      }, 1000);
}