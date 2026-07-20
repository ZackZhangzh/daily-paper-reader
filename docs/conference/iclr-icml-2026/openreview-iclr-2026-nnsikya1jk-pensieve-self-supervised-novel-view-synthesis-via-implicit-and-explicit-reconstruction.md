---
title: "Pensieve: Self-supervised Novel View Synthesis via Implicit and Explicit Reconstruction"
title_zh: Pensieve：基于隐式与显式重建的自监督新颖视图合成
authors: "Ruoyu Wang, Yi Ma, Shenghua Gao"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=NnSiKYA1Jk"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 无需相机标定的自监督新颖视图合成，使用隐式重建
tldr: 现有新颖视图合成大多依赖标定相机或几何先验，限制未标定数据应用。本文提出Pensieve，两阶段自监督策略仅从原始视频帧或多视图图像训练。第一阶段在隐空间学习每帧潜在相机和场景上下文特征，不依赖任何显式3D表示；第二阶段利用这些特征进行视图合成。该方法无需相机参数，可在大规模未标定视频上训练，显著拓展了合成模型的适用性。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有方法依赖相机标定和先验，限制未标定数据使用。
method: 两阶段自监督：先学习隐式潜在场景表示，再合成视图。
result: 无需相机参数即可从原始视频合成高质量新颖视图。
conclusion: 隐式重建结合自监督可摆脱标定依赖。
---

## Abstract
Currently almost all state-of-the-art novel view synthesis and reconstruction models rely on calibrated cameras or additional geometric priors for training. These prerequisites significantly limit their applicability to massive uncalibrated data. To alleviate this requirement and unlock the potential for self-supervised training on large-scale uncalibrated videos, we propose a novel two-stage strategy to train a view synthesis model from only raw video frames or multi-view images, without providing camera parameters or other priors. In the first stage, we learn to reconstruct the scene implicitly in a latent space without relying on any explicit 3D representation. Specifically, we predict per-frame latent camera and scene context features, and employ a view synthesis model as a proxy for explicit rendering. This pretraining stage substantially reduces the optimization complexity and encourages the network to learn the underlying 3D consistency in a self-supervised manner. The learned latent camera and implicit scene representation have a large gap compared with the real 3D world. To reduce this gap, we introduce the second stage training by explicitly predicting 3D Gaussian primitives. We additionally apply explicit Gaussian Splatting rendering loss and depth projection loss to align the learned latent representations with physically grounded 3D geometry. In this way, Stage 1 provides a strong initialization and Stage 2 enforces 3D consistency - the two stages are complementary and mutually beneficial. Extensive experiments demonstrate the effectiveness of our approach, achieving high-quality novel view synthesis and accurate camera pose estimation, compared to methods that employ supervision with calibration, pose, or depth information.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：目前几乎所有最先进的新颖视图合成（NVS）与三维重建模型都依赖标定好的相机参数或额外的几何先验（如深度、位姿等）进行训练。这些前置条件严重限制了模型在大规模未标定数据上的适用性，而现实世界中大量视频数据并不附带相机标定信息。

**核心问题**：如何在**完全不提供相机参数或任何几何先验**的条件下，仅从原始视频帧或多视图图像出发，训练一个高质量的新颖视图合成模型，同时实现准确的相机位姿估计。

**整体含义**：Pensieve通过两阶段自监督策略，试图解锁大规模未标定视频数据在三维视觉任务中的训练潜力，使新颖视图合成摆脱对专业标定设备和繁琐预处理流程（如SfM、SLAM）的依赖。


## 二、方法论

### 核心思想

Pensieve采用**两阶段互补训练策略**：第一阶段进行隐式重建预训练，第二阶段进行显式重建对齐。两阶段互为补充、相互促进。

### 第一阶段：隐式重建预训练（Stage 1）

- **核心机制**：在不依赖任何显式三维表示的前提下，在隐空间中学习场景重建。
- **具体操作**：网络为每一帧预测**隐式相机特征（latent camera）** 和**场景上下文特征（scene context features）**。
- **代理监督**：采用视图合成模型（受LVSM启发）作为显式渲染的代理，对输入帧自身进行重新渲染（re-render），实现自监督学习。
- **优势**：大幅降低优化复杂度，鼓励网络以自监督方式学习底层三维一致性。

### 第二阶段：显式重建对齐（Stage 2）

- **动机**：第一阶段学到的隐式相机与隐式场景表示与实际三维世界存在较大差距——本质上像一个以相机参数为中间表示的“自编码器”，仅能在隐相机处插值视图。
- **核心操作**：在预训练基础上，网络额外**显式预测3D高斯图元（3D Gaussian primitives）** 。
- **对齐损失**：
  - **高斯泼溅渲染损失（Gaussian Splatting rendering loss）** 
  - **深度投影损失（depth projection loss）** 
- **目的**：将学到的隐式表征与具有物理基础的三维几何对齐。

### 两阶段关系

> Stage 1 提供强初始化，Stage 2 强化三维一致性——两阶段互补且互惠。


## 三、实验设计

### 数据集

| 数据集 | 规模 | 说明 |
|--------|------|------|
| **RealEstate10K** | 80,000个视频片段，来自10,000个YouTube视频 | 采用PixelSplat的train-test划分 |
| **DL3DV** | 10,510个视频，涵盖有界和无界场景 | 遵循先前工作协议，在RealEstate10K预训练权重上微调所有模型 |

### Benchmark与对比方法

论文在**RealEstate10K**和**DL3DV**两个数据集上进行评估。对比方法包括需要标定、位姿或深度信息监督的方法。评估指标涵盖：
- **图像质量**：PSNR↑、SSIM↑、LPIPS↓
- **相机位姿精度**：RRA@5↑、RRA@15↑、RTA@5↑、RTA@15↑


## 四、资源与算力

**论文原文中未明确说明**所使用的GPU型号、数量及训练时长等具体算力信息。搜索全文未发现相关描述。


## 五、实验数量与充分性

### 实验构成

从论文摘要和贡献总结来看，实验至少包括：
- 在**RealEstate10K**上的训练与评估
- 在**DL3DV**上的微调与评估
- 两阶段训练策略的有效性验证（含收敛加速和性能提升的量化分析）
- 与需标定/位姿/深度监督的基线方法对比

### 充分性与客观性评估

- **积极方面**：实验覆盖了两个具有代表性的数据集（一个大规模YouTube视频数据集、一个涵盖多样场景的数据集），对比了需要监督信息的先进方法，评估维度同时涵盖视图质量（PSNR/SSIM/LPIPS）和位姿精度（RRA/RTA），较为全面。
- **局限性**：用户提供的材料中**未包含完整的实验表格和具体数值**（仅见表头），无法判断实验的统计显著性和误差分析是否充分；消融实验（ablation study）在可见文本中未明确出现；对比方法的选取范围和公平性需查阅完整论文才能确认。


## 六、主要结论与发现

1. **两阶段策略有效**：隐式重建预训练加速收敛并提升性能，显式重建对齐强制网络学习真实三维结构和相机参数。
2. **摆脱标定依赖可行**：无需相机参数即可从原始视频训练出高质量的新颖视图合成模型，同时实现准确的相机位姿估计。
3. **隐式与显式互补**：两阶段互为补充——隐式预训练解决显式表征的优化难题，显式对齐弥补隐式表征与真实几何的差距。


## 七、优点（亮点）

| 维度 | 亮点 |
|------|------|
| **方法创新** | 首次将隐式重建预训练与显式高斯泼溅对齐结合，两阶段设计巧妙 |
| **数据需求** | 完全不依赖相机标定、位姿或深度，仅需原始视频帧 |
| **应用拓展** | 可在大规模未标定视频上训练，显著拓展了NVS模型的数据适用性 |
| **端到端设计** | 完全端到端的架构，避免了SfM/SLAM等预处理的繁琐和不可靠性 |
| **代码开源** | 代码已在GitHub公开（https://github.com/Dwawayu/Pensieve） |


## 八、不足与局限

| 局限 | 说明 |
|------|------|
| **算力信息缺失** | 论文未报告训练所需的GPU型号、数量及时长，不利于复现和资源评估 |
| **实验细节不充分** | 可见材料中缺乏完整的定量结果表格和消融实验分析 |
| **应用场景限制** | 方法针对视频或多视图图像设计，对单张图像或极稀疏视图的适用性未知 |
| **泛化性验证有限** | 虽在RealEstate10K和DL3DV上测试，但对更极端场景（如剧烈动态、低纹理区域）的鲁棒性尚不明确 |
| **对比公平性** | 对比方法需用标定/位姿/深度监督，而Pensieve为自监督，两者信息量不对等——性能优势的归因需谨慎解读 |


（完）
