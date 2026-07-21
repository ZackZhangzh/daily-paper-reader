---
title: Geometry-Aware Image Flow Matching
title_zh: 几何感知的图像流匹配
authors: "Junho Lee, Kwanseok Kim, Joonseok Lee"
date: 2026-04-30
pdf: "https://openreview.net/pdf/aa541a9be375787f17b7fd8b883500f786e453dd.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 几何感知的流匹配用于图像生成
tldr: 本文发现自然图像语义主要编码在方向分量中，范数分量可近似为全局平均，因此可在超球面上建模。据此提出球面最优传输流匹配和球面流匹配，利用角距离构建生成模型，提升了图像生成的质量和几何一致性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有图像流匹配基于欧氏假设，未利用内在几何结构。
method: 将图像建模在超球面上，提出球面最优传输流匹配和球面流匹配。
result: 在图像生成任务上提升质量与几何一致性。
conclusion: 利用数据的球面几何结构可改善流匹配生成效果。
---

## Abstract
Recent advances in generative models highlight the power of geometry-aware modeling in manifold-constrained settings. Yet, for natural images, the field remains confined to Euclidean assumptions, failing to exploit the  potential of intrinsic geometric structures within the data. In this work, we investigate the geometry of natural images and observe that semantic information is predominantly encoded in directional components, while norm components can be approximated by the global average. This property holds across both RGB and latent spaces, suggesting that natural images can be effectively modeled on a hypersphere. Building on this finding, we introduce Spherical Optimal Transport Flow Matching (SOT-CFM), which utilizes angular distance, and Spherical Flow Matching (SFM), which constrains dynamics directly on the manifold. Our experiments demonstrate that these geometry-aware methods achieve superior performance against Euclidean baselines. Ultimately, this work provides a novel perspective that bridges the gap between Riemannian manifold-based modeling and natural image generation.

---

## 论文详细总结（自动生成）

## 1. 论文的核心问题与整体含义

**研究动机**：现有图像生成模型（扩散模型、流匹配等）虽然在样本质量、训练稳定性和生成效率上取得了显著进展，但这些方法**从根本上依赖于欧氏几何假设**，将图像视为高维欧氏空间中的向量。尽管已有研究表明，在已知数据流形的情况下，几何感知的生成模型（如黎曼流匹配）能够获得更优性能，但自然图像**缺乏显式的几何先验**，其内在流形结构在很大程度上是未知的。因此，现有方法未能充分利用数据内在的几何结构。

**核心发现**：本文通过**方向分解分析**发现，自然图像的语义信息主要编码在**方向分量**中，而**范数分量**可以用全局平均值近似，且这一性质在RGB空间和多种潜空间中都成立。基于此，本文提出将自然图像建模在**超球面**上。

**整体含义**：本文架起了黎曼流形建模与自然图像生成之间的桥梁，首次将**完全黎曼流匹配框架**成功应用于大规模自然图像生成。


## 2. 方法论

### 2.1 核心思想

将图像数据投影到超球面上，利用球面几何结构进行生成建模。每个图像向量 $x \in \mathbb{R}^d$ 可分解为 $x = \|x\|_2 \cdot \frac{x}{\|x\|_2} = s \cdot \hat{x}$，其中方向分量 $\hat{x}$ 位于单位超球面 $\mathbb{S}^{d-1}$ 上。实验表明，即使对范数进行大幅修改，重构质量仍保持良好，证明语义信息主要集中在方向分量中。

### 2.2 Spherical Optimal Transport Flow Matching (SOT-CFM)

- **核心改进**：将标准OT-CFM中的**欧氏传输代价**替换为**角距离度量**：
  
  $$c_{\text{ang}}(x_0, x_1) = \arccos\left(\frac{\langle x_0, x_1 \rangle}{\|x_0\|_2 \|x_1\|_2}\right)$$
  
- **动机**：欧氏代价对范数差异敏感——即使两个样本角度相同（语义相似），范数差异也会导致较大的欧氏距离。角距离直接比较方向分量，与人类对视觉相似性的感知更一致。

### 2.3 Spherical Flow Matching (SFM)

- **更激进的几何建模**：不仅改变传输代价，而是将**源分布和目标分布都约束在超球面**上，流路径定义为超球面上的**测地线**（球面线性插值，slerp）：

  $$\tilde{x}_t = \frac{\sin((1-t)\theta)}{\sin\theta}\tilde{x}_0 + \frac{\sin(t\theta)}{\sin\theta}\tilde{x}_1$$
  
- **动机**：高维高斯噪声的范数集中在 $\sqrt{d-1/2}$ 附近（维度越高越集中），天然位于超球壳表面；结合图像语义主要在方向分量中的发现，将两端都投影到同一超球面是自然的。

- **训练损失**：使用黎曼内积度量预测向量场与条件向量场之间的差异：

  $$\mathcal{L}_{\text{SFM}}(\phi) = \mathbb{E}_{t,\tilde{x}_0,\tilde{x}_1,\tilde{x}_t}\left[\|v_\phi(t,\tilde{x}_t) - u_t(\tilde{x}_t|\tilde{x}_0,\tilde{x}_1)\|^2\right]$$


## 3. 实验设计

**数据集**：
- **CIFAR-10**：50,000张训练图像，10个类别，分辨率 $32 \times 32$
- **ImageNet-256**：约128万张训练图像，1,000个类别，分辨率 $256 \times 256$

**基准与对比方法**：
- 欧氏基线：**I-CFM**（独立条件流匹配）和**OT-CFM**（最优传输条件流匹配）
- 本文方法：**SOT-CFM**（球面最优传输流匹配）和**SFM**（球面流匹配）

**评估指标**：gFID、sFID、Inception Score（IS）、Precision、Recall，均在50,000个生成样本上计算

**推理配置**：
- CIFAR-10：无条件生成，一阶欧拉求解器，100次函数评估（NFE）
- ImageNet-256：类别条件生成，无分类器引导（CFG），引导尺度分别优化（I-CFM: 2.1, OT-CFM/SOT-CFM: 2.6, SFM: 2.3），250步欧拉ODE求解器


## 4. 资源与算力

论文中**未明确说明**使用的GPU型号、数量或训练时长等具体算力信息。


## 5. 实验数量与充分性

**实验组数**：

1. **核心假设验证实验**（Table 1）：在RGB空间及多种自编码器潜空间（SD2-VAE、SD3-VAE、VMAE、DC-AE）上验证球面投影的重构质量
2. **泛化性验证**：在CIFAR-10、ImageNet、COCO-2014、CelebA-HQ四个数据集上验证方向主导性质
3. **主实验**（Table 2）：在CIFAR-10和ImageNet-256上与欧氏基线进行全面定量对比
4. **消融实验**：半径消融研究（Radius Ablation Study）

**充分性与公平性评价**：
- ✅ **对比公平**：所有方法在相同架构、采样策略和训练目标下进行对比
- ✅ **基准全面**：涵盖了无条件生成（CIFAR-10）和类别条件生成（ImageNet-256）两种场景
- ✅ **指标多样**：使用gFID、sFID、IS、Precision、Recall等多维度评估指标
- ✅ **消融合理**：通过对比“仅球面投影”和“球面投影+角距离”等变体，分别验证了各组件的作用
- ⚠️ **潜在不足**：未在更高分辨率（如ImageNet-512）或视频生成等更复杂任务上验证方法的泛化能力


## 6. 主要结论与发现

1. **方向主导假设得到验证**：自然图像的语义信息主要编码在方向分量中，范数分量可用全局平均值近似，这一性质在RGB空间和多种潜空间中均成立。

2. **球面投影带来一致提升**：仅将数据投影到超球面（不修改模型架构或训练目标）即可在CIFAR-10上将I-CFM的gFID从4.29降至4.10。

3. **SOT-CFM改进稳定但有限**：用角距离替代欧氏传输代价，在CIFAR-10上gFID从4.30（OT-CFM）降至4.11，ImageNet-256上从5.22降至5.15。

4. **SFM取得最优性能**：完全在超球面上运行的SFM在CIFAR-10上取得**3.79的gFID**，显著优于所有欧氏基线；在ImageNet-256上同样取得除Precision外所有指标的最佳结果。

5. **几何先验的价值**：这是**首次将完全黎曼流匹配成功应用于大规模自然图像生成**，证明了微分几何工具不仅是理论构造，更是可超越标准欧氏方法的实用替代方案。


## 7. 方法亮点

- **数据驱动发现几何结构**：不同于依赖已知流形先验的工作，本文**从数据本身发现**了自然图像的球面几何结构。
- **渐进式方法论设计**：从“轻量级”的球面投影到SOT-CFM再到完全黎曼的SFM，清晰展示了**逐步引入几何约束**带来的收益。
- **无需修改架构**：球面投影带来的提升不依赖于模型架构、采样策略或训练目标的修改。
- **理论基础扎实**：结合高维高斯噪声的**集中现象**和图像方向的**语义主导性**，为SFM提供了双重理论支撑。
- **跨空间泛化**：发现球面性质不仅在RGB空间成立，还扩展到多种自编码器潜空间。


## 8. 不足与局限

- **算力信息缺失**：论文未报告GPU型号、数量或训练时长，不利于实验可复现性的评估。
- **数据集规模有限**：主实验仅在CIFAR-10和ImageNet-256上进行，未在更高分辨率（如ImageNet-512）或更复杂任务上验证。
- **SFM架构限制**：SFM天然设计用于球面流形，**无法直接应用于欧氏数据**，这限制了其在非投影数据上的通用性。
- **SOT-CFM提升幅度较小**：与欧氏OT-CFM相比，SOT-CFM的gFID提升相对有限（CIFAR-10: 4.30→4.11）。
- **半径选择的敏感性**：SFM需要选择合适的投影半径，文中虽进行了半径消融研究，但未讨论半径选择对最终性能的敏感性。
- **未讨论失败案例**：缺少对生成失败样本或边界情况的分析，不利于全面理解方法的适用范围。

（完）
