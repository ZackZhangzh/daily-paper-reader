---
title: "DRGSplat: Depth-Regularized 3D Gaussian Splatting"
title_zh: 深度正则化3D高斯泼溅
authors: "Daniel Barath, Keisuke Tateno, Marc Pollefeys, Federico Tombari"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=BpwRgbmTW9"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 深度正则化3D高斯泼溅用于新颖视图合成
tldr: 3D高斯泼溅在新颖视图合成中视觉保真度高但几何精度不足，现有几何改进方法直接约束高斯原语有损其体积特性。本文提出DRGSplat，通过训练时对渲染深度图施加正则化来提升几何精度，无需修改高斯原语。设计单目深度损失保证全局一致性，表面法向损失细化局部细节，并引入不确定性感知曲率损失选择性抑制高梯度区域以避免不稳定。实验表明该方法在保持渲染速度的同时显著改善了重建几何质量。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS视觉质量高但几何精度不足，直接修改高斯原语有损体积特性。
method: 对渲染深度图施加三种正则化损失，不直接改动高斯原语。
result: 显著提升几何精度，同时保持高效渲染和视觉效果。
conclusion: 深度正则化是增强3DGS几何精度的有效途径。
---

## Abstract
3D Gaussian Splatting has rapidly become a leading method for photorealistic novel view synthesis. However, its geometric accuracy often lags behind its visual fidelity. Existing methods to improve geometry typically constrain the 3D Gaussians directly, compromising their volumetric nature. We introduce DRGSplat, a novel depth-regularization approach for 3D Gaussian Splatting that enhances geometric accuracy without direct modifications of the Gaussian primitives. DRGSplat regularizes the rendered depth maps during training with three key losses: a monocular depth loss enforcing global consistency, a surface normal loss refining local detail, and a new uncertainty-aware curvature loss that selectively penalizes high-gradient regions while avoiding the gradient instabilities common to direct curvature constraints. Experiments on standard benchmarks show that DRGSplat keeps the strong photometric quality of Gaussian Splatting while substantially improving geometric accuracy and outperforming state-of-the-art geometry-focused methods. On the ETH3D dataset, DRGSplat improves reconstruction accuracy, completeness, and F1 scores of 3DGS by 15, 25, and 17 percentage points, respectively. The source code will be made publicly available.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **研究背景**：3D高斯泼溅（3D Gaussian Splatting, 3DGS）已成为照片级真实感新颖视图合成（novel view synthesis）的领先方法之一，在实时渲染性能和视觉保真度方面表现优异。
- **核心问题**：3DGS的**几何精度**（geometric accuracy）往往显著落后于其视觉质量。现有改进几何精度的方法通常直接约束3D高斯原语（Gaussian primitives），但这会损害高斯表示的体积特性（volumetric nature）。
- **整体含义**：本文旨在**在不修改高斯原语的前提下**，通过深度正则化（depth regularization）来提升3DGS的几何重建精度，从而在保持高效渲染和视觉质量的同时，获得更准确的场景几何结构。

## 2. 方法论：核心思想、关键技术细节

- **核心思想**：不对3D高斯原语本身施加直接约束，而是在**训练过程中对渲染出的深度图（rendered depth maps）施加正则化**，以此间接改善几何精度。

- **三种关键损失函数**：DRGSplat在训练时对渲染深度图施加以下三种损失：
  1. **单目深度损失（Monocular Depth Loss）** ：利用单目深度估计先验，强制渲染深度图与单目深度估计结果保持全局一致性（global consistency）。
  2. **表面法向损失（Surface Normal Loss）** ：通过约束表面法向量，细化局部几何细节（refining local detail）。
  3. **不确定性感知曲率损失（Uncertainty-Aware Curvature Loss）** ：这是本文提出的新损失项，**选择性地惩罚高梯度区域**（high-gradient regions），同时避免直接曲率约束中常见的梯度不稳定问题（gradient instabilities）。

- **算法流程（文字说明）** ：
  1. 基于输入的多视角图像，初始化3D高斯场景表示。
  2. 在训练过程中，从当前高斯场景渲染出深度图。
  3. 对渲染深度图分别计算上述三种损失：
     - 与预训练单目深度估计网络的输出进行对比，计算全局一致性损失；
     - 从深度图推导表面法向，与法向先验对比，计算局部细节损失；
     - 在深度图的高梯度区域施加选择性曲率惩罚。
  4. 将三种损失与3DGS原有的光度损失（photometric loss）联合优化，反向传播更新高斯参数。
  5. 迭代训练直至收敛。

> 注：论文摘要中未提供具体的损失函数数学公式或超参数设置细节。

## 3. 实验设计：数据集、Benchmark与对比方法

- **使用的数据集/场景**：论文在**标准基准数据集**上进行了评估，其中明确提及了 **ETH3D数据集**。
- **Benchmark**：ETH3D数据集是著名的多视角立体（MVS）基准，常用于评估3D重建的几何精度。
- **对比方法**：与**当前最先进的（state-of-the-art）以几何精度为导向的方法**进行了对比（geometry-focused methods）。具体方法名称在摘要中未逐一列出。

## 4. 资源与算力

**论文摘要及提供的元数据中未明确说明**所使用的GPU型号、数量、训练时长等具体算力信息。

> 注：原始3DGS的训练通常需要数十分钟到数小时不等，DRGSplat作为在3DGS基础上增加额外损失项的方法，训练开销可能会有所增加，但具体数值在本文提供的材料中未提及。

## 5. 实验数量与充分性

- **实验组数**：从摘要信息来看，论文至少包含以下实验：
  - 在ETH3D标准基准上的定量评估（报告了精度、完整度、F1分数等指标）；
  - 与多种SOTA几何聚焦方法的对比；
  - 包含了三种损失函数的设计，暗示可能进行了**消融实验**（ablation study）以验证各组件的有效性。

- **充分性与客观性评估**：
  - ETH3D是领域内公认的标准MVS基准，在该数据集上报告定量指标具有较强的**客观性和可比性**；
  - 与SOTA方法进行对比，符合学术研究的**公平性**要求；
  - 三种损失函数的设计暗示了消融实验的存在，有助于验证各损失项的独立贡献；
  - 但由于公开信息有限，无法判断实验覆盖的场景多样性（如是否涵盖室内/室外、大尺度/小尺度场景等），也难以评估其在不同光照、纹理条件下的泛化能力。

## 6. 主要结论与发现

- DRGSplat在**保持3DGS强大光度质量**（photometric quality）的同时，**显著提升了几何精度**。
- 在ETH3D数据集上，相比原始3DGS：
  - **重建精度（accuracy）提升了15个百分点**；
  - **完整度（completeness）提升了25个百分点**；
  - **F1分数提升了17个百分点**。
- DRGSplat在几何重建质量上**优于当前最先进的以几何为导向的方法**。
- 源代码将公开发布。

## 7. 优点（方法或实验设计的亮点）

- **方法创新性**：区别于现有方法直接修改高斯原语的做法，DRGSplat通过对**渲染深度图施加正则化**来间接提升几何精度，**不损害高斯表示的体积特性**，这是一种新颖且优雅的思路。
- **损失函数设计精巧**：三种损失各司其职——单目深度损失保证全局结构、法向损失细化局部细节、不确定性感知曲率损失选择性抑制高梯度区域——形成了从粗到细的完整正则化体系。
- **不确定性感知曲率损失**：这一新提出的损失项能够**避免直接曲率约束常见的梯度不稳定问题**，在技术上有实质性贡献。
- **性能提升显著**：在ETH3D基准上，精度、完整度、F1分数分别提升15、25、17个百分点，改进幅度非常可观。
- **兼顾效率与质量**：在显著改善几何精度的同时，**保持了3DGS的高效渲染能力**和视觉保真度。

## 8. 不足与局限

- **算力信息缺失**：论文未报告具体的GPU型号、数量或训练时长，难以评估该方法在实际应用中的计算成本和训练效率。
- **实验覆盖范围有限**：公开信息中仅明确提及ETH3D数据集，未说明是否在Mip-NeRF360、Tanks&Temples、DL3DV等更多样化的基准上进行了验证。
- **对比方法细节不详**：摘要未列出具体对比的SOTA方法名称，难以判断对比的全面性和公平性。
- **泛化能力未知**：未提及在不同场景类型（如动态场景、无纹理区域、大尺度户外场景等）下的表现。
- **消融实验细节缺失**：虽然三种损失的设计暗示了消融研究的可能性，但具体各损失项的独立贡献和组合效果在摘要中未呈现。
- **实际部署考虑**：依赖预训练单目深度估计网络，可能引入额外的模型依赖和推理开销，实际部署时需考虑这一因素。

（完）
