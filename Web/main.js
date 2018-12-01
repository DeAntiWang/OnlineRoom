window.onload = function(){
    wsfunc();
    // console.log(sessionStorage.getItem("nickname"));
};

function wsfunc(){
    let app2 = new Vue({
        el: '#app2',
        data: {
            msgList: [
                {
                    text: '欢迎来到OnlineRoom',
                    cls: 'notice'
                },
            ]
        }
    });

    ws = new WebSocket("ws://127.0.0.1:9501/ws");

    ws.onopen = function() {
        let json = [];
        let rows = {};

        rows.nick = sessionStorage.getItem("nickname"); //NickName
        rows.type = "login";
        rows.message = "";
        rows.time = new Date().getTime().toString();

        json.push(rows);

        let jsonStr = JSON.stringify(json);

        ws.send(jsonStr)
    };

    ws.onmessage = function(evt) {
        let jsonObj = JSON.parse(evt.data);

        let nick = jsonObj.nick;
        let type = jsonObj.type;
        let msg  = jsonObj.message;
        let Time = jsonObj.time;

        // console.log(nick,type,msg,Time);

        switch(type){
            case "login":
                app2.msgList.push({text:"\""+nick+"\"已进入房间",cls:"notice"});
                break;
            case "send":
                // TODO 完善逻辑
                // app2.msgList.push({text:"\""+nick+"\"已进入房间",cls:"user-msg"});
                break;
            case "logout":
                app2.msgList.push({text:"\""+nick+"\"已退出房间",cls:"notice"});
                break;
            case "err":
                app2.msgList.push({text:"发生错误",cls:"notice"});
                break;
        }
    };

    ws.onclose = function() {
        app2.msgList.push({text:"服务器已关闭",cls:"notice"});
        // 显示服务器已关闭
    };

    ws.onerror = function(err) {
        // 显示错误
        app2.msgList.push({text:"error : "+err.data,cls:"notice"});
    };

    // TODO 监听send按钮发送消息

    // TODO 监听logout按钮发送离线消息
}