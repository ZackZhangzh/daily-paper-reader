---
title: Topological Flow Matching
title_zh: 拓扑流匹配
authors: "Kacper Wyrwal, Ismail Ilkan Ceylan, Alexander Tong"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=5CM3ax45Ma"
tags: ["query:dgs-fm"]
score: 6.0
evidence: 流匹配在结构域上的拓扑推广
tldr: 标准流匹配将结构空间信号视为欧氏点，忽略拓扑特征。本文提出拓扑流匹配，将流匹配解释为退化薛定谔桥问题，通过拉普拉斯漂移注入拓扑信息，保留域结构同时保持仿真自由目标。该方法适用于fMRI等图数据，扩展了流匹配的适用领域。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准流匹配忽视结构化数据的拓扑特征，导致表示不准确。
method: 在流匹配中引入拉普拉斯漂移，注入域拓扑信息，保持训练稳定性。
result: 在脑图等结构化数据上有效捕捉拓扑结构，提升生成质量。
conclusion: 拓扑流匹配为流匹配处理非欧结构数据提供了通用方案。
---

## Abstract
Flow matching is a powerful generative modeling framework, valued for its simplicity and strong empirical performance. However, its standard formulation treats signals on structured spaces---such as fMRI data on brain graphs---as points in Euclidean space, overlooking the rich topological features of their domains. To address this, we introduce \emph{topological flow matching}, a topology-aware generalization of flow matching. We interpret flow matching as a framework for solving a degenerate Schrödinger bridge problem and inject topological information by augmenting the reference process with a Laplacian-derived drift. This principled modification captures the structure of the underlying domain while preserving the desirable properties of flow matching: a stable, simulation-free objective and deterministic sample paths. As a result, our framework serves as a plug-and-play replacement for standard flow matching. We demonstrate its effectiveness on diverse structured datasets, including brain fMRIs, ocean currents, seismic events, and traffic flows.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

- **核心问题**：标准流匹配（Flow Matching）将结构化空间（如脑图上的fMRI数据）上的信号简单地视为欧氏空间中的点，完全忽略了底层域（domain）丰富的拓扑特征【0†L23-L25】。
- **研究动机**：流匹配作为一种生成建模框架，以其简洁性和强大的实证表现受到重视，但其标准 formulation 无法有效处理非欧结构数据【0†L23-L24】。本文旨在弥补这一缺陷，将流匹配推广为一种**拓扑感知**的生成模型【0†L25】。

## 2. 方法论

- **核心思想**：本文将流匹配重新解释为求解**退化薛定谔桥问题**（degenerate Schrödinger bridge problem）的框架【0†L25-L26】。
- **关键技术**：通过在参考过程中加入**拉普拉斯派生漂移**（Laplacian-derived drift）来注入拓扑信息【0†L26】。
- **算法效果**：这种修改在保留流匹配优良特性——**稳定的仿真自由目标**（simulation-free objective）和**确定性样本路径**（deterministic sample paths）——的同时，成功捕捉了底层域的结构【0†L26-L27】。
- **框架定位**：该方法可作为标准流匹配的**即插即用**（plug-and-play）替代方案【0†L27】。

## 3. 实验设计

- **使用的数据集/场景**：涵盖多种结构化数据集，包括**脑功能磁共振成像**（brain fMRIs）、**洋流**（ocean currents）、**地震事件**（seismic events）和**交通流**（traffic flows）【0†L28】。
- **基准与对比方法**：元数据未详细列出具体对比的基线方法，但明确指出实验旨在验证该方法在捕捉拓扑结构方面的有效性【0†L18】。
- **评估指标**：元数据未提供具体量化指标，但强调在脑图等结构化数据上有效捕捉拓扑结构，提升了生成质量【0†L18】。

## 4. 资源与算力

- 论文元数据及摘要中**未明确说明**所使用的GPU型号、数量、训练时长等算力信息。

## 5. 实验数量与充分性

- **实验组数**：元数据提及在**四个不同的数据集**（fMRI、洋流、地震、交通流）上进行了实验【0†L28】，但**未提供消融实验、参数敏感性分析等额外实验组的具体数量**。
- **充分性与客观性评估**：从现有信息看，实验覆盖了多个领域的数据集，具有一定广度【0†L28】。然而，由于缺乏与基线方法的详细对比数据、消融研究以及量化评估指标的描述，**难以全面判断实验的充分性和公平性**。仅从元数据（得分6.0）来看，评审可能存在一定疑虑【0†L13】。

## 6. 主要结论与发现

- 本文提出的拓扑流匹配为流匹配处理**非欧结构数据**提供了**通用方案**【0†L19】。
- 该方法在多个结构化数据集上有效捕捉了**拓扑结构**，并**提升了生成质量**【0†L18】。

## 7. 方法亮点

- **理论创新**：将流匹配与薛定谔桥问题建立联系，为注入拓扑信息提供了 principled 的理论基础【0†L25-L26】。
- **实用性强**：作为即插即用模块，可直接替换标准流匹配，无需对现有流程做大规模改动【0†L27】。
- **保留原有优势**：在增强拓扑感知能力的同时，未牺牲流匹配的**训练稳定性**（仿真自由目标）和**推理确定性**（确定性样本路径）【0†L26-L27】。

## 8. 不足与局限

- **实验细节缺失**：元数据未提供具体的基线方法、量化评估指标及消融实验，使得方法的相对优势缺乏充分量化证据【0†L18】。
- **应用范围**：尽管方法具有通用性，但当前验证主要集中在**图结构数据**（如脑图、交通流）和**时空数据**（如洋流、地震）上，其在其他类型非欧结构（如网格、流形）上的泛化能力有待进一步验证【0†L28】。
- **评审反馈**：ICLR 2026评审给出6分，表明方法可能存在**一定争议或需要进一步完善**的方面【0†L13】。

（完）
