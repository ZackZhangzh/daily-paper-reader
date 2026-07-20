---
title: "LoBE-GS: Load-Balanced and Efficient 3D Gaussian Splatting for Large-Scale Scene Reconstruction"
title_zh: LoBE-GS：面向大规模场景重建的负载均衡高效3D高斯泼溅
authors: "Sheng-Hsiang Hung, Ting-Yu Yen, Wei-Fang Sun, Shih-Hsuan Hung, Simon See, Hung-Kuo Chu"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=3YtTzpEHZR"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 3D高斯泼溅用于大规模场景重建，并实现负载均衡
tldr: 本文提出LoBE-GS框架，针对3D高斯泼溅在城市场景等大规模场景重建中的负载不平衡和粗到细管道高开销问题，通过新的负载均衡策略和高效粗阶段利用，实现可扩展的实时高质量重建。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 3DGS扩展到大场景时分区负载不均且粗阶段效率低。
method: 设计负载均衡分区策略和高效粗阶段利用机制。
result: 显著提升大规模场景重建的效率和可扩展性。
conclusion: LoBE-GS使3DGS适用于城市级场景重建。
---

## Abstract
3D Gaussian Splatting (3DGS) has established itself as an efficient representation for real-time, high-fidelity 3D scene reconstruction. However, scaling 3DGS to large and unbounded scenes such as city blocks remains difficult. Existing divide-and-conquer methods alleviate memory pressure by partitioning the scene into blocks, but introduce new bottlenecks: (i) partitions suffer from severe load imbalance since uniform or heuristic splits do not reflect actual computational demands, and (ii) coarse-to-fine pipelines fail to exploit the coarse stage efficiently, often reloading the entire model and incurring high overhead. In this work, we introduce LoBE-GS, a novel Load-Balanced and Efficient 3D Gaussian Splatting framework, that re-engineers the large-scale 3DGS pipeline. LoBE-GS introduces a depth-aware partitioning method that reduces preprocessing from hours to minutes, an optimization-based strategy that balances visible Gaussians—a strong proxy for computational load—across blocks, and two lightweight techniques, visibility cropping and selective densification, to further reduce training cost.
Evaluations on large-scale urban and outdoor datasets show that LoBE-GS consistently achieves up to $2\times$ faster end-to-end training time than state-of-the-art baselines, while maintaining reconstruction quality and enabling scalability to scenes infeasible with vanilla 3DGS.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **背景**：3D高斯泼溅（3DGS）已成为实时高保真3D场景重建的高效表示方法。然而，将3DGS扩展到城市街区等大规模无界场景时，面临严重的内存和计算瓶颈。
- **现有方案的局限**：主流方法采用“分而治之”策略，将大场景划分为多个空间块并行处理，但引入两大新瓶颈：
  1. **负载不均衡**：基于均匀网格或启发式规则的分区策略无法反映实际计算需求，导致各块训练时间严重不均，最慢的块主导总训练时间。
  2. **粗到细管道低效**：CityGS等方法在精细阶段需完整加载粗模型，产生大量计算开销。
- **本文目标**：提出LoBE-GS框架，通过负载均衡感知的场景分区、快速相机选择和两种轻量级优化技术，从根本上重构大规模3DGS管道，实现可扩展的实时高质量重建。

## 2. 方法论：核心思想、关键技术细节

### 核心思想

LoBE-GS采用“粗到细”的并行训练框架：先训练一个粗模型，再将其分区为多个块进行并行精细训练。核心在于通过**负载均衡感知的分区**和**高效的粗阶段利用**来消除训练瓶颈。

### 关键技术一：负载均衡感知的场景分区

- **代理指标的选取**：作者系统分析了多种候选代理变量与精细训练运行时的相关性，包括块面积、相机数量、块内高斯点数量、**可见高斯点数量**（`G_vis`）等。实验表明，`G_vis`（块内所有分配相机可见的初始高斯点数量）与精细训练时长的相关性最强且最稳定，因此被选为计算负载的可靠代理。
- **优化目标**：对于`m×n`的网格分区，通过贝叶斯优化（BO）迭代调整水平和垂直切割位置，使所有块中`max G_vis`最小化。
- **约束与实现**：切割位置限制在相邻初始切割中点之间，以保持空间有序性；`G_vis`的计算在NVIDIA Warp中实现，接近原生CUDA性能。

### 关键技术二：快速相机选择

- **问题**：CityGS等方法的相机分配需要对每个块渲染所有视图，复杂度高达`O(M×N)`，预处理耗时可达数小时。
- **解决方案**：利用粗模型的深度图进行**反投影**，为每个相机生成密集点云，然后计算落在每个块内的点比例作为可见性指标，快速筛选出覆盖度超过阈值（τ=0.15）的相机。复杂度降至线性的`O(N)`。

### 关键技术三：可见性裁剪与选择性稠密化

- **可见性裁剪（Visibility Cropping）**：精细训练前，仅保留块内所有分配相机可见的高斯点，剪除不可见的高斯点以减少计算量。
- **选择性稠密化（Selective Densification）**：稠密化操作仅对严格位于块边界内的高斯点进行，对块外但可见的高斯点（用于维持渲染质量）不进行稠密化，从而减少新增高斯点数量，降低内存消耗和优化开销。

## 3. 实验设计：数据集、Benchmark与对比方法

- **数据集**：共使用**5个大规模场景**：
  - **Mill19**：Building、Rubble（真实世界）
  - **UrbanScene3D**：Residence、Sci-Art（真实世界）
  - **MatrixCity**：Aerial（合成数据集，代表小型城市区域）
- **数据预处理**：MatrixCity图像缩放到宽1600像素；真实世界数据集按先前工作惯例下采样4倍。
- **对比方法**：CityGS、VastGS（VastGaussian）、DOGS；以及扩展训练的原始3DGS（3DGS†，60k迭代）。
- **评估指标**：
  - 重建质量：PSNR、SSIM、LPIPS
  - 效率指标：`T_coarse`（粗阶段时间）、`T_partition`（分区时间）、`max T_fine`（最慢块精细训练时间）、`T_E2E`（端到端总时间）
- **公平性处理**：与DOGS、VastGS对比时使用颜色校正版本指标；与3DGS、CityGS对比时使用标准指标。

## 4. 资源与算力

**论文未明确说明使用的GPU型号、数量等具体硬件配置**，仅提到“所有运行时间在相同的计算硬件上测量，详细规格见附录A.1”。附录在提供的文本中未包含，因此无法获取具体的GPU信息。

## 5. 实验数量与充分性

- **实验规模**：论文在**5个数据集**上进行了系统评估，涵盖真实世界和合成场景；对比了**4种基线方法**（CityGS、VastGS、DOGS、3DGS†）。
- **充分性分析**：
  - **覆盖范围**：数据集覆盖了城市建筑、废墟、住宅、艺术展馆、合成城市等多种场景类型，具有较好的代表性。
  - **消融实验**：在提供的文本中未找到明确的消融实验（ablation study）描述，但各组件（负载均衡分区、快速相机选择、可见性裁剪、选择性稠密化）的功能均有单独阐述。
  - **公平性**：论文在数据预处理、指标计算、块配置等方面均与基线保持一致，体现了较好的实验公平性。
  - **局限性**：未报告DOGS的运行时间（因其分布式训练设置与本文的并行独立设置不可比），可能影响对比的完整性。

## 6. 主要结论与发现

1. **端到端加速**：LoBE-GS相比最先进基线实现了**最高2倍**的端到端训练加速。
2. **重建质量保持或提升**：在PSNR、SSIM、LPIPS等指标上，LoBE-GS取得与CityGS相当或略优的性能；在颜色校正指标上，优于VastGS和DOGS。
3. **预处理大幅提速**：深度感知分区方法将预处理从数小时缩短至数分钟。
4. **负载均衡有效**：LoBE-GS的分区策略实现了更均衡的块间运行时分布，消除了长尾瓶颈。
5. **可扩展性**：使3DGS能够处理原始方法无法应对的超大规模场景。

## 7. 方法或实验设计的亮点

1. **代理指标的创新选择**：通过系统的相关性分析，首次将**可见高斯点数量**作为计算负载的可靠代理，而非简单依赖面积或相机数量。
2. **端到端的系统性优化**：不仅关注分区负载均衡，还贯穿了相机选择、高斯裁剪和稠密化等全流程。
3. **预处理效率的突破**：将相机分配的复杂度从`O(M×N)`降至`O(N)`，使预处理时间从小时级降至分钟级。
4. **高效的工程实现**：在NVIDIA Warp中实现核心计算，达到接近原生CUDA的性能。
5. **标准化的评估协议**：建立了统一的效率评估指标（`T_coarse`、`T_partition`、`max T_fine`、`T_E2E`），便于后续研究对比。

## 8. 不足与局限

1. **硬件信息缺失**：未明确说明实验所用的GPU型号、数量和具体硬件配置。
2. **DOGS对比不完整**：未报告DOGS的运行时间，因其分布式训练涉及通信开销而被排除在运行时对比之外，可能影响对分布式方法比较的全面性。
3. **消融实验未明确呈现**：在提供的文本中未找到对各组件的独立消融分析，难以量化每个技术贡献的具体效果。
4. **依赖粗模型质量**：方法依赖于粗模型的深度信息进行相机分配和可见性计算，粗模型的质量可能影响后续分区的效果。
5. **应用场景限制**：虽然面向城市级场景，但评估数据集规模（如MatrixCity-Aerial为“小型城市区域”）是否足以代表真正的大规模城市场景仍有待验证。
6. **与分布式方法的可比性**：本文采用“并行但独立”的训练设置，与DOGS等需要频繁通信的分布式方法在范式上存在本质差异，结果可比性有限。

（完）
