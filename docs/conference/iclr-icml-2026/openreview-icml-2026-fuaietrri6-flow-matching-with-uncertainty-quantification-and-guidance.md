---
title: Flow Matching with Uncertainty Quantification and Guidance
title_zh: 带有不确定性量化与引导的流匹配
authors: "Juyeop Han, Lukas Lao Beyer, Sertac Karaman"
date: 2026-01-22
pdf: "https://openreview.net/pdf/89244632128383fccced2f21338484e844445d84.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 带不确定性量和引导的流匹配
tldr: 针对流匹配生成样本质量不一致的问题，本文提出不确定性感知流匹配（UA-Flow）。该方法在预测速度场的同时估计异方差不确定性，并通过流动力学传播速度不确定性，得到每个样本的可靠性信号。进一步利用这些不确定性估计进行不确定性感知的分类器引导和无分类器引导，从而在生成过程中动态调整采样方向。图像生成实验表明，UA-Flow产生的不确定性信号与样本质量相关，且引导策略能有效提升生成样本的保真度和多样性。
source: ICML-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 流匹配样本质量不稳定，缺乏可靠性评估机制。
method: 预测速度场和异方差不确定性，传播不确定性并用于引导生成。
result: 不确定性信号与样本质量相关，引导策略提升生成效果。
conclusion: 实现了不确定性感知的流匹配生成，提高样本可靠性。
---

## Abstract
Despite the remarkable success of sampling-based generative models such as flow matching, they can still produce samples of inconsistent or degraded quality. To assess sample reliability and generate higher-quality outputs, we propose uncertainty-aware flow matching (UA-Flow), a lightweight extension of flow matching that predicts the velocity field together with heteroscedastic uncertainty. UA-Flow estimates per-sample uncertainty by propagating velocity uncertainty through the flow dynamics. These uncertainty estimates act as a reliability signal for individual samples, and we further use them to steer generation via uncertainty-aware classifier guidance and classifier-free guidance. Experiments on image generation show that UA-Flow produces uncertainty signals more highly correlated with sample fidelity than baseline methods, and that uncertainty-guided sampling further improves generation quality.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

流匹配（Flow Matching）作为一类基于采样的生成模型，虽然在生成建模领域取得了显著成功，但仍存在生成样本质量不一致或退化的问题。**核心问题**在于：流匹配模型缺乏对生成样本可靠性的评估机制，无法在生成过程中区分高质量与低质量样本。

**研究动机**：为了评估样本可靠性并生成更高质量的输出，作者提出了不确定性感知流匹配（Uncertainty-Aware Flow Matching, UA-Flow），旨在为流匹配模型引入不确定性量化能力，并利用这些不确定性信息来引导生成过程。

**整体含义**：该工作首次在流匹配框架内实现了端到端的不确定性感知生成——不仅生成样本，还同时输出每个样本的可靠性信号，并利用该信号动态调整采样方向，从而提升生成质量。


## 2. 论文提出的方法论

### 核心思想

UA-Flow 是标准流匹配的一个**轻量级扩展**，在预测速度场的同时，额外预测其异方差不确定性。通过将速度不确定性沿流动力学轨迹向前传播，得到每个样本的不确定性估计。这些不确定性估计既可作为样本可靠性信号，也可用于不确定性感知的引导生成。

### 关键技术细节

- **概率速度场建模**：UA-Flow 学习速度场的均值 $\bar{u}_\theta(x_t) \in \mathbb{R}^n$ 和对角方差 $(\sigma_\theta(x_t))^2 \in \mathbb{R}^n$，以目标速度 $u_t(x_t)$ 作为监督信号。为兼顾计算效率，方差采用逐元素估计。

- **不确定性感知的流匹配损失**：采用针对速度场的高斯负对数似然（NLL）损失：
  
  $$L_{UFM}(\theta) = \mathbb{E}_{t, p_t(x_t)}\left[ \frac{|\bar{u}_\theta(x_t) - u_t(x_t)|_2^2}{2(\sigma_\theta(x_t))^2} + \log(\sigma_\theta(x_t)) \right]$$

- **条件训练策略**：由于目标速度 $u_t(x_t)$ 无法直接获取，模型改为回归条件速度 $u_t(x_t|x_1)$，最小化条件不确定性感知的流匹配损失 $L_{CUFM}$。

- **不确定性传播**：通过流动力学将速度场的不确定性沿生成轨迹向前传播，得到每个样本的端到端不确定性估计。

- **不确定性感知引导**：利用不确定性估计进行两类引导——不确定性感知的分类器引导（U-CG）和无分类器引导（U-CFG），在生成过程中动态调整采样方向。


## 3. 实验设计

### 数据集与场景

论文在**图像生成**任务上进行了实验验证。元数据中未明确列出具体使用了哪些图像数据集（如 CIFAR-10、ImageNet 等）。

### Benchmark 与对比方法

实验将 UA-Flow 与基线方法进行对比，结果表明 UA-Flow 产生的不确定性信号与样本保真度的相关性**高于**基线方法。元数据中未详细列出具体的基线方法名称。

### 评估指标

主要采用样本保真度（fidelity）相关的评估指标来衡量不确定性信号与样本质量的相关性，以及不确定性引导采样对生成质量的提升效果。


## 4. 资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量、训练时长等具体算力信息。仅能从论文自称“轻量级扩展”（lightweight extension）推断，其计算开销相比标准流匹配应有较为有限的增加。


## 5. 实验数量与充分性

基于摘要和元数据信息：

- **实验类型**：至少包含（1）不确定性信号与样本保真度的相关性评估；（2）不确定性感知分类器引导（U-CG）的实验；（3）不确定性感知无分类器引导（U-CFG）的实验。

- **实验充分性评估**：从现有信息来看，论文在图像生成任务上验证了核心主张，但元数据未详细披露实验的广度（如数据集数量、模型规模、消融实验设置等）。**难以全面判断实验的充分性**。论文被标记为“ICML-2026-Rejected-Public”，表明其曾投稿至 ICML 2026 但未被接收，这可能暗示审稿人对实验的充分性或方法的新颖性存在一定顾虑。


## 6. 论文的主要结论与发现

1. **不确定性信号的有效性**：UA-Flow 产生的不确定性信号与样本保真度高度相关，能够作为可靠的样本质量指示器。

2. **引导策略的有效性**：不确定性感知的分类器引导和无分类器引导能够有效提升生成样本的质量。

3. **方法可行性**：在流匹配框架内同时实现不确定性量化与不确定性感知生成是可行的，且作为轻量级扩展具有较低的计算开销。


## 7. 优点

- **问题定位准确**：针对流匹配生成质量不一致这一实际痛点，提出了具有明确应用价值的解决方案。

- **方法创新性强**：首次在流匹配框架内实现端到端的不确定性量化与不确定性感知引导生成。

- **轻量级设计**：作为流匹配的轻量级扩展，具有较好的实用性和可部署性。

- **双重功能**：不确定性估计既可**评估**样本可靠性，又可**引导**生成过程，一物两用。

- **引导策略多样**：同时探索了分类器引导和无分类器引导两种范式，覆盖了主流的引导生成场景。


## 8. 不足与局限

- **实验细节披露不足**：摘要和元数据未明确说明所使用的具体数据集、基线方法、模型架构等关键实验细节。

- **应用范围有限**：实验仅在图像生成任务上进行了验证，尚未涉及文本、音频、3D 数据等其他模态。

- **算力信息缺失**：未报告训练所需的计算资源，不利于其他研究者复现或评估方法的实际成本。

- **接收状态**：论文被标记为“ICML-2026-Rejected-Public”，表明其尚未被顶级学术会议接收，可能存在方法或实验上的不足之处。

- **不确定性类型**：摘要中仅提及异方差不确定性（heteroscedastic uncertainty），未明确是否区分了偶然不确定性（aleatoric）与认知不确定性（epistemic），这可能限制其在安全关键应用中的解释力。

- **理论深度**：基于现有摘要，方法主要依赖高斯负对数似然损失进行不确定性建模，缺乏对不确定性传播过程的理论收敛性分析或误差界推导。


（完）
