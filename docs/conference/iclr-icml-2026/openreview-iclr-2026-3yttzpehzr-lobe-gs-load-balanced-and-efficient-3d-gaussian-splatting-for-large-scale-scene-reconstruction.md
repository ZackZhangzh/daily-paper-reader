---
title: "LoBE-GS: Load-Balanced and Efficient 3D Gaussian Splatting for Large-Scale Scene Reconstruction"
title_zh: LoBE-GS：负载均衡且高效的3D高斯泼溅用于大规模场景重建
authors: "Sheng-Hsiang Hung, Ting-Yu Yen, Wei-Fang Sun, Shih-Hsuan Hung, Simon See, Hung-Kuo Chu"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=3YtTzpEHZR"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 负载均衡3DGS用于大规模实时场景重建
tldr: 将3DGS扩展到城市级大场景面临负载不均衡和粗到细流水线低效问题。本文提出LoBE-GS，通过自适应分区和流式加载平衡计算负载，并优化粗阶段利用，实现高保真大规模场景实时重建。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有分治方法负载不均衡且粗阶段开销大，难以处理大场景。
method: 引入负载均衡框架，自适应分区和流式加载。
result: 改善负载均衡，降低粗阶段重载开销，支持大规模场景实时重建。
conclusion: 有效扩展3DGS至城市级场景。
---

## Abstract
3D Gaussian Splatting (3DGS) has established itself as an efficient representation for real-time, high-fidelity 3D scene reconstruction. However, scaling 3DGS to large and unbounded scenes such as city blocks remains difficult. Existing divide-and-conquer methods alleviate memory pressure by partitioning the scene into blocks, but introduce new bottlenecks: (i) partitions suffer from severe load imbalance since uniform or heuristic splits do not reflect actual computational demands, and (ii) coarse-to-fine pipelines fail to exploit the coarse stage efficiently, often reloading the entire model and incurring high overhead. In this work, we introduce LoBE-GS, a novel Load-Balanced and Efficient 3D Gaussian Splatting framework, that re-engineers the large-scale 3DGS pipeline. LoBE-GS introduces a depth-aware partitioning method that reduces preprocessing from hours to minutes, an optimization-based strategy that balances visible Gaussians—a strong proxy for computational load—across blocks, and two lightweight techniques, visibility cropping and selective densification, to further reduce training cost.
Evaluations on large-scale urban and outdoor datasets show that LoBE-GS consistently achieves up to $2\times$ faster end-to-end training time than state-of-the-art baselines, while maintaining reconstruction quality and enabling scalability to scenes infeasible with vanilla 3DGS.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

3D Gaussian Splatting（3DGS）已成为实时、高保真3D场景重建的高效表示方法，但将其扩展到城市街区等大规模无界场景仍面临重大挑战。

现有方法采用“分而治之”策略，将大场景划分为若干空间块（block）进行并行处理以缓解内存压力。然而，这种做法引入了新的瓶颈：

- **负载不均衡**：均匀网格或启发式划分无法反映实际计算需求，不同子区域的计算负载差异悬殊，最慢的块主导总训练时间，形成“长尾瓶颈”。
- **粗到细流水线低效**：现有方法（如CityGS）在粗阶段之后未能充分利用粗模型加速精细优化，通常需要完整重载整个模型，带来沉重的计算开销。

针对上述问题，本文提出 **LoBE-GS**（Load-Balanced and Efficient 3D Gaussian Splatting），旨在从根本上重新设计大规模3DGS流水线，实现负载均衡且高效的并行训练。

## 2. 方法论

### 2.1 核心思想

LoBE-GS的核心思想是：**以“初始可见高斯点数量”作为计算负载的可靠代理，通过优化场景划分来均衡各块的可见高斯点数量**，从而消除长尾训练瓶颈。全文在5个大规模数据集上验证了该代理与精细训练运行时的强相关性（Pearson相关系数最高）。

### 2.2 关键技术细节

**（1）负载均衡感知的场景划分（Load balance-aware scene partition）**

- 给定一个 \(m \times n\) 的网格划分和粗模型，目标是优化垂直与水平切割位置，使得所有块中可见高斯点数量的最大值最小化。
- 目标函数为：\(({\bm{v}}^*, {\bm{h}}^*) = \arg\min_{{\bm{v}},{\bm{h}}} \max_b G_{\text{vis}}^{(b)}({\bm{v}}, {\bm{h}})\)。
- 由于 \(G_{\text{vis}}^{(b)}\) 不可微分，采用**贝叶斯优化（BO）** 配合高斯过程代理进行迭代切割优化，初始为均匀划分，每次迭代约束切割位置不超过相邻切割的一半距离。实践表明 \(L=100\) 次迭代即可获得满意结果。

**（2）快速相机选择（Fast Camera Selection）**

- 现有方法（如CityGS）为每个块分配相机时需渲染每个视角的粗模型，复杂度为 \(O(M \times N)\)（\(M\) 为块数，\(N\) 为视角数），耗时可达数小时。
- LoBE-GS利用粗模型的深度图反投影生成每个相机的密集点云，计算点云落入各块的比例作为可见性指标 \(V_{c,b}\)，仅需单次投影。
- 复杂度降至 \(O(N)\)，将预处理时间从数小时缩短至数分钟。

**（3）可见性裁剪（Visibility Cropping）与选择性稠密化（Selective Densification）**

- **可见性裁剪**：精细训练前，仅保留每个块中对其分配相机可见的高斯点（\({\mathcal{G}}_{\text{vis}}^{(b)}\)），而非直接保留块内所有高斯点或加载完整粗模型，大幅减少参与优化的高斯点数量。
- **选择性稠密化**：稠密化操作仅对严格位于块内的高斯点（\({\mathcal{G}}_{\text{blk}}^{(b)}\)）进行，避免对块外但可见的高斯点进行不必要的稠密化，降低内存消耗并提升优化效率。

整体流水线为：粗模型训练 → 负载均衡感知划分 + 快速相机选择 → 并行精细训练（含可见性裁剪和选择性稠密化）→ 块合并。

## 3. 实验设计

### 3.1 数据集与场景

在**5个大规模场景**上进行了评估：

- **真实世界数据集**：Mill19的Building和Rubble；UrbanScene3D的Residence和Sci-Art。
- **合成数据集**：MatrixCity的Aerial（小城市区域）。

所有真实世界图像按下采样4倍处理，MatrixCity图像resize至宽度1600像素，与先前工作保持一致。

### 3.2 对比方法（Baseline）

对比了以下大规模3DGS方法：

- **CityGS**（Liu et al., 2025）
- **VastGS**（Lin et al., 2024）
- **DOGS**（Chen & Lee, 2024）
- **3DGS†**：扩展训练至60k迭代的原始3DGS

对于VastGS和DOGS，直接采用DOGS论文中报告的指标；运行时分析使用VastGS的非官方实现（无外观建模），记为VastGS†。DOGS的分布式训练涉及互联通信开销，其运行时结果不直接可比，故未报告。

### 3.3 评估指标

- **重建质量**：PSNR、SSIM、LPIPS。与DOGS和VastGS对比时采用颜色校正版本（C-PSNR、C-SSIM、C-LPIPS）；与3DGS和CityGS对比时采用标准版本。
- **效率指标**：\(T_{\text{coarse}}\)（粗阶段时间）、\(T_{\text{partition}}\)（划分时间）、\(\max T_{\text{fine}}\)（最慢块精细训练时间）、\(T_{\text{E2E}}\)（端到端总时间）。

## 4. 资源与算力

论文**明确提及**所有运行时均在“相同的计算硬件”上测量，并指出详细规格见附录A.1。但**附录A.1的具体GPU型号、数量等细节在提供的文本中未展开**。不过，从论文描述的并行训练设置可知，各块在不同GPU上并行独立训练。

## 5. 实验数量与充分性

### 5.1 实验数量

论文主要包含以下实验：

1. **主实验（定量对比）** ：在5个数据集上与4种baseline进行质量和效率对比。
2. **代理变量相关性分析**：在5个数据集上分析5种候选代理变量（面积、相机数、块内高斯数、可见高斯数、平均可见高斯数）与精细训练运行时的Pearson相关性。
3. **消融/组件分析**：论文提及了各组件（可见性裁剪、选择性稠密化、负载均衡划分、快速相机选择）的贡献分析，以及不同划分策略（均匀面积 vs. 负载均衡）的对比。

### 5.2 充分性与公平性评价

- **数据集多样性**：涵盖真实室外（Mill19）、真实城市场景（UrbanScene3D）和合成城市（MatrixCity），场景类型较全面。
- **baseline覆盖**：对比了当前主流的大规模3DGS方法（CityGS、VastGS、DOGS）。
- **公平性措施**：①采用相同块配置（与CityGS一致）；②统一硬件环境测量运行时；③分别采用颜色校正/非校正指标与不同baseline对比；④对VastGS采用无外观建模版本以保证运行时可比性。
- **不足**：提供的文本中未见详细的消融实验表格或超参数敏感性分析；DOGS的运行时因分布式通信开销未纳入对比。

总体而言，实验设计**较为充分且客观公平**，但若能补充更多消融实验的定量数据会更具说服力。

## 6. 主要结论与发现

1. **训练速度显著提升**：LoBE-GS端到端训练时间相比SOTA baseline**提速最高达2倍**。在MatrixCity-Aerial上，LoBE-GS的 \(T_{\text{E2E}}\) 为1小时24分钟，而CityGS为3小时31分钟。
2. **重建质量保持或提升**：在PSNR、SSIM、LPIPS等指标上，LoBE-GS与CityGS性能相当或略有提升。在颜色校正对比中，LoBE-GS在各数据集上均优于VastGS和DOGS。
3. **预处理时间大幅缩减**：深度感知的快速相机选择将划分时间从数小时降至数分钟。
4. **负载均衡有效**：基于可见高斯点的划分策略成功消除了长尾训练瓶颈，各块精细训练时间分布更均匀。
5. **可扩展性增强**：LoBE-GS能够处理vanilla 3DGS无法胜任的大规模场景。

## 7. 优点（亮点）

- **问题定位精准**：首次系统性地识别并量化了现有大规模3DGS方法中“负载不均衡”这一关键瓶颈，并通过详实的相关性分析验证了“可见高斯点”作为计算负载代理的有效性。
- **方法创新性强**：将贝叶斯优化引入场景划分，以端到端方式优化负载均衡，而非依赖启发式规则。
- **工程效率高**：快速相机选择将复杂度从 \(O(M \times N)\) 降至 \(O(N)\)，大幅降低预处理开销。
- **技术组合合理**：可见性裁剪与选择性稠密化相辅相成，在保证质量的前提下有效降低单块训练成本。
- **实验严谨**：在5个大规模数据集上与4种SOTA方法对比，采用统一硬件和多种评估协议，结果可信。

## 8. 不足与局限

- **GPU资源细节缺失**：附录A.1虽提及了硬件规格，但在提供的文本中未具体展开GPU型号、数量、显存等关键信息。
- **DOGS运行时未对比**：由于DOGS采用分布式训练（涉及通信开销），论文未报告其运行时数据，使得“2倍提速”的结论主要建立在与CityGS和VastGS的对比之上。
- **消融实验细节不足**：提供的文本中缺少各组件（可见性裁剪、选择性稠密化、负载均衡划分等）独立贡献的详细消融定量结果。
- **合成数据集单一**：合成数据仅采用MatrixCity-Aerial，缺乏更多样化的合成场景验证。
- **泛化性验证有限**：方法依赖于粗模型的质量，粗模型本身的精度对最终重建质量的影响未在提供的文本中深入讨论。
- **应用场景局限**：主要针对城市级静态场景重建，动态场景或实时流式输入的适用性未涉及。

（完）
