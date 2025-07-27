# 🤖 Pair-Role MCP Server

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)
[![한국어](https://img.shields.io/badge/lang-한국어-red.svg)](README.kr.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.org/)

> 🎯 **개발팀을 위한 스마트 역할 배정** - 프로젝트를 분석하고 모든 회사 부서의 100개 이상 전문 역할에서 완벽한 팀 구성을 추천하는 지능형 MCP 서버입니다.

## 🚀 Claude와 함께 빠른 시작

### 1️⃣ MCP 서버 설치 및 구성

```bash
# 옵션 1: npm을 통한 설치 (출시 후)
npm install -g pair-role-mcp-server

# 옵션 2: 소스에서 클론 및 빌드
git clone https://github.com/yourusername/pair-role-mcp-server.git
cd pair-role-mcp-server && npm install && npm run build
```

**Claude Desktop MCP 설정 구성:**

`claude_desktop_config.json`에 추가:
```json
{
  "mcpServers": {
    "pair-role": {
      "command": "node",
      "args": ["/path/to/pair-role-mcp-server/dist/index.js"]
    }
  }
}
```

### 2️⃣ Claude에서 사용법

Claude를 열고 다음 예시를 시도해보세요:

```
👤 사용자: "mcp pair-role을 이용해서 이 프로젝트를 위한 추천 및 agents/*.md 파일을 다운로드 해줘"

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
git clone https://github.com/yourusername/pair-role-mcp-server.git
cd pair-role-mcp-server

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
    "pair-role": {
      "command": "node",
      "args": ["/path/to/pair-role-mcp-server/dist/index.js"],
      "cwd": "/path/to/your/project",
      "env": {}
    }
  }
}
```

### MCP 도구 참조

```bash
# 현재 프로젝트 분석
mcp__pair-role__analyze-project

# 역할 추천 받기
mcp__pair-role__recommend-by-keywords ["web", "api", "database"]

# 추천 에이전트 설치
mcp__pair-role__install-agents ["frontend-developer", "backend-developer"]
```

## 📋 사용 가능한 역할

### 🔧 기술 및 엔지니어링 (20개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**소프트웨어 엔지니어**](claude/agents/kr/software-engineer.md) | [EN](claude/agents/en/software-engineer.md) | [KO](claude/agents/kr/software-engineer.md) | `Bash, Read, Write, Edit` | 풀스택 개발, 시스템 설계 |
| [**프론트엔드 개발자**](claude/agents/kr/frontend-developer.md) | [EN](claude/agents/en/frontend-developer.md) | [KO](claude/agents/kr/frontend-developer.md) | `Read, Write, Edit, Bash` | React, Vue, Angular, UI/UX |
| [**백엔드 개발자**](claude/agents/kr/backend-engineer.md) | [EN](claude/agents/en/backend-engineer.md) | [KO](claude/agents/kr/backend-engineer.md) | `Bash, Read, Write, Edit` | API, 데이터베이스, 서버 아키텍처 |
| [**DevOps 엔지니어**](claude/agents/kr/devops-engineer.md) | [EN](claude/agents/en/devops-engineer.md) | [KO](claude/agents/kr/devops-engineer.md) | `Bash, Read, Write` | CI/CD, 인프라 자동화 |
| [**데이터 엔지니어**](claude/agents/kr/data-engineer.md) | [EN](claude/agents/en/data-engineer.md) | [KO](claude/agents/kr/data-engineer.md) | `Bash, Read, Write` | ETL 파이프라인, 데이터 아키텍처 |

### 📊 데이터 및 분석 (15개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**데이터 사이언티스트**](claude/agents/kr/data-scientist.md) | [EN](claude/agents/en/data-scientist.md) | [KO](claude/agents/kr/data-scientist.md) | `Bash, Read, Write` | ML 모델링, 통계 분석 |
| [**데이터 분석가**](claude/agents/kr/data-analyst.md) | [EN](claude/agents/en/data-analyst.md) | [KO](claude/agents/kr/data-analyst.md) | `Read, Write, Bash` | 비즈니스 인사이트, 리포팅 |
| [**BI 개발자**](claude/agents/kr/bi-developer.md) | [EN](claude/agents/en/bi-developer.md) | [KO](claude/agents/kr/bi-developer.md) | `Read, Write, Bash` | 대시보드, BI 도구 |
| [**비즈니스 분석가**](claude/agents/kr/business-analyst.md) | [EN](claude/agents/en/business-analyst.md) | [KO](claude/agents/kr/business-analyst.md) | `Read, Write` | 시장 조사, 경쟁 분석 |
| [**리서치 사이언티스트**](claude/agents/kr/research-scientist.md) | [EN](claude/agents/en/research-scientist.md) | [KO](claude/agents/kr/research-scientist.md) | `Read, Write` | 시장 조사, 경쟁 분석 |

### 🎨 제품 및 디자인 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**제품 매니저**](claude/agents/kr/product-manager.md) | [EN](claude/agents/en/product-manager.md) | [KO](claude/agents/kr/product-manager.md) | `Read, Write` | 제품 전략, 로드맵 |
| [**제품 디자이너**](claude/agents/kr/product-designer.md) | [EN](claude/agents/en/product-designer.md) | [KO](claude/agents/kr/product-designer.md) | `Read, Write` | 사용자 경험, 제품 디자인 |
| [**UX 디자이너**](claude/agents/kr/ux-designer.md) | [EN](claude/agents/en/ux-designer.md) | [KO](claude/agents/kr/ux-designer.md) | `Read, Write` | 사용자 리서치, 와이어프레임 |
| [**UI 디자이너**](claude/agents/kr/ui-designer.md) | [EN](claude/agents/en/ui-designer.md) | [KO](claude/agents/kr/ui-designer.md) | `Read, Write` | 비주얼 디자인, 프로토타입 |
| [**그래픽 디자이너**](claude/agents/kr/graphic-designer.md) | [EN](claude/agents/en/graphic-designer.md) | [KO](claude/agents/kr/graphic-designer.md) | `Read, Write` | 브랜드 아이덴티티, 비주얼 에셋 |

### 📈 마케팅 및 영업 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**마케팅 매니저**](claude/agents/kr/marketing-analyst.md) | [EN](claude/agents/en/marketing-analyst.md) | [KO](claude/agents/kr/marketing-analyst.md) | `Read, Write` | 마케팅 전략, 캠페인 |
| [**영업 매니저**](claude/agents/kr/sales-manager.md) | [EN](claude/agents/en/sales-manager.md) | [KO](claude/agents/kr/sales-manager.md) | `Read, Write` | 영업 전략, 팀 관리 |
| [**디지털 마케터**](claude/agents/kr/digital-marketer.md) | [EN](claude/agents/en/digital-marketer.md) | [KO](claude/agents/kr/digital-marketer.md) | `Read, Write` | 온라인 광고, SEO/SEM |
| [**콘텐츠 크리에이터**](claude/agents/kr/content-creator.md) | [EN](claude/agents/en/content-creator.md) | [KO](claude/agents/kr/content-creator.md) | `Read, Write` | 콘텐츠 전략, 제작 |
| [**소셜미디어 매니저**](claude/agents/kr/social-media-manager.md) | [EN](claude/agents/en/social-media-manager.md) | [KO](claude/agents/kr/social-media-manager.md) | `Read, Write` | 소셜미디어 전략, 커뮤니티 |

### ⚙️ 운영 및 관리 (15개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**운영 매니저**](claude/agents/kr/operations-manager.md) | [EN](claude/agents/en/operations-manager.md) | [KO](claude/agents/kr/operations-manager.md) | `Read, Write, Bash` | 프로세스 최적화, 효율성 |
| [**프로젝트 매니저**](claude/agents/kr/project-manager.md) | [EN](claude/agents/en/project-manager.md) | [KO](claude/agents/kr/project-manager.md) | `Read, Write` | 프로젝트 계획, 조정 |
| [**프로그램 매니저**](claude/agents/kr/technical-pm.md) | [EN](claude/agents/en/technical-pm.md) | [KO](claude/agents/kr/technical-pm.md) | `Read, Write` | 다중 프로젝트 조정 |
| [**공급망 매니저**](claude/agents/kr/supply-chain-manager.md) | [EN](claude/agents/en/supply-chain-manager.md) | [KO](claude/agents/kr/supply-chain-manager.md) | `Read, Write` | 공급망 최적화 |
| [**품질 보증 매니저**](claude/agents/kr/qa-engineer.md) | [EN](claude/agents/en/qa-engineer.md) | [KO](claude/agents/kr/qa-engineer.md) | `Read, Write, Bash` | 품질 프로세스, 개선 |

### 💰 재무 및 회계 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**최고재무책임자**](claude/agents/kr/accountant.md) | [EN](claude/agents/en/accountant.md) | [KO](claude/agents/kr/accountant.md) | `Read, Write` | 재무 전략, 기업 재무 |
| [**재무 컨트롤러**](claude/agents/kr/controller.md) | [EN](claude/agents/en/controller.md) | [KO](claude/agents/kr/controller.md) | `Read, Write` | 재무 통제, 보고 |
| [**회계 매니저**](claude/agents/kr/accountant.md) | [EN](claude/agents/en/accountant.md) | [KO](claude/agents/kr/accountant.md) | `Read, Write` | 회계 운영 |
| [**자금 매니저**](claude/agents/kr/treasury-manager.md) | [EN](claude/agents/en/treasury-manager.md) | [KO](claude/agents/kr/treasury-manager.md) | `Read, Write` | 현금 관리, 자금 |
| [**재무 분석가**](claude/agents/kr/financial-analyst.md) | [EN](claude/agents/en/financial-analyst.md) | [KO](claude/agents/kr/financial-analyst.md) | `Read, Write` | 세금 전략, 컴플라이언스 |

### 👥 인사 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**HR 매니저**](claude/agents/kr/hr-manager.md) | [EN](claude/agents/en/hr-manager.md) | [KO](claude/agents/kr/hr-manager.md) | `Read, Write` | HR 전략, 인사 관리 |
| [**인재 확보 전문가**](claude/agents/kr/talent-acquisition.md) | [EN](claude/agents/en/talent-acquisition.md) | [KO](claude/agents/kr/talent-acquisition.md) | `Read, Write` | 채용, 인재 소싱 |
| [**HR 비즈니스 파트너**](claude/agents/kr/learning-development.md) | [EN](claude/agents/en/learning-development.md) | [KO](claude/agents/kr/learning-development.md) | `Read, Write` | 전략적 HR, 비즈니스 정렬 |
| [**보상 및 복리후생 매니저**](claude/agents/kr/compensation-benefits.md) | [EN](claude/agents/en/compensation-benefits.md) | [KO](claude/agents/kr/compensation-benefits.md) | `Read, Write` | 보상 설계, 복리후생 |
| [**학습 및 개발 매니저**](claude/agents/kr/learning-development.md) | [EN](claude/agents/en/learning-development.md) | [KO](claude/agents/kr/learning-development.md) | `Read, Write` | 교육 프로그램, 개발 |

### 🏢 임원 및 리더십 (10개 역할)

| 역할 | English | 한국어 | 도구 | 전문 분야 |
|------|---------|--------|-------|------------|
| [**최고경영자**](claude/agents/kr/executive-assistant.md) | [EN](claude/agents/en/executive-assistant.md) | [KO](claude/agents/kr/executive-assistant.md) | `Read, Write` | 기업 전략, 리더십 |
| [**최고운영책임자**](claude/agents/kr/operations-manager.md) | [EN](claude/agents/en/operations-manager.md) | [KO](claude/agents/kr/operations-manager.md) | `Read, Write, Bash` | 운영, 실행 |
| [**최고기술책임자**](claude/agents/kr/cloud-architect.md) | [EN](claude/agents/en/cloud-architect.md) | [KO](claude/agents/kr/cloud-architect.md) | `Read, Write, Edit, Bash` | 기술 전략, 혁신 |
| [**최고마케팅책임자**](claude/agents/kr/brand-manager.md) | [EN](claude/agents/en/brand-manager.md) | [KO](claude/agents/kr/brand-manager.md) | `Read, Write` | 마케팅 전략, 브랜드 |
| [**최고제품책임자**](claude/agents/kr/product-manager.md) | [EN](claude/agents/en/product-manager.md) | [KO](claude/agents/kr/product-manager.md) | `Read, Write` | 제품 전략, 혁신 |

## 🎯 사용 예시

### 📊 다운로드 통계
```bash
# 인기 에이전트 다운로드 통계 가져오기
mcp__pair-role__get-download-stats

# GitHub 저장소에서 에이전트 새로고침
mcp__pair-role__refresh-agents
```

### 🚀 스타트업 MVP 개발
```bash
# 프로젝트 분석 및 추천 받기
mcp__pair-role__analyze-project

# 핵심 스타트업 팀 설치
mcp__pair-role__install-agents [
  "product-manager",
  "frontend-developer", 
  "backend-developer",
  "growth-hacker"
]
```

### 🏢 엔터프라이즈 애플리케이션
```bash
# 엔터프라이즈 프로젝트에 대한 추천 받기
mcp__pair-role__recommend-by-keywords [
  "enterprise", "security", "scalability", "compliance"
]

# 엔터프라이즈 팀 설치
mcp__pair-role__install-agents [
  "cloud-architect",
  "security-engineer",
  "devops-engineer",
  "compliance-officer"
]
```

### 📊 데이터 플랫폼
```bash
# 데이터 관련 역할 검색
mcp__pair-role__search-agents "data analytics machine learning"

# 데이터 팀 설치
mcp__pair-role__install-agents [
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
pair-role-mcp-server/
├── src/                    # TypeScript 소스 코드
├── claude/agents/         # 에이전트 정의
│   ├── en/               # 영어 에이전트
│   └── kr/               # 한국어 에이전트
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

[🐛 버그 신고](https://github.com/yourusername/pair-role-mcp-server/issues) • [✨ 기능 요청](https://github.com/yourusername/pair-role-mcp-server/issues) • [📖 문서](docs/)

Claude Code 커뮤니티를 위해 ❤️로 제작되었습니다

</div>