---
title: "3DGS-HPC: Distractor-free 3D Gaussian Splatting with Hybrid Patch-wise Classification"
title_zh: "3DGS-HPC: 基于混合分块分类的无干扰3D高斯泼溅"
authors: "Jiahao Chen, Yipeng Qin, Ganlong Zhao, Xin Li, Wenping Wang, Guanbin Li"
date: 2026-04-30
pdf: "https://openreview.net/pdf/9317db2326a42f486c571e008e371e471c759606.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 3DGS用于无干扰的场景重建
tldr: 针对现实环境中移动物体和阴影等瞬态干扰降低3DGS重建质量的问题，提出3DGS-HPC框架，采用混合分块分类策略，联合两种互补原则区分静态与瞬态区域，避免语义分组错位。实验表明在复杂场景下有效去除干扰，提升新视图合成和场景重建的鲁棒性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 瞬态干扰导致3DGS重建质量下降，现有语义先验不适用。
method: 混合分块分类区分静态和瞬态区域，无需语义分组。
result: 在真实环境中有效去除干扰，重建质量更鲁棒。
conclusion: 分块分类策略可增强3DGS对动态干扰的抵抗能力。
---

## Abstract
3D Gaussian Splatting (3DGS) has demonstrated remarkable performance in novel view synthesis and 3D scene reconstruction, but its quality often degrades in real-world environments due to transient distractors, such as moving objects and varying shadows. Existing methods commonly introduce semantic priors from pre-trained vision models either to group pixels into coherent regions or to define perceptual error metrics. However, semantic grouping is often misaligned with the binary static/transient distinction, while perceptual features can be fragile under appearance perturbations introduced during 3DGS optimization. We propose 3DGS-HPC, a framework that addresses these issues by combining two complementary principles: a patch-wise classification strategy that leverages local spatial consistency for robust region-level decisions, and a hybrid classification metric that adaptively integrates photometric and perceptual cues for more reliable separation. Extensive experiments demonstrate the superiority and robustness of our method in mitigating distractors to improve 3DGS-based novel view synthesis. Our project page is https://cnhaox.github.io/3DGS-HPC/.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究背景**：3D Gaussian Splatting（3DGS）在新视角合成和三维场景重建中表现优异，但其核心假设是**所有训练图像捕捉的是完全静态的场景**。在真实世界中，这一假设经常被**瞬态干扰物**（如移动的行人、车辆、变化的光影等）打破，导致重建质量严重下降。

**研究动机**：现有方法大多依赖预训练视觉模型提取的**语义先验**来识别和抑制干扰物。然而，这类方法存在两个根本性问题：
- **语义错位**：通用视觉语义与“静态/瞬态”的二元区分不一致；
- **语义脆弱**：3DGS优化过程中引入的外观扰动会导致语义特征响应不稳定，造成误分类。

**核心问题**：如何在不依赖外部语义先验的前提下，鲁棒地分离静态场景与瞬态干扰物，提升3DGS在真实复杂场景中的重建质量。

## 2. 方法论

**核心思想**：3DGS-HPC提出**混合分块分类（Hybrid Patch-wise Classification, HPC）** 框架，通过两个互补设计规避对语义先验的依赖：

**（1）分块级分类策略（Patch-wise Classification）**

- **出发点**：像素级分类结果噪声大、空间不一致，缺乏足够局部上下文；而基于语义分组的方法又存在任务错位问题。
- **核心做法**：利用**局部空间一致性**假设（邻近像素倾向于共享相同属性），将每张训练图像划分为规则的、不重叠的**分块（patches）** ，直接在分块层面进行分类。
- **优势**：相比像素级分类，分块分类提供更丰富的上下文信息、更强的局部扰动鲁棒性，同时将像素聚合为更少的分类单元，显著降低计算成本。

**（2）混合分类度量（Hybrid Classification Metric）**

- **出发点**：纯光度误差（RGB L1、SSIM）难以区分与静态内容颜色/纹理相似的干扰物；而纯感知度量（如DINOv2特征）在某些区域存在语义脆弱性。
- **核心做法**：自适应地**融合光度线索和感知线索**，形成更可靠的静态/瞬态分离度量。

**分类方法**：分块聚合后，论文提供两种分类方案：
- **百分位法**：当场景静态比例已知时，通过百分位阈值过滤瞬态分块；
- **高斯混合模型（GMM）** ：用双分量一维GMM拟合误差分布，将误差较小的分量视为静态，通过后验概率判定每个分块的类别——该方法无需预设静态比例，适用性更广。

**整体流程**：训练图像 → 计算像素级误差图 → 重塑为不重叠分块 → 计算每个分块的平均误差 → 通过百分位或GMM进行分块级二分类 → 生成静态掩码 → 在损失函数中屏蔽瞬态像素，仅用静态像素优化3DGS。

## 3. 实验设计

**数据集与场景**：论文在多个具有挑战性的真实场景上进行了验证，主要包括两类实验：

| 实验类型 | 场景 | 说明 |
|---------|------|------|
| 标准基准 | Statue、Android、Yoda、Crab (2) | 包含瞬态干扰物的标准测试场景 |
| 遮挡程度 | Mountain、Fountain、Corner、Patio、Spot、Patio-High | 按低/中/高三档遮挡程度划分 |

**对比方法**：论文对比了多类主流方法：
- **NeRF-based**：RobustNeRF、NeRF-HuGS、NeRF On-the-go
- **3DGS-based**：原始3DGS、MemE-3DGS、WildGaussians、SLS-mlp、HybridGS、T-3DGS

**评估指标**：PSNR↑（峰值信噪比）、SSIM↑（结构相似性）、LPIPS↓（学习感知图像块相似度）。

## 4. 资源与算力

**论文中未明确说明**所使用的GPU型号、数量及具体训练时长等信息。从论文来源（ICML 2026）和3DGS类方法的常规实践推断，实验应在标准深度学习GPU（如NVIDIA V100/A100等）上完成，但具体配置无法从现有文本中确定。

## 5. 实验数量与充分性

**实验组数**：论文在**至少10个以上**的不同场景上进行了测试（标准基准4个场景 + 遮挡程度6个场景），对比了**9种**主流方法（含NeRF和3DGS两派），并进行了消融实验（如VGG变体对比）。

**充分性与公平性**：
- **覆盖面较广**：实验涵盖了不同场景类型（雕像、室内物体、户外场景）和不同干扰程度（低/中/高三档遮挡），具有一定的多样性。
- **对比全面**：同时对比了NeRF和3DGS两大技术路线的方法，既包括早期工作也包括最新SOTA，对比维度较为完整。
- **公平性**：采用统一的评估指标（PSNR/SSIM/LPIPS），这是领域内标准做法。但论文文本中未详细说明各方法的具体训练配置是否完全一致（如迭代次数、学习率等），这方面信息不够透明。

## 6. 主要结论与发现

- **分块级分类优于像素级和语义级分类**：直接利用局部空间一致性进行分块分类，避免了外部语义先验带来的错位和脆弱性问题，同时比像素级分类更鲁棒、更高效。
- **混合度量优于单一度量**：光度与感知线索的自适应融合，比单独使用任一种度量都能更可靠地区分静态与瞬态区域。
- **定量结果领先**：在标准基准和遮挡程度实验的多数场景下，3DGS-HPC在PSNR、SSIM和LPIPS指标上均达到或超过现有SOTA方法。
- **方法通用性强**：框架不依赖特定语义先验，对不同类型、不同尺度的瞬态干扰物均有较好的鲁棒性。

## 7. 优点

- **创新性突出**：首次系统性地指出“语义错位”这一根本问题，并提出完全绕过外部语义的分块分类方案，思路清晰且具有原创性。
- **设计简洁有效**：分块划分和GMM分类的实现方式简单直接，不引入复杂的网络结构或额外的预训练模型，易于复现和部署。
- **方法论系统性强**：从“分类粒度”和“分类度量”两个维度系统性地分析问题并分别提出改进方案，逻辑严密。
- **实验设计扎实**：对比方法全面（涵盖NeRF和3DGS两派共9种方法），场景覆盖多样，消融实验完整。
- **应用价值高**：解决了3DGS从实验室走向真实世界部署的关键障碍——瞬态干扰物问题。

## 8. 不足与局限

- **算力信息缺失**：论文未报告具体的GPU型号、数量、训练时长等资源消耗信息，不利于读者评估方法的实际部署成本。
- **实验细节不够透明**：未详细说明各对比方法的具体训练配置是否完全一致，可能影响实验可复现性的判断。
- **极端场景覆盖有限**：虽然涵盖了低/中/高三档遮挡，但对于极端复杂的动态场景（如密集人流、快速光照剧变等）的泛化能力尚需进一步验证。
- **理论基础有待深化**：分块大小的选择依据、局部空间一致性假设在何种条件下会失效等问题，缺乏充分的理论分析和敏感性讨论。
- **代码尚未开源**：论文提及“代码将发布”，但截至分析时尚未公开，限制了社区的复现和进一步改进。

（完）
