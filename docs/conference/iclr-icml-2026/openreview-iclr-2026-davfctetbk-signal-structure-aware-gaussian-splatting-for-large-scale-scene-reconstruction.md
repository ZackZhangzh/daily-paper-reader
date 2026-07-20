---
title: Signal Structure-Aware Gaussian Splatting for Large-Scale Scene Reconstruction
title_zh: 信号结构感知的高斯泼溅用于大规模场景重建
authors: "Weiyi Xue, Fan Lu, Chi Zhang, Tianhang Wang, Sanqing Qu, Zehan Zheng, Boyuan Zheng, Junqiao Zhao, Guang Chen"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=DavFcTeTbK"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 大规模场景重建使用3DGS
tldr: 针对大规模场景重建中稀疏初始化点导致的高频监督失控密集化问题，本文提出信号结构感知的高斯泼溅方法，通过自适应调制目标信号频率和采样频率，避免冗余图元，在保持渲染质量的同时显著提升效率。该方法为大规模场景的实时新视图合成提供了有效解决方案。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 大规模场景中稀疏点初始化导致不可控密集化。
method: 自适应调度策略，调制信号频率和采样频率。
result: 减少冗余图元，提升效率与重建质量。
conclusion: 自适应调度有效改善大规模场景重建性能。
---

## Abstract
3D Gaussian Splatting has demonstrated remarkable potential in novel view synthesis. In contrast to small-scale scenes, large-scale scenes inevitably contain sparsely observed regions with excessively sparse initial points. In this case, supervising Gaussians initialized from low-frequency sparse points with high-frequency images often induces uncontrolled densification and redundant primitives, degrading both efficiency and quality. Intuitively, this issue can be mitigated with scheduling strategies, which can be categorized into two paradigms: modulating target signal frequency via densification and modulating sampling frequency via image resolution. However, previous scheduling strategies are primarily hardcoded, failing to perceive the convergence behavior of the scene frequency. To address this, we reframe scene reconstruction problem from the perspective of signal structure recovery, and propose SIG, a novel scheduler that Synchronizes Image supervision with Gaussian frequencies. Specifically, we derive the average sampling frequency and bandwidth of 3D representations, and then regulate the training image resolution and the Gaussian densification process based on scene frequency convergence. Furthermore, we introduce Sphere-Constrained Gaussians, which leverage the spatial prior of initialized point clouds to control Gaussian optimization. Our framework enables frequency-consistent, geometry-aware, and floater-free training, achieving state-of-the-art performance with a substantial margin in both efficiency and rendering quality in large-scale scenes.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机与背景**：3D Gaussian Splatting（3DGS）在新视图合成任务中展现出显著潜力。然而，当应用于大规模场景时，面临一个根本性矛盾：大规模场景中不可避免地存在稀疏观测区域，其初始点云极为稀疏。从低频稀疏点初始化的高斯图元，直接受到高频图像监督时，会引发不可控的密集化（uncontrolled densification）和大量冗余图元，同时损害重建效率与质量。

**问题的本质**：论文将场景重建重新框架为**信号结构恢复**问题。已有调度策略可分为两类范式——通过密集化调制目标信号频率，以及通过图像分辨率调制采样频率——但它们均为硬编码（hardcoded）策略，无法感知场景频率的收敛行为。核心问题是：何时应该提高分辨率、何时应该执行密集化？理想情况下，只有当当前层级的高斯编码达到最大可恢复频率（即奈奎斯特频率）时，才应提高分辨率以引导高频细节恢复。


## 二、方法论

**核心思想**：提出 **SIG（Synchronizes Image supervision with Gaussian frequencies）** 调度器，实现图像监督与高斯频率的同步。核心逻辑是从信号处理视角统一调度分辨率和密集化过程——低分辨率用于结构恢复，高分辨率用于纹理细化。

**关键技术细节**：

1. **频率量化与自适应调度**：论文首先数学推导了3D高斯表示的平均采样频率和带宽，然后基于场景频率的收敛状态，动态调控训练图像分辨率和高斯密集化过程。分辨率仅在当前层级训练不再产生显著改进时才提高。

2. **球面约束高斯（Sphere-Constrained Gaussians）** ：利用初始化点云的空间先验来约束高斯优化，将所有高斯限制在基于密度先验的球面范围内，减少冗余并保留场景结构。

3. **训练流程**：采用从粗到细的大规模高斯重建流程：
   - 训练粗粒度的全局高斯模型
   - 将场景划分为空间块（spatial blocks）
   - 从低分辨率开始逐块训练，自适应提高分辨率
   - 合并各块高斯为融合模型
   - 渲染验证视图并计算指标

4. **阶段性密集化**：将密集化与分辨率变化耦合，避免高斯过早受到高频监督的过度优化。


## 三、实验设计

**数据集**：在三个数据集上评估：
- **Mill19**（真实世界）
- **UrbanScene3D**（真实世界）
- **MatrixCity**（合成）

**评估指标**：SSIM、PSNR、LPIPS

**对比方法**：与大规模场景重建方法对比，包括VastGaussian等。基线为vanilla 3DGS。

**验证实验**（至少包含以下维度）：
- 验证采样频率（图像分辨率）与信号带宽之间的关系
- 在不同分辨率下重建场景的对比实验
- 对比硬编码调度策略（如DashGS、TamingGS）


## 四、资源与算力

文中明确说明：**所有方法均在NVIDIA RTX 4090 GPU上训练和评估**。

**未明确说明**：具体训练时长、使用的GPU数量、总计算开销等细节在摘要和可见段落中未给出。GitHub仓库提及原始实现对多分辨率图像的缓存需要大量GPU内存，不适合RTX 4090等消费级GPU——暗示原始版本的资源需求较高，但未提供精确数字。


## 五、实验数量与充分性

从可见信息判断：

- **数据集覆盖**：3个数据集（2个真实世界 + 1个合成），覆盖不同规模和类型的大规模场景
- **对比基线**：与vanilla 3DGS及多种大规模场景重建方法对比
- **消融/验证实验**：包含分辨率与信号带宽关系的验证实验

**充分性评估**：
- 论文被ICLR 2026接收且评分8.0，表明审稿人认为实验设计整体充分、客观
- 但用户提供的文本有限，消融实验的具体数量、统计显著性检验等细节无法从现有材料中确认


## 六、主要结论与发现

1. **性能提升显著**：在多个基准测试中实现了质量与效率的双重提升——PSNR提升**+0.9 dB**，每块训练速度提升**1.5倍**

2. **频率一致性训练**：通过SIG调度器实现了频率一致的训练，避免低频初始化高斯被高频图像过早“催熟”

3. **几何感知与无漂浮物**：球面约束高斯有效减少了漂浮物（floaters），使训练更具几何感知能力

4. **SOTA性能**：在大规模场景中实现了**显著优于此前方法**的渲染质量和效率


## 七、优点（亮点）

1. **问题视角新颖**：从**信号处理**（采样频率与信号带宽）角度重新审视3DGS训练调度问题，而非仅靠经验调参

2. **自适应而非硬编码**：SIG根据场景频率的实际收敛状态动态调整，克服了硬编码策略“一刀切”的局限

3. **统一框架**：将分辨率调度与密集化调度统一在同一信号理论框架下处理

4. **几何先验的有效利用**：球面约束高斯充分利用了点云的空间结构先验，而非完全依赖数据驱动

5. **代码开源**：官方PyTorch实现已公开，且对消费级GPU进行了可用性优化


## 八、不足与局限

1. **资源需求仍较高**：原始实现需缓存多分辨率训练图像，对GPU内存要求极高；重构版本虽改善了可用性，但性能略有下降

2. **实验细节披露有限**：用户提供的文本中，训练时长、GPU数量、消融实验的具体设置等细节未见明确说明

3. **场景类型覆盖**：虽然覆盖了Mill19、UrbanScene3D和MatrixCity，但大规模室外场景的多样性（如不同城市风格、光照条件、季节变化）是否充分覆盖尚不明确

4. **对比方法的时效性**：对比方法包括VastGaussian等，但大规模3DGS领域发展迅速，是否涵盖最新最强基线需进一步确认

5. **应用限制**：方法依赖COLMAP初始化点云，在纹理匮乏或结构缺失区域，初始化质量可能成为瓶颈

（完）
