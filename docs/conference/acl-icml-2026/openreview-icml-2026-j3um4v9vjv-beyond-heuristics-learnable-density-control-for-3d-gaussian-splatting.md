---
title: "Beyond Heuristics: Learnable Density Control for 3D Gaussian Splatting"
title_zh: 超越启发式：3D高斯泼溅的可学习密度控制
authors: "Zhenhua Ning, Xin Li, Jun Yu, Guangming Lu, Yaowei Wang, Wenjie Pei"
date: 2026-04-30
pdf: "https://openreview.net/pdf/42da9cf0e8722c081aa1018721860a7302ac7057.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 3D高斯泼溅的可学习密度控制
tldr: 针对3D高斯泼溅依赖启发式密度控制导致场景适应性差的问题，提出LeGS框架，将密度控制转化为参数化策略网络，通过强化学习优化，并设计基于敏感分析的有效奖励函数，精准量化每个高斯元贡献，实现自适应密度调控。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 固定启发式密度控制难以适应复杂几何场景。
method: 强化学习策略网络，敏感分析奖励函数。
result: 自适应密度调控提升重建质量。
conclusion: 可学习密度控制优于手工规则。
---

## Abstract
While 3D Gaussian Splatting (3DGS) has demonstrated impressive real-time rendering performance, its efficacy remains constrained by a reliance on heuristic density control. Despite numerous refinements to these handcrafted rules, such methods inherently lack the flexibility to adapt to diverse scenes with complex geometries. 
  In this paper, we propose a paradigm shift for density control from rigid heuristics to fully learnable policies. Specifically, we introduce LeGS, a framework that reformulates density control as a parameterized policy network optimized via Reinforcement Learning (RL). Central to our approach is the tailored effective reward function grounded in sensitivity analysis, which precisely quantifies the marginal contribution of individual Gaussians to reconstruction quality. To maintain computational tractability, we derive a closed-form solution that reduces the complexity of reward calculation from $O(N^2)$ to $O(N)$. Extensive experiments on the Mip-NeRF 360, Tanks \& Temples, and Deep Blending datasets demonstrate that LeGS significantly outperforms state-of-the-art methods, striking a superior balance between reconstruction quality and efficiency.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **研究背景**：3D高斯泼溅（3D Gaussian Splatting, 3DGS）在实时渲染方面表现优异，但其性能严重依赖于**启发式密度控制**（heuristic density control）。
- **核心问题**：尽管已有大量工作对手工设计的密度控制规则进行改进，但这些方法本质上**缺乏灵活性**，难以适应具有复杂几何结构的不同场景。
- **研究目标**：作者提出**范式转变**，将密度控制从固定的启发式规则转变为**完全可学习的策略**，以提升3DGS的场景适应性与重建质量。

## 2. 方法论：核心思想、关键技术细节

- **核心思想**：提出 **LeGS（Learnable Gaussian Splatting）** 框架，将密度控制问题重新表述为一个**参数化策略网络**，并通过**强化学习（Reinforcement Learning, RL）** 进行优化。
- **动作空间**：策略网络为每个高斯元定义离散动作，包括 **维持（maintain）、克隆（clone）、分裂（split）、修剪（prune）** 。
- **奖励函数**：核心创新在于设计了一个基于**敏感性分析（sensitivity analysis）** 的奖励函数，能够精确量化**单个高斯元对重建质量的边际贡献**。
- **计算优化**：为保持计算可行性，作者推导出**闭式解**，将奖励计算复杂度从 **O(N²) 降至 O(N)**，使得每个高斯元的评估可在常数时间内完成。

## 3. 实验设计：数据集、Benchmark与对比方法

- **数据集**：实验在三个公开基准数据集上进行，涵盖多种场景类型：
    - **Mip-NeRF 360**：包含全部9个场景（5个室外场景 + 4个室内场景）。
    - **Tanks & Temples**。
    - **Deep Blending**。
- **Benchmark与评估指标**：采用标准的**PSNR、SSIM、LPIPS**等图像质量评估指标。
- **对比方法**：与多种**最先进的启发式密度控制方法**进行对比，包括Vanilla 3DGS、FastGS等基线方法。

## 4. 资源与算力

> **论文中未明确说明具体使用的GPU型号、数量及训练时长。** 但根据GitHub仓库信息，项目代码已开源，可在标准深度学习硬件上运行。此外，第三方分析指出，RL训练需要**大量的计算资源**和精细的超参数调优。

## 5. 实验数量与充分性

- **实验组数**：论文在**三个大型基准数据集**上进行了广泛实验，涵盖了多种场景类型（室内/室外、真实/合成）。
- **充分性与客观性**：
    - 实验覆盖了**多样化的场景**，验证了方法在复杂几何条件下的泛化能力。
    - 与**多种SOTA方法**进行对比，评估指标全面（PSNR、SSIM、LPIPS），具有较好的客观性。
    - 论文还探讨了LeGS与**多种骨干网络（如Vanilla 3DGS、FastGS）的兼容性**，进一步增强了实验的充分性。

## 6. 主要结论与发现

- **性能提升**：LeGS在Mip-NeRF 360、Tanks & Temples和Deep Blending数据集上**显著优于**现有最先进的启发式密度控制方法。
- **效率与质量平衡**：LeGS在**重建质量与效率之间取得了更优的平衡**。
- **策略有效性**：学习到的密度控制策略比FastGS等基线方法能**更准确地选择局部最优动作**，表现出更好的收敛性、稳定性和密度优化效果。

## 7. 优点（方法或实验设计的亮点）

- **范式创新**：首次将3DGS的密度控制从**手工启发式规则**转变为**完全可学习的RL策略**，为后续研究开辟了新方向。
- **奖励函数设计精巧**：基于敏感性分析的奖励函数能够**精准量化每个高斯元的贡献**，这是实现有效学习的关键。
- **计算高效**：通过闭式解将奖励计算复杂度从O(N²)降至O(N)，使得RL训练在3DGS场景下**实际可行**。
- **通用性强**：LeGS可**无缝集成到多种骨干网络**（如Vanilla 3DGS、FastGS）中，具有良好的扩展性。
- **代码开源**：项目代码已在GitHub上公开，有利于学术界的复现与进一步研究。

## 8. 不足与局限

- **动态场景适应性**：奖励更新采用**周期性策略**（如每100次迭代更新一次），在**极其动态的场景**中可能无法及时适应。
- **计算资源需求**：RL训练需要**大量的计算资源**和**精细的超参数调优**，可能对小型实验室的复现构成一定门槛。
- **实验覆盖范围**：论文未明确提及在**极端大规模场景**（如城市级重建）或**动态/时序数据**上的表现，泛化边界有待进一步验证。
- **资源消耗未量化**：论文未提供具体的训练时间、GPU型号与数量等**算力细节**，不利于读者评估方法的实际成本。

（完）
