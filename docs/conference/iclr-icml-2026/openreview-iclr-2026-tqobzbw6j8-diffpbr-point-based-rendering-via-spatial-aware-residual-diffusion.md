---
title: "DiffPBR: Point-Based Rendering via Spatial-Aware Residual Diffusion"
title_zh: DiffPBR：基于空间感知残差扩散的点云渲染
authors: "Yiping Xie, Yuchi Huo, Yunlong Ran, Zijian Huang, Lincheng Li, Yingfeng Chen, Jiming Chen, Qi Ye"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=tqOBZbW6j8"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 基于扩散的点云渲染用于新视图合成
tldr: 提出基于扩散的DiffPBR框架，通过几何和可见性约束的视点噪声引导，直接从点云生成一致的光影渲染，无需每场景优化，并引入自适应光栅化提高效率。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 从点云直接高质量渲染且无需每场景优化仍具挑战。
method: 扩散模型结合视点投影噪声，受场景几何和可见性约束，配合自适应CoNo-Splatting光栅化。
result: 实现几何一致性渲染，在多种点云输入上生成逼真新视图。
conclusion: 扩散模型可有效替代每场景优化，为点云新视图合成提供高效方案。
---

## Abstract
Neural radiance fields and 3D Gaussian splatting (3DGS) have significantly advanced 3D reconstruction and novel view synthesis (NVS). Yet, achieving high-fidelity and view-consistent renderings directly from point clouds---without costly per-scene optimization---remains a core challenge. In this work, we present DiffPBR, a diffusion-based framework that synthesizes coherent, photorealistic renderings from diverse point cloud inputs. We demonstrate that diffusion models, when guided by viewpoint-projected noise explicitly constrained by scene geometry and visibility, naturally enforce geometric consistency across camera motion. To achieve this, we first introduce adaptive CoNo-Splatting, a technique for fast and faithful rasterization that ensures efficient and effective handling of point clouds. Secondly, we integrate residual learning into the neural re-rendering pipeline, which improves convergence, generalization, and visual quality across diverse rendering tasks. Extensive experiments show that our method outperforms existing baselines with an improvement of **3~5dB** in rendered image quality, a reduction from **41 to 8** in GPU hours for training, and an increase from **3.6fps to 10fps** (our one-step variant) in rendering speed frequency.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义（研究动机和背景）

**研究背景**：神经辐射场（NeRF）和3D高斯泼溅（3DGS）等技术已显著推动了三维重建和新视图合成（NVS）的发展。然而，**直接从点云生成高保真、视点一致的渲染图像，且无需针对每个场景进行昂贵的逐场景优化，仍然是一个核心挑战**。

**研究动机**：传统点云渲染（Point-based Rendering）虽然高效，但因点云的离散稀疏特性，常出现孔洞、锯齿和表面不连续等伪影。引入图像修复扩散模型虽能提升质量，但标准图像扩散模型往往在多视角一致性上表现欠佳，且从纯噪声中重构图像效率较低。与此同时，现有神经点云渲染方法（如NPBG、RPBG）虽采用逐场景的每描述子优化，但难以跨场景泛化；NPBG++虽通过在线聚合增强了跨场景能力，但连续帧渲染仍会出现闪烁、伪影和不连续跳变等问题。

**核心问题**：能否在**不将点云转化为其他复杂中间表示**（如3D CNNs或3D Gaussians）的前提下，**坚持以点作为唯一渲染基元**，通过扩散模型赋予其一致性的修复能力，从而实现高效、高质量且跨场景泛化的点云渲染？

**整体含义**：本文提出 **DiffPBR**（Diffusion-based Point-Based Rendering），一种基于空间感知残差扩散的点云渲染框架，旨在直接从多样化点云输入合成连贯、逼真的渲染图像。


## 2. 论文提出的方法论

### 2.1 核心思想

DiffPBR的核心思想是：**扩散模型在受到“显式受场景几何和可见性约束的视点投影噪声”引导时，能够自然地保证跨相机运动的几何一致性**。框架坚持**以点作为唯一的渲染基元**，不将其转化为其他中间表示。

### 2.2 关键技术一：自适应 CoNo-Splatting

DiffPBR首先引入了一种可微分的点云光栅化策略——**自适应 CoNo-Splatting**（Adaptive CoNo-Splatting），用于将3D点快速、忠实地投影到图像平面上。

具体而言，每个点携带其颜色 \(\mathbf{c}_i\) 和采样的噪声 \(\epsilon_i\)，以圆形覆盖（circular footprint）的形式被泼溅到图像平面上，生成目标视图 \(v\) 下的渲染RGB图像 \(I_c^v\) 和噪声图 \(I_e^v\)：

\[
I_c^v, I_e^v = \mathrm{CNSplat}(\mathcal{P}_{in} \mid \mathbf{K}^v, \mathbf{M}^v)
\]

其中 \(\mathbf{K}^v\) 和 \(\mathbf{M}^v\) 分别为相机内参和外参矩阵。前向泼溅遵循通用的点云光栅化公式：

\[
F(p) = \frac{\sum_{i=1}^{n}\kappa\left((p - \pi(\mathbf{K}^v,\mathbf{M}^v,\mathbf{x}_i)) / s_i\right) v(z_i) \mathbf{f}_i}{\sum_{j=1}^{n}\kappa\left((p - \pi(\mathbf{K}^v,\mathbf{M}^v,\mathbf{x}_j)) / s_j\right) v(z_j) + \delta}
\]

其中 \(p\) 为特征平面上的像素位置，\(\pi(\cdot)\) 为标准针孔投影映射，\(\kappa(\cdot)\) 为可微分的泼溅核，\(v(\cdot)\) 为可微分的可见性加权函数。该策略能够**根据点云密度动态调整点的缩放尺度**，保证渲染初始图像具有更好的几何完整性，同时优化显存占用。

### 2.3 关键技术二：空间感知残差扩散（Spatial-aware Residual Diffusion）

DiffPBR在神经重渲染管线中**融入了残差学习**，主要包含两个核心设计：

- **残差扩散范式**：模型**专注于学习渲染结果与真实图像之间的残差**，而非从零开始生成完整图像。这极大地加快了收敛速度，并显著增强了跨场景的泛化能力。

- **空间一致的“结构化噪声”**：摒弃了传统扩散模型中独立的同分布高斯噪声，转而使用**在3D空间中预先初始化并随点云投影的空间感知噪声图（Spatial-aware Noise Maps）**。这确保了扩散模型在不同视角下接收到一致的几何引导，从而提升了渲染视频的稳定性。

### 2.4 模型变体

论文提出了两种变体：
- **DiffPBR-Q**（多步变体）：采用残差扩散管线，优先保证重建 fidelity。
- **DiffPBR-E**（单步变体）：一步生成配方，优先保证推理效率。


## 3. 实验设计

### 3.1 使用的数据集 / 场景

论文在以下基准数据集上进行了实验：
- **ScanNet**：室内场景数据集
- **DTU**：物体级多视图数据集
- **THuman2.0**：人体点云数据集

### 3.2 Benchmark 与对比方法

论文与多种基线方法进行了对比，涵盖传统方法和基于学习的方法：
- **传统点云渲染方法**（如z-buffer光栅化）
- **神经点云渲染方法**：NPBG、RPBG、NPBG++
- **引入其他3D表示的方法**：NPCR（使用3D CNNs）、PFGS（使用3D Gaussians）

### 3.3 评估指标

主要采用**PSNR（峰值信噪比）** 作为渲染图像质量的定量评估指标。


## 4. 资源与算力

论文明确报告了训练和推理的算力开销：

| 指标 | 基线方法 | DiffPBR |
|------|---------|---------|
| **训练GPU时长** | 41小时 | **8小时**（减少约80%） |
| **渲染速度** | 3.6 FPS | **10 FPS**（单步变体，提升约2.8倍） |

**但论文未明确说明**所使用的具体GPU型号、数量和硬件配置。从ICLR 2026论文的常见实验配置推断，可能使用了如NVIDIA V100或A100等常见科研GPU，但原文中未提供此细节。


## 5. 实验数量与充分性

### 5.1 实验数量

根据论文摘要和可获取信息，实验覆盖了以下维度：

1. **多数据集验证**：在ScanNet、DTU、THuman2.0三个不同类别的基准数据集上进行评估。
2. **多基线对比**：与NPBG、RPBG、NPBG++、NPCR、PFGS等多种方法对比。
3. **质量与效率权衡对比**：在渲染质量和渲染速度（FPS）之间进行定量比较。
4. **多模型变体对比**：DiffPBR-Q（多步）与DiffPBR-E（单步）的对比。
5. **定性比较**：论文展示了渲染质量的定性可视化对比。

### 5.2 充分性与客观性分析

- **积极方面**：实验覆盖了室内场景、物体、人体等多种点云数据类型，场景多样性较好；与多种代表性基线方法进行了对比，包括传统方法、神经方法和引入其他3D表示的方法；同时评估了质量和效率两个维度，较为全面。
- **潜在局限**：由于无法获取论文全文，消融实验（Ablation Study）的具体设计——如CoNo-Splatting和残差扩散各自贡献的定量分析——在摘要层面未能体现。此外，跨场景泛化能力的测试规模和泛化边界的分析细节也尚不明确。


## 6. 论文的主要结论与发现

1. **扩散模型可有效替代逐场景优化**：DiffPBR证明了通过巧妙结合3D几何先验与2D扩散修复能力，**无需昂贵的逐场景优化**，也能实现视点一致的高质量点云渲染。

2. **显著的性能提升**：
   - 渲染图像质量（PSNR）相比SOTA基线提升 **3~5 dB**
   - 训练GPU时间从41小时降至 **8小时**
   - 单步变体渲染速度从3.6 FPS提升至 **10 FPS**

3. **残差扩散的有效性**：残差训练不仅显著提升了采样速度，还保证了准确性。两个DiffPBR变体都比PFGS收敛更快、渲染质量更高。


## 7. 优点（方法或实验设计上的亮点）

1. **坚持点云作为唯一渲染基元**：DiffPBR不将点云转化为3D CNNs或3D Gaussians等中间表示，而是**坚持以点作为唯一渲染基元**，通过扩散模型赋予其一致性的修复能力，保持了表示的简洁性和通用性。

2. **创新的空间感知残差扩散范式**：首次将残差扩散应用于点云渲染。通过残差学习加速收敛和提升泛化能力，通过3D空间一致的结构化噪声确保多视角几何一致性。

3. **自适应CoNo-Splatting**：能根据点云密度动态调整点的缩放尺度，保证渲染初始图像具有更好的几何完整性，同时优化显存占用。

4. **显著的计算效率提升**：训练时间减少约80%，推理速度提升约2.8倍，使高质量点云渲染从离线走向实时应用成为可能。

5. **跨场景泛化能力**：通过残差扩散和结构化噪声设计，模型具备较强的跨场景泛化能力，无需针对每个新场景重新训练。


## 8. 不足与局限

1. **受限于输入点云的初始几何精度**：框架的渲染性能**仍一定程度受限于输入点云的初始几何精度**。这意味着当输入点云本身质量较差（如稀疏、噪声大、几何不完整）时，渲染质量可能受到显著影响。

2. **大规模场景与高分辨率图像的显存效率**：在处理**超大规模场景或渲染大尺寸图像**时，模型架构的显存效率仍有优化空间。

3. **硬件配置信息缺失**：论文未明确说明实验所使用的具体GPU型号和数量，不利于不同硬件条件下的可复现性评估。

4. **应用场景边界未充分讨论**：虽然论文展示了在室内场景、物体和人体上的效果，但对于**极端稀疏点云、动态场景、室外大场景**等更具挑战性的输入类型的表现，尚缺乏充分讨论。

5. **实时/移动端部署的可行性**：尽管单步变体已提升至10 FPS，但要推动高保真点云渲染在**移动端与实时交互领域的广泛应用**，仍需进一步优化。

---

（完）
