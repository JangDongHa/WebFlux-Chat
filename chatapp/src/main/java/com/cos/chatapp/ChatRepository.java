package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;
import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String> {
    
    // 쉽게 말해서 스트림을 연결하여 유지하는 것처럼 계속 연결이 유지되는 것처럼 보임
    // 그래서 mFindBySender 와 관련된 INSERT 가 들어오면 해당 값을 저장하고 그 값을 계속 흘려보냄
    // 이렇게 흘러 들어온 값을 컨트롤러는 Flux 로 응답해주면 실시간으로 데이터가 들어오면 흘려보낼 수 있음
    @Tailable // 커서를 닫지 않고 계속 유지한다라는 것 (그러니까 mFind 를 호출하고 Return 을 하고 종료되는 것이 아니라 계속 유지)
    @Query("{sender : ?0, receiver : ?1}")
    Flux<Chat> mFindBySender(String sender, String receiver); // Flux (흐름) = 데이터를 한번 받고 끝나는 것이 아니라 계속 받겠다는 것 (수화기를 계속 들고 있는 것과 같음)
    // response 를 유지하면서 데이터를 계속 흘려보낼 수 있음
}
