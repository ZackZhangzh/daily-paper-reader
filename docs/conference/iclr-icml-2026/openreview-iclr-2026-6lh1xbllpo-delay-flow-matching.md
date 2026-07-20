---
title: Delay Flow Matching
title_zh: 延迟流匹配
authors: "Bolin Zhao, Xiaoyu Zhang, Yuting Dong, Xin Lu, Wei Lin, Qunxi Zhu"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=6lH1XblLpo"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 基于延迟微分方程的延迟流匹配
tldr: 传统流匹配基于常微分方程，无法建模轨迹交叉和延迟动态，且难以处理异构分布转移。本文提出延迟流匹配，采用延迟微分方程，理论上证明了其对连续转移映射的通用逼近能力。通过引入延迟项，该方法能保留分布间关键耦合与结构信息，实验验证了其在复杂动态系统建模上的优越性。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准流匹配无法处理轨迹交叉和延迟动态，限制其应用。
method: 将流匹配推广到延迟微分方程，引入延迟项以捕捉历史依赖。
result: 理论证明通用逼近性，实验显示在延迟系统生成任务中优于传统FM。
conclusion: 延迟流匹配拓展了流匹配的建模能力，适用于更复杂的动态过程。
---

## Abstract
Flow matching (FM) based on Ordinary Differential Equations (ODEs) has achieved significant success in generative tasks. However, it faces several inherent limitations, including an inability to model trajectory intersections, capture delay dynamics, and handle transfer between heterogeneous distributions. These limitations often result in a significant mismatch between the modeled transfer process and real-world phenomena, particularly when key coupling or inherent structural information between distributions must be preserved. To address these issues, we propose Delay Flow Matching (DFM), a new FM framework based on Delay Differential Equations (DDEs). Theoretically, we show that DFM possesses universal approximation capability for continuous transfer maps. By incorporating delay terms into the vector field, DFM enables trajectory intersections and better captures delay dynamics. Moreover, by designing appropriate initial functions, DFM ensures accurate transfer between heterogeneous distributions. Consequently, our framework preserves essential coupling relationships and achieves more flexible distribution transfer strategies. We validate DFM's effectiveness across synthetic datasets, single-cell data, and image-generation tasks.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义（研究动机和背景）

- **研究背景**：基于常微分方程（ODE）的流匹配（Flow Matching, FM）方法在生成任务中取得了显著成功。
- **核心问题**：标准FM面临若干固有局限，包括：
  1. 无法建模轨迹交叉（trajectory intersections）；
  2. 无法捕捉延迟动态（delay dynamics）；
  3. 难以处理异构分布（heterogeneous distributions）之间的转移。
- **整体含义**：上述局限导致FM建模的转移过程与真实世界现象之间存在显著偏差，尤其是在需要保留分布间关键耦合信息或内在结构信息时问题尤为突出。为此，作者提出**延迟流匹配（Delay Flow Matching, DFM）**，将FM推广到延迟微分方程（DDE）框架下。

---

## 二、论文提出的方法论

- **核心思想**：将流匹配从常微分方程（ODE）推广到**延迟微分方程（DDE）**，通过在向量场中引入延迟项来捕捉历史依赖信息。
- **关键技术细节**：
  - 在向量场中显式加入延迟项，使得轨迹可以相交（突破了ODE框架下轨迹不相交的限制）；
  - 通过设计恰当的初始函数（initial functions），确保DFM能够实现异构分布之间的准确转移。
- **理论贡献**：论文从理论上证明了DFM对**连续转移映射具有通用逼近能力**（universal approximation capability）。
- **算法流程（文字说明）**：DFM的核心流程可概括为——将标准FM中的ODE替换为DDE，在训练过程中引入延迟项以建模历史状态对当前向量场的影响；在推理（生成）时，通过求解DDE从初始分布向目标分布演进，从而实现更灵活、更保结构的分布转移。

---

## 三、实验设计

- **数据集/场景**：论文在以下三类任务上验证了DFM的有效性：
  - **合成数据集（synthetic datasets）**：用于基础性能验证；
  - **单细胞数据（single-cell data）**：检验方法在生物学数据上的适用性；
  - **图像生成任务（image-generation tasks）**：评估在高维生成场景下的表现。
- **Benchmark与对比方法**：论文将DFM与传统的FM方法进行对比，重点考察在延迟系统生成任务中DFM是否优于传统FM。

---

## 四、资源与算力

- **说明**：所提供的内容（包括摘要和元数据）中**未明确提及**具体使用的GPU型号、数量或训练时长等信息。
- 如需了解算力细节，需查阅论文全文的实验设置部分。

---

## 五、实验数量与充分性

- **实验数量**：从摘要可知，论文至少涵盖**三类数据集**（合成数据、单细胞数据、图像生成）的实验。元数据中未提及是否包含消融实验（ablation studies）或其他系统性分析。
- **充分性与客观性判断**：
  - 实验覆盖了从低维合成数据到高维图像生成的多个场景，具有一定广度；
  - 对比对象明确为传统FM，基线选择合理；
  - 但由于摘要信息有限，无法判断实验的重复次数、统计显著性检验、超参数敏感性分析等细节，因此**难以完全评估实验的充分性与公平性**。

---

## 六、论文的主要结论与发现

- DFM通过引入延迟微分方程，成功**拓展了流匹配的建模能力**，能够处理传统FM无法应对的轨迹交叉和延迟动态问题。
- 理论证明DFM具有**通用逼近能力**，为其广泛应用提供了理论支撑。
- 实验结果表明，在延迟系统生成任务中DFM**优于传统FM**，并在合成数据、单细胞数据和图像生成任务上均验证了有效性。
- DFM通过保留分布间的关键耦合关系，实现了**更灵活的分布转移策略**。

---

## 七、优点（方法或实验设计上的亮点）

- **方法创新性突出**：首次将延迟微分方程引入流匹配框架，突破了ODE的固有局限。
- **理论支撑扎实**：给出了DFM通用逼近能力的理论证明，增强了方法的可信度。
- **解决实际痛点**：针对真实世界中广泛存在的延迟动态和异构分布转移问题，提供了有效的建模方案。
- **实验场景多样**：覆盖合成数据、单细胞数据和图像生成三个不同领域，验证了方法的泛化能力。

---

## 八、不足与局限

- **实验细节披露不足**：从现有内容无法获知消融实验、超参数敏感性分析、计算效率对比等关键实验细节。
- **应用范围有待验证**：虽然已在三类任务上验证，但对于更大规模、更复杂的高维实际问题（如高分辨率视频生成、物理仿真等）的适用性尚不明确。
- **理论假设的边界**：通用逼近能力的成立条件、延迟项设计的通用性等理论细节在摘要中未展开，可能存在一定的应用限制。
- **算力与效率未知**：DDE的求解通常比ODE更复杂，DFM是否带来显著的计算开销以及如何优化，文中未提及。

---

（完）
