---
title: Reweighted Flow Matching via Unbalanced OT for Label-free Long-tailed Generation
title_zh: 基于非平衡最优传输重加权流匹配的无标签长尾生成
authors: "Hyunsoo Song, Minjung Gim, Jaewoong Choi"
date: 2025-09-13
pdf: "https://openreview.net/pdf?id=sNJ2zrlT13"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 用于长尾分布的流匹配生成模型
tldr: 提出无标签非平衡最优传输重加权流匹配，解决长尾分布生成中的多数偏差问题，通过逆重加权策略提升少数类样本保真度。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 标准流匹配在长尾分布下偏向多数类，少数类保真度低。
method: 用小批量非平衡最优传输构建条件向量场，并采用无标签逆重加权策略。
result: 有效缓解多数偏差，提升少数类生成质量。
conclusion: 非平衡最优传输为流匹配提供鲁棒重加权范式，适用于不平衡数据生成。
---

## Abstract
Flow matching has recently emerged as a powerful framework for continuous-time generative modeling. However, when applied to long-tailed distributions, standard flow matching suffers from majority bias, producing minority modes with low fidelity and failing to match the true class proportions. In this work, we propose Unbalanced Optimal Transport Reweighted Flow Matching (UOT-RFM), a novel framework for generative modeling under class-imbalanced (long-tailed) distributions that operates without any class label information. Our method constructs the conditional vector field using mini-batch Unbalanced Optimal Transport (UOT) and mitigates majority bias through a principled inverse reweighting strategy. The reweighting relies on a label-free majority score, defined as the density ratio between the target distribution and the UOT marginal. This score quantifies the degree of majority based on the geometric structure of the data, without requiring class labels. By incorporating this score into the training objective, UOT-RFM theoretically recovers the target distribution with first-order correction ($k=1$) and empirically improves tail-class generation through higher-order corrections ($k > 1$). Our model outperforms existing flow matching baselines on long-tailed benchmarks, while maintaining competitive performance on balanced datasets.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究动机**：流匹配（Flow Matching）是近年来兴起的一类连续时间生成模型框架，在图像生成等任务中表现出色。然而，当应用于**长尾分布**（类别极度不平衡的数据集）时，标准流匹配存在严重的**多数偏差（majority bias）** 问题——模型过度关注多数类样本，导致少数类模式生成质量低下，且生成样本的类别比例无法匹配真实分布。

**核心问题**：如何在**不依赖任何类别标签**的前提下，让流匹配模型在长尾数据上公平地学习所有类别，尤其是提升少数类的生成保真度。

**整体含义**：论文提出了 **UOT-RFM**（Unbalanced Optimal Transport Reweighted Flow Matching），即基于非平衡最优传输的重加权流匹配方法，试图在无标签场景下解决长尾分布生成中的多数偏差问题。


## 2. 方法论

**核心思想**：通过非平衡最优传输（Unbalanced Optimal Transport, UOT）估计一个**无标签的多数类得分（majority score）** ，然后用该得分的倒数对训练损失进行重加权，从而将训练信号向少数类倾斜。

**关键技术细节**：

- **条件向量场构建**：使用**小批量非平衡最优传输**来构建源分布与目标分布之间的耦合，并据此构造条件向量场。与传统的OT-CFM相比，UOT允许源分布与目标分布之间存在质量不匹配，更适合处理类别不平衡场景。

- **无标签多数类得分**：定义为**目标分布与UOT边际分布之间的密度比**。该得分无需类别标签，仅依赖数据的几何结构来量化每个样本的“多数程度”。

- **逆重加权策略**：将多数类得分的倒数作为损失函数中的样本权重，使得多数类样本的贡献被压低，少数类样本的贡献被放大。

- **高阶校正**：引入权重指数 \( k \) 来控制校正强度：
  - \( k=1 \)：一阶校正，理论上可精确恢复目标分布
  - \( k>1 \)：高阶校正，进一步强调少数类模式

- **集成便捷性**：该方法可轻松集成到现有的CFM/OT-CFM流程中，无需额外标签或复杂的重采样操作。


## 3. 实验设计

**数据集**：
- 合成长尾数据（synthetic long-tail data）
- **CIFAR-10-LT**（CIFAR-10的长尾版本）
- **CIFAR-100-LT**（CIFAR-100的长尾版本）
- 其他长尾基准数据集

**Benchmark与对比方法**：
- 对比了现有的流匹配基线方法（如标准FM、CFM、OT-CFM等）
- 评估指标包括：**FID**（Fréchet Inception Distance）、**Precision**、**Recall**、**F1-score**，以及**类别比例对齐程度**（class proportion alignment）

**实验场景**：涵盖合成数据与真实图像数据，验证方法在长尾分布下的生成多样性与保真度。


## 4. 资源与算力

**论文原文及公开信息中均未明确说明**所使用的GPU型号、数量、训练时长等计算资源细节。摘要、OpenReview页面及相关介绍材料中均未涉及算力配置信息。


## 5. 实验数量与充分性

**实验数量**：
- 至少涵盖了**合成数据**、**CIFAR-10-LT**、**CIFAR-100-LT**等多组长尾基准实验
- 在长尾数据集上对比了多个流匹配基线方法
- 在**平衡数据集**上也进行了验证，以证明方法不会牺牲平衡场景下的性能
- 设计了 \( k=1 \) 与 \( k>1 \) 的对比，验证不同阶次校正的效果

**充分性与客观性评估**：
- 实验覆盖了**合成数据与真实图像数据**两个层面，有一定说服力
- 在**长尾和平衡两种场景**下均进行了验证，设计较为全面
- 使用了**FID、Precision、Recall、F1-score**等多维度评估指标，评估角度较全面
- **局限性**：仅公开了CIFAR系列的长尾版本，缺乏在更大规模或更高分辨率数据集（如ImageNet-LT）上的验证；对比方法主要限于流匹配家族，未与更广泛的长尾生成方法（如GAN、扩散模型等）进行充分对比


## 6. 主要结论与发现

- 标准流匹配（包括OT-CFM）在长尾分布下存在**多数偏差**问题，训练信号过度集中于多数类
- UOT-RFM通过**无标签的逆重加权策略**，能够有效缓解多数偏差，显著提升少数类的生成质量
- **理论保证**：一阶重加权（\( k=1 \)）可精确恢复目标分布
- **实验验证**：UOT-RFM在长尾基准上**优于现有流匹配基线**，在F1-score等综合指标上表现出更好的精确率-召回率权衡
- 在平衡数据集上**保持有竞争力的性能**，未因重加权而显著退化


## 7. 优点

- **无标签设定**：方法完全不依赖类别标签，这在许多实际场景（如数据标注缺失或隐私受限）中具有重要价值
- **理论严谨性**：提供了偏差校正定理，证明一阶重加权可精确恢复目标分布，有坚实的理论基础
- **几何驱动的多数类得分**：多数类得分基于数据的几何结构而非标签定义，具有更好的泛化性和可解释性
- **即插即用**：可轻松集成到现有CFM/OT-CFM流程中，无需额外标签或复杂重采样，工程成本低
- **可控的校正强度**：通过指数 \( k \) 灵活控制校正强度，\( k=1 \) 保证理论正确性，\( k>1 \) 可进一步强化少数类
- **平衡场景兼容**：在平衡数据集上仍保持竞争力，说明方法不会“矫枉过正”


## 8. 不足与局限

- **算力信息缺失**：未报告任何关于GPU型号、数量、训练时长的信息，不利于实验的可复现性评估
- **数据集规模有限**：实验主要局限于CIFAR系列的长尾版本，缺乏在ImageNet-LT等更大规模、更高分辨率长尾数据集上的验证
- **对比方法范围较窄**：主要与流匹配家族方法对比，未与更广泛的长尾生成方法（如重采样GAN、长尾扩散模型等）进行充分比较
- **高阶校正的机理**：\( k>1 \) 虽实证有效，但其理论性质（如是否仍保证分布恢复）未充分阐明
- **应用场景限制**：方法针对图像生成任务设计，在文本、视频、时序数据等其他模态上的泛化能力尚未验证
- **偏差风险**：逆重加权可能过度放大少数类中的噪声样本，导致生成质量下降的风险未充分讨论


（完）
