---
title: "SoMA: A Real-to-Sim Neural Simulator for Robotic Soft-Body Manipulation"
title_zh: SoMA：机器人软体操纵的实时到仿真神经模拟器
authors: "Mu Huang, Hui Wang, Kerui Ren, Linning Xu, Yunsong Zhou, Mulin Yu, Bo Dai, Jiangmiao Pang"
date: 2026-04-30
pdf: "https://openreview.net/pdf/c77e2f4ea7545f76b7f115edfbce7382986c1c09.pdf"
tags: ["query:dgs-physics"]
score: 9.0
evidence: 3D高斯泼溅模拟器用于软体变形仿真
tldr: 软体操纵仿真面临物理精度和泛化性挑战，本文提出SoMA，一种基于3D高斯泼溅的神经模拟器，将变形动力学、环境力和机器人关节动作统一于潜在神经空间，实现端到端的真实到仿真模拟，支持可控稳定长时程操纵和轨迹泛化。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 现有模拟器依赖预定义物理或数据驱动动力学，缺乏机器人条件控制，精度和泛化性不足。
method: 利用3D高斯泼溅作为表示，在统一潜在空间中耦合变形、环境力和机器人动作，进行端到端学习。
result: 实现了可控稳定的长时程软体操纵模拟，并泛化到未观察轨迹。
conclusion: SoMA为基于3DGS的软体物理模拟提供了通用且可扩展的框架。
---

## Abstract
Simulating deformable objects under rich interactions remains a fundamental challenge for real-to-sim robot manipulation, with dynamics jointly driven by environmental effects and robot actions.
Existing simulators rely on predefined physics or data-driven dynamics without robot-conditioned control, limiting accuracy, stability, and generalization.
This paper presents \textbf{SoMA}, a 3D Gaussian Splat simulator for soft-body manipulation.
SoMA couples deformable dynamics, environmental forces, and robot joint actions in a unified latent neural space for end-to-end real-to-sim simulation.
Modeling interactions over learned Gaussian splats enables controllable, stable long-horizon manipulation and generalization beyond observed trajectories without predefined physical models.
SoMA improves resimulation accuracy and generalization on real-world robot manipulation by 20\%, enabling stable simulation of complex tasks such as long-horizon cloth folding. **Project Page: city-super.github.io/SoMA**

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

**研究背景**：软体物体（如布料、绳索、玩偶等）在机器人操作下会发生复杂变形，其动力学由环境力和机器人动作共同驱动。实现“真实到仿真”（real-to-sim）的软体操纵模拟，是机器人领域的一项基础性难题。

**核心问题**：现有模拟器存在两方面的根本缺陷：
- **基于预定义物理模型的模拟器**：依赖人工设定的物理公式，面对真实世界中软体物体的不确定性（如材质差异、环境变化）时，精度和稳定性不足；
- **基于数据驱动的动力学模型**：虽然能够从数据中学习，但缺乏机器人条件控制（robot-conditioned control），无法根据机器人关节动作进行端到端的条件化模拟，泛化能力受限。

**整体含义**：SoMA 提出了一种**无需预定义物理模型**的端到端神经模拟框架，将变形动力学、环境力和机器人关节动作统一在潜在神经空间中学习，使机器人能够像“学徒”一样通过观察真实操作来理解软体物体的行为规律。

---

## 2. 方法论

**核心思想**：SoMA 利用 **3D 高斯泼溅（3D Gaussian Splatting, 3DGS）** 作为场景表示，在统一的潜在神经空间中耦合三种关键因素——软体变形动力学、环境作用力、机器人关节动作——实现端到端的真实到仿真模拟。

**关键技术细节**：

- **输入与输出**：以真实世界机器人操作中采集的 **多视角 RGB 视频** 和 **机器人关节空间动作** 为输入。输出为可控的、多视角一致的软体变形仿真。

- **场景到仿真的映射（Scene-to-Simulation Mapping）** ：将真实世界观测对齐到一个以机器人运动学为基准的统一仿真空间。这一过程解决了摄像头视角、机器人动作空间和虚拟仿真环境三者坐标系统不统一的问题。

- **层次化高斯泼溅表示**：将变形物体重建为**层次化的高斯泼溅**（hierarchical Gaussian splats），每个高斯泼溅带有位置、大小、颜色、透明度等属性。这些高斯泼溅在神经模拟器中被逐步传播和更新。

- **基于力的交互建模**：物体运动由**基于力的交互**驱动——环境力（如重力、接触力）和机器人施加的力作用于高斯泼溅，产生符合物理规律的变形。渲染和动力学的联合监督信号用于训练神经模拟器。

- **两阶段多分辨率训练策略**：
    - **第一阶段**：以大时间间隔捕捉物体的**全局运动趋势**和整体模式；
    - **第二阶段**：以小时间间隔精修遮挡和接触条件下的**细粒度动力学**。

> **注**：用户提供的 PDF 提取文本中未包含完整的公式和算法流程，以上描述基于项目页面和相关公开资料综合整理。

---

## 3. 实验设计

**测试场景与物体类型**：SoMA 在**多种软体物体**上进行了验证，涵盖了不同几何形态：
- **近线性物体**：绳索（rope）
- **近平面物体**：布料（cloth）
- **体积物体**：玩偶（doll）

**基准（Benchmark）** ：实验聚焦于两类核心任务：
- **重模拟（Resimulation）** ：在训练轨迹上复现观察到的动力学
- **泛化（Generalization）** ：泛化到**未见过的机器人动作和接触配置**

**对比方法**：论文对比了两种基线方法：
- **PhysTwin**：基于物理信息重建与仿真的方法——在复杂或未见交互场景下因真实-仿真不匹配（real-to-sim mismatch）而出现偏差
- **GausSim**：另一种基于高斯泼溅的方法——在挑战性场景中常保持静态或不稳定

**评估指标**：采用**基于图像的指标**和**基于深度的指标**进行定量评估。

---

## 4. 资源与算力

**用户提供的论文内容中未明确说明**所使用的 GPU 型号、数量、训练时长等算力信息。根据公开资料，论文发表于 arXiv（编号 2602.02402），但具体的硬件配置和训练开销在现有可获取的材料中未被提及。

---

## 5. 实验数量与充分性

根据现有可获取信息：
- 实验覆盖了**三种不同几何类型的软体物体**（绳索、布料、玩偶），具有一定的多样性。
- 对比了**两种基线方法**（PhysTwin 和 GausSim）。
- 评估了**重模拟和泛化两种能力**，并采用**图像和深度两类指标**。
- 项目页面展示了**多视角一致性验证**和**定性结果**。

**评估**：从现有信息来看，实验设计在物体类型、任务类型和评估维度上具备一定的全面性。但**由于无法访问论文全文**，以下关键信息尚不明确：
- 是否进行了系统的**消融实验**（如两阶段训练策略的有效性、各模块的贡献等）
- 数据集的**具体规模**（轨迹数量、视频帧数等）
- **统计显著性**和**误差棒**等细节

总体而言，实验设计**方向合理**，但**充分性的全面判断需要依赖全文内容**。

---

## 6. 主要结论与发现

1. **精度提升显著**：SoMA 在真实世界机器人操作的重模拟精度和泛化能力上相比基线方法**提升了 20%** 。

2. **长时程稳定仿真**：SoMA 能够实现对复杂任务（如**长时程布料折叠**）的稳定仿真，这是现有方法难以做到的。

3. **无需预定义物理模型**：通过在学习的 Gaussian Splats 上建模交互，SoMA 摆脱了对预定义物理模型的依赖，实现了数据驱动的端到端学习。

4. **强泛化能力**：SoMA 能够泛化到训练中未观察到的机器人动作轨迹和接触配置。

5. **多视角一致性**：方法在多个视角下均能保持一致的 3D 几何结构和物理合理的动力学。

---

## 7. 优点

**方法论层面**：
- **统一的端到端框架**：首次将变形动力学、环境力和机器人关节动作在统一潜在空间中耦合，实现了真正意义上的机器人条件控制。
- **无需预定义物理模型**：摆脱了传统物理模拟器对人工设定物理参数的依赖，更适应真实世界的复杂性。
- **3DGS 表示的创新应用**：将 3D 高斯泼溅从单纯的渲染表示拓展为物理仿真的载体，兼具高保真渲染和物理建模能力。
- **两阶段训练策略**：先全局后局部的训练方式有效应对了长期仿真中的误差累积问题。
- **遮挡处理**：通过对可见区域直接学习、对遮挡区域基于物理一致性进行推测，实现了“智能补全”。

**实验层面**：
- **真实世界数据驱动**：基于真实机器人操作的多视角 RGB 视频和关节动作进行训练，贴近实际应用场景。
- **物体类型覆盖全面**：涵盖线性、平面和体积三类软体物体，验证了方法的通用性。
- **多维度评估**：同时采用图像和深度指标，兼顾视觉质量和几何精度。

---

## 8. 不足与局限

**基于现有公开信息的判断**：

- **实验细节缺失**：从公开材料中难以获知数据集的规模、消融实验的完整性、统计显著性等关键信息，这些对于评估方法的鲁棒性和可复现性至关重要。

- **对比方法的代表性**：目前仅对比了 PhysTwin 和 GausSim 两种方法，与其他主流软体模拟方法（如基于 MPM、FEM 的模拟器或其它神经模拟器）的对比尚未在公开信息中体现。

- **应用场景的边界**：虽然覆盖了绳索、布料和玩偶，但**更复杂**的软体物体（如多材料复合物体、流固耦合场景等）的适用性尚未验证。

- **实时性**：公开信息未明确说明 SoMA 的推理速度是否满足实时控制的需求。

- **算力需求不明确**：训练成本（GPU 型号、数量、时长）未在公开材料中披露，这限制了其他研究者的复现和实际部署参考。

- **真实到仿真的一致性问题**：尽管方法名为“真实到仿真”，但从真实观测到仿真空间的对齐精度、以及仿真与真实之间可能存在的系统性偏差，在公开信息中缺乏深入讨论。

---

（完）
