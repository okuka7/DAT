package com.server.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class QuizService {
    private final Map<String, String> quizMap = new HashMap<>();

    public QuizService() {
        quizMap.put("쓰기는 분명히 썼는데 읽을 수 없는 것은?", "모자");
        quizMap.put("네 마리의 고양이가 괴물이 되면?", "포켓몬스터");
        quizMap.put("세상에서 가장 더러운 강은?", "요강");
        quizMap.put("비가 빅뱅에 들어가지 않은 이유는?", "태양 때문에");
    }

    public boolean validateAnswer(String question, String answer) {
        String correctAnswer = quizMap.get(question);
        return correctAnswer != null && correctAnswer.equals(answer.trim());
    }
}
