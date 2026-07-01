# drawDB 项目 Agent 规则

本文件是 `/Users/lynn/SynologyDrive/SynologyDrive/Code/drawDB` 的项目级规则。进入本仓库工作的 Codex / Agent 必须先阅读本文件，再执行任何代码、文档、自动化或 git 操作。

## 1. 项目身份

- 本仓库是 Lynn Lee 的 drawDB 独立重构项目。
- 唯一远端仓库是 `origin = https://github.com/Lynn-Lee/drawDB.git`。
- 不再跟踪任何外部仓库历史，不允许新增额外 remote。
- 当前主线分支是 `main`。
- 后续重构是在当前代码基础上渐进式改造，不做整体推倒重写。

## 2. 沟通与文档语言

- 与用户沟通默认使用中文。
- 新增项目文档默认使用中文文件名和中文正文。
- 专业术语可保留英文，例如 React、Vite、IndexedDB、Dexie、SQL、DBML、JSON、Domain Model、Vitest、Playwright、Docker。
- 改变产品范围、架构边界、验证命令、运行方式、依赖或安全策略时，必须同步更新相关文档。

## 3. 产品边界

- drawDB 的核心定位是“隐私优先、无需账号、可离线使用的数据库结构设计与 SQL 生成工具”。
- 本地无账号模式必须始终可用。
- 分享必须是用户显式触发的网络动作，不能自动上传图表数据。
- 账号登录、团队空间、云端同步属于 Phase 5 可选增强能力，除非用户明确调整优先级。
- SQL、DBML、JSON、DDB、分享链接和模板数据都按非可信输入处理。

## 4. 研发计划来源

后续研发必须以以下文档为准：

- `docs/drawDB-重构优化产品研发方案.md`
- `docs/superpowers/plans/2026-07-01-drawDB-重构总控工程实施计划.md`
- `docs/superpowers/plans/2026-07-01-drawDB-Phase-0-安全与工程底座实施计划.md`
- `docs/engineering/验证矩阵.md`
- `SECURITY.md`

每个 Phase 开工前，必须在 `docs/superpowers/plans/` 下生成对应中文阶段实施计划。没有阶段实施计划时，不要直接改源码。

## 5. 当前阶段

当前处于 Phase 0：安全与工程底座。

已完成：

- Phase 0.1：`SECURITY.md` 与 `docs/engineering/验证矩阵.md`。

下一项：

- Phase 0.2：建立 Vitest、Testing Library、jsdom 测试基线。

Phase 0 未完成前，不进入 Phase 1。

## 6. 代码修改规则

- 修改前先检查 `git status --short --branch`、`git remote -v` 和相关文件。
- 只处理当前任务相关文件，不做无关重构、无关格式化或依赖 churn。
- 手工编辑优先使用 `apply_patch`。
- 涉及行为改动必须优先补测试；测试基础设施建立后，按 TDD 推进。
- 不提交 `node_modules/`、`dist/`、本地缓存、日志或真实 `.env`。
- 不把密钥、Token、License、真实连接串、个人凭据写入代码、文档、提交信息或日志。

## 7. 验证门禁

当前固定门禁：

```bash
npm run lint
npm run build
npm audit --audit-level=high
git diff --check
```

当 `test` 脚本建立后，涉及代码行为的任务必须额外运行：

```bash
npm run test
```

当 `e2e` 脚本建立后，涉及浏览器流程的任务必须额外运行：

```bash
npm run e2e
```

已知但不阻断 Phase 0.1 的问题：

- `npm run build` 会提示 `lottie-web` direct eval。
- `npm run build` 会提示主 chunk 过大。
- `npm audit --audit-level=high` 当前通过，但仍有 `ajv` 和 `brace-expansion` 两个 moderate 告警。

这些问题已记录在 `docs/engineering/验证矩阵.md`，后续按计划治理。

## 8. Git 与远端规则

- 本仓库只允许一个 remote：`origin = https://github.com/Lynn-Lee/drawDB.git`。
- 如果发现任何额外 remote，必须先停止并询问或按用户要求清理。
- 正常研发任务完成后需要提交到 `main` 并推送到 `origin/main`。
- 推送后必须核对本地 `HEAD`、本地 `origin/main`、远端 `refs/heads/main` 三者 SHA 一致。
- 不自动开 PR。
- 不自动部署。
- 不自动创建 release。
- 不使用 `git reset --hard` 或 `git checkout -- <file>` 回滚文件，除非用户明确要求。

## 9. 自动任务规则

`drawdb-roadmap-dispatcher` 是本项目的自动研发任务。

自动任务必须遵守：

- 每轮最多选择一个最小功能切片。
- 有锁文件时不并发执行。
- 完成后写入 `/Users/lynn/.codex/automations/drawdb-roadmap/runs/`。
- 同步维护 `/Users/lynn/.codex/automations/drawdb-roadmap/memory.md`。
- 任务完成、验证通过、合并回 `main` 后，必须 `git push origin main`。
- push 失败或 SHA 不一致时停止并记录 blocker。

## 10. 完成定义

一次任务只有在以下条件满足后才算完成：

- 代码或文档变更符合当前 Phase 计划。
- 相关文档已同步更新。
- 必要验证命令已运行并记录结果。
- 本地工作区干净。
- 本地 `main` 和远端 `origin/main` 一致。
- 如有未解决风险，已写入验证矩阵、阶段计划或自动任务 memory。
