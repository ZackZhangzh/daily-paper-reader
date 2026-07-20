---
title: Universal Beta Splatting
title_zh: 通用Beta泼溅
authors: "Rong Liu, Zhongpai Gao, Benjamin Planche, Meida Chen, Van Nguyen Nguyen, Meng Zheng, Anwesa Choudhuri, Terrence Chen, Yue Wang, Andrew Feng, Ziyan Wu"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=51JEkjP0gF"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 推广3DGS到Beta核用于显式辐射场渲染
tldr: 固定高斯核限制了3DGS对复杂光传输和动态的建模能力。本文提出Universal Beta Splatting，将高斯推广为各向异性Beta核，在单一表示中同时建模空间、视角和时间依赖，无需辅助网络，且兼容现有高斯泼溅流程。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 固定高斯核无法灵活建模视角相关和动态效应。
method: 使用各向异性Beta核替代高斯，统一表达多维度依赖。
result: 捕获复杂光传输，处理视角外观和动态，保持向后兼容。
conclusion: Beta核提供更灵活可解释的场景表示，扩展3DGS能力。
---

## Abstract
We introduce Universal Beta Splatting (UBS), a unified framework that generalizes 3D Gaussian Splatting to N-dimensional anisotropic Beta kernels for explicit radiance field rendering. Unlike fixed Gaussian primitives, Beta kernels enable controllable dependency modeling across spatial, angular, and temporal dimensions within a single representation. Our unified approach captures complex light transport effects, handles anisotropic view-dependent appearance, and models scene dynamics without requiring auxiliary networks or specific color encodings. UBS maintains backward compatibility by approximating to Gaussian Splatting as a special case, guaranteeing plug-in usability and lower performance bounds. The learned Beta parameters naturally decompose scene properties into interpretable without explicit supervision: spatial (surface vs. texture), angular (diffuse vs. specular), and temporal (static vs. dynamic). Our CUDA-accelerated implementation achieves real-time rendering while consistently outperforming existing methods across static, view-dependent, and dynamic benchmarks, establishing Beta kernels as a scalable universal primitive for radiance field rendering.

---

## 论文详细总结（自动生成）

# 论文总结：Universal Beta Splatting

## 1. 核心问题与整体含义（研究动机与背景）

**研究动机**：3D Gaussian Splatting（3DGS）虽实现了实时辐射场渲染，但其**固定高斯核**存在根本性局限：
- 高斯核的固定钟形轮廓难以捕捉锐利边界，对复杂几何细节的表达能力有限；
- 视角相关效应需依赖**球谐函数（SH）辅助编码**，导致表示碎片化；
- 动态场景扩展需额外引入**变形网络**，增加系统复杂度。

**核心问题**：真实场景的**空间、角度和时间维度具有独立的属性变化**（空间几何需自适应锐度、角度外观从漫反射到高光、时间动态从静态到快速运动），而高斯核在所有维度上耦合相同的钟形轮廓，无法独立控制各维度的行为。

**整体含义**：本文提出 **Universal Beta Splatting（UBS）** ，用 **N维各向异性Beta核** 替代高斯核，在一个统一表示中同时建模空间、视角和时间依赖，无需辅助网络或特定颜色编码。

## 2. 方法论

### 核心思想

将3DGS的高斯核推广为**N维各向异性Beta核**，通过**每维度可学习的形状参数**实现对空间、角度和时间维度的独立控制。

### 关键技术细节

**（1）N维Beta核**

Beta核定义为：
$$
\mathcal{B}(x;b)=(1-x)^{\beta(b)},\quad \beta(b)=4\exp(b),\quad x\in[0,1]
$$
其中参数 \\(b\\) 控制核形状：负值对应平坦表面，正值对应锐利细节，零值对应高斯近似。每个维度拥有独立的Beta参数，实现各向异性控制。

**（2）空间正交Cholesky参数化**

针对高维协方差矩阵的参数化难题（传统四元数无法推广到 \\(N>3\\) 维度，纯Cholesky分解丢失显式正交性），本文提出混合方案：
$$
\bm{L}=\begin{pmatrix}\bm{R}_x\,\text{diag}(\bm{s}_x)&\bm{0}\\ \bm{L}_{qx}&\text{diag}(\bm{s}_q)\end{pmatrix}
$$
其中 \\(\bm{R}_x\in SO(3)\\) 保持空间子空间的旋转-尺度结构， \\(\bm{L}_{qx}\\) 编码跨维度相关性。

**（3）Beta调制条件切片（Beta-Modulated Conditional Slicing）**

传统高维高斯在查询维度变化时，空间位置、形状和透明度会被“拖拽”耦合变化。UBS通过Beta调制解耦这一约束：
- 条件均值和协方差引入维度特定的Beta调制；
- 透明度采用**乘积形式门控**，允许每个非空间维度的独立贡献控制。

**（4）实例化配置**

- **UBS-6D**：查询维度为视角方向，用于静态场景的视角相关渲染；
- **UBS-7D**：查询维度为时间+视角，用于动态场景。

**（5）优化与实现**

采用**MCMC优化**（来自DBS），与核类型无关。损失函数包含L1损失、SSIM损失、不透明度和尺度正则化。提供**融合CUDA核**实现Beta评估、条件切片和空间正交操作。

### 向后兼容性

当Beta参数为零时，Beta核退化为高斯近似，可恢复3DGS、6DGS或7DGS，保证即插即用和性能下界。

## 3. 实验设计

### 数据集

**静态场景（3个数据集）**：
- **NeRF Synthetic**：8个合成场景，评估几何重建；
- **Mip-NeRF 360**：9个无界真实世界场景，挑战抗锯齿和视角合成；
- **6DGS-PBR**：7个基于物理的场景，含体散射、半透明材质、次表面散射和医学体渲染。

**动态场景（2个数据集）**：
- **D-NeRF**：8个合成序列，含多种变形类型；
- **7DGS-PBR**：6个基于物理的动态场景，含复杂时空-角度相关性。

### 评估指标

PSNR、SSIM、LPIPS，以及渲染速度（FPS）和训练时间。

### 对比方法

- **静态**：3DGS、6DGS；
- **动态**：4DGS、7DGS。

## 4. 资源与算力

- **静态与消融实验**：单张 **NVIDIA RTX 4090 24GB GPU**；
- **动态实验**：单张 **NVIDIA Tesla V100 16GB GPU**（与7DGS保持一致）；
- **训练迭代**：30K次迭代，Adam优化器。

## 5. 实验数量与充分性

**实验覆盖**：
- **5个数据集**（3静态+2动态）× 多个场景；
- **多维度评估**：静态、视角相关、动态三大类基准；
- **消融实验**：附录中包含参数效率分析（表5）和空间正交Cholesky近似精度分析（表6）。

**客观性与公平性**：
- 动态实验使用与7DGS相同的GPU（V100）以保持一致；
- 训练采用**固定30K最终迭代报告**（而非baseline论文中每500次选最优的 reporting方式），更严格地展示了收敛稳定性；
- 所有指标按标准协议在留出测试视图上计算。

**充分性判断**：实验设计较为充分，覆盖了静态、视角依赖、动态三大核心场景类型，对比了主流高斯基线方法，且有消融和参数分析。不足在于未明确说明是否有跨数据集泛化实验或真实世界大规模场景的测试。

## 6. 主要结论与发现

1. **UBS在所有基准上一致优于现有方法**：
   - 静态场景PSNR最高提升 **+8.27 dB**；
   - 动态场景PSNR最高提升 **+2.78 dB**。

2. **参数效率显著提升**：
   - 静态场景相比3DGS减少 **41%** 参数；
   - 动态场景UBS-7D仅需 **44个参数/基元**，而4DGS需161个（减少超70%）；
   - 相比4DGS减少 **73%** 参数。

3. **Beta参数自然分解场景属性**：无需显式监督，空间参数分离几何与纹理、角度参数区分漫反射与高光、时间参数隔离静态与动态元素。

4. **Beta核可作为辐射场渲染的可扩展通用基元**。

## 7. 优点

1. **统一表示**：单一框架同时处理空间、角度和时间三个维度，无需辅助网络。
2. **参数效率极高**：动态场景参数减少超70%，兼具质量与效率。
3. **向后兼容**：可退化为现有高斯方法，即插即用，保证性能下界。
4. **可解释性**：Beta参数自然分解场景属性，支持重光照和运动分析等应用。
5. **实时性能**：CUDA加速实现实时渲染。
6. **实验严谨**：采用更严格的最终迭代报告而非选取最优，体现收敛稳定性。

## 8. 不足与局限

1. **算力信息不完整**：仅说明了GPU型号和训练迭代数，未给出具体**训练时长**（小时/场景）。
2. **实验覆盖的局限性**：
   - 未涉及**超大规模真实场景**（如城市级场景）的评估；
   - 未讨论**跨数据集泛化能力**；
   - 未与其他非高斯核方法（如GES、3D Convex Splatting）进行直接对比。
3. **应用限制**：方法基于显式基元表示，基元数量随场景复杂度增长，可能存在**内存扩展性**挑战（文中未讨论）。
4. **依赖CUDA**：实现高度依赖CUDA加速，对非NVIDIA硬件平台的兼容性受限。

（完）
