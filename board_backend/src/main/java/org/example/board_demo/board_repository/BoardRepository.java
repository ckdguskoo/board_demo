package org.example.board_demo.board_repository;

import org.example.board_demo.board_domain.BoardDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardDomain, Long> {

}
