---
title: "Proxy-GS: Efficient 3D Gaussian Splatting via Proxy Mesh"
title_zh: Proxy-GS：基于代理网格的高效3D高斯泼溅
authors: "Yuanyuan Gao, Yuning Gong, Yifei Liu, Li Jingfeng, Zhihang Zhong, Dingwen Zhang, Yanci Zhang, Dan Xu, Xiao Sun"
date: 2025-09-04
pdf: "https://openreview.net/pdf?id=mee8jLEiwd"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 利用代理网格实现遮挡感知的3DGS实时渲染
tldr: Proxy-GS提出基于代理网格的3D高斯泼溅优化管线，通过快速代理系统生成精确的遮挡深度图，使高斯具有视图遮挡感知能力，从而有效剔除冗余高斯。该方法在保持渲染质量的同时显著降低计算开销，解决了大规模场景中因缺乏遮挡感知导致的冗余问题，进一步提升了3DGS的实时渲染效率。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有3DGS剪枝和LOD技术未考虑遮挡，导致冗余仍大量存在，影响渲染效率。
method: 引入快速代理系统生成遮挡深度图，使高斯具有遮挡感知，进而精确剔除冗余。
result: 显著减少高斯数量，提升渲染速度，同时保持视觉质量。
conclusion: 遮挡感知是3DGS高效渲染的关键，代理网格提供了有效实现途径。
---

## Abstract
3D Gaussian Splatting (3DGS) has emerged as an efficient approach for achieving photorealistic rendering. Recent MLP-based variants further improve visual fidelity but introduce substantial decoding overhead during rendering. To alleviate computation cost, several pruning strategies and level-of-detail (LOD) techniques have been introduced, aiming to effectively reduce the number of Gaussian primitives in large-scale scenes. However, our analysis reveals that significant redundancy still remains due to the lack of occlusion awareness. In this work, we propose Proxy-GS, a novel pipeline that exploits a proxy to introduce Gaussian occlusion awareness from any view.
At the core of our approach is a fast proxy system capable of producing precise occlusion depth maps at resolution 1000$\times$1000 under \SI{1}{ms}. This proxy serves two roles: first, it guides the culling of anchors and Gaussians to accelerate rendering speed. Second, it guides the densification towards surfaces during training, avoiding inconsistencies in occluded regions, and improving the rendering quality. 
In heavily occluded scenarios, such as the MatrixCity Streets dataset, Proxy-GS not only equips MLP-based Gaussian splatting with stronger rendering capability but also achieves faster rendering speed. Specifically, it achieves more than $2.5\times$ speedup over Octree-GS, and consistently delivers substantially higher rendering quality. Code will be public upon acceptance.

---

## 论文详细总结（自动生成）

# Proxy-GS 论文深度分析总结


## 一、核心问题与整体含义（研究动机和背景）

3D Gaussian Splatting（3DGS）作为一种高效的新视角合成方法，已展现出实时渲染的潜力。然而，原始3DGS往往产生大量冗余高斯，且忽视场景几何结构。为此，后续工作如Scaffold-GS和Octree-GS引入了基于MLP的结构化方法，将锚点（anchor）放置在体素或八叉树节点上，通过MLP根据视角动态解码高斯属性。这类方法提升了视觉 fidelity，但在推理阶段引入了大量解码开销。

**核心问题在于**：现有剪枝策略和LOD技术虽能减少高斯数量，但**未显式考虑遮挡关系**，导致大量解码计算浪费在被遮挡的锚点上。特别是在大规模城市场景中，遮挡密集，若锚点选择不考虑遮挡，大量锚点虽然被解码却对最终画面无贡献，既增加计算负担又降低渲染效率。

基于此，Proxy-GS提出利用**轻量级代理网格（proxy mesh）** 为MLP-based 3DGS引入统一的**遮挡感知能力**，在训练和推理阶段同时利用遮挡先验来提升效率与质量。该工作发表于CVPR 2026，并获得Oral及Best Paper Candidate荣誉。


## 二、方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

Proxy-GS的核心是构建一个**快速代理系统**，能够在1000×1000分辨率下于**1毫秒内**生成精确的遮挡深度图。该代理在管线中扮演双重角色：

1. **推理阶段**：引导锚点和高斯的遮挡剔除，加速渲染
2. **训练阶段**：引导锚点向场景表面增密（densification），减少遮挡区域的不一致性，提升渲染质量

### 2.2 代理网格的构建

- **室外大场景**：利用已有的密集点云（如COLMAP生成）构建代理网格，并进行表面简化以保留粗粒度几何结构
- **室内场景**：由于纹理缺失区域导致SfM重建失败，采用混合策略——结合单目深度估计与PGSR，类似近期室内表面重建方法

### 2.3 推理阶段：代理引导的遮挡剔除

系统利用GPU的**硬件光栅化单元**，在深度-only pass中对代理网格进行渲染，快速获得遮挡深度图。关键技术包括：

- **场景分块**：将场景划分为细粒度簇，采用Hi-Z（Hierarchical Z-buffer）剔除快速剔除不可见簇
- **Early-Z测试**：在片段阶段启用早期片段测试，保持片段着色器最小化
- **GPU驻留**：深度图保留在GPU上，直接在CUDA遮挡剔除中调用，避免GPU-CPU-GPU的往返开销
- **融合剔除**：在单一CUDA内核中融合遮挡剔除与视锥剔除

具体地，给定锚点坐标，通过视图矩阵和投影矩阵变换到NDC坐标，再映射到像素坐标，与硬件深度图比较判断可见性。

### 2.4 训练阶段：代理引导的增密（Proxy-Guided Densification）

原始锚点增密策略基于高斯梯度大小，但可能在遮挡区域后方产生冗余锚点。Proxy-GS的改进方案：

1. 计算逐块（patch）渲染损失，选择损失异常高的 patch（损失 > 3倍平均损失）
2. 从代理深度图中读取该 patch 的深度值，反投影到3D空间作为新锚点位置
3. 通过代理网格（proxy-grid）维护每个网格单元的锚点数量上限，防止3D空间冗余

### 2.5 工程优化

论文特别强调了利用消费级GPU的硬件光栅化能力，这是使代理系统在1ms内完成深度图生成的关键。


## 三、实验设计：数据集、Benchmark与对比方法

### 3.1 数据集

论文在多个数据集上进行了评估：

| 数据集类型 | 具体数据集 | 特点 |
|-----------|-----------|------|
| 大规模城市场景 | MatrixCity（Small City，8477张街景图像，划分为5个Block） | 高度遮挡，为论文主要评估场景 |
| 大规模室内场景 | Zip-NeRF 室内场景 | 多房间、存在遮挡 |
| 航拍场景 | 未具名航拍数据集 | 遮挡相对有限 |
| 真实城镇街道 | 真实世界城镇街景 | 与MatrixCity类似 |

### 3.2 对比方法

对比方法涵盖了显式3DGS和MLP-based两大类：

- **基线方法**：3DGS（Kerbl et al., 2023a）
- **MLP-based结构化方法**：Scaffold-GS（Lu et al., 2024）、Octree-GS（Ren et al., 2024）
- **LOD方法**：Hierarchical-GS（Kerbl et al., 2024），包含多个阈值变体

### 3.3 评估指标

采用标准的渲染质量指标：**PSNR↑、SSIM↑、LPIPS↓**，以及渲染速度指标**FPS↑**。


## 四、资源与算力

论文明确说明：

- **训练**：在**单张NVIDIA A100-40GB GPU**上进行所有训练实验
- **推理**：采用**消费级RTX 4090 GPU**进行推理测试，以更好地反映实际部署场景

需要指出的是，论文**未明确说明**训练时长、各数据集的迭代次数等具体训练开销信息。


## 五、实验数量与充分性分析

### 5.1 实验数量

从论文可见的实验设置来看：

- **主实验**：在3类以上数据集（城市街景、室内、航拍、真实城镇）上进行了新视角合成与FPS对比
- **消融实验**：对比了不同训练策略（仅在测试时使用代理 vs. 训练+测试均使用代理）
- **参数分析**：对代理网格密度等超参数进行了分析

### 5.2 充分性与公平性评价

**优点**：
- 对比方法全面，涵盖了显式3DGS、MLP-based方法和LOD方法
- 为公平对比，统一降低了Octree-GS的增密阈值，使渲染质量更接近
- Scaffold-GS采用了更小的体素尺寸和更低的增密阈值以提升 fidelity
- 训练与推理采用不同GPU（A100训练 vs. RTX 4090推理），符合实际部署逻辑

**潜在不足**：
- 室内场景遮挡相对稀疏，论文也承认该方法在此类场景中的提升幅度有限
- 消融实验的详细程度有限（仅展示了训练策略消融），对代理网格构建方式、深度图分辨率等关键设计选择的消融分析未在摘要部分充分呈现


## 六、主要结论与发现

1. **遮挡感知是3DGS高效渲染的关键**：现有方法因缺乏遮挡感知，大量计算浪费在被遮挡区域

2. **代理网格是引入遮挡感知的有效途径**：通过轻量级代理网格结合硬件光栅化，可在1ms内生成高分辨率遮挡深度图

3. **训练与推理统一使用遮挡先验效果最佳**：消融实验表明，仅在测试时使用代理剔除虽能提升约3倍FPS，但会因训练与推理不一致导致画质下降

4. **在高度遮挡场景中优势显著**：在MatrixCity Streets数据集中，Proxy-GS相比Octree-GS实现**2.5倍以上加速**（甚至接近3倍），同时提升渲染质量

5. **方法具有通用性**：在航拍、室内、真实城镇街景等多样化场景中均取得可比或更优表现


## 七、方法/实验设计的亮点

1. **首次将遮挡感知引入MLP-based 3DGS**：论文是首个通过轻量级代理机制解决遮挡导致冗余的工作

2. **巧妙利用消费级GPU硬件光栅化**：充分发挥硬件固定功能单元的高吞吐量，而非依赖复杂的软件计算

3. **训练与推理的统一遮挡先验框架**：代理在训练和推理中均发挥作用，而非仅在推理时做后处理剔除

4. **工程优化到位**：深度图生成、CUDA内核融合、GPU驻留数据等优化使系统在复杂大规模场景中仍保持高效

5. **CVPR 2026 Oral + Best Paper Candidate**：论文的学术价值和创新性得到顶级会议认可


## 八、不足与局限

1. **代理网格构建依赖外部先验**：室外场景依赖COLMAP点云，室内场景依赖单目深度估计，在缺乏这些先验的场景中可能受限

2. **在低遮挡场景中提升有限**：论文承认在航拍场景等遮挡较少的场景中，性能提升幅度不如城市街景显著

3. **室内数据集遮挡稀疏**：当前室内测试场景遮挡模式相对简单，限制了方法优势的充分展现

4. **训练开销未明确量化**：论文未详细说明训练时长、代理网格构建的额外时间成本等

5. **代码尚未开源**：论文承诺代码在接收后公开，目前无法复现验证

6. **工程实现复杂度**：涉及CUDA内核编写、硬件光栅化调用等底层优化，对普通 practitioners 的复现门槛较高

7. **泛化性验证有限**：虽然测试了多个数据集，但对极端复杂场景（如大规模室内外无缝漫游）的验证尚不充分


（完）
