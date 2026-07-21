---
title: "DiffStyle3D: Consistent 3D Gaussian Stylization via Attention Optimization"
title_zh: DiffStyle3D：基于注意力优化的一致性3D高斯风格化
authors: "Yitong Yang, Yinglin Wang, Xuexin Liu, Jing Wang, Hao Dou, Changshuo Wang, Shuting He"
date: 2026-04-30
pdf: "https://openreview.net/pdf/f5bc0628d6ebf9188ce032097dec60df17dade76.pdf"
tags: ["query:dgs-fm"]
score: 4.0
evidence: 使用扩散模型的3D高斯风格化
tldr: 针对现有VGG/CLIP方法难以建模多视图一致性、扩散方法训练不稳定的问题，DiffStyle3D提出一种基于扩散的3D高斯泼溅风格迁移范式，在潜在空间中直接优化，通过注意力感知损失对齐风格特征并保留内容，实现一致且稳定的3D风格化效果。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 解决现有3D风格化方法在视图一致性和训练稳定性上的不足。
method: 提出扩散式3DGS风格迁移，通过注意力感知损失优化潜在空间。
result: 实现多视图一致的风格化且训练过程稳定。
conclusion: 扩散模型与注意力优化结合可有效提升3DGS风格化质量。
---

## Abstract
3D style transfer enables the creation of visually expressive 3D content, enriching the visual appearance of 3D scenes and objects. However, existing VGG- and CLIP-based methods struggle to model multi-view consistency within the model itself, while diffusion-based approaches can capture such consistency but rely on denoising directions, leading to unstable training. To address these limitations, we propose DiffStyle3D, a novel diffusion-based paradigm for 3DGS style transfer that directly optimizes in the latent space. Specifically, we introduce an Attention-Aware Loss that performs style transfer by aligning style features in the self-attention space, while preserving original content through content feature alignment. Inspired by the geometric invariance of 3D stylization, we propose a Geometry-Guided Multi-View Consistency method that integrates geometric information into self-attention to enable cross-view correspondence modeling. Based on geometric information, we additionally construct a geometry-aware mask to prevent redundant optimization in overlapping regions across views, which further improves multi-view consistency. Extensive experiments show that DiffStyle3D outperforms state-of-the-art methods, achieving higher stylization quality and visual realism. The code is available at \url{https://github.com/yangyt46/DiffStyle3D}.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义（研究动机和背景）

3D风格化旨在将静态3D几何表示转化为具有独特美学特征的富有表现力的数字资产，在虚拟现实、游戏和影视制作等领域具有重要应用价值。然而，现有方法存在两类关键局限：

- **VGG和CLIP-based方法**：难以在模型内部建模多视图一致性，导致不同视角下风格化结果不一致。
- **扩散模型方法**：虽能捕捉多视图一致性，但依赖扩散模型的去噪方向进行优化，导致训练过程不稳定。

为此，本文提出**DiffStyle3D**，一种基于扩散模型的新型3D高斯泼溅（3DGS）风格化范式，通过在潜在空间中直接优化，实现稳定且一致的3D风格化效果。


## 二、方法论

### 核心思想

DiffStyle3D不依赖扩散模型的反复去噪，而是直接在学习的特征空间中调整场景表示，通过注意力感知损失在自注意力空间中完成风格迁移。

### 关键技术

**1. 注意力感知损失（Attention-Aware Loss）**

包含两个核心项：
- **风格损失**：通过在自注意力空间中对齐风格特征来传递风格。
- **内容损失**：通过对齐内容特征来保留原始内容。

具体实现上，从渲染图像的自注意力层提取查询（Q）、键（K）、值（V），进行中心化和归一化后计算注意力输出，以作为风格化信号。

**2. 几何引导的多视图一致性（Geometry-Guided Multi-View Consistency）**

受3D风格化几何不变性的启发，将几何信息融入自注意力机制，实现跨视图对应关系建模。

**3. 几何感知掩码（Geometry-Aware Mask）**

基于几何信息构建掩码，避免跨视图重叠区域中的冗余优化，进一步提升多视图一致性。

### 算法流程

1. 基于3DGS场景表示，从多视角渲染图像；
2. 在潜在空间中直接优化场景表示；
3. 通过注意力感知损失进行风格-内容联合约束；
4. 利用几何引导的自注意力实现跨视图一致性；
5. 使用几何感知掩码剔除重叠区域冗余优化。


## 三、实验设计

### 数据集与场景

- **场景来源**：从TandT DB数据集和Mip-NeRF 360数据集中选取**8个场景**。
- **风格图像**：每个场景使用**14种不同风格图像**进行风格化，共生成**112组场景级风格化实验**。
- **物体级实验**：使用SAM3D从场景中提取**10个独立物体**，产生**140组物体级风格化结果**。

### 对比方法

论文对比了现有SOTA方法，包括StyleGaussian、SGSST等。

### 评估指标

从**风格迁移质量、内容保留程度和多视图一致性**三个维度进行全面评估。


## 四、资源与算力

论文明确说明：**所有实验均在单张NVIDIA L20（48G）GPU上完成**。训练时每个batch使用t=1的视图，N=4。**未提及具体的训练时长**。


## 五、实验数量与充分性

### 实验规模

- 场景级：8场景 × 14风格 = **112组实验**
- 物体级：10物体 × 14风格 = **140组实验**
- 总计：**252组风格化实验**

### 实验充分性评估

- **✅ 充分之处**：实验覆盖了场景级和物体级两个粒度，场景来自多个公开数据集（TandT DB + Mip-NeRF 360），风格图像数量达到14种，对比了多个SOTA方法，评估维度涵盖风格质量、内容保留和多视图一致性。
- **⚠️ 潜在不足**：消融实验方面，仅明确提到对几何引导注意力（GGA）的有效性进行了量化评估，其他模块（如注意力感知损失的具体贡献、几何感知掩码的独立效果）的消融分析在摘要材料中未充分展开。


## 六、主要结论与发现

1. DiffStyle3D在**风格化质量和视觉真实感**上均优于现有SOTA方法。
2. 通过**潜在空间直接优化**替代扩散模型的去噪方向依赖，有效解决了训练不稳定的问题。
3. **几何引导的自注意力机制**能有效建模跨视图对应关系，显著提升多视图一致性。
4. **几何感知掩码**进一步优化了重叠区域的渲染，减少了冗余计算。


## 七、优点与亮点

1. **方法创新性强**：首次将扩散模型与注意力优化结合，在潜在空间中直接优化3DGS风格化，避免了传统扩散方法的不稳定性。
2. **多视图一致性突出**：通过几何信息引导自注意力，从根本上解决了跨视角风格不一致的问题。
3. **训练效率高**：单张L20 GPU即可完成全部实验，资源需求相对可控。
4. **实验规模充分**：252组风格化实验覆盖场景级和物体级，评估维度全面。
5. **代码开源**：提供公开代码仓库，便于复现和后续研究。
6. **学术认可度高**：论文被**ICML 2026**接收。


## 八、不足与局限

1. **训练时长未披露**：论文未明确说明单次风格化的训练时间，难以评估实际应用中的效率。
2. **消融实验不够详尽**：在摘要材料中，对注意力感知损失各分量的独立贡献、几何感知掩码的边际增益等缺乏详细消融分析。
3. **场景类型有限**：仅使用8个场景，虽然来自多个数据集，但场景多样性和复杂度覆盖可能仍有不足。
4. **实时性未讨论**：作为3DGS方法，虽继承了3DGS的高效渲染优势，但风格化过程的实时性（如是否支持交互式风格化）未做明确说明。
5. **风格泛化性验证不足**：14种风格图像虽有一定规模，但对于极端风格（如抽象艺术、超现实主义等）的泛化能力有待进一步验证。


（完）
