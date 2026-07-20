---
title: "LapFlow: Laplacian Multi-scale Flow Matching for Generative Modeling"
title_zh: LapFlow：拉普拉斯多尺度流匹配生成建模
authors: "Zelin Zhao, Petr Molodyk, Haotian Xue, Yongxin Chen"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=kdrc4o6okz"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 拉普拉斯多尺度流匹配用于图像生成建模
tldr: 利用拉普拉斯金字塔分解和并行的混合Transformer架构增强流匹配，多尺度并行生成，消除尺度间重噪声，提升图像生成质量并加速采样。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 级联式多尺度生成需显式重噪声，效率低。
method: 将图像分解为拉普拉斯金字塔残差，通过混合Transformer并行处理各尺度。
result: 提升生成质量，加速采样，促进流匹配扩展。
conclusion: 多尺度并行流匹配是生成建模的高效方案。
---

## Abstract
In this paper, we present Laplacian multiscale flow matching (LapFlow), a novel framework that enhances flow matching by leveraging multi-scale representations for image generative modeling. Our approach decomposes images into Laplacian pyramid residuals and processes different scales in parallel through a mixture-of-transformers (MoT) architecture with causal attention mechanisms. Unlike previous cascaded approaches that require explicit renoising between scales, our model generates multi-scale representations in parallel, eliminating the need for bridging processes. The proposed multi-scale architecture not only improves generation quality but also accelerates the sampling process and promotes scaling flow matching methods. Through extensive experimentation on CelebA-HQ and ImageNet, we demonstrate that our method achieves superior sample quality with fewer GFLOPs and faster inference compared to single-scale and multi-scale flow matching baselines. The proposed model scales effectively to high-resolution generation (up to 1024×1024) while maintaining lower computational overhead.

---

## 论文详细总结（自动生成）

# LapFlow：拉普拉斯多尺度流匹配生成建模 —— 论文深度总结

## 一、核心问题与研究动机

**生成建模的可扩展性瓶颈。** 扩散模型和流匹配方法在图像生成领域已取得领先成果，但传统方法通常直接在**全分辨率**上生成整张图像，训练和推理阶段均需消耗大量计算资源。

**现有多尺度方法的缺陷。** 已有一些多尺度生成方法（如级联扩散模型、Pyramidal Flow 等）尝试缓解这一问题，但它们普遍采用**级联式串行生成**策略，需要在不同尺度之间进行**显式的重加噪（explicit renoising）** 作为桥接过程，这不仅引入了额外噪声，还限制了并行化能力和推理效率。

**LapFlow 的核心命题。** 本文提出：能否**消除尺度间的重加噪步骤**，让多个尺度以**并行**方式协同生成，从而在提升生成质量的同时加速采样？LapFlow 正是基于这一思路，将拉普拉斯金字塔分解与流匹配相结合，实现多尺度表示的并行建模。


## 二、方法论：核心思想与技术细节

### 2.1 核心思想：拉普拉斯金字塔 + 并行多尺度流匹配

LapFlow 的核心创新在于将图像分解为**拉普拉斯金字塔残差（Laplacian pyramid residuals）**，不同尺度的残差分量通过一个**混合 Transformer（Mixture-of-Transformers, MoT）** 架构进行并行处理。

### 2.2 关键技术细节

- **多尺度加噪过程（Multi-scale Noising Process）** ：模型学习三个尺度的分量，但以**不同的速度**进行加噪。论文定义了两个关键时间点 $T_1$ 和 $T_2$（满足 $0 \triangleq T_3 < T_2 < T_1 < 1$），作为控制不同尺度训练区间的超参数。
- **尺度特定的训练区间**：最小尺度（$k=2$）在整个时间范围 $[0,1]$ 上训练；中等分辨率尺度（$k=1$）在 $[T_2, 1]$ 上训练；最高分辨率尺度（$k=0$）仅在 $[T_1, 1]$ 上训练。这种设计让不同尺度聚焦于各自合适的时间段，避免了不必要的计算浪费。
- **因果注意力机制（Causal Attention）** ：MoT 架构中引入因果注意力，确保尺度间的信息流动是单向的——粗尺度信息指导细尺度生成，而非双向耦合。
- **无需桥接过程**：与级联方法不同，LapFlow 的多尺度表示是**并行生成**的，彻底消除了尺度间的显式重加噪步骤。

### 2.3 算法流程（文字说明）

1. **编码阶段**：将输入图像通过拉普拉斯金字塔分解为多个尺度的残差表示。
2. **训练阶段**：对各尺度分量施加不同速度的噪声扰动（尺度越大、加噪越快），并行输入 MoT 架构进行流匹配训练。
3. **生成阶段**：从纯噪声出发，各尺度并行地通过学习到的流进行逆向去噪，粗尺度先收敛并提供上下文信息，细尺度在此基础上补充高频细节，最终融合重建完整图像。


## 三、实验设计

### 3.1 数据集与场景

| 数据集 | 分辨率 | 任务类型 |
|--------|--------|----------|
| CelebA-HQ | 256×256、512×512 | 无条件生成（unconditional） |
| ImageNet | 1024×1024 | 类别条件生成（class-conditional） |

ImageNet 的分辨率被设定为 1024×1024，原因是**资源限制**（due to limited resources）。VAE 的下采样因子为 8，因此最大的隐空间尺寸为 256×256。

### 3.2 基准与对比方法

论文对比了多种流匹配基线方法：

- **单尺度流匹配基线**：标准 Flow Matching、LFM（Latent Flow Matching）、SiT
- **多尺度流匹配基线**：其他多尺度流匹配方法
- **DiT 架构对比**：在 ImageNet 上对比 DiT-B/2 和 DiT-XL/2

### 3.3 评估指标与求解器

- 使用 **Fréchet Inception Distance（FID）** 作为生成质量评估指标
- 使用 **Dormand-Prince 方法（dopri5）** （torchdiffeq 库实现）进行 ODE 求解
- ImageNet 上实验了**分类器自由引导（CFG）** 的不同强度


## 四、资源与算力

**论文未明确说明具体的 GPU 型号、数量和训练时长。**

不过，从文中可以推断出一些间接信息：
- 论文提到在 ImageNet 1024×1024 上因“资源限制”而将分辨率设为此值，暗示高分辨率实验对算力有较高要求。
- 第三方复现指南提到“预期需要多天的设置/计算才能进行有意义的复现”。

总体而言，**论文在算力细节的披露上不够透明**。


## 五、实验数量与充分性

### 5.1 实验规模

从可获取的信息来看，论文开展了以下实验：

- **2 个数据集**：CelebA-HQ 和 ImageNet
- **3 种分辨率**：256×256、512×512（CelebA-HQ）和 1024×1024（ImageNet）
- **消融研究**：在 CelebA-HQ 上进行了**综合消融实验**，验证了 MoT 架构、因果掩码、噪声调度器等关键设计选择的有效性
- **多组基线对比**：涵盖单尺度和多尺度流匹配方法

### 5.2 充分性与公平性评估

**优点：**
- 覆盖了从 256×256 到 1024×1024 的多个分辨率，验证了方法的可扩展性
- 同时包含无条件（CelebA-HQ）和类别条件（ImageNet）两种任务场景
- 消融实验系统性地验证了核心设计决策

**不足：**
- 数据集种类偏少（仅两个），缺乏 CIFAR-10、FFHQ 等更通用的基准对比
- 论文未披露训练细节（如 batch size、训练步数、优化器设置等），难以判断实验的完全可复现性
- 对比方法的选取是否全面（如是否对比了最新的扩散/流匹配 SOTA）有待进一步核实


## 六、主要结论与发现

1. **生成质量更优**：在 CelebA-HQ 256×256 上，LapFlow 取得了 **FID=3.53** 的成绩，优于 LFM（FID=5.26）等基线。
2. **计算效率更高**：与单尺度和多尺度流匹配基线相比，LapFlow 用**更少的 GFLOPs** 实现了**更快的推理速度**。
3. **高分辨率可扩展性**：模型有效扩展至 **1024×1024** 高分辨率生成，同时保持较低的计算开销。
4. **并行多尺度范式有效**：验证了“无需尺度间重加噪的并行多尺度生成”这一核心思路的可行性。
5. **消融验证设计合理性**：MoT 架构、因果注意力、噪声调度器等组件均被证明对最终性能有贡献。


## 七、方法亮点

- **创新性地消除重加噪**：彻底跳过了级联方法中必需的尺度间桥接步骤，这是方法论上的核心突破。
- **拉普拉斯金字塔的自然多尺度表示**：相比于简单的图像缩放，拉普拉斯残差天然地将图像分解为从低频到高频的独立分量，各分量语义清晰、便于分别建模。
- **MoT 架构 + 因果注意力的协同设计**：混合 Transformer 提供了灵活的尺度特异性建模能力，因果注意力则确保了“由粗到细”的合理信息流动方向。
- **“不同尺度不同速度”的训练策略**：通过 $T_1, T_2$ 两个超参数控制各尺度的训练区间，让计算资源更聚焦于关键时间段。
- **代码开源**：论文代码已在 GitHub 上开源（https://github.com/sjtuytc/gen），有利于社区复现和后续研究。


## 八、不足与局限

- **算力信息不透明**：未披露 GPU 型号、数量、训练时长等关键资源信息，不利于其他研究者评估复现成本。
- **数据集覆盖有限**：仅使用 CelebA-HQ 和 ImageNet 两个数据集，缺乏对 CIFAR-10、FFHQ、LSUN 等更广泛基准的验证。
- **实验细节披露不足**：训练超参数、batch size、优化器设置、训练步数等关键细节在可获取的摘要和元数据中未见说明。
- **应用场景局限**：方法目前仅针对图像生成建模，未探讨在视频生成、3D 生成、文本到图像等其他模态的扩展性。
- **潜在偏差风险**：在 CelebA-HQ（人脸数据集）上训练的无条件生成模型可能存在人脸多样性偏差；ImageNet 上的类别条件生成也可能继承数据集的固有偏见。
- **第三方复现风险**：第三方平台指出，当前可用的相关实现“未经论文验证”，匹配置信度较低，实际复现可能需要额外工程投入。

---

（完）
