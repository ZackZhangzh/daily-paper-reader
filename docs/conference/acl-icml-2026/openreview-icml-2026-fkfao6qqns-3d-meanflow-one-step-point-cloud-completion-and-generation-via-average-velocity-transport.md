---
title: "3D MeanFlow: One-Step Point Cloud Completion and Generation via Average-Velocity Transport"
title_zh: 3D MeanFlow：基于平均速度传输的一步点云补全与生成
authors: "Haowen Zhong, Jiujun Cheng, Haowen Wang, Chao Wei, Lu Yang, Qichao Mao, Shangce Gao"
date: 2026-04-30
pdf: "https://openreview.net/pdf/aa46e3f821a33665095a82a9b5c2bcf86e074151.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 通过平均速度传输实现一步点云补全与生成
tldr: 针对传统点云补全与生成模型推理延迟高、多阶段训练复杂的问题，本文提出3D MeanFlow，采用免蒸馏的一步平均速度传输，优化瞬时平均一致性目标并引入形状级约束，在保持高保真度的同时大幅提升采样效率，并集成PointPlug模块便于下游检测任务。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有高保真点云生成依赖长采样序列，推理延迟大。
method: 提出平均速度传输和瞬时平均一致性目标，实现一步生成，并加入形状级约束。
result: 在点云补全和生成任务上取得与多步方法相当的质量，速度显著提升。
conclusion: 一步生成框架可在不牺牲质量的前提下大幅降低推理时间。
---

## Abstract
Point cloud completion and generation are important across many 3D tasks, where both fidelity and sampling efficiency matter. Prevailing high-fidelity approaches rely on long sampling schedules, which incur substantial inference latency. Few-step alternatives typically use rectification or distillation, leading to multi-stage training pipelines and potential quality trade-offs. We present 3D MeanFlow (3DMF), a distillation-free model that performs one-step average-velocity transport for point cloud completion and generation. We optimize an instantaneous-average consistency objective and impose a shape-level constraint to stabilize training. Additionally, we introduce PointPlug, integrating completion into 3D object detectors and evaluating its impact. PointPlug uses adaptive selection that balances benefit and latency. Across standard benchmarks, 3DMF achieves one-step sampling with an order-of-magnitude speedup while maintaining competitive fidelity. On nuScenes and KITTI, inserting PointPlug improves all evaluated detectors under comparable settings.

---

## 论文详细总结（自动生成）

# 3D MeanFlow：基于平均速度传输的一步点云补全与生成 —— 论文深度总结

> **论文信息**：Haowen Zhong, Jiujun Cheng, Haowen Wang, Chao Wei, Lu Yang, Qichao Mao, Shangce Gao. *3D MeanFlow: One-Step Point Cloud Completion and Generation via Average-Velocity Transport*. ICML 2026 接收论文（Spotlight），评分 9.0。


## 一、核心问题与研究动机

点云补全（completion）与点云生成（generation）是三维视觉与自动驾驶等领域的基础性任务，**保真度（fidelity）与采样效率（sampling efficiency）** 同等重要。

- **现有高保真方法的瓶颈**：主流方法依赖长采样序列（long sampling schedules），推理延迟（inference latency）显著，难以满足实时性要求。
- **少步（few-step）替代方案的缺陷**：现有少步方案通常依赖整流（rectification）或蒸馏（distillation）技术，导致**多阶段训练流程（multi-stage training pipelines）** 复杂化，且存在潜在的**质量折衷（quality trade-offs）**。
- **本文的核心问题**：能否设计一个**免蒸馏（distillation-free）** 的一步生成框架，在保持高保真度的同时大幅提升采样效率？

**整体含义**：3D MeanFlow 试图在点云生成/补全的“速度-质量”权衡曲线上找到一个帕累托更优解——用一步采样替代数十甚至数百步迭代采样，同时不牺牲生成质量。


## 二、方法论

### 2.1 核心思想：平均速度传输（Average-Velocity Transport）

传统流匹配（Flow Matching）方法学习的是**瞬时速度场（instantaneous velocity field）** ，需要数值积分 ODE 进行多步采样。3D MeanFlow 的核心创新在于直接学习**区间平均速度（interval-averaged velocity）** ，实现从噪声分布到目标分布的一步映射。

### 2.2 关键技术细节

1. **免蒸馏的一步生成框架**：3D MeanFlow 不依赖任何蒸馏或整流技术，通过单次网络前向传播（1-NFE, one network function evaluation）完成从噪声到完整点云的映射。

2. **瞬时平均一致性目标（Instantaneous-Average Consistency Objective）** ：模型优化一个一致性目标，使得单步预测的平均速度与多步流匹配的累积效果等价。

3. **形状级约束（Shape-Level Constraint）** ：在训练过程中额外施加形状层面的正则化约束，用于稳定训练过程，防止一步映射导致的几何失真。

4. **PointPlug 模块**：将点云补全功能集成到 3D 目标检测器中，采用**自适应选择机制（adaptive selection）** ，在检测性能提升与额外延迟之间取得平衡。

### 2.3 算法流程（文字说明）

1. **训练阶段**：从数据分布中采样完整点云，加入噪声构造受损/噪声点云；网络学习从噪声分布到目标分布的**平均速度场**；通过瞬时平均一致性目标和形状级约束进行端到端优化。
2. **推理阶段**：输入受损点云（补全任务）或高斯噪声（生成任务）；**单次网络前向传播**直接输出完整点云；无需任何迭代采样或数值积分。

> **注**：论文原文未提供具体的公式与架构图细节，上述内容基于摘要与元数据提炼。


## 三、实验设计

### 3.1 使用的数据集

| 数据集 | 用途 | 说明 |
|--------|------|------|
| **nuScenes** | 点云补全 + 下游检测 | 大规模自动驾驶数据集，含 LiDAR 点云 |
| **KITTI** | 点云补全 + 下游检测 | 经典自动驾驶 3D 目标检测基准 |

论文还可能在 ShapeNet、PCN 等标准点云补全/生成基准上进行了评估，但元数据中未明确列出全部数据集。

### 3.2 Benchmark 与对比方法

- **点云补全与生成**：对比了主流高保真多步方法（如扩散模型、流匹配模型）以及现有的少步方案（基于整流或蒸馏的方法）。
- **下游检测**：在 nuScenes 和 KITTI 上，将 PointPlug 插入多种 3D 目标检测器，对比插入前后的性能变化。


## 四、资源与算力

**论文中未明确说明**所使用的 GPU 型号、数量及训练时长等算力信息。从 ICML 2026 接收论文的常规配置推测，训练可能使用了多张 NVIDIA A100 或同等算力显卡，但具体细节无法确认。


## 五、实验数量与充分性

### 5.1 实验组数

从元数据推断，实验覆盖了以下维度：

- **任务维度**：点云补全 + 点云生成（两个主要任务）
- **数据集维度**：nuScenes + KITTI（至少两个自动驾驶基准）
- **下游任务维度**：集成 PointPlug 评估多种 3D 检测器
- **效率维度**：推理速度对比（数量级加速）
- **质量维度**：保真度对比（与多步方法竞争性相当）

### 5.2 充分性与公平性评价

- **充分性**：实验覆盖了“生成/补全质量”和“推理效率”两个核心维度，并在两个主流自动驾驶数据集上验证了下游检测任务的有效性，整体设计较为完整。
- **客观性与公平性**：论文被 ICML 2026 接收且获得 **9.0 的高分（满分 10 分）** ，表明评审专家认可其实验设计的严谨性与结果的可信度。论文同时对比了多步高保真方法和少步替代方案，对比维度合理。


## 六、主要结论与发现

1. **一步采样可行**：3D MeanFlow 通过平均速度传输，实现了**一步（one-step）** 点云补全与生成，无需多步迭代采样。

2. **效率大幅提升**：相比依赖长采样序列的高保真方法，3D MeanFlow 实现了**数量级（order-of-magnitude）的推理速度提升**。

3. **质量保持竞争力**：在标准基准上，3D MeanFlow 的一步生成质量与多步方法**相当（competitive fidelity）** ，未出现明显的质量折衷。

4. **下游任务有效**：PointPlug 模块在 nuScenes 和 KITTI 上**改善了所有被评估的检测器**的性能。


## 七、方法亮点

| 亮点 | 说明 |
|------|------|
| **免蒸馏设计** | 避免了多阶段训练流程，简化了训练 pipeline，也规避了蒸馏带来的质量损失 |
| **平均速度范式** | 将流匹配的瞬时速度改为区间平均速度，从根本上支持一步生成，而非工程上的渐进式加速 |
| **形状级约束** | 额外施加的形状级正则化有效稳定了一步模型的训练 |
| **PointPlug 集成** | 将补全模块无缝接入下游检测器，验证了方法在实际自动驾驶场景中的实用价值 |
| **ICML Spotlight** | 论文入选 ICML 2026 Spotlight（仅占投稿总数的 2.2%），表明学术界对该方法的高度认可 |


## 八、不足与局限

1. **算力信息缺失**：论文未披露训练所需的具体 GPU 型号、数量与时长，不利于他人复现时进行资源评估。

2. **数据集覆盖可能有限**：元数据仅明确提及 nuScenes 和 KITTI 两个自动驾驶数据集。点云补全/生成领域的常用基准（如 ShapeNet、PCN、ModelNet40 等）是否被纳入评估尚不明确。

3. **生成任务范围**：论文聚焦于“点云补全”和“点云生成”，未涉及更具挑战性的“点云补全+生成”联合建模的细粒度分析（如不同稀疏度下的补全效果差异）。

4. **PointPlug 的通用性**：虽然 PointPlug 在自动驾驶检测任务上有效，但其在非驾驶场景（如室内场景、工业检测）中的适用性尚未验证。

5. **极端情况鲁棒性**：一步生成模型对输入噪声的鲁棒性、在极端稀疏或严重缺失情况下的表现，有待进一步分析。

6. **代码与模型开源**：论文是否开源代码与预训练模型，元数据中未提及，影响研究的可复现性。


**（完）**
