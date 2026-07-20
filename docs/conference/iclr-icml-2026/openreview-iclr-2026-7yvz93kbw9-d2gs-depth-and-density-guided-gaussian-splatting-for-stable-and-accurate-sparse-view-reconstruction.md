---
title: "D$^2$GS: Depth-and-Density Guided Gaussian Splatting for Stable and Accurate Sparse-View Reconstruction"
title_zh: D^2GS：深度密度引导的高斯泼溅用于稳定精确的稀疏视图重建
authors: "Meixi Song, Xin Lin, Dizhe Zhang, Haodong Li, Xiangtai Li, Bo Du, Lu Qi"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=7yvz93kBw9"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 基于深度密度引导的3D高斯泼溅稀疏视图新视角合成
tldr: 本文针对3D高斯泼溅在稀疏视图条件下过拟合和欠拟合两个关键失效模式，提出D^2GS框架，采用深度密度引导的丢弃策略自适应掩盖冗余高斯，并结合距离感知融合，实现稳定准确的新视角合成。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS易过拟合近处和欠拟合远处区域。
method: 提出深度密度引导丢弃和距离感知融合两个核心组件。
result: 在稀疏输入下显著提升新视角合成的稳定性和准确性。
conclusion: D^2GS有效解决了稀疏视图3DGS的关键瓶颈。
---

## Abstract
Recent advances in 3D Gaussian Splatting (3DGS) enable real-time, high-fidelity novel view synthesis (NVS) with explicit 3D representations. However, performance degradation and instability remain significant under sparse-view conditions. In this work, we identify two key failure modes under sparse-view conditions: overfitting in regions with excessive Gaussian density near the camera, and underfitting in distant areas with insufficient Gaussian coverage. To address these challenges, we propose a unified framework \modelname{}, comprising two key components: a Depth-and-Density Guided Dropout strategy that suppresses overfitting by adaptively masking redundant Gaussians based on density and depth, and a Distance-Aware Fidelity Enhancement module that improves reconstruction quality in under-fitted far-field areas through targeted supervision. Moreover, we introduce a new evaluation metric to quantify the stability of learned Gaussian distributions, providing insights into the robustness of the sparse-view 3DGS. Extensive experiments on multiple datasets demonstrate that our method significantly improves both visual quality and robustness under sparse view conditions. The source code and trained models will be made publicly available.

---

## 论文详细总结（自动生成）

# D²GS：深度密度引导的高斯泼溅用于稳定精确的稀疏视图重建——论文总结

## 1. 核心问题与整体含义（研究动机与背景）

- **研究背景**：3D高斯泼溅（3DGS）作为一种显式3D表示方法，能够实现实时、高保真的新视角合成（NVS）。然而，现有方法在密集多视图设置下表现良好，但在实际场景中获取如此密集的输入视图往往不切实际，因此稀疏视图重建任务日益受到关注。
- **核心问题**：论文识别出稀疏视图条件下3DGS存在的**两大失效模式**：
  1. **过拟合**：相机近处高斯密度过高的区域出现过度重建，产生密集、带锯齿的高斯分布和渲染伪影；
  2. **欠拟合**：远处区域因高斯覆盖不足而导致重建质量下降。
- **现有方法的局限**：已有工作采用统一丢弃（uniform dropout）策略来减少过重建，但论文指出这种**无差别丢弃会同时伤害已拟合良好和欠拟合的区域**，反而降低关键区域的重建质量。
- **整体含义**：本文旨在**针对性地**解决稀疏视图下3DGS的过拟合与欠拟合问题，而非采用一刀切的解决方案，从而提升稀疏输入下新视角合成的**稳定性**与**准确性**。

## 2. 方法论：核心思想、关键技术细节

论文提出统一框架 **D²GS**，包含两个核心组件：

### 2.1 深度密度引导丢弃（Depth-and-Density Guided Dropout, DD-Drop）

- **核心思想**：根据局部密度和相机距离为每个高斯分配一个丢弃分数，指示其过拟合倾向。得分越高的高斯被丢弃的概率越大，从而抑制锯齿并提升渲染保真度。
- **关键逻辑**：该策略并非均匀丢弃，而是**自适应地**掩盖冗余高斯，在稀疏视图条件下保留关键区域的高斯表示。

### 2.2 距离感知保真度增强（Distance-Aware Fidelity Enhancement, DAFE）

- **核心思想**：通过利用深度先验增强远距离区域的监督信号，避免欠拟合。
- **关键逻辑**：对远场欠拟合区域进行**针对性监督**，提升重建质量。

### 2.3 新增评估指标

- 论文还引入了**新的评估指标**来量化学习到的高斯分布的稳定性，为稀疏视图3DGS的鲁棒性提供洞察。

### 2.4 实现流程

- **数据预处理**：首先使用SfM（Structure-from-Motion）从稀疏视图输入重建相机位姿，然后利用COLMAP的`patch_match_stereo`和`stereo_fusion`生成密集立体点云。
- **训练命令示例**（LLFF数据集，3视图）：
  ```bash
  python train.py -s dataset/nerf_llff_data/trex -m output_llff \
    --depth_weight 0.15 --density_weight 0.85 \
    --drop_min 0.05 --drop_max 0.5 \
    --mask_param 5 --lambda_far 0.5 --eval -r 8 --n_views 3
  ```
- **超参数说明**：`depth_weight`和`density_weight`控制深度与密度在丢弃分数中的权重；`drop_min`/`drop_max`控制丢弃概率的上下界；`mask_param`控制掩码的锐度参数；`lambda_far`控制远场监督的强度。

## 3. 实验设计：数据集、Benchmark与对比方法

### 3.1 使用的数据集

- **LLFF数据集**：稀疏视图设置下使用3张输入视图
- **MipNeRF-360数据集**：稀疏视图设置下使用12张输入视图

### 3.2 Benchmark与对比方法

- 论文在多个数据集上进行了**广泛实验**，对比了现有稀疏视图3DGS方法（如采用统一丢弃策略的工作）。
- 论文还通过**可视化高斯分布**（55视图 vs 3视图）来直观展示密集与稀疏设置下的差异。
- 使用**新引入的稳定性评估指标**量化模型鲁棒性。

## 4. 资源与算力

> ⚠️ **说明**：从可获取的论文内容（摘要、arXiv页面、GitHub仓库README等）中，**未明确提及**具体的GPU型号、数量或训练时长等算力信息。GitHub仓库仅说明环境依赖**CUDA 12.1**，但未提供详细的硬件配置或训练时间统计数据。如需获取完整的算力信息，建议查阅论文全文的实验设置章节。

## 5. 实验数量与充分性

### 5.1 实验规模

- 论文在**多个数据集**（LLFF、MipNeRF-360）上进行了实验。
- 提供了**所有场景**的批量训练脚本（`train_llff.sh`和`train_mipnerf360.sh`），表明实验覆盖了数据集的全部场景。

### 5.2 充分性与客观性评估

- **充分性**：覆盖了学术界的标准稀疏视图重建基准数据集（LLFF和MipNeRF-360），实验场景具有一定代表性。
- **客观性**：论文针对稀疏视图3DGS的**两大失效模式**分别设计了对应的模块（DD-Drop解决过拟合，DAFE解决欠拟合），消融设计逻辑清晰。新增的稳定性评估指标也为客观比较提供了量化依据。
- **公平性**：与现有采用统一丢弃策略的方法进行了对比，对比设置合理。但鉴于无法获取论文全文的实验结果表格，具体的定量对比细节（如PSNR、SSIM、LPIPS等指标）有待进一步确认。

## 6. 主要结论与发现

1. **问题诊断清晰**：稀疏视图下3DGS的退化源于**近处过拟合**与**远处欠拟合**两大原因。
2. **方法有效**：D²GS框架通过DD-Drop和DAFE两个模块，**针对性地**解决了上述两个问题。
3. **性能提升显著**：实验表明，D²GS在稀疏视图条件下**显著提升了视觉质量和鲁棒性**。
4. **贡献完整**：除了方法论，论文还贡献了**新的稳定性评估指标**和**可公开获取的代码与模型**。

## 7. 优点（方法与实验设计的亮点）

- **问题导向明确**：精准定位稀疏视图3DGS的两大失效模式，而非泛泛地提出新框架。
- **设计针对性强**：两个核心模块分别对应两大问题，DD-Drop**自适应**丢弃而非统一丢弃，DAFE**针对性**增强远场而非全局增强，设计思路清晰且合理。
- **评估维度创新**：引入**高斯分布稳定性**这一新评估指标，为稀疏视图3DGS的鲁棒性研究提供了新的量化视角。
- **开源可复现**：代码和训练模型将公开发布，且GitHub仓库提供了详细的安装、数据准备和训练指令。
- **工业界背景加持**：第一单位包括Insta360 Research，表明方法具有实际应用场景的支撑。
- **顶会录用**：论文被**ICLR 2026**接收，体现了学术界的认可。

## 8. 不足与局限

- **算力信息缺失**：论文公开信息中未明确报告训练所需的GPU型号、数量或时长，不利于其他研究者评估复现成本。
- **数据集覆盖有限**：实验主要集中在LLFF和MipNeRF-360两个数据集上，对于更大规模的户外场景、动态场景或真实世界稀疏采集场景的泛化性有待进一步验证。
- **依赖深度先验**：DAFE模块依赖深度先验，在深度信息不可靠或缺失的场景中可能存在性能瓶颈。
- **依赖COLMAP预处理**：数据准备阶段依赖COLMAP进行SfM和立体匹配，这引入了额外的预处理步骤和计算开销，且COLMAP本身在极端稀疏视图下可能表现不稳定。
- **全文细节待补充**：由于可获取的仅为论文摘要和部分公开信息，方法的具体公式推导、详细的消融实验设计、与更多基线方法的定量对比等细节有待查阅论文全文后进一步确认。

（完）
