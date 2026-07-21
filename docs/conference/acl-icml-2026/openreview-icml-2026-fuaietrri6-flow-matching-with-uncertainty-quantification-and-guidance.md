---
title: Flow Matching with Uncertainty Quantification and Guidance
title_zh: 带不确定性量化与引导的流匹配
authors: "Juyeop Han, Lukas Lao Beyer, Sertac Karaman"
date: 2026-01-22
pdf: "https://openreview.net/pdf/89244632128383fccced2f21338484e844445d84.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 不确定性感知流匹配用于生成式建模
tldr: 针对流匹配生成模型采样质量不一致的问题，提出不确定性感知流匹配（UA-Flow），通过预测速度场及其异方差不确定性并沿流传播，获得每个样本的可靠性信号，进而利用不确定性指导分类器引导和无分类器引导生成，在图像生成实验中展示了有效的质量提升。
source: ICML-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 流匹配生成样本质量不稳定，缺乏可靠性评估。
method: 预测速度场同时估计异方差不确定性，并用于引导生成。
result: 生成图像质量提升，不确定性信号有效。
conclusion: 不确定性感知流匹配可提升生成可靠性和质量。
---

## Abstract
Despite the remarkable success of sampling-based generative models such as flow matching, they can still produce samples of inconsistent or degraded quality. To assess sample reliability and generate higher-quality outputs, we propose uncertainty-aware flow matching (UA-Flow), a lightweight extension of flow matching that predicts the velocity field together with heteroscedastic uncertainty. UA-Flow estimates per-sample uncertainty by propagating velocity uncertainty through the flow dynamics. These uncertainty estimates act as a reliability signal for individual samples, and we further use them to steer generation via uncertainty-aware classifier guidance and classifier-free guidance. Experiments on image generation show that UA-Flow produces uncertainty signals more highly correlated with sample fidelity than baseline methods, and that uncertainty-guided sampling further improves generation quality.

---

## 论文详细总结（自动生成）

# 带不确定性量化与引导的流匹配（UA-Flow）论文分析总结

## 1. 核心问题与整体含义（研究动机与背景）

流匹配（Flow Matching）作为一类基于采样的生成模型，在图像生成等任务上取得了显著成功，但其生成样本的质量存在不一致性——部分样本质量高，部分样本质量低或退化。这一问题源于流匹配模型本身缺乏对生成样本可靠性的评估机制：模型无法判断当前采样路径是否可靠，也无法在采样过程中主动规避低质量结果。

针对这一痛点，本文提出**不确定性感知流匹配（Uncertainty-Aware Flow Matching, UA-Flow）** ，核心思路是在流匹配的训练和推理过程中引入**异方差不确定性（heteroscedastic uncertainty）** 的估计与传播。通过为每个生成样本赋予一个可靠性信号，UA-Flow不仅能够评估样本质量，还能利用这一信号反向引导生成过程，从而提升整体生成质量。该工作属于生成式建模中“不确定性量化+可控生成”的交叉方向，目标是让流匹配模型同时具备“生成能力”和“自我评估能力”。


## 2. 方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

UA-Flow是标准流匹配的**轻量级扩展**，其在预测速度场（velocity field）的同时，额外预测一个异方差不确定性。该不确定性通过流动力学（flow dynamics）从速度场传播至最终样本，形成每个样本的可靠性信号。进一步地，这一信号被用于**不确定性感知的分类器引导（Uncertainty-aware Classifier Guidance, U-CG）** 和**不确定性感知的无分类器引导（Uncertainty-aware Classifier-Free Guidance, U-CFG）** ，在采样过程中动态调整生成轨迹。

### 2.2 关键技术细节

**（1）概率速度场建模**

UA-Flow学习速度场的均值 $\bar{u}_\theta(x_t) \in \mathbb{R}^n$ 和对角方差 $(\sigma_\theta(x_t))^2 \in \mathbb{R}^n$，以目标速度 $u_t(x_t)$ 作为监督信号。方差采用逐元素估计，以兼顾计算效率和表示简洁性。

**（2）不确定性感知的流匹配损失**

标准流匹配采用均方误差（MSE）作为损失函数，而UA-Flow将其替换为**针对速度场的高斯负对数似然（NLL）损失**：

$$L_{UFM}(\theta) = \mathbb{E}_{t, p_t(x_t)} \left[ \frac{|\bar{u}_\theta(x_t) - u_t(x_t)|_2^2}{2(\sigma_\theta(x_t))^2} + \log(\sigma_\theta(x_t)) \right]$$

该损失函数的设计包含两项：第一项是加权后的速度预测误差（不确定性越大，权重越低），第二项是正则化项，防止不确定性无限增大。

**（3）条件化训练**

由于目标速度 $u_t(x_t)$ 无法直接获取，训练时模型改为回归条件速度 $u_t(x_t|x_1)$。UA-Flow最小化**条件不确定性感知的流匹配损失** $L_{CUFM}$：

$$L_{CUFM}(\theta) = \mathbb{E}_{t, p_1(x_1), p_t(x_t|x_1)} \left[ \frac{U_t(x_t, x_1)^2}{2(\sigma_\theta(x_t))^2} + \frac{|\bar{u}_\theta(x_t) - u_t(x_t|x_1)|_2^2}{2(\sigma_\theta(x_t))^2} + \log(\sigma_\theta(x_t)) \right]$$

其中 $U_t(x_t, x_1) := \hat{u}_t(x_t)^2 - u_t(x_t|x_1)^2$ 是一个校正项，$\hat{u}_t(x_t)$ 通过重加权mini-batch计算得到。

### 2.3 算法流程

1. **训练阶段**：在标准流匹配训练框架基础上，修改损失函数为 $L_{CUFM}$，使模型同时输出速度均值和对角方差；
2. **不确定性传播**：给定一个采样起点（通常为高斯噪声），沿常微分方程（ODE）轨迹向前传播速度不确定性，得到最终样本的不确定性估计；
3. **不确定性引导采样**：在采样过程中，利用估计的不确定性信号调整生成方向——不确定性感知的分类器引导（U-CG）和无分类器引导（U-CFG）两种策略均可采用。


## 3. 实验设计

### 3.1 数据集与场景

论文在**图像生成（image generation）** 任务上开展实验。但摘要和元数据中**未明确说明具体使用了哪些数据集**（如CIFAR-10、ImageNet、CelebA等）。

### 3.2 对比方法（Baseline）

论文对比了多种基线方法（baseline methods），主要对比维度是**不确定性信号与样本保真度（sample fidelity）之间的相关性**。具体对比了哪些不确定性量化方法，摘要中未逐一列出提到了若干相关工作的不确定性估计方法（如扩散模型中的像素级任意不确定性估计、BayesDiff等），可能作为对比基线。

### 3.3 评估指标

主要评估指标包括：
- **不确定性-保真度相关性**：UA-Flow产生的不确定性信号与样本保真度之间的相关性高于基线方法；
- **FID分数（Fréchet Inception Distance）** ：不确定性引导的采样进一步改善了FID分数。


## 4. 资源与算力

**论文中未明确说明**所使用的GPU型号、数量、训练时长等算力信息。从“轻量级扩展（lightweight extension）”的表述来看，UA-Flow相比标准流匹配的额外计算开销应该较小，但具体资源消耗数据在可获取的文本中未提及。


## 5. 实验数量与充分性

### 5.1 实验组数

从可获取的信息来看，论文至少包含以下实验：
- **不确定性估计的有效性验证**：对比UA-Flow与基线方法在不确定性-保真度相关性上的表现；
- **不确定性引导采样的效果验证**：对比有/无不确定性引导的生成质量（FID分数）；
- **两种引导策略的对比**：不确定性感知分类器引导（U-CG）与无分类器引导（U-CFG）。

### 5.2 充分性与客观性评价

- **充分性方面**：实验覆盖了“不确定性估计质量”和“引导采样效果”两个核心维度，基本能够支撑论文的核心主张。但受限于可获取信息，**消融实验（ablation study）的具体设计未知**，例如是否对比了不同的不确定性传播方式、不同的损失函数设计等。
- **客观性与公平性**：FID是生成模型领域的标准评估指标，具有较好的客观性；与基线方法的对比也采用了统一的评估框架。但**由于未明确说明数据集和基线方法的具体名单**，难以对实验的公平性做更深入的判断。


## 6. 主要结论与发现

1. **不确定性估计的有效性**：UA-Flow产生的不确定性信号与样本保真度之间的相关性高于基线方法，说明该方法能够有效区分高质量与低质量样本；
2. **引导采样的增益**：利用不确定性信号进行引导采样（无论是U-CG还是U-CFG）能够进一步改善生成质量（FID分数提升）；
3. **方法的轻量性**：UA-Flow作为流匹配的轻量级扩展，在增加少量计算开销的前提下实现了生成可靠性和质量的双重提升。


## 7. 优点（方法与实验设计的亮点）

| 维度 | 亮点说明 |
|------|----------|
| **问题定位精准** | 直面流匹配生成质量不一致这一实际问题，具有明确的实用价值 |
| **方法简洁有效** | 在标准流匹配基础上增加异方差不确定性预测，改动小、扩展性好，属于“轻量级”方案 |
| **不确定性双重用途** | 不确定性信号既可作**评估指标**（判断样本可靠性），又可作**控制信号**（引导生成），一物两用 |
| **引导策略多样** | 同时支持分类器引导和无分类器引导两种范式，适用范围广 |
| **理论框架完整** | 从概率速度场建模到条件化损失函数的设计，有较为完整的数学推导 |


## 8. 不足与局限

| 维度 | 不足说明 |
|------|----------|
| **实验覆盖范围有限** | 目前仅在图像生成任务上进行了验证，未涉及文本生成、音频生成、3D生成等其他模态，泛化能力未知 |
| **数据集信息缺失** | 摘要和元数据中未明确说明具体使用的数据集，影响实验的可复现性和可比性 |
| **算力信息缺失** | 未报告GPU型号、数量、训练时长等，不利于他人评估方法的资源需求 |
| **对比基线不够透明** | 未详细列出所有对比的基线方法名称和具体实现 |
| **消融实验未知** | 缺乏对方法各组件（如损失函数设计、不确定性传播方式等）的系统性消融分析 |
| **应用场景局限** | 不确定性引导的生成目前仅在“提升图像质量”这一单一目标上验证，尚未探索其在**不确定性敏感场景**（如医疗影像、自动驾驶）中的潜在价值 |
| **理论分析深度** | 对于不确定性估计的**校准性（calibration）** ——即预测不确定性是否准确反映真实误差——缺乏深入的理论保证或实验验证 |


**（完）**
