var getInfo = new Promise(function(){
    ///URL parameter取得して配列へin
    var arg = getURLparam(location.search.substring(1).split('&'));
    ///プロフィールAPI(自作GASアプリ)より取得
    var meta_json;
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
        console.log(json);
        return json;
    }).then(function(json){
        return createDom(json);
    });
    return true;
});

function getURLparam(pair){
    var arg = new Object;
    for(var i = 0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]] = kv[1];
    }
    console.log(arg);
    return arg;
}

function createDom(meta_json){
    return new Promise(function(){
        //json内のキーを探査して、キーと同値のクラスへdom書き込み
        Object.keys(meta_json).forEach(function(key){
            if(key == "slideurl"){
                fetch(meta_json["slideurl"]).then(function(response) {
                    return response.text();
                }).then(function(slide){
                    document.getElementById(key).insertAdjacentHTML("beforeend", ""+ slide +"");
                })
            }
            ///各メタデータ配置箇所のclass要素をget
            var domList = document.getElementsByClassName(key);
            for(var i=0; i < domList.length; i++){
                if(key == "image"){
                    domList.item(i).insertAdjacentHTML("beforeend", "<img alt='こ↑こ↓僕のサムネ' style='height:20rem;' src='"+meta_json[key]+"'></img>");
                }else if(key == "url"){
                    domList.item(i).insertAdjacentHTML("beforeend", ""+meta_json[key]+"");
                    domList.item(i).href = meta_json[key];
                }else{
                    domList.item(i).insertAdjacentHTML("beforeend", ""+meta_json[key]+"");
                    console.log("slideurl dom is: ");
                }
            }
        });
        return true;
    });
}
