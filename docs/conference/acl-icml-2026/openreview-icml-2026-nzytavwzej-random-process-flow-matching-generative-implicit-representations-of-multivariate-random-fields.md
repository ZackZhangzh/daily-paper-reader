---
title: "Random Process Flow Matching: Generative Implicit Representations of Multivariate Random Fields"
title_zh: 随机过程流匹配：多变量随机场的生成隐式表示
authors: "Julien Lalanne, David Picard, Lionel Boillot, Lina-María GUAYACÁN-CARRILLO, Leon Barens, Jean-Michel Pereira"
date: 2026-04-30
pdf: "https://openreview.net/pdf/2c754e61c3a06fcb6d38a35fe12ea7bced88a1d7.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 流匹配用于生成隐式表示
tldr: 针对传统生成模型需要大量数据且难以处理稀疏观测随机场的问题，本文提出随机过程流匹配，将向量场建模为神经隐式函数，利用随机傅里叶特征从有限观测中学习可任意查询的隐式表示，扩展了流匹配在连续概率路径生成中的应用。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有生成模型难以从稀疏观测中学习随机场分布。
method: 基于流匹配框架，用神经隐式函数表示向量场，结合随机傅里叶特征。
result: 能从少量观测生成任意位置的隐式表示。
conclusion: 流匹配可有效用于多变量随机场的生成建模。
---

## Abstract
Generative modeling provides a powerful framework for learning data distributions. These models initially relied on probabilistic methods such as Gaussian Processes (GP) for uncertainty-aware predictions and shifted towards larger trainable models to learn more complex distributions. In this work, we introduce *Random Process (RP) Flow*, a Flow Matching-based framework that represents the vector field as a neural implicit function. Unlike modern generative methods, our setting involves a single observed field, from which only sparse measurements are available. RP Flow uses Random Fourier Features to learn an implicit signal representation that can be queried at any arbitrary location from a limited set of observations, while encoding uncertainty through ensemble sampling. We propose constructing a Bayesian posterior by GP regression in the source space to generate high-quality samples. Our empirical results demonstrate that this framework generates realistic samples along with calibrated uncertainty estimates, even under challenging conditions such as high frequency, high sparsity, or high dimensionality. These findings position RP Flow as a milestone towards generative models for reconstruction tasks where data is scarce and uncertainty must remain traceable.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究动机：** 传统生成模型（如扩散模型、基于分数的模型）在图像、视频、音频等高维领域取得了巨大成功，但其成功依赖于大量训练数据。然而在许多实际场景（如地震成像、地质统计）中，研究者往往只能获取**单一观测场**且**测量点极其稀疏**的数据。同时，这些应用不仅需要高质量的重建结果，还要求模型能够提供**可追溯的不确定性估计**。

**核心问题：** 如何在仅有单一稀疏观测场的情况下，学习多变量随机场的分布，并同时生成可任意位置查询的隐式表示与校准的不确定性估计。

**整体含义：** 本文提出 **Random Process (RP) Flow** 框架，将流匹配（Flow Matching）拓展到随机过程的生成建模，为数据稀缺场景下的重建任务提供了一种兼具生成能力与不确定性量化能力的新范式。

---

## 2. 方法论

### 核心思想

RP Flow 将信号建模为**随机场的实现**，利用条件流匹配（Conditional Flow Matching, CFM）框架学习从源随机过程到目标随机过程的传输映射，其中空间关系通过**神经隐式函数（Implicit Neural Representation, INR）**建模。

### 关键技术细节

**（1）条件流匹配（CFM）框架**

CFM 训练一个参数化速度场 $v_\theta(z, t)$，使其将源分布 $p_0$ 沿概率路径传输到目标分布 $p_1$。训练目标是最小化模型预测速度场与真实条件速度场之间的期望平方误差：

$$\mathcal{L}_{CFM}(\theta) = \mathbb{E}_{t \sim \mathcal{U}[0,1], z \sim p(z|t,c)} \left\| v_\theta(z,t) - v_t^{\text{cond}}(z,c) \right\|^2$$

**（2）隐式源表示**

源过程 $\xi$ 被建模为零均值高斯过程，其边缘分布为标准高斯分布。为捕捉信号的空间结构，RP Flow 使用**随机傅里叶特征（Random Fourier Features, RFFs）**将空间位置 $x$ 嵌入高维特征空间：

$$\gamma(x) = [\cos(Bx), \sin(Bx)]^T, \quad B \sim \mathcal{N}(0, \sigma_{RFF}^2 I_m)$$

RFFs 近似高斯核，使模型能够捕捉信号的细粒度变化和非局部依赖关系。

**（3）后验构建（关键创新）**

由于学到的传输映射 $T_\theta$ 是微分同胚（diffeomorphism），可通过反向 ODE 积分得到其逆映射 $T_\theta^{-1}$。RP Flow 利用源空间的高斯性质构建后验：

1. 将目标观测 $Z(\bar{\mathcal{X}}, \omega_0)$ 反向传输到源域，得到源观测 $\xi(\bar{\mathcal{X}}, \omega_0)$
2. 在源空间中基于这些观测构建后验高斯过程 $\xi^{\text{post}}$
3. 将后验源过程的实现通过 $T_\theta$ 前向传输，得到后验目标过程 $\hat{Z}^{\text{post}}$

该方法具有**无偏性保证**：在观测点处，后验目标过程与原始观测数据一致。

**（4）计算效率优化**

在多变量情况下，由于源变量之间的独立性，可以为每个变量独立计算后验 GP，将计算复杂度从 $O((nN)^3)$ 降低到 $O(nN^3)$。

---

## 3. 实验设计

### 数据集与场景

论文在两类空间插值任务上评估 RP Flow：

| 任务 | 数据集 | 特点 |
|------|--------|------|
| 图像回归 | Div2K 数据集 | 验证方法生成高质量场与校准不确定性的能力 |
| 地震数据插值 | 未明确命名的高维地震数据 | 验证高维、高稀疏度、结构复杂场景下的性能 |

### Benchmark 与对比方法

对比方法涵盖 INR 类与贝叶斯类基线：

- **RFF Network**（随机傅里叶特征网络）
- **SIREN Network**（周期性激活函数网络）
- **GP Regressor（无噪声版）**——最大化 PSNR
- **GP Regressor（校准版）**——通过加性噪声最小化 PCE
- **Deep Gaussian Process**

### 评估指标

- **重建质量**：PSNR（峰值信噪比）、SSIM（结构相似性指标）
- **样本质量**：Wasserstein 距离（$\mathcal{W}_1$）
- **不确定性校准**：概率校准误差 PCE（Probabilistic Calibration Error）

---

## 4. 资源与算力

**论文未明确说明**所使用的 GPU 型号、数量或训练时长。从论文内容来看，RP Flow 的训练涉及：
- 神经隐式函数（INR）的参数优化
- 流匹配 ODE 的数值积分
- 后验高斯过程的推断

但具体的算力配置未在提供的文本中提及。

---

## 5. 实验数量与充分性

### 实验设置

论文进行了**两组主要实验**（图像回归 + 地震数据插值），对比了**5种基线方法**，并使用**4种评估指标**（PSNR、SSIM、$\mathcal{W}_1$、PCE）。

### 充分性评估

- **优势**：实验覆盖了从低维图像到高维地震数据的跨任务验证，场景选择具有代表性（图像回归验证基础能力，地震插值验证极端稀疏条件下的鲁棒性）。
- **局限**：从提供的摘要来看，论文未明确提及消融实验（如 RFF 特征维度的影响、不同源过程选择的影响等），也未说明是否在多个数据集上进行了重复实验以验证统计显著性。实验数量的充分性有待完整论文进一步确认。

---

## 6. 主要结论与发现

1. **RP Flow 能够从单一稀疏观测中生成高质量的隐式表示**，可在任意位置进行查询。

2. **框架能同时提供校准的不确定性估计**，即使在高频、高稀疏度或高维度的挑战性条件下依然有效。

3. **后验构建方法具有无偏性保证**，在观测点处与原始数据严格一致。

4. **源空间的 GP 回归策略显著降低了计算复杂度**，从 $O((nN)^3)$ 降至 $O(nN^3)$。

5. **理论分析表明**传输映射保持了源过程的**正则性**（连续性与可微性），并为统计量的**蒙特卡洛估计提供了收敛速率保证**。

---

## 7. 优点

1. **问题设定新颖且实用**：针对"单一观测场 + 稀疏采样"这一极具挑战性但实际中广泛存在的场景，填补了现有生成模型在该设定下的空白。

2. **流匹配与隐式神经表示的创新结合**：将 CFM 框架拓展到随机过程层面，用 INR 建模空间关系，实现了任意位置的可查询生成。

3. **优雅的不确定性量化机制**：通过集成采样（ensemble sampling）和源空间 GP 后验构建，实现了校准的不确定性估计。

4. **理论保障充分**：提供了无偏性证明（Proposition 3.1）、正则性保持定理（Theorem 3.3）和矩界限定理（Theorem 3.4），为方法的可靠性提供了数学支撑。

5. **计算效率优化**：利用源变量的独立性，将多变量后验 GP 的计算复杂度从 $O((nN)^3)$ 降至 $O(nN^3)$，具有实际应用价值。

6. **应用前景广阔**：被明确指出可用于地震插值等工业应用，具有实际落地潜力。

---

## 8. 不足与局限

1. **实验覆盖有限**：从摘要来看，论文仅进行了两组实验（图像 + 地震数据），缺乏更广泛的模态验证（如音频、三维体积数据等）。

2. **消融研究缺失**：未明确提及对关键设计选择（如 RFF 参数 $\sigma_{RFF}$、源过程核函数选择、网络架构等）的系统性消融分析。

3. **Lipschitz 常数的潜在问题**：论文自身指出，若无法控制 Lipschitz 常数 $L$，矩界限可能仍然较大，这在实际应用中可能影响不确定性估计的紧致性。

4. **算力信息缺失**：未提供训练所需的计算资源信息，不利于其他研究者复现或评估方法的可扩展性。

5. **多变量扩展的实际复杂性**：虽然理论上一维分解降低了复杂度，但实际中 $n$（变量数）较大时，$O(nN^3)$ 仍可能构成计算瓶颈。

6. **应用领域的局限性**：方法主要针对空间插值/重建任务，对于完全 unconditional 的生成（如图像从头生成）是否适用尚不明确。

---

（完）
