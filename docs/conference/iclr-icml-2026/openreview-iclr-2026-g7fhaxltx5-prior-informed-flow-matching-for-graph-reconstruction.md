---
title: Prior-Informed Flow Matching for Graph Reconstruction
title_zh: 先验知情的流匹配用于图重构
authors: "Haoming Chen, Nicolas Zilberstein, Santiago Segarra"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=G7fHaxLTx5"
tags: ["query:dgs-fm"]
score: 4.0
evidence: 条件流匹配用于图重构
tldr: 图重构从局部观测恢复完整图结构面临全局一致性与先验融合难题。本文提出先验知情流匹配（PIFM），将图嵌入先验（如图谱或GraphSAGE）与连续时间流匹配结合，先用先验估计邻接矩阵，再通过整流流匹配精化至干净图分布。该方法基于置换等变的失真-感知理论，实现结构先验与生成模型的有机融合。实验表明其重构质量优于纯嵌入或纯生成方法，为图数据重构提供了新范式。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有图重构方法要么缺乏全局一致性，要么难以融入结构先验。
method: 利用嵌入先验初始化邻接矩阵，再用整流流匹配精化至真实图分布。
result: 在多个图重构任务上取得了优于基线方法的性能。
conclusion: 融合先验与流匹配是图重构的有效方向。
---

## Abstract
We introduce Prior-Informed Flow Matching (PIFM), a conditional flow model for graph reconstruction. Reconstructing graphs from partial observations remains a key challenge; classical embedding methods often lack global consistency, while modern generative models struggle to incorporate structural priors. PIFM bridges this gap by integrating embedding-based priors with continuous-time flow matching. Grounded in a permutation equivariant version of the distortion-perception theory, our method first uses a prior, such as graphons or GraphSAGE/node2vec, to form an informed initial estimate of the adjacency matrix based on local information. It then applies rectified flow matching to refine this estimate, transporting it toward the true distribution of clean graphs and learning a global coupling. Experiments on different datasets demonstrate that PIFM consistently enhances classical embeddings, outperforming them and state-of-the-art generative baselines in reconstruction accuracy.

---

## 论文详细总结（自动生成）

# 论文总结：Prior-Informed Flow Matching for Graph Reconstruction


## 1. 核心问题与整体含义（研究动机与背景）

图重构（graph reconstruction）旨在从部分观测中恢复完整的图结构，是一个长期存在的难题。传统方法主要分为两类，各有缺陷：

- **基于嵌入的方法**（如 Node2Vec、GraphSAGE）：将图重构视为链路预测任务，模型独立地预测每条边，虽然能捕捉局部模式，但**缺乏全局一致性**，无法把握图的整体结构。
- **现代生成模型**（如扩散模型、流模型）：虽能生成逼真的图结构，但**难以融入结构先验**，且并非为精确重构而设计。

核心矛盾在于：传统方法是“局部的”，而现代生成模型是“非精确的”。本文提出的 **PIFM（Prior-Informed Flow Matching）** 正是为了弥合这一鸿沟，将基于嵌入的先验知识与连续时间流匹配相结合，实现高保真图重构。


## 2. 方法论

### 2.1 核心思想

PIFM 的核心思想基于**置换等变的失真-感知理论（distortion-perception theory）**，将图重构分解为两个阶段：

1. **先验引导的初始估计**：利用嵌入先验（如 graphons、GraphSAGE 或 Node2Vec）基于局部观测信息形成邻接矩阵的初步估计。这近似于最小均方误差（MMSE）估计器 $\hat{A}^* = \mathbb{E}[A \mid A_{\mathcal{O}}]$，其中 $A_{\mathcal{O}}$ 是部分观测的邻接矩阵。

2. **流匹配精化**：应用整流流匹配（rectified flow matching）将初始估计 $\mathbf{A}_0$ 传输到真实图分布 $\mathbf{A}_1 = A$，学习全局结构耦合，生成逼真的图结构。

### 2.2 技术细节

**形式化框架**：论文将图重构建模为感知-失真权衡问题，优化以下目标函数：

$$
\mathcal{D}(P) = \min_{p(\hat{A} \mid A_{\mathcal{O}})} \mathbb{E}_{p(A, \hat{A})}[\|A - \hat{A}\|_F^2] \quad \text{s.t.} \quad d(p_A, p_{\hat{A}}) \le P
$$

其中 $A$ 是真实图，$\hat{A}$ 是估计值，$d(p_A, p_{\hat{A}})$ 是真实图分布与估计图分布之间的散度。当 $P=0$ 时，目标退化为完美感知重建（$p_A = p_{\hat{A}}$）。

**先验估计的实现**：
- **归纳式（dataset-informed）方法**：使用 graphons 或 GraphSAGE，基于数据集信息学习全局模式。
- **直推式（instance-specific）方法**：使用 Node2Vec，针对单个图实例生成节点嵌入，再通过逻辑回归预测边概率。

**精化过程**：先验估计 $\hat{A}^*$ 作为流匹配的初始状态 $\mathbf{A}_0$，通过训练学习从初始分布到真实图分布的传输路径。该过程能够捕捉边之间的概率耦合，生成全局一致的图结构。


## 3. 实验设计

### 3.1 数据集与场景

论文在四个数据集上评估 PIFM：

| 数据集 | 类型 | 特点 |
|--------|------|------|
| IMDB-B | 直推式（transductive） | 小规模图 |
| PROTEINS | 直推式（transductive） | 小规模图 |
| ENZYMES | 直推式（transductive） | 小规模图 |
| CORA | 归纳式（inductive） | 大规模图，对训练流匹配模块更具挑战性 |

数据集涵盖**稠密图和稀疏图**等多样化图结构。

### 3.2 实验设置

- **数据划分**：直推式数据集按 85% 训练、10% 验证、5% 测试划分。
- **掩码级别**：在两种掩码率（10% 和 50% 的边被掩码）下评估重构质量，掩码均匀随机生成。
- **评估指标**：阈值依赖指标（FPR、FNR）和阈值无关指标（ROC-AUC、AP），以及 MMD（最大均值差异）作为感知质量的代理指标。

### 3.3 对比方法（Baselines）

PIFM 与以下基线对比：

1. **单次预测先验**：SIGL Prior、Node2Vec Prior、GraphSAGE Prior——直接使用结构先验做单次预测，不加流精化。
2. **高斯先验的流模型**：从均匀高斯噪声初始化的流模型。
3. **DiGress + RePaint**：无条件 DiGress 扩散模型结合 RePaint 风格的重采样。
4. **GDSS + RePaint**：GDSS 扩散模型结合 RePaint 风格的重采样。


## 4. 资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量或训练时长等算力信息。实施细节仅在附录 D 中提及，但摘要和正文中未披露具体硬件配置。


## 5. 实验数量与充分性

根据可获取的论文内容：

- **数据集数量**：4 个（IMDB-B、PROTEINS、ENZYMES、CORA）。
- **掩码级别**：2 种（10%、50%）。
- **基线数量**：7 个以上（含各先验变体、高斯流、DiGress+RePaint、GDSS+RePaint）。
- **评估指标**：5 种以上（FPR、FNR、ROC-AUC、AP、MMD）。
- **Toy experiment**：包含一个四节点图的玩具实验，用于直观展示流模型如何学习全局耦合。

**充分性评估**：
- 数据集覆盖了直推式和归纳式两种场景，以及不同规模的图，具有一定多样性。
- 对比基线既包括纯先验方法（消融先验的作用），也包括高斯先验的流（消融先验信息的作用），还包括 SOTA 扩散模型（验证相对于现有生成方法的优势），**消融设计较为合理**。
- **潜在不足**：由于论文为 ICLR 2026 被拒稿版本【source: ICLR-2026-Rejected-Public】，实验的充分性可能是评审关注的方面之一；实验仅涉及 4 个数据集，且均为公开基准，缺乏更大规模或更复杂场景的验证。


## 6. 主要结论与发现

1. **PIFM 一致性地提升了经典嵌入方法的重构精度**，在多个数据集和掩码级别下均优于纯嵌入方法和 SOTA 生成基线。

2. **流精化过程有效弥补了先验的局部性缺陷**：即使先验（如 Node2Vec）是“误设定的”（misspecified），流模型仍能通过学习全局耦合生成全局一致的图结构。

3. **PIFM 可被理解为一种图修复（graph inpainting）形式**，缺失的边通过学习到的插值过程被推断出来。

4. **融合先验与流匹配是图重构的有效方向**【conclusion】。


## 7. 优点（亮点）

1. **方法论创新**：首次将嵌入先验与连续时间流匹配有机结合，在“局部先验”与“全局生成”之间建立了桥梁。

2. **理论支撑扎实**：方法建立在置换等变的失真-感知理论之上，具有清晰的理论基础。

3. **灵活的先验选择**：支持多种先验（graphons、GraphSAGE、Node2Vec），兼顾归纳式和直推式场景。

4. **消融设计合理**：通过对比“纯先验”和“高斯先验+流”，有效验证了“先验信息”和“流精化”两个组件的各自贡献。

5. **评估指标全面**：同时使用阈值依赖和阈值无关的指标，并引入 MMD 评估感知质量。


## 8. 不足与局限

1. **算力信息缺失**：未报告 GPU 型号、数量或训练时长，影响了实验的可复现性参考。

2. **实验规模有限**：仅涉及 4 个公开数据集，缺乏在更大规模、更复杂图结构（如异构图、动态图）上的验证。

3. **被拒稿状态**：论文为 ICLR 2026 被拒稿版本【source: ICLR-2026-Rejected-Public】，说明评审可能指出了方法或实验层面的某些不足（具体评审意见未在摘要中体现）。

4. **理论分析的深度**：虽然提到了置换等变的失真-感知理论，但摘要中未详细展开理论推导和证明过程。

5. **应用场景限制**：方法目前聚焦于从部分观测中重构图结构，未探讨在具体下游任务（如药物发现、社交网络分析）中的实际效果。

6. **掩码模式单一**：掩码仅考虑均匀随机生成，未探索更实际的部分观测场景（如基于节点或基于社区的结构性缺失）。


（完）
