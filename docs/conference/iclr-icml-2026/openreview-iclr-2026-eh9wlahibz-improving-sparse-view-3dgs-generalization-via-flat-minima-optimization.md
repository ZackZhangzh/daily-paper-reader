---
title: Improving Sparse-View 3DGS Generalization via Flat Minima Optimization
title_zh: 基于平坦极小值优化的稀疏视图3DGS泛化提升
authors: "Kangmin Seo, Sangeek Hyun, MinKyu Lee, Jae-Pil Heo"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=eH9Wlahibz"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 利用平坦极小值优化提升稀疏视图3D高斯泼溅泛化
tldr: 将平坦极小值优化引入3D高斯泼溅，通过尺度自适应扰动使高斯参数在稀疏视图下更鲁棒，有效抑制过拟合，从而提升未见视点的新视图合成质量。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS易过拟合，泛化至新视角能力差。
method: 将平坦极小值原则适配至3DGS，提出尺度自适应扰动等技术。
result: 在稀疏输入下取得更稳定的新视图合成效果。
conclusion: 平坦极小值优化可显著增强稀疏视图3DGS的泛化能力。
---

## Abstract
Recent advances in neural rendering have established 3D Gaussian Splatting (3DGS) as a highly efficient representation for novel view synthesis, enabling real-time training and rendering with strong fidelity. However, when supervision is limited to a sparse set of input views, 3DGS tends to overfit to the observed images, resulting in poor generalization to unseen viewpoints. We approach this challenge from the perspective of flat minima (FM) optimization, which seeks solutions that remain stable under small parameter perturbations and are thus more robust. Viewing Gaussian parameters as trainable weights, we adapt FM principles to the geometric and dynamic nature of 3DGS by introducing several key techniques. First, we propose a Scale-Adaptive Perturbation (SAP) scheme that scales perturbation magnitude according to each Gaussian’s anisotropy, preserving fine details while promoting robustness. Second, we adopt stochastic perturbation where each Gaussian is probabilistically perturbed or left unchanged, allowing perturbations while preventing oversmoothing of scene details. Third, we schedule the perturbation magnitude to increase gradually during training, avoiding excessive noise before Gaussians capture stable structure. Finally, we incorporate periodic reinitialization of non-positional parameters such as scale, rotation, and opacity, and Spherical Harmonics (SH) coefficients. preventing degenerate cases like elongated Gaussians and maintaining well-conditioned primitives throughout optimization. Together, these techniques form a lightweight framework that integrates seamlessly into existing 3DGS pipelines without architectural changes. Experiments on LLFF and Mip-NeRF360 demonstrate that our method consistently improves both quantitative metrics and perceptual quality under sparse-view supervision, producing reconstructions that are sharper, more stable, and better generalized to novel viewpoints.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

- **研究背景**：3D Gaussian Splatting（3DGS）是近期神经渲染领域的一项重要进展，能够实现实时训练与渲染，并具备高保真度的新视图合成能力。
- **核心问题**：当监督信息仅限于稀疏的输入视图时，3DGS 会严重过拟合于已观测图像，导致在未见过的新视点下泛化能力极差。
- **研究动机**：作者从**平坦极小值（Flat Minima, FM）优化**的角度切入——该理论认为，处于损失 landscape 平坦区域的解对参数微小扰动保持稳定，因而具有更好的泛化性。论文将高斯参数视为可训练权重，将 FM 原则适配到 3DGS 的几何与动态特性中。

> 整体而言，本文旨在通过平坦极小值优化，使稀疏视图下训练的 3DGS 模型收敛到更鲁棒的参数空间，从而提升对新视角的合成质量。

## 二、方法论

**核心思想**：在训练过程中对高斯参数施加受控扰动，引导模型走向损失 landscape 中的平坦极小值区域，从而增强泛化能力。

**四项关键技术**：

1. **尺度自适应扰动（Scale-Adaptive Perturbation, SAP）** ：扰动幅度根据每个高斯函数的各向异性程度按比例缩放——各向异性越强的高斯（细长形状）扰动越大，越接近球形的高斯扰动越小。扰动噪声采样与高斯各轴尺度成比例，避免过度破坏精细几何结构。

2. **随机扰动（Stochastic Perturbation）** ：每个高斯以概率 $p$ 被扰动，以概率 $1-p$ 保持不变。这种设计在引入正则化的同时防止场景细节被过度平滑。

3. **扰动幅度调度（Perturbation Magnitude Scheduling）** ：扰动幅度 $\alpha(t) = t/T$ 随训练进程从 0 到 1 线性增长。早期扰动较小，避免在高斯尚未捕获稳定结构时引入过多噪声；后期扰动增大，推动模型走向平坦极小值。

4. **周期性重初始化（Periodic Reinitialization）** ：每隔固定迭代步数（如 1000 步），将非位置参数（尺度、旋转、不透明度、球谐系数）重置为初始状态。位置、颜色和高斯总数保持不变。这可以防止细长高斯等退化情况，保持图元在整个优化过程中的良好条件数。

> 整套框架**轻量级**，无需修改 3DGS 的架构即可无缝集成到现有 pipeline 中。

## 三、实验设计

- **数据集**：使用两个广泛使用的新视图合成基准数据集：
  - **LLFF**（Mildenhall et al., 2019）：分别使用 **3 视图、6 视图、9 视图**作为稀疏输入。
  - **Mip-NeRF360**（Barron et al., 2022）：分别使用 **12 视图、24 视图**作为稀疏输入。
  - 两个数据集均下采样 8 倍。

- **评测指标**：采用三种全参考图像质量评估指标：
  - PSNR（峰值信噪比）
  - SSIM（结构相似性指数）
  - LPIPS（学习感知图像块相似度）

- **对比方法**：与多种稀疏视图新视图合成方法进行比较：
  - **3DGS**（Kerbl et al., 2023）：基线方法
  - **CoR-GS**（Zhang et al., 2024）
  - **DropGaussian**（Park et al., 2025）
  - **DNGaussian**（Li et al., 2024a）：引入深度先验的几何监督
  - **FSGS**（Zhu et al., 2024）：引入深度先验的几何监督

## 四、资源与算力

论文明确提到实验使用了 **NVIDIA RTX TITAN 和 A6000 GPU**。但**未说明具体使用的 GPU 数量、训练时长、显存占用等详细信息**。

## 五、实验数量与充分性

**实验组数**：

- **定量对比实验**：LLFF 数据集 3 种视图设置（3/6/9-view）+ Mip-NeRF360 数据集 2 种视图设置（12/24-view），共 5 组对比实验。
- **消融实验**共 5 组：
  1. 扰动策略对比（各向异性 vs. 各向同性变体）
  2. 不同高斯参数扰动对比（位置、旋转、尺度、不透明度、位置+尺度）
  3. 随机扰动 vs. 全局损失混合
  4. 周期性重初始化有无对比
  5. 扰动幅度调度有无对比
- **定性对比**：在图 2 中展示了 LLFF 和 Mip-NeRF360 数据集上的可视化结果对比。

**充分性评估**：

- 实验设计较为**全面**：覆盖了不同数据集、不同稀疏程度、多个主流基线、多项消融分析，能够有效验证各模块的贡献。
- **客观性与公平性**：实现基于原始 3DGS 框架，超参数遵循 DropGaussian 的设置；评测指标为学术界通用标准；对比方法均为近年代表性工作。整体而言实验设计较为客观公平。
- 不过，论文**仅覆盖了静态场景数据集（LLFF、Mip-NeRF360）** ，未涉及动态场景或更大规模的室外场景，实验场景的多样性有一定局限。

## 六、主要结论与发现

1. **平坦极小值优化有效提升稀疏视图 3DGS 泛化能力**：在 LLFF 和 Mip-NeRF360 的所有视图设置下，本文方法在 PSNR、SSIM、LPIPS 上均一致优于或持平现有基线。
2. **位置扰动是最有效的策略**：消融实验表明，对高斯位置施加扰动对泛化提升最为关键，同时对位置和尺度施加扰动反而会导致性能下降。
3. **各向异性扰动优于各向同性**：基于高斯各轴尺度的各向异性噪声在保细节和正则化之间取得了最佳平衡。
4. **周期性重初始化与扰动调度均有正向贡献**：消融实验证实两者均能稳定优化过程并提升最终性能。
5. **定性结果**：相比基线方法，本文方法在平面区域、遮挡边界等欠约束区域生成更清晰、几何一致性更强的重建结果。

## 七、优点

1. **视角新颖**：首次将平坦极小值优化的思想系统性地引入稀疏视图 3DGS 问题，将过拟合解释为收敛到 sharp minima，为 3DGS 泛化问题提供了新的理论视角。
2. **方法轻量且即插即用**：无需修改 3DGS 架构，可无缝集成到现有 pipeline 中。
3. **技术设计精细**：SAP、随机扰动、幅度调度、周期性重初始化四项设计均针对 3DGS 的几何与动态特性量身定制，而非简单套用神经网络中的 FM 方法。
4. **实验扎实**：包含多数据集、多视图设置、多基线对比及 5 组消融实验，验证充分。
5. **性能领先**：在全部 5 组定量对比设置中均取得最优或持平的结果。

## 八、不足与局限

1. **算力信息不完整**：未明确说明训练时长、GPU 数量、显存占用等资源消耗细节，不利于复现和实际应用评估。
2. **场景类型覆盖有限**：仅在 LLFF 和 Mip-NeRF360 两个静态场景数据集上验证，未涉及动态场景、无界场景或大规模室外场景。
3. **稀疏程度仍有局限**：最稀疏设置仅为 3 视图（LLFF）和 12 视图（Mip-NeRF360），未探索更极端的 1-2 视图场景。
4. **依赖 SfM 初始化**：方法仍基于 Structure-from-Motion 点云初始化，在缺乏可靠 SfM 的先验条件下可能受限。
5. **超参数敏感性未充分讨论**：扰动概率 $p_{\text{max}}=0.3$、扰动系数 $\gamma=2$、重初始化间隔 1000 步等超参数的选择依据和敏感性分析不足。
6. **理论深度有限**：虽引入平坦极小值概念，但对 3DGS 损失 landscape 的几何性质缺乏深入的理论分析（如 Hessian 谱分析）。

（完）
