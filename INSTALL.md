# Claude Agents Power 설치 가이드

## 1. npm으로 설치 (권장)

```bash
npm install -g claude-agents-power
```

## 2. 소스에서 빌드 (개발용)

```bash
git clone https://github.com/hongsw/claude-agents-power-mcp-server.git
cd claude-agents-power
npm install
npm run build
```

## 3. MCP 서버 설정

Claude Code 설정 파일에 다음 내용을 추가하세요:

### 설정 파일 위치
`/Users/hongmartin/.config/claude/mcp_servers.json`

### 설정 내용
```json
{
  "mcpServers": {
    "claude-agents-power": {
      "command": "claude-agents-power"
    }
  }
}
```

## 4. 사용 가능한 도구들

- `mcp__claude-agents-power__analyze-project`: 프로젝트 분석 및 에이전트 추천
- `mcp__claude-agents-power__search-agents`: 에이전트 검색
- `mcp__claude-agents-power__list-agents`: 모든 에이전트 목록
- `mcp__claude-agents-power__get-agent-details`: 특정 에이전트 상세 정보
- `mcp__claude-agents-power__install-agents`: 에이전트 설치
- `mcp__claude-agents-power__recommend-by-keywords`: 키워드 기반 에이전트 추천

## 5. 테스트

MCP 서버가 정상적으로 동작하는지 확인:

```bash
# 도움말 확인
node dist/index.js --help

# 서버 실행 (stdio 모드)
node dist/index.js --transport stdio
```

## 6. Context7 패턴 적용 완료

- ✅ CLI 인자 처리 (`commander` 사용)
- ✅ 모듈화된 서버 구조
- ✅ 일관된 에러 처리
- ✅ JSON 응답 형식 통일
- ✅ 실행 권한 자동 설정

## 7. 문제 해결

### Node.js 경로 확인
```bash
which node
# 결과를 mcp_servers.json의 command 필드에 입력
```

### 빌드 파일 확인
```bash
ls -la dist/
# index.js 파일이 실행 권한(x)을 가지고 있는지 확인
```

### 서버 연결 테스트
Claude Code를 재시작한 후 MCP 도구들이 `mcp__claude-agents-power__` 접두사로 나타나는지 확인하세요.