---
title: DYNAMIC NOVEL VIEW SYNTHESIS FROM UNSYNCHRONIZED VIDEOS USING GLOBAL-LOCAL MOTION CONSISTENCY PRIOR
title_zh: 基于全局-局部运动一致性先验的非同步视频动态新视角合成
authors: "Xinzhuo Zhang, Junyu Zhu, Hao Zhu, Yaning Li, Qi Zhang, Zhan Ma, Xun Cao"
date: 2025-09-15
pdf: "https://openreview.net/pdf?id=0KiCONP0xD"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 使用NeRF/GS框架的动态新视角合成
tldr: 本文针对动态新视角合成中多视角视频非同步导致的局部极小问题，提出一种3D全局-2D局部运动一致性先验。该先验通过比较预测场景流投影与预计算光流之间的对齐程度，有效校正时间错位。实验表明，投影全局场景流在不同视角下的各向异性运动比传统方法更利于修正时序误差，从而提升动态场景重建质量，且兼容NeRF和高斯泼溅框架。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有动态新视角合成依赖硬件同步，非同步设置下易陷入局部最优。
method: 提出3D全局-2D局部运动一致性先验，结合场景流投影和光流进行时序校正。
result: 该方法能有效解决大错位和纹理稀疏场景下的同步问题。
conclusion: 该先验提高了动态新视角合成在非同步视频上的鲁棒性。
---

## Abstract
Dynamic novel view synthesis (D-NVS) critically depends on hardware-based synchronization. Current approaches that accommodate unsynchronized settings within the widely-used NeRF or GS frameworks often struggle with local minima, particularly in textureless scenes or when multi-view videos exhibit large misalignments. To tackle this issue, we propose a novel 3D global–2D local motion consistency prior, which evaluates the alignment between predicted scene flow projections and pre-computed optical flows across multi-view videos. Our analysis reveals that the motion, produced by the anisotropy of projected global scene flow across different views, is inherently more effective for correcting temporal misalignments compared to the near-isotropic appearance typically leveraged in NeRF or GS. Extensive experiments on public datasets demonstrate the versatility of our loss function across various D-NVS architectures (NeRF and GS), achieving a 50% reduction in synchronization errors and a PSNR improvement of up to 4dB, thereby outperforming existing state-of-the-art methods.

---

## 论文详细总结（自动生成）

# 基于全局-局部运动一致性先验的非同步视频动态新视角合成——论文深度总结


## 一、论文的核心问题与整体含义

### 研究背景

- 动态新视角合成（Dynamic Novel View Synthesis, D-NVS）旨在从多视角视频中合成任意新颖视角的动态场景图像，是计算机视觉与图形学交叉领域的重要课题。
- 现有D-NVS方法（如基于NeRF或3D高斯泼溅（GS）的框架）**高度依赖硬件级同步**，要求多相机系统在采集时精确同步帧时刻。

### 核心问题

- 在**非同步设置**下（即多视角视频间存在时间偏移），现有方法容易陷入**局部极小值**问题，导致重建质量严重下降。
- 这一问题在**纹理稀疏场景**或**多视角视频存在较大错位**时尤为突出。

### 整体含义

- 本文旨在**突破硬件同步的限制**，提出一种不依赖精确硬件同步的动态新视角合成方法，使D-NVS技术能够在更宽松的采集条件下工作，从而降低应用门槛、拓展实际落地场景。


## 二、方法论

### 核心思想

- 提出一种**3D全局–2D局部运动一致性先验**（3D global–2D local motion consistency prior），通过约束三维场景运动与二维图像运动之间的一致性来校正时间错位。

### 关键技术细节

- **运动表征的双层结构**：
    - **3D全局层**：使用**场景流（scene flow）** 描述三维空间中各点的运动矢量，反映场景的整体动态。
    - **2D局部层**：使用**光流（optical flow）** 描述二维图像平面上的像素运动，反映局部视觉变化。

- **一致性评估机制**：
    - 将预测的3D场景流**投影**到各视角的二维图像平面上，得到投影场景流。
    - 将投影场景流与预先计算的光流进行**对齐度评估**，以此作为时序校正的监督信号。

- **各向异性优势**：
    - 论文分析指出，**投影全局场景流在不同视角下呈现各向异性运动**，这种特性在修正时序错位方面**天生优于**NeRF或GS框架中通常依赖的近似各向同性外观信息。

- **框架兼容性**：
    - 该损失函数具有**通用性**，可无缝集成到多种D-NVS架构中，实验验证了其在**NeRF和GS两种框架**上的有效性。


## 三、实验设计

### 数据集与场景

- 使用**公开数据集**进行实验验证。论文元数据中标注为“query:dgs-fm”，暗示实验可能涉及动态高斯泼溅（Dynamic Gaussian Splatting）相关数据集。

### Benchmark与对比方法

- 对比了**现有最先进方法（state-of-the-art）** 。
- 在NeRF和GS两种主流D-NVS架构上分别进行验证，确保方法的**跨框架通用性**。

### 评估指标

- **同步误差**：实现了**50%的降低**。
- **PSNR**：实现了**最高4dB的提升**。


## 四、资源与算力

**论文中未明确提及**所使用的GPU型号、数量或训练时长等算力信息。从方法描述来看，该方法在现有NeRF/GS框架基础上添加了额外的损失函数项，计算开销主要来自场景流投影与光流的对齐计算，但具体资源消耗情况需参考原文或补充材料。


## 五、实验数量与充分性

### 实验规模判断

- 论文在**NeRF和GS两种架构**上分别进行了验证，体现了方法的通用性。
- 使用了**公开数据集**进行评测，确保了实验的可复现性和对比的公平性。
- 对比了**现有最先进方法**，说明实验包含了与同类工作的横向比较。

### 充分性与客观性评估

- **优点**：跨框架验证（NeRF+GS）是实验设计上的亮点，能有效证明方法的通用性而非针对特定框架的调优。
- **局限**：由于无法获取完整论文，消融实验的具体设置（如是否有w/o先验的基线对比、不同错位程度下的鲁棒性测试等）无法确认。从元数据中的“Extensive experiments”表述来看，实验量应较为充分。


## 六、主要结论与发现

1. **提出的3D全局–2D局部运动一致性先验**能有效解决非同步多视角视频带来的时间错位问题，尤其在大错位和纹理稀疏场景下表现突出。

2. **投影场景流的各向异性**是比外观信息更有效的时序校正信号，这一发现对后续动态场景重建研究具有理论启发意义。

3. 该方法在**同步误差**上实现了**50%的降低**，在**PSNR**上实现了**最高4dB的提升**，显著优于现有最先进方法。

4. 该方法**兼容NeRF和GS两种主流框架**，具有良好的通用性和可移植性。


## 七、方法优点

### 方法层面的亮点

- **问题定位精准**：直击非同步设置这一实际应用中的痛点，而非在理想同步条件下“刷指标”。
- **先验设计巧妙**：3D全局与2D局部运动的交叉验证思路，利用了不同维度运动信息之间的互补性。
- **各向异性洞察**：揭示了投影场景流各向异性相比外观各向同性在时序校正中的优势，具有一定的理论深度。
- **框架无关性**：损失函数可插拔地应用于NeRF和GS，工程实用价值高。

### 实验层面的亮点

- 跨架构验证增强了结论的**泛化性**。
- 公开数据集保证了**可复现性**和**对比公平性**。


## 八、不足与局限

### 信息缺失方面的局限

- **算力需求不明确**：未报告GPU型号、数量、训练时长等资源信息，不利于其他研究者评估复现成本。
- **完整实验细节缺失**：消融实验的具体设计、不同错位程度下的鲁棒性测试、各类场景（室内/室外、人体/物体）的分项结果等无法从现有信息中确认。

### 方法层面的潜在局限

- **依赖光流预计算**：光流计算的准确性直接影响先验质量，在极端运动模糊或遮挡场景下可能存在误差累积。
- **纹理稀疏场景的改善程度**：虽然论文声称解决了纹理稀疏场景的问题，但具体改善幅度和边界条件未在摘要中量化。
- **实际部署约束**：方法仍基于NeRF/GS框架，继承了这些框架在训练时间、内存占用等方面的固有局限。

### 应用限制

- 方法针对**多视角视频**场景设计，对单目视频的适用性未作说明。
- 实际采集环境中，除同步问题外还存在曝光差异、白平衡不一致等复杂因素，方法的综合鲁棒性有待验证。

---

（完）
