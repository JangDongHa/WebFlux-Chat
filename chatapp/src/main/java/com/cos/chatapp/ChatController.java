package com.cos.chatapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@CrossOrigin
@RequiredArgsConstructor
@RestController
public class ChatController {
    private final ChatRepository chatRepository;

    // produces = contentType 을 정해주는 것
    // MediaType.TEXT_EVENT_STREAM_VALUE (SSE 프로토콜에서 지정한 타입으로써 Response 로 TEXT 형태를 지속적으로 전송)
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMessage(@PathVariable String sender, @PathVariable String receiver){
        return chatRepository.mFindBySender(sender, receiver)
                .subscribeOn(Schedulers.boundedElastic());
    }
    
    // 이제 위의 스트림에 데이터를 넣어주는 메서드를 생성
    @PostMapping("/chat")
    public Mono<Chat> setMessage(@RequestBody Chat chat){ // Mono : 데이터를 한 건만 Return 하겠다는 것 (그래서 void 로 해도 상관 없음)
        chat.setCreateAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }
}
