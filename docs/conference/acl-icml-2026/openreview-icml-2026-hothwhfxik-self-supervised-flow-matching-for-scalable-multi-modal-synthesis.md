---
title: Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis
title_zh: 自监督流匹配用于可扩展多模态合成
authors: "Hila Chefer, Patrick Esser, Dominik Lorenz, Dustin Podell, Vikash Raja, Vinh Tong, Antonio Torralba, Robin Rombach"
date: 2026-04-30
pdf: "https://openreview.net/pdf/df95dabc5dd945dcd8c644feef48b515d66fc98a.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 自监督流匹配用于多模态生成合成
tldr: 本文提出自监督流匹配范式Self-Flow，将表示学习融入生成框架，通过双时间步调度对标记施加异构噪声，强制模型从破坏信息中推断缺失内容，从而学习强语义表示。该方法在多模态合成任务上实现更快的收敛和更优生成质量，摆脱了对外部预训练模型的依赖。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有流模型依赖外部模型获取语义表示，目标不一致且扩展性差。
method: 提出双时间步调度的自监督流匹配，整合表示学习。
result: 在多模态合成上加速收敛并提升生成质量，无需外部模型。
conclusion: 自监督流匹配可同步学习语义表示与生成能力。
---

## Abstract
Strong semantic representations improve the convergence and generation quality of diffusion and flow models. Existing approaches largely rely on external models, which require separate training, operate on misaligned objectives, and exhibit unexpected scaling behavior. We argue that this dependence arises from the model's training objective, which poses a denoising task with little incentive to learn semantic representations. We introduce *Self-Flow*: a self-supervised flow matching paradigm that integrates representation learning within the generative framework. Our key mechanism, *Dual-Timestep Scheduling*, applies heterogeneous noise levels across tokens, creating an information asymmetry that forces the model to infer missing information from corrupted inputs. This drives learning strong representations alongside generative capabilities without external supervision. Our method generalizes across modalities and enables multi-modal training while following expected scaling laws, achieving superior image, video, and audio generation.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义（研究动机和背景）

**研究动机**

现有的扩散模型和流模型虽然生成能力强大，但其训练目标本质上是“去噪任务”——模型只需学会从噪声中恢复局部细节即可，**缺乏学习高层语义表示的内在激励**。这导致模型虽然能生成逼真的图像，但对“画的是什么”缺乏深层理解。

**现有方案的局限性：外部对齐（External Alignment）**

当前的主流做法是引入外部预训练模型（如 DINOv2）来提供语义监督信号，典型代表是 REPA 方法。但这种方法存在三大根本缺陷：

1. **目标不一致**：外部编码器是为判别式任务（如图像分类/聚类）训练的，与生成任务的目标存在本质错位。
2. **违背规模定律（Scaling Law）** ：如图 2(a) 所示，使用更强的外部编码器（如 DINOv2-L、DINOv3-H+）反而导致生成质量下降——**编码器越强，FID 越差**。
3. **扩展性差**：外部模型需要单独训练，且难以在多模态场景下协同工作。

**核心问题与含义**

论文提出的核心问题是：**能否设计一个统一的训练框架，让生成模型在“生成”的同时“自主学习”语义表示，完全摆脱对外部模型的依赖？** Self-Flow 正是对这一问题的肯定回答——它证明生成与表示学习可以在同一个框架内协同完成，且遵循健康的规模定律。


## 2. 论文提出的方法论：核心思想与关键技术细节

### 核心思想

Self-Flow 将**自监督表示学习**直接融入**流匹配（Flow Matching）** 的生成框架中，通过制造“信息不对称”强制模型从破坏的输入中推断缺失信息，从而同步学习强语义表示和生成能力。

### 关键技术：双时间步调度（Dual-Timestep Scheduling）

标准流匹配对所有 token 施加**均匀噪声**，模型仅靠局部相关性即可完成去噪，缺乏学习全局语义的动力。Self-Flow 的核心创新在于打破这种均匀性：

**步骤 1：采样两个时间步**
- 采样两个不同的噪声时间步 \( t \) 和 \( s \)

**步骤 2：异构加噪（Heterogeneous Noise）**
- 使用随机掩码 \( M \) 将 token 分为两组：
  - **被掩码的 token**：施加噪声水平 \( s \)（通常**更干净**，作为“上下文线索”）
  - **未被掩码的 token**：施加噪声水平 \( t \)（通常**噪声更大**，需要被“修复”）
- 这创造了**信息不对称**：模型必须利用少量较干净的 token 去理解并修复大量被严重破坏的 token

**步骤 3：教师-学生架构**
- **教师网络（EMA）** ：所有 token 统一使用 \( \tau_{\min} = \min(t, s) \) 加噪（更干净的版本）
- **学生网络**：接收上述异构加噪的输入
- **自监督损失**：学生网络学习**预测教师网络的内部表示**（特征对齐），同时学习标准的流匹配去噪损失

**关键设计考量：**
- 不能简单用 \( \max(t, s) \) 对所有 token 加噪，因为混合使用 \( t/s \) 能鼓励模型利用较干净的 token 进行空间理解（类似 MAE 的思想）
- 但不能像 MAE 那样使用 0/1 掩码，否则会导致训练-推理不一致
- 不能每个 token 独立随机采样噪声强度，同样会导致训练-推理不一致

**模型架构基础**：基于 SiT-XL/2，关键修改是**逐 token 时间步条件化（per-token timestep conditioning）** ，使每个 token 在训练时可拥有不同的噪声水平。


## 3. 实验设计：数据集、Benchmark 与对比方法

### 数据集与场景

| 模态 | 数据集/规模 | 用途 |
|------|------------|------|
| **图像** | ImageNet 256×256 | 文生图基准测试 |
| **多模态联合训练** | 200M 图像 + 6M 视频 | 4B 参数 FLUX.2 骨干网络的高分辨率微调（100k 步） |
| **视频/音频** | 多模态生成场景 | 验证方法泛化性 |

### Benchmark 与对比方法

**图像生成（ImageNet 256×256）：**
- **主要对比**：REPA（外部对齐方法的代表，使用 DINOv2 作为外部编码器）
- **消融对比**：标准流匹配（Vanilla Flow Matching）
- **额外对比**：结合表示自编码器（RAE）后的性能

**多模态联合训练：**
- 对比标准流匹配（Vanilla）在 4B FLUX.2 模型上的表现
- 评估维度：结构一致性（人脸、手部）、运动质量、文本渲染准确性


## 4. 资源与算力

论文中**未明确披露**具体的 GPU 型号、数量或训练总时长等算力细节。

**可推断的信息：**
- ImageNet 256×256 的 Self-Flow 模型 checkpoint 已公开，可通过 Hugging Face 下载
- 推理代码支持**多 GPU（推荐 8 卡）** 并行生成 50k 样本
- 多模态实验使用 **4B 参数 FLUX.2 骨干网络**，在 200M 图像 + 6M 视频数据上进行 **100k 步高分辨率微调**

但具体的预训练算力、GPU 型号等关键信息在可获取的公开材料中均未说明。


## 5. 实验数量与充分性

### 实验组数概览

| 实验类型 | 内容 | 充分性判断 |
|---------|------|-----------|
| **图像生成基准** | ImageNet 256×256 上的 FID 对比（Self-Flow vs. REPA vs. Vanilla） | ✅ 核心指标充分 |
| **表示质量验证** | 线性探测（Linear Probing）评估早期/中层特征质量 | ✅ 直接验证表示学习效果 |
| **外部编码器规模定律** | 对比 DINOv2-B / DINOv2-L / DINOv3-H+ 的 Scaling 行为 | ✅ 有力揭示外部对齐的根本缺陷 |
| **多模态联合训练** | 4B 模型在图像+视频+音频上的联合生成 | ✅ 验证跨模态泛化性 |
| **自编码器兼容性** | 在不同自编码器上验证一致性提升 | ✅ 验证方法鲁棒性 |
| **RAE 组合实验** | Self-Flow + RAE 的 FID 提升（3.24 → 2.95） | ✅ 验证与现有技术的兼容性 |

### 充分性与客观性评价

**优点：**
- 实验设计**层次清晰**：从单模态图像生成 → 表示质量验证 → 多模态扩展 → 兼容性验证
- 对比**公平**：REPA 使用在 ImageNet 上训练过的 DINOv2，对 REPA 而言是**有利条件**，而 Self-Flow 完全不使用外部模型——在对手“占便宜”的情况下仍能胜出
- 揭示了外部对齐的**根本性 Scaling 悖论**，从原理上支撑了方法的必要性

**不足：**
- 算力细节的缺失使得实验的**可复现成本评估**不够透明
- 公开信息中未看到**详细的超参数敏感性分析**或**不同 mask 比例**的消融实验


## 6. 论文的主要结论与发现

1. **Self-Flow 在 ImageNet 256×256 上达到 FID 5.70，超越 REPA（FID 5.89）** ，且**完全不使用任何外部编码器**。

2. **收敛速度提升约 2.8 倍**：Self-Flow 比 REPA 收敛更快，且持续提升，而 REPA 在训练后期趋于平台期。

3. **表示学习有效**：通过线性探测验证，Self-Flow 早期和中层特征显著优于标准流匹配。

4. **外部对齐存在 Scaling 悖论**：更强的外部编码器（DINOv2-L → DINOv3-H+）反而导致生成质量下降，而 Self-Flow 遵循健康的规模定律。

5. **跨模态泛化成功**：在图像、视频、音频多模态联合生成中，Self-Flow 显著提升了结构一致性（人脸、手部）、运动质量和文本渲染准确性。

6. **与 RAE 兼容**：结合表示自编码器后，FID 从 3.24 进一步改善至 2.95。


## 7. 优点：方法与实验设计的亮点

1. **首创性**：首次将自监督表示学习与流匹配生成框架在**同一目标函数**内统一，证明生成与表示可以“同炉共炼”。

2. **彻底摆脱外部依赖**：不依赖任何预训练编码器，消除了外部模型带来的目标错位、Scaling 异常等问题。

3. **双时间步调度的设计精巧**：通过异构噪声制造信息不对称，既避免了 MAE 式 0/1 掩码的训练-推理不一致问题，又保留了“从上下文推断缺失”的自监督学习机制。

4. **方法论通用性强**：可自然扩展到单模态和多模态联合训练，且与不同自编码器兼容。

5. **实验设计公平且有洞察力**：明确指出 REPA 的 DINOv2 在 ImageNet 上训练过、对 REPA 是有利条件，反而凸显了 Self-Flow 的优势；同时通过 Scaling 实验揭示了外部对齐的根本性缺陷。


## 8. 不足与局限

1. **算力信息不透明**：论文未明确披露训练所用的 GPU 型号、数量、总训练时长等关键资源信息，不利于研究者评估方法的训练成本和可复现性。

2. **消融实验细节有限**：公开信息中未详细呈现 mask 比例、\( t \) 与 \( s \) 的采样策略、不同噪声组合的敏感性分析等关键消融实验。

3. **多模态实验规模描述不够精确**：虽然提到了 4B 模型、200M 图像、6M 视频等数据，但“100k 步高分辨率微调”是在什么基座模型上进行的、预训练阶段如何等细节不够清晰。

4. **潜在的选择偏差**：多模态实验的定性展示（图像样本对比）可能带有主观选择性，缺乏系统性的多模态定量指标（如视频 FVD、音频相关指标等）的完整报告。

5. **应用限制**：方法依赖于逐 token 时间步条件化的架构修改，对于已有标准流匹配模型的迁移可能需要架构调整。

6. **理论分析深度有限**：公开信息中未深入探讨为什么异构噪声能有效促进语义表示学习的理论机制（如信息论层面的分析）。


（完）
