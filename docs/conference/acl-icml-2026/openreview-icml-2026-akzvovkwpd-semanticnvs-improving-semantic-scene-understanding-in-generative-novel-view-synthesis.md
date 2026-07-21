---
title: "SemanticNVS: Improving Semantic Scene Understanding in Generative Novel View Synthesis"
title_zh: SemanticNVS：生成式新视角合成中的语义场景理解增强
authors: "Xinya Chen, Christopher Wewer, Jiahao Xie, Xinting Hu, Jan Eric Lenssen"
date: 2026-04-30
pdf: "https://openreview.net/pdf/3a9611959073155294c5b07a152a59353bb5142e.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 语义感知多视图扩散用于新视角合成
tldr: 本文提出SemanticNVS，将预训练语义特征提取器集成到相机条件多视图扩散模型中，以改善新视角合成。现有方法在大范围相机运动下易生成语义不合理且扭曲的图像，SemanticNVS通过引入更强场景语义作为条件，即使在远距离视角下也能保持高质量生成和一致性，显著提升了模型对场景内容的理解能力。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 大范围相机运动下新视角合成图像语义失真，现有模型缺乏对场景语义的深入理解。
method: 集成预训练语义特征提取器，将语义信息作为条件融入多视图扩散模型。
result: 长距离视角下生成质量显著提升，图像语义一致性强。
conclusion: 语义条件增强可有效提升新视角合成的鲁棒性与真实性。
---

## Abstract
We present SemanticNVS, a camera-conditioned multi-view diffusion model for novel view synthesis (NVS), which improves generation quality and consistency by integrating pre-trained semantic feature extractors. Existing NVS methods perform well for views near the input view, however, they tend to generate semantically implausible and distorted images under long-range camera motion, revealing severe degradation. We speculate that this degradation is due to current models failing to fully understand their conditioning or intermediate generated scene content. Here, we propose to integrate pre-trained semantic feature extractors to incorporate stronger scene semantics as conditioning to achieve high-quality generation even at distant viewpoints. We investigate two different strategies, (1) warped semantic features and (2) an alternating scheme of understanding and generation at each denoising step. Experimental results on multiple datasets demonstrate the clear qualitative and quantitative (4.69%-15.26% in FID) improvement over state-of-the-art alternatives.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：生成式新视角合成（NVS）旨在根据单一输入视图和目标相机轨迹生成符合物理规律的新视角图像。现有方法（如基于多视图或视频扩散模型的方案）在输入视图附近表现良好，但当相机发生**大范围运动**时，生成图像会出现严重的语义不合理和扭曲现象。作者推测这种退化的根源在于现有模型未能充分理解其条件输入或中间生成的场景内容。

**核心问题**：如何在长距离相机运动条件下，让扩散模型具备更强的**场景语义理解能力**，从而生成语义一致、视觉真实的新视角图像。

**整体含义**：SemanticNVS通过将预训练的语义特征提取器集成到相机条件下的多视图扩散模型中，为模型注入“场景理解”能力，从根本上改善了大范围视角变化下的生成质量与一致性。


## 二、方法论

**核心思想**：将预训练语义特征提取器（DINOv2）集成到多视图扩散模型中，将更强的场景语义信息作为条件输入，使模型在生成过程中“理解”场景内容而非盲目像素合成。

**两种策略**：

1. **Warped Semantic Features（扭曲语义特征）** ：从给定的输入视图中提取DINO语义特征，通过几何扭曲（warping）投影到目标视角，作为额外的条件信息输入模型。

2. **Alternating Scheme（交替理解与生成方案）** ：在每个去噪步骤中，从中间生成样本 $x^0_t$（上一步的迭代结果）中提取DINO特征，用于补全第一步中因遮挡或视角变化而缺失的扭曲语义特征。该方案在训练37,000次迭代后才启用，采用分阶段调度策略以获得更好性能。

**技术细节**：语义特征沿通道维度进行 $\ell_2$ 归一化后，通过 $1\times1$ 卷积投影到紧凑表示。模型基于SEVA架构构建，并从其预训练检查点初始化。训练采用混合真实世界场景数据集，包含约75,000个视频。


## 三、实验设计

**数据集**：
- **RealEstate10K**：真实世界室内外场景数据集
- **Tanks-and-Temples**：作为**分布外（out-of-distribution）** 数据，用于评估模型的泛化能力

**评估设置**：
- 短轨迹：80-100帧
- 长轨迹：250帧以上
- 每种设置随机采样100个视频进行评估

**Benchmark与对比方法**：
- **ViewCrafter**
- **Uni3C**
- **SEVA**（作为基础架构）

**评估指标**：FID（Fréchet Inception Distance）、ImQ（图像质量）、Drift（图像质量漂移）、RE（重建误差）、TE（时间误差）、MEt3R、PSNR、SSIM、LPIPS等。


## 四、资源与算力

论文明确提及了训练配置：

- **GPU数量**：4块GPU
- **每GPU批次大小**：1
- **优化器**：AdamW
- **学习率**：$1.25\times10^{-5}$
- **权重衰减**：$1\times10^{-2}$
- **总迭代次数**：60,000次
- **图像分辨率**：$576\times576$
- **潜在空间分辨率**：$72\times72$

**注**：论文未明确说明具体GPU型号（如A100、V100等）。


## 五、实验数量与充分性

**实验组数**：

1. **主要对比实验**：在RealEstate10K和Tanks-and-Temples两个数据集上，对比三种基线方法（ViewCrafter、Uni3C、SEVA），覆盖长轨迹和短轨迹两种设置。

2. **消融实验**：对两个核心组件（Warped Semantic Features和Semantic Features from Intermediate Samples）进行消融分析。

3. **泛化实验**：Tanks-and-Temples作为分布外数据，专门评估模型泛化能力。

**充分性与公平性评价**：
- ✅ **优势**：覆盖两个不同数据集（室内外场景），包含分布内和分布外测试；对比了当前最先进的三种方法；同时提供定性和定量结果；评估指标多样（FID、PSNR、SSIM等）。
- ⚠️ **潜在不足**：消融实验仅针对两个核心组件，未对其他设计选择（如不同语义提取器、不同融合方式等）进行更细粒度消融；未提供跨数据集（如合成数据集）的实验。


## 六、主要结论与发现

1. **定量提升显著**：SemanticNVS在FID指标上相比现有最优方法实现了**4.69%–15.26%** 的改善。

2. **长距离视角生成质量大幅提升**：在长轨迹（250帧以上）设置下，生成图像的语义一致性和视觉真实性明显优于基线方法。

3. **泛化能力良好**：在分布外的Tanks-and-Temples数据集上，FID提升4.69%–14.98%，图像质量漂移降低1.83%–30.00%。

4. **两种策略均有效**：Warped Semantic Features和交替理解与生成方案各自都能提升生成质量，两者结合效果最佳。

5. **语义理解是关键**：实验证实，增强模型对场景语义的理解是改善大范围新视角合成的有效途径。


## 七、方法亮点

1. **创新性地引入语义特征**：首次将DINOv2等预训练语义特征提取器系统性地集成到多视图扩散模型中用于新视角合成。

2. **双策略设计**：提出的两种策略（扭曲语义特征 + 交替理解与生成）分别从“条件增强”和“过程理解”两个维度解决问题，互为补充。

3. **分阶段训练策略**：在训练37,000次迭代后才启用“从中间样本提取语义特征”的范式，提升了训练稳定性。

4. **轻量级集成**：语义特征通过 $1\times1$ 卷积投影到紧凑表示，计算开销可控。

5. **代码与模型开源承诺**：作者承诺论文接收后开源代码和训练模型。


## 八、不足与局限

1. **算力信息不完整**：未明确说明GPU具体型号（如A100/H100等），难以精确评估训练成本和可复现性。

2. **消融实验深度有限**：仅对两个核心组件进行消融，未对语义特征提取器的选择（如DINOv2 vs. CLIP vs. SAM）、特征融合方式等进行系统对比。

3. **数据集覆盖有限**：仅使用RealEstate10K和Tanks-and-Temples两个数据集，未涉及更多样化的场景（如合成数据集、动态场景等）。

4. **应用场景限制**：方法针对的是“给定单张输入视图”的设置，未探讨多张输入视图或多模态输入的情况。

5. **长轨迹评估的统计稳健性**：每个设置仅随机采样100个视频进行评估，样本量相对有限。

6. **实时性未讨论**：作为扩散模型，推理速度可能较慢，论文未对推理效率进行分析。

---

（完）
