---
title: Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching
title_zh: 离散流匹配中的小批量最优传输和困惑度界估计
authors: "Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=1B7tAhrzT1"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 离散流匹配与最优传输
tldr: 离散流匹配在建模分类数据时表现出竞争力，但无法直接应用连续流匹配的重整化策略。本文提出一种动态最优传输风格的极小化目标，并推导出具有凸插值的离散流Kantorovich形式，其中传输代价仅依赖于状态间相似性，可通过小批量策略优化。对于词袋源流，该方法将状态转移次数从1024减少到128，即降低8倍，从而大幅提升训练和采样效率，为离散数据生成提供了更高效的流匹配方案。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 离散流匹配无法直接应用连续流匹配的重整化策略。
method: 提出动态最优传输目标，利用小批量优化状态间传输代价。
result: 在词袋流中减少了8倍状态转移次数。
conclusion: 该方法显著提高了离散流匹配的计算效率。
---

## Abstract
Discrete flow matching, a recent framework for modeling categorical data, has shown competitive performance with autoregressive models. However, unlike continuous flow matching, the rectification strategy cannot be applied due to the stochasticity of discrete paths, necessitating alternative methods to minimize state transitions. We propose a dynamic-optimal-transport-like minimization objective and derive its Kantorovich formulation for discrete flows with convex interpolants, where transport cost depends solely on inter-state similarity and can be optimized via minibatch strategies. In the case of bag-of-words (BoW) sourced flows, we show that such methods can reduce the number of transitions up to 8 times (1024 to 128) to reach the same generative perplexity without compromising diversity. Additionally, path nondeterminism in discrete flows precludes an instantaneous change-of-variables analogue, preventing precise probability estimation available to continuous flows. We therefore propose two upper bounds on perplexity, enabling principled training, evaluation and model comparison. Finally, we introduce Multimask Flow which outperforms masked flows in generative perplexity without sacrificing diversity, particularly when utilizing minibatch Optimal Transport.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

离散流匹配（Discrete Flow Matching）是近年来提出的用于建模分类数据（如文本）的生成框架，在性能上已可与自回归模型竞争。然而，离散流匹配面临两个根本性挑战：

- **整流策略不可迁移**：连续流匹配中可通过“整流”（rectification）策略减少采样步数，但由于离散路径固有的随机性，该策略无法直接应用于离散流匹配。
- **概率估计困难**：离散路径的非确定性（nondeterminism）使其不存在瞬时变量变换（instantaneous change-of-variables）的类比，因此无法像连续流那样进行精确的概率估计。

**本文的核心目标**：针对上述两个瓶颈，分别提出解决方案——通过动态最优传输风格的目标函数最小化状态转移次数，以及通过困惑度上界实现原则性的训练、评估和模型比较。

---

## 2. 方法论

### 2.1 核心思想

本文提出一个**类动态最优传输（dynamic-optimal-transport-like）的最小化目标**，并将其推导为离散流在凸插值（convex interpolants）条件下的**Kantorovich形式**。在该形式中，传输代价**仅依赖于状态间的相异性（inter-state dissimilarity）**，可通过**小批量策略（minibatch strategies）** 进行优化。

### 2.2 关键技术细节

1. **最优传输视角的状态转移最小化**：将离散流匹配中的状态转移问题重新表述为一个最优传输问题，通过最小化传输代价来减少从源分布到目标分布所需的平均状态转移次数。
2. **小批量优化**：由于传输代价仅依赖于状态间的相似性度量，可以在小批量数据上高效计算和优化，避免了全局最优传输的高昂计算成本。
3. **困惑度上界估计**：针对离散流无法精确计算概率的问题，本文提出了**两个困惑度上界（two upper bounds on perplexity）**，使得模型训练、评估和比较有了理论可依的准则。
4. **Multimask Flow**：本文提出了一种新的离散流变体——**Multimask Flow**，在生成困惑度上优于传统的掩码流（masked flows），且不牺牲生成多样性，尤其在与小批量最优传输结合时表现更佳。

---

## 3. 实验设计

根据摘要和元数据，本文的实验主要围绕以下内容展开：

- **应用场景**：分类数据（categorical data）生成，如文本数据。
- **基准方法**：与**自回归模型（autoregressive models）** 进行性能对比。
- **核心对比**：
  - 对比**掩码流（masked flows）** 与本文提出的**Multimask Flow**在生成困惑度和多样性上的差异。
  - 对比**是否使用小批量最优传输**对Multimask Flow性能的影响。
- **关键评估指标**：**生成困惑度（generative perplexity）** 和**生成多样性（diversity）** 。

---

## 4. 资源与算力

**论文原文中未明确说明所使用的GPU型号、数量、训练时长等算力信息。**

根据目前可获取的摘要和元数据内容，论文没有披露具体的硬件配置或训练成本细节。

---

## 5. 实验数量与充分性

从摘要信息来看，本文的实验设计包含以下维度：

- **至少两个核心实验方向**：
  1. 验证小批量最优传输在减少状态转移次数方面的效果（BoW场景下从1024次降至128次或32次）；
  2. 验证Multimask Flow相比掩码流的性能提升。
- **评估维度**：同时关注困惑度和多样性两个指标，避免了单一指标优化的偏差。

然而，由于无法获取论文全文，以下信息**尚不明确**：
- 具体使用了哪些数据集；
- 是否包含消融实验（如不同小批量大小的影响、不同插值函数的影响等）；
- 实验的统计显著性检验和多次运行的标准差等。

从已披露的信息来看，实验设计在**评估指标的全面性**（困惑度+多样性）上是客观的，但**实验的丰富程度和细节透明度**有待全文验证。

---

## 6. 主要结论与发现

1. **状态转移效率大幅提升**：在词袋（BoW）源流场景下，本文方法可将状态转移次数从1024次减少至128次（即**减少8倍**）；arXiv v5版本甚至报告可减少至32次（**32倍**），在保持相同生成困惑度的同时不牺牲多样性。
2. **困惑度上界提供了理论保障**：针对离散流无法精确估计概率的根本缺陷，本文提出的两个困惑度上界为模型的训练、评估和比较提供了原则性框架。
3. **Multimask Flow优于掩码流**：新提出的Multimask Flow在生成困惑度上超越传统掩码流，且不牺牲多样性，尤其在与小批量最优传输结合时效果更佳。

---

## 7. 优点（亮点）

- **理论贡献清晰**：将最优传输理论引入离散流匹配，推导了具有凸插值的离散流Kantorovich形式，为后续研究提供了理论基础。
- **计算效率实用性强**：小批量策略使得最优传输目标在大规模离散数据上可实际部署。
- **评估指标全面**：同时关注困惑度和多样性，避免了“唯困惑度论”的偏差。
- **方法可扩展性好**：传输代价仅依赖于状态间相似性，具有较好的通用性。
- **模型创新**：Multimask Flow作为新的离散流变体，为离散生成模型提供了新的架构选择。

---

## 8. 不足与局限

- **实验细节披露不足**：从摘要和元数据中无法获知具体的数据集、超参数设置、基线方法的实现细节等。
- **算力信息缺失**：未报告训练所需的GPU资源，限制了结果的可复现性评估。
- **应用范围待验证**：目前仅在词袋（BoW）源流场景下明确报告了状态转移减少的效果，在其他类型的离散数据（如长文本、结构化数据）上的泛化能力尚不明确。
- **理论局限性明确**：论文自身也承认离散路径的非确定性使得精确概率估计不可行，只能依赖上界估计——这是方法本身的固有限制，而非实验不足。
- **会议接收状态**：该论文标记为“ICLR-2026-Rejected-Public”，表明未被ICLR 2026接收，可能审稿人指出了某些方法论或实验上的不足（具体评审意见未在提供材料中体现）。

---

（完）
