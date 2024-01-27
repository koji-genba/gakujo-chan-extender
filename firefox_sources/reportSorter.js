window.addEventListener("load", main, false);

function main(){
    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(loadCheck, 1000); //1秒ごとに起動
    function loadCheck() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("#enqListForm table:nth-of-type(2)") != null) {
            clearInterval(Timer);

            setTempColorBlue();
            makeButton();
            sortByDate(loadReportTable());
        }
    }
}

function makeButton(){
    //ソート用ボタン生成1
    titleButton = document.createElement("button");
    titleButton.id = "titleButton";
    titleButton.textContent = "タイトルでソート";
    titleButton.addEventListener('click',function(){
        sortByTitle(table);
    });

    //ソート用ボタン生成2
    dateButton = document.createElement("button");
    dateButton.id = "dateButton";
    dateButton.textContent = "提出期間でソート";
    dateButton.addEventListener('click',function(){
        sortByDate(table);
    });

    //ソート用ボタン生成3
    numberButton = document.createElement("button");
    numberButton.id = "numberButton";
    numberButton.textContent = "開講番号でソート";
    numberButton.addEventListener('click',function(){
        sortByNumber(table);
    });

    //ソート用ボタン配置
    document.getElementById("tabmenutable").appendChild(titleButton);
    document.getElementById("tabmenutable").appendChild(numberButton);
    document.getElementById("tabmenutable").appendChild(dateButton);
}

function setTempColorBlue(){
    //引数:なし
    //返す:なし
    //依存:loadReportTable
    //作用:一時保存の文字を青色に変える
    
    table = loadReportTable()
    for(let i = 0; i < table.rows.length; i++){
        if (table.rows[i].cells[2].textContent.match('一時保存')) {
            table.rows[i].cells[2].innerHTML = "<font color=\"blue\">一時保存</font>";
        }
        if (table.rows[i].cells[2].textContent.match('Temporarily saved')) {
            table.rows[i].cells[2].innerHTML = "<font color=\"blue\">Temporarily saved</font>";
        }
    }
}

function loadReportTable(){
    //引数:なし
    //返す:レポート等々の表
    //依存:なし
    //作用:なし

    return document.getElementById("main-frame-if").contentWindow.document.querySelector("#enqListForm table:nth-of-type(2)");
}

function makeReportArray(table){
    //引数:レポート等々の表
    //返す:↑を成形しデータ付加した二次元配列
    //依存:getDate(日付時刻取得)
    //作用:なし

    //今の日付時刻取得
    now = getDate();

    reportArray = []; //データ入れる配列，後で二次元にする

    for(let i = 1; i < table.rows.length; i++){ //行のループ
        reportArray[i]=[] //配列を二次元にする，行内データを入れるため
        for(let j = 0; j < table.rows[0].cells.length; j++){ //行内でのループ
            reportArray[i][j] = table.rows[i].cells[j].innerHTML; //提出ボタンがすっ飛んだりしないようにHTML生で取る
            //ソートするときにやりやすいように提出状態に応じてフラグを立てる，フラグはボタンのデータの次に格納
            if(j==2 && (table.rows[i].cells[j].textContent.match('未提出') || table.rows[i].cells[j].textContent.match('Not submitted'))){
                reportArray[i][table.rows[0].cells.length+1] = 1;
            }
            if(j==2 && (table.rows[i].cells[j].textContent.match('一時保存') || table.rows[i].cells[j].textContent.match('Temporarily saved'))){
                reportArray[i][table.rows[0].cells.length+1] = 2;
            }
            if(j==2 && (table.rows[i].cells[j].textContent.match('提出済') || table.rows[i].cells[j].textContent.match('Submitted'))){
                reportArray[i][table.rows[0].cells.length+1] = 3;
            }
            //日付ソートするときにやりやすいように締め切り日時を切り出して，/と:を消して格納する，↑のフラグのデータの次に格納
            if(j==7){
                reportArray[i][table.rows[0].cells.length+2] = table.rows[i].cells[j].textContent.substr(table.rows[i].cells[j].textContent.indexOf('～')+1);
                reportArray[i][table.rows[0].cells.length+2] = reportArray[i][table.rows[0].cells.length+2].replace("/","");
                reportArray[i][table.rows[0].cells.length+2] = reportArray[i][table.rows[0].cells.length+2].replace("/","");
                reportArray[i][table.rows[0].cells.length+2] = reportArray[i][table.rows[0].cells.length+2].replace(":","");
                reportArray[i][table.rows[0].cells.length+2] = reportArray[i][table.rows[0].cells.length+2].replace(" ","");
            }
        }
    }
    return reportArray;
}

function sortByDate(){
    //引数:なし
    //返す:なし
    //依存:makeReportArray(表->配列のため), setTempColorBlue()
    //作用:レポート等々の表を提出期限でソートする(未提出->一次提出->提出済)
    
    //一時保存青に
    setTempColorBlue()
    
    //テーブルを二次元配列にする
    table = loadReportTable()
    reportArray = makeReportArray(table);

    //締め切り過ぎてるモノだけを別配列にコピー
    var expiredReports = [];
    for(let i = 1; i < reportArray.length; i++){ //行のループ
        expiredReports[i]=[]; //配列を二次元にする，行内データを入れるため
        if(reportArray[i][table.rows[0].cells.length+2] < now){ //締め切り過ぎてたら
            for(let j = 0; j <= table.rows[0].cells.length+2; j++){ //行内でのループ
                expiredReports[i][j] = reportArray[i][j]; //データをコピー
                reportArray[i][j] = null; //コピーしたら元配列ではnullに
            }
        }else{
            for(let j = 0; j <= table.rows[0].cells.length+2; j++){ //行内でのループ
                expiredReports[i][j] = null;
            }
        }
    }


    //null要素を消して詰める
    var active = reportArray.filter(Boolean); //まだ期限になってないやつら
    var expired = expiredReports.filter(Boolean); //期限過ぎてるやつら
    //締め切り日時についてソート
    active.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});
    expired.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});
    //提出状況についてソート
    active.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});
    expired.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});
    //まだ期限になってないレポートと期限切れレポートの配列をまとめる
    var tasks = [];
    var skip = 0;
        //期限内のやつ
    for(let i=0; i<active.length; i++){
        if(active[i][1]){ //一応null要素だったらskipするための
            tasks[i-skip]=[]; //二次元にして
            for(let j = 0; j < table.rows[0].cells.length; j++){ //行内ループ
                tasks[i-skip][j] = active[i][j];
            }
        }else{ // null要素だったらskip
            skip++;
        }
    }
        //期限内のやつ
    for(let i=active.length; i<(active.length + expired.length); i++){
        if(expired[i-active.length][1]){
            tasks[i-skip]=[];
            for(let j = 0; j < table.rows[0].cells.length; j++){
                tasks[i-skip][j] = expired[i-active.length][j];
            }
        }else{
            skip++;
        }
    }

    //ソートしたデータでテーブルを書き換え
    for(let i = 0; i < tasks.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = tasks[i][j];
        }
    }
}

function sortByNumber(){
    //引数:なし
    //返す:なし
    //依存:makeReportArray(表->配列のため), setTempColorBlue()
    //作用:レポート等々の表を開講番号でソートする
    
    //一時保存青に
    setTempColorBlue()
    
    //テーブルを二次元配列にする
    table = loadReportTable()
    reportArray = makeReportArray(table);

    //締め切り日時についてソート
    reportArray.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});

    //開講番号でソート
    reportArray.sort((a,b)=>{
        if(a[3] < b[3]) return -1;
        else if(a[3] > b[3]) return 1;
        return 0;
    });


    //ソートしたデータでテーブルを書き換え
    for(let i = 0; i < reportArray.length-1; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = reportArray[i][j];
        }
    }
}

function sortByTitle(){
    //引数:なし
    //返す:なし
    //依存:makeReportArray(表->配列のため), setTempColorBlue()
    //作用:レポート等々の表をタイトルでソートする

    //一時保存青に
    setTempColorBlue()
    
    //テーブルを二次元配列にする
    table = loadReportTable()
    reportArray = makeReportArray(table);

    //締め切り日時についてソート
    reportArray.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});

    //タイトルでソート
    reportArray.sort((a,b)=>{
        if(a[1] < b[1]) return -1;
        else if(a[1] > b[1]) return 1;
        return 0;
    });


    //ソートしたデータでテーブルを書き換え
    for(let i = 0; i < reportArray.length-1; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = reportArray[i][j];
        }
    }
}

function getDate(){
    //引数:なし
    //返す:日付時刻連結の文字列 ex:2023/6/7/22:18 -> 202306072218
    //依存:なし
    //作用:なし

    //日付オブジェクト取得
    var now = new Date();

    //年
    var Year = now.getFullYear();
    //月
    var Month = now.getMonth()+1;
    if(Month<10){
        Month = "0" + Month; //2桁にする
    }
    //日
    var Dates = now.getDate();
    if(Dates<10){
        Dates = "0" + Dates; //2桁にする
    }
    //時
    var Hour = now.getHours();
    if(Hour<10){
        Hour = "0" + Hour; //2桁にする
    }
    //分
    var Min = now.getMinutes();
    if(Min<10){
        Min = "0" + Min; //2桁にする
    }

    //年月日時分を結合して返す
    return Year.toString() + Month.toString() + Dates.toString() + Hour.toString() + Min.toString();
}