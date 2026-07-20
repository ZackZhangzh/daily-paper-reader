---
title: "IPG-Rec: Instance-aware Progressive Geometry Rectification for High-fidelity Sparse Novel View Synthesis"
title_zh: "IPG-Rec: 实例感知渐进式几何校正实现高保真稀疏新视图合成"
authors: "Huanhuan Yuan, Wu Ran, Yang Ping, Jingjing Jiang, Yonghui Huang, Chao Ma"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=imblpbUryY"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 稀疏新视图合成与实例感知几何校正
tldr: 本文针对稀疏输入下新视图合成难题，提出IPG-Rec方法，通过实例感知渐进式几何校正重建高保真几何。利用可靠伪视图图像及实例级和场景级深度正则化，逐步联合优化3D高斯表示，有效解决多视图一致性问题。实验显示在稀疏设定下生成高质量新视图，优于现有依赖单目深度或扩散先验的方法。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 稀疏视图下现有3DGS方法难以高效生成多视图一致几何。
method: 渐进式联合优化3D高斯，结合伪视图和深度正则化进行几何校正。
result: 高保真几何重建，新视图质量显著提升。
conclusion: 实例感知渐进校正有效提升稀疏视图3DGS的几何一致性。
---

## Abstract
Sparse novel view synthesis is a challenging problem due to the limited information available. While recent 3D Gaussian Splatting (3DGS) approaches have leveraged monocular depth or diffusion priors to improve reconstruction quality, they struggle to generate multi-view consistent geometry efficiently. To address this problem, we propose an Instance-aware Progressive Geometry Rectification method, namely PG-Rec, to reconstruct the high-fidelity geometry from sparse inputs. Notably, our approach progressively and jointly optimizes 3D Gaussian representations by leveraging reliable pseudo-view images, along with instance-level and scene-level depth regularization, which promotes the reconstruction of high-fidelity 3D geometry with implicit cross-view semantic consistency. Considering insufficient information from sparse views, we employ instance-level and scene-level depth regularization to refine the 3D geometry cooperatively. The instance depth guides the 3D Gaussians to move toward their corresponding object, while the global depth maintains the relative spatial positions of Gaussians in different instances. With geometry refined by depth regularization, 3DGS renders more realistic images that guide diffusion to generate reliable pseudo-views. These pseudo-views are then used to further refine geometry. By combining depth regularization with high-fidelity pseudo-view rendering, our method progressively mitigates reconstruction defects from sparse inputs and acquires high-fidelity rendering images. Extensive experiments demonstrate that our PIGR outperforms current state-of-the-art methods in sparse novel view synthesis.

---

## 论文详细总结（自动生成）

# IPG-Rec 论文深度分析总结

## 一、论文的核心问题与整体含义

**研究背景：** 稀疏新视图合成（Sparse Novel View Synthesis）是三维计算机视觉中的一项基础性难题——在仅有少量稀疏输入视图的条件下，重建出真实感三维场景并生成任意新视角的图像。NeRF 和 3D Gaussian Splatting（3DGS）等主流方法在密集视图输入下表现优异，但在现实场景中，密集视图数据往往难以获取，模型容易因信息不足而产生不可靠的伪影。

**研究动机：** 现有 3DGS 方法虽然尝试引入单目深度先验或扩散先验来提升重建质量，但在高效生成**多视图一致几何**方面仍面临困难。具体而言，现有的 patch-level 深度正则化方法将图像划分为固定尺寸的 patch，这破坏了语义与几何的一致性，导致单个对象被分割到多个 patch 中、多个对象被塞进同一个 patch，进而引发对象级别的歧义，使得 3D 高斯椭球无法准确适配正确对象。

**核心问题：** 如何在稀疏输入下重建高保真三维几何，并保证跨视图的语义一致性与几何一致性。

**整体含义：** 论文提出 IPG-Rec（Instance-aware Progressive Geometry Rectification）方法，通过实例感知的渐进式几何校正，从稀疏输入中重建高保真几何，在稀疏新视图合成任务上达到当前最优性能。


## 二、方法论：核心思想与关键技术

### 核心思想

IPG-Rec 的核心思路是**渐进式地、联合地优化 3D 高斯表示**，其关键在于两股力量的协同：一是可靠的伪视图图像，二是多层级（实例级 + 场景级）深度正则化。二者形成正向循环——深度正则化精炼几何 → 3DGS 渲染更真实的图像 → 引导扩散模型生成更可靠的伪视图 → 伪视图进一步反哺几何精炼。

### 关键技术细节

1. **实例级深度正则化（Instance-level Depth Regularization）**
   - 利用 SAM（Segment Anything Model）获取实例掩码，结合 Depth Anything V2 提取的单目深度图，对每个分割出的对象区域施加深度监督。
   - 核心作用是**引导 3D 高斯向对应对象移动**，实现细粒度局部几何校正，并保持跨视图的语义一致性。
   - 与 patch-level 方法的关键区别在于：实例级监督尊重对象的自然边界，避免将同一对象拆分到多个 patch 中。

2. **场景级深度正则化（Scene-level Depth Regularization）**
   - 单目深度估计模型通常输出相对深度值，且仅依赖实例级局部深度正则化可能导致不同对象之间的深度尺度不一致。
   - 场景级深度正则化作为补充，**维护不同实例之间高斯点的相对空间位置关系**，确保全局深度尺度的一致性。

3. **渐进式伪视图增强（Progressive Pseudo-view Augmentation）**
   - 稀疏视点限制了场景信息，使得学习准确的三维表示变得困难。
   - 方法利用当前几何结构生成可靠的伪视图，这些伪视图提供**未见视点的 2D 图像先验**，从而增强 3D 表示。
   - 结合 RGB 图像和深度图，伪视图为场景几何恢复提供额外监督。

4. **联合优化框架**
   - 上述三个模块在统一的框架中**协同优化**：深度正则化提升几何精度 → 高质量渲染提供伪视图监督 → 伪视图进一步修正几何缺陷。
   - 这种渐进式策略有效缓解了稀疏输入带来的重建缺陷，最终获得高保真渲染图像。


## 三、实验设计

**数据集与场景：**
- **LLFF**（Local Light Field Fusion）
- **IBRNet**
- **T&T**（Tanks and Temples）

三个数据集覆盖了不同类型的真实世界场景，包含大量小背景物体、不规则场景结构以及场景内部对象之间显著的语义变化。

**Benchmark 设定：**
- 遵循先前研究的做法，**每个场景仅采样 3 张图像用于训练**——这是典型的极端稀疏设定。

**对比方法：**
- 对比了近期最先进的（SOTA）方法，主要包括 DNGaussian（Li et al., 2024a）和 Peng et al.（2024）等。


## 四、资源与算力

**论文未明确说明使用的 GPU 型号、数量或训练时长。** 从论文内容来看，方法基于 3DGS 框架，结合了 SAM 和 Depth Anything V2 等预训练模型，以及扩散模型用于伪视图生成。这些组件的计算开销可能不小，但具体算力配置在提供的文本中并未提及。


## 五、实验数量与充分性

**实验组数：** 从提供的文本可以识别出以下实验：

1. **主要对比实验**：在 LLFF、IBRNet、T&T 三个数据集上与多个 SOTA 方法进行定量对比（Tables 1 & 2）。
2. **定性对比**：在 LLFF 数据集各子集上与 top-2 SOTA 方法进行可视化对比（Figure 2 & 4，以及 Appendix A.2）。
3. **消融实验**：在 LLFF 数据集上对三个核心策略分别进行消融（Table 3）：
   - Baseline
   - W/ scene-level depth
   - W/ instance-level depth
   - W/ progressive pseudo views
   - 三者组合
4. **深度估计对比**：比较 Gaussian Rendered Depth 与 Depth Anything V2 作为监督信号的效果（Table 4）。

**充分性与公平性评估：**
- **充分性**：消融实验系统性地验证了三个核心模块各自的贡献及协同效果，设计较为完整。三个数据集的覆盖也提供了跨场景的验证。
- **客观性/公平性**：论文遵循了先前工作的实验设定（3 张训练图像），对比了多个近期 SOTA 方法，定量指标采用了 PSNR、SSIM、LPIPS 等业界通用指标。整体实验设计较为规范和公平。


## 六、主要结论与发现

1. **性能领先**：IPG-Rec 在 LLFF、IBRNet、T&T 三个基准数据集上均取得 SOTA 性能，PSNR 分别达到 **21.44、22.14、21.38**。

2. **精细几何重建**：方法能够精确重建复杂背景中的细粒度对象边界，如远处螺旋楼梯的栏杆、细小草叶的边缘、花蕊的复杂结构等。

3. **模块协同有效**：消融实验表明，实例级深度正则化、场景级深度正则化与渐进式伪视图三者互补，联合使用时 PSNR 提升达 **2.638**，SSIM 提升 **0.136**，LPIPS 降低 **0.122**。

4. **深度估计选择关键**：Depth Anything V2 提供的深度图比 3DGS 渲染的深度图更平滑、更准确，作为优化约束更为有效。

5. **方法有效性**：实例感知的渐进式几何校正策略有效解决了稀疏视图下 3DGS 的几何一致性问题。


## 七、优点与亮点

1. **问题定位精准**：指出现有 patch-level 深度正则化的根本缺陷——破坏语义连续性，并针对性地提出实例级方案，切中要害。

2. **双层级深度正则化设计巧妙**：实例级保证局部精度，场景级保证全局一致性，二者互补解决了单目深度尺度不一致的固有问题。

3. **渐进式正向循环机制**：几何精炼 → 高质量渲染 → 伪视图生成 → 几何再精炼，形成自我增强的闭环，有效缓解了稀疏输入的信息不足。

4. **实验验证充分**：从定量、定性、消融三个维度系统验证方法有效性，证据链条完整。

5. **应用价值明确**：方法在包含不规则对象实例和复杂纹理的真实世界稀疏视图三维重建中表现出色，具有较强的泛化能力。


## 八、不足与局限

1. **算力信息缺失**：论文未报告训练所需的 GPU 型号、数量或时长，不利于读者评估方法的实际计算成本与可复现性。

2. **依赖外部预训练模型**：方法依赖 SAM、Depth Anything V2以及扩散模型，这些模型的推理开销和在不同领域（如室内 vs 室外、人造 vs 自然场景）的泛化能力可能成为瓶颈。

3. **极端稀疏设定的局限**：虽然 3 张视图是论文的亮点场景，但现实应用中可能面临更极端的 1-2 张视图情况，方法的适用边界未做探讨。

4. **动态场景未涉及**：论文聚焦于静态场景重建，对包含运动物体的动态场景未做讨论。

5. **失败案例未讨论**：提供的文本中未提及方法在何种情况下可能失效或表现不佳，缺乏对方法局限性的坦诚讨论。

6. **代码尚未开源**：虽然论文表示将发布匿名源代码，但在发表前第三方无法独立验证其结果。


（完）
