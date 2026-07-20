---
title: "Purrception: Variational Flow Matching for Vector-Quantized Image Generation"
title_zh: Purrception：向量量化图像生成的变分流匹配
authors: "Răzvan-Andrei Matișan, Vincent Tao Hu, Grigory Bartosh, Björn Ommer, Cees G. M. Snoek, Max Welling, Jan-Willem van de Meent, Mohammad Mahdi Derakhshani, Floor Eijkelboom"
date: 2026-01-26
pdf: "https://openreview.net/pdf?id=SA8xDYrUYB"
tags: ["query:dgs-fm"]
score: 9.0
evidence: 变分流匹配用于图像生成
tldr: 本文提出Purrception，一种将变分流匹配应用于向量量化隐空间的图像生成方法。它在连续嵌入空间中计算速度场，同时学习代码本索引的分类后验，从而融合连续方法的几何感知与离散方法的显式监督。该方法支持不确定性量化和温度控制生成。在ImageNet-1k 256x256生成任务上，训练收敛速度优于连续流匹配和离散流匹配，展示了变分流匹配在高质量图像生成中的潜力。
source: ICLR-2026-Accepted
selection_source: conference_retrieval
motivation: 向量量化图像生成缺乏同时结合连续几何感知和离散监督的方法。
method: 提出变分流匹配，在连续嵌入空间学习速度场，并推断代码本索引的分类后验。
result: 在ImageNet-1k上训练收敛速度优于现有流匹配方法。
conclusion: 变分流匹配有效融合连续与离散优势，适用于高质量图像生成。
---

## Abstract
We introduce Purrception, a variational flow matching approach for vector-quantized image generation that provides explicit categorical supervision while maintaining continuous transport dynamics. Our method adapts Variational Flow Matching to vector-quantized latents by learning categorical posteriors over codebook indices while computing velocity fields in the continuous embedding space. This combines the geometric awareness of continuous methods with the discrete supervision of categorical approaches, enabling uncertainty quantification over plausible codes and temperature-controlled generation. We evaluate Purrception on ImageNet-1k $256 \times 256$ generation. Training converges faster than both continuous flow matching and discrete flow matching baselines while achieving competitive FID scores with state-of-the-art models. This demonstrates that Variational Flow Matching can effectively bridge continuous transport and discrete supervision for improved training efficiency in image generation.

---

## 论文详细总结（自动生成）

## 一、论文的核心问题与整体含义（研究动机和背景）

- **核心问题**：向量量化图像生成领域缺乏一种能够同时结合**连续方法的几何感知能力**与**离散方法的显式分类监督**的生成框架。
- **研究动机**：现有连续流匹配方法虽能捕捉数据空间的几何结构，但缺乏对离散代码本的显式监督；而离散流匹配方法虽能提供分类信号，却难以利用连续空间中的几何信息。两者各有局限，难以兼顾。
- **整体含义**：本文旨在通过**变分流匹配**（Variational Flow Matching）这一统一框架，将连续传输动力学与离散类别监督有机结合，为向量量化图像生成提供一种更高效、更灵活的解决方案。

## 二、方法论：核心思想、关键技术细节

- **核心思想**：在向量量化的隐空间中，**连续嵌入空间**中计算速度场（velocity field），同时**学习代码本索引的分类后验**（categorical posteriors over codebook indices）。这实现了连续方法与离散方法的融合。
- **关键技术细节**：
  - 将**变分流匹配**（Variational Flow Matching）推广至向量量化隐空间；
  - 模型在连续嵌入空间中维持传输动力学（transport dynamics），同时通过变分推断获得代码本索引的后验分布；
  - 该方法支持**不确定性量化**（uncertainty quantification）——即可对 plausible codes 给出概率估计；
  - 支持**温度控制生成**（temperature-controlled generation），通过调节温度参数控制生成样本的多样性。
- **算法流程**（文字说明）：模型首先将输入图像编码为向量量化隐空间中的离散代码本索引；变分流匹配框架在连续嵌入空间上定义速度场以描述概率路径；与此同时，通过变分推断学习代码本索引的分类后验分布，提供显式的类别监督；最终通过求解常微分方程（ODE）从先验分布生成新样本。

## 三、实验设计

- **数据集与场景**：在 **ImageNet-1k 256×256** 图像生成任务上进行评估。
- **Benchmark**：以 **FID**（Fréchet Inception Distance）作为主要评价指标，与当前最优模型（state-of-the-art）进行对比。
- **对比方法**：
  - **连续流匹配**（continuous flow matching）基线；
  - **离散流匹配**（discrete flow matching）基线。

## 四、资源与算力

论文提供的摘要和元数据中**未明确说明**所使用的GPU型号、数量及训练时长等具体算力信息。仅能从“训练收敛速度优于基线”这一结论推断其计算效率更高，但缺乏可量化的资源描述。

## 五、实验数量与充分性

- **实验组数**：从摘要信息来看，至少包含：
  - 与连续流匹配基线的对比实验；
  - 与离散流匹配基线的对比实验；
  - 与当前最优模型的FID对比。
- **充分性与公平性**：实验覆盖了主要的两类流匹配基线，且均在ImageNet-1k这一标准基准上进行评估，对比具有一定的代表性。但摘要中**未提及消融实验**（如温度控制、不确定性量化的具体影响分析），也**未展示不同分辨率或不同数据集上的泛化性验证**。因此，实验在广度上有所局限，充分性有待正文进一步补充。

## 六、论文的主要结论与发现

- **训练效率**：Purrception在ImageNet-1k 256×256生成任务上，**训练收敛速度优于**连续流匹配和离散流匹配基线。
- **生成质量**：在FID分数上达到了与当前最优模型**具有竞争力的表现**。
- **核心贡献**：验证了**变分流匹配能够有效桥接连贯传输与离散监督**，在提升图像生成训练效率方面展现出潜力。

## 七、优点（方法或实验设计上的亮点）

- **方法创新性**：首次将变分流匹配应用于向量量化图像生成，实现了连续几何感知与离散类别监督的**有机融合**，而非简单的组合。
- **功能丰富性**：支持**不确定性量化**和**温度控制生成**，为生成模型提供了更灵活的控制手段，这是许多现有方法不具备的特性。
- **效率优势**：在标准基准上验证了**更快的训练收敛速度**，说明该方法在计算效率方面具有实际价值。

## 八、不足与局限

- **实验覆盖不足**：仅在ImageNet-1k 256×256单一数据集和分辨率上进行了评估，**缺乏在其他数据集（如CIFAR、CelebA）或更高分辨率上的验证**。
- **消融分析缺失**：摘要中未提及对温度控制、不确定性量化等核心功能模块的**消融实验**，其实际贡献程度尚不明确。
- **算力信息不透明**：未报告具体的GPU型号、数量及训练时长，**不利于实验的可复现性和公平对比**。
- **应用限制**：作为图像生成方法，其**泛化性**（如迁移到视频生成、文本到图像生成等其他模态）尚未得到验证。

（完）
