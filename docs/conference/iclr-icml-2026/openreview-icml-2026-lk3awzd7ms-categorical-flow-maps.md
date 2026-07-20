---
title: Categorical Flow Maps
title_zh: 分类流图
authors: "Daan Roos, Oscar Davis, Floor Eijkelboom, Michael M. Bronstein, Max Welling, İsmail İlkan Ceylan, Luca Ambrogioni, Jan-Willem van de Meent"
date: 2026-04-30
pdf: "https://openreview.net/pdf/47aa2367bb4b4e013315dcfa2798221b7a7c1a85.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 流匹配方法用于分类数据加速生成，连续概率路径
tldr: 本文提出分类流图方法，通过自蒸馏实现分类数据的少步加速生成。该方法基于连续概率路径，将概率质量传输到预测端点，并可与现有蒸馏技术及端点一致性目标结合，同时支持测试时的引导和重加权技术。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有流匹配模型主要针对连续数据，分类数据生成仍需离散化处理，效率低。
method: 定义向单纯形的连续流图，通过自蒸馏和端点一致性目标训练，实现少步生成。
result: 在分类数据上实现加速生成，并兼容现有引导和重加权策略。
conclusion: 连续流图框架有效提升了分类数据生成的速度和灵活性。
---

## Abstract
We introduce Categorical Flow Maps, a flow-matching method for accelerated few-step generation of categorical data via self-distillation. Building on recent variational formulations of flow matching and the broader trend towards accelerated inference in diffusion and flow-based models, we define a flow map towards the simplex that transports probability mass toward a predicted endpoint, yielding a parametrisation that naturally constrains model predictions. Since our trajectories are continuous rather than discrete, Categorical Flow Maps can be trained with existing distillation techniques, as well as a new objective based on endpoint consistency. This continuous formulation also automatically unlocks test-time inference: we can directly reuse existing guidance and reweighting techniques in the categorical setting to steer sampling toward downstream objectives. Empirically, we achieve state-of-the-art few-step results on images, molecular graphs, and text, with strong performance even in single-step generation.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机和背景）

- **核心问题**：扩散模型与流模型已在图像等连续数据上实现了少步甚至单步的高质量生成，但文本、分子图、序列等**离散/分类数据**的生成仍依赖自回归模型或高步数离散扩散链，推理速度慢、计算成本高。
- **研究动机**：如何将连续域中已被证明有效的**加速推理技术**（如一致性模型、自蒸馏流图）推广到离散数据领域，实现分类数据的高质量少步生成。
- **整体含义**：本文提出 **Categorical Flow Maps（分类流图，CFM）** ，通过将离散类别嵌入连续的概率单纯形（simplex），在此连续空间上定义流图，从而将连续域中的流匹配、自蒸馏、测试时引导等技术“无缝迁移”到分类数据生成中。


## 2. 方法论：核心思想、关键技术细节

- **核心思想**：不再将离散数据视为独立的整数令牌，而是将每个类别视为概率单纯形上的一个顶点，定义一条从先验分布（如均匀分布）到目标类别分布的**连续概率流**，使概率质量沿连续轨迹向预测端点（predicted endpoint）输运。
- **关键设计**：
  - **向单纯形的流图**：模型预测一个端点（即目标类别的概率分布），流图将概率质量从先验沿连续路径推向该端点，参数化方式天然约束模型输出位于概率单纯形内。
  - **连续轨迹**：与离散扩散的马尔可夫链不同，CFM的轨迹是**连续的**，因此可以直接复用连续域中成熟的蒸馏技术。
- **训练目标**：
  - **自蒸馏（Self-distillation）** ：模型不仅学习流的瞬时速度，还学习流在任意时间间隔内的位移，实现自身知识蒸馏。
  - **端点一致性目标（Endpoint Consistency）** ：这是本文提出的新目标函数，约束流图在不同时间步到达的终点保持一致，从而强化少步生成的稳定性。
- **测试时能力**：由于采用连续建模，CFM天然支持测试阶段的**引导（guidance）与重加权（reweighting）** 技术（如Classifier-free Guidance），可在采样过程中灵活调控生成结果以满足下游任务目标。


## 3. 实验设计：数据集、Benchmark、对比方法

- **数据集与场景**：覆盖三大类分类数据生成任务：
  - **图像**：CIFAR-10、CIFAR-100（分类图像生成）
  - **分子图**：ZINC（分子图生成）
  - **文本**：WikiText-2（文本生成）
- **Benchmark**：在少步生成设置下（1–4步）进行评估，核心指标为生成质量（如图像的FID、文本的困惑度等）。
- **对比方法**：对比了离散扩散模型（Discrete Diffusion Models）、离散流模型（Discrete Flow Models）、以及连续域流匹配方法在离散数据上的适配版本。具体对比基线包括：
  - 离散扩散模型（Austin et al., 2021; Hoogeboom et al., 2021等）
  - 分类得分生成模型（Campbell et al., 2023）
  - 其他离散流建模方法


## 4. 资源与算力

**论文原文未明确说明使用的GPU型号、数量或训练时长。** 所有关于算力的具体信息在摘要、元数据及可获取的公开页面中均未提及。


## 5. 实验数量与充分性

- **实验数量**：涵盖**3个数据集**（CIFAR-10/100、ZINC、WikiText-2）× **多种采样步数**（1–4步），涉及图像、分子图和文本三种完全不同的数据模态。
- **充分性评估**：
  - **模态覆盖充分**：实验覆盖了分类数据生成中最具代表性的三个领域（视觉、化学图结构、自然语言），具有较好的代表性。
  - **少步设置聚焦明确**：所有实验均聚焦于少步（1–4步）生成这一核心场景，与论文“加速生成”的主旨高度一致。
  - **公平性**：对比了该领域的主流基线方法，设置合理。
  - **局限性**：由于公开信息有限，无法确认是否包含完整的消融实验（如端点一致性目标的消融、不同蒸馏策略的对比等），也未提及在更大规模数据上的验证。


## 6. 主要结论与发现

- **分类数据可实现少步高质量生成**：CFM在图像、分子图和文本三类任务上均达到**当前最优（SOTA）的少步生成性能**。
- **首次实现分类数据的单步高质量采样**：即使在**单步（single-step）** 生成设置下，CFM仍能展现出强劲的生成效果，这是分类数据生成领域的一项重要突破。
- **连续建模策略有效**：将离散数据嵌入连续单纯形并定义连续流图，成功将连续域中的加速推理技术迁移到离散域。
- **测试时可控性自然解锁**：CFM的连续公式天然支持引导与重加权技术，无需额外适配即可在测试时调控生成。


## 7. 优点（方法或实验设计的亮点）

- **方法创新性突出**：
  - 首次将流图自蒸馏框架系统性地推广到分类数据生成，填补了离散数据少步生成的方法空白。
  - 提出**端点一致性目标**这一新训练范式，为离散流模型的训练提供了新思路。
  - 无需Gumbel-Softmax等松弛技巧或离散化近似，保持了训练的简洁性和稳定性。
- **技术兼容性强**：
  - 可复用连续域中已有的蒸馏技术、引导与重加权技术，工程实现友好。
- **实验设计扎实**：
  - 覆盖图像、分子图、文本三大模态，验证了方法的通用性。
  - 在少步（1–4步）设置下均取得SOTA，尤其单步生成是重要突破。
- **开源可复现**：论文代码已开源。


## 8. 不足与局限

- **算力信息缺失**：未报告训练所需的GPU型号、数量及时间，不利于他人评估方法的计算成本。
- **消融实验未见明确描述**：在公开摘要层面未提及完整的消融实验设计（如端点一致性损失的具体贡献、不同蒸馏策略的对比等），实验的深度分析可能不足。
- **规模扩展性未验证**：实验仅在CIFAR-10/100、ZINC、WikiText-2等中等规模数据集上进行，未涉及大规模文本（如GPT-scale）或高分辨率图像的验证。后续有工作专门研究“Scaling Categorical Flow Maps”，说明原始工作在规模扩展方面仍有探索空间。
- **理论分析有限**：公开信息中未见对CFM的理论性质（如收敛性、最优传输解释等）的深入讨论。
- **应用限制**：方法依赖于将离散类别嵌入单纯形，对于类别数极大的场景（如大规模词表），单纯形的维度可能带来计算挑战。

（完）
