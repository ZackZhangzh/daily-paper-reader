---
title: Feature Consistent 4D Gaussian Splatting for Realistic Dynamic View Synthesis
title_zh: 特征一致的4D高斯泼溅用于逼真动态视图合成
authors: "Boya Shi, Yuan Chang, Naiyang Guan"
date: 2025-09-19
pdf: "https://openreview.net/pdf?id=3dNKozB8U7"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 4D高斯泼溅用于动态视图合成
tldr: 该工作提出特征一致的4D高斯泼溅，通过同步正则化层次语义特征、速度和深度，实现逼真的动态新颖视图合成，是首个显式耦合速度和深度的动态渲染算法。
source: ICLR-2026-Rejected-Public
selection_source: conference_retrieval
motivation: 动态视图合成中时空一致性难以保证。
method: 引入特征一致性正则化，联合同步语义、速度和深度。
result: 实现更逼真的动态渲染，确保运动外观一致。
conclusion: 首个显式耦合速度和深度的动态渲染算法。
---

## Abstract
Dynamic novel view synthesis remains challenging due to the complexity of diverse motion patterns. In 4D Gaussians, the temporal dimension further complicates constraint formulation, making temporally consistent rendering difficult. To address this, we introduce 4D Feature Gaussian Splatting (F4DGS), a dynamic rendering algorithm that introduces feature consistency regularization to enable realistic rendering. This regularization jointly synchronizes hierarchical semantic features, velocity, and depth, ensuring coherent motion and appearance. We further extend the regularization beyond static alignment to capture temporal associations over continuous unit time intervals. F4DGS is the first rendering algorithm to explicitly couple velocity and depth for learning motion-consistent 4D representations, enabling high-fidelity, physically plausible rendering of dynamic content. Through comprehensive evaluations on monocular and multi-view dynamic datasets, F4DGS achieves real-time, high-resolution rendering and consistently outperforms existing methods across both quantitative and qualitative benchmarks. Notably, F4DGS achieves a 3.51 PSNR improvement on the Plenoptic dataset with comparable rendering speed and training time.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

动态新视图合成（Dynamic Novel View Synthesis）旨在从动态场景的捕获视频中重建场景，并生成任意新视点与新时刻的光真实感图像。然而，由于运动模式的多样性，这一任务长期面临巨大挑战。在4D高斯泼溅（4D Gaussian Splatting）框架中，时间维度的引入进一步增加了约束构建的复杂性，使得时域一致的渲染尤为困难。

针对上述问题，该论文提出了 **4D Feature Gaussian Splatting（F4DGS）** ——一种引入**特征一致性正则化**的动态渲染算法。该正则化联合同步了层次化语义特征、速度与深度信息，确保运动与外观的连贯一致。论文进一步将正则化从静态对齐扩展至连续单位时间间隔上的时序关联捕捉。F4DGS 是**首个显式耦合速度与深度**来学习运动一致性4D表示的渲染算法，能够实现高保真、物理可信的动态内容渲染。

---

## 2. 方法论

### 核心思想

F4DGS 的核心在于引入**特征一致性正则化**，将语义特征、速度场和深度图三者联合约束，从而在4D空间中获得时域一致的动态表示。该方法突破了以往工作中静态对齐的局限，强调在**连续单位时间间隔**上捕捉时序关联。

### 关键技术细节

- **层次化语义特征同步**：通过最优传输（Optimal Transport, OT）机制，构建层次化的语义特征对齐，使高斯基元在运动过程中保持语义一致性。
- **运动-深度耦合**：显式地将速度场与深度图联合建模，使学习到的4D表示既满足运动一致性，也具备物理合理性。
- **稀疏输入支持**：F4DGS 仅需从 COLMAP 重建的**稀疏点云**作为输入，相比依赖密集网格或体素表示的对比方法，计算开销更低。

### 算法流程（文字说明）

1. **输入**：动态场景的多视角或单目视频，经 COLMAP 重建获得稀疏点云。
2. **4D高斯表示**：构建随时间演化的4D高斯基元，每个基元携带位置、形状、不透明度、球谐系数等属性。
3. **特征一致性正则化**：
   - 在每一时间步，提取高斯基元的层次化语义特征；
   - 计算速度场与深度图，并将其与语义特征联合约束；
   - 将约束从静态对齐扩展至连续时间间隔上的时序关联。
4. **可微分栅格化渲染**：通过4D高斯的可微分栅格化，实现端到端训练和新视图合成。
5. **输出**：任意新视点与新时刻的光真实感渲染图像。

---

## 3. 实验设计

### 使用的数据集与场景

论文在多个动态场景数据集上进行了全面评估：

| 数据集 | 特点 |
|--------|------|
| **Plenoptic Video** | 真实世界动态场景，包含快速运动和复杂外观变化 |
| **D-NeRF** | 合成动态场景，涵盖非刚体运动和复杂时域形变 |
| **HyperNeRF** | 真实世界非刚体场景，由两台同步相机拍摄，存在复杂物体形变和拓扑变化 |
| **ENeRF-Outdoor / MobileStage / CMU-Panoptic** | 长序列动态数据集，用于评估长期时序一致性 |

### Benchmark 与对比方法

对比的基线方法包括：

- **NeRF-based**：D-NeRF、HyperReel、DyNeRF、ENeRF
- **显式/混合表示**：HexPlane、K-Planes、MixVoxels-L/X
- **4D高斯泼溅方法**：RealTime4DGS、Deformable4DGS、STG²
- **其他**：Neural Volumes、LLFF、Im4D、4K4D

---

## 4. 资源与算力

论文在补充材料中报告了模型大小与训练时间：

- **Plenoptic Video 数据集**：F4DGS 模型大小为 **5 MB**，训练时间为 **0.42 小时**（约25分钟）。
- **HyperNeRF 数据集**：F4DGS 训练时间为 **30 分钟**，约为 HyperNeRF 的 **1/64**，模型大小为 **60 MB**。

**注意**：论文**未明确说明**所使用的 GPU 型号与数量。

---

## 5. 实验数量与充分性

### 实验数量

论文开展了多组实验，涵盖：

1. **Plenoptic Video 数据集**上的定量对比（6个场景）
2. **D-NeRF 数据集**上的定量对比（8个场景）
3. **HyperNeRF 数据集**上的定量对比（4个场景）
4. **长序列数据集**（ENeRF-Outdoor、MobileStage、CMU-Panoptic）上的定量对比
5. **定性消融研究**：针对4D运动-深度一致性正则化的影响进行可视化对比

### 充分性与客观性评估

- **数据集覆盖全面**：涵盖了合成数据（D-NeRF）、真实世界多视角数据（Plenoptic Video）、真实世界非刚体数据（HyperNeRF）以及长序列数据，场景多样性充足。
- **对比基线充分**：对比了十余种最新方法，涵盖 NeRF、显式表示和4D高斯泼溅三大类。
- **消融实验存在**：补充材料中包含了针对核心正则化组件的定性消融研究。
- **公平性考量**：F4DGS 采用稀疏点云输入，而部分对比方法使用密集网格或体素表示——这实际上对 F4DGS 更为不利，但 F4DGS 仍取得最优结果，说明其优势具有说服力。

总体而言，实验设计**较为充分且客观**。

---

## 6. 主要结论与发现

1. **定量性能领先**：F4DGS 在所有评估数据集上均取得最高 PSNR。
   - Plenoptic Video 数据集上平均 PSNR 达 **32.50 dB**，较最佳基线提升 **3.51 dB**。
   - D-NeRF 数据集上平均 PSNR 达 **37.80 dB**，显著优于 Deformable4DGS（32.99 dB）。
   - HyperNeRF 数据集上 PSNR 达 **30.00 dB**，较 Deformable4DGS 提升 **+4.81 dB**。

2. **效率优势显著**：F4DGS 模型极小（5–60 MB），训练时间极短（0.42–0.5 小时），同时支持实时渲染。

3. **核心创新有效**：4D层次化语义正则化与运动-深度耦合不仅提升了渲染质量，还能在复杂结构变换场景中实现稳定、物理可信的动态建模。

---

## 7. 优点

- **首创性**：首个显式耦合速度与深度来学习运动一致性4D表示的动态渲染算法。
- **性能卓越**：在多个基准数据集上取得显著领先的定量结果，PSNR 提升幅度大（最高达 +4.81 dB）。
- **效率极高**：模型极小（最低仅 5 MB），训练极快（最快 0.42 小时），且支持实时渲染。
- **输入要求低**：仅需稀疏点云输入，相比依赖密集表示的对比方法更具实际应用价值。
- **实验全面**：覆盖合成/真实、单目/多视角、刚体/非刚体等多种场景，对比基线丰富。

---

## 8. 不足与局限

- **GPU 信息缺失**：论文未明确说明实验所用的 GPU 型号与数量，影响可复现性的完整评估。
- **稀疏输入依赖 COLMAP**：虽然稀疏点云降低了计算开销，但 COLMAP 本身在低纹理或极端动态场景中可能失效，这未在论文中充分讨论。
- **消融实验偏定性**：补充材料中的消融研究主要为可视化对比，缺乏定量消融数据来精确衡量各正则化组件的独立贡献。
- **真实世界泛化性**：虽然实验覆盖了多个数据集，但动态场景的多样性极为广泛（如剧烈拓扑变化、透明物体、反射表面等），方法的泛化边界有待进一步验证。
- **应用限制**：作为基于高斯泼溅的方法，在极端稀疏视角或大尺度场景中可能面临挑战，论文未对此进行深入探讨。

---

（完）
