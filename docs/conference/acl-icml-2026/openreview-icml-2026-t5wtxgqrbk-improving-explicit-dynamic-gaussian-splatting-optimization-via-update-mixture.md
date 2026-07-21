---
title: Improving Explicit Dynamic Gaussian Splatting Optimization via Update Mixture
title_zh: 通过更新混合改进显式动态高斯泼溅优化
authors: "Renjie Ding, Yaonan Wang, Min Liu, Jialin Zhu, Jiazheng Wang, Jiahao Zhao, Xiao Tan, Feixiang He, Xiang Chen"
date: 2026-04-30
pdf: "https://openreview.net/pdf/6fb1e828606ca9798418172a7ddadf978c048e5b.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 动态3D高斯泼溅优化用于视图合成
tldr: 动态3D高斯泼溅在运动大的场景中泛化性能下降。本文提出更新混合策略，包含时空相关稀疏更新和正则化，稳定自适应更新，并改进优化。该策略作用于两个开源动态GS管线，显著提升了大运动场景下的重建质量和泛化能力，保持实时渲染优势。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 动态3DGS在大运动场景中泛化退化，优化不稳定。
method: 提出更新混合策略，包含稀疏更新和正则化。
result: 提升了动态场景重建质量和泛化能力。
conclusion: 更新混合策略为动态3DGS优化提供了有效改进。
---

## Abstract
3D Gaussian Splatting (3DGS) enables real-time, high-fidelity view synthesis via explicit scene representations and has recently been extended to dynamic scene modeling. Despite their excellent rendering quality and interpretability, we find that explicit Dynamic GS often exhibits generalization degradation in scenes with large motion. Motivated by generalization behavior in deep neural optimization and the characteristics of Gaussian primitive optimization, we propose an update mixture strategy. This work focuses on two representative open-source explicit Dynamic GS pipelines and our approach consists of three components: (i) a space–time dependent Strictly Sparse Update with additional regularization to stabilize adaptive updates; (ii) a constant-corrected adaptive algorithm that alleviates over-scaling of primitive gradients and yields a stable mixture of adaptive and non-adaptive steps; and (iii) attributes mixing via Stochastic Attribute Averaging to mitigate frame-preference under motion disturbances. Experiments show consistent improvements and reduced generalization issues, highlighting the role of non-adaptive updates and the impact of frame-preference in explicit Dynamic GS optimization.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

- **研究背景**：3D高斯泼溅（3DGS）作为一种显式场景表示方法，能够实现实时、高保真的视图合成，并已被拓展至动态场景建模。
- **核心问题**：研究发现，显式动态高斯泼溅（Dynamic GS）在大运动场景中**泛化性能显著退化**，优化过程不稳定。
- **整体含义**：受深度神经网络优化中的泛化行为以及高斯图元优化特性的启发，论文提出了一种**更新混合策略**（update mixture strategy），旨在稳定动态GS的自适应更新过程，提升大运动场景下的重建质量与泛化能力。

## 2. 方法论：核心思想与关键技术

论文的方法包含三个核心组件，作用于两个代表性的开源显式动态GS管线：

- **（i）时空相关的严格稀疏更新与正则化**（Strictly Sparse Update）：引入依赖空间与时间的稀疏更新机制，并辅以额外的正则化项，以**稳定自适应更新**过程，避免过度调整。

- **（ii）常数修正的自适应算法**（constant-corrected adaptive algorithm）：缓解图元梯度的**过度缩放**问题，形成自适应步长与非自适应步长的稳定混合，从而平衡优化过程中的更新幅度。

- **（iii）随机属性平均**（Stochastic Attribute Averaging）：对图元属性进行混合，**缓解运动扰动下的帧偏好**问题，减少模型对特定时间帧的过拟合倾向。

整体而言，该方法通过**非自适应更新**的引入和**帧偏好**的抑制，显著改善了大运动场景下的优化稳定性与泛化表现。

## 3. 实验设计

- **数据集与场景**：论文未在提供的摘要中明确列出具体数据集名称。根据搜索材料推测，实验可能涉及动态场景重建的常用基准数据集（如N3V、Technicolor等），具体需查阅全文确认。
- **Benchmark与对比方法**：论文聚焦于**两个代表性的开源显式动态GS管线**作为基础框架，在其上应用所提更新混合策略并进行对比评估。
- **评估指标**：主要关注**重建质量提升**与**泛化问题缓解**，同时保持了动态GS的**实时渲染优势**。

## 4. 资源与算力

**论文提供的摘要及元数据中未明确说明**所使用的GPU型号、数量及训练时长等算力信息。需查阅论文全文的“实验设置”部分获取详细资源描述。

## 5. 实验数量与充分性

- **实验规模**：论文提到“Experiments show consistent improvements”（实验显示出一致的改进），表明进行了**多组实验**以验证方法的有效性。
- **充分性与公平性**：
  - 方法作用于**两个不同的开源管线**，说明实验覆盖了多种基础框架，增强了结论的**泛化性**。
  - 作为**ICML 2026接收论文**（得分9.0）【元数据】，表明通过了同行评审，实验设计在学术层面被认为是充分且客观的【元数据】。
  - 但具体实验组数（如不同数据集上的测试、消融实验等）在摘要中未详述，需查阅全文确认。

## 6. 论文的主要结论与发现

- **更新混合策略有效提升了动态GS的性能**：在大运动场景下，所提方法带来了**一致的性能提升**，并**减少了泛化问题**。
- **非自适应更新的作用被凸显**：研究发现非自适应更新在显式动态GS优化中扮演了重要角色。
- **帧偏好问题的影响被揭示**：运动扰动下的帧偏好对优化效果有显著影响，而所提方法有效缓解了该问题。

## 7. 方法优点

- **针对性强**：直指显式动态GS在大运动场景下的**泛化退化**这一核心痛点。
- **即插即用**：方法可作用于**多个开源动态GS管线**，具有良好的通用性和可迁移性。
- **保持实时性**：在提升质量的同时，**保留了3DGS的实时渲染优势**【元数据】。
- **理论动机清晰**：从深度神经网络优化中的泛化行为与高斯图元优化特性出发，具有扎实的理论依据。

## 8. 不足与局限

- **数据集信息缺失**：提供的摘要中未明确列出具体使用的数据集，读者难以直接评估实验的覆盖范围。
- **算力资源未披露**：未说明训练所需的GPU型号、数量及时间，限制了方法在资源受限场景下的可复现性参考。
- **对比基线范围有限**：仅聚焦于两个开源显式动态GS管线，未提及与更多SOTA动态GS方法（如MoE-GS、USplat4D等）的全面对比。
- **应用限制**：方法主要针对大运动场景，对于静态或小运动场景的提升效果尚不明确。

（完）
