---
title: "IPG-Rec: Instance-aware Progressive Geometry Rectification for High-fidelity Sparse Novel View Synthesis"
title_zh: IPG-Rec：实例感知渐进几何校正用于高保真稀疏新视图合成
authors: "Huanhuan Yuan, Wu Ran, Yang Ping, Jingjing Jiang, Yonghui Huang, Chao Ma"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=imblpbUryY"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 稀疏输入下的新视图合成与3D高斯泼溅
tldr: 针对稀疏输入下新视图合成多视角几何不一致的难题，提出IPG-Rec方法，通过渐进式几何校正，联合优化3D高斯表示，并利用可靠伪视图图像及实例级与场景级深度正则化，有效重建高保真几何，显著提升合成质量。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有3DGS方法依赖深度或扩散先验，难以高效生成多视角一致的几何，需解决稀疏输入下的几何重建问题。
method: 渐进式联合优化3D高斯表示，结合伪视图图像及实例级与场景级深度正则化进行几何校正。
result: 实验表明该方法能重建高保真3D几何，显著提升稀疏视图合成的视觉效果。
conclusion: IPG-Rec通过渐进几何校正有效解决了稀疏输入下多视图一致性问题，推动高保真新视图合成。
---

## Abstract
Sparse novel view synthesis is a challenging problem due to the limited information available. While recent 3D Gaussian Splatting (3DGS) approaches have leveraged monocular depth or diffusion priors to improve reconstruction quality, they struggle to generate multi-view consistent geometry efficiently. To address this problem, we propose an Instance-aware Progressive Geometry Rectification method, namely PG-Rec, to reconstruct the high-fidelity geometry from sparse inputs. Notably, our approach progressively and jointly optimizes 3D Gaussian representations by leveraging reliable pseudo-view images, along with instance-level and scene-level depth regularization, which promotes the reconstruction of high-fidelity 3D geometry with implicit cross-view semantic consistency. Considering insufficient information from sparse views, we employ instance-level and scene-level depth regularization to refine the 3D geometry cooperatively. The instance depth guides the 3D Gaussians to move toward their corresponding object, while the global depth maintains the relative spatial positions of Gaussians in different instances. With geometry refined by depth regularization, 3DGS renders more realistic images that guide diffusion to generate reliable pseudo-views. These pseudo-views are then used to further refine geometry. By combining depth regularization with high-fidelity pseudo-view rendering, our method progressively mitigates reconstruction defects from sparse inputs and acquires high-fidelity rendering images. Extensive experiments demonstrate that our PIGR outperforms current state-of-the-art methods in sparse novel view synthesis.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景**：新视图合成（Novel View Synthesis, NVS）旨在基于有限输入视图生成未观测视角的图像，是计算机视觉领域的重要挑战。NeRF 和 3DGS 等方法在密集、高度重叠的训练图像下取得了优异的渲染质量，但在真实场景中，稠密视角信息往往难以获取，稀疏输入下这些方法容易产生不可靠的伪影。

**研究动机**：现有 3DGS 方法虽尝试引入单目深度或扩散先验来提升重建质量，但仍难以高效生成多视角一致的几何结构。特别地，现有基于 patch 级别的深度正则化方法将图像划分为固定尺寸的 patch，破坏了语义与几何的一致性（如同一物体被分割到多个 patch），导致高斯椭球无法准确对齐到正确物体，产生模糊和不可靠的渲染内容。

**核心问题**：如何在稀疏输入下高效重建多视角一致的高保真 3D 几何，提升新视图合成的视觉质量。

**论文定位**：提出 **IPG-Rec（Instance-aware Progressive Geometry Rectification）** ，通过实例感知的渐进式几何校正框架，联合优化 3D 高斯表示，解决稀疏输入下的几何重建难题。


## 二、方法论：核心思想与关键技术

### 2.1 核心思想

IPG-Rec 的核心在于**渐进式、联合优化** 3D 高斯表示，融合可靠伪视图图像与**实例级 + 场景级**的双重深度正则化，实现隐含跨视角语义一致性的高保真 3D 几何重建。

### 2.2 关键技术细节

**（1）实例级深度正则化（Instance-level Depth Regularization）**

利用 SAM（Segment Anything Model）获取实例掩码，结合 Depth Anything V2 提供的大规模单目深度估计，对每个物体实例施加局部的深度监督。这一策略引导 3D 高斯基元精确对齐到各物体的正确几何位置，实现跨视角语义一致性。与 patch 级方法相比，实例级深度监督能够保持物体的语义完整性，避免物体被拆分导致的歧义。

**（2）场景级深度正则化（Scene-level Depth Regularization）**

由于单目深度估计模型通常预测相对深度值，仅依赖实例级局部深度正则化可能导致不同物体间的深度尺度不一致。场景级全局深度监督用于维持整个场景一致的深度尺度，防止不同实例间高斯椭圆的相对位置发生错误更新。两者协同作用：**局部深度**引导每个物体的高斯椭圆移动到正确的 3D 空间位置，**全局深度**则确保不同实例间的相对空间关系得以保持。

**（3）渐进式伪视图增强（Progressive Pseudo-view Augmentation）**

稀疏视角限制了场景信息量，使得学习精确的 3D 表示变得困难。IPG-Rec 在深度正则化优化几何的同时，利用当前 3DGS 结构渲染出更真实的图像，进而引导扩散模型生成可靠的伪视图。这些伪视图提供了来自未观测视角的 2D 图像先验，RGB 与深度图共同用于校正场景几何。通过将深度正则化与高保真伪视图渲染相结合，方法逐步弥补稀疏输入带来的重建缺陷。

**（4）整体流程**

1. 利用 SAM 从输入图像中提取实例掩码，Depth Anything V2 提取单目深度；
2. 构建 3DGS 场景表示，同时施加实例级与场景级深度正则化进行几何约束；
3. 3DGS 渲染出更真实的图像，引导扩散模型生成可靠伪视图；
4. 伪视图（RGB + 深度）反馈到 3DGS 优化中，进一步精炼几何；
5. 上述过程**渐进式迭代**，逐步提升几何保真度与渲染质量。


## 三、实验设计

**数据集与场景**：论文在三个主流基准数据集上开展实验：
- **LLFF**（Mildenhall et al., 2019）：包含复杂背景、细小物体和不规则场景结构；
- **IBRNet**（Wang et al., 2021）；
- **T&T**（Knapitsch et al., 2017）。

**数据划分与训练配置**：遵循已有工作，每个场景采样 **3 张图像** 用于训练，构成严格的稀疏输入设定。

**对比方法**：与当前最先进（SOTA）方法进行对比，包括 DNGaussian（Li et al., 2024a）和 Peng et al.（2024）等代表性方法。


## 四、资源与算力

论文摘要和正文中 **未明确说明** 所使用的 GPU 型号、数量及训练时长等算力信息。仅在可复现性声明中提到实现细节（包括网络架构、训练策略、优化设置）已在正文和附录中提供，且将开源匿名化源代码、训练脚本和配置文件。具体的硬件资源配置需查阅论文附录。


## 五、实验数量与充分性

**实验组数与类型**：

1. **主要对比实验**：在 LLFF、IBRNet、T&T 三个数据集上与多个 SOTA 方法进行定量比较；
2. **消融实验（Ablation Study）** ：在 LLFF 数据集上系统评估各策略的独立贡献：
   - Baseline（基线）
   - W/ scene-level depth（仅场景级深度）
   - W/ instance-level depth（仅实例级深度）
   - W/ progressive pseudo views（仅渐进伪视图）
   - 三者组合（完整 IPG-Rec）
3. **深度估计对比实验**：比较使用 Gaussian 渲染深度与 Depth Anything V2 深度作为监督信号的效果差异；
4. **定性可视化对比**：在 Figure 2 和 Figure 4 中展示与 top-2 SOTA 方法的重建对比；
5. **各子数据集细粒度对比**：在 LLFF 的每个子集上与 top-2 方法进行对比（附录 A.2）。

**充分性与公平性评价**：
- 实验覆盖了三个主流基准数据集，场景类型丰富（包含复杂背景、细小物体、不规则结构等）；
- 消融实验系统拆解了各模块的贡献，证明了实例级深度、场景级深度和渐进伪视图三者互补有效；
- 与 SOTA 方法的对比遵循了已有工作的实验设置（3 张训练图像），保证了公平性；
- 论文提供了定量（PSNR/SSIM/LPIPS）与定性（可视化）双重证据，论证较为充分。


## 六、主要结论与发现

1. **性能领先**：IPG-Rec 在稀疏新视图合成任务上达到了新的 SOTA 性能，在 LLFF、IBRNet 和 T&T 数据集上的 PSNR 分别达到 **21.44、22.14 和 21.38**。

2. **细粒度几何重建**：方法能够精确重建复杂背景中的精细物体边界，如远处螺旋楼梯的栏杆、细小草叶边缘、花蕊的复杂结构等。

3. **模块协同有效**：消融实验表明，完整方法（实例级深度 + 场景级深度 + 渐进伪视图）在 PSNR、SSIM、LPIPS 上分别提升 **2.638、0.136 和 0.122**，各策略相互补充。

4. **深度估计选择关键**：Depth Anything V2 提供的深度图相比 Gaussian 渲染深度更平滑、更准确，是更优的优化约束。


## 七、方法优点

1. **实例感知的正则化范式创新**：首次将实例级深度监督引入 3DGS 稀疏新视图合成，从根本上避免了 patch 级方法破坏语义完整性的问题。

2. **双层次深度正则化协同设计**：实例级与场景级深度正则化分别负责局部精度与全局结构一致性，有效解决了单目深度尺度不一致的难题。

3. **渐进式自增强闭环**：通过“深度正则化优化几何 → 渲染高质量图像 → 扩散生成伪视图 → 伪视图反馈优化几何”的闭环，逐步弥补稀疏输入的信息不足。

4. **跨视角语义一致性**：通过实例感知的深度监督，隐式地保持了不同视角间的语义一致性。

5. **效率与泛化性兼顾**：方法在保持高效性的同时具备较强的泛化能力，能有效应对真实世界中不规则物体实例和复杂纹理的挑战。


## 八、不足与局限

1. **算力信息缺失**：论文未明确报告 GPU 型号、数量、训练时长等资源消耗信息，不利于读者评估方法的实际部署成本。

2. **依赖外部预训练模型**：方法依赖 SAM 进行实例分割和 Depth Anything V2 进行深度估计，这些外部模型本身可能存在偏差，且增加了系统的复杂性和依赖链。

3. **伪视图质量依赖**：渐进式伪视图增强的有效性依赖于扩散模型生成的质量，若扩散模型在特定场景下生成效果不佳，可能影响整体性能。

4. **应用场景限制**：方法针对稀疏输入（3 张图像）设计，在输入视图数量更极端（如 1-2 张）或场景极度复杂（如高度反光、透明物体）时的表现尚待验证。

5. **未充分讨论失败案例**：摘要和结论中未对方法的失败场景或局限性进行深入讨论，缺乏对方法适用边界的清晰界定。


（完）
