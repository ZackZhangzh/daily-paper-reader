---
title: Improving Explicit Dynamic Gaussian Splatting Optimization via Update Mixture
title_zh: 通过更新混合改进显式动态高斯泼溅优化
authors: "Renjie Ding, Yaonan Wang, Min Liu, Jialin Zhu, Jiazheng Wang, Jiahao Zhao, Xiao Tan, Feixiang He, Xiang Chen"
date: 2026-04-30
pdf: "https://openreview.net/pdf/6fb1e828606ca9798418172a7ddadf978c048e5b.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 动态3DGS优化用于实时场景渲染
tldr: 动态3D高斯泼溅在场景大运动时泛化性能下降。本文提出更新混合策略，包含时空相关的严格稀疏更新和额外正则化，稳定自适应优化。在多个动态GS管道上验证，有效缓解运动剧烈时的质量退化，保持实时高保真渲染能力。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 动态3DGS在大运动场景中泛化退化，影响渲染质量。
method: 提出更新混合策略，包含时空稀疏更新和正则化，增强优化稳定性。
result: 在动态场景中显著提升渲染质量和泛化能力，保持实时性。
conclusion: 更新混合策略有效改善了动态3DGS在大运动下的表现。
---

## Abstract
3D Gaussian Splatting (3DGS) enables real-time, high-fidelity view synthesis via explicit scene representations and has recently been extended to dynamic scene modeling. Despite their excellent rendering quality and interpretability, we find that explicit Dynamic GS often exhibits generalization degradation in scenes with large motion. Motivated by generalization behavior in deep neural optimization and the characteristics of Gaussian primitive optimization, we propose an update mixture strategy. This work focuses on two representative open-source explicit Dynamic GS pipelines and our approach consists of three components: (i) a space–time dependent Strictly Sparse Update with additional regularization to stabilize adaptive updates; (ii) a constant-corrected adaptive algorithm that alleviates over-scaling of primitive gradients and yields a stable mixture of adaptive and non-adaptive steps; and (iii) attributes mixing via Stochastic Attribute Averaging to mitigate frame-preference under motion disturbances. Experiments show consistent improvements and reduced generalization issues, highlighting the role of non-adaptive updates and the impact of frame-preference in explicit Dynamic GS optimization.

---

## 论文详细总结（自动生成）

## 一、核心问题与整体含义

3D高斯泼溅（3DGS）凭借其显式场景表示能力，实现了实时、高保真的视图合成，并已拓展至动态场景建模。然而，论文发现显式动态高斯泼溅（Dynamic GS）在**大运动场景**中普遍存在**泛化性能退化**问题，导致渲染质量下降。受深度神经优化中的泛化行为研究以及高斯基元优化特性的启发，论文提出了一种**更新混合策略**（update mixture strategy），旨在稳定自适应优化过程，缓解大运动下的质量退化，同时保持实时高保真渲染能力。


## 二、方法论

### 核心思想

论文的核心思想是：**在显式动态GS优化中引入非自适应更新成分，与自适应更新形成稳定混合**，从而缓解纯自适应优化在大运动场景中的不稳定性问题。

### 关键技术细节

论文的方法由三个核心组件构成：

1. **时空相关的严格稀疏更新（Space–time Dependent Strictly Sparse Update）**
   - 在更新过程中引入时空依赖性，仅对特定时空范围内的基元执行更新
   - 配合额外的正则化项，以稳定自适应更新过程

2. **常数修正的自适应算法（Constant-corrected Adaptive Algorithm）**
   - 缓解基元梯度的过度缩放问题（over-scaling of primitive gradients）
   - 产生自适应步长与非自适应步长的稳定混合

3. **随机属性平均（Stochastic Attribute Averaging）**
   - 通过属性混合的方式，缓解运动扰动下的帧偏好（frame-preference）问题

> **说明**：论文方法应用于**两个具有代表性的开源显式动态GS管线**，但提供的摘要中未包含具体的算法流程或公式细节。


## 三、实验设计

### 数据集与场景
论文摘要及ICML页面均未明确列出所使用的具体数据集名称。

### Benchmark与对比方法
论文未在摘要中明确说明对比了哪些基线方法。但根据研究主题推断，对比对象应为现有显式动态GS方法。

> **说明**：提供的论文内容为摘要层面，缺乏完整的实验设置描述。


## 四、资源与算力

**论文未明确说明**所使用的GPU型号、数量或训练时长等算力信息。


## 五、实验数量与充分性

### 实验数量
论文摘要仅笼统提到“Experiments show consistent improvements”（实验显示出一致的改进），未给出具体的实验组数。

### 充分性与客观性评估
- 论文聚焦于**两个代表性的开源显式动态GS管线**，覆盖面相对有限
- 缺乏具体的定量结果（如PSNR、SSIM、LPIPS等指标）和消融实验细节
- 基于现有摘要信息，**难以全面评估实验的充分性与公平性**


## 六、主要结论与发现

1. **更新混合策略有效改善了显式动态GS在大运动场景下的表现**，缓解了泛化退化问题
2. **非自适应更新在动态GS优化中具有重要作用**
3. **帧偏好（frame-preference）对显式动态GS优化存在显著影响**
4. 方法在保持实时性的同时，显著提升了渲染质量和泛化能力


## 七、优点

1. **问题定位准确**：识别出显式动态GS在大运动场景中的泛化退化这一关键瓶颈
2. **方法设计系统**：从稀疏更新、自适应算法修正、属性混合三个维度协同解决问题
3. **实用性导向**：强调保持实时高保真渲染能力，具有实际应用价值
4. **理论动机清晰**：方法设计受深度神经优化泛化行为研究的启发，有理论支撑


## 八、不足与局限

1. **信息不完整**：提供的摘要材料中缺乏详细的算法流程、公式推导和定量实验结果
2. **实验覆盖有限**：仅针对两个开源管线进行验证，泛化到更广泛动态GS框架的能力尚待证实
3. **数据集信息缺失**：未明确说明实验所用数据集，难以评估结果的普遍性
4. **对比基线不明确**：未详细列出对比方法，难以判断相对优势的幅度
5. **算力信息缺失**：未报告训练资源消耗，不利于实际部署评估
6. **应用限制未讨论**：大运动的定义范围、方法在极端场景下的鲁棒性边界等未在摘要中说明


**（完）**
