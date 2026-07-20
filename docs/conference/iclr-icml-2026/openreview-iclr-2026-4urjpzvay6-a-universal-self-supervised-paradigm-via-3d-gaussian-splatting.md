---
title: A Universal Self-Supervised Paradigm via 3D Gaussian Splatting
title_zh: 基于3D高斯泼溅的通用自监督范式
authors: "Hao Liu, Minglin Chen, Yanni Ma, Haihong Xiao, Rui Tan, Ying He"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=4UrjpzvAy6"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 基于3DGS的自监督代理任务用于神经渲染
tldr: 自监督预训练大多针对2D或3D网络，缺乏跨模态通用性。本文提出GS^3，基于3D高斯泼溅的统一自监督框架，将神经渲染作为代理任务，从输入数据预测场景级3D高斯并渲染图像，从而同时预训练2D和3D编码器。该方法桥接了模态差异，为下游任务提供了通用表征。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有自监督方法局限于单一模态，难以跨2D/3D通用。
method: 利用3DGS作为代理任务，通过神经渲染预测场景高斯，联合训练2D和3D编码器。
result: 实现跨模态自监督预训练，提升下游任务性能。
conclusion: GS^3为2D和3D表征学习提供了统一的神经渲染预训练框架。
---

## Abstract
Pre-training on large-scale unlabeled datasets has proven effective for enhancing model performance on downstream tasks, particularly when annotated data is scarce. However, due to the inherent discrepancies in data structures across modalities, most existing self-supervised approaches are tailored to either 2D or 3D networks, limiting their generalizability. In this paper, we propose GS$^3$, a 3D Gaussian Splatting (GS)-based universal self-supervised framework, which bridges 2D and 3D modalities and enables pre-training of both 2D and 3D encoders. The core idea is to formulate neural rendering as a pretext task: visual features extracted from input data are used to predict scene-level 3D Gaussians, which are then rendered into images via a fast tile-based rasterizer. The model is optimized by minimizing the difference between rendered and real images, with a masked modeling strategy further encouraging robust and spatially-aware representation learning. We evaluate GS$^3$ across five representative downstream tasks, including detection, segmentation, and reconstruction. Experimental results show that GS$^3$ consistently achieves performance on par with or surpassing state-of-the-art methods, while significantly reducing memory overhead compared to prior NeRF-based approaches.

---

## 论文详细总结（自动生成）

## 论文总结：A Universal Self-Supervised Paradigm via 3D Gaussian Splatting (GS³)

### 1. 核心问题与整体含义

**研究动机**：大规模无标注数据上的预训练已被证明能有效提升下游任务性能，尤其在标注数据稀缺时效果显著【0†L30】。然而，现有自监督学习方法大多针对2D或3D网络单独设计，难以在两种模态间通用【0†L31】。

**核心问题**：如何构建一个统一的、可同时预训练2D和3D编码器的自监督框架，弥合模态间的数据结构差异【0†L31-L32】。

**整体含义**：本文提出 **GS³**（3D Gaussian Splatting-based Self-Supervised framework），首次将3D高斯泼溅（3DGS）用作自监督学习的代理任务，实现了2D与3D模态的统一预训练【0†L32】。

### 2. 方法论

**核心思想**：将**神经渲染**设计为代理任务（pretext task）——从输入数据中提取视觉特征，用这些特征预测场景级的3D高斯参数，再通过基于瓦片的快速光栅化器（tile-based rasterizer）将3D高斯渲染为2D图像【0†L32-L34】。模型通过最小化渲染图像与真实图像之间的差异来优化，同时引入**掩码建模策略**（masked modeling strategy）以增强表征的鲁棒性和空间感知能力【0†L34-L35】。

**关键技术流程**（文字说明）：
1. **特征提取**：2D和3D编码器分别从输入数据中提取视觉特征；
2. **高斯预测**：利用提取的特征预测场景级3D高斯属性（位置、形状、不透明度、颜色等）；
3. **可微渲染**：通过快速光栅化器将3D高斯渲染为2D图像；
4. **自监督优化**：以渲染图像与真实图像的差异作为损失函数，联合训练2D和3D编码器；
5. **掩码增强**：在训练过程中引入掩码机制，强制模型学习更具鲁棒性和空间感知能力的表征。

**与NeRF-based方法的对比**：GS³相比先前基于NeRF的自监督方法，显著降低了显存开销【0†L36】。

### 3. 实验设计

**评测任务**：在**五类代表性下游任务**上进行了评估，包括检测（detection）、分割（segmentation）和重建（reconstruction）等【0†L35】。

**对比方法**：与当前最先进（state-of-the-art）方法进行了对比【0†L35-L36】。

**性能结果**：GS³在各项任务上取得了与SOTA方法相当或更优的性能【0†L35-L36】。

> ⚠️ 注：摘要及元数据中未具体说明使用了哪些数据集/场景，以及具体的benchmark名称。

### 4. 资源与算力

**文中未明确说明**使用的GPU型号、数量或训练时长等具体算力信息。摘要中仅提及GS³相比NeRF-based方法显著降低了显存开销【0†L36】，但未给出具体的硬件配置或训练资源数据。

### 5. 实验数量与充分性

**实验组数**：在**五个下游任务**上进行了评估【0†L35】，涵盖了检测、分割、重建等典型视觉任务，覆盖面较广。

**充分性与客观性**：
- 任务类型覆盖较为全面（三类典型任务），具有一定的代表性；
- 与SOTA方法进行了对比【0†L35-L36】，体现了公平性；
- 但摘要和元数据中未提供消融实验、各任务的量化结果、具体数据集规模等细节，难以全面评估实验的充分程度。

### 6. 主要结论与发现

- GS³成功实现了**跨模态的自监督预训练**，为2D和3D表征学习提供了统一的神经渲染预训练框架【0†L36-L37】；
- 在检测、分割、重建等下游任务上，GS³达到了与SOTA相当或更优的性能【0†L35-L36】；
- 相比基于NeRF的方法，GS³在**显存效率**上具有明显优势【0†L36】。

### 7. 优点（亮点）

- **范式创新**：首次将3DGS作为自监督学习的代理任务，开辟了新的技术路径【0†L32】；
- **模态统一**：实现了2D和3D编码器的联合预训练，解决了现有方法局限于单一模态的痛点【0†L31-L32】；
- **效率优势**：基于3DGS的快速光栅化渲染相比NeRF-based方法大幅降低了显存开销【0†L36】；
- **任务泛化性**：在检测、分割、重建等多类下游任务上均取得优异表现【0†L35】；
- **掩码策略**：引入掩码建模进一步增强了模型的空间感知能力和鲁棒性【0†L34-L35】。

### 8. 不足与局限

- **算力信息缺失**：未报告具体的GPU型号、数量、训练时长等资源消耗数据，不利于复现和实际部署评估；
- **实验细节不足**：摘要中未列出具体数据集名称、benchmark标准、各任务的量化指标，实验的可复现性和透明度受限；
- **消融研究未提及**：文中未明确说明是否进行了消融实验（如掩码策略的有效性、各模块的贡献等）；
- **应用场景限制**：方法依赖3D高斯泼溅的渲染管线，可能在不支持可微渲染或缺少多视角监督数据的场景下面临适配挑战；
- **论文状态**：该论文为ICLR 2026被拒稿论文（ICLR-2026-Rejected-Public）【0†L14】，需谨慎看待其结论的可靠性。

（完）
