---
title: "CoDiffSplat: Sparse-View Generalizable 3D Gaussian Splatting with Single-Step Conditional Diffusion"
title_zh: "CoDiffSplat: 基于单步条件扩散的稀疏视图可泛化3D高斯泼溅"
authors: "Zeyang Bai, Yunpeng Wang, Yunbiao Wang, Jun Xiao"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=YXGMrLdqBY"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 稀疏视图可泛化3DGS与条件扩散
tldr: 本文提出CoDiffSplat框架，将语义条件潜在扩散与3D高斯泼溅结合，用于稀疏视图下的可泛化新视图合成。传统像素对齐高斯估计在遮挡区域失效，本方法采用轻量单步扩散直接细化高斯参数，保证效率与几何一致性。实验表明在稀疏输入下生成完整几何结构，避免了结构塌陷。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有可泛化3DGS在部分观测区域几何不完整。
method: 单步条件扩散直接优化高斯参数，结合语义条件。
result: 高效生成几何一致的新视图，克服稀疏视图缺陷。
conclusion: 单步扩散与3DGS结合有效提升稀疏视图泛化能力。
---

## Abstract
Generalizable 3D Gaussian Splatting (G-3DGS) has emerged as a promising approach for novel view synthesis under sparse-view settings.
However, existing frameworks remain restricted by pixel-aligned Gaussian estimation, which struggles in regions that are partially observed or occluded, often resulting in incomplete geometry and structural collapse. 
To overcome these challenges, we propose CoDiffSplat, a new framework that couples semantic-conditioned latent diffusion with 3D Gaussian splatting. 
Our design departs from conventional diffusion applied on image feature maps: instead, a lightweight single-step diffusion directly refines Gaussian parameters, ensuring efficiency while preserving geometric consistency. 
In addition, we introduce a Cross-View Entropy-Aware (CEA) module that aggregates multi-view semantics and geometry into robust conditional embeddings, enabling diffusion to resolve ambiguities under occlusion and sparse overlap. 
Comprehensive experiments on multiple benchmarks demonstrate that CoDiffSplat consistently improves geometric quality and structural completeness, especially under challenging extrapolation settings.
Our study establishes conditional diffusion as a scalable refinement mechanism for sparse-view 3D reconstruction, advancing the reliability of generalizable Gaussian splatting.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景**：3D高斯泼溅（3DGS）通过将场景建模为3D高斯混合体并利用可微光栅化，实现了高保真、实时的新视图合成。然而，传统3DGS依赖每个场景的独立优化和密集输入视图，限制了可扩展性且数据采集成本高昂。

**研究动机**：可泛化3DGS（G-3DGS）虽能从前馈网络中编码场景先验以实现快速推理，但其根本上受限于**像素对齐的高斯估计**——每个像素基于估计的深度映射到固定数量的高斯基元。在稀疏视图条件下（遮挡、弱纹理、视点重叠有限），深度估计极易出错，导致“黑洞”或结构塌陷。

**核心问题**：如何在稀疏视图输入下，克服像素对齐方法的固有限制，重建出几何完整、结构一致的三维场景。

**整体含义**：本文提出将**条件扩散模型**引入高斯参数的精化过程，将重建范式从“像素空间对齐”转向“高斯域精化”，为稀疏视图3D重建提供了一种可扩展的精化机制。


## 二、方法论

**核心思想**：CoDiffSplat将语义条件潜在扩散与3D高斯泼溅耦合，与传统扩散作用于图像特征图不同，本方法采用**轻量级单步扩散直接精化高斯参数**，在保证效率的同时保持几何一致性。

**关键技术**：

- **单步条件扩散（Single-Step Conditional Diffusion）** ：与经典扩散模型依赖多步去噪不同，本文发现单步扩散在保真度和稳定性上取得更好平衡，多步扩散反而会累积随机扰动导致过平滑和幻觉结构。
- **交叉视图熵感知模块（Cross-View Entropy-Aware, CEA）** ：聚合多视图语义和几何信息，生成鲁棒的条件嵌入，使扩散模型能够在遮挡和稀疏重叠条件下解决歧义。该模块突出不确定或弱约束区域，同时将跨视图冗余整合为综合表征。
- **DiT（Diffusion Transformer）骨干网络**：取代传统2D UNet，因为卷积骨干的2D网格结构归纳偏置不适用于无序的3D高斯基元。


## 三、实验设计

**数据集与基准**：

- 主要在 **RealEstate10K** 数据集上进行训练和评估。
- 训练/测试划分遵循 **pixelSplat** 建立的相同协议。
- 评估指标：PSNR（峰值信噪比）、SSIM（结构相似性）、LPIPS（学习感知图像块相似度）。

**对比方法**：与像素对齐和基于深度的方法进行对比，这些方法在模糊或遮挡区域（如不可见表面）往往无法恢复几何结构。

**评估设置**：使用**两个输入视图**进行训练和评估。


## 四、资源与算力

**论文中未明确说明**所使用的GPU型号、数量及训练时长等算力信息。


## 五、实验数量与充分性

**实验组数**：论文进行了多组实验，主要包括：

1. **扩散策略消融实验**（3组）：（i）移除扩散（w/o Diffusion）；（ii）用2D UNet替换DiT骨干（w/ UNet Backbone）；（iii）不同扩散步数（10步 vs 1步）。
2. **条件嵌入消融实验**（3组）：对比DINOv3、CLIP、BLIP-2三类常见替代方案与本文CEA嵌入。

**充分性与客观性评价**：消融实验设计较为系统，从“是否使用扩散”“骨干网络选择”“扩散步数”“条件嵌入类型”四个维度逐一验证了各设计决策的有效性，控制变量明确。但论文提供的实验细节有限（如未说明对比方法的完整列表、跨数据集泛化实验等），难以全面判断实验的充分程度。整体而言，在核心论证链条上的实验是充分的，但覆盖面可能有限。


## 六、主要结论与发现

1. **单步扩散优于多步扩散**：单步扩散在RealEstate10K上达到PSNR 27.56，比10步扩散高出0.5dB，表明多步扩散会引入随机扰动导致性能下降。
2. **扩散精化不可或缺**：移除扩散模块后，PSNR从27.56降至25.47（下降2.09），SSIM从0.888降至0.849。
3. **DiT优于UNet**：DiT骨干（PSNR 27.56）显著优于2D UNet（PSNR 26.71），因UNet的2D卷积归纳偏置不适用于无序的3D高斯基元。
4. **CEA嵌入最优**：CEA嵌入（PSNR 27.56）显著优于DINOv3（26.13）、CLIP（26.41）和BLIP-2（26.54）。
5. **方法整体有效**：在多个基准上的综合实验表明，CoDiffSplat持续提升几何质量和结构完整性，尤其在具有挑战性的外推设置下表现突出。


## 七、方法亮点

1. **范式创新**：将重建从“像素空间对齐”转向“高斯域精化”，从根本上规避了像素对齐方法在遮挡区域的固有问题。
2. **效率优势**：采用单步扩散而非传统多步扩散，兼顾了精化效果与推理效率。
3. **专用条件嵌入**：CEA模块专门针对多视图稀疏输入的歧义消除设计，相比通用视觉模型（DINOv3、CLIP、BLIP-2）效果更优。
4. **骨干选择合理**：选用DiT替代UNet，避免了卷积架构对2D网格结构的归纳偏置。
5. **渲染速度极快**：基于3DGS的方法渲染速度可达约500 FPS。


## 八、不足与局限

1. **算力信息缺失**：未报告GPU型号、数量、训练时长等关键资源信息，不利于复现和成本评估。
2. **实验细节有限**：对比方法的完整列表、跨数据集泛化能力、不同稀疏度（如3视图、4视图）下的表现等未在可见文本中充分展开。
3. **消融实验规模偏小**：仅在RealEstate10K单一数据集上报告消融结果，缺乏在其他数据集上的交叉验证。
4. **单步扩散的理论解释不足**：论文对“为何单步优于多步”给出了假设（随机扰动累积导致过平滑），但缺乏更深入的理论分析或可视化证据。
5. **应用场景局限**：方法针对稀疏视图新视图合成设计，在极端稀疏（如单视图）或动态场景下的适用性未知。


（完）
