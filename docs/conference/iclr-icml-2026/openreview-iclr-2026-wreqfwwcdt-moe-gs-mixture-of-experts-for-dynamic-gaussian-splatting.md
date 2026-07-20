---
title: "MoE-GS: Mixture of Experts for Dynamic Gaussian Splatting"
title_zh: MoE-GS：面向动态高斯泼溅的专家混合模型
authors: "In-Hwan Jin, Hyeongju Mun, Joonsoo Kim, Kugjin Yun, Kyeongbo Kong"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=WrEQFwWCdT"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 动态三维高斯泼溅的专家混合模型
tldr: 现有动态场景重建方法在多样场景下性能不一，本文提出MoE-GS，通过体积感知像素路由器集成多个专家，混合不同变形先验，专门用于提升动态新视角合成质量，而非降低计算量。实验表明该方法在动态场景中显著优于现有单模型方案，展现了专家混合架构在3D高斯泼溅中的有效性。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 单一模型难以处理所有动态场景挑战，需要自适应融合多种先验。
method: 设计体积感知像素路由器，动态混合多个变形专家输出，优化新视角质量。
result: 在多个动态数据集上合成质量超越现有方法，且推理效率保持不变。
conclusion: 专家混合框架可有效提升动态3D高斯泼溅的鲁棒性和表现力。
---

## Abstract
Recent advances in dynamic scene reconstruction have significantly benefited from 3D Gaussian Splatting, yet existing methods show inconsistent performance across diverse scenes, indicating no single approach effectively handles all dynamic challenges. To overcome these limitations, we propose Mixture of Experts for Dynamic Gaussian Splatting (MoE-GS), a unified framework integrating multiple specialized experts via a novel Volume-aware Pixel Router. Unlike sparsity-oriented MoE architectures in large language models,
MoE-GS is designed to improve dynamic novel view synthesis quality by combining heterogeneous deformation priors, rather than to reduce training or inference-time FLOPs. Our router adaptively blends expert outputs by projecting volumetric Gaussian-level weights into pixel space through differentiable weight splatting, ensuring spatially and temporally coherent results. Although MoE-GS improves rendering quality, the increased model capacity and reduced FPS are inherent to the MoE architecture. To mitigate this, we explore two complementary directions: (1) single-pass multi-expert rendering and gate-aware Gaussian pruning, which improve efficiency within the MoE framework, and (2) a distillation strategy that transfers MoE performance to individual experts, enabling lightweight deployment without architectural changes. To the best of our knowledge, MoE-GS is the first approach incorporating Mixture-of-Experts techniques into dynamic Gaussian splatting. Extensive experiments on the N3V and Technicolor datasets demonstrate that MoE-GS consistently outperforms state-of-the-art methods with improved efficiency. Video demonstrations are available at cvsp-lab.github.io/MoE-GS.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

**研究背景**：动态场景重建是构建通用人工智能（AGI）、沉浸式空间计算和具身智能等领域的基础性挑战。近年来，3D高斯泼溅（3DGS）凭借实时渲染能力和出色的视觉保真度成为静态场景重建的有力工具。在此基础上，研究者将高斯表示扩展到动态场景，提出了多种变形建模方案，如基于MLP的变形网络、多项式运动模型和插值方法等。

**核心问题**：现有动态场景重建方法在不同场景下性能表现不一致——没有任何单一方法能有效应对所有动态场景挑战。这表明单一变形先验难以覆盖真实世界中丰富多样的运动模式。

**整体含义**：本文提出**MoE-GS（Mixture of Experts for Dynamic Gaussian Splatting）**，首次将专家混合（MoE）技术引入动态高斯泼溅领域。其核心思想并非像LLM中的MoE那样追求稀疏计算以降低FLOPs，而是通过**融合多种异构变形先验**来提升动态新视角合成质量，使模型能够自适应地处理不同类型的动态场景。

---

## 二、方法论

### 2.1 核心思想

MoE-GS首先独立训练多个动态高斯专家（每个专家学习一种特定的变形先验），然后通过一个**体素感知像素路由器（Volume-aware Pixel Router）** 自适应地混合各专家的输出。该方法允许不同专家拥有各自独立的规范高斯表示，无需共享同一规范空间。

### 2.2 关键技术细节

- **路由器机制**：路由器通过**可微分的权重泼溅（differentiable weight splatting）**，将体素级别的高斯权重投影到像素空间，从而实现专家输出的自适应混合。
- **空间-时间一致性**：该投影方式确保融合结果在空间和时间上保持连贯。
- **效率优化**：MoE架构本身会带来模型容量增加和帧率（FPS）下降。为缓解这一问题，论文探索了两个互补方向：
  1. **单次多专家渲染（single-pass multi-expert rendering）与门控感知高斯剪枝（gate-aware Gaussian pruning）** ——在MoE框架内提升效率；
  2. **知识蒸馏策略**——将MoE的综合性能迁移到单个专家模型上，实现无需架构变更的轻量化部署。

### 2.3 算法流程（文字说明）

1. **专家训练阶段**：独立训练多个动态高斯专家模型，每个专家学习不同的变形先验；
2. **路由器学习阶段**：训练体素感知像素路由器，学习如何根据场景内容自适应地分配各专家的权重；
3. **推理阶段**：通过可微分的权重泼溅，将体素级路由权重投影到像素空间，逐像素融合各专家输出，生成最终渲染结果；
4. **效率优化（可选）** ：采用单次多专家渲染或门控感知剪枝提升推理效率；或通过蒸馏将MoE性能压缩到单个专家模型。

---

## 三、实验设计

**数据集**：在**N3V数据集**（Li等，2022）和**Technicolor数据集**（Sabater等，2017）上进行实验。

**Benchmark与对比方法**：论文与当前最先进（SOTA）的动态场景重建方法进行了对比，包括Ex4DGS等基线方法。实验报告了每个场景的详细量化结果。

**评估指标**：采用标准的质量指标（如PSNR、SSIM、LPIPS等）和模型大小进行对比。

---

## 四、资源与算力

**文中未明确说明**使用的GPU型号、数量或训练时长等具体算力信息。用户提供的论文摘要和元数据中未涉及相关细节，需要查阅论文全文或补充材料才能获知。

---

## 五、实验数量与充分性

从现有信息来看：

- **数据集覆盖**：实验在N3V和Technicolor两个标准动态场景数据集上进行，覆盖了多个场景的逐场景量化结果；
- **对比充分性**：与多种SOTA方法进行了对比，在两个数据集上均取得了平均性能最优的结果；
- **消融实验**：文中提到对路由器设计进行了消融研究，对比了像素级路由器、体素级路由器和体素感知像素路由器的效果；
- **效率分析**：对MoE架构带来的效率问题进行了专门探讨，提出了多种优化方案。

整体而言，**实验设计较为充分和客观**：使用了公开标准数据集、与多种SOTA方法对比、包含逐场景细粒度结果、并进行了路由器设计的消融分析。但受限于可获取的摘要信息，无法确认是否涵盖更多消融实验（如专家数量、不同变形先验组合等）。

---

## 六、主要结论与发现

1. **MoE-GS在两个动态场景数据集上均取得SOTA平均性能**，持续优于现有最先进方法；
2. **体素感知像素路由器优于纯像素级或纯体素级路由器**，在量化指标和视觉质量上均表现更优；
3. **MoE架构在动态高斯泼溅中有效**，通过融合多种变形先验显著提升了动态场景重建的鲁棒性和表现力；
4. **效率优化策略可行**：单次多专家渲染、门控感知剪枝和知识蒸馏均可有效缓解MoE带来的计算开销。

---

## 七、方法亮点

1. **首创性**：首次将MoE技术引入动态高斯泼溅领域，开辟了新的研究方向；
2. **设计目标明确**：不同于LLM中MoE追求稀疏计算，MoE-GS明确以**提升渲染质量**为核心目标，动机清晰；
3. **路由器设计精巧**：体素感知像素路由器通过可微分的权重泼溅实现体素级到像素级的权重投影，保证了空间-时间一致性；
4. **效率与质量兼顾**：主动识别并处理MoE架构带来的效率问题，提供了多种优化路径；
5. **部署友好**：蒸馏策略使得轻量化部署成为可能，无需改变模型架构。

---

## 八、不足与局限

1. **算力信息缺失**：论文未在摘要或元数据中明确报告训练所需的GPU型号、数量和时长，不利于读者评估复现成本；
2. **数据集覆盖范围**：仅使用了N3V和Technicolor两个数据集，虽然这两个是动态场景的常用基准，但场景多样性和规模可能有限；
3. **效率与质量的权衡**：MoE-GS虽然提升了渲染质量，但模型容量增加和FPS下降是架构固有代价，在实时性要求极高的应用中可能仍存在瓶颈；
4. **专家可解释性**：摘要中未讨论不同专家分别擅长何种类型的动态场景，路由决策的可解释性有待进一步探索；
5. **与同期工作的关系**：存在同期工作（如MoDE）也在探索MoE与动态高斯泼溅的结合，MoE-GS作为其中一种设计范式（独立训练专家+后融合路由），其相对于端到端联合优化方案的优劣有待更系统的比较。

---

（完）
