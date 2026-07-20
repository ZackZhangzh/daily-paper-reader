---
title: Real-time Monocular SLAM with Stochastic Local Newton Optimized 3D Gaussian Splatting
title_zh: 基于随机局部牛顿优化的3D高斯泼溅实时单目SLAM
authors: "Haichuan Li, Tomi Westerlund"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=wktBQXOtQS"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 使用3DGS进行实时密集重建
tldr: 本文提出FSGS系统，将随机局部牛顿优化与3D高斯泼溅结合，实现实时单目SLAM的密集重建与相机跟踪。现有方法因优化数百万高斯参数计算负担重，本方法采用参数特定二阶优化，通过局部牛顿求解顺序优化位置、朝向等参数，加速收敛同时保持建图质量。实验表明在实时性能与重建精度上取得平衡，为SLAM中的高效3DGS优化提供新思路。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有SLAM方法优化大量高斯参数计算复杂，需提高收敛速度。
method: 采用参数特定二阶优化，顺序求解局部牛顿更新位置、缩放等参数。
result: 实现了实时密集重建和准确跟踪，速度与质量兼顾。
conclusion: 所提优化策略可有效提升3DGS在SLAM中的效率与精度。
---

## Abstract
We present FSGS, a novel monocular SLAM system that integrates Stochastic Local Newton optimization with 3D Gaussian Splatting (3DGS) for real-time dense reconstruction and accurate camera tracking. While existing methods often struggle with the computational burden of optimizing millions of Gaussian parameters, our approach employs a parameter-specific second-order optimization that substantially improves convergence speed while maintaining mapping quality. By sequentially optimizing position, orientation, scaling, opacity, and color parameters through local Newton solves, we achieve efficient updates without the computational overhead of global Hessian calculations. Our method leverages structured spatial relationships between keyframes through a K-nearest neighbor approach, employing secondary targets as preconditioners to prevent optimization overshoot. Experimental evaluation on TUM RGB-D datasets demonstrates that FSGS achieves competitive tracking accuracy (RMSE ATE < 1.5cm) while providing high-fidelity dense reconstructions at interactive rates. The system's robust performance across various indoor environments highlights the effectiveness of combining second-order optimization techniques with neural rendering for real-time SLAM applications.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究动机与背景**

实时单目SLAM（同时定位与地图构建）是机器人感知领域的基础性难题，核心挑战在于：如何在仅使用单目相机输入的情况下，同时实现高精度的相机跟踪与高保真度的密集三维场景重建。

近年来，3D高斯泼溅（3D Gaussian Splatting, 3DGS）作为一种新兴的3D场景表示方法，凭借其高质量渲染和高帧率优势，为SLAM提供了新的技术路径。然而，现有基于3DGS的SLAM方法面临一个关键瓶颈：**优化数百万个高斯参数带来的巨大计算负担**。每帧需要优化的高斯数量极为庞大，导致计算开销过高，难以在实时性与建图质量之间取得良好平衡。

**论文整体含义**

针对上述问题，本文提出 **FSGS**（尚未明确缩写的全称，但区别于Few-shot View Synthesis的FSGS）系统——一种将**随机局部牛顿优化**（Stochastic Local Newton, SLN）与3D高斯泼溅相结合的新型单目SLAM方案。其核心贡献在于：通过参数特定的二阶优化策略，在**不牺牲建图质量的前提下大幅提升收敛速度**，从而实现实时的密集重建与精确的相机跟踪。


## 二、方法论

**核心思想**

FSGS的核心思想是：**避免计算全局Hessian矩阵这一计算瓶颈，转而采用参数特定的二阶优化方法**。具体而言，系统将SLAM优化问题分解为多个层次，通过顺序地对位置、朝向、缩放、不透明度和颜色等参数进行局部牛顿求解，实现高效更新。

**关键技术细节**

1. **参数特定的二阶优化**：不同于传统方法对所有参数统一进行一阶梯度下降，FSGS为不同类型的参数（位置、旋转四元数、缩放、颜色系数、不透明度）分别设计优化策略。论文通过Hessian矩阵可视化分析发现：单个高斯内部参数之间存在强耦合，适合二阶优化；而不同高斯之间的参数耦合极小。基于此观察，FSGS采用**对角Hessian近似的SLN方法**，在保留优于一阶方法收敛性的同时实现高效更新。

2. **K近邻（KNN）空间结构利用**：系统通过K近邻方法利用关键帧之间的结构化空间关系，以**辅助目标作为预条件子**（preconditioners），防止优化过程中的过冲问题。

3. **层次化优化框架**：整个SLAM问题被分解为三个相互关联的层次：
   - **轻量级帧到模型跟踪**（frame-to-model tracking）：实现快速相机位姿估计；
   - **联合优化调整**（joint optimization adjustment）：对共视关键帧窗口及其关联的高斯进行精细化调整；
   - **全局优化阶段**（global optimization stage）：通过位姿图优化确保大尺度地图的一致性，并校正累积漂移。

**算法流程（文字说明）**

1. **输入**：单目相机采集的RGB图像序列；
2. **跟踪阶段**：通过轻量级帧到模型匹配估计当前帧的相机位姿；
3. **建图阶段**：对共视关键帧窗口内的3D高斯参数执行SLN优化，顺序更新位置、朝向、缩放、不透明度与颜色；
4. **全局校正**：当检测到累积漂移时，触发基于共视关键帧的位姿图优化，确保长期地图一致性；
5. **输出**：稠密3D高斯地图与相机轨迹。


## 三、实验设计

**数据集**

论文在以下数据集上进行了评估：
- **TUM RGB-D数据集**（Sturm et al., 2012）：室内SLAM领域最经典的基准数据集之一，包含多种室内场景与运动模式；
- **Replica数据集**（Straub et al., 2019）：高保真度的合成室内场景数据集，用于密集重建质量的评估；
- **真实世界序列**：使用OAK-D相机采集的真实场景数据，并在TUM RGB-D的`fr2/xyz`序列上进行验证。

**Benchmark与对比方法**

论文将FSGS与现有的3DGS-based SLAM方法及其他主流密集SLAM方法进行对比，主要评估指标包括：
- **轨迹精度**：以**RMSE ATE**（均方根绝对轨迹误差）为核心指标；
- **视觉/地图保真度**：评估重建场景的视觉质量和几何精度；
- **计算/资源指标**：评估系统的运行效率与资源消耗。

**对比方法**：论文对比了现有基于3DGS的SLAM方法（如SplaTAM等）以及其他密集SLAM方法。


## 四、资源与算力

**论文明确说明了硬件配置**：

| 组件 | 规格 |
|------|------|
| CPU | 双路 AMD EPYC 7H12（Rome），每路64物理核心，共128核心/256线程，Zen 2架构，支持AVX2，基频2.6GHz（睿频3.3GHz） |
| GPU | NVIDIA A100 |
| 软件实现 | 时间关键的栅格化与梯度计算使用CUDA实现，其余SLAM管道使用PyTorch实现 |

**论文未明确说明**训练/运行的总时长、迭代次数或具体的帧率数值，仅在摘要中提及“交互式速率”（interactive rates）。


## 五、实验数量与充分性

**实验数量**

从论文摘要与正文片段来看，实验涵盖了：
1. **两个标准数据集**（TUM RGB-D、Replica）上的定量评估；
2. **真实世界序列**上的定性评估（使用OAK-D相机采集）；
3. **消融实验**（ablation study）：论文明确进行了消融实验，评估**随机局部牛顿优化器（SLN）** 和**联合优化调整**等关键组件的贡献；
4. **Hessian矩阵可视化分析**：通过可视化验证对角近似的合理性。

**充分性与客观性评估**

- **正面**：使用TUM RGB-D和Replica两个公开基准数据集，保证了结果的可重复性与可比性；消融实验的引入有助于厘清各模块的独立贡献；硬件配置明确，有利于结果复现。
- **局限**：从现有信息来看，实验主要聚焦于室内场景（TUM、Replica均为室内数据集），**缺乏室外大尺度场景**的验证；单目SLAM的核心难题之一是尺度不确定性，论文对此的应对策略在现有摘要中着墨不多；对比方法的选取范围和具体对比结果数据尚不完整。


## 六、主要结论与发现

论文的核心结论可概括为：

1. **跟踪精度**：FSGS在TUM RGB-D数据集上实现了具有竞争力的跟踪精度（**RMSE ATE < 1.5cm**）；
2. **重建质量**：系统能够在交互式速率下提供高保真度的密集重建，在复杂光照条件下仍能保持小物体和纹理细节；
3. **优化效率**：将**二阶优化技术**与神经渲染相结合，能够在不牺牲建图质量的前提下显著提升收敛速度，有效解决了3DGS在SLAM中优化数百万高斯参数的计算瓶颈问题；
4. **鲁棒性**：系统在多种室内环境中均表现稳健，证明了所提方法的泛化能力。


## 七、方法亮点

1. **优化范式的创新**：首次将**随机局部牛顿优化**引入3DGS-based SLAM，用参数特定的二阶优化替代传统一阶梯度下降，是方法论层面的重要尝试。

2. **计算效率的突破**：通过**避免全局Hessian计算**和对角Hessian近似，在保留二阶优化收敛优势的同时大幅降低计算开销。

3. **层次化框架设计**：将SLAM问题分解为跟踪、局部优化、全局优化三个层次，兼顾了实时性（轻量级跟踪）与长期一致性（全局位姿图优化）。

4. **理论分析与实践结合**：通过Hessian矩阵的可视化分析，从理论上论证了“高斯内部强耦合、高斯间弱耦合”的结构特性，为SLN方法的选择提供了扎实的理论依据。

5. **工程实现完善**：使用CUDA加速时间关键模块，PyTorch实现其余管道，充分发挥异构计算优势。


## 八、不足与局限

1. **实验场景覆盖有限**：评估主要集中于**室内环境**（TUM、Replica），缺乏室外、大尺度、动态场景下的验证，泛化能力有待进一步检验。

2. **实时性的量化数据缺失**：摘要仅提及“交互式速率”，但论文正文中**未明确给出具体的帧率（FPS）数值**，难以直接与其他方法进行效率对比。

3. **单目SLAM的固有问题**：单目视觉 inherently 存在**尺度不确定性**问题，论文在现有摘要中对如何处理尺度漂移着墨不多。

4. **算力门槛较高**：使用NVIDIA A100 GPU进行加速，对于资源受限的嵌入式平台（如无人机、机器人等实际部署场景）可能仍存在部署门槛。

5. **论文被拒的隐含信号**：该论文为**ICLR-2026-Rejected-Public**（被ICLR 2026拒稿），评审意见提及“Soundness:1:poor, Presentation:1:poor, Contribution:1:poor”，表明学术界对其方法的新颖性、写作质量和理论严谨性存在较大争议。尽管被拒稿不一定代表方法无价值，但确实反映了论文在论证充分性和贡献显著性方面可能存在不足。

6. **OpenReview页面标题不一致问题**：有讨论指出OpenReview页面标题与PDF摘要存在不一致，可能影响可读性和评审体验。


（完）
