---
title: "DiffPBR: Point-Based Rendering via Spatial-Aware Residual Diffusion"
title_zh: DiffPBR：基于空间感知残差扩散的点云渲染
authors: "Yiping Xie, Yuchi Huo, Yunlong Ran, Zijian Huang, Lincheng Li, Yingfeng Chen, Jiming Chen, Qi Ye"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=tqOBZbW6j8"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 基于扩散的点云渲染与高斯泼溅用于新视图合成
tldr: 针对从点云直接合成高保真、视角一致新视图需逐场景优化的问题，本文提出DiffPBR，利用扩散模型结合视点投影噪声约束和自适应CoNo-Splatting快速光栅化，在无需优化的情况下生成逼真且几何一致的新视图。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 点云直接渲染新视图需昂贵优化，缺乏一致性。
method: 扩散模型引导视点投影噪声，结合自适应光栅化。
result: 实现高效、几何一致的高保真渲染。
conclusion: 扩散模型可有效支持点云的实时新视图合成。
---

## Abstract
Neural radiance fields and 3D Gaussian splatting (3DGS) have significantly advanced 3D reconstruction and novel view synthesis (NVS). Yet, achieving high-fidelity and view-consistent renderings directly from point clouds---without costly per-scene optimization---remains a core challenge. In this work, we present DiffPBR, a diffusion-based framework that synthesizes coherent, photorealistic renderings from diverse point cloud inputs. We demonstrate that diffusion models, when guided by viewpoint-projected noise explicitly constrained by scene geometry and visibility, naturally enforce geometric consistency across camera motion. To achieve this, we first introduce adaptive CoNo-Splatting, a technique for fast and faithful rasterization that ensures efficient and effective handling of point clouds. Secondly, we integrate residual learning into the neural re-rendering pipeline, which improves convergence, generalization, and visual quality across diverse rendering tasks. Extensive experiments show that our method outperforms existing baselines with an improvement of **3~5dB** in rendered image quality, a reduction from **41 to 8** in GPU hours for training, and an increase from **3.6fps to 10fps** (our one-step variant) in rendering speed frequency.

---

## 论文详细总结（自动生成）

# DiffPBR：基于空间感知残差扩散的点云渲染——论文深度解析


## 一、核心问题与研究动机

**研究背景**：神经辐射场（NeRF）和3D高斯泼溅（3DGS）显著推动了三维重建和新视图合成（NVS）领域的发展。然而，直接从点云合成高保真、视角一致的渲染图像，而不进行昂贵的逐场景优化，仍然是一个核心挑战。

**核心困境**：传统点云渲染虽高效，但因点云离散特性常出现孔洞、锯齿和表面不连续等伪影。神经点云图形方法虽引入学习组件提升视觉质量，但面临两大问题：一是需要逐场景的描述子优化，难以跨场景泛化；二是渲染连续帧时容易出现闪烁、伪影和不连续跳变。现有方法常引入替代性3D表示（如3D CNN或3D高斯）来缓解误差，但这引出了一个根本性问题：**点云本身是否天生就是不适合渲染的图元？**

**本文立场**：DiffPBR坚持以点云作为唯一渲染基元，通过扩散模型赋予其一致性修复能力，在无需逐场景优化的条件下实现高质量、视角一致的渲染。


## 二、方法论

### 2.1 整体思路

DiffPBR是一个基于扩散的框架，其核心洞察是：当扩散模型受到**显式受场景几何与可见性约束的视点投影噪声**引导时，能够自然地强制实现跨相机运动的几何一致性。

### 2.2 关键技术一：自适应CoNo-Splatting

DiffPBR首先提出了一种可微分点云光栅化策略——**CoNo-Splatting**，用于将3D点云快速、忠实地投影到图像平面。其核心公式如下：

给定相机内参矩阵$\mathbf{K}^v$和外参矩阵$\mathbf{M}^v$，前向溅射过程遵循通用点云光栅化公式：

$$F(p) = \frac{\sum_{i=1}^{n}\kappa\left((p - \pi(\mathbf{K}^v,\mathbf{M}^v,\mathbf{x}_i)) / s_i\right)v(z_i)\mathbf{f}_i}{\sum_{j=1}^{n}\kappa\left((p - \pi(\mathbf{K}^v,\mathbf{M}^v,\mathbf{x}_j)) / s_j\right)v(z_j) + \delta}$$

其中每个点携带**颜色**$\mathbf{c}_i$和**采样的噪声**$\epsilon_i$，被溅射到图像平面上形成圆形足迹，渲染出RGB图像$I_c^v$和噪声图$I_e^v$：

$$I_c^v, I_e^v = \text{CNSplat}(\mathcal{P}_{in} | \mathbf{K}^v, \mathbf{M}^v)$$

该方法能**根据点云密度动态调整点的缩放尺度**，保证渲染初始图像具有更好的几何完整性，同时优化显存占用。

### 2.3 关键技术二：空间感知残差扩散

DiffPBR采用**残差扩散范式**，模型不学习从纯噪声生成完整图像，而是专注于学习渲染结果与真实图像之间的**残差**，极大加快了收敛速度并增强了跨场景泛化能力。

**截断扩散步数**：定义截断时间步$T'$为：

$$T' = \arg \min_{i=1}^{T}\left|\sqrt{\alpha_i} - \frac{1}{2}\right|$$

逆向过程**不从纯高斯噪声开始**（第$T$步），而是从一个保留了原始图像部分结构和语义的半信息状态开始（第$T'$步）。重新定义的扩散前向过程为：

$$I_t^v = \sqrt{\alpha_t}\cdot I_0^v + (1 - \sqrt{\alpha_t})\cdot I_r^v + \sqrt{1 - \alpha_t}\cdot I_e^v$$

其中$I_r^v = I_c^v - I_0^v$为残差项。

**3D一致噪声**：DiffPBR摒弃了传统独立同分布高斯噪声，转而使用在3D空间中预初始化并随点云投影的**空间一致噪声图**，确保扩散模型在不同视角下接收到一致的几何引导。

### 2.4 算法流程

DiffPBR提供两个变体：
- **DiffPBR-Q（多步变体）** ：采用残差扩散流程，优先保障重建保真度；
- **DiffPBR-E（单步变体）** ：进一步提升推理效率。


## 三、实验设计

### 3.1 数据集与场景

DiffPBR在多个基准数据集上进行了评估：
- **ScanNet**：室内场景数据集
- **DTU**：多视角三维重建数据集
- **THuman2.0**：人体三维数据集

### 3.2 对比方法

论文对比了现有基线方法，包括神经点云图形方法（如NPBG、NPBG++、RPBG）以及引入替代性3D表示的方法（如PFGS等）。

### 3.3 评估指标

主要采用**PSNR（峰值信噪比）** 作为渲染图像质量的核心定量指标。


## 四、资源与算力

论文明确报告了训练资源的对比数据：

| 指标 | 基线方法 | DiffPBR |
|------|----------|---------|
| 训练GPU时间 | 41小时 | **8小时** |
| 渲染速度 | 3.6 FPS | **10 FPS**（单步变体） |

**注意**：论文未明确说明所使用的具体GPU型号和数量，仅报告了GPU小时的相对对比。

此外，论文提到自适应CoNo-Splatting相比基线方法在**显存占用**上得到了明显优化，但未给出具体数值。


## 五、实验数量与充分性

论文声称进行了 **“广泛的实验”** （Extensive experiments），覆盖了多个基准数据集。从现有资料推断，实验设计至少包括：

1. **跨数据集验证**：在ScanNet、DTU、THuman2.0三个不同性质的基准上评估泛化能力；
2. **定量对比**：PSNR指标的数值对比；
3. **效率对比**：训练时间和推理速度的量化对比；
4. **多变体对比**：DiffPBR-Q（多步）与DiffPBR-E（单步）的性能权衡。

**评估**：实验设计整体较为客观，使用了业界公认的基准数据集和评估指标（PSNR），并与多个基线方法进行了对比。但受限于公开信息，无法确认是否包含充分的**消融实验**（如移除残差学习或3D一致噪声后的性能变化），这一点在论文完整版中应有更详细的呈现。


## 六、主要结论与发现

1. **画质提升显著**：DiffPBR在渲染图像质量（PSNR）上相比SOTA基线方法提升了约**3~5 dB**。

2. **训练效率大幅优化**：训练GPU时间从41小时缩减至**8小时**，降幅约80%。

3. **推理速度提升**：单步变体的渲染速度从3.6 FPS提升至**10 FPS**，约为基线速度的3倍。

4. **核心主张验证**：实验证明，扩散模型在3D几何先验的引导下，无需昂贵的逐场景优化即可实现视点一致的逼真渲染。


## 七、方法亮点

1. **首创性**：DiffPBR是**首个将残差扩散应用于点云渲染**的工作。它不将点云转化为其他中间表示（如3D CNN或3D高斯），而是坚持以点云为唯一渲染基元。

2. **“补差”而非“生成”** ：残差扩散范式使模型专注于学习渲染残差而非从零生成图像，大幅提升收敛速度和泛化能力。

3. **3D空间感知的结构化噪声**：摒弃传统独立同分布噪声，改用空间一致噪声图，从根本上保障了多视角几何一致性。

4. **动态自适应光栅化**：自适应CoNo-Splatting根据点云密度动态调整溅射尺度，兼顾几何完整性和显存效率。

5. **训练-推理效率双优**：在画质提升的同时实现了训练时间减少80%、推理速度提升约3倍。


## 八、不足与局限

1. **受限于输入点云精度**：框架性能仍一定程度受限于**输入点云的初始几何精度**。当输入点云质量较差时，渲染质量可能受到影响。

2. **大规模场景与高分辨率图像的挑战**：在处理**超大规模场景**或渲染**大尺寸图像**时，模型架构的显存效率仍有优化空间。

3. **GPU型号未明确**：论文未明确说明训练和推理所使用的具体GPU型号，使得算力对比的可复现性打了一定折扣。

4. **消融实验细节未知**：从公开摘要和简介中无法确认是否对各个创新组件（如残差学习、3D一致噪声、截断扩散步数等）进行了充分的消融分析。

5. **应用场景覆盖**：目前验证主要集中在室内场景（ScanNet、DTU）和人体（THuman2.0），对于**室外大场景、动态场景或自动驾驶场景**的适用性尚未充分验证。


（完）
