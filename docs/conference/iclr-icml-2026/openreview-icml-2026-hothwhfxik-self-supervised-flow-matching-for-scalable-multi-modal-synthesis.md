---
title: Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis
title_zh: 自监督流匹配：可扩展的多模态合成框架
authors: "Hila Chefer, Patrick Esser, Dominik Lorenz, Dustin Podell, Vikash Raja, Vinh Tong, Antonio Torralba, Robin Rombach"
date: 2026-04-30
pdf: "https://openreview.net/pdf/df95dabc5dd945dcd8c644feef48b515d66fc98a.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 自监督流匹配用于多模态合成
tldr: 现有流匹配依赖外部模型获取语义表示，目标错位且扩展性差。本文提出Self-Flow，通过双时间步调度对令牌施加异质噪声，制造信息不对称，迫使模型从损坏输入中推断信息，从而内嵌表示学习。实验表明该方法加速收敛、提升生成质量，且无需外部监督，具有良好的扩展性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 摆脱流匹配对外部语义模型的依赖，实现表示学习与生成一体化。
method: 双时间步调度异质噪声，强制模型学习语义表示，结合自监督目标。
result: 收敛更快，生成质量更高，无需外部模型，扩展性优异。
conclusion: 自监督流匹配有效融合表示学习，为多模态生成提供新途径。
---

## Abstract
Strong semantic representations improve the convergence and generation quality of diffusion and flow models. Existing approaches largely rely on external models, which require separate training, operate on misaligned objectives, and exhibit unexpected scaling behavior. We argue that this dependence arises from the model's training objective, which poses a denoising task with little incentive to learn semantic representations. We introduce *Self-Flow*: a self-supervised flow matching paradigm that integrates representation learning within the generative framework. Our key mechanism, *Dual-Timestep Scheduling*, applies heterogeneous noise levels across tokens, creating an information asymmetry that forces the model to infer missing information from corrupted inputs. This drives learning strong representations alongside generative capabilities without external supervision. Our method generalizes across modalities and enables multi-modal training while following expected scaling laws, achieving superior image, video, and audio generation.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

**研究动机**：扩散模型和流匹配模型的生成质量与收敛速度，高度依赖于其内部是否习得了强语义表征。现有方法通常依赖外部预训练编码器（如DINO、DINOv2、SigLIP等）来提供语义监督。然而，这种做法存在根本性缺陷：

- 外部模型需要单独训练，且其训练目标（如判别式聚类）与生成任务的目标错位；
- 外部对齐无法遵循预期的扩展律——更强的编码器反而可能带来收益递减甚至负收益；
- 在多模态场景下（视频、音频），外部编码器往往反而损害性能；
- 难以预判哪个编码器对特定任务有效。

**核心问题**：流匹配模型的训练目标本质上是一个去噪任务，模型几乎没有动力去学习语义表征。因此，论文提出核心问题：**能否让流匹配模型在生成训练过程中内在地习得强语义表征，从而完全摆脱对外部监督模型的依赖？**

**整体含义**：本文提出 **Self-Flow**，一种自监督流匹配范式，将表征学习与生成建模统一在同一个框架内。该方法无需任何外部监督，即可在图像、视频、音频等多种模态上实现优越的生成质量，同时遵循预期的扩展规律。


## 二、方法论

### 核心思想

Self-Flow 的核心洞察是：**通过制造信息不对称，迫使模型在去噪过程中学习语义表征**。标准流匹配对所有令牌施加相同水平的噪声，模型只需局部去噪即可完成任务，缺乏学习全局语义的动力。Self-Flow 通过对不同令牌施加异质噪声，创造了一种“信息鸿沟”，使模型必须利用较干净的令牌来推断较嘈杂的令牌，从而被迫建立全局语义理解。

### 关键技术：双时间步调度（Dual-Timestep Scheduling）

具体实现方式如下：

1. **采样两个不同的时间步**：从分布中采样两个时间步 $t$ 和 $s$（通常一个较大/较 noisy，一个较小/较 clean）。
2. **随机掩码分配**：通过随机掩码 $M$ 将这两个噪声水平异质地分配给不同的令牌——
   - 被掩码的令牌接受噪声水平 $s$（通常较干净）
   - 未被掩码的令牌接受噪声水平 $t$（通常较嘈杂）
3. **信息不对称**：模型必须利用较干净的上下文令牌来推断被严重破坏的令牌，从而被迫学习强语义表征。
4. **EMA 教师网络**：一个指数移动平均（EMA）版本的模型看到“更干净”的版本（使用 $\tau_{\min} = \min(t,s)$ 加噪），学生模型则学习预测教师网络的内部表征。

**关键架构改动**：模型采用**逐令牌时间步条件化**（per-token timestep conditioning），允许每个令牌在训练期间具有不同的噪声水平。

### 训练框架

Self-Flow 将流匹配目标与自监督特征重建目标相结合。模型在完成标准流匹配去噪任务的同时，还需要预测教师网络（EMA 版本）对较干净输入的内部表征，从而将表征学习内嵌于生成训练过程中。


## 三、实验设计

### 数据集与场景

论文在多个模态和任务上进行了评估：

| 模态 | 任务/场景 | 关键数据规模 |
|------|----------|-------------|
| **图像** | ImageNet 256×256 类别到图像生成 | 标准 ImageNet 基准 |
| **多模态** | 联合图像、视频、音频生成 | 4B 参数 FLUX.2 骨干网络；6M 训练视频 + 200M 训练图像 |

### 基准与对比方法

- **图像生成**：对比 REPA（领先的外部对齐方法，使用 DINOv2）、标准流匹配（vanilla flow matching）、以及结合表示自编码器（RAE）的变体。
- **多模态生成**：对比标准流匹配（vanilla flow matching）。
- **表征质量评估**：通过线性探测（linear probing）评估学习到的表征强度。

### 评估指标

- 图像生成：FID（Fréchet Inception Distance）、IS（Inception Score）、Precision、Recall。
- 多模态生成：结构连贯性（人脸、手部）、运动质量、文本渲染准确性等定性指标。


## 四、资源与算力

论文**未明确披露**训练所使用的具体 GPU 型号、数量或训练时长等算力细节。

不过，从公开信息中可以推断部分线索：
- 论文提供了 ImageNet 256×256 上训练的模型 checkpoint（`selfflow_imagenet256.pt`）；
- 多模态实验使用 **4B 参数 FLUX.2 骨干网络**，在 100k 步高分辨率微调下完成；
- 推理代码支持 8 GPU 并行采样（`torchrun --nproc_per_node=8`）。


## 五、实验数量与充分性

### 实验组数

论文进行了多组实验，覆盖以下维度：

1. **图像生成实验**：ImageNet 256×256 上的类别条件生成；
2. **多模态联合训练实验**：单个 4B 模型同时生成图像、视频和音频；
3. **与外部对齐方法的对比**：REPA（DINOv2）、标准流匹配等；
4. **扩展性实验**：验证 Self-Flow 是否遵循预期扩展律；
5. **表征质量评估**：线性探测评估中间层和早期层特征；
6. **消融/机制分析**：虽未在摘要中详述，但 GitHub 和 HuggingFace 页面提及了对双时间步调度机制的分析。

### 充分性与客观性评价

**优点**：
- 覆盖了图像、视频、音频三种模态，验证了方法的通用性；
- 与 REPA 的对比具有说服力——REPA 使用的 DINOv2 在 ImageNet 上受过大量训练，而 Self-Flow 完全不使用任何外部监督，仍取得更优结果；
- 验证了扩展性，表明方法在大规模下表现稳定。

**潜在不足**：
- 图像实验目前仅看到 ImageNet 256×256 的结果，是否在更高分辨率（如 512×1024）或其他图像数据集上验证尚不明确；
- 多模态实验的“100k 步高分辨率微调”是在低分辨率多模态模型基础上进行的，基线和实验设置的具体细节需要阅读全文才能全面评估；
- 存在后续研究（如《From SRA to Self-Flow: Data Augmentation or Self-Supervision?》）对 Self-Flow 的机制解释提出挑战，认为性能提升可能主要来自“沿噪声维度的数据增强”而非“干净令牌指导噪声令牌”的交互——这表明 Self-Flow 的机制解释可能还需要更严格的消融实验来验证。


## 六、主要结论与发现

1. **无需外部监督，超越外部对齐方法**：在 ImageNet 256×256 上，Self-Flow 取得了 **FID 5.70**，优于 REPA 的 FID 5.89。这是首个在无需外部编码器的情况下超越外部对齐性能的自监督方法。

2. **收敛速度显著提升**：Self-Flow 的收敛速度比 REPA 快约 **2.8 倍**，且 REPA 会趋于平台期而 Self-Flow 持续改进。

3. **与 RAE 结合进一步改进**：当与表示自编码器（RAE）结合时，Self-Flow 将 FID 从 3.24 提升至 2.95。

4. **学习到更强的表征**：线性探测验证了 Self-Flow 的早期和中间层特征显著优于标准流匹配。

5. **多模态生成质量提升**：在 4B 参数的多模态模型中，Self-Flow 在结构连贯性（人脸、手部）、运动质量和文本渲染准确性上均显著优于标准流匹配。

6. **遵循预期扩展律**：与外部对齐方法不同，Self-Flow 在模型规模扩展时表现出预期的性能提升。


## 七、方法论的优点

1. **彻底摆脱外部依赖**：无需任何外部预训练编码器或监督信号，实现了真正的端到端自监督训练。

2. **统一表征学习与生成**：将两个通常分离的目标融合在单一框架中，避免了目标错位问题。

3. **模态无关的通用性**：方法本身不依赖任何模态特定的先验，可自然推广到图像、视频、音频等多种模态。

4. **良好的扩展性**：与外部对齐方法不同，Self-Flow 遵循预期的扩展规律，随着模型和数据规模增大持续受益。

5. **收敛效率高**：比 REPA 快约 2.8 倍的收敛速度，显著降低了训练成本。

6. **架构改动简洁**：核心改动是“逐令牌时间步条件化”，实现简洁且易于集成到现有流匹配模型中。


## 八、不足与局限

1. **机制解释存在争议**：后续研究（如《From SRA to Self-Flow: Data Augmentation or Self-Supervision?》）对 Self-Flow 的解释提出质疑，认为双时间步调度的收益可能主要来自数据增强效应而非自监督交互。如果这一质疑成立，Self-Flow 的核心故事可能需要修正。

2. **算力细节未披露**：论文未明确说明训练所需的具体 GPU 型号、数量和时长，不利于其他研究者评估复现成本。

3. **实验覆盖范围有限**：
   - 图像生成主要聚焦 ImageNet 256×256，更高分辨率和其他数据集上的验证不足；
   - 多模态实验的“100k 步微调”设置可能需要更详细的基线说明。

4. **实际部署的潜在偏差风险**：作为生成模型，Self-Flow 继承了训练数据中的偏见和风险（如人脸生成中的种族/性别偏差），论文未讨论相应的安全与伦理考量。

5. **应用限制**：虽然方法本身是模态无关的，但实际效果可能依赖于足够的模型规模（如 4B 参数的多模态实验），在小型模型上的收益尚不明确。


（完）
