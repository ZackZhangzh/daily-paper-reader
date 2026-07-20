---
title: "SurfSplat: Conquering Feedforward 2D Gaussian Splatting with Surface Continuity Priors"
title_zh: SurfSplat：利用表面连续性先验攻克前馈2D高斯泼溅
authors: "Bing He, Jingnan Gao, Yunuo Chen, Ning Cao, Gang Chen, Zhengxue Cheng, Li Song, Wenjun Zhang"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=o1sF4XaFdY"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 前馈2D高斯泼溅从稀疏图像重建，带表面连续性先验
tldr: 从稀疏图像重建3D场景时，现有可泛化模型常生成离散彩色点云，近景下伪影严重。本文提出SurfSplat，基于2D高斯泼溅（2DGS）原语的前馈框架，利用2DGS更强的各向异性和几何精度，并引入表面连续性先验与强制alpha混合策略，以生成连续表面而非离散点云。该方法无需逐场景优化，即可从稀疏输入恢复精确几何和纹理，在近景视图中保持清晰细节。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏输入下可泛化高斯泼溅模型产生离散点云，近景伪影严重。
method: 使用2DGS原语和前馈架构，加入表面连续性先验和强制alpha混合。
result: 从稀疏图像生成连续表面，近景质量显著提升。
conclusion: 表面连续性先验是提升前馈高斯泼溅几何质量的关键。
---

## Abstract
Reconstructing 3D scenes from sparse images remains a challenging task due to the difficulty of recovering accurate geometry and texture without optimization.
Recent approaches leverage generalizable models to generate 3D scenes using 3D Gaussian Splatting (3DGS) primitive. 
However, they often fail to produce continuous surfaces and instead yield discrete, color-biased point clouds that appear plausible at normal resolution but reveal severe artifacts under close-up views. 
To address this issue, we present SurfSplat, a feedforward framework based on 2D Gaussian Splatting (2DGS) primitive, which provides stronger anisotropy and higher geometric precision. By incorporating a surface continuity prior and a forced alpha blending strategy, SurfSplat reconstructs coherent geometry together with faithful textures.
Furthermore, we introduce High-Resolution Rendering Consistency (HRRC), a new evaluation metric designed to evaluate high-resolution reconstruction quality. Extensive experiments on RealEstate10K, DL3DV, and ScanNet demonstrate that SurfSplat consistently outperforms prior methods on both standard metrics and HRRC, establishing a robust solution for high-fidelity 3D reconstruction from sparse inputs.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

- **研究背景**：从稀疏多视角图像（例如仅2张输入图像）中重建3D场景是计算机视觉中的核心难题，难点在于**缺少优化约束**时难以同时恢复精确的几何结构与真实纹理。
- **现有方法的局限**：近期工作尝试利用可泛化的3D高斯泼溅（3DGS）模型来生成3D场景。然而，这些前馈方法往往**无法生成连续表面**，而是产生离散、带有颜色偏差的点云。这类结果在常规分辨率下看似合理，但在**近景或离轴视角**下会暴露出严重的空洞与伪影。
- **本文核心问题**：如何让前馈高斯泼溅模型在无需逐场景优化的前提下，从稀疏输入中重建出**几何连续、纹理保真**的3D表面，尤其是在高分辨率近景视角下依然保持高质量。
- **整体含义**：SurfSplat通过引入**2D高斯泼溅（2DGS）原语**、**表面连续性先验**和**强制Alpha混合策略**，首次实现了前馈框架下的高质量连续表面重建，并提出了新的高分辨率评估指标HRRC来弥补传统指标的不足。

## 2. 方法论

- **核心思想**：放弃传统的3DGS原语，改用**2D高斯泼溅（2DGS）** 作为表示基元。2DGS本质上是二维朝向的平面高斯圆盘，具有更强的**各向异性**和更高的**几何精度**，能够更有效地捕捉表面结构。在此基础之上，通过引入两项关键技术创新来实现连续表面重建。
- **关键技术细节**：
    - **双路径编码器**：给定稀疏输入图像，模型通过**单视角**和**多视角**两条路径分别提取特征，然后进行融合。
    - **U-Net预测中间属性**：融合后的特征输入U-Net，预测**深度、尺度乘数、外观分量**等中间属性。
    - **表面连续性先验（Surface Continuity Prior）** ：将每个2DGS的**旋转和尺度属性与其空间位置绑定**，鼓励相邻高斯之间形成平滑、连贯的表面，从根本上抑制离散点云的产生。
    - **强制Alpha混合策略（Forced Alpha Blending）** ：帮助模型在训练过程中**逃离局部最优**，减少颜色偏差，确保多层表达能力和无偏颜色混合。
    - **高斯属性生成**：上述中间属性经过表面连续性先验和强制Alpha混合策略的约束后，转换为标准的2DGS属性。
- **新评估指标HRRC**：提出**高分辨率渲染一致性（High-Resolution Rendering Consistency）** 指标。该指标通过在高分辨率下渲染3D模型来模拟近景视角，从而**暴露隐藏的几何缺陷（如空洞）**。HRRC可直接从标准数据集中计算，无需额外标注。

## 3. 实验设计

- **数据集与场景**：在三个大规模公开数据集上进行评估：
    - **RealEstate10K**：大规模室内/室外场景数据集。
    - **DL3DV**：多样化的3D视频数据集。
    - **ScanNet**：室内RGB-D重建数据集。
- **Benchmark与对比方法**：在**新视角合成（Novel View Synthesis）** 任务上与多种主流前馈方法进行对比，包括：
    - pixelSplat
    - HiSplat
    - MVSplat
    - TranSplat
    - DepthSplat
- **评估指标**：同时采用**标准指标**（PSNR、SSIM、LPIPS）和本文提出的**HRRC指标**进行全方位评估。

## 4. 资源与算力

> **⚠️ 论文中未明确说明**训练所使用的GPU型号、数量、训练时长等具体算力信息。从论文性质（前馈网络，推理速度在毫秒级）推测，训练成本应显著低于传统的逐场景优化方法，但具体硬件配置在提供的摘要和元数据中均未提及。

## 5. 实验数量与充分性

- **多数据集验证**：在**3个**具有不同特点的大规模数据集（RealEstate10K、DL3DV、ScanNet）上进行了实验，覆盖室内、室外、多样化场景。
- **多方法对比**：与**5种**当前主流的前馈方法（pixelSplat、HiSplat、MVSplat、TranSplat、DepthSplat）进行了系统性对比。
- **消融实验**：存在**消融研究（Ablation Studies）** ，验证了表面连续性先验和强制Alpha混合策略各自的有效性。
- **多尺度评估**：同时使用标准分辨率和**高分辨率（HRRC）** 两种评估尺度，全面检验模型在不同视角下的表现。
- **充分性与公平性判断**：实验设计**较为充分且客观**——覆盖了多个主流数据集、对比了足够数量的SOTA方法、引入了新的评估维度（HRRC）、并包含消融验证。对比方法均为已发表的前馈高斯泼溅方法，比较基准公平。

## 6. 主要结论与发现

- **性能全面领先**：SurfSplat在RealEstate10K、DL3DV和ScanNet三个数据集上，**在标准指标（PSNR、SSIM、LPIPS）和HRRC指标上均一致优于所有对比方法**。
- **具体数值表现**：在RealEstate10K数据集上，SurfSplat-L版本达到**PSNR 27.537、SSIM 0.892、LPIPS 0.112**的最佳成绩。在更具挑战性的ACID数据集上，SurfSplat同样取得领先。
- **几何质量显著提升**：定性结果表明，SurfSplat成功生成了**连贯、真实的3D表面**，而对比方法（如pixelSplat、MVSplat、DepthSplat）仍产生离散点云和明显空洞。
- **表面连续性先验是关键**：实验证实，**表面连续性先验是提升前馈高斯泼溅几何质量的核心因素**。

## 7. 优点

- **表示基元创新**：首次将**2DGS**引入前馈重建框架，利用其更强的各向异性从根本上提升了几何精度。
- **先验设计精巧**：**表面连续性先验**将几何属性与空间位置绑定，从优化层面强制产生连续表面，而非依赖后处理。
- **训练稳定性策略**：**强制Alpha混合**有效解决了2DGS直接训练时的 instability 问题，帮助模型逃离局部最优。
- **评估指标贡献**：提出的**HRRC指标**填补了现有指标无法有效评估近景几何质量的空白。
- **实用性突出**：作为前馈模型，**推理速度达毫秒级，无需逐场景优化**，且支持**网格提取**，具备实际部署价值。

## 8. 不足与局限

- **算力信息缺失**：论文未明确报告训练所需的**GPU型号、数量、训练时长**等关键资源信息，不利于复现和实际部署评估。
- **输入限制**：方法设计针对**稀疏输入**（通常为2张图像），在输入视角更少（如单张图像）或更极端的稀疏条件下的表现未知。
- **动态场景未覆盖**：实验均在**静态场景**数据集上进行，方法对动态物体、光照变化等复杂场景的泛化能力尚未验证。
- **HRRC指标的理论分析**：HRRC作为新提出的指标，其与真实几何质量之间的**理论关联性和统计显著性**在摘要中未充分展开。
- **与2DGS基础方法的关系**：论文基于2DGS构建，但摘要中未明确说明与原始2DGS方法相比，**前馈框架带来的具体增量贡献**有多大。

（完）
