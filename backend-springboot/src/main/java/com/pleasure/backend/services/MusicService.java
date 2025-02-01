package com.pleasure.backend.services;

import com.pleasure.backend.models.MusicModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MusicService {

    @Autowired
    private RedisService redisService;

    @Autowired
    private RestTemplate restTemplate; // Ensure this is configured as a Bean

    private static final String SPOTIFY_API_URL = "https://api.spotify.com/v1/search?q=top+songs&type=album&market=";
    private static final String AUTH_TOKEN = "Bearer BQBnYCHch7Ml2xL_gDeO9afOyPV8ae2YtzCiqupoULdlbqBhnh8hV4qnOX12K_V1jhGc-YPJWaODwhWJjfgcyP5gUbgO11TK7pR905ibXb_Hoo3tuO_gfvLEE45kQtK28AwuV3KmhPJ4UX1_lJZk8vAa8BU32RI4WmTlm5mdRajQhtIJL-n0cENR708l6jm4zzPW3cp-jLSF38jGmKUxAYtlK3IvQQ"; // Replace with secure token retrieval

    public Object getCountryMusicData(String countryCode) {
        // Check Redis cache
        Object musicResponse = redisService.get(countryCode, MusicModel.class);
        if (musicResponse != null) {
            return musicResponse;
        }

        try {
            // Fetch from Spotify API
            String url = SPOTIFY_API_URL + countryCode;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", AUTH_TOKEN);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<MusicModel> response = restTemplate.exchange(url, HttpMethod.GET, entity, MusicModel.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Object fetchedData = response.getBody();

                // Save response to Redis
                redisService.set(countryCode, fetchedData, 10L);

                return fetchedData;
            }
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error fetching data from Spotify API: " + e.getMessage());
        }

        return null;
    }
}
