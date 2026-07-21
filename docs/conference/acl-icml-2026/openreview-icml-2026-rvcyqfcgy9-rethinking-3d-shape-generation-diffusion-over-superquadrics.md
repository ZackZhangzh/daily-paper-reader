---
title: "Rethinking 3D Shape Generation: Diffusion over Superquadrics"
title_zh: 重新思考三维形状生成：基于超二次曲面的扩散
authors: "Zhiyang Liu, Li Wanze, Yuwei Wu, Chengran Yuan, JIAWEI SUN, Rui Zheng, Marcelo H Ang Jr"
date: 2026-04-30
pdf: "https://openreview.net/pdf/7437ef41ecec22890f216ac11adc1d278a0b32e5.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 基于扩散的超二次曲面三维形状生成
tldr: 本文重新思考三维形状生成，将扩散过程从密集几何表示迁移到紧凑的超二次曲面参数空间。传统方法在高维空间（体素、网格、点云）中去噪，计算与内存开销大，本文利用每个形状仅需7KB的超二次参数（姿态、尺寸、形状），大幅降低扩散状态维度与每步计算，提升了可扩展性与可控性，为高效形状生成开辟了新方向。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有扩散方法在密集几何空间操作，计算昂贵且难以扩展。
method: 将扩散建模于紧凑的超二次曲面参数集，而非高维几何表示。
result: 显著降低内存与计算成本，提高生成可扩展性与可控性。
conclusion: 超二次曲面作为几何基元可有效支撑高效扩散形状生成。
---

## Abstract
Diffusion models have advanced 3D shape generation, yet most methods still denoise in high-cardinality spaces (e.g., voxel/SDF grids, meshes, or point clouds), which is computationally and memory intensive and makes it difficult to scale in terms of both higher resolution and stronger controllability.
We rethink the diffusion representation and propose to move diffusion from dense geometry to compact geometric primitives, representing each shape as a small set of **superquadrics**.
Instead of operating on thousands to millions of geometric representation values, we leverage 7KB superquadric parameters (pose, size, and shape), drastically reducing diffusion-state dimensionality and per-step compute/memory.
Our diffusion-over-superquadrics improves scalability by supporting broader capabilities (e.g., resolution-free point-cloud decoding, part-level editing, and constraint-based design) and achieving competitive surface-fidelity and distributional performance on standard benchmarks after point-cloud decoding, while enabling efficient generation within 0.6s per shape for most conditions.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **核心问题**：现有3D形状生成的扩散模型通常在**高基数空间**（如体素/SDF网格、网格或点云）中进行去噪。这些表示方式动辄包含数千乃至数百万个几何值，导致计算与内存开销巨大，且难以在**更高分辨率**和**更强可控性**两个维度上同时扩展。
- **研究动机**：由于去噪过程需要迭代数十到数百步，扩散状态的维度直接决定了计算、内存和运行时的规模。同时，高维状态会使模型能力大量消耗在“密集几何记账”而非“物体级结构理解”上。虽有研究通过八叉树、三平面等方案提升效率，但往往在**分辨率依赖**或**几何可解释性/可编辑性**上做出妥协。
- **整体含义**：本文提出将扩散过程从密集几何表示**迁移到紧凑的几何基元（超二次曲面）** ，从根本上降低扩散状态的维度，从而在保持显式几何表示的同时实现高效、可扩展的3D形状生成。

## 2. 方法论：核心思想、关键技术细节

- **核心思想**：将每个3D形状表示为一小组**超二次曲面（superquadrics）** 的参数集合，扩散过程直接在这些**紧凑的参数空间**中进行，而非在高维几何空间中去噪。
- **表示形式**：每个形状使用约 **7KB** 的超二次曲面参数（包括**姿态、尺寸和形状参数**）来描述。相比之下，传统方法需要处理数千到数百万个几何值。
- **关键优势**：
  - **维度大幅降低**：扩散状态维度从“成千上万”降至“7KB参数”，每步计算和内存消耗显著减少。
  - **分辨率无关解码**：支持无分辨率限制的点云解码。
  - **部件级编辑**：由于超二次曲面本身具有语义可解释性，支持部件级别的编辑操作。
  - **基于约束的设计**：支持约束驱动的形状设计。
- **流程概述**：模型在超二次曲面参数空间上训练扩散过程，生成时从噪声中采样得到一组超二次曲面参数，再通过解码器将其重建为点云或网格等3D几何输出。

## 3. 实验设计：数据集、Benchmark与对比方法

- **数据集**：论文在**标准基准数据集**上进行了评估。虽然摘要未明确列出具体数据集名称，但3D形状生成领域的常见基准包括 **ShapeNet** 等。从论文标题和ICML 2024的投稿背景推断，实验覆盖了多个物体类别。
- **Benchmark与评估指标**：在标准基准上评估了**表面保真度**和**分布性能**。具体指标可能包括倒角距离（Chamfer Distance）、体积交并比（Volumetric IoU）等。
- **对比方法**：论文与现有在**高基数空间**中操作的扩散方法进行了对比，包括基于点云、体素/SDF网格、网格等表示的生成方法。具体对比的方法名称在摘要中未逐一列出。

> **说明**：摘要和元数据提供的信息有限，实验的具体数据集名称、对比方法列表、评估指标的详细数值等，需查阅论文正文获取。

## 4. 资源与算力

论文摘要和元数据中**未明确说明**所使用的GPU型号、数量、训练时长等具体算力信息。

> **说明**：关于训练资源的具体细节，需查阅论文正文中的实验设置部分。

## 5. 实验数量与充分性

- **实验覆盖**：论文在**标准基准**上进行了评估，并验证了多种能力，包括**无分辨率点云解码、部件级编辑、基于约束的设计**。
- **充分性判断**：从摘要来看，实验覆盖了**生成质量（表面保真度、分布性能）** 和**效率（0.6秒/形状）** 两个维度，并涉及多种下游能力验证。但由于摘要篇幅限制，消融实验的具体设置、不同数据集上的详细结果等信息未呈现。
- **客观性与公平性**：论文在**标准基准**上进行评估，且对比了现有主流方法，方法论上具备一定的客观性和公平性基础。具体对比设置（如是否采用相同硬件、相同采样步数等）需查阅正文确认。

> **说明**：消融实验的具体组数、各数据集上的详细数值等，需查阅论文正文获取。

## 6. 主要结论与发现

- **可行性验证**：超二次曲面作为几何基元，可以有效支撑高效的扩散形状生成【tldr】。
- **效率提升显著**：通过将扩散从密集几何迁移到紧凑的超二次曲面参数空间，**大幅降低了扩散状态的维度和每步计算/内存开销**。
- **生成速度快**：在大多数条件下，**每个形状的生成时间在0.6秒以内**。
- **性能具有竞争力**：在点云解码后，该方法在标准基准上取得了**具有竞争力的表面保真度和分布性能**。
- **可扩展性强**：支持**无分辨率点云解码、部件级编辑、基于约束的设计**等更广泛的能力，在可扩展性方面优于传统高维空间扩散方法【tldr】。

## 7. 方法亮点

- **表示创新**：将扩散目标从**高维密集几何**迁移到**紧凑的显式几何基元（超二次曲面）** ，是3D扩散生成中表示层面的一次重要重新思考【tldr】。
- **维度大幅压缩**：每个形状仅需 **7KB** 参数即可表示，相比传统数千至数百万的几何值实现了**数量级的维度缩减**。
- **效率与性能兼顾**：在**显著降低计算和内存成本**的同时，仍能保持**具有竞争力的生成质量**，打破了效率与质量之间的传统权衡。
- **可解释性与可控性**：超二次曲面本身具有清晰的几何语义（姿态、尺寸、形状），天然支持**部件级编辑**和**约束驱动设计**，这是隐式或潜空间扩散方法难以直接提供的。
- **分辨率无关**：支持**无分辨率限制的点云解码**，避免了传统网格/体素方法的分辨率依赖问题。

## 8. 不足与局限

- **几何表达能力有限**：超二次曲面作为参数化几何基元，其表达能力受限于基元的数量和类型。对于**高度复杂、细节丰富或不规则**的物体形状，可能需要大量超二次曲面才能达到与密集表示相当的保真度。
- **解码依赖**：生成的是超二次曲面参数，最终输出几何（如点云）需要经过**解码器重建**。解码器的质量直接影响最终几何的保真度。
- **实验细节缺失**：从摘要和元数据中无法获取**具体的数据集名称、对比方法列表、评估指标的详细数值、消融实验设置**等信息，限制了对外部读者对实验充分性的全面判断。
- **算力信息未披露**：**训练所需的GPU型号、数量、训练时长**等资源信息未在摘要中说明，不利于复现和成本评估。
- **泛化性待验证**：摘要未提及在**跨类别、零样本或真实世界扫描数据**上的泛化性能。超二次曲面拟合本身对输入质量敏感，从合成数据到真实数据的泛化能力仍需进一步验证。
- **应用场景限制**：该方法更适合于**以部件组合为结构特征的物体**（如家具、交通工具等），对于**有机形态、柔软物体或高度不规则形状**，超二次曲面的表示效率可能下降。

（完）
