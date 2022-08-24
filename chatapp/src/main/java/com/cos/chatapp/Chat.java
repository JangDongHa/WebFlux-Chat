package com.cos.chatapp;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "chat")
public class Chat {
    @Id
    private String id; // 기본적으로 Bson 이라는 타입으로 id를 정하기 때문에 String으로 지정

    private String msg;
    private String sender;
    private String receiver; // 귓속말 전용
    private Integer roomNum;
    private String roomName;

    private LocalDateTime createAt;
}
