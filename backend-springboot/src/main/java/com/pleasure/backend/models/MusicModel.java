package com.pleasure.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Component;

@Data
@AllArgsConstructor
@Component
public class MusicModel {

//    @Id
//    public int id;
    public String name;
}
