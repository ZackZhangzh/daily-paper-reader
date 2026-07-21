---
title: "Rays as Pixels: Learning A Joint Distribution of Video and Camera Trajectories"
title_zh: 光线即像素：学习视频与相机轨迹的联合分布
authors: "Wonbong Jang, Shikun Liu, Soubhik Sanyal, Juan Camilo Perez, Kam Woh Ng, Sanskar Agrawal, Juan-Manuel Perez-Rua, Yiannis Douratsos, Tao Xiang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/c0a4677a69a2b0522f6d321e1f3ee53bad83072c.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 从稀疏图像进行新颖视图合成通过联合视频-相机轨迹扩散
tldr: 传统方法分离处理相机参数恢复和新颖视图渲染，在稀疏或模糊姿态时失效。本文提出Rays as Pixels，将相机表示为密集光线像素（raxels），与视频帧同时去噪，采用解耦自交叉注意力学习联合分布。该方法在稀疏输入下实现了高质量的新颖视图合成和相机轨迹估计。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 传统方法分离处理相机估计和新颖渲染，稀疏输入时失效。
method: 提出视频扩散模型联合学习视频和相机轨迹分布。
result: 在稀疏输入下实现高质量新颖视图合成和相机估计。
conclusion: 联合建模为稀疏视图场景提供了统一解决方案。
---

## Abstract
Can we bridge the gap between perceiving camera trajectories and rendering novel views within a single generative framework? Recovering camera parameters from images and rendering scenes from novel viewpoints are considered the forward and inverse problems in the field of computer vision and graphics. Previous approaches treat these problems in isolation, often failing when image coverage is sparse or camera poses are ambiguous. In this work, we propose Rays as Pixels, a specialized Video Diffusion Model (VDM) that learns a joint distribution of videos and camera trajectories. We represent cameras as dense ray pixels (raxels) and simultaneously denoise them alongside video frames using a novel Decoupled Self-Cross Attention. This joint formulation enables us to: i) generate a video from multiple input images following a defined camera trajectory, ii) perform novel view synthesis from sparse views (without necessarily requiring camera poses), and iii) predict the camera trajectory from a raw video. We evaluate our model on pose estimation, camera-controlled video generation and validate its self-consistency. Please reference supplementary material for more qualitative results.

---

## 论文详细总结（自动生成）

# 论文详细中文总结

## 1. 核心问题与整体含义（研究动机与背景）

在计算机视觉与图形学中，**相机参数估计**（从图像恢复相机轨迹，即“逆问题”）与**新视角渲染**（基于给定几何和轨迹生成图像，即“正问题”）长期以来被视作两个相互独立的任务。传统管线中，Structure-from-Motion（SfM）作为前置步骤，要求密集重叠的视图来估计相机参数；而NeRF、3D Gaussian Splatting等渲染方法则直接将预测的相机参数当作真值使用。

这种分离式处理在**图像覆盖稀疏**或**相机位姿存在歧义**时暴露出根本性脆弱——两个任务彼此依赖，却缺乏联合建模。优化式方法（如NeRF、3DGS）擅长重建观测区域，但在稀疏输入下无法合理合成被遮挡区域，容易产生模糊或浮动伪影。

**本文的核心假设**：视频与相机轨迹存在可学习的联合分布，统一建模能显著提升二者在低监督条件下的互一致性与泛化能力。论文提出“Rays as Pixels”——**首个将视频帧与相机轨迹联合建模的视频扩散模型（VDM）**，旨在单个框架内同时解决相机轨迹预测和新视角合成问题。


## 2. 方法论：核心思想、关键技术细节与算法流程

### 核心思想

将相机表示为**稠密光线像素（raxels，ray pixels的合成词）**，使其与视频帧处于**相同的隐空间**中，通过统一的扩散模型对二者进行**联合去噪**，从而学习视频与相机轨迹的联合概率分布。

### 关键技术细节

**（1）Raxel表示**

将每台相机编码为像素对齐的稠密光线像素（raxels）——每个像素编码对应相机光线的**原点（origin）和方向（direction）**。这种表示使raxels能够与RGB视频帧使用**相同的时空VAE进行编码**，并由**相同的扩散主干网络**处理，无需额外修改。

**（2）解耦自交叉注意力（Decoupled Self-Cross Attention）**

这是本文的核心机制创新，在去噪过程中实现两个模态的联合处理：
- **自注意力（Self-Attention）** ：对raxels自身进行注意力计算，处理射线几何结构信息；
- **交叉注意力（Cross-Attention）** ：在raxels与视频像素之间进行跨模态对齐；
- 两者**解耦**设计，使模型能够分别捕捉几何先验和视觉内容，同时实现二者的有效交互。

**（3）统一框架的三项任务**

单个训练完成的模型可统一处理三种推理模式：
- **任务一**：根据输入视频预测相机运动轨迹（轨迹推断）；
- **任务二**：根据输入图像沿指定目标相机轨迹生成视频（轨迹条件生成）；
- **任务三**：根据输入图像联合生成视频及对应的相机轨迹（联合生成）。

**（4）闭环自洽性测试**

由于模型既能从视频预测轨迹（前向：video→pose），又能依据预测的轨迹条件化生成新视角画面（逆向：pose→video），论文设计了**闭环自洽性测试**来评估前后向预测的一致性。


## 3. 实验设计：数据集、Benchmark与对比方法

### 数据集与场景

论文在**真实场景数据集**上验证，主要包括：
- **ScanNet**：包含大量室内场景的RGB-D视频序列；
- **LLFF（Light Field Live Forward）** ：包含真实场景的前向拍摄视频。

### 评估任务

- **位姿估计（Pose Estimation）** ：评估模型从视频中预测相机轨迹的准确性；
- **相机控制视频生成（Camera-Controlled Video Generation）** ：评估模型沿指定轨迹生成视频的质量；
- **自洽性验证（Self-Consistency）** ：验证预测位姿与以这些位姿为条件的渲染结果之间的一致性。

### 对比方法

论文与**Plücker嵌入**进行消融对比，证明将相机表示在与视频**共享的隐空间**中远比替代方案更有效。此外，论文还将所提方法与**回归式方法**（将图像块映射到对应光线的approach）进行对比。


## 4. 资源与算力

**论文中未明确说明**所使用的GPU型号、数量及训练时长等具体算力信息。从作者单位（全部为Meta AI, London）来看，实验应当具备充足的工业级计算资源支持，但具体细节在提供的文本中未予披露。


## 5. 实验数量与充分性

### 实验组数

从提供的文本来看，实验主要包括：
- **位姿估计实验**：在ScanNet和LLFF上的定量评估；
- **相机控制视频生成实验**：评估生成质量；
- **自洽性测试**：闭环定量评估前后向预测一致性；
- **消融实验**：与Plücker嵌入的对比消融。

### 充分性与客观性评估

实验设计**较为合理**：
- 覆盖了两个主流真实场景数据集（ScanNet室内、LLFF前向）；
- 涵盖了三项核心任务（轨迹预测、条件生成、联合生成）的评估；
- 闭环自洽性测试是**首次引入**的定量评估范式，具有创新性；
- 消融实验针对关键设计选择（raxel vs. Plücker）进行了对比。

但受限于文本信息量，无法判断实验的**统计显著性**、**误差棒**、**多轮重复**等细节。作为ICML 2026接收论文，其实验设计应当经过了同行评审的检验，整体可信度较高。


## 6. 主要结论与发现

1. **联合建模的有效性**：将视频与相机轨迹在同一扩散模型中联合学习，能够在稀疏输入下同时实现高质量的相机位姿估计和新视角合成。

2. **Raxel表示的优势**：将相机表示为与视频帧共享隐空间的稠密光线像素，比Plücker嵌入等替代方案显著更有效。

3. **几何先验的早期收敛**：轨迹预测仅需**2–4步去噪**即可达到高自洽性，远少于视频生成所需的**50+步**，揭示了几何先验在扩散过程中具有早期收敛特性。

4. **自洽性验证**：模型的前向预测（视频→轨迹）与逆向预测（轨迹→视频）高度一致，证明了联合分布学习的内部一致性。

5. **统一框架的可行性**：单个模型即可处理三项不同任务，验证了将正问题和逆问题统一建模的可行性。


## 7. 优点：方法与实验设计的亮点

1. **首创性**：首个在单一框架内同时实现相机位姿预测和相机控制视频生成的模型。

2. **统一建模范式**：打破传统SfM→NeRF/3DGS的串行管线，将正问题与逆问题联合学习，从根本上解决了分离式处理在稀疏输入下的脆弱性。

3. **创新的Raxel表示**：将相机编码为与视频帧对齐的“光线像素”，使两种模态能够在**相同的隐空间和相同的扩散主干**中处理，设计优雅且工程简洁。

4. **解耦自交叉注意力**：通过自注意力和交叉注意力的解耦设计，分别处理几何结构与跨模态对齐，机制清晰且可解释性强。

5. **闭环自洽性测试**：首次引入该评估范式定量衡量前后向预测的一致性，为生成模型的可信度评估提供了新思路。

6. **开源可用**：代码已开源发布（GitHub: rays-as-pixels/VDM）。


## 8. 不足与局限

1. **算力信息缺失**：未披露GPU型号、数量、训练时长等资源信息，不利于复现和资源评估。

2. **实验细节不充分**：从提供的文本中难以判断定量指标的具体数值、与基线方法的全面对比、以及统计显著性分析等。

3. **场景覆盖有限**：仅在ScanNet（室内）和LLFF（前向）两个数据集上验证，**缺乏对室外大场景、动态场景、极端光照等更具挑战性条件的评估**。

4. **应用场景限制**：作为生成式模型，在需要**精确几何重建**的任务（如高精度3D建模、自动驾驶中的厘米级定位）中，生成式方法的不确定性可能成为瓶颈。

5. **实时性未知**：虽然轨迹预测仅需2–4步去噪，但完整视频生成仍需50+步，实际推理效率未知。

6. **缺少与最新SOTA的全面对比**：文本中未明确列出与最新3D-aware生成模型（如Gao et al., 2025; Liu et al., 2026）的定量对比结果。


（完）
