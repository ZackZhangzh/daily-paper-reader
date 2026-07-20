---
title: Flow Matching with Uncertainty Quantification and Guidance
title_zh: 具有不确定性量化与引导的流匹配
authors: "Juyeop Han, Lukas Lao Beyer, Sertac Karaman"
date: 2026-01-22
pdf: "https://openreview.net/pdf/89244632128383fccced2f21338484e844445d84.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 不确定性感知流匹配用于图像生成
tldr: 流匹配生成模型虽成功但样本质量不稳定，缺乏可靠性评估。本文提出不确定性感知流匹配（UA-Flow），在预测速度场的同时估计异方差不确定性，并通过传播速度不确定性得到每样本置信度。利用该信号，进一步设计不确定性感知的分类器引导与无分类器引导，以改善生成质量。图像生成实验表明不确定性信号与样本质量强相关，且引导策略能有效提升保真度与多样性。
source: ICML-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 流匹配生成样本质量不稳定，需要可靠性评估与引导机制。
method: 在流匹配中增加异方差不确定性预测，并利用不确定性进行生成引导。
result: 不确定性信号有效反映样本质量，引导策略提升生成效果。
conclusion: 不确定性感知可增强流匹配的实用性与可控性。
---

## Abstract
Despite the remarkable success of sampling-based generative models such as flow matching, they can still produce samples of inconsistent or degraded quality. To assess sample reliability and generate higher-quality outputs, we propose uncertainty-aware flow matching (UA-Flow), a lightweight extension of flow matching that predicts the velocity field together with heteroscedastic uncertainty. UA-Flow estimates per-sample uncertainty by propagating velocity uncertainty through the flow dynamics. These uncertainty estimates act as a reliability signal for individual samples, and we further use them to steer generation via uncertainty-aware classifier guidance and classifier-free guidance. Experiments on image generation show that UA-Flow produces uncertainty signals more highly correlated with sample fidelity than baseline methods, and that uncertainty-guided sampling further improves generation quality.

---

## 论文详细总结（自动生成）

# 具有不确定性量化与引导的流匹配（UA-Flow）论文总结

> 论文标题：Flow Matching with Uncertainty Quantification and Guidance  
> 作者：Juyeop Han, Lukas Lao Beyer, Sertac Karaman（MIT）  
> 状态：ICML 2026 Rejected（公开版本）  
> arXiv: 2602.10326v2


## 1. 核心问题与研究动机

流匹配（Flow Matching）作为一类采样式生成模型，在图像、视频生成等领域取得了显著成功。然而，这类模型仍会生成质量不一致或退化的样本，导致其在下游应用中的可靠性难以保证。

本文的核心问题在于：**如何为流匹配生成的每个样本提供可靠的质量评估信号，并利用该信号主动改善生成质量？**

研究动机来自两个层面的需求：其一，不确定性可作为评估单个样本质量或可靠性的原则性信号；其二，不确定性可在生成过程中被利用，通过引导式采样主动提升样本质量。基于此，作者提出了**不确定性感知流匹配（Uncertainty-Aware Flow Matching, UA-Flow）** ，旨在为流匹配模型赋予不确定性量化与引导生成的能力。


## 2. 方法论

### 2.1 核心思想

UA-Flow 是标准流匹配的轻量级扩展，核心思想是在预测速度场（velocity field）的同时，额外预测其**异方差不确定性**（heteroscedastic uncertainty），即每个位置、每个时刻的速度预测方差。随后，通过流动力学将速度不确定性传播到最终生成的样本，从而获得每个样本的逐像素不确定性估计。

### 2.2 关键技术细节

**（1）不确定性感知的条件流匹配**

UA-Flow 在标准条件流匹配目标的基础上，将神经网络输出扩展为均值与方差的双头结构：

- 预测速度场的均值 $\bar{u}_t^\theta(\mathbf{x}_t)$
- 预测速度场的方差 $(\sigma_t^\theta(\mathbf{x}_t))^2$

训练时采用带 $\beta$ 缩放的 NLL 损失（$\beta$-NLL loss），以在优化均值估计的同时稳定方差学习。

**（2）不确定性传播**

给定初始状态 $\mathbf{x}_0$ 从基分布 $p_0$ 采样，UA-Flow 通过以下方式传播均值和方差：

- **均值传播**：对速度场做线性化，采用确定性 ODE 推进均值 $\bar{\mathbf{x}}_t$
- **方差传播**：采用欧拉离散化近似，考虑速度预测噪声与状态-速度协方差的贡献

最终在终止时刻得到生成样本 $\bar{\mathbf{x}}_1$ 及其逐像素不确定性 $\mathrm{Var}[\mathbf{x}_1]$。

**（3）不确定性感知引导**

作者设计了两种利用不确定性信号的引导策略：

- **不确定性感知分类器引导（U-CG）** ：在分类器引导框架下，将不确定性作为额外的似然信号，引导采样轨迹向低不确定性区域移动
- **不确定性感知无分类器引导（U-CFG）** ：在 CFG 框架下，利用条件与无条件速度方差的强相关性，动态优化引导强度 $\lambda$，最小化外推速度的总预测方差


## 3. 实验设计

### 3.1 数据集与场景

实验在三个图像生成基准数据集上进行：

| 数据集 | 分辨率 | 任务类型 |
|--------|--------|----------|
| CIFAR-10 | 32×32 | 无条件生成 |
| ImageNet-128 | 128×128 | 类别条件生成 |
| ImageNet-256 | 256×256 | 类别条件生成 |

### 3.2 对比方法

不确定性估计的基线方法包括：

- **Vanilla**：标准流匹配（无不确定性）
- **AU**（Aleatoric Uncertainty）：异方差不确定性估计的基线
- **BayesDiff**：贝叶斯扩散模型的不确定性量化方法
- **GenUnc**：生成模型不确定性估计方法
- **UA-Flow + CLIP**：在 CLIP 嵌入空间中计算不确定性的变体

### 3.3 评估协议

作者采用**不确定性驱动的样本过滤**作为主要评估范式：
- 每个数据集生成 100k 张图像
- 按样本级不确定性排序，逐步移除排名前 10% 到 50% 的不确定样本
- 使用 FID、Precision、Recall 等指标评估过滤后的生成质量


## 4. 资源与算力

**论文中未明确说明使用的 GPU 型号、数量或训练时长**。从论文描述来看，UA-Flow 被定位为“轻量级扩展”（lightweight extension），且可以从预训练的流匹配模型进行微调，暗示其额外计算开销相对有限。但具体的硬件配置信息在文中付之阙如。


## 5. 实验数量与充分性

### 5.1 实验组数

从论文内容来看，实验覆盖了以下维度：

1. **三个数据集**上的不确定性估计与过滤实验（CIFAR-10、ImageNet-128、ImageNet-256）
2. **五种对比方法**的全面比较（Vanilla、AU、BayesDiff、GenUnc、UA-Flow+CLIP）
3. **不确定性感知引导**（U-CG 和 U-CFG）的有效性验证
4. **消融研究**：包括 CLIP 嵌入空间不确定性变体、不同 Monte Carlo 探针数量的影响、不确定性聚合策略（CVaR）等
5. **精度-召回率权衡分析**

### 5.2 充分性与公平性评价

**优点**：
- 对比方法选择合理，涵盖了该领域主要的基线方法
- 评估指标多元（FID、Precision、Recall），能较全面反映生成质量
- 过滤实验设计能直接验证不确定性信号与样本质量的相关性
- 在多个分辨率（32×32 到 256×256）上验证了方法的泛化性

**不足**：
- 实验仅覆盖图像生成任务，未在其他模态（如视频、音频、文本）或下游任务上验证
- 缺乏与更多近期流匹配不确定性量化方法的对比（如 2026 年出现的 VFD 等方法）
- 未提供统计显著性检验或多次运行的误差条


## 6. 主要结论与发现

1. **UA-Flow 产生的不确定性信号与样本保真度高度相关**：在不确定性驱动的样本过滤中，UA-Flow 相比 AU、BayesDiff、GenUnc 等基线方法表现出更强的相关性

2. **不确定性引导能有效提升生成质量**：U-CG 和 U-CFG 两种引导策略均能引导采样轨迹远离高不确定区域，从而改善生成样本的保真度

3. **过滤实验揭示了精度-召回率的权衡**：在 ImageNet 上，保真度提升超过多样性损失，FID 改善；而在 CIFAR-10 上（基线 FID 已经很低），精度提升无法抵消召回率损失

4. **UA-Flow 在 ImageNet 上优于逐像素基线**：相比 AU 和 BayesDiff，UA-Flow 在过滤后实现了更低的 FID 和更高的精度


## 7. 方法亮点

1. **轻量级扩展**：UA-Flow 无需改变流匹配的基本架构，可从预训练模型微调而来，实用性强

2. **端到端的不确定性传播**：通过流动力学从速度不确定性传播到样本不确定性，具有清晰的数学基础

3. **统一的不确定性利用框架**：同时支持分类器引导和无分类器引导两种范式，兼容性强

4. **方差传播的效率设计**：采用欧拉离散化而非高阶求解器，在精度与计算成本之间取得平衡

5. **新颖的 U-CFG 动态引导强度选择**：通过最小化外推速度的总预测方差来自适应调整 CFG 强度 $\lambda$，避免盲目选择


## 8. 不足与局限

1. **算力信息缺失**：未报告具体的 GPU 型号、数量或训练时长，不利于复现和成本评估

2. **实验覆盖范围有限**：仅在图像生成任务上验证，未拓展到视频生成、音频生成、科学计算等其他流匹配应用领域

3. **与最新方法对比不足**：作为 2026 年的工作，未与同期出现的其他流匹配不确定性量化方法（如 VFD、BSFM等）进行全面对比

4. **ICML 2026 拒稿状态**：虽然论文得分 8.0（较高），但最终被 ICML 2026 拒绝，可能暗示评审中仍存在未被充分解决的质疑点（如理论深度、实验说服力等）

5. **不确定性校准性未充分验证**：论文主要验证了不确定性排序与样本质量的相关性，但未系统评估不确定性估计本身的**校准性**（calibration）——即预测的不确定性是否在统计学意义上准确反映了真实误差

6. **应用场景局限**：论文仅讨论了样本过滤和引导生成，未探讨不确定性在其他实际场景（如异常检测、主动学习、风险敏感决策等）中的应用潜力

（完）
