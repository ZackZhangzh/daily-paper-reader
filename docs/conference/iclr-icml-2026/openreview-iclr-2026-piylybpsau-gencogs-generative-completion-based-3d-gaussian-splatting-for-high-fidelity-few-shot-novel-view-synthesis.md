---
title: "GenCoGS: Generative Completion-based 3D Gaussian Splatting for High-Fidelity Few-Shot Novel View Synthesis"
title_zh: GenCoGS：基于生成补全的3D高斯泼溅用于高保真少样本新颖视图合成
authors: "Junao Shen, Haojie Dong, Tian Feng, Ruihong Ye, Wenjie Wang, Yuandong Zhang, Tianjia Shao"
date: 2025-09-15
pdf: "https://openreview.net/pdf?id=piylyBPSau"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 使用3D高斯泼溅的少样本新颖视图合成
tldr: 该论文提出GenCoGS，一种基于生成补全的3D高斯泼溅少样本新颖视图合成方法，通过生成式点云补全策略初始化和优化3DGS表示，有效弥补训练视图信息不足，减少浮点伪影并提升高保真度。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 少样本NVS中训练视图信息有限，场景补全能力不足。
method: 采用生成式点云补全策略初始化并优化3DGS。
result: 提升高保真度，减少浮点伪影。
conclusion: 生成式补全有效增强少样本场景重建。
---

## Abstract
Conventional few-shot novel view synthesis (NVS) methods using 3D Gaussian Splatting (3DGS) have demonstrated significance, but remain constrained by their overdependence on the limited information from training views. Their unsatisfactory scene completion capability would underrepresent those scene regions either unobserved in training views or with local details and thus cause floating artifacts against high fidelity.
To address these challenges, we propose GenCoGS, a unified 3DGS-based few-shot NVS method focusing on initializing and optimizing 3DGS representation using generative completion-based strategies to enhance scene completion.
Specifically, our generative point cloud completion-based strategy produces and filters complementary points toward a complete point cloud with refined structural and appearance information for Gaussian initialization;
The generative pseudo view completion-based strategy leverages an image-to-video diffusion model to synthesize complete pseudo views, which benefits Gaussian optimization especially within unobserved scene regions and mitigates hallucination for less appearance distortion. 
Integrating both strategies enables accurate and coherent scene completion for high-fidelity few-shot NVS.
Extensive experiments on three benchmark datasets demonstrate the superiority of our GenCoGS for few-shot NVS evaluated in common metrics compared to baseline methods. Compared to those 3DGS-based few-shot NVS methods, our GenCoGS achieves improvements of up to $2.40$dB, $0.08$ and $0.125$ in PSNR, SSIM and LPIPS.

---

## 论文详细总结（自动生成）

# GenCoGS 论文总结

## 1. 核心问题与整体含义（研究动机与背景）

基于3D高斯泼溅（3D Gaussian Splatting, 3DGS）的传统少样本新颖视图合成（Few-Shot Novel View Synthesis, NVS）方法虽然取得了一定成效，但存在一个根本性瓶颈：**过度依赖训练视图所提供的有限信息**。当场景区域在训练视图中未被观测到，或局部细节信息不足时，现有方法的场景补全能力难以令人满意，导致这些区域在渲染结果中表现为浮点伪影（floating artifacts），严重影响合成图像的保真度。

针对这一难题，论文提出 **GenCoGS**（Generative Completion-based 3D Gaussian Splatting），一种基于**生成式补全策略**的统一3DGS少样本NVS方法，旨在通过生成式手段增强场景补全能力，实现高保真度的少样本新颖视图合成。


## 2. 方法论：核心思想与关键技术细节

GenCoGS的核心思路是**从高斯初始化和高斯优化两个阶段入手，分别引入生成式补全策略**，具体包含两大模块：

### （1）生成式点云补全策略（Generative Point Cloud Completion）

该策略用于**高斯初始化阶段**。其核心流程为：通过生成式模型产生互补性的点云数据，并加以筛选过滤，最终形成一个结构信息与外观信息均得到精细化的完整点云，作为3DGS的初始化输入。这一策略从根本上缓解了稀疏输入下初始点云不完整的问题。

### （2）生成式伪视图补全策略（Generative Pseudo View Completion）

该策略用于**高斯优化阶段**。其核心思想是借助**图像到视频扩散模型**（image-to-video diffusion model）合成完整的伪视图（pseudo views），为高斯优化过程提供额外的监督信号。这一策略尤其有利于那些在训练视图中未被观测到的场景区域的优化，同时能够有效缓解模型幻觉（hallucination），减少外观失真。

两大策略的协同作用，使得GenCoGS能够实现**准确且连贯的场景补全**，从而支撑高保真度的少样本NVS。


## 3. 实验设计

### 数据集与场景

论文在**三个基准数据集**上开展了大量实验（extensive experiments），其中一个明确提及的数据集为 **DTU数据集**（Jensen et al., 2014）。在DTU数据集上，论文测试了**3视图、6视图、9视图**三种少样本设置下的性能。

### 评估指标

实验采用NVS领域通用的评估指标：
- **PSNR**（峰值信噪比）
- **SSIM**（结构相似性）
- **LPIPS**（学习感知图像块相似度）

### 对比方法

论文将GenCoGS与**代表性的3DGS-based少样本NVS方法**进行了对比，但摘要及元数据中未逐一列出具体对比方法名称。


## 4. 资源与算力

**论文所提供的摘要和元数据中未明确说明所使用的GPU型号、数量、训练时长等算力信息。** 如需获取此类细节，需查阅论文正文或补充材料部分。


## 5. 实验数量与充分性

### 实验数量

从现有信息判断，论文至少开展了以下实验：
- **三个基准数据集**上的整体性能对比实验；
- **DTU数据集**上3-view、6-view、9-view三种设置下的详细对比实验；
- 此外，论文在OpenReview页面提供了**补充材料（supplementary material）** ，其中likely包含更多实验细节（如额外的定量对比表格等）。

### 充分性与客观性评估

- **积极方面**：论文在三个基准数据集上评估，覆盖了多种少样本设置（3/6/9视图），对比了代表性基线方法，并使用多项通用指标进行评价，实验设计总体上符合领域惯例。
- **局限性**：由于无法获取全文，消融实验（ablation study）的具体设计、各模块的独立贡献验证、以及更细致的场景类型分析等信息尚不明确。


## 6. 主要结论与发现

论文的核心结论可归纳为以下几点：

1. **生成式补全策略有效增强了少样本场景重建能力**。通过将生成式补全融入3DGS的初始化和优化两个阶段，GenCoGS能够有效弥补训练视图信息不足的问题。

2. **在定量指标上取得了显著提升**。与3DGS-based少样本NVS方法相比，GenCoGS在**PSNR上提升高达2.40 dB**，在**SSIM上提升0.08**，在**LPIPS上降低0.125**——三项指标均显示出明显优势。

3. **有效减少了浮点伪影**。生成式补全策略使得未观测区域和细节区域的渲染质量得到改善，减少了伪影和外观失真。

4. **GenCoGS在多个基准数据集上均展现出优越性**，验证了方法的泛化能力。


## 7. 优点（方法与实验设计的亮点）

1. **双阶段生成式补全的创新范式**：不同于以往仅在单一环节进行增强的方法，GenCoGS从**高斯初始化**和**高斯优化**两个阶段同时入手，形成了一套完整的生成式补全解决方案，思路清晰且系统性强。

2. **点云补全与伪视图生成的协同设计**：点云补全策略负责提供高质量的结构初始化，伪视图补全策略则负责在优化阶段提供额外的监督信号，两者功能互补、相互配合。

3. **引入图像到视频扩散模型**：将先进的扩散模型应用于少样本NVS的伪视图生成，充分利用了生成式大模型的强大先验知识来补全未观测区域。

4. **定量提升显著**：PSNR提升2.40dB、SSIM提升0.08、LPIPS降低0.125，这些改进幅度在少样本NVS任务中具有明显的实际意义。

5. **实验覆盖多种少样本设置**：在3-view、6-view、9-view等多种稀疏程度下均进行了验证，体现了方法在不同难度条件下的鲁棒性。


## 8. 不足与局限

1. **算力需求不明确**：论文未在摘要或元数据中说明训练所需的GPU型号、数量及时间，无法判断方法在实际部署中的计算成本。

2. **对比方法名单未披露**：摘要中仅笼统提及“代表性3DGS-based少样本NVS方法”，未列出具体对比方法名称，不利于读者快速评估对比的全面性和公平性。

3. **依赖预训练生成模型**：方法依赖于图像到视频扩散模型等预训练生成式模型，这些模型本身可能具有较大的参数量和推理开销，且其生成质量直接影响GenCoGS的最终性能。

4. **潜在的应用场景限制**：生成式补全策略在处理高度复杂、动态或极端纹理的场景时，其补全效果可能存在不确定性；方法在室外大场景、动态场景等更具挑战性设定下的表现有待进一步验证。

5. **实验细节披露有限**：消融实验的具体设计、各模块的独立贡献、以及失败案例分析等细节在现有材料中未能体现，需查阅完整论文及补充材料。


（完）
