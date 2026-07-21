---
title: "LATO: 3D Mesh Flow Matching with Structured TOpology Preserving LAtents"
title_zh: LATO：基于结构化拓扑保持潜变量的三维网格流匹配
authors: "Tianhao Zhao, Youjia Zhang, Hang Long, Jinshen Zhang, Wenbing Li, Yang Yang, Gongbo Zhang, Jozef Hladký, Matthias Nießner, Wei Yang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/16981c4b64a1c8e45700a5466b5936ca58e183fc.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 流匹配生成模型用于三维网格合成
tldr: 本文提出LATO，一种拓扑保持的潜在表示方法，结合流匹配实现可扩展的三维显式网格生成。通过稀疏体素变分自编码器压缩顶点位移场，解码器渐进细分与剪枝恢复顶点位置，连接头直接预测边连接，避免了等值面提取或启发式网格化。该方法在生成建模中保持了网格拓扑结构，为高质量三维形状生成提供了新路径。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有网格生成难以兼顾拓扑保持与可扩展性，缺乏高效的显式网格生成方法。
method: 利用顶点位移场与稀疏体素VAE压缩，再通过连接头预测边连接实现拓扑恢复。
result: 实现了可扩展的流匹配网格生成，生成结果保持拓扑一致性且质量高。
conclusion: 拓扑保持潜变量有效支撑流匹配生成显式三维网格。
---

## Abstract
In this paper, we introduce LATO, a novel topology-preserving latent representation that enables scalable, flow matching-based synthesis of explicit 3D meshes. LATO represents a mesh as a Vertex Displacement Field (VDF) anchored on surface, incorporating a sparse voxel Variational Autoencoder (VAE) to compress this explicit signal into a structured, topology-aware voxel latent. To decapsulate the mesh, the VAE decoder progressively subdivides and prunes latent voxels to instantiate precise vertex locations. In the end, a dedicated connection head queries the voxel latent to predict edge connectivity between vertex pairs directly, allowing mesh topology to be recovered without isosurface extraction or heuristic meshing.
For generative modeling, LATO adopts a two-stage flow matching process, first synthesizing the structure voxels and subsequently refining the voxel-wise topology features. Compared to prior isosurface/triangle-based diffusion models and autoregressive generation approaches, LATO generates meshes with complex geometry, well-formed topology while being highly efficient in inference.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究背景**：当前主流的 3D 生成范式通常采用“3D VAE 压缩 + 隐空间扩散模型”的两阶段流程，将形状压缩为隐式场（如 SDF 或 occupancy field），再通过 Marching Cubes 等算法提取表面网格。然而，这类方法存在两个根本性局限：

- **拓扑不可知**：隐式场不暴露显式的网格拓扑结构，后处理提取的网格往往过于稠密、三角剖分不规则，偏离艺术家手工制作的拓扑，无法直接用于下游的骨骼绑定、变形和游戏引擎部署。
- **水密性假设**：隐式方法要求训练数据为“水密”（watertight）的封闭曲面，迫使大量开放表面和非流形资产被丢弃，加剧了 3D 生成中的数据稀缺问题。

**核心问题**：如何在保持显式网格拓扑结构的前提下，实现可扩展、高质量的三维网格生成？

**本文贡献**：提出 **LATO**（Latent with Structured TOpology），一种拓扑保持的稀疏体素潜变量表示方法，结合流匹配（Flow Matching）实现显式 3D 网格的可扩展生成。


## 2. 方法论

### 2.1 核心思想

LATO 将网格表示为锚定在表面上的**顶点位移场（Vertex Displacement Field, VDF）**，通过稀疏体素变分自编码器（Sparse Voxel VAE）将这一显式信号压缩为结构化的、拓扑感知的体素潜变量。解码时，VAE 解码器通过**渐进式细分与剪枝**恢复精确的顶点位置，最后由一个专用的**连接头（Connection Head）** 直接查询体素潜变量，预测顶点对之间的边连接。

### 2.2 关键技术细节

- **T-Voxel 稀疏体素表示**：记录顶点是否存在，同时编码空间分布和连接关系，为拓扑提供强先验。
- **两阶段流匹配生成**：首先生成结构体素（structure voxels），再细化体素级别的拓扑特征（voxel-wise topology features）。
- **采样训练策略**：由于全量顶点对训练带来二次复杂度（O(N²)），LATO 采用基于采样的训练策略——所有 ground-truth 边作为正样本参与训练，有效控制计算开销。
- **与朴素方案的区别**：与直接对表面点进行语义标签分类（如分类为顶点、边、面）的替代方案不同，LATO 的 VDF 提供了稠密的监督信号。


## 3. 实验设计

### 3.1 数据集

LATO 在两个测试集上进行评估：

- **艺术家网格（Artist Mesh）** ：包含 200 个保留样本，来自 G-Objaverse、Toys4K 和 ShapeNet。
- **稠密网格（Dense Mesh）** ：包含 200 个由 TRELLIS 生成的高保真样本。

### 3.2 对比方法

- **VAE 重建对比**：与离散的、逐面显式基线方法对比，包括 MeshGPT、PivotMesh、MeshCraft。评估指标包括 Chamfer Distance (CD)、Hausdorff Distance (HD) 和 Normal Consistency (NC)。
- **生成对比**：与拓扑感知的自回归方法对比，包括 MeshAnything-v2、BPT、FastMesh、Mesh Silksong、DeepMesh。
- **隐式模型定性对比**：与工业级隐式基线对比，包括 TRELLIS、CLAY、Hunyuan3D。
- **几何条件生成对比**：与 SOTA 基线进行对比。

### 3.3 消融实验

- VAE 输入类型对比（VDF vs. 显式顶点-边体素 vs. 带/不带法向量）。
- 连接推断策略对比（确定性几何算法 vs. 可学习的 Connection Head）。


## 4. 资源与算力

论文明确提到推理效率：LATO 在**单张 H100 GPU** 上可在 **3 到 10 秒**内完成生成。自回归方法则需要数分钟才能生成高保真输出。

关于**训练**所使用的 GPU 数量、型号及训练时长，论文摘要及可获取的正文片段中**未明确说明**。


## 5. 实验数量与充分性

从可获取的信息来看，实验设计较为全面：

- **定量评估**：在 VAE 重建任务上报告了 CD、HD、NC 三项指标。
- **定性评估**：与自回归方法和隐式模型分别进行了定性对比。
- **消融实验**：至少涵盖 VAE 输入类型和连接推断策略两个维度的对比。
- **图像到 3D 生成**：还涉及图像条件下的结构体素生成。

**客观性评估**：实验覆盖了重建、生成、效率等多个维度，对比了显式方法和隐式方法两大流派，消融实验设计合理。但需要指出的是，（1）由于无法获取完整论文，测试集规模（各 200 个样本）是否足够充分尚待确认；（2）与工业级隐式基线的对比主要为定性分析，缺乏定量指标的直接比较。


## 6. 主要结论与发现

1. **拓扑保持有效**：LATO 的拓扑保持潜变量能够有效支撑流匹配生成显式三维网格，生成的网格具有与显式自回归方法可比的良好拓扑结构。
2. **质量优于基线**：在 VAE 重建任务上，LATO 在所有评估指标（CD、HD、NC）上均优于 MeshGPT、PivotMesh、MeshCraft 等基线。
3. **生成质量 SOTA**：在稠密网格和艺术家网格两个基准上，LATO 均达到 SOTA 对齐分数。
4. **推理高效**：LATO 在单张 H100 GPU 上仅需 3–10 秒即可完成生成，远快于自回归方法。
5. **生成无孔洞网格**：与自回归基线因截断训练策略而产生孔洞不同，LATO 生成无孔洞、拓扑良好的网格。


## 7. 优点

1. **拓扑保持的创新性**：LATO 是首个将网格拓扑结构原生压缩到结构化潜空间的方法，无需依赖等值面提取（如 Marching Cubes）或启发式网格化。
2. **显式网格生成**：直接生成显式网格，避免了隐式方法后处理带来的不规则三角剖分，生成的网格可直接用于下游绑定、变形和游戏引擎部署。
3. **内存效率高**：通过采样训练策略，有效绕过了 O(N²) 的复杂度瓶颈。
4. **推理速度快**：单张 H100 GPU 上 3–10 秒生成，具备实际部署潜力。
5. **支持开放表面**：不依赖水密性假设，可处理开放表面和非流形几何。
6. **两阶段流匹配设计清晰**：结构合成与拓扑特征细化分离，生成过程可解释性强。


## 8. 不足与局限

1. **训练资源信息缺失**：论文未明确披露训练所需的 GPU 数量、型号和总训练时长，难以评估方法的训练成本。
2. **测试集规模有限**：艺术家网格和稠密网格各仅 200 个样本，可能不足以充分验证方法的泛化能力。
3. **与隐式模型的对比不够全面**：与 TRELLIS、CLAY、Hunyuan3D 等工业级隐式基线的对比主要为定性分析，缺少定量指标的直接比较。
4. **连接预测的二次复杂度问题**：尽管采用了采样训练策略缓解，但顶点对预测的固有二次复杂度在极大规模网格上仍可能存在瓶颈。
5. **生成多样性评估未知**：从可获取的文本中未看到对生成样本多样性的定量评估（如覆盖率、多样性指标）。
6. **依赖 VAE 重建质量**：作为两阶段方法，整体生成质量高度依赖于第一阶段 VAE 的重建保真度。


（完）
