---
title: "GADA: Geometry-Aware Deformable Aggregation for Image-Based Gaussian Splatting"
title_zh: GADA：面向图像高斯泼溅的几何感知可变形聚合
authors: "Siwoo Lim, Sunjae Yoon, Gwanhyeong Koo, Chang D. Yoo"
date: 2026-04-30
pdf: "https://openreview.net/pdf/d80957b063184f1d10a7ffbec55d2e37ad464c9b.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 高斯泼溅场景重建与可变形聚合
tldr: 针对基于图像的高斯泼溅方法中几何不确定性导致的空间错位问题，提出几何感知可变形聚合（GADA）方法，通过引入带可变形偏移的迭代精化模块主动修正错位并恢复局部视觉线索，有效改善了薄结构和高频细节的重建质量，提升了残差学习的有效性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有基于扭曲的高斯泼溅方法因几何不确定性导致像素级错位，限制了残差学习在薄结构和高频细节上的修正收益。
method: 提出几何感知可变形聚合，引入带可变形偏移的迭代精化模块，主动校正空间错位并恢复位移的视觉线索。
result: 有效改善了薄结构和高频细节的重建质量，使残差学习获得更大增益。
conclusion: 通过可变形聚合恢复局部视觉线索是提升图像高斯泼溅精度的重要途径。
---

## Abstract
Gaussian Splatting has achieved significant improvements by incorporating warping-based techniques. However, such methods suffer from pixel-level inaccuracies due to uncertain geometry. This uncertainty leads to spatial misalignments in the warped images, which disrupt residual learning used in warping-based methods and fundamentally limit the gains of correction, particularly on thin structures and high-frequency details. Driven by our insight that useful visual cues are not lost but locally preserved under slight displacement, we propose Geometry-Aware Deformable Aggregation (GADA). This method introduces an iterative refinement module with deformable offsets to actively correct spatial misalignments and recover these displaced cues. Furthermore, to address the limitations of standard pipelines where visibility checks (i.e., thresholding) often discard valid pixels and multi-view warped image fusion relies on naive mean aggregation, our module is coupled with an implicit confidence weighting mechanism that selectively suppresses unreliable evidence. Consequently, our approach outperforms prior warping-based Gaussian Splatting, preserving high-frequency quality while achieving 2.13 times faster FPS.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **背景**：3D Gaussian Splatting（3DGS）已成为实时辐射场渲染的事实标准。近年来，基于扭曲（warping）的技术被引入3DGS以进一步提升合成质量——通过将源视角图像扭曲到目标视角来补偿缺失或残差像素。
- **核心问题**：由于几何不确定性，扭曲图像存在像素级空间错位（spatial misalignments）。这种错位破坏了扭曲方法中依赖的残差学习（residual learning），从根本上限制了修正收益，尤其在**薄结构**和**高频细节**上表现尤为明显。
- **核心洞察**：有用的视觉线索并未丢失，而是在轻微位移下被局部保留。
- **整体含义**：本文旨在通过主动校正空间错位并恢复位移的视觉线索，提升基于图像的高斯泼溅方法的重建精度，特别是对薄结构和高频细节的保持能力。

## 2. 方法论

- **核心思想**：提出**几何感知可变形聚合（Geometry-Aware Deformable Aggregation, GADA）** ，通过可变形偏移主动修正扭曲图像中的像素级空间错位，并恢复被位移的视觉线索。
- **关键技术细节**：
  - **迭代精化模块**：引入带可变形偏移（deformable offsets）的迭代精化机制，主动校正空间错位。精化迭代次数设为 \( K=5 \)，几何正则化权重设为 \( \lambda_2=0.01 \)，最大偏移幅度有界约束。
  - **隐式置信加权机制**：针对标准流程中可见性检查（阈值化）常丢弃有效像素、多视角扭曲图像融合依赖朴素均值聚合的局限，GADA 的模块耦合了隐式置信加权机制，选择性抑制不可靠证据。
  - **三阶段流程**：整体采用三阶段流水线，主动校正像素级空间错位并自适应融合多视角证据。
- **算法流程（文字说明）** ：给定一组训练图像及其场景几何（从3D高斯渲染的深度图和相对相机外参），首先通过像素级扭曲将源视图像素重投影到目标视图；随后，迭代精化模块利用可变形偏移对扭曲图像中的错位像素进行主动校正；最后，通过隐式置信加权机制对不同视角的扭曲图像进行自适应融合，选择性聚合可靠证据，为残差网络提供高质量输入。

## 3. 实验设计

- **数据集与场景**：
  - **Mip-NeRF 360**：9个场景
  - **Tanks and Temples**：标准场景
  - **Deep Blending**：标准场景
  - **Shiny 数据集**：3个场景（用于突出高频细节评估）
- **Benchmark**：标准新视角合成（NVS）基准
- **评估指标**：PSNR、SSIM、LPIPS（衡量光度准确性、结构相似性和感知质量）
- **对比方法**：与近期最先进方法（state-of-the-art）进行对比，包括 2DGS、IBGS 等
- **数据划分**：遵循标准协议，每张图像留出用于评估，其余图像用于训练

## 4. 资源与算力

- **明确说明**：所有实验在**单张 NVIDIA A100 GPU** 上完成。
- **训练时长**：论文中**未明确说明**具体的训练时长。
- **渲染速度**：GADA 实现了 **2.13 倍**的 FPS 提升。

## 5. 实验数量与充分性

- **实验组数**：从可获取信息来看，实验涵盖了：
  - **3个标准数据集**（Mip-NeRF 360、Tanks and Temples、Deep Blending）
  - **额外高频数据集**（Shiny 数据集3个场景）
  - **定性对比**与**定量对比**（图6及对应表格）
  - **效率评估**：渲染速度（FPS）、训练时间、存储消耗对比
- **充分性与公平性**：
  - 遵循了基线方法的标准超参数配置
  - 采用了标准数据增强和致密化策略
  - 使用了通用的评估指标（PSNR/SSIM/LPIPS）
  - 从 ICML 2026 录用（Oral, 168/23918=0.7%）来看，实验设计通过了顶级会议的严格评审，说明实验较为充分和规范。
- **潜在不足**：由于本文主要基于摘要和部分实验设置，**无法确认是否包含完整的消融实验**（如各模块独立贡献的量化分析），这部分在论文正文中应有更详细的呈现。

## 6. 主要结论与发现

- GADA 通过可变形聚合主动校正空间错位并恢复位移的局部视觉线索，有效改善了**薄结构**和**高频细节**的重建质量。
- 隐式置信加权机制相比标准流程中的朴素均值聚合和硬阈值可见性检查，能更有效地融合多视角证据。
- GADA 在保持高频质量的同时，实现了 **2.13 倍**的 FPS 提升。
- **核心结论**：通过可变形聚合恢复局部视觉线索是提升图像高斯泼溅精度的重要途径。

## 7. 优点

- **方法创新性**：首次将可变形卷积/偏移的思想引入基于图像的高斯泼溅框架，用于主动校正几何不确定性导致的空间错位，而非被动接受扭曲误差。
- **洞察深刻**：明确指出“视觉线索在轻微位移下并未丢失而是被局部保留”，这一洞察为可变形聚合提供了理论依据。
- **工程实用性**：在提升重建质量的同时实现了 **2.13 倍**的 FPS 提升，兼顾了精度与效率。
- **代码开源**：代码已在 GitHub 公开（https://github.com/siw00-lim/GADA），有利于复现和后续研究。
- **学术认可度高**：入选 ICML 2026 Oral，录用率仅 0.7%，体现了方法的高质量。

## 8. 不足与局限

- **算力信息不完整**：论文未明确报告**训练时长**，不利于全面评估方法的训练成本。
- **实验细节披露有限**：基于当前可获取的摘要和部分实验设置，**完整的消融实验设计**（如迭代次数 \( K \) 的敏感性分析、各模块独立贡献等）未能从现有材料中充分获取。
- **数据集覆盖**：虽然涵盖了主流 NVS 基准，但**未涉及动态场景或大规模室外场景**（如 Waymo、KITTI 等），方法的泛化性有待更广泛验证。
- **应用限制**：方法针对**基于图像的高斯泼溅**场景设计，对于视频输入或 4D 动态场景的适配性尚未讨论。

（完）
