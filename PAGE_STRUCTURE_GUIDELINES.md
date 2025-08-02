# ページコンポーネント構成ガイドライン

## 構成パターンの選択基準

### パターン1: フォルダ構成（推奨条件）
```
pages/
├── ComplexPage/
│   ├── ComplexPage.tsx
│   ├── ComplexPage.module.css
│   ├── components/
│   └── index.ts
```

**以下の条件に当てはまる場合：**
- ページ専用のコンポーネントが3つ以上ある
- 専用のCSSファイルが必要
- ページ専用のhooksやutilsがある
- テストファイルを作成する予定
- チーム開発で複数人が同じページを編集する

### パターン2: ファイル直置き（推奨条件）
```
pages/
├── SimplePage.tsx
└── AnotherSimplePage.tsx
```

**以下の条件に当てはまる場合：**
- 単一のコンポーネントファイルのみ
- 専用のスタイルやロジックが少ない
- 関連ファイルが今後も増える予定がない
- 小規模プロジェクト（10ページ未満）

## プロジェクト規模別推奨構成

### 小規模プロジェクト（1-2人、5-10ページ）
```
pages/
├── HomePage.tsx
├── AboutPage.tsx
├── ContactPage.tsx
├── LoginPage.tsx
└── SignUpPage.tsx
```

### 中規模プロジェクト（3-5人、10-30ページ）
```
pages/
├── HomePage.tsx
├── auth/
│   ├── LoginPage.tsx
│   └── SignUpPage.tsx
├── RecipePage/
│   ├── RecipePage.tsx
│   ├── components/
│   └── index.ts
└── MenuPlanPage/
    ├── MenuPlanPage.tsx
    ├── components/
    └── index.ts
```

### 大規模プロジェクト（5人以上、30ページ以上）
```
pages/
├── HomePage/
│   ├── HomePage.tsx
│   ├── HomePage.module.css
│   ├── components/
│   ├── hooks/
│   └── index.ts
├── auth/
│   ├── LoginPage/
│   ├── SignUpPage/
│   └── ResetPasswordPage/
└── recipe/
    ├── RecipeListPage/
    ├── RecipeDetailPage/
    └── RecipeCreatePage/
```

## 現在のkondatemakerプロジェクトへの推奨

### 現状分析
- 中規模プロジェクト（機能豊富な料理プランニングアプリ）
- 複数の主要機能（レシピ、食材、メニュープラン、買い物、設定）
- TypeScript採用で型安全性重視

### 推奨構成
```
pages/
├── HomePage.tsx                    # シンプル
├── auth/
│   ├── LoginPage.tsx              # シンプル
│   └── ActivationPage.tsx         # シンプル
├── recipe/
│   ├── RecipeListPage/            # 複雑（検索、フィルター等）
│   │   ├── RecipeListPage.tsx
│   │   ├── components/
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeFilter.tsx
│   │   │   └── RecipeSearch.tsx
│   │   └── index.ts
│   └── RecipeDetailPage/          # 複雑（材料管理等）
│       ├── RecipeDetailPage.tsx
│       ├── components/
│       └── index.ts
├── ingredient/
│   └── IngredientPage/            # 複雑（単位変換等）
│       ├── IngredientPage.tsx
│       ├── components/
│       └── index.ts
├── menu-plan/
│   └── MenuPlanPage/              # 複雑（カレンダー、ドラッグ&ドロップ）
│       ├── MenuPlanPage.tsx
│       ├── components/
│       └── index.ts
├── shopping/
│   └── ShoppingListPage.tsx       # 中程度
└── settings/
    ├── UserSettingsPage.tsx       # シンプル
    └── GroupSettingsPage.tsx      # シンプル
```

## 移行の優先順位

1. **まずは現状維持** - 動作するコードを壊さない
2. **新規ページから適用** - 新しく作るページで新構成を試す
3. **複雑なページから移行** - recipe/, menu-plan/ など
4. **シンプルなページは後回し** - login/, settings/ など

## 実装時の注意点

- **一貫性を保つ** - チーム内で構成ルールを統一
- **段階的移行** - 一度にすべて変更せず、徐々に移行
- **index.tsの活用** - importパスの簡潔化を忘れずに
- **命名規則の統一** - Page接尾辞の使用を統一 