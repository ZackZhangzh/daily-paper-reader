---
title: Hybrid 3D-4D Gaussian Splatting for Fast Dynamic Scene Representation
title_zh: 混合3D-4D高斯泼溅用于快速动态场景表示
authors: "Seungjun Oh, Minseo Lee, Byeonghyeon Lee, Younggeun Lee, Hyejin Jeon, Eunbyung Park"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=V83a0sPhRl"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 混合3D-4D高斯泼溅用于动态场景表示
tldr: 4D高斯泼溅用于动态场景重建质量高，但静态区域分配过多4D高斯导致计算和内存浪费，且可能降低图像质量。本文提出混合3D-4D高斯泼溅（3D-4DGS），初始化为全4D表示，然后自适应地将静态区域转换为3D高斯，动态区域保留4D高斯。该框架在保证动态视角合成保真度的同时显著降低存储和计算开销，并提升静态区域渲染质量。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 全4D高斯泼溅在静态区域冗余分配，浪费计算且影响质量。
method: 自适应区分静态和动态区域，分别用3D和4D高斯表示。
result: 降低开销，提升静态区域质量，保持动态合成保真度。
conclusion: 混合表示是高效动态场景重建的有效方案。
---

## Abstract
Recent advancements in dynamic 3D scene reconstruction have shown promising results, enabling high-fidelity 3D novel view synthesis with improved temporal consistency. Among these, 4D Gaussian Splatting (4DGS) has emerged as an appealing approach due to its ability to model high-fidelity spatial and temporal variations. However, existing methods suffer from substantial computational and memory overhead due to the redundant allocation of 4D Gaussians to static regions, which can also degrade image quality. In this work, we introduce hybrid 3D–4D Gaussian Splatting (3D-4DGS), a novel framework that adaptively represents static regions with 3D Gaussians while reserving 4D Gaussians for dynamic elements. Our method begins with a fully 4D Gaussian representation and iteratively converts temporally invariant Gaussians into 3D, significantly reducing the number of parameters and improving computational efficiency. Meanwhile, dynamic Gaussians retain their full 4D representation, capturing complex motions with high fidelity. Our approach achieves significantly faster training times compared to baseline 4D Gaussian Splatting methods while maintaining or improving the visual quality.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景**：动态3D场景重建在虚拟现实、增强现实、体育转播、电影制作等领域具有重要应用价值。近年来，4D高斯泼溅（4D Gaussian Splatting, 4DGS）因其能够高质量建模空间与时间变化而成为一种有前景的方法。

**核心问题**：现有4DGS方法存在严重的计算与内存开销问题，原因在于**将大量4D高斯冗余分配给了静态区域**——这些区域本不需要随时间变化的参数，冗余分配不仅浪费资源，还可能降低图像质量。

**整体含义**：本文提出混合3D-4D高斯泼溅（3D-4DGS）框架，自适应地用3D高斯表示静态区域、用4D高斯表示动态元素，在保证动态视角合成保真度的同时显著降低存储与计算开销。该工作被ICLR-2026接收，评分9.0。


## 二、方法论

**核心思想**：静态区域使用3D高斯（不含时间维度），动态区域保留4D高斯（含时空维度），通过迭代分类实现自适应分配。

**关键技术流程**：

1. **初始化**：从完全的4D高斯表示出发。对于N3V数据集，使用COLMAP稠密重建初始化（约30万个点）；对于Technicolor数据集（仅50帧），使用稀疏COLMAP初始化。

2. **动态分类机制**：在每次密集化（densification）阶段，基于**时间尺度（temporal scale）** 判断高斯是静态还是动态。若高斯的时间尺度超过预设阈值$\tau$，则判定为静态，从4D转换为3D。阈值$\tau$根据序列长度设定：N3V的10秒序列设为3，40秒序列设为6，Technicolor设为1。

3. **3D-4D高斯转换**：4D高斯由均值$\mu_{4D}=(\mu_x, \mu_t)$（$\mu_x \in \mathbb{R}^3$为空间中心，$\mu_t \in \mathbb{R}$为时间坐标）和$4 \times 4$旋转矩阵$R_{4D}$表征。转换为3D时，丢弃时间分量$\mu_t$，保留空间均值$\mu_x$；旋转矩阵退化为$3 \times 3$纯空间旋转$R_{3D}$。转换后的3D高斯由$(\mu_x, q_{3D}, s_x, s_y, s_z, \sigma, \mathrm{SH})$完整定义。

4. **训练与渲染**：动态高斯保留完整4D表示以捕捉复杂运动，3D与4D高斯被无缝集成到同一渲染管线中，投影到屏幕空间进行alpha合成。


## 三、实验设计

**数据集**：
- **N3V（Neural 3D Video）数据集**：包含多个10秒多视角视频片段（coffee_martini、cook_spinach、cut_roasted_beef、flame_salmon、flame_steak、sear_steak）以及一个40秒长序列。
- **Technicolor数据集**：包含16相机光场捕获的短时复杂场景（50帧）。

**Benchmark与对比方法**：对比了HyperReel、NeRFPlayer、K-Planes、MixVoxel-L、4DGS、4DGaussian、STG、E-D3DGS、Ex4DGS等多种动态场景重建方法。

**评估指标**：PSNR、SSIM、LPIPS，以及训练时间、存储占用、渲染帧率（FPS）。


## 四、资源与算力

论文明确报告了算力配置：

- **N3V数据集（10秒片段）** ：使用**单张RTX 4090 GPU**，训练12分钟。
- **N3V数据集（40秒长序列）** ：训练52分钟。
- **Technicolor数据集**：使用**RTX 3090 GPU**（Painter场景），训练29分钟。

所有方法的训练时间均在**同一台配备RTX 4090的机器**上测量（除4D-Rotor GS因代码未公开而基于迭代次数估算）。基线4DGS方法（Yang et al., 2023a）在相同硬件上需要5.5小时。


## 五、实验数量与充分性

**实验组数**：主要包含以下实验：

1. **N3V数据集定量对比**（6个场景 + 平均结果）
2. **N3V 40秒长序列定量对比**
3. **Technicolor数据集定量对比**
4. **消融实验**：对比了4DGS基线、本方法、有无opacity reset、不同时间尺度阈值（$\tau=2.5, 3.0, 3.5$）的影响

**充分性与客观性评估**：
- ✅ **对比全面**：涵盖了NeRF-based、3DGS-based、4DGS-based等多种范式的方法。
- ✅ **指标多样**：同时报告了PSNR、SSIM、LPIPS、训练时间、存储、FPS等多维度指标。
- ✅ **消融充分**：对关键超参数（$\tau$阈值）和设计选择（opacity reset）进行了系统分析。
- ⚠️ **局限性**：部分对比方法的训练时间引自原始论文而非统一重测；4D-Rotor GS因代码未公开只能估算。


## 六、主要结论与发现

1. **训练速度大幅提升**：本方法在N3V数据集上仅需12分钟训练（10秒片段），比基线4DGS（5.5小时）**快约27倍**；40秒长序列仅需52分钟。

2. **质量保持或提升**：N3V数据集平均PSNR达到32.25 dB，超过4DGS的32.01 dB；Technicolor数据集PSNR为33.22 dB，与4DGS（33.35 dB）相当。

3. **存储效率显著**：4D高斯数量从331万降至84万（减少约75%），总存储273 MB，远低于4DGS的2.1 GB。

4. **渲染速度优异**：达到208 FPS的高帧率渲染。


## 七、优点

1. **方法创新性强**：首次提出混合3D-4D高斯表示，自适应区分静态/动态区域，概念简洁且有效。

2. **效率提升显著**：训练速度提升约3-5倍，存储降低约一个数量级。

3. **动态分类策略精巧**：分类在每次密集化阶段动态进行而非一次性预处理，使模型能随优化过程逐步精细化分。

4. **实验设计扎实**：在两个标准数据集上进行了充分验证，包含长序列挑战性实验和系统消融研究。

5. **结果可复现性强**：代码将公开，训练配置（迭代次数、batch size、阈值等）报告详细。


## 八、不足与局限

1. **依赖COLMAP初始化**：方法仍需COLMAP进行点云初始化，对输入质量敏感。

2. **阈值需人工设定**：时间尺度阈值$\tau$需根据序列长度手动调整（10秒为3，40秒为6，Technicolor为1），缺乏自适应机制。

3. **部分场景质量略逊**：在Technicolor数据集上LPIPS为0.149，高于Ex4DGS（0.088）和4DGS（0.025）。

4. **长序列存储仍较高**：273 MB的存储虽优于4DGS（2.1 GB），但仍高于部分轻量方法（如4DGaussian仅34 MB）。

5. **实验场景类型有限**：主要验证了多视角视频场景，未涉及单目视频、户外大场景等更具挑战性的设定。

6. **实际部署考虑不足**：未深入讨论模型在不同硬件上的推理延迟、内存带宽需求等工程化问题。

（完）
