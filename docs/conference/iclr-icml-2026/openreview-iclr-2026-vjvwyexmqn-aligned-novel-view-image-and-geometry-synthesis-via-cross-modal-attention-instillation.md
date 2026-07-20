---
title: Aligned Novel View Image and Geometry Synthesis via Cross-modal Attention Instillation
title_zh: 基于跨模态注意力注入的对齐新视角图像与几何合成
authors: "Min-Seop Kwak, Junho Kim, Sangdoo Yun, Dongyoon Han, Taekyung Kim, Seungryong Kim, Jin-Hwa Kim"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=vjvwYexMQn"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 基于扩散的扭曲与修复实现稀疏输入新视角合成
tldr: 本文提出扩散式新视角图像与几何合成框架，通过扭曲-修复方法和跨模态注意力注入，利用现成几何预测器从稀疏参考图像生成对齐的新视角图像和几何，无需密集位姿或领域受限的生成模型。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有新视角合成依赖密集位姿或领域内生成模型，泛化性受限。
method: 采用扭曲-修复范式，结合跨模态注意力注入确保图像和几何对齐。
result: 在稀疏输入下生成对齐的新视角图像和几何，泛化性强。
conclusion: 该多任务扩散框架为稀疏新视角合成提供了有效方案。
---

## Abstract
We introduce a diffusion-based framework that generates aligned novel view images and geometries via a warping‐and‐inpainting methodology. Unlike prior methods that require dense posed images or pose-embedded generative models limited to in‐domain views, our method leverages off‐the‐shelf geometry predictors to predict partial geometries viewed from reference images, and formulates novel view synthesis as an inpainting task for both image and geometry. To ensure accurate alignment between the generated image and geometry, we propose cross-modal attention instillation where the attention maps from an image diffusion branch are injected into a parallel geometry diffusion branch during both training and inference. This multi-task approach achieves synergistic effects, facilitating both geometrically robust image synthesis and geometry prediction. We further introduce proximity‐based mesh conditioning to integrate depth and normal cues, interpolating between point cloud and filtering erroneously predicted geometry from influencing the generation process. Empirically, our method achieves high-fidelity extrapolative view synthesis, delivers competitive reconstruction under interpolation settings, and produces geometrically aligned point clouds as 3D completion.

---

## 论文详细总结（自动生成）

## 1. 核心问题与研究动机

**研究问题**：从稀疏且无位姿（unposed）的参考图像出发，合成任意目标视角下的新视角图像，并同时生成与之精确对齐的几何信息（点云/深度图）。

**研究动机**：现有新视角合成方法存在明显短板——
- **基于前馈（feedforward）的方法**（如PixelSplat、MVSplat）：在插值（interpolative）场景下表现良好，但缺乏外推（extrapolative）能力，无法合成被遮挡或未见区域。
- **基于扩散的生成式方法**（如Zero123、ViewCrafter）：具备外推能力，但依赖已知相机位姿作为输入，且生成位姿范围受限于训练分布，难以处理任意位姿。
- **已有扭曲-修复方法**（如LucidDreamer、GenWarp）：虽采用类似思路，但主要依赖2D图像修复，缺乏对3D结构的完整理解，在大视角差异场景中表现不佳。

本文提出**MoAI（Cross-modal Attention Instillation）框架**，将新视角合成重新定义为图像与几何的联合修复任务，利用现成几何预测器从无位姿参考图像中提取几何信息，无需密集位姿或领域受限的生成模型。

---

## 2. 方法论

### 核心思想

采用**扭曲-修复（warping-and-inpainting）范式**：先用现成几何预测器从参考图像中预测部分几何（点云）并投影到目标视角，再利用扩散模型对缺失区域进行图像与几何的联合修复。

### 关键技术细节

**（1）新视角图像生成（§3.1）** 

- 使用现成几何预测器（VGGT）从参考图像中估计相机位姿 $\phi = \{\pi_n\}_{n=1}^N$ 和点云 $\{P_n\}_{n=1}^N$。
- 将各参考视角的点云合并为单一3D点云 $P = \bigcup_{n=1}^N P_n$，投影到目标视角：$P_t^\Pi = \Pi(P, \pi_t)$。
- 投影点云作为稀疏几何对应条件，输入图像去噪U-Net；同时采用聚合注意力（aggregated attention）机制，让目标视角与多张参考图像同时进行自注意力与交叉注意力。

**（2）跨模态注意力注入（MoAI，§3.2）** 

- **核心创新**：将图像去噪U-Net的空间注意力图注入到并行的几何去噪U-Net中，替换后者的空间注意力图。
- 令 $K^I$、$Q^I$ 为图像U-Net的键与查询特征，$V^P$ 为几何U-Net的值特征，几何分支的注意力计算为：
  $$\text{Attention}(Q^I, K^I, V^P) = \text{softmax}\left(\frac{Q^I (K^I)^T}{\sqrt{d_k}}\right) V^P$$
  
- **双向增益**：图像分支获得几何完成任务的确定性训练信号约束，生成更一致的图像；几何分支利用图像域的丰富语义信息提升几何完成质量。

**（3）基于邻近性的网格 conditioning（§3.3）** 

- 将稀疏点云通过**球旋转算法（ball-pivoting）** 转换为网格表示，减少错误投影。
- 将网格的深度图 $D_t^\Pi$ 和法向图 $N_t^\Pi$ 通道级联到对应条件中：
  $$c_t = [E(X_t^\Pi), D_t^\Pi, N_t^\Pi, M_t], \quad c_n^r = [E(X_n), D_n, N_n, \mathbf{1}]$$
- 应用法向掩码：剔除法向与目标视角方向偏差超过90°的网格平面，过滤错误投影。

---

## 3. 实验设计

### 数据集

- **训练**：RealEstate10K、Co3D、MVImgNet，使用VGGT生成伪真实几何作为监督信号。
- **零样本测试（Zero-shot）** ：DTU数据集——所有模型均未在该数据集上训练。
- **域内测试（In-domain）** ：RealEstate10K。

### Benchmark与对比方法

| 设定 | 对比方法 |
|------|---------|
| **2-view 前馈方法** | PixelSplat、MVSplat、NoPoSplat、DUSt3R |
| **1-view 扭曲-修复方法** | LucidDreamer、GenWarp |
| **大规模模型方法** | LVSM、ZeroNVS、ViewCrafter |

评估指标：PSNR↑、SSIM↑、LPIPS↓。

### 外推 vs. 插值定义

- **外推（Extrapolative）** ：目标相机位置位于参考相机位置凸包之外。
- **插值（Interpolative）** ：目标位置在参考位置凸包之内。

---

## 4. 资源与算力

**文中明确提到**：
- 测试硬件：**NVIDIA A6000 GPU**。
- 推理时间对比：MoAI平均 **9.67秒**；ViewCrafter（25帧）需209.19秒；ZeroNVS需约1.42小时（4000次迭代）进行NeRF蒸馏。

**未明确说明**：
- GPU型号、数量及训练时长等训练阶段的具体算力信息**未在文中披露**。

---

## 5. 实验数量与充分性

**实验设置**：
- **零样本测试**（DTU）：单视角与双视角设定下均进行外推与插值评估。
- **域内测试**（RealEstate10K）：双视角外推与插值评估。
- **定性对比**：与大规模模型方法在真实场景上的可视化对比。
- **消融实验**：文中提及了消融研究（项目页面有“Ablation”章节），但**PDF正文中未提供具体定量表格**。

**充分性评价**：
- ✅ 覆盖零样本和域内两种泛化场景，评估维度全面。
- ✅ 对比方法涵盖前馈、扭曲-修复、大规模生成模型三大类别，基线丰富。
- ✅ 定量指标（PSNR/SSIM/LPIPS）与定性可视化并重。
- ⚠️ 消融实验的具体量化结果在正文中缺失，需查阅附录或项目页面。

---

## 6. 主要结论与发现

1. **外推性能领先**：MoAI在DTU零样本外推设定下取得PSNR 15.58（2-view）和15.56（1-view），显著优于所有对比方法。
2. **插值性能具竞争力**：在RealEstate10K插值设定下PSNR达24.23，与最优前馈方法（NoPoSplat 25.03）差距不大。
3. **几何对齐有效**：跨模态注意力注入确保生成的图像与点云在空间上精确对齐，无需额外的NeRF/3DGS优化。
4. **推理高效**：平均9.67秒/场景，远快于ZeroNVS（数小时）和ViewCrafter（数百秒）。
5. **零样本泛化能力强**：在未见的DTU数据集上仍能保持高质量生成，证明模型具备良好的泛化能力。

---

## 7. 方法亮点

| 亮点 | 说明 |
|------|------|
| **无需位姿输入** | 利用现成几何预测器（VGGT）从参考图像中联合估计位姿与点云，摆脱了密集位姿标注的依赖 |
| **跨模态注意力注入（MoAI）** | 训练和推理阶段均生效，实现图像与几何的精确对齐，且避免了有害的跨模态特征混合 |
| **多任务协同增益** | 图像生成与几何预测相互促进——几何任务约束图像生成，图像语义提升几何质量 |
| **近邻网格 conditioning** | 有效过滤现成几何预测器产生的噪声与错误投影，提升生成鲁棒性 |
| **轻量高效** | 基于Stable Diffusion 2.1微调，无需大规模视频扩散模型，推理速度快 |

---

## 8. 不足与局限

| 局限 | 说明 |
|------|------|
| **依赖现成几何预测器质量** | 方法性能受限于VGGT等外部几何预测器的精度，尤其在极端外推场景下预测误差可能放大 |
| **训练资源未披露** | 训练阶段的具体GPU配置、数量、时长未在文中说明，可复现性信息不完整 |
| **消融实验量化缺失** | 虽提及消融研究，但正文中未提供具体定量表格，难以量化各模块的独立贡献 |
| **复杂场景泛化待验证** | 实验主要在室内（RealEstate10K）和物体-centric（Co3D、DTU）数据上进行，对复杂室外大场景的泛化能力尚不明确 |
| **几何输出形式有限** | 输出为点云/深度图，而非显式的网格或可渲染的3D Gaussian表示，与下游3D应用对接可能需要额外处理 |

---

（完）
