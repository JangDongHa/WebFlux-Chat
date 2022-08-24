// 로그인 시스템 대신 사용
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;


// SSE 연결
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`); // 이벤트객체 생성
eventSource.onmessage = (event) => {
    console.log(1, event);
    const data = JSON.parse(event.data);
    let date = new Date(data.createAt);
    console.log(2, data);

    if (data.sender === username){ // 파란박스(오른쪽)
        initMyMessageForm(data, date);
    }else{ // 회색박스 (왼쪽)
        initReceiveMessageForm(data, date);
    }
}

// 파란 박스
function getSendMsgBox(msg, time, day, username){
    return `<div class="sent_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time} | ${day} | ${username}</span>
    </div>`;
}

// 회색 박스
function getReceiveMsgBox(msg, time, day, username){
    return `<div class="received_withd_msg">
    <p>${msg}</p>
    <span class="time_date"> ${time} | ${day} | ${username}</span>
    </div>`;
}

// 다른 사람이 적은 메세지 폼
function initReceiveMessageForm(data, date){
    let chatBox = document.querySelector("#chat-box");

    let chatIncomingBox = document.createElement("div");
    chatIncomingBox.className = "received_msg";
    chatIncomingBox.innerHTML = getReceiveMsgBox(data.msg, makeTime(date), makeDay(date), data.sender);
    chatBox.append(chatIncomingBox);
    document.documentElement.scrollTop = document.body.scrollHeight;
}

// 내가 적은 메세지 폼
function initMyMessageForm(data, date){
    let chatBox = document.querySelector("#chat-box");

    let chatOutgoingBox = document.createElement("div");
    chatOutgoingBox.className = "outgoing_msg";
    chatOutgoingBox.innerHTML = getSendMsgBox(data.msg, makeTime(date), makeDay(date), data.sender);
    chatBox.append(chatOutgoingBox);
    document.documentElement.scrollTop = document.body.scrollHeight; // 채팅 메세지 아래로 포커싱 되게
}

document.querySelector("#chat-send").addEventListener("click", ()=>{
    addMsgForm();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e)=>{
    if (e.keyCode == 13)
        addMsgForm();
});

async function addMsgForm(){ // fetch 와 같이 통신이 적용될 경우, block 당할 가능성이 존재하므로 비동기 함수로 변경
    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    let response = await fetch("http://localhost:8080/chat", { // fetch 가 종료될 때까지 await 시키지 않으면 fetch 되기도 전에 아래 라인으로 넘어가서 response 가 null 이 나오므로
        method: "post",
        body: JSON.stringify(chat),
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        }
    });
    let parseResponse = await response.json(); // promise pending 이 발생하면 대기중 이라는 의미이므로 역시 await 를 붙여준다.
    msgInput.value = "";
}

function makeDay(date){
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();
}

function makeTime(date){
    return date.getHours() + ":" + date.getMinutes();
}