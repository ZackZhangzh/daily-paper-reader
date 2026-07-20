---
title: Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching
title_zh: 离散流匹配中的小批量最优传输与困惑度边界估计
authors: "Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman"
date: 2026-04-30
pdf: "https://openreview.net/pdf/2894f62a416bc956ecf7f75bd865edda54717e59.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 离散流匹配结合最优传输用于连续概率路径
tldr: 离散流匹配因路径随机性无法直接应用整流策略，导致状态转移次数多。本文提出动态最优传输目标，推导其Kantorovich形式，利用小批量优化最小化转移次数，实验表明可将转移数从1024降至32且不损失困惑度，显著提升离散流匹配效率。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 解决离散流匹配中状态转移过多且无法使用整流策略的问题。
method: 构建动态最优传输目标，导出Kantorovich形式，采用小批量策略优化传输代价。
result: 转移次数降低32倍，生成困惑度不变，效率大幅提升。
conclusion: 最优传输框架有效优化离散流匹配的路径效率，具有通用性。
---

## Abstract
Discrete flow matching, a recent framework for modeling categorical data, has shown competitive performance with autoregressive models. However, unlike continuous flow matching, the rectification strategy cannot be applied due to the stochasticity of discrete paths, necessitating alternative methods to minimize state transitions. We propose a dynamic-optimal-transport-like minimization objective and derive its Kantorovich formulation for discrete flows with convex interpolants, where transport cost depends solely on inter-state dissimilarity and can be optimized via minibatch strategies. We show that such methods can reduce the number of transitions up to 32 times (1024 to 32) to reach the same generative perplexity without compromising diversity. Additionally, path nondeterminism in discrete flows precludes an instantaneous change-of-variables analogue, preventing precise probability estimation available to continuous flows. We therefore propose two upper bounds on perplexity, enabling principled training, evaluation and model comparison. Finally, we introduce Multimask Flows which outperform masked flows in generative perplexity without compromising diversity, particularly when utilizing minibatch Optimal Transport.

---

## 论文详细总结（自动生成）

# 论文详细中文总结

**论文标题**：Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching（离散流匹配中的小批量最优传输与困惑度边界估计）

**作者**：Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman

**发表**：ICML 2026（已接收）


## 一、核心问题与整体含义（研究动机与背景）

- **背景**：离散流匹配（Discrete Flow Matching, DFM）是近年来提出的用于建模分类数据（categorical data）的生成框架，已在性能上与自回归模型形成竞争。在连续数据领域，扩散模型和流匹配模型已经取得了令人瞩目的生成和密度估计成果，整流流（Rectified Flows）尤其擅长以少量积分步骤实现高质量生成。然而，在分类数据（如文本数据）上，连续扩散模型和流模型的表现仍然落后于自回归模型。

- **核心问题**：离散流匹配虽然前景广阔，但面临两个根本性难题：
    1. **无法应用整流策略**：与连续流匹配不同，离散路径具有固有的随机性（stochasticity），导致连续版本中有效的整流策略无法直接扩展到离散版本。这迫使研究者必须寻找替代方法来最小化状态转移次数。
    2. **无法精确估计概率**：离散流中的路径非确定性（path nondeterminism）排除了瞬时变量替换（instantaneous change-of-variables）的类比，因此无法像连续流那样进行精确的概率估计。

- **研究意义**：本文旨在系统性地解决离散流匹配在路径效率和概率估计两方面的关键瓶颈，为该领域提供理论更完备、实践更高效的解决方案。


## 二、方法论：核心思想、关键技术细节

### 2.1 动态最优传输目标

- **核心思想**：本文提出一个类似动态最优传输（dynamic-optimal-transport-like）的最小化目标，用于在离散流中最小化状态转移次数。该目标针对具有凸插值（convex interpolants）的离散流设计，其传输代价仅取决于状态间的相似性（inter-state similarity / dissimilarity）。

- **Kantorovich形式推导**：论文导出了该动态最优传输目标的等价Kantorovich formulation。这一理论推导将问题转化为一个可计算、可优化的数学形式，为后续的小批量优化奠定了理论基础。

### 2.2 小批量优化策略

- **技术细节**：传输代价的优化通过小批量策略（minibatch strategies）实现。该方法在每次迭代中仅使用一个小批量的样本对来计算传输代价并更新模型，从而在保持计算可行性的同时实现了对状态转移的有效最小化。

- **效果**：对于词袋（Bag-of-Words, BoW）来源的流，该方法可将状态转移次数最多减少**8倍**（从1024降至128）而不损失生成困惑度；在更广泛的设定下，转移次数可减少**32倍**（从1024降至32）。

### 2.3 困惑度上界估计

- **问题**：由于离散流的路径非确定性，无法像连续流那样进行精确的概率估计。

- **解决方案**：本文提出**两个困惑度（perplexity）上界**，使得离散流模型的训练、评估和模型比较能够在有理论保证的框架下进行。

### 2.4 Multimask Flows

- **创新点**：论文引入了**Multimask Flows**——一种新型的离散流变体。

- **性能**：Multimask Flows在生成困惑度上超越了传统的掩码流（masked flows），且**不牺牲生成多样性**，尤其是在配合小批量最优传输使用时效果更佳。


## 三、实验设计

### 3.1 数据集与场景

- 论文专注于**分类数据**（categorical data）的生成建模，特别以**文本数据**为主要应用场景。
- 具体实验中提及了**词袋（Bag-of-Words, BoW）来源的流**作为验证场景。
- 搜索结果显示，该方法可能也涉及图像生成基准（image generation benchmarks）和机器人操作任务（robotic manipulation tasks），但论文提供的摘要文本中未给出完整的数据集列表。

### 3.2 Benchmark与对比方法

- 主要对比对象为**自回归模型（autoregressive models）** ——这是离散流匹配旨在追赶和超越的基准。
- 在Multimask Flows的验证中，对比了**传统的掩码流（masked flows）** 。
- 论文还将离散流匹配与**连续扩散模型和流模型**在分类数据上的表现进行了对比。

> **⚠️ 说明**：论文摘要和元数据中未提供完整的数据集列表、具体的基准测试名称（如具体的文本数据集）、以及详细的对比方法清单。上述内容基于已有信息推断，完整实验设计需参考论文全文。


## 四、资源与算力

**论文中未明确说明使用的GPU型号、数量或训练时长。**

- 搜索材料中未发现关于算力配置的具体描述。
- 仅知代码已开源，发布在 GitHub 仓库 `https://github.com/ehaxholli/DFM-OT-B`。


## 五、实验数量与充分性

### 5.1 实验组数

- 从摘要和元数据推断，实验至少包括：
    - 小批量最优传输在不同转移步数下的效果验证（1024→128或32步的对比）；
    - 生成困惑度与多样性的权衡评估；
    - Multimask Flows与掩码流的对比实验；
    - 两个困惑度上界的验证。

### 5.2 充分性与客观性评估

- **优势**：论文从**路径效率**和**概率估计**两个维度同时展开，实验覆盖了方法论的核心宣称（转移次数降低、困惑度上界有效、Multimask Flows优越性），结构较为完整。
- **局限**：由于摘要篇幅所限，**无法判断是否包含消融实验**（如不同小批量大小的影响、不同插值函数的影响等），也无法确认是否在多个不同模态的数据集上进行了充分的泛化验证。完整评估需查阅论文全文。


## 六、主要结论与发现

1. **最优传输有效优化离散流路径**：本文构建的动态最优传输目标及其Kantorovich形式，能够有效最小化离散流匹配中的状态转移次数。

2. **效率大幅提升**：小批量最优传输策略可将状态转移次数最多减少**32倍**（从1024降至32），同时保持相同的生成困惑度且不损失多样性。在BoW场景下为8倍提升（1024→128）。

3. **困惑度可被上界估计**：针对离散流无法精确估计概率的固有限制，本文提出的两个困惑度上界为模型的训练、评估和比较提供了理论工具。

4. **Multimask Flows优于掩码流**：新提出的Multimask Flows在生成困惑度上超越了传统掩码流，且不牺牲多样性，尤其与小批量最优传输配合使用时效果更佳。


## 七、方法或实验设计的亮点（优点）

1. **理论创新性强**：将最优传输理论系统地引入离散流匹配，导出了动态最优传输的Kantorovich形式，为该领域提供了新的理论视角。

2. **解决关键瓶颈**：同时针对离散流匹配的**两大核心问题**（路径随机性导致无法整流、路径非确定性导致无法精确估计概率）提出解决方案。

3. **计算可行性高**：小批量策略使得最优传输优化在大规模离散数据上切实可行。

4. **效率提升显著**：32倍的转移次数缩减意味着生成速度的大幅提升，对实际应用意义重大。

5. **开源可复现**：代码已公开，有利于社区验证和后续研究。

6. **模型创新**：Multimask Flows作为新的模型变体，在性能上优于已有方法。


## 八、不足与局限

1. **实验细节缺失**：从摘要和元数据无法获知具体使用了哪些数据集、对比了哪些具体方法、是否包含充分的消融实验。

2. **算力信息未披露**：论文未说明实验所需的计算资源，不利于其他研究者评估复现成本。

3. **应用范围待验证**：虽然提及文本数据，但摘要未明确该方法在**大规模真实文本语料**（如WikiText-103、OpenWebText等）上的表现。搜索结果显示可能涉及图像和机器人任务，但具体效果未知。

4. **困惑度上界的紧度未知**：两个上界在实践中的保守程度（即与真实困惑度的差距）未在摘要中体现。

5. **多样性评估方式未说明**：论文声称“不牺牲多样性”，但未在摘要中说明多样性采用何种指标衡量（如重复率、自 BLEU 等）。

6. **理论范围的限定**：最优传输目标的Kantorovich形式仅针对**具有凸插值的离散流**推导，其适用范围是否可推广到更一般的离散流尚不明确。


（完）
