---
title: Riemannian MeanFlow for One-Step Generation on Manifolds
title_zh: 黎曼平均流：流形上的单步生成
authors: "Zichen Zhong, Haoliang Sun, Yukun Zhao, Yongshun Gong, Yilong Yin"
date: 2026-04-30
pdf: "https://openreview.net/pdf/81634e766612d082f2c40e6d5d51541e08a66c1f.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 黎曼平均流用于流形上单步生成
tldr: 流匹配在黎曼流形上仍需数值积分采样，本文提出黎曼平均流RMF，将平均流扩展到流形生成，通过平行传输定义平均速度场，推导黎曼平均流恒等式实现内禀监督，利用对数映射避免轨迹模拟，实现单步生成，显著加速采样。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 流匹配在流形上采样仍需ODE积分，需实现单步生成以加速。
method: 定义平行传输平均速度场，推导恒等式进行内禀监督，并用对数映射简化计算。
result: 实现单步生成，避免轨迹模拟，提高了采样效率。
conclusion: RMF为流形上的流匹配提供了高效单步生成框架。
---

## Abstract
Flow Matching enables simulation-free training of generative models on Riemannian manifolds, yet sampling typically still relies on numerically integrating a probability-flow ODE. We propose Riemannian MeanFlow (RMF), extending MeanFlow to manifold-valued generation where velocities lie in location-dependent tangent spaces. RMF defines an average-velocity field via parallel transport and derives a Riemannian MeanFlow identity that links average and instantaneous velocities for intrinsic supervision. We make this identity practical in a log-map tangent representation, avoiding trajectory simulation and heavy geometric computations. For stable optimization, we decompose the RMF objective into two terms and apply conflict-aware multi-task learning to mitigate gradient interference. RMF also supports conditional generation via classifier-free guidance. Experiments on spheres, tori, SO(3), and SE(3) demonstrate competitive one-step sampling with improved quality–efficiency trade-offs and substantially reduced sampling cost.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机与背景**

扩散模型与流匹配方法已在黎曼流形上的生成建模中占据主导地位，并在蛋白质骨架生成、DNA序列设计等科学应用中取得显著成功。然而，这些方法在推理时通常需要进行数十到数百次神经网络评估（NFE），通过数值积分概率流常微分方程（ODE）来完成采样。在大规模科学采样工作流中，这一计算开销成为关键瓶颈。

**核心问题**

本文旨在解决黎曼流形上生成模型推理成本高昂的问题——如何在保持生成质量的同时，将推理所需的神经网络评估次数从数十、数百次降至单次（one-step）。

**整体含义**

论文提出**黎曼平均流（Riemannian MeanFlow, RMF）** ，将平均流（MeanFlow）方法扩展至流形值生成场景，使模型能够直接在学习到的流图上以单次前向传播完成高质量生成。

---

## 二、论文提出的方法论

**核心思想**

RMF的核心思想是：在黎曼流形上定义并学习一个“平均速度场”，使得从先验分布到目标分布的映射可以通过单步完成，而无需沿ODE轨迹逐步积分。

**关键技术细节**

1. **平行传输平均速度场**：由于流形上各点的速度位于位置相关的切空间中，RMF通过平行传输（parallel transport）在不同切空间之间迁移速度向量，从而定义一个全局一致的“平均-速度场”。

2. **黎曼平均流恒等式**：推导了一个连接“平均速度”与“瞬时速度”的恒等式，为模型训练提供内禀（intrinsic）监督信号。

3. **对数映射切线表示**：将上述恒等式在对数映射（log-map）的切线表示中实现，从而避免轨迹模拟和繁重的几何计算。

4. **稳定优化策略**：将RMF目标函数分解为两项，并采用冲突感知多任务学习（conflict-aware multi-task learning）来缓解梯度干扰，提升训练稳定性。

5. **条件生成支持**：RMF通过无分类器引导（classifier-free guidance）支持条件生成。

**算法流程简述**

- **训练阶段**：利用黎曼平均流恒等式构建内禀监督目标，通过平行传输处理切空间速度，并在对数映射表示下高效计算损失；采用目标分解与冲突感知多任务学习稳定优化。
- **推理阶段**：学习到的流图可直接将输入的噪声样本映射为目标流形上的样本，仅需**单次前向传播**，无需任何ODE/SDE数值积分。

---

## 三、实验设计

**数据集与场景**

实验覆盖了多个典型流形结构：

| 流形 | 应用场景 |
|------|---------|
| 球面（Sphere） | 基础几何验证 |
| 环面（Torus） | 基础几何验证 |
| SO(3) | 三维旋转建模 |
| SE(3) | 刚体变换建模（机器人抓取） |
| DNA序列 | 概率单纯形上的序列设计 |
| 蛋白质骨架 | SE(3)ⁿ上的蛋白质生成 |

**Benchmark与对比方法**

论文对比了黎曼流匹配（Riemannian Flow Matching）和黎曼一致性模型（Riemannian Consistency Model）等前期方法。

**实验规模**

实验覆盖了**至少6类**不同的流形/应用场景（球面、环面、SO(3)、SE(3)-Grasp、DNA、蛋白质），并包含条件生成实验（通过无分类器引导）。

---

## 四、资源与算力

**论文中未明确说明具体的GPU型号、数量或训练时长。**

从GitHub仓库的代码结构可以推断：实验在GPU环境下运行（配置文件包含`trainer=gpu`），部分实验（如SO(3)）标注为CPU也可运行。SE(3)-Grasp实验使用单个GPU（`CUDA_VISIBLE_DEVICES=0`）。

但论文正文中**没有提供**训练迭代次数、GPU型号、训练总时长等具体算力信息。

---

## 五、实验数量与充分性

**实验数量**

论文进行了**多组**实验，涵盖：
- 4种基础流形（球面、环面、SO(3)、SE(3)）
- 2个科学应用场景（DNA序列设计、蛋白质骨架生成）
- 消融实验（通过目标分解与冲突感知多任务学习的稳定性验证）
- 条件生成实验

**充分性与客观性评估**

- **优势**：实验覆盖了从基础几何验证到实际科学应用的完整层次，流形类型多样（紧致流形、非紧致流形、矩阵李群等），对比了领域内主流基线方法，设计较为全面。
- **不足**：由于论文原文未被完整获取，无法判断是否包含详细的超参数敏感性分析、统计显著性检验或多次重复实验的标准差报告。此外，缺乏与更多近期方法（如Riemannian Diffusion Models的其他变体）的横向对比。

总体而言，实验设计在**广度上较为充分**，但**深度细节**（如具体数值结果、误差棒等）因信息有限无法完整评估。

---

## 六、论文的主要结论与发现

1. **RMF实现了流形上的单步生成**：通过学习流图直接映射，推理时仅需一次前向传播，彻底摆脱了ODE/SDE数值积分的依赖。

2. **采样效率显著提升**：相比传统流匹配方法（需数十至数百次NFE），RMF的推理成本大幅降低。

3. **生成质量具有竞争力**：在球面、环面、SO(3)和SE(3)等流形上，RMF的单步采样质量可与多步方法媲美，实现了质量与效率的更好权衡。

4. **方法具有通用性**：RMF支持条件生成、适用于多种流形结构，并在DNA和蛋白质等实际科学任务中验证了有效性。

---

## 七、优点

**方法论亮点**

1. **首创性**：首次将平均流（MeanFlow）框架推广到黎曼流形上的生成任务，填补了流形上单步生成方法的空白。

2. **几何内禀性**：通过平行传输和黎曼平均流恒等式，所有操作均具有几何内禀性，不依赖于坐标选择。

3. **计算高效**：通过对数映射切线表示，避免了轨迹模拟和繁重的几何计算，使训练在实际中可操作。

4. **优化稳定**：目标分解+冲突感知多任务学习的组合策略有效缓解了梯度干扰问题。

5. **应用价值高**：在蛋白质骨架生成、DNA序列设计等科学任务中，推理速度的提升直接关系到实际可用性。

**实验设计亮点**

- 覆盖了从低维流形到高维科学应用的完整验证链条
- 在多个具有实际科学意义的任务（DNA、蛋白质）上进行了验证
- 代码已开源，便于复现和后续研究

---

## 八、不足与局限

1. **算力信息缺失**：论文未提供训练所需的GPU型号、数量、训练时长等具体信息，不利于其他研究者评估复现成本。

2. **高维流形挑战**：虽然论文在DNA和蛋白质任务上进行了验证，但方法在高维复杂流形（如长序列蛋白质）上的可扩展性仍需进一步验证。

3. **生成质量上限**：单步生成在理论上可能难以达到多步ODE积分的精度上限，论文虽报告“具有竞争力”但未明确量化与多步方法的质量差距。

4. **对比方法覆盖面**：主要对比了流匹配和一致性模型，与更多近期流形生成方法（如Riemannian Diffusion Models的变体）的对比可能不足。

5. **应用限制**：对于需要在生成过程中进行中间状态干预或轨迹优化的任务（如某些蛋白质设计流程），单步“端到端”映射可能不如多步方法灵活。

---

（完）
