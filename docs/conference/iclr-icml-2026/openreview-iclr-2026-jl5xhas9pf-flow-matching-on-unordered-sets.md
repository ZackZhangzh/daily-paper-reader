---
title: Flow Matching on Unordered Sets
title_zh: 无序集上的流匹配
authors: "Yangming Li, Chaoyu Liu, Carola-Bibiane Schönlieb"
date: 2025-09-15
pdf: "https://openreview.net/pdf?id=jL5XhAS9pf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 流匹配用于无序点集生成
tldr: 针对现有点生成模型大多依赖向量数据顺序的问题，提出无序流（Unordered Flow），通过提升变换将无序点集转化为函数表示，并利用函数值流匹配学习概率测度，再结合粒子滤波和Langevin动力学实现逆映射，从而生成高质量的无序点集，拓展了流匹配在点云生成中的应用。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有流匹配模型主要针对向量数据，无法直接处理无序点集。
method: 将无序数据提升为函数表示，进行函数值流匹配，并用粒子滤波逆映射。
result: 可有效生成无序点集，拓展流匹配到点云生成任务。
conclusion: 无序流为点集生成提供了新的生成模型范式。
---

## Abstract
Flow matching has achieved promising performance across a broad spectrum of data modalities (e.g., image and text). However, there are few works exploring their extension to unordered point sets. Indeed, previous generative models are mostly designed for vector data, with a natural ordering along dimensions.  In this paper, we present unordered flow, a type of flow-based generative model for generating point sets. Specifically, we propose a lifting approach where we convert unordered data into an appropriate function representation, and learn the probability measure of such representations through function-valued flow matching. For the inverse map from a function representation to unordered data, we introduce a particle filtering method that first warms up the initial particles with Langevin dynamics and then updates them until convergence through gradient-based search. We have conducted extensive experiments on multiple real-world datasets, showing that our unordered flow model is highly effective in generating set-structured data and significantly outperforms previous baselines.

---

## 论文详细总结（自动生成）

# 论文总结：《Flow Matching on Unordered Sets》（无序集上的流匹配）


## 1. 核心问题与整体含义（研究动机和背景）

**研究问题**：现有的流匹配（Flow Matching）模型在图像、文本、音频、视频等多种数据模态上取得了优异表现，但这些模型本质上是为**具有自然维度顺序的向量数据**设计的。然而，现实世界中大量数据本质上是**无序的集合结构数据**（如点云、地震事件序列、时空事件数据等），现有流匹配框架无法直接处理这类数据。

**动机**：
- 传统处理无序数据的方法（如点过程模型——泊松过程、霍克斯过程）虽然具有可解释性，但需要显式建模强度函数，参数化灵活性不足，存在性能瓶颈。
- 后续虽有工作尝试将GAN、能量模型、正态化流等深度生成模型应用于无序数据，但都需要额外的架构适配。
- 将流匹配扩展到无序集合的研究非常有限，近期虽有工作尝试用扩散过程模拟点的增减，但仍缺乏系统性解决方案。

**本文贡献**：提出**无序流（Unordered Flow）** ，一种置换不变（permutation-invariant）的流式生成模型，专门用于无序点集的生成，填补了流匹配在集合结构数据生成领域的空白。


## 2. 方法论：核心思想与关键技术

### 2.1 核心思想：提升变换（Lifting Approach）

无序流的核心思路是：**将无序数据“提升”为适当的函数表示，在函数空间上学习概率测度，再通过逆映射还原为无序点集**。

具体而言，无序点集 $X = \{x_1, x_2, ..., x_N\}$ 被转换为一个**混合高斯函数表示**：

$$f_{X,\epsilon}(z) = \frac{1}{N} \sum_{i=1}^{N} \mathcal{G}(z; x_i, \epsilon^2 I)$$

即以每个点 $x_i$ 为中心的高斯分布的混合。这一转换将无序集合映射到 $L^2$ 函数空间中的一个点，从而将无序数据生成问题转化为函数空间中的分布学习问题。

### 2.2 自适应方差机制

为处理点之间距离过近时单个高斯分布无法良好近似离散狄拉克函数的奇异性问题，模型引入了**自适应方差**策略：

$$\sigma_i(\epsilon) = \epsilon \cdot \ln\left(1 + \min_{j \neq i} \|x_i - x_j\|^2\right)$$

该机制确保相近的点具有较小的方差，从而减少彼此之间的干扰，增强模型的表达能力。

### 2.3 函数值流匹配（Function-Valued Flow Matching）

在得到函数表示后，模型在 $L^2$ 函数空间上定义流匹配过程。定义参数化的**函数值向量场** $u_{\theta,t}: H_{L^2} \to H_{L^2}$（由神经网络参数化），通过一阶常微分方程（ODE）生成流：

$$\frac{d}{dt}[\phi_t(h)] = u_{\theta,t}(\phi_t(h)), \quad \phi_0 = \text{Id}$$

流匹配的核心目标是让推前操作 $(\phi_t)_\#$ 在时间步长间插值高斯测度与目标测度。训练目标是最小化参数化向量场与条件目标向量场之间的均方误差（类似于标准流匹配的回归目标）。

### 2.4 逆映射：粒子滤波 + Langevin动力学 + 梯度搜索

从生成的函数表示 $f_*$ 还原为无序点集 $X$ 是关键的逆映射步骤。本文提出了一种**类粒子滤波方法**：

1. **初始化**：随机初始化一组粒子；
2. **预热（Warm-up）** ：使用**Langevin动力学**（引入随机噪声）加速粒子采样，使粒子快速移动到高概率区域；
3. **收敛**：通过**基于梯度的搜索**迭代更新粒子位置，直到收敛到密度峰值。

最终得到的粒子集合即为生成的无序点集。


## 3. 实验设计

### 3.1 数据集与场景

本文使用了**多种真实世界数据集和合成数据集**进行验证：

- **真实数据集**：
  - 日本地震数据
  - COVID-19病例数据
  - 新泽西州Citibike取还车数据
- **合成数据集**：
  - 非均匀泊松过程
  - 霍克斯过程

### 3.2 对比基准（Benchmark）

本文与多种基准模型进行了对比，包括传统的点过程模型以及基于深度生成模型的方法。评估指标使用了**Wasserstein距离（S-WStein）** 和**最大均值差异（D-MMD）** ，在这些指标上无序流模型均低于其他对比模型（即生成质量更好）。


## 4. 资源与算力

**论文原文中未明确说明使用的GPU型号、数量及训练时长等算力信息**。这是本文在实验报告方面的一个信息缺口。


## 5. 实验数量与充分性

**实验组数与覆盖度**：
- 本文在**多个（multiple）真实世界数据集**上进行了验证，涵盖地震、流行病、共享出行等不同应用场景；
- 同时使用了**多种合成数据**（非均匀泊松过程、霍克斯过程）进行测试；
- 与**多个基准模型**进行了对比。

**充分性与客观性评估**：
- 实验覆盖了真实数据和合成数据两个维度，场景多样性较好；
- 使用了Wasserstein距离和MMD两种主流分布距离度量，评估较为客观；
- **不足之处**：用户提供的材料中未明确提及是否进行了**消融实验**（如对自适应方差、粒子滤波各组件的作用分析）、**超参数敏感性分析**等，因此无法全面评估实验的充分性。此外，论文被标记为“ICLR-2026-Rejected-Public”，表明该工作可能在审稿过程中被认为存在某些不足。


## 6. 主要结论与发现

1. **无序流模型能够有效生成集合结构数据**，在多个真实数据集上显著优于此前的方法；
2. **“提升为函数表示 + 函数值流匹配 + 粒子滤波逆映射”这一技术路线是可行的**，为流匹配处理无序数据提供了一种新的范式；
3. 在Wasserstein距离和MMD等生成质量指标上，无序流均优于对比基准。


## 7. 方法亮点与优势

1. **问题定位精准**：首次系统性地将流匹配扩展到无序点集生成，填补了该方向的研究空白；
2. **方法论创新性强**：通过“提升变换”将离散无序数据转化为连续函数表示，巧妙地将集合生成问题转化为函数空间中的分布学习问题，避免了直接处理置换不变性的架构难题；
3. **逆映射设计精巧**：结合Langevin动力学预热和梯度搜索的粒子滤波方法，有效实现了从函数空间到数据空间的还原；
4. **模型置换不变性**：通过函数表示天然保证了模型对输入顺序的不敏感性；
5. **实验验证多场景**：涵盖地震、流行病、交通等多个真实应用领域，证明了方法的通用性。


## 8. 不足与局限

1. **算力信息缺失**：未报告训练所需的GPU型号、数量、训练时长等关键资源信息，影响可复现性评估；
2. **消融实验不明**：从提供的材料中无法确认是否进行了充分的消融实验来分析各组件的独立贡献；
3. **应用场景限制**：方法目前主要验证于点云/空间点集类数据，对于更一般的集合结构（如集合元素具有复杂内部结构、集合大小高度可变等）的泛化能力尚不明确；
4. **效率问题**：粒子滤波逆映射涉及迭代优化过程，可能带来较高的推理计算成本，论文未对此进行充分讨论；
5. **论文状态**：该论文被标记为“ICLR-2026-Rejected-Public”，表明其可能未被顶级会议接收，存在审稿人指出的潜在缺陷（具体缺陷内容需参考完整审稿意见）。


（完）
