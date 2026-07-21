---
title: "S2GS: Streaming Semantic Gaussian Splatting for Online Scene Understanding and Reconstruction"
title_zh: 流式语义高斯泼溅用于在线场景理解与重建
authors: "Renhe Zhang, Yuyang Tan, Jingyu Gong, Zhizhong Zhang, Lizhuang Ma, Yuan Xie, Xin Tan"
date: 2026-04-30
pdf: "https://openreview.net/pdf/fec4864d5571755c82ad1d076f9a8e3e4ca69cf8.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 3D高斯泼溅用于在线场景重建与渲染
tldr: 现有离线前馈方法处理长图像流时计算量和内存随序列增长，本文提出流式语义高斯泼溅S2GS，采用严格因果递增框架，通过几何-语义解耦双分支设计，持续更新场景几何、外观和实例级语义，无需访问未来帧或重处理历史观测，实现了高效在线重建与理解。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 解决长图像流中离线方法计算量和内存快速增长的问题，需实现因果在线场景重建。
method: 采用几何-语义解耦双分支，几何分支进行因果建模增量更新高斯，语义分支处理实例级语义。
result: 能够连续更新场景几何外观和语义，在流式输入下保持实时性和低内存占用。
conclusion: S2GS实现了严格的因果在线3DGS重建，为流式场景理解提供了高效框架。
---

## Abstract
Existing offline feed-forward methods for joint scene understanding and reconstruction on long image streams often perform global computation over an ever-growing set of past observations, causing runtime and GPU memory to increase rapidly with sequence length. We propose Streaming Semantic Gaussian Splatting (S2GS), a strictly causal and incremental framework that builds a 3D Gaussian semantic field from image streams without accessing future frames or reprocessing historical observations. S2GS continuously updates scene geometry, appearance, and instance-level semantics through a geometry--semantic decoupled dual-backbone design. The geometry branch performs causal modeling for incremental Gaussian updates, while the semantic branch leverages a 2D foundation vision model and a query-driven decoder to predict masks and identity embeddings. Query-level contrastive alignment and lightweight online association with an instance memory further stabilize temporal identities. Experiments show that S2GS matches or outperforms strong offline baselines, while substantially improving long-horizon scalability: it processes over 1,000 frames with much slower runtime and GPU memory growth, whereas offline global-processing baselines typically run out of memory at around 80 frames under the same setting. Project Page: https://stdcoutzrh.github.io/projects/s2gs/.

---

## 论文详细总结（自动生成）

# S2GS 论文结构化总结


## 一、核心问题与整体含义

**研究动机**：近年来，基于3D高斯泼溅（3DGS）的前馈方法在联合场景重建与理解方面取得了显著进展。然而，现有方法大多遵循**离线全局处理范式**——每当新帧到达时，都需要在整个不断增长的历史观测集上反复执行全局计算。这导致运行时间和GPU内存随序列长度快速增长，严重限制了长序列在线场景的可扩展性。

**核心问题**：如何在**严格因果约束**下（即不访问未来帧、不重处理历史帧），实现对长图像流的**在线联合3D重建与语义理解**。现有流式重建方法大多局限于几何与外观建模，缺乏实例级语义理解能力。

**整体含义**：S2GS提出了一个**严格因果、增量式的3D高斯语义场框架**，能够在不断流入的图像流中持续更新场景几何、外观和实例级语义，无需重处理历史帧，实现了可扩展的在线联合重建与理解。


## 二、方法论

### 核心思想：几何-语义解耦双分支设计

S2GS将几何建模与语义理解**解耦为两个独立的流式分支**，避免几何更新噪声污染语义表示：

1. **几何分支（Geometry Branch）** ：采用**因果Transformer**进行帧级因果聚合，在几何先验指导下实现稳定的场景维护。每个帧被编码为视觉token后，通过时序因果注意力掩码处理——每个时间步的token只能关注历史前缀。推理时缓存并复用历史帧的KV张量，无需重新前传历史输入。三个轻量级预测头分别输出密集深度图、相机参数和逐像素高斯属性。通过从严格因果预训练的3D基础模型（教师网络）蒸馏几何监督信号（深度和相位的ℓ₂损失与Huber损失），稳定在线重建。最终将像素反投影为3D高斯中心，与预测属性结合并增量累积到持久化全局场景表示中。

2. **语义分支（Semantic Branch）** ：独立提取逐帧多尺度特征。每帧由**冻结的2D基础视觉模型**编码提取鲁棒语义特征，经轻量级适配器转换为多尺度表示后，由**查询驱动的掩码分类解码器**预测分割掩码、类别分数和查询嵌入。

### 关键技术机制

- **查询级对比对齐**：训练时通过匈牙利匹配将预测查询与真值实例对齐，并应用监督对比学习损失，鼓励同一物理实例在不同帧的嵌入形成紧凑簇，同时分离不同实例。

- **轻量级在线实例关联**：推理时通过余弦相似度和二分匹配将逐帧预测与实例记忆库关联，匹配后的原型通过指数移动平均更新，保证流式推理下的时序一致性。

- **语言驱动的开放词汇分割**：引入轻量级查询语义投影器，将查询嵌入映射到2D基础模型的联合视觉-语言语义空间，通过余弦相似度匹配文本查询与投影查询，返回对应掩码。


## 三、实验设计

**数据集与场景**：
- 主要在 **ScanNet** 数据集上训练和验证
- 零样本泛化实验在 **ScanNet++** 和 **Replica** 上进行

**序列采样策略**：采用长序列采样策略，通过逐步外推视点构建流式序列——每个上下文帧的视点都超出前一帧，随时间持续扩展视角范围。

**对比方法**：
- **联合重建与理解方法**：SIU3R、Uni3R、LSM
- **2D语义分割基线**：LSeg、Mask2Former
- **纯重建方法**：pixelSplat、MVSplat、NoPoSplat（仅支持2视图输入）

**评估指标**：
- 重建质量：PSNR、SSIM
- 语义理解：逐帧mIoU
- 跨帧实例一致性：T-mIoU、T-SR


## 四、资源与算力

**论文中未明确说明**所使用的GPU型号、数量及具体训练时长等算力信息。


## 五、实验数量与充分性

实验设计较为全面，主要包括：

1. **多视图数量对比**（2/8/14/32视图）
2. **长序列性能测试**（64/256/512/1024帧）
3. **效率对比**（每帧延迟、峰值GPU内存随序列长度增长）
4. **零样本跨数据集泛化**（ScanNet++、Replica）
5. **开放词汇语言定位**定性+定量评估
6. **定性可视化对比**（新颖视图合成、语义分割、实例追踪）

**充分性与客观性评价**：实验覆盖了重建质量、语义理解、时序一致性、效率可扩展性、泛化能力和开放词汇等多个维度，对比方法覆盖了多类代表性基线（包括纯重建、纯分割和联合方法），整体较为充分和客观。但需注意：**由于目前没有公开的在线前馈3DGS方法**，对比主要针对离线全局方法，这在一定程度上对S2GS有利（离线方法本身不具备流式能力）。


## 六、主要结论与发现

1. **性能可比或超越强离线基线**：在联合重建与理解基准上，S2GS匹配或超越了强离线基线。随着输入视图数增加（8/14/32），S2GS持续提升，在重建质量和时序语义/实例一致性上均表现强劲。

2. **显著的长序列可扩展性**：S2GS可处理**1000+帧**，运行时间和GPU内存增长缓慢；而离线全局处理方法在相同设置下通常在约**80帧**时即耗尽内存。64帧时SIU3R性能已退化，256帧时直接OOM，而S2GS仍能产出可用结果。

3. **效率优势明显**：S2GS保持低每帧延迟且随序列长度仅温和增长，而SIU3R的计算和内存消耗快速增长。

4. **跨数据集泛化能力**：在ScanNet++和Replica上的零样本实验表明，S2GS在PSNR和mIoU上均优于SIU3R。

5. **开放词汇分割有效**：在自由形式文本查询上，S2GS取得最佳mIoU，预测掩码空间更连贯、边界更锐利、背景“渗漏”更少。


## 七、方法亮点

1. **严格因果+免重处理**：首次在3DGS框架中实现严格因果的在线联合重建与理解，符合真实在线系统的工作特性。

2. **几何-语义解耦设计**：有效防止几何更新噪声污染语义表示，是流式语义建模的关键创新。

3. **完整的实例身份稳定机制**：通过训练时的对比学习和推理时的轻量级记忆关联，有效减少ID切换。

4. **开放词汇能力**：通过查询语义投影器将实例查询对齐到视觉-语言空间，支持语言条件下的在线开放词汇分割。

5. **仅需未标定RGB视频流**：无需深度、IMU或严格相机标定，适用性更广。

6. **极致的可扩展性**：1000+帧的流式处理能力，远超离线方法的~80帧上限。


## 八、不足与局限

1. **极稀疏视图下性能受限**：在仅2视图的极端稀疏设置下，S2GS的PSNR/SSIM不如离线基线——因为离线方法可利用非因果的跨视图聚合更好地解决视角模糊和遮挡问题。

2. **缺乏同类在线方法对比**：目前没有公开的在线前馈3DGS方法，只能与离线全局方法对比，虽能体现可扩展性优势，但缺乏“公平的流式同类竞技”。

3. **算力信息未披露**：论文未明确说明训练所用的GPU型号、数量及训练时长，不利于复现和资源评估。

4. **训练数据单一**：主要在ScanNet上训练，尽管有零样本泛化实验，但训练数据集的多样性可能影响泛化上限。

5. **真实世界部署验证不足**：实验基于标准数据集，未涉及真实机器人、AR/VR等实际在线系统的端到端部署验证。

6. **实例级语义的长期漂移风险**：尽管设计了稳定机制，但超长序列（数千帧以上）中累积误差和身份漂移的长期表现尚待验证。

（完）
