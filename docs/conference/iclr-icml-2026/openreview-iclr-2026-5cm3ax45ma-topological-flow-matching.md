---
title: Topological Flow Matching
title_zh: 拓扑流匹配
authors: "Kacper Wyrwal, Ismail Ilkan Ceylan, Alexander Tong"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=5CM3ax45Ma"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 流匹配推广到结构化域，融入拓扑信息
tldr: 本文提出拓扑流匹配，将流匹配推广到如脑图等结构化空间，通过引入拉普拉斯导出的漂移项注入拓扑信息，在保持稳定模拟自由目标的同时捕捉域结构，解决标准流匹配忽略拓扑特征的问题。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准流匹配将结构化数据视为欧氏点，忽略域拓扑特征。
method: 将流匹配解释为退化薛定谔桥问题，并加入拉普拉斯漂移项以注入拓扑。
result: 在脑图等数据上验证了拓扑感知生成的有效性。
conclusion: 拓扑流匹配为结构化生成任务提供了原则性扩展。
---

## Abstract
Flow matching is a powerful generative modeling framework, valued for its simplicity and strong empirical performance. However, its standard formulation treats signals on structured spaces---such as fMRI data on brain graphs---as points in Euclidean space, overlooking the rich topological features of their domains. To address this, we introduce \emph{topological flow matching}, a topology-aware generalization of flow matching. We interpret flow matching as a framework for solving a degenerate Schrödinger bridge problem and inject topological information by augmenting the reference process with a Laplacian-derived drift. This principled modification captures the structure of the underlying domain while preserving the desirable properties of flow matching: a stable, simulation-free objective and deterministic sample paths. As a result, our framework serves as a plug-and-play replacement for standard flow matching. We demonstrate its effectiveness on diverse structured datasets, including brain fMRIs, ocean currents, seismic events, and traffic flows.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：流匹配（Flow Matching, FM）作为一种生成建模框架，凭借其简单性和强大的实证表现而备受重视。然而，标准 FM 将结构化空间上的信号——如脑图上的 fMRI 数据——视为欧氏空间中的点，忽略了其域中丰富的拓扑特征。许多科学和工程中的高价值数据集（如脑区图上的 fMRI 扫描、海洋网格上的洋流速度、道路网络上的交通流量）本质上都是定义在结构化域上的信号，其底层结构包含关键信息，却常被标准生成模型忽略。

**核心问题**：如何将 FM 推广到结构化空间，使其能够感知并利用信号域的拓扑信息，同时保留标准 FM 的优良性质——稳定的、无模拟的训练目标和确定性的样本路径。

**整体含义**：本文提出拓扑流匹配（Topological Flow Matching, TFM），将 FM 推广到如脑图等结构化空间，通过引入拉普拉斯导出的漂移项注入拓扑信息，在保持稳定模拟自由目标的同时捕捉域结构，解决标准流匹配忽略拓扑特征的问题。


## 二、方法论

**核心思想**：将流匹配解释为退化薛定谔桥问题（degenerate Schrödinger bridge problem）的求解框架，并通过在参考过程中加入由拉普拉斯算子导出的漂移项来注入拓扑信息。

**关键技术细节**：

- **拓扑参考过程**：TFM 构建了一个拓扑参考过程，其漂移项包含 Hodge 拉普拉斯算子 \(H_t(L_k)\) 和仿射项 \(\alpha_t\)，并在此基础上叠加一个控制项 \(u_t(X_t)\)。
- **退化解耦**：与直接向流 ODE 添加拓扑漂移不同（这会导致条件路径退化为忽略拓扑的简单形式），TFM 通过退化薛定谔桥获得原则性的控制项选择。
- **最优控制视角**：在零噪声极限下，TFM 的最优漂移 \(u_t\) 收敛到一个动态最优控制问题的解，该问题最小化控制能量，同时约束概率分布在拓扑参考动力学下从 \(\mu_0\) 演化为 \(\mu_1\)。
- **保留标准 FM 优势**：与近期提出的拓扑薛定谔桥匹配（TSBM）不同，TFM 保留了标准 FM 的关键优势——可扩展的、无模拟的训练和确定性样本路径。

**算法流程（文字说明）**：

1. **定义拓扑参考过程**：在结构化域（如图、复形）上，利用 Hodge 拉普拉斯算子定义带拓扑漂移的参考随机过程；
2. **构建条件桥**：通过退化薛定谔桥问题，推导给定端点 \(x_0, x_1\) 下的条件桥 SDE；
3. **训练**：使用模拟自由的流匹配目标函数训练神经网络 \(u_t(X_t)\)，拟合条件控制项；
4. **采样**：在零噪声极限下，通过确定性的拓扑流 ODE 从初始分布 \(\mu_0\) 采样到目标分布 \(\mu_1\)。

TFM 可作为标准 FM 的即插即用替代方案。


## 三、实验设计

**数据集与场景**：

| 数据集 | 任务类型 | 信号类型 | 域类型 |
|--------|---------|---------|--------|
| 脑 fMRI（Human Connectome Project, 1190个信号，360个功能脑区） | 匹配（Matching） | 节点信号（k=0） | 加权脑图 |
| 洋流（北大西洋，NOAA数据） | 匹配（Matching） | 边信号（k=1） | 2-单纯复形网格 |
| 地震事件（全球历史地震） | 生成（Generation） | 节点信号 | 球面网格图 |
| 交通流量（道路网络） | 生成（Generation） | 边信号（提升到2-单纯复形） | 道路网络图 |
| 单细胞分化（类胚体，5个时间步） | 匹配（Matching） | 节点信号 | 4-最近邻图 |
| CIFAR-10（图像生成） | 生成（Generation） | 节点信号（32×32×3网格） | 规则网格 |



**基准与对比方法**：
- 对比了标准条件流匹配（CFM）
- 对比了拓扑薛定谔桥匹配（TSBM）
- 对比了最优传输条件流匹配（OT-CFM）和最优传输拓扑流匹配（OT-TFM）
- 在脑图、洋流、单细胞等实验上复现了 Yang (2025) 的实验设置


## 四、资源与算力

论文提供的摘要和元数据中**未明确说明**所使用的 GPU 型号、数量或训练时长等具体算力信息。仅能从论文篇幅（26页）和代码已开源（https://github.com/KacperWyrwal/topological-flow-matching）等信息中推测实验规模。


## 五、实验数量与充分性

**实验数量**：论文在 **6 个不同的结构化数据集**上进行了实验，涵盖：
- 3 个生成任务（地震、交通、CIFAR-10）
- 3 个匹配任务（fMRI、洋流、单细胞）

**实验覆盖**：实验覆盖了多种类型的结构化域——图（脑图、地震图）、单纯复形（洋流、交通）、规则网格（CIFAR-10）——以及不同类型的信号（节点信号、边信号）。拓扑数据集总结见表 4。

**充分性与客观性**：
- 实验设计**较为充分**，覆盖了多个领域和数据类型，验证了方法的通用性
- 对比了多个基线方法（CFM、TSBM、OT-CFM 等），**公平性较好**
- 在脑图实验上，TFM 在所有实验中表现最佳，特别是在具有复杂加权结构的脑图上
- 在 CIFAR-10 图像生成上，TFM 的提升较小且方差较高，表明其优势在复杂拓扑域上更为显著——这一结果也体现了作者**客观报告方法局限**的态度
- 实验设置了多次运行以报告方差


## 六、主要结论与发现

1. **TFM 在结构化数据上显著优于标准 FM**：在所有实验数据集上，TFM 均优于 CFM。
2. **拓扑信息价值与域复杂度正相关**：在地震和交通实验等域结构复杂的场景中，TFM 的优势远大于在规则网格图像生成中的优势。
3. **脑图实验收益最大**：在具有复杂加权结构的脑图上，TFM 表现最佳。
4. **TFM 优于 TSBM**：TFM 在所有实验上一致优于 TSBM，证明了无模拟框架的优势。
5. **即插即用特性**：TFM 可作为标准 FM 的无缝替代方案，在保留其优良性质的同时注入拓扑感知能力。


## 七、优点

1. **方法创新性**：首次将拓扑信息系统地融入流匹配框架，通过薛定谔桥视角实现了原则性的推广。
2. **保留核心优势**：与 TSBM 不同，TFM 保留了标准 FM 的可扩展、无模拟训练和确定性样本路径等关键优点。
3. **即插即用**：可作为标准 FM 的直接替代方案，易于在实际应用中部署。
4. **实验多样性**：在脑 fMRI、洋流、地震、交通、单细胞和图像等多个领域验证了方法的有效性。
5. **代码开源**：提供了完整的代码实现（GitHub），有利于复现和后续研究。
6. **理论严谨性**：通过退化薛定谔桥和最优控制提供了坚实的理论支撑。


## 八、不足与局限

1. **算力信息缺失**：论文未明确报告实验所用的 GPU 型号、数量和训练时长，不利于读者评估计算成本和可复现性。
2. **图像生成提升有限**：在 CIFAR-10 等规则网格图像生成任务上，TFM 的提升较小且方差较高，表明其在规则域上的优势不如复杂拓扑域显著。
3. **方法适用范围**：TFM 主要针对定义在图/复形等结构化域上的信号，对于非结构化数据或无法自然定义拉普拉斯算子的域可能不适用。
4. **超参数敏感性**：Hodge 拉普拉斯算子的选择和时间依赖函数的设定可能需要针对不同任务进行调优。
5. **与 TSBM 的关系**：虽然 TFM 在实验上优于 TSBM，但论文指出 Yang (2025) 并未正式提出拓扑流匹配框架，二者关系的系统性对比有待进一步深入。


（完）
