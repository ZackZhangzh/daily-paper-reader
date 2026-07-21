---
title: Affine-Equivariant Kernel Space Encoding for NeRF Editing
title_zh: 用于NeRF编辑的仿射等变核空间编码
authors: "Mikołaj Zieliński, Krzysztof Byrski, Tomasz Szczepanik, Dominik Belter, Przemysław Spurek"
date: 2026-04-30
pdf: "https://openreview.net/pdf/048e4b5756022f2faa8898f0f2d379b85079ab58.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 隐式神经表示用于NeRF编辑
tldr: 神经场景表示虽实现高保真渲染，但隐式潜空间全局纠缠，难以局部编辑和物理操作。本文提出仿射等变核空间编码（EKS），为NeRF提供局部化、变形感知的特征表示，通过聚合核空间特征而非离散点查询，实现更可控的编辑，减少伪影。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: NeRF隐式潜空间全局纠缠，缺乏局部可编辑性。
method: 提出仿射等变核空间编码，提供局部变形感知特征。
result: 实现了更可控的局部编辑，减少伪影。
conclusion: EKS提升了NeRF的编辑能力和物理可操作性。
---

## Abstract
Neural scene representations achieve high-fidelity rendering by encoding 3D scenes as continuous functions, but their latent spaces are typically implicit and globally entangled, making localized editing and physically grounded manipulation difficult. While several works introduce explicit control structures or point-based latent representations to improve editability, these approaches often suffer from limited locality, sensitivity to deformations, or visual artifacts. In this paper, we introduce Affine-Equivariant Kernel Space Encoding (EKS), a spatial encoding for neural radiance fields that provides localized, deformation-aware feature representations. Instead of querying latent features directly at discrete points or grid vertices, our encoding aggregates features through a field of anisotropic Gaussian kernels, each defining a localized region of influence. This kernel-based formulation enables stable feature interpolation under spatial transformations while preserving continuity and high reconstruction quality. To preserve detail without sacrificing editability, we further propose a training-time feature distillation mechanism that transfers information from multi-resolution hash grid encodings into the kernel field, yielding a compact and fully grid-free representation at inference. This enables intuitive, localized scene editing directly via Gaussian kernels without retraining, while maintaining high-quality rendering.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义（研究动机和背景）

- **核心问题**：神经场景表示（如NeRF）通过将3D场景编码为连续函数来实现高保真渲染，但其潜在空间通常是**隐式的且全局纠缠**，使得**局部编辑**和**物理可操作的操控**非常困难。
- **现有方法的不足**：已有工作尝试引入显式控制结构或基于点的潜在表示来提升可编辑性，但这些方法往往存在**局部性有限**、**对变形敏感**或**产生视觉伪影**等问题。
- **本文目标**：提出一种新的空间编码方法，使NeRF具备**局部化**、**变形感知**的特征表示，从而实现直观、高质量的局部场景编辑。

## 2. 论文提出的方法论

- **核心思想**：提出**仿射等变核空间编码（Affine-Equivariant Kernel Space Encoding，EKS）**，用各向异性高斯核的场来聚合特征，取代传统方法中在离散点或网格顶点直接查询隐式特征的方式。
- **关键技术细节**：
    - **基于核的特征表示**：每个高斯核定义一个局部影响区域，在空间变换下实现**稳定的特征插值**，同时保持连续性和高重建质量。
    - **训练时特征蒸馏**：提出一种训练时的特征蒸馏机制，将**多分辨率哈希网格编码**中的信息迁移到核场中，从而在推理时得到一个**紧凑且完全无网格**的表示。
    - **无需重训的编辑**：编辑时直接操作高斯核即可实现直观的局部场景编辑，无需重新训练模型。

## 3. 实验设计

- **数据集与场景**：
    - 支持**NeRF Synthetic格式**的合成数据，使用LagHash生成初始点云。
    - 支持**真实数据**，遵循Nerfstudio的数据格式，需在数据集文件夹中放置`sparse_pc.ply`文件，使用Gaussian Splatting生成初始高斯。
    - 论文提供了完整的数据集供复现。
- **Benchmark与对比方法**：
    - 与**NeuralEditor**进行了对比。
    - 对比了**NeRF-Synthetic对象**在相同编辑方式下的表现。
- **评估方式**：通过交互式编辑演示（如移动高斯、物理模拟、手动调整等）来展示编辑效果。

## 4. 资源与算力

- **文中未明确说明**使用的GPU型号、数量或训练时长等具体算力信息。论文摘要和项目页面均未提及相关硬件配置或训练时间。

## 5. 实验数量与充分性

- **实验类型**：
    - 涵盖了**合成数据**和**真实数据**两类场景。
    - 展示了多种编辑方式：**直接移动高斯**、**物理模拟**（如软体动力学、布料掉落）、**手动调整**等。
    - 提供了**交互式演示**（如调整狐狸头部位置）。
    - 与**NeuralEditor**进行了对比。
- **充分性与客观性**：
    - 实验覆盖了合成与真实场景、多种编辑操作类型，具有一定广度。
    - 提供了**完整的可复现资源**（数据集、配置文件、代码），增强了实验的透明度和可验证性。
    - 但论文摘要和项目页面**未提供定量评估指标**（如PSNR、SSIM、LPIPS等），缺乏与基线方法的**数值化对比**，实验的客观性难以从现有材料中充分判断。

## 6. 论文的主要结论与发现

- EKS通过**仿射等变核空间编码**，为NeRF提供了**局部化、变形感知**的特征表示。
- 基于**各向异性高斯核**的聚合编码方式，实现了空间变换下的**稳定特征插值**，同时保持了**连续性和高重建质量**。
- 通过**训练时特征蒸馏**，将多分辨率哈希网格的信息迁移到核场中，实现了**推理时完全无网格**的紧凑表示。
- EKS支持**直接通过高斯核进行直观的局部场景编辑**，无需重训，同时保持高质量渲染。

## 7. 优点

- **方法创新性**：首次将**仿射等变核空间编码**引入NeRF编辑任务，提供了一种局部化、变形感知的特征表示新范式。
- **编辑直观性**：用户可直接**移动或调整高斯核**来编辑场景，操作直观简单。
- **无需重训**：编辑过程**不需要重新训练模型**，大幅提升了编辑效率。
- **无网格推理**：通过特征蒸馏，推理时**完全摆脱网格依赖**，表示紧凑。
- **可复现性强**：提供了**完整的代码、数据集和配置文件**，便于研究者复现和扩展。
- **编辑方式多样**：支持**手动调整、物理模拟、网格变形驱动**等多种编辑方式。

## 8. 不足与局限

- **算力信息缺失**：未报告训练所需的**GPU型号、数量、训练时长**等关键资源信息，不利于实际应用时的资源评估。
- **定量评估不足**：摘要和项目页面**缺少定量指标**（如PSNR、SSIM、LPIPS等）的对比，难以客观衡量重建质量和编辑效果。
- **对比方法单一**：仅提及与**NeuralEditor**的对比，缺乏与更多主流NeRF编辑方法（如CLIP-NeRF、SNeRF等）的全面比较。
- **应用场景局限**：虽然展示了物理模拟等应用，但**未讨论在动态场景、大规模场景或极端变形下的性能表现**。
- **依赖初始点云**：方法依赖`sparse_pc.ply`初始化高斯，对输入数据的预处理有一定要求。

（完）
