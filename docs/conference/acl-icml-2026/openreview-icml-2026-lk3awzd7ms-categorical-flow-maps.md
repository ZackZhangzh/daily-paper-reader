---
title: Categorical Flow Maps
title_zh: 分类流映射
authors: "Daan Roos, Oscar Davis, Floor Eijkelboom, Michael M. Bronstein, Max Welling, İsmail İlkan Ceylan, Luca Ambrogioni, Jan-Willem van de Meent"
date: 2026-04-30
pdf: "https://openreview.net/pdf/47aa2367bb4b4e013315dcfa2798221b7a7c1a85.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 针对分类数据的流匹配方法，轨迹连续
tldr: 分类数据的生成常受限于离散扩散，本文提出分类流映射，一种基于自蒸馏的流匹配方法，通过向单纯形连续输运概率质量，实现少步加速生成，并兼容现有蒸馏和引导技术，为分类数据生成提供了连续化路径。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有分类数据生成缺乏连续且加速的流匹配方案，需要连续轨迹以利用蒸馏技术。
method: 定义向单纯形的流映射，连续输运概率质量，并引入端点一致性目标进行自蒸馏。
result: 实现了少步生成，并可直接复用分类域中的引导和重加权技术。
conclusion: 分类流映射将流匹配扩展到分类数据，加速生成并保持连续轨迹优势。
---

## Abstract
We introduce Categorical Flow Maps, a flow-matching method for accelerated few-step generation of categorical data via self-distillation. Building on recent variational formulations of flow matching and the broader trend towards accelerated inference in diffusion and flow-based models, we define a flow map towards the simplex that transports probability mass toward a predicted endpoint, yielding a parametrisation that naturally constrains model predictions. Since our trajectories are continuous rather than discrete, Categorical Flow Maps can be trained with existing distillation techniques, as well as a new objective based on endpoint consistency. This continuous formulation also automatically unlocks test-time inference: we can directly reuse existing guidance and reweighting techniques in the categorical setting to steer sampling toward downstream objectives. Empirically, we achieve state-of-the-art few-step results on images, molecular graphs, and text, with strong performance even in single-step generation.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

- **研究动机**：扩散模型与流模型在连续域（如图像）已实现少步甚至单步高质量生成，但分类数据（文本、分子图、序列等）的生成仍依赖于昂贵的自回归模型或高步数离散扩散链，推理效率低下。
- **核心问题**：能否为分类数据设计一种**连续的**流匹配框架，使其既能享受连续空间中蒸馏与加速推理的技术红利，又能天然处理离散/分类结构？
- **整体含义**：本文提出 **Categorical Flow Maps（分类流映射，CFM）** ，将分类数据生成从离散状态空间提升到概率单纯形上的连续输运过程，从而将流匹配的适用范围从连续域扩展到分类数据。

## 2. 方法论

- **核心思想**：将离散类别分布嵌入概率单纯形（simplex），定义从连续先验分布到目标类别分布的连续概率流；模型不直接预测速度向量，而是**预测终点（干净的类别分布）** ，再解析地推导出速度，从而天然保证流始终停留在单纯形内部。
- **关键技术细节**：
    - **端点参数化（Endpoint Parametrization）** ：传统流匹配预测速度向量，但在单纯形上速度向量可能使概率值越界或和为负；本文改为预测目标终点，再解析计算速度，确保流在几何上有效。
    - **自蒸馏训练**：基于近期流映射的变分形式，引入 **端点一致性拉格朗日蒸馏损失（Endpoint-Consistent Lagrangian Distillation, ECLD）** ，用交叉熵替代传统MSE作为一致性项，正确惩罚分布差异。
    - **测试时推理**：连续化公式天然兼容现有连续域中的引导（guidance）与重加权（reweighting）技术（如Classifier-free Guidance），可直接复用于分类场景以调控生成方向。
- **算法流程**（文字说明）：
    1. 将离散数据（如token、分子图）编码为概率单纯形上的点（如one-hot向量）；
    2. 定义从先验分布到目标分布的连续概率路径；
    3. 训练一个参数化流映射，预测从任意中间时间点到终点的位移；
    4. 通过自蒸馏（ECLD损失）优化模型，使其在少步（1–4步）内即可高质量生成；
    5. 测试时可直接采用少步欧拉采样，并可接入引导技术调控生成属性。

## 3. 实验设计

- **数据集与场景**：覆盖**三类离散数据模态**：
    - **分子图**：QM9（最多9个重原子）和 ZINC250k（最多38个重原子）
    - **二值化图像**：MNIST
    - **文本**：Text8 和 LM1B
- **Benchmark与对比方法**：
    - 分子图：对比多步扩散/流基线（GDSS、GruM、CatFlow、DeFoG）以及单步基线（Set2GraphVAE、MoFlow、PairFlow）
    - 同时设置“Naive Flow Map”作为消融对照——使用相同的模型但采用标准拉格朗日损失（无约束速度场），以隔离端点参数化的效果
- **评估指标**：分子图使用 Validity（有效性）、Uniqueness（唯一性）、FCD（Fréchet ChemNet Distance）；图像使用 FID；文本使用 NLL 和 Gen-PPL

## 4. 资源与算力

> **论文未明确说明**所使用的GPU型号、数量或训练时长。在可获取的论文摘要、arXiv页面及HTML全文预览中，均未报告具体的算力配置信息。

## 5. 实验数量与充分性

- **实验数量**：涵盖**3种数据模态 × 5个数据集**（QM9、ZINC250k、MNIST、Text8、LM1B），在分子图上对比了**多个多步与单步基线**，并设置了**消融实验**（Naive Flow Map对照）以验证端点参数化的有效性。
- **充分性与客观性**：
    - 实验覆盖了图像、分子图、文本三大典型分类数据场景，具有较好的代表性；
    - 对比基线涵盖了该领域的主流方法（扩散、流、自回归变体），对比维度较为全面；
    - 设置了消融实验以隔离核心贡献（端点参数化 vs. 无约束速度场）；
    - 文本结果在摘要中提及（Text8 NLL 10.1，LM1B Gen-PPL 274.87），但具体对比基线在可获取材料中未充分展开。
    - **总体而言，实验设计较为充分和公平**，但完整实验细节（如超参数、训练协议）需参考论文附录。

## 6. 主要结论与发现

- CFM在**图像、分子图和文本**三类任务上均取得了**少步生成（1–4步）的SOTA结果**，甚至在**单步生成**中仍表现强劲。
- **分子图**：QM9上单步生成有效性显著超越此前单步基线（Set2GraphVAE、MoFlow、PairFlow），两步生成即达到近饱和有效性（~97%）；ZINC250k上ECLD以1步NFE达到93.5%有效性，远超MoFlow（11%）和PairFlow（63.1%）。
- **端点参数化**的优势在高维数据（ZINC）上尤为显著，无约束速度场的Naive Flow Map在ZINC上表现大幅落后。
- **连续轨迹**的设计使CFM天然兼容现有蒸馏技术与测试时引导技术，无需重新训练即可调控生成。

## 7. 优点

- **方法论创新**：首次将流匹配的连续加速推理范式系统性地扩展到分类数据，填补了该领域的空白。
- **轨迹连续性**：与离散扩散不同，CFM的连续轨迹使其可直接复用连续域中成熟的蒸馏和引导技术，这是离散方法难以实现的。
- **端点参数化设计精巧**：通过预测终点而非速度，天然保证概率单纯形约束，避免了复杂的投影或惩罚操作。
- **实验覆盖全面**：涵盖图像、分子图、文本三大模态，验证了方法的通用性。
- **工程友好**：无需Gumbel-Softmax等松弛技巧，代码已开源。

## 8. 不足与局限

- **算力信息缺失**：论文未报告训练所需的GPU型号、数量或时长，不利于复现时的资源评估。
- **文本任务的对比深度有限**：摘要和可获取材料中文本结果呈现较少（仅提及NLL和Gen-PPL数值），与自回归基线及离散扩散基线的详细对比有待补充。
- **二值化图像的限制**：图像实验仅在二值化MNIST上进行，未涉及更复杂的彩色图像数据集（如CIFAR-10/100），尽管BAAI简介中提到CIFAR-10/100，但HTML全文的实验中未出现CIFAR相关结果。
- **规模扩展性**：论文主要展示中小规模数据集上的结果，CFM在大规模文本或高分辨率图像分类数据上的扩展性尚待验证（已有后续工作“Scaling Categorical Flow Maps”对此进行探索）。
- **依赖连续松弛**：方法依赖将离散数据嵌入单纯形的连续表示，对于某些 inherently discrete 的评估指标（如精确匹配）可能存在松弛误差。

（完）
