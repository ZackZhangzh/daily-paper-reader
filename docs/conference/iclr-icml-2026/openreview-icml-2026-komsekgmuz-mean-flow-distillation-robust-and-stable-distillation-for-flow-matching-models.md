---
title: "Mean Flow Distillation: Robust and Stable Distillation for Flow Matching Models"
title_zh: 均值流蒸馏：面向流匹配模型的鲁棒稳定蒸馏方法
authors: "An Zhao, Shengyuan Zhang, Zhongjian Sun, Yixiang Zhou, Zejian Li, Ling Yang, Tianrun Chen, Lingyun Sun"
date: 2026-04-30
pdf: "https://openreview.net/pdf/8a2564e88694d94f48baf55728284cc4a5c72cb3.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 流匹配蒸馏用于高效生成建模
tldr: 流匹配模型依赖ODE迭代采样，计算开销大，现有蒸馏方法忽视流几何结构且训练不稳定。本文提出均值流蒸馏，从理论上证明其作为时间低通滤波器能抑制高频噪声，在保持生成质量的同时显著加速采样，为流匹配的实时应用提供了稳定高效的蒸馏方案。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 解决流匹配模型采样慢、现有蒸馏不稳定且质量下降的问题。
method: 设计针对流匹配几何结构的蒸馏框架，通过低通滤波抑制高频噪声。
result: 训练更稳定，生成质量高，采样速度显著提升。
conclusion: 均值流蒸馏是流匹配模型加速的有效且鲁棒的解决方案。
---

## Abstract
Flow Matching models have demonstrated strong performance across a wide range of generative tasks.
However, their reliance on ODE-based iterative sampling incurs substantial computational overhead, which limits their applicability in real-time scenes. 
While distillation is a promising solution, existing approaches largely borrow from diffusion-based score matching, often failing to exploit the intrinsic geometric structure of flows and suffering from training instability, high variance, and degraded generation quality.
In this paper, we propose Mean Flow Distillation (MFD), a novel distillation framework tailored for flow matching models.
We theoretically demonstrate that MFD acts as a temporal low-pass filter, effectively suppressing the high-frequency optimization noise inherent in variational score distillation (VSD) while ensuring global trajectory consistency. We further prove the Mean Flow Matching Theorem, establishing that matching expected average velocities is sufficient for strict distribution alignment. Empirically, on challenging high-dimensional manifolds including 4D occupancy forecasting and text-to-image generation, MFD achieves state-of-the-art performance, enabling high-fidelity single-step generation.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究背景**：流匹配（Flow Matching, FM）模型在各类生成任务中表现优异，但其推理阶段依赖常微分方程（ODE）的迭代采样，计算开销巨大，严重限制了其在实时场景中的应用。

**研究动机**：蒸馏（Distillation）是加速生成模型的一种有前景的解决方案，但现有蒸馏方法大多直接借用扩散模型中的得分匹配（score matching）技术，未能充分利用流的固有几何结构，导致训练不稳定、方差大、生成质量下降。

**核心问题**：如何为流匹配模型设计一种专门化的蒸馏框架，使其既能显著加速采样，又能保持生成质量，同时具备训练稳定性。

**整体含义**：本文提出**均值流蒸馏（Mean Flow Distillation, MFD）** ，从理论上证明该方法可视为时间低通滤波器，能有效抑制变分得分蒸馏（VSD）中固有的高频优化噪声，同时保证全局轨迹一致性。

## 2. 方法论

**核心思想**：MFD的核心创新在于将蒸馏目标从“匹配瞬时速度场”转变为“匹配期望平均速度”。流匹配模型的生成过程是一条从噪声到数据的连续轨迹，而现有方法逐时间步匹配瞬时速度，忽略了轨迹的整体几何结构。MFD通过匹配整条轨迹上的平均速度，实现了更稳定、更高效的蒸馏。

**关键技术细节**：
- **双网络架构**：包含一个预训练的流匹配模型作为教师（连续时间ODE），以及一个单步生成器作为学生，学生直接输出最终样本。
- **训练目标**：对于给定的噪声样本和采样的时间区间，学生网络被训练以最小化其输出与教师沿轨迹平均速度之间的期望L2距离，而非匹配每一个时间步的瞬时速度。
- **均值流匹配定理（Mean Flow Matching Theorem）** ：论文证明了若学生的输出分布匹配期望平均速度场，则生成分布与目标分布精确对齐。这为以平均速度为蒸馏目标提供了理论保证。
- **时间低通滤波效应**：通过对教师速度在时间维度上取平均，高频波动被平滑掉，为学生网络提供了一个平滑、稳定的学习信号。

**与VSD的对比**：VSD的损失函数为逐时间步匹配学生速度与教师速度（$\text{loss} = \sum_t \| \text{student\_velocity}(t) - \text{teacher\_velocity}(t) \|$），这种逐点匹配方式注入了高频噪声。而MFD通过匹配平均速度，从根本上避免了这一问题。

## 3. 实验设计

**数据集与场景**：论文在两类具有挑战性的高维流形任务上进行了验证：
- **4D occupancy forecasting（4D占用预测）** ：涉及动态三维场景的时空预测。
- **Text-to-image generation（文本到图像生成）** ：高分辨率图像生成任务。

**Benchmark与对比方法**：实验以VSD（变分得分蒸馏）和渐进式蒸馏（progressive distillation）等作为基线方法进行对比。评估指标包括FID（Fréchet Inception Distance）和训练稳定性等。

## 4. 资源与算力

⚠️ **论文中未明确说明**所使用的GPU型号、数量、训练时长等算力信息。提供的摘要、arXiv页面及第三方解读材料中均未包含具体的计算资源配置细节。

## 5. 实验数量与充分性

**实验规模**：从现有信息来看，论文在两个任务（4D occupancy forecasting和text-to-image generation）上进行了实验，并与VSD、渐进式蒸馏等基线方法进行了对比。实验涵盖了不同难度的高维流形任务，具有一定的代表性。

**充分性与客观性评价**：
- 基线选择较为合理，涵盖了该领域的代表性蒸馏方法。
- 评估指标（FID、稳定性）属于生成模型领域的标准度量。
- 但受限于可获取的信息，无法确认是否包含充分的消融实验（如不同时间区间长度的影响、不同网络架构的敏感性分析等）。第三方解读提到“实验结果在FID和稳定性上表现出一致提升”，说明实验结论具有一定的一致性支撑。

## 6. 主要结论与发现

1. **理论贡献**：MFD在理论上被证明可视为时间低通滤波器，能有效抑制VSD中的高频优化噪声。
2. **理论保证**：证明的“均值流匹配定理”表明，匹配期望平均速度足以保证严格的分布对齐。
3. **实证效果**：在4D占用预测和文本到图像生成两个挑战性任务上，MFD达到了最先进的性能，实现了高保真的单步生成。
4. **稳定性优势**：相比直接借用扩散模型蒸馏方法的VSD，MFD训练更稳定、方差更小。

## 7. 优点

- **理论创新性强**：首次从理论上揭示了流匹配蒸馏中高频噪声的来源（VSD的逐点匹配方式），并提出了基于平均速度匹配的解决方案，给出了严格的理论证明（均值流匹配定理）。
- **方法论针对性强**：专门为流匹配模型的几何结构设计，而非简单套用扩散模型的蒸馏范式，体现了对问题本质的深刻理解。
- **实现简洁有效**：通过时间平均这一简单操作，同时解决了训练不稳定和生成质量下降两个问题，代码已开源（https://github.com/happyw1nd/MFD）。
- **应用前景明确**：实现了高保真单步生成，为流匹配模型在实时场景中的应用提供了可行路径。

## 8. 不足与局限

- **推理开销未明确量化**：第三方解读指出“论文未报告平均化操作（多次查询教师速度）的推理成本”。虽然学生网络是单步生成，但训练过程中需要多次查询教师网络的速度，这可能带来额外的训练开销。
- **实验覆盖范围有限**：主要在两个任务上进行验证（4D占用预测和文本到图像生成），未涉及更多样化的生成任务（如音频生成、分子生成、视频生成等）。
- **算力信息缺失**：未报告训练所需的GPU型号、数量和时间，不利于其他研究者评估方法的可复现性和资源需求。
- **消融实验不详**：从现有公开信息无法确认是否进行了充分的消融实验，如对不同时间区间长度、不同采样策略等的系统分析。
- **与最新工作的对比缺失**：搜索结果中提及了MeanFlow等相关工作，但论文与这些最新方法的详细对比情况在可获取的材料中未见展开。

（完）
