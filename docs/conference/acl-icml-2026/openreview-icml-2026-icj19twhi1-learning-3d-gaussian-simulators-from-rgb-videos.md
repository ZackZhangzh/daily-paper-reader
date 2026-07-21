---
title: Learning 3D-Gaussian Simulators from RGB Videos
title_zh: 从RGB视频学习3D高斯模拟器
authors: "Mikel Zhobro, Andreas René Geist, Georg Martius"
date: 2026-04-30
pdf: "https://openreview.net/pdf/9b95acfedbf37fc1df0b28904c857dfe5fb89968.pdf"
tags: ["query:dgs-physics"]
score: 9.0
evidence: 3D高斯泼溅用于从视频学习物理模拟器
tldr: 视频生成模型难以保持空间一致性和物体恒常性，本文提出3DGSim，一种从多视角RGB视频直接学习物理交互的3D模拟器，采用MVSplat学习潜在粒子表示，Point Transformer预测动力学，高斯泼溅渲染新视图，通过联合训练逆渲染和动力学预测，嵌入了真实物理规律。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有视频生成模型缺乏空间一致性和物体恒常性，需从数据中学习物理交互的3D模拟器。
method: 结合MVSplat、Point Transformer和3D高斯泼溅，联合训练逆渲染和动力学预测。
result: 实现了从多视图视频学习物理动力学，并能生成新视图渲染。
conclusion: 3DGSim为数据驱动的3D物理模拟提供了一种基于高斯表示的有效途径。
---

## Abstract
Realistic simulation is critical for applications ranging from robotics to animation. Video generation models have emerged as a way to capture real-world physics from data, but they often face challenges in maintaining spatial consistency and object permanence, relying on memory mechanisms to compensate. As a complementary direction, we present 3DGSim, a learned 3D simulator that directly learns physical interactions from multi-view RGB videos. 3DGSim adopts MVSplat to learn a latent particle-based representation of 3D scenes, a Point Transformer for the particle dynamics, a Temporal Merging module for consistent temporal aggregation, and Gaussian Splatting to produce novel view renderings. By jointly training inverse rendering and dynamics forecasting, 3DGSim embeds physical properties into point-wise latent features. This enables the model to capture diverse behaviors, from rigid and elastic to cloth-like dynamics and boundary conditions (e.g., fixed cloth corners), while producing realistic lighting effects. We show that 3DGSim can generate physically plausible results even in out of distribution cases, e.g. ground removal or multi-object interactions, despite being trained only on single-body collisions.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

- **核心问题**：如何从多视角RGB视频中直接学习一个具备3D空间一致性的物理模拟器，而无需依赖深度信息、粒子轨迹或手工设计特征等特权信息。
- **研究背景**：现实世界的仿真对机器人、动画等领域至关重要。现有的视频生成模型虽能捕捉物理规律，但在空间一致性和物体恒常性方面存在困难。传统分析式模拟器需要精确的几何、姿态和材质参数，难以应对任意场景的仿真。而现有学习式模拟器往往依赖强归纳偏置或3D真值信息，限制了可扩展性和泛化能力。
- **本文定位**：作为视频生成模型的补充方向，提出3DGSim——一种直接从多视图RGB视频学习物理交互的端到端3D模拟器。

## 2. 方法论

- **核心思想**：将3D场景重建、粒子动力学预测和视频合成统一到一个端到端训练的框架中，通过联合训练逆渲染和动力学预测，将物理属性嵌入逐点潜在特征中。

- **技术流程（四阶段）** ：
    1. **3D场景表示**：采用 **MVSplat** 从多视图RGB图像中学习3D场景的潜在粒子表示。
    2. **动力学传播**：使用 **Point Transformer** 预测粒子随时间的动力学演化。
    3. **时序聚合**：通过 **Temporal Merging 模块** 实现一致的时序信息聚合，保证时间维度的连贯性。
    4. **新视图渲染**：利用 **3D Gaussian Splatting** 生成新视角的渲染结果。

- **关键设计**：
    - 不依赖显式的连通性约束，通过时序编码和合并层将物理属性嵌入点态潜在向量。
    - 模型采用 **TEM-PTV3 transformer**，无需手工设计的先验知识。
    - 完全可微分，将逆渲染、动力学预测和新视图视频合成整合为单一端到端可学习系统。

## 3. 实验设计

- **数据集**：论文引入了**三个具有挑战性的数据集**，分别对应不同的物理交互和形变特性：
    - **弹性（Elastic）** 数据集
    - **刚体（Rigid）** 数据集
    - **布料（Cloth）** 数据集——布料四角固定，挑战模型推断隐式约束并模拟布料类材料的动态变形

- **对比方法**：与 **Cosmos** 和 **CosmosFT**（在对应数据集上进行LoRA微调的Cosmos-Predict2 2B模型）进行对比。

- **评估指标**：PSNR（↑）、SSIM（↑）、LPIPS（↓）三个图像质量指标。

- **泛化测试**：在训练仅涉及单物体与地面碰撞的情况下，测试模型在**分布外场景**的表现，包括：
    - 场景编辑（利用3D表示直接编辑场景）
    - 多物体交互模拟
    - 阴影等场景属性的学习

## 4. 资源与算力

论文提供的材料中**未明确说明**具体的GPU型号、数量或训练时长等算力信息。不过，项目曾获得**EuroHPC grants（EHPC-DEV-2025D08-044）** 资助以扩展研究规模，表明其计算需求具有一定规模。

## 5. 实验数量与充分性

- **实验数量**：从公开信息来看，实验涵盖：
    - 三个数据集上的定量评估（每个数据集对比3种方法）
    - 多项定性泛化测试（场景编辑、多物体交互、阴影学习）
    - 训练仅在单物体碰撞场景下进行，但测试扩展到分布外的多物体场景

- **充分性与客观性评价**：
    - **优点**：对比了同期的视频生成模型（Cosmos系列），评估指标为标准图像质量指标，具有可复现性；泛化测试设计合理，能体现模型的3D空间一致性优势。
    - **局限**：由于无法获取完整论文，消融实验的具体设置（如各模块的独立贡献验证）未见详细说明；对比方法主要为视频生成模型，缺少与同类3D物理学习方法的横向对比信息。

## 6. 主要结论与发现

- 3DGSim能够从多视图RGB视频中有效学习物理动力学，并生成新视图渲染。
- 模型成功捕捉了从刚体、弹性体到布料类材料的多样化物理行为，以及边界条件（如布料固定角点）。
- 即使仅在单物体碰撞数据上训练，3DGSim也能在分布外场景（如移除地面、多物体交互）中生成物理合理的结果。
- 由于移除了显式的物理偏置，模型不仅学习了物理规律，还学会了推理更广泛的场景属性（如阴影）。
- 3DGSim的3D状态表示支持直接的场景编辑，可用于模块化构建、反事实推理和场景探索。

## 7. 优点与亮点

- **端到端可微分**：将逆渲染、动力学预测和视频生成统一为单一可学习系统。
- **无需特权信息**：不依赖深度图、粒子轨迹或手工特征，仅使用RGB视频。
- **3D空间一致性**：基于3D高斯粒子的表示天然保持了空间一致性和物体恒常性，克服了2D视频生成模型的固有缺陷。
- **强泛化能力**：在分布外多物体交互等场景中仍能保持物理合理性。
- **可编辑性**：3D粒子表示支持直接场景编辑，拓展了下游应用的可能性。
- **物理+光照联合学习**：无需显式物理偏置，模型自发学习了阴影等场景属性。

## 8. 不足与局限

- **实验覆盖的局限性**：
    - 仅对比了视频生成模型（Cosmos系列），缺少与同类3D物理学习/模拟方法的对比。
    - 三个数据集的规模和复杂度细节未在公开摘要中充分披露。

- **应用限制**：
    - 需要多视角RGB视频作为输入，在单目视频场景下的适用性未知。
    - 模型对复杂场景（如高度非刚性变形、流体动力学等）的表现尚不明确。
    - 训练仅涉及单物体与地面碰撞，虽然泛化到多物体场景，但对更复杂交互（如物体间碰撞、断裂等）的泛化能力有待验证。

- **信息缺失**：
    - 算力需求、训练时间等工程细节未公开。
    - 消融实验和模块贡献分析的具体结果在摘要层面不可见。
    - 模型推理速度、实时性等实际部署相关指标未提及。

（完）
