---
title: "GenCoGS: Generative Completion-based 3D Gaussian Splatting for High-Fidelity Few-Shot Novel View Synthesis"
title_zh: GenCoGS：基于生成补全的3D高斯泼溅高保真少样本新视图合成
authors: "Junao Shen, Haojie Dong, Tian Feng, Ruihong Ye, Wenjie Wang, Yuandong Zhang, Tianjia Shao"
date: 2025-09-15
pdf: "https://openreview.net/pdf?id=piylyBPSau"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 基于生成补全的3D高斯泼溅用于少样本新视图合成
tldr: 少样本新视图合成中，3D高斯泼溅因训练视图有限，常导致未观测区域表示不足和浮点伪影。本文提出GenCoGS，采用生成式点云补全策略初始化3DGS，并在优化中持续补全场景，有效提升高保真渲染，在稀疏输入下显著减少伪影并保持细节。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 克服少样本下3DGS对有限视图的过度依赖和场景补全不足。
method: 生成式点云补全初始化3DGS，并在优化中持续补全未观察区域。
result: 显著减少浮点伪影，在稀疏视图下实现高保真新视图合成。
conclusion: 生成补全策略有效增强少样本3DGS的泛化能力和渲染质量。
---

## Abstract
Conventional few-shot novel view synthesis (NVS) methods using 3D Gaussian Splatting (3DGS) have demonstrated significance, but remain constrained by their overdependence on the limited information from training views. Their unsatisfactory scene completion capability would underrepresent those scene regions either unobserved in training views or with local details and thus cause floating artifacts against high fidelity.
To address these challenges, we propose GenCoGS, a unified 3DGS-based few-shot NVS method focusing on initializing and optimizing 3DGS representation using generative completion-based strategies to enhance scene completion.
Specifically, our generative point cloud completion-based strategy produces and filters complementary points toward a complete point cloud with refined structural and appearance information for Gaussian initialization;
The generative pseudo view completion-based strategy leverages an image-to-video diffusion model to synthesize complete pseudo views, which benefits Gaussian optimization especially within unobserved scene regions and mitigates hallucination for less appearance distortion. 
Integrating both strategies enables accurate and coherent scene completion for high-fidelity few-shot NVS.
Extensive experiments on three benchmark datasets demonstrate the superiority of our GenCoGS for few-shot NVS evaluated in common metrics compared to baseline methods. Compared to those 3DGS-based few-shot NVS methods, our GenCoGS achieves improvements of up to $2.40$dB, $0.08$ and $0.125$ in PSNR, SSIM and LPIPS.

---

## 论文详细总结（自动生成）

# GenCoGS 论文深度分析总结

## 一、核心问题与整体含义（研究动机与背景）

少样本新视图合成（Few-shot Novel View Synthesis, NVS）旨在从稀疏的训练视图（例如仅 3 张图像）中重建场景并生成未观测视角的逼真图像。基于 3D 高斯泼溅（3D Gaussian Splatting, 3DGS）的少样本 NVS 方法虽已展现出一定潜力，但存在一个根本性瓶颈：**对有限训练视图信息的过度依赖导致场景补全能力不足**。

具体而言，当训练视图极度稀疏时，3DGS 模型会严重过拟合可见区域，而对未观测区域或局部细节的表征严重不足，最终在渲染结果中产生大量**浮点伪影（floating artifacts）**，严重损害合成质量。GenCoGS 的提出正是为了突破这一局限，核心思路是**通过生成式补全策略来增强 3DGS 的场景补全能力**，从而实现高保真的少样本新视图合成。

> **论文状态**：ICLR-2026 投稿，状态为 Rejected-Public。


## 二、方法论：核心思想与关键技术

GenCoGS 提出了一套统一的 3DGS 少样本 NVS 框架，核心创新在于将**生成式补全**同时引入高斯初始化和高斯优化两个阶段。

### 2.1 整体流程

GenCoGS 包含两大核心策略：

1. **生成式点云补全高斯初始化（GCGI, Generative point cloud Completion-based Gaussian Initialization）**
2. **生成式伪视图补全高斯优化（GCGO, Generative pseudo view Completion-based Gaussian Optimization）**

### 2.2 GCGI：生成式点云补全初始化

传统 3DGS 通常从 Structure-from-Motion（SfM）生成的稀疏点云初始化高斯椭球。在少样本场景下，SfM 点云极其稀疏且包含大量缺失区域。GCGI 策略的核心操作包括：

- **CPG（Complementary Point Generation）模块**：基于初始稀疏点云生成互补点，补全未观测区域的结构信息；
- **CPF（Complementary Point Filtering）模块**：对生成的互补点进行过滤，剔除离群点，避免引入幻觉。

两者协同工作，将稀疏的初始点云转化为结构完整、外观信息丰富的完整点云，为高斯初始化提供高质量的几何先验。

### 2.3 GCGO：生成式伪视图补全优化

在 3DGS 优化过程中，未观测区域缺乏有效的监督信号，容易产生空洞和浮点伪影。GCGO 策略的核心机制包括：

- 利用 **Image-to-Video（I2V）扩散模型**生成完整的伪视图，为未观测区域提供额外的优化监督；
- 从**扰动相机轨迹**中采样伪视图的相机位姿，相比随机采样能更好地覆盖未观测区域；
- 引入 **L_GC 损失函数**，专注于减少生成模型的幻觉效应。

值得注意的是，论文发现了一个**跷跷板效应（see-saw effect）**：生成模型在覆盖更多未观测区域时会产生更严重的幻觉，因此需要在探索范围与生成保真度之间取得平衡。


## 三、实验设计

### 3.1 数据集与场景

论文在 **三个基准数据集**上进行了广泛实验：

- **LLFF（Local Light Field Fusion）** ：真实场景数据集，常用于少样本 NVS 评估；
- **Mip-NeRF360**：包含复杂室内外场景的数据集；
- **DTU**：多视图立体视觉基准数据集。

### 3.2 对比方法

对比了代表性的 **3DGS 基线的少样本 NVS 方法**，具体方法名称在摘要和正文中未逐一列出，但涵盖了该领域的主流 baseline。

### 3.3 评估指标

采用新视图合成的标准评价指标：
- **PSNR**（峰值信噪比）
- **SSIM**（结构相似性）
- **LPIPS**（学习感知图像块相似度）


## 四、资源与算力

**论文未明确说明**所使用的 GPU 型号、数量或训练时长等具体算力信息。关于代码和模型的开源计划，论文表示“源代码将在论文接收后以开源协议公开发布”，但当前尚未公开。


## 五、实验数量与充分性

### 5.1 实验数量

论文开展了多组实验，主要包括：

1. **主实验**：在三个数据集上与 baseline 方法的全面对比；
2. **消融实验（Ablation Studies）** ：在 LLFF 数据集的 3 视图设置下进行，具体包括：
   - GCGI 策略的独立贡献评估（Table 4）；
   - GCGO 策略的独立贡献评估（Table 4）；
   - 两种策略组合的效果验证（Table 4）；
   - 伪视图相机采样策略（随机 vs. 相机轨迹）的对比（Table 5）；
   - L_GC 损失的消融（Table 5）；
   - CPG 和 CPF 两个模块的消融（Table 6）；
   - 输入点云质量退化（随机采样 1/4 点）下的鲁棒性测试（Table 6）。

### 5.2 充分性与客观性评估

**充分性**：实验设计较为全面，涵盖了策略级消融、模块级消融、超参数分析（伪视图采样策略、损失函数）以及鲁棒性测试，层次分明。

**客观性与公平性**：
- 使用了三个标准公开数据集，避免了数据集选择偏差；
- 采用 NVS 领域通用的 PSNR、SSIM、LPIPS 指标，具有可比性；
- 在 LLFF 的 3 视图设置下进行消融，控制变量清晰。

**潜在不足**：由于论文正文信息有限，无法确认是否在所有三个数据集上都进行了完整的消融实验，还是仅在 LLFF 上进行了消融。此外，对比方法的选取范围和具体实现细节在提供的文本中不够详尽。


## 六、主要结论与发现

1. **定量提升显著**：与 3DGS 基线的少样本 NVS 方法相比，GenCoGS 在 PSNR 上最高提升 **2.40 dB**，SSIM 提升 **0.08**，LPIPS 降低 **0.125**。

2. **双策略协同有效**：GCGI 和 GCGO 策略各自都能独立提升性能，两者组合效果最佳。在 LLFF 3 视图设置下，完整方法达到 PSNR **22.13**、SSIM **0.762**、LPIPS **0.164**。

3. **GCGI 策略贡献**：单独采用 GCGI 带来 PSNR 提升 0.66 dB、SSIM 提升 0.024；CPG 和 CPF 模块在点云质量退化时仍能稳定贡献改进，体现了较强的泛化能力和鲁棒性。

4. **GCGO 策略贡献**：单独采用 GCGO 带来 PSNR 提升 0.86 dB；从扰动相机轨迹采样的伪视图优于随机采样；L_GC 损失能有效减少生成模型幻觉。

5. **场景补全能力增强**：GenCoGS 有效减少了浮点伪影和空洞，在未观测区域实现了更完整的场景重建。


## 七、优点（亮点）

### 7.1 方法创新层面

- **首次将生成式补全系统性地融入 3DGS 的全流程**（初始化 + 优化），而非仅在单一阶段修补；
- **GCGI 策略**通过生成+过滤的闭环设计，在补全点云的同时有效抑制幻觉引入；
- **GCGO 策略**巧妙利用 I2V 扩散模型的时间一致性能力生成伪视图，并设计扰动相机轨迹采样策略以最大化未观测区域的覆盖；
- 识别并处理了生成模型幻觉与场景探索之间的**跷跷板效应**，体现了对问题本质的深入理解。

### 7.2 实验与评估层面

- 消融实验设计系统且层次清晰（策略级 → 模块级 → 超参数级）；
- 在点云质量退化的极端条件下验证了方法的鲁棒性；
- 提供了补充材料中的视频定性可视化。

### 7.3 可复现性

- 论文提供了详细的方法描述和超参数配置；
- 承诺代码开源。


## 八、不足与局限

### 8.1 实验覆盖层面

- **数据集范围有限**：仅涵盖 LLFF、Mip-NeRF360 和 DTU，未涉及更大规模或更具挑战性的少样本 NVS 数据集（如 MVImgNet）；
- **训练视图数量**：消融实验主要在 3 视图设置下进行，对不同稀疏程度（如 6 视图、9 视图）的系统性对比分析在提供文本中不够充分；
- **对比方法**：具体对比了哪些 baseline 方法未在摘要中明确列出，不利于读者快速评估对比的全面性。

### 8.2 技术与应用限制

- **依赖预训练生成模型**：GCGO 策略依赖 I2V 扩散模型，其生成质量直接影响伪视图的可靠性，在域外场景中可能存在泛化风险；
- **计算开销**：引入生成模型（点云补全 + I2V 扩散）会增加额外的推理和优化成本，论文未量化这一开销；
- **跷跷板效应的调参依赖**：需要手动设置平衡参数 A（文中设为 2.0），在不同场景下可能需要重新调整。

### 8.3 信息缺失

- **算力信息未披露**：GPU 型号、数量、训练时长等关键复现信息缺失；
- **具体对比方法未列出**：摘要中仅泛称“baseline methods”。

### 8.4 论文状态

- 该论文为 **ICLR-2026 Rejected** 状态，意味着其方法或实验设计可能存在评审未认可的更深层问题。

---

（完）
