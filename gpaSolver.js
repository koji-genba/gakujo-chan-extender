window.addEventListener("load", main, false);

function main() {

    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000);
    function Loaded() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("#taniReferListForm+table") != null) {
            clearInterval(Timer);
        }

        //console.clear();
        //window.alert("GPASolver"); /*動作確認のwindow.alert(リリース時消す)*/
        /*成績のテーブルはiframeの中らしいからまずiframeを取得*/
        elem = document.getElementById("main-frame-if");
        //window.alert(elem); /*動作確認のwindow.alert(リリース時消す)*/
        /*iframeからレポートのテーブルを取得*/
        /*レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる*/
        table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
        //window.alert(table.innerHTML); /*動作確認のwindow.alert(リリース時消す)*/



        var array1 = []
        var array2 = []

        for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
            if(table.rows[i].cells[12].textContent.match(/[0-9]/)){
                array1[i] = Number(table.rows[i].cells[12].textContent) * Number(table.rows[i].cells[8].textContent);
                array2[i] = Number(table.rows[i].cells[8].textContent);
            }else{
                array1[i] = null;
                array2[i] = null;
            }
            //console.log(table.rows[i].cells[12].textContent)
            //console.log(array1[i]);
            //console.log(i);
        }

        var gp = array1.filter(Boolean);
        var tan = array2.filter(Boolean);

        gp_sum = gp.reduce(function(sum, element){
            return sum + element;
        }, 0);
        tan_sum = tan.reduce(function(sum, element){
            return sum + element;
        }, 0);

        gpa = gp_sum / tan_sum;

        table.rows[0].cells[12].textContent = table.rows[0].cells[12].textContent + "\n GPA:" +gpa.toFixed(4);

        //============================================================================================================
        //ここまでGPA算出
        //ここから開講番号順ソート
        //============================================================================================================

        nobutton = document.createElement("button");
        nobutton.id = "nobutton";
        nobutton.textContent = "No.でソート";
        nobutton.addEventListener('click',function(){
            sort_by_No(table);
        });

        opennumbutton = document.createElement("button");
        opennumbutton.id = "opennumbutton";
        opennumbutton.textContent = "開講番号でソート";
        opennumbutton.addEventListener('click',function(){
            sort_by_opennum(table);
        });

        scorebutton = document.createElement("button");
        scorebutton.id = "scorebutton";
        scorebutton.textContent = "得点でソート";
        scorebutton.addEventListener('click',function(){
            sort_by_score(table);
        });

        console.log("mainend");
        document.getElementById("tabmenutable").appendChild(nobutton);
        document.getElementById("tabmenutable").appendChild(opennumbutton);
        document.getElementById("tabmenutable").appendChild(scorebutton);
        console.log("mainendddd");

    }
}

function sort_by_No(){
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].textContent;
        }
    }
    /*No.でソート*/
    array1.sort((a,b)=>{
        return Number(a[0]) - Number(b[0]);
    });
    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].textContent = array1[i][j];
        }
    }
    console.log(array1.length);
}

function sort_by_opennum(){
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].textContent;
        }
    }
    /*開講番号でソート*/
    array1.sort((a,b)=>{
        if(a[3] < b[3]) return -1;
        else if(a[3] > b[3]) return 1;
        return 0;
    });
    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].textContent = array1[i][j];
        }
    }
    console.log(array1.length);
}

function sort_by_score(){
    elem = document.getElementById("main-frame-if");
    table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
    var array1 = []

    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        array1[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            array1[i][j] = table.rows[i].cells[j].textContent;
            console.log(array1[i][9]);
        }
    }
    /*得点でソート*/
    array1.sort((a,b)=>{
        return Number(a[9]) - Number(b[9]);
    });
    /*ソートしたデータでテーブルを書き換え*/
    for(let i = 0; i < array1.length; i++){
        for(let j = 0; j < table.rows[0].cells.length; j++){
            table.rows[i+1].cells[j].textContent = array1[i][j];
        }
    }
    console.log(array1.length);
}