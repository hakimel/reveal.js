///URL parameter取得して配列へin
var arg = new Object;
var pair = location.search.substring(1).split('&');
for(var i = 0;pair[i];i++) {
    var kv = pair[i].split('=');
    arg[kv[0]] = kv[1];
}

///プロフィールAPI(自作GASアプリ)より取得
var meta_json;
if(arg["mode"]){
    var url = "https://script.google.com/macros/s/AKfycbyulXVm6rcR8YOHtDJ-E4v22fkzMGeSKbUU7UCbwn-rttQwVn89/exec";
    var param = {};
    param["mode"]=arg["mode"];
    param = JSON.stringify(param);
    fetch(url,{
        method: 'POST',
        mode: 'cors',
        body: param
    }).then(function(response) {
        return response.text();
    }).then(function(json) {
        var json = JSON.parse(json||"null");
        createDom(json);
    })
};

function createDom(meta_json){
    //json内のキーを探査して、キーと同値のクラスへdom書き込み
    Object.keys(meta_json).forEach(function(key){
        ///各メタデータ配置箇所のclass要素をget
        var domList = document.getElementsByClassName(key);
        for(var i=0; i < domList.length; i++){
            if(key == "image"){
                domList.item(i).insertAdjacentHTML("beforeend", "<img alt='こ↑こ↓僕のサムネ' style='height:20rem;' src='"+meta_json[key]+"'></img>");
            }else{
                domList.item(i).insertAdjacentHTML("beforeend", ""+meta_json[key]+"");
            }
        }
    });
}
