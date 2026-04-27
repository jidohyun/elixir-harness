# elixir-harness

[English README](./README.md)

Elixir/Phoenix 프로젝트에서 AI 코딩 에이전트를 더 안전하게 굴리기 위한 가벼운 **repo-local spec-first harness**입니다.

`elixir-harness`는 애플리케이션을 생성하는 프레임워크가 아닙니다. 대신 프로젝트 안에 `.code_my_spec/` 제어면(control plane)을 설치해서 사람과 AI 에이전트가 같은 아키텍처 지도, 모듈 spec, 규칙, QA 계획, 검증 증거를 공유하도록 만듭니다.

```text
architecture → status → spec → rules → issues → implementation → QA
```

## 설치

### 에이전트용 설치 명령

Elixir/Phoenix 저장소 안에서 작업하는 AI 코딩 에이전트라면 가장 먼저 아래 명령을 실행하세요.

```bash
npx -y @jidohyun/elixir-harness init .
```

그 다음 이 파일을 읽으세요.

```bash
.code_my_spec/AGENTS.md
```

에이전트 기본 원칙:

```text
코드부터 수정하지 말 것.
status → spec → rules → issues 순서로 읽고 구현과 검증을 진행할 것.
```

### 사람용 설치

`npx`로 바로 사용:

```bash
cd my_phoenix_app
npx @jidohyun/elixir-harness init
```

전역 설치:

```bash
npm install -g @jidohyun/elixir-harness
cd my_phoenix_app
elixir-harness init
```

옵션:

```bash
elixir-harness init [target] [options]

Options:
  --dir <name>   harness 디렉토리 이름. 기본값: .code_my_spec
  --force        기존 harness 디렉토리 덮어쓰기
  --dry-run      실제 쓰기 없이 복사될 파일만 확인
  --help         도움말 출력
```

예시:

```bash
elixir-harness init
elixir-harness init ./my_phoenix_app
elixir-harness init ./my_phoenix_app --dir .my_spec
elixir-harness init --dry-run
```

## 생성되는 구조

```text
.code_my_spec/
├── AGENTS.md                  # 에이전트 가이드와 workflow entrypoint
├── config.yml                 # harness/status/spec 검사에서 제외할 경로
├── architecture/              # 아키텍처 지도, dependency graph, ADR
│   ├── overview.md
│   ├── namespace_hierarchy.md
│   ├── dependency_graph.mmd
│   └── decisions/
├── status/                    # component별 구현/테스트 상태
├── spec/                      # context, module, schema, LiveView별 spec
│   └── templates/
├── rules/                     # component type별 규칙
├── knowledge/                 # 도메인/API/운영 노트
├── framework/                 # Phoenix, LiveView, Ecto, QA reference
├── design/                    # design system 문서
├── issues/                    # known bugs / technical debt
├── qa/                        # QA 계획, journey, script, result
└── tasks/                     # 재현 가능한 setup/codegen script
```

## 왜 필요한가

AI 에이전트는 빠르지만, 모호함도 빠르게 증폭합니다. 애매한 story는 애매한 test, 애매한 code, false-positive QA로 이어질 수 있습니다. 이 harness는 프로젝트 맥락을 명시적이고 versioned artifact로 고정합니다.

유지하려는 것:

- 코드 옆에 있는 아키텍처 결정
- 구현 전 모듈 단위 spec
- Context / Repository / Schema / LiveView 규칙
- browser QA를 위한 안정적인 selector
- repo 안에 남는 QA journey와 evidence
- 재현 가능한 setup/codegen 명령

## 에이전트 작업 순서

컴포넌트를 구현하기 전:

```text
1. .code_my_spec/status/ 확인
2. .code_my_spec/spec/ 읽기
3. .code_my_spec/rules/ 읽기
4. .code_my_spec/issues/ 확인
5. 가장 작은 일관된 변경 구현
6. 테스트 추가 또는 수정
7. 검증 실행
```

기존 컴포넌트를 수정하기 전:

```text
1. spec을 읽고 의도된 동작 파악
2. 현재 구현 읽기
3. 관련 issue와 QA failure 확인
4. 적용 가능한 rule 파일 따르기
5. spec이 바뀌지 않았다면 기존 동작 보존
```

## Spec 스타일

Context spec은 public API, behavior, process, test assertions를 포함해야 합니다.

````markdown
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
1. scope에서 user identity를 추출한다.
2. repository를 통해 account를 조회한다.
3. scope가 적용된 account list를 반환한다.

**Test Assertions**:
- 사용자가 볼 수 있는 account를 반환한다
- scope 밖의 account를 반환하지 않는다
- 없으면 빈 list를 반환한다
````

LiveView spec은 route, dependencies, user interactions, durable outcomes, stable QA selectors를 포함해야 합니다.

````markdown
# AppWeb.DashboardLive.Index

## Type
liveview

## Route
`/dashboards`

## Dependencies
- App.Dashboards

## User Interactions
- **phx-click="delete"** (`data-role="delete-dashboard-{id}"`): confirmation을 연다.
- **phx-click="confirm_delete"** (`data-role="confirm-delete-{id}"`): dashboard를 삭제한다.

## Test Assertions
- unauthenticated user는 redirect된다
- page가 expected initial state로 render된다
- delete 성공은 durable state를 변경한다
- delete 실패는 crash 없이 error를 보여준다
````

## 핵심 규칙

### Context

- Context는 public API boundary다.
- user/account/project boundary를 넘는 public function은 scope/current-user struct를 받는다.
- query는 scope와 authorization boundary를 강제해야 한다.
- `{:ok, result}` / `{:error, reason}` tuple을 일관되게 반환한다.

### Repository

- Repository는 data access, query composition, transaction을 담당한다.
- CRUD와 query builder를 분리한다.
- multi-step write는 atomic해야 한다.
- rollback behavior를 테스트한다.

### LiveView

- domain behavior는 LiveView가 아니라 context에 둔다.
- 중요한 interaction에는 안정적인 `data-role` selector를 둔다.
- flash message만 성공 증거로 보지 않는다.
- durable state나 follow-up observable behavior를 검증한다.
- 외부 서비스 오류가 낙관적인 pattern match 때문에 LiveView crash로 이어지면 안 된다.

## QA 철학

나쁜 QA:

```text
성공 flash가 보인다.
```

더 좋은 QA:

```text
action을 수행했다.
durable domain state가 바뀌었다.
DB/state/follow-up 화면에서 변경을 확인했다.
failure case가 graceful하게 처리된다.
```

## 개발

```bash
npm run smoke
npm pack --dry-run
```

## 링크

- npm: https://www.npmjs.com/package/@jidohyun/elixir-harness
- GitHub: https://github.com/jidohyun/elixir-harness

## 라이선스

MIT
