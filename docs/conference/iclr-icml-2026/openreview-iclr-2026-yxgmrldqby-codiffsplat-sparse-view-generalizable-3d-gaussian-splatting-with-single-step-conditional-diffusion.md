---
title: "CoDiffSplat: Sparse-View Generalizable 3D Gaussian Splatting with Single-Step Conditional Diffusion"
title_zh: CoDiffSplat：单步条件扩散驱动的稀疏视图泛化3D高斯泼溅
authors: "Zeyang Bai, Yunpeng Wang, Yunbiao Wang, Jun Xiao"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=YXGMrLdqBY"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 单步条件扩散的稀疏视图泛化3D高斯泼溅
tldr: 稀疏视图下的泛化3D高斯泼溅常因像素对齐估计在遮挡区域产生几何崩塌。本文提出CoDiffSplat，将语义条件潜在扩散与3DGS结合，采用轻量单步扩散直接优化高斯参数而非图像特征，在保持高效率的同时保证几何一致性，在稀疏输入下生成完整且高质量的新视图。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 解决稀疏视图下3DGS在遮挡区域几何估计不完整和结构崩塌的问题。
method: 用语义条件潜在扩散直接细化高斯参数，单步扩散保证效率和一致性。
result: 在稀疏输入下生成完整几何和高保真新视图，优于像素对齐方法。
conclusion: 扩散与3DGS耦合有效提升稀疏视图泛化能力，兼具效率与质量。
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

**研究背景**：3D高斯泼溅（3DGS）作为一种新兴的场景表示与新颖视图合成（NVS）方法，通过将场景建模为3D高斯混合体并利用可微光栅化，实现了高保真实时渲染。然而，传统3DGS依赖密集输入视图和逐场景优化，限制了可扩展性。

**研究动机**：泛化3D高斯泼溅（G-3DGS）旨在仅凭少量输入视图重建场景，但现有框架受限于**像素对齐的高斯估计**——每个像素基于估计深度映射到固定数量的高斯基元。在稀疏视图条件下，深度估计易受遮挡、弱纹理和有限视角重叠的影响，导致部分观测或遮挡区域出现几何不完整和结构崩塌（“黑洞”或坍塌结构）。

**核心问题**：如何突破像素级对齐的限制，在稀疏输入下恢复完整、几何一致的3D场景结构。

**整体含义**：论文提出将稀疏视图G-3DGS重新定义为**潜高斯空间中的细化问题**，利用条件扩散模型作为可扩展的细化机制，推动泛化高斯泼溅的可靠性提升。


## 二、方法论

**核心思想**：CoDiffSplat将语义条件潜扩散与3D高斯泼溅耦合，区别于传统将扩散应用于图像特征图的做法，采用**轻量级单步扩散直接细化高斯参数**，在保证效率的同时维护几何一致性。

**整体流程**（图2概述）：

1. **多视图高斯编码器**：从稀疏输入视图构建初始潜3D高斯。
2. **CEA模块**：并行提取跨视图熵感知嵌入作为扩散条件。
3. **DiT扩散骨干**：在潜高斯空间中进行单步去噪细化。
4. **上采样解码器**：将细化后的潜高斯恢复至原始空间分辨率。
5. **端到端优化**：通过光度损失监督整个模型。

**关键技术细节**：

- **潜特征提取**：输入图像经浅层ResNet下采样后，通过多视图Swin Transformer（含自注意力和交叉注意力层）获取多视图感知特征。
- **粗匹配与高斯初始化**：采用平面扫描构建代价体积（cost volume）建模多视图特征对应关系。对每个视图均匀采样$D$个深度候选，将其他视图特征通过相机参数扭曲到当前视图，计算点积相关性。通过softmax获得深度图并反投影形成初始高斯中心，其他高斯参数由轻量级头预测。
- **CEA模块**：利用代价体积计算匹配熵 $H^i(p) = -\sum_{d} P^i(d|p)\log P^i(d|p)$，量化多视图不确定性。熵值越大表示区域越模糊/欠约束。特征图按熵权重重新加权后，通过交叉注意力将单视图类嵌入与加权特征图融合为熵感知嵌入。最后通过Perceiver风格跨视图注意力聚合多视图语义，抑制冗余偏置。
- **条件扩散**：以CEA嵌入为条件，DiT骨干在潜高斯空间中进行单步去噪细化。


## 三、实验设计

**数据集与场景**：论文在多个基准数据集上验证，包括**RealEstate10K**和**ACID**数据集。

**Benchmark设置**：
- **插值（Interpolation）设置**：从两个参考视角渲染三个新视角。
- **外推（Extrapolation）设置**：更具挑战性的外推场景。

**对比方法**：对比了多种SOTA G-3DGS方法，包括PixelSplat、MVSplat、TranSplat、HiSplat、eFreeSplat、DepthSplat等。


## 四、资源与算力

**论文文本中未明确说明**所使用的GPU型号、数量及训练时长等具体算力信息。仅提及扩散模块采用**轻量级DiT骨干**以降低训练难度和计算成本，且单步设计使其作为高效的修正模块而非完整生成过程。


## 五、实验数量与充分性

从摘要和正文可推断实验涵盖：
- **多数据集验证**：RealEstate10K和ACID等多个基准
- **多种设置**：插值与外推两种评估协议
- **与SOTA广泛对比**：对比了至少6种现有G-3DGS方法

**充分性评估**：实验设计覆盖了标准基准和 challenging extrapolation setting，对比方法全面，**整体较为充分和客观**。但受限于可获取的论文文本（仅前219行），未能获取消融实验的具体数量和细节，无法对实验完整性做全面判断。


## 六、主要结论与发现

1. CoDiffSplat在插值和外推两种设置中**一致性地提升了几何质量和结构完整性**。
2. 在RealEstate10K的外推视图上，相较SOTA方法HiSplat实现了**+2.32 dB的PSNR增益**。
3. 条件扩散可作为稀疏视图3D重建的**可扩展细化机制**，推动泛化高斯泼溅的可靠性提升。
4. **单步扩散足以修正几何不一致性**，将扩散从完整生成过程转变为高效修正模块，保留了前馈G-3DGS的速度优势。


## 七、优点

1. **范式创新**：首次将扩散从图像特征空间迁移到**高斯参数潜空间**进行直接细化，突破了像素对齐的根本限制。
2. **效率优势**：**单步扩散**设计避免了传统扩散的迭代去噪开销，在提升质量的同时保持计算效率。
3. **CEA模块创新**：利用匹配熵量化多视图不确定性，引导扩散聚焦于遮挡、弱纹理等欠约束区域。
4. **端到端可训练**：整个框架通过光度损失端到端优化，无需复杂的中间监督。
5. **泛化性强**：在 challenging extrapolation 设置下表现尤为突出。


## 八、不足与局限

1. **算力信息缺失**：论文未明确报告训练所需的GPU型号、数量及时长，不利于复现和资源评估。
2. **实验细节不完整**：受限于可获取文本范围，消融实验的具体设计、各模块贡献的定量分析未能获取。
3. **潜在偏差风险**：依赖预训练的DINOv3单视图ViT，其领域偏差可能影响特定场景的泛化。
4. **极端稀疏场景**：虽然论文针对稀疏视图设计，但极端情况（如单视图输入）下的性能未见明确讨论。
5. **动态场景适用性**：方法针对静态场景重建，对动态场景的扩展性尚未涉及。

（完）
