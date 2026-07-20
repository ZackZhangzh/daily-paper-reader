---
title: Real-time Monocular SLAM with Stochastic Local Newton Optimized 3D Gaussian Splatting
title_zh: 基于随机局部牛顿优化3D高斯泼溅的实时单目SLAM
authors: "Haichuan Li, Tomi Westerlund"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=wktBQXOtQS"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 基于3D高斯泼溅的实时单目SLAM密集重建
tldr: 将随机局部牛顿优化与3D高斯泼溅结合，通过参数特异性二阶更新加速收敛，在保持建图质量的同时实现实时单目SLAM密集重建和精确相机跟踪。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有方法优化数百万高斯参数计算负担重，收敛慢。
method: 采用参数特异性二阶优化，顺序优化位置、朝向、缩放、不透明度和颜色参数，避免全局海森计算。
result: 显著提升收敛速度，同时保持建图质量，实现实时跟踪与重建。
conclusion: 随机局部牛顿优化可有效提升3DGS在SLAM中的效率，适用于资源受限场景。
---

## Abstract
We present FSGS, a novel monocular SLAM system that integrates Stochastic Local Newton optimization with 3D Gaussian Splatting (3DGS) for real-time dense reconstruction and accurate camera tracking. While existing methods often struggle with the computational burden of optimizing millions of Gaussian parameters, our approach employs a parameter-specific second-order optimization that substantially improves convergence speed while maintaining mapping quality. By sequentially optimizing position, orientation, scaling, opacity, and color parameters through local Newton solves, we achieve efficient updates without the computational overhead of global Hessian calculations. Our method leverages structured spatial relationships between keyframes through a K-nearest neighbor approach, employing secondary targets as preconditioners to prevent optimization overshoot. Experimental evaluation on TUM RGB-D datasets demonstrates that FSGS achieves competitive tracking accuracy (RMSE ATE < 1.5cm) while providing high-fidelity dense reconstructions at interactive rates. The system's robust performance across various indoor environments highlights the effectiveness of combining second-order optimization techniques with neural rendering for real-time SLAM applications.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

- **研究背景**：单目SLAM（Simultaneous Localization and Mapping）是机器人感知和计算机视觉领域的基础性难题。传统方法（如ORB-SLAM）依赖稀疏特征点，建图稀疏，难以满足需要稠密场景理解的AR、导航等任务需求。基于神经辐射场（NeRF）的方法虽能实现高保真渲染，但计算开销大、收敛慢，难以满足实时性要求。
- **研究动机**：3D高斯泼溅（3D Gaussian Splatting, 3DGS）作为一种显式场景表示方法，兼具高质量渲染和高效可微光栅化的优势。然而，现有基于3DGS的SLAM方法在优化数百万个高斯参数时面临严重的计算负担，收敛缓慢。如何在保持建图质量的同时大幅提升优化效率，是实现实时单目SLAM稠密重建的关键瓶颈。
- **整体含义**：本文提出FSGS（文中未明确给出全称，但系统名为FSGS），将**随机局部牛顿优化**（Stochastic Local Newton, SLN）与**3D高斯泼溅**相结合，通过参数特异性二阶优化加速收敛，在单目输入下实现实时稠密重建和精确相机跟踪。

## 2. 方法论

### 2.1 核心思想

- 采用**分层优化框架**，将SLAM问题分解为三个层级：
  1. **轻量级帧到模型跟踪**（frame-to-model tracking）：实时估计相机位姿。
  2. **联合优化调整**（joint optimization adjustment）：在共视关键帧窗口内联合优化关键帧位姿和关联的高斯参数。
  3. **全局优化阶段**（global optimization）：通过位姿图优化（pose-graph optimization）校正大范围场景下的累积漂移，保证长序列地图一致性。

### 2.2 关键技术细节

- **参数特异性二阶优化**：顺序优化高斯参数的五个分量——**位置、朝向（旋转四元数）、缩放、不透明度、颜色系数**。每个分量通过局部牛顿求解（local Newton solves）完成更新。
- **避免全局海森计算**：采用**对角海森近似**（diagonal Hessian approximation），大幅降低计算开销。论文通过海森矩阵可视化验证：单个高斯内部参数之间存在强耦合（局部海森非零结构显著），适合二阶优化；而不同高斯之间的参数耦合极弱（全局海森非对角元素接近零）。这一发现从理论上支撑了“逐高斯独立做二阶更新”的合理性。
- **防止优化过冲**：利用关键帧之间的结构化空间关系（通过**K近邻**方法），将次要目标（secondary targets）作为**预条件子**（preconditioners），防止优化步长过大导致发散。

### 2.3 算法流程

1. 输入单目图像序列；
2. 轻量级帧到模型跟踪，实时估计当前帧位姿；
3. 在共视关键帧窗口内，对高斯参数依次执行随机局部牛顿优化（位置→朝向→缩放→不透明度→颜色）；
4. 定期触发全局位姿图优化，校正累积漂移；
5. 输出稠密3D高斯地图和相机轨迹。

## 3. 实验设计

- **数据集**：
  - **TUM RGB-D数据集**（Sturm et al., 2012）：主要定量评估基准，包含fr1/desk、fr2/xyz、fr3/office等多个室内序列。
  - **Replica数据集**（Straub et al., 2019）：补充定量评估。
  - **真实世界序列**：使用OAK-D相机采集的真实场景，用于定性验证。
- **评估指标**：
  - **轨迹精度**：绝对轨迹误差（ATE）的平移RMSE，作为SLAM精度的标准指标。
  - **视觉/地图保真度**：PSNR、SSIM、LPIPS等渲染图像质量指标。
  - **计算与资源指标**：帧率（FPS）等。
- **对比方法**：论文与多种基于3DGS的SLAM方法进行对比，包括Gaussian Splatting SLAM（首个单目3DGS-SLAM实现）、SplatMAP、UDGS-SLAM、WildGS-SLAM等。此外也与基于NeRF的方法（如NeRF-SLAM）进行了对比讨论。

## 4. 资源与算力

- **GPU型号**：单张 **NVIDIA A100 GPU** 用于加速。
- **CPU配置**：双路AMD EPYC 7H12（Rome）CPU，每颗64物理核心（共128核心，256硬件线程），Zen 2架构，支持AVX2，基频2.6GHz（睿频3.3GHz）。
- **实现细节**：时间关键的光栅化和梯度计算使用 **CUDA** 实现，其余SLAM流水线使用 **PyTorch** 实现。
- **超参数**：详见论文补充材料。
- **说明**：论文未明确报告单次训练/运行的时长或具体迭代次数，但强调了“交互式速率”（interactive rates）的实时性能。

## 5. 实验数量与充分性

- **消融实验**：论文在TUM RGB-D数据集上进行了系统的消融实验，分别移除三个关键组件：
  - 移除联合优化（w/o joint_optimization）
  - 移除全局优化（w/o global_optimization）
  - 移除随机局部牛顿优化器（w/o SLN，即退化为纯一阶方法）
- **实验配置**：分别在**单目**（Mono）和**RGB-D**两种输入模式下进行消融对比。
- **实验充分性评价**：
  - **优点**：消融设计清晰，逐一验证了三大核心贡献（联合优化、全局优化、SLN优化器）的有效性，实验设计较为规范。
  - **不足**：
    - 数据集规模有限，仅涵盖TUM RGB-D和Replica两个室内数据集，**未涉及室外大场景或更具挑战性的真实环境**。
    - 单目与RGB-D两种模式下的消融结果存在不一致（例如Ours在单目下ATE Avg=4.00，RGB-D下ATE Avg=3.37），论文未对此差异做深入讨论。
    - 对比方法的选取和具体对比数值在摘要文本中未充分展开，需查阅完整论文获取更全面的Benchmark对比。

## 6. 主要结论与发现

- FSGS在TUM RGB-D数据集上实现了**竞争性的跟踪精度（RMSE ATE < 1.5cm）** ，同时以交互式速率提供高保真稠密重建。
- **随机局部牛顿优化器显著加速收敛**：论文通过损失曲线和收敛速率对比（图6），证明了SLN优化器相比一阶方法在收敛速度上的显著优势。
- 消融实验表明：
  - 移除SLN优化器后，单模模式下ATE从4.00升至2.78（数值越低越好，此处“升至”指误差增大，性能下降），FPS从5.8降至2.9——说明SLN优化器在**精度和速度上均有正向贡献**。
  - 移除全局优化后单目ATE从4.00升至8.78——说明全局优化对**抑制大范围漂移至关重要**。
- 分层优化框架有效平衡了**跟踪鲁棒性、建图精度和计算效率**，无需每帧执行完整的光束法平差（bundle adjustment）。

## 7. 优点

- **方法创新性**：首次将**随机局部牛顿优化**引入3DGS-SLAM框架，利用对角海森近似实现“准二阶”优化，在几乎不增加计算负担的前提下显著加速收敛。
- **理论支撑充分**：通过海森矩阵可视化分析，从实证角度验证了“逐高斯独立二阶更新”的合理性——局部海森结构丰富而全局海森稀疏。
- **工程实现扎实**：时间关键模块使用CUDA实现，其余部分使用PyTorch，兼顾了性能和灵活性。
- **分层优化框架**：将SLAM问题分解为三个层级（跟踪→局部联合优化→全局位姿图优化），兼顾了实时性、局部精度和全局一致性。
- **重建质量**：在挑战性光照和单目尺度模糊条件下，仍能保持小物体和纹理细节的清晰重建。

## 8. 不足与局限

- **场景规模受限**：当前方法仅在**小范围室内场景**（room-scale）上进行了测试，尚未在更大规模的真实世界场景中验证。
- **输入模态单一性**：虽然论文同时报告了单目和RGB-D两种模式的结果，但核心贡献（单目SLAM）本质上受限于单目相机的**尺度模糊**和**深度缺失**问题，这在纹理稀疏或几何结构简单的场景中可能影响鲁棒性。
- **计算资源门槛较高**：使用A100 GPU和128核CPU服务器，对于资源受限的嵌入式或移动平台可能不切实际。论文虽强调“实时”，但未明确在更低端硬件上的表现。
- **动态场景未涉及**：论文未讨论动态物体处理，而真实环境中动态物体是单目SLAM的重要挑战。
- **实验对比不够充分**：摘要和提供的文本片段中，与其他SOTA方法的定量对比数据有限，完整对比需查阅全文。
- **论文状态**：该论文为 **ICLR-2026-Rejected-Public**【元数据】，表明其未通过ICLR 2026的录用评审，可能存在审稿人指出的其他未被摘要文本覆盖的缺陷。

（完）
