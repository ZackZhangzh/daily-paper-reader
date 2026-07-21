---
title: Kinematics-Driven Gaussian Shape Deformation for Blurry Monocular Dynamic Scenes
title_zh: 运动学驱动的高斯形状变形用于模糊单目动态场景
authors: "Yeon-Ji Song, Kiyoung Kwon, Junoh Lee, Jin-Hwa Kim, Byoung-Tak Zhang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/c6d142352d390250536b89bfdaddf7fe93b72d5e.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 3D高斯形状变形用于动态场景重建
tldr: 从模糊单目视频重建动态3D场景因运动模糊使几何一致性困难。本文提出Kinematics-GS，将模糊建模为运动对齐的变形，并引入运动学先验，沿运动轨迹重参数化高斯形状，避免形状坍塌，无需辅助运动监督。通过时间变形方差分解动静成分，并采用粗到细变形策略捕捉全局运动和细节。在自建数据集上验证了方法的有效性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 模糊单目视频中运动模糊导致几何一致性困难。
method: 引入运动学先验重参数化高斯形状，分解动静成分。
result: 有效重建动态场景，避免形状坍塌。
conclusion: Kinematics-GS通过运动学先验改善了模糊动态场景的重建。
---

## Abstract
Reconstructing dynamic 3D scenes from blurry monocular videos is challenging because motion-induced blur entangles object motion and geometry, hindering geometric consistency. We present Kinematics-GS, a kinematics-aware framework that models blur as motion-aligned deformation and introduces a kinematic prior to reparameterize Gaussian shapes along motion trajectories, thereby mitigating degenerate shape collapse without auxiliary motion supervision. To stabilize optimization, we decompose scenes into dynamic and static components using temporal deformation variance and employ a coarse-to-fine deformation strategy to capture both global motion and fine-grained details. We also introduce a challenging real-world dataset of deformable and elastic objects exhibiting non-rigid motion with spatially non-uniform motion blur that obscures geometric cues. Extensive experiments on real-world benchmarks with realistic motion blur demonstrate that Kinematics-GS outperforms prior methods by a clear margin in monocular dynamic scene reconstruction, highlighting its effectiveness in handling complex and non-rigid motion scenarios.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

### 研究背景与动机

从模糊单目视频中重建动态3D场景是计算机视觉中的一个极具挑战性的问题。核心困难在于：**运动模糊将物体的运动信息与几何形状信息纠缠在一起**，导致几何一致性难以维持。

具体而言，现实世界中的动态场景普遍存在以下问题：

- 单目输入本身具有从二维到三维重建的固有歧义性；
- 运动模糊在相机曝光过程中将物体运动沿轨迹积分，抹去了高频细节，模糊了精确的空间线索；
- 现有动态3DGS方法大多在合成或简化基准上评估，难以泛化到真实世界的复杂运动场景；
- 传统方法通常假设输入图像清晰且相机位姿精确，严重依赖预训练光流估计器等辅助网络，但在手持拍摄等真实场景中这些假设不成立。

### 论文定位

本文发表于**ICML 2026**（第43届国际机器学习大会），作者来自首尔大学AI研究所、神经科学交叉项目、光州科学技术院和NAVER AI Lab。

---

## 二、方法论

### 核心思想

Kinematics-GS是一个**运动学感知框架**，将模糊建模为**与运动对齐的变形**，并引入**运动学先验**沿运动轨迹重新参数化高斯形状，从而在无需辅助运动监督的情况下缓解退化性形状坍塌问题。

### 关键技术细节

**1. 3D高斯表示基础**

场景表示为一系列3D高斯集合，每个高斯由位置 $\mathbf{x} \in \mathbb{R}^3$、不透明度 $\alpha$、球谐系数 $\mathbf{c}$ 和协方差矩阵 $\mathbf{\Sigma}$ 参数化。协方差分解为旋转矩阵 $\mathbf{R}$ 和对角缩放矩阵 $\mathbf{S}$。可微分光栅化过程中，3D高斯被投影到图像平面，最终像素颜色通过体积 $\alpha$-混合合成。

**2. 动静分解**

给定规范高斯 $G$，变形网络 $F_\theta$ 预测每个高斯在时间 $t$ 的偏移量 $(\delta\mathbf{x}_t, \delta\mathbf{r}_t, \delta\mathbf{s}_t)$。通过计算位置偏移在时间窗口上的**变形方差分数 $K$** 来识别动态与静态高斯：
$$K(\{\delta\mathbf{x}_t\}_{t=1}^T) = \frac{1}{T}\sum_{t=1}^T \|\delta\mathbf{x}_t - \bar{\delta}\mathbf{x}_t\|^2$$

方差超过阈值 $\tau$ 的高斯归类为动态集 $\mathcal{G}_d$，其余为静态集 $\mathcal{G}_s$。这一机制无需辅助分割即可解耦动静成分。

**3. 粗到细变形策略**

- **粗变形**：聚合邻近动态高斯的偏移量，强制执行空间相干性，捕捉稳定的低频运动模式；
- **细变形**：基于可学习的逐高斯动态特征向量 $f_t$ 和时间编码 $\gamma(t)$ 预测残差变形，恢复精细的非刚性细节；
- 最终变形 = 粗变形 + 细变形。

**4. 运动学基构建与协方差细化**

为每个动态高斯基于其平移运动构建局部运动学坐标框架：

- 瞬时速度 $\mathbf{v} = \delta\mathbf{x}_t / \Delta t$，主运动轴 $\mathbf{u}_z = \mathbf{v} / \|\mathbf{v}\|$；
- 通过叉积构建正交基 $\{\mathbf{u}_x, \mathbf{u}_y, \mathbf{u}_z\}$；
- 旋转矩阵 $\tilde{\mathbf{R}} = [\mathbf{u}_x \mid \mathbf{u}_y \mid \mathbf{u}_z] \in SO(3)$。

协方差沿运动方向的尺度被显式建模为：
$$s'_z = \sigma_z + \eta \|\mathbf{v}\| \Delta t$$

其中 $\|\mathbf{v}\|\Delta t$ 表示曝光期间的空间位移，$\eta$ 为对齐因子。这一机制使动态高斯沿运动轨迹拉长，与物理运动一致，抑制了噪声估计引起的虚假延伸。

**5. 训练目标**

复合损失函数平衡了高保真光度重建与几何正则化：
$$\mathcal{L} = \mathcal{L}_{\text{img}} + \lambda_{\text{reg}}\mathcal{L}_{\text{reg}} + \lambda_{\text{ani}}\mathcal{L}_{\text{ani}}$$

- $\mathcal{L}_{\text{img}}$：L1与D-SSIM组合的光度损失；
- $\mathcal{L}_{\text{reg}}$：惩罚静态/动态高斯的位置偏移幅度；
- $\mathcal{L}_{\text{ani}}$：防止变形过程中高斯退化出极端长宽比。

---

## 三、实验设计

### 使用的数据集

论文在以下数据集上进行了评估：

| 数据集 | 描述 | 场景数量 |
|--------|------|----------|
| **BARD-GS数据集** | 使用同步GoPro相机拍摄的真实世界模糊动态场景，提供模糊帧用于训练、清晰图像用于评估 | 8个场景（Toycar, Rubikcube, Card, Cubedesk, Shark Spin, Walk, Kitchen, Microlab） |
| **NeRF-DS iPhone数据集** | 动态镜面物体场景，包含非刚性运动和具有挑战性的镜面效果，单目视频序列自带轻微运动模糊 | 6个场景（Basin, Bell, Cup, Plate, Press等） |
| **DEOs数据集（自建）** | 变形与弹性物体数据集，包含棉花娃娃、泡沫骰子、弹跳球等，在室内外环境用iPhone 15 Pro拍摄，捕捉弹性、压缩等复杂物理行为 | 多个场景（含Roll Dice, Red Dice, Bounce, Strike等） |

### 对比方法

对比了以下SOTA方法：

- **4DGS**（Wu et al., 2024）：4D时空高斯方法；
- **D3DGS**（Yang et al., 2024a）：基于变形场的动态3DGS；
- **Deblur3DGS**（Lee et al., 2024a）：专门处理模糊的动态3DGS；
- **GauFre**（Liang et al., 2025）：同期工作，也包含动静分解；
- 对4DGS和D3DGS还评估了**两阶段变体**（+MPRNet预去模糊）。

### 评估指标

使用标准指标：**PSNR**（峰值信噪比）、**SSIM**（结构相似性）、**LPIPS**（学习感知图像块相似度）。

---

## 四、资源与算力

论文明确说明：框架使用**PyTorch**实现，在**单张NVIDIA RTX 3090 GPU**上训练。采用FLoD的多分辨率训练策略，从LoD 1到LoD 5逐步优化，总计**30,000次迭代**。推理速度方面，方法在所有数据集上均达到**200-700 FPS**的实时渲染帧率。

---

## 五、实验数量与充分性

### 实验数量

论文进行了以下多组实验：

1. **主实验**：在BARD-GS（8场景）和DEOs数据集上与5种基线方法（含变体共7种配置）进行全面定量对比；
2. **NeRF-DS实验**：在6个动态镜面场景上评估对复杂外观的鲁棒性；
3. **消融实验**：在Toycar和Roll Dice两个场景上，分别移除粗到细策略（C.F.）、运动学正则化（K.R.）、位置正则化（$\mathcal{L}_{\text{reg}}$）和各向异性损失（$\mathcal{L}_{\text{ani}}$），并测试不同阈值 $\tau$；
4. **定性对比**：多组可视化结果对比（图3、图4、图5）；
5. **计算效率评估**：推理速度测试。

### 充分性与公平性评估

**优点**：
- 数据集覆盖全面：包含公开基准（BARD-GS、NeRF-DS）和自建数据集（DEOs），兼顾刚性/非刚性运动、漫反射/镜面外观；
- 基线选择合理：涵盖4D类方法和变形类方法，且对未显式处理模糊的方法增加了去模糊预处理变体，对比公平；
- 消融实验系统：逐一验证了各个核心组件的贡献。

**潜在不足**：
- 消融实验仅在两个场景上进行，覆盖面有限；
- 阈值 $\tau$ 的敏感性分析显示不同阈值对结果影响显著（PSNR从24.6降至17.1），但未充分讨论如何在实际应用中自适应选择阈值。

---

## 六、主要结论与发现

1. **Kinematics-GS在所有评估指标上一致性地优于现有方法**，在BARD-GS和DEOs数据集上取得最佳PSNR、SSIM和LPIPS；
2. **运动学引导的协方差细化有效解决了模糊下的不稳定各向异性变形问题**，使优化更稳定；
3. **动静分解机制无需辅助分割即可有效解耦场景成分**，防止静态区域吸收动态变形；
4. **方法在处理非刚性运动和严重运动模糊方面表现出显著优势**，生成的几何结构更清晰、时间一致性更好；
5. **在动态镜面物体上也能保持几何结构和镜面外观**，捕捉视角相关的反射。

---

## 七、方法亮点

1. **运动学先验的创新引入**：将物理运动学原理融入3DGS框架，通过沿运动轨迹重参数化高斯形状来正则化变形，这是对纯数据驱动方法的实质性改进；
2. **无需辅助监督**：与依赖预训练光流估计器的方法不同，Kinematics-GS无需额外运动监督即可工作；
3. **动静分解的自适应性**：基于变形方差自动分解动静成分，无需手工标注或辅助分割网络；
4. **粗到细策略稳定优化**：有效避免严重模糊下直接优化高分辨率变形易陷入局部最小的问题；
5. **真实世界数据贡献**：自建的DEOs数据集填补了现有基准在变形/弹性物体和真实运动模糊方面的空白；
6. **高效推理**：200-700 FPS的实时渲染能力使其具备实际部署潜力。

---

## 八、不足与局限

1. **阈值 $\tau$ 的敏感性**：动静分离阈值对性能影响显著，从实验看 $\tau=2\times10^{-5}$ 最优，但实际场景中如何自适应确定阈值未充分讨论；
2. **消融实验覆盖不足**：消融仅在2个场景上进行，结论的泛化性有待更广泛的验证；
3. **与纯去模糊方法的对比有限**：虽然对比了Deblur3DGS，但对更广泛的视频去模糊+动态重建组合方法的系统性对比可以进一步加强；
4. **相机位姿假设**：论文未详细说明在严重运动模糊下相机位姿估计的处理方式，而位姿误差可能影响重建质量；
5. **应用范围限制**：方法针对单目视频设计，未探讨在多视角或更复杂光照条件下的泛化能力；
6. **物理先验的局限性**：运动学先验基于瞬时速度假设，对于速度突变或复杂拓扑变化（如物体分裂/合并）的场景可能面临挑战。

---

（完）
