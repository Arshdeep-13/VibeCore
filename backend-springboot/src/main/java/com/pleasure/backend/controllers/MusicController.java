package com.pleasure.backend.controllers;

import com.pleasure.backend.services.MusicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MusicController {

    @Autowired
    private MusicService musicService;

    @GetMapping("/around-you/{countryCode}")
    public Object countryMusicData(@PathVariable String countryCode){
        return musicService.getCountryMusicData(countryCode);
    }
}
