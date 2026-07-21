---
title: "Mean Flow Distillation: Robust and Stable Distillation for Flow Matching Models"
title_zh: 均值流蒸馏：面向流匹配模型的鲁棒稳定蒸馏
authors: "An Zhao, Shengyuan Zhang, Zhongjian Sun, Yixiang Zhou, Zejian Li, Ling Yang, Tianrun Chen, Lingyun Sun"
date: 2026-04-30
pdf: "https://openreview.net/pdf/8a2564e88694d94f48baf55728284cc4a5c72cb3.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 流匹配蒸馏加速采样
tldr: 流匹配模型虽生成能力强，但ODE迭代采样计算开销大，限制了实时应用。本文提出均值流蒸馏（MFD），专为流匹配设计，从理论上证明其作为时间低通滤波器可有效抑制高频噪声，提升训练稳定性和生成质量，同时大幅减少采样步数。实验表明MFD在多种生成任务上优于现有蒸馏方法，为流匹配的实时部署提供了高效解决方案。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 流匹配模型采样慢，现有蒸馏方法忽视几何结构且不稳定。
method: 提出均值流蒸馏框架，利用时间低通滤波特性稳定训练。
result: 在多个生成任务上优于现有蒸馏方法，质量高且训练稳定。
conclusion: MFD为流匹配模型提供了高效稳定的蒸馏方案，有望促进实时生成。
---

## Abstract
Flow Matching models have demonstrated strong performance across a wide range of generative tasks.
However, their reliance on ODE-based iterative sampling incurs substantial computational overhead, which limits their applicability in real-time scenes. 
While distillation is a promising solution, existing approaches largely borrow from diffusion-based score matching, often failing to exploit the intrinsic geometric structure of flows and suffering from training instability, high variance, and degraded generation quality.
In this paper, we propose Mean Flow Distillation (MFD), a novel distillation framework tailored for flow matching models.
We theoretically demonstrate that MFD acts as a temporal low-pass filter, effectively suppressing the high-frequency optimization noise inherent in variational score distillation (VSD) while ensuring global trajectory consistency. We further prove the Mean Flow Matching Theorem, establishing that matching expected average velocities is sufficient for strict distribution alignment. Empirically, on challenging high-dimensional manifolds including 4D occupancy forecasting and text-to-image generation, MFD achieves state-of-the-art performance, enabling high-fidelity single-step generation.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

- **研究背景**：流匹配（Flow Matching）模型在图像生成、3D建模等多种生成任务中表现优异。然而，其推理过程依赖常微分方程（ODE）求解器进行迭代采样，通常需要数十乃至上百次函数评估才能生成一个高质量样本，计算开销巨大，严重制约了实时应用场景的部署。
- **现有蒸馏方法的局限**：蒸馏是加速采样的主流思路，但现有方法大多直接照搬扩散模型中的变分得分蒸馏（VSD）等技术，将流匹配模型的速度场转换为得分函数进行匹配。这种做法忽略了流的内在几何结构——流轨迹是一条平滑曲线，而逐点匹配瞬时速度会引入高频优化噪声，导致训练不稳定、梯度方差大、生成质量下降，甚至出现模式崩塌。
- **整体含义**：本文提出的**均值流蒸馏（Mean Flow Distillation, MFD）** 是一个专为流匹配模型设计的蒸馏框架，通过从“匹配瞬时速度”转向“匹配时间积分后的平均速度”，从根本上解决了上述不稳定问题，实现了高保真度的单步生成。

## 2. 方法论

- **核心思想**：MFD的核心创新在于使用**平均速度场（Average Velocity Field, AVF）** 作为蒸馏目标。对于给定速度场 \( v \)，在时间区间 \([s, t]\) 内从起点 \( z_s \) 出发的AVF定义为总位移除以时间跨度：
  \[
  U(z_s, s, t) = \frac{\psi_t(X_0) - \psi_s(X_0)}{t - s}
  \]
  其中 \(\psi_t\) 表示将初始样本 \(X_0\) 映射到时刻 \(t\) 位置的流映射。AVF本质上是一个**时间低通滤波器**，能够平滑掉教师模型速度场中的高频噪声和局部不一致性，为学生模型提供更稳定、更清晰的监督信号。
- **均值流匹配定理**：论文从理论上证明，如果学生模型的均值流在所有可能的时间区间上与教师模型的均值流匹配，则两者生成的分布必然相同。这为从基于得分的蒸馏转向基于流的直接对齐提供了严格的理论基础。
- **MFD训练框架**：MFD包含三个核心组件：
  1. **教师模型（\(u_Q\)）**：固定、预训练的流匹配模型，定义目标分布 \(Q\)。
  2. **学生模型（\(G_\theta\)）**：可训练的单步生成器，将噪声 \(X_0\) 一步映射为数据样本 \(X_1\)。
  3. **辅助流模型（\(v_P\)）**：与学生模型并行训练的辅助模型，用于估计学生当前生成分布 \(P\) 的连续流。
- **优化目标**：训练过程交替更新辅助模型和学生模型。辅助模型使用标准流匹配目标进行更新，以准确跟踪学生输出分布。学生模型则通过MFD损失函数优化：
  \[
  \mathcal{L}_{\text{MFD}}(\theta) = \frac{1}{2} \mathbb{E}_{s,t,X_0} \left[ \| \hat{U}_P(X_s(\theta), s, t; v_P) - \hat{U}_Q(X_s(\theta), s, t; u_Q) \|^2 \right]
  \]
  其中 \(X_s(\theta)\) 位于学生预测 \(G_\theta(X_0)\) 与噪声样本 \(X_0'\) 之间的直线路径上。
- **梯度近似**：为了在不承担通过ODE微分的大规模计算成本的情况下更新学生参数，MFD采用了特定的梯度近似策略。
- **训练开销**：训练过程中引入了辅助模型，但可通过LoRA等轻量级适配器控制开销；推理时辅助模型被丢弃，不增加任何额外延迟。

## 3. 实验设计

- **数据集与场景**：论文在两个高维流形挑战任务上评估了MFD：
  - **4D占用预测**：面向自动驾驶场景，预测3D空间占用随时间（第四维）的演化。
  - **大规模文本生成图像**：使用SANA 1.6B参数模型作为教师。
- **Benchmark与对比方法**：在文本生成图像任务中，MFD与一致性蒸馏（Consistency Distillation, CD）和Align Your Flow（AYF）等其他蒸馏技术进行了对比。在4D占用预测任务中，对比了多步教师模型（10步）的推理速度与精度。论文还系统对比了MFD与VSD在训练稳定性方面的差异。
- **评估指标**：文本生成图像任务关注语义对齐和美学质量；4D占用预测任务关注推理帧率（FPS）和平均交并比（mIoU）精度。

## 4. 资源与算力

论文**未明确说明**训练所使用的GPU型号、数量或具体训练时长。仅在提及3D生成相关工作（非本文MFD本身）时提到A800 GPU的延迟数据，但MFD论文正文中未披露自身的算力消耗细节。仅提及训练中通过LoRA等轻量级适配器控制辅助模型的训练开销。

## 5. 实验数量与充分性

- **实验规模**：论文在两个具有代表性的高维任务上进行了验证，涵盖了自动驾驶（4D占用预测）和AIGC（文本生成图像）两个差异较大的应用领域。
- **消融与分析**：论文包含对训练动力学的深入分析，对比了MFD与VSD的损失轨迹和梯度方差，证明了MFD训练更平滑、梯度更集中。此外，在2D toy示例上进行了梯度场的可视化对比，直观展示了MFD的平滑优势。
- **充分性评估**：实验覆盖了从理论验证（2D toy示例）到实际应用（4D预测、文生图）的多层次评估，对比了主流蒸馏基线，并提供了训练稳定性分析，整体设计较为充分和客观。但未包含更多模态（如音频、视频生成）或更多数据集上的泛化性验证。

## 6. 主要结论与发现

- MFD作为一种专为流匹配设计的蒸馏框架，通过匹配时间积分后的平均速度而非瞬时速度，有效抑制了高频优化噪声，实现了稳定、低方差的训练。
- 均值流匹配定理从理论上保证了匹配平均速度足以实现严格的分布对齐。
- 实验表明，MFD在4D占用预测中实现了超过25 FPS的推理速度（相比10步教师模型的12.7 FPS大幅提升），且精度（mIoU）损失可忽略；在文本生成图像中，MFD在语义对齐和美学质量上优于CD、AYF等基线。
- MFD使大规模流匹配模型（如SANA、OccFM）能够在有限计算资源上部署，推理成本降低10倍以上。

## 7. 优点

- **理论创新扎实**：提出了均值流匹配定理，为方法提供了严格的数学保证，而非仅凭经验调参。
- **问题定位精准**：准确识别了现有蒸馏方法“匹配瞬时速度”这一根本性缺陷，而非简单地改进工程细节。
- **训练稳定性显著**：通过时间低通滤波效应，有效抑制了VSD等方法中的高频噪声和梯度震荡。
- **推理零开销**：辅助模型仅在训练时使用，推理时被丢弃，不增加任何额外延迟。
- **实现简洁**：不需要复杂的感知损失或昂贵的判别器，是一种“干净”的基础性蒸馏方法。

## 8. 不足与局限

- **算力信息缺失**：论文未披露具体的训练GPU型号、数量和时长，不利于其他研究者复现和评估训练成本。
- **实验模态覆盖有限**：主要验证了4D占用预测和文本生成图像两个任务，未涉及音频生成、视频生成、3D生成等其他流匹配应用领域。
- **辅助模型带来的训练复杂度**：虽然推理无开销，但训练时需要同时训练学生和辅助模型，训练流程比单模型蒸馏更复杂。
- **方法泛化性有待验证**：均值流匹配定理虽然优美，但其在高度多模态、复杂分布上的实际效果仍需更多实证检验。

（完）
