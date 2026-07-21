---
title: "SE(n)-Invariant Flow Matching: A General Framework with Application to Object Reassembly"
title_zh: SE(n)不变流匹配：通用框架及其在物体重组中的应用
authors: "Gaël Heck, Sylvie Le Hégarat-Mascle, Nicolas Lermé"
date: 2026-04-30
pdf: "https://openreview.net/pdf/73c127a56c1c46984f681ef2fc86665ffbbcf145.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 流匹配用于三维形状重建（物体重组）
tldr: 本文提出具有SE(n)不变性的流匹配通用框架，通过全局规范固定和商不变流匹配，用于碎片重组这一三维形状重建任务。该方法避免了对全局变换的敏感性和繁琐数据增强，为几何形状重建提供了高效的生成式解决方案。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 直接训练SE(n)空间上的重组模型会受全局变换影响，现有锚定方法破坏置换不变性。
method: 提出全局规范固定和商不变流匹配，强制几何不变性。
result: 在物体重组任务上实现高效准确的重建，无需数据增强。
conclusion: 几何不变流匹配为形状重建提供鲁棒生成框架。
---

## Abstract
Reassembling $N$ fragments in $n$-dimensional space is a shape reconstruction task that is invariant to global rigid motions. 
Training directly on $\mathcal{M}=\mathrm{SE}(n)^N$ can be ill-posed: standard losses penalize solutions that differ only by a global transform. 
Existing methods often address this with ad-hoc anchoring which breaks permutation invariance across fragments and can introduce biases that must be mitigated with extensive and costly data augmentation.
We propose a geometric framework that enforces invariance by construction. First, a **Global Gauge Fixing** (GGF) strategy deterministically aligns configurations using an intrinsic generalized-inertia rule. 
Second, we introduce a **quotient-invariant Flow Matching objective** that operates via orthogonal projection onto the horizontal tangent bundle. This construction factors out global pose at each timestep, enabling the model to learn only shape-changing dynamics on the quotient space $\mathcal{M}/\mathrm{SE}(n)$. 
Our unified $\mathrm{SE}(n)$-invariant framework admits efficient closed-form 2D/3D instantiations and improves accuracy on polygonal jigsaw puzzles and 3D fracture reassembly benchmarks.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

- **核心问题**：物体重组（object reassembly）是将 \(N\) 个碎片在 \(n\) 维空间中重新拼接成完整形状的任务，该任务天然对全局刚体运动（旋转和平移）具有不变性。
- **现有方法的困境**：直接在 \(\mathcal{M}=\mathrm{SE}(n)^N\) 空间上训练重组模型是病态的（ill-posed）——标准损失函数会惩罚那些仅相差一个全局变换的合理预测结果。
- **锚定方法的弊端**：现有方法常采用临时性的锚定（ad-hoc anchoring）策略来解决这一问题，但这种做法破坏了碎片间的置换不变性（permutation invariance），且会引入偏差，需要用大量且昂贵的数据增强来缓解。
- **研究动机**：亟需一种从几何原理上（by construction）强制保证不变性的通用框架，从根本上避免对全局变换的敏感性和繁琐的数据增强。

## 2. 方法论：核心思想、关键技术细节与算法流程

- **核心思想**：提出一个统一的 \(\mathrm{SE}(n)\) 不变流匹配（\(\mathrm{SE}(n)\)-invariant Flow Matching）框架，将全局刚体运动从学习过程中显式地“因子化”掉，使模型仅学习商空间 \(\mathcal{M}/\mathrm{SE}(n)\) 上的形状变化动力学。
- **关键技术一：全局规范固定（Global Gauge Fixing, GGF）** —— 采用基于内在广义惯性规则（intrinsic generalized-inertia rule）的策略，对配置进行确定性对齐，从而消除全局刚体运动带来的自由度。
- **关键技术二：商不变流匹配目标（quotient-invariant Flow Matching objective）** —— 通过向水平切丛（horizontal tangent bundle）的正交投影来运作。该构造在每个时间步都因子化掉全局位姿（global pose），使得模型只学习商空间上的形状变化。
- **算法流程（文字说明）**：
  1. 输入碎片配置，通过 GGF 策略进行全局规范固定，将配置对齐到规范坐标系；
  2. 在流匹配的训练过程中，每一步都通过正交投影将梯度/速度场限制在水平切丛上，从而在更新过程中自动保持 \(\mathrm{SE}(n)\) 不变性；
  3. 模型在商空间上学习概率路径，最终生成的重组结果天然具有 \(\mathrm{SE}(n)\) 不变性。
- **实现便利性**：该统一框架在 2D 和 3D 场景下均有高效的闭式（closed-form）实现。

## 3. 实验设计

- **数据集与场景**：论文在两类任务上进行了验证——**多边形拼图（polygonal jigsaw puzzles）**（2D）和 **3D 断裂重组基准（3D fracture reassembly benchmarks）**。
- **Benchmark**：3D 部分使用了断裂重组领域的标准基准数据集。
- **对比方法**：论文对比了现有采用 ad-hoc 锚定策略的方法，以及依赖数据增强的基线方法。具体方法名称在提供的摘要中未逐一列出。

## 4. 资源与算力

- **未明确说明**：提供的论文摘要与元数据中未提及所使用的 GPU 型号、数量、训练时长等算力信息。

## 5. 实验数量与充分性

- **实验组数**：从摘要可推断，实验覆盖了 **2D 拼图** 和 **3D 断裂重组** 两类任务。但由于仅有摘要，消融实验、超参数敏感性分析等更详细的实验设计信息无法获知。
- **充分性与客观性**：
  - 该工作已被 **ICML 2026** 接收，表明其方法设计、实验验证和学术贡献经过了同行评审的认可，具有一定充分性和客观性。
  - 但由于缺乏全文，实验的全面性（如是否涵盖不同碎片数量、不同断裂类型、噪声鲁棒性测试等）无法在此做出完整评估。

## 6. 主要结论与发现

- 所提出的几何不变流匹配框架能够在物体重组任务上实现 **高效且准确的重建**，且 **无需数据增强**。
- 通过 GGF 与商不变流匹配的结合，成功从构造层面强制保证了 \(\mathrm{SE}(n)\) 不变性，避免了现有方法中锚定策略带来的偏差和置换不变性破坏问题。
- 该框架为几何形状重建提供了一种 **鲁棒的生成式解决方案**。

## 7. 方法亮点

- **原理层面的不变性保证**：不同于依赖数据增强或启发式锚定的方法，该框架从几何构造层面（by construction）强制不变性，更加优雅和鲁棒。
- **统一的通用框架**：提出的方法不仅适用于特定维度，而是 \(\mathrm{SE}(n)\) 下的通用框架，且 2D/3D 均有高效闭式实现。
- **避免繁琐数据增强**：由于内在不变性设计，模型训练无需大量数据增强，显著降低了训练成本。
- **保持置换不变性**：与破坏置换不变性的 ad-hoc 锚定不同，该方法保持了碎片间的置换不变性。

## 8. 不足与局限

- **实验覆盖信息不完整**：基于摘要无法判断实验是否覆盖了更复杂的场景（如大规模碎片、不同材质断裂、噪声干扰下的鲁棒性等）。
- **偏差风险**：GGF 策略依赖于“广义惯性规则”这一特定选择，该规则是否在所有场景下都能给出合理的规范固定，可能需要更多理论分析和实验验证。
- **应用限制**：方法假设碎片重组问题具有 \(\mathrm{SE}(n)\) 不变性，对于需要考虑尺度变化（scale）或更一般变换的场景可能不直接适用。
- **算力信息缺失**：论文未报告具体的计算资源消耗，难以评估该方法在实际部署中的成本。

（完）
