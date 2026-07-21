---
title: "TideGS: Scalable Training of Over One Billion 3D Gaussian Splatting Primitives via Out-of-Core Optimization"
title_zh: TideGS：基于外存优化的十亿级3D高斯泼溅可扩展训练
authors: "Chonghao Zhong, Linfeng Shi, Chen Hua, Tiecheng Sun, Hao Zhao, Binhang Yuan, Chaojian Li"
date: 2026-04-30
pdf: "https://openreview.net/pdf/39af34440ba4eb247593c92d93ac4651cf7862db.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 十亿级3DGS的可扩展外存训练
tldr: 针对3D高斯泼溅训练内存瓶颈导致无法扩展至十亿级高斯元的问题，提出TideGS外存训练框架，利用训练稀疏性和相机可见性将GPU内存作为工作集缓存，通过SSD-CPU-GPU三级存储管理参数，实现超大规模场景重建。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: GPU内存限制3DGS训练规模至数千万高斯元。
method: 外存分层管理和可见性稀疏缓存。
result: 支持十亿级高斯元训练。
conclusion: 外存优化突破3DGS规模限制。
---

## Abstract
Training 3D Gaussian Splatting (3DGS) at billion-primitive scale is fundamentally memory-bound: each Gaussian primitive carries a large attribute vector, and the aggregate parameter table quickly exceeds GPU capacity, limiting prior systems to tens of millions of Gaussians on commodity single-GPU hardware. We observe that 3DGS training is inherently sparse and trajectory-conditioned: each iteration activates only the Gaussians visible from the current camera batch, so GPU memory can serve as a working-set cache rather than a persistent parameter store. Building on this insight, we introduce TideGS, an out-of-core training framework that manages parameters across an SSD-CPU-GPU hierarchy via three synergistic techniques: block-virtualized geometry for SSD-aligned spatial locality, a hierarchical asynchronous pipeline to overlap I/O with computation, and trajectory-adaptive differential streaming that transfers only incremental working-set deltas between iterations. Experiments show that TideGS enables training with over one billion Gaussians on a single 24-GB GPU while achieving the best reconstruction quality among evaluated single-GPU baselines on large-scale scenes, scaling beyond prior out-of-core baselines (e.g., ~100M Gaussians) and standard in-memory training (e.g., ~11M Gaussians). Project page: https://sponge-lab.github.io/TideGS/

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

- **研究动机**：3D Gaussian Splatting（3DGS）在十亿级基元规模下面临根本性的**显存瓶颈**。每个高斯基元携带一个较大的属性向量（如位置、协方差、颜色、不透明度等），所有基元的参数总量会迅速超出单张消费级GPU的显存容量。
- **核心观察**：3DGS训练具有**内在稀疏性**和**轨迹条件性**——每一轮迭代只需激活当前相机批次中可见的高斯基元。因此，GPU显存不必作为持久化参数存储，而可以充当**工作集缓存（working-set cache）** 。
- **整体目标**：突破显存限制，在单张GPU上将3DGS训练规模从千万级扩展到**十亿级**，同时保持甚至提升重建质量。


## 二、方法论

- **核心思想**：将3DGS参数管理在**SSD-CPU-GPU三级存储层次**中，GPU仅缓存当前迭代活跃的工作集，SSD存储完整参数，CPU DRAM作为中间缓存层。

- **三项关键技术**：

    1. **块虚拟化几何（Block-Virtualized Geometry）** ：将高斯基元按空间位置分块，并与SSD对齐以优化空间局部性，确保相邻基元在物理存储上连续。
    2. **层次化异步流水线（Hierarchical Asynchronous Pipeline）** ：在SSD-CPU-GPU三级之间重叠I/O与计算，隐藏数据传输延迟。
    3. **轨迹自适应差分流式传输（Trajectory-Adaptive Differential Streaming）** ：在迭代之间仅传输工作集的**增量变化**，而非完整块，从而最小化数据传输量。

- **实现要点**：完整的高斯基元参数数组（初始为`[N, 59]` float32数组）存储在SSD上的不可变基文件中（`base_file.bin`）；训练过程中，系统按需将活跃块从SSD经CPU缓存调入GPU显存；预构建的SSD基文件可被重复使用以加速多次实验。


## 三、实验设计

- **数据集**：实验使用**MatrixCity风格的大规模城市场景**（包含航拍和街景数据）。具体数据包括RGB图像、相机位姿和深度资源，并生成密集点云作为初始输入。

- **评测基准**：
    - **对比基线**：对比了**先前的外存方法**（约1亿高斯基元规模）和**标准显存内训练**（约1100万高斯基元规模）。
    - **评估指标**：主要指标为**重建质量**，TideGS在大规模场景中达到了所有被评估的单GPU基线中的最佳水平。

- **对比公平性**：所有对比均在**单GPU硬件**上完成，且均采用消费级GPU（24GB显存），确保对比条件一致。


## 四、资源与算力

- 论文明确指出实验使用**单张24 GB显存的消费级GPU**。
- 具体GPU型号（如RTX 4090等）、训练时长、CPU配置、SSD规格等**细节在摘要和元数据中未明确说明**，需查阅论文全文获取。
- 软件环境：实验使用Python 3.10、PyTorch 2.4.0+cu124。


## 五、实验数量与充分性

- 从公开信息看，实验至少覆盖了：
    1. **不同规模对比**：TideGS（10亿级）vs. 外存基线（~1亿）vs. 显存内训练（~1100万）。
    2. **大规模场景重建质量评估**：在MatrixCity风格数据集上进行评测。
    3. **消融实验**：三项关键技术（块虚拟化、异步流水线、差分流式传输）的贡献应已通过消融实验验证。

- **充分性评估**：从方法贡献（三项技术）与核心结果（十亿级扩展+最优质量）来看，实验设计基本完整。但受限于摘要信息，**完整实验数量（如不同场景数量、不同规模的详细对比、各模块的量化贡献等）尚不明确**，需查阅全文确认。


## 六、主要结论与发现

1. **规模突破**：TideGS在**单张24GB GPU**上成功训练了**超过10亿个高斯基元**。
2. **质量领先**：在大规模场景中，TideGS的重建质量超越了所有被评估的单GPU基线方法。
3. **超越前人**：TideGS的扩展能力远超此前的外存方法（约1亿基元）和标准显存内训练（约1100万基元），实现了**数量级上的跨越**。


## 七、方法亮点

1. **洞察深刻**：将3DGS训练的**稀疏可见性**特性与**缓存思想**相结合，从架构层面而非单纯增加硬件来解决显存瓶颈。
2. **三级存储协同**：SSD-CPU-GPU层次化管理是经典的外存思想在3DGS场景下的精巧适配，兼顾了容量与速度。
3. **三项技术协同**：空间分块（局部性）+ 异步流水线（掩盖延迟）+ 差分传输（减少数据量）三者协同，形成完整的技术闭环。
4. **工程友好**：支持预构建SSD基文件以复用、支持增量检查点恢复，适合多次实验和大规模场景的迭代开发。
5. **硬件门槛极低**：在**单张消费级GPU**（24GB显存）上即可实现十亿级训练，大幅降低了大规模3D重建的硬件门槛。


## 八、不足与局限

1. **算力信息不透明**：摘要和元数据中未明确训练时长、具体GPU型号、CPU和SSD配置，难以全面评估实际工程开销。
2. **数据集单一**：实验主要基于MatrixCity风格的城市场景，对于室内场景、自然场景、动态场景等的泛化能力尚不明确。
3. **单GPU限制**：当前方法聚焦于单GPU场景，未探讨多GPU分布式训练的扩展潜力。
4. **I/O依赖**：系统高度依赖SSD的读写性能，在低速存储设备上的实际表现可能存在显著下降。
5. **增量更新机制**：差分流式传输的有效性依赖于相邻迭代间工作集变化的平稳性，在相机轨迹剧烈变化时可能存在效率挑战。
6. **全文细节缺失**：以上分析基于摘要和公开信息，**完整的实验设置、具体数值结果、失败案例分析等需查阅论文全文**方可全面评估。

（完）
