# PlanetSaber — CLAUDE.md

## プロジェクト概要

ブラウザベースの3Dアーケードシューティングゲーム。Three.js + Nuxt 4 (Vue 3) で構築。
プレイヤーが宇宙船を操作して敵を撃墜する。ゲーム本体と、ステージを設計するエディターの2機能を持つ。

- SSR無効（`ssr: false`）のSPAとして動作
- 開発サーバー: `http://localhost:3340`

## コマンド

```bash
npm install        # 依存インストール
npm run dev        # 開発サーバー起動 (localhost:3340)
npm run build      # プロダクションビルド
npm run generate   # 静的サイト生成
npm run preview    # プロダクションビルドのプレビュー
```

テストフレームワークは未導入。

## ディレクトリ構成

```
app/
├── pages/
│   ├── index.vue            # ゲーム画面
│   └── stage_editor.vue     # ステージエディター画面
├── components/
│   ├── game/                # ゲームUIコンポーネント (HUD, Canvas, Overlay)
│   └── stage_editor/        # エディターUIコンポーネント
├── game/                    # ゲームエンジン (Three.js ロジック)
│   ├── core/                # GameApp, GameState, EventBus
│   ├── entities/            # Player, Enemy variants, Projectile
│   ├── managers/            # Enemy/Projectile/Collision/Effect/Stage Manager
│   ├── types/               # TypeScriptの型定義
│   └── data/                # ステージデータ (stage1.ts など)
├── stage_editor/            # エディターエンジン
│   ├── core/                # StageEditorApp, State, Manager 群
│   ├── entities/            # EditorPlayer, EditorEnemy
│   └── types/               # エディター専用型定義
├── composables/             # Vue composables (ゲームループ, 入力, リサイズ)
└── assets/css/              # グローバルスタイル
```

## アーキテクチャ

### ゲームループ

```
useGameLoop() [requestAnimationFrame]
  → GameApp.update()
      → Player / EnemyManager / ProjectileManager
      → CollisionManager / EffectManager / StageManager
  → renderer.render()
```

### 主要パターン

- **EventBus**: ゲームシステム間の疎結合通信（`app/game/core/EventBus.ts`）
- **Managerパターン**: 各システム（敵・弾・衝突・エフェクト）を独立したManagerに分離
- **シングルトン**: `gameApp`, `gameState`, `eventBus` をモジュールレベルでexport
- **オブジェクトプール**: Projectile の再利用でGCを抑制

### 入力

- マウス移動 → 正規化座標 (-1〜1) でエイム
- マウス長押し → `fire_start` / `fire_end` イベント、0.15秒間隔で連射
- キーボード: R (リトライ), Esc (ポーズ)

### ステージデータ形式

`app/game/data/stage1.ts` を参照。進行度（0〜1）をキーに敵スポーンイベントを定義する。

## コーディング規約

- **言語**: TypeScript（型定義は `types/` に集約）
- **コメント**: 日本語でOK
- **UIコンポーネント**: Vue 3 SFC（`<script setup lang="ts">`）
- **ゲームロジック**: Vueに依存しない純粋なTypeScriptクラス (`app/game/`, `app/stage_editor/`)
- **新しい敵タイプ**: `Enemy.ts` を継承し、`EnemyManager` に登録する

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| フレームワーク | Nuxt 4 / Vue 3 |
| 3Dレンダリング | Three.js |
| 言語 | TypeScript |
| フォント | Google Fonts (Orbitron) |

## その他
- devサーバーはport3350を使用してください
- コミットは勝手にせず、ユーザーの指示のみでコミットしてください

