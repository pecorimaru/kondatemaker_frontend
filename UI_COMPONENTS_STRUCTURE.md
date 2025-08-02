# UIコンポーネント構成ガイド - kondatemakerプロジェクト

## 推奨構成（機能別分類）

### src/components/ui/

```
src/components/ui/
├── Form/                           # フォーム関連
│   ├── Input/
│   │   ├── Input.tsx              # 基本入力フィールド
│   │   ├── Input.module.css       # 専用スタイル
│   │   └── index.ts               # re-export
│   ├── TextArea/
│   │   ├── TextArea.tsx           # テキストエリア
│   │   └── index.ts
│   ├── Select/
│   │   ├── Select.tsx             # セレクトボックス
│   │   └── index.ts
│   ├── Checkbox/
│   │   ├── Checkbox.tsx           # チェックボックス
│   │   └── index.ts
│   ├── SearchInput/
│   │   ├── SearchInput.tsx        # 検索入力（レシピ検索等）
│   │   └── index.ts
│   ├── NumberInput/
│   │   ├── NumberInput.tsx        # 数値入力（分量等）
│   │   └── index.ts
│   ├── DateInput/
│   │   ├── DateInput.tsx          # 日付入力
│   │   └── index.ts
│   └── index.ts                   # Form配下のre-export
│
├── Button/                         # ボタン関連
│   ├── Button/
│   │   ├── Button.tsx             # 基本ボタン
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── IconButton/
│   │   ├── IconButton.tsx         # アイコンボタン
│   │   └── index.ts
│   ├── SubmitButton/
│   │   ├── SubmitButton.tsx       # 送信ボタン（保存等）
│   │   └── index.ts
│   ├── CancelButton/
│   │   ├── CancelButton.tsx       # キャンセルボタン
│   │   └── index.ts
│   ├── AddButton/
│   │   ├── AddButton.tsx          # 追加ボタン（レシピ追加等）
│   │   └── index.ts
│   └── index.ts
│
├── Layout/                         # レイアウト関連
│   ├── Card/
│   │   ├── Card.tsx               # カード表示（レシピカード等）
│   │   ├── Card.module.css
│   │   └── index.ts
│   ├── Container/
│   │   ├── Container.tsx          # コンテナ
│   │   └── index.ts
│   ├── Grid/
│   │   ├── Grid.tsx               # グリッドレイアウト
│   │   └── index.ts
│   ├── Stack/
│   │   ├── Stack.tsx              # 縦・横スタック
│   │   └── index.ts
│   ├── Divider/
│   │   ├── Divider.tsx            # 区切り線
│   │   └── index.ts
│   └── index.ts
│
├── Navigation/                     # ナビゲーション関連
│   ├── Breadcrumb/
│   │   ├── Breadcrumb.tsx         # パンくずリスト
│   │   └── index.ts
│   ├── Pagination/
│   │   ├── Pagination.tsx         # ページネーション
│   │   └── index.ts
│   ├── Tabs/
│   │   ├── Tabs.tsx               # タブ（設定画面等）
│   │   └── index.ts
│   └── index.ts
│
├── Feedback/                       # フィードバック関連
│   ├── Alert/
│   │   ├── Alert.tsx              # アラート
│   │   └── index.ts
│   ├── Toast/
│   │   ├── Toast.tsx              # トースト通知
│   │   └── index.ts
│   ├── LoadingSpinner/
│   │   ├── LoadingSpinner.tsx     # ローディング表示
│   │   └── index.ts
│   ├── ProgressBar/
│   │   ├── ProgressBar.tsx        # プログレスバー
│   │   └── index.ts
│   ├── ErrorMessage/
│   │   ├── ErrorMessage.tsx       # エラーメッセージ
│   │   └── index.ts
│   ├── SuccessMessage/
│   │   ├── SuccessMessage.tsx     # 成功メッセージ
│   │   └── index.ts
│   └── index.ts
│
├── Overlay/                        # オーバーレイ関連
│   ├── Modal/
│   │   ├── Modal.tsx              # 基本モーダル
│   │   ├── Modal.module.css
│   │   └── index.ts
│   ├── ConfirmModal/
│   │   ├── ConfirmModal.tsx       # 確認モーダル
│   │   └── index.ts
│   ├── Drawer/
│   │   ├── Drawer.tsx             # サイドドロワー
│   │   └── index.ts
│   ├── Popover/
│   │   ├── Popover.tsx            # ポップオーバー
│   │   └── index.ts
│   ├── Tooltip/
│   │   ├── Tooltip.tsx            # ツールチップ
│   │   └── index.ts
│   ├── ContextMenu/
│   │   ├── ContextMenu.tsx        # コンテキストメニュー
│   │   └── index.ts
│   └── index.ts
│
├── DataDisplay/                    # データ表示関連
│   ├── Table/
│   │   ├── Table.tsx              # テーブル
│   │   ├── Table.module.css
│   │   └── index.ts
│   ├── List/
│   │   ├── List.tsx               # リスト表示
│   │   └── index.ts
│   ├── Badge/
│   │   ├── Badge.tsx              # バッジ（ステータス表示等）
│   │   └── index.ts
│   ├── Chip/
│   │   ├── Chip.tsx               # チップ（タグ表示等）
│   │   └── index.ts
│   ├── Avatar/
│   │   ├── Avatar.tsx             # アバター
│   │   └── index.ts
│   ├── Rating/
│   │   ├── Rating.tsx             # 評価表示（星など）
│   │   └── index.ts
│   └── index.ts
│
├── Media/                          # メディア関連
│   ├── Image/
│   │   ├── Image.tsx              # 画像表示
│   │   └── index.ts
│   ├── Icon/
│   │   ├── Icon.tsx               # アイコン
│   │   └── index.ts
│   └── index.ts
│
├── Calendar/                       # カレンダー関連（メニュープラン用）
│   ├── Calendar/
│   │   ├── Calendar.tsx           # カレンダー表示
│   │   ├── Calendar.module.css
│   │   └── index.ts
│   ├── DatePicker/
│   │   ├── DatePicker.tsx         # 日付選択
│   │   └── index.ts
│   └── index.ts
│
└── index.ts                        # 全体のre-export
```

## kondatemaker特有のカテゴリ

### Cooking/ - 料理関連UI
```
├── Cooking/                        # 料理アプリ特有のUI
│   ├── UnitSelector/
│   │   ├── UnitSelector.tsx       # 単位選択（g, ml等）
│   │   └── index.ts
│   ├── IngredientInput/
│   │   ├── IngredientInput.tsx    # 食材入力
│   │   └── index.ts
│   ├── TimerDisplay/
│   │   ├── TimerDisplay.tsx       # 調理タイマー
│   │   └── index.ts
│   ├── NutritionBadge/
│   │   ├── NutritionBadge.tsx     # 栄養情報バッジ
│   │   └── index.ts
│   └── index.ts
```

## 使用例

### メインのindex.ts
```typescript
// src/components/ui/index.ts
export * from './Form';
export * from './Button';
export * from './Layout';
export * from './Navigation';
export * from './Feedback';
export * from './Overlay';
export * from './DataDisplay';
export * from './Media';
export * from './Calendar';
export * from './Cooking';
```

### Form配下のindex.ts
```typescript
// src/components/ui/Form/index.ts
export { Input } from './Input';
export { TextArea } from './TextArea';
export { Select } from './Select';
export { Checkbox } from './Checkbox';
export { SearchInput } from './SearchInput';
export { NumberInput } from './NumberInput';
export { DateInput } from './DateInput';
```

### 実際の使用
```typescript
// ページコンポーネントでの使用例
import { 
  Input, 
  Select, 
  Button, 
  Card, 
  Modal,
  LoadingSpinner,
  UnitSelector 
} from '@/components/ui';

export const RecipeForm = () => {
  return (
    <Card>
      <Input placeholder="レシピ名" />
      <Select options={categories} />
      <UnitSelector />
      <Button>保存</Button>
    </Card>
  );
};
```

## メリット

1. **機能別で直感的** - 目的のコンポーネントを見つけやすい
2. **スケーラブル** - 新しいコンポーネントの配置先が明確
3. **再利用性** - 同じ機能のコンポーネントがまとまっている
4. **保守性** - 関連するコンポーネントの変更が容易
5. **チーム開発** - どこに何があるかが分かりやすい

## 段階的導入

1. **Phase 1**: 基本的なForm, Button, Layout, Feedbackから開始
2. **Phase 2**: Navigation, Overlay, DataDisplayを追加
3. **Phase 3**: 料理アプリ特有のCookingカテゴリを追加
4. **Phase 4**: 高度なUI（Calendar, Media等）を追加 