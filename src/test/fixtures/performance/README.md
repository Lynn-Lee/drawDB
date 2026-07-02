# Performance fixtures

本目录提供 Phase 4 大图性能 smoke 使用的 deterministic diagram fixtures。

## 入口

- `performanceDiagrams.js` 导出 `createPerformanceDiagram(size)`、`performanceDiagrams` 和 `LARGE_DIAGRAM_SIZES`。
- 当前固定支持 100、500、1000 表三档，用于后续加载、搜索、定位、导出和大图渲染 smoke。

## 数据形状

- 每个 diagram 使用 normalized diagram shape，可通过 `validateDiagramShape`。
- 每张表包含 `id`、`name`、`parent_id`、`updated_at` 四个字段。
- 除第一张表外，每张表都有一条指向前一张表的 `many_to_one` 关系，因此关系数固定为 `tables - 1`。
- 坐标按 20 列网格生成，保证 100/500/1000 表在画布上分布稳定。

## 维护要求

- 不使用随机数、当前时间或外部服务。
- 修改生成规则时必须更新 `performanceDiagrams.test.js`。
- 如需新增更大规模 fixture，先确认导入限制、bundle budget 和 e2e 运行时间不会让固定门禁失稳。
