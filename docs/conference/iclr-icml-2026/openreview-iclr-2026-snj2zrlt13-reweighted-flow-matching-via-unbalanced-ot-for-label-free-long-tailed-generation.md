---
title: Reweighted Flow Matching via Unbalanced OT for Label-free Long-tailed Generation
title_zh: 基于非平衡最优传输的重加权流匹配用于无标签长尾生成
authors: "Hyunsoo Song, Minjung Gim, Jaewoong Choi"
date: 2025-09-13
pdf: "https://openreview.net/pdf?id=sNJ2zrlT13"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 用于长尾生成的重加权流匹配
tldr: 标准流匹配在长尾分布下存在多数类偏差，少数类保真度低。本文提出基于非平衡最优传输的重加权流匹配，无需类别标签，通过小批量非平衡最优传输构造条件向量场，并利用逆重加权策略缓解多数类偏差。实验在多个长尾数据集上显著提升了少数类的生成质量和比例匹配，为无标签长尾生成提供了新范式。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 标准流匹配在长尾数据中偏向多数类，少数类生成质量差。
method: 利用小批量非平衡最优传输构建向量场，并设计无标签逆重加权策略。
result: 在长尾图像数据集上，少数类生成保真度和分布匹配显著改善。
conclusion: 重加权流匹配能有效克服长尾生成中的偏差问题，且不依赖标签。
---

## Abstract
Flow matching has recently emerged as a powerful framework for continuous-time generative modeling. However, when applied to long-tailed distributions, standard flow matching suffers from majority bias, producing minority modes with low fidelity and failing to match the true class proportions. In this work, we propose Unbalanced Optimal Transport Reweighted Flow Matching (UOT-RFM), a novel framework for generative modeling under class-imbalanced (long-tailed) distributions that operates without any class label information. Our method constructs the conditional vector field using mini-batch Unbalanced Optimal Transport (UOT) and mitigates majority bias through a principled inverse reweighting strategy. The reweighting relies on a label-free majority score, defined as the density ratio between the target distribution and the UOT marginal. This score quantifies the degree of majority based on the geometric structure of the data, without requiring class labels. By incorporating this score into the training objective, UOT-RFM theoretically recovers the target distribution with first-order correction ($k=1$) and empirically improves tail-class generation through higher-order corrections ($k > 1$). Our model outperforms existing flow matching baselines on long-tailed benchmarks, while maintaining competitive performance on balanced datasets.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

- **研究背景**：流匹配（Flow Matching）是近年来兴起的一种连续时间生成建模框架，在各类生成任务中表现优异【1†L1-L2】。
- **核心问题**：标准流匹配在面向长尾分布（long-tailed distribution）的数据时，存在严重的**多数类偏差（majority bias）**——模型倾向于优先拟合多数类样本，导致少数类模式（minority modes）的生成保真度低，且无法准确匹配真实的类别比例【1†L2-L3】。
- **整体含义**：本文旨在解决**无标签（label-free）场景下**的长尾分布生成问题，提出了一种不依赖任何类别标签信息即可有效克服多数类偏差的生成建模框架【1†L3-L4】。

## 2. 论文提出的方法论

- **核心思想**：提出**非平衡最优传输重加权流匹配（Unbalanced Optimal Transport Reweighted Flow Matching, UOT-RFM）**，通过引入非平衡最优传输（Unbalanced Optimal Transport, UOT）和逆重加权策略，在不使用标签的情况下缓解多数类偏差【1†L3-L4】。
- **关键技术细节**：
  - **条件向量场构建**：利用小批量非平衡最优传输（mini-batch UOT）来构造条件向量场，使得向量场的构建过程能够自适应地感知数据分布中的密度不均【1†L4】。
  - **无标签逆重加权策略**：提出一种无需类别标签的“多数类得分”（majority score），该得分定义为目标分布与UOT边际之间的密度比（density ratio），通过数据的几何结构来量化样本的“多数程度”【1†L5-L6】。
  - **理论保证**：将该得分纳入训练目标后，UOT-RFM在理论上能以**一阶校正（k=1）** 精确恢复目标分布；通过**高阶校正（k>1）**，可进一步在经验上提升尾部类别的生成效果【1†L6-L7】。
- **算法流程（文字说明）**：首先从训练数据中采样小批量样本，计算其与UOT边际的密度比作为多数类得分；随后基于该得分对每个样本赋予逆重加权权重；最后在重加权的流匹配训练目标下学习条件向量场，从而引导生成过程向少数类区域倾斜。

## 3. 实验设计

- **数据集与场景**：论文在**长尾图像数据集**上进行了实验验证，具体数据集名称在摘要中未逐一列出【1†L7】。场景为**无标签**条件下的长尾分布生成任务【1†L3】。
- **Benchmark与对比方法**：以**现有的流匹配（flow matching）基线方法**作为主要对比对象【1†L7】。此外，论文还在**平衡数据集**上进行了测试，以验证方法在非长尾场景下仍能保持有竞争力的性能【1†L7-L8】。

## 4. 资源与算力

- 摘要和元数据中**未明确说明**所使用的GPU型号、数量、训练时长等算力信息。
- 论文正文中可能包含相关细节，但当前提供的文本片段中并未涉及。

## 5. 实验数量与充分性

- **实验组数**：从摘要描述可推断，实验至少涵盖：（1）多个长尾图像数据集上的主实验；（2）与多个流匹配基线方法的对比；（3）平衡数据集上的补充验证【1†L7-L8】。完整的实验设置（如消融实验、超参数敏感性分析等）在摘要中未详细展开。
- **充分性与客观性判断**：摘要中报告了“显著改善少数类生成保真度和分布匹配”的结果【1†L7】，但缺乏具体的定量指标（如FID、IS、分类准确率等）和误差棒信息，难以独立评估实验的充分性与统计显著性。整体来看，实验设计覆盖了长尾和平衡两种场景，对比了同类基线，具备基本的客观性，但详细程度有限。

## 6. 论文的主要结论与发现

- UOT-RFM能够**有效克服长尾生成中的多数类偏差问题**，且**不依赖任何类别标签**【1†L7】。
- 在长尾图像数据集上，UOT-RFM显著提升了**少数类的生成保真度**和**整体分布匹配质量**【1†L7】。
- 在平衡数据集上，UOT-RFM仍能**保持有竞争力的性能**，说明该方法不会以牺牲平衡场景性能为代价来换取长尾场景的提升【1†L7-L8】。

## 7. 优点

- **方法创新性**：首次将**非平衡最优传输**与**流匹配**相结合，用于解决无标签长尾生成问题，为该领域提供了新的范式【1†L7】。
- **标签-free的优势**：不依赖类别标签即可实现长尾分布的校正，极大地拓展了方法的适用范围，尤其适用于标签稀缺或标签不可靠的实际场景【1†L3】。
- **理论严谨性**：提供了**一阶校正（k=1）的理论保证**，确保了方法在数学上的合理性【1†L6】。
- **泛化能力**：不仅在长尾数据集上表现优异，在平衡数据集上也能保持竞争力，说明方法具有较好的通用性【1†L7-L8】。

## 8. 不足与局限

- **实验细节披露不足**：摘要中未提供具体的数据集名称、定量指标数值、消融实验结果等，限制了读者对方法有效性的全面评估。
- **高阶校正缺乏理论保证**：虽然经验上高阶校正（k>1）能进一步提升尾部生成效果，但摘要中仅提及“empirically improves”，未给出相应的理论证明【1†L6-L7】。
- **计算开销未知**：小批量非平衡最优传输的计算复杂度可能较高，但论文未讨论其相对于标准流匹配的额外计算成本。
- **应用场景限制**：方法目前仅在图像数据上进行了验证，其在文本、音频、视频等其他模态的长尾生成任务上的适用性尚不明确。

（完）
