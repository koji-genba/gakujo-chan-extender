window.addEventListener("load", main, false);

function load(){
    var table;
    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000);
    function Loaded() {
        if (document.getElementById("main-frame-if") != null) {
            clearInterval(Timer);
            console.log("table call");
            elem = document.getElementById("main-frame-if");
            table = elem.contentWindow.document.querySelector("#enqListForm table:nth-of-type(2)");
            console.log("table called");
        }
        console.log("loaded");
        console.log(table);
        return table;
    }
    console.log("load");
    console.log(table);
}

function makearray1(table){
    //今の日付時刻取得
    now = getdate();

    array1 = []; /*データ入れる配列，後で二次元にする*/

    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].innerHTML; /*ボタンがすっ飛んだりするからHTMLで取る*/
            /*ソートするときにやりやすいように提出状態に応じてフラグを立てる，フラグはボタンのデータの次に格納*/
            if(j==2 && (table.rows[i].cells[j].textContent.match('未提出') || table.rows[i].cells[j].textContent.match('Not submitted'))){
                array1[i][table.rows[0].cells.length+1] = 1;
            }
            if(j==2 && (table.rows[i].cells[j].textContent.match('一時保存') || table.rows[i].cells[j].textContent.match('Temporarily saved'))){
                array1[i][table.rows[0].cells.length+1] = 2;
            }
            if(j==2 && (table.rows[i].cells[j].textContent.match('提出済') || table.rows[i].cells[j].textContent.match('Submitted'))){
                array1[i][table.rows[0].cells.length+1] = 3;
            }
            /*ソートするときにやりやすいように締め切り日時だけを切り出して，/と:を消して格納する，↑のフラグのデータの次に格納*/
            if(j==7){
                array1[i][table.rows[0].cells.length+2] = table.rows[i].cells[j].textContent.substr(table.rows[i].cells[j].textContent.indexOf('～')+1);
                array1[i][table.rows[0].cells.length+2] = array1[i][table.rows[0].cells.length+2].replace("/","");
                array1[i][table.rows[0].cells.length+2] = array1[i][table.rows[0].cells.length+2].replace("/","");
                array1[i][table.rows[0].cells.length+2] = array1[i][table.rows[0].cells.length+2].replace(":","");
                array1[i][table.rows[0].cells.length+2] = array1[i][table.rows[0].cells.length+2].replace(" ","");
            }
        }
    }
    console.log("array1 maked");
    return array1;
}

function sort_by_date(table){
    array1 = makearray1(table);
    /*締め切り過ぎてるモノだけを別配列にコピー*/
    var array2 = [];
    if(1){
        for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
            array2[i]=[]; /*配列を二次元にする，行内データを入れるため*/
            if(array1[i][table.rows[0].cells.length+2] < now){ //締め切り過ぎてたら
                for(let j = 0; j <= table.rows[0].cells.length+2; j++){ /*行内でのループ*/
                    array2[i][j] = array1[i][j]; //データをコピー
                    array1[i][j] = null; //コピーしたら元配列ではnullに
                }
            }else{
                for(let j = 0; j <= table.rows[0].cells.length+2; j++){ /*行内でのループ*/
                    array2[i][j] = null;
                }
            }
        }
    }

    //null要素を消して詰める
    var active = array1.filter(Boolean);
    var eols = array2.filter(Boolean);
    /*締め切り日時についてソート*/
    active.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});
    eols.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});

    /*提出状況についてソート*/
    active.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});
    eols.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});

    /*有効なレポートと期限切れレポートの配列をまとめる*/
    var tasks = [];
    var skip = 0;
    for(let i=0; i<active.length; i++){
        if(active[i][1]){
            tasks[i-skip]=[];
            for(let j = 0; j < table.rows[0].cells.length; j++){
                tasks[i-skip][j] = active[i][j];
            }
        }else{
            skip++;
        }
    }
    for(let i=active.length; i<(active.length + eols.length); i++){
        if(eols[i-active.length][1]){
            tasks[i-skip]=[];
            for(let j = 0; j < table.rows[0].cells.length; j++){
                tasks[i-skip][j] = eols[i-active.length][j];
            }
        }else{
            skip++;
        }
    }

    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 1; i < tasks.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i].cells[j].innerHTML = tasks[i][j];
            /*一時保存の文字を青色に変える*/
            if (table.rows[i].cells[j].textContent.match('一時保存')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">一時保存</font>";
            }
            if (table.rows[i].cells[j].textContent.match('Temporarily saved')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">Temporarily saved</font>";
            }
        }
    }
    console.log("sorted by date");
}

function sort_by_kaikoubangou(table){
    array1 = makearray1(table);
    /*締め切り日時についてソート*/
    array1.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});

    /*開講番号でソート*/
    array1.sort((a,b)=>{
        if(a[3] < b[3]) return -1;
        else if(a[3] > b[3]) return 1;
        return 0;
    });


    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 1; i < array1.length+10; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i].cells[j].innerHTML = array1[i][j];
            /*一時保存の文字を青色に変える*/
            if (table.rows[i].cells[j].textContent.match('一時保存')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">一時保存</font>";
            }
            if (table.rows[i].cells[j].textContent.match('Temporarily saved')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">Temporarily saved</font>";
            }
        }
    }
    console.log("sorted by number");
}

function sort_by_title(table){
    array1 = makearray1(table);
    console.log("sort by title load")
    console.log(array1);
    /*締め切り日時についてソート*/
    array1.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});
    /*開講番号でソート*/
    array1.sort((a,b)=>{
        if(a[1] < b[1]) return -1;
        else if(a[1] > b[1]) return 1;
        return 0;
    });


    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 1; i < array1.length+10; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i].cells[j].innerHTML = array1[i][j];
            /*一時保存の文字を青色に変える*/
            if (table.rows[i].cells[j].textContent.match('一時保存')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">一時保存</font>";
            }
            if (table.rows[i].cells[j].textContent.match('Temporarily saved')) {
                table.rows[i].cells[j].innerHTML = "<font color=\"blue\">Temporarily saved</font>";
            }
        }
    }
    console.log("sorted by title");
}

function getdate(){
    var now = new Date();

    var Year = now.getFullYear();

    var Month = now.getMonth()+1;
    if(Month<10){
        Month = "0" + Month;
    }

    var Dates = now.getDate();
    if(Dates<10){
        Dates = "0" + Dates;
    }

    var Hour = now.getHours();
    if(Hour<10){
        Hour = "0" + Hour;
    }

    var Min = now.getMinutes();
    if(Min<10){
        Min = "0" + Min;
    }

    return Year.toString() + Month.toString() + Dates.toString() + Hour.toString() + Min.toString();
}

function main(){
    table = load();
    console.log("1");
    console.log(table);
    array1 = makearray1(table);
    console.log(array1);
    console.log("2");
    //titlebutton = document.createElement("button");
    //console.log("1");
    //titlebutton.id = "titlebutton";
    //console.log("2");
    //titlebutton.textContent = "▼";
    //console.log("3");
    //titlebutton.addEventListener('click',function(){
    //    sort_by_title(array1);
    //});
    //console.log("4");
    //console.log(table);
    //table.rows[0].cells[1].appendChild(titlebutton);
    //console.log("5");
}
