---
title: "GSFixer: Improving 3D Gaussian Splatting with Reference-Guided Video Diffusion Priors"
title_zh: GSFixer：利用参考引导视频扩散先验改进3D高斯泼溅
authors: "Xingyilang Yin, Qi Zhang, Jiahao Chang, Ying Feng, Qingnan Fan, Xi Yang, Chi-Man Pun, Huaqi Zhang, Xiaodong Cun"
date: 2026-04-30
pdf: "https://openreview.net/pdf/065e379205a0ffce09e3383c80c82c313cc5e5aa.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 基于扩散先验的稀疏视图3DGS新视图合成
tldr: 针对稀疏输入下3D高斯泼溅重建产生明显伪影的问题，本文提出GSFixer，利用参考引导的视频扩散模型，在成对的伪影渲染图与清晰帧上训练，以生成与观测保持一致的先验信息，显著提升稀疏视图新视图合成的质量与一致性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 稀疏视图下3DGS重建信息不足，易产生伪影且与观测不一致。
method: 基于DiT视频扩散模型，引入参考引导条件，训练生成与输入一致的高质量内容。
result: 在稀疏视图新视图合成任务中显著减少伪影，提高保真度。
conclusion: 参考引导视频扩散先验能有效提升稀疏输入下3DGS的重建效果。
---

## Abstract
Reconstructing 3D scenes using 3D Gaussian Splatting (3DGS) from sparse views is an ill-posed problem due to insufficient information, often resulting in noticeable artifacts. While recent approaches have sought to leverage generative priors to complete information for under-constrained regions, they struggle to generate content that remains consistent with input observations. To address this challenge, we propose GSFixer, a novel framework designed to improve the quality of 3DGS representations reconstructed from sparse inputs. The core of our approach is the reference-guided video restoration model, built upon a DiT-based video diffusion model trained on paired artifact 3DGS renders and clean frames with additional reference-based conditions. Considering the input sparse views as references, our model integrates both 2D semantic and 3D geometric features of reference views extracted from the visual geometry foundation model, enhancing the semantic coherence and 3D consistency when fixing artifact novel views. Furthermore, we introduce a reference-guided trajectory sampling strategy that ensures both angular coverage and view quality, further enhancing reconstruction fidelity. Considering the lack of suitable benchmarks for 3DGS artifact restoration evaluation, we present DL3DV-Res which contains artifact frames rendered using low-quality 3DGS. Extensive experiments demonstrate our GSFixer outperforms current state-of-the-art methods in 3DGS artifact restoration and sparse-view 3D reconstruction. Project page: https://github.com/GVCLab/GSFixer.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

**研究背景**：3D高斯泼溅（3D Gaussian Splatting, 3DGS）在密集视角输入下能实现高质量的新视图合成与高效渲染，但在稀疏视角（sparse-view）场景中，由于观测信息严重不足，重建问题本质上是**不适定（ill-posed）** 的。这会导致重建结果出现明显的几何畸变、结构不完整等伪影（artifacts）。

**研究动机**：现有方法尝试利用生成式先验（generative priors）来补全欠约束区域的信息，但生成的內容往往**难以与输入观测保持一致性**。因此，如何在对伪影区域进行修复的同时，确保修复结果与稀疏输入视角在语义和几何上保持一致，是核心挑战。

**整体含义**：GSFixer 的目标是**为稀疏输入下的 3DGS 重建提供一种“修复-优化”框架**——先利用参考引导的视频扩散模型修复伪影渲染图，再将修复后的高质量新视图反馈到 3DGS 的迭代优化中，从而提升最终的重建质量。

---

## 2. 方法论

**核心思想**：GSFixer 的核心是一个**参考引导的视频修复模型（reference-guided video restoration model）**，基于 **DiT（Diffusion Transformer）架构的视频扩散模型**（具体为 CogVideoX-5B-I2V）构建。该模型在**成对的伪影 3DGS 渲染图与干净帧**上进行训练，并额外引入了基于参考视图的条件信息。

**关键技术细节**：

- **多层级参考特征提取**：将输入的稀疏视角视为参考视图（reference views），从中提取两类特征——
  - **2D 语义特征**：使用 **DINOv2** 提取；
  - **3D 几何特征**：使用 **VGGT**（视觉几何基础模型）提取。
  
  这两类特征共同引导视频扩散过程，增强修复新视图时的**语义连贯性**与**3D 一致性**。

- **参考引导的轨迹采样策略（Reference-Guided Trajectory Sampling）** ：在迭代优化过程中，轨迹采样至关重要。GSFixer 引入了一种兼顾**角度覆盖**和**视图质量**的采样策略，进一步提升重建保真度。

- **迭代优化流程**：首先从稀疏视角构建一个初始的低质量 3DGS 表示，沿新相机轨迹渲染出带有伪影的帧，送入修复模型得到修复后的高质量新视图，再将修复视图**加入训练集**，以迭代方式进一步监督 3DGS 优化。

- **训练配置**：基于预训练的 CogVideoX-5B-I2V 初始化参数，训练时帧分辨率固定为 **480×720**，视频长度为 **49 帧**。共进行 **10,000 次迭代**，学习率为 **2×10⁻⁵**，采用 warm-up 策略和 **AdamW 优化器**。

---

## 3. 实验设计

**训练数据集**：
- 从 **DL3DV-10K 数据集**中随机选取 **1,000 个场景** 用于训练 GSFixer。通过稀疏视角 3D 重建策略，构建成对的伪影渲染图与干净帧。

**评估基准（Benchmark）** ：

- **DL3DV-Res**：由于缺乏适合 3DGS 伪影修复评估的基准，GSFixer 团队自行提出了 **DL3DV-Res** 基准数据集，包含由低质量 3DGS 渲染出的伪影帧。
- **DL3DV-Benchmark**：用于稀疏视图 3D 重建任务的评估。
- **Mip-NeRF 360 数据集**：同样用于稀疏视图 3D 重建任务。

**对比方法**：
- **3DGS 伪影修复任务**：对比 **Difix3D+** 和 **GenFusion** 等近期生成式方法。
- **稀疏视图 3D 重建任务**：对比 **3DGS（基线）** 、**ReconFusion**、**GenFusion** 等方法。

**评估指标**：采用 **PSNR**、**SSIM**、**LPIPS** 等标准图像质量指标。

---

## 4. 资源与算力

论文明确说明了训练资源：
- **GPU 型号与数量**：**8 块 NVIDIA H20 GPU**。
- **批量大小**：**batch size = 8**。
- **训练时长**：约 **4 天**。

---

## 5. 实验数量与充分性

**实验组数**：
- **伪影修复任务**：在 DL3DV-Res 基准上进行定量与定性对比。
- **稀疏视图 3D 重建任务**：分别在 **DL3DV-Benchmark** 和 **Mip-NeRF 360** 两个数据集上，对 **3 视图、6 视图、9 视图**三种稀疏程度进行对比评估。
- **定性对比**：提供了多组可视化结果，直观展示修复效果。

**充分性与客观性判断**：
- 实验覆盖了**两个任务**（伪影修复 + 稀疏重建）、**多个数据集**（DL3DV-Res、DL3DV-Benchmark、Mip-NeRF 360）、**多种视图数量**（3/6/9 views），设计较为全面。
- 对比了多个 **SOTA 基线方法**，且明确指出部分结果由其官方实现复现（† 和 ‡ 标注），体现了一定的**公平性**。
- 但论文摘要和元数据中未提及**消融实验**的具体细节（如移除参考引导、移除 2D/3D 特征等），从现有信息难以判断消融研究的充分性。

---

## 6. 主要结论与发现

- **GSFixer 在 3DGS 伪影修复和稀疏视图 3D 重建两个任务上均显著优于现有 SOTA 方法**。
- **参考引导机制有效**：通过同时引入 2D 语义特征（DINOv2）和 3D 几何特征（VGGT），GSFixer 能够在修复伪影的同时保持与输入视图的一致性。
- **参考引导的轨迹采样策略**能够兼顾视角覆盖与视图质量，进一步提升重建保真度。
- **迭代优化策略有效**：将修复后的新视图加入训练集进行迭代监督，能够持续提升 3DGS 的重建质量。

---

## 7. 优点

- **创新的参考引导机制**：首次在视频扩散模型中**同时引入 2D 语义和 3D 几何双重引导**，有效解决了生成内容与输入观测不一致的核心痛点。
- **端到端的“修复-优化”框架**：将扩散模型修复与 3DGS 迭代优化有机结合，形成正向循环。
- **贡献了专用基准数据集**：针对 3DGS 伪影修复评估缺乏合适基准的问题，提出了 **DL3DV-Res** 数据集，为该方向后续研究提供了标准化评估平台。
- **方法可泛化**：基于 DiT 的视频扩散模型（CogVideoX）具有良好的扩展性，框架设计可推广至其他 3D 表示方法。
- **代码与模型开源**：项目代码、预训练模型和基准数据集均已公开，有利于学术社区复现和进一步研究。

---

## 8. 不足与局限

- **计算资源需求较高**：在 8×H20 GPU 上训练约 4 天，对普通研究者而言训练成本不菲。
- **训练数据依赖**：模型训练依赖 DL3DV-10K 中 1,000 个场景的配对数据，数据构建流程复杂，可能限制其在更广泛场景下的泛化能力。
- **消融实验信息不足**：从现有材料中未看到对关键设计（如移除 2D/3D 特征引导、不同轨迹采样策略对比等）的系统性消融分析，难以量化各模块的独立贡献。
- **仅针对 3DGS**：方法专门针对 3DGS 的伪影问题设计，是否可迁移到 NeRF 等其他 3D 表示方法尚不明确。
- **真实场景验证有限**：实验主要在 DL3DV 和 Mip-NeRF 360 等数据集上进行，在更具挑战性的真实世界稀疏视图场景（如户外大场景、动态场景）中的表现有待进一步验证。

---

（完）
