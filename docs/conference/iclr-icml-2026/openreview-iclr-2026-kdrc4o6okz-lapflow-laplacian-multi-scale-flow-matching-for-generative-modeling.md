---
title: "LapFlow: Laplacian Multi-scale Flow Matching for Generative Modeling"
title_zh: LapFlow：拉普拉斯多尺度流匹配用于生成建模
authors: "Zelin Zhao, Petr Molodyk, Haotian Xue, Yongxin Chen"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=kdrc4o6okz"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 多尺度流匹配用于图像生成
tldr: 该论文提出拉普拉斯多尺度流匹配（LapFlow），将图像分解为拉普拉斯金字塔残差，通过混合变换器并行处理多尺度表示，消除了级联重噪过程，提升了生成质量和采样速度。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有流匹配在图像生成中效率受限。
method: 拉普拉斯金字塔分解，多尺度并行处理。
result: 提升生成质量并加速采样。
conclusion: 多尺度架构促进流匹配扩展。
---

## Abstract
In this paper, we present Laplacian multiscale flow matching (LapFlow), a novel framework that enhances flow matching by leveraging multi-scale representations for image generative modeling. Our approach decomposes images into Laplacian pyramid residuals and processes different scales in parallel through a mixture-of-transformers (MoT) architecture with causal attention mechanisms. Unlike previous cascaded approaches that require explicit renoising between scales, our model generates multi-scale representations in parallel, eliminating the need for bridging processes. The proposed multi-scale architecture not only improves generation quality but also accelerates the sampling process and promotes scaling flow matching methods. Through extensive experimentation on CelebA-HQ and ImageNet, we demonstrate that our method achieves superior sample quality with fewer GFLOPs and faster inference compared to single-scale and multi-scale flow matching baselines. The proposed model scales effectively to high-resolution generation (up to 1024×1024) while maintaining lower computational overhead.

---

## 论文详细总结（自动生成）

# LapFlow：拉普拉斯多尺度流匹配用于生成建模——论文深度总结


## 1. 论文的核心问题与整体含义

**研究动机**：生成建模领域近年来取得了显著进展，扩散模型和流匹配方法在图像合成任务上达到了最先进水平。然而，随着分辨率不断提高和内容日益复杂，**可扩展性**（scalability）成为一项重大实践挑战。传统方法通常在全分辨率下生成整张图像，训练和推理阶段都需要大量计算资源。

**核心问题**：如何在保持生成质量的同时，提升采样效率、降低推理开销？多尺度生成是一条有前景的路径，但现有方法（如 Cascaded Diffusion Models、EdifyImage、Pyramidal Flow）各有局限——有的需要为每个分辨率训练独立网络，有的在像素空间操作导致推理缓慢，有的依赖预训练模型进行微调而从头训练的效果尚不明确。

**整体含义**：LapFlow 旨在通过**拉普拉斯金字塔分解**与**并行多尺度建模**，从根本上重塑流匹配的生成范式——不再逐级串行生成，而是让不同尺度在统一模型中并行处理，从而同时提升生成质量、加速采样并促进方法扩展。


## 2. 方法论

### 2.1 核心思想

LapFlow 将图像分解为**拉普拉斯金字塔残差**（Laplacian pyramid residuals），不同尺度通过一个统一的**混合 Transformer（Mixture-of-Transformers, MoT）**架构进行并行处理。与以往需要在尺度之间进行显式重噪（explicit renoising）的级联方法不同，LapFlow 实现了多尺度表示的**并行生成**，消除了桥接过程。

模型采用**因果注意力机制**（causal attention），强制信息从低分辨率到高分辨率自然流动，确保细节在全局结构的基础上连贯生成。如图 1 所示，模型遵循从粗到细的生成策略：从随机噪声出发，先生成最粗尺度，再逐步以已完成粗尺度为条件生成更细尺度。

### 2.2 关键技术细节

**拉普拉斯金字塔分解**：给定图像 \\(\mathbf{x}_1\\)，通过下采样（平均池化）和上采样（最近邻插值）操作，分解为三个尺度的残差：
- \\(\mathbf{x}_1^{(2)}\\)：最粗尺度（两次下采样）
- \\(\mathbf{x}_1^{(1)}\\)：中间尺度残差
- \\(\mathbf{x}_1^{(0)}\\)：最细尺度残差

该方法可轻松推广到更多尺度。

**训练算法**（Algorithm 1）：
1. 对每张图像采样随机噪声，生成拉普拉斯金字塔
2. 随机采样阶段 \\(s\\) 和时间 \\(t\\)
3. 对 \\(k \geq s\\) 的尺度计算加噪图像和速度目标
4. 前向传播获得预测，计算多尺度速度损失 \\(\mathcal{L}_{mv}\\)
5. 反向传播更新参数

**采样算法**（Algorithm 2）：
1. 从最大尺度随机噪声出发
2. 在 \\([0, T_2]\\) 区间生成最粗尺度
3. 在 \\([T_2, T_1]\\) 区间生成中间尺度（条件于粗尺度）
4. 在 \\([T_1, 1]\\) 区间生成最细尺度（条件于前两者）
5. 通过拉普拉斯金字塔重建完整图像

**关键创新**：采用**渐进式训练策略**，不同尺度在不同的时间区间内优化，根据各尺度的贡献分配计算资源。理论上，这种渐进式多尺度设计的有效注意力成本低于 DiT。


## 3. 实验设计

**数据集**：
- **CelebA-HQ**：人脸图像数据集，用于无条件生成
- **ImageNet**：大规模图像分类数据集，用于类别条件生成

**分辨率**：从 256×256 扩展到 **1024×1024** 高分辨率生成

**Benchmark 与对比方法**：
- **单尺度流匹配基线**：DiT（Peebles and Xie, 2023）、LFM（Dao et al., 2023）
- **多尺度流匹配基线**：Cascaded Diffusion Models（Ho et al., 2022）、EdifyImage（Atzmon et al., 2024）、Pyramidal Flow（Jin et al., 2025）

**评估指标**：FID（Fréchet Inception Distance）作为主要质量指标，GFLOPs 作为计算效率指标。


## 4. 资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量及训练时长等具体算力信息。

从文中可推断的信息有限：论文在 GFLOPs 维度上进行了效率对比，表明作者关注计算效率，但未披露训练阶段的具体硬件配置和耗时。


## 5. 实验数量与充分性

**实验组数**：

1. **CelebA-HQ 上的主实验**：256×256 分辨率下的无条件生成，报告 FID 为 3.53（对比 LFM 的 5.26）
2. **高分辨率扩展实验**：扩展至 1024×1024
3. **ImageNet 上的类别条件生成**：与单尺度和多尺度流匹配方法对比
4. **消融实验**：在 CelebA-HQ 上对 MoT 架构、因果掩码、噪声调度器等关键设计选择进行系统性消融

**充分性与公平性评估**：
- **优点**：覆盖了无条件生成和类别条件生成两种任务场景，分辨率从 256 到 1024 均有涉及，消融实验针对核心设计组件展开，对比方法涵盖了单尺度和多尺度的主流基线，实验设计较为系统。
- **不足**：从摘要和引言来看，论文未详细报告在更多样化的数据集（如 COCO、LSUN 等）上的表现；视频生成等扩展任务未被涉及（尽管相关工作部分提到了 Pyramidal Flow 在视频生成中的应用）；消融实验仅限于 CelebA-HQ，未在 ImageNet 上验证各设计选择的泛化性。


## 6. 主要结论与发现

1. **生成质量提升**：LapFlow 在 CelebA-HQ 上达到 FID 3.53（256×256），显著优于 LFM 的 5.26。

2. **计算效率更高**：相比单尺度和多尺度流匹配基线，LapFlow 以更少的 GFLOPs 和更快的推理速度实现了更优的样本质量。

3. **高分辨率可扩展性**：模型可有效扩展至 1024×1024 高分辨率生成，同时保持较低的计算开销。

4. **并行化优势**：通过并行生成多尺度表示，消除了级联方法中必需的显式桥接过程，从根本上提升了采样效率。

5. **架构有效性**：MoT 架构与因果注意力机制的设计选择经消融实验验证有效。


## 7. 优点

1. **方法论创新性强**：首次将拉普拉斯金字塔分解与流匹配框架深度结合，实现了真正意义上的并行多尺度生成，区别于以往所有需要级联或重噪的多尺度方法。

2. **统一模型设计**：使用单个 MoT 模型处理所有尺度，避免了级联方法需要训练多个独立网络的高复杂度。

3. **理论分析扎实**：通过时间加权复杂度分析，从理论上证明了渐进式多尺度设计的注意力成本低于 DiT。

4. **效率与质量双赢**：在多个数据集和分辨率上同时实现了更好的 FID 和更低的 GFLOPs，打破了"质量与效率不可兼得"的常规认知。

5. **实验设计系统**：涵盖了主实验、高分辨率扩展、类别条件生成和消融实验，对比基线选择合理。

6. **工程友好**：在潜在空间建模，相比像素空间方法（如 EdifyImage）推理速度更快。


## 8. 不足与局限

1. **算力信息缺失**：论文未披露训练所需的 GPU 型号、数量、训练轮数和时长等关键资源信息，不利于复现和实际部署评估。

2. **数据集覆盖有限**：实验仅在 CelebA-HQ 和 ImageNet 上进行，未涉及更复杂的自然图像数据集（如 COCO）或域外数据，泛化能力验证不够充分。

3. **消融实验范围有限**：消融研究仅在 CelebA-HQ 上进行，未在 ImageNet 等高难度数据集上验证设计选择的鲁棒性。

4. **任务类型单一**：目前仅针对图像生成任务，未探索视频生成、文本到图像生成等其他生成模态。

5. **与最先进方法的对比缺失**：对比基线中 LFM 的 FID 5.26 与当前最先进水平有一定差距，未与更近期、更强的基线（如最新版 DiT、SiT 等）进行全面对比。

6. **潜在偏差风险**：拉普拉斯金字塔分解依赖于固定的上/下采样操作，对图像内容的结构假设可能引入归纳偏置，在高度非结构化或纹理丰富的图像上可能表现不佳。

7. **代码与模型未公开**：从现有信息无法判断代码和预训练模型是否开源，影响研究的可复现性和社区影响力。


（完）
