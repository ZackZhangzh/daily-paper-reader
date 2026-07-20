---
title: "Mean Flow Distillation: Robust and Stable Distillation for Flow Matching Models"
title_zh: 均值流蒸馏：流匹配模型的鲁棒稳定蒸馏
authors: "An Zhao, Shengyuan Zhang, Zhongjian Sun, Yixiang Zhou, Zejian Li, Ling Yang, Tianrun Chen, Lingyun Sun"
date: 2026-04-30
pdf: "https://openreview.net/pdf/8a2564e88694d94f48baf55728284cc4a5c72cb3.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 流匹配蒸馏以加速采样
tldr: 流匹配模型依赖ODE迭代采样，计算开销大，限制了实时应用。现有蒸馏方法多借鉴扩散模型，未利用流的内在几何结构，导致训练不稳定、方差大和生成质量下降。本文提出均值流蒸馏（MFD），一种专为流匹配设计的蒸馏框架，理论上证明其作为时间低通滤波器有效抑制高频噪声，稳定训练。实验表明MFD在保持生成质量的同时大幅减少采样步数，为流匹配模型的实时部署提供了可靠解决方案。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 流匹配采样开销大，现有蒸馏方法不稳定且质量下降。
method: 提出均值流蒸馏，作为时间低通滤波器抑制高频噪声。
result: 稳定训练并减少采样步数，保持生成质量。
conclusion: 实现高效、稳定的流匹配蒸馏，适用于实时场景。
---

## Abstract
Flow Matching models have demonstrated strong performance across a wide range of generative tasks.
However, their reliance on ODE-based iterative sampling incurs substantial computational overhead, which limits their applicability in real-time scenes. 
While distillation is a promising solution, existing approaches largely borrow from diffusion-based score matching, often failing to exploit the intrinsic geometric structure of flows and suffering from training instability, high variance, and degraded generation quality.
In this paper, we propose Mean Flow Distillation (MFD), a novel distillation framework tailored for flow matching models.
We theoretically demonstrate that MFD acts as a temporal low-pass filter, effectively suppressing the high-frequency optimization noise inherent in variational score distillation (VSD) while ensuring global trajectory consistency. We further prove the Mean Flow Matching Theorem, establishing that matching expected average velocities is sufficient for strict distribution alignment. Empirically, on challenging high-dimensional manifolds including 4D occupancy forecasting and text-to-image generation, MFD achieves state-of-the-art performance, enabling high-fidelity single-step generation.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：流匹配（Flow Matching）模型在图像生成、3D建模等多种生成任务中表现优异。然而，其推理过程依赖常微分方程（ODE）迭代采样，通常需要数十甚至上百次函数评估才能生成一个高质量样本，计算开销巨大，严重限制了其在实时场景中的应用。

**核心问题**：蒸馏是加速采样的主流思路，但现有蒸馏方法大多直接借鉴扩散模型的得分匹配范式，未能利用流的内在几何结构，导致训练不稳定、梯度方差大、生成质量下降。具体而言，基于变分得分蒸馏（VSD）的方法在应用于流匹配时，需要将速度场转换为得分函数，这种转换在采样时间接近目标数据分布时会放大数值误差和估计噪声。

**整体含义**：本文提出**均值流蒸馏（Mean Flow Distillation, MFD）** ，一个专为流匹配模型量身定制的蒸馏框架。其核心洞见是：与其匹配瞬时速度（易受高频噪声干扰），不如匹配时间积分后的平均速度（均值流），后者天然具有时间低通滤波效应，能有效抑制优化噪声。论文进一步证明了**均值流匹配定理**，即匹配期望平均速度足以实现严格的分布对齐。

---

## 二、方法论

**核心思想**：MFD的核心创新在于使用**平均速度场（Average Velocity Field, AVF）** 取代瞬时速度场作为蒸馏的监督信号。对于给定的速度场 \(v\)，在时间区间 \([s, t]\) 上的AVF定义为总位移除以时间跨度：

\[
U(z_s, s, t) = \frac{\psi_t(X_0) - \psi_s(X_0)}{t - s}
\]

其中 \(\psi_t\) 是将初始样本 \(X_0\) 映射到时刻 \(t\) 位置的流映射。

**关键技术细节**：

1. **时间低通滤波效应**：通过对速度场进行时间积分，AVF天然平滑了教师模型中局部不一致和高频噪声，为学生模型提供了更稳定、更清晰的优化方向。

2. **MFD训练框架**包含三个核心组件：
   - **教师模型**（\(u_Q\)）：固定的预训练流匹配模型，定义目标分布
   - **学生模型**（\(G_\theta\)）：可训练的单步生成器，从噪声映射到数据样本
   - **辅助流模型**（\(v_P\)）：与学生同步训练的辅助模型，用于估计学生输出分布的连续流

3. **优化目标**：训练过程交替更新辅助模型和学生生成器。辅助模型通过标准流匹配目标确保准确跟踪学生的输出分布；学生生成器则通过MFD损失函数优化，最小化学生均值流与教师均值流之间的差异：

\[
\mathcal{L}_{\text{MFD}}(\theta) = \frac{1}{2} \mathbb{E}_{s,t,X_0} \left[ \| \hat{U}_P(X_s(\theta), s, t; v_P) - \hat{U}_Q(X_s(\theta), s, t; u_Q) \|^2 \right]
\]

其中 \(X_s(\theta)\) 是学生预测 \(G_\theta(X_0)\) 与噪声样本 \(X'_0\) 之间直线路径上的点。

4. **梯度近似**：为避免通过ODE求导带来的巨大计算开销，MFD将均值流之间的差异作为固定引导信号来更新学生参数。

---

## 三、实验设计

**数据集与场景**：论文在两类高维流形挑战任务上评估MFD：

| 任务 | 说明 |
|------|------|
| **4D占用预测** | 自动驾驶场景，预测3D空间随时间的演化（4D问题） |
| **文本生成图像** | 大规模文生图任务 |

**Benchmark与对比方法**：

- **4D占用预测**：以OccFM模型为教师，对比10步教师的推理速度与精度
- **文本生成图像**：以SANA 1.6B参数模型为教师，对比一致性蒸馏（CD）、Align Your Flow（AYF）以及基于VSD的方法

---

## 四、资源与算力

**论文提供的材料中未明确说明所使用的GPU型号、数量或训练时长**。不过，论文提及以下两点可供参考：

- 代码实现已在GitHub开源：https://github.com/happyw1nd/MFD 
- 训练中使用了轻量级适配器（如LoRA）来控制训练开销，辅助模型在推理阶段被丢弃，不增加终端用户的延迟

---

## 五、实验数量与充分性

从可获取的信息来看，实验覆盖了以下维度：

1. **两大应用场景**：4D占用预测和文生图，覆盖了自动驾驶和视觉生成两个具有高实时性要求的关键领域
2. **推理加速效果**：在4D占用预测中，推理速度从12.7 FPS（10步教师）提升至25+ FPS（单步）
3. **训练稳定性分析**：对比了MFD与VSD的损失分布和梯度方差，证明MFD的监督信号方差显著更低
4. **定性结果展示**：提供了文生图样本和4D占用预测的可视化对比

**充分性评价**：实验设计基本合理，覆盖了理论 claims（稳定性、质量保持、加速效果）的主要验证维度。但论文提供的信息有限（仅来自摘要和第三方总结），无法确认是否存在消融实验（如不同蒸馏强度、不同时间区间选择等）。

---

## 六、主要结论与发现

1. **MFD作为时间低通滤波器**：理论证明MFD能有效抑制VSD中固有的高频优化噪声，同时确保全局轨迹一致性

2. **均值流匹配定理**：匹配期望平均速度足以实现严格的分布对齐，为从得分蒸馏转向直接流对齐提供了理论基础

3. **单步高保真生成**：在4D占用预测和文生图任务上达到SOTA性能，实现高保真单步生成

4. **显著推理加速**：4D占用预测中推理速度提升约一倍（12.7→25+ FPS）

5. **训练稳定性优越**：相比VSD，MFD的损失曲线更平滑、梯度方差更低、收敛更稳定

---

## 七、优点

1. **方法创新性强**：首次将“均值流”概念系统性地引入蒸馏框架，从瞬时速度匹配转向时间积分速度匹配，抓住了流匹配模型的几何本质

2. **理论扎实**：不仅提出了算法，还证明了均值流匹配定理，为方法的有效性提供了严格的数学保证

3. **训练稳定**：通过时间低通滤波效应，从根源上解决了现有蒸馏方法训练不稳定的问题

4. **推理零开销**：辅助模型仅在训练时使用，推理阶段完全丢弃，不增加任何额外延迟

5. **无需复杂损失函数**：不需要感知损失或判别器，是一种“干净”的基础性蒸馏方法

6. **代码开源**：提供了GitHub实现，便于复现和后续研究

---

## 八、不足与局限

1. **算力信息缺失**：论文未明确报告训练所需的GPU型号、数量及训练时长，不利于读者评估方法的训练成本

2. **实验细节不足**：从可获取的材料中难以确认消融实验的完整设置、超参数选择、评估指标的具体数值等

3. **应用场景有限**：虽然选择了两个高维任务，但未涉及更多样化的生成任务（如视频生成、3D生成、音频生成等），方法的通用性有待进一步验证

4. **辅助模型开销**：虽然推理阶段无开销，但训练阶段需要同时训练辅助流模型，增加了训练的复杂度和内存占用

5. **方法依赖预训练教师**：作为蒸馏方法，MFD需要一个已训练好的多步教师模型，无法从零开始训练

6. **潜在偏差风险**：均值流匹配定理保证的是分布对齐的充分性，但实际优化中可能存在的近似误差是否会导致模式丢失或多样性下降，尚需更系统的评估

---

（完）
