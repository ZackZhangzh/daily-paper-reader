---
title: "HRGS: Hierarchical Gaussian Splatting for Memory-Efficient High-Resolution 3D Reconstruction"
title_zh: HRGS：层次化高斯泼溅用于内存高效的高分辨率3D重建
authors: "Changbai Li, Haodong Zhu, Tongfei Chen, Shuo Yang, Shuwei Shao, Wenhao Dong, Hanlin Chen, Juan Zhang, Baochang Zhang"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=oVJ0wiKOJ0"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 层次化高斯泼溅用于高分辨率3D重建
tldr: 该论文提出层次化高斯泼溅（HRGS）框架，通过从粗到细的分层块级优化，解决高分辨率3D场景重建中的内存可扩展性瓶颈，显著降低内存占用。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 高分辨率3D重建面临严重内存瓶颈。
method: 分层块级优化，从粗到细，分区处理。
result: 减少内存占用，保持重建质量。
conclusion: 层次化策略提升3DGS可扩展性。
---

## Abstract
3D Gaussian Splatting (3DGS) has achieved significant progress in real-time 3D scene reconstruction. However, its application in high-resolution reconstruction scenarios faces severe memory scalability bottlenecks. To address this issue, we propose Hierarchical  Gaussian Splatting (HRGS), a memory-efficient framework with hierarchical block-level optimization from coarse to fine. Specifically, we first derive a global, coarse Gaussian representation from low-resolution data; we then partition the scene into multiple blocks and refine each block using high-resolution data. Scene partitioning comprises two steps: Gaussian partitioning and training data partitioning. In Gaussian partitioning, we contract irregular scenes into a normalized, bounded cubic space and employ a uniform grid to evenly distribute computational tasks among blocks; in training data partitioning, we retain only those observations that lie within their corresponding blocks or make significant contributions to the rendering results. By guiding each block’s refinement with the global coarse Gaussian prior, we ensure alignment and seamless fusion of Gaussians across adjacent blocks. To reduce computational resource demands, we introduce an Importance-Driven Gaussian Pruning (IDGP) strategy: during each block’s refinement, we compute an importance score for every Gaussian primitive and remove those with minimal rendering contribution, thereby accelerating convergence and reducing redundant computation and memory overhead. To further enhance surface reconstruction quality, we also incorporate normal priors from a pretrained model. Finally, even under memory-constrained conditions, our method enables high-quality, high-resolution 3D scene reconstruction. Extensive experiments on three public benchmarks demonstrate that our approach achieves state-of-the-art performance in high-resolution novel view synthesis (NVS) and surface reconstruction tasks.

---

## 论文详细总结（自动生成）

# HRGS：层次化高斯泼溅用于内存高效的高分辨率3D重建——论文深度分析

## 1. 核心问题与整体含义（研究动机与背景）

3D Gaussian Splatting（3DGS）作为一种新兴的3D场景表征方法，近年来在实时3D场景重建领域取得了显著进展。然而，3DGS在高分辨率重建场景下面临着**严重的内存可扩展性瓶颈**——当处理高分辨率图像时，大量的高斯基元会导致GPU内存迅速耗尽，限制了其在实际高精度重建任务中的应用。

针对这一问题，本文提出了**层次化高斯泼溅（Hierarchical Gaussian Splatting, HRGS）** 框架。其核心思想是：不试图一次性在内存中容纳全部高分辨率高斯表征，而是通过**从粗到细的分层块级优化策略**，在有限GPU内存条件下实现高质量、高分辨率的3D场景重建。该工作投稿至ICLR 2026，获得了**9.0分的评审评分**，表明其在该领域具有较高的学术价值。


## 2. 方法论

### 2.1 整体思想：从粗到细的分层优化

HRGS的核心方法论遵循“**先全局粗略，后局部精细**”的递进式重建思路：

1. **粗阶段**：首先从低分辨率数据中推导出一个全局性的粗糙高斯表征。
2. **细阶段**：将场景划分为多个块，使用高分辨率数据对每个块进行精细化重建。

### 2.2 场景分区（Scene Partitioning）

场景分区包含两个关键步骤：

- **高斯分区（Gaussian Partitioning）** ：将不规则场景通过空间压缩映射到一个归一化的有界立方体空间中。具体而言，采用公式对高斯位置进行压缩处理，然后使用**均匀网格**将场景划分为多个块（文中设为4个空间子块），确保计算任务在各块之间均匀分布。

- **训练数据分区（Training Data Partitioning）** ：为每个块分配训练数据时，仅保留那些位于对应块内或对渲染结果有显著贡献的观测数据。具体实现上，利用**SSIM损失**作为数据分区的基础——通过评估剔除某块高斯后的SSIM损失变化来判断哪些相机位姿对该块贡献显著；同时还纳入位于块空间边界内的相机位姿，最终合并两者得到每个块的训练数据分配。

### 2.3 粗高斯先验引导块级细化

每个块的细化过程由**全局粗高斯先验**进行引导。这一设计确保了相邻块之间高斯的**对齐与无缝融合**，避免了分块处理可能引入的边界不一致问题。

### 2.4 重要性驱动高斯剪枝（IDGP）

为减少计算资源消耗，本文提出了**Importance-Driven Gaussian Pruning（IDGP）** 策略：

- 在块级细化过程中，计算每个高斯基元与多视角训练射线之间的交互，评估其对渲染的贡献程度。
- 移除那些贡献极小的高斯基元。
- 在细化阶段，分别在**第10,000、15,000和25,000次迭代**时执行动态剪枝。

该策略显著加速了收敛速度，减少了冗余计算和内存开销。

### 2.5 表面重建增强：法向先验

为提升表面重建质量，本文引入了**预训练模型提供的法向先验**：

- 室外场景使用预训练的**DSINE**模型预测法向图。
- 室内场景使用预训练的**GeoWizard**模型预测法向图。
- 引入**视角一致的深度-法向正则化器（View-Consistent Depth-Normal Regularizer）** ，在粗高斯初始化和后续块级细化阶段均予以应用。

### 2.6 损失函数

损失函数涉及多个超参数：λ₁、λ₂、λ₃分别设为**1、0.01和0.015**。


## 3. 实验设计

### 3.1 数据集与评测基准

本文在**三个公开基准数据集**上进行了广泛实验：

| 任务类型 | 数据集 | 用途 |
|---------|--------|------|
| 高分辨率新视角合成（NVS） | **Mip-NeRF360** | 评估高分辨率NVS性能 |
| 高保真表面重建 | **Tanks and Temples（TNT）** | 评估表面重建质量 |
| 补充验证 | **Replica** | 进一步验证方法有效性 |

### 3.2 评测指标

综合采用以下标准指标：
- **SSIM**（结构相似性）
- **PSNR**（峰值信噪比）
- **LPIPS**（学习感知图像块相似度）
- **F1-score**（表面重建精度）
- **FPS**（帧率，评估渲染效率）

### 3.3 对比方法

- **NVS任务对比**：Mip-NeRF、Instant-NGP、Zip-NeRF、3DGS、3DGS+EWA、Mip-Splatting
- **表面重建任务对比**：NeuS、MonoSDF、SuGaR、3DGS、2DGS、VCR-GauS


## 4. 资源与算力

论文明确提到了硬件约束条件：**在NVIDIA A5000（24GB显存）等受限内存条件下仍能实现高质量重建**。

**关于具体的GPU型号、数量、训练时长等详细信息，论文正文中未做明确量化说明。** 仅提及粗阶段和细阶段各进行**30,000次迭代**，并给出了剪枝的时间节点（10,000、15,000、25,000次迭代）。


## 5. 实验数量与充分性

### 5.1 实验规模

- **3个公开数据集**（Mip-NeRF360、Tanks and Temples、Replica）
- **2个核心任务**（新视角合成 + 表面重建）
- **NVS任务对比6种方法**，**表面重建任务对比6种方法**
- 包含**消融实验**（文中提及IDGP和法向先验均有消融验证，Tab. 3展示了数据分区策略的效果）

### 5.2 充分性评估

**实验设计较为充分**：
- 覆盖了3D重建的两大核心子任务
- 对比方法涵盖NeRF-based和Gaussian-based两大流派
- 评测指标全面（图像质量+几何精度+渲染效率）
- 包含消融实验验证各模块贡献

**客观性与公平性**：
- 采用公开基准数据集，结果可复现
- 对比方法均为领域内主流SOTA方法
- 未发现明显的不公平对比倾向


## 6. 主要结论与发现

1. **HRGS在Mip-NeRF360数据集上取得了领先的NVS性能**：PSNR达到**27.91**，显著优于Mip-Splatting（26.22）和3DGS（19.59）等方法。
2. **在表面重建任务上同样达到SOTA水平**，证明了分层优化策略对几何重建的有效性。
3. **层次化块级优化策略有效解决了内存瓶颈**，使得在24GB显存条件下仍能进行高分辨率重建。
4. **IDGP动态剪枝策略**在训练过程中有效减少了冗余高斯基元，加速收敛并降低内存占用。
5. **粗高斯先验引导细化的分治策略**既保证了全局一致性（块间无缝融合），又实现了局部细节的高保真重建。


## 7. 优点（亮点）

| 维度 | 亮点说明 |
|------|----------|
| **问题定位** | 精准识别了3DGS在高分辨率场景下的内存可扩展性瓶颈，切中实际应用痛点 |
| **方法论创新** | “从粗到细”的分层块级优化范式，将全局一致性与局部精细重建有机结合 |
| **分区策略** | 高斯分区+数据分区的双重设计，兼顾了计算负载均衡与数据相关性 |
| **IDGP剪枝** | 动态、重要性驱动的剪枝策略，在训练过程中持续优化内存效率 |
| **表面重建增强** | 引入预训练法向先验，弥补了纯高斯表征在几何监督方面的不足 |
| **并行化潜力** | 各块可并行细化，具有良好的计算扩展性 |
| **实验全面** | 覆盖NVS和表面重建两大任务，对比方法充分，指标全面 |


## 8. 不足与局限

1. **算力信息不透明**：未明确报告训练所需的具体GPU型号、数量及总时长，不利于实际复现时的资源评估。
2. **分块数量固定**：文中将场景固定分为4个空间子块，对于极大规模场景或极精细重建需求，自适应分块策略可能更具优势。
3. **法向先验依赖预训练模型**：室外/室内分别依赖DSINE和GeoWizard，预训练模型的泛化能力可能成为瓶颈。
4. **动态场景适应性未知**：方法主要针对静态场景重建，对动态场景的适用性未做讨论。
5. **超参数敏感性**：SSIM阈值ε=0.1及损失权重等超参数的选择可能对结果产生影响，文中未充分讨论其鲁棒性。
6. **极端内存场景验证有限**：虽然在A5000（24GB）上验证有效，但对更严格的内存限制（如<16GB）未做充分探索。


（完）
