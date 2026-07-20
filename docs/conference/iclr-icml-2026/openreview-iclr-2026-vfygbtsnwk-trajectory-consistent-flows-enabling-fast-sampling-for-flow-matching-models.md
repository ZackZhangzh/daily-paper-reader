---
title: "Trajectory-Consistent Flows: Enabling Fast Sampling for Flow Matching Models"
title_zh: 轨迹一致流：实现流匹配模型的快速采样
authors: "Chenfeng Miao, Qingying Zhu, Minchuan Chen, Shaojun Wang, Jing Xiao"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=VFYGBTSNWK"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 通过轨迹一致公式加速流匹配采样
tldr: 扩散和流匹配模型生成质量高但采样慢，依赖迭代求解器。本文提出轨迹一致流（TCF），基于泰勒展开联合优化流匹配模型和快速采样代理，通过二阶近似实现仅需5步的高保真生成。扩展到三阶可进一步提升。该方法在保持生成质量的同时大幅减少采样时间，为流匹配的实际部署提供了高效方案。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 流匹配和扩散模型采样缓慢，难以满足实时生成需求。
method: 基于泰勒展开联合优化流匹配模型和快速采样代理，构造轨迹一致近似。
result: 仅需5步采样即可达到高保真生成，显著降低计算成本。
conclusion: 轨迹一致流有效加速流匹配采样，为高效生成提供了新途径。
---

## Abstract
Diffusion and flow matching models have recently achieved remarkable generative performance, but their reliance on iterative ODE or SDE solvers results in slow and computationally expensive sampling.
In this work, we introduce Trajectory-Consistent Flows (TCF), a framework that unifies efficient training and accelerated sampling through a Taylor-expansion-based formulation. TCF jointly optimizes a flow matching model $p_{\theta}$ and a fast-sampling surrogate $q_{\theta}$ via a unified objective. We construct $q_{\theta}$ using a second-order Taylor expansion as a trajectory-consistent approximation of $p_{\theta}$'s ODE flow, enabling high-fidelity generation with as few as 5 sampling steps. We further extend this idea to a third-order expansion, achieving additional performance gains without increasing computational cost.  With further architectural and training enhancements, TCF achieves significantly improved sampling quality while retaining fast and stable training, making it particularly suitable for real-time generative applications.

---

## 论文详细总结（自动生成）

# 轨迹一致流（TCF）：实现流匹配模型的快速采样——论文深度解析

## 1. 论文的核心问题与整体含义

- **研究动机**：扩散模型（Diffusion Models）和流匹配模型（Flow Matching Models）在生成任务中取得了卓越的性能，但其生成过程依赖于迭代式的常微分方程（ODE）或随机微分方程（SDE）求解器，导致采样速度慢、计算成本高昂。这一问题严重制约了该类模型在实时生成应用中的部署。

- **核心问题**：如何在保持流匹配模型生成质量的前提下，大幅减少采样步数、加速推理过程。

- **整体含义**：论文提出了一种名为**轨迹一致流（Trajectory-Consistent Flows, TCF）** 的全新框架，通过泰勒展开从理论上统一了高效训练与加速采样，使得模型仅需约5步采样即可达到高保真生成效果，为流匹配模型的实际部署提供了高效可行的解决方案。


## 2. 方法论

- **核心思想**：TCF构建了一个统一的训练框架，**联合优化**一个标准的流匹配模型 $p_{\theta}$ 和一个用于快速采样的代理模型 $q_{\theta}$。其关键创新在于利用泰勒展开构造 $q_{\theta}$，使其作为 $p_{\theta}$ 的ODE流在轨迹意义上的近似。

- **关键技术细节**：
    - **二阶泰勒展开构造**：$q_{\theta}$ 被构造为 $p_{\theta}$ 的ODE流的二阶泰勒展开近似，从而实现轨迹一致的逼近。
    - **三阶扩展**：该方法可进一步扩展至三阶泰勒展开，在不增加计算成本的前提下获得额外的性能提升。
    - **参数化形式**：TCF采用基于指数积分器的半线性结构来构造轨迹一致性函数。以一阶TCF为例，其形式为：
        $$\bar{\bm{f}}_{\bm{\theta}}^{-ss}(\bm{x}_{t},t)=\frac{\sigma_{s}}{\sigma_{t}}\bm{x}_{t}-\alpha_{s}(e^{-h}-1)\hat{\bm{x}}_{\bm{\theta}}(\bm{x}_{t},t)$$
        二阶TCF则在上述基础上引入了中点时刻 $u$ 的校正项。
    - **误差界**：TCF的离散化误差为 $\mathcal{O}(h_{\Delta t}^{k+1})$，其中 $k$ 为TCF的阶数。
    - **双模型采样策略**：框架包含 $p_{\theta}$ 和 $q_{\theta}$ 两个模型分布，既可通过求解 $p_{\theta}$ 定义的神经ODE进行采样，也可直接评估 $q_{\theta}$ 的映射实现快速采样。$q_{\theta}$ 的二阶或三阶时间导数在初始点处解析可得，使得从 $p_{\theta}$ 采样时可使用二阶ODE求解器，相比传统一阶方法精度和效率更高。


## 3. 实验设计

- **数据与场景**：论文元数据中**未明确列出**具体使用的数据集名称和生成场景（如图像生成、视频生成等）。

- **Benchmark与对比方法**：元数据中**未详细说明**对比了哪些基线方法。从问题背景推断，对比对象可能包括标准流匹配（Flow Matching）、一致性模型（Consistency Models）以及扩散模型等主流生成框架，但具体对比设置需参考论文原文。

- **评估指标**：元数据中**未明确提及**所使用的定量评估指标（如FID、IS等）。


## 4. 资源与算力

- **未明确说明**：在提供的论文摘要和元数据中，**没有提及**具体的GPU型号、数量、训练时长等算力信息。

- **训练开销分析**：从论文中关于计算成本的讨论来看，TCF在训练阶段引入了额外的计算开销。具体而言，强制速度一致性（velocity-consistency）需要对网络进行基于梯度的方向计算（gradient-based directional computations），这比单纯的值一致性（value-consistency）训练要昂贵得多。不过论文指出，这些前向传播在原始的自一致性计算中已经存在，因此并未引入额外的前向计算成本，主要额外开销来自额外的速度评估。


## 5. 实验数量与充分性

- **实验数量**：论文元数据中**未提供**具体的实验组数、消融实验设计或详细的实验配置信息。

- **充分性评估**：由于缺乏详细的实验描述（数据集、对比方法、评估指标、消融实验等），**无法从现有信息中充分判断**实验的全面性和客观性。元数据中提到的“进一步架构和训练增强”暗示作者可能进行了消融实验或变体对比，但具体细节需查阅论文全文。


## 6. 论文的主要结论与发现

- TCF通过基于泰勒展开的轨迹一致公式，成功实现了流匹配模型的快速采样。
- 仅需 **5步采样**即可达到高保真生成质量，大幅降低了计算成本。
- 将TCF扩展至**三阶泰勒展开**可在不增加计算成本的前提下进一步提升生成性能。
- TCF在保持快速稳定训练的同时显著提升了采样质量，特别适用于**实时生成应用**场景。


## 7. 优点

- **理论创新性强**：将泰勒展开引入流匹配模型的加速采样框架，从理论上统一了高效训练与加速采样，为后续研究提供了新的理论视角。
- **采样效率提升显著**：仅需5步采样即可达到高质量生成，相比传统迭代式求解器（通常需要数十甚至数百步）实现了数量级的加速。
- **阶数可扩展**：方法天然支持从二阶扩展至三阶，且高阶扩展不增加计算成本，具有良好的可扩展性。
- **双模型灵活采样**：同时提供 $p_{\theta}$ 和 $q_{\theta}$ 两种采样路径，兼顾了标准精度和快速生成两种需求。
- **实际部署价值高**：特别适合对实时性要求高的生成应用场景。


## 8. 不足与局限

- **训练成本较高**：强制速度一致性需要基于梯度的方向计算，训练开销显著高于仅约束值一致性的方法。
- **实验细节缺失**：从公开的摘要和元数据中无法获知具体的实验配置、数据集、对比方法和评估指标，难以全面评估方法的泛化能力和实际效果。
- **应用领域未明确**：论文未具体说明TCF在哪些生成任务（如图像、视频、音频等）上进行了验证，其在不同模态和数据规模上的适用性尚不明确。
- **理论分析深度未知**：虽然提到了误差界 $\mathcal{O}(h_{\Delta t}^{k+1})$，但对于泰勒展开近似在复杂数据分布下的误差传播和累积效应缺乏更深入的分析。


（完）
