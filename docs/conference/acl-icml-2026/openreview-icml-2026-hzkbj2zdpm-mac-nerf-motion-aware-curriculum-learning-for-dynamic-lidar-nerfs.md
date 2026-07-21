---
title: "MAC-NeRF: Motion-Aware Curriculum Learning for Dynamic LiDAR NeRFs"
title_zh: MAC-NeRF：用于动态LiDAR NeRF的运动感知课程学习
authors: "Shangshu Yu, Xiaotian Sun, Wen Li, Rui She, Hanyun Wang, Sheng Ao, Chenglu Wen, Cheng Wang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/6f679a71f393451fdc78f3e7b2e1c1162ea529d3.pdf"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 动态LiDAR NeRF神经渲染
tldr: 针对动态LiDAR神经辐射场中运动物体破坏多视图一致性、产生鬼影的问题，本文提出MAC-NeRF，采用运动感知课程学习和修正的时间一致性，通过前向后向几何验证过滤错误监督，实现高质量动态场景合成，拓展了神经渲染在动态环境中的应用。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有LiDAR NeRF难以处理动态场景，运动噪声导致优化困难。
method: 提出修正时间一致性及运动感知课程学习，逐步筛选有效监督信号。
result: 有效抑制动态伪影，合成高保真动态场景。
conclusion: 运动感知课程学习可显著提升动态LiDAR NeRF的鲁棒性。
---

## Abstract
While LiDAR NeRFs excel in static environments, synthesizing dynamic scenes remains challenging as moving objects break multi-view consistency, causing conflicting supervision and ghosting artifacts across frames.
Existing methods typically suffer from optimization difficulty from the start, struggling to disentangle valid geometry from motion noise when initial motion priors are unreliable.
To address this, we propose MAC-NeRF, a novel LiDAR NeRF framework enhanced by motion-aware curriculum learning for high-fidelity dynamic scene synthesis.
First, we propose Rectified Temporal Consistency to resolve motion-induced supervision conflicts.
By filtering out erroneous supervision via forward-backward geometric verification, it creates a curriculum that prioritizes trustworthy temporal correspondences before handling challenging motions.
Second, we propose Confidence-Modulated Frequency Regularization (CMFR) to eliminate geometric ambiguity.
It adaptively modulates the frequency regularization bandwidth, progressively transitioning from strict low-frequency constraints for artifact suppression to full-spectrum modeling for fine-grained detail preservation.
Extensive experiments on KITTI-360 and nuScenes demonstrate that MAC-NeRF significantly outperforms state-of-the-art methods in rendering quality.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景：** LiDAR NeRF（激光雷达神经辐射场）在静态场景合成中表现出色，但在动态场景中面临根本性挑战——运动物体会破坏多视图一致性，导致跨帧的监督信号相互冲突，产生“鬼影”等渲染伪影。

**核心问题：** 现有方法在优化初期就面临困难——当初始运动先验不可靠时，模型难以从运动噪声中分离出有效的几何信息。

**整体含义：** 本文提出 MAC-NeRF（Motion-Aware Curriculum Learning for Dynamic LiDAR NeRFs），通过“运动感知课程学习”策略，让模型从可靠的监督信号开始学习，逐步过渡到处理复杂运动，从而在高动态场景中实现高保真合成。该工作已被 ICML 2026 录用。


## 二、方法论

**核心思想：** 采用课程学习（Curriculum Learning）范式，让模型先学习简单、可靠的样本，再逐步面对复杂的运动场景，避免从一开始就被运动噪声干扰。

**关键技术一：Rectified Temporal Consistency（修正时间一致性）**

- 通过前向-后向几何验证（forward-backward geometric verification）过滤错误的监督信号
- 由此构建一个课程学习策略：优先利用可信的时间对应关系进行训练，再逐步处理具有挑战性的运动
- 本质上是解决运动引起的跨帧监督冲突问题

**关键技术二：Confidence-Modulated Frequency Regularization（置信度调制频率正则化，CMFR）**

- 自适应调节频率正则化的带宽
- 训练初期：采用严格的低频约束，抑制伪影
- 训练后期：逐步过渡到全频谱建模，保留精细细节
- 目的是消除几何模糊性（geometric ambiguity）

**算法流程（文字说明）：** 输入动态LiDAR序列 → 通过前向后向几何验证筛选可靠的时间对应关系 → 构建课程学习路径（先易后难）→ 利用CMFR自适应调节频率正则化强度（从低频约束逐步过渡到全频谱）→ 输出高保真动态场景渲染结果。


## 三、实验设计

**数据集与场景：**
- **KITTI-360**：城市级自动驾驶场景数据集
- **nuScenes**：大规模自动驾驶数据集
- 两个数据集均涵盖多样化的动态场景

**Benchmark：** 论文在动态LiDAR场景合成任务上进行评估，对比了之前最先进的 NeRF 隐式方法和显式重建方法。

**对比方法：** 具体对比了哪些SOTA方法——元数据中未详细列出。但从搜索材料可知，至少与 LiDAR-NeRF 等基线进行了对比。


## 四、资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量或训练时长等信息。从提供的论文元数据中无法获取算力相关细节。


## 五、实验数量与充分性

**实验规模：** 论文在 **KITTI-360** 和 **nuScenes** 两个大规模自动驾驶数据集上进行了“ Extensive experiments ”（大量实验）。

**实验充分性判断：**
- ✅ **积极方面**：使用了两个公认的自动驾驶基准数据集，覆盖多样化的动态场景，具有较好的代表性
- ✅ 与 state-of-the-art 方法进行了对比
- ⚠️ **信息缺失**：元数据中未提及消融实验（ablation study）的具体设计，也未说明是否在多个序列上进行了交叉验证
- ⚠️ 由于无法获取论文全文，无法确认实验的统计显著性检验、误差棒报告等细节

总体而言，从已知信息看实验设计较为规范，但充分性的完整判断需要阅读全文中的实验章节。


## 六、论文的主要结论与发现

- MAC-NeRF 在 KITTI-360 和 nuScenes 两个数据集上的渲染质量显著优于现有最先进方法
- 运动感知课程学习可有效提升动态 LiDAR NeRF 的鲁棒性
- Rectified Temporal Consistency 能够通过几何验证有效过滤错误监督信号
- CMFR 的自适应频率调节策略能在抑制伪影和保留细节之间取得良好平衡


## 七、优点（方法与实验设计的亮点）

1. **问题定位精准**：直击动态LiDAR NeRF的核心痛点——运动导致的多视图不一致和早期优化困难
2. **课程学习思路新颖**：将课程学习引入动态LiDAR NeRF，让模型“由易到难”地学习，符合认知规律
3. **双模块协同设计**：Rectified Temporal Consistency 解决监督冲突，CMFR 解决几何模糊性，两个模块相互补充
4. **前向后向几何验证**：这一技术手段能够系统性地筛选可信监督信号，而非依赖启发式规则
5. **动态频率调节**：CMFR 的自适应策略在训练动态过程中平滑调整模型容量，兼顾了初期稳定性和后期表达能力
6. **实验数据扎实**：在两个大规模真实自动驾驶数据集上验证，具有实际应用价值


## 八、不足与局限

1. **算力信息缺失**：未在可见材料中报告训练所需的 GPU 资源，不利于其他研究者复现和评估成本
2. **对比方法不完整**：元数据中未列出所有对比的 SOTA 方法名称，无法判断对比的全面性
3. **消融实验未知**：无法确认是否对两个核心模块（Rectified Temporal Consistency 和 CMFR）分别进行了消融验证
4. **实时性未知**：未提及推理速度或实时性能，对于自动驾驶应用而言这是重要指标
5. **泛化性局限**：仅在自动驾驶数据集（KITTI-360、nuScenes）上验证，未涉及其他类型的动态场景（如室内动态环境、人体运动等）
6. **依赖标注质量**：前向后向几何验证的效果可能依赖于初始数据的质量，在极端稀疏或噪声极大的场景中表现未知


（完）
