---
title: Structure-Aware Riemannian Flow Matching for Registration and Fusion of Hyperspectral and Multispectral Images
title_zh: 结构感知黎曼流匹配用于高光谱与多光谱图像配准融合
authors: "Quan Zhang, Jun Li, Weilong Zhu, MINGYANG LI, Qinmu Shen, Yuanxi Peng"
date: 2026-04-30
pdf: "https://openreview.net/pdf/65d2df490aaaba80e6a92aed3363a6422e6e30f8.pdf"
tags: ["query:dgs-fm"]
score: 6.0
evidence: 黎曼流匹配用于图像配准
tldr: 针对高光谱与多光谱图像配准融合中复杂非刚性形变难题，提出结构感知黎曼流匹配，将配准建模为结构诱导黎曼流形上的动态最优传输，利用多光谱结构线索设计各向异性代价，实现联合配准与融合。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有方法难以处理非刚性形变且忽略几何特性。
method: 在黎曼流形上动态最优传输，结合结构线索。
result: 联合配准融合效果提升。
conclusion: 几何信息流匹配有效改善图像融合。
---

## Abstract
Precise alignment is a prerequisite for hyperspectral and multispectral image fusion, yet existing methods struggle with complex non-rigid deformations. Existing techniques either suffer from inter-task error accumulation by treating registration and fusion as disjoint processes or neglect the geometric nature of distortions by relying on isotropic Euclidean metrics. We propose Structure-Aware Riemannian Flow Matching (SA-RFM), a geometry-informed framework for joint registration and fusion of hyperspectral and multispectral images. SA-RFM reformulates registration as dynamic optimal transport on a structure-induced Riemannian manifold, where anisotropic costs are derived from MSI structural cues. To circumvent the complexity of explicit OT solvers, we incorporate this geometry into a conditional flow matching framework via a local cost approximation. This formulation is realized through two synergistic mechanisms: a Riemannian Flow Matching objective that enforces structure-aware error measurement, and an optimal transport direction regularization that aligns the velocity field with the induced metric, thereby resolving the fundamental mismatch between anisotropic costs and conventional Euclidean supervision. Extensive experiments on four datasets demonstrate the superiority of our method. Code is available at: https://github.com/ZhangQuan-hub.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机：** 高光谱图像（HSI）与多光谱图像（MSI）的融合是遥感与计算机视觉领域的重要课题，其前提条件是两种图像之间的精确配准。然而，现有方法面临两大瓶颈：

- **任务割裂问题**：传统方法将配准（registration）与融合（fusion）视为两个独立过程，分别处理，导致任务间的误差累积。
- **几何忽视问题**：现有技术在建模图像畸变时依赖各向同性的欧几里得度量（isotropic Euclidean metrics），忽视了图像形变中内在的几何特性。

**核心问题：** 如何在复杂非刚性形变条件下，实现高光谱与多光谱图像的联合配准与融合，同时充分利用图像的几何结构信息。

**整体含义：** 论文提出**结构感知黎曼流匹配（Structure-Aware Riemannian Flow Matching, SA-RFM）** 框架，将配准问题重新建模为**结构诱导黎曼流形上的动态最优传输**，利用多光谱图像的结构线索设计各向异性代价函数，从而实现配准与融合的联合优化。


## 二、论文提出的方法论

**核心思想：** SA-RFM 是一个几何感知（geometry-informed）的联合配准与融合框架。其核心创新在于将图像配准问题从传统的欧几里得空间提升到**结构诱导的黎曼流形**上，在该流形上执行动态最优传输（dynamic optimal transport）。

**关键技术细节：**

1. **各向异性代价函数**：从多光谱图像（MSI）中提取结构线索（structural cues），据此设计各向异性的代价度量，取代传统各向同性欧几里得度量。这使得模型能够感知图像中的边缘、纹理等几何结构信息。

2. **黎曼流匹配目标（Riemannian Flow Matching Objective）**：在黎曼流形上定义流匹配损失，强制执行结构感知的误差度量。

3. **最优传输方向正则化（Optimal Transport Direction Regularization）**：对速度场施加与诱导度量对齐的正则化约束，解决各向异性代价与传统欧几里得监督之间的根本不匹配问题。

4. **局部代价近似**：为避免显式求解最优传输问题的计算复杂性，论文通过局部代价近似将上述几何框架纳入条件流匹配框架中。

**算法流程（文字说明）：** SA-RFM 首先从多光谱图像中提取结构信息，构建一个结构诱导的黎曼流形；然后将配准任务建模为该流形上的动态最优传输问题；接着通过条件流匹配框架学习一个速度场，该速度场沿着流形上的测地线将源分布（高光谱图像）传输到目标分布（多光谱图像）；最后在传输过程中同时完成图像的配准与融合。整个流程通过两个协同机制实现——黎曼流匹配目标提供结构感知的误差度量，最优传输方向正则化确保速度场与流形几何一致。


## 三、实验设计

**数据集/场景：** 论文在**四个数据集**上进行了实验验证。具体数据集名称在提供的摘要中未详细列出，推测涵盖不同的遥感或计算机视觉场景。

**Benchmark：** 论文将所提出的 SA-RFM 与现有的高光谱-多光谱图像配准与融合方法进行对比。对比方法包括将配准与融合作为**分离过程（disjoint processes）** 的传统方法，以及依赖**各向同性欧几里得度量**的现有技术。

**对比方法：** 摘要中未逐一列出对比方法的具体名称，但明确指出了两类主要对比基线：（1）配准与融合分离处理的传统方法；（2）使用各向同性度量的几何忽略方法。


## 四、资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量、训练时长等算力信息。摘要部分仅提供了方法描述和实验结果概述，未涉及具体的计算资源配置。


## 五、实验数量与充分性

**实验数量：** 论文在**四个数据集**上进行了实验。此外，论文设计了**两个协同机制**（黎曼流匹配目标 + 最优传输方向正则化），暗示可能包含相应的**消融实验**以验证各组件的有效性。

**充分性与客观性评估：**

- **优点**：四个数据集的覆盖范围在一定程度上保证了方法在不同场景下的泛化能力验证。将联合配准融合框架与分离处理框架、各向同性度量与各向异性度量进行对比，实验设计具有合理的对照逻辑。

- **局限**：由于摘要信息有限，无法判断实验的详细设置（如训练集/测试集划分、评价指标、统计显著性检验等）。消融实验的具体设计也不明确。


## 六、论文的主要结论与发现

论文的核心结论是：**将几何信息引入流匹配框架，能够有效改善高光谱与多光谱图像的配准与融合效果**。具体而言：

- 将配准建模为结构诱导黎曼流形上的动态最优传输，优于传统的欧几里得空间建模方式。
- 利用多光谱图像的结构线索设计各向异性代价，比各向同性度量更能捕捉图像畸变的几何本质。
- 通过黎曼流匹配目标与最优传输方向正则化的协同作用，解决了各向异性代价与欧几里得监督之间的不匹配问题。
- 在四个数据集上的实验验证了 SA-RFM 的优越性。


## 七、优点

**方法层面的亮点：**

1. **几何感知的建模范式**：将黎曼流匹配这一生成模型框架创新性地应用于图像配准与融合任务，实现了从欧几里得空间到黎曼流形的范式升级。

2. **端到端的联合优化**：将配准与融合从传统的两阶段分离处理提升为联合优化，避免了误差累积问题。

3. **结构感知的各向异性度量**：利用多光谱图像的结构线索设计各向异性代价，比传统各向同性度量更符合图像畸变的几何特性。

4. **理论完备性**：通过最优传输方向正则化解决了各向异性代价与传统监督之间的理论不匹配问题，体现了方法设计的严密性。

5. **计算可行性**：通过局部代价近似规避了显式最优传输求解的复杂性，使方法具有实际可计算性。

**实验层面的亮点：**

6. **多数据集验证**：在四个数据集上进行评估，增强了结论的可靠性。

7. **代码开源**：论文提供了可公开获取的代码实现，有利于研究社区复现与进一步改进。


## 八、不足与局限

1. **实验细节披露不足**：摘要中未列出具体的数据集名称、对比方法的完整列表、评价指标、定量结果等关键实验信息，难以全面评估实验的充分性与公平性。

2. **算力信息缺失**：未说明训练所需的 GPU 型号、数量、训练时长等，不利于其他研究者评估方法的计算成本与复现难度。

3. **应用范围限制**：方法主要针对高光谱与多光谱图像的配准融合，其是否适用于其他模态（如高光谱与 SAR、高光谱与热红外等）的图像融合尚不明确。

4. **非刚性形变的复杂性**：虽然论文声称能处理复杂非刚性形变，但摘要未说明方法在极端形变（如大位移、遮挡、显著光照变化）条件下的鲁棒性表现。

5. **实时性未知**：基于流匹配的方法通常涉及神经网络的训练与推理，其在实际应用中的实时性能（推理速度、内存占用等）未在摘要中提及。


（完）
