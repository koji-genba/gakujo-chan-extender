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
}

function LoadTable(){
    //成績の表をページから取得
        //成績のテーブルはiframeの中らしいからまずiframeを取得
    var elem = document.getElementById("main-frame-if");
    console.log(elem)
        //レポートのテーブルそのものにはidが無いから近くのidあるやつから1つ後ろってので表現してる
    var table = elem.contentWindow.document.querySelector("table.normal:nth-child(9)");
    console.log(table)

    return table
}


function MakeButton(){
    //ソート用ボタン生成1
    var readbutton = document.createElement("button");
    readbutton.id = "readbutton";
    readbutton.textContent = "No.でソート";
    readbutton.addEventListener('click',function(){
        Reader();
    });

    //ソート用ボタン追加
    document.getElementById("tabmenutable").appendChild(readbutton);
}

function Reader(){
    //引数:なし
    //返す:なし
    //依存:なし
    //その他作用:成績表の表示順を画面の謎ナンバ順にする

    //mainと同様にやって表取得
    var table = LoadTable()
    var table_array = []

    //表を二次元配列に
    for(let i = 1; i < table.rows.length; i++){ /*行のループ*/
        table_array[i]=[] /*配列を二次元にする，行内データを入れるため*/
        for(let j = 0; j < table.rows[0].cells.length; j++){ /*行内でのループ*/
            table_array[i][j] = table.rows[i].cells[j].innerHTML;
        }
    }

    var url = table_array[1][1]
    url = url.substr(url.indexOf("=")+2)
    url = url.substr(0, url.indexOf('">')-1)
    console.log(url)
    url = "https://gakujo.iess.niigata-u.ac.jp/campusweb/" + url

    console.log(table_array[1][1])
    console.log(url)


    const req = new Request(url,{
        headers: {
            "Host": "gakujo.iess.niigata-u.ac.jp",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",

            "referrer": url.substr(0, url.indexOf('&a')-1),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

            "user-agent": navigator.userAgent,
            "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
            "Upgrade-Insecure-Requests": "1",


            "Sec-Fetch-Dest": "iframe",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1"
        },
        method: "GET",
        mode: "cors",
        redirect: 'follow',
        credentials: "same-origin",
        referrerPolicy: "origin-when-cross-origin",
    })
    console.log(req)
    fetch(req).then(console.log);

    //const Http = new XMLHttpRequest();
    //Http.open("GET", url);
    //Http.send();
    //Http.onreadystatechange=(e)=>{
    //    console.log(Http.responseText)
    //}

}