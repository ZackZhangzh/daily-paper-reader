---
title: Sharp Monocular View Synthesis in Less Than a Second
title_zh: Sharp：一秒内完成单目新视图合成
authors: "Lars Mescheder, Wei Dong, Shiwei Li, Xuyang BAI, Marcel Santos, Peiyun Hu, Bruno Lecouat, Mingmin Zhen, Amaël Delaunoy, Tian Fang, Yanghai Tsin, Stephan Richter, Vladlen Koltun"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=yx3g4sF70y"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 单图像新视图合成，使用3D高斯表示
tldr: "针对单张图像新视图合成任务，提出SHARP方法，通过前馈神经网络在不到一秒内回归场景的3D高斯参数，所得表示可实时渲染出高分辨率照片级新视图，支持度量尺度相机运动，在多个数据集上达到最先进水平，LPIPS降低25-34%，DISTS降低21-43%。"
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 单视图新视图合成受限于信息不足，现有方法质量不佳。
method: 用神经网络前馈回归3D高斯参数，实现实时渲染。
result: 在多个数据集上取得最优结果，速度快且零样本泛化好。
conclusion: 单视图3D高斯回归可实现快速高质量新视图合成。
---

## Abstract
We present SHARP, an approach to photorealistic view synthesis from a single image. Given a single photograph, SHARP regresses the parameters of a 3D Gaussian representation of the depicted scene. This is done in less than a second on a standard GPU via a single feedforward pass through a neural network. The 3D Gaussian representation produced by SHARP can then be rendered in real time, yielding high-resolution photorealistic images for nearby views. The representation is metric, with absolute scale, supporting metric camera movements. Experimental results demonstrate that SHARP delivers robust zero-shot generalization across datasets. It sets a new state of the art on multiple datasets, reducing LPIPS by 25–34% and DISTS by 21–43% versus the best prior model, while lowering the synthesis time by three orders of magnitude. Code and weights are provided at https://github.com/apple/ml-sharp.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

**研究动机**：单图像新视图合成（Single-Image Novel View Synthesis）是一个极具挑战性的计算机视觉问题——从一张2D照片出发，推理出场景在未见过视角下的外观。由于单张图像天然缺少3D几何信息，现有方法要么合成质量不佳，要么推理速度极慢，难以在实际应用中落地。

**核心贡献**：SHARP（Sharp Monocular View Synthesis）由Apple研究团队提出，旨在解决“单张图像 → 高质量3D表示 → 实时新视图渲染”这一链条中的效率与质量瓶颈。其核心思想是：**用一个前馈神经网络在不到一秒内直接回归出场景的3D高斯表示（3D Gaussian Splatting）参数**，从而绕开传统方法依赖多视角图像进行耗时优化的路径。该论文已被ICLR 2026接收。

---

## 2. 方法论

**核心思想**：SHARP采用端到端的神经网络架构，将单张RGB图像作为输入，通过单次前向传播直接预测出场景的3D高斯泼溅（3DGS）表示参数。所得3D高斯表示支持实时渲染，在标准GPU上可达到**超过100帧/秒**的渲染速度。

**技术流程**（基于知乎论文详解）：

1. **单目深度估计**：输入单张RGB图像，通过单目深度骨干网络提取4个不同分辨率的特征图，再由深度解码器输出一个**双层深度图（Layered Depth）** 。

2. **深度调整（Depth Adjustment）** ：初始深度图输入深度调整模块，学习一个尺度图（scale map），对深度进行逐像素精调。该模块受C-VAE启发。

3. **高斯初始化**：调整后的深度图与原始输入图像一同输入高斯初始化器，对输入进行2倍下采样后，利用深度图反投影得到**初始3D高斯位置**。

4. **高斯解码**：调整后的深度图、原始输入图像以及骨干网络提取的特征图共同输入高斯解码器，回归出完整的3D高斯参数（包括位置、颜色、透明度、旋转、尺度等）。

**关键技术特性**：

- **度量尺度（Metric Scale）** ：SHARP生成的3D表示具有**绝对尺度**，支持度量单位的相机运动，而非仅支持相对运动。
- **零样本泛化（Zero-shot Generalization）** ：模型在训练集上学习到深度与几何先验后，可直接泛化到未见过的数据集和真实场景，无需微调。

---

## 3. 实验设计

**数据集与Benchmark**：论文在**多个数据集**上进行了评估。具体使用的数据集名称在摘要和元数据中未逐一提及，但实验覆盖了合成数据与真实数据。

**对比方法**：SHARP与**当前最优（SOTA）的先前模型**进行了对比。对比基线包括前馈式方法和基于扩散（diffusion）的系统。

**核心评估指标**：
- **LPIPS（Learned Perceptual Image Patch Similarity）** ：衡量感知图像相似度
- **DISTS（Deep Image Structure and Texture Similarity）** ：衡量图像结构与纹理相似度

**主要实验结果**：
- SHARP在多个数据集上达到**新的SOTA**，相比最佳先前模型，**LPIPS降低25–34%，DISTS降低21–43%**。
- 合成时间相比先前方法**降低了三个数量级（1000倍）** 。
- 相比基于扩散的系统，SHARP在**更高保真度的同时**将合成时间缩短了**2到3个数量级**。

---

## 4. 资源与算力

**推理阶段**：SHARP的**推理（前向传播）** 可在“标准GPU”上**不到一秒**完成。性能测试在**NVIDIA A100 GPU**上进行。渲染功能需要**CUDA兼容GPU**，但预测可在CPU、CUDA或MPS（Apple Silicon）后端运行。

**训练阶段**：**论文中未明确说明**训练所使用的具体GPU型号、数量和训练时长。仅知模型在“大量合成与真实数据”上进行了训练，并采用了“微调规模的数据”。训练算力消耗的具体信息在公开摘要和项目页面中未披露。

---

## 5. 实验数量与充分性

**实验数量**：从公开信息来看，SHARP在**多个数据集**上进行了评估，并包含**与多种SOTA基线的对比**。论文还提供了**消融实验**（通过移除或修改特定模块来评估各组件贡献）。此外，项目页面提供了**视频对比**素材。

**充分性与公平性**：
- **充分性**：实验覆盖了定量指标（LPIPS、DISTS）和定性可视化对比，评估维度较为全面。
- **公平性**：论文声称SHARP实现了**零样本跨数据集泛化**，说明测试集与训练集不重叠，评估设置较为严格。但具体训练/测试数据划分细节在公开摘要中未详述。
- **潜在局限**：由于无法获取完整论文，消融实验的具体设置（如移除了哪些模块、对性能的影响幅度）尚不明确。

---

## 6. 主要结论与发现

1. **单图像3D高斯回归是可行且高效的**：通过端到端前馈神经网络，可以在**不到一秒**内从单张图像回归出高质量的3D高斯表示。

2. **实时渲染成为现实**：生成的3D高斯表示支持**超过100帧/秒**的实时渲染，输出高分辨率、照片级真实感的新视图。

3. **度量尺度支持精准相机运动**：SHARP的3D表示具有**绝对尺度**，支持按度量单位控制的相机运动。

4. **零样本泛化能力强**：模型在未见过的数据集上依然表现出色，具备良好的**跨数据集泛化能力**。

5. **显著超越SOTA**：在多个数据集上，LPIPS降低25–34%，DISTS降低21–43%，合成速度提升**三个数量级**。

---

## 7. 优点

- **⚡ 速度优势突出**：推理时间<1秒，渲染速度>100 FPS，相比先前方法提速**三个数量级**，使实时单图像3D重建从理论走向实用。

- **🎯 质量领先**：在LPIPS和DISTS两个重要感知指标上大幅超越SOTA（25–43%的相对提升），实现了**速度与质量的双重突破**。

- **🌐 零样本泛化**：模型训练后可直接应用于任意新图像，无需针对特定场景微调，具备良好的**实际部署价值**。

- **📐 度量尺度支持**：生成的3D表示具有绝对尺度，支持精确的度量单位相机运动，这对于AR/VR、机器人等应用**至关重要**。

- **🔓 开源可复现**：代码和预训练权重已在GitHub公开（https://github.com/apple/ml-sharp），便于学术界和工业界复现与二次开发。

---

## 8. 不足与局限

- **训练算力未披露**：论文未明确说明训练阶段所用的GPU型号、数量和训练时长，**难以评估训练成本**和可复现性门槛。

- **实验细节不完整**：从公开摘要无法获知具体使用的数据集列表、训练/测试划分方式、消融实验的详细设置等，**限制了实验完整性的独立判断**。

- **渲染依赖CUDA**：虽然预测可在CPU/MPS上运行，但视频渲染和实时可视化功能**目前需要CUDA GPU**，对Apple Silicon或AMD GPU用户不够友好。

- **应用范围限定**：SHARP针对的是“附近视角”（nearby views）的合成，对于**大角度视角变化或场景背面**的合成能力可能有限。

- **单图像固有限制**：从单张图像推理3D结构本质上是一个**不适定问题（ill-posed problem）** ，模型依赖数据驱动的先验知识，在遇到**分布外（out-of-distribution）场景**时可能产生几何或纹理幻觉。

---

（完）
