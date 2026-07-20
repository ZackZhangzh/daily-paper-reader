---
title: "D$^2$GS: Depth-and-Density Guided Gaussian Splatting for Stable and Accurate Sparse-View Reconstruction"
title_zh: "D^2GS: 深度与密度引导的高斯泼溅用于稳定准确的稀疏视图重建"
authors: "Meixi Song, Xin Lin, Dizhe Zhang, Haodong Li, Xiangtai Li, Bo Du, Lu Qi"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=7yvz93kBw9"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 深度与密度引导的稀疏视图3DGS重建
tldr: 本文针对稀疏视图下3DGS性能退化问题，提出D^2GS框架。识别出近相机区域过密和远距离区域覆盖不足两种失效模式，通过深度与密度引导的丢弃策略自适应屏蔽冗余高斯，并采用距离感知正则化，实现稳定准确的稀疏视图新视图合成。实验证明在稀疏输入下显著提升重建质量和稳定性。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS易出现过拟合和欠拟合，导致性能不稳定。
method: 深度与密度引导丢弃冗余高斯，结合距离感知正则化。
result: 在稀疏视图下实现稳定高精度新视图合成。
conclusion: 深度密度引导策略有效解决稀疏视图3DGS的不稳定性。
---

## Abstract
Recent advances in 3D Gaussian Splatting (3DGS) enable real-time, high-fidelity novel view synthesis (NVS) with explicit 3D representations. However, performance degradation and instability remain significant under sparse-view conditions. In this work, we identify two key failure modes under sparse-view conditions: overfitting in regions with excessive Gaussian density near the camera, and underfitting in distant areas with insufficient Gaussian coverage. To address these challenges, we propose a unified framework \modelname{}, comprising two key components: a Depth-and-Density Guided Dropout strategy that suppresses overfitting by adaptively masking redundant Gaussians based on density and depth, and a Distance-Aware Fidelity Enhancement module that improves reconstruction quality in under-fitted far-field areas through targeted supervision. Moreover, we introduce a new evaluation metric to quantify the stability of learned Gaussian distributions, providing insights into the robustness of the sparse-view 3DGS. Extensive experiments on multiple datasets demonstrate that our method significantly improves both visual quality and robustness under sparse view conditions. The source code and trained models will be made publicly available.

---

## 论文详细总结（自动生成）

# D²GS：深度与密度引导的高斯泼溅——论文详细总结


## 一、核心问题与整体含义（研究动机与背景）

3D Gaussian Splatting（3DGS）作为一种新兴的显式3D表示方法，能够实现实时、高保真的新视图合成（Novel View Synthesis, NVS）。然而，在稀疏视图输入条件下，3DGS面临显著的**性能退化与不稳定性**问题。

本文作者识别出稀疏视图下3DGS的**两种关键失效模式**：

- **过拟合（Overfitting）** ：相机附近区域高斯密度过高，导致模型过度适应稀疏视图而丧失泛化能力；
- **欠拟合（Underfitting）** ：远距离区域高斯覆盖不足，导致重建质量低下。

针对上述问题，本文提出 **D²GS（Depth-and-Density Guided Gaussian Splatting）** 统一框架，通过深度与密度引导的策略，实现稀疏视图下稳定且准确的3D重建。该论文已被**ICLR 2026**接收。


## 二、方法论：核心思想与关键技术

### 2.1 核心思想

D²GS的核心思路是：**动态地根据深度和密度信息调整重建程度**，在过密区域抑制冗余高斯，在欠拟合区域增强监督信号。

### 2.2 两大核心模块

D²GS主要由两个关键组件构成：

**（1）深度与密度引导的丢弃机制（Depth-and-Density guided Dropout，DD-Drop）**

- 为每个高斯点分配一个**丢弃分数（dropout score）** ，该分数基于**局部密度**和**相机距离**计算得出；
- 高分数的高斯点（即过密区域或近相机区域的高斯）以更高概率被丢弃，从而**抑制混叠（aliasing）并提升渲染保真度**；
- 通过自适应掩蔽冗余高斯，有效缓解稀疏视图下的过拟合问题。

**（2）距离感知的保真度增强模块（Distance-Aware Fidelity Enhancement，DAFE）**

- 利用**深度先验**增强远距离区域的监督信号；
- 针对欠拟合的远场区域进行**定向监督（targeted supervision）** ，提升重建质量；
- 有效避免远距离区域的欠拟合问题。

### 2.3 关键技术细节

根据GitHub仓库提供的训练命令，可以推断出关键超参数设置：

| 参数 | LLFF（3视图） | MipNeRF-360（12视图） |
|------|--------------|---------------------|
| `--depth_weight` | 0.15 | 0.1 |
| `--density_weight` | 0.85 | 0.9 |
| `--drop_min` | 0.05 | 0.05 |
| `--drop_max` | 0.5 | 0.5 |
| `--mask_param` | 5 | 10 |
| `--lambda_far` | 0.5 | 0.5 |

训练流程上，首先使用**Structure-from-Motion（SfM）** 从稀疏视图中重建相机姿态，随后利用COLMAP的`patch_match_stereo`和`stereo_fusion`生成密集立体点云。


## 三、实验设计：数据集、基准与方法对比

### 3.1 使用的数据集

D²GS在以下数据集上进行了实验验证：

- **LLFF数据集**：使用**3个稀疏视图**（`--n_views 3`）进行训练与评估；
- **MipNeRF-360数据集**：使用**12个稀疏视图**（`--n_views 12`）进行训练与评估。

### 3.2 评估指标

本文除了使用传统的图像质量评估指标（**PSNR、SSIM、LPIPS**）外，还**引入了一个新的评估指标**用于量化学习到的高斯分布的稳定性，从而评估稀疏视图下3DGS模型的鲁棒性。

### 3.3 对比方法

论文对比了哪些具体方法在提供的文本中**未明确列出**，但根据论文定位（稀疏视图3DGS重建），可以推断对比方法应包括：标准3DGS基线以及其他稀疏视图重建方法。


## 四、资源与算力

提供的论文文本和GitHub页面中**未明确说明**训练所使用的GPU型号、数量及训练时长等算力信息。

不过，GitHub仓库的安装说明指出**CUDA 12.1**是运行环境的前提条件，并提供了完整的Conda环境配置文件。


## 五、实验数量与充分性

### 5.1 实验组数

从GitHub信息可以推断，实验至少包括：

- **两个数据集**（LLFF + MipNeRF-360）上的完整评估；
- **消融实验**：从基线出发，逐步添加密度分数（density score）、深度分数（depth score）和基于深度的分层策略（depth-based layering），每一步都稳定提升了PSNR、SSIM、LPIPS和IMR指标；
- **全场景批量实验**：提供了`train_llff.sh`和`train_mipnerf360.sh`脚本，表明在所有场景上进行了系统评估。

### 5.2 充分性与客观性评估

- **正面**：消融实验设计清晰，逐步验证了各模块的有效性；新提出的稳定性评估指标为稀疏视图3DGS提供了额外的量化维度。
- **局限**：由于无法获取完整论文，对比方法的全面性、统计显著性检验等信息无法确认。


## 六、主要结论与发现

1. **深度与密度引导的丢弃策略**能够有效抑制稀疏视图下近相机区域的过拟合问题，通过自适应掩蔽冗余高斯提升渲染保真度；
2. **距离感知的保真度增强模块**通过深度先验增强远距离监督，有效解决了远场区域的欠拟合问题；
3. 两个模块协同工作，**显著提升了稀疏视图下3DGS的重建视觉质量和鲁棒性**；
4. 新提出的稳定性评估指标为衡量稀疏视图3DGS模型的**鲁棒性提供了新的量化工具**。


## 七、方法亮点

1. **问题诊断精准**：首次系统识别并区分了稀疏视图3DGS的两种失效模式（过拟合与欠拟合），为后续改进提供了清晰的理论基础；
2. **双模块协同设计**：DD-Drop与DAFE分别针对两种失效模式，形成完整的解决方案；
3. **自适应机制**：丢弃策略基于密度和深度动态调整，而非固定阈值，具有更好的泛化能力；
4. **新增评估维度**：提出稳定性量化指标，填补了稀疏视图3DGS鲁棒性评估的空白；
5. **代码开源**：承诺公开源代码和训练模型，有利于领域内复现与后续研究。


## 八、不足与局限

1. **算力信息缺失**：未明确报告训练所需的GPU型号、数量及时间，不利于其他研究者评估复现成本；
2. **对比方法不明确**：提供的文本中未详细列出所有对比方法，难以全面评估实验的公平性与全面性；
3. **数据集范围有限**：仅使用了LLFF和MipNeRF-360两个数据集，未涉及更大规模的户外场景或动态场景；
4. **依赖COLMAP预处理**：需要先通过COLMAP进行SfM和密集立体匹配，增加了整体流程的复杂度；
5. **深度先验依赖**：DAFE模块依赖深度先验信息，在深度估计不准确的场景中可能影响性能；
6. **全文信息获取受限**：由于OpenReview页面需要验证，本文总结基于摘要、GitHub及第三方摘要信息，部分细节（如具体对比方法、完整公式推导等）未能完全覆盖。


（完）
