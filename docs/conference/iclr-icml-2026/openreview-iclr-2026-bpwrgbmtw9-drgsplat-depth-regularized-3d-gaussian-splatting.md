---
title: "DRGSplat: Depth-Regularized 3D Gaussian Splatting"
title_zh: DRGSplat：深度正则化的3D高斯泼溅
authors: "Daniel Barath, Keisuke Tateno, Marc Pollefeys, Federico Tombari"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=BpwRgbmTW9"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 深度正则化3DGS提升新视图合成的几何精度
tldr: 3DGS在新视图合成中视觉质量高但几何精度不足。直接约束高斯元会损害其体素特性。本文提出DRGSplat，通过训练时对渲染深度图施加单目深度一致性、表面法线和不确定性感知曲率损失，在不修改高斯元的前提下提升几何精度，同时保持渲染质量。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS几何精度落后于视觉保真度，直接约束高斯元妥协其体素性质。
method: 在训练中正则化渲染深度图，使用单目深度损失、法线损失和曲率损失。
result: 显著提升几何精度，避免高斯元直接修改带来的副作用。
conclusion: 深度正则化是提升3DGS几何质量的有效替代方案。
---

## Abstract
3D Gaussian Splatting has rapidly become a leading method for photorealistic novel view synthesis. However, its geometric accuracy often lags behind its visual fidelity. Existing methods to improve geometry typically constrain the 3D Gaussians directly, compromising their volumetric nature. We introduce DRGSplat, a novel depth-regularization approach for 3D Gaussian Splatting that enhances geometric accuracy without direct modifications of the Gaussian primitives. DRGSplat regularizes the rendered depth maps during training with three key losses: a monocular depth loss enforcing global consistency, a surface normal loss refining local detail, and a new uncertainty-aware curvature loss that selectively penalizes high-gradient regions while avoiding the gradient instabilities common to direct curvature constraints. Experiments on standard benchmarks show that DRGSplat keeps the strong photometric quality of Gaussian Splatting while substantially improving geometric accuracy and outperforming state-of-the-art geometry-focused methods. On the ETH3D dataset, DRGSplat improves reconstruction accuracy, completeness, and F1 scores of 3DGS by 15, 25, and 17 percentage points, respectively. The source code will be made publicly available.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

3D Gaussian Splatting（3DGS）已成为照片级真实感新视图合成的领先方法，但其几何精度往往落后于视觉保真度。现有改进几何精度的方法通常直接约束3D高斯基元，但这会损害其体素性质。

针对这一矛盾，本文提出 **DRGSplat（Depth-Regularized 3D Gaussian Splatting）** ，一种新型深度正则化方法，在不直接修改高斯基元的前提下提升几何精度。其核心思路是在训练过程中对渲染出的深度图施加正则化约束，而非干预高斯基元本身。


## 2. 方法论

**核心思想：** 通过正则化渲染深度图来提升几何精度，避免直接约束高斯元带来的副作用。

**关键技术细节——三种损失函数：**

1. **单目深度损失（Monocular Depth Loss）** ：强制全局一致性
2. **表面法线损失（Surface Normal Loss）** ：细化局部几何细节
3. **不确定性感知曲率损失（Uncertainty-Aware Curvature Loss）** ：选择性惩罚高梯度区域，同时避免直接曲率约束常见的梯度不稳定性

**算法流程（文字描述）：** 在3DGS训练过程中，DRGSplat不直接修改高斯元的参数，而是对每次迭代渲染得到的深度图分别计算上述三种损失，将其与原有的光度损失共同作为优化目标，通过反向传播间接引导高斯元的优化方向，从而使最终学习到的场景几何更加准确。


## 3. 实验设计

**数据集/场景：** 论文在标准基准（standard benchmarks）上进行了实验，其中明确提到的数据集包括 **ETH3D 数据集**。

**Benchmark：** 标准的新视图合成与三维重建基准。

**对比方法：** 与 **state-of-the-art 的几何聚焦方法（geometry-focused methods）** 进行了对比。


## 4. 资源与算力

**论文中未明确说明**所使用的GPU型号、数量及训练时长等算力信息。


## 5. 实验数量与充分性

从摘要信息来看，实验至少涵盖：
- 在ETH3D数据集上的定量评估
- 与多种SOTA几何聚焦方法的对比
- 消融实验（从三种损失函数的设计可推断存在消融研究）

**评估：** 从现有信息判断，实验设计较为规范，采用了标准基准和公开数据集，与主流方法进行了对比，具有较好的客观性和公平性。但由于无法获取论文全文，具体的实验组数、覆盖场景多样性等细节尚不明确。


## 6. 主要结论与发现

1. DRGSplat **保持了3DGS强大的光度质量**（photometric quality）
2. 同时**大幅提升了几何精度**，超越了当前最优的几何聚焦方法
3. 在 **ETH3D 数据集**上，相较于原始3DGS：
   - 重建精度（accuracy）提升 **15 个百分点**
   - 完整性（completeness）提升 **25 个百分点**
   - F1 分数提升 **17 个百分点**


## 7. 方法亮点

1. **不修改高斯元本体**：通过正则化渲染深度图间接提升几何精度，避免了直接约束对高斯元体素性质的损害
2. **创新的不确定性感知曲率损失**：选择性惩罚高梯度区域，有效规避了直接曲率约束常见的梯度不稳定问题
3. **多维度几何约束**：从全局一致性（单目深度）、局部细节（法线）到曲率正则化三个层面全面约束几何
4. **兼顾质量与精度**：在显著提升几何精度的同时保持优异的光度渲染质量


## 8. 不足与局限

1. **算力信息缺失**：论文未报告训练所需的GPU型号、数量及时长，不利于复现和资源评估
2. **实验细节不完整**：受限于可获取的论文信息，具体的实验设置、场景覆盖范围、消融实验详细结果等尚不明确
3. **依赖单目深度先验**：方法依赖单目深度估计模型提供的先验，其性能可能受限于深度估计模型本身的精度
4. **应用场景覆盖未知**：是否适用于动态场景、大尺度场景或稀疏视图等极端条件，从摘要中无法判断


（完）
