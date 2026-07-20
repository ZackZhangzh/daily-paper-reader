---
title: GaussianMorphing：Mesh-Guided 3D Gaussians for Semantic-Aware Object Morphing
title_zh: GaussianMorphing：网格引导的3D高斯用于语义感知对象变形
authors: "Mengtian Li, Yunshu Bai, Yimin Chu, Yijun Shen, Zhongmei Li, Weifeng Ge, Zhifeng Xie, Chaofeng Chen"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=4kp8SxCgHw"
tags: ["query:dgs-fm"]
score: 6.0
evidence: 3DGS用于形状变形但涉及场景表示
tldr: 针对传统对象变形方法受限于点云或未对齐数据的问题，本文提出GaussianMorphing框架，利用网格引导的3DGS实现高保真形状和纹理变形，通过将3DGS点绑定到网格面片并施加拓扑感知约束，保证几何一致性，并利用网格拓扑建立无监督语义对应。该方法在变形任务上展示了优于现有方法的视觉效果，拓展了3DGS在图形编辑领域的应用。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 传统变形方法受限于点云或无纹理数据。
method: 网格引导3DGS绑定变形，拓扑感知约束保持纹理。
result: 实现高质量形状和纹理变形。
conclusion: 网格引导3DGS有效支持语义感知变形。
---

## Abstract
We introduce GaussianMorphing, a novel framework for semantic-aware 3D shape and texture morphing from multi-view images. Unlike conventional approaches constrained to point clouds or correspondence-aligned untextured data, our approach leverages mesh-guided 3D Gaussian Splatting (3DGS) to achieve high-fidelity appearance and geometry representation. On the one hand, our unified mesh-guided Gaussian deformation strategy ensures geometrically consistent deformation by binding 3DGS points to reconstructed mesh patches while preserving texture fidelity through topology-aware constraints. On the other hand, the framework establishes unsupervised semantic correspondence by exploiting mesh topology as a geometric prior, while maintaining structural integrity through physically plausible point trajectory constraints. This integrated approach maintains both local geometric details and global semantic coherence throughout the morphing process without requiring labeled data. Experimental results show that GaussianMorphing outperforms prior 2D/3D morphing methods, with a color consistency ($\Delta E$) reduction of  22.2%  and an EI reduction of 26.2%  on our proposed TexMorph.

---

## 论文详细总结（自动生成）

# GaussianMorphing 论文深度分析总结


## 1. 核心问题与整体含义

**研究动机：** 对象变形（Morphing）是计算机视觉与图形学中的基础技术，广泛应用于计算机动画、几何建模和影视特效等领域。然而，现有方法存在根本性的两难困境：

- **基于图像的方法**（如 DiffMorpher、FreeMorph）：能生成高保真 2D 输出，但缺乏 3D 几何推理和多视图一致性；
- **基于 NeRF 的扩展**（如 MorphFlow）：虽能解决视图一致性问题，但缺乏显式 3D 几何约束，仅能生成不完整的 2.5D 重建；
- **3D 几何方法**（如 NeuroMorph）：支持基于网格的变形，但需要高质量网格输入，忽略纹理处理，且难以处理拓扑复杂的情况。

**核心问题：** 当前缺乏一个统一框架，能够在**不依赖高保真 3D 数据**的前提下，平衡几何鲁棒性、纹理连贯性和输入可及性。

**本文定位：** 提出 **GaussianMorphing**，首个基于 3D 高斯（3DGS）实现**联合 3D 几何与纹理变形**的框架，使形状与外观内在统一。


## 2. 方法论

### 核心思想

将 **3DGS 的渲染效率**与**网格引导变形的结构优势**相结合。核心洞察是：以**显式三角网格**作为拓扑支架，引导**无结构高斯**的变换。

### 关键技术流程

**（1）混合网格-高斯表示（Hybrid Mesh-Gaussian Representation）**

- 从优化的 3DGS 中提取高质量初始网格，采用 SuGaR、FrostingGaussian 等方法配合泊松重建；
- 将每个高斯锚定到特定三角面片，其位置由**重心坐标** \((w_1,w_2,w_3)\) 和**法向偏移** \(d\) 定义：

\[\mu_g = w_1V_1 + w_2V_2 + w_3V_3 + d \cdot \mathbf{n}_f\]

- 网格顶点变形时，锚定的高斯随之协同移动，保持细粒度几何与外观细节。

**（2）基于拓扑的语义对应（Semantic Correspondence）**

- 将对应关系编码为**概率矩阵** \(\Pi \in \mathbb{R}^{n \times m}\)：

\[\Pi_{ij} = P(V_j^T \mid V_i^S) = \frac{\exp(\sigma c_{ij})}{\sum_{k=1}^{m}\exp(\sigma c_{ik})}\]

- 使用 **5 层图卷积网络（GCN）** 处理网格连通性，学习语义丰富的特征。

**（3）神经变形流（Neural Morphing Flow）**

- 学习连续非线性变形场，网络 \(\Psi\) 以时间 \(t\) 为条件预测位移：

\[V^S(t) = V^S + \Psi(V^S, \Pi V^T - V^S, t)\]

- 高斯位置通过重心关系一致更新。

**（4）多目标优化**

联合损失函数包含四项：

| 损失项 | 作用 |
|--------|------|
| \(\mathcal{L}_{\text{geo}}\)（测地线损失） | 保持表面内在几何结构 |
| \(\mathcal{L}_{\text{arap}}\)（ARAP 能量） | 惩罚非刚性变形，保持局部刚性 |
| \(\mathcal{L}_{\text{smooth}}\)（平滑损失） | 确保颜色在相邻顶点间平滑过渡 |
| \(\mathcal{L}_{\text{align}}\)（对齐损失） | 确保最终时刻变形网格到达目标 |


## 3. 实验设计

### 数据集 / 场景

作者提出了专用基准 **TexMorph**（Texture-rich, Morphing-focused），包含三类数据：

1. **高保真合成模型**（复杂纹理，多视角渲染）；
2. **真实世界扫描物体**（3D 扫描获取）；
3. **“野外”拍摄物体**（普通手机摄像头拍摄）。

数据集涵盖**十余个物体类别**，包括动物、水果、车辆等，提供多样化的拓扑和纹理挑战。此外还使用了 **GSO** 数据集中的真实扫描物体。

### 对比方法

- **2D 基线**：DiffMorpher（扩散方法）、FreeMorph（免调优方法）；
- **3D 基线**：MorphFlow（最优传输 + 多视图变形）、NeuroMorph（拓扑对齐形状对应）。

### 评估指标

作者提出了三项针对变形序列的时空质量评估指标：

| 指标 | 全称 | 衡量内容 |
|------|------|----------|
| **MSE-SSIM** | 结构稳定性 | 几何一致性，越低越好 |
| **\(\Delta E\)** | 颜色一致性 | 外观平滑度，越低越好 |
| **EI** | 边缘完整性 | 轮廓连续性，越低越好 |


## 4. 资源与算力

**论文明确说明了实验算力配置**：

| 项目 | 详情 |
|------|------|
| **GPU 型号** | 单张 NVIDIA RTX A6000 |
| **初始表示生成** | 约 1 小时（典型 12,000 面网格） |
| **框架优化** | 500–1000 次迭代（取决于网格复杂度） |
| **完整序列生成** | 约 2 分钟 |


## 5. 实验数量与充分性

**实验组数：**

1. **定量对比实验**（Table 1）：与 4 种 SOTA 方法在 3 项指标上对比；
2. **定性对比分析**：多组可视化对比（Figure 3、Figure 4），涵盖跨类别变形与非等距变形；
3. **消融实验**（Table 2）：分别移除“网格引导”和“几何失真损失”两项核心组件；
4. **用户研究**：54 名参与者在 4 项标准上对方法进行主观评价。

**充分性与客观性评价：**

- ✅ 对比方法选取合理，覆盖了 2D 和 3D 两类主流范式；
- ✅ 与 NeuroMorph 对比时**使用相同的输入网格**，保证公平性；
- ✅ 消融实验直接验证了核心贡献的有效性；
- ✅ 用户研究提供了主观质量验证，增强了结论说服力；
- ⚠️ 作为 ICLR 2026 被拒稿论文（得分 6.0），实验设计和结果虽较充分，但可能存在 reviewers 指出的其他不足未被本文元数据体现。


## 6. 主要结论与发现

1. **性能领先**：在 TexMorph 基准上，GaussianMorphing 相比 prior 方法将颜色一致性误差（\(\Delta E\)）降低 **22.2%**，边缘完整性（EI）降低 **26.2%**；
2. **纹理保真**：在“狗→狮子”等跨类别变形中，成功保留精细纹理（如狮子的毛发图案、狗的白色斑块），而对比方法出现过度平滑或结构伪影；
3. **几何鲁棒**：在显著非等距变形场景中仍能生成平滑、合理的插值序列；
4. **用户偏好**：超过 **80%** 的用户在各项指标上偏好本文方法；
5. **核心贡献验证**：消融实验表明，“网格引导”与“几何失真损失”的协同作用是实现高保真几何与纹理变换的关键。


## 7. 优点

**方法创新方面：**

- **首个**基于 3DGS 实现联合几何-纹理 3D 变形的框架；
- 巧妙结合了 **3DGS 的渲染优势**与**网格的结构优势**，弥补了各自的短板；
- 通过**网格拓扑建立无监督语义对应**，无需标注数据；
- 提出的**双域优化策略**（测地线几何约束 + 纹理感知颜色插值）实现了无缝视觉效果。

**实验设计方面：**

- 构建了专门的 **TexMorph 基准**，填补了 3D 变形评估数据的空白；
- 提出了**三项专用评估指标**（MSE-SSIM、\(\Delta E\)、EI），比通用指标更贴合变形任务；
- 实验覆盖**合成数据、真实扫描、手机拍摄**三种输入来源，验证了泛化能力。


## 8. 不足与局限

**实验层面：**

- 论文未报告在**极大规模网格**或**极端复杂拓扑**上的性能表现；
- TexMorph 基准的**具体规模**（物体对数量、图像数量）在正文中未详细披露（附录 A.1 可能包含更多细节）；
- 对比方法中**缺少更多近期的 3DGS 相关工作**，可能未能充分体现方法在同类技术中的相对位置。

**方法层面：**

- 依赖**从 3DGS 提取初始网格**，网格质量直接影响后续变形效果（虽采用 SuGaR 等方法，但仍是间接依赖）；
- **非等距变形**虽有一定处理能力，但极端情况下（如拓扑结构改变）可能仍有局限；
- 需要**多视角图像输入**，单张图像场景下无法直接应用。

**应用限制：**

- 从多视图图像到完成变形，总耗时约 **1–1.5 小时**（含初始表示生成和优化），实时应用受限；
- 变形质量依赖于 **3DGS 重建的质量**，在稀疏视角或低纹理物体上可能表现下降。

**审稿状态：** 论文为 **ICLR 2026 被拒稿**（得分 6.0），说明在顶级会议标准下仍存在 reviewers 认为的不足之处（具体评审意见未在元数据中体现）。


（完）
