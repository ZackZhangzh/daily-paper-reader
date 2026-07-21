---
title: "Creat3r: Confidence Reaggregation for Exploration-aware Active 3D Reconstruction"
title_zh: Creat3r：面向探索感知主动三维重建的置信重聚合
authors: "Chih-Jung Tsai, Hwann-Tzong Chen, Tyng-Luh Liu"
date: 2026-04-30
pdf: "https://openreview.net/pdf/f275d0cf84eb0f2b3fbdc5da5263aaab65ac93cf.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 从稀疏初始图像-姿态对使用3DGS进行主动3D重建
tldr: 针对从少量初始图像出发的高效高质量三维重建问题，提出Creat3r迭代下一最佳视角选择框架，基于3DGS重建并构建三维置信场指导视角选择，平衡已知区域利用和未知区域探索，在有限视角下实现高效重建。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 从少量种子图像开始，需要自动选择最信息量的下一视角以提升重建质量。
method: 基于3DGS重建，构建三维置信场并通过高斯投影生成二维置信与探索图，指导下一最佳视角选择。
result: 高效实现高质量三维重建，适用于稀疏视角场景。
conclusion: 置信场驱动的主动视角选择可显著提升稀疏输入3DGS重建效果。
---

## Abstract
We present Creat3r, an iterative next-best-view (NBV) selection framework for efficient, high-quality 3D reconstruction. Starting from a small seed set of image-pose pairs, Creat3r repeatedly selects the most informative next camera pose. After each pose is chosen, the corresponding image is acquired and added to the multi-view set to update a 3DGS reconstruction. To guide selection, Creat3r constructs an intermediate point cloud and estimates reconstruction reliability via a novel 3D confidence field, which is projected to candidate poses through Gaussian projection to produce 2D confidence and exploration maps. These maps balance exploitation of reliable regions and exploration of uncertain or unseen areas under computational constraints. Experiments with standard 3DGS show that Creat3r consistently outperforms baselines in novel view synthesis and surface reconstruction, achieving higher SSIM and F1 scores with fewer views.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机和背景）

**研究问题**：在仅有少量初始图像-姿态对（seed set）的条件下，如何自动、高效地选择后续最富信息量的相机视角，以提升三维重建的质量。

**研究背景**：主动三维重建（Active 3D Reconstruction）的核心挑战在于，用尽可能少的视角精确重建目标场景。近年来3D高斯泼溅（3DGS）已成为一种实用且可扩展的重建方法，但如何为3DGS设计高效的主动视角选择策略仍有待探索。**Creat3r**提出了一种迭代式下一最佳视角（Next-Best-View, NBV）选择框架，旨在平衡**已知区域的利用（exploitation）** 与**未知区域的探索（exploration）**，在有限视角预算下实现高质量重建。

## 2. 方法论

### 核心思想

Creat3r构建一个**三维置信场（3D confidence field）**来评估当前重建的可靠性，并通过**高斯投影（Gaussian projection）**将该置信信息投影到候选视角上，生成二维置信图与探索图，以此指导下一最佳视角的选择。

### 关键技术流程

1. **中间点云构建**：通过密集像素对应关系与立体三角化（stereo triangulation）生成中间三维点云，并利用**直接线性变换（Direct Linear Transform, DLT）**细化点估计。

2. **三维置信场估计**：引入一种新颖的三维置信场，综合**相机支持（camera support）** 与**视角一致性（view consistency）**，对每个三维点的重建质量进行定量评估。

3. **置信信息传播**：通过高效的高斯投影技术，将三维置信场信息传播到所有候选视角，为每个潜在视点生成**二维置信图**与**探索图**。

4. **下一最佳视角选择**：基于生成的置信图和探索图定义探索度量（exploration measure），据此评估并最优选择下一视角——在可靠区域（高置信度）与未知/未观测区域之间取得平衡。

5. **迭代更新**：选定视角后采集对应图像，将其加入多视角集合，更新3DGS重建，然后重复上述过程。

## 3. 实验设计

**数据集/场景**：论文使用标准的3DGS表示进行评估。具体数据集名称在摘要材料中未明确列出。

**对比方法（Baselines）** ：论文将Creat3r与多种基线方法进行了对比，但具体对比方法的名称在摘要材料中未逐一列出。

**评估指标**：
- **新视角合成（Novel View Synthesis）** ：以**SSIM（结构相似性指标）** 为主要评估指标。
- **表面重建（Surface Reconstruction）** ：以**F1分数**为主要评估指标。

**核心发现**：Creat3r在**更少视角**的条件下，相比基线方法在新视角合成和表面重建任务上均取得了一致的性能提升。

## 4. 资源与算力

**文中未明确说明**所使用GPU型号、数量、训练时长等具体算力信息。论文仅提及Creat3r在**计算约束（computational constraints）** 下平衡利用与探索，表明该方法考虑了计算效率，但未披露具体硬件配置。

## 5. 实验数量与充分性

**实验设置**：论文使用**标准3DGS表示**进行评估，并在**新视角合成**与**表面重建**两个任务上与基线方法进行对比。

**充分性评估**：
- 从摘要信息来看，实验覆盖了主动三维重建的两个核心评估维度（新视角合成质量与几何重建精度），评估指标（SSIM、F1）也具有代表性。
- 但由于摘要材料未提供完整实验章节的详细信息（如具体数据集规模、基线方法数量、消融实验设计等），难以对实验的**全面性与充分性**做出完整判断。

**公平性评估**：论文使用**标准3DGS**作为统一的重建后端，在**相同视角数量**条件下与基线进行对比，这一设计有助于保证对比的公平性。

## 6. 主要结论与发现

1. **置信场驱动的主动视角选择策略有效**：通过三维置信场与高斯投影技术，Creat3r能够有效指导下一最佳视角的选择。

2. **在有限视角下实现更优重建**：Creat3r在**更少视角**的条件下，即可达到比基线方法更高的SSIM和F1分数。

3. **兼具效率与质量**：该方法在平衡探索、重建精度与计算效率方面表现良好，适用于自主三维扫描、机器人视觉与多视角场景重建等实际应用。

## 7. 优点（亮点）

| 维度 | 亮点说明 |
|------|----------|
| **方法创新性** | 提出新颖的**三维置信场**概念，将相机支持与视角一致性统一纳入重建可靠性评估 |
| **技术适配性** | 专门针对**3DGS**设计主动视角选择策略，紧跟三维重建领域的前沿技术范式 |
| **效率设计** | 通过**高斯投影**高效传播置信信息，在计算约束下实现利用与探索的平衡 |
| **应用价值** | 适用于**自主三维扫描、机器人视觉、多视角场景重建**等实际场景 |
| **实证效果** | 在**更少视角**下取得更高的SSIM和F1分数，验证了方法的有效性与数据效率 |

## 8. 不足与局限

1. **实验细节披露不足**：摘要材料中未列出具体使用的数据集名称、基线方法列表、消融实验设计等关键信息，限制了读者对方法鲁棒性与泛化能力的全面评估。

2. **算力资源未说明**：未明确报告训练/推理所用的GPU型号、数量及时间，不利于实验的可复现性评估。

3. **场景类型覆盖未知**：未说明实验覆盖的场景类型（如室内/室外、物体级/场景级），方法的适用边界尚不清晰。

4. **依赖初始种子图像**：方法从少量种子图像-姿态对出发，初始种子图像的质量与分布对最终重建效果的影响程度未在摘要中讨论。

5. **真实部署验证缺失**：虽然论文指出方法适用于机器人视觉等场景，但摘要材料未提及在真实机器人系统上的部署验证。

（完）
