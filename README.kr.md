# 🤖 Claude Agents Power

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)
[![한국어](https://img.shields.io/badge/lang-한국어-red.svg)](README.kr.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.org/)

> 🎯 **개발팀을 위한 스마트 역할 배정** - 프로젝트를 분석하고 모든 회사 부서의 100개 이상 전문 역할에서 완벽한 팀 구성을 추천하는 지능형 MCP 서버입니다.

## 🚀 Claude와 함께 빠른 시작

### 1️⃣ MCP 서버 설치 및 구성

```bash
# npm을 통한 설치
npm install -g claude-agents-power

# Claude Desktop 자동 구성 (NEW! 🎉)
claude-agents-power --install
```

**또는 수동으로 Claude Desktop 구성:**

`claude_desktop_config.json`에 추가:
```json
{
  "mcpServers": {
    "claude-agents-power": {
      "command": "npx",
      "args": ["claude-agents-power"]
    }
  }
}
```

### 2️⃣ Claude에서 사용법

Claude를 열고 다음 예시를 시도해보세요:

```
👤 사용자: "claude-agents-power를 이용해서 이 프로젝트를 위한 추천 및 agents/*.md 파일을 다운로드 해줘"

🤖 Claude: 프로젝트를 분석하고 추천 에이전트를 다운로드해드리겠습니다.

[MCP 도구 사용:]
1. 📊 프로젝트 구조 분석
2. 🎯 적합한 역할 추천
3. 📁 에이전트를 ./claude/agents/에 다운로드
4. ✅ 프로젝트에서 사용할 서브 에이전트 준비 완료!
```

### 3️⃣ 설치 확인

에이전트가 다운로드되었는지 확인:
```bash
ls ./claude/agents/
# 추천 역할에 대한 .md 파일들이 보여야 합니다
```

### 4️⃣ 서브 에이전트 사용 시작

이제 Claude에서 전문 역할을 사용할 수 있습니다:
```
"frontend-developer를 사용해서 React 컴포넌트를 만들어줘"
"data-scientist로 이 데이터를 분석해줘"
"devops-engineer가 CI/CD 파이프라인을 설정해줘"
```

---

## 📖 목차

- [🌟 기능](#-기능)
- [🚀 빠른 시작](#-빠른-시작)
- [📋 사용 가능한 역할](#-사용-가능한-역할)
- [🎯 사용 예시](#-사용-예시)
- [📚 문서](#-문서)
- [🛠️ 개발](#-개발)
- [🤝 기여하기](#-기여하기)
- [📄 라이선스](#-라이선스)

## 🌟 기능

### 🔍 **지능형 프로젝트 분석**
- 프로젝트 유형, 프레임워크, 복잡도를 자동 감지
- 기술 스택을 기반으로 스마트한 역할 추천 제공
- 다중 언어 프로젝트 및 다양한 아키텍처 지원

### 👥 **100개 이상의 전문 역할**
- **기술 및 엔지니어링** (20개 역할): 프론트엔드, 백엔드, DevOps, 보안, AI/ML
- **데이터 및 분석** (15개 역할): 데이터 사이언티스트, 분석가, 엔지니어
- **제품 및 디자인** (10개 역할): PM, UX/UI 디자이너, 연구원
- **마케팅 및 영업** (10개 역할): 디지털 마케팅, 성장, 콘텐츠
- **운영 및 관리** (15개 역할): 프로젝트 매니저, 운영
- **재무 및 회계** (10개 역할): CFO, 컨트롤러, 분석가
- **인사** (10개 역할): 인재 확보, L&D, 문화
- **임원 및 리더십** (10개 역할): C-Level 임원 및 전략

### 🌐 **다중 언어 지원**
- **English**: 글로벌 표준 및 국제 프로젝트
- **한국어**: 한국 비즈니스 맥락 및 현지 관행

### ⚡ **Claude Code 통합**
- MCP 프로토콜을 통한 Claude Code와의 원활한 통합
- 실시간 역할 추천 및 팀 구성
- 프로젝트에 원클릭 에이전트 설치

### 🌐 **GitHub 통합**
- [baryonlabs/claude-sub-agent-contents](https://github.com/baryonlabs/claude-sub-agent-contents)에서 자동 에이전트 다운로드
- 다운로드 추적 및 사용 분석
- 다운로드된 에이전트의 오프라인 캐싱
- `./claude/agents/` 디렉토리 구조에 설치
- 에이전트 템플릿을 처음부터 만들 필요 없음

## 🚀 개발 설정

### 소스에서 빌드

```bash
# 저장소 클론
git clone https://github.com/hongsw/claude-agents-power-mcp-server.git
cd claude-agents-power

# 종속성 설치
npm install

# 프로젝트 빌드
npm run build
```

### 개발용 MCP 구성

`~/.config/claude/mcp_servers.json`에 추가:

```json
{
  "mcpServers": {
    "claude-agents-power": {
      "command": "node",
      "args": ["/path/to/claude-agents-power/dist/index.js"],
      "cwd": "/path/to/your/project",
      "env": {
        "GITHUB_TOKEN": "your_github_token_here",
        "POSTHOG_API_KEY": "your_posthog_api_key_here"
      }
    }
  }
}
```

### 환경 변수

향상된 기능을 위한 선택적 환경 변수 설정:

#### 방법 1: .env 파일 사용 (로컬 개발 권장)

1. 예제 환경 파일 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일을 편집하여 값 추가:
   ```bash
   # GitHub 개인 액세스 토큰
   GITHUB_TOKEN=ghp_실제_토큰_입력
   
   # PostHog API 키
   POSTHOG_API_KEY=phc_실제_키_입력
   ```

#### 방법 2: MCP 설정 사용

위에 표시된 대로 MCP 서버 구성에 환경 변수를 직접 추가합니다.

#### 사용 가능한 변수

- **`GITHUB_TOKEN`**: 에이전트를 찾을 수 없을 때 자동 이슈 생성을 위한 GitHub 개인 액세스 토큰
  - 생성 위치: https://github.com/settings/tokens
  - 필요한 권한: `public_repo` 또는 `repo` (비공개 저장소의 경우)
  
- **`POSTHOG_API_KEY`**: 익명 사용량 분석을 위한 PostHog API 키
  - 사용 패턴을 이해하여 도구를 개선하는 데 도움
  - 개인 데이터는 수집하지 않으며, 도구 사용 메트릭만 수집
  - 키 받기: https://app.posthog.com/project/settings
  
- **`POSTHOG_HOST`**: PostHog 인스턴스 URL (기본값: https://app.posthog.com)
  - 자체 호스팅 PostHog 인스턴스를 사용하는 경우에만 필요

### MCP 도구 참조

```bash
# 현재 프로젝트 분석
mcp__claude-agents-power__analyze-project

# 역할 추천 받기
mcp__claude-agents-power__recommend-by-keywords ["web", "api", "database"]

# 추천 에이전트 설치
mcp__claude-agents-power__install-agents ["frontend-developer", "backend-developer"]
```

## 📋 사용 가능한 역할

### 🔧 기술 및 엔지니어링 (20개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**소프트웨어 엔지니어**](claude/agents/ko/software-engineer.md) | [EN](claude/agents/en/software-engineer.md) | [KO](claude/agents/ko/software-engineer.md) | `Bash, Read, Write, Edit` | 풀스택 개발, 시스템 설계 |
| [**프론트엔드 개발자**](claude/agents/ko/frontend-developer.md) | [EN](claude/agents/en/frontend-developer.md) | [KO](claude/agents/ko/frontend-developer.md) | `Read, Write, Edit, Bash` | React, Vue, Angular, UI/UX |
| [**백엔드 개발자**](claude/agents/ko/backend-engineer.md) | [EN](claude/agents/en/backend-engineer.md) | [KO](claude/agents/ko/backend-engineer.md) | `Bash, Read, Write, Edit` | API, 데이터베이스, 서버 아키텍처 |
| [**DevOps 엔지니어**](claude/agents/ko/devops-engineer.md) | [EN](claude/agents/en/devops-engineer.md) | [KO](claude/agents/ko/devops-engineer.md) | `Bash, Read, Write` | CI/CD, 인프라 자동화 |
| [**데이터 엔지니어**](claude/agents/ko/data-engineer.md) | [EN](claude/agents/en/data-engineer.md) | [KO](claude/agents/ko/data-engineer.md) | `Bash, Read, Write` | ETL 파이프라인, 데이터 아키텍처 |

### 📊 데이터 및 분석 (15개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**데이터 사이언티스트**](claude/agents/ko/data-scientist.md) | [EN](claude/agents/en/data-scientist.md) | [KO](claude/agents/ko/data-scientist.md) | `Bash, Read, Write` | ML 모델링, 통계 분석 |
| [**데이터 분석가**](claude/agents/ko/data-analyst.md) | [EN](claude/agents/en/data-analyst.md) | [KO](claude/agents/ko/data-analyst.md) | `Read, Write, Bash` | 비즈니스 인사이트, 리포팅 |
| [**BI 개발자**](claude/agents/ko/bi-developer.md) | [EN](claude/agents/en/bi-developer.md) | [KO](claude/agents/ko/bi-developer.md) | `Read, Write, Bash` | 대시보드, BI 도구 |
| [**비즈니스 분석가**](claude/agents/ko/business-analyst.md) | [EN](claude/agents/en/business-analyst.md) | [KO](claude/agents/ko/business-analyst.md) | `Read, Write` | 시장 조사, 경쟁 분석 |
| [**리서치 사이언티스트**](claude/agents/ko/research-scientist.md) | [EN](claude/agents/en/research-scientist.md) | [KO](claude/agents/ko/research-scientist.md) | `Read, Write` | 시장 조사, 경쟁 분석 |

### 🎨 제품 및 디자인 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**제품 매니저**](claude/agents/ko/product-manager.md) | [EN](claude/agents/en/product-manager.md) | [KO](claude/agents/ko/product-manager.md) | `Read, Write` | 제품 전략, 로드맵 |
| [**제품 디자이너**](claude/agents/ko/product-designer.md) | [EN](claude/agents/en/product-designer.md) | [KO](claude/agents/ko/product-designer.md) | `Read, Write` | 사용자 경험, 제품 디자인 |
| [**UX 디자이너**](claude/agents/ko/ux-designer.md) | [EN](claude/agents/en/ux-designer.md) | [KO](claude/agents/ko/ux-designer.md) | `Read, Write` | 사용자 리서치, 와이어프레임 |
| [**UI 디자이너**](claude/agents/ko/ui-designer.md) | [EN](claude/agents/en/ui-designer.md) | [KO](claude/agents/ko/ui-designer.md) | `Read, Write` | 비주얼 디자인, 프로토타입 |
| [**그래픽 디자이너**](claude/agents/ko/graphic-designer.md) | [EN](claude/agents/en/graphic-designer.md) | [KO](claude/agents/ko/graphic-designer.md) | `Read, Write` | 브랜드 아이덴티티, 비주얼 에셋 |

### 📈 마케팅 및 영업 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**마케팅 매니저**](claude/agents/ko/marketing-analyst.md) | [EN](claude/agents/en/marketing-analyst.md) | [KO](claude/agents/ko/marketing-analyst.md) | `Read, Write` | 마케팅 전략, 캠페인 |
| [**영업 매니저**](claude/agents/ko/sales-manager.md) | [EN](claude/agents/en/sales-manager.md) | [KO](claude/agents/ko/sales-manager.md) | `Read, Write` | 영업 전략, 팀 관리 |
| [**디지털 마케터**](claude/agents/ko/digital-marketer.md) | [EN](claude/agents/en/digital-marketer.md) | [KO](claude/agents/ko/digital-marketer.md) | `Read, Write` | 온라인 광고, SEO/SEM |
| [**콘텐츠 크리에이터**](claude/agents/ko/content-creator.md) | [EN](claude/agents/en/content-creator.md) | [KO](claude/agents/ko/content-creator.md) | `Read, Write` | 콘텐츠 전략, 제작 |
| [**소셜미디어 매니저**](claude/agents/ko/social-media-manager.md) | [EN](claude/agents/en/social-media-manager.md) | [KO](claude/agents/ko/social-media-manager.md) | `Read, Write` | 소셜미디어 전략, 커뮤니티 |

### ⚙️ 운영 및 관리 (15개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**운영 매니저**](claude/agents/ko/operations-manager.md) | [EN](claude/agents/en/operations-manager.md) | [KO](claude/agents/ko/operations-manager.md) | `Read, Write, Bash` | 프로세스 최적화, 효율성 |
| [**프로젝트 매니저**](claude/agents/ko/project-manager.md) | [EN](claude/agents/en/project-manager.md) | [KO](claude/agents/ko/project-manager.md) | `Read, Write` | 프로젝트 계획, 조정 |
| [**프로그램 매니저**](claude/agents/ko/technical-pm.md) | [EN](claude/agents/en/technical-pm.md) | [KO](claude/agents/ko/technical-pm.md) | `Read, Write` | 다중 프로젝트 조정 |
| [**공급망 매니저**](claude/agents/ko/supply-chain-manager.md) | [EN](claude/agents/en/supply-chain-manager.md) | [KO](claude/agents/ko/supply-chain-manager.md) | `Read, Write` | 공급망 최적화 |
| [**품질 보증 매니저**](claude/agents/ko/qa-engineer.md) | [EN](claude/agents/en/qa-engineer.md) | [KO](claude/agents/ko/qa-engineer.md) | `Read, Write, Bash` | 품질 프로세스, 개선 |

### 💰 재무 및 회계 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**최고재무책임자**](claude/agents/ko/accountant.md) | [EN](claude/agents/en/accountant.md) | [KO](claude/agents/ko/accountant.md) | `Read, Write` | 재무 전략, 기업 재무 |
| [**재무 컨트롤러**](claude/agents/ko/controller.md) | [EN](claude/agents/en/controller.md) | [KO](claude/agents/ko/controller.md) | `Read, Write` | 재무 통제, 보고 |
| [**회계 매니저**](claude/agents/ko/accountant.md) | [EN](claude/agents/en/accountant.md) | [KO](claude/agents/ko/accountant.md) | `Read, Write` | 회계 운영 |
| [**자금 매니저**](claude/agents/ko/treasury-manager.md) | [EN](claude/agents/en/treasury-manager.md) | [KO](claude/agents/ko/treasury-manager.md) | `Read, Write` | 현금 관리, 자금 |
| [**재무 분석가**](claude/agents/ko/financial-analyst.md) | [EN](claude/agents/en/financial-analyst.md) | [KO](claude/agents/ko/financial-analyst.md) | `Read, Write` | 세금 전략, 컴플라이언스 |

### 👥 인사 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**HR 매니저**](claude/agents/ko/hr-manager.md) | [EN](claude/agents/en/hr-manager.md) | [KO](claude/agents/ko/hr-manager.md) | `Read, Write` | HR 전략, 인사 관리 |
| [**인재 확보 전문가**](claude/agents/ko/talent-acquisition.md) | [EN](claude/agents/en/talent-acquisition.md) | [KO](claude/agents/ko/talent-acquisition.md) | `Read, Write` | 채용, 인재 소싱 |
| [**HR 비즈니스 파트너**](claude/agents/ko/learning-development.md) | [EN](claude/agents/en/learning-development.md) | [KO](claude/agents/ko/learning-development.md) | `Read, Write` | 전략적 HR, 비즈니스 정렬 |
| [**보상 및 복리후생 매니저**](claude/agents/ko/compensation-benefits.md) | [EN](claude/agents/en/compensation-benefits.md) | [KO](claude/agents/ko/compensation-benefits.md) | `Read, Write` | 보상 설계, 복리후생 |
| [**학습 및 개발 매니저**](claude/agents/ko/learning-development.md) | [EN](claude/agents/en/learning-development.md) | [KO](claude/agents/ko/learning-development.md) | `Read, Write` | 교육 프로그램, 개발 |

### 🏢 임원 및 리더십 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**최고경영자**](claude/agents/ko/executive-assistant.md) | [EN](claude/agents/en/executive-assistant.md) | [KO](claude/agents/ko/executive-assistant.md) | `Read, Write` | 기업 전략, 리더십 |
| [**최고운영책임자**](claude/agents/ko/operations-manager.md) | [EN](claude/agents/en/operations-manager.md) | [KO](claude/agents/ko/operations-manager.md) | `Read, Write, Bash` | 운영, 실행 |
| [**최고기술책임자**](claude/agents/ko/cloud-architect.md) | [EN](claude/agents/en/cloud-architect.md) | [KO](claude/agents/ko/cloud-architect.md) | `Read, Write, Edit, Bash` | 기술 전략, 혁신 |
| [**최고마케팅책임자**](claude/agents/ko/brand-manager.md) | [EN](claude/agents/en/brand-manager.md) | [KO](claude/agents/ko/brand-manager.md) | `Read, Write` | 마케팅 전략, 브랜드 |
| [**최고제품책임자**](claude/agents/ko/product-manager.md) | [EN](claude/agents/en/product-manager.md) | [KO](claude/agents/ko/product-manager.md) | `Read, Write` | 제품 전략, 혁신 |

## 🎯 사용 예시

### 📊 다운로드 통계
```bash
# 인기 에이전트 다운로드 통계 가져오기
mcp__claude-agents-power__get-download-stats

# GitHub 저장소에서 에이전트 새로고침
mcp__claude-agents-power__refresh-agents
```

### 🚀 스타트업 MVP 개발
```bash
# 프로젝트 분석 및 추천 받기
mcp__claude-agents-power__analyze-project

# 핵심 스타트업 팀 설치
mcp__claude-agents-power__install-agents [
  "product-manager",
  "frontend-developer", 
  "backend-developer",
  "growth-hacker"
]
```

### 🏢 엔터프라이즈 애플리케이션
```bash
# 엔터프라이즈 프로젝트에 대한 추천 받기
mcp__claude-agents-power__recommend-by-keywords [
  "enterprise", "security", "scalability", "compliance"
]

# 엔터프라이즈 팀 설치
mcp__claude-agents-power__install-agents [
  "cloud-architect",
  "security-engineer",
  "devops-engineer",
  "compliance-officer"
]
```

### 📊 데이터 플랫폼
```bash
# 데이터 관련 역할 검색
mcp__claude-agents-power__search-agents "data analytics machine learning"

# 데이터 팀 설치
mcp__claude-agents-power__install-agents [
  "data-scientist",
  "data-engineer", 
  "machine-learning-engineer",
  "bi-developer"
]
```

## 📚 문서

### 📖 사용자 가이드
- [**사용자 가이드**](USER_GUIDE.md) - 모범 사례가 포함된 완전한 사용 가이드
- [**예시**](EXAMPLES.md) - 실제 시나리오 및 사용 사례
- [**문제 해결**](TROUBLESHOOTING.md) - 일반적인 문제 및 해결 방법

### 🔧 기술 문서
- [**설치 가이드**](INSTALL.md) - 단계별 설정 지침

## 🛠️ 개발

### 필수 요구사항
- Node.js 16+
- TypeScript 5+
- MCP를 지원하는 Claude Code

### 소스에서 빌드
```bash
git clone https://github.com/yourusername/pair-role-mcp-server.git
cd pair-role-mcp-server
npm install
npm run build
npm test
```

### 프로젝트 구조
```
claude-agents-power/
├── src/                    # TypeScript 소스 코드
├── claude/agents/         # 에이전트 정의
│   ├── en/               # 영어 에이전트 (85개 역할)
│   ├── ko/               # 한국어 에이전트 (85개 역할)
│   ├── ja/               # 일본어 에이전트 (5개 역할)
│   └── zh/               # 중국어 에이전트 (8개 역할)
├── sub-agents/            # 레거시 에이전트 정의 (deprecated)
├── dist/                 # 컴파일된 JavaScript
├── docs/                 # 문서
└── examples/             # 사용 예시
```

## 🤝 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조하세요.

### 🌟 기여 방법
1. **새 역할 추가** - 전문 직위에 대한 에이전트 생성
2. **번역 개선** - 한국어/영어 현지화 향상
3. **프로젝트 템플릿 추가** - 산업별 템플릿 기여
4. **문서** - 가이드 및 예시 개선

## 🔍 필요한 에이전트를 찾을 수 없나요?

원하는 특정 에이전트 역할을 찾을 수 없다면, 다음과 같이 요청하거나 직접 만들 수 있습니다:

### 📋 새 에이전트 요청하기

1. **먼저 기존 에이전트 확인**
   ```bash
   # MCP를 사용하여 에이전트 검색
   claude-agents-power agents --action search --query "역할명"
   ```

2. **자동 Issue 생성 (NEW! 🎉)**
   ```bash
   # 검색 결과가 0개일 때 자동으로 GitHub Issue 생성
   # GITHUB_TOKEN 환경 변수 필요
   export GITHUB_TOKEN=your_github_token
   
   # 에이전트 검색 시 자동 이슈 생성 활성화
   claude-agents-power agents --action search --query "blockchain-architect" --autoCreateIssue true
   
   # 또는 직접 Issue 생성
   claude-agents-power agents --action request --name "blockchain-architect" --description "블록체인 시스템 설계 전문가"
   ```

3. **수동 Issue 제출**
   - [GitHub Issues](https://github.com/hongsw/claude-agents-power-mcp-server/issues)로 이동
   - "New Issue" 클릭
   - 제목 형식: `[Agent Request] 역할명 - 간단한 설명`
   - 포함 내용:
     - 역할명 (예: `blockchain-architect`)
     - 책임 설명
     - 필요한 도구
     - 사용 사례

### 🛠️ 직접 에이전트 만들기

#### 에이전트 파일 형식

`claude/agents/{언어}/` 디렉토리에 새 `.md` 파일을 만드세요:

```markdown
---
name: your-agent-name
description: 에이전트의 전문성과 책임에 대한 간단한 설명
tools: Read, Write, Edit, Bash, WebSearch
---

당신은 [도메인/전문 분야]를 전문으로 하는 [역할 제목]입니다.

## 핵심 책임
- 주요 책임 1
- 주요 책임 2
- 주요 책임 3

## 주요 실천 사항
- 모범 사례 또는 방법론 1
- 모범 사례 또는 방법론 2
- 모범 사례 또는 방법론 3

## 도구 및 기술
- 사용하는 특정 도구 또는 프레임워크
- 전문 기술
- 작업하는 플랫폼

## 품질 기준
- 품질 지표 또는 표준 1
- 품질 지표 또는 표준 2
- 성능 기대치
```

#### 사용 가능한 도구

에이전트에 적합한 도구를 선택하세요:
- **Read, Write, Edit, MultiEdit** - 파일 작업
- **Bash, Grep, Glob** - 시스템 작업
- **WebSearch, WebFetch** - 인터넷 접근
- **TodoWrite, Task** - 작업 관리
- **NotebookRead, NotebookEdit** - Jupyter 노트북 지원

#### 예시: 블록체인 아키텍트 에이전트 만들기

`claude/agents/ko/blockchain-architect.md`:
```markdown
---
name: blockchain-architect
description: 확장 가능한 DLT 솔루션과 스마트 컨트랙트 아키텍처를 설계하는 블록체인 시스템 아키텍트
tools: Read, Write, Edit, Bash, WebSearch
---

당신은 분산원장 기술과 탈중앙화 시스템을 전문으로 하는 블록체인 아키텍트입니다.

## 핵심 책임
- 블록체인 네트워크 아키텍처 설계
- 스마트 컨트랙트 시스템 개발
- 합의 메커니즘 구현
- 보안성과 확장성 보장

## 주요 실천 사항
- 보안 우선 설계 원칙 준수
- 가스 효율성 최적화
- 적절한 접근 제어 구현
- 업그레이드 가능한 컨트랙트 설계
- 크로스체인 호환성 보장

## 도구 및 기술
- 이더리움, 폴리곤, 솔라나
- Solidity, Rust, Move
- Web3.js, Ethers.js
- Hardhat, Truffle, Foundry
- IPFS, The Graph

## 품질 기준
- 스마트 컨트랙트 100% 테스트 커버리지
- 가스 최적화 벤치마크
- 보안 감사 준수
- 필요시 형식 검증
```

### 📤 에이전트 제출하기

1. **저장소 포크**
   ```bash
   git clone https://github.com/hongsw/claude-agents-power-mcp-server.git
   cd claude-agents-power-mcp-server
   ```

2. **에이전트 파일 생성**
   ```bash
   # 영어 에이전트
   touch claude/agents/en/your-agent-name.md
   
   # 한국어 에이전트
   touch claude/agents/ko/your-agent-name.md
   ```

3. **Pull Request 제출**
   - 변경사항 커밋
   - 포크에 푸시
   - 설명과 함께 PR 생성
   - 검토 후 병합됩니다!

### 💡 에이전트 생성 팁

1. **구체적으로 작성**: 역할의 전문성과 경계를 명확히 정의
2. **도구를 현명하게 선택**: 에이전트가 실제로 필요한 도구만 포함
3. **예시 포함**: 구체적인 방법론이나 프레임워크 추가
4. **현지화 고려**: 여러 언어로 번역 제공
5. **에이전트 테스트**: 실제 작업에서 잘 작동하는지 확인

### 🚀 로드맵
- [x] 에이전트 템플릿을 위한 GitHub 통합
- [x] 다운로드 추적 및 분석
- [ ] 시각적 프로젝트 분석기 대시보드
- [ ] 역할 종속성 추천
- [ ] 산업별 역할 번들
- [ ] 인기 프로젝트 관리 도구와의 통합
- [ ] 고급 팀 구성 알고리즘

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">

**⭐ 이 저장소가 유용하다면 별표를 눌러주세요!**

[🐛 버그 신고](https://github.com/hongsw/claude-agents-power-mcp-server/issues) • [✨ 기능 요청](https://github.com/hongsw/claude-agents-power-mcp-server/issues) • [📖 문서](docs/)

Claude Code 커뮤니티를 위해 ❤️로 제작되었습니다

</div>