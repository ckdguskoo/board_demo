package org.example.board_demo.board_service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.board_demo.board_domain.BoardDomain;
import org.example.board_demo.board_repository.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.example.board_demo.board_dto.BoardUpdateRequestDto;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {
    private final BoardRepository boardRepository;

    public List<BoardDomain> findAll() {
        return boardRepository.findAll();
    }

    public BoardDomain findById(Long id) {
        return boardRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Transactional
    public BoardDomain addBoard(BoardDomain boardDomain) {
        boardDomain.setCreated_at(LocalDateTime.now());
        log.info("게시글 '{}'가 추가되었습니다.", boardDomain.getTitle());
        return boardRepository.save(boardDomain);
    }

    @Transactional
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
        log.info("id: {}번 게시글이 삭제되었습니다.", id);
    }

    @Transactional
    public BoardDomain modifyBoard(Long id, BoardUpdateRequestDto requestDto) {
        BoardDomain existingBoard = boardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException(id + "번 게시글을 찾을 수 없습니다."));

        existingBoard.setTitle(requestDto.getTitle());
        existingBoard.setName(requestDto.getName());
        existingBoard.setText(requestDto.getText());
        existingBoard.setUpdated_at(LocalDateTime.now());

        log.info("게시글 id: {}이 수정되었습니다.", existingBoard.getId());
        return boardRepository.save(existingBoard);
    }



}
