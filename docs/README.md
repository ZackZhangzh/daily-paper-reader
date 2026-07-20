<div class="dpr-home-notice-card dpr-home-panel">
  <div class="dpr-home-notice-header dpr-home-panel-header">
    <h3 class="dpr-home-notice-title">公告与更新</h3>
    <a class="dpr-home-notice-tutorial" href="#/tutorial/README">使用教程 <span aria-hidden="true">›</span></a>
  </div>
  <div class="dpr-home-notice-entry">
    <time class="dpr-home-notice-date" datetime="2026-07-19">07.19</time>
    <div>
      <strong class="dpr-home-notice-entry-title">首页新增社区统计</strong>
      <span class="dpr-home-notice-entry-summary">现在可以看到今天看论文的人数和项目加入人数。</span>
    </div>
  </div>
  <div class="dpr-home-site-stats" data-dpr-site-stats hidden aria-live="polite">
    <span>今天有 <strong class="dpr-home-site-stat-value" data-dpr-daily-readers>--</strong> 人在看论文</span>
    <span class="dpr-home-site-stat-separator" aria-hidden="true">·</span>
    <span>已有 <strong class="dpr-home-site-stat-value" data-dpr-fork-count>--</strong> 人加入 Daily Paper Reader</span>
  </div>
</div>

## 每次日报
- 最新运行日期：2026-07-20
- 运行时间：2026-07-20 21:38:03 UTC
- 运行状态：成功
- 本次总论文数：17
- 精读区：6
- 速读区：11

### 今日简报（AI）
今日精读聚焦高斯泼溅（Gaussian Splatting）与生成流模型，共处理17篇论文，其中2篇获9.0高分。  
最值得关注的是《DP-Splat》对高斯泼溅复杂度控制的贝叶斯非参数化改进，以及《GeoGS-SLAM》利用几何先验实现单目在线重建，两者均指向更轻量、更鲁棒的3D视觉方案。  
若您非专业研究者，可优先关注这些方法如何提升手机端AR或实时建模的稳定性，后续可尝试开源代码验证实际效果。
- 详情：[/202607/20/README](/202607/20/README)

### 精读区论文标签
1. [DP-Splat: Bayesian Nonparametric Complexity Control for Gaussian Splatting](/202607/20/2607.10912v1-dp-splat-bayesian-nonparametric-complexity-control-for-gaussian-splatting)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：3DGS的贝叶斯非参数复杂度控制
2. [GeoGS-SLAM: Online Monocular Reconstruction Using Gaussian Splatting with Geometric Priors](/202607/20/2607.11184v1-geogs-slam-online-monocular-reconstruction-using-gaussian-splatting-with-geometric-priors)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：基于几何先验的3DGS在线单目稠密重建
3. [SalientGS: Unified SfM-to-3DGS with Importance-Guided MCMC Gaussian Allocation](/202607/20/2607.11285v2-salientgs-unified-sfm-to-3dgs-with-importance-guided-mcmc-gaussian-allocation)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：统一SfM到3DGS，重要性引导MCMC
4. [ABot-3DWorld 0: A Universal World Model to Explore Any 3D Space](/202607/20/2607.11673v2-abot-3dworld-0-a-universal-world-model-to-explore-any-3d-space)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：利用3D高斯泼溅进行多模态输入的三维世界重建与渲染
5. [The Geometry of Memorization: Finite-Time Spectral Sensitivity as a Diagnostic for Flow Matching Models](/202607/20/2607.12616v1-the-geometry-of-memorization-finite-time-spectral-sensitivity-as-a-diagnostic-for-flow-matching-models)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：流匹配生成模型的诊断指标
6. [ImprovedVBGS: Real-time Continual Variational Bayes Gaussian Splatting](/202607/20/2607.15542v1-improvedvbgs-real-time-continual-variational-bayes-gaussian-splatting)  
   标签：评分：9.0/10、query:dgs-fm
   evidence：实时连续变分贝叶斯高斯泼溅

### 速读区论文标签
1. [MetaView: Monocular Novel View Synthesis with Scale-Aware Implicit Geometry Priors](/202607/20/2607.12000v1-metaview-monocular-novel-view-synthesis-with-scale-aware-implicit-geometry-priors)  
   标签：评分：8.0/10、query:dgs-fm
   evidence：单目新视角合成，稀疏输入（单图），结合隐式几何
2. [Self-Consistent Flow: Unifying Velocity and Endpoint Prediction for Rectified Flow Models](/202607/20/2607.12171v1-self-consistent-flow-unifying-velocity-and-endpoint-prediction-for-rectified-flow-models)  
   标签：评分：8.0/10、query:dgs-fm
   evidence：统一修正流生成模型的速率与端点预测
3. [Lyapunov Guidance: A Unified Framework for Stabilizing Generative Flows](/202607/20/2607.14272v1-lyapunov-guidance-a-unified-framework-for-stabilizing-generative-flows)  
   标签：评分：8.0/10、query:dgs-fm
   evidence：流匹配引导与稳定化
4. [ConFlow: Constraints-Guided Learning with Flow Matching for Motion Generation](/202607/20/2607.14424v1-conflow-constraints-guided-learning-with-flow-matching-for-motion-generation)  
   标签：评分：8.0/10、query:dgs-fm
   evidence：流匹配用于生成建模
5. [LATO.2: Factorized 3D Mesh Generation with Vertex and Topology Flow](/202607/20/2607.10623v1-lato2-factorized-3d-mesh-generation-with-vertex-and-topology-flow)  
   标签：评分：7.0/10、query:dgs-fm
   evidence：使用流匹配进行因子化三维网格生成
6. [Contrastive-Augmented Flow Matching for Style-Content Disentanglement](/202607/20/2607.12404v1-contrastive-augmented-flow-matching-for-style-content-disentanglement)  
   标签：评分：7.0/10、query:dgs-fm
   evidence：流匹配生成模型用于连续概率路径
7. [SpeedyGS: Content-Aware 3D Gaussian Splatting Compression via Two-Stage Optimization](/202607/20/2607.12656v1-speedygs-content-aware-3d-gaussian-splatting-compression-via-two-stage-optimization)  
   标签：评分：7.0/10、query:dgs-fm
   evidence：3D高斯泼溅压缩，提升渲染速度
8. [RFMSR: Residual Flow Matching for Image Super-Resolution](/202607/20/2607.12753v1-rfmsr-residual-flow-matching-for-image-super-resolution)  
   标签：评分：7.0/10、query:dgs-fm
   evidence：残差流匹配用于图像超分辨率
9. [h-Flow: Flexible Flow-based Image Editing via Doob's h-Transform](/202607/20/2607.10800v1-h-flow-flexible-flow-based-image-editing-via-doobs-h-transform)  
   标签：评分：6.0/10、query:dgs-fm
   evidence：提出基于Doob h变换的无训练流式图像编辑方法
10. [HandFlow: Fully Generative 4D Hand Recovery with Flow Matching](/202607/20/2607.11221v1-handflow-fully-generative-4d-hand-recovery-with-flow-matching)  
   标签：评分：6.0/10、query:dgs-fm
   evidence：流匹配生成模型用于连续概率路径
11. [SeamGen: Artist-Aligned UV Seam Generation via Graph Flow Matching](/202607/20/2607.12379v1-seamgen-artist-aligned-uv-seam-generation-via-graph-flow-matching)  
   标签：评分：6.0/10、query:dgs-fm
   evidence：图流匹配用于UV接缝生成


<div class="dpr-home-promo-card dpr-home-panel">
  <div class="dpr-home-panel-header">
    <h3 class="dpr-home-promo-title">社区与支持</h3>
  </div>
  <p class="dpr-home-promo-copy">欢迎通过 Star、Fork、Issue 或 PR 一起完善 Daily Paper Reader。</p>
  <div class="dpr-home-promo-meta">
    <span>QQ群 <strong>583867967</strong></span>
    <span class="dpr-home-promo-separator" aria-hidden="true">·</span>
    <span>已有 <strong>1,491</strong> 人参与交流</span>
  </div>
</div>
