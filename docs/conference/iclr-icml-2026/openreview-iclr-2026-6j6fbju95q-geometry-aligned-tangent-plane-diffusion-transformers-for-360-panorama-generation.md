---
title: Geometry-Aligned Tangent-Plane Diffusion Transformers for 360° Panorama Generation
title_zh: 几何对齐的切平面扩散变换器用于360°全景生成
authors: "Hakan Çapuk, Andrew Bond, Muhammed Burak Kızıl, Erkut Erdem, Aykut Erdem"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=6J6Fbju95Q"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 用于360°全景生成的扩散变换器
tldr: 从文本生成360°全景图面临球面映射带来的畸变与不一致性问题。本文提出TanDiT，将球面分解为切平面局部块，使预训练扩散变换器可无缝应用于全景生成，并设计ERP条件细化模块增强全局连贯性。同时引入TangentFID和TangentIS等畸变感知评价指标，实验表明该方法在视觉质量和指标相关性上均优于现有全景生成方法。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 将2D扩散过程映射到球面易产生视觉伪影和缺乏全局一致性。
method: 球面切平面分解，结合预训练DiT和ERP细化模块，并设计畸变感知指标。
result: 生成全景图保真度高且全局连贯，新指标与人类偏好高度一致。
conclusion: 几何对齐的表示能有效提升扩散模型在全景生成任务中的适用性。
---

## Abstract
Generating 360° panoramas from text is challenging due to the inherent difficulty of mapping a 2D diffusion process to a spherical representation without introducing visual artifacts, inconsistencies, or a lack of global coherence. We present TanDiT, a tangent-plane diffusion transformer that factorizes the sphere into locally planar patches, providing a geometry-aligned representation where a pretrained DiT backbone operates without architectural changes. A lightweight ERP-conditioned refinement stage harmonizes overlaps and improves global coherence. To better evaluate panorama quality, we introduce TangentFID and TangentIS, distortion-aware metrics that capture pole and seam degradations, and align closely with human preference. Experiments across multiple benchmarks show that TanDiT outperforms prior work in both perceptual quality and distortion-sensitive fidelity, while scaling efficiently to 4K resolution.  Ablations confirm that the main gains arise from the representational choice, establishing TanDiT as a simple and principled framework for high-fidelity panorama generation.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

**背景与挑战**：从文本生成360°全景图面临独特难题。现有2D扩散模型在合成透视图像方面表现出色，但直接将其映射到球面表示会产生显著的几何畸变（尤其是极地区域）和空间不连续性问题，同时全景图还需要满足左右边缘无缝衔接的环状一致性要求。

**现有方法的不足**：已有方法多采用多分支去噪策略、拼接启发式或混合方案，但往往在极地区域产生伪影、空间不连续性明显，或缺乏跨分辨率与风格的泛化能力。一些无需训练的方法（如SphereDiff、CubeDiff）虽使用切平面或立方体贴图投影，但缺乏统一的生成流水线来同时保证局部连续性与全局一致性。

**本文核心问题**：如何设计一种**几何对齐**的表示方式，使强大的预训练扩散变换器（DiT）能够无缝应用于全景生成，同时消除球面映射带来的畸变与不一致性。

## 2. 方法论

**核心思想**：TanDiT（Tangent-Plane Diffusion Transformer）将360°球面场景分解为一个**结构化切平面网格**，每个切平面是一个局部透视视图，从而将球面生成问题转化为一组几何对齐的平面图像生成问题。

**关键技术细节**：

- **统一扩散模型**：与以往逐视图独立生成的方法不同，TanDiT采用**单个统一的Transformer扩散模型**，在一次去噪迭代中**同时生成所有切平面图像**，保持空间邻接关系并允许重叠区域间的信息共享。这一设计充分利用了DiT的注意力机制，适合建模结构化输入间的复杂空间关系。

- **ERP条件细化阶段**：提出一个模型无关的后处理步骤，以中间生成的等距柱状投影（ERP）为条件进行细化，增强全局一致性、平滑过渡，并支持超分辨率等额外处理。

- **专门评价指标**：提出**TangentIS**和**TangentFID**两个畸变感知指标，在提取的切平面视图上计算性能，更好地捕获整个球面视场上的保真度与多样性。这些指标能有效反映极地和接缝处的退化情况，且与人类偏好高度一致。

## 3. 实验设计

**数据集与基准**：论文提供了一个**综合性的基准测试**，包含带标题的全景数据集和标准化评估脚本。研究团队还为多个常用全景数据集补充了公开可用的文本标题。

**对比方法**：实验将TanDiT与多种现有全景生成方法进行对比，包括基于多分支去噪、拼接启发式和混合方案的方法，以及SphereDiff、CubeDiff等训练-free方法。

**评估维度**：涵盖定量指标（标准指标及新提出的TangentFID/TangentIS）和定性评估，测试模型在多样风格和场景类型上的泛化能力。

## 4. 资源与算力

论文**未明确说明**训练所使用的GPU型号、数量或具体训练时长。文中仅提及使用`2×`缩放因子作为默认设置，并在`4×`超分下生成4K全景图，但未披露计算资源的具体配置。

## 5. 实验数量与充分性

**消融实验**：论文进行了消融实验，评估了流水线中关键组件的贡献，包括**分块去噪（patched denoising）、循环填充（circular padding）、潜空间旋转（latent rotation）和超分辨率（super-resolution）**。

**实验覆盖**：实验涵盖多个定量基准和定性评估，测试了不同分辨率（包括4K）、不同风格下的生成效果，并验证了模型在训练数据之外的泛化能力。

**客观性与公平性**：论文将公开发布带标题的提示数据集、评估脚本以及新提出的指标，以支持标准化比较，这有助于提升实验的公平性和可复现性。但具体对比方法的选取细节和基线调优情况在摘要材料中未充分展开。

## 6. 主要结论与发现

- TanDiT在多个定量基准和定性评估中达到了**最先进的结果**，在感知质量和畸变敏感保真度方面均优于先前方法。
- 模型能够**稳健地解读详细和复杂的文本提示**，并有效泛化到多样风格和场景类型。
- 新提出的TangentFID和TangentIS指标能**有效捕获全景图特有的畸变**，且与人类偏好高度一致。
- 消融实验证实，**主要性能提升来源于几何对齐的表示选择**，而非架构改动。
- TanDiT能够**高效扩展至4K分辨率**。

## 7. 方法亮点

- **几何对齐的表示创新**：将球面分解为切平面网格，使预训练DiT无需任何架构修改即可直接使用，这是方法的核心突破。
- **统一生成而非拼接**：采用单个模型在一次去噪中生成所有切平面，避免了多分支方法的空间不连续问题。
- **专门的全景评价指标**：提出TangentFID和TangentIS，填补了全景生成领域缺乏畸变感知评价指标的空白。
- **跨分辨率与风格泛化**：模型灵活支持不同分辨率和风格，并可无缝集成超分辨率方法。
- **开放与可复现**：承诺公开数据集、评估脚本和指标，有利于领域标准化发展。

## 8. 不足与局限

- **视图间一致性缺乏显式约束**：切平面网格虽通过光流学习，但缺乏显式的相邻视图一致性约束机制，未经细化时拼接可能出现轻微伪影。
- **需要独立的细化阶段权重**：模型为网格生成专门微调，细化阶段需要单独的权重，且虽选择了合适的噪声水平保留细节，但局部仍可能发生变化。
- **潜在滥用风险**：与所有强大的生成模型一样，TanDiT可能被用于创建误导性或合成内容。
- **算力信息缺失**：论文未披露训练所需的具体计算资源，不利于其他研究者评估方法的可复现成本。

（完）
