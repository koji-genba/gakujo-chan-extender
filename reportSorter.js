window.addEventListener("load", main, false);

function main() {
    const Timer = setInterval(Loaded, 1000);
    function Loaded() {
        if (document.getElementById("main-frame-if") != null) {
            clearInterval(Timer);
        }

        window.alert("reportSorter");
        elem = document.getElementById("main-frame-if");
        window.alert(elem);
        table = elem.contentWindow.document.querySelector("#enqListForm table:nth-of-type(2)");
        window.alert(table.innerHTML);

        /*
        for (let row of table.rows) {
            for(let cell of row.cells){
               console.log(cell.innerText);
            }
        }
        */

        var array = [];

        for(let i = 0; i < table.rows.length; i++){
            array[i]=[]
            for(let j = 0; j < table.rows[0].cells.length; j++){
                array[i][j] = table.rows[i].cells[j].innerHTML;
                if(j==2 && table.rows[i].cells[j].textContent.match('未提出')){
                    array[i][table.rows[0].cells.length+1] = 1;
                }
                if(j==2 && table.rows[i].cells[j].textContent.match('一時保存')){
                    array[i][table.rows[0].cells.length+1] = 2;
                }
                if(j==2 && table.rows[i].cells[j].textContent.match('提出済')){
                    array[i][table.rows[0].cells.length+1] = 3;
                }
                console.log(array[i][j]);
                //console.log(i+"+"+j);
            }
        }

        array.sort(function(a,b){return(a[table.rows[0].cells.length+1] - b[table.rows[0].cells.length+1]);});

        console.clear()
        /*for(let i = 0; i < table.rows.length; i++){
            console.log(array[i][2]);
        }*/

        for(let i = 0; i < table.rows.length; i++){
            for(let j = 0; j < table.rows[0].cells.length; j++){
                table.rows[i].cells[j].innerHTML = array[i][j];
            }
        }
    }
}