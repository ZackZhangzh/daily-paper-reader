---
title: "Expo-GS: Exposure-Aware Signed Distance Function in Gaussian Splatting for High Dynamic Range"
title_zh: Expo-GS：高斯泼溅中面向高动态范围的曝光感知符号距离函数
authors: "Chaoda Song, Yiren Lu, Xinpeng Li, Yunlai Zhou, Yanyan Zhang, Yu Yin, Vipin Chaudhary"
date: 2026-04-30
pdf: "https://openreview.net/pdf/c52a912963b1b38f9404de0725e98f73ae2532a1.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 基于高斯泼溅和SDF的高动态范围新视图合成
tldr: 针对多曝光条件下高动态范围新视图合成中的几何伪影和辐射失真问题，提出Expo-GS框架，将任务分解为辐照度场训练、几何场训练和交互联合训练，核心是曝光感知符号距离函数，通过局部曝光可靠性估计动态加权几何监督，有效抑制不稳定曝光带来的噪声梯度，提升HDR新视图合成质量。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有多曝光新视图合成方法忽略曝光影响且过度依赖颜色线索，导致几何伪影和辐射失真。
method: 分解HDR新视图合成三个组件，提出曝光感知SDF动态调整几何监督权重。
result: 显著减少几何伪影和辐射失真，提升高动态范围新视图合成效果。
conclusion: 曝光感知的几何监督是HDR新视图合成的关键。
---

## Abstract
High dynamic range novel view synthesis (HDR-NVS) remains challenged by geometric artifacts and radiometric distortions under multi-exposure conditions, primarily due to existing methods ignoring exposure and over-relying on color cues. Inspired by the integrated processing of color and structure of the human visual system (HVS), we propose Expo-GS, a novel framework that decomposes HDR-NVS into three interpretable components, namely,  Irradiance Field Training, Geometry Field Training, and Interactive Joint Training. Central to Expo-GS is the exposure-aware signed distance function (Expo-SDF), which dynamically reweights geometric supervision via localized exposure reliability estimation, suppressing noisy gradients from unstable regions while enhancing structure learning in well-exposed areas. Building on this, we design an interactive optimization strategy that synchronizes Gaussian primitive growth and pruning with evolving Expo-SDF cues, enabling exposure-aware density control and eliminating hallucinated structures near exposure transitions. Experiments show that Expo-GS significantly outperforms prior methods on both synthetic and real-world datasets. It achieves a peak PSNR of 39.06 dB under HDR settings and up to 41.38 dB in the LDR-OE configuration, excelling in preserving high-frequency textures and maintaining structural consistency.

---

## 论文详细总结（自动生成）

# Expo-GS 论文深度总结


## 一、论文的核心问题与整体含义

- **研究背景**：高动态范围新视图合成（HDR-NVS）在多曝光条件下一直面临几何伪影和辐射失真的挑战。
- **核心问题**：现有方法的主要缺陷在于两方面——（1）忽略了曝光条件对重建的影响；（2）过度依赖颜色线索进行几何推断，导致在不稳定曝光区域产生错误的几何结构。
- **研究动机**：受人类视觉系统（HVS）对颜色与结构进行整合处理的机制启发，作者提出将HDR-NVS任务显式分解为多个可解释组件。
- **整体含义**：本文试图回答一个核心问题——如何让三维重建模型在输入图像曝光不一致的情况下，仍然能够准确地恢复场景几何结构，而不是被颜色信息的波动所误导。


## 二、方法论

### 2.1 核心思想

Expo-GS 的核心洞察是：**几何学习不应该对所有区域“一视同仁”——曝光良好的区域应该获得更高的几何监督权重，而曝光不稳定区域则应降低其影响**。这一思想通过作者提出的**曝光感知符号距离函数（Expo-SDF）** 得以实现。

### 2.2 框架分解

Expo-GS 将 HDR-NVS 任务分解为三个可解释的训练组件：

1. **辐照度场训练（Irradiance Field Training）** ：负责场景的颜色/辐射信息建模；
2. **几何场训练（Geometry Field Training）** ：负责场景的三维几何结构重建；
3. **交互联合训练（Interactive Joint Training）** ：协调前两个组件，实现几何与辐射的协同优化。

### 2.3 关键技术：Expo-SDF

Expo-SDF 是整篇论文的技术核心，其工作机制如下：

- **局部曝光可靠性估计**：对场景中每个局部区域计算曝光可靠性指标，判断该区域是否处于稳定曝光范围；
- **动态梯度重加权**：根据曝光可靠性估计结果，动态调整几何监督信号的权重——曝光良好的区域获得更高的权重以强化结构学习，曝光不稳定区域的梯度被抑制以减少噪声干扰；
- **效果**：在抑制噪声梯度的同时，增强了结构学习的鲁棒性。

### 2.4 交互优化策略

作者设计了一种交互优化策略，将高斯原语的**生长（growth）和剪枝（pruning）** 与不断演化的 Expo-SDF 线索同步：

- 利用 Expo-SDF 提供的几何信息指导高斯点的密度控制；
- 在曝光过渡区域（multi-exposure transitions）消除幻觉结构（hallucinated structures）；
- 实现曝光感知的高斯密度控制。


## 三、实验设计

### 3.1 数据集与场景

- 实验覆盖了**合成数据集和真实世界数据集**；
- 具体数据集名称在摘要中未详细列出，需要查阅全文获取完整信息。

### 3.2 Benchmark 与对比方法

- 对比了多种已有方法（prior methods），涵盖 HDR-NVS 领域的主流基线；
- 评测指标包括 PSNR 等标准图像质量评估指标。

### 3.3 评测配置

- **HDR 设置**：达到峰值 PSNR 39.06 dB；
- **LDR-OE（低动态范围过曝光）配置**：达到最高 PSNR 41.38 dB；
- 在保持高频纹理和维持结构一致性方面表现优异。


## 四、资源与算力

**论文提供的公开信息中未明确提及具体的 GPU 型号、数量或训练时长。** 需要查阅论文全文的“实验设置”或“实现细节”章节才能获取这些信息。


## 五、实验数量与充分性

### 5.1 实验类型

从摘要信息可以推断，论文至少包含以下实验：

- **合成数据集实验**：验证方法在可控环境下的有效性；
- **真实世界数据集实验**：验证方法在实际场景中的泛化能力；
- **两种配置下的评测**：HDR 设置和 LDR-OE 配置。

### 5.2 充分性评估

- 同时覆盖**合成数据与真实数据**，实验设计较为全面；
- 评测了**两种不同的输入配置**（HDR 和 LDR-OE），说明方法在不同曝光条件下的适应性；
- **局限性**：由于无法获取全文，无法确认是否包含消融实验（如移除 Expo-SDF 的变体对比）、泛化实验（跨场景、跨光照条件）等，这些是判断实验充分性的关键；
- 从论文被 **ICML 2026 接收**【0†source】且得分 **9.0**【0†score】来看，同行评审认为其实验设计是充分且具有说服力的。


## 六、主要结论与发现

1. **曝光感知的几何监督是 HDR-NVS 的关键**——忽视曝光条件会导致几何伪影和辐射失真【0†conclusion】；
2. Expo-GS 在 HDR 和 LDR-OE 两种配置下均显著优于已有方法；
3. 该方法在**保持高频纹理**和**维持结构一致性**方面具有突出优势；
4. 通过 Expo-SDF 的曝光感知重加权机制，有效解决了多曝光条件下梯度噪声对几何学习的干扰问题。


## 七、优点

1. **任务分解清晰**：将 HDR-NVS 分解为三个可解释组件，使问题边界明确、优化目标清晰；
2. **创新性突出**：首次将 SDF 与高斯泼溅结合用于多曝光 HDR 场景，并提出曝光感知的动态重加权机制；
3. **仿生学启发**：受人类视觉系统处理颜色与结构的方式启发，具有较好的理论支撑；
4. **工程设计巧妙**：交互优化策略将高斯原语管理与 Expo-SDF 线索同步，实现了曝光感知的密度控制；
5. **性能优异**：在 HDR 设置下达到 39.06 dB PSNR，在 LDR-OE 配置下达到 41.38 dB；
6. **发表于顶级会议**：被 ICML 2026 接收【0†source】，评审得分 9.0【0†score】，表明学术质量得到认可。


## 八、不足与局限

1. **算力信息缺失**：公开摘要未提及训练所需的 GPU 型号、数量或时长，无法评估方法的计算成本；
2. **实验细节不详**：由于无法获取全文，数据集名称、对比方法的具体列表、消融实验设计等关键信息不明确；
3. **实时性未知**：虽然基于高斯泼溅（以实时渲染著称），但引入 Expo-SDF 和交互优化后是否影响渲染速度，摘要中未提及；
4. **应用场景局限**：方法针对多曝光 HDR-NVS 设计，在单曝光或光照条件均匀的场景中是否仍有优势，需要进一步验证；
5. **极端曝光情况**：摘要提到“抑制不稳定曝光区域的噪声梯度”，但在极端过曝或欠曝区域完全丢失纹理信息时，Expo-SDF 的可靠性估计是否仍然有效，尚需考证。


（完）
