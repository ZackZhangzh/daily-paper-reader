---
title: "CylinderSplat: 3D Gaussian Splatting with Cylindrical Triplanes for Panoramic Novel View Synthesis"
title_zh: "CylinderSplat: 基于圆柱三平面表示的3D高斯泼溅全景新视图合成"
authors: "Qiwei Wang, Xianghui Ze, Jingyi Yu, Yujiao Shi"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=lEzkct87Uy"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 全景新视图合成与圆柱三平面3DGS
tldr: 本文提出CylinderSplat，用于全景图像的3DGS前馈框架，核心是圆柱三平面表示，更好对齐全景数据并解决稀疏视图下的遮挡问题。标准笛卡尔三平面难以捕捉360°场景几何，本方法通过圆柱表示减少畸变和锯齿，实现实时高质量全景新视图合成。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准三平面表示不适用于360°全景，导致畸变和混叠。
method: 设计圆柱三平面表示，匹配全景几何，结合前馈3DGS。
result: 实现全景新视图的高质量实时合成，解决遮挡和畸变。
conclusion: 圆柱三平面有效提升全景3DGS的几何保真度。
---

## Abstract
Feed-forward 3D Gaussian Splatting (3DGS) has shown great promise for real-time novel view synthesis, but its application to panoramic imagery remains challenging. Existing methods often rely on multi-view cost volumes for geometric refinement, which struggle to resolve occlusions in sparse-view scenarios. Furthermore, standard volumetric representations like Cartesian Triplanes are poor in capturing the inherent geometry of $360^\circ$ scenes, leading to distortion and aliasing.

In this work, we introduce CylinderSplat, a feed-forward framework for panoramic 3DGS that addresses these limitations. The core of our method is a new {cylindrical Triplane} representation, which is better aligned with panoramic data and real-world structures adhering to the Manhattan-world assumption. We use a dual-branch architecture: a pixel-based branch reconstructs well-observed regions, while a volume-based branch leverages the cylindrical Triplane to complete occluded or sparsely-viewed areas. Our framework is designed to flexibly handle a variable number of input views, from single to multiple panoramas. Extensive experiments demonstrate that CylinderSplat achieves state-of-the-art results in both single-view and multi-view panoramic novel view synthesis, outperforming previous methods in both reconstruction quality and geometric accuracy.

---

## 论文详细总结（自动生成）

## CylinderSplat 论文深度总结

### 1. 核心问题与研究动机

全景新视图合成（Panoramic Novel View Synthesis）是虚拟现实（VR）和自动驾驶等领域的关键技术，旨在从任意视角渲染出逼真的360°图像。前馈式3D高斯泼溅（Feed-forward 3DGS）因其实时渲染和跨场景泛化能力而备受关注，但其在全景图像上的应用面临两大核心挑战：

- **遮挡问题**：现有方法通常依赖多视图代价体（multi-view cost volumes）进行几何细化，但在稀疏视角场景中难以有效处理遮挡区域。
- **表示不适配**：标准的笛卡尔三平面（Cartesian Triplanes）等体积表示无法很好地捕捉360°场景的固有几何特性，导致渲染结果出现畸变和锯齿。

本文的核心贡献在于提出了一种专门为全景数据设计的三平面表示——**圆柱三平面（Cylindrical Triplane）**，以解决上述两大瓶颈。


### 2. 方法论

#### 2.1 整体框架

CylinderSplat 是一个**双分支前馈架构**，包含一个像素分支和一个体积分支，通过**三阶段课程训练（three-stage curriculum）** 进行优化：

1. **第一阶段**：训练像素分支，为良好观测区域建立高质量基线
2. **第二阶段**：冻结像素分支，训练基于圆柱三平面的体积分支，补全稀疏和遮挡区域
3. **第三阶段**：联合微调两个分支，将细节与完整性融合为单一高保真场景

#### 2.2 像素分支（Pixel Branch）

像素分支负责重建**良好观测区域**的高质量高斯参数。

- **输入处理**：首先利用 UniK3D 深度基础模型获取初始深度先验
- **注意力机制**：使用 ResNet + 6层注意力堆栈替代传统的代价体，聚合多视角上下文信息，预测精化后的深度图和特征图
- **高斯生成**：利用精化深度将像素反投影到3D坐标形成特征点云，再解码为完整的高斯参数集

该设计的优势在于**相机无关（camera-agnostic）** 和**内存高效**，且能灵活处理任意数量的输入视图。

#### 2.3 体积分支（Volume Branch）—— 核心创新

体积分支通过圆柱三平面表示，**补全像素分支在稀疏视角和遮挡区域留下的几何空洞**。

**（1）圆柱三平面的几何合理性**

作者从物理学中正交曲线坐标的灵感出发。与笛卡尔三平面（图2a）和球面三平面（图2b）相比，**圆柱三平面（图2c）** 的优势在于：

- 真实世界的大多数场景（城市和室内环境）遵循**曼哈顿世界假设（Manhattan-world assumption）** ——正交平面占主导地位
- 圆柱三平面的 **ZR 平面和 RΘ 平面**天然对齐于人造环境中的**垂直墙壁和水平地板**
- 球面三平面则难以建模这些简单平面

**（2）技术实现细节**

- **局部体积定义**：在每个相机位置定义一个以相机为中心的局部圆柱体积，边界为维度 (R₀, Θ₀, Z₀)
- **存储效率**：三平面将存储复杂度从 O(Θ·Z·R) 降低到 O(Θ·Z + Z·R + R·Θ)
- **初始化与增强**：三个正交特征平面 (F_rθ, F_θz, F_zr) 先由可学习网格嵌入初始化，再聚合落入该体积内的像素分支点特征
- **跨平面注意力（Cross-Plane Attention）** ：同一圆柱的三个特征平面通过注意力机制交换信息，形成 cohesive 的3D表示

**（3）RGB检索策略**

为解决三平面可能导致的渲染过平滑问题，作者引入了**RGB检索策略**，直接从输入视图中查询高频特征，增强三平面渲染的细节。

#### 2.4 损失函数

整个训练过程由复合损失函数监督，具体组成在补充材料中详述。


### 3. 实验设计

#### 3.1 数据集与场景

论文使用了**全景图像数据集**进行训练和评估（具体数据集名称在提供的摘要中未明确列出），涵盖室内和室外场景。实验覆盖了从**单视角到多视角**的全景新视图合成任务。

#### 3.2 Benchmark 与对比方法

作者将 CylinderSplat 与以下两类方法进行了对比：

- **优化式（Optimization-based）全景3DGS方法**：如 Yang 等（2025b）、Li 等（2025）、Huang 等（2025a/b）、Zhou 等（2024）、Pu 等（2024）
- **前馈式（Feed-forward）全景方法**：如 Zhang 等（2025）、Chen 等（2025）

此外，还与基于三平面的相关方法（如 OmniScene）进行了对比。

#### 3.3 评估指标

论文在**重建质量**和**几何精度**两个维度上进行了评估，并宣称在这两方面均达到了最先进水平。


### 4. 资源与算力

> ⚠️ **未明确说明**：提供的论文内容中**没有明确提及**所使用的GPU型号、数量或训练时长等算力信息。仅能从文中推断该方法属于前馈式框架，推理阶段可实现近实时渲染，训练阶段可能具有较高的计算效率（如像素分支被描述为“内存高效”）。具体算力需求需查阅论文全文或补充材料。


### 5. 实验数量与充分性

#### 5.1 实验配置

论文进行了**多组实验**，包括：

- **单视角全景新视图合成**实验
- **多视角全景新视图合成**实验
- **消融实验**：验证圆柱三平面相对于笛卡尔三平面和球面三平面的优越性

#### 5.2 充分性评估

- **积极方面**：实验覆盖了单视角和多视角两种输入场景，与多种主流方法进行了对比，评估指标涵盖质量和几何两个维度，**具有一定的全面性**。
- **潜在不足**：
  - 具体数据集名称未在摘要中明确，难以判断场景多样性
  - 消融实验的具体设置和结果未详细呈现
  - 未见关于泛化能力（跨数据集）的系统性评估描述
  - 与优化式方法的对比可能存在**不公平性**（前馈式方法天然速度快但质量可能不如优化式），论文需在效率和质量的权衡上给出清晰说明


### 6. 主要结论与发现

1. **圆柱三平面有效提升全景几何保真度**：相比笛卡尔和球面三平面，圆柱三平面因对齐曼哈顿世界假设，能更好地捕捉360°场景的几何结构
2. **双分支架构实现优势互补**：像素分支保障细节，体积分支补全空洞，两者结合实现了高质量的全景重建
3. **前馈式全景3DGS达到SOTA**：CylinderSplat 在单视角和多视角全景新视图合成中均达到最先进水平，在重建质量和几何精度上均优于此前方法
4. **灵活处理可变数量输入**：框架设计支持从单张到多张全景图的灵活输入


### 7. 方法亮点

1. **首创圆柱三平面表示**：首次将三平面从笛卡尔坐标系扩展到圆柱坐标系，专门适配全景数据的几何特性，是该领域的重要创新
2. **物理启发的坐标选择**：从物理学中正交曲线坐标的对称性简化思想获得灵感，论证充分且有说服力
3. **双分支架构设计精巧**：像素分支（重细节）与体积分支（重完整性）形成有效互补，解决了前馈式方法在稀疏视角下的固有问题
4. **三阶段课程训练策略**：分阶段训练（先像素、再体积、后联合）有助于稳定训练并提升最终性能
5. **灵活的输入处理**：基于注意力的机制替代代价体，支持任意数量的输入视图，无需重新训练
6. **代码开源**：论文代码已在 GitHub 上公开（https://github.com/wangqww/CylinderSplat），有利于领域内复现和后续研究


### 8. 不足与局限

1. **算力信息缺失**：未明确报告训练所需的GPU型号、数量和时长，不利于他人评估方法的实际成本
2. **实验细节不足**：具体使用的数据集名称、训练集/测试集划分、详细消融结果等关键信息在摘要中未呈现
3. **潜在的应用限制**：
   - 方法基于曼哈顿世界假设，对于**非结构化自然场景**（如森林、山地）的适用性可能有限
   - 作为前馈式方法，其**泛化能力**可能受限于训练数据的多样性和覆盖范围
4. **与优化式方法的对比公平性**：前馈式方法在速度上有天然优势但在质量上通常不如优化式，论文需明确阐述在质量和速度之间的权衡
5. **极端稀疏场景的鲁棒性**：虽然声称能处理稀疏视角，但极端情况（如单张输入且遮挡严重）下的表现仍需进一步验证


（完）
