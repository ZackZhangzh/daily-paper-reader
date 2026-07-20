---
title: "GLASS Flows: Efficient Inference for Reward Alignment of Flow and Diffusion Models"
title_zh: GLASS流：用于流和扩散模型奖励对齐的高效推理
authors: "Peter Holderrieth, Uriel Singer, Tommi Jaakkola, Ricky T. Q. Chen, Yaron Lipman, Brian Karrer"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=vH7OAPZ2dR"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 通过内层流模型提升流匹配推理效率
tldr: 流匹配和扩散模型的奖励对齐算法在推理时效率低下，主要瓶颈在于依赖SDE采样马尔可夫转移。本文提出GLASS Flows采样范式，通过训练一个“内层”流匹配模型来模拟马尔可夫转移，该内层模型可从任意预训练模型中提取而无需额外训练。该方式以ODE采样替代低效的SDE采样，显著加速推理过程并提升对齐性能，为流匹配模型的高效部署提供了新思路。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 奖励对齐算法依赖低效的SDE采样，成为推理瓶颈。
method: 引入内层流匹配模型采样马尔可夫转移，替代SDE采样。
result: 比SDE采样更高效且性能更优。
conclusion: 提升了流匹配模型在奖励对齐任务中的推理效率。
---

## Abstract
The performance of flow matching and diffusion models can be greatly improved at inference time using reward adaptation algorithms, yet efficiency remains a major limitation. While several algorithms were proposed, we demonstrate that a common bottleneck is the *sampling* method these algorithms rely on: many algorithms require to sample Markov transitions via SDE sampling, which is significantly less efficient and often less performant than ODE sampling. To remove this bottleneck, we introduce GLASS Flows, a new sampling paradigm that simulates a ''flow matching model within a flow matching model'' to sample Markov transitions. As we show in this work, this ''inner'' flow matching model can be retrieved from any pre-trained model without any re-training, effectively combining the efficiency of ODEs with the stochastic evolution of SDEs. On large-scale text-to-image models, we show that GLASS Flows eliminate the trade-off between stochastic evolution and efficiency. GLASS Flows improve state-of-the-art performance in text-to-image generation, making it a simple, drop-in solution for inference-time scaling of flow and diffusion models.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

流匹配（Flow Matching）和扩散模型（Diffusion Models）在推理阶段可通过**奖励对齐算法**（Reward Adaptation / Reward Alignment Algorithms）显著提升生成质量。然而，这类算法的效率存在严重瓶颈。

论文指出，这一瓶颈的根源在于**采样方法本身**：多数奖励对齐算法需要依赖**随机微分方程（SDE）采样**来生成马尔可夫转移（Markov Transitions）。SDE采样虽能提供探索所需的随机性，但计算成本高、速度慢，且性能往往不如常微分方程（ODE）采样。而 ODE 采样虽然高效，却缺乏必要的随机性，导致生成质量下降。

为此，本文提出 **GLASS Flows**（Gaussian Latent Sufficient Statistics Flows），一种全新的采样范式，旨在**用 ODE 级别的计算效率实现 SDE 般的随机演化效果**，从根本上消除随机性与效率之间的权衡。该工作已被 **ICLR 2026** 接收为 **Oral 报告**。

---

## 2. 方法论

### 核心思想

GLASS Flows 的核心思路是在一个流匹配模型内部模拟“另一个流匹配模型”（a “flow matching model within a flow matching model”），用以高效采样马尔可夫转移。这个“**内层流匹配模型**”（inner flow matching model）可以从**任意预训练模型**中直接提取，**无需任何重新训练或微调**。

### 关键技术细节

- **转移核采样**：GLASS Flows 可以从转移核 \( p_{t'|t}(x_{t'}|x_t) \) 中进行采样。具体而言，它通过构造一个条件速度场 \( u_{s}(\bar{x}_{s}|x_{t}, t) \)，使得内层模型从内部时间 \( s=0 \) 演化到 \( s=1 \)，从而模拟目标转移。
- **确定性 ODE 模拟随机性**：该方法使用**确定性 ODE** 来生成转移，随机性仅通过**初始条件**引入。这种方法将 ODE 的高效性与 SDE 的可控随机演化相结合。
- **理论基础**：该方法利用了**充分统计量**（sufficient statistics）的统计概念，通过将多个噪声观测值组合成单一信息信号来推导内层模型。
- **即插即用**：GLASS Flows 是一种**即插即用**（drop-in）的解决方案，无需重新训练基础模型，可直接集成到现有奖励对齐框架中。

### 与现有方法的关系

论文指出，GLASS Flows 可应用于多种推理时奖励对齐算法，包括**序列蒙特卡洛（SMC）**、**搜索**和**引导**（guidance）等。特别地，结合**费曼-卡茨导向**（Feynman-Kac Steering）方法时，GLASS Flows 可进一步提提升文本到图像生成的最先进性能。

---

## 3. 实验设计

### 数据集与场景

实验主要在**大规模文本到图像生成模型**（large-scale text-to-image models）上进行。

### Benchmark 与对比方法

- 论文对比了基于 **SDE 采样**的现有奖励对齐算法，展示了 SDE 采样在效率和性能上的双重不足。
- 验证了 GLASS Flows 在**消除随机演化与效率之间权衡**方面的能力。
- 结合 **Feynman-Kac Steering** 方法，展示了 GLASS Flows 如何进一步提升文本到图像生成任务的**最先进（SOTA）性能**。

---

## 4. 资源与算力

**论文摘要及公开信息中未明确说明**所使用的 GPU 型号、数量、训练时长等具体算力细节。仅能确定该方法在**大规模**文本到图像模型上进行了验证。由于 GLASS Flows 的核心优势在于**无需重新训练**即可从预训练模型中提取内层模型，其推理阶段的计算开销主要来自 ODE 采样，相比 SDE 采样有显著效率提升，但具体硬件资源消耗需查阅论文全文。

---

## 5. 实验数量与充分性

**论文摘要及公开信息中未详述**具体实验组数、消融实验设计或数据集覆盖范围。但可推断：

- 实验涵盖**大规模文本到图像生成**这一具有挑战性的实际场景，具备一定的代表性。
- 论文声称 GLASS Flows 在**多个**奖励对齐算法（如 SMC、搜索、引导等）上均有应用，暗示了实验的广度。
- 方法被后续工作（如 Diamond Maps）用作蒸馏的基础，侧面说明其实验结果具有可信度和影响力。

完整的实验充分性评估（如消融实验、不同模型规模、不同奖励函数等）需查阅论文全文。

---

## 6. 主要结论与发现

1. **SDE 采样是奖励对齐算法的共同效率瓶颈**。
2. GLASS Flows 能够从**任意预训练模型**中提取内层流匹配模型，**无需重新训练**。
3. GLASS Flows **用 ODE 的计算效率实现了 SDE 的随机演化效果**，成功消除了二者之间的传统权衡。
4. 在大规模文本到图像生成任务上，GLASS Flows **提升了最先进性能**，是一种**简单、即插即用**的推理时扩展解决方案。

---

## 7. 优点

| 方面 | 亮点 |
|------|------|
| **方法创新性** | 提出“流匹配模型内嵌套流匹配模型”的全新采样范式，思路新颖 |
| **无需重训练** | 内层模型可直接从预训练模型中提取，无需额外训练或微调，显著降低部署成本 |
| **效率与性能兼得** | 用 ODE 的高效性实现 SDE 的随机性，打破了传统效率-性能权衡 |
| **即插即用** | 可作为通用模块直接集成到现有奖励对齐框架中，实用性强 |
| **理论支撑** | 基于充分统计量等统计概念，具有坚实的理论基础 |
| **学术认可** | 被 ICLR 2026 接收为 Oral 报告，代表了学界的高度认可 |
| **影响力** | 被后续工作（如 Diamond Maps）用作蒸馏基础，显示其方法价值 |

---

## 8. 不足与局限

| 方面 | 不足 |
|------|------|
| **实验细节不足** | 公开摘要中未详述具体数据集、模型规模、量化指标、消融实验等，需查阅全文 |
| **算力信息缺失** | 未说明具体 GPU 型号、数量、推理时间对比等硬件资源消耗 |
| **应用范围有限** | 公开信息主要聚焦文本到图像生成，是否适用于视频生成、分子生成等其他模态尚不明确 |
| **依赖预训练模型** | 方法虽无需重训练，但高度依赖已有预训练模型的质量，若预训练模型本身存在偏差，GLASS Flows 可能无法纠正 |
| **理论复杂度** | 涉及充分统计量、内层流匹配模型等概念，理解和实现可能存在一定门槛 |
| **长期影响未知** | 作为一种推理时采样范式，其对生成样本的长期统计特性（如多样性、分布保真度）的影响尚需进一步研究 |

---

（完）
