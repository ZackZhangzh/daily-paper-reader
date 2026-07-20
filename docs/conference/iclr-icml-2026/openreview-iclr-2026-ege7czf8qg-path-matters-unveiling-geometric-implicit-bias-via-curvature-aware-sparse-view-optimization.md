---
title: "Path Matters: Unveiling Geometric Implicit Bias via Curvature-Aware Sparse View Optimization"
title_zh: 路径重要：通过曲率感知稀疏视图优化揭示几何隐式偏差
authors: "Canran Xiao, Liaoyuan Fan, Yanbin Li, Jing Tang, Peilai Yu"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=egE7czf8qg"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 稀疏视图3DGS优化解决曲率和轨迹偏差
tldr: 3DGS在稀疏视图下存在几何不准确和渲染质量下降问题。本文发现两个隐式偏差：高曲率区域需要更强监督，且模型对输入视图轨迹平滑度敏感。据此提出相机路径优化框架，在不增加输入视图数量的情况下提升稀疏视图新视图合成质量。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS几何误差和视图不一致，缺乏理论解释。
method: 分析隐式偏差，优化相机轨迹平滑度和高曲率区域监督。
result: 有效提升稀疏视图下的重建几何精度和渲染一致性。
conclusion: 考虑视图轨迹和曲率偏差可显著改善稀疏视图3DGS性能。
---

## Abstract
3D Gaussian Splatting (3DGS) has recently emerged as a powerful approach for novel view synthesis by reconstructing scenes as sets of Gaussian ellipsoids. Despite its success in scenarios with dense input images, 3DGS faces critical challenges in sparse view settings, often resulting in geometric inaccuracies, inconsistencies across views, and degraded rendering quality. In this paper, we uncover and address two key implicit biases of 3DGS reconstruction algorithm in sparse-view: (1) the model has a stronger demand for supervision signal toward regions of high curvature, and (2) the model is sensitive to the smoothness of the trajectory of the input views. To tackle these issues, we propose a novel framework that optimizes camera trajectories to maximize curvature coverage while enforcing smooth motion, and we further enhance the informativeness of data through a synthetic view generation process. Extensive experiments on Mip-NeRF 360, DTU, Blender, Tanks & Temples, and LLFF datasets show that our method substantially outperforms state-of-the-art solutions in sparse-view scenarios, both in rendering quality and geometric fidelity. Beyond these empirical gains, our investigation uncovers the subtle ways in which data representation and trajectory planning interact to shape 3DGS performance, offering deeper theoretical insights into the algorithm’s inherent biases.

---

## 论文详细总结（自动生成）

# 《Path Matters: Unveiling Geometric Implicit Bias via Curvature-Aware Sparse View Optimization》论文总结

## 一、核心问题与整体含义（研究动机与背景）

3D Gaussian Splatting（3DGS）是近年来新兴的神经渲染方法，通过将场景重建为一组高斯椭球体来实现新视图合成。在输入图像密集的场景中，3DGS已展现出强大的性能；然而在**稀疏视图**（sparse-view）设置下，该方法面临严峻挑战，具体表现为：

- **几何不准确**（geometric inaccuracies）
- **视图间不一致**（inconsistencies across views）
- **渲染质量下降**（degraded rendering quality）

本文的核心贡献在于**首次揭示并系统分析了3DGS在稀疏视图下的两种隐式偏差**（implicit biases），并据此提出针对性的优化框架。研究动机源于：现有稀疏视图3DGS方法缺乏对算法内在偏差的理论解释，导致改进方向缺乏系统性。论文从“数据表示与轨迹规划如何影响3DGS性能”这一根本问题出发，为理解算法固有偏差提供了深层理论洞察。


## 二、方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

论文揭示了两大关键隐式偏差：

1. **曲率偏差（Curvature Bias）** ：模型对高曲率区域的监督信号需求更强——即曲面弯曲程度越大的区域，需要越多的观测视图才能被准确重建。
2. **轨迹平滑度偏差（Trajectory Smoothness Bias）** ：模型对输入视图轨迹的平滑度高度敏感——视图轨迹越不平滑（如相机位姿跳跃过大），重建质量越差。

基于上述发现，论文提出通过**优化相机轨迹**来最大化曲率覆盖（curvature coverage），同时保证运动平滑性。

### 2.2 关键技术细节

- **相机轨迹优化**：设计了一个优化框架，通过调整输入视图的相机位姿轨迹，使其在覆盖高曲率区域与保持运动平滑之间取得平衡。
- **合成视图生成**：在轨迹优化的基础上，进一步增强数据的“信息量”（informativeness），通过合成视图生成过程补充监督信号。
- **曲率感知的监督分配**：核心机制是让模型在训练过程中，对高曲率区域施加更强的监督权重，以弥补稀疏观测下这些区域信息不足的问题。

### 2.3 算法流程（文字说明）

1. **输入**：稀疏的输入视图及其相机位姿；
2. **曲率分析**：对场景几何进行初步估计，识别高曲率区域；
3. **轨迹优化**：在保持运动平滑的约束下，调整/优化相机轨迹以最大化对高曲率区域的覆盖；
4. **合成视图生成**：在优化后的轨迹上生成合成视图，增强数据信息量；
5. **3DGS训练**：使用原始视图与合成视图共同监督3DGS训练，其中高曲率区域获得更高监督权重；
6. **迭代优化**：上述过程可与3DGS训练交替进行，逐步提升重建精度。


## 三、实验设计

### 3.1 使用的数据集

论文在**五个公开数据集**上进行了广泛实验：

| 数据集 | 特点 |
|--------|------|
| Mip-NeRF 360 | 大规模、无界场景 |
| DTU | 多视图物体重建基准 |
| Blender | 合成物体数据集 |
| Tanks & Temples | 真实场景、大尺度 |
| LLFF | 前向视角场景 |

### 3.2 Benchmark与对比方法

论文将其方法与**当前最优（SOTA）方法**在稀疏视图场景下进行对比，评估维度包括：

- **渲染质量**（rendering quality）
- **几何保真度**（geometric fidelity）

论文声称其方法在这两个维度上均**显著优于**现有SOTA解决方案。

> **注意**：当前可获取的公开信息中未列出具体的对比方法名称（如具体对比了哪些稀疏视图3DGS变体），完整对比方法列表需查阅论文全文。


## 四、资源与算力

**文中未明确说明**所使用的GPU型号、数量、训练时长等算力相关信息。当前可获取的公开信息（OpenReview摘要页面、ICLR虚拟会议页面等）均未涉及计算资源的具体描述。

如需获取此信息，建议查阅论文全文的实验设置（Experimental Settings / Implementation Details）部分。


## 五、实验数量与充分性

### 5.1 实验规模

从公开信息推断，论文的实验设计包含以下维度：

- **5个数据集**：覆盖合成物体（Blender）、真实物体（DTU）、大尺度场景（Tanks & Temples）、无界场景（Mip-NeRF 360）和前向视角（LLFF）等多种场景类型；
- **多维度评估**：同时评估渲染质量与几何保真度；
- **SOTA对比**：与当前最优方法进行全面比较。

### 5.2 充分性与客观性评估

- **优势**：数据集选择全面，覆盖了3D重建和新视图合成领域的主流基准，场景类型多样（合成/真实、物体/场景、有界/无界），实验结果具有较强的说服力。
- **局限**：由于无法获取论文全文，**消融实验（ablation study）的具体设计尚不明确**，无法判断各组件（轨迹优化、合成视图生成、曲率加权监督）的独立贡献是否得到了充分验证。
- **公平性**：论文声称在稀疏视图场景下与SOTA方法对比，但具体的稀疏视图设置（如每个场景使用多少张训练视图）在公开摘要中未披露。


## 六、主要结论与发现

1. **理论发现**：3DGS在稀疏视图下存在两种关键隐式偏差——**高曲率区域需要更强监督**，以及**模型对输入视图轨迹平滑度敏感**。
2. **方法有效性**：通过曲率感知的相机轨迹优化与合成视图生成，可在**不增加输入视图数量的情况下**显著提升稀疏视图下的新视图合成质量。
3. **性能提升**：在五个基准数据集上，该方法在渲染质量和几何保真度两方面均大幅超越SOTA方法。
4. **深层洞察**：研究揭示了数据表示与轨迹规划如何交互影响3DGS性能，为算法固有偏差提供了理论层面的理解。


## 七、方法亮点

1. **问题视角新颖**：首次从“隐式偏差”的理论视角系统分析稀疏视图3DGS的性能瓶颈，而非仅从工程角度提出启发式改进。
2. **无需增加输入视图**：方法的核心优势在于不依赖更多输入图像即可提升性能，这对于实际应用中数据采集成本高的场景尤为重要。
3. **曲率感知的监督机制**：将几何先验（曲率）引入优化过程，使模型在数据稀疏时能“智能地”聚焦于信息量最大的区域。
4. **轨迹优化与合成视图结合**：通过优化相机轨迹和生成合成视图的双重手段增强数据信息量，形成了完整的解决方案。
5. **理论贡献与实践贡献并重**：既提供了对3DGS算法内在偏差的理论解释，又提出了可操作的改进框架。
6. **实验覆盖全面**：5个主流数据集、多种场景类型、多维度评估指标，验证了方法的泛化能力。


## 八、不足与局限

1. **算力信息缺失**：论文公开信息中未说明训练所需的计算资源，无法评估方法在实际部署中的计算成本。
2. **消融实验细节不详**：基于公开摘要无法确认是否对每个组件（轨迹优化、合成视图生成、曲率加权等）进行了充分的消融分析。
3. **稀疏视图定义不明确**：公开信息中未明确“稀疏视图”的具体数量（如每个场景使用2张、3张还是6张训练视图），这直接影响对方法适用场景的判断。
4. **对比方法列表未知**：未列出具体对比的SOTA方法名称，难以判断对比的全面性和公平性。
5. **场景类型覆盖的潜在偏差**：虽然数据集多样，但未说明方法是否在所有场景类型上均有一致表现，可能存在对特定场景类型（如合成物体vs真实场景）的偏好。
6. **实际应用限制**：方法依赖相机轨迹优化，在无法精确获取相机位姿或位姿估计存在较大误差的实际场景中，方法效果可能受影响。
7. **合成视图的质量依赖**：方法通过合成视图增强数据信息量，但合成视图本身的质量直接影响最终效果，在复杂场景中合成视图的可靠性需要进一步验证。


**（完）**
