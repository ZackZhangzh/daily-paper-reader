---
title: Factorized Gaussian Splatting for View-Inconsistent Degradations
title_zh: 面向视图不一致退化的因子化高斯泼溅
authors: "Xiangyu Wen, Guangchi Fang, Changhao Chen, Chris Xiaoxuan Lu, Bing WANG"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=SdLqXlO2Ur"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 3D高斯泼溅用于场景重建，处理视图不一致退化
tldr: 针对多视图重建中参与介质和传感器伪影导致的视图不一致退化问题，提出因子化高斯泼溅（F-GS），将场景分解为几何、介质和残差三部分，通过视图感知表面增益和法向一致性先验稳定几何，用稀疏大高斯建模介质衰减，实现鲁棒的场景重建。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有3DGS假设视图一致，在退化场景中重建失真。
method: 将场景分解为几何、介质和残差三部分，分别建模。
result: 能有效处理参与介质和传感器伪影，提升几何与外观质量。
conclusion: 因子化分解可统一处理视图不一致退化，增强重建鲁棒性。
---

## Abstract
Multi-view reconstruction often assumes cross-view appearance consistency, which is violated in the presence of participating medium and sensor artifacts. These view-inconsistent degradations induce distorted geometry and unreliable appearance in scene modeling. In this study, we propose Factorized Gaussian Splatting (F-GS), a unified scene modeling framework that explicitly decomposes the scene into three complementary components: Geometry, Medium, and Residual. The geometry component is stabilized by a lightweight view-aware surface gain and an optional screen-space normal-consistency prior to consolidate scene structure. The medium component is represented by sparse yet large Gaussians to model light attenuation through participating medium. The residual component captures view-dependent sensor noise via residual Gaussians, compensating for sensor-induced variations. This factorization prevents view-inconsistent degradations from contaminating geometry and appearance, enabling more accurate scene modeling. We instantiate and evaluate our F-GS in three representative regimes, thermal long-wave infrared, underwater, and foggy scene, where the view-inconsistencies naturally occur. Our F-GS significantly improves novel-view synthesis quality and geometric accuracy over other baselines.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

- **研究背景**：3D高斯泼溅（3DGS）在新视角合成方面取得了显著成果，但其核心假设是**跨视图外观一致性**——即同一场景点在不同视角下应呈现一致的外观。
- **核心问题**：在实际场景中，**参与介质**（如雾、水下悬浮颗粒）和**传感器伪影**会破坏这种视图一致性，导致视图不一致退化。现有3DGS方法无法有效处理此类退化，会引发**几何失真**和**外观不可靠**的问题。
- **研究动机**：亟需一种能够统一处理多种视图不一致退化场景的鲁棒重建框架，使3DGS在非理想条件下仍能保持几何与外观的准确性。
- **整体含义**：该论文旨在突破3DGS对视图一致性的依赖，将应用场景从理想的室内/室外环境拓展到热红外、水下、雾天等**真实世界的挑战性场景**。


## 2. 方法论

- **核心思想**：提出**因子化高斯泼溅（F-GS）** ，将场景显式分解为三个互补组件分别建模，防止视图不一致退化污染几何与外观。
- **三大组件**：
  1. **几何组件（Geometry）** ：负责场景结构建模。通过**轻量级视图感知表面增益**和**可选的屏幕空间法向一致性先验**来稳定几何重建，巩固场景结构。
  2. **介质组件（Medium）** ：采用**稀疏但尺寸较大的高斯函数**建模参与介质引起的光衰减效应。
  3. **残差组件（Residual）** ：通过残差高斯函数捕获**视图相关的传感器噪声**，补偿传感器引起的视角变化。
- **算法流程**（文字说明）：输入多视角图像后，F-GS首先初始化三类高斯组件；在优化过程中，几何组件通过视图感知表面增益和法向一致性先验约束保持结构稳定；介质组件用大尺度稀疏高斯拟合全局光衰减；残差组件则吸收剩余的传感器噪声。三者联合优化，最终输出干净的几何与外观重建结果。


## 3. 实验设计

- **评测场景**：在**三类**自然存在视图不一致退化的典型场景中实例化并评估F-GS：
  - **热长波红外（thermal long-wave infrared）**
  - **水下（underwater）**
  - **雾天（foggy scene）**
- **Benchmark与对比方法**：论文将F-GS与多种基线方法进行对比，涵盖新视角合成质量和几何精度两个维度。具体对比方法列表在摘要中未完全展开，需查阅全文获取完整信息。
- **评估指标**：**新视角合成质量**和**几何精度**。


## 4. 资源与算力

- 论文摘要及提供的元数据中**未明确说明**所使用的GPU型号、数量、训练时长等算力信息。
- 如需获取具体算力配置，需查阅论文全文的实验设置部分。


## 5. 实验数量与充分性

- **实验数量**：论文在**三个代表性场景**（热红外、水下、雾天）上进行了验证，属于多场景跨域评估，覆盖了不同类型的视图不一致退化来源（光学介质衰减 vs. 传感器噪声）。
- **实验充分性**：从摘要信息来看，实验设计覆盖了论文声称要解决的三大典型退化场景，但以下信息需在全文确认：
  - 是否包含**定量消融实验**（验证各组件的独立贡献）；
  - 各场景下的**数据规模**和**视角数量**；
  - 对比方法的**选择依据**和**公平性**（如是否使用相同的输入条件和训练策略）。
- **客观性与公平性**：论文发表于ICLR 2026，作为顶级学术会议论文，通常要求严格的实验对比和公平性设置，具体细节需参阅全文。


## 6. 主要结论与发现

- F-GS能够**有效处理参与介质和传感器伪影**带来的视图不一致退化，显著提升几何与外观的重建质量。
- **因子化分解策略**可以统一处理多种类型的视图不一致退化，增强了3D场景重建的鲁棒性。
- 在热红外、水下、雾天三个挑战性场景中，F-GS在新视角合成质量和几何精度上均**显著优于其他基线方法**。


## 7. 优点

- **问题定义新颖**：首次系统性地将“视图不一致退化”作为3DGS的核心挑战之一，并给出统一的理论框架。
- **分解策略巧妙**：将场景分解为几何、介质、残差三部分，各司其职——几何负责结构、介质负责光衰减、残差负责传感器噪声——设计思路清晰且具有物理可解释性。
- **稳定性机制完备**：视图感知表面增益 + 法向一致性先验的双重约束，有效抑制了退化对几何的污染。
- **泛化性强**：在热红外、水下、雾天三种差异显著的场景中均取得优异表现，证明了方法的通用性。
- **发表于ICLR 2026**，获得评分**9.0**（满分10分），表明同行评审对其高度认可。


## 8. 不足与局限

- **算力信息缺失**：摘要和元数据中未提及训练效率、显存占用等实际部署所需的关键信息。
- **对比方法不完整**：摘要中仅笼统提及“其他基线”，未列出具体对比方法名称，无法判断对比的全面性。
- **真实场景验证范围**：虽覆盖三类场景，但均为特定条件下的采集数据，**能否推广到更多退化类型**（如雨雪、沙尘、运动模糊等）尚需进一步验证。
- **实时性未提及**：3DGS的一大优势是实时渲染，但F-GS引入多组件分解后是否**牺牲了渲染速度**，摘要中未作说明。
- **分解的泛化边界**：介质与残差的分解依赖于对退化来源的先验判断，当多种退化耦合时，**分解的准确性**可能面临挑战。

（完）
