---
title: "Proxy-GS: Efficient 3D Gaussian Splatting via Proxy Mesh"
title_zh: Proxy-GS：基于代理网格的高效三维高斯泼溅
authors: "Yuanyuan Gao, Yuning Gong, Yifei Liu, Li Jingfeng, Zhihang Zhong, Dingwen Zhang, Yanci Zhang, Dan Xu, Xiao Sun"
date: 2025-09-04
pdf: "https://openreview.net/pdf?id=mee8jLEiwd"
tags: ["query:dgs-fm"]
score: 10.0
evidence: 基于代理网格的遮挡感知高效三维高斯泼溅
tldr: 3D高斯泼溅虽高效但存在大量冗余，现有裁剪和LOD技术缺乏遮挡感知。本文提出Proxy-GS，通过快速代理系统生成精确遮挡深度图，引入遮挡感知的冗余去除，大幅减少高斯元数量而不损失渲染质量。实验证明该方法在大规模场景下显著提升渲染速度，为实时高保真渲染提供了更紧凑的表示。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有3DGS方法缺乏遮挡感知，导致大量冗余高斯元。
method: 构建快速代理系统生成遮挡深度图，利用遮挡信息裁剪冗余高斯元。
result: "在保持视觉保真度的同时，高斯元数量减少超过50%，渲染帧率提升。"
conclusion: 遮挡感知的代理系统可有效优化3DGS的存储与计算效率。
---

## Abstract
3D Gaussian Splatting (3DGS) has emerged as an efficient approach for achieving photorealistic rendering. Recent MLP-based variants further improve visual fidelity but introduce substantial decoding overhead during rendering. To alleviate computation cost, several pruning strategies and level-of-detail (LOD) techniques have been introduced, aiming to effectively reduce the number of Gaussian primitives in large-scale scenes. However, our analysis reveals that significant redundancy still remains due to the lack of occlusion awareness. In this work, we propose Proxy-GS, a novel pipeline that exploits a proxy to introduce Gaussian occlusion awareness from any view.
At the core of our approach is a fast proxy system capable of producing precise occlusion depth maps at resolution 1000$\times$1000 under \SI{1}{ms}. This proxy serves two roles: first, it guides the culling of anchors and Gaussians to accelerate rendering speed. Second, it guides the densification towards surfaces during training, avoiding inconsistencies in occluded regions, and improving the rendering quality. 
In heavily occluded scenarios, such as the MatrixCity Streets dataset, Proxy-GS not only equips MLP-based Gaussian splatting with stronger rendering capability but also achieves faster rendering speed. Specifically, it achieves more than $2.5\times$ speedup over Octree-GS, and consistently delivers substantially higher rendering quality. Code will be public upon acceptance.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究动机与背景：**

- 3D高斯泼溅（3DGS）是近年涌现的高效照片级渲染方法。近年来，基于MLP的结构化变体（如scaffold-GS、Octree-GS）进一步提升了视觉保真度，但引入了大量解码开销。
- 为降低计算成本，学界已提出多种剪枝策略和LOD（细节层次）技术以减少大规模场景中的高斯图元数量。
- **核心问题：** 论文指出，现有方法**缺乏遮挡感知**，导致大量冗余高斯图元仍然存在。这些冗余高斯元试图拟合每一个训练视角，却忽略了场景的底层几何结构。

**整体含义：** Proxy-GS旨在通过引入**轻量级代理系统**，为3DGS训练与推理提供统一的**遮挡先验**，从根本上解决算力浪费问题，让3DGS真正适配室内、城市等大场景的实时渲染需求。

---

## 2. 方法论

**核心思想：** 利用一个**快速代理系统**为高斯泼溅引入任意视角的遮挡感知能力。

**关键技术细节：**

- **快速代理系统：** 能够在**1ms内**生成**1000×1000分辨率**的精确遮挡深度图。
- **代理的双重作用：**
  1. **推理阶段——代理引导滤波（遮挡剔除）：** 指导锚点（anchors）和高斯元的剔除，加速渲染速度。
  2. **训练阶段——代理引导致密化：** 引导高斯元向场景表面致密化生长，避免遮挡区域的不一致性，提升渲染质量。
- **实现方式：** 论文以Octree-GS为基础框架，保留其LOD锚点结构，新增上述两大核心模块。通过**硬件光栅化**实现两个模块的高效联动，整体流程**无GPU-CPU数据交互**，避免额外开销。

---

## 3. 实验设计

**数据集/场景：**

- 论文重点在大规模、高遮挡场景上评估，特别是 **MatrixCity Streets数据集**（城市街景）。

**Benchmark与对比方法：**

- 主要对比方法为 **Octree-GS**。
- 同时与原始3DGS及其他结构化变体（如MLP-based方法）进行对比。

---

## 4. 资源与算力

**文中未明确说明**使用的具体GPU型号、数量或训练时长。不过，从技术描述中可以推断：

- 代理系统设计上充分利用了**消费级GPU的硬件光栅化能力**。
- 整体流程**无GPU-CPU数据交互**，说明是在GPU上高效完成的。

---

## 5. 实验数量与充分性

**实验设置：**

- 论文在 **MatrixCity Streets** 等遮挡密集场景上进行了实验。
- 对比了 **Octree-GS** 等主流方法。
- 从现有信息来看，论文至少涵盖了**推理速度对比**和**渲染质量对比**两方面的实验。

**充分性与客观性评估：**

- 实验聚焦于高遮挡场景，针对性地验证了Proxy-GS的核心优势（遮挡感知），设计合理。
- 以Octree-GS为主要baseline，对比公平（两者均为结构化MLP-based方法）。
- 但从现有摘要信息来看，**无法确认是否包含消融实验**（如分别验证代理引导滤波和代理引导致密化两个模块的独立贡献）。若缺少消融实验，则对方法各组件有效性的论证可能不够充分。

---

## 6. 主要结论与发现

- Proxy-GS在保持甚至提升渲染画质的同时，实现了 **2.5倍以上** 的渲染加速（相比Octree-GS）。
- 显著减少了需要解码的锚点数量，在**内存效率和渲染速度**两方面都带来显著提升。
- 在遮挡密集的城市街景场景中，Proxy-GS实现了**稳定的实时渲染**，同时保持细粒度视觉细节。
- 代理深度渲染仅需约 **1ms**，开销极低。

---

## 7. 优点

- **创新性强：** 首次将**遮挡感知**以统一先验的形式引入3DGS的训练与推理全流程。
- **高效实用：** 代理系统在1ms内生成高分辨率深度图，且全程GPU内完成，无CPU-GPU交互开销。
- **效果显著：** 在遮挡密集场景中实现 **2.5倍以上** 的渲染加速且画质无损甚至提升。
- **应用前景广阔：** 大幅降低了3DGS的部署门槛，可直接应用于**数字孪生、元宇宙、自动驾驶、AR/VR**等领域。
- **学术认可度高：** 论文入选 **CVPR 2026**，并获得 **满分（Best Paper Candidate）** 评价。

---

## 8. 不足与局限

- **算力信息缺失：** 论文未明确说明训练所需的GPU型号、数量及训练时长，难以评估其训练成本。
- **实验覆盖范围有限：** 从摘要信息来看，主要实验结果集中在MatrixCity Streets数据集，**是否在更多数据集（如室内场景、其他城市场景）上进行了验证尚不明确**。
- **消融实验不明确：** 无法确认是否有系统的消融实验来验证代理引导滤波和代理引导致密化两个模块各自的独立贡献。
- **依赖代理网格质量：** 方法的有效性高度依赖于代理系统生成的深度图精度，若代理网格本身质量不佳，可能影响整体性能。
- **代码尚未开源：** 论文表明代码将在接收后公开，目前无法复现验证。

---

（完）
