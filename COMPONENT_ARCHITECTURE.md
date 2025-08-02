# コンポーネントアーキテクチャ - 2層構造アプローチ

## 基本原則

### 🌐 グローバルコンポーネント（src/components/）
**2つ以上のページで使用される、または将来的に再利用される可能性が高いコンポーネント**

### 📍 ページ専用コンポーネント（src/pages/PageName/components/）
**特定のページでのみ使用される、そのページの文脈に強く依存するコンポーネント**

## 詳細な分類基準

### src/components/ui/ - 汎用UIコンポーネント
```typescript
// ✅ 配置すべきコンポーネント
├── Button/
│   ├── Button.tsx              # 基本ボタン
│   ├── SubmitButton.tsx        # 送信ボタン
│   └── CancelButton.tsx        # キャンセルボタン
├── Form/
│   ├── Input.tsx               # 入力フィールド
│   ├── TextArea.tsx            # テキストエリア
│   ├── Select.tsx              # セレクトボックス
│   └── Checkbox.tsx            # チェックボックス
├── Modal/
│   ├── Modal.tsx               # 基本モーダル
│   ├── ConfirmModal.tsx        # 確認モーダル
│   └── AlertModal.tsx          # アラートモーダル
├── Layout/
│   ├── Card.tsx                # カードレイアウト
│   ├── Grid.tsx                # グリッドレイアウト
│   └── Container.tsx           # コンテナ
└── Feedback/
    ├── LoadingSpinner.tsx      # ローディング
    ├── ErrorMessage.tsx        # エラーメッセージ
    └── SuccessMessage.tsx      # 成功メッセージ
```

### src/components/features/ - 機能横断コンポーネント
```typescript
// ✅ 複数ページで使用される機能的コンポーネント
├── auth/
│   ├── LoginForm/              # ログインページ、モーダルで使用
│   ├── SignUpForm/             # 登録ページ、モーダルで使用
│   └── UserProfile/            # ヘッダー、設定ページで使用
├── recipe/
│   ├── RecipeSearchBar/        # レシピ一覧、ヘッダーで使用
│   ├── RecipeCard/             # 一覧、関連レシピで使用
│   └── RecipeRating/           # 詳細、一覧で使用
├── ingredient/
│   ├── IngredientSelector/     # レシピ作成、編集で使用
│   └── UnitConverter/          # 複数の食材関連ページで使用
└── menu-plan/
    ├── CalendarWidget/         # メニュープラン、ダッシュボードで使用
    └── MealSlot/               # カレンダー、週間表示で使用
```

### src/components/layout/ - レイアウトコンポーネント
```typescript
// ✅ アプリ全体の構造に関わるコンポーネント
├── Header/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   └── UserMenu.tsx
├── Footer/
│   └── Footer.tsx
├── Sidebar/
│   ├── Sidebar.tsx
│   └── SidebarMenu.tsx
└── Layout/
    ├── AppLayout.tsx           # メインレイアウト
    ├── AuthLayout.tsx          # 認証ページ用レイアウト
    └── DashboardLayout.tsx     # ダッシュボード用レイアウト
```

## ページ専用コンポーネントの例

### RecipeDetailPage/components/
```typescript
// 📍 RecipeDetailPageでのみ使用
├── RecipeHeader/
│   ├── RecipeHeader.tsx        # レシピタイトル、作者、評価
│   └── RecipeActions.tsx       # お気に入り、共有ボタン
├── IngredientSection/
│   ├── IngredientList.tsx      # 材料リスト表示
│   ├── ServingAdjuster.tsx     # 人数調整
│   └── ShoppingListButton.tsx  # 買い物リスト追加
├── CookingSection/
│   ├── CookingSteps.tsx        # 調理手順
│   ├── TimerWidget.tsx         # 調理タイマー
│   └── TipsPanel.tsx           # 調理のコツ
└── ReviewSection/
    ├── ReviewList.tsx          # レビュー一覧
    ├── ReviewForm.tsx          # レビュー投稿フォーム
    └── RatingDistribution.tsx  # 評価分布
```

### MenuPlanPage/components/
```typescript
// 📍 MenuPlanPageでのみ使用
├── PlanningCalendar/
│   ├── CalendarGrid.tsx        # カレンダーグリッド
│   ├── DaySlot.tsx             # 日付スロット
│   └── MealTimeSlot.tsx        # 朝昼夜スロット
├── RecipeSelector/
│   ├── RecipeBrowser.tsx       # レシピ選択ブラウザ
│   ├── QuickAdd.tsx            # クイック追加
│   └── DragPreview.tsx         # ドラッグプレビュー
└── PlanActions/
    ├── WeeklyView.tsx          # 週表示
    ├── ShoppingListGen.tsx     # 買い物リスト生成
    └── PlanExport.tsx          # プラン出力
```

## 移行の判断基準

### グローバルに移動すべき場合
```typescript
// ❌ ページ専用として作ったが...
src/pages/RecipePage/components/RecipeCard.tsx

// 他のページでも使用し始めた場合
// ✅ グローバルに移動
src/components/features/recipe/RecipeCard/
```

### ページ専用のままで良い場合
```typescript
// ✅ そのページの文脈に強く依存
src/pages/RecipeDetailPage/components/CookingSteps.tsx
// → 調理手順は詳細ページ特有の表示方法
```

## 実装時のimport例

```typescript
// RecipeDetailPage.tsx
import { Button, Modal } from '@/components/ui';
import { RecipeRating } from '@/components/features/recipe';
import { Header } from '@/components/layout';
import { 
  RecipeHeader, 
  IngredientList, 
  CookingSteps 
} from './components';

export const RecipeDetailPage: React.FC = () => {
  return (
    <div>
      <Header />
      <RecipeHeader />      {/* ページ専用 */}
      <IngredientList />    {/* ページ専用 */}
      <RecipeRating />      {/* グローバル */}
      <CookingSteps />      {/* ページ専用 */}
      <Modal>               {/* グローバル */}
        <Button>保存</Button> {/* グローバル */}
      </Modal>
    </div>
  );
};
```

## kondatemakerプロジェクトでの適用例

### 現在の構成を活かした移行案
```
src/
├── components/
│   ├── ui/                     # 新規作成
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── LoadingSpinner/     # common.tsxから移動
│   ├── features/               # 既存componentsから移動
│   │   ├── auth/
│   │   │   └── LoginForm/      # login/から移動
│   │   ├── recipe/
│   │   │   ├── RecipeCard/     # recipe/から移動（再利用される場合）
│   │   │   └── RecipeList/     # recipe/から移動（再利用される場合）
│   │   └── ingredient/
│   │       └── IngredientSelector/ # form/から移動
│   └── layout/
│       ├── Header/             # global/から移動
│       └── Footer/
│
└── pages/
    ├── HomePage.tsx
    ├── auth/
    │   └── LoginPage.tsx
    ├── recipe/
    │   └── RecipeDetailPage/
    │       ├── RecipeDetailPage.tsx
    │       ├── components/     # ページ専用コンポーネント
    │       │   ├── CookingSteps.tsx
    │       │   ├── IngredientSection.tsx
    │       │   └── ReviewSection.tsx
    │       └── index.ts
    └── menu-plan/
        └── MenuPlanPage/
            ├── MenuPlanPage.tsx
            ├── components/
            │   ├── PlanningCalendar.tsx
            │   └── RecipeSelector.tsx
            └── index.ts
```

## メリット

1. **明確な責務分離** - 再利用性 vs 専用性
2. **開発効率向上** - 適切な場所にコンポーネントがある
3. **メンテナンス性** - 変更影響範囲が明確
4. **チーム開発** - 他の開発者が理解しやすい
5. **段階的移行** - 既存コードを壊さずに改善可能 