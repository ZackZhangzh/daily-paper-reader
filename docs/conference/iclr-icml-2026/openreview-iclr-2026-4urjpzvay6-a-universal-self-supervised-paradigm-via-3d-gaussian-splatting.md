---
title: A Universal Self-Supervised Paradigm via 3D Gaussian Splatting
title_zh: 基于3D高斯泼溅的通用自监督范式
authors: "Hao Liu, Minglin Chen, Yanni Ma, Haihong Xiao, Rui Tan, Ying He"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=4UrjpzvAy6"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 基于3DGS的神经渲染自监督预训练
tldr: GS^3提出以3D高斯泼溅为核心的通用自监督框架，将神经渲染作为代理任务，从输入数据提取视觉特征预测场景级3D高斯，并通过快速平铺渲染生成图像。该方法统一了2D和3D模态的预训练，使同一框架可同时训练2D和3D编码器，为缺乏标注数据时的表示学习提供了新途径，并直接支持神经渲染相关任务。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有自监督方法通常针对2D或3D专用，缺乏跨模态通用性，且标注数据稀缺。
method: 将神经渲染作为代理任务，利用3DGS预测场景高斯并渲染图像，实现自监督预训练。
result: 所提框架可同时预训练2D和3D编码器，在下游任务上表现优异。
conclusion: 3DGS可作为通用自监督桥梁，统一多模态预训练，提升数据效率。
---

## Abstract
Pre-training on large-scale unlabeled datasets has proven effective for enhancing model performance on downstream tasks, particularly when annotated data is scarce. However, due to the inherent discrepancies in data structures across modalities, most existing self-supervised approaches are tailored to either 2D or 3D networks, limiting their generalizability. In this paper, we propose GS$^3$, a 3D Gaussian Splatting (GS)-based universal self-supervised framework, which bridges 2D and 3D modalities and enables pre-training of both 2D and 3D encoders. The core idea is to formulate neural rendering as a pretext task: visual features extracted from input data are used to predict scene-level 3D Gaussians, which are then rendered into images via a fast tile-based rasterizer. The model is optimized by minimizing the difference between rendered and real images, with a masked modeling strategy further encouraging robust and spatially-aware representation learning. We evaluate GS$^3$ across five representative downstream tasks, including detection, segmentation, and reconstruction. Experimental results show that GS$^3$ consistently achieves performance on par with or surpassing state-of-the-art methods, while significantly reducing memory overhead compared to prior NeRF-based approaches.

---

## 论文详细总结（自动生成）

# 基于3D高斯泼溅的通用自监督范式（GS³）论文总结


## 1. 核心问题与整体含义（研究动机与背景）

- **核心问题**：现有自监督学习方法通常针对2D或3D模态单独设计，缺乏跨模态通用性；同时，基于渲染的自监督框架（如Ponder）在预训练过程中计算量大、内存消耗高。
- **研究动机**：
  - 大规模无标注数据上的预训练已被证明能有效提升下游任务性能，尤其在标注数据稀缺时效果显著。
  - 3D标注成本极高——标注一个包含数千个3D点的室内场景约需30分钟。
  - 现有3D点云自监督方法（补全型、对比型、渲染型）各有局限：补全型对掩码率和缺失部分选择敏感；对比型收敛慢且严重依赖正/负样本采样与数据增强策略；渲染型（如Ponder）需要密集多视图输入和深度图监督，且计算资源需求巨大。
- **整体含义**：论文提出GS³框架，以3D高斯泼溅（3D Gaussian Splatting, 3DGS）为核心，将神经渲染作为代理任务，首次将可泛化3DGS引入点云自监督学习，旨在**统一2D与3D模态的预训练**，为缺乏标注数据时的跨模态表示学习提供新路径。


## 2. 方法论：核心思想、关键技术细节与算法流程

### 核心思想

将**神经渲染作为代理任务（pretext task）** ：从输入数据中提取视觉特征，用于预测场景级3D高斯点，再通过快速平铺光栅化器（tile-based rasterizer）渲染成图像。模型通过最小化渲染图像与真实图像之间的差异进行优化，同时引入掩码建模策略以增强鲁棒性和空间感知能力。

### 算法流程（文字说明）

1. **3D点云生成**：将输入的稀疏视图RGB-D图像反投影到3D空间，生成带颜色的点云。
2. **点云特征提取**：将生成的点云输入点云编码器，提取逐点特征（point-wise features）。
3. **3D高斯预测**：从学习到的点云特征预测场景的3D高斯点，包括高斯的位置和基元参数。
4. **图像渲染**：给定特定相机内参和位姿，采用实时的平铺光栅化渲染器生成RGB图像。
5. **自监督优化**：通过最小化渲染图像与输入RGB图像之间的差异来训练模型。
6. **下游任务适配**：预训练好的点云编码器可作为强有力的初始化，微调后适配各类下游3D任务。

### 关键技术创新

- **可泛化3DGS集成**：首次将可泛化的3D高斯泼溅无缝集成到渲染型自监督学习框架中。
- **高效渲染**：利用3DGS的实时渲染能力，大幅降低预训练的计算负担和内存成本。
- **编码器通用性**：框架可容纳多种点云编码器架构。


## 3. 实验设计

### 数据集与场景

- 输入为**稀疏视图RGB-D图像**，反投影生成彩色点云用于预训练。
- （注：当前提供的论文摘要与元数据未详细列出具体数据集名称。从论文标题和上下文推断，实验可能涉及室内场景数据集如ScanNet、S3DIS等3D视觉基准，但需查阅完整论文确认。）

### Benchmark与下游任务

论文在**五个代表性下游任务**上评估GS³，包括：
- 3D语义分割（3D semantic segmentation）
- 3D实例分割（3D instance segmentation）
- 3D目标检测（3D object detection）
- 3D场景重建（3D scene reconstruction）
- （第五个任务在摘要中提及为“detection, segmentation, and reconstruction”，具体第五项需查阅全文）

### 对比方法

- 与先前基于渲染的框架**Ponder**进行效率和性能对比。
- 与各下游任务上的**最先进方法（state-of-the-art）** 进行性能对比。


## 4. 资源与算力

**论文中未明确说明**具体的GPU型号、数量或训练时长。

但论文明确报告了**相对效率指标**：
- 相比先前渲染型框架Ponder，GS³实现了约 **9倍预训练加速**（9× pre-training speedup）
- 内存成本低于Ponder的 **0.25倍**（less than 0.25× memory cost）

这些指标间接反映了GS³在计算资源需求上的显著优势，但具体硬件配置（如GPU型号、数量、训练总时长等）在提供的材料中未予披露。


## 5. 实验数量与充分性

### 实验数量

- **下游任务**：5个代表性下游任务（涵盖感知与重建）
- **任务类型覆盖**：高层感知任务（3D分割、3D检测）+ 低层重建任务（3D场景重建）
- **效率对比**：与Ponder在训练速度和内存占用上的定量对比

### 充分性与客观性评估

- **积极方面**：实验覆盖了多种类型的下游任务（检测、分割、重建），能够较全面地验证预训练编码器的**迁移能力**（transferability）；与Ponder的效率对比提供了明确的量化指标（9倍加速、<0.25倍内存），对比客观。
- **潜在不足**：
  - 由于提供的材料为摘要和部分引言，**完整的实验配置（数据集名称、具体数值结果、消融实验设计等）无法确认**。
  - 摘要提及了“掩码建模策略”，但**消融实验的具体设置和结果**在现有材料中未见。
  - 公平性方面，与SOTA方法的对比条件（如是否使用相同骨干网络、相同训练数据等）需查阅全文才能评估。


## 6. 主要结论与发现

1. **GS³框架有效**：基于3DGS的神经渲染可作为有效的自监督代理任务，预训练的点云编码器在多个下游任务上表现出强迁移能力。
2. **性能优异**：GS³在下游任务上取得与最先进方法相当或更优的性能。
3. **高效性显著**：相比基于NeRF的先前方法（Ponder），GS³实现了约9倍预训练加速和低于0.25倍的内存开销。
4. **3DGS作为通用桥梁**：3D高斯泼溅可作为连接2D与3D模态的通用自监督桥梁，统一多模态预训练，提升数据效率。


## 7. 优点（方法与实验设计的亮点）

1. **跨模态统一性**：首次提出可同时预训练2D和3D编码器的通用自监督框架，突破了现有方法局限于单一模态的瓶颈。
2. **高效性突破**：利用3DGS的快速平铺渲染替代NeRF的密集体积渲染，大幅降低预训练的计算和内存成本，是本方法相较于Ponder的核心优势。
3. **首次探索**：首次将可泛化3DGS引入点云自监督学习领域，为后续研究开辟了新方向。
4. **编码器灵活性**：框架可容纳多种点云编码器架构，具有良好的通用性和扩展性。
5. **任务覆盖全面**：在五个代表性下游任务上验证，涵盖高层感知与低层重建，评估体系较完整。


## 8. 不足与局限

1. **输入依赖**：方法依赖RGB-D图像作为输入，在只有RGB图像而无深度信息的场景下可能无法直接应用。
2. **实验细节缺失**：从提供的材料（摘要+部分引言）无法获知具体数据集名称、详细数值结果、消融实验设置等关键信息，需查阅完整论文。
3. **算力信息不透明**：未明确报告具体的GPU型号、数量和训练时长，不利于其他研究者在相似条件下复现。
4. **与纯2D方法的对比不明**：虽然宣称“通用框架”，但现有材料中未明确展示在纯2D下游任务上的验证结果。
5. **应用场景限制**：方法目前主要针对点云表示学习，其“通用性”在更广泛的跨模态场景（如2D图像+3D点云联合预训练）中的实际效果需进一步验证。


（完）
