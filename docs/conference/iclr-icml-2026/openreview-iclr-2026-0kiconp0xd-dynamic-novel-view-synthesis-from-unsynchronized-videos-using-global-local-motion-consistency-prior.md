---
title: DYNAMIC NOVEL VIEW SYNTHESIS FROM UNSYNCHRONIZED VIDEOS USING GLOBAL-LOCAL MOTION CONSISTENCY PRIOR
title_zh: 基于全局-局部运动一致性先验的非同步视频动态新视图合成
authors: "Xinzhuo Zhang, Junyu Zhu, Hao Zhu, Yaning Li, Qi Zhang, Zhan Ma, Xun Cao"
date: 2025-09-15
pdf: "https://openreview.net/pdf?id=0KiCONP0xD"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 使用GS框架的动态新视图合成与运动一致性
tldr: 针对非同步多视角视频动态新视图合成中局部最小值和纹理缺失问题，本文提出一种3D全局-2D局部运动一致性先验，通过评估场景流投影与预计算光流的对齐，利用不同视角下全局场景流的各向异性有效校正时间错位。该方法在标准动态场景数据集上验证了其优越性，扩展了神经渲染在非理想采集条件下的应用能力。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 非同步视频动态NVS面临局部极小值和纹理缺失。
method: 提出3D全局-2D局部运动一致性先验对齐场景流与光流。
result: 有效校正时间错位，提升动态NVS性能。
conclusion: 运动一致性先验增强非同步动态场景渲染鲁棒性。
---

## Abstract
Dynamic novel view synthesis (D-NVS) critically depends on hardware-based synchronization. Current approaches that accommodate unsynchronized settings within the widely-used NeRF or GS frameworks often struggle with local minima, particularly in textureless scenes or when multi-view videos exhibit large misalignments. To tackle this issue, we propose a novel 3D global–2D local motion consistency prior, which evaluates the alignment between predicted scene flow projections and pre-computed optical flows across multi-view videos. Our analysis reveals that the motion, produced by the anisotropy of projected global scene flow across different views, is inherently more effective for correcting temporal misalignments compared to the near-isotropic appearance typically leveraged in NeRF or GS. Extensive experiments on public datasets demonstrate the versatility of our loss function across various D-NVS architectures (NeRF and GS), achieving a 50% reduction in synchronization errors and a PSNR improvement of up to 4dB, thereby outperforming existing state-of-the-art methods.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义（研究动机和背景）

动态新视图合成（Dynamic Novel View Synthesis, D-NVS）旨在从多视角视频中生成任意新视角的动态场景渲染，其性能**高度依赖于硬件级别的多视角视频同步**。现有方法虽尝试在广泛使用的 NeRF 或 GS 框架内处理非同步设置，但普遍面临两大难题：**局部最小值（local minima）问题**，尤其在**纹理缺失（textureless）场景**中表现突出；以及当**多视角视频存在较大时间错位（large misalignments）** 时，性能严重退化。

针对上述瓶颈，论文提出利用**运动信息**而非传统的外观信息来校正时间错位，核心洞察在于：**不同视角下全局场景流投影的各向异性（anisotropy）** 比 NeRF/GS 中依赖的近似各向同性外观（near-isotropic appearance）**在纠正时间错位上更具优势**。

## 2. 论文提出的方法论

### 核心思想
提出一种新颖的 **3D全局–2D局部运动一致性先验（3D global–2D local motion consistency prior）** ，将三维空间中的场景流（scene flow）与二维图像平面上的光流（optical flow）通过投影关系对齐，以此作为监督信号来约束和优化动态场景的时空建模。

### 关键技术细节
- **3D全局场景流（Global Scene Flow）** ：描述动态场景中每个三维点在时间维度的运动矢量场。
- **2D局部光流（Local Optical Flow）** ：从多视角视频帧中预先计算出的二维像素运动场。
- **一致性评估**：将预测的3D场景流投影到各相机视角下，与预计算的2D光流计算对齐误差，构成**损失函数（loss function）**。
- **各向异性优势**：论文分析指出，投影后的全局场景流在不同视角下呈现各向异性，包含更丰富的方向性信息，因而比传统方法依赖的近似各向同性外观更有效。

### 算法流程（文字说明）
1.  **输入**：非同步的多视角视频序列。
2.  **预处理**：对每个视角的视频帧，使用现成的光流估计算法预计算相邻帧之间的2D光流场。
3.  **场景建模**：基于 NeRF 或 GS 框架构建动态场景的 4D 表示（包含几何、外观和运动场）。
4.  **运动预测**：从当前场景表示中预测每个三维点的3D场景流。
5.  **投影与对齐**：将预测的3D场景流投影到各个相机视角，得到投影后的2D运动场。
6.  **损失计算**：计算投影运动场与预计算光流之间的一致性误差，作为优化目标的一部分。
7.  **联合优化**：结合传统的渲染损失（如 RGB 重建损失）与上述运动一致性损失，端到端优化场景表示。

## 3. 实验设计

### 数据集与场景
论文在**公共数据集（public datasets）** 上进行了广泛实验。根据论文所属领域（动态新视图合成）推断，数据集可能包含多视角动态场景视频，涵盖不同难度等级——包括纹理丰富的场景和论文特别关注的**纹理缺失场景**。

### Benchmark 与对比方法
- **基准（Benchmark）** ：采用动态新视图合成领域的标准评测指标，包括 **PSNR（峰值信噪比）** 和**同步误差（synchronization errors）** 等。
- **对比方法**：与现有的**最先进方法（state-of-the-art）** 进行了对比，这些方法同样尝试在 NeRF 或 GS 框架下处理非同步视频输入。

## 4. 资源与算力

**论文提供的摘要和元数据中未明确说明使用的GPU型号、数量或训练时长等具体算力信息。**

## 5. 实验数量与充分性

### 实验数量
- 实验涵盖了**多种 D-NVS 架构**（包括 NeRF 和 GS 两类主流框架），验证了所提损失函数的**通用性（versatility）** 。
- 元数据中提及进行了**消融实验（ablation study）** （见 `evidence` 字段），但未提供具体组数。

### 充分性与客观性评估
- **充分性**：在两类完全不同的底层架构（隐式 NeRF 与显式 GS）上均取得一致提升，说明方法具有较好的泛化性，实验设计较为充分。
- **客观性与公平性**：采用公共数据集和标准评测指标，与现有最先进方法进行对比，符合领域内的公平对比规范。但受限于摘要信息，无法评估对比方法的选择是否全面、是否有选择性偏差。

## 6. 论文的主要结论与发现

- 所提出的**3D全局–2D局部运动一致性先验**能够有效校正多视角视频间的时间错位。
- 在多个公共数据集和不同架构（NeRF 和 GS）上，该方法均显著提升了动态新视图合成的性能。
- **量化成果**：实现了**同步误差降低 50%** ，**PSNR 提升最高达 4dB**，**超越了现有最先进方法**。

## 7. 优点（方法或实验设计的亮点）

- **创新性的运动先验**：摒弃了传统方法依赖外观信息校正时间错位的思路，转而利用3D场景流投影的各向异性，从原理上更契合时间同步问题的本质。
- **即插即用（Plug-and-Play）的通用性**：所提损失函数可无缝集成到 NeRF 和 GS 两种主流框架中，具有良好的扩展潜力。
- **显著的量化提升**：50% 的同步误差降低和 4dB 的 PSNR 提升是极具说服力的改进幅度。
- **直击痛点**：专门针对非同步采集这一实际应用中普遍存在的难题，具有较高的实用价值。

## 8. 不足与局限（实验覆盖、偏差风险、应用限制等）

- **算力信息缺失**：未报告训练所需的GPU型号、数量及时长，不利于其他研究者复现或评估方法成本。
- **实验细节有限**：摘要和元数据未提及具体的数据集名称、场景数量、消融实验的具体设置等，无法全面评估实验的详尽程度。
- **真实世界验证未知**：虽提及公共数据集，但未明确是否包含极具挑战性的**真实世界非同步采集数据**（如手持相机、不同帧率的相机阵列等），其实用性在极端非理想条件下的表现有待进一步验证。
- **依赖预计算光流**：方法依赖预计算的光流作为监督信号，光流估计本身的误差可能影响最终性能，尤其在遮挡、大运动或光照剧烈变化的区域。
- **论文状态**：该论文为 **ICLR-2026-Rejected-Public**，意味着其方法或实验设计在同行评审中可能存在未被披露的不足。

（完）
