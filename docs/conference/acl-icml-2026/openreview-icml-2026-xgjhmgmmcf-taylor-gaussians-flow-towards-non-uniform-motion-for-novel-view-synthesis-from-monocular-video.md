---
title: "Taylor-Gaussians-Flow: Towards Non-uniform Motion for Novel View Synthesis from Monocular Video"
title_zh: 泰勒高斯流：面向单目视频新视图合成的非均匀运动建模
authors: "Zaoming Yan, Qizhou Chen, Yaomin Huang, Pengcheng Lei, Chenhao Shi, Yi Xu, Haichuan Song, Faming Fang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/f0151523c25d83fc5e336490950ebf4b5884edf5.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 基于泰勒运动建模和高斯表示的单目视频新视图合成
tldr: 针对单目视频新视图合成中长期非均匀运动难以建模的问题，提出Taylor-Gaussians-Flow方法，受泰勒定理启发，通过一阶和二阶运动分量表示并监督非均匀运动，包含泰勒高斯和泰勒高斯流两个模块，有效捕捉加速度等高阶运动信息，提升长时非均匀场景的新视图合成质量。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有变形场或场景流仅限一阶近似，无法处理长时非均匀运动（如加速度）。
method: 提出泰勒高斯和泰勒高斯流模块，表示并监督一阶和二阶运动分量。
result: 有效建模非均匀运动，提升单目视频新视图合成质量。
conclusion: 高阶运动建模对长时非均匀场景新视图合成至关重要。
---

## Abstract
Long-term non-uniform motion poses a significant challenge for Novel View Synthesis (\textbf{NVS}), as it requires modeling higher-order motion, such as acceleration.
Existing methods primarily rely on deformation fields or scene flow, which are limited to first-order approximations. 
Due to neglecting higher-order motion representations and supervision, these approaches suffer from long-term non-uniform motion scenarios.
Inspired by Taylor’s theorem, we propose Taylor-Gaussians-Flow (\textbf{TGsF}) to represent and supervise non-uniform motion through first-order and second-order motion components.  
TGsF comprises two key modules: Taylor-Gaussians (\textbf{TGs}) and Taylor-Gaussians-Flow (\textbf{TGs-Flow}).
TGs represent motion using Gaussian means with a quadratic temporal term and time-dependent opacity.
Unlike previous methods, TGs-Flow decouples scene-flow supervision into separate depth and 2D optical-flow constraints.
This approach effectively mitigates error propagation from either depth or motion estimation while circumventing the scarcity of labeled scene flow data.
Guided by the above analysis, we develop the Feed-Forward Taylor-Gaussians-Flow framework, which sets a new state-of-the-art on four dynamic benchmarks.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **核心问题**：单目视频新视图合成（Novel View Synthesis, NVS）中，**长时非均匀运动**（如加速度等高阶运动）的建模是一个重大挑战。
- **现有方法的局限**：现有方法主要依赖**变形场（deformation field）或场景流（scene flow）**，但这些方法仅限于**一阶近似**，忽略了高阶运动的表示与监督，因此在长时非均匀运动场景中表现不佳。
- **论文核心思想**：受**泰勒定理**启发，作者提出 **Taylor-Gaussians-Flow（TGsF）** 方法，通过**一阶和二阶运动分量**来**表示和监督**非均匀运动。

## 2. 方法论：核心思想、关键技术细节

- **整体框架**：论文构建了 **前馈式泰勒高斯流（Feed-Forward Taylor-Gaussians-Flow, FF-TGsF）** 框架。
- **两大核心模块**：
  - **泰勒高斯（Taylor-Gaussians, TGs）**：利用**带二次时间项的高斯均值**和**时间相关的透明度（opacity）** 来表示运动。这使得高斯属性的时间演化包含加速度信息，突破一阶线性近似的限制。
  - **泰勒高斯流（Taylor-Gaussians-Flow, TGs-Flow）**：将场景流监督**解耦**为**独立的深度约束**和**2D光流约束**。
- **关键技术优势**：这种解耦设计有效**缓解了深度估计或运动估计中的误差传播**，同时**规避了标注场景流数据稀缺**的问题。

## 3. 实验设计：数据集、Benchmark与对比方法

- **Benchmark**：论文在**四个动态场景基准（dynamic benchmarks）** 上进行了评估，并宣称达到了**新的最先进水平（state-of-the-art）**。
- **数据集与场景**：元数据中**未具体列出**所使用的四个基准的名称及具体场景类型。
- **对比方法**：元数据中**未具体列出**所对比的基线方法名称。但从动机描述推断，对比对象应包括基于变形场和场景流的现有动态NVS方法。

## 4. 资源与算力

- **未明确说明**：所提取的论文元数据及摘要中**未提及**所使用的GPU型号、数量、训练时长等算力信息。

## 5. 实验数量与充分性

- **实验数量**：元数据仅提及在**四个动态基准**上进行了评估，但**未说明**具体开展了多少组实验（如消融实验、不同数据集上的细分实验等）。
- **充分性评估**：由于缺乏详细的实验设置和结果数据，**无法对实验的充分性做出准确判断**。不过，在被ICML 2026接收（得分8.0）且宣称达到SOTA的前提下，可以合理推测其实验设计应包含必要的消融研究和定量对比。

## 6. 主要结论与发现

- **核心结论**：**高阶运动建模**（如加速度）对于**长时非均匀场景的新视图合成至关重要**。
- **方法有效性**：通过引入一阶和二阶运动分量的表示与监督，TGsF有效建模了非均匀运动，显著提升了单目视频新视图合成的质量。

## 7. 方法优点与亮点

- **理论创新**：首次将**泰勒定理**的思想引入动态高斯运动的显式建模，用二次时间项刻画加速度，突破了现有方法仅依赖一阶近似的局限。
- **监督解耦**：TGs-Flow模块将场景流监督**解耦为深度和光流两个独立约束**，既缓解了误差传播，又规避了场景流标注数据稀缺的问题。
- **前馈式设计**：构建了前馈式框架（FF-TGsF），有利于提升推理效率。

## 8. 不足与局限

- **实验细节缺失**：公开的元数据中**未提供**具体数据集名称、对比方法清单、量化结果表格等关键实验信息，限制了对其性能的独立验证。
- **算力信息缺失**：**未说明**训练所需的计算资源，不利于可复现性评估。
- **应用场景局限**：方法针对**单目视频**设计，对于多视角输入或多相机系统的适用性**未在摘要中讨论**。
- **泛化性验证不足**：仅在四个基准上评估，**未说明**这些基准是否覆盖了足够多样的运动类型和场景复杂度。

（完）
