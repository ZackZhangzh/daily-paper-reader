---
title: "HRGS: Hierarchical Gaussian Splatting for Memory-Efficient High-Resolution 3D Reconstruction"
title_zh: HRGS：分层高斯泼溅用于内存高效的高分辨率3D重建
authors: "Changbai Li, Haodong Zhu, Tongfei Chen, Shuo Yang, Shuwei Shao, Wenhao Dong, Hanlin Chen, Juan Zhang, Baochang Zhang"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=oVJ0wiKOJ0"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 内存高效的高分辨率3D重建使用3DGS
tldr: 针对3DGS在高分辨率场景重建中的内存可扩展性瓶颈，本文提出分层高斯泼溅框架，通过从低分辨率数据获取全局粗略表示，再将场景分块使用高分辨率数据精细优化，采用高斯划分和训练数据划分两步策略。该方法在保持实时渲染速度的同时，显著降低了内存占用，使得高分辨率大场景重建成为可能。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 高分辨率重建面临严重内存可扩展性瓶颈。
method: 分层块级优化，从粗到细的块划分策略。
result: 显著降低内存占用，支持高分辨率重建。
conclusion: 分层优化有效缓解3DGS内存瓶颈。
---

## Abstract
3D Gaussian Splatting (3DGS) has achieved significant progress in real-time 3D scene reconstruction. However, its application in high-resolution reconstruction scenarios faces severe memory scalability bottlenecks. To address this issue, we propose Hierarchical  Gaussian Splatting (HRGS), a memory-efficient framework with hierarchical block-level optimization from coarse to fine. Specifically, we first derive a global, coarse Gaussian representation from low-resolution data; we then partition the scene into multiple blocks and refine each block using high-resolution data. Scene partitioning comprises two steps: Gaussian partitioning and training data partitioning. In Gaussian partitioning, we contract irregular scenes into a normalized, bounded cubic space and employ a uniform grid to evenly distribute computational tasks among blocks; in training data partitioning, we retain only those observations that lie within their corresponding blocks or make significant contributions to the rendering results. By guiding each block’s refinement with the global coarse Gaussian prior, we ensure alignment and seamless fusion of Gaussians across adjacent blocks. To reduce computational resource demands, we introduce an Importance-Driven Gaussian Pruning (IDGP) strategy: during each block’s refinement, we compute an importance score for every Gaussian primitive and remove those with minimal rendering contribution, thereby accelerating convergence and reducing redundant computation and memory overhead. To further enhance surface reconstruction quality, we also incorporate normal priors from a pretrained model. Finally, even under memory-constrained conditions, our method enables high-quality, high-resolution 3D scene reconstruction. Extensive experiments on three public benchmarks demonstrate that our approach achieves state-of-the-art performance in high-resolution novel view synthesis (NVS) and surface reconstruction tasks.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

- **背景**：3D Gaussian Splatting（3DGS）在实时3D场景重建方面取得了显著进展，但其在高分辨率重建场景中面临严重的内存可扩展性瓶颈。
- **核心问题**：随着图像分辨率的提升，3DGS需要存储和处理的海量高斯元数量急剧增长，导致显存溢出（OOM）问题，限制了其在高分辨率大场景重建中的应用。
- **研究目标**：提出一种内存高效的框架，使3DGS能够在有限显存条件下实现高质量的高分辨率3D重建。

## 2. 方法论

### 核心思想：从粗到细的分层块级优化

HRGS采用“先全局粗略、后分块精细”的两阶段策略：

1. **粗阶段**：从低分辨率数据（0.3K）出发，训练30,000次迭代，获得全局粗略的高斯表示。
2. **精阶段**：将场景划分为多个块，每个块使用高分辨率数据独立精细优化。

### 关键技术细节

**（1）场景划分（Scene Partitioning）——两步策略**

- **高斯划分（Gaussian Partitioning）** ：将不规则场景通过空间收缩（contraction）映射到归一化的有界立方体空间，再使用均匀网格将计算任务均匀分配到各个块中。
- **训练数据划分（Training Data Partitioning）** ：仅为每个块保留位于该块内或对渲染结果有显著贡献的观测数据。具体地，利用SSIM损失判断哪些相机位姿对某块的渲染贡献较大，并结合空间位置约束进行数据分配。

**（2）重要性驱动高斯剪枝（IDGP）**

在每块的精细优化过程中，为每个高斯元计算重要性分数 \( S_i = \alpha_i \cdot \tilde{v}_i \cdot H_i \)，其中：
- \(\alpha_i\) 为不透明度
- \(\tilde{v}_i = \ln(1 + v_i)\) 为对数压缩后的体积
- \(H_i\) 为加权命中次数（考虑光线透射率累积）

按重要性分数降序排序后，移除最低的20%。IDGP在精细训练的第10,000、15,000和25,000次迭代时动态执行。

**（3）跨块对齐与融合**

利用全局粗略高斯先验引导每个块的精细优化，确保相邻块之间高斯的对齐和无缝融合。

**（4）法向先验增强表面重建**

引入预训练模型的法向先验（室外用DSINE，室内用GeoWizard），通过法向损失 \(\mathcal{L}_n\) 和D-Normal正则化 \(\mathcal{L}_{dn}\) 提升表面重建质量。

**（5）总损失函数**

\[
\mathcal{L}_{total} = \mathcal{L}_{RGB} + \lambda_1\mathcal{L}_s + \lambda_2\mathcal{L}_n + \lambda_3\mathcal{L}_{dn}
\]

其中 \(\lambda_1=1\)，\(\lambda_2=0.01\)，\(\lambda_3=0.015\)。

## 3. 实验设计

### 数据集与Benchmark

- **新视角合成（NVS）任务**：Mip-NeRF360数据集
- **表面重建任务**：Tanks and Temples（TNT）数据集
- **额外验证**：Replica数据集

### 评估指标

- **NVS**：PSNR、SSIM、LPIPS
- **表面重建**：F1-score
- **渲染效率**：FPS（帧率）

### 对比方法

- **NVS对比**：Mip-NeRF、Instant-NGP、Zip-NeRF、3DGS、3DGS+EWA、Mip-Splatting
- **表面重建对比**：NeuS、MonoSDF、SuGaR、3DGS、2DGS、VCR-GauS

## 4. 资源与算力

论文**未明确说明**使用的GPU型号、数量或训练时长等具体算力信息。仅提及了训练迭代次数（粗阶段30,000次，每个子块30,000次）。关于显存占用的具体量化数据在提供的文本中也未出现。

## 5. 实验数量与充分性

- **实验覆盖**：在3个公开数据集（Mip-NeRF360、TNT、Replica）上开展实验，覆盖NVS和表面重建两个任务。
- **对比方法**：NVS任务对比了6种方法，表面重建任务对比了6种方法，对比对象涵盖基于NeRF的方法和基于高斯的方法，基线选择较为全面。
- **消融实验**：从方法设计来看，IDGP策略、法向先验、分块策略等均有独立的技术贡献，但提供的文本中**未明确列出消融实验的具体设置和结果**。
- **充分性判断**：实验设计整体较为规范，覆盖了主流数据集和强基线方法。但由于提供的文本不完整（表格被截断、消融实验细节缺失），难以对实验的全面性做最终判断。

## 6. 主要结论与发现

- HRGS在Mip-NeRF360的NVS任务中取得了PSNR 27.91、SSIM 0.863、LPIPS 0.342的SOTA性能，显著优于Mip-Splatting（PSNR 26.22）和原始3DGS（PSNR 19.59）。
- 在表面重建任务中，HRGS同样达到了SOTA性能。
- 分层块级优化有效缓解了3DGS在高分辨率场景中的内存瓶颈。
- IDGP策略能够加速收敛并减少冗余计算与内存开销。
- 结合法向先验显著提升了表面重建质量。
- 即使在显存受限条件下，HRGS仍能实现高质量的高分辨率3D场景重建。

## 7. 方法亮点

- **分层从粗到细框架**：创新性地将低分辨率全局表示与高分辨率分块精细优化相结合，在保持实时渲染速度的同时显著降低内存占用。
- **双维度划分策略**：同时划分高斯元和训练数据，确保每个块的计算和数据高度匹配，避免无效计算。
- **IDGP动态剪枝**：基于射线-高斯交互的重要性评分机制，在训练过程中动态移除低贡献高斯元，而非静态剪枝。
- **跨块无缝融合**：利用全局粗略先验引导各块优化，解决了分块方法常见的边界不一致问题。
- **法向先验增强**：针对室内外场景分别选用不同的预训练模型，提升了表面重建的几何精度。

## 8. 不足与局限

- **算力信息缺失**：未报告GPU型号、数量、训练时长和具体显存占用数据，不利于其他研究者进行公平的算力对比和复现。
- **消融实验未充分展示**：提供的文本中未明确列出IDGP、法向先验、分块数量等各组件的消融实验结果，难以量化各模块的独立贡献。
- **分块数量固定**：文中将场景固定划分为4个子块，对于不同规模和复杂度的场景，最优分块数量可能不同，但未讨论自适应分块策略。
- **依赖预训练模型**：法向先验依赖DSINE和GeoWizard等外部预训练模型，这些模型的预测精度可能影响HRGS的表面重建质量，且增加了额外的计算开销。
- **实验细节不完整**：论文表格被截断，部分定量结果和对比数据未能完整呈现。

（完）
