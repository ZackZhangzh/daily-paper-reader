---
title: Mirror Flow Matching with Heavy-Tailed Priors for Generative Modeling on Convex Domains
title_zh: 凸域上带重尾先验的镜像流匹配
authors: "Yunrui Guan, Krishna Balasubramanian, Shiqian Ma"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=dZKl7uc0XQ"
tags: ["query:dgs-fm"]
score: 7.0
evidence: 凸域上的流匹配与重尾先验
tldr: 本文针对凸域上的流匹配生成建模，提出正则化镜像映射控制重尾分布和Student-t先验耦合，解决标准对数屏障镜像映射导致的病态动态和高斯先验不匹配问题，并提供速度场正则性和Wasserstein收敛率的理论保证。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 标准镜像流匹配在凸域上存在重尾导致的病态和高斯先验失配问题。
method: 采用正则化镜像映射和Student-t先验，保证有限矩和稳定训练。
result: 理论上保证了速度场Lipschitz性和Wasserstein收敛率。
conclusion: 该方法为凸域生成提供了稳健的流匹配框架。
---

## Abstract
We study generative modeling on convex domains using flow matching and mirror maps, and identify two fundamental challenges. First, standard log-barrier mirror maps induce heavy-tailed dual distributions, leading to ill-posed dynamics. Second, coupling with Gaussian priors performs poorly when matching heavy-tailed targets. To address these issues, we propose Mirror Flow Matching based on a \emph{regularized mirror map} that controls dual tail behavior and guarantees finite moments, together with coupling to a Student-$t$ prior that aligns with heavy-tailed targets and stabilizes training. We provide theoretical guarantees, including spatial Lipschitzness and temporal regularity of the velocity field, Wasserstein convergence rates for flow matching with Student-$t$ priors and primal-space guarantees for constrained generation, under $\varepsilon$-accurate learned velocity fields. Empirically, our method outperforms baselines in synthetic convex-domain simulations and achieves competitive sample quality on real-world constrained generative tasks.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义（研究动机与背景）

**研究背景**：流匹配（Flow Matching）是生成建模领域的重要框架，通过构造连续时间确定性流将简单先验分布（如高斯分布）输送到复杂目标分布。然而，当目标分布定义在凸域（如多面体、单纯形、半正定矩阵等）上时，标准流匹配面临根本性困难。

**两个核心挑战**：

- **挑战一**：标准的对数屏障镜像映射（log-barrier mirror map）会诱导出重尾的对偶分布，导致动态系统病态（ill-posed dynamics）。
- **挑战二**：在匹配重尾目标分布时，高斯先验的表现很差。

**研究意义**：凸域上的约束生成建模在分子生成、偏好对齐等领域有重要应用，本文提出的方法为这类问题提供了理论上更稳健、实践中更有效的解决方案。

---

## 2. 方法论

**核心思想**：提出“镜像流匹配”（Mirror Flow Matching）框架，通过两项关键创新解决上述两个挑战：（1）使用**正则化镜像映射**（regularized mirror map）控制对偶分布尾部行为；（2）使用 **Student-$t$ 先验**替代高斯先验，与重尾目标对齐。

**关键技术细节**：

- **正则化镜像映射**：替代标准的对数屏障镜像映射，能够控制对偶分布的尾部行为并保证有限矩（finite moments）的存在。
- **Student-$t$ 先验耦合**：Student-$t$ 分布本身具有重尾特性，与重尾目标分布更加匹配，能够稳定训练过程。

**理论保证**：论文提供了多项理论保证，包括：
- 速度场的空间 Lipschitz 连续性和时间正则性；
- 使用 Student-$t$ 先验的流匹配的 Wasserstein 收敛率；
- 约束生成的原始空间（primal-space）保证。

这些保证均在 $\varepsilon$-精度的学习速度场条件下成立。

---

## 3. 实验设计

根据摘要信息，实验分为两个层面：

- **合成凸域仿真**（synthetic convex-domain simulations）：在人工构造的凸域数据上验证方法有效性，对比基线方法并取得更优表现。
- **真实世界约束生成任务**（real-world constrained generative tasks）：在真实应用场景中进行验证，取得了有竞争力的样本质量。

**关于对比方法**：摘要中未详细列出具体的 baseline 方法名称。

**关于数据集/场景**：论文 PDF 提取文本中未提供实验部分的具体内容，因此无法获取数据集名称、具体任务类型、评估指标等详细信息。补充材料（supplementary material）已在 OpenReview 页面提供，但具体内容不在可获取范围内。

---

## 4. 资源与算力

**论文中未明确说明**使用的 GPU 型号、数量、训练时长等算力信息。从摘要和可获取的论文页面中无法找到关于计算资源的任何描述。

---

## 5. 实验数量与充分性

由于论文 PDF 的完整实验部分不在可获取范围内，**无法准确判断**实验的具体数量（如不同数据集数量、消融实验组数等）。

**从摘要推断**：实验覆盖了合成数据和真实数据两个层面，具有一定的全面性。但缺乏消融实验、不同凸域类型（如 $L_2$ 球、多面体等）的细分结果等信息的公开描述。整体而言，**难以对实验的充分性、客观性和公平性做出完整评估**。

---

## 6. 主要结论与发现

- 标准对数屏障镜像映射 + 高斯先验的组合在凸域重尾目标生成中存在根本性缺陷。
- 本文提出的正则化镜像映射 + Student-$t$ 先验的组合能够有效解决上述问题。
- 该方法在理论上具备速度场正则性和 Wasserstein 收敛率的严格保证。
- 实验上，该方法在合成凸域仿真中优于基线，在真实约束生成任务中达到有竞争力的样本质量。

---

## 7. 优点（方法与实验设计的亮点）

| 方面 | 亮点 |
|------|------|
| **问题识别** | 准确指出了现有镜像流匹配框架中两个此前未被充分认识的根本性挑战 |
| **理论贡献** | 提供了包括 Lipschitz 正则性、Wasserstein 收敛率在内的多项严格理论保证 |
| **方法创新** | 正则化镜像映射与 Student-$t$ 先验的耦合设计具有明确的动机和理论支撑 |
| **应用价值** | 针对凸域约束生成这一重要问题提供了系统性解决方案 |
| **学术认可** | 论文被 ICLR 2026 接收，表明其在学术界的认可度 |

---

## 8. 不足与局限

| 方面 | 具体说明 |
|------|----------|
| **实验细节缺失** | 公开可获取的摘要和元数据中缺乏实验部分的具体描述，包括数据集、baseline 方法、评估指标等 |
| **算力信息不明** | 未说明训练所需的 GPU 资源，不利于可复现性评估 |
| **应用范围验证** | 真实世界任务仅描述为“有竞争力的样本质量”，缺乏与 SOTA 方法的定量对比 |
| **消融研究** | 无法确认是否进行了充分的消融实验来验证两个创新点各自的贡献 |
| **局限性讨论** | 摘要中未提及方法的适用范围边界或潜在失败场景 |

---

**（完）**
