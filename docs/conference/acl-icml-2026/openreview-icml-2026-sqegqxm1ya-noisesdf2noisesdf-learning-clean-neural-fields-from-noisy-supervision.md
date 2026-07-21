---
title: "NoiseSDF2NoiseSDF: Learning Clean Neural Fields from Noisy Supervision"
title_zh: NoiseSDF2NoiseSDF：从噪声监督学习清洁神经场
authors: "Tengkai Wang, Weihao Li, Ruikai Cui, Shi Qiu, Nick Barnes"
date: 2026-04-30
pdf: "https://openreview.net/pdf/69d569bdcf9971a7078f0ddb23fc834d7e8c7e47.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 从噪声点云学习清洁神经SDF的隐式神经表示
tldr: 针对低质量扫描设备获取的点云含噪导致表面重建不准确的问题，将二维Noise2Noise范式扩展到三维神经场，提出NoiseSDF2NoiseSDF方法，通过最小化噪声SDF表示之间的MSE损失，从含噪点云中学习清洁的隐式SDF，实现神经网络的隐式去噪和表面精化。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 低质量点云噪声严重，传统监督学习难以获得准确隐式表面。
method: 扩展Noise2Noise至3D神经场，用噪声SDF之间的MSE损失训练网络隐式去噪。
result: 在ShapeNet等基准上验证了有效去噪和表面重建精度提升。
conclusion: 噪声SDF自监督可有效学习清洁隐式表示。
---

## Abstract
Reconstructing accurate implicit surface representations from point clouds remains a challenging task, particularly when data is captured using low-quality scanning devices. These point clouds often contain substantial noise, leading to inaccurate surface reconstructions. Inspired by the Noise2Noise paradigm for 2D images, we introduce NoiseSDF2NoiseSDF, a novel method designed to extend this concept to 3D neural fields. Our approach enables learning clean neural SDFs from noisy point clouds through noisy supervision by minimizing the MSE loss between noisy SDF representations, allowing the network to implicitly denoise and refine surface estimations. We evaluate the effectiveness of NoiseSDF2NoiseSDF on benchmarks, including the ShapeNet, ABC, Famous, and Real datasets. Experimental results demonstrate that our framework significantly improves surface reconstruction quality from noisy inputs.

---

## 论文详细总结（自动生成）

# NoiseSDF2NoiseSDF：从噪声监督学习清洁神经场——论文深度总结


## 一、核心问题与整体含义（研究动机与背景）

从点云中重建准确的隐式表面表示是一项长期存在的挑战，尤其是当数据来自低质量扫描设备时。这些点云往往含有大量噪声，导致表面重建不准确。

在二维图像领域，Noise2Noise（N2N）范式已证明：通过观察同一图像的多个带噪实例，可以有效实现图像恢复——模型通过最小化带噪观测之间的均方误差（MSE）来学习恢复清晰图像。然而，将N2N原则直接扩展到三维点云存在固有限制：点云本质上是**非结构化的**，不像图像那样具有规则的网格结构，点云在所有空间坐标上都存在偏移，缺乏稳定的参考框架。标准损失函数如MSE在此场景下无效，必须依赖EMD等专门损失函数来捕捉点云数据中的软几何对应关系。

本文的**关键洞察**在于：神经SDF将三维形状编码为从三维坐标到标量距离值的映射，这与二维图像中像素坐标到像素强度的映射存在**概念上的平行性**。基于这一类比，作者提出**NoiseSDF2NoiseSDF**，将N2N范式从二维图像扩展到三维神经场，使得从带噪点云中学习清洁的神经SDF成为可能。


## 二、方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

NoiseSDF2NoiseSDF的核心思想是：**利用带噪SDF表示之间的MSE损失来训练网络，使网络隐式地降噪并精化表面估计**。与传统的噪声到噪声方法不同，本文不直接使用带噪点云作为输入和目标，而是采用一个以带噪点云为条件的神经网络，在给定查询坐标处预测神经SDF值。

### 2.2 技术路线

**问题形式化**：设 $p_1, p_2, \ldots, p_n$ 为同一底层三维形状的带噪点云观测，$s_1, s_2, \ldots, s_n$ 为对应的带噪SDF。给定带噪点云 $p_i$ 和查询坐标 $q$，神经网络 $f_\theta$ 预测该位置的SDF值：

$$\hat{s}(q \mid p_i) = f_\theta(p_i, q) \tag{4}$$

**训练目标**：模型通过最小化预测SDF值与另一独立带噪观测中同一查询位置的SDF值之间的期望平方误差来训练：

$$\mathcal{L}(\theta) = \mathbb{E}_{p_1,p_2 \sim p(p|s), q \sim \mathcal{U}(\mathbb{R}^3)} \left[ \| \hat{s}(q \mid p_1) - s_2(q \mid p_2) \|^2 \right] \tag{5}$$

其中 $p_1, p_2$ 是同一底层形状 $s$ 的独立带噪点云观测，$s_2(q \mid p_2)$ 是与带噪点云 $p_2$ 关联的、在坐标 $q$ 处的带噪SDF值。

### 2.3 训练流程

训练流程如下：

1. **点云采样**：首先将水密网格归一化到单位立方体中，然后从表面采样点获得原始点云 $p$。遵循N2N协议，施加零均值高斯噪声生成带噪点云对。
2. **查询点集构建**：查询点集由50%的近表面点和50%的单位立方体均匀采样点组成。为减少对原始清洁表面的依赖，直接使用两个输入带噪点云作为近表面查询点。
3. **双路处理**：给定同一形状的两个独立带噪点云 $p_1$ 和 $p_2$，$p_1$ 输入去噪网络预测平滑SDF $\hat{s}$，$p_2$ 通过Point2SDF网络生成带噪SDF $s_2$。
4. **损失计算与更新**：两者在同一组查询点 $q$ 处评估SDF值，计算MSE损失并用于更新去噪网络权重。

该方法的关键优势在于利用了SDF的**连续性和结构化特性**——与无序点云不同，SDF以连续方式表示三维几何，将每个空间坐标映射到其到物体表面的符号距离，从而允许跨带噪样本进行一致的监督。


## 三、实验设计：数据集、Benchmark与对比方法

### 3.1 数据集

论文在四个基准数据集上评估了NoiseSDF2NoiseSDF的有效性：

- **ShapeNet**：三维形状识别的标准基准数据集
- **ABC**：CAD模型数据集
- **Famous**：著名雕塑/形状数据集
- **Real**：真实扫描数据

### 3.2 对比方法

论文与多类基线方法进行了对比：

- **过拟合类方法**：SAL、SALD、Sign-SAL、IGR、DiGS、Neural-Pull、SAP、LPI、Implicit Filtering-Net等
- **鲁棒变体**：SAP、PGR、Neural-IMLS、N2NM、LocalN2NM
- **数据驱动方法**：OCCNet、IM-NET、DeepSDF、ConvOccNet、SSRNet、PatchNets、POCO、IF-Nets、SG-NN、P2S、PPSurf、ShapeFormer等

### 3.3 评估场景

论文涵盖多种挑战性场景：
- 稀疏采样下的重建
- 复杂几何的重建
- 带噪输入下的鲁棒性评估


## 四、资源与算力

**论文中未明确说明使用的GPU型号、数量或训练时长等算力细节。** 论文PDF正文中未报告任何关于计算资源的信息。


## 五、实验数量与充分性分析

### 5.1 实验设置

从论文描述来看，实验设计包含以下维度：

- **四个数据集**：ShapeNet、ABC、Famous、Real
- **多类基线对比**：涵盖过拟合方法、鲁棒方法和数据驱动方法三大类
- **多场景评估**：稀疏采样、复杂几何、带噪输入

### 5.2 充分性评估

**优点**：
- 数据集选择具有代表性，涵盖了合成数据（ShapeNet、ABC）和真实数据（Real），有利于验证方法的泛化能力
- 对比方法覆盖面较广，从传统过拟合方法到最新的数据驱动方法均有涉及
- 与同类工作（如N2NM）对比有助于定位方法贡献

**不足**：
- 由于可获取的论文信息有限（主要为摘要和引言），无法判断是否进行了消融实验（如不同噪声水平、不同网络架构选择等）
- 缺乏定量指标的具体数值报告，难以评估提升幅度的显著性
- 未说明是否进行了多次重复实验以报告标准差


## 六、主要结论与发现

1. **核心假设得到验证**：神经SDF确实可以通过最小化带噪表示之间的MSE损失来有效去噪。这一发现证实了核心假设：神经SDF可以通过观察和最小化带噪神经场之间的差异来学习产生更清洁的输出。

2. **范式扩展成功**：将N2N范式成功从二维图像扩展到三维神经场领域。据作者所知，这是首次将N2N范式应用于三维神经场领域。

3. **无需清洁监督**：该方法能够在**没有清洁SDF作为监督信号**的情况下，仅通过带噪监督学习清洁的神经场。

4. **显著提升重建质量**：实验结果表明，该框架在从带噪输入重建表面质量方面有显著提升。


## 七、方法亮点

1. **巧妙的范式迁移**：识别出神经SDF与二维图像在结构上的相似性（坐标到值的映射），从而将成熟的N2N范式自然迁移到三维领域，这是方法论上的重要创新。

2. **MSE损失的复用**：与点云领域必须使用EMD等复杂损失函数不同，本文通过SDF表示成功复用了简单的MSE损失。这大大降低了训练复杂度和实现难度。

3. **无需清洁数据**：方法不依赖于难以获取的清洁点云或真实SDF作为监督信号，仅需带噪观测即可训练。

4. **结构化的监督框架**：利用SDF的连续性和结构化特性，建立了带噪样本之间的“一对一”对应关系，这是点云本身无法提供的。

5. **泛化能力**：在合成数据和真实数据上均进行了验证，显示出较好的泛化潜力。


## 八、不足与局限

1. **对初始SDF生成的依赖**：方法需要依赖“现成的point-to-SDF方法”来生成带噪SDF目标。这意味着最终性能在一定程度上受限于所选用Point2SDF方法的质量。

2. **噪声模型的假设**：方法基于零均值高斯噪声假设，对于真实世界中更复杂、非高斯或与形状相关的噪声类型，方法的鲁棒性有待进一步验证。

3. **实验细节披露不足**：根据可获取的论文信息，难以评估实验的完整性和可重复性。消融实验、定量指标的具体数值、不同噪声水平下的表现等关键信息不明确。

4. **真实场景的挑战**：虽然包含“Real”数据集，但真实扫描数据往往面临的不只是高斯噪声，还包括缺失区域、不均匀采样、离群点等复杂问题，方法在这些场景下的表现需要更细致的分析。

5. **计算资源未报告**：未说明训练所需的算力需求，不利于其他研究者评估方法的可复现门槛和实际应用成本。


（完）
