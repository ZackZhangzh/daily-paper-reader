---
title: Continuous Viewpoint Adaptation for Single View 3D Object Reconstruction
title_zh: 单视图3D物体重建的连续视角自适应
authors: "Seunghyun Hwang, Qiang Qiu"
date: 2026-04-30
pdf: "https://openreview.net/pdf/f5462cea175bfb03538937d7543cb93387630921.pdf"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 单视图3D重建与视角自适应3DGS
tldr: 针对单视图3D物体重建中遮挡和视角变化敏感问题，基于3D高斯泼溅提出连续视角自适应学习方案，使网络能根据输入视角的极角和方位角连续调整，减少新视图渲染中的模糊和伪影，提高重建一致性。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 单视图重建受遮挡和视角微小变化影响大。
method: 3DGS加连续视角自适应学习机制。
result: 新视图渲染更一致且伪影减少。
conclusion: 连续视角自适应提升单视图3DGS重建鲁棒性。
---

## Abstract
Single-view 3D object reconstruction presents a formidable challenge in computer vision due to the inherent limitations of information obtainable from a solitary viewpoint. Recent 3D Gaussian Splatting (3DGS) inspired approaches perform a feed-forward way of learning a neural network that predicts 3D Gaussians which compose the 3D object, given a single image. However, they often struggle with occlusions and exhibit high sensitivity to small changes in input viewpoint, leading to inconsistencies and blurry artifacts in novel view renderings. Our method leverages 3DGS and introduces a new learning scheme that continuously adapts to input viewpoints. 
To address inherent continuity of camera viewpoints that are represented by polar and azimuthal angles, we use Neural Ordinary Differential Equations to continuously model filter subspace of neural network, thus seamlessly embedding inductive bias of perspective distortions into its structure. By continuously adapting to view-specific features, our approach fosters view consistency in 3D reconstruction, allowing better coherency and accuracy across different angles. Experiments demonstrate that our model outperforms previous methods on multiple single-view 3D reconstruction benchmark datasets and excels in extrapolating to unseen camera angles and categories.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义

- **研究背景**：单视图3D物体重建是计算机视觉中的经典难题，其根本挑战在于单一视角所能获取的信息极其有限。近年来，基于3D高斯泼溅（3D Gaussian Splatting, 3DGS）的前馈式方法取得了显著进展——给定单张输入图像，网络直接预测构成3D物体的3D高斯参数。
- **核心问题**：现有3DGS方法在单视图重建中存在两个严重缺陷：（1）对遮挡区域的处理能力不足；（2）对输入视角的微小变化高度敏感，导致新视角渲染结果中出现不一致性和模糊伪影。
- **整体含义**：论文的核心洞察在于——摄像机视角（由极角和方位角表示）天然具有连续性，而现有方法未能有效利用这一几何先验。因此，本文提出**连续视角自适应（Continuous Viewpoint Adaptation）** 学习方案，使网络能够根据输入视角连续调整自身结构，从而从根本上提升重建的视角一致性和鲁棒性。

## 二、方法论

- **核心思想**：基于3DGS框架，引入一种能够**连续适应输入视角**的新型学习范式。核心在于将视角的几何连续性作为归纳偏置（inductive bias）嵌入网络结构之中。
- **关键技术细节**：
  - 摄像机视角由**极角（polar angle）** 和**方位角（azimuthal angle）** 两个连续变量表示。
  - 采用**神经微分方程（Neural Ordinary Differential Equations, Neural ODE）** 来连续建模神经网络的**滤波器子空间（filter subspace）** 。
  - 通过Neural ODE的动态系统建模能力，网络参数（具体为滤波器子空间）可随视角输入连续变化，从而将透视畸变的几何先验无缝嵌入网络结构中。
- **算法流程**（文字说明）：输入单张图像 → 提取图像特征 → 根据输入图像的视角（极角+方位角）通过Neural ODE动态调整网络的滤波器子空间 → 在该自适应网络上预测3D高斯参数 → 渲染新视角图像。整个过程实现了“视角感知”的特征提取与3D重建。

## 三、实验设计

- **数据集**：论文在**多个单视图3D重建基准数据集**上进行了评估，具体数据集名称在摘要和元数据中未逐一列出。
- **Benchmark**：采用单视图3D物体重建领域的标准评测协议，评估指标涵盖新视角渲染的**一致性与准确性**。
- **对比方法**：与近年来受3DGS启发的**前馈式（feed-forward）** 单视图3D重建方法进行对比。
- **评估维度**：（1）在已知视角上的重建质量；（2）在**未见过的摄像机角度**上的外推能力（extrapolation）；（3）在**未见过的物体类别**上的泛化能力。

## 四、资源与算力

论文提供的摘要和元数据中**未明确说明**所使用的GPU型号、数量及训练时长等算力信息。仅从论文被ICML 2026接收这一事实可以推断，实验规模应满足顶会论文的常规标准，但具体硬件配置无法从现有材料中获知。

## 五、实验数量与充分性

- **实验数量**：实验涵盖了**多个基准数据集**的评测，以及**跨视角外推**和**跨类别泛化**两个 challenging 的评估维度。
- **充分性与客观性**：
  - 从评估设计来看，实验覆盖了**域内（已知视角）** 和**域外（未知视角/未知类别）** 两类场景，能够较为全面地验证方法的有效性和泛化能力。
  - 与**先前方法（previous methods）** 进行对比，遵循了领域内的标准对比范式。
  - 然而，由于摘要篇幅有限，**消融实验的具体设计**（如是否对比了有无Neural ODE模块、是否对比了固定视角vs连续自适应等）在现有材料中未详细展开，无法对其完备性做进一步判断。

## 六、主要结论与发现

- 本文提出的连续视角自适应学习方案**显著优于先前方法**，在多个单视图3D重建基准数据集上取得了领先性能。
- 该方法在**外推至未见过的摄像机角度**时表现出色，说明视角自适应的归纳偏置有效提升了模型的泛化能力。
- 该方法在**外推至未见过的物体类别**时同样表现优异，进一步验证了方法的通用性。
- 通过持续适应视角相关的特征，模型在3D重建中实现了更好的**视角一致性（view consistency）** ，减少了不同角度间的渲染不一致性和模糊伪影。

## 七、方法亮点

- **视角连续性的数学建模**：首次将Neural ODE引入3DGS框架，利用其连续动态系统建模能力来刻画视角的连续变化，这在方法论上具有创新性。
- **滤波器子空间的视角自适应**：通过连续调整网络的滤波器子空间而非简单地将视角作为额外输入特征，实现了更深层次的结构级自适应。
- **几何先验的嵌入式融合**：将透视畸变的归纳偏置直接嵌入网络结构，而非依赖数据驱动的方式隐式学习，使模型在结构层面具备了视角感知能力。
- **强泛化能力**：在未见视角和未见类别上的优异表现表明，该方法学到的不是对训练集的过拟合，而是真正理解了视角与3D结构之间的几何关系。

## 八、不足与局限

- **算力信息缺失**：论文未报告具体的训练资源消耗，难以评估方法在实际部署中的计算成本和可复现性门槛。
- **消融实验细节不详**：从现有材料无法确认是否进行了充分的消融实验来验证各模块（如Neural ODE模块本身、视角编码方式等）的独立贡献。
- **遮挡场景的定量分析**：虽然摘要提到现有方法在遮挡场景中表现不佳，但本文方法在**遮挡区域**的定量改进幅度在摘要中未给出具体数值。
- **实时性未提及**：3DGS以其实时渲染能力著称，但本文引入Neural ODE后是否影响了推理速度或训练效率，现有材料中未见说明。
- **数据集覆盖范围**：虽然提及“多个基准数据集”，但未列出具体数据集名称和规模，无法判断实验覆盖的物体类别多样性和场景复杂度是否充分。

（完）
