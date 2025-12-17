package org.example.board_demo.board_dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardUpdateRequestDto {
    private String title;
    private String name;
    private String text;
}
