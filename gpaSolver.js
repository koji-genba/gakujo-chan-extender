window.addEventListener("load", main, false);

function main() {

    /*レポートの表が表示されてから処理を開始するためのやつ*/
    const Timer = setInterval(Loaded, 1000);
    function Loaded() {
        if (document.getElementById("main-frame-if").contentWindow.document.querySelector("#taniReferListForm+table") != null) {
            clearInterval(Timer);
        }

        console.clear();
        window.alert("GPASolver"); /*動作確認のwindow.alert(リリース時消す)*/
        /*成績のテーブルはiframeの中らしいからまずiframeを取得*/
        elem = document.getElementById("main-frame-if");
        //window.alert(elem); /*動作確認のwindow.alert(リリース時消す)*/
        /*iframeからレポートのテーブルを取得*/
        /*レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる*/
        table = elem.contentWindow.document.querySelector("#taniReferListForm+table");
        window.alert(table.innerHTML); /*動作確認のwindow.alert(リリース時消す)*/

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
            console.log(array1[i]);
            console.log(i);
        }

        console.clear();
        var gp = array1.filter(Boolean);
        var tan = array2.filter(Boolean);
        for(let i = 0; i < gp.length; i++){ /*行のループ*/
            console.log(gp[i]);
            console.log(i);
        }

        gp_sum = gp.reduce(function(sum, element){
            return sum + element;
        }, 0);
        tan_sum = tan.reduce(function(sum, element){
            return sum + element;
        }, 0);

        gpa = gp_sum / tan_sum;

        table.rows[0].cells[12].textContent = table.rows[0].cells[12].textContent + "\n GPA:" +gpa.toFixed(4);
    }
}