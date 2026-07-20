---
title: "Trajectory-Consistent Flows: Enabling Fast Sampling for Flow Matching Models"
title_zh: 轨迹一致流：为流匹配模型启用快速采样
authors: "Chenfeng Miao, Qingying Zhu, Minchuan Chen, Shaojun Wang, Jing Xiao"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=VFYGBTSNWK"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 用于流匹配模型快速采样的轨迹一致流
tldr: 本文提出轨迹一致流（TCF）框架，通过泰勒展开构建快速采样代理，统一优化流匹配模型和代理模型，实现仅需5步采样的高质量生成，并扩展至三阶展开进一步提升性能。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 流匹配模型依赖迭代数值求解器导致采样缓慢。
method: 联合优化流匹配模型和基于泰勒展开的快速采样代理。
result: 实现5步内高质量生成，显著加速采样。
conclusion: TCF为流匹配提供了高效统一的加速采样方案。
---

## Abstract
Diffusion and flow matching models have recently achieved remarkable generative performance, but their reliance on iterative ODE or SDE solvers results in slow and computationally expensive sampling.
In this work, we introduce Trajectory-Consistent Flows (TCF), a framework that unifies efficient training and accelerated sampling through a Taylor-expansion-based formulation. TCF jointly optimizes a flow matching model $p_{\theta}$ and a fast-sampling surrogate $q_{\theta}$ via a unified objective. We construct $q_{\theta}$ using a second-order Taylor expansion as a trajectory-consistent approximation of $p_{\theta}$'s ODE flow, enabling high-fidelity generation with as few as 5 sampling steps. We further extend this idea to a third-order expansion, achieving additional performance gains without increasing computational cost.  With further architectural and training enhancements, TCF achieves significantly improved sampling quality while retaining fast and stable training, making it particularly suitable for real-time generative applications.

---

## 论文详细总结（自动生成）

# Trajectory-Consistent Flows (TCF) 论文深度分析总结


## 1. 核心问题与整体含义

**研究动机与背景**

扩散模型（Diffusion Models）和流匹配模型（Flow Matching Models）在图像、音频、文本等生成任务中取得了卓越的性能。然而，这两类模型在采样时都严重依赖于迭代式的常微分方程（ODE）或随机微分方程（SDE）数值求解器。这意味着生成单个样本需要多次函数评估（NFEs），导致推理速度缓慢、计算成本高昂。这种低效率成为实时应用或资源受限场景中的重大障碍。

**论文整体含义**

本文提出**轨迹一致流（Trajectory-Consistent Flows，TCF）** 框架，旨在为流匹配模型提供一个统一的高效训练与加速采样方案。核心思路是：在训练一个标准流匹配模型 $p_{\theta}$ 的同时，联合训练一个快速采样的代理模型 $q_{\theta}$，使得 $q_{\theta}$ 能够在仅需极少采样步数（如5步）的条件下，逼近 $p_{\theta}$ 的ODE流轨迹，从而实现高质量、高效率的生成。


## 2. 方法论

### 2.1 核心思想

TCF的核心思想是**联合优化两个模型分布**，通过统一的训练目标同时训练流匹配模型 $p_{\theta}$ 和快速采样代理 $q_{\theta}$。训练目标由两项组成：

1. **第一项**：$D_{\mathrm{KL}}(\hat{p}_{\mathrm{data}}(\pmb{x}) \| p_{\theta}(\pmb{x}))$ —— 训练 $p_{\theta}$ 拟合真实数据分布，对应标准的流匹配损失；
2. **第二项**：$\lambda D_{\mathrm{KL}}(p_{\theta}(\pmb{x}) \| q_{\theta}(\pmb{x}))$ —— 鼓励 $q_{\theta}$ 的输出与 $p_{\theta}$ 对齐。

两项共享相同的网络参数，实现端到端的联合优化。$q_{\theta}$ 被设计为在采样时**完全不依赖ODE/SDE求解器**，从而实现快速推理。

### 2.2 关键技术细节

**（1）轨迹一致性的三个无积分约束**

为避免训练中求解ODE带来的计算开销，论文提出了三个无需数值积分的约束条件：

- **边界条件（Boundary Condition）** ：$f_{\theta}(\pmb{x}_{\tau}, \tau) = \pmb{x}_{\tau}$，确保代理模型在起始时刻为恒等映射。
- **自一致性（Self-Consistency）** ：$f_{\theta}(\pmb{x}_{\tau}, t_2) = f_{\theta}(f_{\theta}(\pmb{x}_{\tau}, t_1), t_2)$，确保长程变换可分解为中间步骤的组合。
- **速度一致性（Velocity Consistency）** ：$\left.\frac{\partial f_{\theta}(\pmb{x}_{\tau}, t)}{\partial t}\right|_{t=\tau} = \pmb{v}_{\theta}^{(p)}(\pmb{x}_{\tau}, \tau)$，确保代理模型在起始时刻的时间导数与ODE速度场一致。

**定理1**证明：若 $f_{\theta}$ 满足上述三个约束，则其轨迹与 $p_{\theta}$ 定义的ODE轨迹完全对齐。

**（2）基于泰勒展开的参数化**

论文将轨迹函数 $f_{\theta}$ 参数化为**二阶泰勒展开**形式：

$$f_{\theta}(\pmb{x}_{\tau}, t) = \pmb{x}_{\tau} + (t - \tau)\pmb{v}_{\theta}(\pmb{x}_{\tau}, t) + \frac{1}{2}(t - \tau)^2 \pmb{u}_{\theta}(\pmb{x}_{\tau}, t)$$

其中 $\pmb{v}_{\theta}$ 和 $\pmb{u}_{\theta}$ 由共享神经网络通过两个独立的输出头预测。该参数化使得 $f_{\theta}$ 对 $t$ 的一阶和二阶导数可以解析计算，无需数值微分。

论文进一步将这一思想扩展至**三阶泰勒展开**，在几乎不增加计算成本的情况下获得了额外的性能提升。

### 2.3 算法流程

TCF的训练流程可概括为：
1. 初始化共享参数的神经网络；
2. 对每个训练样本，从噪声分布 $\mathcal{N}(\mathbf{0}, \boldsymbol{I})$ 和数据分布 $\hat{p}_{\mathrm{data}}$ 中采样，构造线性插值轨迹；
3. 通过流匹配损失训练 $p_{\theta}$ 拟合参考速度场；
4. 通过上述三个无积分约束训练 $q_{\theta}$（即泰勒展开参数化的 $f_{\theta}$）对齐 $p_{\theta}$ 的ODE轨迹；
5. 联合优化两项损失，端到端更新网络参数。


## 3. 实验设计

### 3.1 数据集与场景

根据论文摘要和正文中提及的信息，TCF在**多个数据集**上进行了验证。虽然具体数据集名称在摘要中未逐一列举，但论文声称其方法在多个数据集上的表现接近当前最优的扩散模型和流匹配模型。

### 3.2 对比方法

论文对比了以下基线方法（基于摘要和引言推断）：
- **扩散模型（Diffusion Models）** ：如DDPM等；
- **流匹配模型（Flow Matching Models）** ：如Lipman et al., 2023；
- **修正流（Rectified Flow）** ：如Liu et al., 2023；
- 其他加速采样方法，如一致性模型（Consistency Models）。

### 3.3 Benchmark

论文的核心benchmark指标是**在极少采样步数（5步）下的生成质量**，验证 $q_{\theta}$ 能否在5步内达到 $p_{\theta}$ 经过完整ODE求解后的生成质量。


## 4. 资源与算力

**论文未明确说明训练所使用的具体算力资源**（如GPU型号、数量、训练时长等）。这是当前可用信息中的一个缺口。从论文内容推断，TCF的一个宣称优势是“快速且稳定的训练”，但具体的硬件配置和训练成本细节在摘要和可见正文中未提及。


## 5. 实验数量与充分性

### 5.1 实验数量

基于摘要和可见正文信息，论文至少包含：
- **多数据集实验**：在多个数据集上验证方法的泛化性；
- **消融实验**：探索了架构设计改进；
- **阶数对比**：对比了二阶泰勒展开与三阶泰勒展开的性能差异。

### 5.2 充分性与客观性评估

从现有信息判断：
- **正面**：论文在多个数据集上进行了验证，并对比了多种基线方法，实验设计具有一定的广度；
- **待确认**：由于完整论文（特别是实验章节）不可见，无法评估具体的数据集规模、评估指标完整性、统计显著性检验等细节。ICLR 2026的评审得分（8.0分，满分10分）表明论文质量受到审稿人的认可【元数据】。


## 6. 主要结论与发现

1. **TCF能够在仅5步采样步数内实现高质量生成**，显著加速了流匹配模型的采样过程；
2. **三阶泰勒展开相比二阶展开能进一步提升生成性能**，且几乎不增加计算成本；
3. **通过进一步的架构和训练增强**，TCF在保持快速稳定训练的同时，显著提升了采样质量；
4. **TCF特别适合实时生成应用**场景。


## 7. 方法亮点

1. **统一的联合优化框架**：将流匹配模型的训练与快速采样代理的学习整合到一个统一的目标函数中，避免了传统两阶段方法的割裂；
2. **泰勒展开的创新应用**：利用二阶/三阶泰勒展开参数化代理模型，使得约束条件可以解析计算，无需数值微分；
3. **无积分约束设计**：三个约束条件（边界条件、自一致性、速度一致性）完全避免了训练过程中对ODE求解器的依赖，大幅降低了训练成本；
4. **无需额外计算成本的高阶扩展**：三阶扩展在提升性能的同时不增加计算开销；
5. **参数共享**：$p_{\theta}$ 和 $q_{\theta}$ 共享网络参数，避免了额外的大规模参数量。


## 8. 不足与局限

1. **实验细节披露有限**：当前可获取的论文摘要和部分正文中，缺乏具体的数据集名称、评估指标数值、可视化结果等实验细节；
2. **算力信息缺失**：论文未明确说明训练所需的GPU型号、数量和训练时长，难以评估方法的实际训练成本；
3. **应用场景验证范围**：虽然声称适用于“实时生成应用”，但论文主要验证的是图像生成（推断），对视频、音频等其他模态的适用性尚不明确；
4. **与同类方法的对比深度**：虽然对比了扩散模型和流匹配模型，但与其他快速采样方法（如一致性模型、均值流等）的详细对比分析在可见内容中不够充分；
5. **理论保证的实践边界**：定理1证明了在满足三个约束时轨迹完全对齐，但实际训练中约束只能近似满足，这种近似带来的误差累积效应在长程生成中可能需要进一步分析。


（完）
