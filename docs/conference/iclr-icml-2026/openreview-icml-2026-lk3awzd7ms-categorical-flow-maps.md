---
title: Categorical Flow Maps
title_zh: 分类流映射
authors: "Daan Roos, Oscar Davis, Floor Eijkelboom, Michael M. Bronstein, Max Welling, İsmail İlkan Ceylan, Luca Ambrogioni, Jan-Willem van de Meent"
date: 2026-04-30
pdf: "https://openreview.net/pdf/47aa2367bb4b4e013315dcfa2798221b7a7c1a85.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 分类数据生成的流匹配
tldr: 该论文提出分类流映射，一种通过自蒸馏实现少步分类数据生成的流匹配方法，定义向单纯形的连续概率路径，支持现有引导和加权技术，加速推理并保持生成质量。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有流匹配在离散数据生成上缺乏效率。
method: 定义向单纯形的连续流映射，利用自蒸馏和端点一致性。
result: 实现少步生成，并兼容现有引导技术。
conclusion: 连续公式化有效适用于分类数据生成。
---

## Abstract
We introduce Categorical Flow Maps, a flow-matching method for accelerated few-step generation of categorical data via self-distillation. Building on recent variational formulations of flow matching and the broader trend towards accelerated inference in diffusion and flow-based models, we define a flow map towards the simplex that transports probability mass toward a predicted endpoint, yielding a parametrisation that naturally constrains model predictions. Since our trajectories are continuous rather than discrete, Categorical Flow Maps can be trained with existing distillation techniques, as well as a new objective based on endpoint consistency. This continuous formulation also automatically unlocks test-time inference: we can directly reuse existing guidance and reweighting techniques in the categorical setting to steer sampling toward downstream objectives. Empirically, we achieve state-of-the-art few-step results on images, molecular graphs, and text, with strong performance even in single-step generation.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究动机与背景**：扩散模型与流模型在连续数据生成上已实现高效的少步甚至单步推理，但文本、分子图等离散/分类数据仍受限于自回归模型的高昂计算成本或离散扩散模型的多步采样问题。如何将加速推理的优势推广到分类数据，是该领域的核心挑战。

**核心贡献**：本文提出 **分类流映射（Categorical Flow Maps, CFM）** ，一种基于自蒸馏的流匹配方法，通过将离散类别数据嵌入概率单纯形（simplex）并定义连续概率路径，实现了分类数据的少步（甚至单步）高质量生成。该工作已被 **ICML 2026** 接收。

---

## 2. 方法论：核心思想与关键技术

**核心思想**：将分类数据（如 one-hot 向量）视为概率单纯形 $\Delta^K$ 上的点，定义从连续先验分布到目标类别分布的连续流映射，而非在离散空间上建模。这一连续化处理使得自蒸馏和现有加速技术得以直接迁移。

**关键技术细节**：

- **单纯形流映射参数化**：模型预测终点（endpoint）的概率质量，通过 softmax 激活函数天然约束在单纯形内，避免了无约束向量场可能产生的非法输出。
- **两种训练目标**：
    1. **CSD（Categorical Self-Distillation）** ：基于自蒸馏的标准流映射目标。
    2. **ECLD（Endpoint-Consistent Lagrangian Distillation）** ：基于终点一致性的新型拉格朗日蒸馏目标，使模型在任意时间间隔内学习流动的位移。
- **测试时推理**：由于轨迹连续，可直接复用分类器无关引导（Classifier-Free Guidance）等现有连续域技术，无需重新训练。
- **无需离散化近似**：无需 Gumbel-Softmax 等松弛技巧。

---

## 3. 实验设计：数据集、Benchmark 与对比方法

**数据集与场景**：涵盖三类离散数据模态：

| 模态 | 数据集 |
|------|--------|
| 分子图 | QM9（≤9个重原子）、ZINC250k |
| 二值图像 | MNIST（动态二值化） |
| 文本 | Text8、LM1B |

**对比方法**：

- **分子图生成**：对比 Set2GraphVAE、MoFlow、PairFlow 等单步/少步基线。
- **图像生成**：对比 Park et al.（2025）等先前方法。
- **文本生成**：对比离散扩散模型等基线。

---

## 4. 资源与算力

**论文原文未明确披露**所使用的 GPU 型号、数量或训练时长。需注意的是，后续跟进工作《Scaling Categorical Flow Maps》训练了 17 亿参数模型，但本文本身未提供具体算力信息。

---

## 5. 实验数量与充分性

**实验数量**：论文在 **3 类模态、5 个数据集**（QM9、ZINC250k、MNIST、Text8、LM1B）上进行了系统评估。据后续工作披露，CFM 的设计空间探索涉及 **350 多种配置**的代理规模实验。

**充分性与公平性**：

- 实验覆盖了分子图、图像、文本三大典型离散数据场景，具有较好的代表性。
- 所有结果均**平均 over 10 次运行**，保证了统计可靠性。
- 对比了同类任务中的 SOTA 基线，设置上具有公平性。
- 对 CSD 与 ECLD 两种损失进行了消融对比。

---

## 6. 主要结论与发现

1. **少步生成 SOTA**：在图像、分子图和文本上均取得当前最优的少步生成性能。
2. **单步生成可行**：首次在分类数据生成中实现高质量单步采样，且单步生成即可显著优于现有单步基线。
3. **终点约束的有效性**：单纯形约束的终点参数化显著优于无约束向量场方法，尤其在高维数据上优势明显。
4. **测试时引导兼容**：CFM 的连续公式化天然支持测试时的引导与重加权，无需额外训练。
5. **两步接近饱和**：在 QM9 分子生成中，两步采样即可达到约 91% 的分子有效性。

---

## 7. 方法亮点

- **数学框架优雅**：将离散问题转化为单纯形上的连续流，避免了离散扩散的复杂马尔可夫链设计。
- **无需松弛技巧**：无需 Gumbel-Softmax 等近似，直接端到端训练。
- **自蒸馏加速**：通过自蒸馏实现少步推理，无需预训练教师模型。
- **即插即用的测试时能力**：可直接复用连续域中的引导和重加权技术。
- **广泛适用性**：统一框架同时适用于图像、分子图和文本。

---

## 8. 不足与局限

- **算力信息缺失**：论文未明确报告训练所需的 GPU 数量与时长，不利于复现的成本评估。
- **规模验证有限**：本文的实验规模相对较小（< 1B 参数），大规模文本生成的可行性由后续工作补充验证。
- **低 NFE 优势的边界**：在极少步数（1–5步）之外，CFM 的优势趋于饱和，需切换回欧拉积分。
- **未涉及真实彩色图像**：图像实验仅在二值 MNIST 上进行，未扩展至 CIFAR-10/100 等彩色图像。
- **潜在的选择偏差**：分子图实验使用的 QM9/ZINC 为相对小型数据集，在更大规模分子数据集上的泛化性有待验证。

---

（完）
