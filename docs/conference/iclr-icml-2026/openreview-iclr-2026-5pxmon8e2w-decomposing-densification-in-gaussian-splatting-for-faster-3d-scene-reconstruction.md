---
title: Decomposing Densification in Gaussian Splatting for Faster 3D Scene Reconstruction
title_zh: 分解高斯泼溅稠密化以加速3D场景重建
authors: "Binxiao Huang, Zhengwu Liu, Ngai Wong"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=5PXMoN8e2W"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 分解稠密化加速3D高斯泼溅场景重建
tldr: 针对3D高斯泼溅训练收敛慢、稠密化效率低的问题，本文系统分析了分裂与克隆操作的不同作用，并提出全局到局部的稠密化策略，以更高效地分配高斯基元，在保持细节的同时加速重建过程。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS训练中稠密化低效导致收敛缓慢。
method: 分析分裂与克隆操作，提出全局到局部稠密化策略。
result: 显著提升训练速度和场景覆盖精度。
conclusion: 区分稠密化操作可实现更高效的3DGS重建。
---

## Abstract
3D Gaussian Splatting (GS) has emerged as a powerful representation for high-quality scene reconstruction, offering compelling rendering quality. However, the training process of GS often suffers from slow convergence due to inefficient densification and suboptimal spatial distribution of Gaussian primitives. In this work, we present a comprehensive analysis of the split and clone operations during the densification phase, revealing their distinct roles in balancing detail preservation and computational efficiency. Building upon this analysis, we propose a global-to-local densification strategy, which facilitates more efficient growth of Gaussians across the scene space, promoting both global coverage and local refinement. To cooperate with the proposed densification strategy and promote sufficient diffusion of Gaussian primitives in space, we introduce an energy-guided coarse-to-fine multi-resolution training framework, which gradually increases resolution based on energy density in 2D images. Additionally, we dynamically prune unnecessary Gaussian primitives to speed up the training. Extensive experiments on MipNeRF-360, Deep Blending, and Tanks & Temples datasets demonstrate that our approach significantly accelerates training—achieving over 2x speedup with fewer Gaussian primitives and superior reconstruction performance.

---

## 论文详细总结（自动生成）

# 论文详细总结：Decomposing Densification in Gaussian Splatting for Faster 3D Scene Reconstruction

## 1. 论文的核心问题与整体含义（研究动机和背景）

- **研究背景**：3D Gaussian Splatting（3DGS）作为一种新兴的3D场景重建表示方法，通过各向异性高斯基元实现了高质量的渲染效果和实时渲染速度。然而，与NeRF等隐式神经场相比，3DGS的训练过程仍然需要数十分钟才能完成一个场景的重建。
- **核心问题**：3DGS的训练收敛缓慢，主要归因于两个方面的瓶颈：（1）稠密化（densification）过程效率低下；（2）高斯基元的空间分布不够优化。
- **研究含义**：本文旨在系统性地分析稠密化阶段中分裂（split）与克隆（clone）两种操作的实际作用，并据此设计更高效的稠密化策略，以加速3D场景重建过程，使其更适用于资源受限设备或实时重建等实际应用场景。

## 2. 论文提出的方法论

### 2.1 核心思想

- **关键发现**：论文首次揭示了分裂操作主要负责高斯基元的**全局扩散**（global spread），而克隆操作主要负责**局部细节精炼**（local refinement）。
- **量化证据**：实验表明，分裂主导的高斯基元平均位移距离约为克隆主导基元的**20倍**，证明空间扩展主要由分裂操作驱动；同时，约**80%** 的新增基元来源于克隆操作而非分裂。
- **问题诊断**：早期稠密化阶段中克隆操作的大量使用导致了高斯基元的过度聚类（cluster phenomenon），大量冗余基元聚集但对重建保真度的贡献有限，造成计算冗余。

### 2.2 关键技术：全局到局部稠密化策略（Global-to-Local Densification）

- **两阶段框架**：
  1. **全局扩散阶段**：仅使用分裂操作，实现快速有效的空间分布，以最小的高斯基元数量覆盖场景，避免局部细节上的冗余计算；
  2. **局部精炼阶段**：同时使用分裂和克隆操作，在已有良好空间分布的基础上，利用克隆操作高效精炼局部细节。
- 该策略无需手动定义两个阶段之间的边界，由后续的多分辨率调度器自动控制。

### 2.3 能量引导的粗到细多分辨率训练框架

- **核心机制**：在全局扩散阶段使用降采样图像进行训练，以促进高斯基元的高效空间扩散；达到充分场景覆盖后，切换到全分辨率监督进行局部精炼。
- **能量分析**：通过二维傅里叶变换计算图像的能量谱，定义多分辨率下的能量密度 $\mathcal{E}_r = \|\mathcal{E}(\mathbf{I}_r)\|_1 \cdot r^2$。
- **分辨率调度**：根据各分辨率下的能量占比动态分配训练迭代次数：$\mathbf{T}_r = \text{Round}((\mathcal{E}_r / \mathcal{E}_1) \cdot \mathbf{T}_{\text{densify}})$。
- **目的**：避免全分辨率监督导致的过早局部过拟合和梯度抵消问题，同时消除手动定义阶段边界的需要。

### 2.4 自适应不透明度剪枝

- **问题**：3DGS使用固定的小阈值（0.01）进行不透明度剪枝，对于剔除视觉贡献极小的冗余基元效果不佳。
- **方法**：引入自适应不透明度阈值，通过对所有高斯基元的不透明度值排序，取第 $p$ 分位数作为阈值，并设置上限 $\tau_u$ 进行双重约束：
  - $\tau_k = \boldsymbol{\alpha}_{\text{sorted}}[k], \quad k = \lfloor N \cdot p \rfloor$
  - $\tau = \min(\tau_k, \tau_u)$
- **效果**：有效剔除冗余基元，同时保留结构上重要的基元。

## 3. 实验设计

### 3.1 数据集

- 论文在三个真实世界数据集上进行了实验：
  - **MipNeRF-360**：包含9个场景（5个室外 + 4个室内）
  - **Deep Blending**
  - **Tanks & Temples**

### 3.2 评估指标与Benchmark

- **评估指标**：
  - PSNR（峰值信噪比）
  - SSIM（结构相似性指标）
  - LPIPS（学习感知图像块相似度）
  - 高斯基元数量（$N_{GS}$）
  - 平均训练时间（分钟）
- **对比方法**：
  - 3DGS（基线）
  - 3DGS-accel（Taming 3DGS的高效反向传播版本）
  - Mini-splatting
  - EDC
  - DashGaussian

## 4. 资源与算力

- **GPU型号**：NVIDIA GeForce RTX 3090
- **CPU型号**：AMD EPYC 7413 24-Core处理器
- **训练迭代**：所有场景统一训练30K次迭代
- **说明**：论文明确报告了硬件配置以确保公平对比，但未单独报告各方法的精确GPU训练时长（仅报告了以分钟为单位的平均训练时间，如3DGS在MipNeRF-360上为25.01分钟，本文方法为5.33分钟）。

## 5. 实验数量与充分性

- **实验规模**：在三个数据集的多个场景上进行了全面实验。
- **对比充分性**：与5种主流方法（3DGS、3DGS-accel、Mini-splatting、EDC、DashGaussian）进行了对比，覆盖了原始3DGS及其多种加速变体。
- **公平性考量**：
  - 所有方法均在同一GPU（RTX 3090）上运行；
  - Mini-splatting基于3DGS，EDC和DashGaussian基于3DGS-accel，论文明确说明了各方法的基础框架；
  - 对于Mini-splatting的扩展版本MSv2（采用18K次迭代），论文也进行了公平对比实验。
- **总体评价**：实验设计较为全面和客观，涵盖了多个数据集、多种对比方法和一致的硬件环境，但**消融实验**的细节在可获取的文本中未充分展开。

## 6. 论文的主要结论与发现

- **核心发现**：分裂操作主导全局空间扩散，克隆操作主导局部细节精炼——这是3DGS稠密化过程中首次被系统揭示的区分。
- **方法有效性**：提出的全局到局部稠密化策略配合能量引导的多分辨率训练，实现了**超过2倍**的训练加速，同时使用**减少40%** 的高斯基元。
- **质量保持**：在加速和精简的同时，重建质量不降反升——SSIM平均提升0.004，PSNR平均提升0.31 dB。
- **SOTA对比**：在与现有最优方法的对比中，本文方法实现了**最快的收敛速度**，同时保持了具有竞争力的渲染质量。

## 7. 优点

- **洞察创新**：首次系统性地分解并量化了分裂与克隆操作在3DGS稠密化中的不同角色，为后续研究提供了重要的理论洞察。
- **策略巧妙**：全局到局部两阶段稠密化策略直接针对问题根源（早期克隆导致的冗余聚类），而非简单地进行工程优化。
- **自动化调度**：能量引导的多分辨率框架无需手动定义阶段边界，具有较好的通用性和自适应能力。
- **综合加速**：从稠密化策略、多分辨率训练和自适应剪枝三个维度协同优化，实现了显著的训练加速。
- **实验扎实**：在三个标准数据集上与多种SOTA方法进行了公平对比，硬件环境一致，结果可信。

## 8. 不足与局限

- **消融实验细节缺失**：在可获取的论文文本中，各组件（全局到局部策略、能量引导多分辨率、自适应剪枝）的独立贡献分析未能充分呈现。
- **泛化性验证有限**：实验仅限于MipNeRF-360、Deep Blending和Tanks & Temples三个数据集，未涉及动态场景、大尺度场景或极端稀疏视角等更具挑战性的设定。
- **LPIPS指标略有牺牲**：相比3DGS-accel，本文方法的LPIPS指标有0.0049的轻微增加，表明在感知质量方面存在微小折衷。
- **硬件依赖**：实验仅在RTX 3090上验证，未讨论在更低端或更高端GPU上的表现差异。
- **理论分析深度**：虽然通过实验量化了分裂与克隆的位移差异，但对两者在优化动力学层面的理论解释尚可进一步深化。

（完）
