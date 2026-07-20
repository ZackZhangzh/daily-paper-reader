---
title: "Laplacian Analysis Meets Dynamics Modelling: Gaussian Splatting for 4D Scene Reconstruction"
title_zh: 拉普拉斯分析与动力学建模融合：用于4D场景重建的高斯泼溅
authors: "Yifan Zhou, Beizhen ZHAO, Pengcheng Wu, Hao Wang"
date: 2025-09-18
pdf: "https://openreview.net/pdf?id=CQNeFyvqn3"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 使用3D高斯泼溅进行4D场景重建
tldr: 针对动态3D高斯泼溅中运动细节保持与变形一致性之间的频谱冲突，提出一种混合显式-隐式框架，结合拉普拉斯编码与哈希网格实现灵活频率运动控制，从而提升4D场景重建的保真度。
source: ICLR-2026-Public
selection_source: conference_retrieval
motivation: 现有动态3DGS方法因低秩分解过平滑或高维网格特征碰撞，难以兼顾细节与一致性。
method: 构建混合显式-隐式函数，引入频谱感知拉普拉斯编码，融合哈希与拉普拉斯模块以灵活控制频率运动。
result: 实验表明该方法能有效缓解频谱冲突，在动态场景重建中取得更优效果。
conclusion: 频谱感知的拉普拉斯编码为动态3DGS提供新思路，可推广至其他时变重建任务。
---

## Abstract
While 3D Gaussian Splatting (3DGS) excels in static scene modeling, its extension to dynamic scenes introduces significant challenges.
Existing dynamic 3DGS methods suffer from either over-smoothing due to low-rank decomposition or feature collision from high-dimensional grid sampling. 
This is because of the inherent spectral conflicts between preserving motion details and maintaining deformation consistency at different frequency. 
To address these challenges, we propose a novel dynamic 3DGS framework with hybrid explicit-implicit functions. 
Our approach contains three key innovations: 
a spectral-aware Laplacian encoding architecture which merges Hash encoding and Laplacian-based module for flexible frequency motion control, 
an enhanced Gaussian dynamics attribute that compensates for photometric distortions caused by geometric deformation,
and an adaptive Gaussian split strategy guided by KDTree-based primitive control to efficiently query and optimize dynamic areas.
Through extensive experiments, our method demonstrates state-of-the-art performance in reconstructing complex dynamic scenes, achieving better reconstruction fidelity.

---

## 论文详细总结（自动生成）

# 论文总结：Laplacian Analysis Meets Dynamics Modelling: Gaussian Splatting for 4D Scene Reconstruction

## 1. 核心问题与整体含义（研究动机与背景）

- **背景**：3D高斯泼溅（3DGS）在静态场景建模中表现出色，但其向动态场景的扩展面临重大挑战。动态场景包含异质运动模式——刚体部分保持时间一致性，而可变形区域则需要高频轨迹建模。
- **核心问题**：现有动态3DGS方法存在两类典型缺陷——**低秩分解导致过平滑**（over-smoothing），或**高维网格采样导致特征碰撞**（feature collision）。其根本原因在于**频谱冲突**：保留运动细节（高频）与维持变形一致性（低频）在频域上存在内在矛盾。
- **研究目标**：提出一种融合混合显式-隐式函数的新型动态3DGS框架，通过频谱感知的拉普拉斯编码实现灵活的频率运动控制，从而提升4D场景重建的保真度。


## 2. 方法论：核心思想、关键技术细节与算法流程

### 2.1 核心思想

论文的核心洞察在于：**不同频段的运动信息需要差异化的建模策略**。基于这一洞察，作者设计了频谱感知的拉普拉斯编码架构，将哈希编码（擅长高频细节）与拉普拉斯模块（擅长低频一致性）融合，实现灵活的频率运动控制。

### 2.2 三大关键技术

**（1）频谱感知拉普拉斯编码架构**

- 引入**可学习频率的拉普拉斯编码**，无需手动选择频带。编码器通过梯度下降自动学习适合数据的频率成分。
- 梯度计算公式为：
  \[
  \frac{\partial\mathcal{L}}{\partial f_k} = \frac{1}{\sigma_k^2} \sum_t \left( \frac{\partial\mathcal{L}}{\partial L(t)} \cdot t \cdot [-\alpha_k \sin(2\pi f_k t) + \beta_k \cos(2\pi f_k t)] \right)
  \]
  其中 \( \sigma_k \) 表示时间方差。
- 引入**注意力机制**，将拉普拉斯时间特征与哈希空间特征融合。

**（2）增强型高斯动态属性**

- 为每个3D高斯关联一个**可学习的动态属性向量** \( \mathbf{d}_i \)，显式编码每个高斯的时变特性。
- 设计**融合机制**，将动态属性向量与哈希时间特征拼接，形成增强特征表示。
- 引入**自适应动态正则化**：仅对“异常大”或“高度动态”的高斯（离群点）施加额外正则化，通过欧氏距离与统计阈值识别离群点，集中正则化资源于最富信息量的区域。

**（3）KDTree引导的自适应高斯分裂策略**

- 基于**KDTree的邻域分析**，对每个高斯寻找K个最近邻，通过评估高斯的大小和各向异性差异来决定分裂对象。
- 引入**KL散度引导的自适应阈值**，当KDTree方法无法准确识别动态高斯时（因邻域形状相似导致硬阈值失效），通过KL散度动态调整分裂阈值。

**（4）多尺度拉普拉斯金字塔监督**

- 使用**拉普拉斯金字塔分解**对渲染图像与真实图像进行多频段监督：
  \[
  \mathcal{L}_{\text{lap}} = \sum_{l=1}^{L} \lambda_l \| \mathcal{L}_l(I_{\text{render}}) - \mathcal{L}_l(I_{\text{gt}}) \|_1
  \]
  其中 \( \lambda_l \) 呈指数递减以强调细节。

**（5）总损失函数**

总损失由四项构成：
\[
\mathcal{L} = \mathcal{L}_{\text{orig}} + \lambda_{\text{NCC}} \mathcal{L}_{\text{NCC}} + \lambda_{\text{lap}} \mathcal{L}_{\text{lap}} + \lambda_{\text{dy}} \mathcal{L}_{\text{dy}}
\]
其中 \( \mathcal{L}_{\text{orig}} \) 包含 \( \mathcal{L}_1 \) 和 SSIM 损失。


## 3. 实验设计

### 3.1 使用的数据集

论文使用**三个公开数据集**：

| 数据集 | 类型 | 特点 |
|--------|------|------|
| **Neu3D** | 真实世界 | 多静态相机，18–21个多视角视频，每视频300帧 |
| **HyperNeRF（"vrig"子集）** | 真实世界 | 立体相机拍摄，包含复杂的拓扑变化，训练用一相机、验证用另一相机 |
| **D-NeRF** | 合成 | 单目场景，每场景50–200帧，排除Lego子集 |

### 3.2 对比方法

论文对比了**多种基线方法**，包括：

- **基于NeRF的方法**：HyperNeRF
- **动态3DGS方法**：D3DGS、MotionGS、MoDec-GS、4DGaussians、ED3DGS、Grid4D
- **静态/通用方法**：3DGS、K-Planes、HexPlane、SC-GS

### 3.3 评估指标

使用三个标准指标：**SSIM↑（结构相似性）**、**PSNR↑（峰值信噪比）**、**LPIPS↓（感知损失）**。


## 4. 资源与算力

**论文中未明确说明**所使用的GPU型号、数量、训练时长等具体算力信息。从方法描述中可以推断，该方法需要在动态场景的多视角视频上进行训练，且涉及KDTree邻域查询和高斯分裂等计算密集型操作，但具体硬件配置未在摘要或实验部分给出。


## 5. 实验数量与充分性

### 5.1 实验组数

论文进行了**多组实验**：

- **三个数据集的完整对比实验**（Neu3D、HyperNeRF vrig、D-NeRF），每个数据集均与6–8种基线方法对比。
- **消融实验**：分别移除拉普拉斯模块、动态属性、自适应分裂策略、拉普拉斯金字塔损失，验证各组件的必要性。
- **高斯数量对比**：对比有无自适应分裂策略的高斯数量。

### 5.2 充分性与客观性评价

- **充分性较好**：覆盖了真实世界（多视角/立体）和合成（单目）三类场景，对比方法涵盖当前主流动态3DGS方法，消融实验系统验证了各核心组件的贡献。
- **公平性考量**：在Neu3D上遵循4DGaussians的初始化协议，在HyperNeRF上采用跨相机训练-验证设置，实验设置较为规范。
- **潜在局限**：D-NeRF数据集的Lego子集被排除，可能影响结论在特定场景下的普适性表述。


## 6. 主要结论与发现

1. **频谱感知的拉普拉斯编码有效缓解了频谱冲突**：通过融合哈希编码（高频）与拉普拉斯模块（低频），模型能够在保留运动细节与维持变形一致性之间取得更优平衡。

2. **在多个数据集上达到最优性能**：在Neu3D、HyperNeRF vrig和D-NeRF数据集上，该方法在SSIM、PSNR、LPIPS三个指标上均优于所有对比方法。

3. **自适应分裂策略实现更紧凑的高斯表示**：在保持相似重建质量的前提下，自适应策略将高斯数量从589k降至433k，压缩约26.5%。

4. **各组件均有可验证的贡献**：消融实验表明，移除任一核心组件（拉普拉斯模块、动态属性、自适应分裂、拉普拉斯损失）均会导致性能下降，验证了设计的有效性。


## 7. 优点（方法与实验设计的亮点）

1. **频谱视角的创新性**：首次从频谱冲突的角度系统分析动态3DGS的困境，并提出了有针对性的解决方案，理论动机清晰。

2. **混合显式-隐式架构的灵活性**：通过哈希编码（显式）与拉普拉斯模块（隐式）的融合，兼顾了高频细节捕捉与低频一致性保持。

3. **自适应机制设计精巧**：动态正则化仅针对离群高斯、分裂阈值由KL散度动态调整，避免了传统方法中固定阈值的僵化问题。

4. **实验覆盖全面**：三个数据集覆盖真实/合成、多视角/立体/单目多种场景，对比方法涵盖当前主流基线。

5. **消融实验系统**：逐一验证了拉普拉斯模块、动态属性、自适应分裂、拉普拉斯损失的必要性，论证充分。


## 8. 不足与局限

1. **算力信息缺失**：论文未报告训练所需的GPU型号、数量、显存占用或训练时长，不利于其他研究者复现和评估方法的实际成本。

2. **数据集排除处理**：D-NeRF的Lego子集因训练-测试场景差异被排除，虽有其合理原因，但可能影响结论在类似场景下的泛化性论证。

3. **单目视频的深度歧义问题**：论文承认在D-NeRF的单目设置下存在深度歧义，虽然方法表现优于基线，但该问题本质未完全解决。

4. **实际部署考量未知**：作为ICLR 2026论文，方法在真实世界大规模动态场景（如户外、长视频）中的泛化能力和实时性尚未充分验证。

5. **与NeRF基方法的对比有限**：主要对比对象为动态3DGS方法，对NeRF基动态方法的对比相对较少（仅HyperNeRF一项），可能削弱与另一技术路线的对比说服力。


**（完）**
