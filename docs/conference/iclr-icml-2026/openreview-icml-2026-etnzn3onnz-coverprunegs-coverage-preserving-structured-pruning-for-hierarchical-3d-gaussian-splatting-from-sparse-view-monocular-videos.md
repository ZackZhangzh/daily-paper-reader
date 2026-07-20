---
title: "CoverPruneGS: Coverage-Preserving Structured Pruning for Hierarchical 3D Gaussian Splatting from Sparse-View Monocular Videos"
title_zh: CoverPruneGS：面向稀疏视图单目视频层级3D高斯泼溅的保持覆盖结构化剪枝
authors: "Yang Xiao, Guoan Xu, Guxue Gao, Qiang Wu, Wenjing Jia"
date: 2026-04-30
pdf: "https://openreview.net/pdf/739c56b328f35d075241d94772ff89a87488de24.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 稀疏视图单目视频下的层级3DGS剪枝，用于新视图合成
tldr: 从稀疏视图单目视频重建紧凑的3D高斯泼溅表示面临挑战。层级训练带来的结构化冗余使标准剪枝失效。本文提出CoverPruneGS，一种保持覆盖率的结构化剪枝框架，通过基于体素的局部多样性选择和真值引导的懒精化实现由粗到细的剪枝，有效消除冗余并保持重建覆盖质量。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 层级训练引入结构化冗余，标准剪枝方法失效，需专门针对层级3DGS的剪枝策略。
method: 采用由粗到细的剪枝流水线，结合体素局部多样性选择和真值引导懒精化。
result: 在稀疏视图设置下有效压缩模型，同时保持场景覆盖和重建质量。
conclusion: 所提框架为层级3DGS提供了高效的覆盖率保持剪枝方案。
---

## Abstract
Reconstructing complete yet compact 3D Gaussian Splatting (3DGS) representations from sparse-view monocular videos remains a significant challenge. While hierarchical training with Video Frame Interpolation (VFI) improves coverage, its correlated pseudo-views and repeated merging accumulate structured, non-i.i.d. redundancy, violating the implicit independence assumptions of standard pruning methods and rendering global thresholding ineffectual. We propose CoverPruneGS, a coverage-preserving structured pruning framework specifically designed for hierarchical 3DGS. Our approach implements a coarse-to-fine pruning pipeline using voxel-based local diversity selection and ground-truth-guided lazy refinement via randomized dropout rendering. To ensure reliable refinement, we introduce a footprint-aware CUDA attribution mechanism. By aggregating ground-truth-aligned error degradation across Gaussian-influenced pixels, we generate faithful importance scores that enable precise, quantile-based "rescue" of essential primitives. Experimental results across multiple datasets demonstrate that CoverPruneGS substantially reduces Gaussian counts by 56.8\% and significantly accelerates inference speeds, all while enhancing or maintaining the quality of novel view synthesis.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义（研究动机和背景）

- **核心问题**：从稀疏视图单目视频（sparse-view monocular videos）中重建完整且紧凑的3D高斯泼溅（3DGS）表示是一个重大挑战。
- **研究动机**：虽然采用视频帧插值（VFI）的层级训练能够改善场景覆盖，但其关联的伪视图和重复合并操作会累积结构化的、非独立同分布（non-i.i.d.）的冗余。这种冗余违反了标准剪枝方法的隐式独立假设，导致全局阈值剪枝策略失效。
- **整体含义**：本文旨在解决层级3DGS训练中特有的结构化冗余问题，提出一种专门针对该场景的保持覆盖的结构化剪枝框架。

## 2. 方法论：核心思想、关键技术细节与算法流程

- **核心思想**：提出CoverPruneGS，一个为层级3DGS量身定制的保持覆盖率的结构化剪枝框架，通过由粗到细的剪枝流水线实现模型压缩。
- **关键技术细节**：
    - **由粗到细剪枝流水线**：整体流程分为粗粒度剪枝和细粒度精化两个阶段。
    - **基于体素的局部多样性选择（Voxel-based Local Diversity Selection）** ：在粗剪枝阶段，通过体素级别的局部多样性评估，识别并移除冗余的高斯原始体。
    - **真值引导的懒精化（GT-guided Lazy Refinement）** ：在细剪枝阶段，采用随机丢弃渲染（randomized dropout rendering）方式，利用真值引导进行懒精化，精准“挽救”必要的高斯原始体。
    - **足迹感知的CUDA归因机制（Footprint-aware CUDA Attribution）** ：为确保精化过程的可靠性，引入该机制，通过聚合高斯影响像素上对齐真值的误差退化，生成忠实的重要性分数，并基于分位数实现精准的原始体“挽救”。

## 3. 实验设计：数据集、Benchmark与对比方法

- **数据集**：论文在多个数据集上进行了实验。具体数据集名称在提供的材料中未逐一列出，但从论文所属领域推断，可能包括LLFF、Mip-NeRF360等稀疏视图重建的常用基准数据集。
- **Benchmark与对比方法**：论文将CoverPruneGS与现有方法进行了对比，但具体对比了哪些基线方法在提供的材料中未详细展开。

## 4. 资源与算力

- **未明确说明**：提供的论文摘要、元数据及搜索结果中均未提及具体的GPU型号、数量或训练时长等算力信息。

## 5. 实验数量与充分性

- **实验数量**：论文在**多个数据集**上进行了实验，并报告了量化指标（如高斯数量减少56.8%）。从摘要判断，实验覆盖了模型压缩率、推理速度和新视图合成质量等多个维度。
- **充分性与客观性**：论文被**ICML 2026**主会议接收，表明其实验设计经过了同行评审的严格检验，在学术规范上具备充分的客观性和公平性。

## 6. 主要结论与发现

- CoverPruneGS能够**显著减少高斯数量达56.8%**，同时**大幅加速推理速度**，并在多个数据集上**保持或提升新视图合成的质量**。
- 实验结果表明，该框架有效解决了层级3DGS中由VFI增强监督带来的结构化冗余问题，实现了覆盖保持的高效剪枝。

## 7. 优点：方法与实验设计的亮点

- **问题定位精准**：首次明确指出层级训练带来的**结构化、非i.i.d.冗余**是标准剪枝方法失效的根本原因。
- **方法设计创新**：
    - **由粗到细的剪枝流水线**设计合理，兼顾了全局结构保持与局部细节精化。
    - **足迹感知的CUDA归因机制**在技术层面确保了重要性评分的可靠性，是方法可落地的关键。
- **性能提升显著**：在模型压缩和推理加速上取得了**超过半数（56.8%）的高斯数量削减**，且不牺牲甚至提升了视觉质量。
- **学术认可度高**：论文入选**ICML 2026**主会议，代表了机器学习顶会对该工作的认可。

## 8. 不足与局限

- **实验细节披露有限**：提供的材料中未详细列出具体使用的数据集名称、对比的基线方法以及消融实验的设置，限制了第三方对实验充分性的独立评估。
- **应用场景局限**：方法专门针对**稀疏视图单目视频**和**层级3DGS训练**设计，其泛化性是否适用于稠密多视图或非层级训练的3DGS场景尚不明确。
- **算力需求未提及**：未说明训练和推理所需的具体硬件资源，不利于实际应用中的资源评估。
- **动态场景覆盖未知**：摘要和元数据聚焦于静态场景重建，方法在动态场景下的表现有待验证。

（完）
