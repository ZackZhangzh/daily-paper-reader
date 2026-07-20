---
title: Factorized Gaussian Splatting for View-Inconsistent Degradations
title_zh: 分解式高斯泼溅用于视图不一致退化
authors: "Xiangyu Wen, Guangchi Fang, Changhao Chen, Chris Xiaoxuan Lu, Bing WANG"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=SdLqXlO2Ur"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 分解式高斯泼溅用于视图不一致退化
tldr: 该论文提出分解式高斯泼溅（F-GS），将场景显式分解为几何、介质和残差三部分，通过视图感知表面增益和介质建模处理视图不一致退化，提升多视图重建的鲁棒性。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 多视图重建中视图不一致退化导致几何扭曲。
method: 将场景分解为几何、介质和残差分别建模。
result: 稳定几何结构，处理光衰减。
conclusion: 统一框架有效处理退化场景。
---

## Abstract
Multi-view reconstruction often assumes cross-view appearance consistency, which is violated in the presence of participating medium and sensor artifacts. These view-inconsistent degradations induce distorted geometry and unreliable appearance in scene modeling. In this study, we propose Factorized Gaussian Splatting (F-GS), a unified scene modeling framework that explicitly decomposes the scene into three complementary components: Geometry, Medium, and Residual. The geometry component is stabilized by a lightweight view-aware surface gain and an optional screen-space normal-consistency prior to consolidate scene structure. The medium component is represented by sparse yet large Gaussians to model light attenuation through participating medium. The residual component captures view-dependent sensor noise via residual Gaussians, compensating for sensor-induced variations. This factorization prevents view-inconsistent degradations from contaminating geometry and appearance, enabling more accurate scene modeling. We instantiate and evaluate our F-GS in three representative regimes, thermal long-wave infrared, underwater, and foggy scene, where the view-inconsistencies naturally occur. Our F-GS significantly improves novel-view synthesis quality and geometric accuracy over other baselines.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

- **背景**：多视图重建方法（如 3D Gaussian Splatting）通常假设不同视角下的外观具有一致性，这是实现高质量场景建模的基础前提。
- **核心问题**：在实际场景中，这一假设经常被破坏。**参与介质**（如雾、水中的悬浮颗粒）会引起光线衰减，**传感器噪声与成像伪影**则带来额外的退化。这些**视图不一致的退化**（view-inconsistent degradations）会导致几何结构扭曲和外观建模不可靠。
- **研究动机**：现有 3DGS 框架在面对这类退化时缺乏有效的应对机制，退化信号会污染几何和外观的联合优化。本文旨在建立一个统一框架，将几何、退化介质和传感器噪声**显式分离**，防止相互干扰。

## 2. 方法论

- **核心思想**：提出**分解式高斯泼溅（Factorized Gaussian Splatting, F-GS）**，将场景显式分解为三个互补组件——几何组件、介质组件和残差组件，分别建模。
- **几何组件（Geometry）** ：采用**轻量级视图感知表面增益**（view-aware surface gain）来稳定几何估计，并可选地引入**屏幕空间法向一致性先验**（screen-space normal-consistency prior）来巩固场景结构。
- **介质组件（Medium）** ：用**稀疏但尺度较大的高斯函数**来建模参与介质引起的光衰减。稀疏性确保介质不会过度干扰几何结构，大尺度则能覆盖介质影响的全局范围。
- **残差组件（Residual）** ：用**残差高斯函数**（residual Gaussians）捕捉视图依赖的传感器噪声，补偿传感器引起的各种变化。
- **整体流程**：三个组件联合优化，但各自承担不同的物理角色。分解策略的核心价值在于——防止视图不一致的退化污染几何和外观的建模，从而实现更准确的场景重建。

## 3. 实验设计

- **测试场景**：在**三种具有天然视图不一致退化的代表性场景**上进行了实例化和评估：
  1. **热长波红外（thermal long-wave infrared）** 场景；
  2. **水下（underwater）** 场景；
  3. **雾天（foggy）** 场景。
- **Benchmark 与对比方法**：论文在新型视图合成质量和几何精度两个维度上进行了评估，并与多种基线方法进行了对比，F-GS 在两项指标上均取得了**显著提升**。具体的对比方法列表和数据集细节在摘要中未展开，需查阅全文获取。

## 4. 资源与算力

- 摘要和公开页面中**未提及**具体的 GPU 型号、数量或训练时长等信息。
- 论文全文可能包含相关细节，但当前可获取的材料中无法确认。

## 5. 实验数量与充分性

- **实验场景覆盖**：选取了热红外、水下、雾天三种差异显著的退化场景，覆盖了**参与介质**（水下、雾天）和**传感器特性**（热红外）两类主要退化来源，具有一定的代表性。
- **评估维度**：同时评估**新型视图合成质量**和**几何精度**，兼顾外观与几何两个核心指标。
- **局限性**：由于无法获取全文，消融实验的具体设置、各组件贡献的量化分析、以及更多场景（如其他传感器退化类型）的泛化性验证尚不明确。从摘要来看，实验设计在场景多样性上是合理的，但充分性需要全文数据支撑。

## 6. 主要结论

- F-GS 通过将场景分解为几何、介质和残差三个显式组件，**有效防止了视图不一致退化对几何和外观的污染**，实现了更准确的场景建模。
- 在热红外、水下、雾天三种典型退化场景中，F-GS 在**新型视图合成质量和几何精度上均显著优于现有基线方法**。
- 分解式建模策略是一个**统一且有效的框架**，能够应对多种类型的视图不一致退化。

## 7. 优点与亮点

- **问题定位精准**：识别出“视图不一致退化”这一 3DGS 在真实场景中的关键瓶颈，而非仅关注理想条件下的性能。
- **分解思路清晰且物理可解释**：将场景分解为几何、介质、残差三个具有明确物理意义的组件，而非使用黑箱方式处理退化。
- **组件设计针对性强**：
  - 几何组件引入**视图感知表面增益**和**法向一致性先验**，专门稳定几何结构；
  - 介质组件用**稀疏大高斯**建模光衰减，兼顾表达能力和几何保护；
  - 残差组件用残差高斯捕捉**视图依赖的传感器噪声**，与介质退化形成互补。
- **场景覆盖具有实际意义**：选择热红外、水下、雾天三种真实世界中频繁出现但常被忽视的退化场景，应用价值明确。

## 8. 不足与局限

- **实验细节不透明**：从摘要和公开页面无法获取对比方法的具体列表、数据集规模、定量数值等关键信息，限制了对外部读者对实验公平性和充分性的独立判断。
- **算力信息缺失**：未报告训练所需的 GPU 型号、数量或时长，不利于复现和资源评估。
- **泛化性有待验证**：虽然覆盖了三种场景，但视图不一致退化的类型远不止于此（如运动模糊、散焦模糊、雨雪等），F-GS 对更广泛退化类型的泛化能力尚不明确。
- **实际部署复杂度**：三组件分解增加了模型复杂性，在实时性要求较高的应用场景中可能存在效率瓶颈（全文未提及推理速度对比）。
- **依赖先验假设**：几何组件中的法向一致性先验为“可选”，其在不同场景下的有效性和调参敏感性需要进一步论证。

（完）
