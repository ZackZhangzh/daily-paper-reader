---
title: Continuous Viewpoint Adaptation for Single View 3D Object Reconstruction
title_zh: 单视图3D物体重建的连续视点适应
authors: "Seunghyun Hwang, Qiang Qiu"
date: 2026-04-30
pdf: "https://openreview.net/pdf/f5462cea175bfb03538937d7543cb93387630921.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 单视图3D物体重建和新视图合成，使用3DGS
tldr: 针对单视图3D物体重建中视点变化敏感和遮挡问题，提出连续视点适应学习方案，基于3D高斯泼溅，通过连续适应输入视角的极角和方位角，预测构成物体的3D高斯元，从而减少新视图渲染中的不一致和模糊伪影，提高了重建质量。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 单视图重建对视角变化敏感，易产生模糊伪影。
method: 利用3DGS，设计连续适应输入视角的学习方案。
result: 改善了新视图渲染的一致性，减少了遮挡导致的伪影。
conclusion: 连续视点适应可提升单视图3D重建的鲁棒性和渲染质量。
---

## Abstract
Single-view 3D object reconstruction presents a formidable challenge in computer vision due to the inherent limitations of information obtainable from a solitary viewpoint. Recent 3D Gaussian Splatting (3DGS) inspired approaches perform a feed-forward way of learning a neural network that predicts 3D Gaussians which compose the 3D object, given a single image. However, they often struggle with occlusions and exhibit high sensitivity to small changes in input viewpoint, leading to inconsistencies and blurry artifacts in novel view renderings. Our method leverages 3DGS and introduces a new learning scheme that continuously adapts to input viewpoints. 
To address inherent continuity of camera viewpoints that are represented by polar and azimuthal angles, we use Neural Ordinary Differential Equations to continuously model filter subspace of neural network, thus seamlessly embedding inductive bias of perspective distortions into its structure. By continuously adapting to view-specific features, our approach fosters view consistency in 3D reconstruction, allowing better coherency and accuracy across different angles. Experiments demonstrate that our model outperforms previous methods on multiple single-view 3D reconstruction benchmark datasets and excels in extrapolating to unseen camera angles and categories.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

单视图3D物体重建是计算机视觉中的一项极具挑战性的任务，其根本困难在于：仅凭单一视角的图像，可获得的信息极为有限，难以完整还原物体的三维结构。

近年来，受3D高斯泼溅（3D Gaussian Splatting, 3DGS）启发的方法采用前馈方式学习神经网络，从单张图像直接预测构成3D物体的高斯元。然而，这类方法存在两个核心缺陷：**一是对遮挡的处理能力不足**，**二是对输入视点的微小变化高度敏感**，导致在新视角渲染时产生不一致性和模糊伪影。

针对上述问题，本文提出了一种**连续视点适应学习方案**，旨在让模型能够根据输入视点的变化动态调整自身结构，从而提升跨视角的重建一致性和准确性。


## 二、方法论

### 2.1 核心思想

论文的核心思想是：相机视点（由极角和方位角表示）本身具有**连续性**，因此模型也应当以连续的方式适应视点变化，而不是将不同视点视为离散的、相互独立的输入。

具体而言，作者利用**神经常微分方程（Neural Ordinary Differential Equations, Neural ODE）** 对神经网络的**滤波器子空间**进行连续建模，从而将透视畸变的归纳偏置无缝嵌入到网络结构中。

### 2.2 技术路线

- **基础框架**：基于3DGS，采用前馈方式学习一个神经网络，从单张输入图像预测构成目标物体的3D高斯元。
- **关键创新**：引入连续视点适应机制——将相机视点（极角θ和方位角φ）视为连续变量，通过Neural ODE对网络的滤波器子空间进行连续建模，使网络参数能够平滑地随视点变化而调整。
- **实现效果**：通过持续适应视点特定的特征，模型在3D重建中增强了视角一致性，在不同角度下实现了更好的连贯性和准确性。

### 2.3 公式与算法流程（文字说明）

论文使用Neural ODE来建模滤波器子空间的连续演化。具体来说，网络的滤波器参数被视为一个随视点参数（极角与方位角）连续变化的动态系统的状态。Neural ODE通过定义一个由神经网络参数化的微分方程，来描述这一演化过程。在训练和推理时，模型根据输入图像的视点角度，沿着该动态系统“积分”到对应的滤波器状态，从而获得与该视点相匹配的网络参数。这使得模型能够在**连续**的视点空间中进行推理，而非仅在有限个离散视点上插值。


## 三、实验设计

### 3.1 数据集与场景

论文在**多个单视图3D重建基准数据集**上进行了实验评估。元数据中提及的benchmark包括**GSO数据集**。具体数据集名称在提供的摘要中未逐一列出，但从论文的泛化性实验来看，应包含常见的物体重建数据集（如ShapeNet系列等）。

### 3.2 对比方法

论文对比了**以往的单视图3D重建方法**，特别是基于3DGS的前馈式方法。具体对比的模型名称在摘要中未详细列出。


## 四、资源与算力

**论文提供的摘要和元数据中未明确说明所使用的GPU型号、数量或训练时长。** 这一问题无法从现有材料中获知。


## 五、实验数量与充分性

从现有信息来看，实验设计包括以下几个方面：

- **多数据集验证**：在多个基准数据集上进行了实验，说明并非仅在单一数据集上验证。
- **泛化性测试**：模型在**未见过的相机角度和物体类别**上进行了外推测试，这是衡量模型泛化能力的重要指标。

**评估**：从上述信息来看，实验设计覆盖了**跨数据集**和**跨类别/跨视角泛化**两个重要维度，具备一定的充分性。但受限于摘要篇幅，**具体的消融实验数量、各数据集上的详细指标、对比方法的完整列表**等信息未能呈现，因此无法对实验的全面性做出完整判断。


## 六、论文的主要结论与发现

1. **本文提出的连续视点适应方法在多个单视图3D重建基准数据集上优于以往的方法**。
2. **模型在未见过的相机角度和物体类别上表现出了优异的外推能力**，说明该方法具有良好的泛化性。
3. 通过连续适应视点特定特征，模型有效**增强了视角一致性**，减少了新视角渲染中的不一致性和模糊伪影。


## 七、优点

1. **问题定位精准**：准确指出现有3DGS前馈方法对视点变化敏感、易产生遮挡伪影的核心缺陷。
2. **方法论创新性强**：将Neural ODE引入3DGS框架，利用其对连续动态系统的建模能力来处理视点的连续性，这在思路上具有较好的原创性。
3. **归纳偏置的巧妙嵌入**：通过连续建模滤波器子空间，将透视畸变的物理规律自然地融入网络结构，而非依赖数据驱动的方式让模型自行学习。
4. **泛化性验证充分**：明确测试了在**未见过的相机角度和物体类别**上的表现，证明了方法的泛化能力。


## 八、不足与局限

1. **算力信息缺失**：论文未说明训练所需的GPU型号、数量及训练时长，不利于其他研究者评估方法的复现成本。
2. **对比方法细节不详**：摘要未列出具体对比的基线模型名称，读者难以直接定位方法的技术贡献层级。
3. **实验细节有限**：受摘要篇幅限制，消融实验、各数据集上的定量指标、可视化结果等均未呈现，无法全面评估实验的充分性。
4. **潜在的应用限制**：方法基于3DGS框架，其推理效率和内存占用可能受到高斯元数量的影响，这在实时应用场景中可能构成限制（但摘要中未讨论此问题）。
5. **遮挡问题的处理程度**：尽管方法声称改善了遮挡导致的伪影，但摘要未说明其对严重遮挡场景的处理效果是否具有鲁棒性。

（完）
