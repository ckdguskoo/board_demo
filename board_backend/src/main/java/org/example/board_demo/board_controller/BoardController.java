package org.example.board_demo.board_controller;

import lombok.RequiredArgsConstructor;
import org.example.board_demo.board_domain.BoardDomain;
import org.example.board_demo.board_dto.BoardUpdateRequestDto;
import org.example.board_demo.board_service.BoardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {
    
    private final BoardService boardService;

    @GetMapping
    public List<BoardDomain> findAll() {
        return boardService.findAll();
    }

    @GetMapping("/{id}")
    public BoardDomain findOne(@PathVariable Long id) throws  Exception{
        return boardService.findById(id);
    }

    @PostMapping
    public BoardDomain save(@RequestBody BoardDomain boardDomain) {
        return boardService.addBoard(boardDomain);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }

    @PutMapping("/{id}")
    public BoardDomain modify(@PathVariable Long id, @RequestBody BoardUpdateRequestDto requestDto) {
        return boardService.modifyBoard(id, requestDto);
    }

}
