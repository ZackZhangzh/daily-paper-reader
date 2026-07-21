---
title: "3DGS$^2$-TR: A Scalable Second-Order Trust-Region Method for 3D Gaussian Splatting"
title_zh: 3DGS²-TR：可扩展的3D高斯泼溅二阶信任域优化方法
authors: "Roger Hsiao, Yuchen Fang, Xiangru Huang, Ruilong Li, Hesam Rabeti, Zan Gojcic, Javad Lavaei, James Demmel, Sophia Shao"
date: 2026-04-30
pdf: "https://openreview.net/pdf/550e03bfc4578347e1eac493ca829733afab8745.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 3DGS训练加速的二阶优化器
tldr: 针对3D高斯泼溅训练中非线性强、现有二阶优化器计算量大的问题，本文提出3DGS^2-TR，利用Hutchinson方法高效估计Hessian对角近似，实现矩阵无关的二阶信任域优化，在保持ADAM级复杂度的同时加速场景重建训练并保证稳定性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有3DGS优化器收敛慢或计算成本高。
method: 基于Hessian对角近似和Hutchinson估计，引入参数化信任域。
result: 实现O(n)复杂度，加速训练且稳定。
conclusion: 二阶信任域方法可高效加速3DGS场景训练。
---

## Abstract
We propose 3DGS$^2$-TR, a second-order optimizer for accelerating the scene training problem in 3D Gaussian Splatting (3DGS).     Unlike existing second-order approaches that rely on explicit or dense curvature representations, such as 3DGS-LM (Höllein et al., 2025) or 3DGS2 (Lan et al., 2025),
    our method approximates curvature using only the diagonal of the Hessian matrix, estimated efficiently via Hutchinson’s method. 
    Our approach is fully matrix-free and has the same complexity as ADAM (Kingma, 2024), $O(n)$ in both computation and memory costs.
    To ensure stable optimization in the presence of strong nonlinearity in the 3DGS rasterization process, we introduce a parameter-wise trust-region technique based on the squared Hellinger distance, regularizing updates to Gaussian parameters.
    Under identical parameter initialization and without densification, 3DGS$^2$-TR is able to achieve better reconstruction quality on standard datasets, using 50\% fewer training iterations compared to ADAM, while incurring less than 1GB of peak GPU memory overhead (17\% more than ADAM and 85\% less than 3DGS-LM),
    enabling scalability to very large scenes and potentially to distributed training settings.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

3D高斯泼溅（3D Gaussian Splatting, 3DGS）作为一种显式场景表示方法，凭借其优越的渲染质量和实时渲染速度，在新视角合成领域迅速成为主流。然而，3DGS的训练过程仍然耗时较长，通常需要数十分钟甚至数小时。

现有工作尝试引入二阶优化器来加速3DGS训练，但存在明显瓶颈：部分方法依赖显式或密集的曲率表示，计算与存储成本高昂。例如，3DGS-LM和3DGS2等二阶方法虽然能加速收敛，但其显式构建Hessian矩阵的方式导致内存开销巨大，难以扩展到大规模场景。

针对上述问题，本文提出了 **3DGS²-TR**，一种**可扩展的二阶信任域优化方法**，旨在以接近ADAM的计算和内存复杂度，实现二阶优化的加速效果，同时保证训练的稳定性。


## 2. 方法论：核心思想与关键技术细节

### 核心思想

3DGS²-TR的核心思想是：**在不显式构建完整Hessian矩阵的前提下，利用其对角近似来捕获曲率信息**，从而在保持低计算成本的同时获得二阶优化的加速效果。

### 关键技术细节

- **Hessian对角近似与Hutchinson方法**：论文使用Hutchinson方法高效估计Hessian矩阵的对角线元素，以此近似曲率。该方法完全**无矩阵（matrix-free）** ，无需显式存储或构建完整的Hessian矩阵。

- **复杂度优势**：3DGS²-TR的计算和内存复杂度均为 **O(n)** ，与ADAM处于同一量级。这意味着它在大规模场景下具有良好的可扩展性。

- **参数化信任域机制**：3DGS的栅格化过程具有很强的非线性，直接应用二阶更新可能导致优化不稳定。为此，论文引入了**基于平方Hellinger距离的参数化信任域技术**，对每个高斯参数的更新步长进行正则化约束，确保优化过程的稳定性。


## 3. 实验设计

### 数据集与场景

论文在**标准数据集**上进行了评估。关于具体使用了哪些数据集（如Mip-NeRF360、Tanks&Temples、Deep Blending等3DGS领域常用基准），现有摘要文本未逐一列出。

### 对比方法

论文将3DGS²-TR与以下方法进行了对比：

- **ADAM**：作为一阶优化基线的代表
- **3DGS-LM**：依赖显式曲率表示的二阶优化方法
- **3DGS2**：另一种二阶优化方法

### 评估设置

实验在**相同参数初始化且不进行致密化（densification）** 的条件下进行，保证了对比的公平性。


## 4. 资源与算力

摘要文本中**未明确说明**实验所使用的GPU型号、数量及具体训练时长。

不过，论文明确报告了以下**内存开销**数据：

- 峰值GPU内存开销 **< 1GB**
- 相比ADAM多 **17%** 的内存占用
- 相比3DGS-LM少 **85%** 的内存占用

这一内存效率使得该方法能够扩展到**非常大的场景**，并**具备分布式训练的潜力**。


## 5. 实验数量与充分性

从现有摘要文本来看：

- 论文在**标准数据集**上进行了评估，并报告了**重建质量**和**训练迭代次数**等核心指标。
- 对比了**ADAM、3DGS-LM、3DGS2**三种代表性方法。
- 报告了**内存开销**的定量对比。

**关于消融实验、多数据集的详细结果、不同超参数设置下的表现等**，现有摘要文本未提供具体信息。总体而言，从摘要披露的内容来看，实验设计在对比公平性（相同初始化、无致密化）方面做得较好，但实验的**广度（数据集数量、场景类型）和深度（消融分析）有待进一步查阅论文正文才能全面评估**。


## 6. 主要结论与发现

1. **训练加速显著**：在相同参数初始化和无致密化的条件下，3DGS²-TR使用**比ADAM少50%的训练迭代次数**，即可达到更好的重建质量。

2. **内存效率优越**：峰值GPU内存开销不足1GB，比3DGS-LM减少85%，仅比ADAM多17%。

3. **可扩展性强**：低内存开销使得该方法能够扩展到非常大的场景，并具备分布式训练的潜力。

4. **二阶优化的可行路径**：通过Hessian对角近似与信任域正则化的结合，二阶优化可以以O(n)复杂度高效应用于3DGS训练。


## 7. 优点（亮点）

| 维度 | 亮点 |
|------|------|
| **算法设计** | 首次将Hutchinson方法与信任域机制结合用于3DGS训练，实现了二阶优化的“轻量化” |
| **复杂度控制** | O(n)的计算和内存复杂度与ADAM相当，突破了传统二阶优化器的高成本瓶颈 |
| **稳定性保障** | 基于平方Hellinger距离的参数化信任域技术，有效应对了3DGS栅格化的强非线性问题 |
| **实验公平性** | 在相同参数初始化和无致密化的条件下进行对比，排除了初始化差异和致密化策略带来的干扰 |
| **实用价值** | 内存开销极低（<1GB），具备大规模场景和分布式训练的实用性 |


## 8. 不足与局限

1. **实验细节披露有限**：从摘要文本来看，具体使用的数据集名称、场景数量、定量指标（PSNR/SSIM/LPIPS等）的完整对比表格等信息未在摘要中呈现。

2. **消融研究未见**：摘要中未提及对信任域半径、Hutchinson采样次数等超参数的消融实验分析。

3. **致密化策略的剥离**：论文在“无致密化”条件下进行评估，这有助于证明优化器本身的优越性，但实际3DGS训练中致密化是重要环节，该方法与致密化策略的兼容性和协同效果有待验证。

4. **训练时长数据缺失**：虽然迭代次数减少50%，但每轮迭代的计算开销是否增加、总训练时间是否相应缩短，摘要中未给出具体数据。

5. **应用场景覆盖**：摘要未提及是否在大规模场景（如城市级重建）、动态场景或稀疏视角等更具挑战性的设定下进行了验证。

---

（完）
