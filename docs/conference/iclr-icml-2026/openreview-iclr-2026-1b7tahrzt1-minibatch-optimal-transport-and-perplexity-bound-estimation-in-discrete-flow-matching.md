---
title: Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching
title_zh: 离散流匹配中的小批量最优传输与困惑度界估计
authors: "Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=1B7tAhrzT1"
tags: ["query:dgs-fm"]
score: 6.0
evidence: 离散流匹配结合最优传输用于分类数据生成
tldr: 该论文针对离散流匹配中随机路径导致的状态转移过多问题，提出了动态最优传输最小化目标，并导出其Kantorovich形式，通过小批量策略优化状态间相似性传输代价。在词袋数据上，该方法将所需转移步数从1024降至128，显著提升了离散生成模型的效率，为分类数据上的概率路径建模提供了有效工具。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 离散流匹配因路径随机性无法应用整流策略，需要新方法减少状态转移数。
method: 提出类最优传输目标，利用小批量优化状态间传输代价，降低转移步数。
result: 在词袋数据上将转移步数减少8倍，达到相同性能。
conclusion: 最优传输策略可有效优化离散流匹配的路径效率，适用于分类数据生成。
---

## Abstract
Discrete flow matching, a recent framework for modeling categorical data, has shown competitive performance with autoregressive models. However, unlike continuous flow matching, the rectification strategy cannot be applied due to the stochasticity of discrete paths, necessitating alternative methods to minimize state transitions. We propose a dynamic-optimal-transport-like minimization objective and derive its Kantorovich formulation for discrete flows with convex interpolants, where transport cost depends solely on inter-state similarity and can be optimized via minibatch strategies. In the case of bag-of-words (BoW) sourced flows, we show that such methods can reduce the number of transitions up to 8 times (1024 to 128) to reach the same generative perplexity without compromising diversity. Additionally, path nondeterminism in discrete flows precludes an instantaneous change-of-variables analogue, preventing precise probability estimation available to continuous flows. We therefore propose two upper bounds on perplexity, enabling principled training, evaluation and model comparison. Finally, we introduce Multimask Flow which outperforms masked flows in generative perplexity without sacrificing diversity, particularly when utilizing minibatch Optimal Transport.

---

## 论文详细总结（自动生成）

# 离散流匹配中的小批量最优传输与困惑度界估计——论文分析总结


## 一、论文的核心问题与整体含义

**研究动机：**

- 离散流匹配（Discrete Flow Matching, DFM）是近年来提出的用于建模分类数据（categorical data）的生成框架，在性能上已与自回归模型（autoregressive models）形成竞争。
- 然而，离散流匹配面临一个关键瓶颈：与连续流匹配（continuous flow matching）不同，离散路径的随机性（stochasticity）使得**整流策略（rectification strategy）无法直接应用**。整流策略原本可以有效地减少连续流模型中的状态转移步数，但在离散场景下失效。
- 因此，亟需**替代方法来最小化离散流中的状态转移次数**，以提升生成效率。

**核心问题：**

> 如何在保持生成质量（困惑度）和样本多样性（diversity）的前提下，**显著减少离散流匹配模型生成过程中的状态转移步数**，并实现对离散流模型概率估计的可靠评估？

**整体含义：**

该论文从**最优传输（Optimal Transport, OT）** 的理论视角切入，为离散流匹配提供了一条系统性的效率优化路径——通过优化“状态间传输代价”来减少冗余的状态跃迁，同时提出**困惑度上界（upper bounds on perplexity）** 来解决离散流无法精确估计概率密度的理论缺陷。


## 二、论文提出的方法论

**核心思想：**

- 论文提出一个**类动态最优传输（dynamic-optimal-transport-like）的最小化目标**，用于在离散流的训练过程中直接优化状态转移的效率。
- 其关键洞察在于：离散流中的传输代价（transport cost）仅依赖于**状态间的相似性（inter-state similarity / dissimilarity）** 。因此，通过优化状态间的匹配关系，可以减少不必要的状态跃迁。

**关键技术细节：**

1. **Kantorovich 形式推导**：对于具有**凸插值（convex interpolants）** 的离散流，论文推导了上述最小化目标的**Kantorovich 形式化表述**。这意味着该优化问题可以转化为经典最优传输问题的对偶形式，从而可以利用最优传输理论的成熟工具进行求解。

2. **小批量优化策略（Minibatch Strategy）** ：传输代价可通过**小批量策略（minibatch strategies）** 进行优化。这意味着在训练过程中，每次只在一个小批量样本上计算和优化状态间的传输代价，而不是在整个数据集上，从而在计算可行性与优化效果之间取得平衡。

3. **困惑度上界估计**：由于离散流的路径非确定性（path nondeterminism）**不存在瞬时变量替换（instantaneous change-of-variables）的连续类比**，因此无法像连续流那样精确估计概率密度。为此，论文提出**两个困惑度上界（two upper bounds on perplexity）** ，使得离散流模型的训练、评估和模型比较可以在原则性的框架下进行。

4. **Multimask Flow**：论文最后介绍了**Multimask Flow**——一种新型离散流变体，它在生成困惑度上**优于掩码流（masked flows）** ，同时不牺牲样本多样性，尤其在与小批量最优传输结合时表现更佳。


## 三、实验设计

> ⚠️ **说明**：用户提供的摘要和元数据中**未详细披露**实验设计的具体信息。以下基于可获取的摘要内容进行总结。

**实验场景：**

- 论文在**词袋（Bag-of-Words, BoW）数据**上进行了实验验证。词袋数据是分类数据生成中的典型基准场景，常用于文本数据的生成建模。

**Benchmark 与对比方法：**

- 对比了**掩码流（masked flows）** 与论文提出的 **Multimask Flow**。
- 评估指标包括**生成困惑度（generative perplexity）** 和**样本多样性（diversity）** 。
- 论文声称离散流匹配整体上与**自回归模型（autoregressive models）** 具有竞争性表现。

> ⚠️ **缺失信息**：摘要中**未明确提及**具体使用了哪些数据集（如文本数据的规模、来源）、具体的 benchmark 对比方法列表、以及消融实验的设计细节。


## 四、资源与算力

> ⚠️ **说明**：用户提供的摘要和元数据中**完全没有提及**任何关于计算资源的信息。

- 未说明使用的 GPU 型号、数量。
- 未说明训练时长或推理时间。
- 未说明模型参数量或训练 batch size 等硬件相关细节。

**结论：论文摘要中未披露算力相关信息。**


## 五、实验数量与充分性

> ⚠️ **说明**：基于用户提供的摘要内容，实验细节极为有限。

**已知的实验内容：**

- **主实验**：在 BoW 数据上验证小批量最优传输对状态转移步数的缩减效果。
- **对比实验**：Multimask Flow 与 masked flows 的困惑度对比。
- **多样性验证**：确认效率提升的同时未牺牲样本多样性。

**充分性评估：**

- **不充分**。从摘要来看，实验覆盖范围较窄：仅提及 BoW 数据这一种场景，未见多数据集、多任务或多领域的广泛验证。
- **缺乏消融实验**的明确说明（如小批量大小对性能的影响、不同传输代价函数的影响等）。
- 由于完整的 PDF 内容未能获取（OpenReview 页面需要验证），无法确认正文中是否有更丰富的实验设计。**基于摘要信息判断，实验的充分性和广度有待加强。**


## 六、论文的主要结论与发现

1. **小批量最优传输可显著减少状态转移步数**：在词袋数据场景下，该方法可将所需的状态转移步数从 **1024 步减少至 128 步**（即**减少 8 倍**），同时达到相同的生成困惑度，且不牺牲样本多样性。（注：论文不同版本中该数字有差异，v5 版本称可达 **32 倍**缩减，即 1024→32。）

2. **离散流无法精确估计概率密度**：由于路径非确定性缺乏瞬时变量替换的类比，离散流无法像连续流那样提供精确的概率估计。

3. **困惑度上界提供了原则性的评估框架**：论文提出的两个困惑度上界使得离散流模型的训练、评估和模型比较成为可能。

4. **Multimask Flow 优于掩码流**：新提出的 Multimask Flow 在生成困惑度上超越了 masked flows，且结合小批量最优传输时效果更佳，同时保持了样本多样性。


## 七、优点（方法或实验设计的亮点）

1. **理论贡献清晰**：将最优传输理论引入离散流匹配，并推导了 Kantorovich 形式，为离散流的路径效率优化提供了**坚实的数学基础**。

2. **问题定位精准**：准确识别了离散流匹配相较于连续流匹配的核心短板——**无法应用整流策略**，并针对性地提出了替代方案。

3. **实用性强**：小批量优化策略使得该方法在**实际训练中具有计算可行性**，而非仅停留在理论层面。

4. **评估体系完善**：提出的困惑度上界**填补了离散流模型概率估计的理论空白**，使得模型比较有了统一的量化标准。

5. **效率提升显著**：将状态转移步数减少 8 倍（甚至 32 倍）的成果是**可量化的实质性改进**，对离散生成模型的实际部署具有重要意义。

6. **开源代码**：论文代码已在 GitHub 上公开（https://github.com/ehaxholli/DFM-OT-B），有利于复现和后续研究。


## 八、不足与局限

1. **实验覆盖有限**：从摘要来看，实验仅在**词袋（BoW）数据**上进行了验证。BoW 是一种相对简单的分类数据表示，论文未说明该方法在**更复杂的文本数据（如长文本、自然语言句子）** 或其他模态的分类数据（如图像离散化、蛋白质序列等）上的表现。

2. **对比基线偏少**：摘要中仅明确提及与 **masked flows** 的对比。未提及是否与更广泛的基线方法（如其他离散扩散模型、自回归模型、离散流匹配的其他变体）进行了系统对比。

3. **算力信息缺失**：未报告任何训练成本或硬件需求，**不利于读者评估方法的实际部署门槛**。

4. **实验细节不透明**：由于摘要篇幅限制，**消融实验、超参数敏感性分析、不同小批量大小的影响**等关键实验细节均未提及。

5. **理论局限性**：论文自身也承认——离散流的路径非确定性导致**无法精确估计概率密度**，只能依赖上界进行近似评估。这意味着该方法**在需要精确概率估计的应用场景中存在固有局限**。

6. **应用范围待验证**：该方法目前针对的是**分类数据（categorical data）** 场景，其在**混合数据类型（连续+离散）** 或**高维离散空间**中的泛化能力尚不明确。

7. **论文状态**：该论文投稿至 **ICLR 2026 并被拒收（Rejected）** ，其评审意见中可能指出了更多未被摘要覆盖的不足之处【0†元数据】。


**（完）**
