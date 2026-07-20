---
title: "MVGSR: Multi-View Consistency Gaussian Splatting for Robust Surface Reconstruction"
title_zh: 多视角一致性高斯泼溅用于鲁棒表面重建
authors: "Chenfeng Hou, Qi Xun Yeo, Mengqi Guo, Yongxin Su, Yan Li, Gim Hee Lee"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=Q3LPPs4XOZ"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 多视角一致性高斯泼溅用于表面重建
tldr: 3D高斯泼溅用于表面重建在静态场景表现优异，但动态物体和瞬态干扰物常导致浮点伪影和几何失真。本文提出MVGSR，利用多视角特征一致性而非MLP不确定性建模来区分干扰物，结合启发式掩蔽策略，有效分割动态区域和干扰。在包含运动物体的日常场景中，该方法显著减少了伪影，提升了重建的几何准确性和视角一致性。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有3DGS表面重建在动态场景中易受干扰物影响产生伪影。
method: 利用多视角特征一致性区分干扰物，结合启发式掩蔽。
result: 在动态日常场景中重建质量优于基于MLP不确定性的方法。
conclusion: 多视角一致性可增强3DGS对动态干扰的鲁棒性。
---

## Abstract
3D Gaussian Splatting (3DGS) has recently emerged as a powerful approach for high-quality dense surface reconstruction of unknown scenes. However, existing methods are limited by the assumption of static environments. In practice, they often fail in everyday scenarios with dynamic objects and transient distractors that resulted in floating artifacts, geometric distortions, and view-dependent appearance errors in 3D reconstructed models.
We propose a robust surface reconstruction framework that leverages Gaussian models together with a heuristics-guided distractor masking strategy. Unlike prior methods that rely on MLP-based uncertainty modeling for distractor segmentation, our approach uses multi-view feature consistency to separate distractors from static content. This allows us to obtain precise distractor masks in the early stage of training. To further improve reconstruction, we introduce a pruning mechanism that evaluates the visibility of each Gaussian across views. Specifically, it resets the transmittance of unreliable points and thus suppresses floating artifacts to yield a more compact representation while preserving rendering quality. Finally, we design a multi-view consistency loss that enforces both structural and color coherence across views to improve the fidelity of Gaussian splats in distractor-heavy scenes.  Extensive experiments demonstrate that our method achieves state-of-the-art geometric accuracy and rendering fidelity while remaining robust in dynamic and cluttered environments. The code will be made publicly available on paper acceptance.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究动机与背景：**

- 3D高斯泼溅（3DGS）近年来在高质量密集表面重建任务中表现出色，具有渲染质量高、训练和推理速度快的优势。
- 然而，现有3DGS表面重建方法**默认假设场景是静态的**，在包含动态物体（如行人、车辆）和瞬态干扰物的日常场景中，常常失效。
- 这些干扰物会导致重建模型中出现**浮点伪影、几何失真和视角依赖的外观颜色误差**。

**整体含义：**

- 本文提出 **MVGSR（Multi-View Consistency Gaussian Splatting for Robust Surface Reconstruction）** 框架，旨在解决非静态环境下3DGS表面重建的鲁棒性问题。
- 核心思路是**利用多视角特征一致性**而非传统的MLP不确定性建模来区分干扰物与静态内容，从而获得更精确的干扰物掩码，提升重建质量。


## 二、方法论

**核心思想：**

- 采用**轻量级高斯模型**配合**启发式引导的干扰物掩蔽策略**，在非静态环境中实现鲁棒表面重建。
- 与依赖MLP进行干扰物分割的现有方法不同，MVGSR通过**比较多视角特征一致性**来分离干扰物与静态场景元素。

**关键技术细节：**

1.  **启发式引导的干扰物掩蔽策略**：在训练早期即可获得精确的干扰物掩码，有效区分动态区域与静态内容。

2.  **基于多视角贡献的剪枝机制**：通过评估每个高斯点在多视角下的可见性来重置不可靠点的透射率，有效抑制浮点伪影，在保持渲染质量的同时获得更紧凑的场景表示。实验显示该剪枝策略可压缩约60%的高斯点，同时保持相当的渲染质量。

3.  **多视角一致性损失**：在结构和颜色两个层面强制多视角一致性，提升干扰物密集场景中高斯泼溅的保真度。消融实验表明，该损失函数可显著降低Chamfer Distance。


## 三、实验设计

**使用的数据集：**

- **DTU数据集**：包含地面真实3D模型的基准数据集。
- **TnT数据集**：另一个包含地面真实3D模型的基准数据集。
- **DTU-Robust**：在DTU基础上添加随机干扰物扩展而来。
- **TnT-Robust**：在TnT基础上添加随机干扰物扩展而来。
- **On-the-Go数据集**：真实日常场景数据集。

**Benchmark与对比方法：**

- 对比的基线方法包括：**2DGS、PGSR、SLS、NeRFonthego**。
- 评估指标：渲染质量采用**PSNR（峰值信噪比）**；表面重建采用**Chamfer Distance**（用于DTU）和**F1分数**（用于TnT）。


## 四、资源与算力

**文中明确说明：** 所有实验均在**单张NVIDIA 4090 GPU**上完成。未提及具体的训练时长。

> ⚠️ 论文未提供训练轮数、每轮迭代时间或总训练时长的具体数据。


## 五、实验数量与充分性

**实验组成：**

1. **DTU-Robust数据集上的定量与定性对比**：与2DGS、PGSR、SLS、NeRFonthego等基线在多个场景上进行对比。
2. **TnT-Robust数据集上的定量对比**：在Truck、Caterpillar、Ignatius等场景上与PGSR对比F1分数。
3. **DTU-Robust数据集上的渲染质量对比**：与PGSR和2DGS对比不同场景下的PSNR。
4. **消融实验（Ablation Study）** ：在DTU-Robust的scan24场景上验证各组件（特别是多视角损失）的贡献。
5. **定性对比**：在DTU-Robust上展示重建表面的平滑度等视觉效果。

**充分性与客观性评估：**

- ✅ **优点**：覆盖了多个数据集（DTU、TnT及其鲁棒版本），对比了多个SOTA基线，包含了消融实验验证各组件贡献，采用了主流的定量评估指标（PSNR、Chamfer Distance、F1分数）。
- ⚠️ **局限**：消融实验仅在单个场景（scan24）上进行，覆盖面较窄；缺乏在不同类型干扰物（如不同大小、运动速度、数量）下的系统性分析；补充材料中提及了额外数据集但正文未详细展开。


## 六、主要结论与发现

1. MVGSR在**DTU-Robust和TnT-Robust**两个带干扰物的数据集上，相比2DGS、PGSR、SLS、NeRFonthego等基线方法，取得了**更优的几何精度和渲染保真度**。

2. 在TnT-Robust上，MVGSR在F1分数上超越PGSR：**Truck场景提升0.03、Caterpillar提升0.05、Ignatius提升0.09**。

3. MV-Prune剪枝机制可**压缩约60%的高斯点**，同时保持相当的渲染质量。

4. 多视角一致性损失显著提升了表面重建质量，有效降低了Chamfer Distance。

5. MVGSR在**动态和杂乱环境中表现出强鲁棒性**，验证了多视角一致性策略在增强3DGS对动态干扰鲁棒性方面的有效性。


## 七、方法亮点

1. **创新性的干扰物区分策略**：首次将**多视角特征一致性**引入3DGS表面重建的干扰物处理，摆脱了传统MLP不确定性建模的依赖，可在训练早期获得精确掩码。

2. **高效的剪枝机制**：基于多视角贡献的剪枝策略在压缩60%高斯点的同时保持渲染质量，兼顾了**效率与效果**。

3. **多层次一致性约束**：同时施加**结构和颜色**两个层面的一致性损失，全面提升了重建 fidelity。

4. **轻量级设计**：所有实验仅需单张4090 GPU即可完成，资源需求相对适中。


## 八、不足与局限

1. **实验覆盖局限**：消融实验仅在DTU-Robust的单个场景（scan24）上进行，缺乏跨场景、跨数据集的系统性消融验证。

2. **训练时长未披露**：论文未提供具体的训练时间数据，不利于复现时的资源评估。

3. **干扰物类型分析不足**：缺乏对不同类型干扰物（如不同运动速度、大小、数量、透明度等）影响程度的系统性定量分析。

4. **真实场景验证有限**：虽然在On-the-Go数据集上进行了测试，但真实动态场景的多样性和复杂性远大于合成添加干扰物的数据集，实际泛化能力仍需进一步验证。

5. **与隐式方法的对比不够充分**：主要对比对象为基于高斯的方法（2DGS、PGSR）和NeRFonthego，对其他类型的SOTA表面重建方法对比有限。

6. **论文状态**：该论文为**ICLR 2026 Rejected Publication**，表明其学术贡献在同行评审中尚存争议或不足。

（完）
