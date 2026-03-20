# AISE+ 프로젝트 로드맵

## Context

AISE+는 다양한 AI 에이전트를 실험할 수 있는 플레이그라운드 플랫폼이다. 기본 제공 에이전트 활용 + 커스텀 에이전트 생성/실행이 핵심 가치. 지금까지 레이아웃과 공통 컴포넌트(Header, Sidebar, ResizeHandle, PanelToggleBar 등)를 완성했고, 이제 세부 기능 확장 단계에 진입한다.

**브랜치 전략**: 병렬 작업 — `main`에서 공통 요소를 계속 발전시키면서, feature 브랜치로 세부 기능을 동시 개발.

---

## 브랜치 구조

```
main (공통 요소 + 안정화)
 ├── feature/right-panel-viewers   ← RightPanel 뷰어 POC
 ├── feature/agent-integration     ← 에이전트 연동
 └── feature/...                   ← 이후 기능들
```

**운영 규칙**:

- `main`은 항상 빌드 가능한 상태 유지
- feature 브랜치는 `main` 기반으로 생성
- feature 작업 중 main에 공통 요소가 추가되면 주기적으로 merge/rebase
- feature 완성 시 main으로 PR 병합

---

## 1. 공통 요소 (main 브랜치)

아직 완성되지 않은 공통 인프라. feature 개발과 병렬로 필요에 따라 진행.

### 우선순위 높음 (feature 개발에 직접 필요)

- [ ] **API 연동 기초** — fetch wrapper, 에러 핸들링, 인증 토큰 관리
- [ ] **환경 설정** — env 구성, API endpoint 관리

### 우선순위 중간 (UX 완성도)

- [ ] **공통 오버레이** — Alert, Confirm, Custom 모달 (통합 오버레이 시스템)
- [ ] **Toast/Snackbar** — 비동기 작업 피드백
- [ ] **로딩 상태** — 글로벌 로딩 인디케이터, Skeleton 패턴 표준화

### 우선순위 낮음 (후속 작업)

- [ ] **프로필 페이지** — 사용자 정보, 설정
- [ ] **에러 바운더리** — 글로벌/컴포넌트 단위 에러 처리
- [ ] **권한 관리** — 인증/인가 기초 구조

---

## 2. Feature: Right Panel Viewers (`feature/right-panel-viewers`)

### 목표

RightPanel에 동적으로 뷰어 컴포넌트를 렌더링하는 구조 검증 (POC).

### 구현 범위

**핵심 구조**

- RightPanel 내부에 뷰어 타입별 동적 렌더링 시스템
- 뷰어 전환 UI (탭 또는 헤더 드롭다운)
- 뷰어 상태 관리 (Zustand store 확장 또는 별도 store)

**뷰어 컴포넌트 (POC)**
| 뷰어 | 설명 | 비고 |
|------|------|------|
| 마크다운 뷰어 | 에이전트 응답, 문서 렌더링 | react-markdown + remark-gfm |
| PDF 뷰어 | 업로드 문서 미리보기 | react-pdf 또는 iframe 방식 |
| 텍스트 뷰어 | 플레인 텍스트, 로그 | 라인 넘버, 자동 스크롤 |
| 코드 뷰어 | 구문 하이라이팅 | shiki 또는 prism |

**후속 확장 후보** (이번 POC 범위 외)

- 이미지 뷰어 (확대/축소)
- HTML 프리뷰 (sandboxed iframe)
- JSON 트리 뷰어
- Diff 뷰어

---

## 3. Feature: Agent Integration (`feature/agent-integration`)

> Right Panel Viewers POC 이후 진행

- 에이전트 실행/응답 스트리밍
- 채팅 메시지 ↔ RightPanel 뷰어 연동
- 기본 제공 에이전트 템플릿
- 커스텀 에이전트 생성 UI

---

## 작업 흐름 예시

```
Week N:
  main  → API 연동 기초, 환경 설정
  feature/right-panel-viewers → 뷰어 구조 + 마크다운/코드 뷰어

Week N+1:
  main  → 공통 오버레이, Toast
  feature/right-panel-viewers → PDF/텍스트 뷰어 → PR → main 병합

Week N+2:
  main  ← viewers 병합 완료
  feature/agent-integration → 에이전트 연동 시작
```

---

## 즉시 실행 가능한 다음 단계

1. **현재 main 상태 확인** — 모든 변경사항 커밋/푸시 완료 확인
2. **`feature/right-panel-viewers` 브랜치 생성**
3. **RightPanel 동적 뷰어 구조 설계 및 구현 시작**
