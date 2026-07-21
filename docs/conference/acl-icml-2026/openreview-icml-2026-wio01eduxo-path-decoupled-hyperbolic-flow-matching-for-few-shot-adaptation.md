---
title: Path-Decoupled Hyperbolic Flow Matching for Few-Shot Adaptation
title_zh: 路径解耦双曲流匹配用于少样本适应
authors: "Lin Li, Ziqi Jiang, Gefan Ye, Zhenqi He, Jiahui Li, Jun Xiao, Kwang-Ting Cheng, Long Chen"
date: 2026-04-30
pdf: "https://openreview.net/pdf/438fe905f9dbaef3c40450f78eed838baf7e1884.pdf"
tags: ["query:dgs-fm"]
score: 8.0
evidence: 双曲流匹配用于特征传输
tldr: 跨模态少样本适应中欧氏流匹配存在路径纠缠问题。本文提出路径解耦双曲流匹配（HFM），利用Lorentz流形的指数膨胀实现轨迹解耦，通过向心双曲对齐和路径解耦目标构建有序流动。该方法在少样本适应任务上显著优于欧氏流匹配。
source: ICML-2026-Accepted
selection_source: conference_retrieval
motivation: 欧氏流匹配路径纠缠，无法适应多样特征分布。
method: 提出双曲流匹配，利用Lorentz流形解耦路径。
result: 在少样本适应任务上优于欧氏流匹配。
conclusion: 双曲流匹配为特征传输提供了更优几何结构。
---

## Abstract
Recent advances in cross-modal few-shot adaptation treat visual-semantic alignment as a continuous feature transport problem via Flow Matching (FM). However, we argue that Euclidean-based FM overlooks fundamental limitations of flat geometry, where polynomial volume growth fails to accommodate diverse feature distributions, leading to severe path entanglement. To this end, we propose path-decoupled Hyperbolic Flow Matching (HFM), leveraging the Lorentz manifold's exponential expansion for trajectory decoupling. HFM structures the transport via two key designs: 1) Centripetal hyperbolic alignment: It constructs a centripetal hierarchy by anchoring textual roots, which pushes visual leaves to the boundary to initialize orderly flows. 2) Path-decoupled objective: It acts as a "semantic guardrail" rigidly confining trajectories within isolated class-specific geodesic corridors via step-wise supervision. Furthermore, we devise an adaptive diameter-based stopping to prevent over-transportation into the crowded origin based on the intrinsic semantic scale. Extensive ablations on 11 benchmarks have shown that HFM establishes a new state-of-the-art, consistently outperforming its Euclidean counterparts. Our codes and models will be released.

---

## 论文详细总结（自动生成）

## 1. 核心问题与整体含义

**研究背景**：跨模态少样本适应旨在利用极少量标注样本，将预训练视觉-语言模型（如CLIP）的视觉特征与对应的文本原型对齐。现有方法主要分为两类：一是参数高效微调（PEFT）技术（如提示学习、适配器模块），但这类方法依赖“单步”调整，难以处理复杂的语义纠缠；二是基于流匹配（Flow Matching, FM）的方法，将视觉-语义对齐建模为连续的特征传输问题，通过多步迭代修正实现更优的表达能力。

**核心问题**：论文指出，**基于欧氏空间的流匹配存在严重的路径纠缠问题**。其根本原因在于欧氏空间的**多项式体积增长**无法容纳多样化的特征分布，导致两类结构性干扰：
- **无序的跨模态流**：图像特征与文本原型位置分布不规则，长距离传输增加轨迹碰撞风险（如“猫”的流与“虎”的流交叉纠缠）。
- **拥挤的类间流**：不同类别的流源在空间中无意重叠，容易被高密度邻域簇带偏。

**研究动机**：为克服欧氏空间的上述局限，论文提出**路径解耦双曲流匹配（Hyperbolic Flow Matching, HFM）** ，利用洛伦兹流形的**指数级体积扩张**实现轨迹的空间解耦。

---

## 2. 方法论

### 核心思想

将传输动力学重铸于**洛伦兹流形（Lorentz manifold）** 之上，利用双曲几何的指数体积增长特性，将传输轨迹在空间上解耦，从根本上缓解路径纠缠问题。HFM包含三个核心阶段。

### 关键技术细节

**（1）向心双曲对齐（Centripetal Hyperbolic Alignment）**

在特征空间构建向心层级结构：将文本原型锚定在原点附近作为“语义根”，将视觉特征推向流形边界作为“叶子”。具体通过两类损失函数实现：
- **双曲蕴含损失**（Hyperbolic Entailment Loss）：强制文本原型在几何上“蕴含”图像特征，将图像约束在文本的蕴含锥内。
- **双曲对比损失**（Hyperbolic Contrastive Loss）：最小化图像特征与其真实类别文本原型的测地线距离，同时最大化与其他原型的距离。

**（2）路径解耦目标（Path-Decoupled Objective）**

在流匹配阶段，网络预测切空间速度向量，通过指数映射投影回流形，引导特征沿测地线路径从视觉叶子流向语义根。优化目标包含两项：
- **步态一致性损失**（Step-wise Consistency Loss）：最小化预测状态与真实测地线目标之间的平方黎曼距离。
- **类间解耦损失**（Inter-Class Decoupling Loss）：在每一步强制预测状态与其真实原型相似、远离负原型，形成“语义护栏”将轨迹限制在类别专属的测地线通道内。

**（3）自适应直径停止策略（Adaptive Diameter-based Stopping）**

推理阶段，基于语义直径（各类别文本原型之间的最大测地线距离）设定动态终止阈值，当特征到最近原型的距离低于该阈值时提前终止传输，防止过传输进入拥挤的原点区域。

---

## 3. 实验设计

### 数据集与场景

论文在**11个标准少样本图像分类基准**上进行了评估，包括：
- **困难组**（5个）：Aircraft、EuroSAT、DTD、SUN397、UCF101。
- **容易组**（6个）：StanfordCars、ImageNet、Flowers102、Food101、OxfordPets、Caltech101。

采用标准的K-shot设置（K=1, 4, 16），从每类均匀采样K张标注图像构成训练集。

### 对比方法

对比了**10种主流少样本分类方法**：CLIP（零样本）、CoOp、CoCoOp、TIP-Adapter、CLIP-Adapter、PLOT++、KgCoOp、ProGrad、CLIP-LoRA，以及欧氏流匹配方法FMA（2025）。所有方法均使用**CLIP ViT-B/16**作为统一骨干网络。

---

## 4. 资源与算力

**论文未明确提及具体的GPU型号、数量、训练时长等算力信息**。仅能推断其计算开销应与同类流匹配方法（如FMA）相当，因为HFM采用了与FMA相同的轻量级流匹配网络架构（基于MAR的深度残差MLP）。

---

## 5. 实验数量与充分性

**实验数量**：论文开展了**多组系统性实验**，包括：
- **主实验**（11个数据集 × 3种shot设置 × 10+种对比方法）；
- **消融实验**：验证三个核心模块（向心双曲对齐CHA、路径解耦目标PO、直径停止DS）的有效性；
- **模型无关泛化实验**：将HFM集成到CoOp、CoCoOp、CLIP-Adapter、CLIP-LoRA等多种PEFT架构上进行验证。

**充分性与客观性评价**：
- **充分性较高**：11个基准覆盖了细粒度分类、场景识别、纹理识别、动作识别等多种视觉任务；3种shot设置覆盖了从极低资源（1-shot）到相对充足（16-shot）的不同数据稀缺程度；消融实验逐一验证了各模块的独立贡献。
- **客观性良好**：所有对比方法使用统一的CLIP ViT-B/16骨干网络，结果取3次随机种子的平均值，保证了公平比较。

---

## 6. 主要结论与发现

1. **HFM在11个基准上持续超越所有SOTA方法**，在困难组数据集上1-shot达到64.1%、16-shot达到79.8%的平均准确率。
2. **相比欧氏流匹配FMA**，HFM在困难组上1-shot提升3.5%、16-shot提升2.1%；在结构复杂的数据集（如EuroSAT、DTD）上优势尤为显著，1-shot下分别超出FMA达8.0%和3.5%。
3. **相比强基线CLIP-LoRA**，HFM在困难数据集上带来3.7%–4.3%的一致增益。
4. **消融实验表明**：三个核心模块各自贡献显著——向心层级结构提供了优于欧氏空间的几何初始化；路径解耦目标有效减少了类间干扰；直径停止策略防止过传输、保持判别性。
5. **HFM具备模型无关的泛化能力**，可无缝集成到多种PEFT架构中并带来一致的性能提升。

---

## 7. 方法亮点

- **几何先验的引入**：首次将双曲几何引入流匹配框架用于少样本适应，利用洛伦兹流形的指数体积扩张从根本上解决欧氏空间的路径纠缠问题。
- **三级系统设计**：从空间构建（向心对齐）、过程约束（路径解耦目标）到推理终止（直径停止）形成完整的闭环优化。
- **“语义护栏”机制**：步态级对比监督在每一传输步强制类别分离，刚性约束轨迹于类别专属测地线通道。
- **自适应推理终止**：基于语义直径的动态停止策略兼顾精度与效率，防止过传输。
- **即插即用**：HFM可作为插件模块集成到多种PEFT方法中，具有广泛的适用性。

---

## 8. 不足与局限

- **算力信息缺失**：论文未报告训练所需的GPU型号、数量、训练时长等关键资源消耗信息，不利于实际部署时的资源评估。
- **任务覆盖单一**：实验仅覆盖图像分类任务，未涉及其他少样本适应场景（如检测、分割、跨模态检索等）。
- **理论基础有待深化**：虽然实验验证了双曲流匹配的有效性，但对于“为什么双曲几何特别适合解决路径纠缠”这一核心问题，缺乏更深入的理论分析与几何直观的形式化证明。
- **超参数敏感性未充分讨论**：模型涉及曲率κ、尺度因子α、蕴含锥角度H、平衡权重λ等多个超参数，论文未系统分析这些超参数对性能的影响。
- **大规模场景验证不足**：实验基于CLIP ViT-B/16，未在更大规模模型或更高分辨率设定下验证方法的可扩展性。

（完）
