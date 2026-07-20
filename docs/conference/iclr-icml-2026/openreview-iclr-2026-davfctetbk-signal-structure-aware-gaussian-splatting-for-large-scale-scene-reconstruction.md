---
title: Signal Structure-Aware Gaussian Splatting for Large-Scale Scene Reconstruction
title_zh: 面向信号结构感知的大规模场景重建高斯泼溅
authors: "Weiyi Xue, Fan Lu, Chi Zhang, Tianhang Wang, Sanqing Qu, Zehan Zheng, Boyuan Zheng, Junqiao Zhao, Guang Chen"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=DavFcTeTbK"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 3D高斯泼溅用于大规模场景重建和新视角合成
tldr: 针对3D高斯泼溅在大规模场景重建中因稀疏初始点导致过度密集化和冗余基元的问题，本文提出信号结构感知的高斯泼溅方法。传统调度策略硬编码，不能自适应感知场景信号频率，而该方法通过动态调整目标信号频率和采样频率，避免用高频图像监督低频初始点引起的失控密集化。实验表明，该方法在大型场景中有效控制基元数量，提升重建质量和渲染效率，拓展了3DGS在室外大范围场景的应用能力。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 大规模场景中稀疏初始点导致过度密集化和冗余基元。
method: 提出信号结构感知的调度策略，动态调节频率以控制密集化。
result: 减少了冗余基元，提高了重建质量和效率。
conclusion: 该方法使3DGS适用于大规模场景重建。
---

## Abstract
3D Gaussian Splatting has demonstrated remarkable potential in novel view synthesis. In contrast to small-scale scenes, large-scale scenes inevitably contain sparsely observed regions with excessively sparse initial points. In this case, supervising Gaussians initialized from low-frequency sparse points with high-frequency images often induces uncontrolled densification and redundant primitives, degrading both efficiency and quality. Intuitively, this issue can be mitigated with scheduling strategies, which can be categorized into two paradigms: modulating target signal frequency via densification and modulating sampling frequency via image resolution. However, previous scheduling strategies are primarily hardcoded, failing to perceive the convergence behavior of the scene frequency. To address this, we reframe scene reconstruction problem from the perspective of signal structure recovery, and propose SIG, a novel scheduler that Synchronizes Image supervision with Gaussian frequencies. Specifically, we derive the average sampling frequency and bandwidth of 3D representations, and then regulate the training image resolution and the Gaussian densification process based on scene frequency convergence. Furthermore, we introduce Sphere-Constrained Gaussians, which leverage the spatial prior of initialized point clouds to control Gaussian optimization. Our framework enables frequency-consistent, geometry-aware, and floater-free training, achieving state-of-the-art performance with a substantial margin in both efficiency and rendering quality in large-scale scenes.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景**：3D高斯泼溅（3D Gaussian Splatting，3DGS）在新视角合成（Novel View Synthesis）领域展现出卓越潜力。然而，与中小规模场景不同，**大规模场景**（如城市级、街区级）中不可避免地存在大量稀疏观测区域，初始点云（来自COLMAP等SfM方法）极为稀疏。

**核心问题**：当用**高频图像**去监督从**低频稀疏点**初始化得到的高斯图元时，会产生**不受控的密集化（uncontrolled densification）** 和**大量冗余基元（redundant primitives）** ，导致渲染质量和效率双双下降。传统调度策略虽可缓解此问题，但都是**硬编码（hardcoded）** 的，无法感知场景频率的收敛行为。

**整体含义**：论文将场景重建重新定义为**信号结构恢复（signal structure recovery）** 问题，核心目标是让3DGS能够“自适应地”根据场景信号频率的演化来调整训练过程，从而使3DGS真正适用于大规模场景重建。


## 二、方法论

### 2.1 核心思想

论文提出**SIG（Synchronizes Image supervision with Gaussian frequencies）调度器**，核心逻辑是：**让图像监督的频率与高斯表示的频率保持同步**——低频阶段用低分辨率图像恢复整体结构，高频阶段用高分辨率图像细化纹理。

### 2.2 关键技术细节

**（1）高斯表示的平均频率定义**

论文从信号处理角度出发，数学定义了3D高斯表示的平均采样频率和有效场景带宽。将每个高斯基元的频率近似为其半功率带宽（3dB带宽），进而估计整个场景的平均频率。该频率值在训练过程中逐迭代更新，作为分辨率调度的依据。

**（2）频率对齐的分辨率调度器**

基于场景频率的收敛行为动态调整训练图像分辨率。当场景频率收敛趋于稳定时，自动提升图像分辨率以引入更高频的监督信号。该策略避免了一开始就用高频图像监督低频高斯导致的失控密集化。

**（3）阶段性密集化调度器**

每次分辨率提升后，执行多轮密集化操作。这种“先升分辨率、再密集化”的耦合策略，确保高斯图元数量与当前可恢复的信号频率相匹配，防止早期过度密集化。

**（4）球约束高斯（Sphere-Constrained Gaussians）**

利用初始化点云的空间先验来控制高斯优化。具体做法是：为每个高斯赋予**锚点（anchor）** 和**最大偏移量（max_offset）** 属性；当高斯当前位置偏离锚点超过球约束半径时，该高斯被裁剪（prune）。这种空间感知的优化有效减少了浮点数（floaters）和冗余基元。

**（5）训练流程**

整体采用**由粗到细（coarse-to-fine）** 的大规模场景重建流程：
1. 训练一个粗粒度全局高斯模型
2. 利用粗模型将场景划分为空间块（spatial blocks）
3. 对每个块从低分辨率开始训练，自适应提升分辨率
4. 合并各块高斯得到融合模型
5. 渲染验证视图并计算评估指标

### 2.3 算法流程（文字说明）

SIG调度器在每个训练迭代中计算场景的平均频率及其变化梯度。当频率梯度低于预设阈值时，判定当前分辨率下的信号已充分收敛，随即提升图像分辨率并触发阶段性密集化。与此同时，球约束机制持续监控每个高斯的位置偏移，将超出约束范围的高斯及时裁剪。整个流程形成一个“频率感知—分辨率调整—密度控制—空间约束”的闭环。


## 三、实验设计

### 3.1 使用的数据集与场景

论文在大规模场景数据集上进行评估，包括**城市级室外场景**（如“rubble”等典型大规模场景）。具体场景类型涵盖无人机航拍场景、自动驾驶场景等真实世界大规模环境。

### 3.2 Benchmark与对比方法

**对比基线分为两类**：

- **NeRF-based方法**：Mega-NeRF、SwitchNeRF
- **3DGS-based方法**：VastGS、CityGS、DOGS、BlockGS
- **调度策略对比**：DashGS（一种硬编码调度策略）

### 3.3 评估指标

使用**SSIM、PSNR、LPIPS**三项标准指标，并对所有方法应用色彩校正后计算指标。


## 四、资源与算力

论文明确指出：**所有方法均在NVIDIA RTX 4090 GPU上训练和评估**。

但对于GPU数量、总训练时长、显存占用等具体算力细节，**论文正文中未做详细披露**。GitHub仓库提到，原始实现将所有训练图像以多分辨率缓存，需要**大量GPU显存，不适合RTX 4090这类消费级GPU**；重构版本对此进行了优化。

训练迭代次数方面：**粗阶段和细阶段各使用30,000次迭代**。


## 五、实验数量与充分性

### 5.1 实验组成

从可获取信息来看，论文至少包含以下实验：

- **主要对比实验**：在多个大规模场景上与6种以上基线方法对比（Table 1和Table 3）
- **模型变体实验**：通过调整密集化梯度阈值，产生两种高斯数量的变体（Ours和Ours-L），展示算法性能上限
- **消融实验**：论文提及“spectral ablations”（频谱消融），说明对频率相关组件进行了消融分析

### 5.2 充分性评价

整体来看，实验设计**较为充分**：对比了NeRF和3DGS两大技术路线的主流方法，覆盖了PSNR、SSIM、LPIPS等多维度指标，并提供了不同高斯数量的变体结果。但受限于可获取的论文全文信息，**消融实验的具体设置、各场景的详细数值结果等无法逐一核实**。


## 六、主要结论与发现

1. **质量提升显著**：论文方法在多个基准测试上取得了全面改进，例如在“rubble”场景中PSNR提升**+0.9 dB**。

2. **训练加速明显**：每块的训练速度提升**1.5倍**。

3. **频率一致性训练**：通过SIG调度器实现了频率一致的信号恢复，从根本上避免了低频高斯被高频图像“带偏”的问题。

4. **几何感知与无浮点数**：球约束高斯机制有效减少了浮点数（floaters），使训练过程更加几何稳定。

5. **拓展了3DGS的应用边界**：证明了3DGS在经过频率感知和结构约束增强后，能够高效高质量地应用于**室外大范围场景重建**。


## 七、优点

1. **问题定位精准**：从信号处理视角重新审视3DGS在大规模场景中的失效机制，诊断出“频率不匹配”这一根本原因，而非仅仅针对表象做修补。

2. **方法创新性较强**：首次数学定义了3D高斯表示的平均频率，并据此设计自适应调度器，告别了传统硬编码策略。

3. **训练流程完整**：从粗粒度全局建模、场景分块、自适应分辨率训练到模型融合，形成了一套完整的大规模场景重建pipeline。

4. **代码开源**：官方PyTorch实现已在GitHub公开，有利于领域内复现和后续研究。

5. **ICLR 2026接收**：论文获评**10.0分**，表明评审对其质量高度认可。


## 八、不足与局限

1. **算力需求未明确披露**：论文未详细说明训练所需的具体GPU数量、总时长和显存占用，使得实际复现的成本评估存在不确定性。GitHub仓库也承认原始实现显存需求较高。

2. **消费级GPU兼容性问题**：原始实现将所有训练图像以多分辨率缓存，不适合RTX 4090等消费级GPU；虽然重构版本有所优化，但性能“略低于原始实现”。

3. **依赖COLMAP初始化**：球约束机制依赖COLMAP提供的初始点云作为结构先验，在COLMAP重建质量较差的场景中可能效果受限。

4. **实验细节披露有限**：受限于可获取的论文片段，各数据集的具体规模、各场景的详细数值结果、完整的消融实验设置等信息未能全面获取。

5. **大规模场景的通用性验证**：虽然方法针对大规模场景设计，但具体覆盖的场景类型（如是否包含不同城市风格、不同采集条件等）在现有信息中不够详尽。


（完）
