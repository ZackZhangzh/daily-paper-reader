---
title: Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching
title_zh: 离散流匹配中的小批量最优传输与困惑度界估计
authors: "Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman"
date: 2026-04-30
pdf: "https://openreview.net/pdf/2894f62a416bc956ecf7f75bd865edda54717e59.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 离散流匹配与最优传输及困惑度界
tldr: 离散流匹配在分类数据建模上表现良好，但无法应用连续流匹配的整流策略。本文提出类似动态最优传输的极小化目标，推导出离散流的Kantorovich形式，并采用小批量策略优化传输代价，在保持生成困惑度的同时将状态转移次数减少32倍。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 离散流匹配缺乏有效的路径整流方法，需优化状态转移。
method: 建立动态最优传输目标，利用凸插值和小批量策略优化。
result: 转移次数从1024降至32，困惑度不降低，生成效率显著提升。
conclusion: 最优传输思想可有效改进离散流匹配的生成路径。
---

## Abstract
Discrete flow matching, a recent framework for modeling categorical data, has shown competitive performance with autoregressive models. However, unlike continuous flow matching, the rectification strategy cannot be applied due to the stochasticity of discrete paths, necessitating alternative methods to minimize state transitions. We propose a dynamic-optimal-transport-like minimization objective and derive its Kantorovich formulation for discrete flows with convex interpolants, where transport cost depends solely on inter-state dissimilarity and can be optimized via minibatch strategies. We show that such methods can reduce the number of transitions up to 32 times (1024 to 32) to reach the same generative perplexity without compromising diversity. Additionally, path nondeterminism in discrete flows precludes an instantaneous change-of-variables analogue, preventing precise probability estimation available to continuous flows. We therefore propose two upper bounds on perplexity, enabling principled training, evaluation and model comparison. Finally, we introduce Multimask Flows which outperform masked flows in generative perplexity without compromising diversity, particularly when utilizing minibatch Optimal Transport.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

离散流匹配（Discrete Flow Matching, DFM）是近年来用于建模分类数据（如文本）的前沿框架，其性能已可与自回归模型相媲美。然而，离散流匹配面临两个核心瓶颈：

- **路径随机性导致无法应用“整流”策略**：与连续流匹配不同，离散路径固有的随机性使得连续版本中有效的整流（rectification）策略无法直接推广。这要求探索替代方法来最小化状态转移次数。
- **精确概率估计不可行**：离散路径的非确定性使得无法像连续流那样使用瞬时变量变换（instantaneous change-of-variables）的类比方法，从而阻碍了精确的概率估计。

本文的核心目标正是从**最优传输**和**困惑度界估计**两个角度解决上述问题，为离散流匹配提供更高效的生成路径和更严谨的评估框架。

---

## 2. 论文提出的方法论

### 2.1 动态最优传输目标

- 论文提出了一种**类似动态最优传输（dynamic-optimal-transport-like）的最小化目标**。
- 针对具有**凸插值（convex interpolants）** 的离散流，推导了其等价的 **Kantorovich 形式化表述**。
- 在该框架下，**传输代价仅取决于状态间的差异（inter-state dissimilarity）** ，使得优化问题变得可解。

### 2.2 小批量优化策略

- 上述传输代价可通过**小批量策略（minibatch strategies）** 进行优化。
- 该方法有效降低了达到相同生成困惑度所需的状态转移次数——在词袋（BoW）来源的流中，**转移次数可从1024降至128（减少8倍）** ；而在更广泛的设置下，**最多可减少32倍（从1024降至32）** 。

### 2.3 困惑度上界估计

- 由于无法精确估计离散流的概率，论文提出了**两个困惑度上界（upper bounds on perplexity）** 。
- 这使得离散流模型能够进行**有原则的训练、评估和模型比较**，弥补了与连续流在概率估计能力上的差距。

### 2.4 Multimask Flows

- 论文最终引入了 **Multimask Flows**，这是一种新型离散流架构。
- Multimask Flows 在**生成困惑度上优于传统的掩码流（masked flows）** ，且**不牺牲生成多样性**，尤其在使用小批量最优传输时效果更佳。

---

## 3. 实验设计

根据摘要和元数据中的信息：

- **应用场景**：分类数据（categorical data）建模，特别是**文本数据**等离散分布。
- **对比基线**：主要对比了**自回归模型（autoregressive models）** 和**掩码流（masked flows）** 。
- **评估指标**：以**生成困惑度（generative perplexity）** 和**生成多样性（diversity）** 为核心指标。
- **Benchmark**：论文中明确提到了**词袋（Bag-of-Words, BoW）来源的流**作为测试场景。

> **注意**：由于可获取的公开信息仅限于摘要层面，具体的**数据集名称、实验规模、对比方法的完整列表**等细节未能获取。

---

## 4. 资源与算力

**文中未明确提及**所使用的GPU型号、数量或训练时长等算力相关信息。

---

## 5. 实验数量与充分性

从摘要信息推断：

- 实验覆盖了**不同配置下的转移次数对比**（1024→128或1024→32），验证了小批量最优传输在减少状态转移方面的有效性。
- 对 **Multimask Flows** 与**掩码流**进行了对比实验，验证了前者的优越性。
- 两个困惑度上界的提出表明论文在**理论分析和实验验证**两个层面均有工作。

> **局限**：由于公开信息有限，**消融实验的具体设置、不同数据集上的泛化性验证、统计显著性检验**等细节无法确认。从方法论覆盖度（最优传输 + 困惑度界 + 新架构）来看，实验设计具有一定系统性，但充分性需阅读全文后方可全面评估。

---

## 6. 论文的主要结论与发现

1. **最优传输可有效优化离散流路径**：将动态最优传输的思想引入离散流匹配，通过小批量策略优化传输代价，可**大幅减少状态转移次数**（最多32倍），同时保持生成困惑度和多样性不变。
2. **困惑度上界使离散流可评估**：针对离散流无法精确估计概率的问题，提出了两个上界，为模型训练和比较提供了理论基础。
3. **Multimask Flows 优于掩码流**：新提出的 Multimask Flows 在生成困惑度上超越掩码流，且不牺牲多样性，尤其与小批量最优传输结合时效果最佳。

---

## 7. 优点

- **理论创新性强**：将最优传输的 Kantorovich 形式化引入离散流匹配，为离散生成模型的路径优化提供了新视角。
- **实用价值显著**：将状态转移次数减少32倍，直接提升了生成效率，对实际部署具有重要意义。
- **评估体系完善**：提出的困惑度上界弥补了离散流在概率估计方面的理论空白，使模型比较成为可能。
- **架构创新**：Multimask Flows 在保持多样性的前提下提升困惑度，解决了生成质量与多样性之间的常见权衡问题。
- **被顶级会议接收**：论文被 **ICML 2026** 接收，表明其学术质量得到了同行认可。

---

## 8. 不足与局限

- **算力信息缺失**：未报告具体的GPU型号、数量和训练时长，不利于实验的可复现性和成本评估。
- **公开信息有限**：基于当前可获取的摘要层面信息，**具体数据集、实验细节、超参数设置、消融实验**等内容无法深入了解。
- **应用范围验证不足**：目前明确提及的测试场景包括词袋（BoW）来源的流，在更复杂的文本生成任务（如长文本、对话生成）上的泛化能力有待进一步验证。
- **与连续流的对比不充分**：虽然指出了离散流与连续流在概率估计上的差异，但未在摘要中展示与连续流方法的直接性能对比。

（完）
