package com.rootpilot.rootpilot_backend.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisTestController {

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisTestController(
            RedisTemplate<String, Object> redisTemplate) {

        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/redis-test")
    public String testRedis() {

        redisTemplate.opsForValue()
                .set("test", "Redis Connected");

        return (String) redisTemplate
                .opsForValue()
                .get("test");
    }
}