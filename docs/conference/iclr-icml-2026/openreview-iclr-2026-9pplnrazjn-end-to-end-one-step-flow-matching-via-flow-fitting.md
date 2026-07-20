---
title: End-to-End One Step Flow Matching via Flow Fitting
title_zh: 基于流拟合的端到端单步流匹配
authors: "Hamadi Chihaoui, Paolo Favaro"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=9PpLnRAZjN"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 通过连续轨迹拟合实现单步流匹配生成
tldr: 本文提出FlowFit生成模型，通过学习从噪声到数据的连续流轨迹，在训练时拟合时间参数化函数基，推理时仅需终端时刻单步求值，实现高质量单阶段训练和单步生成，大幅降低计算成本。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 扩散和流匹配模型多步采样计算成本高，亟需单步高效生成。
method: 拟合时间参数化的函数基来近似完整连续流轨迹，推理时仅用终端时刻。
result: 实现单步高质量生成，显著减少推理时间。
conclusion: FlowFit提供了一种高效的单步生成新范式。
---

## Abstract
Diffusion and flow-matching models have demonstrated impressive performance in generating diverse, high-fidelity images by learning transformations from noise to data. However, their reliance on multi-step sampling requires repeated neural network evaluations, leading to high computational cost. We propose FlowFit, a family of generative models that enables high-quality sample generation through both single-phase training and single-step inference. FlowFit learns to approximate the continuous flow trajectory between latent noise (x_0) and data (x_1) by fitting a basis of functions parameterized over time (t \in [0, 1]) during training. At inference time, sampling is performed by simply evaluating the flow only at the terminal time (t = 1), avoiding iterative denoising or numerical integration. Empirically, FlowFit outperforms prior diffusion-based single-phase training methods achieving superior sample quality.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

扩散模型与流匹配模型在高质量图像生成方面表现优异，但其推理过程依赖多步采样，需要反复执行神经网络前向传播，导致计算成本高昂。

**FlowFit** 的核心目标是在**不牺牲生成质量**的前提下，**同时实现单阶段训练和单步推理**，从根本上规避传统方法中迭代去噪或数值积分带来的计算负担。该论文投稿至 **ICLR 2026**，最终状态为 **Rejected**，评分 **8.0**。

## 二、方法论

### 核心思想

FlowFit 通过学习从潜变量噪声 $x_0$ 到数据 $x_1$ 的**连续流轨迹**，在训练阶段拟合一组随时间 $t \in [0,1]$ 参数化的函数基。推理时，只需在终端时刻 $t=1$ 对流进行一次求值即可完成采样。

### 关键技术细节

训练过程采用**双模型协同训练**的框架：

1. **速度场模型 $v_{\theta'}$** ：采用条件流匹配（Conditional Flow Matching, CFM）目标进行训练。对于采样得到的噪声 $x_0 \sim \mu_0$、数据 $x_1 \sim \mu_1$ 和时间 $t \sim \mathcal{U}[0,1]$，定义插值路径 $\tilde{x}_t = (1-t)x_0 + tx_1$，优化目标为最小化速度场预测与真实速度 $(x_1 - x_0)$ 之间的均方误差。

2. **流函数模型 $\psi_\theta$** ：通过一致性损失进行训练，约束其时间导数 $\frac{d\psi_\theta}{dt}(x_0,t)$ 与速度场 $v_{\theta'}(\psi_\theta(x_0,t),t)$ 保持一致。

训练过程中，时间窗口参数 $\alpha_t$ 逐步增大至 1。推理时直接计算 $\psi_\theta(x_0, 1)$ 即可获得生成结果，无需任何迭代过程。

## 三、实验设计

### 数据集与场景

- **无条件图像生成**：CelebAHQ-256 数据集
- **类别条件生成**（补充材料中）：ImageNet-256

### 基准模型与对比方法

所有模型均采用**相同骨干网络架构 DiT-B**（扩散 Transformer），从零开始训练以确保公平性。对比方法分为两大类：

| 类别 | 代表方法 |
|------|----------|
| **两阶段蒸馏模型** | 标准扩散模型、Flow Matching、Reflow、Progressive Distillation、Consistency Distillation |
| **端到端单阶段模型** | Consistency Training |

其中，Reflow 在 CelebAHQ 上使用教师模型生成 5 万对合成数据，每样本需 128 次前向传播；Progressive Distillation 从有分类器引导的教师模型出发，迭代蒸馏一系列学生模型。

### 训练配置

- **优化器**：AdamW，恒定学习率 $4 \times 10^{-5}$，无权重衰减
- **迭代次数**：500K
- **函数基**：8 阶多项式基（Polynomial basis with order 8）
- **潜空间**：sd-vae-ft-mse 自编码器

## 四、资源与算力

论文**未明确说明**所使用的 GPU 型号、数量及具体训练时长。仅提及所有模型均在一致条件下训练，使用相同的骨干架构和优化配置。

## 五、实验数量与充分性

### 实验规模

论文在 **2 个数据集**（CelebAHQ-256 主实验 + ImageNet-256 补充实验）上进行了验证。对比了 **6 种以上**基线方法，涵盖蒸馏类和端到端类两大流派。

### 充分性与公平性评估

- **积极方面**：所有模型采用相同骨干网络、相同训练配置、相同潜空间，从零开始训练，对比设计较为公平。
- **局限性**：实验覆盖的数据集规模偏小（CelebAHQ-256 分辨率较低），缺少在更大规模数据集（如更高分辨率 ImageNet）或更复杂任务（如文本到图像生成）上的验证。作为一篇投稿至 ICLR 的论文，实验规模与当前生成模型领域的常规标准相比略显单薄。

## 六、论文的主要结论与发现

1. FlowFit 在**单步推理**条件下，生成质量超越了先前的基于扩散的**单阶段训练方法**。
2. FlowFit 的生成质量**与需要多阶段训练的渐进蒸馏方法持平**。
3. 该方法成功实现了**单阶段训练 + 单步推理**的统一框架，显著缩小了与复杂蒸馏方法之间的性能差距。

## 七、优点

1. **端到端单阶段训练**：无需依赖预训练的教师模型，简化了训练流程和实现复杂度。
2. **单步推理**：推理时仅需一次网络求值，避免了迭代去噪或数值积分，大幅降低计算成本。
3. **统一框架**：将流匹配的连续轨迹学习与单步生成有机结合，提供了一个简洁而高效的新范式。
4. **公平的实验设计**：所有对比方法采用统一的骨干网络和训练配置，增强了结果的可比性。

## 八、不足与局限

1. **数据集规模有限**：主实验仅在 CelebAHQ-256 上进行，缺少在高分辨率、大规模数据集上的充分验证。
2. **算力信息缺失**：未报告具体的 GPU 型号、数量和训练时长，不利于复现和成本评估。
3. **方法泛化性未充分验证**：除图像生成外，未探索在其他模态（如视频、3D、文本）上的适用性。
4. **投稿状态为 Rejected**：尽管评分达到 8.0，但论文最终未被 ICLR 2026 接收，说明评审过程中可能存在未被当前摘要信息覆盖的深层次问题。
5. **理论基础细节不足**：当前可获取的文本中，关于函数基选择的理论依据、收敛性保证等缺乏深入阐述。

（完）
