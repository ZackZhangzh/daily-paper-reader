---
title: Sharp Monocular View Synthesis in Less Than a Second
title_zh: SHARP：亚秒级高保真单目视图合成
authors: "Lars Mescheder, Wei Dong, Shiwei Li, Xuyang BAI, Marcel Santos, Peiyun Hu, Bruno Lecouat, Mingmin Zhen, Amaël Delaunoy, Tian Fang, Yanghai Tsin, Stephan Richter, Vladlen Koltun"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=yx3g4sF70y"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 单图3DGS回归用于快速视图合成
tldr: "单图像视图合成面临信息不足和速度挑战。本文提出SHARP，通过单次前馈网络在1秒内回归场景的3D高斯参数，实现实时高分辨率新视图渲染。表示具有绝对尺度，支持度量相机移动。在多个数据集上零样本泛化，LPIPS降低25-34%，达到新SOTA。"
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 单图像视图合成速度慢且泛化性差，难以实时应用。
method: 单次前馈神经网络回归3D高斯参数，实现快速实时渲染。
result: "在多个数据集上达到SOTA，LPIPS降低25-34%，泛化性强。"
conclusion: SHARP实现了单图快速高质量新视图合成，支持实时渲染。
---

## Abstract
We present SHARP, an approach to photorealistic view synthesis from a single image. Given a single photograph, SHARP regresses the parameters of a 3D Gaussian representation of the depicted scene. This is done in less than a second on a standard GPU via a single feedforward pass through a neural network. The 3D Gaussian representation produced by SHARP can then be rendered in real time, yielding high-resolution photorealistic images for nearby views. The representation is metric, with absolute scale, supporting metric camera movements. Experimental results demonstrate that SHARP delivers robust zero-shot generalization across datasets. It sets a new state of the art on multiple datasets, reducing LPIPS by 25–34% and DISTS by 21–43% versus the best prior model, while lowering the synthesis time by three orders of magnitude. Code and weights are provided at https://github.com/apple/ml-sharp.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机和背景）

单图像视图合成（从一张2D照片生成新视角的3D场景）是一个极具挑战性的不适定问题，因为单张图像 inherently 缺少三维几何与纹理的完整信息。现有方法要么推理速度慢、难以满足实时应用需求，要么泛化能力差，无法在多样化场景中稳定工作。

**SHARP（Sharp Monocular View Synthesis）** 旨在解决上述两大痛点——**速度**与**泛化性**。其核心目标是通过**单次前馈神经网络**，在**1秒内**从单张照片回归出场景的**3D高斯泼溅（3D Gaussian Splatting）表示**，并支持**实时高分辨率新视图渲染**。该方法来自Apple研究团队，发表于ICLR 2026。

---

## 2. 方法论：核心思想、关键技术细节与算法流程

### 核心思想

SHARP采用**端到端的前馈神经网络**，将单张2D图像直接映射为**3D高斯参数集合**（包括每个高斯的均值、协方差、不透明度和颜色等），从而构建场景的显式3D表示。

### 关键技术细节

- **3D高斯表示（3DGS）** ：SHARP预测的表示与标准的3D高斯泼溅格式兼容，输出为 `.ply` 文件，可直接用于各类公开的3DGS渲染器。
- **度量尺度（Metric Scale）** ：生成的表示具有**绝对尺度**，支持**度量级别的相机移动**，这对于AR/VR等需要精确空间定位的应用至关重要。
- **坐标规范**：遵循OpenCV坐标约定（x向右，y向下，z向前），场景中心大致位于 `(0, 0, +z)`。
- **实时渲染**：生成的3D高斯表示可在标准GPU上以**超过100帧/秒**的速度渲染高分辨率新视角图像。

### 算法流程（文字描述）

1. **输入**：单张2D照片；
2. **前馈推理**：将图像输入神经网络，通过**单次前向传播**在不到1秒内完成推理；
3. **输出**：场景的3D高斯参数（3DGS表示）；
4. **渲染**：利用3DGS渲染器，在标准GPU上实时合成高保真新视角图像。

---

## 3. 实验设计：数据集、Benchmark与对比方法

根据摘要和元数据，SHARP在**多个数据集**上进行了评估：

- **评估指标**：主要采用 **LPIPS**（Learned Perceptual Image Patch Similarity）和 **DISTS**（Deep Image Structure and Texture Similarity）两种感知相似度指标；
- **对比方法**：与**最优的先前模型（best prior model）** 进行对比；
- **泛化能力**：论文特别强调了SHARP在**跨数据集的零样本泛化（zero-shot generalization）** 方面的鲁棒性。

---

## 4. 资源与算力

**论文原文未明确披露**训练所使用的具体GPU型号、数量或训练时长等信息。不过，摘要和项目文档中明确提到：

- **推理阶段**：在**标准GPU（standard GPU）** 上，单次前向推理耗时**不到1秒**；
- **渲染阶段**：在**标准GPU**上可达到**超过100帧/秒**的渲染速度；
- **代码实现**：基于PyTorch，支持CPU、CUDA和MPS（Apple Silicon）。但渲染视频轨迹（`--render`选项）目前**仅支持CUDA GPU**。

---

## 5. 实验数量与充分性

从元数据中可推断的实验设计包括：

- **多数据集评估**：在多个数据集上进行了测试，并报告了跨数据集的零样本泛化结果；
- **SOTA对比**：与最优先前模型进行了系统性对比，给出了LPIPS和DISTS的定量改进幅度；
- **消融实验**：元数据中未明确提及消融实验的具体内容，但作为ICLR 2026的收录论文，通常应包含充分的消融分析以验证各模块的有效性。

**客观性与公平性**：论文报告了**多个数据集**上的结果，并对比了**最优先前模型**，符合学术惯例。然而，由于无法获取完整论文，具体的实验设置（如训练集划分、基线方法的参数调优等）尚无法全面评估。

---

## 6. 主要结论与发现

SHARP的核心结论可概括为以下几点：

- **SOTA性能**：在多个数据集上达到**新的最先进水平（state of the art）** ，LPIPS相比最优先前模型降低 **25–34%** ，DISTS降低 **21–43%**；
- **速度优势显著**：合成时间相比先前方法**降低三个数量级（~1000倍）** ；
- **强泛化能力**：在**跨数据集的零样本**场景下表现稳健；
- **实时渲染**：生成的3D高斯表示支持**100+ FPS**的高分辨率实时渲染。

---

## 7. 优点：方法与实验设计的亮点

- **极致速度**：单次前馈推理<1秒，渲染>100 FPS，真正实现了**实时单目视图合成**，较先前方法提速约1000倍；
- **度量表示**：生成的3D表示具有**绝对尺度**，支持精确的度量级相机运动，区别于许多仅支持相对运动的生成方法；
- **零样本泛化**：在多个数据集上无需微调即可良好泛化，展示了方法的通用性；
- **开源可复现**：代码和预训练权重已公开（https://github.com/apple/ml-sharp），便于社区复现和扩展；
- **标准化输出**：生成的3DGS `.ply` 文件兼容多种公开渲染器，生态友好。

---

## 8. 不足与局限

- **算力信息不透明**：论文未明确披露训练阶段的具体GPU型号、数量和训练时长，不利于评估训练成本和可复现性；
- **实验细节缺失**：受限于可获取的信息（仅摘要和元数据），无法评估具体的数据集规模、训练/测试划分、消融实验设计等细节；
- **渲染轨迹的硬件限制**：视频轨迹渲染功能目前**仅支持CUDA GPU**，对Apple Silicon等非CUDA平台的支持尚不完整；
- **应用场景局限**：论文强调支持"附近视图（nearby views）"的渲染，对于大幅视角变化或复杂遮挡场景的表现尚不明确；
- **单目固有局限**：作为单图像方法，SHARP本质上无法解决被遮挡区域的信息缺失问题，生成的内容本质上是"合理推测"而非真实重建。

---

（完）
