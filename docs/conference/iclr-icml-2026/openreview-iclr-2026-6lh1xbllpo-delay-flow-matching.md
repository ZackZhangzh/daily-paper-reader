---
title: Delay Flow Matching
title_zh: 延迟流匹配
authors: "Bolin Zhao, Xiaoyu Zhang, Yuting Dong, Xin Lu, Wei Lin, Qunxi Zhu"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=6lH1XblLpo"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 基于延迟微分方程的流匹配框架
tldr: 标准流匹配基于常微分方程，无法建模轨迹交叉、延迟动力学及异质分布间传输，限制其真实现象建模能力。本文提出延迟流匹配（DFM），基于延迟微分方程框架，理论上证明其对连续传输映射的通用逼近能力。通过引入延迟项，DFM能保留分布间的耦合与结构信息，适用于更复杂的动力学过程。该扩展为流匹配家族增加了新的理论深度和应用广度。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准流匹配无法处理轨迹交叉、延迟动力学及异质分布传输。
method: 将流匹配扩展到延迟微分方程，引入延迟项。
result: 理论证明通用逼近能力，可建模更复杂传输过程。
conclusion: 延迟流匹配显著扩展了流匹配的建模能力。
---

## Abstract
Flow matching (FM) based on Ordinary Differential Equations (ODEs) has achieved significant success in generative tasks. However, it faces several inherent limitations, including an inability to model trajectory intersections, capture delay dynamics, and handle transfer between heterogeneous distributions. These limitations often result in a significant mismatch between the modeled transfer process and real-world phenomena, particularly when key coupling or inherent structural information between distributions must be preserved. To address these issues, we propose Delay Flow Matching (DFM), a new FM framework based on Delay Differential Equations (DDEs). Theoretically, we show that DFM possesses universal approximation capability for continuous transfer maps. By incorporating delay terms into the vector field, DFM enables trajectory intersections and better captures delay dynamics. Moreover, by designing appropriate initial functions, DFM ensures accurate transfer between heterogeneous distributions. Consequently, our framework preserves essential coupling relationships and achieves more flexible distribution transfer strategies. We validate DFM's effectiveness across synthetic datasets, single-cell data, and image-generation tasks.

---

## 论文详细总结（自动生成）

# 延迟流匹配（Delay Flow Matching）论文总结


## 一、论文的核心问题与整体含义

### 研究背景

流匹配（Flow Matching, FM）是近年来生成式建模领域的重要进展，它基于常微分方程（ODE）构建，通过对目标条件向量场的回归训练，实现了对连续生成模型参数化向量场的高效训练，避免了传统连续标准化流（CNF）需要大量数值积分的训练瓶颈。

### 核心问题

标准流匹配基于常微分方程，其固有性质带来了三个关键局限：

1. **无法建模轨迹交叉**：由于ODE解的唯一性，传统流匹配难以准确表示传输过程中存在轨迹相交的传输策略。
2. **无法刻画延迟动力学**：许多复杂系统的动力学行为受延迟反馈机制驱动，其未来演化不仅取决于当前状态，也取决于过去状态，传统流匹配缺乏对时滞效应的直接刻画能力。
3. **难以处理异质性分布间传输**：当初始分布与目标分布之间存在“一到多”或“多到多”的异质性关系时（如一种细胞分化为多种命运），ODE流映射的微分同胚性质使其难以稳定、精确地刻画这种传输策略。

这些局限性导致建模的传输过程与真实世界现象之间存在显著偏差，尤其是在需要保留分布间关键耦合或内在结构信息的场景中。

### 整体含义

本文提出**延迟流匹配（Delay Flow Matching, DFM）** ，将流匹配框架从常微分方程推广到**延迟微分方程（DDE）** ，从理论层面证明了其对连续传输映射的通用逼近能力，在多个任务上验证了有效性。该工作发表于ICLR 2026。


## 二、方法论

### 核心思想

DFM在参数化向量场中引入**时滞项**，将分布间的连续传输过程建模为**由时滞微分方程驱动的概率流**。换言之，样本在生成过程中的动力学行为不仅由当前状态决定，还会受到历史状态的影响，使模型能够利用历史信息刻画更复杂的传输策略。

### 四个关键模块

根据复旦大学实验室的官方介绍，DFM由以下四个模块组成：

1. **分布耦合**：利用最优传输（OT）、关键点引导的最优传输（KPG-OT）或独立耦合等策略，确定初始分布与目标分布之间的样本配对关系。
2. **传输路径构建**：根据任务特征，采用线性插值、测地线插值或三次样条插值等方式构建已配对样本间的传输路径。
3. **初始函数设计**：为每条传输路径设计适配的初始函数，使模型在生成过程初始阶段获得必要的历史信息。
4. **条件流匹配训练目标**：借鉴条件流匹配（CFM）思想，通过引入传输路径作为隐变量，将未知的目标边缘概率流分解为条件概率流的期望形式，构建可计算的回归训练目标。

### 两类典型形式

| 形式 | 初始函数 | 适用场景 |
|------|---------|---------|
| **DFM(C)** | 常值初始函数 | 轨迹相交、时滞动力学重构 |
| **DFM(D)** | 多样化初始函数（基于聚类为不同子集分配不同初始函数） | 分布异质性生成任务 |

### 理论贡献

研究团队证明了**引入单个时滞项并配备常值初始函数的DFM能够以任意精度逼近两个分布之间的任意连续传输映射**。这一理论结果证实了DFM相较基于ODE的FM具有更强的表示能力。


## 三、实验设计

### 数据集与场景

DFM在三个层面的任务上进行了验证：

1. **时滞系统动力学建模**：基于时序快照数据重构生物自调控系统的时滞动力学行为，测试模型的内插与外推预测能力。
2. **单细胞轨迹推断**：基于单细胞mRNA测序快照数据推断细胞分化轨迹，使用小鼠造血细胞数据集和心肌细胞数据集。
3. **图像生成**：
   - **MNIST**：半监督图像转换任务（手写数字 → 负片），存在轨迹交叉问题。
   - **CIFAR-10**：双组分高斯混合分布到图像分布的生成任务，具有显著分布异质性。

### 对比方法

- 单细胞轨迹推断任务中对比了**MIOFlow、TIGON**等基准方法以及标准CFM。
- 图像生成任务中对比了传统流匹配方法。

### 评估维度

除生成质量外，论文还系统评估了：
- 训练时间与推理时间
- 生成轨迹的曲率
- 不同离散步数（NFE）下的生成质量
- 时滞参数选取、初始函数构建方法、聚类数量等模块的鲁棒性（消融实验）


## 四、资源与算力

**论文原文及公开材料中未明确说明所使用的GPU型号、数量及训练时长等具体算力信息。**

仅能从公开信息中间接推断：
- 新闻稿提到DFM的“训练代价仅略高于流匹配”，但未给出具体数值。
- 图像生成实验在MNIST和CIFAR-10上进行，属于常规规模的生成模型实验。


## 五、实验数量与充分性

### 实验组数

从公开信息来看，论文至少包含以下实验：

1. **生物自调控系统**：时滞动力学重构（内插+外推预测）
2. **单细胞轨迹推断**：2个数据集（小鼠造血细胞 + 心肌细胞）× 4种以上对比方法
3. **图像生成**：2个数据集（MNIST + CIFAR-10）× 2种任务类型
4. **消融实验**：围绕时滞参数、初始函数构建方法、聚类数量等模块的系统性消融
5. **效率分析**：训练时间、推理时间、轨迹曲率、不同NFE下的生成质量对比

### 充分性评估

- **优点**：实验覆盖了合成数据、生物学真实数据和图像生成三类不同性质的任务，验证了DFM在不同场景下的有效性；消融实验和效率分析较为系统。
- **不足**：由于无法获取论文全文，以下方面难以评估：是否有标准化的定量指标（如FID、NLL等）；实验是否进行了多次重复以报告方差；超参数选择的合理性与敏感性分析的具体结果。


## 六、主要结论与发现

1. **理论层面**：DFM对连续传输映射具有通用逼近能力，证明了基于DDE的框架相较基于ODE的FM具有更强的表示能力。

2. **时滞动力学**：DFM(C)能够成功捕获生物自调控系统的阻尼振荡动力学行为并实现精确外推预测，而标准CFM完全无法建模该时滞动力学行为。

3. **单细胞轨迹推断**：DFM(D)通过为不同细胞命运构建不同初始函数，有效缓解了分化过程中异质性增强引发的奇点问题，保证推断轨迹始终约束在数据流形上，显著优于CFM及一系列基准方法。

4. **图像生成**：在MNIST轨迹交叉任务和CIFAR-10异质性分布生成任务上，DFM均优于传统FM，且在NFE较小时优势尤为显著。

5. **效率**：DFM训练代价仅略高于FM；在存在轨迹相交或分布异质性的场景下，DFM推理速度往往更快，因其生成的传输路径更接近“直线”形态。

6. **鲁棒性**：DFM对时滞参数、初始函数构建方法、聚类数量等模块的选取均具有出色的鲁棒性。


## 七、方法亮点

1. **理论创新**：首次将流匹配从ODE推广到DDE，并给出通用逼近性的理论保证，为流匹配家族增添了新的理论深度。

2. **问题覆盖全面**：同时解决了轨迹交叉、时滞动力学和异质性分布传输三个标准FM无法处理的核心问题。

3. **灵活的框架设计**：通过常值初始函数（DFM(C)）和多样化初始函数（DFM(D)）两类形式，适配不同类型的问题。

4. **理论与实证结合**：既有严格的通用逼近性理论证明，又在合成数据、生物学数据和图像数据上进行了充分验证。

5. **效率优势**：在复杂场景下推理速度更快，传输路径更接近直线。


## 八、不足与局限

1. **单时滞项限制**：当前DFM仅在参数化向量场中引入单个时滞项，其表达能力仍有拓展空间。

2. **未来方向未探索**：多时滞项、分布式时滞项的DFM及其相应的算法设计准则与理论基础尚待建立。

3. **量化关系不明**：时滞项数量、分布形式与模型表达能力之间的量化关系尚未深入分析。

4. **算力信息缺失**：论文未报告具体的GPU型号、数量及训练时长，不利于其他研究者复现时评估计算成本。

5. **大规模图像实验缺失**：图像生成实验仅在MNIST和CIFAR-10上进行，未在更高分辨率（如ImageNet）或更复杂的图像生成任务上验证。

6. **应用范围待扩展**：论文指出的潜在研究方向包括将DFM应用于更多科学问题，说明当前应用场景仍有局限。


（完）
