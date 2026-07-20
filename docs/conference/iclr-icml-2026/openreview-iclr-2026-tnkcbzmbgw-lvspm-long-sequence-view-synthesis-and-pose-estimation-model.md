---
title: "LVSPM: Long Sequence View Synthesis and Pose Estimation Model"
title_zh: LVSPM：长序列视图合成与姿态估计模型
authors: "Xi Chen, Yachi Zhang, Linghao Chen, Minghua Liu, Hao Su, Zexiang Xu, Xiaoshuai Zhang"
date: 2025-09-12
pdf: "https://openreview.net/pdf?id=TNKCbZmBGw"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 从未标定长序列图像合成新视图
tldr: 提出可泛化模型LVSPM，联合估计相机姿态和新视图合成，仅需RGB和姿态监督，利用测试时训练层处理数百输入视图，在大基线数据集上取得领先的新视图合成结果。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有方法依赖密集几何监督或难以处理长序列。
method: 采用测试时训练层，将token压缩为固定大小隐状态，实现高效扩展。
result: 在多个数据集上优于VGGT，实现姿态自由长序列渲染。
conclusion: 测试时训练层可有效支持无姿态新视图合成。
---

## Abstract
We present LVSPM, a generalizable model that jointly estimates camera poses and synthesizes novel views from uncalibrated image collections. Unlike prior approaches that rely on dense geometric supervision, LVSPM is trained only with RGB images and pose supervision, avoiding the need for dense 3D ground truth. LVSPM employs test-time training (TTT) layers, enabling efficient compression of tokens into fixed-size hidden states and scaling seamlessly to hundreds of input views. 
Experiments on  RealEstate10k, Co3Dv2 and DL3DV, LVSPM surpasses VGGT in pose estimation across 10–256 input views. For novel view synthesis, LVSPM achieves state-of-the-art results in pose-free long-sequence rendering of the large baseline dataset DL3DV, and even exceeds pose-dependent models.

---

## 论文详细总结（自动生成）

## 一、核心问题与研究动机

LVSPM（Long Sequence View Synthesis and Pose Estimation Model）旨在解决**从未标定长序列图像集合中同时进行相机姿态估计与新视图合成**的问题。

**研究背景与动机**：

- 传统新视图合成方法往往依赖**密集的3D几何监督**（如深度图、点云等），数据获取成本高、泛化性受限。
- 现有前馈式模型（如LVSM）在处理**长序列输入**时面临显著的可扩展性瓶颈——随着输入视图数量增加，计算复杂度呈平方级增长。
- 主流方法默认所有视角token在计算路径中是“对等的”，但**输入视角与目标视角在语义角色上存在本质差异**，这种角色混淆限制了模型性能。

LVSPM的核心假设是：**仅使用RGB图像和姿态监督**，通过测试时训练（Test-Time Training, TTT）机制实现高效的token压缩与长序列扩展，从而在无需密集3D标注的前提下完成姿态估计与新视图合成。


## 二、方法论

### 2.1 核心思想

LVSPM采用**可泛化的前馈式架构**，将未标定的图像集合作为输入，联合输出相机姿态与新视角渲染结果。其关键创新在于引入**测试时训练（TTT）层**，将输入token压缩为固定大小的隐状态，从而实现对数百个输入视图的高效扩展。

### 2.2 技术细节

**模型架构**：LVSPM基于Transformer架构，将输入图像划分为patch并展平为1D token序列。目标视角通过光线嵌入（ray embeddings）生成查询token。模型整体可表示为：
$$\gamma_1, ..., \gamma_i = M(q_1, ..., q_i | x_1, ..., x_i)$$
即模型在输入token $x$ 的条件下，将目标查询token $q$ 映射为输出token $\gamma$。输出token随后通过线性层和Sigmoid函数回归目标patch的RGB值。

**损失函数**：训练采用**光度新视图渲染损失**，结合MSE损失与感知损失（Perceptual Loss）：
$$L = \text{MSE}(\hat{I}^t; I^t) + \lambda \cdot \text{Perceptual}(\hat{I}^t; I^t)$$

**关键机制**：

- **TTT层**：在测试时对输入token进行动态压缩，将变长序列映射为固定大小的隐状态，使模型能够平滑扩展至数百个输入视图。
- **纯Transformer架构**：避免使用NeRF、3DGS等显式3D表示，减少几何归纳偏置。


## 三、实验设计

### 3.1 数据集与场景

LVSPM在**三个公开数据集**上进行了评估：

| 数据集 | 特点 |
|--------|------|
| **RealEstate10k** | 大规模房产场景视频数据集，常用于新视图合成基准 |
| **Co3Dv2** | 常见物体的多视角图像数据集 |
| **DL3DV** | 大基线（large baseline）场景数据集，难度较高 |

### 3.2 对比方法

- **姿态估计任务**：主要对比 **VGGT**（Visual Geometry Grounded Transformer）
- **新视图合成任务**：对比包括**姿态依赖模型**（pose-dependent models）在内的多种方法

### 3.3 评估指标

论文采用新视图合成领域的标准指标（PSNR、SSIM、LPIPS等），具体数值在原文中应有详细表格。


## 四、资源与算力

**论文未明确说明**训练所使用的GPU型号、数量及训练时长。根据搜索材料中提及的相关工作（如Efficient-LVSM）的配置可作参考：相关模型训练时每GPU batch size为8，总batch size为256，每训练样本使用32个输入视图和12个目标视图。但LVSPM的具体算力配置在提供的文本中**未予披露**。


## 五、实验数量与充分性

### 5.1 实验覆盖

论文在**三个数据集**（RealEstate10k、Co3Dv2、DL3DV）上开展了实验，覆盖了**10至256个输入视图**的多种配置。实验维度包括：

- 姿态估计精度（不同输入视图数量下的表现）
- 新视图合成质量（与姿态依赖模型对比）

### 5.2 充分性评估

- **优点**：覆盖了从10到256视图的**宽范围输入规模**，验证了模型的可扩展性；在DL3DV大基线数据集上取得领先结果，具有一定挑战性。
- **不足**：从提供的摘要信息来看，**未明确提及消融实验**（如TTT层的必要性、不同压缩策略的对比等）。完整的实验设计需查阅论文正文及附录。


## 六、主要结论与发现

1. **姿态估计**：LVSPM在10–256个输入视图的范围内，**全面超越VGGT**，证明其在长序列姿态估计上的优越性。

2. **新视图合成**：在DL3DV大基线数据集上，LVSPM实现了**姿态自由长序列渲染的SOTA结果**，甚至**超过了依赖已知姿态的模型**（pose-dependent models）。

3. **可扩展性验证**：TTT层机制有效支持了模型向数百个输入视图的平滑扩展，验证了该技术路线的可行性。


## 七、方法亮点

1. **弱监督训练**：仅需RGB图像和姿态标签，**无需密集3D几何真值**（如深度图、点云），大幅降低了数据标注成本。

2. **联合建模**：首次在同一框架中**联合解决姿态估计与新视图合成**两个任务，实现端到端的前馈推理。

3. **高效扩展**：通过TTT层将变长token序列压缩为固定大小隐状态，**支持数百个输入视图**的规模扩展。

4. **姿态无关渲染**：在无需已知相机姿态的条件下完成新视图合成，且性能**超越依赖姿态的模型**，展示了强大的泛化能力。


## 八、不足与局限

1. **算力信息缺失**：论文未披露训练所需的GPU型号、数量及时长，不利于他人评估复现成本。

2. **消融实验不明**：摘要中未提及消融研究的具体设计（如TTT层的作用验证、不同视图数量下的性能衰减曲线等），实验深度有待确认。

3. **应用场景限制**：模型针对**静态场景**的长序列视图合成设计，对动态场景、实时流式输入的适应性尚未讨论。

4. **对比方法的覆盖面**：姿态估计仅对比了VGGT，未提及与经典SfM方法（如COLMAP）或其他学习方法的全面对比。

5. **论文状态**：该论文为 **ICLR 2026 Rejected** 稿件，表明同行评审过程中可能存在未被当前摘要覆盖的方法论或实验层面的问题。

（完）
