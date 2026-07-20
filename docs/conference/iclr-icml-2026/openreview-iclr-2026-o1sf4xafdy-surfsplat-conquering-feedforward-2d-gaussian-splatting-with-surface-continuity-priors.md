---
title: "SurfSplat: Conquering Feedforward 2D Gaussian Splatting with Surface Continuity Priors"
title_zh: SurfSplat：利用表面连续性先验攻克前馈2D高斯泼溅
authors: "Bing He, Jingnan Gao, Yunuo Chen, Ning Cao, Gang Chen, Zhengxue Cheng, Li Song, Wenjun Zhang"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=o1sF4XaFdY"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 前馈2D高斯泼溅用于稀疏视角新视图合成
tldr: 针对稀疏输入图像重建3D场景时现有可泛化高斯泼溅方法产生离散点云和近景伪影的问题，本文提出SurfSplat框架，采用2D高斯泼溅基元并结合表面连续性先验与强制alpha混合策略，从而在无需逐场景优化的前馈推理中获得连续表面和高几何精度，显著提升近景新视角合成质量。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有可泛化3DGS方法在稀疏视角下产生离散点云，近景伪影严重。
method: 采用2D高斯泼溅基元，引入表面连续性先验和强制alpha混合。
result: 实现高质量连续表面重建，提升近景新视角合成效果。
conclusion: 前馈2D高斯泼溅结合表面先验可有效解决稀疏重建伪影问题。
---

## Abstract
Reconstructing 3D scenes from sparse images remains a challenging task due to the difficulty of recovering accurate geometry and texture without optimization.
Recent approaches leverage generalizable models to generate 3D scenes using 3D Gaussian Splatting (3DGS) primitive. 
However, they often fail to produce continuous surfaces and instead yield discrete, color-biased point clouds that appear plausible at normal resolution but reveal severe artifacts under close-up views. 
To address this issue, we present SurfSplat, a feedforward framework based on 2D Gaussian Splatting (2DGS) primitive, which provides stronger anisotropy and higher geometric precision. By incorporating a surface continuity prior and a forced alpha blending strategy, SurfSplat reconstructs coherent geometry together with faithful textures.
Furthermore, we introduce High-Resolution Rendering Consistency (HRRC), a new evaluation metric designed to evaluate high-resolution reconstruction quality. Extensive experiments on RealEstate10K, DL3DV, and ScanNet demonstrate that SurfSplat consistently outperforms prior methods on both standard metrics and HRRC, establishing a robust solution for high-fidelity 3D reconstruction from sparse inputs.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究背景**：从稀疏图像（少至两张）重建3D场景是计算机视觉中的经典难题。传统方法依赖COLMAP预处理和逐场景优化，耗时数小时；而前馈方法可在毫秒级完成重建，具备实时应用潜力。

**核心问题**：现有基于3DGS的前馈方法虽然能在常规分辨率下生成视觉上合理的图像，但存在严重缺陷——重建表面退化为离散的、近乎球形的点云，带有颜色偏差和可见空洞。这些缺陷在原始分辨率和参考视角附近不易察觉，但在近景或离轴视角下会暴露严重伪影。

**研究意义**：SurfSplat旨在解决上述问题，提出首个基于2DGS的通用前馈稀疏视角重建框架，实现高质量连续表面重建与高保真新视图合成。


## 二、方法论

**核心思想**：采用2D Gaussian Splatting（2DGS）作为表示基元，替代传统的3DGS。2DGS具有更强的各向异性和更高的几何精度。但2DGS直接训练存在不稳定性，几何属性与渲染结果之间存在复杂耦合，在稀疏监督下梯度难以有效解耦几何与外观。

**两大关键技术**：

1. **表面连续性先验（Surface Continuity Prior）** ：将每个2DGS的旋转和尺度属性绑定到其空间位置，鼓励生成平滑、连贯的表面。

2. **强制Alpha混合策略（Forced Alpha Blending）** ：帮助模型逃离局部最优，减少训练中的颜色偏差。

**网络架构**：采用双路径编码器，分别处理单视图和多视图分支，融合后的特征通过U-Net预测深度、尺度乘数和外观分量等中间属性，再经由表面连续性先验和强制alpha混合策略转换为标准高斯属性。

**新评价指标**：提出高分辨率渲染一致性（HRRC），通过在超分辨率下渲染3D模型来模拟近景视角，暴露空间空洞等隐藏伪影，可直接从标准数据集计算而无需额外标注。


## 三、实验设计

**数据集**：
- **RealEstate10K**：大规模房产视频数据集，用于稀疏视角新视图合成
- **DL3DV**：多样化3D场景数据集
- **ScanNet**：室内RGB-D扫描数据集，用于评估泛化能力

**对比方法**：pixelSplat、HiSplat、MVSplat、TranSplat、DepthSplat等主流前馈3DGS方法

**评估指标**：PSNR、SSIM、LPIPS等标准指标，以及新提出的HRRC指标

**Benchmark**：稀疏视角（通常为2张输入图像）下的新视图合成任务


## 四、资源与算力

论文提供的文本中**未明确说明**所使用的GPU型号、数量和训练时长等具体算力信息。


## 五、实验数量与充分性

**实验规模**：
- 在**3个大型数据集**（RealEstate10K、DL3DV、ScanNet）上进行了系统性评估
- 定量对比了**5种以上**主流前馈方法
- 进行了**消融实验**，分别验证了表面连续性先验和强制alpha混合策略的有效性
- 提供了**不同模型规模**的版本（Ours-S、Ours-B、Ours-L）

**充分性判断**：实验设计较为充分——涵盖了多个数据集、多种对比方法、消融实验和不同模型规模的对比，符合顶会论文的常规实验标准。**客观性与公平性**：在标准数据集上与多种SOTA方法进行公平对比，使用相同的评价指标，结果可信度较高。


## 六、主要结论与发现

1. SurfSplat在RealEstate10K、DL3DV和ScanNet上均取得了SOTA性能，在PSNR、SSIM、LPIPS等标准指标上全面优于现有方法

2. 在ACID数据集上，SurfSplat-L在多数指标上达到最优（PSNR 27.537，SSIM 0.892，LPIPS 0.112）

3. 表面连续性先验对几何质量至关重要——去除该先验后，尽管常规分辨率下的NVS性能仍然可观，但表面变得不连续且噪声明显，HRRC指标显著下降

4. 强制alpha混合策略有效防止了模型退化为完全不透明高斯，避免跨视图空间错位

5. 传统NVS指标（PSNR/SSIM/LPIPS）不足以衡量几何保真度，HRRC作为补充指标能更有效地揭示表面不连续性


## 七、方法亮点

1. **首次将2DGS引入前馈稀疏重建**：利用2DGS更强的各向异性特性提升几何精度

2. **表面连续性先验**：通过约束旋转和尺度属性与空间位置的关联，从源头解决离散点云问题

3. **强制Alpha混合**：有效避免透明度坍塌（opacity collapse），保证跨视图几何一致性

4. **HRRC新指标**：无需额外标注即可评估高分辨率重建质量，填补了现有评价体系的空白

5. **支持网格提取**：重建结果可直接用于下游网格提取任务

6. **毫秒级前馈推理**：继承了前馈方法的实时优势


## 八、不足与局限

1. **依赖已知相机位姿**：方法仍然需要输入图像的相机位姿信息，无法在未知位姿场景下工作

2. **逐像素高斯冗余**：每个像素预测一个高斯导致表示冗余，可能影响存储效率和推理速度

3. **稀疏输入限制**：方法针对稀疏视角（少至2张图像）设计，在更少输入（如单张图像）或极端视角下的表现未充分讨论

4. **算力信息缺失**：论文未报告训练所需的GPU型号、数量和时长，不利于复现和资源评估

5. **室内外场景差异**：虽然在ScanNet（室内）和RealEstate10K（室外/混合）上均有验证，但针对极端复杂室外场景（如无纹理区域、高反光表面）的鲁棒性有待进一步检验


（完）
