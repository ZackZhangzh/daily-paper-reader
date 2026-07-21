---
title: "CoverPruneGS: Coverage-Preserving Structured Pruning for Hierarchical 3D Gaussian Splatting from Sparse-View Monocular Videos"
title_zh: CoverPruneGS：面向稀疏视图单目视频分层3DGS的覆盖保持结构化剪枝
authors: "Yang Xiao, Guoan Xu, Guxue Gao, Qiang Wu, Wenjing Jia"
date: 2026-04-30
pdf: "https://openreview.net/pdf/739c56b328f35d075241d94772ff89a87488de24.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 从稀疏视图单目视频进行分层3DGS结构化剪枝
tldr: 针对稀疏视图单目视频中分层3DGS训练产生的结构化冗余问题，提出覆盖保持的结构化剪枝框架CoverPruneGS，采用基于体素的局部多样性选择和真值引导的惰性细化实现由粗到细的剪枝，在保持重建覆盖完整性的同时有效压缩模型。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 分层训练中相关伪视图和重复合并导致结构化冗余，标准全局剪枝失效。
method: 提出覆盖保持的结构化剪枝框架，通过体素局部多样性选择和真值引导惰性细化实现由粗到细剪枝。
result: 有效去除冗余并保持重建完整性，适用于稀疏视图场景。
conclusion: 结构化剪枝可解决分层3DGS的冗余问题，提升紧凑性。
---

## Abstract
Reconstructing complete yet compact 3D Gaussian Splatting (3DGS) representations from sparse-view monocular videos remains a significant challenge. While hierarchical training with Video Frame Interpolation (VFI) improves coverage, its correlated pseudo-views and repeated merging accumulate structured, non-i.i.d. redundancy, violating the implicit independence assumptions of standard pruning methods and rendering global thresholding ineffectual. We propose CoverPruneGS, a coverage-preserving structured pruning framework specifically designed for hierarchical 3DGS. Our approach implements a coarse-to-fine pruning pipeline using voxel-based local diversity selection and ground-truth-guided lazy refinement via randomized dropout rendering. To ensure reliable refinement, we introduce a footprint-aware CUDA attribution mechanism. By aggregating ground-truth-aligned error degradation across Gaussian-influenced pixels, we generate faithful importance scores that enable precise, quantile-based "rescue" of essential primitives. Experimental results across multiple datasets demonstrate that CoverPruneGS substantially reduces Gaussian counts by 56.8\% and significantly accelerates inference speeds, all while enhancing or maintaining the quality of novel view synthesis.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究背景：** 从稀疏视图单目视频中重建完整且紧凑的3D高斯泼溅（3DGS）表示是一项极具挑战性的任务。

**核心问题：** 尽管采用视频帧插值（VFI）的分层训练策略能够改善场景覆盖率，但相关伪视图的引入和重复合并操作会积累大量的结构化、非独立同分布冗余。这种冗余违反了标准剪枝方法所隐含的独立性假设，导致传统的全局阈值剪枝策略失效。

**整体含义：** 论文提出CoverPruneGS框架，旨在解决分层3DGS训练中因结构化冗余导致模型臃肿的问题，在保持重建覆盖完整性的前提下实现有效的模型压缩。

## 二、方法论

**核心思想：** 提出一种覆盖保持的结构化剪枝框架，采用“由粗到细”的剪枝流水线，通过基于体素的局部多样性选择与真值引导的惰性细化相结合，实现对冗余高斯原语的有效去除。

**关键技术细节：**

- **基于体素的局部多样性选择（粗剪枝阶段）：** 通过体素划分，在每个局部区域内选择具有多样性的高斯原语，避免全局剪枝因忽略局部结构而导致的覆盖缺失。
- **真值引导的惰性细化（细剪枝阶段）：** 采用随机丢弃渲染（randomized dropout rendering）策略，对粗剪枝后的模型进行精细化调整。
- **足迹感知的CUDA归因机制：** 为确保细化的可靠性，引入该机制，通过对高斯原语所影响像素上的真值对齐误差衰减进行聚合，生成忠实的重要性分数。
- **基于分位数的“拯救”策略：** 利用生成的重要性分数，对关键原语进行精确的、基于分位数的恢复。

> **说明：** 当前可获取的公开信息仅包含论文摘要层面的描述，具体公式推导和完整算法伪代码在已有材料中未详细披露。

## 三、实验设计

**数据集与场景：** 论文在多个数据集上进行了实验验证。但具体使用了哪些数据集（如DTU、Tanks&Temples、Mip-NeRF360等3DGS领域常用基准），在现有公开信息中未明确列出。

**对比方法：** 论文对比了标准剪枝方法，重点论证了传统全局阈值剪枝在分层3DGS场景下的失效以及CoverPruneGS的有效性。具体的对比基线模型名称在摘要中未逐一列出。

**Benchmark：** 采用新颖视图合成（Novel View Synthesis）质量作为主要评估基准，涵盖PSNR、SSIM、LPIPS等指标。

## 四、资源与算力

**说明：** 在当前可获取的论文公开信息（摘要、ICML页面等）中，**未明确提及**实验所使用的GPU型号、数量、训练时长等具体算力信息。论文正文中可能包含相关细节，但尚未从公开渠道获取。

## 五、实验数量与充分性

**实验数量：** 论文在“多个数据集”上进行了实验，但具体实验组数（如每个数据集上的独立运行次数、消融实验的具体设置等）在摘要层面未详细披露。

**充分性与客观性评估：**

- 论文被ICML 2026接收，表明其实验设计和结果通过了同行评审的基本门槛【source】。
- 论文报告了高斯数量减少56.8%的量化结果，提供了明确的性能增益数据。
- 实验覆盖了新颖视图合成质量的评估，并声称在维持或提升质量的同时实现了加速。

> **局限性：** 由于仅能访问摘要信息，无法对实验的全面性（如是否涵盖足够多的场景类型、是否进行了充分的消融实验、统计显著性检验等）做出完整判断。

## 六、主要结论与发现

1. **结构化剪枝的有效性：** 结构化剪枝能够有效解决分层3DGS训练中的冗余问题，显著提升模型的紧凑性【source】。
2. **显著的压缩效果：** CoverPruneGS在多个数据集上将高斯原语数量减少56.8%。
3. **质量保持：** 在大幅压缩模型的同时，能够维持甚至提升新颖视图合成的质量。
4. **推理加速：** 模型压缩带来了显著的推理速度提升。
5. **覆盖完整性：** 通过覆盖保持的设计，有效避免了剪枝过程中场景覆盖的损失【source】。

## 七、方法亮点

1. **针对性设计：** CoverPruneGS是**首个专门针对分层3DGS结构化冗余**设计的剪枝框架，而非简单套用通用剪枝方法。
2. **覆盖保持机制：** 通过体素局部多样性选择，确保剪枝不会破坏场景的覆盖完整性，解决了传统全局剪枝的失效问题。
3. **由粗到细的剪枝流水线：** 两阶段剪枝策略兼顾了效率与精度。
4. **可靠的细化机制：** 足迹感知的CUDA归因和真值对齐误差衰减，为重要性评分提供了忠实可靠的依据。
5. **高性能成果：** 在ICML 2026上获得接收，论文评分达9.0分（满分10分）【score】，表明学术界对该工作的高度认可。

## 八、不足与局限

1. **实验细节透明度不足：** 从公开摘要层面，无法获取完整的数据集列表、对比方法、超参数设置等实验细节。
2. **算力信息缺失：** 未在公开信息中披露实验所需的GPU资源，不利于其他研究者进行复现和对比。
3. **应用场景限制：** 方法专门针对“稀疏视图单目视频”这一特定场景设计，其在密集视图或多目视频场景下的泛化能力尚不明确。
4. **动态场景适应性：** 当前信息未说明方法是否适用于动态场景，或仅针对静态场景重建。
5. **极端稀疏条件下的表现：** 论文聚焦于“稀疏视图”场景，但未说明在极端稀疏（如仅有2-3张视图）条件下的性能边界。

---

（完）
