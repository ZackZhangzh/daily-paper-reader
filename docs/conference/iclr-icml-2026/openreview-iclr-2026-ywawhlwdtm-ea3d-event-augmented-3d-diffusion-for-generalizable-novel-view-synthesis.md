---
title: "EA3D: Event-Augmented 3D Diffusion for Generalizable Novel View Synthesis"
title_zh: EA3D：事件增强的3D扩散可泛化新视图合成
authors: "Wangbo Yu, Chaoran Feng, Jianing Li, Aofan Zhang, Zhenyu Tang, Mingyi Guo, Wei Zhang, Zhengyu Ma, Li Yuan, Yonghong Tian"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=YwawhlWdtm"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 稀疏RGB和事件数据用于新视图合成
tldr: 现有新视图合成方法要么仅依赖RGB帧在快速运动下鲁棒性差，要么需逐场景优化事件数据难以扩展。本文提出EA3D框架，联合异步事件和稀疏RGB输入，通过可学习的EA渲染器融合外观与几何特征，构建视点依赖的3D特征并条件化扩散模型，实现可泛化新视图合成。实验证明其在大幅运动场景下优于现有方法。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有方法在快速运动下鲁棒性差或需逐场景优化，难以平衡效率与泛化。
method: 联合事件流和稀疏RGB，通过可学习渲染器融合外观与几何特征，构建视点依赖3D特征。
result: 在快速运动场景中实现高质量新视图合成，且无需逐场景优化。
conclusion: 事件增强有效提升稀疏输入下的新视图合成泛化能力和鲁棒性。
---

## Abstract
We introduce **EA3D**, an Event-Augmented 3D Diffusion framework for generalizable novel view synthesis from event streams and sparse RGB inputs.  Existing approaches either rely solely on RGB frames for generalizable synthesis, which limits their robustness under rapid camera motion, or require per-scene optimization to exploit event data, undermining scalability.
EA3D addresses these limitations by jointly leveraging the complementary strengths of asynchronous events and RGB imagery. 
At its core lies a learnable EA-Renderer, which constructs view-dependent 3D features within target camera frustums by fusing appearance cues from RGB frames with geometric structure extracted from adaptively sliced event voxels. 
These features condition a 3D-informed diffusion model, enabling high-fidelity and temporally consistent novel view generation along arbitrary camera trajectories. 
To further enhance scalability and generalization, we develop the Event-DL3DV dataset, a large-scale 3D benchmark pairing diverse synthetic event streams with photorealistic multi-view RGB images and depth maps. 
Extensive experiments on both real-world and synthetic event data demonstrate that EA3D consistently outperforms optimization-based and generalizable baselines, achieving superior fidelity and cross-scene generalization.

---

## 论文详细总结（自动生成）

# EA3D 论文深度分析总结

## 1. 核心问题与研究动机

新视图合成（Novel View Synthesis）与3D场景重建是计算机视觉的基础任务，广泛应用于机器人、自动驾驶和场景理解等领域。近年来，NeRF和3D Gaussian Splatting（3DGS）等方法的出现大幅提升了新视图渲染的写实程度。然而，这些方法在以下两个关键场景下面临严峻挑战：

- **快速相机运动下性能骤降**：高速运动限制了可用训练视图的数量，导致欠约束的重建问题，易出现过拟合或收敛到平凡解；同时，大帧间距离破坏了特征匹配的平滑运动假设，导致SfM管线中相机姿态初始化不可靠。
- **泛化能力不足**：现有方法大多依赖逐场景优化（per-scene optimization），难以扩展到新场景。

为应对上述挑战，研究者开始探索事件相机（Event Camera）的应用。事件相机作为仿生传感器，具有高动态范围和微秒级时间分辨率，在快速运动等挑战性条件下表现优异。然而，现有的事件驱动新视图合成方法仍然依赖逐场景优化，未能形成一个通用的、无需训练的生成先验。

**EA3D的核心目标**：联合异步事件流（asynchronous events）与稀疏RGB输入，构建一个**可泛化的、无需逐场景优化的新视图合成框架**，在快速运动和大视角变化场景下实现高保真、时序一致的新视图生成。

## 2. 方法论

### 2.1 核心思想

EA3D的核心思想是**利用事件流提供的密集时序几何先验来弥补稀疏RGB外观信息的不足**，并通过扩散模型实现高质量的新视图生成。整体框架如图1所示，包含两大核心组件：

1. **事件增强特征渲染器（EA-Renderer）** ：将连续事件流和稀疏RGB帧投影到目标相机视锥内，构建视点依赖的3D特征。
2. **3D感知扩散模型（3D-informed Diffusion Model）** ：以EA-Renderer输出的3D特征为条件，合成写实且一致的新视图。

### 2.2 关键技术细节

**（1）事件增强特征渲染器（EA-Renderer）**

事件流在快速运动下提供了密集、连续的3D场景几何先验，但缺乏颜色和纹理等外观信息；RGB帧则提供丰富的外观信息，但受限于稀疏采样。EA-Renderer的核心设计是：

- 从**自适应切片的事件体素网格**（adaptively sliced event voxel grids）中提取具有遮挡鲁棒性的几何特征；
- 从**RGB帧**中提取外观特征（appearance cues）；
- 通过**特征融合模块**将两者投影到目标相机视锥内，构建视点依赖的3D特征。

**（2）3D感知扩散模型**

EA-Renderer构建的3D特征被送入一个**3D感知的条件视频扩散模型**（conditional video diffusion model），作为生成条件。该扩散模型能够：

- 沿**任意相机轨迹**生成高保真新视图；
- 保证**时序一致性**，避免逐帧独立合成导致的视角不一致问题。

**（3）Event-DL3DV数据集**

为支持大规模训练和跨场景泛化，作者构建了**Event-DL3DV**——一个大规模3D基准数据集，包含多样化的合成事件流、逼真的多视角RGB图像和深度图。

### 2.3 训练与推理流程

- **训练**：在Event-DL3DV大规模数据集上训练EA3D的扩散模型，学习跨场景的生成先验。
- **推理**：给定稀疏RGB帧和连续事件流，EA3D以**前馈（feed-forward）方式**直接合成新视图，**无需任何逐场景优化**。

## 3. 实验设计

### 3.1 数据集与场景

| 数据集 | 用途 | 规模/设置 |
|--------|------|-----------|
| **DL3DV**（Ling et al., 2024） | 野外场景（in-the-wild）对比 | 140个测试场景（不重叠于训练数据） |
| **Tanks-and-Temples (T&T)**（Knapitsch et al., 2017） | 野外场景对比 | 10个场景 |
| **DSEC**（Gehrig et al., 2021） | 真实事件数据验证 | 7个静态驾驶序列（含锐利RGB帧与真实事件数据） |
| **Event-DL3DV**（自建） | 训练与泛化评估 | 大规模合成数据，含多视角RGB、深度图与合成事件流 |

### 3.2 实验设置

- **输入视图数量**：在2、4、6个输入视图下分别评估。
- **视图范围**（相邻输入视图间的帧数）：DL3DV上为400帧，T&T上为300帧，DSEC上为50帧。
- **事件仿真**：使用vid2e（Hu et al., 2021）从RGB帧合成事件流，对比阈值设为0.2。
- **评估指标**：PSNR ↑、SSIM ↑、LPIPS ↓。

### 3.3 对比方法

对比方法分为两类：

- **基于优化的方法（Optimization-based）** ：E-NeRF（Klenk et al., 2023）、Event3DGS（Han et al., 2024）。
- **可泛化的RGB-only方法（Generalizable RGB-only）** ：ViewCrafter（Yu et al., 2025）、NVS-Solver（You et al., 2025）。

## 4. 资源与算力

**论文中未明确说明训练所使用的GPU型号、数量和训练时长。** 但在推理与优化时间对比中（Table 4），报告了在**单张NVIDIA A100 GPU（40 GB）** 上的推理时间和显存占用：

| 方法 | 推理时间（h） | 优化时间（h） | 总时间（h） | 推理显存（GB） |
|------|-------------|-------------|------------|--------------|
| E-NeRF | 0.12 | 3.50 | 3.62 | 20 |
| Event3DGS | 0.0002 | 0.80 | 0.8002 | 3 |
| NVS-Solver | 0.18 | 0 | 0.18 | 21 |
| ViewCrafter | 0.06 | 0 | 0.06 | 24 |
| **EA3D (Ours)** | **0.03** | **0** | **0.03** | **28** |



EA3D的推理时间为**0.03小时（约1.8分钟）** ，单次前向传播可生成**49帧**。虽因扩散模型推理显存较高（28 GB），但总运行时间远低于基于优化的基线方法。上游MVS模块（VGGT）仅需1秒。

> **注意**：训练阶段的算力消耗（GPU型号、数量、训练时长、总迭代轮数等）在摘要和可见正文中均未披露。

## 5. 实验数量与充分性

### 5.1 实验组数概览

| 实验类型 | 内容 | 充分性评价 |
|---------|------|-----------|
| **主实验（野外场景）** | DL3DV（140场景）+ T&T（10场景），2/4/6视图 | ✅ 场景多样、规模充足 |
| **主实验（真实事件）** | DSEC（7序列），2/4/6视图 | ✅ 验证了模拟到真实的泛化 |
| **消融实验1** | 移除事件几何特征 | ✅ 验证了事件信息的必要性 |
| **消融实验2** | 移除重建损失 | ✅ 验证了损失函数设计 |
| **鲁棒性实验1** | 事件轨迹与新颖视图轨迹的错位（ATE） | ✅ 验证了轨迹无关的几何特征提取能力 |
| **鲁棒性实验2** | 不同对比阈值 | ✅ 验证了事件仿真参数的鲁棒性 |
| **鲁棒性实验3** | 运动模糊输入 | ✅ 验证了事件引导在模糊场景下的优势 |
| **效率对比** | 推理/优化时间、显存占用 | ✅ 量化了计算效率优势 |

### 5.2 充分性评估

**实验设计较为充分且客观**：

- **覆盖全面**：同时涵盖合成数据（DL3DV/T&T）和真实事件数据（DSEC），验证了模拟到真实的泛化能力。
- **对比公平**：对于基于优化的基线，严格遵循其原始设置，从真实新视图序列仿真事件流；而EA3D采用更具挑战性的设置——仿真事件流与真实新视图**不对齐**。
- **消融系统**：从模型设计（事件几何特征、损失函数）到鲁棒性（轨迹错位、对比阈值、运动模糊）均有覆盖。
- **可复现性**：实验配置（视图数量、视图范围、对比阈值等）报告详细。

**潜在不足**：

- 真实事件数据仅来自DSEC的**静态驾驶场景**，缺乏动态场景或室内场景的真实事件验证。
- 训练数据Event-DL3DV为**合成数据**，从合成到真实的泛化虽经DSEC验证，但场景类型（驾驶）较为单一。

## 6. 主要结论与发现

1. **事件增强显著提升稀疏输入下的新视图合成质量**：在最具挑战性的2视图设置下，EA3D在DL3DV/T&T上PSNR达24.89，远超RGB-only基线（ViewCrafter 18.71、NVS-Solver 18.68）和优化基线（E-NeRF 14.63、Event3DGS 14.63）。

2. **无需逐场景优化即可实现跨场景泛化**：EA3D作为前馈模型，在140个未见过的DL3DV场景和10个T&T场景上均表现优异。

3. **从合成事件到真实事件的泛化能力**：在DSEC真实事件数据上，EA3D（PSNR 24.89@2视图）显著优于所有基线，证明模型能有效从合成训练数据泛化到真实事件输入。

4. **事件几何特征是性能提升的关键**：消融实验表明，移除事件几何特征后，PSNR从21.54降至17.62（运动模糊场景），验证了事件信息的不可或缺性。

5. **对轨迹错位具有鲁棒性**：EA3D不依赖事件相机轨迹与新视图轨迹的精确对齐，能有效提取轨迹无关的几何线索。

6. **效率优势显著**：推理时间仅0.03小时（约1.8分钟），远低于基于优化的方法。

## 7. 方法亮点

1. **首次将事件流与可泛化扩散模型结合**：打破了以往事件驱动方法必须逐场景优化的范式，实现了无需训练的跨场景新视图合成。

2. **EA-Renderer的创新设计**：通过自适应切片事件体素提取几何特征，并与RGB外观特征融合，构建视点依赖的3D特征，有效弥补了稀疏RGB在快速运动下的信息不足。

3. **3D感知扩散模型保证时序一致性**：不同于逐帧独立合成的图像扩散模型，EA3D的视频扩散模型能显式建模帧间依赖，在大视角变化下保持结构一致性。

4. **Event-DL3DV数据集的贡献**：首个将多样化合成事件流与逼真多视角RGB/深度图配对的大规模3D基准，为事件驱动的新视图合成研究提供了训练基础。

5. **灵活的新视图轨迹支持**：不同于E-NeRF和Event3DGS等仅能沿事件相机轨迹合成视图，EA3D支持**沿任意相机轨迹**合成新视图，无需与事件轨迹严格对齐。

6. **对运动模糊和轨迹错位的鲁棒性**：通过训练时混合锐利和模糊RGB输入，以及对错位事件轨迹的鲁棒性验证，展示了在实际部署中的可靠性。

## 8. 不足与局限

1. **推理显存占用较高**：EA3D推理时显存需求达28 GB，对硬件资源要求较高，可能限制在边缘设备上的部署。

2. **真实事件数据验证场景有限**：真实事件实验仅在DSEC的**静态驾驶场景**（7个序列）上进行，缺乏对动态物体场景、室内场景或极端光照条件下真实事件数据的验证。

3. **训练数据为合成事件**：Event-DL3DV完全基于仿真生成（vid2e），真实事件与合成事件之间可能存在域差距，虽经DSEC验证但覆盖场景有限。

4. **运动模糊处理依赖仿真**：运动模糊鲁棒性实验基于EvDeblurNeRF数据集，同样为仿真/受控环境，真实极端运动模糊场景下的表现有待进一步验证。

5. **训练成本未披露**：论文未报告训练阶段的GPU数量、训练时长等关键算力信息，不利于其他研究者评估复现成本。

6. **与最新RGB-only方法的对比时效性**：对比的RGB-only基线为ViewCrafter和NVS-Solver，均为2025年工作，未涉及2026年可能更新的方法。

7. **动态场景的适应性**：实验场景以静态场景为主（DL3DV、T&T为静态场景，DSEC为静态驾驶序列），对包含显著动态物体的场景的泛化能力尚不明确。

---

（完）
