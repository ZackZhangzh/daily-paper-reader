---
title: "CausNVS: Autoregressive Multi-view Diffusion for Flexible 3D Novel View Synthesis"
title_zh: CausNVS：自回归多视图扩散用于灵活三维新视角合成
authors: "Xin Kong, Daniel Watson, Yannick Strümpler, Michael Niemeyer, Federico Tombari"
date: 2026-01-22
pdf: "https://openreview.net/pdf/bcaff50cb75aa32267aa1fc92d8311300cf72337.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 自回归多视图扩散用于新视角合成
tldr: 本文提出CausNVS，一种自回归多视图扩散模型，用于灵活的三维新视角合成。现有非自回归方法限制视图数量且推理慢，CausNVS通过因果掩码和逐帧噪声训练，支持任意输入输出视图配置并顺序生成视图，结合滑动窗口和键值缓存提升效率，实现了精确的相机控制与高效生成。
source: ICML-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 现有新视角合成模型视图数固定且推理慢，无法灵活支持任意视角配置。
method: 采用自回归扩散模型，结合因果掩码和成对相对相机姿态编码，实现顺序视图生成。
result: 支持任意视图配置，推理效率高，生成质量稳定。
conclusion: 自回归框架为新视角合成提供了更灵活高效的解决方案。
---

## Abstract
Multi-view diffusion models have shown promise in 3D novel view synthesis, but most existing methods adopt a non-autoregressive formulation. This limits their applicability in world modeling, as they only support a fixed number of views and suffer from slow inference due to denoising all frames simultaneously. To address these limitations, we propose CausNVS, a multi-view diffusion model in an autoregressive setting, which supports arbitrary input-output view configurations and generates views sequentially. We train CausNVS with causal masking and per-frame noise, using pairwise-relative camera pose encodings (CaPE) for precise camera control. At inference time, we combine a spatially-aware sliding-window with key-value caching and noise conditioning augmentation to mitigate drift. Our experiments demonstrate that CausNVS supports a broad range of camera trajectories, enables flexible autoregressive novel view synthesis, and achieves consistently strong visual quality across diverse settings. Anonymous project page: \url{https://causnvs.github.io/}.

---

## 论文详细总结（自动生成）

# CausNVS：自回归多视图扩散用于灵活三维新视角合成——论文深度总结


## 1. 核心问题与整体含义（研究动机与背景）

**研究背景**：多视图扩散模型在3D新视角合成（Novel View Synthesis, NVS）领域已展现出巨大潜力。然而，现有方法大多采用**非自回归（non-autoregressive）** 的范式，即假设所有目标视角在生成前均已已知，并同时对它们进行联合去噪。

**核心问题**：这种非自回归设计带来了两大局限性：

1. **视图数量固定**：模型仅支持预定义数量的输入和输出视图，无法灵活适应任意视角配置；
2. **推理速度慢**：所有目标帧同时去噪，计算开销大，难以满足流式或交互式场景的需求。

**研究动机**：在世界模型（World Models）和交互式探索等场景中，系统需要以**因果（causal）** 和**顺序（sequential）** 的方式运行——随着智能体移动或收到新的视角查询，系统应仅基于先前积累的信息来合成新视图。这促使作者提出一种**自回归（autoregressive）** 的新视角合成范式，使模型能够以流式方式逐个生成视图。


## 2. 方法论

### 2.1 核心思想

CausNVS的核心思想是在预训练的2D扩散模型骨干网络之上，引入**带因果掩码（causal masking）的逐帧（frame-wise）注意力层**，从而实现自回归的多视图生成。与传统的非因果模型不同，该框架天然支持任意的输入-输出视图配置，可在单次训练中完成。

### 2.2 关键技术细节

**（1）因果训练目标与逐帧噪声**

CausNVS采用潜在扩散模型（Latent Diffusion Model）框架。对于包含$F=N+M$帧的训练序列，每帧$x_i$通过预训练的VAE编码器编码为潜在表示$z_i$。关键创新在于：

- 为每一帧独立采样随机的噪声水平$t_i$，模型学习在部分含噪视角的条件下进行去噪；
- 在逐帧注意力中应用**因果掩码**，确保每一帧仅依赖过去的信息；
- 训练目标为预测添加到每一帧潜在表示中的噪声$\epsilon_i$：
  $$\mathcal{L}_{\text{causal}} = \mathbb{E}_{\{(x_i,p_i),t_i,\epsilon_i\}_{i=1}^F} \sum_{i=1}^F \| \hat{\epsilon}_{\theta}(v_i | v_{<i}) - \epsilon_i \|_2^2$$

这一设计使模型能够在**单次训练中学习多种输入-输出配置**，得益于教师强制（teacher forcing）机制。

**（2）相对相机姿态编码（CaPE）**

为解决绝对姿态编码在全局坐标变化时缓存失效的问题，CausNVS采用**CaPE（Camera Pose Encoding）** ——一种相对姿态表示方法：

- CaPE通过在注意力计算中旋转query和key向量来编码视角间的相对几何关系，**不引入额外可学习参数**；
- 与RoPE类似，CaPE确保注意力分数对全局坐标变化保持不变，这对因果注意力和KV缓存复用至关重要；
- 实验表明，CaPE使注意力分数随相机旋转呈周期性变化、随平移呈线性变化，提供了SE(3)感知的归纳偏置。

**（3）推理时的优化策略**

为缓解自回归生成中的**漂移（drift）** 问题并提升效率，CausNVS在推理时采用三项关键技术：

- **噪声条件增强（Noise Conditioning Augmentation）** ：为先前生成的视图分配较小的噪声水平，使模型将其视为含噪输入，从而稳定后续预测、提升对累积误差的鲁棒性；
- **KV缓存（Key-Value Caching）** ：仅在最后一步去噪（或噪声增强的 conditioning 步骤）将KV写入缓存，而非所有去噪步骤，大幅减少计算开销；
- **空间感知滑动窗口（Spatially-Aware Sliding Window）** ：将注意力限制在姿态空间中最近的$K$个视图上，在保证质量的同时降低计算复杂度。

### 2.3 算法流程概述

1. **训练阶段**：从场景中随机采样非连续的$F$帧序列，为每帧分配独立的随机噪声水平，通过因果掩码的逐帧注意力进行去噪训练；
2. **推理阶段**：给定$N$个输入视角，模型自回归地逐个生成$M$个目标视角——每生成一个新视角，将其（带少量噪声）加入上下文，并更新KV缓存；
3. 整个过程不依赖全局坐标，支持任意查询顺序和变长输入输出。


## 3. 实验设计

### 3.1 数据集

CausNVS在两个带有相机姿态标注的公开场景级数据集上训练：

- **RealEstate10K (Re10K)** ：大规模房产视频数据集；
- **DL3DV**：多样化3D场景数据集。

### 3.2 评测基准

作者遵循**SEVA基准**的设置，在以下数据集上进行评估：

- **Re10K**：主要评估数据集；
- **LLFF**（Local Light Field Fusion）：局部光场数据集；
- **DL3DV**：分为长序列和短序列两种配置。

评估的输入视图数量$N \in \{1,2,3,4,6\}$，输出视图数量$M \in [1, 80]$。

### 3.3 对比方法

作者与多类基线方法进行了对比：

- **前馈式（Feed-forward）方法**：MVSplat、DepthSplat；
- **生成式方法**：PNVS（Photoconsistent NVS）、MotionCtrl、4DiM、ViewCrafter；
- **灵活视角方法**：SEVA（同期工作）。

### 3.4 评估指标

主要使用**PSNR（峰值信噪比）** 和**TSED**等指标进行定量评估。


## 4. 资源与算力

论文中明确报告了训练资源：

| 配置项 | 详情 |
|--------|------|
| 模型参数量 | **915M**（9.15亿） |
| 训练分辨率 | 256 × 256 |
| 序列长度（$F$） | 8 帧 |
| 批次大小（Batch Size） | 128 |
| 硬件平台 | **16块 v5e TPU** |
| 训练步数 | **150,000 步** |
| 基础模型 | 从预训练的潜在扩散模型进行微调 |


## 5. 实验数量与充分性

### 5.1 实验类型

论文进行了多组实验：

1. **标准基准评测**：在Re10K、LLFF、DL3DV上与多种SOTA方法对比；
2. **自回归 vs. 非自回归对比**：系统性地比较了因果模型与非因果模型在不同$N$（输入数）和$F$（总帧数）配置下的表现；
3. **消融实验**：分析滑动窗口大小对生成质量和计算效率的影响；
4. **长序列泛化测试**：评估模型在超出训练长度（$F=8$）情况下的表现，最高测试到$F=64$；
5. **灵活配置测试**：覆盖$N\in{1,2,3,4,6}$、$M\in[1,80]$的广泛组合。

### 5.2 充分性与客观性评价

**优点**：
- 实验覆盖了多个标准数据集和多种SOTA基线，对比较为全面；
- 对核心创新点（因果掩码、自回归推理）进行了专门的消融分析；
- 测试了远超训练长度的序列（$F=64$ vs. 训练$F=8$），验证了泛化能力；
- 遵循公开的SEVA基准设置，保证了可复现性。

**局限性**：
- 论文中未明确报告所有消融实验的完整数值结果（部分结果在附录中）；
- 与同期工作SEVA的对比中，SEVA使用了“尺度扫描（scale sweeping）”技巧来提升性能，而CausNVS明确避免使用这一技巧——这虽然在方法论上更纯粹，但也意味着在某些指标上可能处于劣势；
- 缺乏与基于NeRF或3DGS的优化式方法的直接对比。


## 6. 主要结论与发现

1. **CausNVS成功实现了灵活的自回归新视角合成**，支持任意数量的输入和输出视图，且仅需单个统一模型；
2. **因果掩码 + 逐帧噪声训练可有效缩小训练-推理差距**，缓解自回归漂移问题；
3. **CaPE相对姿态编码是实现KV缓存复用的关键**，使注意力分数对全局坐标变化保持不变；
4. **模型在长序列上表现出色**，可稳定生成训练长度10倍以上的视图序列；
5. **更多输入视角带来更好的生成质量**，模型能够有效利用额外信息提升3D一致性和语义保真度；
6. **滑动窗口注意力可在保持质量的同时节省计算资源**，窗口大小为4时已可达到与全注意力相当的效果；
7. **因果模型在灵活配置下显著优于非因果模型**，尤其在评估序列短于训练配置时优势明显。


## 7. 优点

**方法论亮点**：
- **首创性地将自回归范式引入多视图扩散NVS**，为流式和交互式3D生成开辟了新方向；
- **单次训练覆盖所有配置**：无需为不同的$N$-to-$M$配置分别训练或设计复杂的采样策略；
- **CaPE + KV缓存的组合设计**：既保证了姿态控制的精度，又实现了高效的自回归推理；
- **逐帧噪声训练**：相比传统统一噪声水平的方法，使模型在推理时能更灵活地处理不同噪声水平的上下文；
- **与绝对姿态编码不同，CaPE不引入额外参数**，保持模型简洁。

**实验亮点**：
- 测试了极端的$N=16$、$F=64$配置，充分验证了方法的可扩展性；
- 定性和定量结果结合，论证充分；
- 明确指出与基线方法的公平性考量（如避免使用尺度扫描）。


## 8. 不足与局限

**实验层面**：
- **分辨率限制**：训练和评估仅在256×256分辨率下进行，未验证在高分辨率（如512×512或更高）下的表现；
- **场景类型局限**：仅在Re10K和DL3DV两个数据集上训练和评估，未涉及更具挑战性的室外场景或动态场景；
- **与优化式方法的对比缺失**：未与NeRF、3DGS等基于场景优化的方法进行对比（尽管这类方法推理速度慢，但在质量上常为SOTA）；
- **用户研究缺失**：论文未报告主观质量评估（如用户偏好研究），仅依赖客观指标。

**方法层面**：
- **自回归误差累积的固有风险**：尽管采用了噪声增强等策略，长序列生成中误差累积仍是一个潜在问题；
- **依赖预训练2D扩散先验**：模型性能受限于基础2D扩散模型的能力；
- **姿态连续性假设**：尽管支持任意查询顺序，但模型训练基于随机采样的非连续帧，在处理极端不连续或跳跃性视角时可能仍存在挑战；
- **计算资源门槛较高**：9.15亿参数 + 16块TPU的训练配置对一般研究团队而言较难复现。

**应用限制**：
- 当前设计主要面向**静态场景**的新视角合成，尚未扩展到动态场景或4D生成；
- 模型的因果设计虽然支持流式生成，但实际部署中仍需考虑推理速度与实时性之间的平衡。

（完）
