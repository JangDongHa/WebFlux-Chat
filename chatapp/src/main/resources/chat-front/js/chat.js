const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos"); // 이벤트객체 생성
eventSource.onmessage = (event) => {
    console.log(1, event);
    const data = JSON.parse(event.data);
    console.log(2, data);
    let date = new Date(data.createAt);
    initMessageForm(data.msg, date);
    
}



function getSendMsgBox(msg, time, day){
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time} | ${day}</span>
    </div>`;
}

function initMessageForm(dataMsg, date){
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");


    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
    chatOutgoingBox.innerHTML = getSendMsgBox(dataMsg, makeTime(date), makeDay(date));
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

async function addMsgForm(){ // fetch 와 같이 통신이 적용될 경우, block 당할 가능성이 존재하므로 비동기 함수로 변경
    let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");


    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";

    let date = new Date();

    let chat = {
        sender: "ssar",
        receiver: "cos",
        msg: msgInput.value
    };

    let response = await fetch("http://localhost:8080/chat", { // fetch 가 종료될 때까지 await 시키지 않으면 fetch 되기도 전에 아래 라인으로 넘어가서 response 가 null 이 나오므로
        method: "post",
        body: JSON.stringify(chat),
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    console.log(response);

    let parseResponse = await response.json(); // promise pending 이 발생하면 대기중 이라는 의미이므로 역시 await 를 붙여준다.
    
    console.log(parseResponse);
    chatOutgoingBox.innerHTML = getSendMsgBox(msgInput.value, makeTime(date), makeDay(date));
    chatBox.append(chatOutgoingBox);
    msgInput.value = "";
}

function makeDay(date){
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();
}

function makeTime(date){
    return date.getHours() + ":" + date.getMinutes();
}



document.querySelector("#chat-send").addEventListener("click", ()=>{
    addMsgForm();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e)=>{
    if (e.keyCode == 13)
        addMsgForm();
});