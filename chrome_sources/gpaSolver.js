window.addEventListener("load", main, false);

function main() {
    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(loadCheck, 100); //100msごとに起動
    function loadCheck() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("#taniReferListForm+table") != null) {
            clearInterval(Timer);
            
            //GPA出力
            printGpa();
            //ソート用ボタン作成
            makeButton();
        }
    }
}

function printGpa(){
    //引数:なし
    //返す:なし
    //依存:loadTable, calcGpa
    //作用:GPA表示
    
    //成績の表をページから取得
    table = loadTable()
    //GPA計算
    gpa = calcGpa(table)
    //GPA表示
    table.rows[0].cells[12].textContent = table.rows[0].cells[12].textContent + "\n GPA:" +gpa.toFixed(4);
}

function loadTable(){
    //引数:なし
    //返す:成績の表
    //依存:なし
    //作用:なし

    return document.getElementById("main-frame-if").contentWindow.document.querySelector("#taniReferListForm+table");
}

function calcGpa(table){
    //引数:成績の表
    //返す:gpa
    //依存:なし
    //作用:なし
    
    //取得した成績の表を二次元配列にする
    var gpCredits = [] //GP×単位数を格納
    var credits = [] //単位数を格納

    for(let i = 1; i < table.rows.length; i++){ //行のループ
        if(table.rows[i].cells[12].textContent.match(/[0-9]/)){ // GPの値が存在したら
            gpCredits[i] = Number(table.rows[i].cells[12].textContent) * Number(table.rows[i].cells[8].textContent); //GP×単位数
            credits[i] = Number(table.rows[i].cells[8].textContent); //単位数
        }else{
            gpCredits[i] = null;
            credits[i] = null;
        }
    }
    //null要素はフィルタして消す(消えているかもしれない)
    var gpCredits = gpCredits.filter(Boolean);
    var credits = credits.filter(Boolean);

    //合計GP計算
    gpSum = gpCredits.reduce(function(sum, element){
        return sum + element;
    }, 0);
    //合計単位数計算
    creditsSum = credits.reduce(function(sum, element){
        return sum + element;
    }, 0);

    //GPA計算
    gpa = gpSum / creditsSum;

    return gpa
}

function makeButton(){
    //引数:なし
    //返す:なし
    //依存:sortByNumber, sortByOpenNum, sortByScore
    //作用:ソートするボタン表示
    
    //ソート用ボタン生成1
    noButton = document.createElement("button");
    noButton.id = "noButton";
    noButton.textContent = "No.でソート";
    noButton.addEventListener('click',function(){
        sortByNumber(table);
    });

    //ソート用ボタン生成2
    openNumButton = document.createElement("button");
    openNumButton.id = "openNumButton";
    openNumButton.textContent = "開講番号でソート";
    openNumButton.addEventListener('click',function(){
        sortByOpennum(table);
    });

    //ソート用ボタン生成3
    scoreButton = document.createElement("button");
    scoreButton.id = "scoreButton";
    scoreButton.textContent = "得点でソート";
    scoreButton.addEventListener('click',function(){
        sortByScore(table);
    });

    //ソート用ボタン追加
    document.getElementById("tabmenutable").appendChild(noButton);
    document.getElementById("tabmenutable").appendChild(openNumButton);
    document.getElementById("tabmenutable").appendChild(scoreButton);
}

function sortByNumber(){
    //引数:なし
    //返す:なし
    //依存:loadTable, printGpa
    //その他作用:成績表の表示順を画面の謎ナンバ順にする

    //表取得
    table = loadTable()
    var tableArray = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        tableArray[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            tableArray[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    //No.でソート
    tableArray.sort((a,b)=>{
        return Number(a[0]) - Number(b[0]); //sort関数は比較用の関数を渡さないとダメ
    });

    //ソートしたデータで表を書き換え
    for(let i = 0; i < tableArray.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = tableArray[i][j];
        }
    }

    printGpa()
}

function sortByOpennum(){
    //引数:なし
    //返す:なし
    //依存:loadTable, printGpa
    //その他作用:成績表の表示順を開講番号順にする

    //表取得
    table = loadTable()
    var tableArray = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        tableArray[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            tableArray[i][j] = table.rows[i].cells[j].innerHTML;
        }
        tableArray[i][table.rows[0].cells.length+1] = table.rows[i].cells[3].textContent
    }

    //開講番号でソート
    tableArray.sort((a,b)=>{
        if(a[table.rows[0].cells.length+1] < b[table.rows[0].cells.length+1]) return -1;
        else if(a[table.rows[0].cells.length+1] > b[table.rows[0].cells.length+1]) return 1;
        return 0;
    });

    //ソートしたデータで表を書き換え
    for(let i = 0; i < tableArray.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = tableArray[i][j];
        }
    }
    printGpa()
}

function sortByScore(){
    //引数:なし
    //返す:なし
    //依存:loadTable, printGpa
    //その他作用:成績表の表示順を得点順にする

    //表取得
    table = loadTable()
    var tableArray = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        tableArray[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            tableArray[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    //得点でソート
    tableArray.sort((a,b)=>{
        return Number(a[9]) - Number(b[9]);
    });

    //ソートしたデータでテーブルを書き換え
    for(let i = 0; i < tableArray.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = tableArray[i][j];
        }
    }
    printGpa()
}