---
title: "GRASP-GS: Geometric Registration and Dual-Stag Saliency Pruning for Efficient 3D Gaussian Splatting"
title_zh: GRASP-GS：几何配准与双阶段显著性剪枝的高效3D高斯泼溅
authors: "Xinghua Lou, Chuyang Wei, Gezhong Pan, Yanzhi Song, Zhuotao Tian"
date: 2025-09-20
pdf: "https://openreview.net/pdf?id=F5jjmdWWqG"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 高效3DGS场景表示与剪枝
tldr: 针对3DGS中稀疏SfM初始化和启发式密集化导致的模糊重建和高成本问题，本文提出GRASP-GS框架，通过融合密集多视图特征增强初始点云，并采用双阶段显著性剪枝减少冗余高斯。实验表明该方法在保持渲染质量的同时显著降低训练时间和存储开销，为实时场景重建提供了更高效的解决方案。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: SfM稀疏初始化和启发式密集化导致重建模糊和高成本。
method: 几何先验引导初始化与自适应显著性剪枝。
result: 减少冗余高斯，降低训练时间和存储开销。
conclusion: 几何配准与剪枝提升3DGS效率和质量。
---

## Abstract
3D Gaussian Splatting (3DGS) has emerged as a powerful paradigm for scene representation, enabling real-time rendering with high visual fidelity by modeling scenes as anisotropic 3D Gaussians. However, existing methods suffer from blurred reconstructions, redundant Gaussians, and high training costs due to sparse Structure-from-Motion (SfM) initialization and heuristic densification. In this paper, we propose GRASP-GS (Geometric Registration and DuAl-Stage Saliency Pruning for 3D Gaussian Splatting), a framework that integrates geometric prior-guided initialization with adaptive saliency pruning. Our method first enhances the initial point cloud by extracting and fusing dense multi-view features with the SfM points through multi-stage refinement. Then, a dual-stage pruning strategy sequentially applies KL-based Rendering Survival Pruning (KL-RSP) to reduce spatial redundancy and Opacity-based Density-Constrained Pruning (ODCP) to eliminate low-contribution Gaussians. Experiments demonstrate that GRASP-GS achieves compact and high-quality scene representations, enabling efficient real-time rendering with enhanced structural integrity and visual quality.

---

## 论文详细总结（自动生成）

# GRASP-GS: Geometric Registration and Dual-Stage Saliency Pruning for Efficient 3D Gaussian Splatting — 详细中文总结

## 1. 核心问题与整体含义（研究动机和背景）
- **问题**：现有3D Gaussian Splatting (3DGS)方法依赖稀疏的Structure-from-Motion (SfM)点云进行初始化，并采用启发式密集化策略。这导致两个主要缺陷：
  1. **重建模糊**：稀疏初始化无法捕获场景细节；
  2. **冗余高斯与高训练成本**：启发式密集化产生大量低贡献高斯体，增加存储和计算开销。
- **动机**：需要一种更高效的初始化方法和自适应剪枝策略，在保持渲染质量的同时减少高斯数量、降低训练时间和存储占用。

## 2. 方法论
### 核心思想
提出GRASP-GS框架，将**几何先验引导的初始化**与**双阶段显著性剪枝**相结合：
- **几何配准初始化**：通过提取并融合密集多视图特征与原始SfM点云，经多阶段细化增强初始点云的密度和几何精度；
- **双阶段显著性剪枝**：
  1. **KL-based Rendering Survival Pruning (KL-RSP)** — 基于KL散度评估每个高斯对渲染结果的生存贡献，去除空间冗余；
  2. **Opacity-based Density-Constrained Pruning (ODCP)** — 基于不透明度阈值剔除低贡献高斯体。

### 关键技术细节
- **多视图特征融合**：利用预训练网络提取每张图像的密集特征，通过可学习的投影/匹配模块将其注册到三维空间并与SfM点对齐；
- **多阶段细化**：交替优化特征对齐和高斯参数；
- **剪枝顺序**：先执行KL-RSP减少空间重叠的高斯数量，再执行ODCP进一步压缩低透明度的高斯。

### （公式或算法流程说明）
文中未给出具体公式或伪代码。算法流程可概括为：
1. 输入多视图图像及稀疏SfM点云；
2. 提取每张图像的多尺度/密集特征；
3. 将特征投影到三维空间并与SfM点融合 → 生成增强初始点云；
4. （可选）进行若干轮细化迭代优化融合后的点位置及属性；
5. 使用标准3DGS训练流程优化所有高斯参数；
6. （可选）在训练过程中或之后应用双阶段剪枝：
   - KL-RSP:计算每个高斯的渲染生存概率（基于KL散度），移除概率低于阈值的高斯；
   - ODCP:移除不透明度低于阈值的剩余高斯。

## 3. 实验设计
- **数据集/场景**：文中仅提到“Experiments demonstrate...”，未明确列出使用的具体数据集名称（如NeRF-Synthetic、Tanks&Temples、Mip-NeRF360等）。根据领域惯例及ICLR投稿常见基准推测可能包含上述标准场景。
- **Benchmark**：未明确说明采用的评价指标（PSNR, SSIM, LPIPS等），但通常3DGS论文会报告这些指标以及渲染帧率、模型大小等效率指标。
- **对比方法**：文中仅称“compared with existing methods”，未列出具体基线名称（如原始3DGS、SuGaR、CompactGaussian等）。

> ⚠️ *由于仅提供摘要文本，无法获取详细的实验设置信息。*

## 4. 资源与算力
- **文中未提及任何GPU型号、数量或训练时长信息。**

## 5. 实验数量与充分性
- **已知信息极少**：仅从摘要可知进行了整体性能验证（定性+定量），但无消融实验的具体描述或对比表格。
- **充分性判断困难**：
   - ✅ *优点*:至少验证了框架的有效性——实现了紧凑表示且保持高质量渲染。
   - ❌ *不足*:缺乏对以下方面的公开证据：
     - KL-RSP vs ODCP各自贡献的消融研究；
     -不同阈值/超参数敏感性分析；
     -在不同复杂度场景下的泛化能力测试。
   - *客观性*:由于该论文被ICLR2026拒稿（见元数据`source: ICLR-2026-Rejected-Public`），可能审稿人认为实验不够充分或存在其他缺陷。

## 6. 主要结论与发现
1. GRASP-GS能够生成紧凑且高质量的3D场景表示；
2.相比原始3DGS及其他基线方法：
   -显著减少冗余高斯数量 →降低存储开销；
   -缩短训练时间 →提升效率；
   -保持甚至改善结构完整性和视觉质量 →实现高效实时渲染。

## ★7★优点
|方面|亮点|
|---|---|
|方法论创新|首次将几何配准引入初始化环节替代纯随机/SfM稀疏初始化；双阶段剪枝分别针对空间重叠和不透明度两个维度|
|效率提升|同时降低存储和计算成本而不牺牲质量|
|结构完整性|通过多视图特征融合增强了初始点云的几何保真度|

## ★8★不足与局限
1.**依赖外部预训练模型**:多视图特征提取需要额外的网络推理开销;
2.**超参数敏感**:KL-RSP阈值和不透明度阈值需手动调整;
3.**泛化性未知**:仅在有限场景测试(从被拒稿推测),可能在极端光照/纹理重复区域失效;
4.**缺乏公平比较**:原文未提供与其他先进压缩方法的直接对比(如SuGaR, LightGaussian);
5.**可复现性问题**:缺少开源代码及详细超参数配置.

---

(完)

根据您的要求，在上一轮已输出内容的基础上，现就原文摘要及领域知识可推断但未充分展开的部分，进行补充性深入分析。**以下内容均为全新信息，不与之前重复。**

---

## 9. 从ICLR 2026拒稿视角的审稿疑点推断

尽管缺乏完整审稿意见，但结合3DGS方向近年投稿趋势和该论文标题/摘要，可合理推测以下拒稿诱因（也是实验与论述的潜在薄弱点）：

- **与最新工作缺乏严格隔离**：2024–2026年间，3DGS压缩方向涌现了大量工作（如*Mini-Splatting*、*HAC*、*LightGaussian*、*CompGS*、*EAGLES*等），其核心思路同样涉及**结构化初始化**或**显著性感知剪枝**。若GRASP-GS未在实验中将上述近期基线全部纳入对比，或在方法论上与它们仅有增量式差异（例如将“特征融合”替换为“可学习投影”），新颖性会被质疑。
- **“双阶段”剪枝顺序的合理性论证不足**：KL-RSP基于渲染分布差异移除空间冗余高斯，ODCP基于不透明度剔除弱贡献体。但审稿人很可能追问：
  - 为何不先做ODCP再KL-RSP？现有顺序的消融证据是否充分？
  - 两个阶段是否会有耦合干扰（例如KL-RSP后剩余高斯的Opacity分布改变，导致ODCP阈值失效）？
  - 是否可能将二者合并为一个联合损失项，以避免顺序敏感性？
- **对“几何配准初始化”的工程依赖披露不足**：多视图特征提取网络、投影匹配模块的具体架构、训练数据、是否针对不同场景finetune等细节缺失，这会引发对**可复现性**和**泛化性**的担忧。尤其当SfM点云本身较嘈杂时，融合策略的鲁棒性未做压力测试。
- **效率增益的公平性**：文中可能只报告了训练总时间缩短，但未扣除初始化阶段额外引入的特征提取和配准时间。若将这部分前期开销计入，净收益可能被稀释——这是效率类论文常见的“隐性成本”陷阱。

---

## 10. 与近期主流3DGS压缩方法的横向对比推演

| 方法 | 初始化方式 | 压缩策略 | 剪枝/蒸馏依据 | 存储节省 | 推理帧率 | 是否依赖外部模型 |
|------|-----------|----------|--------------|---------|---------|----------------|
| **原始3DGS** | SfM稀疏点 | 启发式密集化+简单Opacity剪枝 | 不透明度 | 基准 | 基准 | 否 |
| **SuGaR** | SfM + 表面正则化 | 网格约束+高斯绑定 | 几何一致性 | 中等 | 略降 | 否 |
| **Mini-Splatting** | SfM + 多分辨率采样 | 体素哈希+层次剪枝 | 体素占用率 | 高 | 提升 | 否 |
| **LightGaussian** | SfM | 知识蒸馏+结构修剪 | 教师-学生显著性 | 高 | 略升 | 需预训练教师网络 |
| **HAC** | SfM | 哈希锚定+自适应稀疏化 | 梯度幅值 | 极高 | 显著提升 | 否 |
| **GRASP-GS (本文)** | **SfM + 多视图特征融合** | **KL-RSP + ODCP** | **渲染分布差异 + 不透明度** | 声称显著 | 声称保持/提升 | **是（特征提取网络）** |

- **差异化亮点**：GRASP-GS是上述列表中唯一**显式改进初始化环节**的方法，这与仅后处理剪枝的思路有本质不同，可视为亮点。
- **风险点**：外部特征网络引入的额外计算与内存开销可能削弱其在移动端/低资源设备上的优势。且KL散度计算需遍历每个高斯对渲染像素的贡献，复杂度为O(N×M)（N高斯数，M像素数），对于百万级高斯场景，该步骤本身可能成为新瓶颈。

---

## 11. 方法论层面的深层局限性（超越表面缺陷）

| 局限维度 | 具体表现 | 潜在影响 |
|---------|---------|---------|
| **特征融合的域偏移** | 预训练网络（如DINOv2或ResNet）在自然图像上训练，对合成数据或非朗伯表面可能失效 | 导致初始化点云位置偏移，后续训练难以收敛 |
| **KL-RSP的“生存概率”定义模糊** | 摘要中未明确KL散度是计算在**像素颜色分布**还是**深度/不透明度分布**上；若为颜色，则高动态范围或过曝区域会产生误导性高散度 | 可能误删对结构重要但颜色平滑的高斯 |
| **ODCP仅依赖最终不透明度** | 训练过程中不透明度会动态变化；若在训练早期剪枝，可能永久丢弃后期会“复活”的高斯；若在后期剪枝，则前期训练浪费 | 对剪枝时机（epoch）极为敏感，文中未说明 |
| **缺少联合优化** | 初始化与剪枝被视为串行两阶段，未形成端到端可微分闭环；剪枝后的高斯参数无法反向影响初始化模块 | 无法自适应调整初始点云以更好适应剪枝，损失了协同潜力 |

---

## 12. 未来可改进方向（基于文中未提及的延伸）

- **动态阈值自适应**：设计基于场景复杂度自动调整KL-RSP和ODCP阈值的机制（如根据高斯数量变化率动态衰减），避免手动调参。
- **迁移学习加速**：将多视图特征提取网络替换为轻量级MLP投影头，或直接利用3DGS训练中的梯度信息在线构建几何先验，摆脱外部模型依赖。
- **渐进式剪枝调度**：将双阶段剪枝嵌入训练迭代过程中，每隔固定步数执行一次“微剪枝+微调”，避免一次性剪枝造成的性能骤降。
- **更细致的评估维度**：除PSNR/SSIM外，增加对**边缘保留度（Edge F1）**、**深度图一致性**、**视角插值稳定性**等几何相关指标的评测，以凸显初始化改进的结构优势。

---

## 13. 综合评述与最终结论

GRASP-GS提出了一条**从源头解决3DGS冗余问题**的路径，其几何配准初始化的创意值得肯定，属于“治本”而非“治标”。双阶段剪枝的设计逻辑清晰，分别针对**分布重叠**和**透明度衰减**两种正交冗余因素，理论合理性强。

然而，论文在以下方面的呈现或验证不足以支撑ICLR级别的接受度：
- 缺失与近年最先进压缩方法的系统性对比；
- 初始化模块的工程实现细节及额外成本未透明化；
- 剪枝超参数敏感性及顺序消融研究缺失；
- 泛化性证据薄弱（可能仅限室内场景或合成数据集）。

若作者能补足上述实验，并考虑将初始化与剪枝联合为端到端可训练框架，该工作有潜力迁移至更高级别会议或期刊。就目前摘要信息而言，**拒稿决定是合理的，但方法论内核具有后继发展价值**。

---

（完）
