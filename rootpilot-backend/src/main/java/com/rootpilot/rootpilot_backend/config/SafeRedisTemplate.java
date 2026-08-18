package com.rootpilot.rootpilot_backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;

/**
 * A fail-safe wrapper around RedisTemplate that returns safe defaults
 * when Redis is unavailable (e.g., on Railway without a Redis add-on).
 * Provides the same API surface as RedisTemplate so callers need minimal changes.
 */
@Component
public class SafeRedisTemplate {

    private static final Logger log = LoggerFactory.getLogger(SafeRedisTemplate.class);

    private final RedisTemplate<String, Object> delegate;
    private boolean redisAvailable = true;

    private final SafeValueOperations valueOps = new SafeValueOperations();

    public SafeRedisTemplate(RedisTemplate<String, Object> delegate) {
        this.delegate = delegate;
    }

    /**
     * Returns a fail-safe ValueOperations proxy.
     * Existing code like redisTemplate.opsForValue().get(key) works unchanged.
     */
    public SafeValueOperations opsForValue() {
        return valueOps;
    }

    public Set<String> keys(String pattern) {
        if (!redisAvailable) return Collections.emptySet();
        try {
            Set<String> result = delegate.keys(pattern);
            return result != null ? result : Collections.emptySet();
        } catch (Exception e) {
            markUnavailable(e);
            return Collections.emptySet();
        }
    }

    public Boolean delete(String key) {
        if (!redisAvailable) return false;
        try {
            return delegate.delete(key);
        } catch (Exception e) {
            markUnavailable(e);
            return false;
        }
    }

    private void markUnavailable(Exception e) {
        if (redisAvailable) {
            redisAvailable = false;
            log.warn("Redis is unavailable — all Redis operations will return safe defaults. Error: {}", e.getMessage());
        }
    }

    /**
     * Fail-safe ValueOperations that mirrors the RedisTemplate ValueOperations API.
     */
    public class SafeValueOperations {

        public Object get(String key) {
            if (!redisAvailable) return null;
            try {
                return delegate.opsForValue().get(key);
            } catch (Exception e) {
                // Spring Data Redis may wrap the SerializationException in a RedisSystemException or similar.
                // We attempt to read the raw bytes for ANY exception before giving up.
                try {
                    byte[] rawValue = delegate.execute((org.springframework.data.redis.connection.RedisConnection connection) -> 
                        connection.stringCommands().get(key.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
                    if (rawValue != null) {
                        return Long.parseLong(new String(rawValue, java.nio.charset.StandardCharsets.UTF_8));
                    }
                } catch (Exception ignored) {
                }
                
                markUnavailable(e);
                return null;
            }
        }

        public void set(String key, Object value) {
            if (!redisAvailable) return;
            try {
                delegate.opsForValue().set(key, value);
            } catch (Exception e) {
                markUnavailable(e);
            }
        }

        public Long increment(String key) {
            if (!redisAvailable) return 0L;
            try {
                return delegate.opsForValue().increment(key);
            } catch (Exception e) {
                markUnavailable(e);
                return 0L;
            }
        }
    }
}

