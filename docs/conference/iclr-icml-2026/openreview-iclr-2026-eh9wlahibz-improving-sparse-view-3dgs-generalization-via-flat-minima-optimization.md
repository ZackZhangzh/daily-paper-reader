---
title: Improving Sparse-View 3DGS Generalization via Flat Minima Optimization
title_zh: 通过平坦最小值优化改进稀疏视图3DGS泛化
authors: "Kangmin Seo, Sangeek Hyun, MinKyu Lee, Jae-Pil Heo"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=eH9Wlahibz"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 通过平坦最小值优化提升稀疏视图3DGS泛化
tldr: 3D高斯泼溅在稀疏监督下易过拟合，新视角泛化差。本文从平坦最小值优化角度出发，将高斯参数视为可训练权重，并引入尺度自适应扰动等多项技术，使优化路径更平坦，增强模型鲁棒性。实验在少视图设置下显著提升了新视图合成质量，为稀疏输入下的3DGS应用提供了有效解决方案。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS过拟合严重，泛化到新视角能力不足。
method: 将平坦最小值原理适配于高斯参数，设计尺度自适应扰动等正则化策略。
result: 在多个少视图数据集上新视图合成精度显著提升，优于现有稀疏重建方法。
conclusion: 平坦最小值优化能有效提升稀疏3DGS的泛化性能，且不增加推理成本。
---

## Abstract
Recent advances in neural rendering have established 3D Gaussian Splatting (3DGS) as a highly efficient representation for novel view synthesis, enabling real-time training and rendering with strong fidelity. However, when supervision is limited to a sparse set of input views, 3DGS tends to overfit to the observed images, resulting in poor generalization to unseen viewpoints. We approach this challenge from the perspective of flat minima (FM) optimization, which seeks solutions that remain stable under small parameter perturbations and are thus more robust. Viewing Gaussian parameters as trainable weights, we adapt FM principles to the geometric and dynamic nature of 3DGS by introducing several key techniques. First, we propose a Scale-Adaptive Perturbation (SAP) scheme that scales perturbation magnitude according to each Gaussian’s anisotropy, preserving fine details while promoting robustness. Second, we adopt stochastic perturbation where each Gaussian is probabilistically perturbed or left unchanged, allowing perturbations while preventing oversmoothing of scene details. Third, we schedule the perturbation magnitude to increase gradually during training, avoiding excessive noise before Gaussians capture stable structure. Finally, we incorporate periodic reinitialization of non-positional parameters such as scale, rotation, and opacity, and Spherical Harmonics (SH) coefficients. preventing degenerate cases like elongated Gaussians and maintaining well-conditioned primitives throughout optimization. Together, these techniques form a lightweight framework that integrates seamlessly into existing 3DGS pipelines without architectural changes. Experiments on LLFF and Mip-NeRF360 demonstrate that our method consistently improves both quantitative metrics and perceptual quality under sparse-view supervision, producing reconstructions that are sharper, more stable, and better generalized to novel viewpoints.

---

## 论文详细总结（自动生成）

# 论文总结：Improving Sparse-View 3DGS Generalization via Flat Minima Optimization


## 1. 核心问题与整体含义（研究动机与背景）

**研究背景：** 3D高斯泼溅（3D Gaussian Splatting，3DGS）是近年来神经渲染领域的高效代表方法，能够实现实时训练与渲染，并保持很高的保真度。

**核心问题：** 当监督信号仅来自稀疏的输入视图时，3DGS极易过拟合于已观测图像，导致在新视角下泛化能力严重不足。

**研究动机：** 本文将3DGS的过拟合问题重新解释为“收敛到尖锐极小值”（sharp minima）——即模型对参数微小变化高度敏感。受神经网络中“平坦最小值优化”（Flat Minima Optimization）理论的启发——该理论认为收敛到损失景观中平坦区域的解具有更好的泛化性——本文将高斯参数视为可训练权重，将平坦最小值原理适配到3DGS的几何与动态特性中。本文的核心主张是：**通过引导优化走向平坦最小值，可以有效提升稀疏视图下3DGS的泛化能力**。


## 2. 方法论

### 2.1 核心思想

本文将平坦最小值优化引入稀疏视图3DGS，核心手段是在训练过程中对高斯参数施加受控的随机扰动，使模型学习在参数扰动下仍能保持低损失的解，从而收敛到损失景观中更平坦的区域。在此基础上，作者针对3DGS的几何特性做了四项关键适配。

### 2.2 关键技术细节

**（1）尺度自适应扰动（Scale-Adaptive Perturbation, SAP）**

扰动噪声的幅度根据每个高斯椭球的各向异性尺度进行缩放。具体地，沿高斯三个主轴方向的扰动幅度分别与该轴的长度成比例。各向异性高斯（如细长椭球）受到更强正则化，而紧凑高斯则保留精细细节。消融实验表明，各向异性扰动在保真度与正则化之间取得最佳平衡。

**（2）随机扰动（Stochastic Perturbation）**

每个高斯以概率 $p$ 被扰动、以概率 $1-p$ 保持不变。这一设计避免了“始终扰动”策略对精细几何的过度压制，同时避免了对扰动和未扰动模型分别做两次前向传播的高计算开销。

**（3）扰动幅度调度（Perturbation Magnitude Scheduling）**

扰动幅度从训练初期的小值线性增长到最终的目标值：$\alpha(t)=t/T$（$t$ 为当前迭代，$T$ 为总迭代数）。这避免了早期高斯尚未捕获场景结构时过强噪声对优化的破坏。

**（4）周期性高斯重初始化（Periodic Gaussian Reinitialization）**

每隔固定迭代数，将非位置参数（尺度、旋转、球谐系数）临时恢复到其SfM初始状态并保持一段时间；不透明度则遵循3DGS标准重置机制。这一机制降低了非位置参数的有效自由度，稳定优化并引导走向更平坦的极小值。

### 2.3 算法流程概述

在标准3DGS训练循环的每次迭代中：（1）按调度系数 $\alpha(t)$ 计算当前扰动幅度；（2）对每个高斯以概率 $p$ 施加各向异性位置扰动，扰动幅度钳制不超过该高斯尺度；（3）模型在扰动参数下计算重建损失并反向传播；（4）每隔固定间隔执行非位置参数的重初始化。整个过程无需改变网络架构。


## 3. 实验设计

### 3.1 数据集与场景

- **LLFF**：使用3、6、9张输入视图
- **Mip-NeRF360**：使用12和24张输入视图

两个数据集均下采样8倍。

### 3.2 Benchmark与评估指标

采用三种标准图像质量指标：PSNR、SSIM、LPIPS。

### 3.3 对比方法

与以下稀疏视图新视图合成方法对比：
- **3DGS**（基线）
- **CoR-GS**
- **DropGaussian**
- **DNGaussian**（使用深度先验的额外几何监督）
- **FSGS**（使用深度先验的额外几何监督）


## 4. 资源与算力

论文中明确提到的硬件信息如下：

- **GPU型号**：NVIDIA RTX TITAN 和 A6000
- **GPU数量与训练时长**：**未明确说明**


## 5. 实验数量与充分性

本文实验设计较为充分，主要包括以下实验组：

| 实验类型 | 内容 |
|---------|------|
| 定量评估 | 在LLFF（3/6/9视图）和Mip-NeRF360（12/24视图）上与5种基线方法对比 |
| 定性评估 | 多场景可视化对比，展示几何一致性和清晰度提升 |
| 扰动鲁棒性对比 | 对不同幅度 $\gamma \in \{0.0,0.2,0.4,0.6,0.8,1.0\}$ 的后训练位置扰动进行测试 |
| 消融实验 | 扰动设计（各向异性vs各向同性）、不同参数扰动（位置/旋转/尺度/不透明度）、随机扰动策略vs混合损失、扰动调度有无、周期性重初始化有无 |
| 即插即用兼容性 | 将方法集成到FSGS、DropGaussian、Difix3D+、AnySplat中验证提升效果 |

**评价：** 实验设计整体客观、公平。对比了包含深度先验和不含深度先验的多类方法；消融实验系统覆盖了各核心设计组件；即插即用实验验证了方法的通用性。但需注意：所有实验仅在LLFF和Mip-NeRF360两个数据集上进行，场景类型和规模覆盖有限。


## 6. 主要结论与发现

1. **平坦最小值优化有效**：本文方法在PSNR、SSIM和LPIPS上均一致优于所有对比方法。
2. **几何更稳定**：本文方法在新视角下生成更清晰、结构更一致的渲染结果，基线方法则出现模糊、空间错位或几何扭曲。
3. **收敛到更平坦的极小值**：后训练位置扰动实验中，本文方法的性能退化远小于3DGS和DropGaussian，证明其收敛到了更平坦、更鲁棒的极小值。
4. **位置扰动最有效**：在各类参数中，对位置施加扰动对泛化提升最为显著。
5. **即插即用**：本文方法可作为插件无缝集成到现有稀疏视图3DGS流程中，持续提升性能。


## 7. 优点

1. **方法轻量且无架构改动**：所有技术仅作用于优化过程，无需修改网络架构，易于集成到现有管线。
2. **针对性设计合理**：SAP策略充分考虑高斯各向异性，避免了一刀切扰动对细节的破坏；随机扰动和调度策略进一步平衡了正则化强度与保真度。
3. **实验验证充分**：包含定量、定性、鲁棒性、消融和即插即用等多维度实验，论证链条完整。
4. **无需外部先验**：不依赖深度图等额外监督信号，适用范围更广。
5. **被ECCV 2026接收**：论文已被ECCV 2026正式接收，表明学术社区对其质量的认可。


## 8. 不足与局限

1. **数据集覆盖有限**：仅在LLFF（室外/物体级）和Mip-NeRF360（室内/室外场景）两个数据集上评估，未涉及大规模城市场景（如Waymo）、动态场景或极端稀疏（如1-2视图）设置。
2. **算力信息不透明**：未明确说明GPU数量、训练时长、显存占用等关键资源信息。
3. **与最先进方法的对比缺失**：未对比一些最新的稀疏视图3DGS方法（如HeroGS、SE-GS等）。
4. **超参数敏感性未充分探讨**：扰动概率 $p$、扰动系数 $\gamma$、重初始化间隔等关键超参数的选择依据和敏感性分析不足。
5. **理论分析深度有限**：对“为何位置扰动最有效”仅做了经验性说明，缺乏更深入的理论解释。

（完）
