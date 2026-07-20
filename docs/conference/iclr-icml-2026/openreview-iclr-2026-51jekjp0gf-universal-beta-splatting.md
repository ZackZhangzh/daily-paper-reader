---
title: Universal Beta Splatting
title_zh: 通用Beta泼溅：泛化3D高斯泼溅的各向异性核渲染框架
authors: "Rong Liu, Zhongpai Gao, Benjamin Planche, Meida Chen, Van Nguyen Nguyen, Meng Zheng, Anwesa Choudhuri, Terrence Chen, Yue Wang, Andrew Feng, Ziyan Wu"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=51JEkjP0gF"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 将3D高斯泼溅泛化为Beta核用于辐射场渲染
tldr: 传统3D高斯泼溅使用固定高斯基元，对复杂光效和动态建模能力有限。本文提出通用Beta泼溅，将基元泛化为N维各向异性Beta核，可统一建模空间、角度和时间依赖性，捕捉复杂光传输和视图相关外观，且兼容原有高斯泼溅流程，提供可解释的场景属性分解。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 突破固定高斯基元限制，增强对复杂光效和动态场景的建模能力。
method: 采用N维各向异性Beta核替代高斯基元，实现维度依赖可控的显式辐射场渲染。
result: 兼容高斯泼溅，性能下限有保障，且能自然分解场景属性。
conclusion: Beta核泛化提升了泼溅表示的灵活性和可解释性，适用多种场景。
---

## Abstract
We introduce Universal Beta Splatting (UBS), a unified framework that generalizes 3D Gaussian Splatting to N-dimensional anisotropic Beta kernels for explicit radiance field rendering. Unlike fixed Gaussian primitives, Beta kernels enable controllable dependency modeling across spatial, angular, and temporal dimensions within a single representation. Our unified approach captures complex light transport effects, handles anisotropic view-dependent appearance, and models scene dynamics without requiring auxiliary networks or specific color encodings. UBS maintains backward compatibility by approximating to Gaussian Splatting as a special case, guaranteeing plug-in usability and lower performance bounds. The learned Beta parameters naturally decompose scene properties into interpretable without explicit supervision: spatial (surface vs. texture), angular (diffuse vs. specular), and temporal (static vs. dynamic). Our CUDA-accelerated implementation achieves real-time rendering while consistently outperforming existing methods across static, view-dependent, and dynamic benchmarks, establishing Beta kernels as a scalable universal primitive for radiance field rendering.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：3D高斯泼溅（3DGS）虽实现了实时渲染，但其固定高斯基元存在根本性局限——固定的钟形轮廓难以刻画锐利边界，视图依赖效果需借助球谐函数辅助编码，动态场景扩展则进一步依赖变形网络，导致表示碎片化。现有工作如可变形Beta泼溅（DBS）虽提升了几何 fidelity，但仍局限于三维空间，仍需单独的球面Beta函数处理视图依赖颜色。而6DGS、7DGS等高维高斯扩展虽引入视角和时间维度，却受限于高斯核在各维度上的对称轮廓，无法独立控制空间锐度、角度 specularity 和时间动态。

**核心问题**：如何设计一种统一的显式辐射场渲染基元，能够在一个表示中同时建模空间、角度和时间维度的依赖关系，且无需辅助网络或特定颜色编码。

**整体含义**：本文提出通用Beta泼溅（UBS），将3DGS泛化为N维各向异性Beta核，使每个维度可独立学习最优形状，从而统一处理静态场景、视图依赖外观和动态场景。该方法不仅兼容原有GS流程（保证性能下限），还能将场景属性自然分解为可解释的空间、角度和时间分量。


## 二、方法论：核心思想与关键技术

**核心思想**：用N维各向异性Beta核替代高斯基元，实现跨空间、视角、时间维度的可控依赖建模。

**关键技术细节**：

1. **N维Beta核密度函数**：定义为 $\sigma(x, q) = B(x, q; \mu, \Sigma, b) \cdot o$，其中 $x \in \mathbb{R}^3$ 为空间坐标，$q \in \mathbb{R}^{N-3}$ 编码视角方向或时间等额外维度。每个基元由均值 $\mu$、协方差矩阵 $\Sigma$、可学习Beta形状参数 $b$ 和 opacity $o$ 参数化。

2. **形状参数变换**：Beta形状参数经 $\beta_i = 4\exp(b_i)$ 变换为正指数——负值产生扁平轮廓（适用于实体几何），正值产生尖锐峰值（适用于高频细节），使每个维度都能针对其特定属性采用最优形式。

3. **空间正交Cholesky参数化**：为在保留3D空间结构的同时参数化协方差矩阵，引入结构化Cholesky分解 $L = \begin{bmatrix} R_x \mathrm{diag}(s_x) & 0 \\ L_{qx} & L_q \end{bmatrix}$，实现空间与非空间维度的解耦。

4. **Beta调制条件切片**：通过Beta核的条件分布实现跨维度依赖建模。

5. **向后兼容**：UBS可通过参数退化为高斯泼溅这一特殊情形，保证即插即用和性能下限。


## 三、实验设计

**数据集与Benchmark**：
- **静态场景**：NeRF Synthetic、Mip-NeRF360等标准benchmark
- **视图依赖场景**：6DGS-PBR数据集
- **动态场景**：7DGS-PBR、D-NeRF等动态数据集，涵盖心脏运动体数据等体积动态场景

**对比方法**：
- 静态/视图依赖：3DGS、6DGS等
- 动态场景：4DGS、7DGS等


## 四、资源与算力

论文提供的材料中**未明确说明**所使用的GPU型号、数量及具体训练时长。仅提及实现为CUDA加速，并在动态序列上实现了训练加速。详细算力配置需查阅论文全文。


## 五、实验数量与充分性

**实验覆盖**：实验涵盖三大类场景（静态、视图依赖、动态），在多个标准benchmark上进行了对比。

**客观性与公平性**：UBS保持与GS的向后兼容性（高斯为Beta核的特殊情形），这为对比提供了公平的基线。但基于现有摘要材料，**无法判断**是否进行了充分的消融实验（如各维度贡献分析、参数敏感性分析等），需查阅全文确认。


## 六、主要结论与发现

1. **性能提升显著**：在挑战性PBR数据集上，PSNR最高提升达12.70 dB；在体积场景上PSNR提升高达8.27 dB。
2. **训练效率提升**：动态序列训练速度提升48.7%。
3. **参数量减少**：每基元参数量减少高达73%。
4. **可解释性**：Beta参数可自然分解场景属性——空间维度区分表面与纹理、角度维度区分漫反射与 specular、时间维度区分静态与动态，且无需显式监督。
5. **统一性与泛化性**：Beta核被确立为辐射场渲染的可扩展通用基元。


## 七、优点与亮点

1. **理论创新性强**：首次将3DGS泛化为N维各向异性Beta核，突破了高斯核在各维度对称性的根本限制。
2. **统一框架设计**：单一表示同时覆盖空间、角度、时间三个维度，无需辅助网络或特定颜色编码。
3. **向后兼容**：可退化为GS作为特例，保证即插即用和性能下限，降低应用风险。
4. **可解释性**：Beta参数自然分解场景属性，提供物理可解释的维度解耦。
5. **效率与质量兼得**：在减少参数量的同时提升渲染质量并加速训练。
6. **工程实现完备**：CUDA加速实现实时渲染。


## 八、不足与局限

> **⚠️ 重要说明**：以下分析基于论文摘要及公开材料，**尚需阅读论文全文确认**。

1. **算力信息缺失**：公开材料未报告GPU型号、数量及具体训练时长，不利于实验可复现性评估。
2. **实验细节不详**：消融实验（如各维度独立贡献、不同参数化方法对比等）的设置与结果在摘要层面无法判断。
3. **应用场景验证范围**：虽涵盖静态、视图依赖、动态三大类，但实际应用场景（如大尺度场景、室外场景、极端动态等）的验证充分性需全文确认。
4. **与最先进方法的对比**：对比方法主要为GS系列变体，与NeRF系列及其他最新辐射场方法的全面对比情况不明。
5. **潜在偏差风险**：性能提升是否高度依赖特定数据集特性（如PBR数据集的材质特点），需全文验证泛化性。


**（完）**
