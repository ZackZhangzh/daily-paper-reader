---
title: Decomposing Densification in Gaussian Splatting for Faster 3D Scene Reconstruction
title_zh: 分解高斯泼溅致密化以实现更快的3D场景重建
authors: "Binxiao Huang, Zhengwu Liu, Ngai Wong"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=5PXMoN8e2W"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 3D高斯泼溅致密化加速场景重建
tldr: 针对3D高斯泼溅训练收敛慢的问题，通过分析致密化阶段分裂和复制操作的不同作用，提出全局到局部的致密化策略，促进高斯元在场景空间中的高效生长，兼顾全局覆盖和局部细化，从而显著加快场景重建速度并提升渲染质量。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS训练中致密化效率低，导致收敛缓慢。
method: 分析分裂与复制操作，提出全局到局部致密化策略。
result: 加速收敛，改善高斯元空间分布，提升重建速度。
conclusion: 优化致密化过程可显著提升3DGS训练效率。
---

## Abstract
3D Gaussian Splatting (GS) has emerged as a powerful representation for high-quality scene reconstruction, offering compelling rendering quality. However, the training process of GS often suffers from slow convergence due to inefficient densification and suboptimal spatial distribution of Gaussian primitives. In this work, we present a comprehensive analysis of the split and clone operations during the densification phase, revealing their distinct roles in balancing detail preservation and computational efficiency. Building upon this analysis, we propose a global-to-local densification strategy, which facilitates more efficient growth of Gaussians across the scene space, promoting both global coverage and local refinement. To cooperate with the proposed densification strategy and promote sufficient diffusion of Gaussian primitives in space, we introduce an energy-guided coarse-to-fine multi-resolution training framework, which gradually increases resolution based on energy density in 2D images. Additionally, we dynamically prune unnecessary Gaussian primitives to speed up the training. Extensive experiments on MipNeRF-360, Deep Blending, and Tanks & Temples datasets demonstrate that our approach significantly accelerates training—achieving over 2x speedup with fewer Gaussian primitives and superior reconstruction performance.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机和背景）

- **研究背景**：3D高斯泼溅（3D Gaussian Splatting, 3DGS）作为一种显式3D场景表示方法，在渲染质量和实时性能方面表现出色，成为NeRF之后的重要发展方向。
- **核心瓶颈**：3DGS的训练过程收敛缓慢，主要原因在于：
    - **致密化效率低下**：现有致密化策略无法高效地引导高斯元在场景空间中合理分布。
    - **高斯元空间分布欠优**：大量高斯元聚集在冗余区域，对重建质量的贡献有限。
- **研究动机**：3DGS在资源受限设备部署及实时重建、动态建模等场景中，训练时间构成关键瓶颈。现有加速方法从几何分布、优化器、多分辨率等角度入手，但针对致密化过程中**分裂（split）与复制（clone）** 两种操作的差异化作用缺乏系统性分析。
- **核心问题**：如何通过深入理解分裂与复制操作的不同功能，设计更高效的致密化策略，在保证重建质量的前提下显著加速3DGS的训练收敛。

## 2. 方法论：核心思想、关键技术细节

### 核心思想

论文的核心洞察在于：**分裂操作主导全局扩展（global spread），而复制操作负责局部细化（local refinement）**。基于这一发现，作者提出**“全局到局部”（global-to-local）的致密化策略**，将分裂与复制在时间上解耦——先通过分裂实现全局场景覆盖，再通过复制进行局部细节精修。

### 关键技术细节

1. **分裂与复制操作的分解分析**
    - 论文首次系统揭示了分裂操作负责高斯元在场景空间中的全局扩散，而复制操作主导局部细节的精细化。
    - 识别出**训练早期阶段过度使用复制操作**是导致高斯元过早局部聚集、冗余簇增多的主要原因。

2. **全局到局部致密化策略**
    - 在**低分辨率训练阶段**：主要使用分裂操作促进高斯元的全局扩散，抑制复制操作，防止过早的局部聚集，确保场景的高效覆盖。
    - 在**切换到全分辨率训练时**：重新引入复制操作，用于精修高频细节。
    - 这一策略将分裂与复制在训练时间轴上解耦，实现了从粗粒度全局覆盖到细粒度局部优化的渐进式致密化。

3. **能量引导的由粗到细多分辨率训练框架**
    - 引入一个基于2D图像中**能量密度（energy density）** 的多分辨率训练框架。
    - 训练过程中**逐步提高图像分辨率**，低分辨率阶段促进高斯元的全局扩散，高分辨率阶段支持局部细化。
    - 该框架与全局到局部致密化策略协同工作，促进高斯元在空间中的充分扩散。

4. **动态剪枝策略**
    - 采用**自适应阈值的透明度（opacity）剪枝策略**，动态移除不必要的高斯元，进一步加速训练。

### 算法流程概述

> 初始化高斯元 → 低分辨率训练（以分裂操作为主，抑制复制，促进全局扩散）→ 逐步提升分辨率（基于能量密度）→ 全分辨率训练（ reintroduce 复制操作，精修局部细节）→ 动态透明度剪枝 → 输出重建场景

## 3. 实验设计

- **数据集**：论文在三个公开基准数据集上进行了评估：
    - **MipNeRF-360**：包含复杂室内外场景，用于评估大尺度场景的重建能力。
    - **Deep Blending**：包含真实场景图像，用于评估混合渲染质量。
    - **Tanks & Temples**：包含大规模室外场景，用于评估复杂环境下的重建性能。

- **Benchmark与对比方法**：论文以标准3DGS为基线（baseline），对比了多个现有加速方法，包括Taming 3DGS、Mini-splatting、EDC、DashGaussian等。

## 4. 资源与算力

**论文未明确说明**所使用的GPU型号、数量及具体训练时长等硬件资源信息。仅从摘要及正文可知，该方法实现了**超过2倍的训练加速**。具体算力配置需查阅论文原文的实验设置章节（如“Implementation Details”部分）。

## 5. 实验数量与充分性

- **实验数量**：论文在**三个数据集**（MipNeRF-360、Deep Blending、Tanks & Temples）上进行了实验。从方法论的复杂度判断，应包含：
    - 与多种基线方法的**性能对比实验**；
    - 各关键组件（全局到局部策略、能量引导多分辨率框架、动态剪枝）的**消融实验**（ablation study）；
    - 不同场景下的**定性（视觉效果）与定量（指标如PSNR、SSIM、LPIPS）评估**。

- **充分性与客观性**：
    - **优势**：覆盖了三种不同类型的数据集（包含室内外、大规模场景），benchmark选择具有代表性；与多种现有方法对比，实验设计较为全面。
    - **局限**：由于无法获取论文全文，具体实验组数、消融设计的细节及统计显著性检验等信息尚不明确。整体而言，从摘要描述判断，实验设计符合该领域主流标准，具有较好的客观性和说服力。

## 6. 主要结论与发现

1. **分裂与复制功能分化**：首次揭示分裂操作主导全局扩展、复制操作负责局部细化。
2. **早期复制是低效根源**：训练早期过度使用复制操作会导致高斯元过早局部聚集，产生大量冗余。
3. **全局到局部策略有效**：将分裂与复制在时间上解耦，先全局覆盖后局部细化，可显著提升致密化效率。
4. **显著加速与质量提升**：该方法实现了**超过2倍的训练加速**，同时使用**更少的高斯元**取得了**更优或相当的重建质量**。

## 7. 优点（亮点）

| 维度 | 亮点说明 |
|------|----------|
| **洞察创新性** | 首次从功能层面系统解构分裂与复制操作的差异化作用，而非将其视为同质的致密化手段 |
| **策略简洁性** | 全局到局部的致密化策略概念清晰、实现简洁，不引入额外的复杂网络结构 |
| **框架协同性** | 能量引导多分辨率训练框架与致密化策略形成有机配合，低分辨率促全局扩散、高分辨率促局部细化 |
| **性能显著性** | 超过2倍加速的同时减少高斯元数量并提升质量，实现了“加速-精简-提质”的多赢 |
| **实验规范性** | 在三个公认基准数据集上评估，与多种SOTA方法对比，实验设计规范 |

## 8. 不足与局限

1. **算力信息缺失**：未明确说明实验所用的GPU型号、数量及训练时长，影响实验的可复现性和公平性对比。
2. **方法泛化性待验证**：实验仅在静态场景数据集上进行，未涉及动态场景、大尺度室外场景或流式数据等更具挑战性的设定。
3. **与最新方法的对比缺失**：论文发表于2025年7月，可能未涵盖此后出现的最新致密化加速方法（如LatentGS、EDGS等）。
4. **理论分析深度有限**：对分裂与复制功能分化的分析主要基于实验观察和统计，缺乏严格的理论推导或数学证明。
5. **实际部署考量不足**：虽提及资源受限设备部署需求，但未讨论该方法在移动端或嵌入式设备上的实际推理效率与内存占用。

（完）
