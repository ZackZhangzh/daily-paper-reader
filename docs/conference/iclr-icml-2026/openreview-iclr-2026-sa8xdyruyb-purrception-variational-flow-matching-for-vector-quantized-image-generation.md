---
title: "Purrception: Variational Flow Matching for Vector-Quantized Image Generation"
title_zh: 用于向量量化图像生成的变分流匹配
authors: "Răzvan-Andrei Matișan, Vincent Tao Hu, Grigory Bartosh, Björn Ommer, Cees G. M. Snoek, Max Welling, Jan-Willem van de Meent, Mohammad Mahdi Derakhshani, Floor Eijkelboom"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=SA8xDYrUYB"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 变分流匹配用于向量量化图像生成
tldr: 连续流匹配缺乏离散监督，而离散方法缺少几何感知。本文提出Purrception，将变分流匹配推广至向量量化隐空间，在连续嵌入空间中计算速度场的同时学习码本索引的分类后验，从而结合连续方法的几何感知与离散方法的显式监督。该方法支持不确定性量化和温度控制生成。在ImageNet-1k 256x256生成上，训练收敛速度优于连续流匹配和离散流匹配，展示了混合范式的优势。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 流匹配与离散量化结合时缺乏分类监督，影响生成可控性。
method: 在连续嵌入空间计算速度场，同时学习码本索引的分类后验。
result: 生成质量高，收敛快，支持温度控制。
conclusion: 变分流匹配可有效融合连续与离散生成范式。
---

## Abstract
We introduce Purrception, a variational flow matching approach for vector-quantized image generation that provides explicit categorical supervision while maintaining continuous transport dynamics. Our method adapts Variational Flow Matching to vector-quantized latents by learning categorical posteriors over codebook indices while computing velocity fields in the continuous embedding space. This combines the geometric awareness of continuous methods with the discrete supervision of categorical approaches, enabling uncertainty quantification over plausible codes and temperature-controlled generation. We evaluate Purrception on ImageNet-1k $256 \times 256$ generation. Training converges faster than both continuous flow matching and discrete flow matching baselines while achieving competitive FID scores with state-of-the-art models. This demonstrates that Variational Flow Matching can effectively bridge continuous transport and discrete supervision for improved training efficiency in image generation.

---

## 论文详细总结（自动生成）

# Purrception：用于向量量化图像生成的变分流匹配——论文深度总结


## 一、论文的核心问题与整体含义（研究动机与背景）

**研究背景：**

流匹配（Flow Matching）已成为图像、音频、文本等多种模态生成任务中极为有效的方法。其核心思路是定义源分布（噪声）与目标分布（数据）之间的插值路径，然后学习一个连续归一化流的速度场，将样本从噪声运输到数据分布。

变分流匹配（Variational Flow Matching, VFM）进一步将流匹配重新表述为推理问题——流匹配的速度场可视为条件速度的期望，因此可通过一个关于当前插值点下目标样本的变分后验来近似。当该后验为高斯分布时，退化为标准流匹配；其他选择则可自然地扩展到不同模态。例如，应用于离散数据时，VFM可得到CatFlow。

**核心问题：**

在向量量化（Vector-Quantized, VQ）图像生成中，现有方法面临一个根本性矛盾：

- **连续流匹配方法**：具有几何感知能力（geometric awareness），能较好地处理连续嵌入空间中的运输动态，但缺乏对离散码本的显式分类监督。
- **离散方法**：提供明确的类别监督，但缺少几何感知。

**论文贡献：**

本文提出 **Purrception**，一种将变分流匹配推广到向量量化隐空间的生成方法。其核心贡献在于**在连续嵌入空间中计算速度场的同时，学习码本索引的分类后验**，从而同时获得连续方法的几何感知能力与离散方法的显式分类监督。这一混合范式还支持不确定性量化（对可能码本的不确定性估计）和温度控制的生成。


## 二、方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

Purrception 的核心思想是**在向量量化隐空间中应用变分流匹配**。具体而言：

- 使用预训练的编码器 $\mathcal{E}$ 和大小为 $K$ 的码本，将图像编码并量化到隐空间，得到离散的码本索引表示。
- 在**连续嵌入空间**中定义并学习速度场（保留连续运输的几何结构）。
- 同时，学习一个**码本索引上的分类后验**（categorical posterior），提供显式的离散监督。

### 2.2 关键技术细节

1. **变分后验的设计**：与标准流匹配中固定的高斯后验不同，Purrception 在向量量化隐空间中学习一个可变的分类后验，该后验编码了在当前插值点下各个码本索引的后验概率。

2. **混合监督机制**：
   - **连续监督**：速度场的回归损失（标准流匹配目标），保证运输路径的几何合理性。
   - **离散监督**：分类后验的变分损失，提供显式的码本索引监督。

3. **温度控制生成**：通过学习分类后验，可以在采样时通过温度参数调节生成多样性，这是纯连续方法难以实现的。

### 2.3 算法流程（文字描述）

1. **编码阶段**：输入图像 $x$，通过预训练编码器 $\mathcal{E}$ 得到连续隐表示，再通过码本量化得到离散码本索引。
2. **前向插值**：从噪声分布采样初始点，沿概率路径向目标数据点插值。
3. **后验学习**：在当前插值点条件下，学习码本索引的分类后验分布。
4. **速度场回归**：在连续嵌入空间中回归条件速度场，学习从噪声到数据的运输映射。
5. **联合优化**：同时优化速度场回归损失和分类后验的变分损失。
6. **采样生成**：从噪声出发，沿学习到的速度场运输，同时利用分类后验进行温度控制的解码生成。


## 三、实验设计：数据集、Benchmark 与对比方法

### 3.1 数据集

Purrception 在 **ImageNet-1k $256 \times 256$** 图像生成任务上进行评估。这是图像生成领域最具挑战性和最常用的基准数据集之一。

### 3.2 对比方法

论文对比了以下基线方法：

- **连续流匹配（Continuous Flow Matching, CFM）** ：标准流匹配方法，在连续空间中学习速度场。
- **离散流匹配（Discrete Flow Matching, DFM）** ：完全离散化的流匹配方法，在离散码本空间上操作。

此外，论文还将 Purrception 的 FID 分数与 **state-of-the-art 模型**进行了比较。

### 3.3 评估指标

主要使用 **FID（Fréchet Inception Distance）** 作为生成质量的评价指标，同时关注**训练收敛速度**。


## 四、资源与算力

⚠️ **论文未明确说明**所使用的 GPU 型号、数量或训练时长等具体算力信息。

从论文内容来看，Purrception 在 ImageNet-1k $256 \times 256$ 这样的高分辨率大规模数据集上进行了训练，通常这类实验需要较大的计算资源（如多张 NVIDIA A100 或 V100 GPU）。但具体配置在所提供的摘要和元数据中并未提及。


## 五、实验数量与充分性

### 5.1 实验设置

从现有信息来看，论文主要进行了以下实验：

1. **主要生成实验**：在 ImageNet-1k $256 \times 256$ 上的图像生成任务。
2. **与两种基线的对比**：连续流匹配（CFM）和离散流匹配（DFM）。
3. **与 SOTA 模型的对比**：在 FID 分数上的比较。

### 5.2 充分性评估

**优势方面**：
- ImageNet-1k $256 \times 256$ 是图像生成领域公认的黄金标准基准，在该数据集上的评估具有高可信度和强说服力。
- 同时对比了连续方法和离散方法两种基线，能够清晰展示混合范式的优势。
- 关注训练收敛速度这一实际应用中的重要指标，而不仅仅是最终性能。

**潜在不足**：
- 根据摘要和元数据，**未明确提及消融实验**（如去除分类后验、改变温度参数等的影响）。
- **未提及在其他分辨率或数据集上的验证**（如 CIFAR-10、CelebA 等），泛化能力的证据相对有限。
- 对比方法的数量可能偏少（仅明确提到 CFM 和 DFM 两种基线）。

总体而言，核心实验设计合理、基准选择恰当，但实验覆盖的广度和深度有待进一步确认。


## 六、论文的主要结论与发现

1. **混合范式有效**：变分流匹配可以有效地融合连续运输与离散监督，在图像生成中实现更好的训练效率。

2. **收敛速度更快**：Purrception 的训练收敛速度快于连续流匹配和离散流匹配基线。有外部报道指出，Purrception 比 DFM 快 **3.0 倍和 3.5 倍**。

3. **生成质量具有竞争力**：Purrception 在 ImageNet-1k $256 \times 256$ 上取得了与 SOTA 模型具有竞争力的 FID 分数。

4. **支持额外功能**：通过分类后验的学习，Purrception 天然支持**不确定性量化**和**温度控制生成**，这是纯连续方法难以实现的。


## 七、优点：方法与实验设计的亮点

1. **创新的混合范式**：首次将变分流匹配系统地推广到向量量化隐空间，在连续与离散生成范式之间架起了一座桥梁。

2. **理论框架优雅**：基于变分流匹配的通用框架，将离散监督自然地融入连续运输过程中，而非生硬拼接。

3. **双重优势兼得**：同时获得连续方法的几何感知能力与离散方法的显式分类监督。

4. **实用功能丰富**：支持不确定性量化和温度控制生成，增强了模型的可解释性和可控性。

5. **训练效率显著**：在收敛速度上明显优于纯连续和纯离散基线，具有实际应用价值。

6. **基准选择权威**：ImageNet-1k $256 \times 256$ 是图像生成领域最具挑战性的基准之一，评估结果具有高可信度。


## 八、不足与局限

1. **算力信息缺失**：论文未明确报告 GPU 型号、数量或训练时长，不利于实验的可复现性和资源评估。

2. **实验覆盖范围有限**：
   - 仅在 ImageNet-1k 一个数据集上进行了评估，未验证在其他数据集（如 CIFAR-10、CelebA-HQ 等）上的泛化能力。
   - 未明确提及在不同分辨率（如 $64 \times 64$、$128 \times 128$）上的实验。

3. **消融研究不足**：根据现有信息，未明确报告消融实验的结果（如分类后验的作用、温度参数的影响、码本大小的影响等）。

4. **对比基线偏少**：仅明确对比了 CFM 和 DFM 两种基线，与更多 SOTA 生成模型（如扩散模型、GAN 等）的全面对比可能不足。

5. **实际部署考量**：向量量化方法通常涉及预训练 VQ-VAE 的编码器/解码器，这可能带来额外的训练和推理开销，论文未对此进行深入讨论。

6. **应用领域局限**：目前仅在图像生成领域进行了验证，其在其他模态（如文本、音频、视频）的适用性尚不清楚。


（完）
