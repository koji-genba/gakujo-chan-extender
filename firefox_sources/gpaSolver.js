window.addEventListener("load", main, false);

function main() {

    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000); //1秒まってから起動
    function Loaded() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("#taniReferListForm+table") != null) {
            clearInterval(Timer);
        }

        //成績の表をページから取得
            //成績のテーブルはiframeの中らしいからまずiframeを取得
        elem = document.getElementById("main-frame-if");
            //レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる
        table = elem.contentWindow.document.querySelector("#taniReferListForm+table");


        //取得した成績の表を二次元配列にする
        var array1 = [] //GP×単位数を格納
        var array2 = [] //単位数を格納

        for(let i = 1; i < table.rows.length; i++){ //行のループ
            if(table.rows[i].cells[12].textContent.match(/[0-9]/)){ // GPの値が存在したら
                array1[i] = Number(table.rows[i].cells[12].textContent) * Number(table.rows[i].cells[8].textContent); //GP×単位数
                array2[i] = Number(table.rows[i].cells[8].textContent); //単位数
            }else{
                array1[i] = null;
                array2[i] = null;
            }
        }
        //null要素はフィルタして消す(消えているかもしれない)
        var gp = array1.filter(Boolean);
        var tan = array2.filter(Boolean);

        //合計GP計算
        gp_sum = gp.reduce(function(sum, element){
            return sum + element;
        }, 0);
        //合計単位数計算
        tan_sum = tan.reduce(function(sum, element){
            return sum + element;
        }, 0);

        //GPA計算
        gpa = gp_sum / tan_sum;

        //GPA表示する場所にテキスト追加
        table.rows[0].cells[12].textContent = table.rows[0].cells[12].textContent + "\n GPA:" +gpa.toFixed(4);

        //ソート用ボタン生成1
        nobutton = document.createElement("button");
        nobutton.id = "nobutton";
        nobutton.textContent = "No.でソート";
        nobutton.addEventListener('click',function(){
            sort_by_No(table);
        });

        //ソート用ボタン生成2
        opennumbutton = document.createElement("button");
        opennumbutton.id = "opennumbutton";
        opennumbutton.textContent = "開講番号でソート";
        opennumbutton.addEventListener('click',function(){
            sort_by_opennum(table);
        });

        //ソート用ボタン生成3
        scorebutton = document.createElement("button");
        scorebutton.id = "scorebutton";
        scorebutton.textContent = "得点でソート";
        scorebutton.addEventListener('click',function(){
            sort_by_score(table);
        });

        //ソート用ボタン追加
        document.getElementById("tabmenutable").appendChild(nobutton);
        document.getElementById("tabmenutable").appendChild(opennumbutton);
        document.getElementById("tabmenutable").appendChild(scorebutton);

    }
}

//開講番号順ソート
function sort_by_No(){
    //引数:なし
    //返す:なし
    //依存:なし
    //その他作用:成績表の表示順を画面の謎ナンバ順にする

    //mainと同様にやって表取得
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    //No.でソート
    array1.sort((a,b)=>{
        return Number(a[0]) - Number(b[0]); //sort関数は比較用の関数を渡さないとダメ
    });

    //ソートしたデータで表を書き換え
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = array1[i][j];
        }
    }
}

function sort_by_opennum(){
    //引数:なし
    //返す:なし
    //依存:なし
    //その他作用:成績表の表示順を開講番号順にする

    //mainと同様にやって表取得
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].innerHTML;
        }
        array1[i][table.rows[0].cells.length+1] = table.rows[i].cells[3].textContent
    }

    //開講番号でソート
    array1.sort((a,b)=>{
        if(a[table.rows[0].cells.length+1] < b[table.rows[0].cells.length+1]) return -1;
        else if(a[table.rows[0].cells.length+1] > b[table.rows[0].cells.length+1]) return 1;
        return 0;
    });

    //ソートしたデータで表を書き換え
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = array1[i][j];
        }
    }
}

function sort_by_score(){
    //引数:なし
    //返す:なし
    //依存:なし
    //その他作用:成績表の表示順を得点順にする

    //mainと同様にやって表取得
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    //得点でソート
    array1.sort((a,b)=>{
        return Number(a[9]) - Number(b[9]);
    });

    //ソートしたデータでテーブルを書き換え
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].innerHTML = array1[i][j];
        }
    }
}