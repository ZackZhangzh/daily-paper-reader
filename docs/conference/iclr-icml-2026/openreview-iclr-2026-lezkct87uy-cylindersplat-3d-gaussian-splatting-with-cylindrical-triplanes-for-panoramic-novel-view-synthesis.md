---
title: "CylinderSplat: 3D Gaussian Splatting with Cylindrical Triplanes for Panoramic Novel View Synthesis"
title_zh: CylinderSplat：基于圆柱三平面全景新视图合成的3D高斯泼溅
authors: "Qiwei Wang, Xianghui Ze, Jingyi Yu, Yujiao Shi"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=lEzkct87Uy"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 前馈全景3DGS用于稀疏视图新视图合成
tldr: 针对现有前馈3DGS在全景新视图合成中受稀疏视图遮挡和笛卡尔三平面失真限制的问题，本文提出CylinderSplat框架，采用与全景数据几何对齐的圆柱三平面表示，有效捕捉360度场景结构。实验表明该方法在稀疏输入下显著提升合成质量和几何一致性，为全景神经渲染提供了高效解决方案。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 全景稀疏视图下现有方法难以解决遮挡和失真。
method: 提出与全景几何对齐的圆柱三平面表示。
result: 显著提升全景新视图合成质量和几何一致性。
conclusion: 圆柱三平面表示有效改善全景稀疏视图渲染。
---

## Abstract
Feed-forward 3D Gaussian Splatting (3DGS) has shown great promise for real-time novel view synthesis, but its application to panoramic imagery remains challenging. Existing methods often rely on multi-view cost volumes for geometric refinement, which struggle to resolve occlusions in sparse-view scenarios. Furthermore, standard volumetric representations like Cartesian Triplanes are poor in capturing the inherent geometry of $360^\circ$ scenes, leading to distortion and aliasing.

In this work, we introduce CylinderSplat, a feed-forward framework for panoramic 3DGS that addresses these limitations. The core of our method is a new {cylindrical Triplane} representation, which is better aligned with panoramic data and real-world structures adhering to the Manhattan-world assumption. We use a dual-branch architecture: a pixel-based branch reconstructs well-observed regions, while a volume-based branch leverages the cylindrical Triplane to complete occluded or sparsely-viewed areas. Our framework is designed to flexibly handle a variable number of input views, from single to multiple panoramas. Extensive experiments demonstrate that CylinderSplat achieves state-of-the-art results in both single-view and multi-view panoramic novel view synthesis, outperforming previous methods in both reconstruction quality and geometric accuracy.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

**背景**：前馈式3D高斯泼溅（Feed-forward 3DGS）在实时新视图合成方面展现出巨大潜力，但其在全景图像领域的应用仍面临挑战。

**核心问题**：
- 现有方法依赖多视图代价体积（multi-view cost volumes）进行几何精化，但在稀疏视图场景下难以解决遮挡问题。
- 标准体积表示方法（如笛卡尔三平面）难以捕捉360°场景的固有几何特性，导致失真和走样。

**研究目标**：提出CylinderSplat框架，通过引入与全景数据几何对齐的圆柱三平面表示，有效捕捉360°场景结构，实现稀疏输入下的高质量全景新视图合成。


## 2. 方法论

**核心思想**：设计一个双分支前馈框架，结合像素级重建与体积级补全，并采用圆柱三平面表示来更好地建模全景场景的几何结构。

**关键技术细节**：

- **圆柱三平面表示（Cylindrical Triplane）** ：区别于标准笛卡尔三平面，该方法采用圆柱坐标系，其`ΘZ`和`ZR`平面天然对齐于曼哈顿世界假设下的垂直墙面和水平地面。该表示将存储复杂度从`O(Θ·Z·R)`降低至`O(Θ·Z + Z·R + R·Θ)`。

- **双分支架构**：
  - **像素分支（Pixel Branch）** ：采用帧内自注意力和帧间交叉注意力聚合多视图信息，生成特征点云并预测高斯参数，负责重建良好观测区域。
  - **体积分支（Volume Branch）** ：在每个相机位置构建局部圆柱三平面，表示均匀分布在圆柱空间中的密集点云网格，用于补全像素分支在遮挡或稀疏区域产生的几何错误和孔洞。

- **训练策略**：采用三阶段训练——先仅用像素分支高斯训练，再仅用体积分支高斯训练，最后联合微调。损失函数结合了L1图像损失、LPIPS感知损失和深度监督损失。

- **灵活输入**：框架可处理从单张到多张全景图的可变数量输入视图。


## 3. 实验设计

**数据集**：
- **合成数据集**：Matterport3D（20,000个序列用于训练）、Replica、Residential
- **真实数据集**：360Loc（包含四个校园级室内外场景，18个连续帧序列，间隔0.46m）
- **额外真实场景**：Google Street View Kansas数据集（8,500个序列，基线20-35m）

**图像分辨率**：所有实验使用512×1024分辨率。

**Benchmark设置**：
- **两视图重建**：以序列首尾帧为输入（1.0m基线），重建中间帧
- **单视图重建**：以中间帧为输入，预测两端帧
- **真实世界评估**：在360Loc上微调预训练模型，以1.4m间隔的两帧输入，渲染四视图输出

**对比方法**：MVSplat、PanoGRF、OmniScene、Splatter360、PanSplat等前馈式SOTA方法。

**评估指标**：
- 图像质量：SSIM、LPIPS、WS-PSNR（对全景失真更鲁棒）
- 几何精度：PCC（与DepthAnywhere生成的参考深度计算）


## 4. 资源与算力

论文**未明确说明**训练所使用的GPU型号、数量及训练时长等具体算力信息。仅提及PanSplat方法在单个A100 GPU上实现了内存高效的训练，但CylinderSplat自身的算力消耗未在提供的文本中披露。


## 5. 实验数量与充分性

**实验数量**：论文开展了多组实验，涵盖：
- 三个合成数据集（Matterport3D、Replica、Residential）上的两视图重建
- 单视图重建实验
- 真实数据集360Loc上的评估
- 宽基线真实场景（Kansas数据集20-35m、360Loc的3.0m和4.5m基线）的额外验证
- 圆柱坐标系与笛卡尔坐标系的对比实验

**充分性与客观性评价**：
- 实验设计较为**全面**，覆盖了合成数据与真实数据、短基线与宽基线、单视图与多视图等多种场景
- 与多个SOTA方法进行了对比，对比**公平**（遵循 prior work 的实验设置）
- 额外的大规模真实世界评估（Kansas数据集）增强了结论的**可泛化性**
- 但**缺少消融实验**的详细报道（虽可能在论文完整版中存在，但在提供的文本中未呈现）


## 6. 主要结论与发现

- CylinderSplat在单视图和多视图全景新视图合成中均达到**最先进水平**，在重建质量和几何精度上均超越前人方法。

- 圆柱三平面表示相比笛卡尔三平面更适配全景数据，在几何指标（PCC）和图像质量指标上均有提升。

- 在宽基线极端场景下（Kansas数据集20m+基线），CylinderSplat相比最强竞争对手OmniScene在WS-PSNR上提升**+3.95 dB**，验证了其在稀疏视图挑战性场景下的优越性。


## 7. 方法亮点

- **几何对齐的表示设计**：圆柱三平面对曼哈顿世界假设的天然适配是其核心创新，从物理坐标选择角度提供了理论依据。

- **双分支协同架构**：像素分支保证高频细节，体积分支保证几何完整，二者互补有效解决了稀疏视图下的遮挡问题。

- **灵活输入处理**：可处理从单张到多张的可变数量输入，实用性较强。

- **前馈式高效推理**：属于前馈式方法，支持近实时重建和跨场景泛化。


## 8. 不足与局限

- **算力信息缺失**：未明确报告训练所需的GPU资源，不利于其他研究者复现和评估成本。

- **消融实验未呈现**：在提供的文本中未看到对双分支各组件、三平面不同坐标系等关键设计的系统性消融分析。

- **真实场景规模有限**：虽增加了Kansas数据集验证，但360Loc仅含4个场景，真实世界的多样性覆盖仍有限。

- **深度监督依赖**：训练中使用了UniK3D生成的参考深度作为监督，可能存在深度估计误差传播风险。

- **分辨率限制**：所有实验在512×1024分辨率下进行，更高分辨率（如4K全景）的适用性未验证。

（完）
