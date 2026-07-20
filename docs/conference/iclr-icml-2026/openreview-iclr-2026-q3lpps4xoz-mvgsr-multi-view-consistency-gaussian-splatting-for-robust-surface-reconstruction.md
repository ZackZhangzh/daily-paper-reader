---
title: "MVGSR: Multi-View Consistency Gaussian Splatting for Robust Surface Reconstruction"
title_zh: MVGSR：用于鲁棒表面重建的多视图一致性高斯泼溅
authors: "Chenfeng Hou, Qi Xun Yeo, Mengqi Guo, Yongxin Su, Yan Li, Gim Hee Lee"
date: 2025-09-16
pdf: "https://openreview.net/pdf?id=Q3LPPs4XOZ"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 3DGS用于鲁棒表面重建和新视图合成
tldr: 现有3DGS表面重建方法在动态物体和瞬态干扰场景中容易产生浮空伪影和几何失真。本文提出MVGSR，利用多视图特征一致性进行干扰物分离，结合启发式掩蔽策略，提升了在非静态环境下的表面重建鲁棒性和视图合成质量。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有方法假设静态环境，在动态场景中失效，需处理干扰物和几何失真。
method: 基于多视图特征一致性和启发式干扰物掩蔽，不依赖MLP不确定性建模。
result: 有效减少浮空伪影和几何失真，提升动态场景的重建鲁棒性。
conclusion: 多视图一致性策略可替代MLP不确定性，适用于复杂场景。
---

## Abstract
3D Gaussian Splatting (3DGS) has recently emerged as a powerful approach for high-quality dense surface reconstruction of unknown scenes. However, existing methods are limited by the assumption of static environments. In practice, they often fail in everyday scenarios with dynamic objects and transient distractors that resulted in floating artifacts, geometric distortions, and view-dependent appearance errors in 3D reconstructed models.
We propose a robust surface reconstruction framework that leverages Gaussian models together with a heuristics-guided distractor masking strategy. Unlike prior methods that rely on MLP-based uncertainty modeling for distractor segmentation, our approach uses multi-view feature consistency to separate distractors from static content. This allows us to obtain precise distractor masks in the early stage of training. To further improve reconstruction, we introduce a pruning mechanism that evaluates the visibility of each Gaussian across views. Specifically, it resets the transmittance of unreliable points and thus suppresses floating artifacts to yield a more compact representation while preserving rendering quality. Finally, we design a multi-view consistency loss that enforces both structural and color coherence across views to improve the fidelity of Gaussian splats in distractor-heavy scenes.  Extensive experiments demonstrate that our method achieves state-of-the-art geometric accuracy and rendering fidelity while remaining robust in dynamic and cluttered environments. The code will be made publicly available on paper acceptance.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究背景：** 3D高斯泼溅（3D Gaussian Splatting, 3DGS）近年来凭借其高质量的渲染能力、极快的训练和推理速度，在未知场景的高质量稠密表面重建中展现出强大潜力。

**核心问题：** 现有3DGS表面重建方法均建立在**静态环境假设**之上。然而在实际日常场景中，移动的行人、车辆及其他瞬态干扰物普遍存在。这些干扰物会导致重建模型出现**浮空伪影（floating artifacts）、几何失真（geometric distortions）以及视角依赖的外观颜色误差（view-dependent appearance errors）**。当存在视角依赖的干扰物时，3DGS-based算法可能将其建模为堆积在相机镜头前的伪影，或附着在物体表面的视角依赖颜色表示。

**研究含义：** MVGSR旨在突破静态环境限制，提出一种在**非静态、杂乱场景**中仍能保持鲁棒性的表面重建框架，同时兼顾几何精度与渲染保真度。

---

## 二、方法论

### 2.1 核心思想

MVGSR的核心洞察是：**干扰物仅出现在少数几张图像中，缺乏跨视角的语义一致性，在不同视图间提取的特征存在显著差异**。基于这一观察，该方法通过**多视图特征一致性比较**来分离干扰物与静态场景内容，而非依赖现有方法中常用的MLP不确定性建模。

### 2.2 关键技术细节

**（1）干扰物检测（Distractor Detection）**

- **初始化与粗重建：** 利用SfM生成的稀疏点云和相机参数进行初始场景重建，得到初始深度图、表面法线和渲染图像。
- **特征提取与匹配：** 使用自监督2D基础模型DINOv2提取图像特征。通过单应性矩阵建立参考视角与相邻视角间的像素对应关系。
- **特征相似性计算：** 计算对应点的特征距离，低于阈值 \\(\\delta\_{near}\\) 的像素被标记为掩码。
- **多视图验证：** 若某像素被至少两个可见相邻视角标记为干扰物，则保留为最终分割结果 \\(Mask\_{mv}\\)。
- **掩码精细化：** 使用SAM（Segment Anything Model）对掩码边界区域进行精细化处理。

**（2）多视图剪枝（Multi-view Pruning, MV-Prune）**

- 现有3DGS通过周期性重置所有高斯的不透明度来控制浮点，但在有掩码的区域效果不佳。
- MVGSR提出**基于多视图贡献的剪枝策略**，评估每个高斯在各视角下的累计透射率贡献 \\(C\_{MV}(p)\\)。
- 当贡献超过阈值 \\(\\delta\_{prune}\\) 时，重置其透射率以允许梯度重新流动。
- 实验表明该策略可**压缩60%的点云**，同时保持相当的渲染质量。

**（3）多视图一致性损失（Multi-view Consistency Loss）**

- 使用**归一化互相关（NCC）** 系数构建一致性损失 \\(\\bm{L}\_{mv}\\)。
- 引入**重投影误差权重** \\(\\bm{w}\_{repro}\\)，聚焦于重建误差较大的区域。
- 总损失函数： \\(\\bm{L} = L\_{rgb} + \\lambda\_1 L\_s + \\lambda\_2 \\bm{w}\_{repro} \\bm{L}\_{mv}\\)
  - \\(L\_{rgb}\\)：图像重建损失
  - \\(L\_s\\)：正则化项，约束高斯呈薄表面形态
  - \\(\\lambda\_1 = 100\\)，\\(\\lambda\_2 = 0.2\\)

---

## 三、实验设计

### 3.1 数据集与场景

- **TnT-Robust：** 基于TnT数据集，添加随机干扰物构建
- **DTU-Robust：** 基于DTU数据集，添加随机干扰物构建
- **Onthego数据集：** 真实非静态场景

### 3.2 对比方法

- **表面重建方法：** PGSR（Planar-based Gaussian Splatting）、2DGS（2D Gaussian Splatting）
- **抗干扰方法：** SLS、NeRF-Onthego

### 3.3 评价指标

- **几何精度：** F1分数（TnT-Robust）、Chamfer Distance（CD，DTU-Robust）
- **渲染质量：** PSNR（峰值信噪比）

---

## 四、资源与算力

**论文中明确说明：** 所有实验均在**单张NVIDIA 4090 GPU**上完成。

训练迭代次数：使用掩码重新训练 **30,000次迭代** 后获得高质量表面重建。多视图剪枝阶段透射率贡献阈值设为0.5。

---

## 五、实验数量与充分性

### 5.1 实验组数

1. **DTU-Robust数据集定量对比**：涵盖15个场景（scan 24, 37, 40, 55, 63, 65, 69, 83, 97, 105, 106, 110, 114, 118, 122）
2. **TnT-Robust数据集定量对比**：涵盖6个场景（Truck, Caterpillar, Barn, Meetingroom, Ignatius, Courthouse）
3. **定性对比**：在DTU-Robust和TnT-Robust上进行可视化比较
4. **新视图合成渲染对比**：在DTU-Robust上评估PSNR
5. **消融实验（Ablation Study）** ：在DTU-Robust scan24上验证各组件的贡献

### 5.2 充分性与公平性评估

**优点：**
- 对比方法覆盖全面（2DGS、PGSR、SLS、NeRF-Onthego），既包括GS-based方法也包括NeRF-based方法
- 同时评估几何精度（F1/CD）和渲染质量（PSNR），维度完整
- 在**不同干扰物比例/遮挡率**下验证了性能稳定性
- 消融实验验证了各组件的独立贡献

**潜在不足：**
- 所有实验均基于**合成添加干扰物的数据集**（DTU-Robust、TnT-Robust），虽包含Onthego真实场景，但对真实复杂动态场景的泛化性验证相对有限
- 消融实验仅在一个场景（scan24）上进行，覆盖面可能不够广

---

## 六、主要结论与发现

1. **几何精度提升显著：** 在DTU-Robust上，MVGSR的平均CD分数（0.42）相比2DGS和PGSR分别提升**76.45%和60.31%**；在TnT-Robust上，F1分数全面超越PGSR。

2. **渲染质量领先：** MVGSR在DTU-Robust上平均PSNR达到**35.58 dB**，显著优于基线方法；在scan83场景中，PSNR比2DGS和PGSR分别高出**9.67 dB和8.88 dB**。

3. **剪枝策略高效：** MV-Prune可在保持相当渲染质量的前提下**压缩60%的点云**。

4. **多视图一致性策略有效：** 基于多视图特征一致性的干扰物分离方法**可替代MLP不确定性建模**，在复杂场景中取得更优效果。

---

## 七、方法亮点

1. **创新的干扰物分离范式：** 不依赖MLP不确定性建模，而是通过**多视图特征一致性比较**在训练早期即可获得精确干扰物掩码。

2. **严格掩码边界防止梯度泄漏：** 相比迭代学习的掩码，多视图比较得到的掩码能区分干扰物与高频细节，避免梯度泄漏导致的伪影和视角依赖颜色误差。

3. **有效的浮空伪影抑制机制：** 基于多视图贡献的剪枝策略（MV-Prune）通过重置不可靠点的透射率，有效抑制浮空伪影。

4. **结构-颜色联合约束：** 多视图一致性损失同时约束结构一致性和颜色一致性。

5. **轻量高效：** 采用轻量级高斯模型，单张4090 GPU即可完成全部实验。

---

## 八、不足与局限

1. **实验场景偏向合成数据：** 主要实验在合成添加干扰物的数据集（DTU-Robust、TnT-Robust）上进行，虽然包含Onthego真实场景，但对真实世界极端动态场景的泛化性仍需更充分验证。

2. **消融实验覆盖面有限：** 消融实验仅在DTU-Robust的scan24一个场景上进行，不同场景下的组件贡献可能有所差异。

3. **依赖预训练模型：** 干扰物检测依赖DINOv2和SAM等预训练模型，在预训练模型不适配的场景中可能性能下降。

4. **动态场景类型有限：** 论文主要处理"瞬态干扰物"，对持续运动的动态物体（如视频中的运动目标）的处理能力未充分探讨。

5. **代码尚未开源：** 论文注明代码将在论文接收后公开，目前无法复现验证。

---

（完）
