# 간단한 게시판 프로젝트

## 프로젝트 개요
본 프로젝트는 기본적인 게시판 CRUD 기능 구현을 목표로 한 웹 애플리케이션입니다.  
프론트엔드와 백엔드를 분리한 구조로 설계하여 REST API 기반 통신과 컨테이너 환경,  
클라우드 배포 경험을 쌓는 것을 목적으로 합니다.

> 인증(로그인/회원가입) 기능은 구현 범위에서 제외하고, 게시판 핵심 기능에 집중합니다.

---

## 기술 스택

### Frontend
- Next.js
- JavaScript (ES6+)
- REST API 연동

### Backend
- Spring Boot
- Spring Web
- Spring Data JPA

### Database
- MySQL

### Infrastructure / DevOps
- Docker
- AWS EC2

---

## 주요 기능

### 게시판 CRUD
- 게시글 목록 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제

---

## 프로젝트 특징
- 프론트엔드 / 백엔드 분리 구조
- RESTful API 설계
- Docker 기반 컨테이너 환경 구성
- AWS EC2를 이용한 배포
- 인증 로직을 제외하여 CRUD와 API 설계에 집중
- cursorAI를 사용한 프론트엔드 구현

--- 

## 프로젝트 구조
- controller
- repository
- domain
- service
- dto
- config

--- 

## 데이터베이스 구조
- id (AUTO_INCREMENT)
- title
- name (작성자)
- text
- create_At
- update_At

---

## 프론트엔드 작성 명령
>@board_demo 아래의 board_backend파일을 참고하여 프론트 엔드를 작성할것 사용 기술스택은 next.js를 사용하고
Rest API를 통한 백엔드와 통신설정도 완료할것.

>페이징 기능을 추가할것 한 페이지에 10개의 게시글만 보이도록

>게시판을 좀 꾸미기 위해 연한파란색과 연보라색을 적절하게 사용하여 배경색을 채워주고, 애니매이션 효과를 넣을것, 마우스 포인트 이동에따른 간단한 효과도 하나 추가해

>@board_backend 파일에 맞춰서 @board_frontend 리팩토링 백엔드 파일은 건드리지 말것

---