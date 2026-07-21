---
title: Geodesic Flow Matching for Denoising High-Dimensional Structured Representations
title_zh: 测地线流匹配用于高维结构化表示去噪
authors: "Karim Habashy, Chris Eliasmith"
date: 2026-04-30
pdf: "https://openreview.net/pdf/6cf2ac45705a5e2a4e055f59607fa18ff4235bea.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 测地线流匹配用于黎曼流形
tldr: 标准流匹配假设欧氏空间，不适用于流形结构。本文提出测地线流匹配，将黎曼输运动力学用于高维结构化表示的去噪，针对环形流形上的空间语义指针，避免欧氏线性插值破坏相位和幅度结构，为流形上的生成式去噪提供了新方法。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 欧氏流匹配在流形上线性插值破坏数据结构，需适应黎曼几何的输运。
method: 采用测地线流匹配，在黎曼流形上定义输运动力学，保持流形结构。
result: 有效去噪并保留相位和幅度信息，适用于环形流形表示。
conclusion: 测地线流匹配将流匹配扩展到非欧几何，为流形数据生成提供新工具。
---

## Abstract
Vector Symbolic Algebras (VSAs) enable robust neurosymbolic reasoning by encoding information into high-dimensional distributed representations. For continuous domains, Spatial Semantic Pointers (SSPs) extend this framework by mapping variables onto precise toroidal manifolds. While generative models offer a promising avenue for cleaning up (denoising) these representations, standard approaches like Flow Matching assume a flat Euclidean geometry. We demonstrate that this assumption fails for SSPs: Euclidean linear interpolants "cut through" the manifold's interior, destroying the phase and magnitude structure required for accurate decoding. To resolve this, we employ Geodesic Flow Matching, adapting Riemannian transport dynamics to strictly restrict the denoising flow to the SSP manifold. We validate this approach in a Spiking Neural SLAM system, showing that manifold-aware cleanup stabilizes path integration against drift. The method achieves a 72\% reduction in tracking error and enables a 40\% increase in neural efficiency compared to classical baselines.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

- **研究背景**：向量符号代数（VSA）通过高维分布式表示实现鲁棒的神经符号推理。对于连续域，空间语义指针（SSP）将变量映射到精确的环形流形（toroidal manifold）上。生成模型为这些表示的“清理”（去噪）提供了有前景的途径。
- **核心问题**：标准流匹配（Flow Matching）方法假设平坦的欧氏几何，但这一假设在SSP上失效——欧氏线性插值会“穿过”流形内部，破坏精确解码所需的相位和幅度结构。本质上是**欧氏空间假设与数据内在黎曼几何结构之间的根本性不匹配**。
- **整体含义**：本文旨在将流匹配从欧氏几何推广到非欧几何，使去噪过程严格限于SSP环形流形表面，从而为流形结构数据的生成式去噪提供新工具。


## 二、方法论

- **核心思想**：采用**测地线流匹配（Geodesic Flow Matching）** ，将黎曼输运动力学适配到去噪过程中，使去噪流严格限制在SSP环形流形上。本质上是将生成式去噪重新表述为流形上的输运问题。
- **关键技术路径**：
    - 将去噪任务建模为**连续时间依赖的速度场学习**，该速度场将受损表示沿流形表面“运输”回有效数据流形。
    - 利用SSP的**环形拓扑**，将输运动力学约束到流形的内在黎曼几何上。
    - 训练时，模型学习沿测地线（流形上的最短路径）而非欧氏直线进行插值和去噪，从而保持幅度与相位关系不变。
- **对比基础**：标准欧氏流匹配使用线性插值（straight-line interpolants），在环形流形上会“切割”流形内部；测地线流匹配则沿流形表面的测地线运输，从根本上避免了这一问题。


## 三、实验设计

- **验证场景**：在**脉冲神经SLAM（Spiking Neural SLAM）系统**中进行验证。该系统使用SSP编码连续空间地图，并通过脉冲神经活动进行表示。
- **任务目标**：作为**路径积分器的在线稳定器**，防止灾难性漂移。
- **对比方法**：对比了欧氏变体（Euclidean variants）和**经典基线方法**（classical baselines）。具体基线名称在摘要中未逐一列出，但涵盖了标准流匹配的欧氏版本及传统去噪方法。
- **评估指标**：跟踪误差（tracking error）和神经效率（neural efficiency）。


## 四、资源与算力

**论文摘要和元数据中未明确提及GPU型号、数量、训练时长等具体算力信息。** 所有可获取的公开信息（包括OpenReview摘要、ICML页面、Semantic Scholar等）均未报告相关计算资源细节。


## 五、实验数量与充分性

- **实验组数**：从公开信息来看，论文至少包含以下实验维度：
    1. **主实验**：在Spiking Neural SLAM系统中验证测地线流匹配的去噪效果。
    2. **噪声鲁棒性对比**：在不同噪声强度下对比测地线方法与欧氏变体及经典基线。
    3. **资源效率对比**：以1500神经元匹配2500神经元基线的精度，验证神经效率提升。
- **充分性评估**：实验覆盖了**端到端系统验证**（SLAM系统集成）、**多方法对比**（欧氏变体+经典基线）和**多噪声水平测试**，基本框架较为完整。但受限于公开信息有限，**消融实验的具体设计、超参数敏感性分析、更多数据集上的泛化验证**等信息无法确认。整体而言，作为ICML 2026录用论文，实验设计应达到了会议的基本审稿标准。


## 六、主要结论与发现

1. **跟踪误差显著降低**：测地线流匹配方法实现了**72%的跟踪误差降低**。
2. **神经效率大幅提升**：相比竞争基线，实现了**40%的神经效率提升**。具体表现为：1500个神经元即可达到基线系统2500个神经元的跟踪精度。
3. **高噪声场景优势明显**：测地线流在高噪声环境下**持续优于**欧氏变体和经典基线。
4. **流形感知清理有效稳定路径积分**：在脉冲神经SLAM系统中，流形感知的去噪成功防止了路径积分器的灾难性漂移。


## 七、优点

1. **理论创新性强**：将流匹配从欧氏几何推广到黎曼流形，为流形结构数据的生成式建模提供了新范式。
2. **问题定位精准**：敏锐地指出现有流匹配方法在环形流形表示上的根本缺陷——欧氏插值“切割”流形内部，破坏相位和幅度结构。
3. **应用价值明确**：在脉冲神经SLAM这一具有生物学合理性和实际应用价值的系统中验证，结果具有工程指导意义。
4. **效果提升显著**：72%的误差降低和40%的效率提升是**数量级上有说服力的改进**。
5. **代码已开源**：论文代码已在GitHub公开（https://github.com/kremHabashy/CleanupSSP），有利于结果复现和后续研究。


## 八、不足与局限

1. **应用场景相对单一**：目前仅在SSP环形流形和Spiking Neural SLAM系统上验证，**泛化到其他流形结构（如球面、双曲空间等）和其他任务的能力尚未展示**。
2. **对比基线信息不完整**：公开摘要中仅提及“欧氏变体”和“经典基线”，**具体对比了哪些方法、基线如何实现等细节不明确**。
3. **算力资源未报告**：缺乏训练成本的具体信息，**不利于其他研究者评估方法的计算开销和可复现性**。
4. **理论分析深度未知**：公开信息中未见对测地线流匹配的**收敛性保证、采样复杂度等理论性质**的阐述。
5. **数据集多样性不足**：仅在SLAM仿真环境中验证，**缺乏真实世界数据或多领域数据的测试**。
6. **偏差风险**：方法高度依赖SSP的环形流形先验，若**流形结构估计不准确或数据分布偏离理想流形**，性能可能显著下降。

（完）
