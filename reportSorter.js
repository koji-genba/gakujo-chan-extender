window.addEventListener("load", main, false);

function main() {

    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000);
    function Loaded() {
        if (document.getElementById("main-frame-if") != null) {
            clearInterval(Timer);
        }

        now = getdate();
        window.alert(now);
        /*設定絡みそうなやつ*/
        sort_enable = true;
        eol_notshow = false;

        if(sort_enable = false){
            return;
        }

        window.alert("reportSorter"); /*動作確認のwindow.alert(リリース時消す)*/
        /*レポートのテーブルはiframeの中らしいからまずiframeを取得*/
        elem = document.getElementById("main-frame-if");
        //window.alert(elem); /*動作確認のwindow.alert(リリース時消す)*/
        /*iframeからレポートのテーブルを取得*/
        /*レポートのテーブルそのものにはidが無いから近くのidあるやつから2つ後ろってので表現してる*/
        table = elem.contentWindow.document.querySelector("#enqListForm table:nth-of-type(2)");
        //window.alert(table.innerHTML); /*動作確認のwindow.alert(リリース時消す)*/

        /*取得したやつをtextをコンソールに吐く，動作確認用*/

        //for (let row of table.rows) {
        //    for(let cell of row.cells){
        //       console.log(cell.innerText);
        //    }
        //}

        var array = []; /*データ入れる配列，後で二次元にする*/

        for(let i = 0; i < table.rows.length; i++){ /*行のループ*/
            array[i]=[] /*配列を二次元にする，行内データを入れるため*/
            for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
                array[i][j] = table.rows[i].cells[j].innerHTML; /*ボタンがすっ飛んだりするからHTMLで取る*/
                /*ソートするときにやりやすいように提出状態に応じてフラグを立てる，フラグはボタンのデータの次に格納*/
                if(j==2 && table.rows[i].cells[j].textContent.match('未提出')){
                    array[i][table.rows[0].cells.length+1] = 1;
                }
                if(j==2 && table.rows[i].cells[j].textContent.match('一時保存')){
                    array[i][table.rows[0].cells.length+1] = 2;
                }
                if(j==2 && table.rows[i].cells[j].textContent.match('提出済')){
                    array[i][table.rows[0].cells.length+1] = 3;
                }
                /*ソートするときにやりやすいように締め切り日時だけを切り出して，/と:を消して格納する，配列の一番後ろ(↑のフラグのデータの次)に格納*/
                if(j==7){
                    array[i][table.rows[0].cells.length+2] = table.rows[i].cells[j].textContent.substr(table.rows[i].cells[j].textContent.indexOf('～')+1);
                    array[i][table.rows[0].cells.length+2] = array[i][table.rows[0].cells.length+2].replace("/","");
                    array[i][table.rows[0].cells.length+2] = array[i][table.rows[0].cells.length+2].replace("/","");
                    array[i][table.rows[0].cells.length+2] = array[i][table.rows[0].cells.length+2].replace(":","");
                    array[i][table.rows[0].cells.length+2] = array[i][table.rows[0].cells.length+2].replace(" ","");
                    console.log(array[i][table.rows[0].cells.length+2])
                }
            }
                /*動作確認用*/
                //console.log(array[i][j]);
                //console.log(i+"+"+j);
        }

        /*締め切り過ぎてるモノだけを別配列にコピー*/
        var eols = [];
        if(eol_notshow){
            for(let i = 0; i < table.rows.length; i++){ /*行のループ*/
                eols[i]=[]; /*配列を二次元にする，行内データを入れるため*/
                if(array[i][table.rows[0].cells.length+2] < now){ //締め切り過ぎてたら
                    for(let j = 0; j < table.rows[0].cells.length+2; j++){ /*行内でのループ*/
                        eols[i][j] = array[i][j]; //データをコピー
                        array[i][j] = null; //コピーしたら元配列ではnullに
                    }
                }else{
                    for(let j = 0; j < table.rows[0].cells.length+2; j++){ /*行内でのループ*/
                        eols[i][j] = null;
                    }
                }
            }
        }
        //null要素を消して詰める
        var active = array.filter(Boolean);
        eols = eols.filter(v=>v);

        //window.alert("nulled");

        console.clear();
        for(let i = 1; i < active.length; i++){
            for(let j = 0; j < table.rows[0].cells.length; j++){
                console.log(active[i][j]);
            }
        }


        /*締め切り日時についてソート*/
        active.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});
        eols.sort(function(a,b){return(a[table.rows[0].cells.length+2] - b[table.rows[0].cells.length+2]);});

        /*提出状況についてソート*/
        active.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});
        eols.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});

        //window.alert("sorted");

        /*ソートしたデータでテーブルを書き換え*/
        var filled = 0;
        for(let i = 1; i < active.length; i++){
            for(let j = 0; j < table.rows[0].cells.length; j++){
                table.rows[i].cells[j].innerHTML = active[i][j];
            }
            filled+=1;
        }
        //window.alert(filled);
        if(eol_notshow){
            for(let k = 0; i < eols.length; k++){
                for(let j = 0; j < table.rows[0].cells.length; j++){
                    table.rows[active.length+1+k].cells[j].innerHTML = eols[k][j];
                }
            }
        }
    }
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