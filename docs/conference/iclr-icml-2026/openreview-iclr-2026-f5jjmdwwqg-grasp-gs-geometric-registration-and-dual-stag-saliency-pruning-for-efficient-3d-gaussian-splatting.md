---
title: "GRASP-GS: Geometric Registration and Dual-Stag Saliency Pruning for Efficient 3D Gaussian Splatting"
title_zh: GRASP-GS：几何配准与双阶段显著性剪枝的高效3D高斯泼溅
authors: "Xinghua Lou, Chuyang Wei, Gezhong Pan, Yanzhi Song, Zhuotao Tian"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=F5jjmdWWqG"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 3D高斯泼溅用于高效场景表示和实时渲染
tldr: 针对3D高斯泼溅中稀疏SfM初始化和启发式密集化导致的模糊重建、冗余高斯和高训练成本问题，本文提出GRASP-GS框架。该方法通过提取和融合密集多视图特征增强初始点云，结合几何先验引导初始化，并设计双阶段显著性剪枝自适应移除冗余高斯。实验表明，该方法在保持实时渲染高视觉保真度的同时，显著减少了高斯数量、降低了训练开销，提升了场景重建的效率和精度。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS受稀疏初始化和启发式密集化影响，存在冗余和模糊问题。
method: 集成几何先验引导初始化和自适应双阶段显著性剪枝。
result: 减少了冗余高斯并提高了渲染质量和训练效率。
conclusion: 该方法实现了高效、高保真的实时场景渲染。
---

## Abstract
3D Gaussian Splatting (3DGS) has emerged as a powerful paradigm for scene representation, enabling real-time rendering with high visual fidelity by modeling scenes as anisotropic 3D Gaussians. However, existing methods suffer from blurred reconstructions, redundant Gaussians, and high training costs due to sparse Structure-from-Motion (SfM) initialization and heuristic densification. In this paper, we propose GRASP-GS (Geometric Registration and DuAl-Stage Saliency Pruning for 3D Gaussian Splatting), a framework that integrates geometric prior-guided initialization with adaptive saliency pruning. Our method first enhances the initial point cloud by extracting and fusing dense multi-view features with the SfM points through multi-stage refinement. Then, a dual-stage pruning strategy sequentially applies KL-based Rendering Survival Pruning (KL-RSP) to reduce spatial redundancy and Opacity-based Density-Constrained Pruning (ODCP) to eliminate low-contribution Gaussians. Experiments demonstrate that GRASP-GS achieves compact and high-quality scene representations, enabling efficient real-time rendering with enhanced structural integrity and visual quality.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景：** 3D高斯泼溅（3D Gaussian Splatting, 3DGS）已成为场景表示领域的重要范式，通过将场景建模为各向异性3D高斯，实现了高视觉保真度的实时渲染。

**核心问题：** 现有方法受限于两方面缺陷：一是稀疏的SfM（Structure-from-Motion）初始化导致重建模糊；二是启发式的密集化策略引入了大量冗余高斯，同时带来高昂的训练成本。

**整体含义：** 本文旨在解决3DGS中重建质量、模型紧凑性和训练效率之间的平衡问题，提出一个兼顾高效性与高保真度的场景表示框架。


## 二、论文提出的方法论

**核心思想：** 提出GRASP-GS（Geometric Registration and DuAl-Stage Saliency Pruning for 3D Gaussian Splatting）框架，从两个方面入手——**几何先验引导的初始化**和**自适应显著性剪枝**。

**关键技术细节（两个阶段）：**

1. **增强型初始化阶段：** 提取并融合密集的多视角特征，通过多阶段精炼（multi-stage refinement）将密集特征与SfM点云进行几何配准，从而增强初始点云的质量。

2. **双阶段剪枝策略：**
   - **KL-RSP（KL-based Rendering Survival Pruning）**：基于KL散度的渲染生存剪枝，减少空间冗余；
   - **ODCP（Opacity-based Density-Constrained Pruning）**：基于不透明度的密度约束剪枝，剔除低贡献高斯。

> **说明：** 摘要中未提供具体的数学公式和算法流程细节。


## 三、实验设计

**数据集/场景：** 摘要中未明确列出具体使用的数据集名称。

**Benchmark与对比方法：** 摘要中未详细说明对比了哪些基线方法，仅提及实验证明了GRASP-GS能够实现紧凑且高质量的場景表示。

> **信息缺口：** 摘要内容较为简略，未包含详细的实验设计描述。


## 四、资源与算力

**未明确说明。** 摘要和元数据中均未提及GPU型号、数量、训练时长等算力相关信息。


## 五、实验数量与充分性

**摘要中未提供实验数量的具体信息**，无法判断进行了多少组实验（如不同数据集上的测试、消融实验等）。

**关于充分性与客观性：** 由于缺乏实验设计的详细描述，暂无法对实验的充分性、客观性和公平性做出准确评估。该论文投稿至ICLR 2026且状态为“Rejected-Public”，审稿意见中可能包含对实验设计的批评，但当前文本未包含审稿细节。


## 六、论文的主要结论与发现

GRASP-GS能够实现紧凑且高质量的場景表示，在保持实时渲染能力的同时，增强了场景的结构完整性和视觉质量。具体而言，该方法通过几何先验引导初始化和自适应剪枝，有效减少了冗余高斯数量，提高了渲染质量和训练效率。


## 七、优点（方法或实验设计的亮点）

1. **创新性的双阶段剪枝策略**：KL-RSP与ODCP的组合设计，分别从空间冗余和贡献度两个维度进行剪枝，思路清晰且具有互补性。

2. **几何先验的引入**：通过密集多视角特征的提取与融合来增强SfM初始点云，相比原始3DGS的稀疏初始化更具信息量。

3. **问题定位准确**：直击3DGS的核心痛点——稀疏初始化导致的模糊重建和启发式密集化带来的冗余问题。

4. **兼顾效率与质量**：目标是同时实现模型紧凑性、训练效率和渲染保真度，具有实际应用价值。


## 八、不足与局限

1. **信息不完整**：摘要内容过于简略，缺乏方法论的技术细节（如公式、算法伪代码）、实验设置和定量结果，难以全面评估方法的有效性和创新性。

2. **实验覆盖未知**：未说明在哪些数据集上验证、对比了哪些SOTA方法，无法判断实验的全面性和说服力。

3. **算力需求不明**：未报告训练所需的GPU资源和时间，不利于实际应用中的资源评估。

4. **投稿状态**：该论文为ICLR 2026 Rejected-Public，表明其可能未被顶级会议接收，存在未被审稿人认可的潜在缺陷（具体原因需参考完整审稿意见）。

5. **应用限制未讨论**：未提及该方法在动态场景、大尺度场景或极端视角下的适用性和局限性。


**（完）**
