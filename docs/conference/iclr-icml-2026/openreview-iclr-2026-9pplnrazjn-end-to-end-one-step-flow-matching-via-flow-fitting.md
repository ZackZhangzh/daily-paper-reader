---
title: End-to-End One Step Flow Matching via Flow Fitting
title_zh: 端到端单步流匹配：基于流拟合
authors: "Hamadi Chihaoui, Paolo Favaro"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=9PpLnRAZjN"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 单步流匹配生成模型
tldr: 扩散与流匹配模型虽生成质量高但多步采样计算昂贵，本文提出FlowFit，通过在训练时拟合随时间变化的基函数来近似噪声到数据的连续流轨迹，推理时仅需计算终端时刻流场即可一步生成样本。实验表明其在保证保真度的同时大幅降低推理开销，为实时生成提供了高效方案。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有流匹配模型推理需多步迭代，计算成本高。
method: 拟合时间参数化的基函数学习连续流轨迹，推理时仅用终端时刻一步生成。
result: 在图像生成任务上达到与多步方法相当的质量，且推理速度显著提升。
conclusion: 单步流匹配可实现高质量快速生成，拓展了流模型的应用场景。
---

## Abstract
Diffusion and flow-matching models have demonstrated impressive performance in generating diverse, high-fidelity images by learning transformations from noise to data. However, their reliance on multi-step sampling requires repeated neural network evaluations, leading to high computational cost. We propose FlowFit, a family of generative models that enables high-quality sample generation through both single-phase training and single-step inference. FlowFit learns to approximate the continuous flow trajectory between latent noise (x_0) and data (x_1) by fitting a basis of functions parameterized over time (t \in [0, 1]) during training. At inference time, sampling is performed by simply evaluating the flow only at the terminal time (t = 1), avoiding iterative denoising or numerical integration. Empirically, FlowFit outperforms prior diffusion-based single-phase training methods achieving superior sample quality.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

- **背景**：扩散模型（Diffusion Models）和流匹配模型（Flow-matching Models）在高质量图像生成方面表现优异，其核心思想是学习从噪声分布到数据分布的变换路径。
- **核心问题**：这类模型在推理阶段依赖多步采样（multi-step sampling），需要反复评估神经网络，导致计算成本高昂。
- **研究动机**：现有方法推理速度慢，限制了其在实时或资源受限场景中的应用。本文旨在设计一种既能**单阶段训练**（single-phase training）又能**单步推理**（single-step inference）的生成模型，在保证生成质量的同时大幅降低推理开销。

---

## 2. 方法论：核心思想与关键技术

- **核心思想**：FlowFit通过学习拟合一组**时间参数化的基函数**（basis of functions parameterized over time），来近似从潜变量噪声 \(x_0\) 到数据 \(x_1\) 的连续流轨迹（continuous flow trajectory）。
- **训练阶段**：
  - 在 \(t \in [0, 1]\) 的时间区间内，模型学习拟合整个流轨迹。
  - 算法流程可概括为：
    1. 初始化模型参数 \(\theta, \theta'\) 及时间窗口 \(\alpha_t\)。
    2. 定义 \(\psi_\theta(\cdot, t)\) 作为流轨迹的近似函数。
    3. 每步训练中，采样噪声 \(x_0 \sim \mu_0\)、数据 \(x_1 \sim \mu_1\) 及时间 \(t \sim \mathcal{U}[0,1]\)。
    4. 使用条件流匹配（CFM）损失训练速度场 \(v_{\theta'}\)：\(\mathcal{L}_{\mathrm{CFM}} = \| v_{\theta'}(\tilde{x}_t, t) - (x_1 - x_0) \|^2\)，其中 \(\tilde{x}_t = (1-t)x_0 + t x_1\)。
    5. 使用一致性损失训练流近似函数 \(\psi_\theta\)：\(\mathcal{L}_{\mathrm{derivative}} = \| \frac{d\psi_\theta}{dt}(x_0,t) - v_{\theta'}(\psi_\theta(x_0,t), t) \|^2\)。
    6. 逐步将 \(\alpha_t\) 增加至 1。
- **推理阶段**：采样时**仅需计算终端时刻 \(t=1\) 的流场**，直接一步生成样本，无需迭代去噪或数值积分。
- **基函数选择**：实验中使用**8阶多项式基**（Polynomial basis with order 8）。

---

## 3. 实验设计

- **数据集与场景**：
  - 主要任务：**CelebAHQ-256** 数据集上的无条件图像生成（unconditional image generation）。
  - 补充实验：**ImageNet-256** 数据集上的类别条件生成（class-conditional generation）。
- **Benchmark与对比方法**：
  - 所有模型使用**相同的骨干网络架构**——DiT-B（Diffusion Transformer）。
  - 基线方法分为两大类：
    - **两阶段训练/蒸馏类**：标准扩散模型、Flow Matching、Reflow（需教师模型生成 5 万对合成数据，每样本 128 次前向传播）、渐进蒸馏（Progressive Distillation）、一致性蒸馏（Consistency Distillation）。
    - **端到端单阶段训练类**：一致性训练（Consistency Training）。
  - 对比结果来自文献[3]的评估协议。

---

## 4. 资源与算力

- 论文**未明确说明**使用的 GPU 型号、数量或训练时长。
- 仅提及训练配置：使用 **AdamW 优化器**，学习率恒定为 \(4 \times 10^{-5}\)，无权重衰减，训练 **500K 迭代**（500,000 iterations）。
- 模型在 **sd-vae-ft-mse 自编码器的潜空间**中训练和采样。

---

## 5. 实验数量与充分性

- **实验数量**：
  - 主实验：CelebAHQ-256 无条件生成。
  - 补充实验：ImageNet-256 类别条件生成。
  - 对比了**至少 6 种基线方法**（标准扩散、Flow Matching、Reflow、渐进蒸馏、一致性蒸馏、一致性训练）。
- **充分性与公平性**：
  - **公平性较好**：所有模型从零开始训练，使用相同的实现和骨干架构。
  - **充分性有限**：仅覆盖两个数据集（CelebAHQ-256 和 ImageNet-256），缺乏更高分辨率（如 512×512）或更多样化数据集的验证；无条件生成和类别条件生成各仅一个任务，实验覆盖面较窄。
  - 论文提及补充材料中有更多结果，但正文中未展开。

---

## 6. 主要结论与发现

- FlowFit 实现了**单阶段训练 + 单步推理**的高质量生成，在实证中**优于先前基于扩散的单阶段训练方法**，达到了更优的样本质量。
- 通过拟合时间参数化基函数来近似连续流轨迹，FlowFit 在推理时**完全避免迭代去噪或数值积分**，大幅降低计算开销。
- FlowFit 在**单步生成性能上与蒸馏类方法的差距显著缩小**。

---

## 7. 优点（亮点）

- **端到端单阶段训练**：无需预训练的教师模型，训练流程简洁，避免了蒸馏方法的两阶段复杂性和额外计算成本。
- **推理极致高效**：单步生成，适合实时应用场景。
- **方法创新性**：通过拟合时间基函数来近似整条流轨迹，而非仅学习终端映射，为单步生成提供了新的技术路径。
- **实验设计公平**：严格控制变量（相同骨干、相同训练配置），对比结果具有较高可信度。

---

## 8. 不足与局限

- **实验覆盖不足**：仅验证了 CelebAHQ-256 和 ImageNet-256 两个数据集，缺乏对更高分辨率、更复杂数据分布（如 LSUN、FFHQ 等）的验证。
- **算力信息缺失**：未报告 GPU 型号、数量及训练时长，不利于复现和成本评估。
- **方法泛化性未知**：未探讨在其他模态（如文本、音频、视频）上的适用性。
- **理论分析欠缺**：摘要和可见正文中未提供对基函数选择、拟合误差界等理论保证的深入分析。
- **应用限制**：单步生成虽快，但可能牺牲了多步采样中可灵活控制生成质量的优势（如步数可调）。
- **论文状态**：该论文为 **ICLR 2026 Rejected** 论文，说明其创新性或实验说服力可能未达到顶会接收标准。

---

（完）
