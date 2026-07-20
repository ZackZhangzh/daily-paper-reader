---
title: Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis
title_zh: 自监督流匹配用于可扩展多模态合成
authors: "Hila Chefer, Patrick Esser, Dominik Lorenz, Dustin Podell, Vikash Raja, Vinh Tong, Antonio Torralba, Robin Rombach"
date: 2026-04-30
pdf: "https://openreview.net/pdf/df95dabc5dd945dcd8c644feef48b515d66fc98a.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 自监督流匹配用于多模态合成
tldr: 该论文提出自监督流匹配范式Self-Flow，通过双时间步调度在不同token施加异质噪声，强制模型从损坏输入推断信息，从而内化语义表示，提升生成质量和收敛速度。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有流匹配依赖外部模型学习语义表示。
method: 自监督双时间步调度，强制学习语义表示。
result: 提升生成质量和收敛速度，可扩展。
conclusion: 内部表示学习增强流匹配。
---

## Abstract
Strong semantic representations improve the convergence and generation quality of diffusion and flow models. Existing approaches largely rely on external models, which require separate training, operate on misaligned objectives, and exhibit unexpected scaling behavior. We argue that this dependence arises from the model's training objective, which poses a denoising task with little incentive to learn semantic representations. We introduce *Self-Flow*: a self-supervised flow matching paradigm that integrates representation learning within the generative framework. Our key mechanism, *Dual-Timestep Scheduling*, applies heterogeneous noise levels across tokens, creating an information asymmetry that forces the model to infer missing information from corrupted inputs. This drives learning strong representations alongside generative capabilities without external supervision. Our method generalizes across modalities and enables multi-modal training while following expected scaling laws, achieving superior image, video, and audio generation.

---

## 论文详细总结（自动生成）

# Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis 论文总结


## 1. 核心问题与整体含义（研究动机与背景）

**研究动机**：扩散模型和流匹配（Flow Matching）模型的生成质量与收敛速度高度依赖强大的语义表示。然而，现有方法大多依赖外部预训练模型（如 DINOv2、CLIP）来提供语义监督。这种依赖存在三个核心问题：

- **需要额外训练**：外部模型需单独训练，增加流程复杂度；
- **目标错配**：判别式模型的表征目标与生成式模型的目标本质上不一致；
- **扩展行为异常**：外部对齐方法出现“越强反而越差”的反常现象——DINOv2-B（最弱）取得最佳 FID，而 DINOv3-H+（最强）表现反而最差。

**核心主张**：论文认为上述依赖的根源在于流匹配的训练目标本质上是去噪任务，模型缺乏学习语义表示的内在动力。为此，作者提出 **Self-Flow**——一种自监督流匹配范式，将表示学习直接融入生成框架内部，无需任何外部监督。


## 2. 方法论

### 2.1 核心思想

Self-Flow 的核心思想是：**在流匹配训练过程中制造“信息不对称”，迫使模型从损坏的输入中推断缺失信息，从而内化语义表示**。这一过程在统一的生成框架内同时完成生成能力训练和表示学习，不依赖任何外部编码器。

### 2.2 关键技术：双时间步调度（Dual-Timestep Scheduling, DTS）

标准流匹配对所有 token 施加**均匀噪声**，模型仅靠局部相关性即可完成去噪，无需学习全局语义。DTS 打破了这一局限：

1. **采样两个时间步**：从噪声分布中采样两个不同的时间步 \( t \) 和 \( s \)；
2. **随机掩码分组**：以掩码比例 \( \mathcal{R}_M \le 0.5 \) 将输入 token 随机分为两组；
3. **施加异质噪声**：被掩码的 token 施加较高级别的噪声（如 \( t \)），未被掩码的 token 施加较低级别的噪声（如 \( s \)），形成异质噪声输入 \( \mathbf{x}_\tau \)；
4. **平衡设计**：DTS 在“完全均匀加噪”（无法诱导全局关系）和“完全异质加噪”（训练-推理不一致）之间取得平衡，保持 token 级时间步分布的稳定性。

值得注意的是，**即使不添加任何自监督损失，仅应用 DTS 也能带来一定的生成质量提升**——因为较干净的 token 为模型提供了上下文参考，迫使模型考虑全局关系。

### 2.3 自监督表示学习：教师-学生框架

在 DTS 基础上，Self-Flow 进一步引入自监督表示学习：

- **学生网络 \( f_\theta \)**：接收异质噪声输入 \( \mathbf{x}_\tau \)（部分 token 噪声高、部分噪声低）；
- **教师网络 \( f_{\theta'} \)**：EMA（指数移动平均）版本，接收**统一使用最低噪声级别 \( \tau_{\min} = \min(t, s) \)** 加噪的更干净输入 \( \mathbf{x}_{\tau_{\min}} \)；
- **表示对齐损失**：学生从某一层 \( l \) 提取的特征，需预测教师从更深层 \( k \) 提取的特征，使用余弦距离作为损失函数。这利用了深层特征语义更强的特性。

### 2.4 统一训练目标

总损失函数结合了生成损失和表示学习损失：

\[
\mathcal{L} = \mathcal{L}_{\text{gen}} + \gamma \cdot \mathcal{L}_{\text{rep}}
\]

其中 \( \gamma \) 为平衡生成任务与表示学习任务的缩放因子。


## 3. 实验设计

### 3.1 数据集与场景

论文在**图像、视频、音频**三种模态上进行了全面的实验验证：

| 模态 | 数据集/规模 | 说明 |
|------|------------|------|
| 图像（ImageNet） | ImageNet 256×256 | 类条件图像生成 |
| 文本到图像 | 多模态数据集 | FID 与 CLIP Score 评估 |
| 文本到视频 | 6M 训练视频 | FVD 评估 |
| 文本到音频 | 多模态数据集 | 音频生成质量评估 |
| 联合多模态训练 | 200M 图像 + 6M 视频 + 2M 音视频对 | 单一 4B 参数 FLUX.2 主干网络 |

### 3.2 对比方法

主要对比基线包括：

- **Vanilla Flow Matching**：标准流匹配（无外部对齐）；
- **REPA**：代表性外部对齐方法（使用 DINOv2 等预训练编码器进行特征对齐）；
- **其他外部对齐方法**：如使用 V-JEPA2 等视频专用编码器的方法。


## 4. 资源与算力

论文**未明确披露**训练所用 GPU 型号、数量及总训练时长等具体算力信息。但根据公开信息可做如下推断：

- 核心实验使用 **4B 参数 FLUX.2 主干网络**进行多模态联合训练；
- 高分辨率微调仅需 **100k 步**，数据规模为 200M 图像和 6M 视频；
- GitHub 提供的推理代码推荐使用 **8 GPU**（`--nproc_per_node=8`）进行 50k 样本生成。

总体而言，论文更强调方法的**效率和可扩展性**，但具体算力消耗的量化数据未在摘要及公开材料中明确给出。


## 5. 实验数量与充分性

**实验覆盖范围**：

1. **单模态图像生成**（ImageNet 类条件生成、文本到图像生成）；
2. **单模态视频生成**（文本到视频）；
3. **单模态音频生成**（文本到音频）；
4. **联合多模态训练**（单一模型同时生成图像、视频、音频）；
5. **消融实验**：验证 DTS 单独作用的有效性；
6. **扩展性实验**：验证模型规模增大时性能的预期扩展行为；
7. **不同自编码器的泛化实验**：证明方法对自编码器类型不敏感。

**充分性与客观性评价**：

- 实验覆盖**三种模态 + 联合训练**，维度较全面；
- 对比基线选择了最具代表性的外部对齐方法 REPA，对比对象合理；
- 在 ImageNet 上报告了 FID（5.70）、文本到图像报告了 FID 和 CLIP Score、视频报告了 FVD（47.81）等标准化指标，具有可复现性和可比性；
- 消融实验验证了核心组件（DTS）的有效性，增强了论证的因果归因。

整体而言，实验设计**较为充分且客观**。


## 6. 主要结论与发现

1. **Self-Flow 在图像生成上超越外部对齐方法**：ImageNet 256×256 上取得 **FID 5.70**，优于 REPA 的 5.89，成为**首个在 ImageNet 上超越外部对齐性能的自监督方法**；

2. **文本到图像合成取得最优结果**：FID 3.61、CLIP Score 30.88，同时超越 REPA 及其他基线；

3. **视频生成取得最佳 FVD**：文本到视频任务上 FVD 达 **47.81**；

4. **多模态联合训练效果显著**：单一 4B 模型在图像、视频、音频三种模态上同时取得提升，在**结构一致性（人脸、手部）、运动质量和文本渲染准确性**方面改进尤为明显；

5. **遵循预期扩展规律**：模型性能随参数量增加而稳定提升，克服了外部对齐方法“越强越差”的反常扩展行为；

6. **推理速度提升**：媒体报道称训练速度提升达 **2.8 倍**。


## 7. 方法亮点

1. **彻底摆脱外部依赖**：首次在流匹配框架中实现无需任何外部预训练编码器的自监督表示学习，消除了外部模型训练、目标错配和扩展异常三大问题；

2. **DTS 机制的优雅性**：仅通过调整训练时的噪声施加策略（异质噪声 vs 均匀噪声），即可诱导模型学习全局语义关系，且 DTS 本身即使无自监督损失也能带来提升；

3. **统一框架、一箭双雕**：生成能力与表示学习在同一框架内同时完成，无需两阶段训练；

4. **模态无关的通用性**：方法作用于 latent token 层面，可无缝迁移至图像、视频、音频等多种模态；

5. **工程友好**：对自编码器类型不敏感，且高分辨率微调仅需 100k 步，效率较高。


## 8. 不足与局限

1. **算力信息不透明**：论文未明确披露训练所需的具体 GPU 型号、数量和时长，不利于研究者评估复现成本；

2. **多模态联合训练数据规模有限**：高分辨率微调仅基于 6M 视频和 200M 图像，与工业级大规模训练（如数十亿级数据）相比仍有差距，方法的极限扩展能力尚待验证；

3. **定性评估为主、定量细节有限**：公开材料中大量展示定性对比结果，部分任务的详细定量指标（如音频生成的具体数值）披露不够充分；

4. **应用范围验证有限**：虽提及在具身 AI 的视频-动作联合预测任务上有效，但实际应用场景的覆盖仍较有限，实际部署中的泛化性有待更多验证；

5. **理论分析深度不足**：对“为何信息不对称能诱导语义表示学习”的内在机理，公开材料中缺乏更深层次的理论分析；

6. **依赖 EMA 教师引入额外计算**：教师-学生框架需维护 EMA 模型，增加了训练时的内存和计算开销。

---

（完）
