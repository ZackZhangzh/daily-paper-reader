---
title: Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching
title_zh: 离散流匹配中的小批量最优传输与困惑度界估计
authors: "Etrit Haxholli, Yeti Z. Gurbuz, Oğul Can, Eli Waxman"
date: 2026-04-30
pdf: "https://openreview.net/pdf/2894f62a416bc956ecf7f75bd865edda54717e59.pdf"
tags: ["query:dgs-fm"]
score: 6.0
evidence: 离散数据的流匹配优化
tldr: 本文针对离散流匹配提出动态最优传输最小化目标，并推导其Kantorovich形式，采用小批量策略优化传输代价。与连续流匹配不同，离散路径具有随机性，该方法有效减少状态转移次数，在保持生成困惑度不变的前提下将转移数从1024降至32，显著提升了离散流匹配的效率。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 离散流匹配难以应用连续路径的整流策略，状态转移开销大。
method: 推导基于Kantorovich的最优传输目标，使用小批量策略优化离散流。
result: 转移次数减少32倍且生成质量不受影响。
conclusion: 小批量最优传输可有效加速离散流匹配训练。
---

## Abstract
Discrete flow matching, a recent framework for modeling categorical data, has shown competitive performance with autoregressive models. However, unlike continuous flow matching, the rectification strategy cannot be applied due to the stochasticity of discrete paths, necessitating alternative methods to minimize state transitions. We propose a dynamic-optimal-transport-like minimization objective and derive its Kantorovich formulation for discrete flows with convex interpolants, where transport cost depends solely on inter-state dissimilarity and can be optimized via minibatch strategies. We show that such methods can reduce the number of transitions up to 32 times (1024 to 32) to reach the same generative perplexity without compromising diversity. Additionally, path nondeterminism in discrete flows precludes an instantaneous change-of-variables analogue, preventing precise probability estimation available to continuous flows. We therefore propose two upper bounds on perplexity, enabling principled training, evaluation and model comparison. Finally, we introduce Multimask Flows which outperform masked flows in generative perplexity without compromising diversity, particularly when utilizing minibatch Optimal Transport.

---

## 论文详细总结（自动生成）

# 论文总结：Minibatch Optimal Transport and Perplexity Bound Estimation in Discrete Flow Matching

## 1. 核心问题与整体含义

- **研究背景**：离散流匹配（Discrete Flow Matching, DFM）是近年来用于建模分类数据（如文本）的新兴框架，已展现出与自回归模型相竞争的性能。然而，与连续流匹配不同，离散路径的固有机性导致**整流策略（rectification strategy）无法直接应用**，这要求探索替代方法来最小化状态转移。
- **核心问题**：离散流匹配面临两个关键挑战——（1）如何有效减少生成过程中的状态转移次数以提升效率；（2）离散路径的非确定性使得无法像连续流那样进行精确的概率估计。
- **研究含义**：本文旨在通过引入**小批量最优传输（minibatch Optimal Transport）** 和**困惑度上界估计**，系统性地解决离散流匹配的训练效率与评估精度问题，从而推动离散流匹配在分类数据生成任务中的实用化。


## 2. 方法论

- **核心思想**：将离散流匹配中的状态转移最小化问题重新解释为**动态最优传输的离散类比**。由于离散流中的路径是状态序列，本文探索最小化状态之间的跳跃次数，这可以理解为连续情形中路径长度最小化的离散对应物。
- **关键技术细节**：
    - 利用状态间的**不相似性函数（dissimilarity function）** 对跳跃进行加权，构建了一个**加权路径长度导向的动态最优传输（OT）目标**，并推导出其**Kantorovich形式**，适用于具有**凸插值（convex interpolants）** 的离散流。
    - 传输代价仅取决于**状态间的不相似性**，可通过**小批量策略**进行优化。
    - 针对离散路径非确定性导致的精确概率估计不可行问题，提出了**两种困惑度上界**，为训练、评估和模型比较提供了理论依据。
- **算法流程**：训练时，在每个小批量内计算最优传输耦合，重新配对源序列与目标序列，使得状态转移路径更短、跳跃更少；推理时，使用训练好的模型以更少的转移步数完成生成。
- **模型创新**：提出了**Multimask Flows**，这是一种优于传统掩码流（masked flows）的新模型，尤其在结合小批量最优传输时表现突出。


## 3. 实验设计

- **数据集与场景**：
    - **小规模概念验证实验**：使用**Morse-code转换的Shakespeare数据集**（小型词汇表），验证定理能否有效减少跳跃。
    - **大规模 realistic 设置**：使用**OpenWebText（OWT）数据集**，训练**GPT-2规模的模型**（序列长度 L=128）。
- **基准与对比方法**：
    - 对比**普通（Normal）离散流匹配**（无OT优化）与**带OT的离散流匹配**（不同Sinkhorn熵正则化系数 ε）。
    - 对比**掩码流（masked flows）** 与本文提出的**Multimask Flows**。
- **评估指标**：使用**生成困惑度（generative perplexity）** 和**多样性（diversity）** 作为主要评估指标。还统计了**跳跃次数（number of jumps）** 和**相对跳跃数（Relative Jumps, RJ）** 。


## 4. 资源与算力

- **未明确说明具体GPU型号、数量和训练时长**。论文中仅提到使用POT库（Flamary et al., 2021）计算最优小批量耦合，并指出**小批量OT的开销是实用的且可扩展的（practical and scales favorably）** 。代码已开源在 https://github.com/ehaxholli/DFM-OT 。


## 5. 实验数量与充分性

- **实验组数**：
    - 小规模概念验证实验（Shakespeare Morse-code数据集）。
    - 大规模 realistic 实验（GPT-2规模模型 on OWT）。
    - **消融实验**：对**OT批大小、OT求解器、OT-EMA（指数移动平均）** 三个关键因素进行了消融研究。
- **充分性评估**：实验设计**较为充分**，覆盖了从小规模概念验证到大规模 realistic 场景的完整链条，并包含消融实验分析关键超参数的影响。但论文摘要与全文均未详细列出所有数据集的完整结果表格，实验覆盖的数据集类型相对有限（主要集中在文本数据），**对不同类型分类数据（如图像、图结构数据）的泛化性有待进一步验证**。


## 6. 主要结论与发现

- **效率提升显著**：小批量最优传输可将状态转移次数**减少高达32倍（从1024步降至32步）**，同时保持相同的生成困惑度和多样性。不同版本论文中报告的缩减倍数略有差异（8倍至32倍），取决于具体设置。
- **困惑度上界有效**：提出的两种困惑度上界为离散流匹配提供了**原则性的训练、评估和模型比较框架**。
- **Multimask Flows优势**：新提出的Multimask Flows在生成困惑度上**优于传统掩码流**，且不牺牲多样性，尤其在结合小批量最优传输时效果更佳。
- **小批量OT开销可控**：Sinkhorn OT的计算开销是**实用的且随规模扩展良好**。


## 7. 优点

- **理论创新性强**：首次将动态最优传输的Kantorovich形式化引入离散流匹配，为该领域提供了**坚实的数学理论基础**。
- **效率提升显著**：**32倍的推理步数缩减**是离散流匹配效率上的重大突破。
- **填补评估空白**：针对离散流无法精确估计概率的根本性问题，提出了**困惑度上界**这一实用解决方案。
- **模型创新**：Multimask Flows为离散流匹配的模型设计提供了**新方向**。
- **代码开源**：代码已公开，**可复现性强**。


## 8. 不足与局限

- **实验覆盖有限**：实验主要集中在文本数据（Shakespeare、OpenWebText），**对图像、图结构、蛋白质序列等其他类型分类数据的验证不足**。
- **缩减倍数不一致**：不同论文版本（arXiv v3/v4/v5 与 ICML 版本）中报告的转移次数缩减倍数存在差异（8倍 vs 32倍），**可能源于实验设置不同，但未在摘要中明确解释**。
- **OT额外开销**：虽称开销可控，但小批量最优传输的计算本身**引入了额外的训练时开销**，在大规模场景下的净收益需要更细致的权衡分析。
- **理论保证的边界**：困惑度上界是**上界而非精确值**，其紧度（tightness）在复杂实际场景中可能需要进一步验证。
- **应用限制**：方法目前针对离散流匹配框架设计，**能否推广到其他离散生成模型（如离散扩散模型）尚不明确**。


（完）
