---
title: "MoE-GS: Mixture of Experts for Dynamic Gaussian Splatting"
title_zh: MoE-GS：用于动态高斯泼溅的专家混合模型
authors: "In-Hwan Jin, Hyeongju Mun, Joonsoo Kim, Kugjin Yun, Kyeongbo Kong"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=WrEQFwWCdT"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 基于专家混合的3D高斯泼溅用于动态场景重建和新视角合成
tldr: 本文提出MoE-GS框架，针对动态3D高斯泼溅在不同场景下性能不一致问题，采用专家混合架构和体素感知路由器，自适应融合多种变形先验，提升动态新视角合成质量，与LLM中的稀疏MoE不同，本方法专注于提高合成质量而非降低计算量。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有动态场景重建方法在不同场景下表现不稳定，单一方法难以处理所有动态挑战。
method: 提出体积感知路由器，自适应混合多个变形先验专家。
result: 提升动态新视角合成质量，场景泛化性更强。
conclusion: MoE-GS为动态场景3DGS提供了鲁棒的集成解决方案。
---

## Abstract
Recent advances in dynamic scene reconstruction have significantly benefited from 3D Gaussian Splatting, yet existing methods show inconsistent performance across diverse scenes, indicating no single approach effectively handles all dynamic challenges. To overcome these limitations, we propose Mixture of Experts for Dynamic Gaussian Splatting (MoE-GS), a unified framework integrating multiple specialized experts via a novel Volume-aware Pixel Router. Unlike sparsity-oriented MoE architectures in large language models,
MoE-GS is designed to improve dynamic novel view synthesis quality by combining heterogeneous deformation priors, rather than to reduce training or inference-time FLOPs. Our router adaptively blends expert outputs by projecting volumetric Gaussian-level weights into pixel space through differentiable weight splatting, ensuring spatially and temporally coherent results. Although MoE-GS improves rendering quality, the increased model capacity and reduced FPS are inherent to the MoE architecture. To mitigate this, we explore two complementary directions: (1) single-pass multi-expert rendering and gate-aware Gaussian pruning, which improve efficiency within the MoE framework, and (2) a distillation strategy that transfers MoE performance to individual experts, enabling lightweight deployment without architectural changes. To the best of our knowledge, MoE-GS is the first approach incorporating Mixture-of-Experts techniques into dynamic Gaussian splatting. Extensive experiments on the N3V and Technicolor datasets demonstrate that MoE-GS consistently outperforms state-of-the-art methods with improved efficiency. Video demonstrations are available at cvsp-lab.github.io/MoE-GS.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究动机**：动态场景重建是迈向通用人工智能（AGI）、沉浸式内容创作和具身智能的关键技术。尽管基于3D高斯泼溅（3D Gaussian Splatting, 3DGS）的动态场景重建方法近年来取得了显著进展，但现有方法在不同场景下表现不一致。具体表现为三大局限：
- **场景级差异**：不同方法在不同场景中性能差异显著，各自适用范围有限；
- **空间级不一致**：同一场景内，不同方法处理不同空间区域的重建质量差异明显；
- **时间波动**：视频序列中最佳方法在帧间动态变化，复杂时间模式难以捕捉。

**核心问题**：没有单一方法能有效应对所有动态挑战，亟需一种能够自适应融合多种变形先验的统一框架。

**论文含义**：本文提出**MoE-GS（Mixture of Experts for Dynamic Gaussian Splatting）** ，首次将专家混合（MoE）技术引入动态3DGS领域。与LLM中面向稀疏性的MoE不同，MoE-GS的设计目标是通过组合异构变形先验来提升动态新视角合成质量，而非降低计算量。

---

## 二、方法论

### 核心思想

MoE-GS采用“先独立训练、后路由融合”的两阶段策略：
1. 首先独立训练多个动态高斯专家（Dynamic Gaussian Experts）；
2. 然后学习一个**体素感知像素路由器（Volume-aware Pixel Router）** ，自适应地混合专家输出。

### 关键技术细节

**（1）MoE架构**
MoE是一种集成学习技术，包含N个并行专家网络和一个路由器。给定输入x，MoE输出为各专家输出的加权和：
$$\text{MoE}(\mathbf{x}) = \sum_{k=1}^{N} G_k(\mathbf{x}) \cdot E_k(\mathbf{x})$$
其中$G_k(\mathbf{x})$为路由器计算的门控权重。

**（2）体素感知像素路由器（Volume-aware Pixel Router）**
- 传统MoE在特征空间操作，而MoE-GS直接在渲染的2D图像上进行专家选择和混合；
- 每个高斯被复制，其颜色属性被可学习的逐高斯权重替代，使路由器能够感知体素结构并编码时空及视点相关性；
- 路由器通过**可微分权重泼溅（differentiable weight splatting）** 将体素级高斯权重投影到像素空间，确保空间和时间上的连贯性。

**（3）两阶段训练策略**
专家先独立优化，然后路由器在专家固定的情况下进行训练，以确保稳定高效的优化。

**（4）效率优化（两个互补方向）**
- **单次多专家渲染与门控感知高斯剪枝**：在MoE框架内提升效率；
- **知识蒸馏策略**：将MoE性能迁移到单个专家，实现轻量级部署而无需改变架构。

---

## 三、实验设计

### 数据集与场景

- **N3V（Neural 3D Video）** ：动态场景重建的标准基准；
- **Technicolor**：另一个标准动态场景重建基准；
- **HyperNeRF**：单目数据集，用于验证模型在有限输入视角下的泛化能力。

数据预处理遵循STG的方法。

### 对比方法

对比了多种基于高斯的主流动态重建方法，包括STG、Ex4DGS等。

### 评估指标

采用PSNR、SSIM、LPIPS等标准图像质量指标。

---

## 四、资源与算力

论文明确提到实验在 **NVIDIA A6000 GPU** 上进行。但**未明确说明**GPU的具体数量、训练时长等详细算力信息。论文指出，使用N个专家理论上会使训练时间增加N倍，但即使专家训练预算有限，MoE-GS仍然有效。

---

## 五、实验数量与充分性

### 实验组数

论文进行了多组实验，涵盖以下方面：

| 实验类型 | 内容 |
|---|---|
| **主实验** | 在N3V和Technicolor两个数据集上与SOTA方法对比 |
| **泛化实验** | 在HyperNeRF单目数据集上验证跨场景泛化能力 |
| **消融实验1** | MoE架构贡献分析（各专家贡献、路由机制作用） |
| **消融实验2** | 效率策略分析（单次渲染、剪枝） |
| **消融实验3** | 蒸馏策略的作用与影响 |
| **配置分析** | 路由器架构设计、专家数量（N=2,3,4）等 |

### 充分性与客观性评价

- **优点**：实验覆盖多数据集、多指标、多消融维度，对比了多种主流基线方法，评估体系较为完整；
- **局限**：论文为ICLR 2026接受论文，属于顶级会议，实验设计应经过严格同行评审，总体可信度较高。但未提供详细的误差棒或多次运行的标准差等统计信息。

---

## 六、主要结论与发现

1. **性能领先**：MoE-GS在N3V和Technicolor数据集上一致性地优于现有SOTA方法；
2. **泛化性强**：在HyperNeRF等单目数据集上也表现出强大的泛化能力；
3. **效率可优化**：尽管MoE架构本身会增大模型容量并降低FPS，但通过单次渲染、剪枝和蒸馏等策略可有效缓解；
4. **几何一致性**：通过多视角深度一致性（MDC）验证，尽管在像素层级混合，仍能保持高质量的3D几何一致。

---

## 七、优点

### 方法创新亮点

1. **首创性**：首个将MoE技术引入动态3DGS的工作；
2. **异构专家兼容**：无需专家共享相同的规范高斯表示即可组合异构4DGS模型；
3. **体素感知路由**：提出的体素感知像素路由器解决了纯像素级或纯体积级路由器在捕捉时空和视点相关性上的不足；
4. **可微分的3D感知路由**：在训练中注入几何上下文，支持稳定训练；
5. **轻量级部署路径**：通过蒸馏策略可将MoE性能迁移到单个专家，无需架构改动即可部署。

### 实验设计亮点

- 实验覆盖多类型数据集（多视角N3V/Technicolor + 单目HyperNeRF），验证了方法的泛化性；
- 消融实验系统全面，逐一验证了各组件（专家、路由、剪枝、蒸馏）的贡献。

---

## 八、不足与局限

1. **固有计算开销**：MoE架构本身导致模型容量增大和帧率（FPS）下降，这是架构的固有问题；
2. **训练成本较高**：使用N个专家理论上训练时间增加N倍，尽管论文声称即使专家训练预算有限仍有效，但整体训练成本仍高于单一模型；
3. **算力信息不透明**：论文未详细说明GPU数量、训练时长等具体资源消耗信息；
4. **专家数量固定**：实验中专家数量固定为N=2,3,4，未充分探讨更大规模专家集的效果与效率权衡；
5. **应用场景限制**：方法主要针对动态新视角合成任务，在其他下游任务（如动态场景编辑、交互等）上的适用性尚未验证。

---

（完）
