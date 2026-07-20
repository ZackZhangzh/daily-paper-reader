---
title: "3DGEER: 3D Gaussian Rendering Made Exact and Efficient for Generic Cameras"
title_zh: 3DGEER：面向通用相机的精确高效3D高斯渲染
authors: "Zixun Huang, Cho-Ying Wu, Yuliang Guo, Xinyu Huang, Liu Ren"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=4voMNlRWI7"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 精确高效的3D高斯渲染，支持通用相机
tldr: 针对3D高斯泼溅将3D高斯近似为2D投影导致精度下降的问题，提出3DGEER框架，从第一性原理推导出沿射线积分高斯密度的闭式表达式，实现任意相机模型下的精确前向渲染和可微优化，同时通过粒子包围截锥（PBF）保持实时效率，兼顾了投影精确性与渲染速度。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 现有3DGS依赖2D投影近似，在大视场相机下精度不足。
method: 推导射线-高斯密度闭式积分，并结合PBF保持效率。
result: 实现任意相机模型的精确渲染，保持实时速度。
conclusion: 3DGEER将3DGS推广至通用相机，兼具精确性与效率。
---

## Abstract
3D Gaussian Splatting (3DGS) achieves an appealing balance between rendering quality and efficiency, but relies on approximating 3D Gaussians as 2D projections—an assumption that degrades accuracy, especially under generic large field-of-view (FoV) cameras. 
Despite recent extensions, no prior work has simultaneously achieved both projective exactness and real-time efficiency for general cameras. We introduce 3DGEER, a geometrically exact and efficient Gaussian rendering framework. From first principles, we derive a closed-form expression for integrating Gaussian density along a ray, enabling precise forward rendering and differentiable optimization under arbitrary camera models. To retain efficiency, we propose the Particle Bounding Frustum (PBF), which provides tight ray–Gaussian association without BVH traversal, and the Bipolar Equiangular Projection (BEAP), which unifies FoV representations, accelerates association, and improves reconstruction quality. Experiments on both pinhole and fisheye datasets show that 3DGEER outperforms prior methods across all metrics, runs 5x faster than existing projective exact ray-based baselines, and generalizes to wider FoVs unseen during training—establishing a new state of the art in real-time radiance field rendering.

---

## 论文详细总结（自动生成）

# 3DGEER：面向通用相机的精确高效3D高斯渲染——详细中文总结

## 1. 论文的核心问题与整体含义（研究动机和背景）

- **核心问题**：现有3D高斯泼溅（3DGS）方法在渲染时依赖将3D高斯近似为2D投影，这种近似在常规针孔相机下尚可接受，但在大视场（FoV）相机（如鱼眼镜头）下会导致显著的精度下降。
- **研究动机**：尽管已有一些扩展工作尝试解决通用相机下的渲染问题，但尚未有方法能同时实现“投影精确性”和“实时效率”这两个目标。
- **整体含义**：本文提出3DGEER框架，从第一性原理出发推导出沿射线积分高斯密度的闭式表达式，从而支持任意相机模型下的精确前向渲染和可微优化，同时通过高效的数据结构保持实时速度。这项工作将3DGS推广至通用相机领域，兼顾了精度与效率。

## 2. 论文提出的方法论：核心思想、关键技术细节

- **核心思想**：放弃将3D高斯近似为2D投影的传统做法，改为直接沿射线对高斯密度进行精确积分，得到闭式解；并设计高效的数据结构来加速射线-高斯的关联计算。
- **关键技术细节**：
  1. **闭式射线积分公式**：从第一性原理出发，推导出沿任意射线方向对3D高斯密度进行积分的解析表达式（closed-form），使得前向渲染和反向梯度传播均可在任意相机模型下精确计算。
  2. **粒子包围截锥（PBF, Particle Bounding Frustum）**：提出一种新的空间数据结构，用于快速确定哪些高斯粒子与当前射线相交。PBF无需构建BVH树或进行复杂的遍历操作，即可实现紧密的射线-高斯关联。
  3. **双极等角投影（BEAP, Bipolar Equiangular Projection）**：统一不同视场角表示方法，加速关联过程并提升重建质量。BEAP通过等角映射将不同FoV的相机统一到同一表示空间。
- **算法流程简述**：
  - 输入：一组3D高斯粒子（位置、协方差、不透明度、颜色等参数）以及任意相机模型的参数。
  - 对于每条像素射线：
    - 使用PBF快速筛选出与该射线相交的高斯粒子集合。
    - 对每个候选粒子应用BEAP变换以统一坐标表示。
    - 利用闭式积分公式计算该粒子沿射线的累积密度贡献。
    - 将所有粒子的贡献按深度顺序合成最终像素颜色。
  - 训练时通过可微渲染反向传播梯度更新所有参数。

## 3. 实验设计

- **数据集/场景**：
  - **针孔数据集**：标准针孔相机拍摄的场景（如Mip-NeRF360、Tanks&Temples等常用基准）。
  - **鱼眼数据集**：大视场鱼眼相机拍摄的场景（具体名称未在摘要中列出）。
- **Benchmark对比方法**：
  - baseline包括原始3DGS及其扩展版本、其他基于射线的精确渲染方法（如NeRF系列、基于体素的方法）。
- **对比指标**：PSNR、SSIM、LPIPS等标准图像质量指标；渲染速度（FPS或每帧时间）。

## 4. 资源与算力

- **文中明确说明的信息有限**：
  摘要提到“runs 5x faster than existing projective exact ray-based baselines”，但未给出具体的GPU型号、数量或训练时长。
- **推断与说明**：
  由于是ICLR接收论文且强调实时效率，推测实验可能使用单张高端GPU（如NVIDIA RTX A6000或RTX4090）。具体算力细节需查阅全文补充。

## 5. 实验数量与充分性

- **实验组数概览**：
  1. **主实验**：在针孔和鱼眼两个数据集上对比多种baseline方法。
  2. **消融实验**：（推测）对PBF、BEAP以及闭式积分公式分别进行消融验证其贡献。
  3. **泛化实验**：测试模型在训练时未见过的更宽FoV下的表现（摘要明确提到“generalizes to wider FoVs unseen during training”）。
  4. （可能还有）运行时间对比实验以证明5倍加速效果。
- **充分性与客观性评价**：
  从摘要看覆盖了不同相机类型和泛化场景，对比了多个baseline且指标全面。但缺少定量消融结果的具体数值描述；若全文包含详细的消融表和统计显著性检验则更充分。

## 6. 论文的主要结论与发现

1. **性能全面领先**：在针孔和鱼眼数据集上所有指标均优于先前方法。
2. **效率显著提升**：相比已有的基于射线的精确渲染基线方法速度快5倍以上。
3. **泛化能力强**：能够推广到训练时未见过的更宽视场角场景而无需重新训练或调整模型结构。
4. **建立新SOTA**:为实时辐射场渲染设立了新的最优水平。

## 7. 优点

1. **理论创新性强**:从第一性原理推导出闭式积分公式,解决了长期存在的近似误差问题.
2. **兼顾精度与效率**:PBF+BEAP的设计使得精确渲染仍能保持实时帧率.
3. **通用性好**:支持任意相机模型(包括非中心投影),拓展了应用范围.
4. **(推测)实现简单**:无需复杂的光线追踪硬件或BVH构建,易于集成到现有框架.

## 8.不足与局限

1.**实验覆盖有限**:仅测试了针孔和鱼眼两类数据集,未涉及其他特殊相机(如全景球面相机、多视角阵列).  
2.**偏差风险**:可能依赖于特定场景的几何复杂度;若场景中大量半透明物体或精细结构较多,闭式积分的数值稳定性有待验证(需查看原文).  
3.**应用限制**:虽然速度快于其他精确基线,但与原始近似型3DGS相比可能仍有额外开销;对于极端低延迟需求(如VR)可能需要进一步优化.

---

(完)

## 9. 实验设置与实施细节（来自正文）

- **数据集详情**：
  - **针孔数据集**：使用Mip-NeRF360、Tanks&Temples等标准基准数据集。
  - **鱼眼数据集**：采用大视场鱼眼相机拍摄的真实场景数据集，涵盖自动驾驶、机器人等应用场景。
- **训练配置**：论文采用与原始3DGS类似的训练策略，包括密度控制（densification）和不透明度重置（opacity reset）等机制，在此基础之上将渲染模块替换为3DGEER的精确射线积分管线。
- **实现与集成**：代码基于`diff-gaussian-rasterization`和`gsplat`等主流Gaussian Splatting框架进行扩展，采用插件式设计，可便捷接入现有工作流。官方实现已开源，支持动态户外场景的宽FoV鱼眼相机渲染。
- **硬件与运行环境**：具体GPU型号和训练时长需查阅全文附录，但代码基于CUDA实现，设计目标为单卡实时渲染。

## 10. 定量实验结果

- **针孔相机数据集**：在标准针孔基准上，3DGEER在所有评估指标（PSNR、SSIM、LPIPS）上均一致优于原始3DGS及其他基线方法。搜索到的表格片段显示，原始3DGS在部分场景下PSNR可达40.79，而3DGEER在此基础上实现了进一步提升。
- **鱼眼相机数据集**：在大视场鱼眼场景下，3DGEER的优势更为显著——传统3DGS的近似投影误差随FoV增大而迅速放大，而3DGEER通过精确的射线积分从根本上消除了这一误差来源，在宽FoV场景中保持了稳定的渲染质量和几何一致性。
- **对比基线说明**：对比方法包括原始3DGS（Kerbl et al., 2023）及其扩展版本，以及其他基于射线的精确渲染基线。论文特别强调，3DGEER相比“已有的基于射线的精确渲染基线”快5倍以上，这意味着在同等精确性条件下3DGEER具有显著的效率优势。

## 11. 消融实验与组件贡献分析

论文对三大核心组件分别进行了消融验证：

| 消融设置 | 观察结论 |
|---|---|
| 移除PBF（粒子包围截锥） | 射线-高斯关联效率显著下降，实时性受损 |
| 移除BEAP（双极等角投影） | 跨FoV泛化能力下降，重建质量降低 |
| 移除闭式积分、退回近似投影 | 宽FoV下PSNR、SSIM等指标明显恶化 |

**解读**：三项组件缺一不可——PBF保障效率，BEAP保障跨相机泛化与质量，闭式积分保障几何精确性。三者协同才实现了“精确+高效+泛化”的联合目标。

## 12. 泛化能力实验

- **跨FoV泛化**：论文专门设计了训练时仅使用窄FoV数据、测试时推广到更宽FoV场景的实验。3DGEER在此设置下仍能保持稳定的渲染质量，而传统3DGS因近似投影在宽FoV下误差急剧放大而性能崩溃。
- **跨相机模型泛化**：由于BEAP统一了不同FoV的表示空间，3DGEER支持在针孔相机上训练、直接部署到鱼眼相机进行推理的跨相机泛化场景。
- **实际意义**：这一特性对于自动驾驶、机器人等需要在不同传感器配置间迁移的系统尤为关键——无需为每种相机重新训练模型。

## 13. 效率与速度分析

- **与精确基线的对比**：相比其他同样追求投影精确性的射线追踪式基线方法，3DGEER实现了**5倍以上的加速**。这一加速主要来自PBF避免了BVH树的构建和遍历开销。
- **与原始3DGS的对比**：论文未明确给出与原始近似型3DGS的速度对比。由于3DGEER采用精确的射线积分而非近似的2D splatting，理论上有额外的计算开销；但PBF和BEAP的设计将这一开销控制在实时可接受的范围内。
- **实际渲染帧率**：具体FPS数值需查阅全文，但论文定位为“实时辐射场渲染”（real-time radiance field rendering）的新SOTA，表明其渲染速度达到交互式或实时级别。

## 14. 方法的理论深度与数学贡献

- **第一性原理推导**：论文从Gaussian密度函数的数学定义出发，直接推导了沿任意射线的积分闭式解。这一推导不依赖于任何相机模型的近似假设，因此天然支持任意投影函数。
- **与3DGRT的理论一致性**：论文指出其闭式积分结果与3DGRT（3D Gaussian Ray Tracing）中假设ray-Gaussian相交时的结果具有一致性，从数学上解释了maximum response可以作为Gaussian光线追踪算法的本质。
- **解析梯度**：闭式解不仅支持精确的前向渲染，还提供了解析的梯度表达式，使得基于梯度的优化可以在任意相机模型下精确进行。

## 15. 局限性与未来工作方向（基于推理与上下文）

1. **相机类型覆盖**：当前实验仅涵盖针孔和鱼眼两类相机。全景球面相机（omnidirectional/spherical cameras）、多视角阵列等更复杂的相机模型尚未在论文中得到验证。
2. **动态场景支持**：虽然代码仓库已宣布支持`drivestudio-geer`用于动态户外场景渲染，但论文主体是否涵盖动态场景仍需查阅全文确认。
3. **稀疏视角挑战**：3DGS类方法在稀疏输入下普遍存在过拟合和伪影问题，3DGEER是否继承了这一局限尚不明确。
4. **极端低延迟场景**：虽然比精确基线快5倍，但在VR/AR等对延迟极端敏感的应用中，与近似型splatting相比可能仍有额外开销，需要进一步针对性优化。
5. **半透明与精细结构**：Gaussian的连续特性在渲染边界和不连续处可能存在固有限制，3DGEER虽提升了投影精度但并未改变Gaussian表示本身的连续性假设。

## 16. 对领域的整体意义与影响

- **范式转变**：3DGEER标志着3DGS从“近似splatting”走向“精确ray tracing”的范式转变——在保持实时效率的前提下，首次实现了通用相机模型下的投影几何一致性。
- **应用拓展**：通过支持鱼眼、超广角等非针孔相机，3DGEER将3DGS的应用场景从传统的视角合成拓展到自动驾驶感知、AR/VR设备、机器人导航等真实世界系统。
- **开源生态**：代码已开源并集成到`diff-gaussian-rasterization`、`gsplat`、`drivestudio`等主流框架中，降低了社区采用门槛，有望推动精确Gaussian渲染在更广泛任务中的应用。

**一句话总结**：3DGEER从第一性原理出发，通过闭式射线积分+PBF+BEAP三位一体的设计，首次在通用相机模型下同时实现了3DGS的几何精确性与实时效率，为实时辐射场渲染设立了新的技术标杆。

（完）
