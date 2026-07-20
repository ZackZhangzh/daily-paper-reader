---
title: "CoverPruneGS: Coverage-Preserving Structured Pruning for Hierarchical 3D Gaussian Splatting from Sparse-View Monocular Videos"
title_zh: CoverPruneGS：面向稀疏视图单目视频层次化3D高斯泼溅的保持覆盖结构化剪枝
authors: "Yang Xiao, Guoan Xu, Guxue Gao, Qiang Wu, Wenjing Jia"
date: 2026-04-30
pdf: "https://openreview.net/pdf/739c56b328f35d075241d94772ff89a87488de24.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 稀疏视图单目视频下的3DGS剪枝与重建
tldr: CoverPruneGS针对层次化3D高斯泼溅在稀疏视图单目视频训练中产生的结构化冗余，提出保持覆盖的结构化剪枝框架。该方法采用基于体素的局部多样性选择和真值引导的粗到细剪枝流程，有效压缩模型同时保留场景覆盖，解决了标准剪枝方法在非独立同分布冗余下的失效问题，为稀疏输入下的实时渲染提供了紧凑表示。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏视图训练产生的相关伪视图导致冗余累积，现有剪枝方法失效，需设计专用剪枝框架。
method: 提出保持覆盖的结构化剪枝，采用体素局部多样性选择与真值引导的粗到细剪枝流水线。
result: 在稀疏视图单目视频上实现紧凑且完整的3DGS重建，有效去除结构化冗余。
conclusion: CoverPruneGS为层次化3DGS提供了可推广的覆盖保持剪枝方案，适合稀疏输入场景。
---

## Abstract
Reconstructing complete yet compact 3D Gaussian Splatting (3DGS) representations from sparse-view monocular videos remains a significant challenge. While hierarchical training with Video Frame Interpolation (VFI) improves coverage, its correlated pseudo-views and repeated merging accumulate structured, non-i.i.d. redundancy, violating the implicit independence assumptions of standard pruning methods and rendering global thresholding ineffectual. We propose CoverPruneGS, a coverage-preserving structured pruning framework specifically designed for hierarchical 3DGS. Our approach implements a coarse-to-fine pruning pipeline using voxel-based local diversity selection and ground-truth-guided lazy refinement via randomized dropout rendering. To ensure reliable refinement, we introduce a footprint-aware CUDA attribution mechanism. By aggregating ground-truth-aligned error degradation across Gaussian-influenced pixels, we generate faithful importance scores that enable precise, quantile-based "rescue" of essential primitives. Experimental results across multiple datasets demonstrate that CoverPruneGS substantially reduces Gaussian counts by 56.8\% and significantly accelerates inference speeds, all while enhancing or maintaining the quality of novel view synthesis.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机与背景：**

从稀疏视图单目视频（sparse-view monocular videos）中重建完整且紧凑的3D高斯泼溅（3D Gaussian Splatting, 3DGS）表示是一个重要挑战。现有方法采用层次化训练策略，结合视频帧插值（Video Frame Interpolation, VFI）来提升场景覆盖能力。然而，这一策略引入了一个副作用：VFI生成的关联伪视图（correlated pseudo-views）与重复的合并操作会不断累积结构化的、非独立同分布（non-i.i.d.）的冗余。这种冗余违反了标准剪枝方法所依赖的隐含独立性假设，导致全局阈值剪枝策略失效。

**核心问题：** 如何为层次化3DGS设计一种专用的剪枝框架，使其能够在去除结构化冗余的同时，保留场景的完整覆盖能力。


## 二、论文提出的方法论

**核心思想：**

CoverPruneGS提出了一种**保持覆盖的结构化剪枝框架**（coverage-preserving structured pruning framework），专门针对VFI增强监督下的层次化合并场景设计。其核心在于区分“冗余”与“必要”——不是简单地按全局标准剪枝，而是在保证场景覆盖不被破坏的前提下进行结构化压缩。

**关键技术流程（粗到细剪枝流水线）：**

1. **基于体素的局部多样性选择（Voxel-based Local Diversity Selection）** ：首先在体素空间内评估高斯的局部多样性，识别出冗余程度较高的候选高斯。

2. **真值引导的惰性精炼（GT-guided Lazy Refinement）** ：通过随机丢弃渲染（randomized dropout rendering）对候选高斯进行精细化筛选。

3. **足迹感知的CUDA归因机制（Footprint-aware CUDA Attribution）** ：为了确保精炼过程的可靠性，论文引入了一种与alpha合成一致的归因机制，该机制在受高斯影响的像素上聚合与真值对齐的误差退化（GT-aligned error degradation）。

4. **基于分位数的“抢救”策略（Quantile-based Rescue）** ：通过上述机制生成每个高斯的忠实重要性分数，然后基于分位数阈值对必要的高斯进行“抢救”，避免误删。

整个流程遵循“先粗筛、后细选”的原则，在压缩过程中动态保护对场景覆盖有贡献的关键高斯。


## 三、实验设计

**数据集与场景：** 论文在多个数据集上进行了实验验证，但具体数据集名称在摘要中未逐一列出。

**Benchmark与对比方法：** 论文将CoverPruneGS与多种现有方法进行了对比，但摘要中未详细列举对比基线（可能包括标准3DGS、现有剪枝方法如Opacity Pruning等）。

**主要评估指标：** 评估围绕三个维度展开：
- **高斯数量压缩率**：减少56.8%的高斯数量
- **推理速度**：显著加速
- **新视图合成质量**：在保持或提升质量的前提下实现压缩


## 四、资源与算力

**未明确说明。** 提供的论文摘要和元数据中未提及具体的GPU型号、数量、训练时长等算力信息。作为ICML 2026接受的论文，完整论文中可能包含这些细节，但在当前可获取的摘要范围内无法确认。


## 五、实验数量与充分性

**实验数量：** 摘要中提到在“多个数据集”（multiple datasets）上进行了实验，暗示实验覆盖了不止一个场景。

**充分性与客观性评估：**

- **压缩效果**：56.8%的高斯数量减少是一个明确的量化指标，具有说服力。
- **质量保证**：论文声称在保持或提升新视图合成质量的同时实现加速，说明并非以牺牲质量为代价换取压缩。
- **局限性**：由于摘要篇幅有限，无法评估消融实验的设计、统计显著性检验、以及各数据集上的详细数值结果。从已知信息来看，实验设计在方向上合理，但具体充分性需阅读全文才能判断。


## 六、论文的主要结论与发现

1. 层次化3DGS训练中由VFI导致的冗余是**结构化的、非独立同分布的**，标准剪枝方法在此场景下失效。

2. CoverPruneGS通过**保持覆盖的结构化剪枝**有效解决了这一问题，能够大幅压缩模型同时保留场景完整性。

3. 该方法实现了**56.8%的高斯数量减少**，同时显著加速了推理速度，且不降低新视图合成质量。

4. 足迹感知的CUDA归因机制是确保精炼可靠性的关键使能技术。


## 七、优点（方法与实验设计的亮点）

1. **问题定位精准**：论文识别出一个被现有方法忽视的关键问题——层次化训练产生的非i.i.d.冗余使标准剪枝失效，这为后续方法设计提供了清晰的问题动机。

2. **专用框架设计**：不同于通用的“一刀切”剪枝策略，CoverPruneGS专门针对层次化3DGS的场景特点设计了定制化流水线。

3. **“粗到细”的剪枝范式**：两阶段流程（体素级粗筛 + 真值引导细选）兼顾了效率和精度，具有工程实用性。

4. **覆盖保护意识**：“保持覆盖”作为核心设计原则，区别于单纯追求压缩率的方法，更符合实际应用需求。

5. **硬件友好的归因机制**：CUDA层面的足迹感知归因设计表明方法考虑了实际部署效率。

6. **ICML 2026接收**：论文被ICML 2026主会议接收，表明其学术质量得到了同行评审的认可。


## 八、不足与局限

1. **实验细节缺失**：从摘要无法获知具体使用的数据集、对比方法的完整列表、以及各场景下的详细量化结果，需阅读全文才能全面评估。

2. **算力信息未披露**：摘要中未提及训练和推理所需的硬件资源，无法评估方法在实际部署中的成本。

3. **应用场景局限**：方法专门针对“稀疏视图单目视频”这一特定输入场景设计，泛化到其他输入形式（如多视角密集输入、动态场景等）的能力尚不明确。

4. **与VFI的耦合**：方法设计依赖于VFI增强的层次化训练流程，如果底层VFI质量下降，剪枝效果可能受到影响。

5. **长期稳定性未知**：作为剪枝方法，其在极端压缩率下的鲁棒性、以及对不同场景类型（室内/室外、大尺度/小尺度）的适应性有待进一步验证。

6. **理论分析深度**：从摘要来看，方法的贡献主要集中在工程框架层面，关于结构化冗余的理论刻画和剪枝最优性的理论保证尚不清楚。


**（完）**
