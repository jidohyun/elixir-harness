# elixir-harness

Elixir/Phoenix 프로젝트에서 AI 코딩 에이전트를 더 안전하게 굴리기 위한 **repo-local spec-first harness**입니다.

이 패키지는 애플리케이션 프레임워크가 아니라, 프로젝트 안에 `.code_my_spec/` 같은 제어면(control plane)을 만들어 줍니다. 에이전트가 코드를 바로 수정하지 않고 아래 순서로 움직이게 만드는 것이 목표입니다.

```text
architecture → status → spec → rules → issues → implementation → QA
```

## 왜 필요한가

AI 코딩 에이전트는 빠르게 코드를 만들 수 있지만, 요구사항이 애매하면 애매한 구현을 빠르게 쌓습니다. 이 harness는 다음 정보를 repo 안에 고정합니다.

- 전체 아키텍처 지도
- 컴포넌트별 구현/테스트 상태
- 모듈별 spec
- Context / Repository / Schema / LiveView 규칙
- framework reference
- QA plan, journey, result, screenshot evidence
- 재현 가능한 setup/codegen script

## 빠른 설치

### npx로 바로 사용

```bash
cd my_phoenix_app
npx @jidohyun/elixir-harness init
```

기본적으로 현재 디렉토리에 다음 폴더를 만듭니다.

```text
.code_my_spec/
```

### 전역 설치

```bash
npm install -g @jidohyun/elixir-harness
cd my_phoenix_app
elixir-harness init
```

### GitHub에서 바로 실행

npm registry에 publish하기 전이라면 GitHub source로도 실행할 수 있습니다.

```bash
cd my_phoenix_app
npx github:jidohyun/elixir-harness init
```

## 사용법

```bash
elixir-harness init [target] [options]
```

### 예시

```bash
# 현재 디렉토리에 .code_my_spec 생성
elixir-harness init

# 특정 프로젝트에 생성
elixir-harness init ./my_phoenix_app

# 디렉토리 이름 변경
elixir-harness init ./my_phoenix_app --dir .my_spec

# 기존 harness 덮어쓰기
elixir-harness init --force

# 실제 쓰기 없이 확인
elixir-harness init --dry-run
```

## 생성되는 구조

```text
.code_my_spec/
├── AGENTS.md                  # 에이전트가 먼저 읽을 가이드
├── config.yml                 # harness/status/spec 검사에서 제외할 경로
├── architecture/              # 전체 구조, dependency graph, ADR
│   ├── overview.md
│   ├── namespace_hierarchy.md
│   ├── dependency_graph.mmd
│   └── decisions/
├── status/                    # component별 구현/테스트 상태
├── spec/                      # module/context/liveview별 spec
│   └── templates/
├── rules/                     # component type별 작성 규칙
├── knowledge/                 # 도메인/운영/외부 API 조사 노트
├── framework/                 # Phoenix/LiveView/Ecto 등 reference
├── design/                    # design system 문서
├── issues/                    # known bugs / tech debt
├── qa/                        # QA 계획, 결과, 스크린샷, script
└── tasks/                     # 재현 가능한 setup/codegen script
```

## 에이전트 작업 순서

`AGENTS.md`의 기본 규칙은 다음과 같습니다.

```text
Before implementing a component:
1. Check status/ — 이미 구현됐는가?
2. Read spec/ — 무엇을 해야 하는가?
3. Read rules/ — 어떤 규칙을 따라야 하는가?
4. Check issues/ — 알려진 문제가 있는가?
5. Implement the smallest coherent change.
6. Add/update tests.
7. Run verification.
```

## Spec 예시

### Context spec

```md
# App.Accounts

Business accounts and membership management.

## Type
context

## Delegates
- list_accounts/1: Accounts.AccountRepository.list_accounts/1

## Functions

### list_accounts/1

```elixir
@spec list_accounts(Scope.t()) :: list(Account.t())
```

**Process**:
1. Extract user_id from scope.
2. Query accounts through repository.
3. Return scoped account list.

**Test Assertions**:
- returns accounts the user belongs to
- does not return accounts outside the scope
- returns empty list when no accounts exist
```

### LiveView spec

```md
# AppWeb.DashboardLive.Index

## Type
liveview

## Route
`/dashboards`

## Dependencies
- App.Dashboards

## User Interactions
- **phx-click="delete"** (`data-role="delete-dashboard-{id}"`): Opens confirmation.
- **phx-click="confirm_delete"** (`data-role="confirm-delete-{id}"`): Deletes dashboard.

## Test Assertions
- unauthenticated users are redirected
- page renders expected initial state
- delete success updates durable state
- delete failure shows error without crashing
```

## 핵심 규칙

### Context

- public API boundary로 동작한다.
- scope/current-user가 필요한 함수는 첫 번째 인자로 scope를 받는다.
- DB query는 scope boundary를 강제한다.
- `{:ok, result}` / `{:error, reason}` tuple을 일관되게 반환한다.

### Repository

- data access와 transaction을 담당한다.
- CRUD와 query builder를 분리한다.
- multi-step write는 transaction으로 처리한다.
- rollback behavior를 테스트한다.

### LiveView

- domain behavior는 context로 보낸다.
- key interaction에는 안정적인 `data-role` selector를 둔다.
- flash message만 성공 증거로 보지 않는다.
- durable domain state나 follow-up behavior를 검증한다.
- 외부 서비스 실패를 pattern match로 LiveView crash로 만들지 않는다.

## QA 철학

좋은 QA는 “문구가 보이는지”가 아니라 “실제로 상태가 바뀌었는지”를 봅니다.

```text
나쁜 QA:
- 성공 flash가 보인다.

좋은 QA:
- action을 수행했다.
- domain state가 바뀌었다.
- DB/state/follow-up 화면에서 변경을 확인했다.
- 실패 케이스가 graceful하게 처리된다.
```

## 개발 / 검증

이 repo 자체 검증:

```bash
npm run smoke
npm pack --dry-run
```

## 배포 준비

```bash
npm publish --access public
```

GitHub source로만 사용할 경우 npm publish는 필요 없습니다.

## 라이선스

MIT
